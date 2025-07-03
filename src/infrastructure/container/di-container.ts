import { SimpleFactory } from '@shared/types';
import { DIContainer, DITypesKeys } from './types';

class Container implements DIContainer {
  private singletons = new Map<DITypesKeys, unknown>();
  private singletonFactories = new Map<DITypesKeys, SimpleFactory<unknown>>();
  private transientFactories = new Map<DITypesKeys, SimpleFactory<unknown>>();

  registerSingleton<T>(key: DITypesKeys, cb: SimpleFactory<T>): void {
    if (this.singletons.has(key) || this.singletonFactories.has(key))
      throw new Error('Container error: duplicate dependency');

    if (typeof cb !== 'function')
      throw new Error('Container error: callback should be a function');

    this.singletonFactories.set(key, cb);
  }

  register<T>(key: DITypesKeys, cb: SimpleFactory<T>): void {
    if (this.transientFactories.has(key))
      throw new Error('Container error: duplicate dependency');

    if (typeof cb !== 'function')
      throw new Error('Container error: callback should be a function');

    this.transientFactories.set(key, cb);
  }

  resolveSingleton<T>(key: DITypesKeys): T {
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as T;
    }

    const factory = this.singletonFactories.get(key);
    if (!factory) throw new Error('Container error: no such dependency!');

    const instance = factory();

    if (instance === null || instance === undefined) {
      throw new Error(
        `Singleton factory for key "${key.toString()}" returned null or undefined`
      );
    }

    this.singletons.set(key, instance);

    return instance as T;
  }

  resolve<T>(key: DITypesKeys): T {
    const factory = this.transientFactories.get(key);

    if (!factory) throw new Error('Container error: no such dependency!');

    const instance = factory();

    if (instance == null || instance == undefined)
      throw new Error('Container error: callback returns null or undefined');

    return instance as T;
  }
}

export default Container;
