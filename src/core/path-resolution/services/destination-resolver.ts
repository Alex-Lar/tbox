import { matchGlob } from '@shared/utils/pattern-matcher';
import { join, normalize, parse, relative, resolve } from '@shared/utils/path';
import { getParentPathFromGlobString, isGlobPattern } from '@shared/utils/glob';
import { ResolvedSourcePattern, ResolveParams } from './types';

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
     * 2. destinationSubpath
     * 3. Relative path from pattern's parent directory to target file
     *
     * Patterns are checked in descending order of specificity (longest parentPath first).
     *
     * @example
     * // Given:
     * // - source: ['/projects/*.ts', '/projects/utils/**']
     * // - destinationRoot: '/var/storage'
     *
     * // Without source final dir:
     * resolve({
     *   targetPath: '/projects/utils/helpers.ts',
     *   destinationSubpath: 'backup',
     *   preserveLastSourceDir: false
     * })
     * // -> '/var/storage/backup/helpers.ts'
     *
     * // With source final dir:
     * resolve({
     *   targetPath: '/projects/utils/helpers.ts',
     *   destinationSubpath: 'backup',
     *   preserveLastSourceDir: true,
     * })
     * // -> '/var/storage/backup/utils/helpers.ts'
     */
    resolve(targetPath: string, params?: ResolveParams): string {
        const destinationSubpath = params?.destinationSubpath ?? '';
        const preserveLastSourceDir = params?.preserveLastSourceDir ?? false;

        const isExplicitFile = this.isExplicitFileInSource(targetPath);
        const shouldPreserve = preserveLastSourceDir && !isExplicitFile;

        for (const { parentPath, originalGlob } of this.resolvedSourcePatterns) {
            if (!targetPath.startsWith(parentPath)) continue;

            if (matchGlob(targetPath, originalGlob)) {
                const finalSourceDir = shouldPreserve
                    ? join(destinationSubpath, parse(parentPath).base)
                    : destinationSubpath;

                return this.getDestinationPath(finalSourceDir, parentPath, targetPath);
            }
        }

        throw new Error(
            `No matching pattern found for "${targetPath}". Tried patterns: ${this.resolvedSourcePatterns.map(p => p.originalGlob).join(', ')}`
        );
    }

    private isExplicitFileInSource(targetPath: string): boolean {
        return this.resolvedSourcePatterns.some(
            pattern =>
                pattern.originalGlob === targetPath && !this.isGlobPattern(pattern.originalGlob)
        );
    }

    private isGlobPattern(path: string): boolean {
        return isGlobPattern(path);
    }

    private getDestinationPath(subpath: string, parentPath: string, targetPath: string): string {
        const storageRoot = join(this.destinationRoot, subpath);
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
