export const mockCreateTemplateProps = (
    props?: Partial<{
        templateName: string;
        source: string[];
        options: Partial<{ base: boolean; force: boolean; recursive: boolean; exclude: string[] }>;
    }>
) => {
    return {
        templateName: props?.templateName ?? 'template-name',
        source: props?.source ?? ['./source'],
        options: {
            base: props?.options?.base ?? false,
            force: props?.options?.force ?? false,
            recursive: props?.options?.recursive ?? false,
            exclude: props?.options?.exclude ?? [],
        },
    };
};
