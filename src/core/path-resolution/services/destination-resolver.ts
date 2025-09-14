import { matchGlob } from '@shared/utils/pattern-matcher';
import { join, normalize, parse, relative, resolve } from '@shared/utils/path';
import { getParentPathFromGlobString } from '@shared/utils/glob';
import { ResolvedSourcePattern, ResolveOptions } from './types';

export default class DestinationResolver {
    private resolvedSourcePatterns: ResolvedSourcePattern[] = [];
    private destinationRoot: string;

    constructor(source: string[], destinationRoot: string) {
        this.resolvedSourcePatterns = this.resolveAndSortSourcePatterns(source);
        this.destinationRoot = destinationRoot;
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
     * // - source: ['/projects/*.ts', '/projects/utils/**']
     * // - destinationRoot: '/var/storage'
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
    resolve({ targetPath, basePath = '.', includeSourceBase = false }: ResolveOptions): string {
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
        return (
            patterns
                .map(pattern => {
                    const normalizedPattern = normalize(pattern);
                    const parentPath = resolve(getParentPathFromGlobString(normalizedPattern));
                    const originalGlob = resolve(normalizedPattern);

                    return {
                        parentPath,
                        originalGlob,
                    } as ResolvedSourcePattern;
                })
                // Paths should be sorted in descending order so that the more specific ones are at the top
                .sort((a, b) => b.parentPath.length - a.parentPath.length)
        );
    }
}

