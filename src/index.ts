import { program } from 'commander';
import { createTemplateManager } from './core/template-manager';
import { getAppPaths } from './core/paths';
import { handleError } from './core/utils/error-handler';
import { APP_NAME } from './core/constants/app';
import { createAddCommand } from './commands';

async function main() {
  let paths = getAppPaths(APP_NAME);

  const deps = {
    manager: createTemplateManager({ storage: paths.data }),
  };

  program
    .name(APP_NAME)
    .description(
      'Lightweight CLI for saving and reusing file/directory templates'
    );
  program.addCommand(createAddCommand(deps));
  await program.parseAsync();
}

main().catch(handleError);
