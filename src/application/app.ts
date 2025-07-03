import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app';
import { buildCreateCommand } from '@application/commands';
import { buildDependencies } from '@core/dependencies';
import { DIContainer } from '@infrastructure/container/types';

class Application {
  constructor(private container: DIContainer) {
    this.container = container;
  }

  async bootstrap() {
    buildDependencies(this.container);

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
