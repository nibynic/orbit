var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit, { Source, syncable, queryable, updatable, coalesceRecordOperations, buildTransform } from '@orbit/data';
import { assert } from '@orbit/utils';
import Cache from './cache';
let Store = Store_1 = class Store extends Source {
    constructor(settings = {}) {
        assert('Store\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        let keyMap = settings.keyMap;
        let schema = settings.schema;
        settings.name = settings.name || 'store';
        super(settings);
        this._transforms = {};
        this._transformInverses = {};
        this.transformLog.on('clear', this._logCleared, this);
        this.transformLog.on('truncate', this._logTruncated, this);
        this.transformLog.on('rollback', this._logRolledback, this);
        let cacheSettings = settings.cacheSettings || {};
        cacheSettings.schema = schema;
        cacheSettings.keyMap = keyMap;
        cacheSettings.queryBuilder = cacheSettings.queryBuilder || this.queryBuilder;
        cacheSettings.transformBuilder = cacheSettings.transformBuilder || this.transformBuilder;
        if (settings.base) {
            this._base = settings.base;
            this._forkPoint = this._base.transformLog.head;
            cacheSettings.base = this._base.cache;
        }
        this._cache = new Cache(cacheSettings);
    }
    get cache() {
        return this._cache;
    }
    get base() {
        return this._base;
    }
    get forkPoint() {
        return this._forkPoint;
    }
    upgrade() {
        this._cache.upgrade();
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
    // Updatable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _update(transform) {
        let results = this._applyTransform(transform);
        return Orbit.Promise.resolve(results.length === 1 ? results[0] : results);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Queryable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _query(query) {
        return Orbit.Promise.resolve(this._cache.query(query));
    }
    /////////////////////////////////////////////////////////////////////////////
    // Public methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Create a clone, or "fork", from a "base" store.
        The forked store will have the same `schema` and `keyMap` as its base store.
     The forked store's cache will start with the same immutable document as
     the base store. Its contents and log will evolve independently.
        @method fork
     @returns {Store} The forked store.
    */
    fork(settings = {}) {
        settings.schema = this._schema;
        settings.cacheSettings = settings.cacheSettings || {};
        settings.keyMap = this._keyMap;
        settings.queryBuilder = this.queryBuilder;
        settings.transformBuilder = this.transformBuilder;
        settings.base = this;
        return new Store_1(settings);
    }
    /**
     Merge transforms from a forked store back into a base store.
        By default, all of the operations from all of the transforms in the forked
     store's history will be reduced into a single transform. A subset of
     operations can be selected by specifying the `sinceTransformId` option.
        The `coalesce` option controls whether operations are coalesced into a
     minimal equivalent set before being reduced into a transform.
        @method merge
     @param {Store} forkedStore - The store to merge.
     @param {Object}  [options] settings
     @param {Boolean} [options.coalesce = true] Should operations be coalesced into a minimal equivalent set?
     @param {String}  [options.sinceTransformId = null] Select only transforms since the specified ID.
     @returns {Promise} The result of calling `update()` with the forked transforms.
    */
    merge(forkedStore, options = {}) {
        let transforms;
        if (options.sinceTransformId) {
            transforms = forkedStore.transformsSince(options.sinceTransformId);
        } else {
            transforms = forkedStore.allTransforms();
        }
        let reducedTransform;
        let ops = [];
        transforms.forEach(t => {
            Array.prototype.push.apply(ops, t.operations);
        });
        if (options.coalesce !== false) {
            ops = coalesceRecordOperations(ops);
        }
        reducedTransform = buildTransform(ops, options.transformOptions);
        return this.update(reducedTransform);
    }
    /**
     Rolls back the Store to a particular transformId
        @method rollback
     @param {string} transformId - The ID of the transform to roll back to
     @param {number} relativePosition - A positive or negative integer to specify a position relative to `transformId`
     @returns {undefined}
    */
    rollback(transformId, relativePosition = 0) {
        return this.transformLog.rollback(transformId, relativePosition);
    }
    /**
     Returns all transforms since a particular `transformId`.
        @method transformsSince
     @param {string} transformId - The ID of the transform to start with.
     @returns {Array} Array of transforms.
    */
    transformsSince(transformId) {
        return this.transformLog.after(transformId).map(id => this._transforms[id]);
    }
    /**
     Returns all tracked transforms.
        @method allTransforms
     @returns {Array} Array of transforms.
    */
    allTransforms() {
        return this.transformLog.entries.map(id => this._transforms[id]);
    }
    getTransform(transformId) {
        return this._transforms[transformId];
    }
    getInverseOperations(transformId) {
        return this._transformInverses[transformId];
    }
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////
    _applyTransform(transform) {
        const result = this.cache.patch(transform.operations);
        this._transforms[transform.id] = transform;
        this._transformInverses[transform.id] = result.inverse;
        return result.data;
    }
    _clearTransformFromHistory(transformId) {
        delete this._transforms[transformId];
        delete this._transformInverses[transformId];
    }
    _logCleared() {
        this._transforms = {};
        this._transformInverses = {};
    }
    _logTruncated(transformId, relativePosition, removed) {
        removed.forEach(id => this._clearTransformFromHistory(id));
    }
    _logRolledback(transformId, relativePosition, removed) {
        removed.reverse().forEach(id => {
            const inverseOperations = this._transformInverses[id];
            if (inverseOperations) {
                this.cache.patch(inverseOperations);
            }
            this._clearTransformFromHistory(id);
        });
    }
};
Store = Store_1 = __decorate([syncable, queryable, updatable], Store);
export default Store;
var Store_1;