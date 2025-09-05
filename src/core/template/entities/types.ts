import TemplateEntry from './template-entry.ts';

export interface TemplateProps {
    name: string;
    path: string;
    entries: TemplateEntry[];
}
