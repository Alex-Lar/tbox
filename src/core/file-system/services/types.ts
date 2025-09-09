export interface ScannerOptions {
    exclude?: string[];
}

export interface Scanner<T> {
    scan(source: string | string[], options: ScannerOptions): Promise<T[]>;
}
