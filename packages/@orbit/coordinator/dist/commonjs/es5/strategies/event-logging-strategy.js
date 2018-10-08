"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventLoggingStrategy = undefined;

var _coordinator = require("../coordinator");

var _strategy = require("../strategy");

var _data = require("@orbit/data");

var _utils = require("@orbit/utils");

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

var EventLoggingStrategy = exports.EventLoggingStrategy = function (_Strategy) {
    _inherits(EventLoggingStrategy, _Strategy);

    function EventLoggingStrategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, EventLoggingStrategy);

        options.name = options.name || 'event-logging';

        var _this = _possibleConstructorReturn(this, _Strategy.call(this, options));

        _this._events = options.events;
        _this._interfaces = options.interfaces;
        _this._logPrefix = options.logPrefix || '[source-event]';
        return _this;
    }

    EventLoggingStrategy.prototype.activate = function activate(coordinator) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return _Strategy.prototype.activate.call(this, coordinator, options).then(function () {
            _this2._eventListeners = {};
            _this2._sources.forEach(function (source) {
                return _this2._activateSource(source);
            });
        });
    };

    EventLoggingStrategy.prototype.deactivate = function deactivate() {
        var _this3 = this;

        return _Strategy.prototype.deactivate.call(this).then(function () {
            _this3._sources.forEach(function (source) {
                return _this3._deactivateSource(source);
            });
            _this3._eventListeners = null;
        });
    };

    EventLoggingStrategy.prototype._activateSource = function _activateSource(source) {
        var _this4 = this;

        this._sourceEvents(source).forEach(function (event) {
            _this4._addListener(source, event);
        });
    };

    EventLoggingStrategy.prototype._deactivateSource = function _deactivateSource(source) {
        var _this5 = this;

        this._sourceEvents(source).forEach(function (event) {
            _this5._removeListener(source, event);
        });
    };

    EventLoggingStrategy.prototype._sourceEvents = function _sourceEvents(source) {
        var _this6 = this;

        if (this._events) {
            return this._events;
        } else {
            var events = [];
            var interfaces = this._interfaces || this._sourceInterfaces(source);
            interfaces.forEach(function (i) {
                Array.prototype.push.apply(events, _this6._interfaceEvents(i));
            });
            return events;
        }
    };

    EventLoggingStrategy.prototype._sourceInterfaces = function _sourceInterfaces(source) {
        var interfaces = ['transformable'];
        if ((0, _data.isPullable)(source)) {
            interfaces.push('pullable');
        }
        if ((0, _data.isPushable)(source)) {
            interfaces.push('pushable');
        }
        if ((0, _data.isQueryable)(source)) {
            interfaces.push('queryable');
        }
        if ((0, _data.isSyncable)(source)) {
            interfaces.push('syncable');
        }
        if ((0, _data.isUpdatable)(source)) {
            interfaces.push('updatable');
        }
        return interfaces;
    };

    EventLoggingStrategy.prototype._interfaceEvents = function _interfaceEvents(interfaceName) {
        if (this._logLevel === _coordinator.LogLevel.Info) {
            switch (interfaceName) {
                case 'pullable':
                    return ['beforePull', 'pull', 'pullFail'];
                case 'pushable':
                    return ['beforePush', 'push', 'pushFail'];
                case 'queryable':
                    return ['beforeQuery', 'query', 'queryFail'];
                case 'updatable':
                    return ['beforeUpdate', 'update', 'updateFail'];
                case 'syncable':
                    return ['beforeSync', 'sync', 'syncFail'];
                case 'transformable':
                    return ['transform'];
            }
        } else if (this._logLevel > _coordinator.LogLevel.None) {
            switch (interfaceName) {
                case 'pullable':
                    return ['pullFail'];
                case 'pushable':
                    return ['pushFail'];
                case 'queryable':
                    return ['queryFail'];
                case 'syncable':
                    return ['syncFail'];
                case 'updatable':
                    return ['updateFail'];
            }
        }
    };

    EventLoggingStrategy.prototype._addListener = function _addListener(source, event) {
        var listener = this._generateListener(source, event);
        (0, _utils.deepSet)(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    };

    EventLoggingStrategy.prototype._removeListener = function _removeListener(source, event) {
        var listener = (0, _utils.deepGet)(this._eventListeners, [source.name, event]);
        source.off(event, listener, this);
        this._eventListeners[source.name][event] = null;
    };

    EventLoggingStrategy.prototype._generateListener = function _generateListener(source, event) {
        var _this7 = this;

        return function () {
            var _console;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_console = console).log.apply(_console, [_this7._logPrefix, source.name, event].concat(args));
        };
    };

    return EventLoggingStrategy;
}(_strategy.Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvZXZlbnQtbG9nZ2luZy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJvcHRpb25zIiwiZXZlbnRzIiwiaW50ZXJmYWNlcyIsIkFycmF5IiwiaXNQdWxsYWJsZSIsImlzUHVzaGFibGUiLCJpc1F1ZXJ5YWJsZSIsImlzU3luY2FibGUiLCJpc1VwZGF0YWJsZSIsIkxvZ0xldmVsIiwibGlzdGVuZXIiLCJkZWVwU2V0Iiwic291cmNlIiwiZGVlcEdldCIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUEsc0RBQUEsVUFBQSxTQUFBLEVBQUE7QUFBQSxjQUFBLG9CQUFBLEVBQUEsU0FBQTs7QUFDSSxhQUFBLG9CQUFBLEdBQTBCO0FBQUEsWUFBZEEsVUFBYyxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsb0JBQUE7O0FBQ3RCQSxnQkFBQUEsSUFBQUEsR0FBZUEsUUFBQUEsSUFBQUEsSUFBZkEsZUFBQUE7O0FBRHNCLFlBQUEsUUFBQSwyQkFBQSxJQUFBLEVBRXRCLFVBQUEsSUFBQSxDQUFBLElBQUEsRUFGc0IsT0FFdEIsQ0FGc0IsQ0FBQTs7QUFHdEIsY0FBQSxPQUFBLEdBQWVBLFFBQWYsTUFBQTtBQUNBLGNBQUEsV0FBQSxHQUFtQkEsUUFBbkIsVUFBQTtBQUNBLGNBQUEsVUFBQSxHQUFrQkEsUUFBQUEsU0FBQUEsSUFBbEIsZ0JBQUE7QUFMc0IsZUFBQSxLQUFBO0FBTXpCOztBQVBMLHlCQUFBLFNBQUEsQ0FBQSxRQUFBLEdBQUEsU0FBQSxRQUFBLENBQUEsV0FBQSxFQVF3QztBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUFBLFlBQWRBLFVBQWMsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxN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QUFBLENBQUEsa0JBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSAnLi4vY29vcmRpbmF0b3InO1xuaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuLi9zdHJhdGVneSc7XG5pbXBvcnQgeyBpc1B1bGxhYmxlLCBpc1B1c2hhYmxlLCBpc1F1ZXJ5YWJsZSwgaXNTeW5jYWJsZSwgaXNVcGRhdGFibGUgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCBjbGFzcyBFdmVudExvZ2dpbmdTdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdldmVudC1sb2dnaW5nJztcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IG9wdGlvbnMuZXZlbnRzO1xuICAgICAgICB0aGlzLl9pbnRlcmZhY2VzID0gb3B0aW9ucy5pbnRlcmZhY2VzO1xuICAgICAgICB0aGlzLl9sb2dQcmVmaXggPSBvcHRpb25zLmxvZ1ByZWZpeCB8fCAnW3NvdXJjZS1ldmVudF0nO1xuICAgIH1cbiAgICBhY3RpdmF0ZShjb29yZGluYXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiBzdXBlci5hY3RpdmF0ZShjb29yZGluYXRvciwgb3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLl9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfYWN0aXZhdGVTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZUV2ZW50cyhzb3VyY2UpLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgICAgICAgdGhpcy5fYWRkTGlzdGVuZXIoc291cmNlLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5fc291cmNlRXZlbnRzKHNvdXJjZSkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9zb3VyY2VFdmVudHMoc291cmNlKSB7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZXZlbnRzID0gW107XG4gICAgICAgICAgICBsZXQgaW50ZXJmYWNlcyA9IHRoaXMuX2ludGVyZmFjZXMgfHwgdGhpcy5fc291cmNlSW50ZXJmYWNlcyhzb3VyY2UpO1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGV2ZW50cywgdGhpcy5faW50ZXJmYWNlRXZlbnRzKGkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgICAgfVxuICAgIH1cbiAgICBfc291cmNlSW50ZXJmYWNlcyhzb3VyY2UpIHtcbiAgICAgICAgbGV0IGludGVyZmFjZXMgPSBbJ3RyYW5zZm9ybWFibGUnXTtcbiAgICAgICAgaWYgKGlzUHVsbGFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCdwdWxsYWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1B1c2hhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGludGVyZmFjZXMucHVzaCgncHVzaGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNRdWVyeWFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCdxdWVyeWFibGUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTeW5jYWJsZShzb3VyY2UpKSB7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLnB1c2goJ3N5bmNhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzVXBkYXRhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGludGVyZmFjZXMucHVzaCgndXBkYXRhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludGVyZmFjZXM7XG4gICAgfVxuICAgIF9pbnRlcmZhY2VFdmVudHMoaW50ZXJmYWNlTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fbG9nTGV2ZWwgPT09IExvZ0xldmVsLkluZm8pIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaW50ZXJmYWNlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3B1bGxhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnYmVmb3JlUHVsbCcsICdwdWxsJywgJ3B1bGxGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAncHVzaGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydiZWZvcmVQdXNoJywgJ3B1c2gnLCAncHVzaEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdxdWVyeWFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydiZWZvcmVRdWVyeScsICdxdWVyeScsICdxdWVyeUZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICd1cGRhdGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydiZWZvcmVVcGRhdGUnLCAndXBkYXRlJywgJ3VwZGF0ZUZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdzeW5jYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVN5bmMnLCAnc3luYycsICdzeW5jRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RyYW5zZm9ybWFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyd0cmFuc2Zvcm0nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9sb2dMZXZlbCA+IExvZ0xldmVsLk5vbmUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaW50ZXJmYWNlTmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3B1bGxhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsncHVsbEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdwdXNoYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3B1c2hGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAncXVlcnlhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsncXVlcnlGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAnc3luY2FibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydzeW5jRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwZGF0YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3VwZGF0ZUZhaWwnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfYWRkTGlzdGVuZXIoc291cmNlLCBldmVudCkge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX2dlbmVyYXRlTGlzdGVuZXIoc291cmNlLCBldmVudCk7XG4gICAgICAgIGRlZXBTZXQodGhpcy5fZXZlbnRMaXN0ZW5lcnMsIFtzb3VyY2UubmFtZSwgZXZlbnRdLCBsaXN0ZW5lcik7XG4gICAgICAgIHNvdXJjZS5vbihldmVudCwgbGlzdGVuZXIsIHRoaXMpO1xuICAgIH1cbiAgICBfcmVtb3ZlTGlzdGVuZXIoc291cmNlLCBldmVudCkge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGRlZXBHZXQodGhpcy5fZXZlbnRMaXN0ZW5lcnMsIFtzb3VyY2UubmFtZSwgZXZlbnRdKTtcbiAgICAgICAgc291cmNlLm9mZihldmVudCwgbGlzdGVuZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVyc1tzb3VyY2UubmFtZV1bZXZlbnRdID0gbnVsbDtcbiAgICB9XG4gICAgX2dlbmVyYXRlTGlzdGVuZXIoc291cmNlLCBldmVudCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2xvZ1ByZWZpeCwgc291cmNlLm5hbWUsIGV2ZW50LCAuLi5hcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG59Il19