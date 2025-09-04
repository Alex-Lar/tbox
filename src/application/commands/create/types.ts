export type AddOptions = {
    /**
     * Include source directory to template
     * @default false
     */
    base: boolean;
    /**
     * Ignore warnings and errors
     * @default false
     */
    force: boolean;
    /**
     * Copy directories recursively
     * @default false
     */
    recursive: boolean;
    /**
     * Exclude files/directories
     * @default false
     */
    exclude: string[];
};
