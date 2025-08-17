import nodeOs from 'node:os';
import OS_PLATFORMS from '@shared/constants/platforms';

const CURRENT_PLATFORM = nodeOs.platform();

export function isWin(): boolean {
  return CURRENT_PLATFORM === OS_PLATFORMS.WINDOWS;
}

export function isLinux(): boolean {
  return CURRENT_PLATFORM === OS_PLATFORMS.LINUX;
}

export function isDarwin(): boolean {
  return CURRENT_PLATFORM === OS_PLATFORMS.DARWIN;
}
