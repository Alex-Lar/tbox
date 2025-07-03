import { Command } from 'commander';
import { AddOptions } from '@application/commands/create';
import { DIContainer } from '@infrastructure/container/types';
import { Operation } from '@core/operations';
import { DI_TYPES as DIT } from '@shared/constants';
import { CreateTemplateParams } from '@core/operations/types';

export default function buildCreateCommand(container: DIContainer) {
  return new Command('create')
    .argument('<template-name>', 'unique template name')
    .argument('<files...>', 'sources to save as template')
    .option('-f, --force', 'create or update template', false)
    .option('-r, --recursive', 'copy directories recursively', false)
    .option('-e, --exclude', 'files to exclude', '')
    .action(
      async (templateName: string, sources: string[], options: AddOptions) => {
        const operation = container.resolve<Operation<CreateTemplateParams>>(
          DIT.CreateTemplateOperation
        );

        operation.execute({
          templateName,
          sources,
          options,
        });
      }
    );
}
