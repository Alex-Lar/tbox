export class SourceValidationError extends Error {
  readonly invalidPaths: string[];
  readonly pathsList: string;
  readonly solution: string;

  constructor(message: string, invalidPaths: string[], solution = '') {
    super(message);

    this.name = 'SourceValidationError';
    this.invalidPaths = invalidPaths;
    this.pathsList = ' - ' + invalidPaths.join('\n - ');
    this.solution = solution;
  }
}
