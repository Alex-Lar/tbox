import PrettyError from '@shared/interfaces/pretty-error.ts';
import { BULLET_SYMBOL } from '../constants/symbols.ts';
import { APP_NAME } from '@shared/constants/app.ts';
import { info } from '@shared/utils/style.ts';
import Logger from '@shared/utils/logger.ts';

export class NoTemplatesFoundError extends Error implements PrettyError {
    readonly solution: string;

    constructor() {
        super(`No templates found`);

        this.name = 'NoTemplatesFoundError';
        this.solution = this.generateSolution();
    }

    private generateSolution(): string {
        return [
            `  ${BULLET_SYMBOL} Run ` + info(`${APP_NAME} save`) + ' to add a new template',
        ].join('\n');
    }

    formatForDisplay(): string {
        return `${this.message}\n\n${info('Solution:')}\n${this.solution}`;
    }

    print(): void {
        Logger.warn(this.formatForDisplay());
    }
}
