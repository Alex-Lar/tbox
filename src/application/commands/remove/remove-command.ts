import { Command } from 'commander';
import container from '@infrastructure/container/di-container.ts';
import RemoveTemplateOperation from '@core/template/operations/remove-template-operation';

export default function buildRemoveCommand() {
    return new Command('remove')
        .argument('<template-name>', 'unique template identifier')
        .action(async (templateName: string) => {
            const operation = container.resolve<RemoveTemplateOperation>('RemoveTemplateOperation');

            await operation.execute({ templateName });
        });
}
