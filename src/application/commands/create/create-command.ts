import { Command } from 'commander';
import { AddOptions } from '@application/commands/create/index.ts';
import container from '@infrastructure/container/di-container.ts';
import CreateTemplateOperation from '@core/template/operations/create-template-operation.ts';

export default function buildCreateCommand() {
    return new Command('create')
        .argument('<template-name>', 'unique template name')
        .argument('<source...>', 'source to save as template')
        .option('-f, --force', 'ignore warnings and errors', false)
        .option('-b, --base', 'include source directory to template', false)
        .option('-r, --recursive', 'copy directories recursively (works like glob `dir/**`)', false)
        .option(
            '-x, --exclude <patterns>',
            'Exclude files/directories (comma-separated)',
            value => value.split(',').map(p => p.trim()),
            []
        )
        .addHelpText(
            'after',
            `
Examples for --exclude option:
  node_modules    - exclude all node_modules directories
  *.log           - exclude all log files
  ./config.json   - exclude only the root config.json file
`
        )
        .action(async (templateName: string, source: string[], options: AddOptions) => {
            const operation = container.resolve<CreateTemplateOperation>('CreateTemplateOperation');

            await operation.execute({
                templateName,
                source,
                options,
            });
        });
}
