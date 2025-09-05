import { matchGlob } from '@shared/utils/pattern-matcher';
import { join, normalize, parse, relative, resolve } from '@shared/utils/path';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { getParentPathFromGlobString } from '@shared/utils/glob';

/**
 * Normalized representation of source path/pattern
 * @property parentPath - Absolute physical path (without glob patterns)
 * @property originalGlob - Original pattern in normalized absolute form
 */
type ResolvedSourcePattern = {
    parentPath: string;
    originalGlob: string;
};

type ResolveOptions = {
    targetPath: string;
    basePath: string;
    includeSourceBase?: boolean;
};

export default class DestinationResolver {
    private resolvedSourcePatterns: ResolvedSourcePattern[] = [];
    private destinationRoot: string;

    constructor(source: string[], destinationRoot?: string) {
        this.resolvedSourcePatterns = this.resolveAndSortSourcePatterns(source);
        this.destinationRoot = destinationRoot ?? getStoragePath();
    }

    /**
     * Resolves destination path for target path based on registered source patterns.
     *
     * Determines which source pattern matches the target path, then constructs
     * destination path by combining:
     * 1. destinationRoot
     * 2. basePath
     * 3. Relative path from pattern's parent directory to target file
     *
     * Patterns are checked in descending order of specificity (longest parentPath first).
     *
     * @example
     * // Given:
     * // - destinationRoot: '/var/storage'
     * // - source: ['/projects/*.ts', '/projects/utils/**']
     *
     * // Without source base:
     * resolve({
     *   targetPath: '/projects/utils/helpers.ts',
     *   basePath: 'backup',
     *   includeSourceBase: false
     * })
     * // -> '/var/storage/backup/helpers.ts'
     *
     * // With source base:
     * resolve({
     *   targetPath: '/projects/utils/helpers.ts',
     *   basePath: 'backup',
     *   includeSourceBase: true,
     * })
     * // -> '/var/storage/backup/utils/helpers.ts'
     */
    resolve({ targetPath, basePath, includeSourceBase = false }: ResolveOptions): string {
        for (const { parentPath, originalGlob } of this.resolvedSourcePatterns) {
            if (!targetPath.startsWith(parentPath)) continue;

            if (matchGlob(targetPath, originalGlob)) {
                const finalBasePath = includeSourceBase
                    ? join(basePath, parse(parentPath).base)
                    : basePath;

                return this.getDestinationPath(finalBasePath, parentPath, targetPath);
            }
        }

        throw new Error(
            `No matching pattern found for "${targetPath}". Tried patterns: ${this.resolvedSourcePatterns.map(p => p.originalGlob).join(', ')}`
        );
    }

    private getDestinationPath(basePath: string, parentPath: string, targetPath: string): string {
        const storageRoot = join(this.destinationRoot, basePath);
        const relativePath = relative(parentPath, targetPath);

        return resolve(storageRoot, relativePath);
    }

    private resolveAndSortSourcePatterns(patterns: string[]): ResolvedSourcePattern[] {
        const currentDir = process.cwd();

        return (
            patterns
                .map(pattern => {
                    const normalizedPattern = normalize(pattern);
                    const parentPath = resolve(
                        currentDir,
                        getParentPathFromGlobString(normalizedPattern)
                    );

                    return {
                        parentPath,
                        originalGlob: resolve(currentDir, normalizedPattern),
                    } as ResolvedSourcePattern;
                })
                // Paths should be sorted in descending order so that the more specific ones are at the top
                .sort((a, b) => b.parentPath.length - a.parentPath.length)
        );
    }
}
