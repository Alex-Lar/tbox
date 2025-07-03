// Types

export type SimpleFactory<T> = () => T;

// Interfaces

export interface InvalidPathsCollection {
  emptyDirs: string[];
  invalidPaths: string[];
}

export interface PrettyError {
  formatForDisplay(): string;
}
