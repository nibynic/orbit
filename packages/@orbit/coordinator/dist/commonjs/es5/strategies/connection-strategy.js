"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectionStrategy = undefined;

var _strategy = require("../strategy");

var _utils = require("@orbit/utils");

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

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

var ConnectionStrategy = exports.ConnectionStrategy = function (_Strategy) {
    _inherits(ConnectionStrategy, _Strategy);

    function ConnectionStrategy(options) {
        _classCallCheck(this, ConnectionStrategy);

        (0, _utils.assert)('A `source` must be specified for a ConnectionStrategy', !!options.source);
        (0, _utils.assert)('`source` should be a Source name specified as a string', typeof options.source === 'string');
        (0, _utils.assert)('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        var defaultName = options.source + ':' + options.on;
        delete options.source;
        if (options.target) {
            (0, _utils.assert)('`target` should be a Source name specified as a string', typeof options.target === 'string');
            options.sources.push(options.target);
            defaultName += ' -> ' + options.target;
            if (typeof options.action === 'string') {
                defaultName += ':' + options.action;
            }
            delete options.target;
        }
        options.name = options.name || defaultName;

        var _this = _possibleConstructorReturn(this, _Strategy.call(this, options));

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

    _createClass(ConnectionStrategy, [{
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
}(_strategy.Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvY29ubmVjdGlvbi1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJhc3NlcnQiLCJvcHRpb25zIiwiZGVmYXVsdE5hbWUiLCJ0YXJnZXQiLCJhcmdzIiwicmVzdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQSxrREFBQSxVQUFBLFNBQUEsRUFBQTtBQUFBLGNBQUEsa0JBQUEsRUFBQSxTQUFBOztBQUNJLGFBQUEsa0JBQUEsQ0FBQSxPQUFBLEVBQXFCO0FBQUEsd0JBQUEsSUFBQSxFQUFBLGtCQUFBOztBQUNqQkEsMkJBQUFBLHVEQUFBQSxFQUFnRSxDQUFDLENBQUNDLFFBQWxFRCxNQUFBQTtBQUNBQSwyQkFBQUEsd0RBQUFBLEVBQWlFLE9BQU9DLFFBQVAsTUFBQSxLQUFqRUQsUUFBQUE7QUFDQUEsMkJBQUFBLG9GQUFBQSxFQUE2RixPQUFPQyxRQUFQLEVBQUEsS0FBN0ZELFFBQUFBO0FBQ0FDLGdCQUFBQSxPQUFBQSxHQUFrQixDQUFDQSxRQUFuQkEsTUFBa0IsQ0FBbEJBO0FBQ0EsWUFBSUMsY0FBaUJELFFBQWpCQyxNQUFpQkQsR0FBakJDLEdBQWlCRCxHQUFrQkEsUUFBdkMsRUFBQTtBQUNBLGVBQU9BLFFBQVAsTUFBQTtBQUNBLFlBQUlBLFFBQUosTUFBQSxFQUFvQjtBQUNoQkQsK0JBQUFBLHdEQUFBQSxFQUFpRSxPQUFPQyxRQUFQLE1BQUEsS0FBakVELFFBQUFBO0FBQ0FDLG9CQUFBQSxPQUFBQSxDQUFBQSxJQUFBQSxDQUFxQkEsUUFBckJBLE1BQUFBO0FBQ0FDLDJCQUFBQSxTQUFzQkQsUUFBdEJDLE1BQUFBO0FBQ0EsZ0JBQUksT0FBT0QsUUFBUCxNQUFBLEtBQUosUUFBQSxFQUF3QztBQUNwQ0MsK0JBQUFBLE1BQW1CRCxRQUFuQkMsTUFBQUE7QUFDSDtBQUNELG1CQUFPRCxRQUFQLE1BQUE7QUFDSDtBQUNEQSxnQkFBQUEs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LENBQUEsS0FBQSxDQUFBLE1BQUEsRUFBUCxJQUFPLENBQVA7QUFGSkMsaUJBQVMsQ0FBVEE7QUFJSDtBQUNELGdCQUFJLE9BQU8sT0FBUCxTQUFBLEtBQUosVUFBQSxFQUEwQztBQUN0QyxvQkFBSSxPQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUEsTUFBQSxFQUFKLElBQUksQ0FBSixFQUFzQztBQUNsQywyQkFBQSxNQUFBO0FBQ0g7QUFITCxhQUFBLE1BSU8sSUFBSSxPQUFKLFNBQUEsRUFBb0I7QUFDdkIsdUJBQUEsTUFBQTtBQUNIO0FBeEJMLFNBQUE7QUFoRFIsS0FBQTs7QUFBQSxpQkFBQSxrQkFBQSxFQUFBLENBQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLFlBeUJpQjtBQUNULG1CQUFPLEtBQUEsUUFBQSxDQUFQLENBQU8sQ0FBUDtBQUNIO0FBM0JMLEtBQUEsRUFBQTtBQUFBLGFBQUEsUUFBQTtBQUFBLGFBQUEsWUE0QmlCO0FBQ1QsbUJBQU8sS0FBQSxRQUFBLENBQVAsQ0FBTyxDQUFQO0FBQ0g7QUE5QkwsS0FBQSxFQUFBO0FBQUEsYUFBQSxVQUFBO0FBQUEsYUFBQSxZQStCbUI7QUFDWCxtQkFBTyxLQUFQLFNBQUE7QUFDSDtBQWpDTCxLQUFBLENBQUE7O0FBQUEsV0FBQSxrQkFBQTtBQUFBLENBQUEsQ0FBQSxrQkFBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuLi9zdHJhdGVneSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGFzc2VydCgnQSBgc291cmNlYCBtdXN0IGJlIHNwZWNpZmllZCBmb3IgYSBDb25uZWN0aW9uU3RyYXRlZ3knLCAhIW9wdGlvbnMuc291cmNlKTtcbiAgICAgICAgYXNzZXJ0KCdgc291cmNlYCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0aW9ucy5zb3VyY2UgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgYXNzZXJ0KCdgb25gIHNob3VsZCBiZSBzcGVjaWZpZWQgYXMgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IGEgQ29ubmVjdGlvblN0cmF0ZWd5IGxpc3RlbnMgZm9yJywgdHlwZW9mIG9wdGlvbnMub24gPT09ICdzdHJpbmcnKTtcbiAgICAgICAgb3B0aW9ucy5zb3VyY2VzID0gW29wdGlvbnMuc291cmNlXTtcbiAgICAgICAgbGV0IGRlZmF1bHROYW1lID0gYCR7b3B0aW9ucy5zb3VyY2V9OiR7b3B0aW9ucy5vbn1gO1xuICAgICAgICBkZWxldGUgb3B0aW9ucy5zb3VyY2U7XG4gICAgICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICAgICAgYXNzZXJ0KCdgdGFyZ2V0YCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0aW9ucy50YXJnZXQgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgICAgIG9wdGlvbnMuc291cmNlcy5wdXNoKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgIGRlZmF1bHROYW1lICs9IGAgLT4gJHtvcHRpb25zLnRhcmdldH1gO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmFjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0TmFtZSArPSBgOiR7b3B0aW9ucy5hY3Rpb259YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLnRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgZGVmYXVsdE5hbWU7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9ldmVudCA9IG9wdGlvbnMub247XG4gICAgICAgIHRoaXMuX2FjdGlvbiA9IG9wdGlvbnMuYWN0aW9uO1xuICAgICAgICB0aGlzLl9jYXRjaCA9IG9wdGlvbnMuY2F0Y2g7XG4gICAgICAgIHRoaXMuX2ZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICB0aGlzLl9ibG9ja2luZyA9IHR5cGVvZiBvcHRpb25zLmJsb2NraW5nID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5ibG9ja2luZyA6ICEhb3B0aW9ucy5ibG9ja2luZztcbiAgICB9XG4gICAgZ2V0IHNvdXJjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXNbMF07XG4gICAgfVxuICAgIGdldCB0YXJnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzWzFdO1xuICAgIH1cbiAgICBnZXQgYmxvY2tpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ibG9ja2luZztcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB0aGlzLl9nZW5lcmF0ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5vbih0aGlzLl9ldmVudCwgdGhpcy5fbGlzdGVuZXIsIHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlYWN0aXZhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlLm9mZih0aGlzLl9ldmVudCwgdGhpcy5fbGlzdGVuZXIsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2dlbmVyYXRlTGlzdGVuZXIoKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgICAgaWYgKHRoaXMuX2ZpbHRlcikge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2FjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnRhcmdldFt0aGlzLl9hY3Rpb25dKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9hY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY2F0Y2ggJiYgcmVzdWx0ICYmIHJlc3VsdC5jYXRjaCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2F0Y2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2Jsb2NraW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Jsb2NraW5nLmFwcGx5KHRoaXMsIGFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ibG9ja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSJdfQ==