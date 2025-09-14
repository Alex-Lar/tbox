import { inject, injectable } from 'tsyringe';
import TemplateService from '@core/template/services/index.ts';
import { Operation } from '@core/template/operations/types.ts';

@injectable()
export default class ListTemplateOperation implements Operation<undefined> {
    constructor(
        @inject('TemplateService')
        private service: TemplateService
    ) {}

    async execute(): Promise<void> {
        await this.service.list();
    }
}
