import { AddOptions } from '@application/commands/create/index.ts';

export interface Operation<T = undefined> {
    execute(params: T): Promise<void>;
}

export type CreateTemplateProps = {
    templateName: string;
    source: string[];
    options: AddOptions;
};

export type GetTemplateProps = {
    templateName: string;
    destination: string;
};
