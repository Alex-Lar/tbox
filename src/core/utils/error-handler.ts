import {
  FileSystemOperationError,
  SourceValidationError,
  TemplateExistsError,
  TemplateNotFoundError,
} from '../errors';
import Logger from './logger';

export const handleError = (err: unknown): never => {
  if (err instanceof FileSystemOperationError) {
    Logger.error("Error copying files: Duplicate files or empty directories cannot be copied.");
    Logger.info('Solution:\n\t' + err.solution + '\n');

    Logger.debug('Operation:', err.operation);
    Logger.debug('Path:', err.path);
    Logger.debug("Original error:", err.originalError);
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
    Logger.error(err.formatForDisplay());
  } else {
    Logger.error('Fatal error:', err);
  }
  process.exit(1);
};
