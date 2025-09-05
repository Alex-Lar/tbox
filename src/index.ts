import 'reflect-metadata';
import { Application } from '@application/index.ts';
import { handleError } from '@shared/utils/error-handler.ts';

async function main() {
    try {
        await new Application().bootstrap();
    } catch (error) {
        handleError(error);
        process.exit(1);
    }
}
main();
