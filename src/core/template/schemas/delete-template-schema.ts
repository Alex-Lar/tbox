import { singleton } from 'tsyringe';
import { DeleteTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isDeleteTemplateProps(value: unknown): value is DeleteTemplateProps {
    return Array.isArray((value as DeleteTemplateProps).templateNames);
}

@singleton()
export default class DeleteTemplateSchema extends TemplateSchema {
    templateNames(value: unknown): string[] {
        return this.parse(TemplateSchema.NAME_ARRAY_SCHEMA, value, 'template-name');
    }

    props(value: unknown = {}): DeleteTemplateProps {
        if (!isDeleteTemplateProps(value)) throw new Error('Invalid command arguments');

        return {
            templateNames: this.templateNames(value.templateNames),
        };
    }
}
