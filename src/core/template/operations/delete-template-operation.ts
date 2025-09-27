import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { Operation, DeleteTemplateProps } from '@core/template/operations/types.ts';
import DeleteTemplateSchema from '../schemas/delete-template-schema';

@injectable()
export default class DeleteTemplateOperation implements Operation<DeleteTemplateProps> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService,
        @inject(DeleteTemplateSchema)
        private schema: DeleteTemplateSchema
    ) {}

    async execute(props: DeleteTemplateProps): Promise<void> {
        await this.service.delete(this.schema.props(props));
    }
}
