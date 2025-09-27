import { Command } from 'commander';
import container from '@infrastructure/container/di-container.ts';
import SaveTemplateOperation from '@core/template/operations/save-template-operation';
import { SaveOptions } from './types';

export default function buildSaveCommand() {
    return new Command('save')
        .alias('s')
        .argument('<template-name>', 'unique template identifier')
        .argument('<source...>', 'sources to save as template')
        .option('-f, --force', 'ignore warnings and errors', false)
        .option(
            '-p, --preserve-last-dir',
            'preserve only the final directory name from path patterns (ignored for file sources)',
            false
        )
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
        .action(async (templateName: string, source: string[], options: SaveOptions) => {
            const operation = container.resolve<SaveTemplateOperation>('SaveTemplateOperation');

            await operation.execute({
                templateName,
                source,
                options,
            });
        });
}
