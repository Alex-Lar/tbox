import { AddOptions } from '@application/commands/create';

export interface Operation<T = undefined> {
  execute(params: T): Promise<void>;
}

export interface OperationTypes {
  CreateTemplateOperation: symbol;
}

export interface CreateTemplateParams {
  templateName: string;
  sources: string[];
  options: AddOptions;
}
