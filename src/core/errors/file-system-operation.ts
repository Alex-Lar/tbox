export class FileSystemOperationError extends Error {
  readonly operation: string;
  readonly path: string;
  readonly originalError: Error;

  constructor(operation: string, path: string, originalError: Error) {
    const message =
      `File system operation failed: ${operation} '${path}'\n` +
      `Reason: ${originalError.message}`;

    super(message);

    this.name = 'FileSystemOperationError';
    this.operation = operation;
    this.path = path;
    this.originalError = originalError;
  }
}
