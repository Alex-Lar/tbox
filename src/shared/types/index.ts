import { OperationTypes } from '@core/operations/types';
import { RepositoryTypes } from '@core/repository/types';
import { ServiceTypes } from '@core/services/types';
import { FileSystemTypes } from '@infrastructure/filesystem/types';

// Types

export type DITypesMap = OperationTypes &
  RepositoryTypes &
  ServiceTypes &
  FileSystemTypes;

export type SimpleFactory<T> = () => T;

// Interfaces

export interface InvalidPathsCollection {
  emptyDirs: string[];
  invalidPaths: string[];
}

export interface PrettyError {
  formatForDisplay(): string;
}
