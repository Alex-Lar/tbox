import { InvalidPathsCollection, PrettyError } from '../types';
import {
  ANGLE_QUOTE_SYMBOL,
  BULLET_SYMBOL,
  ERROR_SYMBOL,
  INFO_SYMBOL,
} from '../constants/symbols';

export class SourceValidationError extends Error implements PrettyError {
  readonly invalidPaths: InvalidPathsCollection;
  readonly solution: string;

  constructor(invalidPaths: InvalidPathsCollection) {
    const totalCount =
      invalidPaths.emptyDirs.length + invalidPaths.invalidPaths.length;
    const message = `Found ${totalCount} invalid source path${totalCount > 1 ? 's' : ''}`;

    super(message);

    this.name = 'SourceValidationError';
    this.invalidPaths = invalidPaths;
    this.solution = this.generateSolution();
  }

  private generateSolution(): string {
    const solutions: string[] = [];
    const { emptyDirs, invalidPaths } = this.invalidPaths;

    if (emptyDirs.length > 0) {
      solutions.push(`  ${BULLET_SYMBOL} Remove empty directories from source`);
      solutions.push(
        `  ${BULLET_SYMBOL} Use --force to skip empty directories`
      );
    }

    if (invalidPaths.length > 0) {
      solutions.push(
        `  ${BULLET_SYMBOL} Verify invalid paths exist and are accessible`
      );
      solutions.push(`  ${BULLET_SYMBOL} Use --force to ignore missing paths`);
    }

    return solutions.join('\n');
  }

  formatForDisplay(): string {
    const parts: string[] = [];
    const { emptyDirs, invalidPaths } = this.invalidPaths;
    const totalCount = emptyDirs.length + invalidPaths.length;

    parts.push(
      `Validation failed: ${totalCount} invalid source path${totalCount > 1 ? 's' : ''}\n`
    );

    if (emptyDirs.length > 0) {
      parts.push(`${ERROR_SYMBOL} Empty directories (${emptyDirs.length}):`);
      parts.push(...emptyDirs.map((p) => `  ${ANGLE_QUOTE_SYMBOL} ${p}`));
    }

    if (invalidPaths.length > 0) {
      if (emptyDirs.length > 0) parts.push('');

      parts.push(`${ERROR_SYMBOL} Invalid paths (${invalidPaths.length}):`);
      parts.push(...invalidPaths.map((p) => `  ${ANGLE_QUOTE_SYMBOL} ${p}`));
    }

    if (this.solution) {
      parts.push(`\n${INFO_SYMBOL} Solutions:\n${this.solution}`);
    }

    return parts.join('\n');
  }
}
