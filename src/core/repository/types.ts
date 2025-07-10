import { AddOptions } from '@application/commands/create';

export interface Template {
  name: string;
  source: string[];
}

export interface TemplateMetadata {
  items: string[];
}

export interface TemplateRepositoryInterface {
  create(template: Template, options: AddOptions): Promise<void>;
}
