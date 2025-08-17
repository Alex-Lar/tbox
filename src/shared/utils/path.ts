import nodePath, { ParsedPath } from 'node:path';
import { isWin } from './platform';

const impl = isWin() ? nodePath.win32 : nodePath.posix;

export function dirname(path: string): string {
  return impl.dirname(path);
}

export function relative(from: string, to: string): string {
  return impl.relative(from, to);
}

export function resolve(...paths: string[]): string {
  return impl.resolve(...paths);
}

export function ensureAbsolutePath(path: string): string {
  if (!impl.isAbsolute(path)) path = impl.join(process.cwd(), path);

  return path;
}

export function parse(path: string): ParsedPath {
  return impl.parse(path);
}

export function join(...paths: string[]): string {
  return impl.join(...paths);
}

export function isAbsolute(path: string): boolean {
  return impl.isAbsolute(path);
}

export function normalize(path: string): string {
  return impl.normalize(path);
}
