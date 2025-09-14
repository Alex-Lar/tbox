export interface Factory<T, K = void> {
    create(props: K): T;
}
