import { inject, injectable } from 'tsyringe';

import TemplateRepository from '@core/template/repositories/template-repository.ts';
import TemplateFactory from '@core/template/entities/template-factory.ts';
import type { CreateTemplateProps, GetTemplateProps } from '@core/template/operations/types.ts';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory.ts';

import FileSystemScanner from '@core/file-system/services/fs-scanner';

import { getStoragePath } from '@infrastructure/file-system/paths/get-path.ts';
import { join } from '@shared/utils/path';

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
        });

        const storagePath = getStoragePath();

        const templateEntries = this.templateEntryFactory.createMany({
            entries: fileSystemEntries,
            templateName,
            source,
            destination: storagePath,
            options,
        });

        const template = this.templateFactory.create({
            entries: templateEntries,
            source,
            destination: join(storagePath, templateName),
            name: templateName,
        });

        await this.templateRepository.create(template, options);
    }

    async get({ templateName, destination }: GetTemplateProps) {
        const templatePath = join(getStoragePath(), templateName, '**');

        const fileSystemEntries = await this.fileSystemScanner.scan(templatePath);

        const templateEntries = this.templateEntryFactory.createMany({
            entries: fileSystemEntries,
            templateName: '',
            source: [templatePath],
            destination,
        });

        const template = this.templateFactory.create({
            name: templateName,
            entries: templateEntries,
            source: join(getStoragePath(), templateName),
            destination,
        });

        await this.templateRepository.extract(template);
    }
}
