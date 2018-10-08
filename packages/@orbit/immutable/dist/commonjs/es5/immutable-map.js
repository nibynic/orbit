"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hamt = require("./utils/hamt");

var _hamt2 = _interopRequireDefault(_hamt);

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

var ImmutableMap = function () {
    function ImmutableMap(base) {
        _classCallCheck(this, ImmutableMap);

        if (base) {
            this._data = base.data;
        } else {
            this._data = new _hamt2.default();
        }
    }

    ImmutableMap.prototype.get = function get(key) {
        return this._data.get(key);
    };

    ImmutableMap.prototype.set = function set(key, value) {
        this._data = this._data.set(key, value);
    };

    ImmutableMap.prototype.remove = function remove(key) {
        this._data = this._data.remove(key);
    };

    ImmutableMap.prototype.has = function has(key) {
        return this.get(key) !== undefined;
    };

    ImmutableMap.prototype.keys = function keys() {
        return this._data.keys();
    };

    ImmutableMap.prototype.values = function values() {
        return this._data.values();
    };

    _createClass(ImmutableMap, [{
        key: 'size',
        get: function () {
            return this._data.size;
        }
    }, {
        key: 'data',
        get: function () {
            return this._data;
        }
    }]);

    return ImmutableMap;
}();

exports.default = ImmutableMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImltbXV0YWJsZS1tYXAuanMiXSwibmFtZXMiOlsiSW1tdXRhYmxlTWFwIiwiYmFzZSIsImdldCIsImtleSIsInNldCIsInZhbHVlIiwicmVtb3ZlIiwiaGFzIiwia2V5cyIsInZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDcUJBLGU7QUFDakIsYUFBQSxZQUFBLENBQUEsSUFBQSxFQUFrQjtBQUFBLHdCQUFBLElBQUEsRUFBQSxZQUFBOztBQUNkLFlBQUEsSUFBQSxFQUFVO0FBQ04saUJBQUEsS0FBQSxHQUFhQyxLQUFiLElBQUE7QUFESixTQUFBLE1BRU87QUFDSCxpQkFBQSxLQUFBLEdBQWEsSUFBYixjQUFhLEVBQWI7QUFDSDtBQUNKOzsyQkFJREMsRyxnQkFBSUMsRyxFQUFLO0FBQ0wsZUFBTyxLQUFBLEtBQUEsQ0FBQSxHQUFBLENBQVAsR0FBTyxDQUFQOzs7MkJBRUpDLEcsZ0JBQUlELEcsRUFBS0UsSyxFQUFPO0FBQ1osYUFBQSxLQUFBLEdBQWEsS0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsRUFBYixLQUFhLENBQWI7OzsyQkFFSkMsTSxtQkFBT0gsRyxFQUFLO0FBQ1IsYUFBQSxLQUFBLEdBQWEsS0FBQSxLQUFBLENBQUEsTUFBQSxDQUFiLEdBQWEsQ0FBYjs7OzJCQUVKSSxHLGdCQUFJSixHLEVBQUs7QUFDTCxlQUFPLEtBQUEsR0FBQSxDQUFBLEdBQUEsTUFBUCxTQUFBOzs7MkJBRUpLLEksbUJBQU87QUFDSCxlQUFPLEtBQUEsS0FBQSxDQUFQLElBQU8sRUFBUDs7OzJCQUVKQyxNLHFCQUFTO0FBQ0wsZUFBTyxLQUFBLEtBQUEsQ0FBUCxNQUFPLEVBQVA7Ozs7O3lCQW5CTztBQUNQLG1CQUFPLEtBQUEsS0FBQSxDQUFQLElBQUE7QUFDSDs7O3lCQW1CVTtBQUNQLG1CQUFPLEtBQVAsS0FBQTtBQUNIOzs7Ozs7a0JBL0JnQlQsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIQU1UTWFwIGZyb20gJy4vdXRpbHMvaGFtdCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbW11dGFibGVNYXAge1xuICAgIGNvbnN0cnVjdG9yKGJhc2UpIHtcbiAgICAgICAgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBiYXNlLmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IEhBTVRNYXAoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuc2l6ZTtcbiAgICB9XG4gICAgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5nZXQoa2V5KTtcbiAgICB9XG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICByZW1vdmUoa2V5KSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnJlbW92ZShrZXkpO1xuICAgIH1cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmtleXMoKTtcbiAgICB9XG4gICAgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZXMoKTtcbiAgICB9XG4gICAgZ2V0IGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgIH1cbn0iXX0=