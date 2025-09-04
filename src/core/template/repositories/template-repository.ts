import { injectable } from 'tsyringe';
import type { AddOptions } from '@application/commands/create/index.ts';
import Template from '../entities/template.ts';
import { TemplateRepositoryInterface } from './types.ts';
import TemplateCopier from '@infrastructure/file-system/template/template-copier.ts';
import TemplateExistsError from '@shared/errors/template-exists.ts';
import { generateTempDirName } from '@shared/utils/random.ts';
import Transaction, { TransactionHandler } from '@shared/patterns/transaction.ts';
import { existsSync, remove, rename } from '@shared/utils/file-system.ts';
import { join } from '@shared/utils/path.ts';

@injectable()
export default class TemplateRepository implements TemplateRepositoryInterface {
    /**
     * @throws {TemplateExistsError} if the force flag is false and the template already exists.
     */
    async create(template: Template, options: AddOptions): Promise<void> {
        const storageRoot = template.path;
        const templatePath = join(storageRoot, template.name);

        const templateAlreadyExists = existsSync(templatePath);

        if (templateAlreadyExists && !options.force) {
            throw new TemplateExistsError(template.name);
        }

        let commit: TransactionHandler = null;
        let rollback: TransactionHandler = null;

        const execute = async () => {
            await TemplateCopier.copyTemplate(template, options.force);
        };

        if (templateAlreadyExists && options.force) {
            const oldTemplateTemporaryDirname = generateTempDirName();
            await rename(storageRoot, oldTemplateTemporaryDirname);

            commit = async () => {
                await remove(oldTemplateTemporaryDirname);
            };
            rollback = async () => {
                await remove(storageRoot);
                await rename(oldTemplateTemporaryDirname, storageRoot);
            };
        } else {
            rollback = async () => {
                await remove(storageRoot);
            };
        }

        await new Transaction({ execute, commit, rollback }).run();
    }
}
