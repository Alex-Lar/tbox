import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app';
import { buildCreateCommand } from '@application/commands';
import { DIContainer } from '@shared/types/di';

class Application {
  constructor(private container: DIContainer) {}

  async bootstrap() {
    program
      .name(APP_NAME)
      .description(
        'Lightweight CLI for saving and reusing file/directory templates'
      );
    program.addCommand(buildCreateCommand(this.container));
    await program.parseAsync();
  }
}

export default Application;
