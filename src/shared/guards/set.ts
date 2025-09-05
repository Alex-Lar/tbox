export function isStringSet(value: unknown): value is Set<string> {
    if (!(value instanceof Set)) return false;
    if (value.size === 0) return false;

    for (const item of value) {
        if (typeof item !== 'string') return false;
    }

    return true;
}

export function isNonEmptyStringSet(value: unknown): value is Set<string> {
    return isStringSet(value) && value.size > 0;
}
