var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import HAMTMap from './utils/hamt';

var ImmutableMap = function () {
    function ImmutableMap(base) {
        _classCallCheck(this, ImmutableMap);

        if (base) {
            this._data = base.data;
        } else {
            this._data = new HAMTMap();
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

export default ImmutableMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImltbXV0YWJsZS1tYXAuanMiXSwibmFtZXMiOlsiSEFNVE1hcCIsIkltbXV0YWJsZU1hcCIsImJhc2UiLCJfZGF0YSIsImRhdGEiLCJnZXQiLCJrZXkiLCJzZXQiLCJ2YWx1ZSIsInJlbW92ZSIsImhhcyIsInVuZGVmaW5lZCIsImtleXMiLCJ2YWx1ZXMiLCJzaXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsT0FBUCxNQUFvQixjQUFwQjs7SUFDcUJDLFk7QUFDakIsMEJBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDZCxZQUFJQSxJQUFKLEVBQVU7QUFDTixpQkFBS0MsS0FBTCxHQUFhRCxLQUFLRSxJQUFsQjtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLRCxLQUFMLEdBQWEsSUFBSUgsT0FBSixFQUFiO0FBQ0g7QUFDSjs7MkJBSURLLEcsZ0JBQUlDLEcsRUFBSztBQUNMLGVBQU8sS0FBS0gsS0FBTCxDQUFXRSxHQUFYLENBQWVDLEdBQWYsQ0FBUDtBQUNILEs7OzJCQUNEQyxHLGdCQUFJRCxHLEVBQUtFLEssRUFBTztBQUNaLGFBQUtMLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdJLEdBQVgsQ0FBZUQsR0FBZixFQUFvQkUsS0FBcEIsQ0FBYjtBQUNILEs7OzJCQUNEQyxNLG1CQUFPSCxHLEVBQUs7QUFDUixhQUFLSCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXTSxNQUFYLENBQWtCSCxHQUFsQixDQUFiO0FBQ0gsSzs7MkJBQ0RJLEcsZ0JBQUlKLEcsRUFBSztBQUNMLGVBQU8sS0FBS0QsR0FBTCxDQUFTQyxHQUFULE1BQWtCSyxTQUF6QjtBQUNILEs7OzJCQUNEQyxJLG1CQUFPO0FBQ0gsZUFBTyxLQUFLVCxLQUFMLENBQVdTLElBQVgsRUFBUDtBQUNILEs7OzJCQUNEQyxNLHFCQUFTO0FBQ0wsZUFBTyxLQUFLVixLQUFMLENBQVdVLE1BQVgsRUFBUDtBQUNILEs7Ozs7eUJBcEJVO0FBQ1AsbUJBQU8sS0FBS1YsS0FBTCxDQUFXVyxJQUFsQjtBQUNIOzs7eUJBbUJVO0FBQ1AsbUJBQU8sS0FBS1gsS0FBWjtBQUNIOzs7Ozs7ZUEvQmdCRixZIiwiZmlsZSI6ImltbXV0YWJsZS1tYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSEFNVE1hcCBmcm9tICcuL3V0aWxzL2hhbXQnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1tdXRhYmxlTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XG4gICAgICAgIGlmIChiYXNlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gYmFzZS5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBIQU1UTWFwKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnNpemU7XG4gICAgfVxuICAgIGdldChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuZ2V0KGtleSk7XG4gICAgfVxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhLnNldChrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgcmVtb3ZlKGtleSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YS5yZW1vdmUoa2V5KTtcbiAgICB9XG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5rZXlzKCk7XG4gICAgfVxuICAgIHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEudmFsdWVzKCk7XG4gICAgfVxuICAgIGdldCBkYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG59Il19