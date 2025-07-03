import { CreateTemplateParams } from '@core/operations/types';
import { TemplateRepositoryInterface } from '@core/repository';
import type TemplateValidator from './template-validator';

class CreateTemplateService {
  constructor(
    private repository: TemplateRepositoryInterface,
    private validator: TemplateValidator
  ) {
    this.repository = repository;
    this.validator = validator;
  }

  async createTemplate({
    templateName,
    sources,
    options,
  }: CreateTemplateParams) {
    console.log(templateName);
    console.log(sources);
    console.log(options);
    // implementation

    
  }
}

export default CreateTemplateService;
