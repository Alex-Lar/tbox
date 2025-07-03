import { platform } from 'os'
import { PlatformPaths } from './types'
import PLATFORM from '../../shared/constants/platforms'
import { getUnixPaths } from './unix-paths'

export default function getAppPaths(appName: string): PlatformPaths {
    const currentPlatform = platform()

    if (currentPlatform === PLATFORM.LINUX || currentPlatform === PLATFORM.DARWIN) {
        return getUnixPaths(appName)
    }

    throw new Error(`Unsupported platform: '${currentPlatform}'`);
}
