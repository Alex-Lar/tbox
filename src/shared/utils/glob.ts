import globParent from 'glob-parent';

export function getParentPathFromGlobString(path: string): string {
    return globParent(path);
}
