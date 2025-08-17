import 'reflect-metadata';
import { Application } from '@application/index';
import { handleError } from '@shared/utils/error-handler';

async function main() {
  try {
    await new Application().bootstrap();
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}
main();
