import { inject, injectable } from 'tsyringe';

import TemplateRepository from '@core/template/repositories/template-repository.ts';
import TemplateFactory from '@core/template/entities/template-factory.ts';
import type { CreateTemplateProps } from '@core/template/operations/types.ts';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory.ts';

import FileSystemScanner from '@core/file-system/services/fs-scanner';

import { getStoragePath } from '@infrastructure/file-system/paths/get-path.ts';

@injectable()
export default class TemplateService {
    constructor(
        @inject('FileSystemScanner')
        private fileSystemScanner: FileSystemScanner,
        @inject('TemplateRepository')
        private templateRepository: TemplateRepository,
        @inject('TemplateFactory')
        private templateFactory: TemplateFactory,
        @inject('TemplateEntryFactory')
        private templateEntryFactory: TemplateEntryFactory
    ) {}

    async create({ templateName, source, options }: CreateTemplateProps) {
        const fileSystemEntries = await this.fileSystemScanner.scan(source, {
            exclude: options.exclude,
            recursive: options.recursive,
        });

        const templateEntries = this.templateEntryFactory.createMany({
            entries: fileSystemEntries,
            source,
            templateName,
            options,
        });

        const template = this.templateFactory.create({
            entries: templateEntries,
            path: getStoragePath(),
            name: templateName,
        });

        await this.templateRepository.create(template, options);
    }
}
