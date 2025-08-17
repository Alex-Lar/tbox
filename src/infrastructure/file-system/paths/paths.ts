import nodeOs from 'os';
import { PlatformPaths } from './types';
import { getUnixPaths } from './unix-paths';
import { isDarwin, isLinux } from '@shared/utils/platform';

const PATHS_CACHE = new Map<string, PlatformPaths>();

export default function getAppPaths(appName: string): PlatformPaths {
  const currentPlatform = nodeOs.platform();

  if (PATHS_CACHE.has(currentPlatform)) {
    return PATHS_CACHE.get(currentPlatform)!;
  }

  let paths: PlatformPaths | null = null;
  if (isLinux() || isDarwin()) {
    paths = getUnixPaths(appName);
  }

  if (paths === null) throw new Error(`Unsupported platform: '${currentPlatform}'`);

  PATHS_CACHE.set(currentPlatform, paths);

  return paths;
}
