import { injectable, inject } from 'tsyringe';
import Template from '../entities/template.ts';
import TemplateCopier from '@infrastructure/file-system/copier/template-copier.ts';
import { generateTempDirName } from '@shared/utils/random.ts';
import Transaction from '@shared/patterns/transaction.ts';
import { existsSync, readdir, remove, rename } from '@shared/utils/file-system.ts';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path.ts';
import { isNodeError } from '@shared/guards/error.ts';
import { join } from '@shared/utils/path.ts';
import { TemplateNotFoundError } from '@shared/errors/template-not-found.ts';
import type { LoaderService } from '@shared/interfaces/loader-service.ts';
import { important } from '@shared/utils/style.ts';
import { SaveOptions } from '@application/commands/save/types.ts';
import { NoTemplatesFoundError } from '@shared/errors/no-templates-found.ts';
import PrettyAggregateError from '@shared/errors/pretty-aggregate-error.ts';

@injectable()
export default class TemplateRepository {
    constructor(
        @inject('LoaderService')
        private loader: LoaderService
    ) {}

    /**
     * @throws {TemplateExistsError} if the force flag is false and the template already exists.
     */
    async save(template: Template, options: SaveOptions): Promise<void> {
        const templateStorage = template.destination;
        const templateAlreadyExists = existsSync(templateStorage);

        const execute = async () => {
            this.loader.start('Saving...');
            await TemplateCopier.copyTemplate(template, options.force);
        };

        let commit = async () => {
            this.loader.succeed(`Template ${important(template.name)} is created!`);
        };

        let rollback = async () => {
            this.loader.fail('Saving failed!');
            await remove(templateStorage);
        };

        if (templateAlreadyExists && options.force) {
            const oldTemplateTemporaryDirname = generateTempDirName();
            await rename(templateStorage, oldTemplateTemporaryDirname);

            rollback = async () => {
                this.loader.fail('Saving failed!');
                await remove(templateStorage);
                await rename(oldTemplateTemporaryDirname, templateStorage);
            };
            commit = async () => {
                this.loader.succeed(`Template ${important(template.name)} is created!`);
                await remove(oldTemplateTemporaryDirname);
            };
        }

        await new Transaction({ execute, rollback, commit }).run();
    }

    async copy(template: Template): Promise<void> {
        if (!template.entries.length) throw new TemplateNotFoundError(template.name);

        const execute = async () => {
            this.loader.start('Extracting...');
            await TemplateCopier.copyTemplate(template);
        };

        const rollback = async () => {
            this.loader.fail('Extraction failed!');
            await remove(template.destination);
        };

        const commit = async () => {
            this.loader.succeed(
                `Template ${important(template.name)} is extracted to '${template.destination}'!`
            );
        };

        await new Transaction({ execute, rollback, commit }).run();
    }

    async deleteMany(templateNames: string[]): Promise<void> {
        const errors: unknown[] = [];

        for (const name of templateNames) {
            try {
                await this.delete(name);
            } catch (error) {
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            throw new PrettyAggregateError(errors, `Deletion completed with errors`);
        }
    }

    /**
     * @throws {TemplateNotFoundError} if template does not exists
     */
    async delete(templateName: string): Promise<void> {
        this.loader.start(`Deleting '${important(templateName)}'...`);
        const templatePath = join(getStoragePath(), templateName);

        if (!existsSync(templatePath)) {
            this.loader.stop();
            throw new TemplateNotFoundError(templateName);
        }

        try {
            await remove(templatePath);
        } catch (error) {
            this.loader.fail('Deletion failed!');
            throw new Error(`Error occurred while deleting template: ${templateName}`, {
                cause: error,
            });
        }

        this.loader.succeed(`Template ${important(templateName)} has been successfully deleted!`);
    }

    async list(): Promise<string[]> {
        try {
            let entries = await readdir(getStoragePath());

            if (!entries.length) throw new NoTemplatesFoundError();

            return entries;
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                throw new NoTemplatesFoundError();
            }

            if (error instanceof NoTemplatesFoundError) {
                throw error;
            }

            throw new Error('Cannot access storage directory', { cause: error });
        }
    }
}
