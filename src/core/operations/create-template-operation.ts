import type { Operation } from '@core/operations';
import { TemplateService } from '@core/services';
import { CreateTemplateParams } from './types';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class CreateTemplateOperation
  implements Operation<CreateTemplateParams>
{
  constructor(
    @inject('CreateTemplateService')
    private service: TemplateService
  ) {}

  async execute({
    templateName,
    source,
    options,
  }: CreateTemplateParams): Promise<void> {
    await this.service.createTemplate({
      templateName,
      source,
      options,
    });
  }
}
