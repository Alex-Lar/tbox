import { Factory } from '@shared/types/factory';
import TemplateEntry from './template-entry';
import { FileSystemEntry } from '@core/file-system/entries';
import { join, normalize, relative, resolve } from '@shared/utils/path';
import { getParentPathFromGlobString } from '@shared/utils/glob';
import { matchGlob } from '@shared/utils/pattern-matcher';
import { getAppPaths } from '@infrastructure/file-system/paths';
import { APP_NAME } from '@shared/constants';
import { injectable } from 'tsyringe';

interface TemplateEntryProps {
  entry: FileSystemEntry;
  destination: string;
}

/**
 * Normalized representation of source path/pattern
 * @property concretePath - Absolute physical path (without glob patterns)
 * @property pattern - Original pattern in normalized absolute form
 */
type ResolvedSourcePattern = {
  concretePath: string;
  pattern: string;
};

@injectable()
export default class TemplateEntryFactory implements Factory<TemplateEntry, TemplateEntryProps> {
  create({ entry, destination }: TemplateEntryProps): TemplateEntry {
    return new TemplateEntry(entry, destination);
  }

  createMany({
    entries,
    sourcePatterns,
    templateName,
  }: {
    entries: FileSystemEntry[];
    sourcePatterns: string[];
    templateName: string;
  }): TemplateEntry[] {
    const resolvedSourcePatterns = this.resolveAndSortSourcePatterns(sourcePatterns);

    const templateEntries: TemplateEntry[] = [];

    for (const entry of entries) {
      if (!entry.name) continue;

      for (const { concretePath, pattern } of resolvedSourcePatterns) {
        if (!entry.path.startsWith(concretePath)) continue;

        if (matchGlob(entry.path, pattern)) {
          const destination = this.getDestinationPath(entry.path, concretePath, templateName);

          templateEntries.push(this.create({ entry, destination }));

          break;
        }
      }
    }

    return templateEntries;
  }

  private getDestinationPath(
    entryPath: string,
    concretePath: string,
    templateName: string
  ): string {
    const storageRoot = join(getAppPaths(APP_NAME).data, templateName);
    const relativePath = relative(concretePath, entryPath);
    return resolve(storageRoot, relativePath);
  }

  private resolveAndSortSourcePatterns(sourcePatterns: string[]): ResolvedSourcePattern[] {
    const currentDir = process.cwd();

    return (
      sourcePatterns
        .map(path => {
          const normalized = normalize(path);
          const parentPath = getParentPathFromGlobString(normalized);
          const concretePath = resolve(currentDir, parentPath);

          return {
            concretePath,
            pattern: resolve(currentDir, path),
          };
        })
        // Paths should be sorted in descending order so that the more specific ones are at the top
        .sort((a, b) => b.concretePath.length - a.concretePath.length)
    );
  }
}
