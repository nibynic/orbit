import HAMTMap from './utils/hamt';
export default class ImmutableMap {
    constructor(base) {
        if (base) {
            this._data = base.data;
        } else {
            this._data = new HAMTMap();
        }
    }
    get size() {
        return this._data.size;
    }
    get(key) {
        return this._data.get(key);
    }
    set(key, value) {
        this._data = this._data.set(key, value);
    }
    remove(key) {
        this._data = this._data.remove(key);
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    keys() {
        return this._data.keys();
    }
    values() {
        return this._data.values();
    }
    get data() {
        return this._data;
    }
}