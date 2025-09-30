export interface LoaderService {
    start(text?: string): void;
    succeed(text?: string): void;
    warn(text?: string): void;
    fail(text?: string): void;
    stop(): void;
    update(props: { text?: string; suffixText?: string }): void;
}
