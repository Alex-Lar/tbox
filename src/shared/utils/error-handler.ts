import { isPrettyError } from '@shared/guards/index.ts';
import Logger from '@shared/utils/logger.ts';

export const handleError = (err: unknown): void => {
    if (isPrettyError(err)) {
        Logger.error(err.formatForDisplay());
    } else {
        Logger.error('Unexpected error:', err);
    }
};
