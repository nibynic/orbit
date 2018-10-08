'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogLevel = undefined;

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogLevel = exports.LogLevel = undefined;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Errors"] = 1] = "Errors";
    LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    LogLevel[LogLevel["Info"] = 3] = "Info";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * The Coordinator class manages a set of sources to which it applies a set of
 * coordination strategies.
 *
 * @export
 * @class Coordinator
 */
class Coordinator {
    constructor(options = {}) {
        this._sources = {};
        this._strategies = {};
        if (options.sources) {
            options.sources.forEach(source => this.addSource(source));
        }
        if (options.strategies) {
            options.strategies.forEach(strategy => this.addStrategy(strategy));
        }
        this._defaultActivationOptions = options.defaultActivationOptions || {};
        if (this._defaultActivationOptions.logLevel === undefined) {
            this._defaultActivationOptions.logLevel = LogLevel.Info;
        }
    }
    addSource(source) {
        const name = source.name;
        (0, _utils.assert)(`Sources require a 'name' to be added to a coordinator.`, !!name);
        (0, _utils.assert)(`A source named '${name}' has already been added to this coordinator.`, !this._sources[name]);
        (0, _utils.assert)(`A coordinator's sources can not be changed while it is active.`, !this._activated);
        this._sources[name] = source;
    }
    removeSource(name) {
        let source = this._sources[name];
        (0, _utils.assert)(`Source '${name}' has not been added to this coordinator.`, !!source);
        (0, _utils.assert)(`A coordinator's sources can not be changed while it is active.`, !this._activated);
        delete this._sources[name];
    }
    getSource(name) {
        return this._sources[name];
    }
    get sources() {
        return (0, _utils.objectValues)(this._sources);
    }
    get sourceNames() {
        return Object.keys(this._sources);
    }
    addStrategy(strategy) {
        const name = strategy.name;
        (0, _utils.assert)(`A strategy named '${name}' has already been added to this coordinator.`, !this._strategies[name]);
        (0, _utils.assert)(`A coordinator's strategies can not be changed while it is active.`, !this._activated);
        this._strategies[name] = strategy;
    }
    removeStrategy(name) {
        let strategy = this._strategies[name];
        (0, _utils.assert)(`Strategy '${name}' has not been added to this coordinator.`, !!strategy);
        (0, _utils.assert)(`A coordinator's strategies can not be changed while it is active.`, !this._activated);
        delete this._strategies[name];
    }
    getStrategy(name) {
        return this._strategies[name];
    }
    get strategies() {
        return (0, _utils.objectValues)(this._strategies);
    }
    get strategyNames() {
        return Object.keys(this._strategies);
    }
    get activated() {
        return this._activated;
    }
    activate(options = {}) {
        if (!this._activated) {
            if (options.logLevel === undefined) {
                options.logLevel = this._defaultActivationOptions.logLevel;
            }
            this._currentActivationOptions = options;
            this._activated = this.strategies.reduce((chain, strategy) => {
                return chain.then(() => strategy.activate(this, options));
            }, _data2.default.Promise.resolve());
        }
        return this._activated;
    }
    deactivate() {
        if (this._activated) {
            return this._activated.then(() => {
                return this.strategies.reverse().reduce((chain, strategy) => {
                    return chain.then(() => strategy.deactivate());
                }, _data2.default.Promise.resolve());
            }).then(() => {
                this._activated = null;
            });
        } else {
            return _data2.default.Promise.resolve();
        }
    }
}
exports.default = Coordinator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb3JkaW5hdG9yLmpzIl0sIm5hbWVzIjpbIkxvZ0xldmVsIiwiQ29vcmRpbmF0b3IiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJfc291cmNlcyIsIl9zdHJhdGVnaWVzIiwic291cmNlcyIsImZvckVhY2giLCJzb3VyY2UiLCJhZGRTb3VyY2UiLCJzdHJhdGVnaWVzIiwic3RyYXRlZ3kiLCJhZGRTdHJhdGVneSIsIl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMiLCJkZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMiLCJsb2dMZXZlbCIsInVuZGVmaW5lZCIsIkluZm8iLCJuYW1lIiwiX2FjdGl2YXRlZCIsInJlbW92ZVNvdXJjZSIsImdldFNvdXJjZSIsInNvdXJjZU5hbWVzIiwiT2JqZWN0Iiwia2V5cyIsInJlbW92ZVN0cmF0ZWd5IiwiZ2V0U3RyYXRlZ3kiLCJzdHJhdGVneU5hbWVzIiwiYWN0aXZhdGVkIiwiYWN0aXZhdGUiLCJfY3VycmVudEFjdGl2YXRpb25PcHRpb25zIiwicmVkdWNlIiwiY2hhaW4iLCJ0aGVuIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImRlYWN0aXZhdGUiLCJyZXZlcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNPLElBQUlBLHVDQUFKO0FBQ1AsQ0FBQyxVQUFVQSxRQUFWLEVBQW9CO0FBQ2pCQSxhQUFTQSxTQUFTLE1BQVQsSUFBbUIsQ0FBNUIsSUFBaUMsTUFBakM7QUFDQUEsYUFBU0EsU0FBUyxRQUFULElBQXFCLENBQTlCLElBQW1DLFFBQW5DO0FBQ0FBLGFBQVNBLFNBQVMsVUFBVCxJQUF1QixDQUFoQyxJQUFxQyxVQUFyQztBQUNBQSxhQUFTQSxTQUFTLE1BQVQsSUFBbUIsQ0FBNUIsSUFBaUMsTUFBakM7QUFDSCxDQUxELEVBS0dBLHFCQU5RQSxRQU1SLEdBQWFBLFdBQVcsRUFBeEIsQ0FMSDtBQU1BOzs7Ozs7O0FBT2UsTUFBTUMsV0FBTixDQUFrQjtBQUM3QkMsZ0JBQVlD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b3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCwgb2JqZWN0VmFsdWVzIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCB2YXIgTG9nTGV2ZWw7XG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJOb25lXCJdID0gMF0gPSBcIk5vbmVcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVycm9yc1wiXSA9IDFdID0gXCJFcnJvcnNcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIldhcm5pbmdzXCJdID0gMl0gPSBcIldhcm5pbmdzXCI7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJbmZvXCJdID0gM10gPSBcIkluZm9cIjtcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XG4vKipcbiAqIFRoZSBDb29yZGluYXRvciBjbGFzcyBtYW5hZ2VzIGEgc2V0IG9mIHNvdXJjZXMgdG8gd2hpY2ggaXQgYXBwbGllcyBhIHNldCBvZlxuICogY29vcmRpbmF0aW9uIHN0cmF0ZWdpZXMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENvb3JkaW5hdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvb3JkaW5hdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5fc291cmNlcyA9IHt9O1xuICAgICAgICB0aGlzLl9zdHJhdGVnaWVzID0ge307XG4gICAgICAgIGlmIChvcHRpb25zLnNvdXJjZXMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB0aGlzLmFkZFNvdXJjZShzb3VyY2UpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5zdHJhdGVnaWVzKSB7XG4gICAgICAgICAgICBvcHRpb25zLnN0cmF0ZWdpZXMuZm9yRWFjaChzdHJhdGVneSA9PiB0aGlzLmFkZFN0cmF0ZWd5KHN0cmF0ZWd5KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zID0gb3B0aW9ucy5kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMgfHwge307XG4gICAgICAgIGlmICh0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMubG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fZGVmYXVsdEFjdGl2YXRpb25PcHRpb25zLmxvZ0xldmVsID0gTG9nTGV2ZWwuSW5mbztcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGRTb3VyY2Uoc291cmNlKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBzb3VyY2UubmFtZTtcbiAgICAgICAgYXNzZXJ0KGBTb3VyY2VzIHJlcXVpcmUgYSAnbmFtZScgdG8gYmUgYWRkZWQgdG8gYSBjb29yZGluYXRvci5gLCAhIW5hbWUpO1xuICAgICAgICBhc3NlcnQoYEEgc291cmNlIG5hbWVkICcke25hbWV9JyBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgIXRoaXMuX3NvdXJjZXNbbmFtZV0pO1xuICAgICAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzb3VyY2VzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNbbmFtZV0gPSBzb3VyY2U7XG4gICAgfVxuICAgIHJlbW92ZVNvdXJjZShuYW1lKSB7XG4gICAgICAgIGxldCBzb3VyY2UgPSB0aGlzLl9zb3VyY2VzW25hbWVdO1xuICAgICAgICBhc3NlcnQoYFNvdXJjZSAnJHtuYW1lfScgaGFzIG5vdCBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgISFzb3VyY2UpO1xuICAgICAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzb3VyY2VzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zb3VyY2VzW25hbWVdO1xuICAgIH1cbiAgICBnZXRTb3VyY2UobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlc1tuYW1lXTtcbiAgICB9XG4gICAgZ2V0IHNvdXJjZXMoKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RWYWx1ZXModGhpcy5fc291cmNlcyk7XG4gICAgfVxuICAgIGdldCBzb3VyY2VOYW1lcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXMpO1xuICAgIH1cbiAgICBhZGRTdHJhdGVneShzdHJhdGVneSkge1xuICAgICAgICBjb25zdCBuYW1lID0gc3RyYXRlZ3kubmFtZTtcbiAgICAgICAgYXNzZXJ0KGBBIHN0cmF0ZWd5IG5hbWVkICcke25hbWV9JyBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIHRoaXMgY29vcmRpbmF0b3IuYCwgIXRoaXMuX3N0cmF0ZWdpZXNbbmFtZV0pO1xuICAgICAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzdHJhdGVnaWVzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWdpZXNbbmFtZV0gPSBzdHJhdGVneTtcbiAgICB9XG4gICAgcmVtb3ZlU3RyYXRlZ3kobmFtZSkge1xuICAgICAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xuICAgICAgICBhc3NlcnQoYFN0cmF0ZWd5ICcke25hbWV9JyBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhIXN0cmF0ZWd5KTtcbiAgICAgICAgYXNzZXJ0KGBBIGNvb3JkaW5hdG9yJ3Mgc3RyYXRlZ2llcyBjYW4gbm90IGJlIGNoYW5nZWQgd2hpbGUgaXQgaXMgYWN0aXZlLmAsICF0aGlzLl9hY3RpdmF0ZWQpO1xuICAgICAgICBkZWxldGUgdGhpcy5fc3RyYXRlZ2llc1tuYW1lXTtcbiAgICB9XG4gICAgZ2V0U3RyYXRlZ3kobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RyYXRlZ2llc1tuYW1lXTtcbiAgICB9XG4gICAgZ2V0IHN0cmF0ZWdpZXMoKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RWYWx1ZXModGhpcy5fc3RyYXRlZ2llcyk7XG4gICAgfVxuICAgIGdldCBzdHJhdGVneU5hbWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc3RyYXRlZ2llcyk7XG4gICAgfVxuICAgIGdldCBhY3RpdmF0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWQ7XG4gICAgfVxuICAgIGFjdGl2YXRlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2YXRlZCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubG9nTGV2ZWwgPSB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMubG9nTGV2ZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50QWN0aXZhdGlvbk9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5fYWN0aXZhdGVkID0gdGhpcy5zdHJhdGVnaWVzLnJlZHVjZSgoY2hhaW4sIHN0cmF0ZWd5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gc3RyYXRlZ3kuYWN0aXZhdGUodGhpcywgb3B0aW9ucykpO1xuICAgICAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWQ7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyYXRlZ2llcy5yZXZlcnNlKCkucmVkdWNlKChjaGFpbiwgc3RyYXRlZ3kpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gc3RyYXRlZ3kuZGVhY3RpdmF0ZSgpKTtcbiAgICAgICAgICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZWQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9XG59Il19