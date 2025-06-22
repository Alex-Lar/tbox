export class FileSystemOperationError extends Error {
  readonly operation: string;
  readonly path: string;
  readonly originalError: Error;
  readonly solution: string;

  constructor(
    operation: string,
    path: string,
    originalError: Error,
    solution = ''
  ) {
    const message = `File system operation failed: ${operation} '${path}'\n`;

    super(message);

    this.name = 'FileSystemOperationError';
    this.operation = operation;
    this.path = path;
    this.originalError = originalError;
    this.solution = solution;
  }
}
