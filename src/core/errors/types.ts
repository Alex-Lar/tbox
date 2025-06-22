export interface InvalidPathsCollection {
  emptyDirs: string[];
  invalidPaths: string[];
}

export interface PrettyError {
  formatForDisplay(): string;
}
