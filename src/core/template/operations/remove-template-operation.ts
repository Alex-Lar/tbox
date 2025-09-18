import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { Operation, RemoveTemplateProps } from '@core/template/operations/types.ts';
import RemoveTemplateSchema from '../schemas/remove-template-schema';

@injectable()
export default class RemoveTemplateOperation implements Operation<RemoveTemplateProps> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService,
        @inject(RemoveTemplateSchema)
        private schema: RemoveTemplateSchema
    ) {}

    async execute(props: RemoveTemplateProps): Promise<void> {
        await this.service.remove(this.schema.props(props));
    }
}
