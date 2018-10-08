"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("@orbit/utils");

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _evented = require("./evented");

var _evented2 = _interopRequireDefault(_evented);

var _exception = require("./exception");

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
 * Logs track a series of unique events that have occurred. Each event is
 * tracked based on its unique id. The log only tracks the ids but currently
 * does not track any details.
 *
 * Logs can automatically be persisted by assigning them a bucket.
 *
 * @export
 * @class Log
 * @implements {Evented}
 */
var Log = function () {
    function Log() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Log);

        this._name = options.name;
        this._bucket = options.bucket;
        if (this._bucket) {
            (0, _utils.assert)('Log requires a name if it has a bucket', !!this._name);
        }
        this._reify(options.data);
    }

    Log.prototype.append = function append() {
        var _this = this;

        for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
            ids[_key] = arguments[_key];
        }

        return this.reified.then(function () {
            Array.prototype.push.apply(_this._data, ids);
            return _this._persist();
        }).then(function () {
            _this.emit('append', ids);
        });
    };

    Log.prototype.before = function before(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new _exception.NotLoggedException(id);
        }
        var position = index + relativePosition;
        if (position < 0 || position >= this._data.length) {
            throw new _exception.OutOfRangeException(position);
        }
        return this._data.slice(0, position);
    };

    Log.prototype.after = function after(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new _exception.NotLoggedException(id);
        }
        var position = index + 1 + relativePosition;
        if (position < 0 || position > this._data.length) {
            throw new _exception.OutOfRangeException(position);
        }
        return this._data.slice(position);
    };

    Log.prototype.truncate = function truncate(id) {
        var _this2 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this2._data.indexOf(id);
            if (index === -1) {
                throw new _exception.NotLoggedException(id);
            }
            var position = index + relativePosition;
            if (position < 0 || position > _this2._data.length) {
                throw new _exception.OutOfRangeException(position);
            }
            if (position === _this2._data.length) {
                removed = _this2._data;
                _this2._data = [];
            } else {
                removed = _this2._data.slice(0, position);
                _this2._data = _this2._data.slice(position);
            }
            return _this2._persist();
        }).then(function () {
            _this2.emit('truncate', id, relativePosition, removed);
        });
    };

    Log.prototype.rollback = function rollback(id) {
        var _this3 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this3._data.indexOf(id);
            if (index === -1) {
                throw new _exception.NotLoggedException(id);
            }
            var position = index + 1 + relativePosition;
            if (position < 0 || position > _this3._data.length) {
                throw new _exception.OutOfRangeException(position);
            }
            removed = _this3._data.slice(position);
            _this3._data = _this3._data.slice(0, position);
            return _this3._persist();
        }).then(function () {
            _this3.emit('rollback', id, relativePosition, removed);
        });
    };

    Log.prototype.clear = function clear() {
        var _this4 = this;

        var clearedData = void 0;
        return this.reified.then(function () {
            clearedData = _this4._data;
            _this4._data = [];
            return _this4._persist();
        }).then(function () {
            return _this4.emit('clear', clearedData);
        });
    };

    Log.prototype.contains = function contains(id) {
        return this._data.indexOf(id) > -1;
    };

    Log.prototype._persist = function _persist() {
        this.emit('change');
        if (this.bucket) {
            return this._bucket.setItem(this.name, this._data);
        } else {
            return _main2.default.Promise.resolve();
        }
    };

    Log.prototype._reify = function _reify(data) {
        var _this5 = this;

        if (!data && this._bucket) {
            this.reified = this._bucket.getItem(this._name).then(function (bucketData) {
                return _this5._initData(bucketData);
            });
        } else {
            this._initData(data);
            this.reified = _main2.default.Promise.resolve();
        }
    };

    Log.prototype._initData = function _initData(data) {
        if (data) {
            this._data = data;
        } else {
            this._data = [];
        }
    };

    _createClass(Log, [{
        key: "name",
        get: function () {
            return this._name;
        }
    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
    }, {
        key: "head",
        get: function () {
            return this._data[this._data.length - 1];
        }
    }, {
        key: "entries",
        get: function () {
            return this._data;
        }
    }, {
        key: "length",
        get: function () {
            return this._data.length;
        }
    }]);

    return Log;
}();
Log = __decorate([_evented2.default], Log);
exports.default = Log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZy5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsIm9wdGlvbnMiLCJhc3NlcnQiLCJpZHMiLCJBcnJheSIsInJlbGF0aXZlUG9zaXRpb24iLCJpbmRleCIsInBvc2l0aW9uIiwicmVtb3ZlZCIsImNsZWFyZWREYXRhIiwiT3JiaXQiLCJMb2ciXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFWQSxJQUFJQSxhQUFhLGFBQVEsVUFBUixVQUFBLElBQTJCLFVBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFSLE1BQUE7QUFBQSxRQUNJQyxJQUFJRixJQUFBQSxDQUFBQSxHQUFBQSxNQUFBQSxHQUFpQkcsU0FBQUEsSUFBQUEsR0FBZ0JBLE9BQU9DLE9BQUFBLHdCQUFBQSxDQUFBQSxNQUFBQSxFQUF2QkQsR0FBdUJDLENBQXZCRCxHQUR6QixJQUFBO0FBQUEsUUFBQSxDQUFBO0FBR0EsUUFBSSxPQUFBLE9BQUEsS0FBQSxRQUFBLElBQStCLE9BQU9FLFFBQVAsUUFBQSxLQUFuQyxVQUFBLEVBQTJFSCxJQUFJRyxRQUFBQSxRQUFBQSxDQUFBQSxVQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxHQUFBQSxFQUEvRSxJQUErRUEsQ0FBSkgsQ0FBM0UsS0FBb0ksS0FBSyxJQUFJSSxJQUFJQyxXQUFBQSxNQUFBQSxHQUFiLENBQUEsRUFBb0NELEtBQXBDLENBQUEsRUFBQSxHQUFBLEVBQUE7QUFBaUQsWUFBSUUsSUFBSUQsV0FBUixDQUFRQSxDQUFSLEVBQXVCTCxJQUFJLENBQUNGLElBQUFBLENBQUFBLEdBQVFRLEVBQVJSLENBQVFRLENBQVJSLEdBQWVBLElBQUFBLENBQUFBLEdBQVFRLEVBQUFBLE1B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JiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IGV2ZW50ZWQgZnJvbSAnLi9ldmVudGVkJztcbmltcG9ydCB7IE5vdExvZ2dlZEV4Y2VwdGlvbiwgT3V0T2ZSYW5nZUV4Y2VwdGlvbiB9IGZyb20gJy4vZXhjZXB0aW9uJztcbi8qKlxuICogTG9ncyB0cmFjayBhIHNlcmllcyBvZiB1bmlxdWUgZXZlbnRzIHRoYXQgaGF2ZSBvY2N1cnJlZC4gRWFjaCBldmVudCBpc1xuICogdHJhY2tlZCBiYXNlZCBvbiBpdHMgdW5pcXVlIGlkLiBUaGUgbG9nIG9ubHkgdHJhY2tzIHRoZSBpZHMgYnV0IGN1cnJlbnRseVxuICogZG9lcyBub3QgdHJhY2sgYW55IGRldGFpbHMuXG4gKlxuICogTG9ncyBjYW4gYXV0b21hdGljYWxseSBiZSBwZXJzaXN0ZWQgYnkgYXNzaWduaW5nIHRoZW0gYSBidWNrZXQuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIExvZ1xuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XG4gKi9cbmxldCBMb2cgPSBjbGFzcyBMb2cge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgICAgICB0aGlzLl9idWNrZXQgPSBvcHRpb25zLmJ1Y2tldDtcbiAgICAgICAgaWYgKHRoaXMuX2J1Y2tldCkge1xuICAgICAgICAgICAgYXNzZXJ0KCdMb2cgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhdGhpcy5fbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICBnZXQgYnVja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xuICAgIH1cbiAgICBnZXQgaGVhZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbdGhpcy5fZGF0YS5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgIH1cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5sZW5ndGg7XG4gICAgfVxuICAgIGFwcGVuZCguLi5pZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX2RhdGEsIGlkcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYXBwZW5kJywgaWRzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZShpZCwgcmVsYXRpdmVQb3NpdGlvbiA9IDApIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGluZGV4ICsgcmVsYXRpdmVQb3NpdGlvbjtcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnNsaWNlKDAsIHBvc2l0aW9uKTtcbiAgICB9XG4gICAgYWZ0ZXIoaWQsIHJlbGF0aXZlUG9zaXRpb24gPSAwKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE5vdExvZ2dlZEV4Y2VwdGlvbihpZCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIDEgKyByZWxhdGl2ZVBvc2l0aW9uO1xuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gdGhpcy5fZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBPdXRPZlJhbmdlRXhjZXB0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5zbGljZShwb3NpdGlvbik7XG4gICAgfVxuICAgIHRydW5jYXRlKGlkLCByZWxhdGl2ZVBvc2l0aW9uID0gMCkge1xuICAgICAgICBsZXQgcmVtb3ZlZDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyByZWxhdGl2ZVBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZWQgPSB0aGlzLl9kYXRhO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZCA9IHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0cnVuY2F0ZScsIGlkLCByZWxhdGl2ZVBvc2l0aW9uLCByZW1vdmVkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJvbGxiYWNrKGlkLCByZWxhdGl2ZVBvc2l0aW9uID0gMCkge1xuICAgICAgICBsZXQgcmVtb3ZlZDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YS5pbmRleE9mKGlkKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyAxICsgcmVsYXRpdmVQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBPdXRPZlJhbmdlRXhjZXB0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZWQgPSB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnNsaWNlKDAsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdyb2xsYmFjaycsIGlkLCByZWxhdGl2ZVBvc2l0aW9uLCByZW1vdmVkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICBsZXQgY2xlYXJlZERhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjbGVhcmVkRGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuZW1pdCgnY2xlYXInLCBjbGVhcmVkRGF0YSkpO1xuICAgIH1cbiAgICBjb250YWlucyhpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5pbmRleE9mKGlkKSA+IC0xO1xuICAgIH1cbiAgICBfcGVyc2lzdCgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICAgICAgaWYgKHRoaXMuYnVja2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0LnNldEl0ZW0odGhpcy5uYW1lLCB0aGlzLl9kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfcmVpZnkoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEgJiYgdGhpcy5fYnVja2V0KSB7XG4gICAgICAgICAgICB0aGlzLnJlaWZpZWQgPSB0aGlzLl9idWNrZXQuZ2V0SXRlbSh0aGlzLl9uYW1lKS50aGVuKGJ1Y2tldERhdGEgPT4gdGhpcy5faW5pdERhdGEoYnVja2V0RGF0YSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5pdERhdGEoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLnJlaWZpZWQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaW5pdERhdGEoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgICAgIH1cbiAgICB9XG59O1xuTG9nID0gX19kZWNvcmF0ZShbZXZlbnRlZF0sIExvZyk7XG5leHBvcnQgZGVmYXVsdCBMb2c7Il19