import { PrettyError } from 'core/errors/types';
import Logger from './logger';

export const handleError = (err: unknown): never => {
  if (isPrettyError(err)) {
    Logger.error(err.formatForDisplay());
  } else {
    Logger.error('Unexpected error:', err);
  }
  process.exit(1);
};

function isPrettyError(error: unknown): error is PrettyError {
  return typeof (error as PrettyError)?.formatForDisplay === 'function';
}
