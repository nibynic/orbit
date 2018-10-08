define('@orbit/indexeddb-bucket', ['exports', '@orbit/core', '@orbit/utils'], function (exports, Orbit, _orbit_utils) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;

function supportsIndexedDB() {
    return !!Orbit__default.globals.indexedDB;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

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

        _orbit_utils.assert('Your browser does not support IndexedDB!', supportsIndexedDB());
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

        return new Orbit__default.Promise(function (resolve, reject) {
            if (_this3._db) {
                resolve(_this3._db);
            } else {
                var request = Orbit__default.globals.indexedDB.open(_this3.dbName, _this3.dbVersion);
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
        return new Orbit__default.Promise(function (resolve, reject) {
            var request = Orbit__default.globals.indexedDB.deleteDatabase(_this4.dbName);
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
            return new Orbit__default.Promise(function (resolve, reject) {
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
            return new Orbit__default.Promise(function (resolve, reject) {
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
            return new Orbit__default.Promise(function (resolve, reject) {
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
}(Orbit.Bucket);

exports['default'] = IndexedDBBucket;
exports.supportsIndexedDB = supportsIndexedDB;

Object.defineProperty(exports, '__esModule', { value: true });

});
