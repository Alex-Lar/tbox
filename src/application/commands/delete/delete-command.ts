import { Command } from 'commander';
import container from '@infrastructure/container/di-container.ts';
import DeleteTemplateOperation from '@core/template/operations/delete-template-operation';

export default function buildDeleteCommand() {
    return new Command('delete')
        .alias('del')
        .argument('<template-name...>', 'unique template identifier')
        .action(async (templateNames: string[]) => {
            const operation = container.resolve<DeleteTemplateOperation>('DeleteTemplateOperation');

            await operation.execute({ templateNames });
        });
}
