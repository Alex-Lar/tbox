export function isStringArray(value: unknown): value is string[] {
    if (!Array.isArray(value)) return false;

    for (const item of value) {
        if (typeof item !== 'string') {
            return false;
        }
    }

    return true;
}

export function isNonEmptyStringArray(value: unknown): value is string[] {
    return isStringArray(value) && value.length > 0;
}
