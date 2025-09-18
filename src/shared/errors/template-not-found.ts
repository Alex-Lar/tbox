import PrettyError from '@shared/interfaces/pretty-error.ts';
import { BULLET_SYMBOL, INFO_SYMBOL } from '../constants/symbols.ts';

export class TemplateNotFoundError extends Error implements PrettyError {
    readonly solution: string;
    readonly templateName: string;

    constructor(templateName: string) {
        super(`Template not found: ${templateName}`);

        this.name = 'TemplateNotFoundError';
        this.templateName = templateName;
        this.solution = this.generateSolution();
    }

    private generateSolution(): string {
        return [`  ${BULLET_SYMBOL} Verify template name with list command`].join('\n');
    }

    formatForDisplay(): string {
        return `${this.message}\n\n${INFO_SYMBOL} Solutions:\n${this.solution}`;
    }
}
