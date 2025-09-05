import { injectable } from 'tsyringe';
import TemplateEntry from '@core/template/entities/template-entry.ts';

import type { Factory } from '@shared/types/factory.ts';
import DestinationResolver from '../services/destination-resolver';
import { FileSystemEntry } from '@core/file-system/entities';
import { AddOptions } from '@application/commands/create';

interface TemplateEntryProps {
    entry: FileSystemEntry;
    destination: string;
}

@injectable()
export default class TemplateEntryFactory implements Factory<TemplateEntry, TemplateEntryProps> {
    create({ entry, destination }: TemplateEntryProps): TemplateEntry {
        return new TemplateEntry(entry, destination);
    }

    createMany({
        entries,
        source,
        templateName,
        options,
    }: {
        entries: FileSystemEntry[];
        source: string[];
        templateName: string;
        options: Pick<AddOptions, 'base'>;
    }): TemplateEntry[] {
        const destResolver = new DestinationResolver(source);
        const templateEntries: TemplateEntry[] = [];

        for (const entry of entries) {
            if (!entry.name) continue;

            const destination = destResolver.resolve({
                targetPath: entry.path,
                basePath: templateName,
                includeSourceBase: options.base,
            });

            templateEntries.push(this.create({ entry, destination }));
        }

        return templateEntries;
    }
}
