import TemplateEntry from './template-entry.ts';

export interface TemplateProps {
    name: string;
    source: string | string[];
    destination: string;
    entries: TemplateEntry[];
}
