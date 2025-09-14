export function createMemfsStructureFromPaths(paths: string[]) {
    const obj = {} as { [path: string]: string };

    for (const path of paths) {
        obj[path] = '.';
    }

    return obj;
}
