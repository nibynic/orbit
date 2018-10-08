import HAMTMap from './utils/hamt';
export default class ImmutableMap<K, V> {
    private _data;
    constructor(base?: ImmutableMap<K, V>);
    readonly size: number;
    get(key: K): V;
    set(key: K, value: V): void;
    remove(key: K): void;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    protected readonly data: HAMTMap;
}
