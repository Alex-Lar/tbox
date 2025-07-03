import { Application } from '@application/index';
import Container from '@infrastructure/container/di-container';
import { handleError } from '@shared/utils/error-handler';

async function main() {
  try {
    const container = new Container();
    await new Application(container).bootstrap();
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}
main();
