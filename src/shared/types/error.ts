// Interfaces
export interface PrettyError {
    formatForDisplay(): string;
}

// Types
export type NodeError = Error & {
    code: string;
};
