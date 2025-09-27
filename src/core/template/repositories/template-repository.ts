import { injectable, inject } from 'tsyringe';
import Template from '../entities/template.ts';
import TemplateCopier from '@infrastructure/file-system/copier/template-copier.ts';
import TemplateExistsError from '@shared/errors/template-exists.ts';
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

        if (templateAlreadyExists && !options.force) {
            throw new TemplateExistsError(template.name);
        }

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

    /**
     * @throws {TemplateNotFoundError} if template does not exists
     */
    async delete(templateName: string): Promise<void> {
        const templatePath = join(getStoragePath(), templateName);

        if (!existsSync(templatePath)) {
            throw new TemplateNotFoundError(templateName);
        }

        try {
            this.loader.start(`Deleting ${important(templateName)}...`);

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
            return await readdir(getStoragePath());
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return [] as string[];
            }

            throw new Error('Cannot access storage directory', { cause: error });
        }
    }
}
