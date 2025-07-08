import { z } from 'zod';

const templateNameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid template name');

const sourcesSchema = z
  .array(z.string().min(1))
  .refine((arr) => new Set(arr).size === arr.length, {
    message: 'Duplicate source paths detected',
  });

class TemplateValidator {
  validateName(name: string): string {
    return templateNameSchema.parse(name);
  }

  validateSources(sources: string[]): string[] {
    return sourcesSchema.parse(sources);
  }
}

export default TemplateValidator;
