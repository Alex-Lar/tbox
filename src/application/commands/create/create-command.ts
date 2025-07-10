import { Command } from 'commander';
import { AddOptions } from '@application/commands/create';
import { CreateTemplateOperation } from '@core/operations';
import { DIContainer } from '@shared/types/di';

export default function buildCreateCommand(container: DIContainer) {
  return new Command('create')
    .argument('<template-name>', 'unique template name')
    .argument('<source...>', 'source to save as template')
    .option('-f, --force', 'create or update template', false)
    .option('-r, --recursive', 'copy directories recursively', false)
    .option(
      '-x, --exclude <patterns>',
      'Exclude files/directories (comma-separated)',
      (value) => value.split(',').map((p) => p.trim()),
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
    .action(
      async (templateName: string, source: string[], options: AddOptions) => {
        console.log('Starting to resolve operation...');

        const operation = container.resolve<CreateTemplateOperation>(
          'CreateTemplateOperation'
        );

        console.log(operation);
        console.log('Operation is resolved!');

        console.log('\n<> BuildCreateCommand <>');
        console.log('\nname:', templateName);
        console.log('sources:', source);
        console.log('exclude:', options.exclude, '\n');

        await operation.execute({
          templateName,
          source,
          options,
        });
      }
    );
}
