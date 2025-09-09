import { Command } from 'commander';
import container from '@infrastructure/container/di-container.ts';
import GetTemplateOperation from '@core/template/operations/get-template-operation.ts';

export default function buildGetCommand() {
    return new Command('get')
        .argument('<template-name>', 'template name')
        .argument('[destination]', 'destination for template extraction', process.cwd())
        .action(async (templateName: string, destination: string) => {
            const operation = container.resolve<GetTemplateOperation>('GetTemplateOperation');

            await operation.execute({
                templateName,
                destination,
            });
        });
}
