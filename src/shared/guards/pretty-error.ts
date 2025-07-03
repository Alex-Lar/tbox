import { PrettyError } from '@shared/types';

export function isPrettyError(error: unknown): error is PrettyError {
  return typeof (error as PrettyError)?.formatForDisplay === 'function';
}
