import { singleton } from 'tsyringe';
import z, { ZodError } from 'zod';
import { CreateTemplateProps } from '../operations/types';

function isCreateTemplateProps(value: unknown): value is CreateTemplateProps {
    return (
        Array.isArray((value as CreateTemplateProps).source) &&
        typeof (value as CreateTemplateProps).templateName === 'string' &&
        typeof (value as CreateTemplateProps).options === 'object'
    );
}

@singleton()
export default class CreateTemplateSchema {
    private static readonly NAME_SCHEMA = z
        .string()
        .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid template name')
        .min(1);
    private static readonly SOURCE_SCHEMA = z.array(z.string().min(1)).nonempty();
    private static readonly EXCLUDE_SCHEMA = z.array(z.string());
    private static readonly BOOLEAN_SCHEMA = z.boolean();

    templateName(value: unknown): string {
        return this.parse(CreateTemplateSchema.NAME_SCHEMA, value, 'template-name');
    }

    source(value: unknown): string[] {
        return this.parse(CreateTemplateSchema.SOURCE_SCHEMA, value, 'source');
    }

    exclude(value: unknown = []): string[] {
        return this.parse(CreateTemplateSchema.EXCLUDE_SCHEMA, value, 'exclude');
    }

    force(value: unknown = false): boolean {
        return this.parse(CreateTemplateSchema.BOOLEAN_SCHEMA, value, 'force');
    }

    recursive(value: unknown = false): boolean {
        return this.parse(CreateTemplateSchema.BOOLEAN_SCHEMA, value, 'recursive');
    }

    base(value: unknown = false): boolean {
        return this.parse(CreateTemplateSchema.BOOLEAN_SCHEMA, value, 'base');
    }

    props(value: unknown = {}): CreateTemplateProps {
        if (!isCreateTemplateProps(value)) throw new Error('Incorrect CreateTemplateProps object');

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

    private parse<T>(schema: z.ZodType<T>, value: unknown, field: string): T {
        try {
            return schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                throw error;
            }

            throw new Error(`Invalid ${field} value`);
        }
    }
}
