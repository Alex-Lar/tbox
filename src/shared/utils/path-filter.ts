import { minimatch } from 'minimatch';

class PathFilter {
  static isExcluded(fullpath: string, excludePatterns: string[]): boolean {
    return excludePatterns.some((pattern) => {
      return minimatch(fullpath, pattern, { matchBase: true });
    });
  }
}

export default PathFilter;
