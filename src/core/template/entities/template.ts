import TemplateEntry from './template-entry';

export default class Template {
  constructor(
    private _name: string,
    private _path: string,
    private _entries: TemplateEntry[]
  ) {}

  get name(): string {
    return this._name;
  }

  get path(): string {
    return this._path;
  }

  get entries(): TemplateEntry[] {
    return this._entries;
  }
}
