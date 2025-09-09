import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { CreateTemplateProps, Operation } from '@core/template/operations/types.ts';
import CreateTemplateSchema from '@core/template/schemas/create-template-schema.ts';
import { ensureStorage } from '@infrastructure/file-system/storage/storage.ts';
import { CreateTemplatePropsPreparer } from '../utils/props-preparer/create-template-props-preparer';

@injectable()
export default class CreateTemplateOperation implements Operation<CreateTemplateProps> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService,
        @inject(CreateTemplateSchema)
        private schema: CreateTemplateSchema
    ) {}

    async execute(props: CreateTemplateProps): Promise<void> {
        ensureStorage();

        const preparedProps = CreateTemplatePropsPreparer.prepare(props);
        await this.service.create(this.schema.props(preparedProps));
    }
}
