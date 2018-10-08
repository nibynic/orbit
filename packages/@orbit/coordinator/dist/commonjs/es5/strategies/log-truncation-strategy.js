"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogTruncationStrategy = undefined;

var _strategy = require("../strategy");

var _data = require("@orbit/data");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

var LogTruncationStrategy = exports.LogTruncationStrategy = function (_Strategy) {
    _inherits(LogTruncationStrategy, _Strategy);

    function LogTruncationStrategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LogTruncationStrategy);

        options.name = options.name || 'log-truncation';
        return _possibleConstructorReturn(this, _Strategy.call(this, options));
    }

    LogTruncationStrategy.prototype.activate = function activate(coordinator) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return _Strategy.prototype.activate.call(this, coordinator, options).then(function () {
            return _this2._reifySources();
        }).then(function () {
            _this2._transformListeners = {};
            _this2._sources.forEach(function (source) {
                return _this2._activateSource(source);
            });
        });
    };

    LogTruncationStrategy.prototype.deactivate = function deactivate() {
        var _this3 = this;

        return _Strategy.prototype.deactivate.call(this).then(function () {
            _this3._sources.forEach(function (source) {
                return _this3._deactivateSource(source);
            });
            _this3._transformListeners = null;
        });
    };

    LogTruncationStrategy.prototype._reifySources = function _reifySources() {
        return this._sources.reduce(function (chain, source) {
            return chain.then(function () {
                return source.transformLog.reified;
            });
        }, _data2.default.Promise.resolve());
    };

    LogTruncationStrategy.prototype._review = function _review(source) {
        var sources = this._sources;
        var transformId = source.transformLog.head;
        if (transformId && sources.length > 1) {
            var match = true;
            for (var i = 0; i < sources.length; i++) {
                var s = sources[i];
                if (s !== source) {
                    if (!s.requestQueue.empty || !s.syncQueue.empty || !s.transformLog.contains(transformId)) {
                        match = false;
                        break;
                    }
                }
            }
            if (match) {
                return this._truncateSources(transformId, 0);
            }
        }
    };

    LogTruncationStrategy.prototype._truncateSources = function _truncateSources(transformId, relativePosition) {
        return this._sources.reduce(function (chain, source) {
            return chain.then(function () {
                return source.transformLog.truncate(transformId, relativePosition);
            });
        }, _data2.default.Promise.resolve());
    };

    LogTruncationStrategy.prototype._activateSource = function _activateSource(source) {
        var _this4 = this;

        var listener = this._transformListeners[source.name] = function () {
            if (source.requestQueue.empty && source.syncQueue.empty) {
                return _this4._review(source);
            }
        };
        source.syncQueue.on('complete', listener);
        source.requestQueue.on('complete', listener);
    };

    LogTruncationStrategy.prototype._deactivateSource = function _deactivateSource(source) {
        var listener = this._transformListeners[source.name];
        source.syncQueue.off('complete', listener);
        source.requestQueue.off('complete', listener);
        delete this._transformListeners[source.name];
    };

    return LogTruncationStrategy;
}(_strategy.Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvbG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiXSwibmFtZXMiOlsib3B0aW9ucyIsInNvdXJjZSIsIk9yYml0Iiwic291cmNlcyIsInRyYW5zZm9ybUlkIiwibWF0Y2giLCJpIiwicyIsImxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQSx3REFBQSxVQUFBLFNBQUEsRUFBQTtBQUFBLGNBQUEscUJBQUEsRUFBQSxTQUFBOztBQUNJLGFBQUEscUJBQUEsR0FBMEI7QUFBQSxZQUFkQSxVQUFjLFVBQUEsTUFBQSxHQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsTUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBLENBQUEsR0FBSixFQUFJOztBQUFBLHdCQUFBLElBQUEsRUFBQSxxQkFBQTs7QUFDdEJBLGdCQUFBQSxJQUFBQSxHQUFlQSxRQUFBQSxJQUFBQSxJQUFmQSxnQkFBQUE7QUFEc0IsZUFBQSwyQkFBQSxJQUFBLEVBRXRCLFVBQUEsSUFBQSxDQUFBLElBQUEsRUFGc0IsT0FFdEIsQ0FGc0IsQ0FBQTtBQUd6Qjs7QUFKTCwwQkFBQSxTQUFBLENBQUEsUUFBQSxHQUFBLFNBQUEsUUFBQSxDQUFBLFdBQUEsRUFLd0M7QUFBQSxZQUFBLFNBQUEsSUFBQTs7QUFBQSxZQUFkQSxVQUFjLFVBQUEsTUFBQSxHQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsTUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBLENBQUEsR0FBSixFQUFJOztBQUNoQyxlQUFPLFVBQUEsU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxDQUEwQyxZQUFNO0FBQ25ELG1CQUFPLE9BQVAsYUFBTyxFQUFQO0FBREcsU0FBQSxFQUFBLElBQUEsQ0FFQyxZQUFNO0FBQ1YsbUJBQUEsbUJBQUEsR0FBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBc0IsVUFBQSxNQUFBLEVBQUE7QUFBQSx1QkFBVSxPQUFBLGVBQUEsQ0FBVixNQUFVLENBQVY7QUFBdEIsYUFBQTtBQUpKLFNBQU8sQ0FBUDtBQU5SLEtBQUE7O0FBQUEsMEJBQUEsU0FBQSxDQUFBLFVBQUEsR0FBQSxTQUFBLFVBQUEsR0FhaUI7QUFBQSxZQUFBLFNBQUEsSUFBQTs7QUFDVCxlQUFPLFVBQUEsU0FBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FBd0IsWUFBTTtBQUNqQyxtQkFBQSxRQUFBLENBQUEsT0FBQSxDQUFzQixVQUFBLE1BQUEsRUFBQTtBQUFBLHVCQUFVLE9BQUEsaUJBQUEsQ0FBVixNQUFVLENBQVY7QUFBdEIsYUFBQTtBQUNBLG1CQUFBLG1CQUFBLEdBQUEsSUFBQTtBQUZKLFNBQU8sQ0FBUDtBQWRSLEtBQUE7O0FBQUEsMEJBQUEsU0FBQSxDQUFBLGFBQUEsR0FBQSxTQUFBLGFBQUEsR0FtQm9CO0FBQ1osZUFBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQXFCLFVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBbUI7QUFDM0MsbUJBQU8sTUFBQSxJQUFBLENBQVcsWUFBQTtBQUFBLHVCQUFNQyxPQUFBQSxZQUFBQSxDQUFOLE9BQUE7QUFBbEIsYUFBTyxDQUFQO0FBREcsU0FBQSxFQUVKQyxlQUFBQSxPQUFBQSxDQUZILE9BRUdBLEVBRkksQ0FBUDtBQXBCUixLQUFBOztBQUFBLDBCQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQUEsU0FBQSxPQUFBLENBQUEsTUFBQSxFQXdCb0I7QUFDWixZQUFJQyxVQUFVLEtBQWQsUUFBQTtBQUNBLFlBQUlDLGNBQWNILE9BQUFBLFlBQUFBLENBQWxCLElBQUE7QUFDQSxZQUFJRyxlQUFlRCxRQUFBQSxNQUFBQSxHQUFuQixDQUFBLEVBQXVDO0FBQ25DLGdCQUFJRSxRQUFKLElBQUE7QUFDQSxpQkFBSyxJQUFJQyxJQUFULENBQUEsRUFBZ0JBLElBQUlILFFBQXBCLE1BQUEsRUFBQSxHQUFBLEVBQXlDO0FBQ3JDLG9CQUFJSSxJQUFJSixRQUFSLENBQVFBLENBQVI7QUFDQSxvQkFBSUksTUFBSixNQUFBLEVBQWtCO0FBQ2Qsd0JBQUksQ0FBQ0EsRUFBQUEsWUFBQUEsQ0FBRCxLQUFBLElBQXlCLENBQUNBLEVBQUFBLFNBQUFBLENBQTFCLEtBQUEsSUFBK0MsQ0FBQ0EsRUFBQUEsWUFBQUEsQ0FBQUEsUUFBQUEsQ0FBcEQsV0FBb0RBLENBQXBELEVBQTBGO0FBQ3RGRixnQ0FBQUEsS0FBQUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNELGdCQUFBLEtBQUEsRUFBVztBQUNQLHVCQUFPLEtBQUEsZ0JBQUEsQ0FBQSxXQUFBLEVBQVAsQ0FBTyxDQUFQO0FBQ0g7QUFDSjtBQXpDVCxLQUFBOztBQUFBLDBCQUFBLFNBQUEsQ0FBQSxnQkFBQSxHQUFBLFNBQUEsZ0JBQUEsQ0FBQSxXQUFBLEVBQUEsZ0JBQUEsRUEyQ29EO0FBQzVDLGVBQU8sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFxQixVQUFBLEtBQUEsRUFBQSxNQUFBLEVBQW1CO0FBQzNDLG1CQUFPLE1BQUEsSUFBQSxDQUFXLFlBQUE7QUFBQSx1QkFBTUosT0FBQUEsWUFBQUEsQ0FBQUEsUUFBQUEsQ0FBQUEsV0FBQUEsRUFBTixnQkFBTUEsQ0FBTjtBQUFsQixhQUFPLENBQVA7QUFERyxTQUFBLEVBRUpDLGVBQUFBLE9BQUFBLENBRkgsT0FFR0EsRUFGSSxDQUFQO0FBNUNSLEtBQUE7O0FBQUEsMEJBQUEsU0FBQSxDQUFBLGVBQUEsR0FBQSxTQUFBLGVBQUEsQ0FBQSxNQUFBLEVBZ0Q0QjtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUNwQixZQUFNTSxXQUFXLEtBQUEsbUJBQUEsQ0FBeUJQLE9BQXpCLElBQUEsSUFBd0MsWUFBTTtBQUMzRCxnQkFBSUEsT0FBQUEsWUFBQUEsQ0FBQUEsS0FBQUEsSUFBNkJBLE9BQUFBLFNBQUFBLENBQWpDLEtBQUEsRUFBeUQ7QUFDckQsdUJBQU8sT0FBQSxPQUFBLENBQVAsTUFBTyxDQUFQO0FBQ0g7QUFITCxTQUFBO0FBS0FBLGVBQUFBLFNBQUFBLENBQUFBLEVBQUFBLENBQUFBLFVBQUFBLEVBQUFBLFFBQUFBO0FBQ0FBLGVBQUFBLFlBQUFBLENBQUFBLEVBQUFBLENBQUFBLFVBQUFBLEVBQUFBLFFBQUFBO0FBdkRSLEtBQUE7O0FBQUEsMEJBQUEsU0FBQSxDQUFBLGlCQUFBLEdBQUEsU0FBQSxpQkFBQSxDQUFBLE1BQUEsRUF5RDhCO0FBQ3RCLFlBQU1PLFdBQVcsS0FBQSxtQkFBQSxDQUF5QlAsT0FBMUMsSUFBaUIsQ0FBakI7QUFDQUEsZUFBQUEsU0FBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsVUFBQUEsRUFBQUEsUUFBQUE7QUFDQUEsZUFBQUEsWUFBQUEsQ0FBQUEsR0FBQUEsQ0FBQUEsVUFBQUEsRUFBQUEsUUFBQUE7QUFDQSxlQUFPLEtBQUEsbUJBQUEsQ0FBeUJBLE9BQWhDLElBQU8sQ0FBUDtBQTdEUixLQUFBOztBQUFBLFdBQUEscUJBQUE7QUFBQSxDQUFBLENBQUEsa0JBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xuaW1wb3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmV4cG9ydCBjbGFzcyBMb2dUcnVuY2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnbG9nLXRydW5jYXRpb24nO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZ5U291cmNlcygpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVycyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLl9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSk7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3JlaWZ5U291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXMucmVkdWNlKChjaGFpbiwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzb3VyY2UudHJhbnNmb3JtTG9nLnJlaWZpZWQpO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgfVxuICAgIF9yZXZpZXcoc291cmNlKSB7XG4gICAgICAgIGxldCBzb3VyY2VzID0gdGhpcy5fc291cmNlcztcbiAgICAgICAgbGV0IHRyYW5zZm9ybUlkID0gc291cmNlLnRyYW5zZm9ybUxvZy5oZWFkO1xuICAgICAgICBpZiAodHJhbnNmb3JtSWQgJiYgc291cmNlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBzb3VyY2VzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzLnJlcXVlc3RRdWV1ZS5lbXB0eSB8fCAhcy5zeW5jUXVldWUuZW1wdHkgfHwgIXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybUlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlcy5yZWR1Y2UoKGNoYWluLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cudHJ1bmNhdGUodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pKTtcbiAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgIH1cbiAgICBfYWN0aXZhdGVTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UucmVxdWVzdFF1ZXVlLmVtcHR5ICYmIHNvdXJjZS5zeW5jUXVldWUuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmV2aWV3KHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zeW5jUXVldWUub24oJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgICAgICBzb3VyY2UucmVxdWVzdFF1ZXVlLm9uKCdjb21wbGV0ZScsIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXTtcbiAgICAgICAgc291cmNlLnN5bmNRdWV1ZS5vZmYoJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgICAgICBzb3VyY2UucmVxdWVzdFF1ZXVlLm9mZignY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdO1xuICAgIH1cbn0iXX0=