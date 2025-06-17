export class TemplateExistsError extends Error {
  readonly solution: string;

  constructor(templateName: string, solution: string = '') {
    super(`Template '${templateName}' already exists.`);

    this.name = 'TemplateExistsError';
    this.solution = solution;
  }
}
