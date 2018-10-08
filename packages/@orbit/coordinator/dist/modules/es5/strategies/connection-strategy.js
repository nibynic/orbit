var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { Strategy } from '../strategy';
import { assert } from '@orbit/utils';
export var ConnectionStrategy = function (_Strategy) {
    _inherits(ConnectionStrategy, _Strategy);

    function ConnectionStrategy(options) {
        _classCallCheck(this, ConnectionStrategy);

        assert('A `source` must be specified for a ConnectionStrategy', !!options.source);
        assert('`source` should be a Source name specified as a string', typeof options.source === 'string');
        assert('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        var defaultName = options.source + ':' + options.on;
        delete options.source;
        if (options.target) {
            assert('`target` should be a Source name specified as a string', typeof options.target === 'string');
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
}(Strategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvY29ubmVjdGlvbi1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJTdHJhdGVneSIsImFzc2VydCIsIkNvbm5lY3Rpb25TdHJhdGVneSIsIm9wdGlvbnMiLCJzb3VyY2UiLCJvbiIsInNvdXJjZXMiLCJkZWZhdWx0TmFtZSIsInRhcmdldCIsInB1c2giLCJhY3Rpb24iLCJuYW1lIiwiX2V2ZW50IiwiX2FjdGlvbiIsIl9jYXRjaCIsImNhdGNoIiwiX2ZpbHRlciIsImZpbHRlciIsIl9ibG9ja2luZyIsImJsb2NraW5nIiwiYWN0aXZhdGUiLCJjb29yZGluYXRvciIsInRoZW4iLCJfbGlzdGVuZXIiLCJfZ2VuZXJhdGVMaXN0ZW5lciIsImRlYWN0aXZhdGUiLCJvZmYiLCJhcmdzIiwicmVzdWx0IiwiYXBwbHkiLCJ1bnNoaWZ0IiwiZSIsIl9zb3VyY2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsU0FBU0EsUUFBVCxRQUF5QixhQUF6QjtBQUNBLFNBQVNDLE1BQVQsUUFBdUIsY0FBdkI7QUFDQSxXQUFhQyxrQkFBYjtBQUFBOztBQUNJLGdDQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCRixlQUFPLHVEQUFQLEVBQWdFLENBQUMsQ0FBQ0UsUUFBUUMsTUFBMUU7QUFDQUgsZUFBTyx3REFBUCxFQUFpRSxPQUFPRSxRQUFRQyxNQUFmLEtBQTBCLFFBQTNGO0FBQ0FILGVBQU8sb0ZBQVAsRUFBNkYsT0FBT0UsUUFBUUUsRUFBZixLQUFzQixRQUFuSDtBQUNBRixnQkFBUUcsT0FBUixHQUFrQixDQUFDSCxRQUFRQyxNQUFULENBQWxCO0FBQ0EsWUFBSUcsY0FBaUJKLFFBQVFDLE1BQXpCLFNBQW1DRCxRQUFRRSxFQUEvQztBQUNBLGVBQU9GLFFBQVFDLE1BQWY7QUFDQSxZQUFJRCxRQUFRSyxNQUFaLEVBQW9CO0FBQ2hCUCxtQkFBTyx3REFBUCxFQUFpRSxPQUFPRSxRQUFRSyxNQUFmLEtBQTBCLFFBQTNGO0FBQ0FMLG9CQUFRRyxPQUFS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TUFBUDtBQUNIO0FBQ0osYUFKRCxNQUlPLElBQUksT0FBS1YsU0FBVCxFQUFvQjtBQUN2Qix1QkFBT1UsTUFBUDtBQUNIO0FBQ0osU0F6QkQ7QUEwQkgsS0ExRUw7O0FBQUE7QUFBQTtBQUFBLHlCQXlCaUI7QUFDVCxtQkFBTyxLQUFLSSxRQUFMLENBQWMsQ0FBZCxDQUFQO0FBQ0g7QUEzQkw7QUFBQTtBQUFBLHlCQTRCaUI7QUFDVCxtQkFBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFQO0FBQ0g7QUE5Qkw7QUFBQTtBQUFBLHlCQStCbUI7QUFDWCxtQkFBTyxLQUFLZCxTQUFaO0FBQ0g7QUFqQ0w7O0FBQUE7QUFBQSxFQUF3Q2xCLFFBQXhDIiwiZmlsZSI6InN0cmF0ZWdpZXMvY29ubmVjdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBhc3NlcnQoJ0EgYHNvdXJjZWAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgQ29ubmVjdGlvblN0cmF0ZWd5JywgISFvcHRpb25zLnNvdXJjZSk7XG4gICAgICAgIGFzc2VydCgnYHNvdXJjZWAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMuc291cmNlID09PSAnc3RyaW5nJyk7XG4gICAgICAgIGFzc2VydCgnYG9uYCBzaG91bGQgYmUgc3BlY2lmaWVkIGFzIHRoZSBuYW1lIG9mIHRoZSBldmVudCBhIENvbm5lY3Rpb25TdHJhdGVneSBsaXN0ZW5zIGZvcicsIHR5cGVvZiBvcHRpb25zLm9uID09PSAnc3RyaW5nJyk7XG4gICAgICAgIG9wdGlvbnMuc291cmNlcyA9IFtvcHRpb25zLnNvdXJjZV07XG4gICAgICAgIGxldCBkZWZhdWx0TmFtZSA9IGAke29wdGlvbnMuc291cmNlfToke29wdGlvbnMub259YDtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuc291cmNlO1xuICAgICAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XG4gICAgICAgICAgICBvcHRpb25zLnNvdXJjZXMucHVzaChvcHRpb25zLnRhcmdldCk7XG4gICAgICAgICAgICBkZWZhdWx0TmFtZSArPSBgIC0+ICR7b3B0aW9ucy50YXJnZXR9YDtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdE5hbWUgKz0gYDoke29wdGlvbnMuYWN0aW9ufWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgb3B0aW9ucy50YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGRlZmF1bHROYW1lO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZXZlbnQgPSBvcHRpb25zLm9uO1xuICAgICAgICB0aGlzLl9hY3Rpb24gPSBvcHRpb25zLmFjdGlvbjtcbiAgICAgICAgdGhpcy5fY2F0Y2ggPSBvcHRpb25zLmNhdGNoO1xuICAgICAgICB0aGlzLl9maWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgdGhpcy5fYmxvY2tpbmcgPSB0eXBlb2Ygb3B0aW9ucy5ibG9ja2luZyA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuYmxvY2tpbmcgOiAhIW9wdGlvbnMuYmxvY2tpbmc7XG4gICAgfVxuICAgIGdldCBzb3VyY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzWzBdO1xuICAgIH1cbiAgICBnZXQgdGFyZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlc1sxXTtcbiAgICB9XG4gICAgZ2V0IGJsb2NraW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tpbmc7XG4gICAgfVxuICAgIGFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyID0gdGhpcy5fZ2VuZXJhdGVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2Uub24odGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5vZmYodGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9nZW5lcmF0ZUxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2ZpbHRlci5hcHBseSh0aGlzLCBhcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9hY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy50YXJnZXRbdGhpcy5fYWN0aW9uXSguLi5hcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fYWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhdGNoICYmIHJlc3VsdCAmJiByZXN1bHQuY2F0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ibG9ja2luZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ibG9ja2luZy5hcHBseSh0aGlzLCBhcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYmxvY2tpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0iXX0=