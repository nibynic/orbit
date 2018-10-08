export declare class HAMTMapIterator<T> implements IterableIterator<T> {
    private v;
    constructor(v: any);
    next(): any;
    [Symbol.iterator]: () => any;
}
export interface HAMTMapConfig {
    keyEq?: Function;
    hash?: Function;
}
export default class HAMTMap {
    private _map;
    private _editable;
    private _edit;
    private _config;
    private _root;
    private _size;
    constructor(editable?: number, edit?: number, config?: HAMTMapConfig, root?: {
        __hamt_isEmpty: boolean;
        _modify(edit: any, keyEq: any, shift: any, f: any, h: any, k: any, size: any): any | {
            type: number;
            edit: any;
            hash: any;
            key: any;
            value: any;
            _modify: (edit: any, keyEq: any, shift: any, f: any, h: any, k: any, size: any) => any;
        };
    }, size?: number);
    readonly size: number;
    setTree(newRoot: any, newSize: any): HAMTMap;
    tryGetHash(alt: any, hash: any, key: any): any;
    tryGet(alt: any, key: any): any;
    getHash(hash: any, key: any): any;
    get(key: any, alt?: any): any;
    hasHash(hash: any, key: any): boolean;
    has(key: any): boolean;
    isEmpty: () => boolean;
    modifyHash(hash: any, key: any, f: any): any;
    modify(key: any, f: any): any;
    setHash(hash: any, key: any, value: any): any;
    set(key: any, value: any): any;
    deleteHash(hash: any, key: any): any;
    removeHash(hash: any, key: any): any;
    remove(key: any): any;
    beginMutation(): HAMTMap;
    endMutation(): any;
    mutate(f: any): any;
    entries(): HAMTMapIterator<{}>;
    keys(): HAMTMapIterator<{}>;
    values(): HAMTMapIterator<{}>;
    fold(f: any, z: any): any;
    forEach(f: any): any;
    [Symbol.iterator]: () => HAMTMapIterator<{}>;
}
