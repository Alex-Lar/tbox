import { DI_TYPES } from '@shared/constants';
import { SimpleFactory } from '@shared/types';

export type DITypesKeys = (typeof DI_TYPES)[keyof typeof DI_TYPES];

export interface DIContainer {
  registerSingleton<T>(key: DITypesKeys, cb: SimpleFactory<T>): void;
  register<T>(key: DITypesKeys, cb: SimpleFactory<T>): void;
  resolveSingleton<T>(key: DITypesKeys): T;
  resolve<T>(key: DITypesKeys): T;
}
