import { BULLET_SYMBOL, INFO_SYMBOL } from '../constants/symbols';
import { PrettyError } from './types';

export class TemplateExistsError extends Error implements PrettyError {
  readonly solution: string;
  readonly templateName: string;

  constructor(templateName: string) {
    super(`Template already exists: '${templateName}'`);

    this.name = 'TemplateExistsError';
    this.templateName = templateName;
    this.solution = this.generateSolution();
  }

  private generateSolution(): string {
    return [
      `  ${BULLET_SYMBOL} Use --overwrite to replace entire template`,
      `  ${BULLET_SYMBOL} Use --force to overwrite conflicting files`,
    ].join('\n');
  }

  formatForDisplay(): string {
    return `${this.message}\n\n${INFO_SYMBOL} Solution:\n${this.solution}`;
  }
}
