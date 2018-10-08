var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit from './main';
import { evented, settleInSeries, TaskQueue, Log } from '@orbit/core';
import QueryBuilder from './query-builder';
import TransformBuilder from './transform-builder';
import { assert } from '@orbit/utils';
/**
 Base class for sources.

 @class Source
 @namespace Orbit
 @param {Object} [settings] - settings for source
 @param {String} [settings.name] - Name for source
 @param {Schema} [settings.schema] - Schema for source
 @constructor
 */
let Source = class Source {
    constructor(settings = {}) {
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        const name = this._name = settings.name;
        const bucket = this._bucket = settings.bucket;
        this._queryBuilder = settings.queryBuilder;
        this._transformBuilder = settings.transformBuilder;
        const requestQueueSettings = settings.requestQueueSettings || {};
        const syncQueueSettings = settings.syncQueueSettings || {};
        if (bucket) {
            assert('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new Log({ name: name ? `${name}-log` : undefined, bucket });
        this._requestQueue = new TaskQueue(this, Object.assign({ name: name ? `${name}-requests` : undefined, bucket }, requestQueueSettings));
        this._syncQueue = new TaskQueue(this, Object.assign({ name: name ? `${name}-sync` : undefined, bucket }, syncQueueSettings));
        if (this._schema && (settings.autoUpgrade === undefined || settings.autoUpgrade)) {
            this._schema.on('upgrade', () => this.upgrade());
        }
    }
    get name() {
        return this._name;
    }
    get schema() {
        return this._schema;
    }
    get keyMap() {
        return this._keyMap;
    }
    get bucket() {
        return this._bucket;
    }
    get transformLog() {
        return this._transformLog;
    }
    get requestQueue() {
        return this._requestQueue;
    }
    get syncQueue() {
        return this._syncQueue;
    }
    get queryBuilder() {
        let qb = this._queryBuilder;
        if (qb === undefined) {
            qb = this._queryBuilder = new QueryBuilder();
        }
        return qb;
    }
    get transformBuilder() {
        let tb = this._transformBuilder;
        if (tb === undefined) {
            tb = this._transformBuilder = new TransformBuilder({
                recordInitializer: this._schema
            });
        }
        return tb;
    }
    // Performer interface
    perform(task) {
        let method = `__${task.type}__`;
        return this[method].call(this, task.data);
    }

    /**
     * Upgrade source as part of a schema upgrade.
     *
     * @returns {Promise<void>}
     * @memberof Source
     */
    upgrade() {
        return Orbit.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Private methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Notifies listeners that this source has been transformed by emitting the
     `transform` event.
        Resolves when any promises returned to event listeners are resolved.
        Also, adds an entry to the Source's `transformLog` for each transform.
        @protected
     @method _transformed
     @param {Array} transforms - Transforms that have occurred.
     @returns {Promise} Promise that resolves to transforms.
    */
    _transformed(transforms) {
        return transforms.reduce((chain, transform) => {
            return chain.then(() => {
                if (this._transformLog.contains(transform.id)) {
                    return Orbit.Promise.resolve();
                }
                return this._transformLog.append(transform.id).then(() => settleInSeries(this, 'transform', transform));
            });
        }, Orbit.Promise.resolve()).then(() => transforms);
    }
    _enqueueRequest(type, data) {
        return this._requestQueue.push({ type, data });
    }
    _enqueueSync(type, data) {
        return this._syncQueue.push({ type, data });
    }
};
Source = __decorate([evented], Source);
export { Source };