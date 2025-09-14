import { container as tsryngeContainerInstance } from 'tsyringe';
import FileSystemEntryFactory from '@core/file-system/entities/fs-entry-factory.ts';
import FileSystemScanner from '@core/file-system/services/fs-scanner';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory.ts';
import TemplateFactory from '@core/template/entities/template-factory.ts';
import CreateTemplateOperation from '@core/template/operations/create-template-operation.ts';
import TemplateRepository from '@core/template/repositories/index.ts';
import CreateTemplateSchema from '@core/template/schemas/create-template-schema.ts';
import TemplateService from '@core/template/services/index.ts';
import type { DIContainer } from '@shared/types/di.ts';
import GetTemplateOperation from '@core/template/operations/get-template-operation';
import GetTemplateSchema from '@core/template/schemas/get-template-schema';
import DestinationResolverFactory from '@core/path-resolution/services/destination-resolver-factory';
import ListTemplateOperation from '@core/template/operations/list-template-operation';

class TsyringeContainer {
    private _container: DIContainer;

    constructor() {
        this._container = tsryngeContainerInstance.createChildContainer();
        this.initContainer();
    }

    initContainer(): void {
        this.initCoreTemplate();
        this.initCoreFileSystem();
        this.initCorePathResolution();
    }

    initCoreTemplate() {
        // Schema
        this._container.registerSingleton(CreateTemplateSchema);
        this._container.registerSingleton(GetTemplateSchema);

        // Operations
        this._container.register('CreateTemplateOperation', {
            useClass: CreateTemplateOperation,
        });

        this._container.register('GetTemplateOperation', {
            useClass: GetTemplateOperation,
        });

        this._container.register('ListTemplateOperation', {
            useClass: ListTemplateOperation,
        });

        // Services
        this._container.register('TemplateService', {
            useClass: TemplateService,
        });

        // Repositories
        this._container.register('TemplateRepository', {
            useClass: TemplateRepository,
        });

        // Factories
        this._container.register('TemplateEntryFactory', {
            useClass: TemplateEntryFactory,
        });

        this._container.register('TemplateFactory', {
            useClass: TemplateFactory,
        });
    }

    initCoreFileSystem() {
        // Factories
        this._container.register('FileSystemEntryFactory', {
            useClass: FileSystemEntryFactory,
        });

        // Services
        this._container.register('FileSystemScanner', {
            useClass: FileSystemScanner,
        });
    }

    initCorePathResolution() {
        // Factories
        this._container.register('DestinationResolverFactory', {
            useClass: DestinationResolverFactory,
        });
    }

    get container(): DIContainer {
        return this._container;
    }
}

const container = new TsyringeContainer().container;

export default container;
