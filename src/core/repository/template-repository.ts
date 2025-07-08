import type { Template, TemplateRepositoryInterface } from '@core/repository';
import type { AddOptions } from '@application/commands/create';
import type FileSystemManager from '@infrastructure/filesystem';
import { SourceValidationError, TemplateExistsError } from '@shared/errors';
import path, { join } from 'path';
import { APP_NAME } from '@shared/constants';
import Logger from '@shared/utils/logger';

class TemplateRepository implements TemplateRepositoryInterface {
  constructor(
    private storage: string,
    private fs: FileSystemManager
  ) {
    this.storage = storage;
    this.fs = fs;
  }

  async create(template: Template, options: AddOptions): Promise<void> {
    Logger.start(`Creating template '${template.name}'...`);

    await this.validateSources(template.files, options);
    Logger.debug(
      `Sources for template '${template.name}' are successfully validated`
    );

    const { files, dirs } = await this.fs.splitFilesAndDirs(template.files);
    Logger.debug(
      `Split sources into files (${files.length}) and dirs (${dirs.length})`
    );

    const templateDir = path.join(this.storage, template.name);
    const templateDirExists = await this.fs.isExists(templateDir);
    Logger.debug(
      `Template directory '${templateDir}' exists: ${templateDirExists}`
    );

    if (templateDirExists) {
      this.handleExistingTemplate(template, files, dirs, options, templateDir);
    } else {
      this.handleNewTemplate(files, dirs, options, templateDir);
    }
    Logger.success(`Template '${template.name}' created successfully.`);
  }

  private async handleNewTemplate(
    files: string[],
    dirs: string[],
    options: AddOptions,
    templateDir: string
  ) {
    try {
      await this.fs.copyAssets({
        destination: templateDir,
        dirs,
        files,
        options,
      });
    } catch (error) {
      await this.fs.removeManySecure([templateDir]);
      throw error;
    }
  }

  private async handleExistingTemplate(
    template: Template,
    files: string[],
    dirs: string[],
    options: AddOptions,
    templateDir: string
  ) {
    if (!options.force) {
      throw new TemplateExistsError(template.name);
    }

    Logger.info(`Template '${template.name}' exists, overwriting...`);

    let oldTemplateTmpDir: string = '';
    let newTemplateTmpDir: string = '';
    try {
      oldTemplateTmpDir = await this.fs.makeTemporaryDirectory(
        join(APP_NAME, 'tmp-old')
      );
      newTemplateTmpDir = await this.fs.makeTemporaryDirectory(
        join(APP_NAME, 'tmp-new')
      );

      Logger.debug(
        `Temporary directories created: old template at ${oldTemplateTmpDir}, new template at ${newTemplateTmpDir}`
      );
    } catch (error) {
      Logger.debug('Failed to create temporary directories.', error);

      await this.fs.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      throw error;
    }

    try {
      await this.fs.cp(templateDir, oldTemplateTmpDir);

      await this.fs.copyAssets({
        destination: newTemplateTmpDir,
        files,
        dirs,
        options,
      });
      Logger.debug('Copied template files to temporary directories.');
    } catch (error) {
      Logger.debug('Error copying template files.', error);

      await this.fs.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      throw error;
    }

    try {
      await this.fs.remove(templateDir);
      await this.fs.mkdir(templateDir);
      await this.fs.cp(newTemplateTmpDir, templateDir);
    } catch (error) {
      Logger.debug('Error replacing template, rolling back.', error);

      await this.fs.removeManySecure([templateDir, newTemplateTmpDir]);
      await this.fs.mkdir(templateDir);
      await this.fs.cp(oldTemplateTmpDir, templateDir);
      await this.fs.remove(oldTemplateTmpDir);

      Logger.debug(
        `Rollback to previous template '${template.name}' completed.`
      );

      throw error;
    }
    try {
      await this.fs.removeManySecure([oldTemplateTmpDir, newTemplateTmpDir]);
      Logger.debug('Cleaned up temporary directories.');
    } catch (error) {
      Logger.warn('Failed to clean up temporary directories.', error);
    }
  }

  /**
   * @throws {SourceValidationError} if source files are invalid or source dirs are empty
   */
  private async validateSources(
    sources: string[],
    options: Omit<AddOptions, 'exclude'>
  ) {
    const invalidPaths: string[] = [];
    const emptyDirs: string[] = [];

    for (const source of sources) {
      if (!(await this.fs.isExists(source))) {
        invalidPaths.push(source);
        continue;
      }

      if (!(await this.fs.isDir(source))) continue;

      const isEmpty = await this.fs.isEmptyDir(source);

      if (!options.recursive && isEmpty) {
        emptyDirs.push(source);
        continue;
      }

      if (options.recursive && isEmpty) {
        emptyDirs.push(source);
        continue;
      }
    }

    if (invalidPaths.length > 0 || (emptyDirs.length > 0 && !options.force)) {
      throw new SourceValidationError({
        emptyDirs,
        invalidPaths,
      });
    }
  }
}

export default TemplateRepository;
