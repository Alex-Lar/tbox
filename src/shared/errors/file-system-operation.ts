import PrettyError from '@shared/interfaces/pretty-error.ts';
import { BULLET_SYMBOL, ANGLE_QUOTE_SYMBOL, ERROR_SYMBOL } from '../constants/symbols.ts';
import Logger from '@shared/utils/logger.ts';

export class FileSystemOperationError extends Error implements PrettyError {
    static readonly OPERATIONS = {
        COPY: 'copy assets',
    } as const;

    readonly operation: string;
    readonly destination: string;
    readonly originalError: Error;
    readonly solution: string;

    constructor(
        operation: keyof typeof FileSystemOperationError.OPERATIONS,
        destination: string,
        originalError: Error
    ) {
        super(`Filesystem operation failed: ${FileSystemOperationError.OPERATIONS[operation]}`);

        this.name = 'FileSystemOperationError';
        this.operation = operation;
        this.destination = destination;
        this.originalError = originalError;
        this.solution = this.generateSolution();
    }

    private generateSolution(): string {
        return [
            `  ${BULLET_SYMBOL} Verify source paths exist and are accessible`,
            `  ${BULLET_SYMBOL} Use --force to skip/overwrite conflicting files`,
        ].join('\n');
    }

    formatForDisplay(): string {
        const parts: string[] = [];

        parts.push(this.message + '\n');

        parts.push(
            `${ERROR_SYMBOL} Original message:\n  ${ANGLE_QUOTE_SYMBOL} ` +
                this.originalError.message +
                '\n'
        );

        parts.push(`Solutions:\n${this.solution}`);

        return parts.join('\n');
    }

    print(): void {
        Logger.log(this.formatForDisplay());
    }
}
