/**
 * Normalized representation of source path/pattern
 * @property parentPath - Absolute physical path (without glob patterns)
 * @property originalGlob - Original pattern in normalized absolute form
 */
export type ResolvedSourcePattern = {
    parentPath: string;
    originalGlob: string;
};

export type ResolveParams = {
    destinationSubpath?: string;
    preserveLastSourceDir?: boolean;
};
