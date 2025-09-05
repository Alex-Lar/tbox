import { PrettyError } from '@shared/types/error';
import { vi } from 'vitest';

export const mockPrettyError = (msg?: string): PrettyError => ({
    formatForDisplay: vi.fn().mockReturnValue(msg || 'formatted message'),
});

export const mockInvalidPrettyError = () => ({
    formatForDisplay: 'invalid pretty error',
});
