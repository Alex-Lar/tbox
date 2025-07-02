import { program } from 'commander';
import { createTemplateManager } from './core/template-manager';
import { getAppPaths } from './core/paths';
import { handleError } from './core/utils/error-handler';
import { APP_NAME } from './core/constants/app';
import { createAddCommand } from './commands';
import FileManager from './core/file-manager';

async function main() {
  const paths = getAppPaths(APP_NAME);
  const fileManager = new FileManager();

  const deps = {
    manager: createTemplateManager({ storage: paths.data, fileManager }),
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
