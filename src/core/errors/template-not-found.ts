export class TemplateNotFoundError extends Error {
  readonly solution: string;
  constructor(templateName: string, solution: string = '') {
    super(`Template '${templateName}' not found.`);

    this.name = 'TemplateNotFoundError';
    this.solution = solution;
  }
}
