export interface PlatformPaths {
    /**
     * User-specific configurations. Default unix: `$HOME/.config`
     */
    config: string
    /**
     * User-specific non-essential (cached) data. Default unix: `$HOME/.cache`
     */
    cache: string
    /**
     * User-specific data files. Default unix: `$HOME/.local/share`
     */
    data: string
    /**
     * User-specific state files. Default unix: `$HOME/.local/state`
     */
    state: string
}