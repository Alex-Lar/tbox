import { singleton } from 'tsyringe';
import { CreateTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isCreateTemplateProps(value: unknown): value is CreateTemplateProps {
    return (
        Array.isArray((value as CreateTemplateProps).source) &&
        typeof (value as CreateTemplateProps).templateName === 'string' &&
        typeof (value as CreateTemplateProps).options === 'object'
    );
}

@singleton()
export default class CreateTemplateSchema extends TemplateSchema {
    templateName(value: unknown): string {
        return this.parse(TemplateSchema.NAME_SCHEMA, value, 'template-name');
    }

    source(value: unknown): string[] {
        return this.parse(TemplateSchema.SOURCE_SCHEMA, value, 'source');
    }

    exclude(value: unknown = []): string[] {
        return this.parse(TemplateSchema.EXCLUDE_SCHEMA, value, 'exclude');
    }

    force(value: unknown = false): boolean {
        return this.parse(TemplateSchema.BOOLEAN_SCHEMA, value, 'force');
    }

    recursive(value: unknown = false): boolean {
        return this.parse(TemplateSchema.BOOLEAN_SCHEMA, value, 'recursive');
    }

    base(value: unknown = false): boolean {
        return this.parse(TemplateSchema.BOOLEAN_SCHEMA, value, 'base');
    }

    props(value: unknown = {}): CreateTemplateProps {
        if (!isCreateTemplateProps(value)) throw new Error('Invalid command arguments');

        return {
            templateName: this.templateName(value.templateName),
            source: this.source(value.source),
            options: {
                base: this.base(value.options.base),
                exclude: this.exclude(value.options.exclude),
                force: this.force(value.options.force),
                recursive: this.recursive(value.options.recursive),
            },
        };
    }
}
