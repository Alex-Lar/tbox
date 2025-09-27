import { singleton } from 'tsyringe';
import { DeleteTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isDeleteTemplateProps(value: unknown): value is DeleteTemplateProps {
    return typeof (value as DeleteTemplateProps).templateName === 'string';
}

@singleton()
export default class DeleteTemplateSchema extends TemplateSchema {
    templateName(value: unknown): string {
        return this.parse(TemplateSchema.NAME_SCHEMA, value, 'template-name');
    }

    props(value: unknown = {}): DeleteTemplateProps {
        if (!isDeleteTemplateProps(value)) throw new Error('Invalid command arguments');

        return {
            templateName: this.templateName(value.templateName),
        };
    }
}
