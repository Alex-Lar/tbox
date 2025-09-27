import { SaveOptions } from '@application/commands/save';

export const mockSaveTemplateProps = (
    props?: Partial<{
        templateName: string;
        source: string[];
        options: Partial<SaveOptions>;
    }>
) => {
    return {
        templateName: props?.templateName ?? 'template-name',
        source: props?.source ?? ['./source'],
        options: {
            preserveLastDir: props?.options?.preserveLastDir ?? false,
            force: props?.options?.force ?? false,
            recursive: props?.options?.recursive ?? false,
            exclude: props?.options?.exclude ?? [],
        },
    };
};

export const mockSaveOptions = (options?: Partial<SaveOptions>) => {
    const defaultOptions = {
        preserveLastDir: false,
        force: false,
        recursive: false,
        exclude: [],
    };

    return Object.assign(defaultOptions, options);
};
