"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require("@orbit/data");

var _data2 = _interopRequireDefault(_data);

var _utils = require("@orbit/utils");

var _cache = require("./cache");

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let Store = Store_1 = class Store extends _data.Source {
    constructor(settings = {}) {
        (0, _utils.assert)('Store\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
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
        this._cache = new _cache2.default(cacheSettings);
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
        return _data2.default.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _sync(transform) {
        this._applyTransform(transform);
        return _data2.default.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Updatable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _update(transform) {
        let results = this._applyTransform(transform);
        return _data2.default.Promise.resolve(results.length === 1 ? results[0] : results);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Queryable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _query(query) {
        return _data2.default.Promise.resolve(this._cache.query(query));
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
            ops = (0, _data.coalesceRecordOperations)(ops);
        }
        reducedTransform = (0, _data.buildTransform)(ops, options.transformOptions);
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
Store = Store_1 = __decorate([_data.syncable, _data.queryable, _data.updatable], Store);
exports.default = Store;

var Store_1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIlN0b3JlIiwiU3RvcmVfMSIsIlNvdXJjZSIsImNvbnN0cnVjdG9yIiwic2V0dGluZ3MiLCJzY2hlbWEiLCJrZXlNYXAiLCJuYW1lIiwiX3RyYW5zZm9ybXMiLCJfdHJhbnNmb3JtSW52ZXJzZXMiLCJ0cmFuc2Zvcm1Mb2ciLCJvbiIsIl9sb2dDbGVhcmVkIiwiX2xvZ1RydW5jYXRlZCIsIl9sb2dSb2xsZWRiYWNrIiwiY2FjaGVTZXR0aW5ncyIsInF1ZXJ5QnVpbGRlciIsInRyYW5zZm9ybUJ1aWxkZXIiLCJiYXNlIiwiX2Jhc2UiLCJfZm9ya1BvaW50IiwiaGVhZCIsImNhY2hlIiwiX2NhY2hlIiwiQ2FjaGUiLCJmb3JrUG9pbnQiLCJ1cGdyYWRlIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIl9zeW5jIiwidHJhbnNmb3JtIiwiX2FwcGx5VHJhbnNmb3JtIiwiX3VwZGF0ZSIsInJlc3VsdHMiLCJfcXVlcnkiLCJxdWVyeSIsImZvcmsiLCJfc2NoZW1hIiwiX2tleU1hcCIsIm1lcmdlIiwiZm9ya2VkU3RvcmUiLCJvcHRpb25zIiwidHJhbnNmb3JtcyIsInNpbmNlVHJhbnNmb3JtSWQiLCJ0cmFuc2Zvcm1zU2luY2UiLCJhbGxUcmFuc2Zvcm1zIiwicmVkdWNlZFRyYW5zZm9ybSIsIm9wcyIsImZvckVhY2giLCJ0IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJvcGVyYXRpb25zIiwiY29hbGVzY2UiLCJ0cmFuc2Zvcm1PcHRpb25zIiwidXBkYXRlIiwicm9sbGJhY2siLCJ0cmFuc2Zvcm1JZCIsInJlbGF0aXZlUG9zaXRpb24iLCJhZnRlciIsIm1hcCIsImlkIiwiZW50cmllcyIsImdldFRyYW5zZm9ybSIsImdldEludmVyc2VPcGVyYXRpb25zIiwicmVzdWx0IiwicGF0Y2giLCJpbnZlcnNlIiwiZGF0YSIsIl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5IiwicmVtb3ZlZCIsInJldmVyc2UiLCJpbnZlcnNlT3BlcmF0aW9ucyIsInN5bmNhYmxlIiwicXVlcnlhYmxlIiwidXBkYXRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFUQSxJQUFJQSxhQUFhLGFBQVEsVUFBS0EsVUFBYixJQUEyQixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUNDLElBQW5DLEVBQXlDO0FBQ2pGLFFBQUlDLElBQUlDLFVBQVVDLE1BQWxCO0FBQUEsUUFDSUMsSUFBSUgsSUFBSSxDQUFKLEdBQVFILE1BQVIsR0FBaUJFLFNBQVMsSUFBVCxHQUFnQkEsT0FBT0ssT0FBT0Msd0JBQVAsQ0FBZ0NSLE1BQWhDLEVBQXdDQyxHQUF4QyxDQUF2QixHQUFzRUMsSUFEL0Y7QUFBQSxRQUVJTyxDQUZKO0FBR0EsUUFBSSxPQUFPQyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLE9BQU9BLFFBQVFDLFFBQWYsS0FBNEIsVUFBL0QsRUFBMkVMLElBQUlJLFFBQVFDLFFBQVIsQ0FBaUJaLFVBQWpCLEVBQTZCQyxNQUE3QixFQUFxQ0MsR0FBckMsRUFBMENDLElBQTFDLENBQUosQ0FBM0UsS0FBb0ksS0FBSyxJQUFJVSxJQUFJYixXQUFXTSxNQUFYLEdBQW9CLENBQWpDLEVBQW9DTyxLQUFLLENBQXpDLEVBQTRDQSxHQUE1QyxFQUFpRCxJQUFJSCxJQUFJVixXQUFXYSxDQUFYLENBQVIsRUFBdUJOLElBQUksQ0FBQ0gsSUFBSSxDQUFKLEdBQVFNLEVBQUVILENBQUYsQ0FBUixHQUFlSCxJQUFJLENBQUosR0FBUU0sRUFBRVQsTUFBRixFQUFVQyxHQUFWLEVBQWVLLENBQWYsQ0FB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O0FBQ0EsYUFBS0Msa0JBQUwsR0FBMEIsRUFBMUI7QUFDSDtBQUNESSxrQkFBYytDLFdBQWQsRUFBMkJDLGdCQUEzQixFQUE2Q1ksT0FBN0MsRUFBc0Q7QUFDbERBLGdCQUFReEIsT0FBUixDQUFnQmUsTUFBTSxLQUFLUSwwQkFBTCxDQUFnQ1IsRUFBaEMsQ0FBdEI7QUFDSDtBQUNEbEQsbUJBQWU4QyxXQUFmLEVBQTRCQyxnQkFBNUIsRUFBOENZLE9BQTlDLEVBQXVEO0FBQ25EQSxnQkFBUUMsT0FBUixHQUFrQnpCLE9BQWxCLENBQTBCZSxNQUFNO0FBQzVCLGtCQUFNVyxvQkFBb0IsS0FBS2xFLGtCQUFMLENBQXdCdUQsRUFBeEIsQ0FBMUI7QUFDQSxnQkFBSVcsaUJBQUosRUFBdUI7QUFDbkIscUJBQUtyRCxLQUFMLENBQVcrQyxLQUFYLENBQWlCTSxpQkFBakI7QUFDSDtBQUNELGlCQUFLSCwwQkFBTCxDQUFnQ1IsRUFBaEM7QUFDSCxTQU5EO0FBT0g7QUExSzRDLENBQWpEO0FBNEtBaEUsUUFBUUMsVUFBVWpCLFdBQVcsQ0FBQzRGLGNBQUQsRUFBV0MsZUFBWCxFQUFzQkMsZUFBdEIsQ0FBWCxFQUE2QzlFLEtBQTdDLENBQWxCO2tCQUNlQSxLOztBQUNmLElBQUlDLE9BQUoiLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9IHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IE9yYml0LCB7IFNvdXJjZSwgc3luY2FibGUsIHF1ZXJ5YWJsZSwgdXBkYXRhYmxlLCBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMsIGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCBDYWNoZSBmcm9tICcuL2NhY2hlJztcbmxldCBTdG9yZSA9IFN0b3JlXzEgPSBjbGFzcyBTdG9yZSBleHRlbmRzIFNvdXJjZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1N0b3JlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcbiAgICAgICAgbGV0IGtleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcbiAgICAgICAgbGV0IHNjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcbiAgICAgICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ3N0b3JlJztcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzID0ge307XG4gICAgICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdjbGVhcicsIHRoaXMuX2xvZ0NsZWFyZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbigndHJ1bmNhdGUnLCB0aGlzLl9sb2dUcnVuY2F0ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybUxvZy5vbigncm9sbGJhY2snLCB0aGlzLl9sb2dSb2xsZWRiYWNrLCB0aGlzKTtcbiAgICAgICAgbGV0IGNhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBjYWNoZVNldHRpbmdzLnNjaGVtYSA9IHNjaGVtYTtcbiAgICAgICAgY2FjaGVTZXR0aW5ncy5rZXlNYXAgPSBrZXlNYXA7XG4gICAgICAgIGNhY2hlU2V0dGluZ3MucXVlcnlCdWlsZGVyID0gY2FjaGVTZXR0aW5ncy5xdWVyeUJ1aWxkZXIgfHwgdGhpcy5xdWVyeUJ1aWxkZXI7XG4gICAgICAgIGNhY2hlU2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciA9IGNhY2hlU2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlciB8fCB0aGlzLnRyYW5zZm9ybUJ1aWxkZXI7XG4gICAgICAgIGlmIChzZXR0aW5ncy5iYXNlKSB7XG4gICAgICAgICAgICB0aGlzLl9iYXNlID0gc2V0dGluZ3MuYmFzZTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmtQb2ludCA9IHRoaXMuX2Jhc2UudHJhbnNmb3JtTG9nLmhlYWQ7XG4gICAgICAgICAgICBjYWNoZVNldHRpbmdzLmJhc2UgPSB0aGlzLl9iYXNlLmNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlID0gbmV3IENhY2hlKGNhY2hlU2V0dGluZ3MpO1xuICAgIH1cbiAgICBnZXQgY2FjaGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZTtcbiAgICB9XG4gICAgZ2V0IGJhc2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iYXNlO1xuICAgIH1cbiAgICBnZXQgZm9ya1BvaW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9ya1BvaW50O1xuICAgIH1cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICB0aGlzLl9jYWNoZS51cGdyYWRlKCk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTeW5jYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9zeW5jKHRyYW5zZm9ybSkge1xuICAgICAgICB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gVXBkYXRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3VwZGF0ZSh0cmFuc2Zvcm0pIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHJlc3VsdHMubGVuZ3RoID09PSAxID8gcmVzdWx0c1swXSA6IHJlc3VsdHMpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFF1ZXJ5YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9xdWVyeShxdWVyeSkge1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2NhY2hlLnF1ZXJ5KHF1ZXJ5KSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVibGljIG1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKlxuICAgICBDcmVhdGUgYSBjbG9uZSwgb3IgXCJmb3JrXCIsIGZyb20gYSBcImJhc2VcIiBzdG9yZS5cbiAgICAgICAgVGhlIGZvcmtlZCBzdG9yZSB3aWxsIGhhdmUgdGhlIHNhbWUgYHNjaGVtYWAgYW5kIGBrZXlNYXBgIGFzIGl0cyBiYXNlIHN0b3JlLlxuICAgICBUaGUgZm9ya2VkIHN0b3JlJ3MgY2FjaGUgd2lsbCBzdGFydCB3aXRoIHRoZSBzYW1lIGltbXV0YWJsZSBkb2N1bWVudCBhc1xuICAgICB0aGUgYmFzZSBzdG9yZS4gSXRzIGNvbnRlbnRzIGFuZCBsb2cgd2lsbCBldm9sdmUgaW5kZXBlbmRlbnRseS5cbiAgICAgICAgQG1ldGhvZCBmb3JrXG4gICAgIEByZXR1cm5zIHtTdG9yZX0gVGhlIGZvcmtlZCBzdG9yZS5cbiAgICAqL1xuICAgIGZvcmsoc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzZXR0aW5ncy5zY2hlbWEgPSB0aGlzLl9zY2hlbWE7XG4gICAgICAgIHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgPSBzZXR0aW5ncy5jYWNoZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBzZXR0aW5ncy5rZXlNYXAgPSB0aGlzLl9rZXlNYXA7XG4gICAgICAgIHNldHRpbmdzLnF1ZXJ5QnVpbGRlciA9IHRoaXMucXVlcnlCdWlsZGVyO1xuICAgICAgICBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyID0gdGhpcy50cmFuc2Zvcm1CdWlsZGVyO1xuICAgICAgICBzZXR0aW5ncy5iYXNlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBTdG9yZV8xKHNldHRpbmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgIE1lcmdlIHRyYW5zZm9ybXMgZnJvbSBhIGZvcmtlZCBzdG9yZSBiYWNrIGludG8gYSBiYXNlIHN0b3JlLlxuICAgICAgICBCeSBkZWZhdWx0LCBhbGwgb2YgdGhlIG9wZXJhdGlvbnMgZnJvbSBhbGwgb2YgdGhlIHRyYW5zZm9ybXMgaW4gdGhlIGZvcmtlZFxuICAgICBzdG9yZSdzIGhpc3Rvcnkgd2lsbCBiZSByZWR1Y2VkIGludG8gYSBzaW5nbGUgdHJhbnNmb3JtLiBBIHN1YnNldCBvZlxuICAgICBvcGVyYXRpb25zIGNhbiBiZSBzZWxlY3RlZCBieSBzcGVjaWZ5aW5nIHRoZSBgc2luY2VUcmFuc2Zvcm1JZGAgb3B0aW9uLlxuICAgICAgICBUaGUgYGNvYWxlc2NlYCBvcHRpb24gY29udHJvbHMgd2hldGhlciBvcGVyYXRpb25zIGFyZSBjb2FsZXNjZWQgaW50byBhXG4gICAgIG1pbmltYWwgZXF1aXZhbGVudCBzZXQgYmVmb3JlIGJlaW5nIHJlZHVjZWQgaW50byBhIHRyYW5zZm9ybS5cbiAgICAgICAgQG1ldGhvZCBtZXJnZVxuICAgICBAcGFyYW0ge1N0b3JlfSBmb3JrZWRTdG9yZSAtIFRoZSBzdG9yZSB0byBtZXJnZS5cbiAgICAgQHBhcmFtIHtPYmplY3R9ICBbb3B0aW9uc10gc2V0dGluZ3NcbiAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jb2FsZXNjZSA9IHRydWVdIFNob3VsZCBvcGVyYXRpb25zIGJlIGNvYWxlc2NlZCBpbnRvIGEgbWluaW1hbCBlcXVpdmFsZW50IHNldD9cbiAgICAgQHBhcmFtIHtTdHJpbmd9ICBbb3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkID0gbnVsbF0gU2VsZWN0IG9ubHkgdHJhbnNmb3JtcyBzaW5jZSB0aGUgc3BlY2lmaWVkIElELlxuICAgICBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIHJlc3VsdCBvZiBjYWxsaW5nIGB1cGRhdGUoKWAgd2l0aCB0aGUgZm9ya2VkIHRyYW5zZm9ybXMuXG4gICAgKi9cbiAgICBtZXJnZShmb3JrZWRTdG9yZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGxldCB0cmFuc2Zvcm1zO1xuICAgICAgICBpZiAob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUudHJhbnNmb3Jtc1NpbmNlKG9wdGlvbnMuc2luY2VUcmFuc2Zvcm1JZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1zID0gZm9ya2VkU3RvcmUuYWxsVHJhbnNmb3JtcygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZWR1Y2VkVHJhbnNmb3JtO1xuICAgICAgICBsZXQgb3BzID0gW107XG4gICAgICAgIHRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdC5vcGVyYXRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmNvYWxlc2NlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgb3BzID0gY29hbGVzY2VSZWNvcmRPcGVyYXRpb25zKG9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVkdWNlZFRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKG9wcywgb3B0aW9ucy50cmFuc2Zvcm1PcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlKHJlZHVjZWRUcmFuc2Zvcm0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgUm9sbHMgYmFjayB0aGUgU3RvcmUgdG8gYSBwYXJ0aWN1bGFyIHRyYW5zZm9ybUlkXG4gICAgICAgIEBtZXRob2Qgcm9sbGJhY2tcbiAgICAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybUlkIC0gVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm0gdG8gcm9sbCBiYWNrIHRvXG4gICAgIEBwYXJhbSB7bnVtYmVyfSByZWxhdGl2ZVBvc2l0aW9uIC0gQSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBpbnRlZ2VyIHRvIHNwZWNpZnkgYSBwb3NpdGlvbiByZWxhdGl2ZSB0byBgdHJhbnNmb3JtSWRgXG4gICAgIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgKi9cbiAgICByb2xsYmFjayh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbiA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9nLnJvbGxiYWNrKHRyYW5zZm9ybUlkLCByZWxhdGl2ZVBvc2l0aW9uKTtcbiAgICB9XG4gICAgLyoqXG4gICAgIFJldHVybnMgYWxsIHRyYW5zZm9ybXMgc2luY2UgYSBwYXJ0aWN1bGFyIGB0cmFuc2Zvcm1JZGAuXG4gICAgICAgIEBtZXRob2QgdHJhbnNmb3Jtc1NpbmNlXG4gICAgIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1JZCAtIFRoZSBJRCBvZiB0aGUgdHJhbnNmb3JtIHRvIHN0YXJ0IHdpdGguXG4gICAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cbiAgICAqL1xuICAgIHRyYW5zZm9ybXNTaW5jZSh0cmFuc2Zvcm1JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cuYWZ0ZXIodHJhbnNmb3JtSWQpLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICBSZXR1cm5zIGFsbCB0cmFja2VkIHRyYW5zZm9ybXMuXG4gICAgICAgIEBtZXRob2QgYWxsVHJhbnNmb3Jtc1xuICAgICBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIHRyYW5zZm9ybXMuXG4gICAgKi9cbiAgICBhbGxUcmFuc2Zvcm1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cuZW50cmllcy5tYXAoaWQgPT4gdGhpcy5fdHJhbnNmb3Jtc1tpZF0pO1xuICAgIH1cbiAgICBnZXRUcmFuc2Zvcm0odHJhbnNmb3JtSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtSWRdO1xuICAgIH1cbiAgICBnZXRJbnZlcnNlT3BlcmF0aW9ucyh0cmFuc2Zvcm1JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtSWRdO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY2FjaGUucGF0Y2godHJhbnNmb3JtLm9wZXJhdGlvbnMpO1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybS5pZF0gPSB0cmFuc2Zvcm07XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybS5pZF0gPSByZXN1bHQuaW52ZXJzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgIH1cbiAgICBfY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeSh0cmFuc2Zvcm1JZCkge1xuICAgICAgICBkZWxldGUgdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XG4gICAgfVxuICAgIF9sb2dDbGVhcmVkKCkge1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1zID0ge307XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzID0ge307XG4gICAgfVxuICAgIF9sb2dUcnVuY2F0ZWQodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpIHtcbiAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKGlkID0+IHRoaXMuX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkoaWQpKTtcbiAgICB9XG4gICAgX2xvZ1JvbGxlZGJhY2sodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpIHtcbiAgICAgICAgcmVtb3ZlZC5yZXZlcnNlKCkuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnZlcnNlT3BlcmF0aW9ucyA9IHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW2lkXTtcbiAgICAgICAgICAgIGlmIChpbnZlcnNlT3BlcmF0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucGF0Y2goaW52ZXJzZU9wZXJhdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5TdG9yZSA9IFN0b3JlXzEgPSBfX2RlY29yYXRlKFtzeW5jYWJsZSwgcXVlcnlhYmxlLCB1cGRhdGFibGVdLCBTdG9yZSk7XG5leHBvcnQgZGVmYXVsdCBTdG9yZTtcbnZhciBTdG9yZV8xOyJdfQ==