import { CreateTemplateParams } from '@core/operations/types';
import type TemplateRepository from '@core/repository';
import type { FileSystemValidator, NamingValidator } from '@core/validators';
import PathFilter from '@shared/utils/path-filter';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class TemplateService {
  constructor(
    @inject('TemplateRepository')
    private repository: TemplateRepository,
    @inject('NamingValidator')
    private namingValidator: NamingValidator,
    @inject('FileSystemValidator')
    private fsValidator: FileSystemValidator
  ) {}

  async createTemplate({
    templateName,
    source,
    options,
  }: CreateTemplateParams) {
    // Semantic validation
    const validatedName =
      this.namingValidator.validateTemplateName(templateName);
    const validatedSourceNames =
      this.namingValidator.validateSourceNames(source);

    // FileSystem validation
    await this.fsValidator.validateSources(validatedSourceNames, options);

    // Apply filter
    const filteredSourceNames = validatedSourceNames.filter(
      (source) => !PathFilter.isExcluded(source, options.exclude)
    );

    if (filteredSourceNames.length === 0 && !options.force) {
      throw new Error(
        'No files to copy after applying exclude filters. ' +
          'Template would be empty. Use --force to override.'
      );
    }

    await this.repository.create(
      {
        name: validatedName,
        source: filteredSourceNames,
      },
      options
    );
  }
}
