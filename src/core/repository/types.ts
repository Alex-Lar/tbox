import { AddOptions } from '@application/commands/create';

export interface Template {
  name: string;
  files: string[];
}

export interface TemplateMetadata {
  items: string[];
}

export interface TemplateRepositoryInterface {
  create(template: Template, options: AddOptions): Promise<void>;
  // update(template: Template, options: UpdateOptions): Promise<void>;
  // remove(templateName: string, options: RemoveOptions): Promise<void>;
  // list(options: ListOptions): Promise<Template[]>;
  // inspect(templateName: string, options: InpsectOptions): Promise<TemplateMetadata>;
}

export interface RepositoryTypes {
  TemplateRepository: symbol;
}
