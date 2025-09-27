import { container as tsryngeContainerInstance } from 'tsyringe';

import FileSystemEntryFactory from '@core/file-system/entities/fs-entry-factory.ts';
import TemplateEntryFactory from '@core/template/entities/template-entry-factory.ts';
import TemplateFactory from '@core/template/entities/template-factory.ts';

import TemplateRepository from '@core/template/repositories/index.ts';

import TemplateService from '@core/template/services/index.ts';
import FileSystemScanner from '@core/file-system/services/fs-scanner';

import SaveTemplateOperation from '@core/template/operations/save-template-operation';
import GetTemplateOperation from '@core/template/operations/get-template-operation';
import ListTemplateOperation from '@core/template/operations/list-template-operation';
import DeleteTemplateOperation from '@core/template/operations/delete-template-operation';

import SaveTemplateSchema from '@core/template/schemas/save-template-schema';
import GetTemplateSchema from '@core/template/schemas/get-template-schema';
import DeleteTemplateSchema from '@core/template/schemas/delete-template-schema';

import DestinationResolverFactory from '@core/path-resolution/services/destination-resolver-factory';

import { OraLoaderService } from '@infrastructure/loader/ora-loader-service';

import type { DIContainer } from '@shared/types/di.ts';

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
        this.initInfrastructureLoader();
    }

    initCoreTemplate() {
        // Schema
        this._container.registerSingleton(SaveTemplateSchema);
        this._container.registerSingleton(GetTemplateSchema);
        this._container.registerSingleton(DeleteTemplateSchema);

        // Operations
        this._container.register('SaveTemplateOperation', {
            useClass: SaveTemplateOperation,
        });

        this._container.register('GetTemplateOperation', {
            useClass: GetTemplateOperation,
        });

        this._container.register('DeleteTemplateOperation', {
            useClass: DeleteTemplateOperation,
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

    initInfrastructureLoader() {
        // Services
        this._container.register('LoaderService', {
            useClass: OraLoaderService,
        });
    }

    get container(): DIContainer {
        return this._container;
    }
}

const container = new TsyringeContainer().container;

export default container;
