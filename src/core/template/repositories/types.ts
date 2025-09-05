import { AddOptions } from '@application/commands/create/index.ts';
import Template from '../entities/template.ts';

export interface TemplateRepositoryInterface {
    create(template: Template, options: AddOptions): Promise<void>;
}
