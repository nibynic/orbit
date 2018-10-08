'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */
class KeyMap {
    constructor() {
        this.reset();
    }
    /**
     * Resets the contents of the key map.
     *
     * @memberof KeyMap
     */
    reset() {
        this._idsToKeys = {};
        this._keysToIds = {};
    }
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
    idToKey(type, keyName, idValue) {
        return (0, _utils.deepGet)(this._idsToKeys, [type, keyName, idValue]);
    }
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
    keyToId(type, keyName, keyValue) {
        return (0, _utils.deepGet)(this._keysToIds, [type, keyName, keyValue]);
    }
    /**
     * Store the id and key values of a record in this key map.
     *
     * @param {Record} record
     * @returns {void}
     *
     * @memberOf KeyMap
     */
    pushRecord(record) {
        const { type, id, keys } = record;
        if (!keys || !id) {
            return;
        }
        Object.keys(keys).forEach(keyName => {
            let keyValue = keys[keyName];
            if (keyValue) {
                (0, _utils.deepSet)(this._idsToKeys, [type, keyName, id], keyValue);
                (0, _utils.deepSet)(this._keysToIds, [type, keyName, keyValue], id);
            }
        });
    }
    /**
     * Given a record, find the cached id if it exists.
     *
     * @param {string} type
     * @param {Dict<string>} keys
     * @returns {string}
     *
     * @memberOf KeyMap
     */
    idFromKeys(type, keys) {
        let keyNames = Object.keys(keys);
        return (0, _utils.firstResult)(keyNames, keyName => {
            let keyValue = keys[keyName];
            if (keyValue) {
                return this.keyToId(type, keyName, keyValue);
            }
        });
    }
}
exports.default = KeyMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtleS1tYXAuanMiXSwibmFtZXMiOlsiS2V5TWFwIiwiY29uc3RydWN0b3IiLCJyZXNldCIsIl9pZHNUb0tleXMiLCJfa2V5c1RvSWRzIiwiaWRUb0tleSIsInR5cGUiLCJrZXlOYW1lIiwiaWRWYWx1ZSIsImtleVRvSWQiLCJrZXlWYWx1ZSIsInB1c2hSZWNvcmQiLCJyZWNvcmQiLCJpZCIsImtleXMiLCJPYmplY3QiLCJmb3JFYWNoIiwiaWRGcm9tS2V5cyIsImtleU5hbWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBTWUsTUFBTUEsTUFBTixDQUFhO0FBQ3hCQyxrQkFBYztBQUNWLGFBQUtDLEtBQUw7QUFDSDtBQUNEOzs7OztBQUtBQSxZQUFRO0FBQ0osYUFBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBVUFDLFlBQVFDLElBQVIsRUFBY0MsT0FBZCxFQUF1QkMsT0FBdkIsRUFBZ0M7QUFDNUIsZUFBTyxvQkFBUSxLQUFLTCxVQUFiLEVBQXlCLENBQUNHLElBQUQsRUFBT0MsT0FBUCxFQUFnQkMsT0FBaEIsQ0FBekIsQ0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7QUFVQUMsWUFBUUgsSUFBUixFQUFjQyxPQUFkLEVBQXVCRyxRQUF2QixFQUFpQztBQUM3QixlQUFPLG9CQUFRLEtBQUtOLFVBQWIsRUFBeUIsQ0FBQ0UsSUFBRCxFQUFPQyxPQUFQLEVBQWdCRyxRQUFoQixDQUF6QixDQUFQO0FBQ0g7QUFDRDs7Ozs7Ozs7QUFRQUMsZUFBV0MsTUFBWCxFQUFtQjtBQUNmLGNBQU0sRUFBRU4sSUFBRixFQUFRTyxFQUFSLEVBQVlDLElBQVosS0FBcUJGLE1BQTNCO0FBQ0EsWUFBSSxDQUFDRSxJQUFELElBQVMsQ0FBQ0QsRUFBZCxFQUFrQjtBQUNkO0FBQ0g7QUFDREUsZUFBT0QsSUFBUCxDQUFZQSxJQUFaLEVBQWtCRSxPQUFsQixDQUEwQlQsV0FBVztBQUNqQyxnQkFBSUcsV0FBV0ksS0FBS1AsT0FBTCxDQUFmO0FBQ0EsZ0JBQUlHLFFBQUosRUFBYztBQUNWLG9DQUFRLEtBQUtQLFVBQWIsRUFBeUIsQ0FBQ0csSUFBRCxFQUFPQyxPQUFQLEVBQWdCTSxFQUFoQixDQUF6QixFQUE4Q0gsUUFBOUM7QUFDQSxvQ0FBUSxLQUFLTixVQUFiLEVBQXlCLENBQUNFLElBQUQsRUFBT0MsT0FBUCxFQUFnQkcsUUFBaEIsQ0FBekIsRUFBb0RHLEVBQXBEO0FBQ0g7QUFDSixTQU5EO0FBT0g7QUFDRDs7Ozs7Ozs7O0FBU0FJLGVBQVdYLElBQVgsRUFBaUJRLElBQWpCLEVBQXVCO0FBQ25CLFlBQUlJLFdBQVdILE9BQU9ELElBQVAsQ0FBWUEsSUFBWixDQUFmO0FBQ0EsZUFBTyx3QkFBWUksUUFBWixFQUFzQlgsV0FBVztBQUNwQyxnQkFBSUcsV0FBV0ksS0FBS1AsT0FBTCxDQUFmO0FBQ0EsZ0JBQUlHLFFBQUosRUFBYztBQUNWLHVCQUFPLEtBQUtELE9BQUwsQ0FBYUgsSUFBYixFQUFtQkMsT0FBbkIsRUFBNEJHLFFBQTVCLENBQVA7QUFDSDtBQUNKLFNBTE0sQ0FBUDtBQU1IO0FBN0V1QjtrQkFBUFYsTSIsImZpbGUiOiJrZXktbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgZGVlcFNldCwgZmlyc3RSZXN1bHQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBNYWludGFpbnMgYSBtYXAgYmV0d2VlbiByZWNvcmRzJyBpZHMgYW5kIGtleXMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIEtleU1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlNYXAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgY29udGVudHMgb2YgdGhlIGtleSBtYXAuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgS2V5TWFwXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX2lkc1RvS2V5cyA9IHt9O1xuICAgICAgICB0aGlzLl9rZXlzVG9JZHMgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEga2V5IHZhbHVlIGdpdmVuIGEgbW9kZWwgdHlwZSwga2V5IG5hbWUsIGFuZCBpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleU5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRWYWx1ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgS2V5TWFwXG4gICAgICovXG4gICAgaWRUb0tleSh0eXBlLCBrZXlOYW1lLCBpZFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkZWVwR2V0KHRoaXMuX2lkc1RvS2V5cywgW3R5cGUsIGtleU5hbWUsIGlkVmFsdWVdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFuIGlkIHZhbHVlIGdpdmVuIGEgbW9kZWwgdHlwZSwga2V5IG5hbWUsIGFuZCBrZXkgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVZhbHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBLZXlNYXBcbiAgICAgKi9cbiAgICBrZXlUb0lkKHR5cGUsIGtleU5hbWUsIGtleVZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkZWVwR2V0KHRoaXMuX2tleXNUb0lkcywgW3R5cGUsIGtleU5hbWUsIGtleVZhbHVlXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBpZCBhbmQga2V5IHZhbHVlcyBvZiBhIHJlY29yZCBpbiB0aGlzIGtleSBtYXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgS2V5TWFwXG4gICAgICovXG4gICAgcHVzaFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCwga2V5cyB9ID0gcmVjb3JkO1xuICAgICAgICBpZiAoIWtleXMgfHwgIWlkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmtleXMoa2V5cykuZm9yRWFjaChrZXlOYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlWYWx1ZSA9IGtleXNba2V5TmFtZV07XG4gICAgICAgICAgICBpZiAoa2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkZWVwU2V0KHRoaXMuX2lkc1RvS2V5cywgW3R5cGUsIGtleU5hbWUsIGlkXSwga2V5VmFsdWUpO1xuICAgICAgICAgICAgICAgIGRlZXBTZXQodGhpcy5fa2V5c1RvSWRzLCBbdHlwZSwga2V5TmFtZSwga2V5VmFsdWVdLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHJlY29yZCwgZmluZCB0aGUgY2FjaGVkIGlkIGlmIGl0IGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAgICogQHBhcmFtIHtEaWN0PHN0cmluZz59IGtleXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEtleU1hcFxuICAgICAqL1xuICAgIGlkRnJvbUtleXModHlwZSwga2V5cykge1xuICAgICAgICBsZXQga2V5TmFtZXMgPSBPYmplY3Qua2V5cyhrZXlzKTtcbiAgICAgICAgcmV0dXJuIGZpcnN0UmVzdWx0KGtleU5hbWVzLCBrZXlOYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBrZXlWYWx1ZSA9IGtleXNba2V5TmFtZV07XG4gICAgICAgICAgICBpZiAoa2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlUb0lkKHR5cGUsIGtleU5hbWUsIGtleVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==