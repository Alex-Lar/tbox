import { PrettyError } from '@shared/types/error';
import { BULLET_SYMBOL, INFO_SYMBOL } from '../constants/symbols';

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
    return [`  ${BULLET_SYMBOL} Use --force to overwrite entire template`].join(
      '\n'
    );
  }

  formatForDisplay(): string {
    return `${this.message}\n\n${INFO_SYMBOL} Solution:\n${this.solution}`;
  }
}
