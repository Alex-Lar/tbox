import type { Operation } from '@core/operations';
import { TemplateService } from '@core/services';
import { CreateTemplateParams } from './types';

class CreateTemplateOperation implements Operation<CreateTemplateParams> {
  constructor(private service: TemplateService) {
    this.service = service;
  }

  async execute({
    templateName,
    sources,
    options,
  }: CreateTemplateParams): Promise<void> {
    await this.service.createTemplate({ templateName, sources, options });
  }
}

export default CreateTemplateOperation;
