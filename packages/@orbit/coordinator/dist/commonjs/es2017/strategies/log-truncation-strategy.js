'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogTruncationStrategy = undefined;

var _strategy = require('../strategy');

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LogTruncationStrategy extends _strategy.Strategy {
    constructor(options = {}) {
        options.name = options.name || 'log-truncation';
        super(options);
    }
    activate(coordinator, options = {}) {
        return super.activate(coordinator, options).then(() => {
            return this._reifySources();
        }).then(() => {
            this._transformListeners = {};
            this._sources.forEach(source => this._activateSource(source));
        });
    }
    deactivate() {
        return super.deactivate().then(() => {
            this._sources.forEach(source => this._deactivateSource(source));
            this._transformListeners = null;
        });
    }
    _reifySources() {
        return this._sources.reduce((chain, source) => {
            return chain.then(() => source.transformLog.reified);
        }, _data2.default.Promise.resolve());
    }
    _review(source) {
        let sources = this._sources;
        let transformId = source.transformLog.head;
        if (transformId && sources.length > 1) {
            let match = true;
            for (let i = 0; i < sources.length; i++) {
                let s = sources[i];
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
    }
    _truncateSources(transformId, relativePosition) {
        return this._sources.reduce((chain, source) => {
            return chain.then(() => source.transformLog.truncate(transformId, relativePosition));
        }, _data2.default.Promise.resolve());
    }
    _activateSource(source) {
        const listener = this._transformListeners[source.name] = () => {
            if (source.requestQueue.empty && source.syncQueue.empty) {
                return this._review(source);
            }
        };
        source.syncQueue.on('complete', listener);
        source.requestQueue.on('complete', listener);
    }
    _deactivateSource(source) {
        const listener = this._transformListeners[source.name];
        source.syncQueue.off('complete', listener);
        source.requestQueue.off('complete', listener);
        delete this._transformListeners[source.name];
    }
}
exports.LogTruncationStrategy = LogTruncationStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvbG9nLXRydW5jYXRpb24tc3RyYXRlZ3kuanMiXSwibmFtZXMiOlsiTG9nVHJ1bmNhdGlvblN0cmF0ZWd5IiwiU3RyYXRlZ3kiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJuYW1lIiwiYWN0aXZhdGUiLCJjb29yZGluYXRvciIsInRoZW4iLCJfcmVpZnlTb3VyY2VzIiwiX3RyYW5zZm9ybUxpc3RlbmVycyIsIl9zb3VyY2VzIiwiZm9yRWFjaCIsInNvdXJjZSIsIl9hY3RpdmF0ZVNvdXJjZSIsImRlYWN0aXZhdGUiLCJfZGVhY3RpdmF0ZVNvdXJjZSIsInJlZHVjZSIsImNoYWluIiwidHJhbnNmb3JtTG9nIiwicmVpZmllZCIsIk9yYml0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJfcmV2aWV3Iiwic291cmNlcyIsInRyYW5zZm9ybUlkIiwiaGVhZCIsImxlbmd0aCIsIm1hdGNoIiwiaSIsInMiLCJyZXF1ZXN0UXVldWUiLCJlbXB0eSIsInN5bmNRdWV1ZSIsImNvbnRhaW5zIiwiX3RydW5jYXRlU291cmNlcyIsInJlbGF0aXZlUG9zaXRpb24iLCJ0cnVuY2F0ZSIsImxpc3RlbmVyIiwib24iLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBQ08sTUFBTUEscUJBQU4sU0FBb0NDLGtCQUFwQyxDQUE2QztBQUNoREMsZ0JBQVlDLFVBQVUsRUFBdEIsRUFBMEI7QUFDdEJBLGdCQUFRQyxJQUFSLEdBQWVELFFBQVFDLElBQVIsSUFBZ0IsZ0JBQS9CO0FBQ0EsY0FBTUQsT0FBTjtBQUNIO0FBQ0RFLGFBQVNDLFdBQVQsRUFBc0JILFVBQVUsRUFBaEMsRUFBb0M7QUFDaEMsZUFBTyxNQUFNRSxRQUFOLENBQWVDLFdBQWYsRUFBNEJILE9BQTVCLEVBQXFDSSxJQUFyQyxDQUEwQyxNQUFNO0FBQ25ELG1CQUFPLEtBQUtDLGFBQUwsRUFBUDtBQUNILFNBRk0sRUFFSkQsSUFGSSxDQUVDLE1BQU07QUFDVixpQkFBS0Us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QW9CUyxHQUFwQixDQUF3QixVQUF4QixFQUFvQ0YsUUFBcEM7QUFDQSxlQUFPLEtBQUs3QixtQkFBTCxDQUF5QkcsT0FBT1IsSUFBaEMsQ0FBUDtBQUNIO0FBOUQrQztRQUF2Q0oscUIsR0FBQUEscUIiLCJmaWxlIjoic3RyYXRlZ2llcy9sb2ctdHJ1bmNhdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xuaW1wb3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmV4cG9ydCBjbGFzcyBMb2dUcnVuY2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnbG9nLXRydW5jYXRpb24nO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZ5U291cmNlcygpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUxpc3RlbmVycyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLl9hY3RpdmF0ZVNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSk7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3JlaWZ5U291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXMucmVkdWNlKChjaGFpbiwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzb3VyY2UudHJhbnNmb3JtTG9nLnJlaWZpZWQpO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgfVxuICAgIF9yZXZpZXcoc291cmNlKSB7XG4gICAgICAgIGxldCBzb3VyY2VzID0gdGhpcy5fc291cmNlcztcbiAgICAgICAgbGV0IHRyYW5zZm9ybUlkID0gc291cmNlLnRyYW5zZm9ybUxvZy5oZWFkO1xuICAgICAgICBpZiAodHJhbnNmb3JtSWQgJiYgc291cmNlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBzb3VyY2VzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzICE9PSBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzLnJlcXVlc3RRdWV1ZS5lbXB0eSB8fCAhcy5zeW5jUXVldWUuZW1wdHkgfHwgIXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybUlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3RydW5jYXRlU291cmNlcyh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlcy5yZWR1Y2UoKGNoYWluLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHNvdXJjZS50cmFuc2Zvcm1Mb2cudHJ1bmNhdGUodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pKTtcbiAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgIH1cbiAgICBfYWN0aXZhdGVTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UucmVxdWVzdFF1ZXVlLmVtcHR5ICYmIHNvdXJjZS5zeW5jUXVldWUuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmV2aWV3KHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zeW5jUXVldWUub24oJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgICAgICBzb3VyY2UucmVxdWVzdFF1ZXVlLm9uKCdjb21wbGV0ZScsIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgX2RlYWN0aXZhdGVTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdHJhbnNmb3JtTGlzdGVuZXJzW3NvdXJjZS5uYW1lXTtcbiAgICAgICAgc291cmNlLnN5bmNRdWV1ZS5vZmYoJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgICAgICBzb3VyY2UucmVxdWVzdFF1ZXVlLm9mZignY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1MaXN0ZW5lcnNbc291cmNlLm5hbWVdO1xuICAgIH1cbn0iXX0=