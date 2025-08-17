import { homedir } from 'os';
import { PlatformPaths } from './types';
import { join } from 'path';

export const getUnixPaths = (appName: string): PlatformPaths => {
  const xdgBasePaths = {
    configHome: process.env['XDG_CONFIG_HOME'] || join(homedir(), '.config'),
    cacheHome: process.env['XDG_CACHE_HOME'] || join(homedir(), '.cache'),
    dataHome: process.env['XDG_DATA_HOME'] || join(homedir(), '.local', 'share'),
    stateHome: process.env['XDG_STATE_HOME'] || join(homedir(), '.local', 'state'),
  };

  return {
    config: join(xdgBasePaths.configHome, appName),
    cache: join(xdgBasePaths.cacheHome, appName),
    data: join(xdgBasePaths.dataHome, appName),
    state: join(xdgBasePaths.stateHome, appName),
  };
};
