import { inject, injectable } from 'tsyringe';
import TemplateRepository from '@core/template/repositories/template-repository';
import TemplateFactory from '@core/template/entities/template-factory';
import type { CreateTemplateProps } from '@core/template/operations/types';
import FileSystemScanner from '@core/file-system/scanners/fs-scanner';
import TemplateEntryFactory from '../entities/template-entry-factory';
import { getAppPaths } from '@infrastructure/file-system/paths';
import { APP_NAME } from '@shared/constants';

@injectable()
export default class TemplateService {
  constructor(
    @inject('TemplateRepository')
    private templateRepository: TemplateRepository,
    @inject('FileSystemScanner')
    private fileSystemScanner: FileSystemScanner,
    @inject('TemplateFactory')
    private templateFactory: TemplateFactory,
    @inject('TemplateEntryFactory')
    private templateEntryFactory: TemplateEntryFactory
  ) {}

  async create({ templateName, source, options }: CreateTemplateProps) {
    // scan
    const fileSystemEntries = await this.fileSystemScanner.scan(source, {
      exclude: options.exclude,
      recursive: options.recursive,
    });

    // transform
    const templateEntries = this.templateEntryFactory.createMany({
      entries: fileSystemEntries,
      sourcePatterns: source,
      templateName,
    });

    // aggregate
    const template = this.templateFactory.create({
      entries: templateEntries,
      path: getAppPaths(APP_NAME).data,
      name: templateName,
    });

    // create 
    await this.templateRepository.create(template, options);
  }
}
