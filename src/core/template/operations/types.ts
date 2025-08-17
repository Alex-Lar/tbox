import { AddOptions } from '@application/commands/create';

export interface Operation<T = undefined> {
  execute(params: T): Promise<void>;
}

export interface CreateTemplateProps {
  templateName: string;
  source: string[];
  options: AddOptions;
}
