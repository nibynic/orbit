var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var Source = function () {
    function Source() {
        var _this = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Source);

        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        var name = this._name = settings.name;
        var bucket = this._bucket = settings.bucket;
        this._queryBuilder = settings.queryBuilder;
        this._transformBuilder = settings.transformBuilder;
        var requestQueueSettings = settings.requestQueueSettings || {};
        var syncQueueSettings = settings.syncQueueSettings || {};
        if (bucket) {
            assert('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new Log({ name: name ? name + "-log" : undefined, bucket: bucket });
        this._requestQueue = new TaskQueue(this, Object.assign({ name: name ? name + "-requests" : undefined, bucket: bucket }, requestQueueSettings));
        this._syncQueue = new TaskQueue(this, Object.assign({ name: name ? name + "-sync" : undefined, bucket: bucket }, syncQueueSettings));
        if (this._schema && (settings.autoUpgrade === undefined || settings.autoUpgrade)) {
            this._schema.on('upgrade', function () {
                return _this.upgrade();
            });
        }
    }

    // Performer interface
    Source.prototype.perform = function perform(task) {
        var method = "__" + task.type + "__";
        return this[method].call(this, task.data);
    };

    /**
     * Upgrade source as part of a schema upgrade.
     *
     * @returns {Promise<void>}
     * @memberof Source
     */


    Source.prototype.upgrade = function upgrade() {
        return Orbit.Promise.resolve();
    };
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


    Source.prototype._transformed = function _transformed(transforms) {
        var _this2 = this;

        return transforms.reduce(function (chain, transform) {
            return chain.then(function () {
                if (_this2._transformLog.contains(transform.id)) {
                    return Orbit.Promise.resolve();
                }
                return _this2._transformLog.append(transform.id).then(function () {
                    return settleInSeries(_this2, 'transform', transform);
                });
            });
        }, Orbit.Promise.resolve()).then(function () {
            return transforms;
        });
    };

    Source.prototype._enqueueRequest = function _enqueueRequest(type, data) {
        return this._requestQueue.push({ type: type, data: data });
    };

    Source.prototype._enqueueSync = function _enqueueSync(type, data) {
        return this._syncQueue.push({ type: type, data: data });
    };

    _createClass(Source, [{
        key: "name",
        get: function () {
            return this._name;
        }
    }, {
        key: "schema",
        get: function () {
            return this._schema;
        }
    }, {
        key: "keyMap",
        get: function () {
            return this._keyMap;
        }
    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
    }, {
        key: "transformLog",
        get: function () {
            return this._transformLog;
        }
    }, {
        key: "requestQueue",
        get: function () {
            return this._requestQueue;
        }
    }, {
        key: "syncQueue",
        get: function () {
            return this._syncQueue;
        }
    }, {
        key: "queryBuilder",
        get: function () {
            var qb = this._queryBuilder;
            if (qb === undefined) {
                qb = this._queryBuilder = new QueryBuilder();
            }
            return qb;
        }
    }, {
        key: "transformBuilder",
        get: function () {
            var tb = this._transformBuilder;
            if (tb === undefined) {
                tb = this._transformBuilder = new TransformBuilder({
                    recordInitializer: this._schema
                });
            }
            return tb;
        }
    }]);

    return Source;
}();
Source = __decorate([evented], Source);
export { Source };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJPcmJpdCIsImV2ZW50ZWQiLCJzZXR0bGVJblNlcmllcyIsIlRhc2tRdWV1ZSIsIkxvZyIsIlF1ZXJ5QnVpbGRlciIsIlRyYW5zZm9ybUJ1aWxkZXIiLCJhc3NlcnQiLCJTb3VyY2UiLCJzZXR0aW5ncyIsIl9zY2hlbWEiLCJzY2hlbWEiLCJfa2V5TWFwIiwia2V5TWFwIiwibmFtZSIsIl9uYW1lIiwiYnVja2V0IiwiX2J1Y2tldCIsIl9xdWVyeUJ1aWxkZXIiLCJxdWVyeUJ1aWxkZXIiLCJfdHJhbnNmb3JtQnVpbGRlciIsInRyYW5zZm9ybUJ1aWxkZXIiLCJyZXF1ZXN0UXVldWVTZXR0aW5ncyIsInN5bmNRdWV1ZVNldHRpbmdzIiwiX3RyYW5zZm9ybUxvZyIsInVuZGVmaW5lZCIsIl9yZXF1ZXN0UXVldWUiLCJhc3NpZ24iLCJfc3luY1F1ZXVlIiwiYXV0b1VwZ3JhZGUiLCJvbiIsInVwZ3JhZGUiLCJwZXJmb3JtIiwidGFzayIsIm1ldGhvZCIsInR5cGUiLCJjYWxsIiwiZGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiX3RyYW5zZm9ybWVkIiwidHJhbnNmb3JtcyIsInJlZHVjZSIsImNoYWluIiwidHJhbnNmb3JtIiwidGhlbiIsImNvbnRhaW5zIiwiaWQiLCJhcHBlbmQiLCJfZW5xdWV1ZVJlcXVlc3QiLCJwdXNoIiwiX2VucXVldWVTeW5jIiwicWIiLCJ0YiIsInJlY29yZEluaXRpYWxpemVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMs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QSx5QkFnRHVCO0FBQ25CLGdCQUFJQyxLQUFLLEtBQUtqQyxpQkFBZDtBQUNBLGdCQUFJaUMsT0FBTzVCLFNBQVgsRUFBc0I7QUFDbEI0QixxQkFBSyxLQUFLakMsaUJBQUwsR0FBeUIsSUFBSWQsZ0JBQUosQ0FBcUI7QUFDL0NnRCx1Q0FBbUIsS0FBSzVDO0FBRHVCLGlCQUFyQixDQUE5QjtBQUdIO0FBQ0QsbUJBQU8yQyxFQUFQO0FBQ0g7QUF4REQ7O0FBQUE7QUFBQSxHQUFKO0FBc0dBN0MsU0FBU3hCLFdBQVcsQ0FBQ2lCLE9BQUQsQ0FBWCxFQUFzQk8sTUFBdEIsQ0FBVDtBQUNBLFNBQVNBLE1BQVQiLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgZXZlbnRlZCwgc2V0dGxlSW5TZXJpZXMsIFRhc2tRdWV1ZSwgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IFF1ZXJ5QnVpbGRlciBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXInO1xuaW1wb3J0IFRyYW5zZm9ybUJ1aWxkZXIgZnJvbSAnLi90cmFuc2Zvcm0tYnVpbGRlcic7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gQmFzZSBjbGFzcyBmb3Igc291cmNlcy5cblxuIEBjbGFzcyBTb3VyY2VcbiBAbmFtZXNwYWNlIE9yYml0XG4gQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gLSBzZXR0aW5ncyBmb3Igc291cmNlXG4gQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lXSAtIE5hbWUgZm9yIHNvdXJjZVxuIEBwYXJhbSB7U2NoZW1hfSBbc2V0dGluZ3Muc2NoZW1hXSAtIFNjaGVtYSBmb3Igc291cmNlXG4gQGNvbnN0cnVjdG9yXG4gKi9cbmxldCBTb3VyY2UgPSBjbGFzcyBTb3VyY2Uge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xuICAgICAgICB0aGlzLl9rZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xuICAgICAgICB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBzZXR0aW5ncy5xdWVyeUJ1aWxkZXI7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyO1xuICAgICAgICBjb25zdCByZXF1ZXN0UXVldWVTZXR0aW5ncyA9IHNldHRpbmdzLnJlcXVlc3RRdWV1ZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBjb25zdCBzeW5jUXVldWVTZXR0aW5ncyA9IHNldHRpbmdzLnN5bmNRdWV1ZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBpZiAoYnVja2V0KSB7XG4gICAgICAgICAgICBhc3NlcnQoJ1RyYW5zZm9ybUxvZyByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISFuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1Mb2cgPSBuZXcgTG9nKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LWxvZ2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdFF1ZXVlID0gbmV3IFRhc2tRdWV1ZSh0aGlzLCBPYmplY3QuYXNzaWduKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXJlcXVlc3RzYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0sIHJlcXVlc3RRdWV1ZVNldHRpbmdzKSk7XG4gICAgICAgIHRoaXMuX3N5bmNRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgT2JqZWN0LmFzc2lnbih7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1zeW5jYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0sIHN5bmNRdWV1ZVNldHRpbmdzKSk7XG4gICAgICAgIGlmICh0aGlzLl9zY2hlbWEgJiYgKHNldHRpbmdzLmF1dG9VcGdyYWRlID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuYXV0b1VwZ3JhZGUpKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlbWEub24oJ3VwZ3JhZGUnLCAoKSA9PiB0aGlzLnVwZ3JhZGUoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICBnZXQgc2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xuICAgIH1cbiAgICBnZXQga2V5TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5TWFwO1xuICAgIH1cbiAgICBnZXQgYnVja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xuICAgIH1cbiAgICBnZXQgdHJhbnNmb3JtTG9nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nO1xuICAgIH1cbiAgICBnZXQgcmVxdWVzdFF1ZXVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFF1ZXVlO1xuICAgIH1cbiAgICBnZXQgc3luY1F1ZXVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3luY1F1ZXVlO1xuICAgIH1cbiAgICBnZXQgcXVlcnlCdWlsZGVyKCkge1xuICAgICAgICBsZXQgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXI7XG4gICAgICAgIGlmIChxYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBxYiA9IHRoaXMuX3F1ZXJ5QnVpbGRlciA9IG5ldyBRdWVyeUJ1aWxkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcWI7XG4gICAgfVxuICAgIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCkge1xuICAgICAgICBsZXQgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyO1xuICAgICAgICBpZiAodGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xuICAgICAgICAgICAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YjtcbiAgICB9XG4gICAgLy8gUGVyZm9ybWVyIGludGVyZmFjZVxuICAgIHBlcmZvcm0odGFzaykge1xuICAgICAgICBsZXQgbWV0aG9kID0gYF9fJHt0YXNrLnR5cGV9X19gO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFzay5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlIHNvdXJjZSBhcyBwYXJ0IG9mIGEgc2NoZW1hIHVwZ3JhZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKiBAbWVtYmVyb2YgU291cmNlXG4gICAgICovXG4gICAgdXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByaXZhdGUgbWV0aG9kc1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqXG4gICAgIE5vdGlmaWVzIGxpc3RlbmVycyB0aGF0IHRoaXMgc291cmNlIGhhcyBiZWVuIHRyYW5zZm9ybWVkIGJ5IGVtaXR0aW5nIHRoZVxuICAgICBgdHJhbnNmb3JtYCBldmVudC5cbiAgICAgICAgUmVzb2x2ZXMgd2hlbiBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgdG8gZXZlbnQgbGlzdGVuZXJzIGFyZSByZXNvbHZlZC5cbiAgICAgICAgQWxzbywgYWRkcyBhbiBlbnRyeSB0byB0aGUgU291cmNlJ3MgYHRyYW5zZm9ybUxvZ2AgZm9yIGVhY2ggdHJhbnNmb3JtLlxuICAgICAgICBAcHJvdGVjdGVkXG4gICAgIEBtZXRob2QgX3RyYW5zZm9ybWVkXG4gICAgIEBwYXJhbSB7QXJyYXl9IHRyYW5zZm9ybXMgLSBUcmFuc2Zvcm1zIHRoYXQgaGF2ZSBvY2N1cnJlZC5cbiAgICAgQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cmFuc2Zvcm1zLlxuICAgICovXG4gICAgX3RyYW5zZm9ybWVkKHRyYW5zZm9ybXMpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXMucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZy5hcHBlbmQodHJhbnNmb3JtLmlkKS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcbiAgICB9XG4gICAgX2VucXVldWVSZXF1ZXN0KHR5cGUsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcbiAgICB9XG4gICAgX2VucXVldWVTeW5jKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcbiAgICB9XG59O1xuU291cmNlID0gX19kZWNvcmF0ZShbZXZlbnRlZF0sIFNvdXJjZSk7XG5leHBvcnQgeyBTb3VyY2UgfTsiXX0=