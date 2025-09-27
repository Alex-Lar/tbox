import { singleton } from 'tsyringe';
import { SaveTemplateProps } from '../operations/types';
import TemplateSchema from './template-schema';

function isSaveTemplateProps(value: unknown): value is SaveTemplateProps {
    return (
        Array.isArray((value as SaveTemplateProps).source) &&
        typeof (value as SaveTemplateProps).templateName === 'string' &&
        typeof (value as SaveTemplateProps).options === 'object'
    );
}

@singleton()
export default class SaveTemplateSchema extends TemplateSchema {
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

    preserveLastDir(value: unknown = false): boolean {
        return this.parse(TemplateSchema.BOOLEAN_SCHEMA, value, 'preserveLastDir');
    }

    props(value: unknown = {}): SaveTemplateProps {
        if (!isSaveTemplateProps(value)) throw new Error('Invalid command arguments');

        return {
            templateName: this.templateName(value.templateName),
            source: this.source(value.source),
            options: {
                preserveLastDir: this.preserveLastDir(value.options.preserveLastDir),
                exclude: this.exclude(value.options.exclude),
                force: this.force(value.options.force),
                recursive: this.recursive(value.options.recursive),
            },
        };
    }
}
