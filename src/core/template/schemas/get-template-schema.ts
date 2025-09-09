import { singleton } from 'tsyringe';
import { GetTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isGetTemplateProps(value: unknown): value is GetTemplateProps {
    return (
        typeof (value as GetTemplateProps).templateName === 'string' &&
        typeof (value as GetTemplateProps).destination === 'string'
    );
}

@singleton()
export default class GetTemplateSchema extends TemplateSchema {
    templateName(value: unknown): string {
        return this.parse(TemplateSchema.NAME_SCHEMA, value, 'template-name');
    }

    destination(value: unknown): string {
        return this.parse(TemplateSchema.DESTINATION_SCHEMA, value, 'destination');
    }

    props(value: unknown = {}): GetTemplateProps {
        if (!isGetTemplateProps(value)) throw new Error('Ivalid command arguments');

        return {
            templateName: this.templateName(value.templateName),
            destination: this.destination(value.destination),
        };
    }
}
