import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { GetTemplateProps, Operation } from '@core/template/operations/types.ts';
import GetTemplateSchema from '@core/template/schemas/get-template-schema';
import { GetTemplatePropsPreparer } from '../utils/props-preparer/get-template-props-preparer';

@injectable()
export default class GetTemplateOperation implements Operation<GetTemplateProps> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService,
        @inject(GetTemplateSchema)
        private schema: GetTemplateSchema
    ) {}

    async execute(props: GetTemplateProps): Promise<void> {
        const preparedProps = GetTemplatePropsPreparer.prepare(props);

        await this.service.get(this.schema.props(preparedProps));
    }
}
