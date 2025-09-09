import TemplateEntry from './template-entry.ts';

export default class Template {
    constructor(
        private _name: string,
        private _source: string | string[],
        private _destination: string,
        private _entries: TemplateEntry[]
    ) {}

    get name(): string {
        return this._name;
    }

    get source(): string | string[] {
        return this._source;
    }

    get destination(): string {
        return this._destination;
    }

    get entries(): TemplateEntry[] {
        return this._entries;
    }
}
