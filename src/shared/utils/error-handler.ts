import { isPrettyError } from '@shared/guards';
import Logger from '@shared/utils/logger';

export const handleError = (err: unknown): void => {
  if (isPrettyError(err)) {
    Logger.error(err.formatForDisplay());
  } else {
    Logger.error('Unexpected error:', err);
  }
};
