import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app.ts';
import { buildCreateCommand } from '@application/commands/index.ts';

class Application {
    constructor() {}

    async bootstrap() {
        program.name(APP_NAME).description('CLI for saving and reusing file/directory templates');
        program.addCommand(buildCreateCommand());
        await program.parseAsync();
    }
}

export default Application;
