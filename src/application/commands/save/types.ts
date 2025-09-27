export type SaveOptions = {
    /**
     * Include last directory from source path to template
     * @default false
     */
    preserveLastDir: boolean;
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
