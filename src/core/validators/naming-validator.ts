import { injectable } from 'tsyringe';
import {
  sourceNamesSchema,
  templateNameSchema,
} from './schemas/naming-validator-schema';

@injectable()
export default class NamingValidator {
  validateTemplateName(name: string): string {
    return templateNameSchema.parse(name);
  }

  validateSourceNames(sources: string[]): string[] {
    return sourceNamesSchema.parse(sources);
  }
}
