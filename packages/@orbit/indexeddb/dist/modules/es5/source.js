var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit, { pullable, pushable, syncable, Source, RecordNotFoundException } from '@orbit/data';
import { assert } from '@orbit/utils';
import transformOperators from './lib/transform-operators';
import { PullOperators } from './lib/pull-operators';
import { supportsIndexedDB } from './lib/indexeddb';
/**
 * Source for storing data in IndexedDB.
 *
 * @class IndexedDBSource
 * @extends Source
 */
var IndexedDBSource = function (_Source) {
    _inherits(IndexedDBSource, _Source);

    /**
     * Create a new IndexedDBSource.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {Schema}  [settings.schema]    Orbit Schema.
     * @param {String}  [settings.name]      Optional. Name for source. Defaults to 'indexedDB'.
     * @param {String}  [settings.namespace] Optional. Namespace of the application. Will be used for the IndexedDB database name. Defaults to 'orbit'.
     */
    function IndexedDBSource() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, IndexedDBSource);

        assert('IndexedDBSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        assert('Your browser does not support IndexedDB!', supportsIndexedDB());
        settings.name = settings.name || 'indexedDB';

        var _this = _possibleConstructorReturn(this, _Source.call(this, settings));

        _this._namespace = settings.namespace || 'orbit';
        return _this;
    }

    IndexedDBSource.prototype.upgrade = function upgrade() {
        return this.reopenDB();
    };
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * @return {Integer} Version number.
     */


    IndexedDBSource.prototype.openDB = function openDB() {
        var _this2 = this;

        return new Orbit.Promise(function (resolve, reject) {
            if (_this2._db) {
                resolve(_this2._db);
            } else {
                var request = Orbit.globals.indexedDB.open(_this2.dbName, _this2.dbVersion);
                request.onerror = function () {
                    // console.error('error opening indexedDB', this.dbName);
                    reject(request.error);
                };
                request.onsuccess = function () {
                    // console.log('success opening indexedDB', this.dbName);
                    var db = _this2._db = request.result;
                    resolve(db);
                };
                request.onupgradeneeded = function (event) {
                    // console.log('indexedDB upgrade needed');
                    var db = _this2._db = event.target.result;
                    if (event && event.oldVersion > 0) {
                        _this2.migrateDB(db, event);
                    } else {
                        _this2.createDB(db);
                    }
                };
            }
        });
    };

    IndexedDBSource.prototype.closeDB = function closeDB() {
        if (this.isDBOpen) {
            this._db.close();
            this._db = null;
        }
    };

    IndexedDBSource.prototype.reopenDB = function reopenDB() {
        this.closeDB();
        return this.openDB();
    };

    IndexedDBSource.prototype.createDB = function createDB(db) {
        var _this3 = this;

        // console.log('createDB');
        Object.keys(this.schema.models).forEach(function (model) {
            _this3.registerModel(db, model);
        });
    };
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */


    IndexedDBSource.prototype.migrateDB = function migrateDB(db, event) {
        console.error('IndexedDBSource#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    };

    IndexedDBSource.prototype.deleteDB = function deleteDB() {
        var _this4 = this;

        this.closeDB();
        return new Orbit.Promise(function (resolve, reject) {
            var request = Orbit.globals.indexedDB.deleteDatabase(_this4.dbName);
            request.onerror = function () {
                // console.error('error deleting indexedDB', this.dbName);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success deleting indexedDB', this.dbName);
                resolve();
            };
        });
    };

    IndexedDBSource.prototype.registerModel = function registerModel(db, model) {
        // console.log('registerModel', model);
        db.createObjectStore(model, { keyPath: 'id' });
        // TODO - create indices
    };

    IndexedDBSource.prototype.getRecord = function getRecord(record) {
        var _this5 = this;

        return new Orbit.Promise(function (resolve, reject) {
            var transaction = _this5._db.transaction([record.type]);
            var objectStore = transaction.objectStore(record.type);
            var request = objectStore.get(record.id);
            request.onerror = function () {
                console.error('error - getRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - getRecord', request.result);
                var result = request.result;
                if (result) {
                    if (_this5._keyMap) {
                        _this5._keyMap.pushRecord(result);
                    }
                    resolve(result);
                } else {
                    reject(new RecordNotFoundException(record.type, record.id));
                }
            };
        });
    };

    IndexedDBSource.prototype.getRecords = function getRecords(type) {
        var _this6 = this;

        return new Orbit.Promise(function (resolve, reject) {
            var transaction = _this6._db.transaction([type]);
            var objectStore = transaction.objectStore(type);
            var request = objectStore.openCursor();
            var records = [];
            request.onerror = function () {
                console.error('error - getRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = function (event) {
                // console.log('success - getRecords', request.result);
                var cursor = event.target.result;
                if (cursor) {
                    var record = cursor.value;
                    if (_this6._keyMap) {
                        _this6._keyMap.pushRecord(record);
                    }
                    records.push(record);
                    cursor.continue();
                } else {
                    resolve(records);
                }
            };
        });
    };

    IndexedDBSource.prototype.putRecord = function putRecord(record) {
        var _this7 = this;

        var transaction = this._db.transaction([record.type], 'readwrite');
        var objectStore = transaction.objectStore(record.type);
        return new Orbit.Promise(function (resolve, reject) {
            var request = objectStore.put(record);
            request.onerror = function () {
                console.error('error - putRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - putRecord');
                if (_this7._keyMap) {
                    _this7._keyMap.pushRecord(record);
                }
                resolve();
            };
        });
    };

    IndexedDBSource.prototype.removeRecord = function removeRecord(record) {
        var _this8 = this;

        return new Orbit.Promise(function (resolve, reject) {
            var transaction = _this8._db.transaction([record.type], 'readwrite');
            var objectStore = transaction.objectStore(record.type);
            var request = objectStore.delete(record.id);
            request.onerror = function () {
                console.error('error - removeRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecord');
                resolve();
            };
        });
    };

    IndexedDBSource.prototype.clearRecords = function clearRecords(type) {
        var _this9 = this;

        if (!this._db) {
            return Orbit.Promise.resolve();
        }
        return new Orbit.Promise(function (resolve, reject) {
            var transaction = _this9._db.transaction([type], 'readwrite');
            var objectStore = transaction.objectStore(type);
            var request = objectStore.clear();
            request.onerror = function () {
                console.error('error - removeRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecords');
                resolve();
            };
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    IndexedDBSource.prototype.reset = function reset() {
        return this.deleteDB();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    IndexedDBSource.prototype._sync = function _sync(transform) {
        return this._processTransform(transform);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    IndexedDBSource.prototype._push = function _push(transform) {
        return this._processTransform(transform).then(function () {
            return [transform];
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////


    IndexedDBSource.prototype._pull = function _pull(query) {
        var _this10 = this;

        var operator = PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('IndexedDBSource does not support the `${query.expression.op}` operator for queries.');
        }
        return this.openDB().then(function () {
            return operator(_this10, query.expression);
        });
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private
    /////////////////////////////////////////////////////////////////////////////


    IndexedDBSource.prototype._processTransform = function _processTransform(transform) {
        var _this11 = this;

        return this.openDB().then(function () {
            var result = Orbit.Promise.resolve();
            transform.operations.forEach(function (operation) {
                var processor = transformOperators[operation.op];
                result = result.then(function () {
                    return processor(_this11, operation);
                });
            });
            return result;
        });
    };

    _createClass(IndexedDBSource, [{
        key: "dbVersion",
        get: function () {
            return this._schema.version;
        }
        /**
         * IndexedDB database name.
         *
         * Defaults to the namespace of the app, which can be overridden in the constructor.
         *
         * @return {String} Database name.
         */

    }, {
        key: "dbName",
        get: function () {
            return this._namespace;
        }
    }, {
        key: "isDBOpen",
        get: function () {
            return !!this._db;
        }
    }, {
        key: "availableTypes",
        get: function () {
            var objectStoreNames = this._db.objectStoreNames;
            var types = [];
            for (var i = 0; i < objectStoreNames.length; i++) {
                types.push(objectStoreNames.item(i));
            }
            return types;
        }
    }]);

    return IndexedDBSource;
}(Source);
IndexedDBSource = __decorate([pullable, pushable, syncable], IndexedDBSource);
export default IndexedDBSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJPcmJpdCIsInB1bGxhYmxlIiwicHVzaGFibGUiLCJzeW5jYWJsZSIsIlNvdXJjZSIsIlJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIiwiYXNzZXJ0IiwidHJhbnNmb3JtT3BlcmF0b3JzIiwiUHVsbE9wZXJhdG9ycyIsInN1cHBvcnRzSW5kZXhlZERCIiwiSW5kZXhlZERCU291cmNlIiwic2V0dGluZ3MiLCJzY2hlbWEiLCJuYW1lIiwiX25hbWVzcGFjZSIsIm5hbWVzcGFjZSIsInVwZ3JhZGUiLCJyZW9wZW5EQiIsIm9wZW5EQiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX2RiIiwicmVxdWVzdCIsImdsb2JhbHMiLCJpbmRleGVkREIiLCJvcGVuIiwiZGJOYW1lIiwiZGJWZXJzaW9uIiwib25lcnJvciIsImVycm9yIiwib25zdWNjZXNzIiwiZGIiLCJyZXN1bHQiLCJvbnVwZ3JhZGVuZWVkZWQiLCJldmVudCIsIm9sZFZlcnNpb24iLCJtaWdyYXRlREIiLCJjcmVhdGVEQiIsImNsb3NlREIiLCJpc0RCT3BlbiIsImNsb3NlIiwia2V5cyIsIm1vZGVscyIsImZvckVhY2giLCJyZWdpc3Rlck1vZGVsIiwibW9kZWwiLCJjb25zb2xlIiwibmV3VmVyc2lvbiIsImRlbGV0ZURCIiwiZGVsZXRlRGF0YWJhc2UiLCJjcmVhdGVPYmplY3RTdG9yZSIsImtleVBhdGgiLCJnZXRSZWNvcmQiLCJyZWNvcmQiLCJ0cmFuc2FjdGlvbiIsInR5cGUiLCJvYmplY3RTdG9yZSIsImdldCIsImlkIiwiX2tleU1hcCIsInB1c2hSZWNvcmQiLCJnZXRSZWNvcmRzIiwib3BlbkN1cnNvciIsInJlY29yZHMiLCJjdXJzb3IiLCJ2YWx1ZSIsInB1c2giLCJjb250aW51ZSIsInB1dFJlY29yZCIsInB1dCIsInJlbW92ZVJlY29yZCIsImRlbGV0ZSIsImNsZWFyUmVjb3JkcyIsImNsZWFyIiwicmVzZXQiLCJfc3luYyIsInRyYW5zZm9ybSIsIl9wcm9jZXNzVHJhbnNmb3JtIiwiX3B1c2giLCJ0aGVuIiwiX3B1bGwiLCJxdWVyeSIsIm9wZXJhdG9yIiwiZXhwcmVzc2lvbiIsIm9wIiwiRXJyb3IiLCJvcGVyYXRpb25zIiwicHJvY2Vzc29yIiwib3BlcmF0aW9uIiwiX3NjaGVtYSIsInZlcnNpb24iLCJvYmplY3RTdG9yZU5hbWVzIiwidHlwZXMiLCJpdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFVQyxNQUFsQjtBQUFBLFFBQ0lDLElBQUlILElBQUksQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxTQUFTLElBQVQsR0FBZ0JBLE9BQU9LLE9BQU9DLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBRC9GO0FBQUEsUUFFSU8sQ0FGSjtBQUdBLFFBQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxRQUFRQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxJQUFJSSxRQUFRQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQW9JLEtBQUssSUFBSVUsSUFBSWIsV0FBV00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sS0FBSyxDQUF6QyxFQUE0Q0EsR0FBNUM7QUFBaUQsWUFBSUgsSUFBSVYsV0FBV2EsQ0FBWCxDQUFSLEVBQXVC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K0YsS0FBUDtBQUNIO0FBeEtEOztBQUFBO0FBQUEsRUFBZ0R6RixNQUFoRCxDQUFKO0FBc1FBTSxrQkFBa0IxQixXQUFXLENBQUNpQixRQUFELEVBQVdDLFFBQVgsRUFBcUJDLFFBQXJCLENBQVgsRUFBMkNPLGVBQTNDLENBQWxCO0FBQ0EsZUFBZUEsZUFBZiIsImZpbGUiOiJzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9IHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IE9yYml0LCB7IHB1bGxhYmxlLCBwdXNoYWJsZSwgc3luY2FibGUsIFNvdXJjZSwgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcbmltcG9ydCB7IFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XG4vKipcbiAqIFNvdXJjZSBmb3Igc3RvcmluZyBkYXRhIGluIEluZGV4ZWREQi5cbiAqXG4gKiBAY2xhc3MgSW5kZXhlZERCU291cmNlXG4gKiBAZXh0ZW5kcyBTb3VyY2VcbiAqL1xubGV0IEluZGV4ZWREQlNvdXJjZSA9IGNsYXNzIEluZGV4ZWREQlNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IEluZGV4ZWREQlNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgW3NldHRpbmdzID0ge31dXG4gICAgICogQHBhcmFtIHtTY2hlbWF9ICBbc2V0dGluZ3Muc2NoZW1hXSAgICBPcmJpdCBTY2hlbWEuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZV0gICAgICBPcHRpb25hbC4gTmFtZSBmb3Igc291cmNlLiBEZWZhdWx0cyB0byAnaW5kZXhlZERCJy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBOYW1lc3BhY2Ugb2YgdGhlIGFwcGxpY2F0aW9uLiBXaWxsIGJlIHVzZWQgZm9yIHRoZSBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS4gRGVmYXVsdHMgdG8gJ29yYml0Jy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnSW5kZXhlZERCU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcbiAgICAgICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBJbmRleGVkREIhJywgc3VwcG9ydHNJbmRleGVkREIoKSk7XG4gICAgICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdpbmRleGVkREInO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuX25hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZSB8fCAnb3JiaXQnO1xuICAgIH1cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW9wZW5EQigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgdmVyc2lvbiB0byBzcGVjaWZ5IHdoZW4gb3BlbmluZyB0aGUgSW5kZXhlZERCIGRhdGFiYXNlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gVmVyc2lvbiBudW1iZXIuXG4gICAgICovXG4gICAgZ2V0IGRiVmVyc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjaGVtYS52ZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS5cbiAgICAgKlxuICAgICAqIERlZmF1bHRzIHRvIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGFwcCwgd2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBEYXRhYmFzZSBuYW1lLlxuICAgICAqL1xuICAgIGdldCBkYk5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gICAgfVxuICAgIGdldCBpc0RCT3BlbigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGI7XG4gICAgfVxuICAgIG9wZW5EQigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kYikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5fZGIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLm9wZW4odGhpcy5kYk5hbWUsIHRoaXMuZGJWZXJzaW9uKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3Mgb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4ZWREQiB1cGdyYWRlIG5lZWRlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50Lm9sZFZlcnNpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pZ3JhdGVEQihkYiwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEQihkYik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xvc2VEQigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEQk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2RiLmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVvcGVuREIoKSB7XG4gICAgICAgIHRoaXMuY2xvc2VEQigpO1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKTtcbiAgICB9XG4gICAgY3JlYXRlREIoZGIpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NyZWF0ZURCJyk7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hLm1vZGVscykuZm9yRWFjaChtb2RlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwoZGIsIG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1pZ3JhdGUgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtJREJEYXRhYmFzZX0gZGIgICAgICAgICAgICAgIERhdGFiYXNlIHRvIHVwZ3JhZGUuXG4gICAgICogQHBhcmFtICB7SURCVmVyc2lvbkNoYW5nZUV2ZW50fSBldmVudCBFdmVudCByZXN1bHRpbmcgZnJvbSB2ZXJzaW9uIGNoYW5nZS5cbiAgICAgKi9cbiAgICBtaWdyYXRlREIoZGIsIGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0luZGV4ZWREQlNvdXJjZSNtaWdyYXRlREIgLSBzaG91bGQgYmUgb3ZlcnJpZGRlbiB0byB1cGdyYWRlIElEQkRhdGFiYXNlIGZyb206ICcsIGV2ZW50Lm9sZFZlcnNpb24sICcgLT4gJywgZXZlbnQubmV3VmVyc2lvbik7XG4gICAgfVxuICAgIGRlbGV0ZURCKCkge1xuICAgICAgICB0aGlzLmNsb3NlREIoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UodGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWdpc3Rlck1vZGVsKGRiLCBtb2RlbCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVnaXN0ZXJNb2RlbCcsIG1vZGVsKTtcbiAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUobW9kZWwsIHsga2V5UGF0aDogJ2lkJyB9KTtcbiAgICAgICAgLy8gVE9ETyAtIGNyZWF0ZSBpbmRpY2VzXG4gICAgfVxuICAgIGdldFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSk7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZCcsIHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gcmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uKHJlY29yZC50eXBlLCByZWNvcmQuaWQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UmVjb3Jkcyh0eXBlKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSk7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldFJlY29yZHMnLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRSZWNvcmRzJywgcmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjb3JkID0gY3Vyc29yLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgYXZhaWxhYmxlVHlwZXMoKSB7XG4gICAgICAgIGNvbnN0IG9iamVjdFN0b3JlTmFtZXMgPSB0aGlzLl9kYi5vYmplY3RTdG9yZU5hbWVzO1xuICAgICAgICBjb25zdCB0eXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFN0b3JlTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHR5cGVzLnB1c2gob2JqZWN0U3RvcmVOYW1lcy5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuICAgIHB1dFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLnB1dChyZWNvcmQpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcHV0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcHV0UmVjb3JkJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVtb3ZlUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdLCAncmVhZHdyaXRlJyk7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5kZWxldGUocmVjb3JkLmlkKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZVJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbGVhclJlY29yZHModHlwZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2RiKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3R5cGVdLCAncmVhZHdyaXRlJyk7XG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmNsZWFyKCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkcycpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFJlc2V0dGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICByZXNldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsZXRlREIoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTeW5jYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9zeW5jKHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3B1c2godHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSkudGhlbigoKSA9PiBbdHJhbnNmb3JtXSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVsbGFibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9wdWxsKHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gUHVsbE9wZXJhdG9yc1txdWVyeS5leHByZXNzaW9uLm9wXTtcbiAgICAgICAgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmRleGVkREJTb3VyY2UgZG9lcyBub3Qgc3VwcG9ydCB0aGUgYCR7cXVlcnkuZXhwcmVzc2lvbi5vcH1gIG9wZXJhdG9yIGZvciBxdWVyaWVzLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpLnRoZW4oKCkgPT4gb3BlcmF0b3IodGhpcywgcXVlcnkuZXhwcmVzc2lvbikpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByaXZhdGVcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5vcGVyYXRpb25zLmZvckVhY2gob3BlcmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvY2Vzc29yID0gdHJhbnNmb3JtT3BlcmF0b3JzW29wZXJhdGlvbi5vcF07XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnRoZW4oKCkgPT4gcHJvY2Vzc29yKHRoaXMsIG9wZXJhdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuSW5kZXhlZERCU291cmNlID0gX19kZWNvcmF0ZShbcHVsbGFibGUsIHB1c2hhYmxlLCBzeW5jYWJsZV0sIEluZGV4ZWREQlNvdXJjZSk7XG5leHBvcnQgZGVmYXVsdCBJbmRleGVkREJTb3VyY2U7Il19