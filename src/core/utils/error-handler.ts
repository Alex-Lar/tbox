import {
  FileSystemOperationError,
  SourceValidationError,
  TemplateExistsError,
  TemplateNotFoundError,
} from '../errors';
import Logger from './logger';

export const handleError = (err: unknown): never => {
  if (err instanceof FileSystemOperationError) {
    Logger.error(err.formatForDisplay());
  } else if (err instanceof TemplateNotFoundError) {
    Logger.error(err.formatForDisplay());
  } else if (err instanceof TemplateExistsError) {
    Logger.error(err.formatForDisplay());
  } else if (err instanceof SourceValidationError) {
    Logger.error(err.formatForDisplay());
  } else {
    Logger.error('Fatal error:', err);
  }

  process.exit(1);
};
