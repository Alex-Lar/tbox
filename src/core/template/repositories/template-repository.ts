import { injectable } from 'tsyringe';
import type { AddOptions } from '@application/commands/create/index.ts';
import Template from '../entities/template.ts';
import { TemplateRepositoryInterface } from './types.ts';
import TemplateCopier from '@infrastructure/file-system/template/template-copier.ts';
import TemplateExistsError from '@shared/errors/template-exists.ts';
import { generateTempDirName } from '@shared/utils/random.ts';
import Transaction, { TransactionHandler } from '@shared/patterns/transaction.ts';
import { existsSync, readdir, remove, rename } from '@shared/utils/file-system.ts';
import Logger from '@shared/utils/logger.ts';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path.ts';
import { isNodeError } from '@shared/guards/error.ts';
import { join } from '@shared/utils/path.ts';
import { TemplateNotFoundError } from '@shared/errors/template-not-found.ts';

@injectable()
export default class TemplateRepository implements TemplateRepositoryInterface {
    /**
     * @throws {TemplateExistsError} if the force flag is false and the template already exists.
     */
    async save(template: Template, options: AddOptions): Promise<void> {
        const templateStorage = template.destination;
        const templateAlreadyExists = existsSync(templateStorage);

        if (templateAlreadyExists && !options.force) {
            throw new TemplateExistsError(template.name);
        }

        const execute = async () => {
            await TemplateCopier.copyTemplate(template, options.force);
        };

        let rollback: TransactionHandler = null;
        let commit: TransactionHandler = null;

        if (templateAlreadyExists && options.force) {
            const oldTemplateTemporaryDirname = generateTempDirName();
            await rename(templateStorage, oldTemplateTemporaryDirname);

            rollback = async () => {
                await remove(templateStorage);
                await rename(oldTemplateTemporaryDirname, templateStorage);
            };
            commit = async () => {
                await remove(oldTemplateTemporaryDirname);
            };
        } else {
            rollback = async () => {
                await remove(templateStorage);
            };
        }

        await new Transaction({ execute, rollback, commit }).run();
    }

    async copy(template: Template): Promise<void> {
        const execute = async () => {
            await TemplateCopier.copyTemplate(template);
        };

        const rollback = async () => {
            await remove(template.destination);
        };

        const commit = async () => {
            Logger.success(
                `Template '${template.name}' successfully copied to: ${template.destination}`
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
            await remove(templatePath);
        } catch (error) {
            throw new Error(`Error occurred while deleting template: ${templateName}`, {
                cause: error,
            });
        }
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
