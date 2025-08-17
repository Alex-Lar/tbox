import { AddOptions } from '@application/commands/create';
import Template from '../entities/template';

export interface TemplateRepositoryInterface {
  create(template: Template, options: AddOptions): Promise<void>;
}
