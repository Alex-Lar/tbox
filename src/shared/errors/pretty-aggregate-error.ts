import PrettyError from '@shared/interfaces/pretty-error';
import Logger from '@shared/utils/logger';
import { TemplateNotFoundError } from './template-not-found';
import { ERROR_SYMBOL, WARN_SYMBOL } from '@shared/constants';
import * as s from '@shared/utils/style';

export default class PrettyAggregateError extends AggregateError implements PrettyError {
    private readonly templateNotFoundErrors: TemplateNotFoundError[];
    private readonly criticalErrors: Error[];
    private readonly uniqueSolutions: Set<string>;
    readonly solution: string;

    constructor(errors: unknown[], message: string) {
        super(errors, message);

        this.templateNotFoundErrors = [];
        this.criticalErrors = [];
        this.uniqueSolutions = new Set();

        for (const err of errors) {
            if (err instanceof TemplateNotFoundError) {
                this.templateNotFoundErrors.push(err);
                if (err.solution) this.uniqueSolutions.add(err.solution);
            } else if (err instanceof Error) {
                this.criticalErrors.push(err);
            }
        }

        this.solution = Array.from(this.uniqueSolutions).join('\n');
    }

    print(): void {
        const hasCriticalErrors = this.criticalErrors.length > 0;
        const hasWarnErrors = this.templateNotFoundErrors.length > 0;

        if (hasCriticalErrors) {
            Logger.log('');
            Logger.error(`${this.message}:`);

            this.criticalErrors.forEach(err => {
                const causeSuffix = err.cause ? `: ${err.cause}` : '';
                Logger.log(`  ${ERROR_SYMBOL} ${err.message}${causeSuffix}`);
            });
        }

        if (hasWarnErrors) {
            const templateNames = this.templateNotFoundErrors.map(
                err => `${s.important(err.templateName)}`
            );

            const message = `Template${templateNames.length > 1 ? 's' : ''} not found: ${templateNames.join(', ')}`;

            if (hasCriticalErrors) {
                Logger.log(`  ${WARN_SYMBOL} ${message}`);
                Logger.log('');
            } else {
                Logger.warn(message);
            }
        }

        if (this.solution.length > 0) {
            Logger.log(s.info(`Solution${this.uniqueSolutions.size > 1 ? 's' : ''}:`));
            this.uniqueSolutions.forEach(solution => Logger.log(`${solution}`));
            Logger.log('');
        }
    }
}
