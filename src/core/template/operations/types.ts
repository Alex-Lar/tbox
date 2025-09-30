import { SaveOptions } from '@application/commands/save';

export interface Operation<T = undefined> {
    execute(params: T): Promise<void>;
}

export type SaveTemplateProps = {
    templateName: string;
    source: string[];
    options: SaveOptions;
};

export type GetTemplateProps = {
    templateName: string;
    destination: string;
};

export type DeleteTemplateProps = {
    templateNames: string[];
};
