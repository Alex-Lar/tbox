import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app.ts';
import { buildCreateCommand, buildGetCommand } from '@application/commands';

class Application {
    constructor() {}

    async bootstrap() {
        program.name(APP_NAME).description('CLI for saving and reusing file/directory templates');
        program.addCommand(buildCreateCommand());
        program.addCommand(buildGetCommand());

        await program.parseAsync();
    }
}

export default Application;
