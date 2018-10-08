function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { deepGet, deepSet, firstResult } from '@orbit/utils';
/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */

var KeyMap = function () {
    function KeyMap() {
        _classCallCheck(this, KeyMap);

        this.reset();
    }
    /**
     * Resets the contents of the key map.
     *
     * @memberof KeyMap
     */


    KeyMap.prototype.reset = function reset() {
        this._idsToKeys = {};
        this._keysToIds = {};
    };
    /**
     * Return a key value given a model type, key name, and id.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} idValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.idToKey = function idToKey(type, keyName, idValue) {
        return deepGet(this._idsToKeys, [type, keyName, idValue]);
    };
    /**
     * Return an id value given a model type, key name, and key value.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} keyValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.keyToId = function keyToId(type, keyName, keyValue) {
        return deepGet(this._keysToIds, [type, keyName, keyValue]);
    };
    /**
     * Store the id and key values of a record in this key map.
     *
     * @param {Record} record
     * @returns {void}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.pushRecord = function pushRecord(record) {
        var _this = this;

        var type = record.type,
            id = record.id,
            keys = record.keys;

        if (!keys || !id) {
            return;
        }
        Object.keys(keys).forEach(function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                deepSet(_this._idsToKeys, [type, keyName, id], keyValue);
                deepSet(_this._keysToIds, [type, keyName, keyValue], id);
            }
        });
    };
    /**
     * Given a record, find the cached id if it exists.
     *
     * @param {string} type
     * @param {Dict<string>} keys
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.idFromKeys = function idFromKeys(type, keys) {
        var _this2 = this;

        var keyNames = Object.keys(keys);
        return firstResult(keyNames, function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                return _this2.keyToId(type, keyName, keyValue);
            }
        });
    };

    return KeyMap;
}();

export default KeyMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtleS1tYXAuanMiXSwibmFtZXMiOlsiZGVlcEdldCIsImRlZXBTZXQiLCJmaXJzdFJlc3VsdCIsIktleU1hcCIsInJlc2V0IiwiX2lkc1RvS2V5cyIsIl9rZXlzVG9JZHMiLCJpZFRvS2V5IiwidHlwZSIsImtleU5hbWUiLCJpZFZhbHVlIiwia2V5VG9JZCIsImtleVZhbHVlIiwicHVzaFJlY29yZCIsInJlY29yZCIsImlkIiwia2V5cyIsIk9iamVjdCIsImZvckVhY2giLCJpZEZyb21LZXlzIiwia2V5TmFtZXMiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkJDLFdBQTNCLFFBQThDLGNBQTlDO0FBQ0E7Ozs7Ozs7SUFNcUJDLE07QUFDakIsc0JBQWM7QUFBQTs7QUFDVixhQUFLQyxLQUFMO0FBQ0g7QUFDRDs7Ozs7OztxQkFLQUEsSyxvQkFBUTtBQUNKLGFBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxhQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0gsSztBQUNEOzs7Ozs7Ozs7Ozs7cUJBVUFDLE8sb0JBQVFDLEksRUFBTUMsTyxFQUFTQyxPLEVBQVM7QUFDNUIsZUFBT1YsUUFBUSxLQUFLSyxVQUFiLEVBQXlCLENBQUNHLElBQUQsRUFBT0MsT0FBUCxFQUFnQkMsT0FBaEIsQ0FBekIsQ0FBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7Ozs7O3FCQVVBQyxPLG9CQUFRSCxJLEVBQU1DLE8sRUFBU0csUSxFQUFVO0FBQzdCLGVBQU9aLFFBQVEsS0FBS00sVUFBYixFQUF5QixDQUFDRSxJQUFELEVBQU9DLE9BQVAsRUFBZ0JHLFFBQWhCLENBQXpCLENBQVA7QUFDSCxLO0FBQ0Q7Ozs7Ozs7Ozs7cUJBUUFDLFUsdUJBQVdDLE0sRUFBUTtBQUFBOztBQUFBLFlBQ1BOLElBRE8sR0FDWU0sTUFEWixDQUNQTixJQURPO0FBQUEsWUFDRE8sRUFEQyxHQUNZRCxNQURaLENBQ0RDLEVBREM7QUFBQSxZQUNHQyxJQURILEdBQ1lGLE1BRFosQ0FDR0UsSUFESDs7QUFFZixZQUFJLENBQUNBLElBQUQsSUFBUyxDQUFDRCxFQUFkLEVBQWtCO0FBQ2Q7QUFDSDtBQUNERSxlQUFPRCxJQUFQLENBQVlBLElBQVosRUFBa0JFLE9BQWxCLENBQTBCLG1CQUFXO0FBQ2pDLGdCQUFJTixXQUFXSSxLQUFLUCxPQUFMLENBQWY7QUFDQSxnQkFBSUcsUUFBSixFQUFjO0FBQ1ZYLHdCQUFRLE1BQUtJLFVBQWIsRUFBeUIsQ0FBQ0csSUFBRCxFQUFPQyxPQUFQLEVBQWdCTSxFQUFoQixDQUF6QixFQUE4Q0gsUUFBOUM7QUFDQVgsd0JBQVEsTUFBS0ssVUFBYixFQUF5QixDQUFDRSxJQUFELEVBQU9DLE9BQVAsRUFBZ0JHLFFBQWhCLENBQXpCLEVBQW9ERyxFQUFwRDtBQUNIO0FBQ0osU0FORDtBQU9ILEs7QUFDRDs7Ozs7Ozs7Ozs7cUJBU0FJLFUsdUJBQVdYLEksRUFBTVEsSSxFQUFNO0FBQUE7O0FBQ25CLFlBQUlJLFdBQVdILE9BQU9ELElBQVAsQ0FBWUEsSUFBWixDQUFmO0FBQ0EsZUFBT2QsWUFBWWtCLFFBQVosRUFBc0IsbUJBQVc7QUFDcEMsZ0JBQUlSLFdBQVdJLEtBQUtQLE9BQUwsQ0FBZjtBQUNBLGdCQUFJRyxRQUFKLEVBQWM7QUFDVix1QkFBTyxPQUFLRCxPQUFMLENBQWFILElBQWIsRUFBbUJDLE9BQW5CLEVBQTRCRyxRQUE1QixDQUFQO0FBQ0g7QUFDSixTQUxNLENBQVA7QUFNSCxLOzs7OztlQTdFZ0JULE0iLCJmaWxlIjoia2V5LW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZXBHZXQsIGRlZXBTZXQsIGZpcnN0UmVzdWx0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8qKlxuICogTWFpbnRhaW5zIGEgbWFwIGJldHdlZW4gcmVjb3JkcycgaWRzIGFuZCBrZXlzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBLZXlNYXBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5TWFwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGNvbnRlbnRzIG9mIHRoZSBrZXkgbWFwLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIEtleU1hcFxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9pZHNUb0tleXMgPSB7fTtcbiAgICAgICAgdGhpcy5fa2V5c1RvSWRzID0ge307XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGtleSB2YWx1ZSBnaXZlbiBhIG1vZGVsIHR5cGUsIGtleSBuYW1lLCBhbmQgaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkVmFsdWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEtleU1hcFxuICAgICAqL1xuICAgIGlkVG9LZXkodHlwZSwga2V5TmFtZSwgaWRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gZGVlcEdldCh0aGlzLl9pZHNUb0tleXMsIFt0eXBlLCBrZXlOYW1lLCBpZFZhbHVlXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbiBpZCB2YWx1ZSBnaXZlbiBhIG1vZGVsIHR5cGUsIGtleSBuYW1lLCBhbmQga2V5IHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5TmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlWYWx1ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgS2V5TWFwXG4gICAgICovXG4gICAga2V5VG9JZCh0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZSkge1xuICAgICAgICByZXR1cm4gZGVlcEdldCh0aGlzLl9rZXlzVG9JZHMsIFt0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdG9yZSB0aGUgaWQgYW5kIGtleSB2YWx1ZXMgb2YgYSByZWNvcmQgaW4gdGhpcyBrZXkgbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEtleU1hcFxuICAgICAqL1xuICAgIHB1c2hSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQsIGtleXMgfSA9IHJlY29yZDtcbiAgICAgICAgaWYgKCFrZXlzIHx8ICFpZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5rZXlzKGtleXMpLmZvckVhY2goa2V5TmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5VmFsdWUgPSBrZXlzW2tleU5hbWVdO1xuICAgICAgICAgICAgaWYgKGtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVlcFNldCh0aGlzLl9pZHNUb0tleXMsIFt0eXBlLCBrZXlOYW1lLCBpZF0sIGtleVZhbHVlKTtcbiAgICAgICAgICAgICAgICBkZWVwU2V0KHRoaXMuX2tleXNUb0lkcywgW3R5cGUsIGtleU5hbWUsIGtleVZhbHVlXSwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSByZWNvcmQsIGZpbmQgdGhlIGNhY2hlZCBpZCBpZiBpdCBleGlzdHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgICAqIEBwYXJhbSB7RGljdDxzdHJpbmc+fSBrZXlzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBLZXlNYXBcbiAgICAgKi9cbiAgICBpZEZyb21LZXlzKHR5cGUsIGtleXMpIHtcbiAgICAgICAgbGV0IGtleU5hbWVzID0gT2JqZWN0LmtleXMoa2V5cyk7XG4gICAgICAgIHJldHVybiBmaXJzdFJlc3VsdChrZXlOYW1lcywga2V5TmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5VmFsdWUgPSBrZXlzW2tleU5hbWVdO1xuICAgICAgICAgICAgaWYgKGtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5VG9JZCh0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=