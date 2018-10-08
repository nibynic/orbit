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

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
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
            (0, _utils.assert)('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new _core.Log({ name: name ? name + "-log" : undefined, bucket: bucket });
        this._requestQueue = new _core.TaskQueue(this, Object.assign({ name: name ? name + "-requests" : undefined, bucket: bucket }, requestQueueSettings));
        this._syncQueue = new _core.TaskQueue(this, Object.assign({ name: name ? name + "-sync" : undefined, bucket: bucket }, syncQueueSettings));
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
        return _main2.default.Promise.resolve();
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
                    return _main2.default.Promise.resolve();
                }
                return _this2._transformLog.append(transform.id).then(function () {
                    return (0, _core.settleInSeries)(_this2, 'transform', transform);
                });
            });
        }, _main2.default.Promise.resolve()).then(function () {
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
                qb = this._queryBuilder = new _queryBuilder2.default();
            }
            return qb;
        }
    }, {
        key: "transformBuilder",
        get: function () {
            var tb = this._transformBuilder;
            if (tb === undefined) {
                tb = this._transformBuilder = new _transformBuilder2.default({
                    recordInitializer: this._schema
                });
            }
            return tb;
        }
    }]);

    return Source;
}();
exports.Source = Source = __decorate([_core.evented], Source);
exports.Source = Source;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsInNldHRpbmdzIiwibmFtZSIsImJ1Y2tldCIsInJlcXVlc3RRdWV1ZVNldHRpbmdzIiwic3luY1F1ZXVlU2V0dGluZ3MiLCJhc3NlcnQiLCJxYiIsInRiIiwicmVjb3JkSW5pdGlhbGl6ZXIiLCJfc2NoZW1hIiwibWV0aG9kIiwidGFzayIsIk9yYml0IiwidHJhbnNmb3JtIiwic2V0dGxlSW5TZXJpZXMiLCJ0eXBlIiwiZGF0YSIsIlNvdXJjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVhBLElBQUlBLGFBQWEsYUFBUSxVQUFSLFVBQUEsSUFBMkIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQXlDO0FBQ2pGLFFBQUlDLElBQUlDLFVBQVIsTUFBQTtBQUFBLFFBQ0lDLElBQUlGLElBQUFBLENBQUFBLEdBQUFBLE1BQUFBLEdBQWlCRyxTQUFBQSxJQUFBQSxHQUFnQkEsT0FBT0MsT0FBQUEsd0JBQUFBLENBQUFBLE1BQUFBLEVBQXZCRCxHQUF1QkMsQ0FBdkJELEdBRHpCLElBQUE7QUFBQSxRQUFBLENBQUE7QUFHQSxRQUFJLE9BQUEsT0FBQSxLQUFBLFFBQUEsSUFBK0IsT0FBT0UsUUFBUCxRQUFBLEtBQW5DLFVBQUEsRUFBMkVILElBQUlHLFFBQUFBLFFBQUFBLENBQUFBLFVBQUFBLEVBQUFBLE1BQUFBLEVBQUFBLEdBQUFBLEVBQS9FLElBQStFQSxDQUFKSCxDQUEzRSxLQUFvSSxLQUFLLElBQUlJLElBQUlDLFdBQUFBLE1BQUFBLEdBQWIsQ0FBQSxFQUFvQ0QsS0FBcEMsQ0FBQSxFQUFBLEdBQUEsRUFBQTtBQUFpRCxZQUFJRSxJQUFJRCxXQUFS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QUFJLEVBQUo7QUFzR0FVLFFBQ0EsTUFEQUEsWUFBUzNCLFdBQVcsQ0FBWEEsYUFBVyxDQUFYQSxFQUFUMkIsTUFBUzNCLENBQVQyQjtRQUNBLE0sR0FBQSxNIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgZXZlbnRlZCwgc2V0dGxlSW5TZXJpZXMsIFRhc2tRdWV1ZSwgTG9nIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IFF1ZXJ5QnVpbGRlciBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXInO1xuaW1wb3J0IFRyYW5zZm9ybUJ1aWxkZXIgZnJvbSAnLi90cmFuc2Zvcm0tYnVpbGRlcic7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gQmFzZSBjbGFzcyBmb3Igc291cmNlcy5cblxuIEBjbGFzcyBTb3VyY2VcbiBAbmFtZXNwYWNlIE9yYml0XG4gQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gLSBzZXR0aW5ncyBmb3Igc291cmNlXG4gQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lXSAtIE5hbWUgZm9yIHNvdXJjZVxuIEBwYXJhbSB7U2NoZW1hfSBbc2V0dGluZ3Muc2NoZW1hXSAtIFNjaGVtYSBmb3Igc291cmNlXG4gQGNvbnN0cnVjdG9yXG4gKi9cbmxldCBTb3VyY2UgPSBjbGFzcyBTb3VyY2Uge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xuICAgICAgICB0aGlzLl9rZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xuICAgICAgICB0aGlzLl9xdWVyeUJ1aWxkZXIgPSBzZXR0aW5ncy5xdWVyeUJ1aWxkZXI7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyO1xuICAgICAgICBjb25zdCByZXF1ZXN0UXVldWVTZXR0aW5ncyA9IHNldHRpbmdzLnJlcXVlc3RRdWV1ZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBjb25zdCBzeW5jUXVldWVTZXR0aW5ncyA9IHNldHRpbmdzLnN5bmNRdWV1ZVNldHRpbmdzIHx8IHt9O1xuICAgICAgICBpZiAoYnVja2V0KSB7XG4gICAgICAgICAgICBhc3NlcnQoJ1RyYW5zZm9ybUxvZyByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISFuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1Mb2cgPSBuZXcgTG9nKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LWxvZ2AgOiB1bmRlZmluZWQsIGJ1Y2tldCB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdFF1ZXVlID0gbmV3IFRhc2tRdWV1ZSh0aGlzLCBPYmplY3QuYXNzaWduKHsgbmFtZTogbmFtZSA/IGAke25hbWV9LXJlcXVlc3RzYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0sIHJlcXVlc3RRdWV1ZVNldHRpbmdzKSk7XG4gICAgICAgIHRoaXMuX3N5bmNRdWV1ZSA9IG5ldyBUYXNrUXVldWUodGhpcywgT2JqZWN0LmFzc2lnbih7IG5hbWU6IG5hbWUgPyBgJHtuYW1lfS1zeW5jYCA6IHVuZGVmaW5lZCwgYnVja2V0IH0sIHN5bmNRdWV1ZVNldHRpbmdzKSk7XG4gICAgICAgIGlmICh0aGlzLl9zY2hlbWEgJiYgKHNldHRpbmdzLmF1dG9VcGdyYWRlID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuYXV0b1VwZ3JhZGUpKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlbWEub24oJ3VwZ3JhZGUnLCAoKSA9PiB0aGlzLnVwZ3JhZGUoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICBnZXQgc2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xuICAgIH1cbiAgICBnZXQga2V5TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5TWFwO1xuICAgIH1cbiAgICBnZXQgYnVja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xuICAgIH1cbiAgICBnZXQgdHJhbnNmb3JtTG9nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtTG9nO1xuICAgIH1cbiAgICBnZXQgcmVxdWVzdFF1ZXVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFF1ZXVlO1xuICAgIH1cbiAgICBnZXQgc3luY1F1ZXVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3luY1F1ZXVlO1xuICAgIH1cbiAgICBnZXQgcXVlcnlCdWlsZGVyKCkge1xuICAgICAgICBsZXQgcWIgPSB0aGlzLl9xdWVyeUJ1aWxkZXI7XG4gICAgICAgIGlmIChxYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBxYiA9IHRoaXMuX3F1ZXJ5QnVpbGRlciA9IG5ldyBRdWVyeUJ1aWxkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcWI7XG4gICAgfVxuICAgIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCkge1xuICAgICAgICBsZXQgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyO1xuICAgICAgICBpZiAodGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGIgPSB0aGlzLl90cmFuc2Zvcm1CdWlsZGVyID0gbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xuICAgICAgICAgICAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YjtcbiAgICB9XG4gICAgLy8gUGVyZm9ybWVyIGludGVyZmFjZVxuICAgIHBlcmZvcm0odGFzaykge1xuICAgICAgICBsZXQgbWV0aG9kID0gYF9fJHt0YXNrLnR5cGV9X19gO1xuICAgICAgICByZXR1cm4gdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFzay5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlIHNvdXJjZSBhcyBwYXJ0IG9mIGEgc2NoZW1hIHVwZ3JhZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKiBAbWVtYmVyb2YgU291cmNlXG4gICAgICovXG4gICAgdXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByaXZhdGUgbWV0aG9kc1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqXG4gICAgIE5vdGlmaWVzIGxpc3RlbmVycyB0aGF0IHRoaXMgc291cmNlIGhhcyBiZWVuIHRyYW5zZm9ybWVkIGJ5IGVtaXR0aW5nIHRoZVxuICAgICBgdHJhbnNmb3JtYCBldmVudC5cbiAgICAgICAgUmVzb2x2ZXMgd2hlbiBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgdG8gZXZlbnQgbGlzdGVuZXJzIGFyZSByZXNvbHZlZC5cbiAgICAgICAgQWxzbywgYWRkcyBhbiBlbnRyeSB0byB0aGUgU291cmNlJ3MgYHRyYW5zZm9ybUxvZ2AgZm9yIGVhY2ggdHJhbnNmb3JtLlxuICAgICAgICBAcHJvdGVjdGVkXG4gICAgIEBtZXRob2QgX3RyYW5zZm9ybWVkXG4gICAgIEBwYXJhbSB7QXJyYXl9IHRyYW5zZm9ybXMgLSBUcmFuc2Zvcm1zIHRoYXQgaGF2ZSBvY2N1cnJlZC5cbiAgICAgQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cmFuc2Zvcm1zLlxuICAgICovXG4gICAgX3RyYW5zZm9ybWVkKHRyYW5zZm9ybXMpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXMucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUxvZy5hcHBlbmQodHJhbnNmb3JtLmlkKS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiB0cmFuc2Zvcm1zKTtcbiAgICB9XG4gICAgX2VucXVldWVSZXF1ZXN0KHR5cGUsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcbiAgICB9XG4gICAgX2VucXVldWVTeW5jKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bmNRdWV1ZS5wdXNoKHsgdHlwZSwgZGF0YSB9KTtcbiAgICB9XG59O1xuU291cmNlID0gX19kZWNvcmF0ZShbZXZlbnRlZF0sIFNvdXJjZSk7XG5leHBvcnQgeyBTb3VyY2UgfTsiXX0=