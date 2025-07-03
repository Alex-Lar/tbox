import { CreateTemplateOperation } from '@core/operations';
import TemplateRepository from '@core/repository';
import { CreateTemplateService, TemplateValidator } from '@core/services';
import { DIContainer } from '@infrastructure/container/types';
import FileSystemManager from '@infrastructure/filesystem';
import { getAppPaths } from '@infrastructure/paths';
import { APP_NAME, DI_TYPES } from '@shared/constants';

function buildDependencies(container: DIContainer): void {
  const paths = getAppPaths(APP_NAME);

  // FileSystem
  container.registerSingleton(
    DI_TYPES.FileSystemManager,
    () => new FileSystemManager()
  );

  // Repositories
  container.registerSingleton(
    DI_TYPES.TemplateRepository,
    () =>
      new TemplateRepository(
        paths.data,
        container.resolveSingleton(DI_TYPES.FileSystemManager)
      )
  );

  // Services
  container.registerSingleton(
    DI_TYPES.TemplateValidator,
    () => new TemplateValidator()
  );

  container.register(DI_TYPES.CreateTemplateService, () => {
    return new CreateTemplateService(
      container.resolveSingleton(DI_TYPES.TemplateRepository),
      container.resolveSingleton(DI_TYPES.TemplateValidator)
    );
  });

  // Operations
  container.register(
    DI_TYPES.CreateTemplateOperation,
    () =>
      new CreateTemplateOperation(
        container.resolve(DI_TYPES.CreateTemplateService)
      )
  );
}

export default buildDependencies;
