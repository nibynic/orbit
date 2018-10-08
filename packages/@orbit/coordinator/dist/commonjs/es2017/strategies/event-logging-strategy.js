'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventLoggingStrategy = undefined;

var _coordinator = require('../coordinator');

var _strategy = require('../strategy');

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

class EventLoggingStrategy extends _strategy.Strategy {
    constructor(options = {}) {
        options.name = options.name || 'event-logging';
        super(options);
        this._events = options.events;
        this._interfaces = options.interfaces;
        this._logPrefix = options.logPrefix || '[source-event]';
    }
    activate(coordinator, options = {}) {
        return super.activate(coordinator, options).then(() => {
            this._eventListeners = {};
            this._sources.forEach(source => this._activateSource(source));
        });
    }
    deactivate() {
        return super.deactivate().then(() => {
            this._sources.forEach(source => this._deactivateSource(source));
            this._eventListeners = null;
        });
    }
    _activateSource(source) {
        this._sourceEvents(source).forEach(event => {
            this._addListener(source, event);
        });
    }
    _deactivateSource(source) {
        this._sourceEvents(source).forEach(event => {
            this._removeListener(source, event);
        });
    }
    _sourceEvents(source) {
        if (this._events) {
            return this._events;
        } else {
            let events = [];
            let interfaces = this._interfaces || this._sourceInterfaces(source);
            interfaces.forEach(i => {
                Array.prototype.push.apply(events, this._interfaceEvents(i));
            });
            return events;
        }
    }
    _sourceInterfaces(source) {
        let interfaces = ['transformable'];
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
    }
    _interfaceEvents(interfaceName) {
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
    }
    _addListener(source, event) {
        const listener = this._generateListener(source, event);
        (0, _utils.deepSet)(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    }
    _removeListener(source, event) {
        const listener = (0, _utils.deepGet)(this._eventListeners, [source.name, event]);
        source.off(event, listener, this);
        this._eventListeners[source.name][event] = null;
    }
    _generateListener(source, event) {
        return (...args) => {
            console.log(this._logPrefix, source.name, event, ...args);
        };
    }
}
exports.EventLoggingStrategy = EventLoggingStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvZXZlbnQtbG9nZ2luZy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJFdmVudExvZ2dpbmdTdHJhdGVneSIsIlN0cmF0ZWd5IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwibmFtZSIsIl9ldmVudHMiLCJldmVudHMiLCJfaW50ZXJmYWNlcyIsImludGVyZmFjZXMiLCJfbG9nUHJlZml4IiwibG9nUHJlZml4IiwiYWN0aXZhdGUiLCJjb29yZGluYXRvciIsInRoZW4iLCJfZXZlbnRMaXN0ZW5lcnMiLCJfc291cmNlcyIsImZvckVhY2giLCJzb3VyY2UiLCJfYWN0aXZhdGVTb3VyY2UiLCJkZWFjdGl2YXRlIiwiX2RlYWN0aXZhdGVTb3VyY2UiLCJfc291cmNlRXZlbnRzIiwiZXZlbnQiLCJfYWRkTGlzdGVuZXIiLCJfcmVtb3ZlTGlzdGVuZXIiLCJfc291cmNlSW50ZXJmYWNlcyIsImkiLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsIl9pbnRlcmZhY2VFdmVudHMiLCJpbnRlcmZhY2VOYW1lIiwiX2xvZ0xldmVsIiwiTG9nTGV2ZWwiLCJJbmZvIiwiTm9uZSIsImxpc3RlbmVyIiwiX2dlbmVyYXRlTGlzdGVuZXIiLCJvbiIsIm9mZiIsImFyZ3MiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ08sTUFBTUEsb0JBQU4sU0FBbUNDLGtCQUFuQyxDQUE0QztBQUMvQ0MsZ0JBQVlDLFVBQVUsRUFBdEIsRUFBMEI7QUFDdEJBLGdCQUFRQyxJQUFSLEdBQWVELFFBQVFDLElBQVIsSUFBZ0IsZUFBL0I7QUFDQSxjQUFNRCxPQUFOO0FBQ0EsYUFBS0UsT0FBTCxHQUFlRixRQUFRRyxNQUF2QjtBQUNBLGFBQUtDLFdBQUwsR0FBbUJKLFFBQVFLLFVBQTNCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQk4sUUFBUU8sU0FBUixJQUFxQixnQkFBdkM7QUFDSDtBQUNEQyxhQUFT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Z0Isc0JBQWtCckIsTUFBbEIsRUFBMEJLLEtBQTFCLEVBQWlDO0FBQzdCLGVBQU8sQ0FBQyxHQUFHbUIsSUFBSixLQUFhO0FBQ2hCQyxvQkFBUUMsR0FBUixDQUFZLEtBQUtsQyxVQUFqQixFQUE2QlEsT0FBT2IsSUFBcEMsRUFBMENrQixLQUExQyxFQUFpRCxHQUFHbUIsSUFBcEQ7QUFDSCxTQUZEO0FBR0g7QUExRzhDO1FBQXRDekMsb0IsR0FBQUEsb0IiLCJmaWxlIjoic3RyYXRlZ2llcy9ldmVudC1sb2dnaW5nLXN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tICcuLi9jb29yZGluYXRvcic7XG5pbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJy4uL3N0cmF0ZWd5JztcbmltcG9ydCB7IGlzUHVsbGFibGUsIGlzUHVzaGFibGUsIGlzUXVlcnlhYmxlLCBpc1N5bmNhYmxlLCBpc1VwZGF0YWJsZSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGRlZXBHZXQsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IGNsYXNzIEV2ZW50TG9nZ2luZ1N0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2V2ZW50LWxvZ2dpbmcnO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gb3B0aW9ucy5ldmVudHM7XG4gICAgICAgIHRoaXMuX2ludGVyZmFjZXMgPSBvcHRpb25zLmludGVyZmFjZXM7XG4gICAgICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8ICdbc291cmNlLWV2ZW50XSc7XG4gICAgfVxuICAgIGFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0ge307XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2FjdGl2YXRlU291cmNlKHNvdXJjZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gdGhpcy5fZGVhY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5fc291cmNlRXZlbnRzKHNvdXJjZSkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLl9hZGRMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9kZWFjdGl2YXRlU291cmNlKHNvdXJjZSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VFdmVudHMoc291cmNlKS5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyKHNvdXJjZSwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3NvdXJjZUV2ZW50cyhzb3VyY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBldmVudHMgPSBbXTtcbiAgICAgICAgICAgIGxldCBpbnRlcmZhY2VzID0gdGhpcy5faW50ZXJmYWNlcyB8fCB0aGlzLl9zb3VyY2VJbnRlcmZhY2VzKHNvdXJjZSk7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZXZlbnRzLCB0aGlzLl9pbnRlcmZhY2VFdmVudHMoaSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9zb3VyY2VJbnRlcmZhY2VzKHNvdXJjZSkge1xuICAgICAgICBsZXQgaW50ZXJmYWNlcyA9IFsndHJhbnNmb3JtYWJsZSddO1xuICAgICAgICBpZiAoaXNQdWxsYWJsZShzb3VyY2UpKSB7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLnB1c2goJ3B1bGxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHVzaGFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCdwdXNoYWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1F1ZXJ5YWJsZShzb3VyY2UpKSB7XG4gICAgICAgICAgICBpbnRlcmZhY2VzLnB1c2goJ3F1ZXJ5YWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N5bmNhYmxlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGludGVyZmFjZXMucHVzaCgnc3luY2FibGUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNVcGRhdGFibGUoc291cmNlKSkge1xuICAgICAgICAgICAgaW50ZXJmYWNlcy5wdXNoKCd1cGRhdGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW50ZXJmYWNlcztcbiAgICB9XG4gICAgX2ludGVyZmFjZUV2ZW50cyhpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb2dMZXZlbCA9PT0gTG9nTGV2ZWwuSW5mbykge1xuICAgICAgICAgICAgc3dpdGNoIChpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncHVsbGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydiZWZvcmVQdWxsJywgJ3B1bGwnLCAncHVsbEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdwdXNoYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVB1c2gnLCAncHVzaCcsICdwdXNoRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVF1ZXJ5JywgJ3F1ZXJ5JywgJ3F1ZXJ5RmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwZGF0YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ2JlZm9yZVVwZGF0ZScsICd1cGRhdGUnLCAndXBkYXRlRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N5bmNhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnYmVmb3JlU3luYycsICdzeW5jJywgJ3N5bmNGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAndHJhbnNmb3JtYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3RyYW5zZm9ybSddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2xvZ0xldmVsID4gTG9nTGV2ZWwuTm9uZSkge1xuICAgICAgICAgICAgc3dpdGNoIChpbnRlcmZhY2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncHVsbGFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydwdWxsRmFpbCddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3B1c2hhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsncHVzaEZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdxdWVyeWFibGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWydxdWVyeUZhaWwnXTtcbiAgICAgICAgICAgICAgICBjYXNlICdzeW5jYWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJ3N5bmNGYWlsJ107XG4gICAgICAgICAgICAgICAgY2FzZSAndXBkYXRhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsndXBkYXRlRmFpbCddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9hZGRMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fZ2VuZXJhdGVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KTtcbiAgICAgICAgZGVlcFNldCh0aGlzLl9ldmVudExpc3RlbmVycywgW3NvdXJjZS5uYW1lLCBldmVudF0sIGxpc3RlbmVyKTtcbiAgICAgICAgc291cmNlLm9uKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XG4gICAgfVxuICAgIF9yZW1vdmVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gZGVlcEdldCh0aGlzLl9ldmVudExpc3RlbmVycywgW3NvdXJjZS5uYW1lLCBldmVudF0pO1xuICAgICAgICBzb3VyY2Uub2ZmKGV2ZW50LCBsaXN0ZW5lciwgdGhpcyk7XG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW3NvdXJjZS5uYW1lXVtldmVudF0gPSBudWxsO1xuICAgIH1cbiAgICBfZ2VuZXJhdGVMaXN0ZW5lcihzb3VyY2UsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fbG9nUHJlZml4LCBzb3VyY2UubmFtZSwgZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbn0iXX0=