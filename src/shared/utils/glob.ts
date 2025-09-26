import globParent from 'glob-parent';

export function getParentPathFromGlobString(path: string): string {
    return globParent(path);
}

export function isGlobPattern(path: string): boolean {
    const globPatternRegex = /[\!\?\*\[\]\{\},]/;
    return globPatternRegex.test(path);
}
