import { BULLET_SYMBOL, INFO_SYMBOL } from '../constants/symbols';
import { PrettyError } from '../types';

export class TemplateNotFoundError extends Error implements PrettyError {
  readonly solution: string;

  constructor(templateName: string) {
    super(`Template not found: ${templateName}`);

    this.name = 'TemplateNotFoundError';
    this.solution = this.generateSolution();
  }

  private generateSolution(): string {
    return [
      `  ${BULLET_SYMBOL} Omit --overwrite to create new template`,
      `  ${BULLET_SYMBOL} Verify template name with list command`,
      `  ${BULLET_SYMBOL} Use --force to skip template validation`,
    ].join('\n');
  }

  formatForDisplay(): string {
    return `${this.message}\n\n${INFO_SYMBOL} Solutions:\n${this.solution}`;
  }
}
