import type { AddOptions } from '@application/commands/create';
import { injectable } from 'tsyringe';
import Template from '../entities/template';
import { TemplateRepositoryInterface } from './types';
import TemplateCopier from '@infrastructure/file-system/template/template-copier';
import { TemplateExistsError } from '@shared/errors';
import { generateTempDirName } from '@shared/utils/random';
import Transaction, { TransactionHandler } from '@shared/patterns/transaction';
import { existsSync, remove, rename } from '@shared/utils/file-system';

@injectable()
export default class TemplateRepository implements TemplateRepositoryInterface {
  constructor() {}

  async create(template: Template, options: AddOptions): Promise<void> {
    const storageRoot = template.path;
    const templateAlreadyExists = existsSync(storageRoot);

    if (templateAlreadyExists && !options.force) {
      throw new TemplateExistsError(template.name);
    }

    let commit: TransactionHandler = null;
    let rollback: TransactionHandler = null;
    const execute: TransactionHandler = async () => {
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
