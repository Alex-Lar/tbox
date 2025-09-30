import { isPrettyError } from '@shared/guards/index.ts';
import Logger from '@shared/utils/logger.ts';

export const handleError = (error: unknown): void => {
    if (isPrettyError(error)) {
        error.print();
    } else {
        Logger.error(error);
    }
};
