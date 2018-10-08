"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require("@orbit/data");

var _data2 = _interopRequireDefault(_data);

var _utils = require("@orbit/utils");

var _transformOperators = require("./lib/transform-operators");

var _transformOperators2 = _interopRequireDefault(_transformOperators);

var _pullOperators = require("./lib/pull-operators");

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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};

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

        (0, _utils.assert)('IndexedDBSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        (0, _utils.assert)('Your browser does not support IndexedDB!', (0, _indexeddb.supportsIndexedDB)());
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

        return new _data2.default.Promise(function (resolve, reject) {
            if (_this2._db) {
                resolve(_this2._db);
            } else {
                var request = _data2.default.globals.indexedDB.open(_this2.dbName, _this2.dbVersion);
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
        return new _data2.default.Promise(function (resolve, reject) {
            var request = _data2.default.globals.indexedDB.deleteDatabase(_this4.dbName);
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

        return new _data2.default.Promise(function (resolve, reject) {
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
                    reject(new _data.RecordNotFoundException(record.type, record.id));
                }
            };
        });
    };

    IndexedDBSource.prototype.getRecords = function getRecords(type) {
        var _this6 = this;

        return new _data2.default.Promise(function (resolve, reject) {
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
        return new _data2.default.Promise(function (resolve, reject) {
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

        return new _data2.default.Promise(function (resolve, reject) {
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
            return _data2.default.Promise.resolve();
        }
        return new _data2.default.Promise(function (resolve, reject) {
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

        var operator = _pullOperators.PullOperators[query.expression.op];
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
            var result = _data2.default.Promise.resolve();
            transform.operations.forEach(function (operation) {
                var processor = _transformOperators2.default[operation.op];
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
}(_data.Source);
IndexedDBSource = __decorate([_data.pullable, _data.pushable, _data.syncable], IndexedDBSource);
exports.default = IndexedDBSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsInNldHRpbmdzIiwiYXNzZXJ0IiwiT3JiaXQiLCJyZXNvbHZlIiwicmVxdWVzdCIsInJlamVjdCIsImRiIiwiZXZlbnQiLCJjb25zb2xlIiwia2V5UGF0aCIsInRyYW5zYWN0aW9uIiwicmVjb3JkIiwib2JqZWN0U3RvcmUiLCJyZXN1bHQiLCJyZWNvcmRzIiwiY3Vyc29yIiwib2JqZWN0U3RvcmVOYW1lcyIsInR5cGVzIiwib3BlcmF0b3IiLCJQdWxsT3BlcmF0b3JzIiwicXVlcnkiLCJ0cmFuc2Zvcm0iLCJwcm9jZXNzb3IiLCJ0cmFuc2Zvcm1PcGVyYXRvcnMiLCJvcGVyYXRpb24iLCJJbmRleGVkREJTb3VyY2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVhBLElBQUlBLGFBQWEsYUFBUSxVQUFSLFVBQUEsSUFBMkIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQXlDO0FBQ2pGLFFBQUlDLElBQUlDLFVBQVIsTUFBQTtBQUFBLFFBQ0lDLElBQUlGLElBQUFBLENBQUFBLEdBQUFBLE1BQUFBLEdBQWlCRyxTQUFBQSxJQUFBQSxHQUFnQkEsT0FBT0MsT0FBQUEsd0JBQUFBLENBQUFBLE1BQUFBLEVBQXZCRCxHQUF1QkMsQ0FBdkJELEdBRHpCLElBQUE7QUFBQSxRQUFBLENBQUE7QUFHQSxRQUFJLE9BQUEsT0FBQSxLQUFBLFFBQUEsSUFBK0IsT0FBT0UsUUFBUCxRQUFBLEtBQW5DLFVBQUEsRUFBMkVILElBQUlHLFFBQUFBLFFBQUFBLENBQUFBLFVBQUFBLEVBQUFBLE1BQUFBLEVBQUFBLEdBQUFBLEVBQS9FLElBQStF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QVksWUFBQTtBQUFBLDJCQUFNUyxVQUFBQSxPQUFBQSxFQUFOLFNBQU1BLENBQU47QUFBckJULGlCQUFTLENBQVRBO0FBRkpRLGFBQUFBO0FBSUEsbUJBQUEsTUFBQTtBQU5KLFNBQU8sQ0FBUDtBQTVQSixLQUFBOztBQUFBLGlCQUFBLGVBQUEsRUFBQSxDQUFBO0FBQUEsYUFBQSxXQUFBO0FBQUEsYUFBQSxZQXlCZ0I7QUFDWixtQkFBTyxLQUFBLE9BQUEsQ0FBUCxPQUFBO0FBQ0g7QUFDRDs7Ozs7Ozs7QUE1QkEsS0FBQSxFQUFBO0FBQUEsYUFBQSxRQUFBO0FBQUEsYUFBQSxZQW1DYTtBQUNULG1CQUFPLEtBQVAsVUFBQTtBQUNIO0FBckNELEtBQUEsRUFBQTtBQUFBLGFBQUEsVUFBQTtBQUFBLGFBQUEsWUFzQ2U7QUFDWCxtQkFBTyxDQUFDLENBQUMsS0FBVCxHQUFBO0FBQ0g7QUF4Q0QsS0FBQSxFQUFBO0FBQUEsYUFBQSxnQkFBQTtBQUFBLGFBQUEsWUFpS3FCO0FBQ2pCLGdCQUFNTCxtQkFBbUIsS0FBQSxHQUFBLENBQXpCLGdCQUFBO0FBQ0EsZ0JBQU1DLFFBQU4sRUFBQTtBQUNBLGlCQUFLLElBQUlwQixJQUFULENBQUEsRUFBZ0JBLElBQUltQixpQkFBcEIsTUFBQSxFQUFBLEdBQUEsRUFBa0Q7QUFDOUNDLHNCQUFBQSxJQUFBQSxDQUFXRCxpQkFBQUEsSUFBQUEsQ0FBWEMsQ0FBV0QsQ0FBWEM7QUFDSDtBQUNELG1CQUFBLEtBQUE7QUFDSDtBQXhLRCxLQUFBLENBQUE7O0FBQUEsV0FBQSxlQUFBO0FBQUEsQ0FBQSxDQUFKLFlBQUksQ0FBSjtBQXNRQVEsa0JBQWtCbkMsV0FBVyxDQUFBLGNBQUEsRUFBQSxjQUFBLEVBQVhBLGNBQVcsQ0FBWEEsRUFBbEJtQyxlQUFrQm5DLENBQWxCbUM7a0JBQ0EsZSIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQsIHsgcHVsbGFibGUsIHB1c2hhYmxlLCBzeW5jYWJsZSwgU291cmNlLCBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbiB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgdHJhbnNmb3JtT3BlcmF0b3JzIGZyb20gJy4vbGliL3RyYW5zZm9ybS1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcbmltcG9ydCB7IHN1cHBvcnRzSW5kZXhlZERCIH0gZnJvbSAnLi9saWIvaW5kZXhlZGRiJztcbi8qKlxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gSW5kZXhlZERCLlxuICpcbiAqIEBjbGFzcyBJbmRleGVkREJTb3VyY2VcbiAqIEBleHRlbmRzIFNvdXJjZVxuICovXG5sZXQgSW5kZXhlZERCU291cmNlID0gY2xhc3MgSW5kZXhlZERCU291cmNlIGV4dGVuZHMgU291cmNlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgSW5kZXhlZERCU291cmNlLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3MgPSB7fV1cbiAgICAgKiBAcGFyYW0ge1NjaGVtYX0gIFtzZXR0aW5ncy5zY2hlbWFdICAgIE9yYml0IFNjaGVtYS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIGZvciBzb3VyY2UuIERlZmF1bHRzIHRvICdpbmRleGVkREInLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIE5hbWVzcGFjZSBvZiB0aGUgYXBwbGljYXRpb24uIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdJbmRleGVkREJTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xuICAgICAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEluZGV4ZWREQiEnLCBzdXBwb3J0c0luZGV4ZWREQigpKTtcbiAgICAgICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2luZGV4ZWREQic7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XG4gICAgfVxuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlb3BlbkRCKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIHRvIHNwZWNpZnkgd2hlbiBvcGVuaW5nIHRoZSBJbmRleGVkREIgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG51bWJlci5cbiAgICAgKi9cbiAgICBnZXQgZGJWZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1hLnZlcnNpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLlxuICAgICAqXG4gICAgICogRGVmYXVsdHMgdG8gdGhlIG5hbWVzcGFjZSBvZiB0aGUgYXBwLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IERhdGFiYXNlIG5hbWUuXG4gICAgICovXG4gICAgZ2V0IGRiTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcbiAgICB9XG4gICAgZ2V0IGlzREJPcGVuKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kYjtcbiAgICB9XG4gICAgb3BlbkRCKCkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9kYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gT3JiaXQuZ2xvYmFscy5pbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3Igb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRiKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXhlZERCIHVwZ3JhZGUgbmVlZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub2xkVmVyc2lvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWlncmF0ZURCKGRiLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZURCKGRiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbG9zZURCKCkge1xuICAgICAgICBpZiAodGhpcy5pc0RCT3Blbikge1xuICAgICAgICAgICAgdGhpcy5fZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX2RiID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW9wZW5EQigpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpO1xuICAgIH1cbiAgICBjcmVhdGVEQihkYikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnY3JlYXRlREInKTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKG1vZGVsID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWlncmF0ZSBkYXRhYmFzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lEQkRhdGFiYXNlfSBkYiAgICAgICAgICAgICAgRGF0YWJhc2UgdG8gdXBncmFkZS5cbiAgICAgKiBAcGFyYW0gIHtJREJWZXJzaW9uQ2hhbmdlRXZlbnR9IGV2ZW50IEV2ZW50IHJlc3VsdGluZyBmcm9tIHZlcnNpb24gY2hhbmdlLlxuICAgICAqL1xuICAgIG1pZ3JhdGVEQihkYiwgZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSW5kZXhlZERCU291cmNlI21pZ3JhdGVEQiAtIHNob3VsZCBiZSBvdmVycmlkZGVuIHRvIHVwZ3JhZGUgSURCRGF0YWJhc2UgZnJvbTogJywgZXZlbnQub2xkVmVyc2lvbiwgJyAtPiAnLCBldmVudC5uZXdWZXJzaW9uKTtcbiAgICB9XG4gICAgZGVsZXRlREIoKSB7XG4gICAgICAgIHRoaXMuY2xvc2VEQigpO1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZSh0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcignZXJyb3IgZGVsZXRpbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyTW9kZWwoZGIsIG1vZGVsKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZWdpc3Rlck1vZGVsJywgbW9kZWwpO1xuICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShtb2RlbCwgeyBrZXlQYXRoOiAnaWQnIH0pO1xuICAgICAgICAvLyBUT0RPIC0gY3JlYXRlIGluZGljZXNcbiAgICB9XG4gICAgZ2V0UmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbcmVjb3JkLnR5cGVdKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChyZWNvcmQuaWQpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0UmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkJywgcmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24ocmVjb3JkLnR5cGUsIHJlY29yZC5pZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRSZWNvcmRzKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3R5cGVdKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUub3BlbkN1cnNvcigpO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gZ2V0UmVjb3JkcycsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIGdldFJlY29yZHMnLCByZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWNvcmQgPSBjdXJzb3IudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVjb3Jkcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBhdmFpbGFibGVUeXBlcygpIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmVOYW1lcyA9IHRoaXMuX2RiLm9iamVjdFN0b3JlTmFtZXM7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0U3RvcmVOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdHlwZXMucHVzaChvYmplY3RTdG9yZU5hbWVzLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG4gICAgcHV0UmVjb3JkKHJlY29yZCkge1xuICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFtyZWNvcmQudHlwZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUucHV0KHJlY29yZCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBwdXRSZWNvcmQnLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBwdXRSZWNvcmQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFtyZWNvcmQudHlwZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmRlbGV0ZShyZWNvcmQuaWQpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkJywgcmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlUmVjb3JkJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyUmVjb3Jkcyh0eXBlKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdHlwZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuY2xlYXIoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZVJlY29yZHMnLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSByZW1vdmVSZWNvcmRzJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUmVzZXR0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIHJlc2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGVEQigpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3N5bmModHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9jZXNzVHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfcHVzaCh0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKS50aGVuKCgpID0+IFt0cmFuc2Zvcm1dKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3B1bGwocXVlcnkpIHtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xuICAgICAgICBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZGV4ZWREQlNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJpdmF0ZVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzb3IgPSB0cmFuc2Zvcm1PcGVyYXRvcnNbb3BlcmF0aW9uLm9wXTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQudGhlbigoKSA9PiBwcm9jZXNzb3IodGhpcywgb3BlcmF0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5JbmRleGVkREJTb3VyY2UgPSBfX2RlY29yYXRlKFtwdWxsYWJsZSwgcHVzaGFibGUsIHN5bmNhYmxlXSwgSW5kZXhlZERCU291cmNlKTtcbmV4cG9ydCBkZWZhdWx0IEluZGV4ZWREQlNvdXJjZTsiXX0=