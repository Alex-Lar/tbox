import type { Template, TemplateRepositoryInterface } from '@core/repository';
import type { AddOptions } from '@application/commands/create';
import FileSystemManager from '@infrastructure/fs-manager';
import { TemplateExistsError } from '@shared/errors';
import path, { join } from 'path';
import { APP_NAME } from '@shared/constants';
import Logger from '@shared/utils/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class TemplateRepository implements TemplateRepositoryInterface {
  constructor(
    @inject('STORAGE_TOKEN')
    private storage: string,
    @inject(FileSystemManager)
    private fsm: FileSystemManager
  ) {}

  async create(template: Template, options: AddOptions): Promise<void> {
    Logger.start(`Creating template '${template.name}'...`);

    const { files, dirs } = await this.fsm.splitFilesAndDirs(template.source);

    Logger.debug(
      `Split sources into files (${files.length}) and dirs (${dirs.length})`
    );

    const templatePath = path.join(this.storage, template.name);
    const templateDirExists = await this.fsm.isExists(templatePath);
    Logger.debug(
      `Template directory '${templatePath}' exists: ${templateDirExists}`
    );

    if (templateDirExists) {
      await this.handleExistingTemplate(
        template,
        files,
        dirs,
        options,
        templatePath
      );
    } else {
      await this.handleNewTemplate(files, dirs, options, templatePath);
    }
    const templateIsEmpty = await this.fsm.isEmptyDir(templatePath);

    if (templateIsEmpty) {
      if (options.force) {
        Logger.warn('Created empty template (no files copied)');
        return;
      } else {
        // rollback and throw error
        await this.fsm.remove(templatePath);

        throw new Error(
          'No files to copy after applying exclude filters. ' +
            'Template would be empty. Use --force to override.'
        );
      }
    }

    Logger.success(`Template '${template.name}' created successfully.` + '\n');
  }

  private async handleNewTemplate(
    files: string[],
    dirs: string[],
    options: AddOptions,
    templatePath: string
  ) {
    try {
      await this.fsm.ensureDir(templatePath);

      await this.fsm.copyAssets({
        destination: templatePath,
        dirs,
        files,
        options,
      });
    } catch (error) {
      // rollback
      await this.fsm.removeManySecure([templatePath]);
      throw error;
    }
  }

  private async handleExistingTemplate(
    template: Template,
    files: string[],
    dirs: string[],
    options: AddOptions,
    templatePath: string
  ) {
    if (!options.force) {
      throw new TemplateExistsError(template.name);
    }

    Logger.info(`Template '${template.name}' exists, overwriting...`);

    let oldTemplateTmpDir: string = '';
    let newTemplateTmpDir: string = '';
    try {
      oldTemplateTmpDir = await this.fsm.makeTemporaryDirectory(
        join(APP_NAME, 'tmp-old')
      );
      newTemplateTmpDir = await this.fsm.makeTemporaryDirectory(
        join(APP_NAME, 'tmp-new')
      );

      Logger.debug(
        `Temporary directories created: old template at ${oldTemplateTmpDir}, new template at ${newTemplateTmpDir}`
      );
    } catch (error) {
      Logger.debug('Failed to create temporary directories.', error);

      // rollback
      await this.fsm.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      throw error;
    }

    try {
      await this.fsm.cp(templatePath, oldTemplateTmpDir);

      await this.fsm.copyAssets({
        destination: newTemplateTmpDir,
        files,
        dirs,
        options,
      });
      Logger.debug('Copied template files to temporary directories.');
    } catch (error) {
      Logger.debug('Error copying template files.', error);

      // rollback
      await this.fsm.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      throw error;
    }

    try {
      await this.fsm.remove(templatePath);
      await this.fsm.mkdir(templatePath);
      await this.fsm.cp(newTemplateTmpDir, templatePath);
    } catch (error) {
      Logger.debug('Error replacing template, rolling back.', error);

      // rollback
      await this.fsm.removeManySecure([templatePath, newTemplateTmpDir]);
      await this.fsm.mkdir(templatePath);
      await this.fsm.cp(oldTemplateTmpDir, templatePath);
      await this.fsm.remove(oldTemplateTmpDir);

      Logger.debug(
        `Rollback to previous template '${template.name}' completed.`
      );

      throw error;
    }
    try {
      await this.fsm.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      Logger.debug('Cleaned up temporary directories.');
    } catch (error) {
      Logger.warn('Failed to clean up temporary directories.', error);
    }
  }
}
