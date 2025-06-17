import {
  FileSystemOperationError,
  SourceValidationError,
  TemplateExistsError,
  TemplateNotFoundError,
} from '../errors';
import Logger from './logger';

export const handleError = (err: unknown): never => {
  if (err instanceof FileSystemOperationError) {
    Logger.error('File system error:', err.message);
    Logger.debug('Operation:', err.operation);
    Logger.debug('Path:', err.path);
  } else if (err instanceof TemplateNotFoundError) {
    Logger.error(err.message);

    if (err.solution) {
      Logger.info(err.solution);
    }
  } else if (err instanceof TemplateExistsError) {
    Logger.error(err.message);

    if (err.solution) {
      Logger.info('Solution:\n\t' + err.solution + '\n');
    }
  } else if (err instanceof SourceValidationError) {
    Logger.error(err.message);

    if (err.invalidPaths) {
      Logger.info('Invalid paths:');
      Logger.log(err.pathsList, '\n');
    }
    if (err.solution) Logger.info(err.solution);
  } else {
    Logger.error('Fatal error:', err);
  }
  process.exit(1);
};
