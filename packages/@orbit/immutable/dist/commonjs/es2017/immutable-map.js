'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hamt = require('./utils/hamt');

var _hamt2 = _interopRequireDefault(_hamt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ImmutableMap {
    constructor(base) {
        if (base) {
            this._data = base.data;
        } else {
            this._data = new _hamt2.default();
        }
    }
    get size() {
        return this._data.size;
    }
    get(key) {
        return this._data.get(key);
    }
    set(key, value) {
        this._data = this._data.set(key, value);
    }
    remove(key) {
        this._data = this._data.remove(key);
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    keys() {
        return this._data.keys();
    }
    values() {
        return this._data.values();
    }
    get data() {
        return this._data;
    }
}
exports.default = ImmutableMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImltbXV0YWJsZS1tYXAuanMiXSwibmFtZXMiOlsiSW1tdXRhYmxlTWFwIiwiY29uc3RydWN0b3IiLCJiYXNlIiwiX2RhdGEiLCJkYXRhIiwiSEFNVE1hcCIsInNpemUiLCJnZXQiLCJrZXkiLCJzZXQiLCJ2YWx1ZSIsInJlbW92ZSIsImhhcyIsInVuZGVmaW5lZCIsImtleXMiLCJ2YWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDZSxNQUFNQSxZQUFOLENBQW1CO0FBQzlCQyxnQkFBWUMsSUFBWixFQUFrQjtBQUNkLFlBQUlBLElBQUosRUFBVTtBQUNOLGlCQUFLQyxLQUFMLEdBQWFELEtBQUtFLElBQWxCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUtELEtBQUwsR0FBYSxJQUFJRSxjQUFKLEVBQWI7QUFDSDtBQUNKO0FBQ0QsUUFBSUMsSUFBSixHQUFXO0FBQ1AsZUFBTyxLQUFLSCxLQUFMLENBQVdHLElBQWxCO0FBQ0g7QUFDREMsUUFBSUMsR0FBSixFQUFTO0FBQ0wsZUFBTyxLQUFLTCxLQUFMLENBQVdJLEdBQVgsQ0FBZUMsR0FBZixDQUFQO0FBQ0g7QUFDREMsUUFBSUQsR0FBSixFQUFTRSxLQUFULEVBQWdCO0FBQ1osYUFBS1AsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV00sR0FBWCxDQUFlRCxHQUFmLEVBQW9CRSxLQUFwQixDQUFiO0FBQ0g7QUFDREMsV0FBT0gsR0FBUCxFQUFZO0FBQ1IsYUFBS0wsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV1EsTUFBWCxDQUFrQkgsR0FBbEIsQ0FBYjtBQUNIO0FBQ0RJLFFBQUlKLEdBQUosRUFBUztBQUNMLGVBQU8sS0FBS0QsR0FBTCxDQUFTQyxHQUFULE1BQWtCSyxTQUF6QjtBQUNIO0FBQ0RDLFdBQU87QUFDSCxlQUFPLEtBQUtYLEtBQUwsQ0FBV1csSUFBWCxFQUFQO0FBQ0g7QUFDREMsYUFBUztBQUNMLGVBQU8sS0FBS1osS0FBTCxDQUFXWSxNQUFYLEVBQVA7QUFDSDtBQUNELFFBQUlYLElBQUosR0FBVztBQUNQLGVBQU8sS0FBS0QsS0FBWjtBQUNIO0FBL0I2QjtrQkFBYkgsWSIsImZpbGUiOiJpbW11dGFibGUtbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhBTVRNYXAgZnJvbSAnLi91dGlscy9oYW10JztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltbXV0YWJsZU1hcCB7XG4gICAgY29uc3RydWN0b3IoYmFzZSkge1xuICAgICAgICBpZiAoYmFzZSkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGJhc2UuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBuZXcgSEFNVE1hcCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5zaXplO1xuICAgIH1cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmdldChrZXkpO1xuICAgIH1cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIHJlbW92ZShrZXkpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEucmVtb3ZlKGtleSk7XG4gICAgfVxuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAga2V5cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEua2V5cygpO1xuICAgIH1cbiAgICB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnZhbHVlcygpO1xuICAgIH1cbiAgICBnZXQgZGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxufSJdfQ==