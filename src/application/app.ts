import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app.ts';
import {
    buildCreateCommand,
    buildGetCommand,
    buildListCommand,
    buildRemoveCommand,
} from '@application/commands';

class Application {
    constructor() {}

    async bootstrap() {
        program.name(APP_NAME).description('CLI for saving and reusing file/directory templates');

        program
            .addCommand(buildCreateCommand())
            .addCommand(buildGetCommand())
            .addCommand(buildRemoveCommand())
            .addCommand(buildListCommand());

        await program.parseAsync();
    }
}

export default Application;
