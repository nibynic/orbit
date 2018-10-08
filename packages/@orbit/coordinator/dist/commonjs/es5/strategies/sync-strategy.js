"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SyncStrategy = undefined;

var _connectionStrategy = require("./connection-strategy");

var _utils = require("@orbit/utils");

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

var SyncStrategy = exports.SyncStrategy = function (_ConnectionStrategy) {
    _inherits(SyncStrategy, _ConnectionStrategy);

    function SyncStrategy(options) {
        _classCallCheck(this, SyncStrategy);

        var opts = options;
        (0, _utils.assert)('A `source` must be specified for a SyncStrategy', !!opts.source);
        (0, _utils.assert)('A `target` must be specified for a SyncStrategy', !!opts.target);
        (0, _utils.assert)('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        (0, _utils.assert)('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        return _possibleConstructorReturn(this, _ConnectionStrategy.call(this, opts));
    }

    return SyncStrategy;
}(_connectionStrategy.ConnectionStrategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvc3luYy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJvcHRzIiwiYXNzZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBLHNDQUFBLFVBQUEsbUJBQUEsRUFBQTtBQUFBLGNBQUEsWUFBQSxFQUFBLG1CQUFBOztBQUNJLGFBQUEsWUFBQSxDQUFBLE9BQUEsRUFBcUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsWUFBQTs7QUFDakIsWUFBSUEsT0FBSixPQUFBO0FBQ0FDLDJCQUFBQSxpREFBQUEsRUFBMEQsQ0FBQyxDQUFDRCxLQUE1REMsTUFBQUE7QUFDQUEsMkJBQUFBLGlEQUFBQSxFQUEwRCxDQUFDLENBQUNELEtBQTVEQyxNQUFBQTtBQUNBQSwyQkFBQUEsd0RBQUFBLEVBQWlFLE9BQU9ELEtBQVAsTUFBQSxLQUFqRUMsUUFBQUE7QUFDQUEsMkJBQUFBLHdEQUFBQSxFQUFpRSxPQUFPRCxLQUFQLE1BQUEsS0FBakVDLFFBQUFBO0FBQ0FELGFBQUFBLEVBQUFBLEdBQVVBLEtBQUFBLEVBQUFBLElBQVZBLFdBQUFBO0FBQ0FBLGFBQUFBLE1BQUFBLEdBQWNBLEtBQUFBLE1BQUFBLElBQWRBLE1BQUFBO0FBUGlCLGVBQUEsMkJBQUEsSUFBQSxFQVFqQixvQkFBQSxJQUFBLENBQUEsSUFBQSxFQVJpQixJQVFqQixDQVJpQixDQUFBO0FBU3BCOztBQVZMLFdBQUEsWUFBQTtBQUFBLENBQUEsQ0FBQSxzQ0FBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9jb25uZWN0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgY2xhc3MgU3luY1N0cmF0ZWd5IGV4dGVuZHMgQ29ubmVjdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRzID0gb3B0aW9ucztcbiAgICAgICAgYXNzZXJ0KCdBIGBzb3VyY2VgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIFN5bmNTdHJhdGVneScsICEhb3B0cy5zb3VyY2UpO1xuICAgICAgICBhc3NlcnQoJ0EgYHRhcmdldGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgU3luY1N0cmF0ZWd5JywgISFvcHRzLnRhcmdldCk7XG4gICAgICAgIGFzc2VydCgnYHNvdXJjZWAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdHMuc291cmNlID09PSAnc3RyaW5nJyk7XG4gICAgICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdHMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XG4gICAgICAgIG9wdHMub24gPSBvcHRzLm9uIHx8ICd0cmFuc2Zvcm0nO1xuICAgICAgICBvcHRzLmFjdGlvbiA9IG9wdHMuYWN0aW9uIHx8ICdzeW5jJztcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgfVxufSJdfQ==