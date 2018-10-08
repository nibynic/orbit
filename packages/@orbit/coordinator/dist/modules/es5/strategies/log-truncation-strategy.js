function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { Strategy } from '../strategy';
import Orbit from '@orbit/data';
export var LogTruncationStrategy = function (_Strategy) {
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
        }, Orbit.Promise.resolve());
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
        }, Orbit.Promise.resolve());
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
}(Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvbG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiXSwibmFtZXMiOlsiU3RyYXRlZ3kiLCJPcmJpdCIsIkxvZ1RydW5jYXRpb25TdHJhdGVneSIsIm9wdGlvbnMiLCJuYW1lIiwiYWN0aXZhdGUiLCJjb29yZGluYXRvciIsInRoZW4iLCJfcmVpZnlTb3VyY2VzIiwiX3RyYW5zZm9ybUxpc3RlbmVycyIsIl9zb3VyY2VzIiwiZm9yRWFjaCIsIl9hY3RpdmF0ZVNvdXJjZSIsInNvdXJjZSIsImRlYWN0aXZhdGUiLCJfZGVhY3RpdmF0ZVNvdXJjZSIsInJlZHVjZSIsImNoYWluIiwidHJhbnNmb3JtTG9nIiwicmVpZmllZCIsIlByb21pc2UiLCJyZXNvbHZlIiwiX3JldmlldyIsInNvdXJjZXMiLCJ0cmFuc2Zvcm1JZCIsImhlYWQiLCJsZW5ndGgiLCJtYXRjaCIsImkiLCJzIiwicmVxdWVzdFF1ZXVlIiwiZW1wdHkiLCJzeW5jUXVldWUiLCJjb250YWlucyIsIl90cnVuY2F0ZVNvdXJjZXMiLCJyZWxhdGl2ZVBvc2l0aW9uIiwidHJ1bmNhdGUiLCJsaXN0ZW5lciIsIm9uIiwib2ZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLFFBQVQsUUFBeUIsYUFBekI7QUFDQSxPQUFPQyxLQUFQLE1BQWtCLGFBQWxCO0FBQ0EsV0FBYUMscUJBQWI7QUFBQTs7QUFDSSxxQ0FBMEI7QUFBQSxZQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3RCQSxnQkFBUUMsSUFBUixHQUFlRCxRQUFRQyxJQUFSLElBQWdCLGdCQUEvQjtBQURzQixnREFFdEIscUJBQU1ELE9BQU4sQ0FGc0I7QUFHekI7O0FBSkwsb0NBS0lFLFFBTEoscUJBS2FDLFdBTGIsRUFLd0M7QUFBQTs7QUFBQSxZQUFkSCxPQUFjLHVFQUFKLEVBQUk7O0FBQ2hDLGVBQU8sb0JBQU1FLFFBQU4sWUFBZUMsV0FBZixFQUE0QkgsT0FBNUIsRUFBcUNJLElBQXJDLENBQTBDLFlB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UCxDQUFpQk0sRUFBakIsQ0FBb0IsVUFBcEIsRUFBZ0NELFFBQWhDO0FBQ0F4QixlQUFPaUIsWUFBUCxDQUFvQlEsRUFBcEIsQ0FBdUIsVUFBdkIsRUFBbUNELFFBQW5DO0FBQ0gsS0F4REw7O0FBQUEsb0NBeURJdEIsaUJBekRKLDhCQXlEc0JGLE1BekR0QixFQXlEOEI7QUFDdEIsWUFBTXdCLFdBQVcsS0FBSzVCLG1CQUFMLENBQXlCSSxPQUFPVCxJQUFoQyxDQUFqQjtBQUNBUyxlQUFPbUIsU0FBUCxDQUFpQk8sR0FBakIsQ0FBcUIsVUFBckIsRUFBaUNGLFFBQWpDO0FBQ0F4QixlQUFPaUIsWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0IsVUFBeEIsRUFBb0NGLFFBQXBDO0FBQ0EsZUFBTyxLQUFLNUIsbUJBQUwsQ0FBeUJJLE9BQU9ULElBQWhDLENBQVA7QUFDSCxLQTlETDs7QUFBQTtBQUFBLEVBQTJDSixRQUEzQyIsImZpbGUiOiJzdHJhdGVnaWVzL2xvZy10cnVuY2F0aW9uLXN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuLi9zdHJhdGVneSc7XG5pbXBvcnQgT3JiaXQgZnJvbSAnQG9yYml0L2RhdGEnO1xuZXhwb3J0IGNsYXNzIExvZ1RydW5jYXRpb25TdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdsb2ctdHJ1bmNhdGlvbic7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbiAgICBhY3RpdmF0ZShjb29yZGluYXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiBzdXBlci5hY3RpdmF0ZShjb29yZGluYXRvciwgb3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVpZnlTb3VyY2VzKCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzID0ge307XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfcmVpZnlTb3VyY2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlcy5yZWR1Y2UoKGNoYWluLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cucmVpZmllZCk7XG4gICAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcbiAgICB9XG4gICAgX3Jldmlldyhzb3VyY2UpIHtcbiAgICAgICAgbGV0IHNvdXJjZXMgPSB0aGlzLl9zb3VyY2VzO1xuICAgICAgICBsZXQgdHJhbnNmb3JtSWQgPSBzb3VyY2UudHJhbnNmb3JtTG9nLmhlYWQ7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1JZCAmJiBzb3VyY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHNvdXJjZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHMgIT09IHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXMucmVxdWVzdFF1ZXVlLmVtcHR5IHx8ICFzLnN5bmNRdWV1ZS5lbXB0eSB8fCAhcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJ1bmNhdGVTb3VyY2VzKHRyYW5zZm9ybUlkLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfdHJ1bmNhdGVTb3VyY2VzKHRyYW5zZm9ybUlkLCByZWxhdGl2ZVBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzLnJlZHVjZSgoY2hhaW4sIHNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gc291cmNlLnRyYW5zZm9ybUxvZy50cnVuY2F0ZSh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbikpO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgfVxuICAgIF9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5yZXF1ZXN0UXVldWUuZW1wdHkgJiYgc291cmNlLnN5bmNRdWV1ZS5lbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXZpZXcoc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlLnN5bmNRdWV1ZS5vbignY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICAgIHNvdXJjZS5yZXF1ZXN0UXVldWUub24oJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBfZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdO1xuICAgICAgICBzb3VyY2Uuc3luY1F1ZXVlLm9mZignY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICAgIHNvdXJjZS5yZXF1ZXN0UXVldWUub2ZmKCdjb21wbGV0ZScsIGxpc3RlbmVyKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVyc1tzb3VyY2UubmFtZV07XG4gICAgfVxufSJdfQ==