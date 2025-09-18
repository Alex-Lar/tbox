import { singleton } from 'tsyringe';
import { RemoveTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isRemoveTemplateProps(value: unknown): value is RemoveTemplateProps {
    return typeof (value as RemoveTemplateProps).templateName === 'string';
}

@singleton()
export default class RemoveTemplateSchema extends TemplateSchema {
    templateName(value: unknown): string {
        return this.parse(TemplateSchema.NAME_SCHEMA, value, 'template-name');
    }

    props(value: unknown = {}): RemoveTemplateProps {
        if (!isRemoveTemplateProps(value)) throw new Error('Invalid command arguments');

        return {
            templateName: this.templateName(value.templateName),
        };
    }
}
