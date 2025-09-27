import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { SaveTemplateProps, Operation } from '@core/template/operations/types.ts';
import SaveTemplateSchema from '@core/template/schemas/save-template-schema';
import { ensureStorage } from '@infrastructure/file-system/storage/storage.ts';
import { SaveTemplatePropsPreparer } from '../utils/props-preparer/save-template-props-preparer';

@injectable()
export default class SaveTemplateOperation implements Operation<SaveTemplateProps> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService,
        @inject(SaveTemplateSchema)
        private schema: SaveTemplateSchema
    ) {}

    async execute(props: SaveTemplateProps): Promise<void> {
        ensureStorage();

        const preparedProps = SaveTemplatePropsPreparer.prepare(props);
        await this.service.save(this.schema.props(preparedProps));
    }
}
