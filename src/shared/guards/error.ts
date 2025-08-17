import { PrettyError } from '@shared/types/error';

export function isPrettyError(error: unknown): error is PrettyError {
  return typeof (error as PrettyError)?.formatForDisplay === 'function';
}
