import 'reflect-metadata';
import { Application } from '@application/index';
import { handleError } from '@shared/utils/error-handler';
import TsyringeContainer from '@infrastructure/container/di-container';

async function main() {
  try {
    const diContainer = new TsyringeContainer().getContainer();
    await new Application(diContainer).bootstrap();
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}
main();
