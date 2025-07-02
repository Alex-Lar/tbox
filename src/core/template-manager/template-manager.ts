import path from 'node:path';
import { CopyData, TemplateData, TemplateManagerConfig } from './types';
import {
  FileSystemOperationError,
  SourceValidationError,
  TemplateExistsError,
  TemplateNotFoundError,
} from '../errors';
import { AddOptions } from 'commands/add';
import FileManager from '../file-manager';

class TemplateManager {
  readonly storage: string;
  private fileManager: FileManager;

  constructor(config: TemplateManagerConfig) {
    const { storage, fileManager } = config;
    this.storage = storage;
    this.fileManager = fileManager;
  }

  /**
   * @throws {TemplateExistsError} if template already exists
   * @throws {TemplateNotFoundError} if template not found
   */
  async createTemplate(data: TemplateData<AddOptions>): Promise<void> {
    const { sources, options } = data;
    const { templateName, overwrite, force, recursive } = options;

    await this.validateSources(sources, { recursive, force });

    const { files, dirs } = await this.fileManager.splitFilesAndDirs(sources);
    const destination = path.join(this.storage, templateName);
    const destinationExists = await this.fileManager.isExists(destination);

    if (destinationExists && !(overwrite || force)) {
      throw new TemplateExistsError(templateName);
    }

    if (destinationExists && overwrite) {
      await this.fileManager.rm(destination);
    } else if (!destinationExists && overwrite && !force) {
      throw new TemplateNotFoundError(templateName);
    }

    try {
      await this.fileManager.mkdir(destination);

      await this.copyTemplateAssets({
        destination,
        dirs,
        files,
        opts: {
          force: force || overwrite,
          recursive,
        },
      });
    } catch (err) {
      if (await this.fileManager.isExists(destination)) {
        await this.fileManager.rm(destination);
      }

      throw err;
    }
  }

  /**
   * @throws {FileSystemOperationError}
   */
  private async copyTemplateAssets(data: CopyData) {
    try {
      const { destination, files = [], dirs = [], opts } = data;
      const { force, recursive } = opts;
      const copyOperations = [];

      if (files.length) {
        copyOperations.push(
          this.fileManager.copyFiles(files, destination, { force })
        );
      }

      if (dirs.length) {
        const dirCopyFn = recursive
          ? this.fileManager.copyDirectories(dirs, destination, {
              force,
              recursive,
            })
          : this.fileManager.copyFilesFromDirectories(dirs, destination, {
              force,
            });
        copyOperations.push(dirCopyFn);
      }

      await Promise.all(copyOperations);
    } catch (err: unknown) {
      throw new FileSystemOperationError(
        'COPY',
        data.destination,
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * @throws {SourceValidationError} if source files are invalid or source dirs are empty
   */
  private async validateSources(
    sources: string[],
    { recursive = false, force = false }
  ): Promise<void> {
    const invalidPaths: string[] = [];
    const emptyDirs: string[] = [];

    for (const source of sources) {
      if (!(await this.fileManager.isExists(source))) {
        invalidPaths.push(source);
        continue;
      }

      if (!(await this.fileManager.isDir(source))) continue;

      const isEmpty = await this.fileManager.isEmptyDir(source);

      if (!recursive && isEmpty) {
        emptyDirs.push(source);
        continue;
      }

      if (recursive && isEmpty) {
        emptyDirs.push(source);
        continue;
      }
    }

    if (invalidPaths.length > 0 || (emptyDirs.length > 0 && !force)) {
      throw new SourceValidationError({
        emptyDirs,
        invalidPaths,
      });
    }
  }
}

export default TemplateManager;
