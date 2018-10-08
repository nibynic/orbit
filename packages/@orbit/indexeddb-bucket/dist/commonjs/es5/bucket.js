"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require("@orbit/core");

var _core2 = _interopRequireDefault(_core);

var _utils = require("@orbit/utils");

var _indexeddb = require("./lib/indexeddb");

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

        (0, _utils.assert)('Your browser does not support IndexedDB!', (0, _indexeddb.supportsIndexedDB)());
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

        return new _core2.default.Promise(function (resolve, reject) {
            if (_this3._db) {
                resolve(_this3._db);
            } else {
                var request = _core2.default.globals.indexedDB.open(_this3.dbName, _this3.dbVersion);
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
        return new _core2.default.Promise(function (resolve, reject) {
            var request = _core2.default.globals.indexedDB.deleteDatabase(_this4.dbName);
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
            return new _core2.default.Promise(function (resolve, reject) {
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
            return new _core2.default.Promise(function (resolve, reject) {
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
            return new _core2.default.Promise(function (resolve, reject) {
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
}(_core.Bucket);

exports.default = IndexedDBBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJJbmRleGVkREJCdWNrZXQiLCJCdWNrZXQiLCJzZXR0aW5ncyIsImFzc2VydCIsInVwZ3JhZGUiLCJfYXBwbHlTZXR0aW5ncyIsIm9wZW5EQiIsIk9yYml0IiwicmVzb2x2ZSIsInJlcXVlc3QiLCJjb25zb2xlIiwicmVqZWN0IiwiZGIiLCJldmVudCIsImNsb3NlREIiLCJyZW9wZW5EQiIsImNyZWF0ZURCIiwibWlncmF0ZURCIiwiZGVsZXRlREIiLCJnZXRJdGVtIiwia2V5IiwidHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZSIsInNldEl0ZW0iLCJ2YWx1ZSIsInJlbW92ZUl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7OztJQU1xQkEsa0I7OztBQUNqQjs7Ozs7Ozs7OztBQVVBLGFBQUEsZUFBQSxHQUEyQjtBQUFBLFlBQWZFLFdBQWUsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQSxHQUFKLEVBQUk7O0FBQUEsd0JBQUEsSUFBQSxFQUFBLGVBQUE7O0FBQ3ZCQywyQkFBQUEsMENBQUFBLEVBQUFBLG1DQUFBQTtBQUNBRCxpQkFBQUEsSUFBQUEsR0FBZ0JBLFNBQUFBLElBQUFBLElBQWhCQSxXQUFBQTtBQUNBQSxpQkFBQUEsU0FBQUEsR0FBcUJBLFNBQUFBLFNBQUFBLElBQXJCQSxNQUFBQTtBQUh1QixlQUFBLDJCQUFBLElBQUEsRUFJdkIsUUFBQSxJQUFBLENBQUEsSUFBQSxFQUp1QixRQUl2QixDQUp1QixDQUFBO0FBSzFCOzs4QkFDREUsTyxvQkFBUUYsUSxFQUFVO0FBQUEsWUFBQSxTQUFBLElBQUE7O0FBQ2QsYUFBQSxPQUFBO0FBQ0EsZUFBTyxRQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsRUFB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bXBvcnQgT3JiaXQsIHsgQnVja2V0IH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IHN1cHBvcnRzSW5kZXhlZERCIH0gZnJvbSAnLi9saWIvaW5kZXhlZGRiJztcbi8qKlxuICogQnVja2V0IGZvciBwZXJzaXN0aW5nIHRyYW5zaWVudCBkYXRhIGluIEluZGV4ZWREQi5cbiAqXG4gKiBAY2xhc3MgSW5kZXhlZERCQnVja2V0XG4gKiBAZXh0ZW5kcyBCdWNrZXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhlZERCQnVja2V0IGV4dGVuZHMgQnVja2V0IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCQnVja2V0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhpcyBidWNrZXQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSAgIE9wdGlvbmFsLiBOYW1lc3BhY2Ugb2YgdGhlIGJ1Y2tldC4gV2lsbCBiZSB1c2VkIGZvciB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLnN0b3JlTmFtZV0gICBPcHRpb25hbC4gTmFtZSBvZiB0aGUgSW5kZXhlZERCIE9iamVjdFN0b3JlLiBEZWZhdWx0cyB0byAnZGF0YScuXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBbc2V0dGluZ3MudmVyc2lvbl0gICAgIE9wdGlvbmFsLiBUaGUgdmVyc2lvbiB0byBvcGVuIHRoZSBJbmRleGVkREIgZGF0YWJhc2Ugd2l0aC4gRGVmYXVsdHMgdG8gYDFgLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBJbmRleGVkREIhJywgc3VwcG9ydHNJbmRleGVkREIoKSk7XG4gICAgICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdpbmRleGVkREInO1xuICAgICAgICBzZXR0aW5ncy5zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWUgfHwgJ2RhdGEnO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuICAgIHVwZ3JhZGUoc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiBzdXBlci51cGdyYWRlKHNldHRpbmdzKS50aGVuKCgpID0+IHRoaXMub3BlbkRCKCkpO1xuICAgIH1cbiAgICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9zdG9yZU5hbWUgPSBzZXR0aW5ncy5zdG9yZU5hbWU7XG4gICAgICAgIHJldHVybiBzdXBlci5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBJbmRleGVkREIncyBkZWZhdWx0IHZlcmlvbnMgaXMgMS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gbnVtYmVyLlxuICAgICAqL1xuICAgIGdldCBkYlZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZlcnNpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLlxuICAgICAqXG4gICAgICogRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cbiAgICAgKi9cbiAgICBnZXQgZGJOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGV4ZWREQiBPYmplY3RTdG9yZSBuYW1lLlxuICAgICAqXG4gICAgICogRGVmYXVsdHMgdG8gJ3NldHRpbmdzJywgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxuICAgICAqL1xuICAgIGdldCBkYlN0b3JlTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JlTmFtZTtcbiAgICB9XG4gICAgZ2V0IGlzREJPcGVuKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kYjtcbiAgICB9XG4gICAgb3BlbkRCKCkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRiKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub2xkVmVyc2lvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbG9zZURCKCkge1xuICAgICAgICBpZiAodGhpcy5pc0RCT3Blbikge1xuICAgICAgICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX2RiID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW9wZW5EQigpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpO1xuICAgIH1cbiAgICBjcmVhdGVEQihkYikge1xuICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTsgLy8sIHsga2V5UGF0aDogJ2tleScgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1pZ3JhdGUgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtJREJEYXRhYmFzZX0gZGIgICAgICAgICAgICAgIERhdGFiYXNlIHRvIHVwZ3JhZGUuXG4gICAgICogQHBhcmFtICB7SURCVmVyc2lvbkNoYW5nZUV2ZW50fSBldmVudCBFdmVudCByZXN1bHRpbmcgZnJvbSB2ZXJzaW9uIGNoYW5nZS5cbiAgICAgKi9cbiAgICBtaWdyYXRlREIoZGIsIGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQkJ1Y2tldCNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XG4gICAgfVxuICAgIGRlbGV0ZURCKCkge1xuICAgICAgICB0aGlzLmNsb3NlREIoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RiID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0SXRlbShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRJdGVtJywgcmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gc2V0SXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBzZXRJdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVJdGVtKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuZGJTdG9yZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlSXRlbScsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSByZW1vdmVJdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=