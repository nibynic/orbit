"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Source = undefined;

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _core = require("@orbit/core");

var _queryBuilder = require("./query-builder");

var _queryBuilder2 = _interopRequireDefault(_queryBuilder);

var _transformBuilder = require("./transform-builder");

var _transformBuilder2 = _interopRequireDefault(_transformBuilder);

var _utils = require("@orbit/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

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
            (0, _utils.assert)('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new _core.Log({ name: name ? `${name}-log` : undefined, bucket });
        this._requestQueue = new _core.TaskQueue(this, Object.assign({ name: name ? `${name}-requests` : undefined, bucket }, requestQueueSettings));
        this._syncQueue = new _core.TaskQueue(this, Object.assign({ name: name ? `${name}-sync` : undefined, bucket }, syncQueueSettings));
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
            qb = this._queryBuilder = new _queryBuilder2.default();
        }
        return qb;
    }
    get transformBuilder() {
        let tb = this._transformBuilder;
        if (tb === undefined) {
            tb = this._transformBuilder = new _transformBuilder2.default({
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
        return _main2.default.Promise.resolve();
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
                    return _main2.default.Promise.resolve();
                }
                return this._transformLog.append(transform.id).then(() => (0, _core.settleInSeries)(this, 'transform', transform));
            });
        }, _main2.default.Promise.resolve()).then(() => transforms);
    }
    _enqueueRequest(type, data) {
        return this._requestQueue.push({ type, data });
    }
    _enqueueSync(type, data) {
        return this._syncQueue.push({ type, data });
    }
};
exports.Source = Source = __decorate([_core.evented], Source);
exports.Source = Source;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJTb3VyY2UiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwiX3NjaGVtYSIsInNjaGVtYSIsIl9rZXlNYXAiLCJrZXlNYXAiLCJuYW1lIiwiX25hbWUiLCJidWNrZXQiLCJfYnVja2V0IiwiX3F1ZXJ5QnVpbGRlciIsInF1ZXJ5QnVpbGRlciIsIl90cmFuc2Zvcm1CdWlsZGVyIiwidHJhbnNmb3JtQnVpbGRlciIsInJlcXVlc3RRdWV1ZVNldHRpbmdzIiwic3luY1F1ZXVlU2V0dGluZ3MiLCJfdHJhbnNmb3JtTG9nIiwiTG9nIiwidW5kZWZpbmVkIiwiX3JlcXVlc3RRdWV1ZSIsIlRhc2tRdWV1ZSIsImFzc2lnbiIsIl9zeW5jUXVldWUiLCJhdXRvVXBncmFkZSIsIm9uIiwidXBncmFkZSIsInRyYW5zZm9ybUxvZyIsInJlcXVlc3RRdWV1ZSIsInN5bmNRdWV1ZSIsInFiIiwiUXVlcnlCdWlsZGVyIiwidGIiLCJUcmFuc2Zvcm1CdWlsZGVyIiwicmVjb3JkSW5pdGlhbGl6ZXIiLCJwZXJmb3JtIiwidGFzayIsIm1ldGhvZCIsInR5cGUiLCJjYWxsIiwiZGF0YSIsIk9yYml0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJfdHJhbnNmb3JtZWQiLCJ0cmFuc2Zvcm1zIiwicmVkdWNlIiwiY2hhaW4iLCJ0cmFuc2Zvcm0iLCJ0aGVuIiwiY29udGFpbnMiLCJpZCIsImFwcGVuZCIsIl9lbnF1ZXVlUmVxdWVzdCIsInB1c2giLCJfZW5xdWV1ZVN5bmMiLCJldmVudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBT0E7Ozs7QUFDQTs7QUFDQTs7OztB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ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IGV2ZW50ZWQsIHNldHRsZUluU2VyaWVzLCBUYXNrUXVldWUsIExvZyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCBRdWVyeUJ1aWxkZXIgZnJvbSAnLi9xdWVyeS1idWlsZGVyJztcbmltcG9ydCBUcmFuc2Zvcm1CdWlsZGVyIGZyb20gJy4vdHJhbnNmb3JtLWJ1aWxkZXInO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8qKlxuIEJhc2UgY2xhc3MgZm9yIHNvdXJjZXMuXG5cbiBAY2xhc3MgU291cmNlXG4gQG5hbWVzcGFjZSBPcmJpdFxuIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdIC0gc2V0dGluZ3MgZm9yIHNvdXJjZVxuIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MubmFtZV0gLSBOYW1lIGZvciBzb3VyY2VcbiBAcGFyYW0ge1NjaGVtYX0gW3NldHRpbmdzLnNjaGVtYV0gLSBTY2hlbWEgZm9yIHNvdXJjZVxuIEBjb25zdHJ1Y3RvclxuICovXG5sZXQgU291cmNlID0gY2xhc3MgU291cmNlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX3NjaGVtYSA9IHNldHRpbmdzLnNjaGVtYTtcbiAgICAgICAgdGhpcy5fa2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IHRoaXMuX2J1Y2tldCA9IHNldHRpbmdzLmJ1Y2tldDtcbiAgICAgICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyO1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gc2V0dGluZ3MudHJhbnNmb3JtQnVpbGRlcjtcbiAgICAgICAgY29uc3QgcmVxdWVzdFF1ZXVlU2V0dGluZ3MgPSBzZXR0aW5ncy5yZXF1ZXN0UXVldWVTZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgY29uc3Qgc3luY1F1ZXVlU2V0dGluZ3MgPSBzZXR0aW5ncy5zeW5jUXVldWVTZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgaWYgKGJ1Y2tldCkge1xuICAgICAgICAgICAgYXNzZXJ0KCdUcmFuc2Zvcm1Mb2cgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtTG9nID0gbmV3IExvZyh7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1sb2dgIDogdW5kZWZpbmVkLCBidWNrZXQgfSk7XG4gICAgICAgIHRoaXMuX3JlcXVlc3RRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgT2JqZWN0LmFzc2lnbih7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1yZXF1ZXN0c2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9LCByZXF1ZXN0UXVldWVTZXR0aW5ncykpO1xuICAgICAgICB0aGlzLl9zeW5jUXVldWUgPSBuZXcgVGFza1F1ZXVlKHRoaXMsIE9iamVjdC5hc3NpZ24oeyBuYW1lOiBuYW1lID8gYCR7bmFtZX0tc3luY2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9LCBzeW5jUXVldWVTZXR0aW5ncykpO1xuICAgICAgICBpZiAodGhpcy5fc2NoZW1hICYmIChzZXR0aW5ncy5hdXRvVXBncmFkZSA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmF1dG9VcGdyYWRlKSkge1xuICAgICAgICAgICAgdGhpcy5fc2NoZW1hLm9uKCd1cGdyYWRlJywgKCkgPT4gdGhpcy51cGdyYWRlKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gICAgZ2V0IHNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjaGVtYTtcbiAgICB9XG4gICAgZ2V0IGtleU1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleU1hcDtcbiAgICB9XG4gICAgZ2V0IGJ1Y2tldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1Y2tldDtcbiAgICB9XG4gICAgZ2V0IHRyYW5zZm9ybUxvZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZztcbiAgICB9XG4gICAgZ2V0IHJlcXVlc3RRdWV1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZTtcbiAgICB9XG4gICAgZ2V0IHN5bmNRdWV1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZTtcbiAgICB9XG4gICAgZ2V0IHF1ZXJ5QnVpbGRlcigpIHtcbiAgICAgICAgbGV0IHFiID0gdGhpcy5fcXVlcnlCdWlsZGVyO1xuICAgICAgICBpZiAocWIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBuZXcgUXVlcnlCdWlsZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHFiO1xuICAgIH1cbiAgICBnZXQgdHJhbnNmb3JtQnVpbGRlcigpIHtcbiAgICAgICAgbGV0IHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcbiAgICAgICAgaWYgKHRiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRiID0gdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IG5ldyBUcmFuc2Zvcm1CdWlsZGVyKHtcbiAgICAgICAgICAgICAgICByZWNvcmRJbml0aWFsaXplcjogdGhpcy5fc2NoZW1hXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGI7XG4gICAgfVxuICAgIC8vIFBlcmZvcm1lciBpbnRlcmZhY2VcbiAgICBwZXJmb3JtKHRhc2spIHtcbiAgICAgICAgbGV0IG1ldGhvZCA9IGBfXyR7dGFzay50eXBlfV9fYDtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhc2suZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBncmFkZSBzb3VyY2UgYXMgcGFydCBvZiBhIHNjaGVtYSB1cGdyYWRlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICogQG1lbWJlcm9mIFNvdXJjZVxuICAgICAqL1xuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQcml2YXRlIG1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8qKlxuICAgICBOb3RpZmllcyBsaXN0ZW5lcnMgdGhhdCB0aGlzIHNvdXJjZSBoYXMgYmVlbiB0cmFuc2Zvcm1lZCBieSBlbWl0dGluZyB0aGVcbiAgICAgYHRyYW5zZm9ybWAgZXZlbnQuXG4gICAgICAgIFJlc29sdmVzIHdoZW4gYW55IHByb21pc2VzIHJldHVybmVkIHRvIGV2ZW50IGxpc3RlbmVycyBhcmUgcmVzb2x2ZWQuXG4gICAgICAgIEFsc28sIGFkZHMgYW4gZW50cnkgdG8gdGhlIFNvdXJjZSdzIGB0cmFuc2Zvcm1Mb2dgIGZvciBlYWNoIHRyYW5zZm9ybS5cbiAgICAgICAgQHByb3RlY3RlZFxuICAgICBAbWV0aG9kIF90cmFuc2Zvcm1lZFxuICAgICBAcGFyYW0ge0FycmF5fSB0cmFuc2Zvcm1zIC0gVHJhbnNmb3JtcyB0aGF0IGhhdmUgb2NjdXJyZWQuXG4gICAgIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJhbnNmb3Jtcy5cbiAgICAqL1xuICAgIF90cmFuc2Zvcm1lZCh0cmFuc2Zvcm1zKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1zLnJlZHVjZSgoY2hhaW4sIHRyYW5zZm9ybSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1Mb2cuYXBwZW5kKHRyYW5zZm9ybS5pZCkudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oKCkgPT4gdHJhbnNmb3Jtcyk7XG4gICAgfVxuICAgIF9lbnF1ZXVlUmVxdWVzdCh0eXBlLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XG4gICAgfVxuICAgIF9lbnF1ZXVlU3luYyh0eXBlLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zeW5jUXVldWUucHVzaCh7IHR5cGUsIGRhdGEgfSk7XG4gICAgfVxufTtcblNvdXJjZSA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBTb3VyY2UpO1xuZXhwb3J0IHsgU291cmNlIH07Il19