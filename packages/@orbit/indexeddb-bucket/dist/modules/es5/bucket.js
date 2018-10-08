var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import Orbit, { Bucket } from '@orbit/core';
import { assert } from '@orbit/utils';
import { supportsIndexedDB } from './lib/indexeddb';
/**
 * Bucket for persisting transient data in IndexedDB.
 *
 * @class IndexedDBBucket
 * @extends Bucket
 */

var IndexedDBBucket = function (_Bucket) {
    _inherits(IndexedDBBucket, _Bucket);

    /**
     * Create a new IndexedDBBucket.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {String}  [settings.name]        Optional. Name of this bucket.
     * @param {String}  [settings.namespace]   Optional. Namespace of the bucket. Will be used for the IndexedDB database name. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.storeName]   Optional. Name of the IndexedDB ObjectStore. Defaults to 'data'.
     * @param {Integer} [settings.version]     Optional. The version to open the IndexedDB database with. Defaults to `1`.
     */
    function IndexedDBBucket() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, IndexedDBBucket);

        assert('Your browser does not support IndexedDB!', supportsIndexedDB());
        settings.name = settings.name || 'indexedDB';
        settings.storeName = settings.storeName || 'data';
        return _possibleConstructorReturn(this, _Bucket.call(this, settings));
    }

    IndexedDBBucket.prototype.upgrade = function upgrade(settings) {
        var _this2 = this;

        this.closeDB();
        return _Bucket.prototype.upgrade.call(this, settings).then(function () {
            return _this2.openDB();
        });
    };

    IndexedDBBucket.prototype._applySettings = function _applySettings(settings) {
        this._storeName = settings.storeName;
        return _Bucket.prototype._applySettings.call(this, settings);
    };
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * IndexedDB's default verions is 1.
     *
     * @return {Integer} Version number.
     */


    IndexedDBBucket.prototype.openDB = function openDB() {
        var _this3 = this;

        return new Orbit.Promise(function (resolve, reject) {
            if (_this3._db) {
                resolve(_this3._db);
            } else {
                var request = Orbit.globals.indexedDB.open(_this3.dbName, _this3.dbVersion);
                request.onerror = function () {
                    console.error('error opening indexedDB', _this3.dbName);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success opening indexedDB', this.dbName);
                    var db = _this3._db = request.result;
                    resolve(db);
                };
                request.onupgradeneeded = function (event) {
                    // console.log('indexedDB upgrade needed');
                    var db = _this3._db = event.target.result;
                    if (event && event.oldVersion > 0) {
                        _this3.migrateDB(db, event);
                    } else {
                        _this3.createDB(db);
                    }
                };
            }
        });
    };

    IndexedDBBucket.prototype.closeDB = function closeDB() {
        if (this.isDBOpen) {
            this._db.close();
            this._db = null;
        }
    };

    IndexedDBBucket.prototype.reopenDB = function reopenDB() {
        this.closeDB();
        return this.openDB();
    };

    IndexedDBBucket.prototype.createDB = function createDB(db) {
        db.createObjectStore(this.dbStoreName); //, { keyPath: 'key' });
    };
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */


    IndexedDBBucket.prototype.migrateDB = function migrateDB(db, event) {
        console.error('IndexedDBBucket#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    };

    IndexedDBBucket.prototype.deleteDB = function deleteDB() {
        var _this4 = this;

        this.closeDB();
        return new Orbit.Promise(function (resolve, reject) {
            var request = Orbit.globals.indexedDB.deleteDatabase(_this4.dbName);
            request.onerror = function () {
                console.error('error deleting indexedDB', _this4.dbName);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success deleting indexedDB', this.dbName);
                _this4._db = null;
                resolve();
            };
        });
    };

    IndexedDBBucket.prototype.getItem = function getItem(key) {
        var _this5 = this;

        return this.openDB().then(function () {
            return new Orbit.Promise(function (resolve, reject) {
                var transaction = _this5._db.transaction([_this5.dbStoreName]);
                var objectStore = transaction.objectStore(_this5.dbStoreName);
                var request = objectStore.get(key);
                request.onerror = function () {
                    console.error('error - getItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - getItem', request.result);
                    resolve(request.result);
                };
            });
        });
    };

    IndexedDBBucket.prototype.setItem = function setItem(key, value) {
        var _this6 = this;

        return this.openDB().then(function () {
            var transaction = _this6._db.transaction([_this6.dbStoreName], 'readwrite');
            var objectStore = transaction.objectStore(_this6.dbStoreName);
            return new Orbit.Promise(function (resolve, reject) {
                var request = objectStore.put(value, key);
                request.onerror = function () {
                    console.error('error - setItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - setItem');
                    resolve();
                };
            });
        });
    };

    IndexedDBBucket.prototype.removeItem = function removeItem(key) {
        var _this7 = this;

        return this.openDB().then(function () {
            return new Orbit.Promise(function (resolve, reject) {
                var transaction = _this7._db.transaction([_this7.dbStoreName], 'readwrite');
                var objectStore = transaction.objectStore(_this7.dbStoreName);
                var request = objectStore.delete(key);
                request.onerror = function () {
                    console.error('error - removeItem', request.error);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success - removeItem');
                    resolve();
                };
            });
        });
    };

    _createClass(IndexedDBBucket, [{
        key: 'dbVersion',
        get: function () {
            return this.version;
        }
        /**
         * IndexedDB database name.
         *
         * Defaults to 'orbit-bucket', which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */

    }, {
        key: 'dbName',
        get: function () {
            return this.namespace;
        }
        /**
         * IndexedDB ObjectStore name.
         *
         * Defaults to 'settings', which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */

    }, {
        key: 'dbStoreName',
        get: function () {
            return this._storeName;
        }
    }, {
        key: 'isDBOpen',
        get: function () {
            return !!this._db;
        }
    }]);

    return IndexedDBBucket;
}(Bucket);

export default IndexedDBBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJPcmJpdCIsIkJ1Y2tldCIsImFzc2VydCIsInN1cHBvcnRzSW5kZXhlZERCIiwiSW5kZXhlZERCQnVja2V0Iiwic2V0dGluZ3MiLCJuYW1lIiwic3RvcmVOYW1lIiwidXBncmFkZSIsImNsb3NlREIiLCJ0aGVuIiwib3BlbkRCIiwiX2FwcGx5U2V0dGluZ3MiLCJfc3RvcmVOYW1lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfZGIiLCJyZXF1ZXN0IiwiZ2xvYmFscyIsImluZGV4ZWREQiIsIm9wZW4iLCJkYk5hbWUiLCJkYlZlcnNpb24iLCJvbmVycm9yIiwiY29uc29sZSIsImVycm9yIiwib25zdWNjZXNzIiwiZGIiLCJyZXN1bHQiLCJvbnVwZ3JhZGVuZWVkZWQiLCJldmVudCIsInRhcmdldCIsIm9sZFZlcnNpb24iLCJtaWdyYXRlREIiLCJjcmVhdGVEQiIsImlzREJPcGVuIiwiY2xvc2UiLCJyZW9wZW5EQiIsImNyZWF0ZU9iamVjdFN0b3JlIiwiZGJTdG9yZU5hbWUiLCJuZXdWZXJzaW9uIiwiZGVsZXRlREIiLCJkZWxldGVEYXRhYmFzZSIsImdldEl0ZW0iLCJrZXkiLCJ0cmFuc2FjdGlvbiIsIm9iamVjdFN0b3JlIiwiZ2V0Iiwic2V0SXRlbSIsInZhbHVlIiwicHV0IiwicmVtb3ZlSXRlbSIsImRlbGV0ZSIsInZlcnNpb24iLCJuYW1lc3BhY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxNQUFoQixRQUE4QixhQUE5QjtBQUNBLFNBQVNDLE1BQVQsUUFBdUIsY0FBdkI7QUFDQSxTQUFTQyxpQkFBVCxRQUFrQyxpQkFBbEM7QUFDQTs7Ozs7OztJQU1xQkMsZTs7O0FBQ2pCOzs7Ozs7Ozs7O0FBVUEsK0JBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkgsZUFBTywwQ0FBUCxFQUFtREMsbUJBQW5EO0FBQ0FFLGlCQUFTQyxJ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bUJBQU8sS0FBS0MsU0FBWjtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7eUJBT2tCO0FBQ2QsbUJBQU8sS0FBSzFDLFVBQVo7QUFDSDs7O3lCQUNjO0FBQ1gsbUJBQU8sQ0FBQyxDQUFDLEtBQUtJLEdBQWQ7QUFDSDs7OztFQXpEd0NoQixNOztlQUF4QkcsZSIsImZpbGUiOiJidWNrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHsgQnVja2V0IH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IHN1cHBvcnRzSW5kZXhlZERCIH0gZnJvbSAnLi9saWIvaW5kZXhlZGRiJztcbi8qKlxuICogQnVja2V0IGZvciBwZXJzaXN0aW5nIHRyYW5zaWVudCBkYXRhIGluIEluZGV4ZWREQi5cbiAqXG4gKiBAY2xhc3MgSW5kZXhlZERCQnVja2V0XG4gKiBAZXh0ZW5kcyBCdWNrZXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCQnVja2V0IGV4dGVuZHMgQnVja2V0IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCQnVja2V0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhpcyBidWNrZXQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSAgIE9wdGlvbmFsLiBOYW1lc3BhY2Ugb2YgdGhlIGJ1Y2tldC4gV2lsbCBiZSB1c2VkIGZvciB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLnN0b3JlTmFtZV0gICBPcHRpb25hbC4gTmFtZSBvZiB0aGUgSW5kZXhlZERCIE9iamVjdFN0b3JlLiBEZWZhdWx0cyB0byAnZGF0YScuXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBUaGUgdmVyc2lvbiB0byBvcGVuIHRoZSBJbmRleGVkREIgZGF0YWJhc2Ugd2l0aC4gRGVmYXVsdHMgdG8gYDFgLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBJbmRleGVkREIhJywgc3VwcG9ydHNJbmRleGVkREIoKSk7XG4gICAgICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdpbmRleGVkREInO1xuICAgICAgICBzZXR0aW5ncy5zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWUgfHwgJ2RhdGEnO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuICAgIHVwZ3JhZGUoc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiBzdXBlci51cGdyYWRlKHNldHRpbmdzKS50aGVuKCgpID0+IHRoaXMub3BlbkRCKCkpO1xuICAgIH1cbiAgICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWU7XG4gICAgICAgIHJldHVybiBzdXBlci5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBJbmRleGVkREIncyBkZWZhdWx0IHZlcmlvbnMgaXMgMS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gbnVtYmVyLlxuICAgICAqL1xuICAgIGdldCBkYlZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlcnNpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLlxuICAgICAqXG4gICAgICogRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cbiAgICAgKi9cbiAgICBnZXQgZGJOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGV4ZWREQiBPYmplY3RTdG9yZSBuYW1lLlxuICAgICAqXG4gICAgICogRGVmYXVsdHMgdG8gJ3NldHRpbmdzJywgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxuICAgICAqL1xuICAgIGdldCBkYlN0b3JlTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlTmFtZTtcbiAgICB9XG4gICAgZ2V0IGlzREJPcGVuKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kYjtcbiAgICB9XG4gICAgb3BlbkRCKCkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRiKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub2xkVmVyc2lvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbG9zZURCKCkge1xuICAgICAgICBpZiAodGhpcy5pc0RCT3Blbikge1xuICAgICAgICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX2RiID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW9wZW5EQigpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpO1xuICAgIH1cbiAgICBjcmVhdGVEQihkYikge1xuICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTsgLy8sIHsga2V5UGF0aDogJ2tleScgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1pZ3JhdGUgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtJREJEYXRhYmFzZX0gZGIgICAgICAgICAgICAgIERhdGFiYXNlIHRvIHVwZ3JhZGUuXG4gICAgICogQHBhcmFtICB7SURCVmVyc2lvbkNoYW5nZUV2ZW50fSBldmVudCBFdmVudCByZXN1bHRpbmcgZnJvbSB2ZXJzaW9uIGNoYW5nZS5cbiAgICAgKi9cbiAgICBtaWdyYXRlREIoZGIsIGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQkJ1Y2tldCNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XG4gICAgfVxuICAgIGRlbGV0ZURCKCkge1xuICAgICAgICB0aGlzLmNsb3NlREIoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RiID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0SXRlbShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRJdGVtJywgcmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gc2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBzZXRJdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVJdGVtKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlSXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSByZW1vdmVJdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=