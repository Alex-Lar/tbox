import { homedir } from 'os';
import { PlatformPaths } from './types.ts';
import { resolve } from 'path';

export const getUnixPaths = (appName: string): PlatformPaths => {
    const xdgBasePaths = {
        configHome: process.env['XDG_CONFIG_HOME'] || resolve(homedir(), '.config'),
        cacheHome: process.env['XDG_CACHE_HOME'] || resolve(homedir(), '.cache'),
        dataHome: process.env['XDG_DATA_HOME'] || resolve(homedir(), '.local', 'share'),
        stateHome: process.env['XDG_STATE_HOME'] || resolve(homedir(), '.local', 'state'),
    };

    return {
        config: resolve(xdgBasePaths.configHome, appName),
        cache: resolve(xdgBasePaths.cacheHome, appName),
        data: resolve(xdgBasePaths.dataHome, appName),
        state: resolve(xdgBasePaths.stateHome, appName),
    };
};
