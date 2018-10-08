"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("@orbit/utils");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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
        return (0, _utils.deepGet)(this._idsToKeys, [type, keyName, idValue]);
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
        return (0, _utils.deepGet)(this._keysToIds, [type, keyName, keyValue]);
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
                (0, _utils.deepSet)(_this._idsToKeys, [type, keyName, id], keyValue);
                (0, _utils.deepSet)(_this._keysToIds, [type, keyName, keyValue], id);
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
        return (0, _utils.firstResult)(keyNames, function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                return _this2.keyToId(type, keyName, keyValue);
            }
        });
    };

    return KeyMap;
}();

exports.default = KeyMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtleS1tYXAuanMiXSwibmFtZXMiOlsiS2V5TWFwIiwicmVzZXQiLCJpZFRvS2V5IiwidHlwZSIsImtleU5hbWUiLCJpZFZhbHVlIiwiZGVlcEdldCIsImtleVRvSWQiLCJrZXlWYWx1ZSIsInB1c2hSZWNvcmQiLCJyZWNvcmQiLCJPYmplY3QiLCJrZXlzIiwiZGVlcFNldCIsImlkRnJvbUtleXMiLCJrZXlOYW1lcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7SUFNcUJBLFM7QUFDakIsYUFBQSxNQUFBLEdBQWM7QUFBQSx3QkFBQSxJQUFBLEVBQUEsTUFBQTs7QUFDVixhQUFBLEtBQUE7QUFDSDtBQUNEOzs7Ozs7cUJBS0FDLEssb0JBQVE7QUFDSixhQUFBLFVBQUEsR0FBQSxFQUFBO0FBQ0EsYUFBQSxVQUFBLEdBQUEsRUFBQTs7QUFFSjs7Ozs7Ozs7Ozs7cUJBVUFDLE8sb0JBQVFDLEksRUFBTUMsTyxFQUFTQyxPLEVBQVM7QUFDNUIsZUFBT0Msb0JBQVEsS0FBUkEsVUFBQUEsRUFBeUIsQ0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFoQyxPQUFnQyxDQUF6QkEsQ0FBUDs7QUFFSjs7Ozs7Ozs7Ozs7cUJBVUFDLE8sb0JBQVFKLEksRUFBTUMsTyxFQUFTSSxRLEVBQVU7QUFDN0IsZUFBT0Ysb0JBQVEsS0FBUkEsVUFBQUEsRUFBeUIsQ0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFoQyxRQUFnQyxDQUF6QkEsQ0FBUDs7QUFFSjs7Ozs7Ozs7O3FCQVFBRyxVLHVCQUFXQyxNLEVBQVE7QUFBQSxZQUFBLFFBQUEsSUFBQTs7QUFBQSxZQUFBLE9BQUEsT0FBQSxJQUFBO0FBQUEsWUFBQSxLQUFBLE9BQUEsRUFBQTtBQUFBLFlBQUEsT0FBQSxPQUFBLElBQUE7O0FBRWYsWUFBSSxDQUFBLElBQUEsSUFBUyxDQUFiLEVBQUEsRUFBa0I7QUFDZDtBQUNIO0FBQ0RDLGVBQUFBLElBQUFBLENBQUFBLElBQUFBLEVBQUFBLE9BQUFBLENBQTBCLFVBQUEsT0FBQSxFQUFXO0FBQ2pDLGdCQUFJSCxXQUFXSSxLQUFmLE9BQWVBLENBQWY7QUFDQSxnQkFBQSxRQUFBLEVBQWM7QUFDVkMsb0NBQVEsTUFBUkEsVUFBQUEsRUFBeUIsQ0FBQSxJQUFBLEVBQUEsT0FBQSxFQUF6QkEsRUFBeUIsQ0FBekJBLEVBQUFBLFFBQUFBO0FBQ0FBLG9DQUFRLE1BQVJBLFVBQUFBLEVBQXlCLENBQUEsSUFBQSxFQUFBLE9BQUEsRUFBekJBLFFBQXlCLENBQXpCQSxFQUFBQSxFQUFBQTtBQUNIO0FBTExGLFNBQUFBOztBQVFKOzs7Ozs7Ozs7O3FCQVNBRyxVLHVCQUFXWCxJLEVBQU1TLEksRUFBTTtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUNuQixZQUFJRyxXQUFXSixPQUFBQSxJQUFBQSxDQUFmLElBQWVBLENBQWY7QUFDQSxlQUFPLHdCQUFBLFFBQUEsRUFBc0IsVUFBQSxPQUFBLEVBQVc7QUFDcEMsZ0JBQUlILFdBQVdJLEtBQWYsT0FBZUEsQ0FBZjtBQUNBLGdCQUFBLFFBQUEsRUFBYztBQUNWLHVCQUFPLE9BQUEsT0FBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEVBQVAsUUFBTyxDQUFQO0FBQ0g7QUFKTCxTQUFPLENBQVA7Ozs7OztrQkF2RWFaLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0LCBmaXJzdFJlc3VsdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vKipcbiAqIE1haW50YWlucyBhIG1hcCBiZXR3ZWVuIHJlY29yZHMnIGlkcyBhbmQga2V5cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgS2V5TWFwXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleU1hcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBjb250ZW50cyBvZiB0aGUga2V5IG1hcC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBLZXlNYXBcbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5faWRzVG9LZXlzID0ge307XG4gICAgICAgIHRoaXMuX2tleXNUb0lkcyA9IHt9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBrZXkgdmFsdWUgZ2l2ZW4gYSBtb2RlbCB0eXBlLCBrZXkgbmFtZSwgYW5kIGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5TmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFZhbHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBLZXlNYXBcbiAgICAgKi9cbiAgICBpZFRvS2V5KHR5cGUsIGtleU5hbWUsIGlkVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZXBHZXQodGhpcy5faWRzVG9LZXlzLCBbdHlwZSwga2V5TmFtZSwgaWRWYWx1ZV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYW4gaWQgdmFsdWUgZ2l2ZW4gYSBtb2RlbCB0eXBlLCBrZXkgbmFtZSwgYW5kIGtleSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleU5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5VmFsdWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEtleU1hcFxuICAgICAqL1xuICAgIGtleVRvSWQodHlwZSwga2V5TmFtZSwga2V5VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZXBHZXQodGhpcy5fa2V5c1RvSWRzLCBbdHlwZSwga2V5TmFtZSwga2V5VmFsdWVdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGlkIGFuZCBrZXkgdmFsdWVzIG9mIGEgcmVjb3JkIGluIHRoaXMga2V5IG1hcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkfSByZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBLZXlNYXBcbiAgICAgKi9cbiAgICBwdXNoUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkLCBrZXlzIH0gPSByZWNvcmQ7XG4gICAgICAgIGlmICgha2V5cyB8fCAhaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3Qua2V5cyhrZXlzKS5mb3JFYWNoKGtleU5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGtleVZhbHVlID0ga2V5c1trZXlOYW1lXTtcbiAgICAgICAgICAgIGlmIChrZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGRlZXBTZXQodGhpcy5faWRzVG9LZXlzLCBbdHlwZSwga2V5TmFtZSwgaWRdLCBrZXlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgZGVlcFNldCh0aGlzLl9rZXlzVG9JZHMsIFt0eXBlLCBrZXlOYW1lLCBrZXlWYWx1ZV0sIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgcmVjb3JkLCBmaW5kIHRoZSBjYWNoZWQgaWQgaWYgaXQgZXhpc3RzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICAgKiBAcGFyYW0ge0RpY3Q8c3RyaW5nPn0ga2V5c1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgS2V5TWFwXG4gICAgICovXG4gICAgaWRGcm9tS2V5cyh0eXBlLCBrZXlzKSB7XG4gICAgICAgIGxldCBrZXlOYW1lcyA9IE9iamVjdC5rZXlzKGtleXMpO1xuICAgICAgICByZXR1cm4gZmlyc3RSZXN1bHQoa2V5TmFtZXMsIGtleU5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGtleVZhbHVlID0ga2V5c1trZXlOYW1lXTtcbiAgICAgICAgICAgIGlmIChrZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmtleVRvSWQodHlwZSwga2V5TmFtZSwga2V5VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59Il19