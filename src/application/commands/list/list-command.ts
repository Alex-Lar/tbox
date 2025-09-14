import { Command } from 'commander';
import container from '@infrastructure/container/di-container.ts';
import ListTemplateOperation from '@core/template/operations/list-template-operation';

export default function buildListCommand() {
    return new Command('list').action(async () => {
        const operation = container.resolve<ListTemplateOperation>('ListTemplateOperation');

        await operation.execute();
    });
}
