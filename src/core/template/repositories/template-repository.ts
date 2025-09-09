import { injectable } from 'tsyringe';
import type { AddOptions } from '@application/commands/create/index.ts';
import Template from '../entities/template.ts';
import { TemplateRepositoryInterface } from './types.ts';
import TemplateCopier from '@infrastructure/file-system/template/template-copier.ts';
import TemplateExistsError from '@shared/errors/template-exists.ts';
import { generateTempDirName } from '@shared/utils/random.ts';
import Transaction, { TransactionHandler } from '@shared/patterns/transaction.ts';
import { existsSync, remove, rename } from '@shared/utils/file-system.ts';
import Logger from '@shared/utils/logger.ts';

@injectable()
export default class TemplateRepository implements TemplateRepositoryInterface {
    /**
     * @throws {TemplateExistsError} if the force flag is false and the template already exists.
     */
    async create(template: Template, options: AddOptions): Promise<void> {
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

    async extract(template: Template): Promise<void> {
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
}
