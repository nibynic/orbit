"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RequestStrategy = undefined;

var _connectionStrategy = require("./connection-strategy");

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

var RequestStrategy = exports.RequestStrategy = function (_ConnectionStrategy) {
    _inherits(RequestStrategy, _ConnectionStrategy);

    function RequestStrategy(options) {
        _classCallCheck(this, RequestStrategy);

        return _possibleConstructorReturn(this, _ConnectionStrategy.call(this, options));
    }

    return RequestStrategy;
}(_connectionStrategy.ConnectionStrategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvcmVxdWVzdC1zdHJhdGVneS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBLDRDQUFBLFVBQUEsbUJBQUEsRUFBQTtBQUFBLGNBQUEsZUFBQSxFQUFBLG1CQUFBOztBQUNJLGFBQUEsZUFBQSxDQUFBLE9BQUEsRUFBcUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsZUFBQTs7QUFBQSxlQUFBLDJCQUFBLElBQUEsRUFDakIsb0JBQUEsSUFBQSxDQUFBLElBQUEsRUFEaUIsT0FDakIsQ0FEaUIsQ0FBQTtBQUVwQjs7QUFITCxXQUFBLGVBQUE7QUFBQSxDQUFBLENBQUEsc0NBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3Rpb25TdHJhdGVneSB9IGZyb20gJy4vY29ubmVjdGlvbi1zdHJhdGVneSc7XG5leHBvcnQgY2xhc3MgUmVxdWVzdFN0cmF0ZWd5IGV4dGVuZHMgQ29ubmVjdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cbn0iXX0=