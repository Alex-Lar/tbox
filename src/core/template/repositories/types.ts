import { AddOptions } from '@application/commands/create/index.ts';
import Template from '../entities/template.ts';

export interface TemplateRepositoryInterface {
    save(template: Template, options: AddOptions): Promise<void>;
}
