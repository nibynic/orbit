var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Orbit from '@orbit/data';
import { assert, objectValues } from '@orbit/utils';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Errors"] = 1] = "Errors";
    LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    LogLevel[LogLevel["Info"] = 3] = "Info";
})(LogLevel || (LogLevel = {}));
/**
 * The Coordinator class manages a set of sources to which it applies a set of
 * coordination strategies.
 *
 * @export
 * @class Coordinator
 */

var Coordinator = function () {
    function Coordinator() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Coordinator);

        this._sources = {};
        this._strategies = {};
        if (options.sources) {
            options.sources.forEach(function (source) {
                return _this.addSource(source);
            });
        }
        if (options.strategies) {
            options.strategies.forEach(function (strategy) {
                return _this.addStrategy(strategy);
            });
        }
        this._defaultActivationOptions = options.defaultActivationOptions || {};
        if (this._defaultActivationOptions.logLevel === undefined) {
            this._defaultActivationOptions.logLevel = LogLevel.Info;
        }
    }

    Coordinator.prototype.addSource = function addSource(source) {
        var name = source.name;
        assert('Sources require a \'name\' to be added to a coordinator.', !!name);
        assert('A source named \'' + name + '\' has already been added to this coordinator.', !this._sources[name]);
        assert('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        this._sources[name] = source;
    };

    Coordinator.prototype.removeSource = function removeSource(name) {
        var source = this._sources[name];
        assert('Source \'' + name + '\' has not been added to this coordinator.', !!source);
        assert('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        delete this._sources[name];
    };

    Coordinator.prototype.getSource = function getSource(name) {
        return this._sources[name];
    };

    Coordinator.prototype.addStrategy = function addStrategy(strategy) {
        var name = strategy.name;
        assert('A strategy named \'' + name + '\' has already been added to this coordinator.', !this._strategies[name]);
        assert('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
        this._strategies[name] = strategy;
    };

    Coordinator.prototype.removeStrategy = function removeStrategy(name) {
        var strategy = this._strategies[name];
        assert('Strategy \'' + name + '\' has not been added to this coordinator.', !!strategy);
        assert('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
        delete this._strategies[name];
    };

    Coordinator.prototype.getStrategy = function getStrategy(name) {
        return this._strategies[name];
    };

    Coordinator.prototype.activate = function activate() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!this._activated) {
            if (options.logLevel === undefined) {
                options.logLevel = this._defaultActivationOptions.logLevel;
            }
            this._currentActivationOptions = options;
            this._activated = this.strategies.reduce(function (chain, strategy) {
                return chain.then(function () {
                    return strategy.activate(_this2, options);
                });
            }, Orbit.Promise.resolve());
        }
        return this._activated;
    };

    Coordinator.prototype.deactivate = function deactivate() {
        var _this3 = this;

        if (this._activated) {
            return this._activated.then(function () {
                return _this3.strategies.reverse().reduce(function (chain, strategy) {
                    return chain.then(function () {
                        return strategy.deactivate();
                    });
                }, Orbit.Promise.resolve());
            }).then(function () {
                _this3._activated = null;
            });
        } else {
            return Orbit.Promise.resolve();
        }
    };

    _createClass(Coordinator, [{
        key: 'sources',
        get: function () {
            return objectValues(this._sources);
        }
    }, {
        key: 'sourceNames',
        get: function () {
            return Object.keys(this._sources);
        }
    }, {
        key: 'strategies',
        get: function () {
            return objectValues(this._strategies);
        }
    }, {
        key: 'strategyNames',
        get: function () {
            return Object.keys(this._strategies);
        }
    }, {
        key: 'activated',
        get: function () {
            return this._activated;
        }
    }]);

    return Coordinator;
}();

export default Coordinator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb3JkaW5hdG9yLmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiYXNzZXJ0Iiwib2JqZWN0VmFsdWVzIiwiTG9nTGV2ZWwiLCJDb29yZGluYXRvciIsIm9wdGlvbnMiLCJfc291cmNlcyIsIl9zdHJhdGVnaWVzIiwic291cmNlcyIsImZvckVhY2giLCJhZGRTb3VyY2UiLCJzb3VyY2UiLCJzdHJhdGVnaWVzIiwiYWRkU3RyYXRlZ3kiLCJzdHJhdGVneSIsIl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMiLCJkZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMiLCJsb2dMZXZlbCIsInVuZGVmaW5lZCIsIkluZm8iLCJuYW1lIiwiX2FjdGl2YXRlZCIsInJlbW92ZVNvdXJjZSIsImdldFNvdXJjZSIsInJlbW92ZVN0cmF0ZWd5IiwiZ2V0U3RyYXRlZ3kiLCJhY3RpdmF0ZSIsIl9jdXJyZW50QWN0aXZhdGlvbk9wdGlvbnMiLCJyZWR1Y2UiLCJjaGFpbiIsInRoZW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsImRlYWN0aXZhdGUiLCJyZXZlcnNlIiwiT2JqZWN0Iiwia2V5cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsYUFBbEI7QUFDQSxTQUFTQyxNQUFULEVBQWlCQyxZQUFqQixRQUFxQyxjQUFyQztBQUNBLE9BQU8sSUFBSUMsUUFBSjtBQUNQLENBQUMsVUFBVUEsUUFBVixFQUFvQjtBQUNqQkEsYUFBU0EsU0FBUyxNQUFULElBQW1CLENBQTVCLElBQWlDLE1BQWpDO0FBQ0FBLGFBQVNBLFNBQVMsUUFBVCxJQUFxQixDQUE5QixJQUFtQyxRQUFuQztBQUNBQSxhQUFTQSxTQUFTLFVBQVQsSUFBdUIsQ0FBaEMsSUFBcUMsVUFBckM7QUFDQUEsYUFBU0EsU0FBUyxNQUFULElBQW1CLENBQTVCLElBQWlDLE1BQWpDO0FBQ0gsQ0FMRCxFQUtHQSxhQUFhQSxXQUFXLEVBQXhCLENBTEg7QUFNQTs7Ozs7Ozs7SUFPcUJDLFc7QUFDakIsMkJBQTBCO0FB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cnQgT3JiaXQgZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYXNzZXJ0LCBvYmplY3RWYWx1ZXMgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IHZhciBMb2dMZXZlbDtcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIk5vbmVcIl0gPSAwXSA9IFwiTm9uZVwiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiRXJyb3JzXCJdID0gMV0gPSBcIkVycm9yc1wiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiV2FybmluZ3NcIl0gPSAyXSA9IFwiV2FybmluZ3NcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkluZm9cIl0gPSAzXSA9IFwiSW5mb1wiO1xufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcbi8qKlxuICogVGhlIENvb3JkaW5hdG9yIGNsYXNzIG1hbmFnZXMgYSBzZXQgb2Ygc291cmNlcyB0byB3aGljaCBpdCBhcHBsaWVzIGEgc2V0IG9mXG4gKiBjb29yZGluYXRpb24gc3RyYXRlZ2llcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgQ29vcmRpbmF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29vcmRpbmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VzID0ge307XG4gICAgICAgIHRoaXMuX3N0cmF0ZWdpZXMgPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc291cmNlcykge1xuICAgICAgICAgICAgb3B0aW9ucy5zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuYWRkU291cmNlKHNvdXJjZSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnN0cmF0ZWdpZXMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3RyYXRlZ2llcy5mb3JFYWNoKHN0cmF0ZWd5ID0+IHRoaXMuYWRkU3RyYXRlZ3koc3RyYXRlZ3kpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMgPSBvcHRpb25zLmRlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMubG9nTGV2ZWwgPSBMb2dMZXZlbC5JbmZvO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHNvdXJjZS5uYW1lO1xuICAgICAgICBhc3NlcnQoYFNvdXJjZXMgcmVxdWlyZSBhICduYW1lJyB0byBiZSBhZGRlZCB0byBhIGNvb3JkaW5hdG9yLmAsICEhbmFtZSk7XG4gICAgICAgIGFzc2VydChgQSBzb3VyY2UgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc291cmNlc1tuYW1lXSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHNvdXJjZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgdGhpcy5fc291cmNlc1tuYW1lXSA9IHNvdXJjZTtcbiAgICB9XG4gICAgcmVtb3ZlU291cmNlKG5hbWUpIHtcbiAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMuX3NvdXJjZXNbbmFtZV07XG4gICAgICAgIGFzc2VydChgU291cmNlICcke25hbWV9JyBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhIXNvdXJjZSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHNvdXJjZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNbbmFtZV07XG4gICAgfVxuICAgIGdldFNvdXJjZShuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzW25hbWVdO1xuICAgIH1cbiAgICBnZXQgc291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFZhbHVlcyh0aGlzLl9zb3VyY2VzKTtcbiAgICB9XG4gICAgZ2V0IHNvdXJjZU5hbWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc291cmNlcyk7XG4gICAgfVxuICAgIGFkZFN0cmF0ZWd5KHN0cmF0ZWd5KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBzdHJhdGVneS5uYW1lO1xuICAgICAgICBhc3NlcnQoYEEgc3RyYXRlZ3kgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHN0cmF0ZWdpZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSA9IHN0cmF0ZWd5O1xuICAgIH1cbiAgICByZW1vdmVTdHJhdGVneShuYW1lKSB7XG4gICAgICAgIGxldCBzdHJhdGVneSA9IHRoaXMuX3N0cmF0ZWdpZXNbbmFtZV07XG4gICAgICAgIGFzc2VydChgU3RyYXRlZ3kgJyR7bmFtZX0nIGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIGNvb3JkaW5hdG9yLmAsICEhc3RyYXRlZ3kpO1xuICAgICAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzdHJhdGVnaWVzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xuICAgIH1cbiAgICBnZXRTdHJhdGVneShuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xuICAgIH1cbiAgICBnZXQgc3RyYXRlZ2llcygpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFZhbHVlcyh0aGlzLl9zdHJhdGVnaWVzKTtcbiAgICB9XG4gICAgZ2V0IHN0cmF0ZWd5TmFtZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9zdHJhdGVnaWVzKTtcbiAgICB9XG4gICAgZ2V0IGFjdGl2YXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcbiAgICB9XG4gICAgYWN0aXZhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZhdGVkKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sb2dMZXZlbCA9IHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmF0aW9uT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZWQgPSB0aGlzLnN0cmF0ZWdpZXMucmVkdWNlKChjaGFpbiwgc3RyYXRlZ3kpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzdHJhdGVneS5hY3RpdmF0ZSh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2YXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJhdGVnaWVzLnJldmVyc2UoKS5yZWR1Y2UoKGNoYWluLCBzdHJhdGVneSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzdHJhdGVneS5kZWFjdGl2YXRlKCkpO1xuICAgICAgICAgICAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2YXRlZCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=