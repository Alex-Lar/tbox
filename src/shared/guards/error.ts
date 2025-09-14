import PrettyError from '@shared/interfaces/pretty-error';
import { NodeError } from '@shared/types/error.ts';

export function isPrettyError(error: unknown): error is PrettyError {
    return typeof (error as PrettyError)?.formatForDisplay === 'function';
}

export function isNodeError(value: unknown): value is NodeError {
    return value instanceof Error && typeof (value as NodeError)?.code === 'string';
}
