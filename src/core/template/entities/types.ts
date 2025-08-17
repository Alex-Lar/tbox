import TemplateEntry from './template-entry';

export interface TemplateProps {
  name: string;
  path: string;
  entries: TemplateEntry[];
}
