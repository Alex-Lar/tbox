export interface LoaderService {
    start(text?: string): void;
    succeed(text?: string): void;
    fail(text?: string): void;
    update(props: { text?: string; suffixText?: string }): void;
}
