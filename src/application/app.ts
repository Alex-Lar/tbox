import { program } from 'commander';
import { APP_NAME } from '@shared/constants/app.ts';
import {
    buildSaveCommand,
    buildGetCommand,
    buildListCommand,
    buildDeleteCommand,
} from '@application/commands';

class Application {
    constructor() {}

    async bootstrap() {
        program.name(APP_NAME).description('CLI for saving and reusing file/directory templates');

        program
            .addCommand(buildSaveCommand())
            .addCommand(buildDeleteCommand())
            .addCommand(buildGetCommand())
            .addCommand(buildListCommand());

        await program.parseAsync();
    }
}

export default Application;
