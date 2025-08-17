import { Factory } from '@shared/types/factory';
import { TemplateProps } from './types';
import Template from './template';
import { injectable } from 'tsyringe';

@injectable()
export default class TemplateFactory implements Factory<Template, TemplateProps> {
  create(props: TemplateProps): Template {
    return new Template(props.name, props.path, props.entries);
  }
}
