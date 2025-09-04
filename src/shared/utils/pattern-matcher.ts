import { minimatch } from 'minimatch';

export function matchGlob(path: string, pattern: string): boolean {
    return minimatch(path, pattern, {
        dot: true,
    });
}
