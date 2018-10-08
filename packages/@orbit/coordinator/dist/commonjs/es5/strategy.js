"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Strategy = undefined;

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

var Strategy = exports.Strategy = function () {
    function Strategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Strategy);

        (0, _utils.assert)('Strategy requires a name', !!options.name);
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
        return _data2.default.Promise.resolve();
    };

    Strategy.prototype.deactivate = function deactivate() {
        this._coordinator = null;
        return _data2.default.Promise.resolve();
    };

    _createClass(Strategy, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJhc3NlcnQiLCJjb29yZGluYXRvciIsIk9yYml0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBLDhCQUFBLFlBQUE7QUFDSSxhQUFBLFFBQUEsR0FBMEI7QUFBQSxZQUFkQSxVQUFjLFVBQUEsTUFBQSxHQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsTUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBLENBQUEsR0FBSixFQUFJOztBQUFBLHdCQUFBLElBQUEsRUFBQSxRQUFBOztBQUN0QkMsMkJBQUFBLDBCQUFBQSxFQUFtQyxDQUFDLENBQUNELFFBQXJDQyxJQUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFhRCxRQUFiLElBQUE7QUFDQSxhQUFBLFlBQUEsR0FBb0JBLFFBQXBCLE9BQUE7QUFDQSxhQUFBLFVBQUEsR0FBa0JBLFFBQUFBLFNBQUFBLElBQUFBLE1BQXlCLEtBQXpCQSxLQUFBQSxHQUFsQixHQUFBO0FBQ0EsYUFBQSxTQUFBLEdBQWlCLEtBQUEsZUFBQSxHQUF1QkEsUUFBeEMsUUFBQTtBQUNIOztBQVBMLGFBQUEsU0FBQSxDQUFBLFFBQUEsR0FBQSxTQUFBLFFBQUEsQ0FBQSxXQUFBLEVBUXdDO0FBQUEsWUFBZEEsVUFBYyxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFDaEMsYUFBQSxZQUFBLEdBQUEsV0FBQTtBQUNBLFlBQUksS0FBQSxlQUFBLEtBQUosU0FBQSxFQUF3QztBQUNwQyxpQkFBQSxTQUFBLEdBQWlCQSxRQUFqQixRQUFBO0FBQ0g7QUFDRCxZQUFJLEtBQUosWUFBQSxFQUF1QjtBQUNuQixpQkFBQSxRQUFBLEdBQWdCLEtBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBc0IsVUFBQSxJQUFBLEVBQUE7QUFBQSx1QkFBUUUsWUFBQUEsU0FBQUEsQ0FBUixJQUFRQSxDQUFSO0FBQXRDLGFBQWdCLENBQWhCO0FBREosU0FBQSxNQUVPO0FBQ0gsaUJBQUEsUUFBQSxHQUFnQkEsWUFBaEIsT0FBQTtBQUNIO0FBQ0QsZUFBT0MsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQO0FBbEJSLEtBQUE7O0FBQUEsYUFBQSxTQUFBLENBQUEsVUFBQSxHQUFBLFNBQUEsVUFBQSxHQW9CaUI7QUFDVCxhQUFBLFlBQUEsR0FBQSxJQUFBO0FBQ0EsZUFBT0EsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQO0FBdEJSLEtBQUE7O0FBQUEsaUJBQUEsUUFBQSxFQUFBLENBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFlBd0JlO0FBQ1AsbUJBQU8sS0FBUCxLQUFBO0FBQ0g7QUExQkwsS0FBQSxFQUFBO0FBQUEsYUFBQSxhQUFBO0FBQUEsYUFBQSxZQTJCc0I7QUFDZCxtQkFBTyxLQUFQLFlBQUE7QUFDSDtBQTdCTCxLQUFBLEVBQUE7QUFBQSxhQUFBLFNBQUE7QUFBQSxhQUFBLFlBOEJrQjtBQUNWLG1CQUFPLEtBQVAsUUFBQTtBQUNIO0FBaENMLEtBQUEsRUFBQTtBQUFBLGFBQUEsV0FBQTtBQUFBLGFBQUEsWUFpQ29CO0FBQ1osbUJBQU8sS0FBUCxVQUFBO0FBQ0g7QUFuQ0wsS0FBQSxFQUFBO0FBQUEsYUFBQSxVQUFBO0FBQUEsYUFBQSxZQW9DbUI7QUFDWCxtQkFBTyxLQUFQLFNBQUE7QUFDSDtBQXRDTCxLQUFBLENBQUE7O0FBQUEsV0FBQSxRQUFBO0FBQUEsQ0FBQSxFQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgY2xhc3MgU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1N0cmF0ZWd5IHJlcXVpcmVzIGEgbmFtZScsICEhb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fc291cmNlTmFtZXMgPSBvcHRpb25zLnNvdXJjZXM7XG4gICAgICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8IGBbJHt0aGlzLl9uYW1lfV1gO1xuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHRoaXMuX2N1c3RvbUxvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbDtcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9jb29yZGluYXRvciA9IGNvb3JkaW5hdG9yO1xuICAgICAgICBpZiAodGhpcy5fY3VzdG9tTG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2VOYW1lcykge1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcyA9IHRoaXMuX3NvdXJjZU5hbWVzLm1hcChuYW1lID0+IGNvb3JkaW5hdG9yLmdldFNvdXJjZShuYW1lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzID0gY29vcmRpbmF0b3Iuc291cmNlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuX2Nvb3JkaW5hdG9yID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCBjb29yZGluYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkaW5hdG9yO1xuICAgIH1cbiAgICBnZXQgc291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXM7XG4gICAgfVxuICAgIGdldCBsb2dQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dQcmVmaXg7XG4gICAgfVxuICAgIGdldCBsb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xuICAgIH1cbn0iXX0=