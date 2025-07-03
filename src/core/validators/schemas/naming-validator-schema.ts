import { z } from 'zod';

export const templateNameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid template name');

export const sourceNamesSchema = z
  .array(z.string().min(1))
  .min(1)
  .refine((arr) => new Set(arr).size === arr.length, {
    message: 'Duplicate source paths detected',
  });
