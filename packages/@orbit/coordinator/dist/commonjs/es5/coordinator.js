"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogLevel = undefined;

var _data = require("@orbit/data");

var _data2 = _interopRequireDefault(_data);

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
        (0, _utils.assert)('Sources require a \'name\' to be added to a coordinator.', !!name);
        (0, _utils.assert)('A source named \'' + name + '\' has already been added to this coordinator.', !this._sources[name]);
        (0, _utils.assert)('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        this._sources[name] = source;
    };

    Coordinator.prototype.removeSource = function removeSource(name) {
        var source = this._sources[name];
        (0, _utils.assert)('Source \'' + name + '\' has not been added to this coordinator.', !!source);
        (0, _utils.assert)('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        delete this._sources[name];
    };

    Coordinator.prototype.getSource = function getSource(name) {
        return this._sources[name];
    };

    Coordinator.prototype.addStrategy = function addStrategy(strategy) {
        var name = strategy.name;
        (0, _utils.assert)('A strategy named \'' + name + '\' has already been added to this coordinator.', !this._strategies[name]);
        (0, _utils.assert)('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
        this._strategies[name] = strategy;
    };

    Coordinator.prototype.removeStrategy = function removeStrategy(name) {
        var strategy = this._strategies[name];
        (0, _utils.assert)('Strategy \'' + name + '\' has not been added to this coordinator.', !!strategy);
        (0, _utils.assert)('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
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
            }, _data2.default.Promise.resolve());
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
                }, _data2.default.Promise.resolve());
            }).then(function () {
                _this3._activated = null;
            });
        } else {
            return _data2.default.Promise.resolve();
        }
    };

    _createClass(Coordinator, [{
        key: 'sources',
        get: function () {
            return (0, _utils.objectValues)(this._sources);
        }
    }, {
        key: 'sourceNames',
        get: function () {
            return Object.keys(this._sources);
        }
    }, {
        key: 'strategies',
        get: function () {
            return (0, _utils.objectValues)(this._strategies);
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

exports.default = Coordinator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb3JkaW5hdG9yLmpzIl0sIm5hbWVzIjpbIkxvZ0xldmVsIiwiQ29vcmRpbmF0b3IiLCJvcHRpb25zIiwiYWRkU291cmNlIiwic291cmNlIiwibmFtZSIsImFzc2VydCIsInJlbW92ZVNvdXJjZSIsImdldFNvdXJjZSIsIm9iamVjdFZhbHVlcyIsIk9iamVjdCIsImFkZFN0cmF0ZWd5Iiwic3RyYXRlZ3kiLCJyZW1vdmVTdHJhdGVneSIsImdldFN0cmF0ZWd5IiwiYWN0aXZhdGUiLCJPcmJpdCIsImRlYWN0aXZhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNPLElBQUEsdUNBQUE7QUFDUCxDQUFDLFVBQUEsUUFBQSxFQUFvQjtBQUNqQkEsYUFBU0EsU0FBQUEsTUFBQUEsSUFBVEEsQ0FBQUEsSUFBQUEsTUFBQUE7QUFDQUEsYUFBU0EsU0FBQUEsUUFBQUEsSUFBVEEsQ0FBQUEsSUFBQUEsUUFBQUE7QUFDQUEsYUFBU0EsU0FBQUEsVUFBQUEsSUFBVEEsQ0FBQUEsSUFBQUEsVUFBQUE7QUFDQUEsYUFBU0EsU0FBQUEsTUFBQUEsSUFBVEEsQ0FBQUEsSUFBQUEsTUFBQUE7QUFKSixDQUFBLEVBS0dBLHFCQU5JLFFBTUpBLEdBQWFBLFdBTGhCLEVBS0dBLENBTEg7QUFNQTs7Ozs7Ozs7SUFPcUJDLGM7QUFDakIsYUFBQSxXQUFBLEdBQTBCO0FBQUEsWUFBQSxRQUFBLElBQUE7O0FBQUEsWUFBZEMsVUFBYyxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsV0FBQTs7QUFDdEIsYUFBQSxRQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEsV0FBQSxHQUFBLEVBQUE7QUFDQSxZQUFJQSxRQUFKLE9BQUEsRUFBcUI7QUFDakJBLG9CQUFBQSxPQUFBQSxDQUFBQSxPQUFBQSxDQUF3QixV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QWxCLGlCQUFPLENBQVA7QUFEYyxhQUFBLEVBRWZJLGVBQUFBLE9BQUFBLENBRkgsT0FFR0EsRUFGZSxDQUFsQjtBQUdIO0FBQ0QsZUFBTyxLQUFQLFVBQUE7OzswQkFFSkMsVSx5QkFBYTtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUNULFlBQUksS0FBSixVQUFBLEVBQXFCO0FBQ2pCLG1CQUFPLEtBQUEsVUFBQSxDQUFBLElBQUEsQ0FBcUIsWUFBTTtBQUM5Qix1QkFBTyxPQUFBLFVBQUEsQ0FBQSxPQUFBLEdBQUEsTUFBQSxDQUFpQyxVQUFBLEtBQUEsRUFBQSxRQUFBLEVBQXFCO0FBQ3pELDJCQUFPLE1BQUEsSUFBQSxDQUFXLFlBQUE7QUFBQSwrQkFBTUwsU0FBTixVQUFNQSxFQUFOO0FBQWxCLHFCQUFPLENBQVA7QUFERyxpQkFBQSxFQUVKSSxlQUFBQSxPQUFBQSxDQUZILE9BRUdBLEVBRkksQ0FBUDtBQURHLGFBQUEsRUFBQSxJQUFBLENBSUMsWUFBTTtBQUNWLHVCQUFBLFVBQUEsR0FBQSxJQUFBO0FBTEosYUFBTyxDQUFQO0FBREosU0FBQSxNQVFPO0FBQ0gsbUJBQU9BLGVBQUFBLE9BQUFBLENBQVAsT0FBT0EsRUFBUDtBQUNIOzs7Ozt5QkFyRFM7QUFDVixtQkFBT1AseUJBQWEsS0FBcEIsUUFBT0EsQ0FBUDtBQUNIOzs7eUJBQ2lCO0FBQ2QsbUJBQU9DLE9BQUFBLElBQUFBLENBQVksS0FBbkIsUUFBT0EsQ0FBUDtBQUNIOzs7eUJBZ0JnQjtBQUNiLG1CQUFPRCx5QkFBYSxLQUFwQixXQUFPQSxDQUFQO0FBQ0g7Ozt5QkFDbUI7QUFDaEIsbUJBQU9DLE9BQUFBLElBQUFBLENBQVksS0FBbkIsV0FBT0EsQ0FBUDtBQUNIOzs7eUJBQ2U7QUFDWixtQkFBTyxLQUFQLFVBQUE7QUFDSDs7Ozs7O2tCQTVEZ0JULFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYXNzZXJ0LCBvYmplY3RWYWx1ZXMgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IHZhciBMb2dMZXZlbDtcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIk5vbmVcIl0gPSAwXSA9IFwiTm9uZVwiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiRXJyb3JzXCJdID0gMV0gPSBcIkVycm9yc1wiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiV2FybmluZ3NcIl0gPSAyXSA9IFwiV2FybmluZ3NcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkluZm9cIl0gPSAzXSA9IFwiSW5mb1wiO1xufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcbi8qKlxuICogVGhlIENvb3JkaW5hdG9yIGNsYXNzIG1hbmFnZXMgYSBzZXQgb2Ygc291cmNlcyB0byB3aGljaCBpdCBhcHBsaWVzIGEgc2V0IG9mXG4gKiBjb29yZGluYXRpb24gc3RyYXRlZ2llcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgQ29vcmRpbmF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29vcmRpbmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VzID0ge307XG4gICAgICAgIHRoaXMuX3N0cmF0ZWdpZXMgPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnMuc291cmNlcykge1xuICAgICAgICAgICAgb3B0aW9ucy5zb3VyY2VzLmZvckVhY2goc291cmNlID0+IHRoaXMuYWRkU291cmNlKHNvdXJjZSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnN0cmF0ZWdpZXMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3RyYXRlZ2llcy5mb3JFYWNoKHN0cmF0ZWd5ID0+IHRoaXMuYWRkU3RyYXRlZ3koc3RyYXRlZ3kpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMgPSBvcHRpb25zLmRlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0QWN0aXZhdGlvbk9wdGlvbnMubG9nTGV2ZWwgPSBMb2dMZXZlbC5JbmZvO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFNvdXJjZShzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHNvdXJjZS5uYW1lO1xuICAgICAgICBhc3NlcnQoYFNvdXJjZXMgcmVxdWlyZSBhICduYW1lJyB0byBiZSBhZGRlZCB0byBhIGNvb3JkaW5hdG9yLmAsICEhbmFtZSk7XG4gICAgICAgIGFzc2VydChgQSBzb3VyY2UgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc291cmNlc1tuYW1lXSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHNvdXJjZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgdGhpcy5fc291cmNlc1tuYW1lXSA9IHNvdXJjZTtcbiAgICB9XG4gICAgcmVtb3ZlU291cmNlKG5hbWUpIHtcbiAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMuX3NvdXJjZXNbbmFtZV07XG4gICAgICAgIGFzc2VydChgU291cmNlICcke25hbWV9JyBoYXMgbm90IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhIXNvdXJjZSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHNvdXJjZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNbbmFtZV07XG4gICAgfVxuICAgIGdldFNvdXJjZShuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzW25hbWVdO1xuICAgIH1cbiAgICBnZXQgc291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFZhbHVlcyh0aGlzLl9zb3VyY2VzKTtcbiAgICB9XG4gICAgZ2V0IHNvdXJjZU5hbWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fc291cmNlcyk7XG4gICAgfVxuICAgIGFkZFN0cmF0ZWd5KHN0cmF0ZWd5KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBzdHJhdGVneS5uYW1lO1xuICAgICAgICBhc3NlcnQoYEEgc3RyYXRlZ3kgbmFtZWQgJyR7bmFtZX0nIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gdGhpcyBjb29yZGluYXRvci5gLCAhdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSk7XG4gICAgICAgIGFzc2VydChgQSBjb29yZGluYXRvcidzIHN0cmF0ZWdpZXMgY2FuIG5vdCBiZSBjaGFuZ2VkIHdoaWxlIGl0IGlzIGFjdGl2ZS5gLCAhdGhpcy5fYWN0aXZhdGVkKTtcbiAgICAgICAgdGhpcy5fc3RyYXRlZ2llc1tuYW1lXSA9IHN0cmF0ZWd5O1xuICAgIH1cbiAgICByZW1vdmVTdHJhdGVneShuYW1lKSB7XG4gICAgICAgIGxldCBzdHJhdGVneSA9IHRoaXMuX3N0cmF0ZWdpZXNbbmFtZV07XG4gICAgICAgIGFzc2VydChgU3RyYXRlZ3kgJyR7bmFtZX0nIGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIGNvb3JkaW5hdG9yLmAsICEhc3RyYXRlZ3kpO1xuICAgICAgICBhc3NlcnQoYEEgY29vcmRpbmF0b3IncyBzdHJhdGVnaWVzIGNhbiBub3QgYmUgY2hhbmdlZCB3aGlsZSBpdCBpcyBhY3RpdmUuYCwgIXRoaXMuX2FjdGl2YXRlZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xuICAgIH1cbiAgICBnZXRTdHJhdGVneShuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVnaWVzW25hbWVdO1xuICAgIH1cbiAgICBnZXQgc3RyYXRlZ2llcygpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFZhbHVlcyh0aGlzLl9zdHJhdGVnaWVzKTtcbiAgICB9XG4gICAgZ2V0IHN0cmF0ZWd5TmFtZXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9zdHJhdGVnaWVzKTtcbiAgICB9XG4gICAgZ2V0IGFjdGl2YXRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcbiAgICB9XG4gICAgYWN0aXZhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZhdGVkKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sb2dMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sb2dMZXZlbCA9IHRoaXMuX2RlZmF1bHRBY3RpdmF0aW9uT3B0aW9ucy5sb2dMZXZlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmF0aW9uT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZWQgPSB0aGlzLnN0cmF0ZWdpZXMucmVkdWNlKChjaGFpbiwgc3RyYXRlZ3kpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzdHJhdGVneS5hY3RpdmF0ZSh0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZDtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2YXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJhdGVnaWVzLnJldmVyc2UoKS5yZWR1Y2UoKGNoYWluLCBzdHJhdGVneSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBzdHJhdGVneS5kZWFjdGl2YXRlKCkpO1xuICAgICAgICAgICAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2YXRlZCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=