import { AddOptions } from '@application/commands/create';
import FileSystemManager from '@infrastructure/fs-manager';
import { SourceValidationError } from '@shared/errors';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class FileSystemValidator {
  constructor(
    @inject(FileSystemManager)
    private fsm: FileSystemManager
  ) {}

  /**
   * @throws {SourceValidationError} if source files are invalid or source dirs are empty
   */
  async validateSources(
    sources: string[],
    options: Omit<AddOptions, 'exclude'>
  ) {
    const invalidPaths: string[] = [];
    const emptyDirs: string[] = [];

    for (const source of sources) {
      if (!(await this.fsm.isExists(source))) {
        invalidPaths.push(source);
        continue;
      }

      if (!(await this.fsm.isDir(source))) continue;

      const isEmpty = await this.fsm.isEmptyDir(source);

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
