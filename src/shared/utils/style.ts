import { styleText } from 'node:util';

// Semantic colors
export function success(text: string) {
    return green(text);
}

export function warning(text: string) {
    return yellow(text);
}

export function info(text: string) {
    return blue(text);
}

export function important(text: string) {
    return green(text);
}

export function error(text: string) {
    return red(text);
}

// Colors
export function red(text: string) {
    return styleText('red', text);
}

export function yellow(text: string) {
    return styleText('yellow', text);
}

export function green(text: string) {
    return styleText('green', text);
}

export function cyan(text: string) {
    return styleText('cyan', text);
}

export function blue(text: string) {
    return styleText('blue', text);
}

export function dim(text: string) {
    return styleText('dim', text);
}

export function whiteBright(text: string) {
    return styleText('whiteBright', text);
}
