import FileSystemEntryFactory from '@core/file-system/entries/fs-entry-factory';
import FileSystemScanner from '@core/file-system/scanners/fs-scanner';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory';
import TemplateFactory from '@core/template/entities/template-factory';
import CreateTemplateOperation from '@core/template/operations/create-template-operation';
import TemplateRepository from '@core/template/repositories';
import TemplateService from '@core/template/services';
import { DIContainer } from '@shared/types/di';
import tsrynge from 'tsyringe';

export default class TsyringeContainer {
  private _container: DIContainer;

  constructor() {
    this._container = tsrynge.container.createChildContainer();
    this.configureContainer();
  }

  configureContainer(): void {
    this.configureCoreFileSystem();
    this.configureCoreTemplate();
  }

  configureCoreFileSystem() {
    this._container.registerSingleton(FileSystemEntryFactory);

    this._container.register('FileSystemScanner', {
      useClass: FileSystemScanner,
    });
  }

  configureCoreTemplate() {
    this._container.register('CreateTemplateOperation', {
      useClass: CreateTemplateOperation,
    });

    this._container.register('TemplateRepository', {
      useClass: TemplateRepository,
    });

    this._container.register('TemplateService', {
      useClass: TemplateService,
    });

    this._container.register('TemplateEntryFactory', {
      useClass: TemplateEntryFactory,
    });

    this._container.register('TemplateFactory', {
      useClass: TemplateFactory,
    });
  }

  get container(): DIContainer {
    return this._container;
  }
}

const tsryngeContainer = new TsyringeContainer();
const container = tsryngeContainer.container;

export { container };
