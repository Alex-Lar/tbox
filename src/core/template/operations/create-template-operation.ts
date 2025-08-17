import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services';
import {
  CreateTemplateProps,
  Operation,
} from '@core/template/operations/types';
import CreateTemplateSchema from '../schemas/create-template-schema';

@injectable()
export default class CreateTemplateOperation
  implements Operation<CreateTemplateProps>
{
  constructor(
    @inject('TemplateService')
    private service: TemplateService,
    @inject('CreateTemplateSchema')
    private schema: CreateTemplateSchema
  ) {}

  async execute({
    templateName,
    source,
    options,
  }: CreateTemplateProps): Promise<void> {
    await this.service.create({
      templateName: this.schema.templateName(templateName),
      source: this.schema.source(source),
      options: {
        exclude: this.schema.exclude(options.exclude),
        force: this.schema.force(options.force),
        recursive: this.schema.recursive(options.recursive),
      },
    });
  }
}
