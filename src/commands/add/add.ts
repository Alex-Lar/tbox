import { Command } from 'commander';
import { AddOptions } from './types';
import { CommandDependencies } from '../../core/types/deps.interfaces';

export default function createAddCommand({ manager }: CommandDependencies) {
  return new Command('add')
    .argument('<sources...>', 'files/dirs to save as template')
    .option('-t, --template-name <name>', 'unique template name')
    .option('-f, --force', 'create or update template', false)
    .option('-o, --overwrite', 'overwrite existing template', false)
    .option('-r, --recursive', 'copy directories recursively', false)
    .action(async (sources: string[], options: AddOptions) => {
      if (!options.templateName)
        throw new Error("missing required option '--template-name'");
      if (!sources || !sources.length)
        throw new Error("missing required argument 'sources'");

      await manager.createTemplate({
        sources,
        options,
      });
    });
}
