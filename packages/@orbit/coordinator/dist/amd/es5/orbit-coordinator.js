define('@orbit/coordinator', ['exports', '@orbit/data', '@orbit/utils'], function (exports, Orbit, _orbit_utils) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Errors"] = 1] = "Errors";
    LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    LogLevel[LogLevel["Info"] = 3] = "Info";
})(exports.LogLevel || (exports.LogLevel = {}));
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
            this._defaultActivationOptions.logLevel = exports.LogLevel.Info;
        }
    }

    Coordinator.prototype.addSource = function addSource(source) {
        var name = source.name;
        _orbit_utils.assert('Sources require a \'name\' to be added to a coordinator.', !!name);
        _orbit_utils.assert('A source named \'' + name + '\' has already been added to this coordinator.', !this._sources[name]);
        _orbit_utils.assert('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        this._sources[name] = source;
    };

    Coordinator.prototype.removeSource = function removeSource(name) {
        var source = this._sources[name];
        _orbit_utils.assert('Source \'' + name + '\' has not been added to this coordinator.', !!source);
        _orbit_utils.assert('A coordinator\'s sources can not be changed while it is active.', !this._activated);
        delete this._sources[name];
    };

    Coordinator.prototype.getSource = function getSource(name) {
        return this._sources[name];
    };

    Coordinator.prototype.addStrategy = function addStrategy(strategy) {
        var name = strategy.name;
        _orbit_utils.assert('A strategy named \'' + name + '\' has already been added to this coordinator.', !this._strategies[name]);
        _orbit_utils.assert('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
        this._strategies[name] = strategy;
    };

    Coordinator.prototype.removeStrategy = function removeStrategy(name) {
        var strategy = this._strategies[name];
        _orbit_utils.assert('Strategy \'' + name + '\' has not been added to this coordinator.', !!strategy);
        _orbit_utils.assert('A coordinator\'s strategies can not be changed while it is active.', !this._activated);
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
            }, Orbit__default.Promise.resolve());
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
                }, Orbit__default.Promise.resolve());
            }).then(function () {
                _this3._activated = null;
            });
        } else {
            return Orbit__default.Promise.resolve();
        }
    };

    _createClass(Coordinator, [{
        key: 'sources',
        get: function () {
            return _orbit_utils.objectValues(this._sources);
        }
    }, {
        key: 'sourceNames',
        get: function () {
            return Object.keys(this._sources);
        }
    }, {
        key: 'strategies',
        get: function () {
            return _orbit_utils.objectValues(this._strategies);
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

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Strategy = function () {
    function Strategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$1(this, Strategy);

        _orbit_utils.assert('Strategy requires a name', !!options.name);
        this._name = options.name;
        this._sourceNames = options.sources;
        this._logPrefix = options.logPrefix || '[' + this._name + ']';
        this._logLevel = this._customLogLevel = options.logLevel;
    }

    Strategy.prototype.activate = function activate(coordinator) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this._coordinator = coordinator;
        if (this._customLogLevel === undefined) {
            this._logLevel = options.logLevel;
        }
        if (this._sourceNames) {
            this._sources = this._sourceNames.map(function (name) {
                return coordinator.getSource(name);
            });
        } else {
            this._sources = coordinator.sources;
        }
        return Orbit__default.Promise.resolve();
    };

    Strategy.prototype.deactivate = function deactivate() {
        this._coordinator = null;
        return Orbit__default.Promise.resolve();
    };

    _createClass$1(Strategy, [{
        key: 'name',
        get: function () {
            return this._name;
        }
    }, {
        key: 'coordinator',
        get: function () {
            return this._coordinator;
        }
    }, {
        key: 'sources',
        get: function () {
            return this._sources;
        }
    }, {
        key: 'logPrefix',
        get: function () {
            return this._logPrefix;
        }
    }, {
        key: 'logLevel',
        get: function () {
            return this._logLevel;
        }
    }]);

    return Strategy;
}();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var LogTruncationStrategy = function (_Strategy) {
    _inherits(LogTruncationStrategy, _Strategy);

    function LogTruncationStrategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$2(this, LogTruncationStrategy);

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
        }, Orbit__default.Promise.resolve());
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
        }, Orbit__default.Promise.resolve());
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

function _defaults$1(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$1(subClass, superClass); }

var EventLoggingStrategy = function (_Strategy) {
    _inherits$1(EventLoggingStrategy, _Strategy);

    function EventLoggingStrategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$3(this, EventLoggingStrategy);

        options.name = options.name || 'event-logging';

        var _this = _possibleConstructorReturn$1(this, _Strategy.call(this, options));

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
        if (Orbit.isPullable(source)) {
            interfaces.push('pullable');
        }
        if (Orbit.isPushable(source)) {
            interfaces.push('pushable');
        }
        if (Orbit.isQueryable(source)) {
            interfaces.push('queryable');
        }
        if (Orbit.isSyncable(source)) {
            interfaces.push('syncable');
        }
        if (Orbit.isUpdatable(source)) {
            interfaces.push('updatable');
        }
        return interfaces;
    };

    EventLoggingStrategy.prototype._interfaceEvents = function _interfaceEvents(interfaceName) {
        if (this._logLevel === exports.LogLevel.Info) {
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
        } else if (this._logLevel > exports.LogLevel.None) {
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
        _orbit_utils.deepSet(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    };

    EventLoggingStrategy.prototype._removeListener = function _removeListener(source, event) {
        var listener = _orbit_utils.deepGet(this._eventListeners, [source.name, event]);
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

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults$2(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$2(subClass, superClass); }

var ConnectionStrategy = function (_Strategy) {
    _inherits$2(ConnectionStrategy, _Strategy);

    function ConnectionStrategy(options) {
        _classCallCheck$4(this, ConnectionStrategy);

        _orbit_utils.assert('A `source` must be specified for a ConnectionStrategy', !!options.source);
        _orbit_utils.assert('`source` should be a Source name specified as a string', typeof options.source === 'string');
        _orbit_utils.assert('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        var defaultName = options.source + ':' + options.on;
        delete options.source;
        if (options.target) {
            _orbit_utils.assert('`target` should be a Source name specified as a string', typeof options.target === 'string');
            options.sources.push(options.target);
            defaultName += ' -> ' + options.target;
            if (typeof options.action === 'string') {
                defaultName += ':' + options.action;
            }
            delete options.target;
        }
        options.name = options.name || defaultName;

        var _this = _possibleConstructorReturn$2(this, _Strategy.call(this, options));

        _this._event = options.on;
        _this._action = options.action;
        _this._catch = options.catch;
        _this._filter = options.filter;
        _this._blocking = typeof options.blocking === 'function' ? options.blocking : !!options.blocking;
        return _this;
    }

    ConnectionStrategy.prototype.activate = function activate(coordinator) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return _Strategy.prototype.activate.call(this, coordinator, options).then(function () {
            _this2._listener = _this2._generateListener();
            _this2.source.on(_this2._event, _this2._listener, _this2);
        });
    };

    ConnectionStrategy.prototype.deactivate = function deactivate() {
        var _this3 = this;

        return _Strategy.prototype.deactivate.call(this).then(function () {
            _this3.source.off(_this3._event, _this3._listener, _this3);
            _this3._listener = null;
        });
    };

    ConnectionStrategy.prototype._generateListener = function _generateListener() {
        var _this4 = this;

        var target = this.target;
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var result = void 0;
            if (_this4._filter) {
                if (!_this4._filter.apply(_this4, args)) {
                    return;
                }
            }
            if (typeof _this4._action === 'string') {
                var _target;

                result = (_target = _this4.target)[_this4._action].apply(_target, args);
            } else {
                result = _this4._action.apply(_this4, args);
            }
            if (_this4._catch && result && result.catch) {
                result = result.catch(function (e) {
                    args.unshift(e);
                    return _this4._catch.apply(_this4, args);
                });
            }
            if (typeof _this4._blocking === 'function') {
                if (_this4._blocking.apply(_this4, args)) {
                    return result;
                }
            } else if (_this4._blocking) {
                return result;
            }
        };
    };

    _createClass$2(ConnectionStrategy, [{
        key: 'source',
        get: function () {
            return this._sources[0];
        }
    }, {
        key: 'target',
        get: function () {
            return this._sources[1];
        }
    }, {
        key: 'blocking',
        get: function () {
            return this._blocking;
        }
    }]);

    return ConnectionStrategy;
}(Strategy);

function _defaults$3(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$3(subClass, superClass); }

var RequestStrategy = function (_ConnectionStrategy) {
    _inherits$3(RequestStrategy, _ConnectionStrategy);

    function RequestStrategy(options) {
        _classCallCheck$5(this, RequestStrategy);

        return _possibleConstructorReturn$3(this, _ConnectionStrategy.call(this, options));
    }

    return RequestStrategy;
}(ConnectionStrategy);

function _defaults$4(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$4(subClass, superClass); }

var SyncStrategy = function (_ConnectionStrategy) {
    _inherits$4(SyncStrategy, _ConnectionStrategy);

    function SyncStrategy(options) {
        _classCallCheck$6(this, SyncStrategy);

        var opts = options;
        _orbit_utils.assert('A `source` must be specified for a SyncStrategy', !!opts.source);
        _orbit_utils.assert('A `target` must be specified for a SyncStrategy', !!opts.target);
        _orbit_utils.assert('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        _orbit_utils.assert('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        return _possibleConstructorReturn$4(this, _ConnectionStrategy.call(this, opts));
    }

    return SyncStrategy;
}(ConnectionStrategy);

exports['default'] = Coordinator;
exports.Strategy = Strategy;
exports.LogTruncationStrategy = LogTruncationStrategy;
exports.EventLoggingStrategy = EventLoggingStrategy;
exports.ConnectionStrategy = ConnectionStrategy;
exports.RequestStrategy = RequestStrategy;
exports.SyncStrategy = SyncStrategy;

Object.defineProperty(exports, '__esModule', { value: true });

});
