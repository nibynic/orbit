var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit, { pullable, pushable, syncable, Source } from '@orbit/data';
import { assert } from '@orbit/utils';
import transformOperators from './lib/transform-operators';
import { PullOperators } from './lib/pull-operators';
import { supportsLocalStorage } from './lib/local-storage';
/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
let LocalStorageSource = class LocalStorageSource extends Source {
    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    constructor(settings = {}) {
        assert('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        assert('Your browser does not support local storage!', supportsLocalStorage());
        settings.name = settings.name || 'localStorage';
        super(settings);
        this._namespace = settings.namespace || 'orbit';
        this._delimiter = settings.delimiter || '/';
    }
    get namespace() {
        return this._namespace;
    }
    get delimiter() {
        return this._delimiter;
    }
    getKeyForRecord(record) {
        return [this.namespace, record.type, record.id].join(this.delimiter);
    }
    getRecord(record) {
        const key = this.getKeyForRecord(record);
        let result = JSON.parse(Orbit.globals.localStorage.getItem(key));
        if (result && this._keyMap) {
            this._keyMap.pushRecord(result);
        }
        return result;
    }
    putRecord(record) {
        const key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#putRecord', key, JSON.stringify(record));
        if (this._keyMap) {
            this._keyMap.pushRecord(record);
        }
        Orbit.globals.localStorage.setItem(key, JSON.stringify(record));
    }
    removeRecord(record) {
        const key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        Orbit.globals.localStorage.removeItem(key);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    reset() {
        for (let key in Orbit.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                Orbit.globals.localStorage.removeItem(key);
            }
        }
        return Orbit.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _sync(transform) {
        this._applyTransform(transform);
        return Orbit.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _push(transform) {
        this._applyTransform(transform);
        return Orbit.Promise.resolve([transform]);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////
    _pull(query) {
        const operator = PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('LocalStorageSource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query.expression);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Protected
    /////////////////////////////////////////////////////////////////////////////
    _applyTransform(transform) {
        transform.operations.forEach(operation => {
            transformOperators[operation.op](this, operation);
        });
    }
};
LocalStorageSource = __decorate([pullable, pushable, syncable], LocalStorageSource);
export default LocalStorageSource;