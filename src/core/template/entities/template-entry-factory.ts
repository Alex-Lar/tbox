import { inject, injectable } from 'tsyringe';
import TemplateEntry from '@core/template/entities/template-entry.ts';

import type { Factory } from '@shared/interfaces/factory';
import { FileSystemEntry } from '@core/file-system/entities';
import { AddOptions } from '@application/commands/create';
import DestinationResolverFactory from '@core/path-resolution/services/destination-resolver-factory';

interface TemplateEntryProps {
    entry: FileSystemEntry;
    destination: string;
}

@injectable()
export default class TemplateEntryFactory implements Factory<TemplateEntry, TemplateEntryProps> {
    constructor(
        @inject('DestinationResolverFactory')
        private destResolverFactory: DestinationResolverFactory
    ) {}

    create({ entry, destination }: TemplateEntryProps): TemplateEntry {
        return new TemplateEntry(entry, destination);
    }

    createMany({
        entries,
        source,
        destination,
        templateName,
        options,
    }: {
        entries: FileSystemEntry[];
        source: string[];
        destination: string;
        templateName?: string;
        options?: Pick<AddOptions, 'preserveLastDir'>;
    }): TemplateEntry[] {
        const destinationResolver = this.destResolverFactory.create({ source, destination });
        const templateEntries: TemplateEntry[] = [];

        for (const entry of entries) {
            if (!entry.name) continue;

            const entyDest = destinationResolver.resolve({
                targetPath: entry.path,
                destinationSubpath: templateName ?? '',
                preserveLastSourceDir: entry.isFile() ? false : (options?.preserveLastDir ?? false),
            });

            templateEntries.push(this.create({ entry, destination: entyDest }));
        }

        return templateEntries;
    }
}
