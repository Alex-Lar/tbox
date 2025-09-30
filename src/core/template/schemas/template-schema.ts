import z, { ZodError } from 'zod';

export default abstract class TemplateSchema {
    protected static readonly NAME_SCHEMA = z
        .string()
        .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid template name')
        .min(1);
    protected static readonly NAME_ARRAY_SCHEMA = z.array(this.NAME_SCHEMA).nonempty();
    protected static readonly SOURCE_SCHEMA = z.array(z.string().min(1)).nonempty();
    protected static readonly DESTINATION_SCHEMA = z.string().min(1);
    protected static readonly EXCLUDE_SCHEMA = z.array(z.string());
    protected static readonly BOOLEAN_SCHEMA = z.boolean();

    protected parse<T>(schema: z.ZodType<T>, value: unknown, field: string): T {
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
