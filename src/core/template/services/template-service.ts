import { inject, injectable } from 'tsyringe';

import TemplateRepository from '@core/template/repositories/template-repository.ts';
import TemplateFactory from '@core/template/entities/template-factory.ts';
import type {
    SaveTemplateProps,
    GetTemplateProps,
    DeleteTemplateProps,
} from '@core/template/operations/types.ts';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory.ts';

import FileSystemScanner from '@core/file-system/services/fs-scanner';

import { getStoragePath } from '@infrastructure/file-system/paths/get-path.ts';
import { join } from '@shared/utils/path';
import { dim, important } from '@shared/utils/style';
import { TREE_BRANCH, TREE_END } from '@shared/constants';
import { existsSync } from '@shared/utils/file-system';
import TemplateExistsError from '@shared/errors/template-exists';

@injectable()
export default class TemplateService {
    constructor(
        @inject('FileSystemScanner')
        private fileSystemScanner: FileSystemScanner,
        @inject('TemplateRepository')
        private repo: TemplateRepository,
        @inject('TemplateFactory')
        private templateFactory: TemplateFactory,
        @inject('TemplateEntryFactory')
        private templateEntryFactory: TemplateEntryFactory
    ) {}

    async save({ templateName, source, options }: SaveTemplateProps) {
        const templatePath = join(getStoragePath(), templateName);

        if (existsSync(templatePath) && !options.force) {
            throw new TemplateExistsError(templateName);
        }

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

        await this.repo.save(template, options);
    }

    async get({ templateName, destination }: GetTemplateProps) {
        const templatePath = join(getStoragePath(), templateName, '**');

        const fileSystemEntries = await this.fileSystemScanner.scan(templatePath);

        const templateEntries = this.templateEntryFactory.createMany({
            entries: fileSystemEntries,
            source: [templatePath],
            destination,
        });

        const template = this.templateFactory.create({
            name: templateName,
            entries: templateEntries,
            source: join(getStoragePath(), templateName),
            destination,
        });

        await this.repo.copy(template);
    }

    async delete({ templateNames }: DeleteTemplateProps): Promise<void> {
        await this.repo.deleteMany(templateNames);
    }

    async list(): Promise<void> {
        const templateNames = await this.repo.list();

        console.log(dim(`Total templates: ${templateNames.length}`));

        const maxLength = Math.max(...templateNames.map(name => name.length));
        templateNames.forEach((name, index) => {
            const paddedName = name.padEnd(maxLength + 2, ' ');
            const isLast = index === templateNames.length - 1;
            const prefix = isLast ? TREE_END : TREE_BRANCH;

            console.log(`${dim(prefix)} ${important(paddedName)}`);
        });
    }
}
