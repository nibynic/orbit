function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { LogLevel } from '../coordinator';
import { Strategy } from '../strategy';
import { isPullable, isPushable, isQueryable, isSyncable, isUpdatable } from '@orbit/data';
import { deepGet, deepSet } from '@orbit/utils';
export var EventLoggingStrategy = function (_Strategy) {
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
        if (isPullable(source)) {
            interfaces.push('pullable');
        }
        if (isPushable(source)) {
            interfaces.push('pushable');
        }
        if (isQueryable(source)) {
            interfaces.push('queryable');
        }
        if (isSyncable(source)) {
            interfaces.push('syncable');
        }
        if (isUpdatable(source)) {
            interfaces.push('updatable');
        }
        return interfaces;
    };

    EventLoggingStrategy.prototype._interfaceEvents = function _interfaceEvents(interfaceName) {
        if (this._logLevel === LogLevel.Info) {
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
        } else if (this._logLevel > LogLevel.None) {
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
        deepSet(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    };

    EventLoggingStrategy.prototype._removeListener = function _removeListener(source, event) {
        var listener = deepGet(this._eventListeners, [source.name, event]);
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
}(Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvZXZlbnQtbG9nZ2luZy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJMb2dMZXZlbCIsIlN0cmF0ZWd5IiwiaXNQdWxsYWJsZSIsImlzUHVzaGFibGUiLCJpc1F1ZXJ5YWJsZSIsImlzU3luY2FibGUiLCJpc1VwZGF0YWJsZSIsImRlZXBHZXQiLCJkZWVwU2V0IiwiRXZlbnRMb2dnaW5nU3RyYXRlZ3kiLCJvcHRpb25zIiwibmFtZSIsIl9ldmVudHMiLCJldmVudHMiLCJfaW50ZXJmYWNlcyIsImludGVyZmFjZXMiLCJfbG9nUHJlZml4IiwibG9nUHJlZml4IiwiYWN0aXZhdGUiLCJjb29yZGluYXRvciIsInRoZW4iLCJfZXZlbnRMaXN0ZW5lcnMiLCJfc291cmNlcyIsImZvckVhY2giLCJfYWN0aXZhdGVTb3VyY2UiLCJzb3VyY2UiLCJkZWFjdGl2YXRlIiwiX2RlYWN0aXZhdGVTb3VyY2UiLCJfc291cmNlRXZlbnRzIiwiX2FkZExpc3RlbmVyIiwiZXZlbnQiLCJfcmVtb3ZlTGlzdGVuZXIiLCJfc291cmNlSW50ZXJmYWNlcyIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5IiwiX2ludGVyZmFjZUV2ZW50cyIsImkiLCJpbnRlcmZhY2VOYW1lIiwiX2xvZ0xldmVsIiwiSW5mbyIsIk5vbmUiLCJsaXN0ZW5lciIsIl9nZW5lcmF0ZUxpc3RlbmVyIiwib24iLCJvZmYiLCJhcmdzIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLFFBQVQsUUFBeUIsZ0JBQXpCO0FBQ0EsU0FBU0MsUUFBVCxRQUF5QixhQUF6QjtBQUNBLFNBQVNDLFVBQVQsRUFBcUJDLFVBQXJCLEVBQWlDQyxXQUFqQyxFQUE4Q0MsVUFBOUMsRUFBMERDLFdBQTFELFFBQTZFLGFBQTdFO0FBQ0EsU0FBU0MsT0FBVCxFQUFrQkMsT0FBbEIsUUFBaUMsY0FBakM7QUFDQSxXQUFhQyxvQkFBYjtBQUFBOztBQUNJLG9DQUEwQjtBQUFBLFlBQWRD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O0FBQUEsbUNBNEZJVixZQTVGSix5QkE0RmlCSixNQTVGakIsRUE0RnlCSyxLQTVGekIsRUE0RmdDO0FBQ3hCLFlBQU1hLFdBQVcsS0FBS0MsaUJBQUwsQ0FBdUJuQixNQUF2QixFQUErQkssS0FBL0IsQ0FBakI7QUFDQXRCLGdCQUFRLEtBQUthLGVBQWIsRUFBOEIsQ0FBQ0ksT0FBT2QsSUFBUixFQUFjbUIsS0FBZCxDQUE5QixFQUFvRGEsUUFBcEQ7QUFDQWxCLGVBQU9vQixFQUFQLENBQVVmLEtBQVYsRUFBaUJhLFFBQWpCLEVBQTJCLElBQTNCO0FBQ0gsS0FoR0w7O0FBQUEsbUNBaUdJWixlQWpHSiw0QkFpR29CTixNQWpHcEIsRUFpRzRCSyxLQWpHNUIsRUFpR21DO0FBQzNCLFlBQU1hLFdBQVdwQyxRQUFRLEtBQUtjLGVBQWIsRUFBOEIsQ0FBQ0ksT0FBT2QsSUFBUixFQUFjbUIsS0FBZCxDQUE5QixDQUFqQjtBQUNBTCxlQUFPcUIsR0FBUCxDQUFXaEIsS0FBWCxFQUFrQmEsUUFBbEIsRUFBNEIsSUFBNUI7QUFDQSxhQUFLdEIsZUFBTCxDQUFxQkksT0FBT2QsSUFBNUIsRUFBa0NtQixLQUFsQyxJQUEyQyxJQUEzQztBQUNILEtBckdMOztBQUFBLG1DQXNHSWMsaUJBdEdKLDhCQXNHc0JuQixNQXRHdEIsRUFzRzhCSyxLQXRHOUIsRUFzR3FDO0FBQUE7O0FBQzdCLGVBQU8sWUFBYTtBQUFBOztBQUFBLDhDQUFUaUIsSUFBUztBQUFUQSxvQkFBUztBQUFBOztBQUNoQixpQ0FBUUMsR0FBUixrQkFBWSxPQUFLaEMsVUFBakIsRUFBNkJTLE9BQU9kLElBQXBDLEVBQTBDbUIsS0FBMUMsU0FBb0RpQixJQUFwRDtBQUNILFNBRkQ7QUFHSCxLQTFHTDs7QUFBQTtBQUFBLEVBQTBDOUMsUUFBMUMiLCJmaWxlIjoic3RyYXRlZ2llcy9ldmVudC1sb2dnaW5nLXN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XG5pbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJy4uL3N0cmF0ZWd5JztcbmltcG9ydCB7IGlzUHVsbGFibGUsIGlzUHVzaGFibGUsIGlzUXVlcnlhYmxlLCBpc1N5bmNhYmxlLCBpc1VwZGF0YWJsZSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGRlZXBHZXQsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IGNsYXNzIEV2ZW50TG9nZ2luZ1N0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2V2ZW50LWxvZ2dpbmcnO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gb3B0aW9ucy5ldmVudHM7XG4gICAgICAgIHRoaXMuX2ludGVyZmFjZXMgPSBvcHRpb25zLmludGVyZmFjZXM7XG4gICAgICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8ICdbc291cmNlLWV2ZW50XSc7XG4gICAgfVxuICAgIGFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0ge307XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5fc291cmNlRXZlbnRzKHNvdXJjZSkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLl9hZGRMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9kZWFjdGl2YXRlU291cmNlKHNvdXJjZSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VFdmVudHMoc291cmNlKS5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyKHNvdXJjZSwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3NvdXJjZUV2ZW50cyhzb3VyY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBldmVudHMgPSBbXTtcbiAgICAgICAgICAgIGxldCBpbnRlcmZhY2VzID0gdGhpcy5faW50ZXJmYWNlcyB8fCB0aGlzLl9zb3VyY2VJbnRlcmZhY2VzKHNvdXJjZSk7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZXZlbnRzLCB0aGlzLl9pbnRlcmZhY2VFdmVudHMoaSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9zb3VyY2VJbnRlcmZhY2VzKHNvdXJjZSkge1xuICAgICAgICBsZXQgaW50ZXJmYWNlcyA9IFsndHJhbnNmb3JtYWJsZSddO1xuICAgICAgICBpZiAoaXNQdWxsYWJsZShzb3VyY2UpKSB7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLnB1c2goJ3B1bGxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHVzaGFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCdwdXNoYWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1F1ZXJ5YWJsZShzb3VyY2UpKSB7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLnB1c2goJ3F1ZXJ5YWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N5bmNhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGludGVyZmFjZXMucHVzaCgnc3luY2FibGUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNVcGRhdGFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCd1cGRhdGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW50ZXJmYWNlcztcbiAgICB9XG4gICAgX2ludGVyZmFjZUV2ZW50cyhpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb2dMZXZlbCA9PT0gTG9nTGV2ZWwuSW5mbykge1xuICAgICAgICAgICAgc3dpdGNoIChpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncHVsbGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydiZWZvcmVQdWxsJywgJ3B1bGwnLCAncHVsbEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdwdXNoYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVB1c2gnLCAncHVzaCcsICdwdXNoRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVF1ZXJ5JywgJ3F1ZXJ5JywgJ3F1ZXJ5RmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwZGF0YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVVwZGF0ZScsICd1cGRhdGUnLCAndXBkYXRlRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N5bmNhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnYmVmb3JlU3luYycsICdzeW5jJywgJ3N5bmNGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAndHJhbnNmb3JtYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3RyYW5zZm9ybSddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2xvZ0xldmVsID4gTG9nTGV2ZWwuTm9uZSkge1xuICAgICAgICAgICAgc3dpdGNoIChpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncHVsbGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydwdWxsRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3B1c2hhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsncHVzaEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdxdWVyeWFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydxdWVyeUZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdzeW5jYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3N5bmNGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAndXBkYXRhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsndXBkYXRlRmFpbCddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9hZGRMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fZ2VuZXJhdGVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcbiAgICAgICAgZGVlcFNldCh0aGlzLl9ldmVudExpc3RlbmVycywgW3NvdXJjZS5uYW1lLCBldmVudF0sIGxpc3RlbmVyKTtcbiAgICAgICAgc291cmNlLm9uKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XG4gICAgfVxuICAgIF9yZW1vdmVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gZGVlcEdldCh0aGlzLl9ldmVudExpc3RlbmVycywgW3NvdXJjZS5uYW1lLCBldmVudF0pO1xuICAgICAgICBzb3VyY2Uub2ZmKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW3NvdXJjZS5uYW1lXVtldmVudF0gPSBudWxsO1xuICAgIH1cbiAgICBfZ2VuZXJhdGVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fbG9nUHJlZml4LCBzb3VyY2UubmFtZSwgZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbn0iXX0=