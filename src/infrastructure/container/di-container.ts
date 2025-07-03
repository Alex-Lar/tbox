import { CreateTemplateOperation } from '@core/operations';
import TemplateRepository from '@core/repository';
import { TemplateService } from '@core/services';
import { FileSystemValidator, NamingValidator } from '@core/validators';
import FileSystemManager from '@infrastructure/fs-manager';
import { getAppPaths } from '@infrastructure/paths';
import { APP_NAME } from '@shared/constants';
import { DIContainer } from '@shared/types/di';
import { container } from 'tsyringe';

export default class TsyringeContainer {
  private container: DIContainer;

  constructor() {
    this.container = container.createChildContainer();
    this.configureDependencies();
  }

  private configureDependencies(): void {
    // Infrastracture
    this.container.registerSingleton(FileSystemManager);
    this.container.registerInstance(
      'STORAGE_TOKEN',
      getAppPaths(APP_NAME).data
    );

    // Operations
    this.container.register('CreateTemplateOperation', {
      useClass: CreateTemplateOperation,
    });

    // Repository
    this.container.register('TemplateRepository', {
      useClass: TemplateRepository,
    });

    // Services
    this.container.register('TemplateService', {
      useClass: TemplateService,
    });

    // Validators
    this.container.register('FileSystemValidator', {
      useClass: FileSystemValidator,
    });

    this.container.register('NamingValidator', { useClass: NamingValidator });
  }

  getContainer(): DIContainer {
    return this.container;
  }
}
