import { DITypesMap } from '@shared/types';

export const DI_TYPES: DITypesMap = {
  CreateTemplateOperation: Symbol('Create'),
  FileSystemManager: Symbol('FileSystemManager'),
  TemplateRepository: Symbol('TemplateRepository'),
  CreateTemplateService: Symbol('TemplateService'),
  TemplateValidator: Symbol('TemplateValidator'),
} as const;

