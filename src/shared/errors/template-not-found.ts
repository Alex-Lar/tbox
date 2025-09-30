import PrettyError from '@shared/interfaces/pretty-error.ts';
import { BULLET_SYMBOL } from '../constants/symbols.ts';
import Logger from '@shared/utils/logger.ts';
import { important, info } from '@shared/utils/style.ts';

export class TemplateNotFoundError extends Error implements PrettyError {
    readonly solution: string;
    readonly templateName: string;

    constructor(templateName: string) {
        super(`Template not found: ${important(templateName)}`);

        this.name = 'TemplateNotFoundError';
        this.templateName = templateName;
        this.solution = this.generateSolution();
    }

    private generateSolution(): string {
        return [`  ${BULLET_SYMBOL} Verify template name with ${info('list')} command`].join('\n');
    }

    formatForDisplay(): string {
        return `${this.message}\n\n${info('Solution:')}\n${this.solution}`;
    }

    print(): void {
        Logger.warn(this.formatForDisplay());
    }
}
