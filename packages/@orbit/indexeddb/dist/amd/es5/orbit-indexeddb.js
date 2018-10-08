define('@orbit/indexeddb', ['exports', '@orbit/data', '@orbit/utils', '@orbit/core'], function (exports, Orbit, _orbit_utils, Orbit$1) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;
Orbit$1 = 'default' in Orbit$1 ? Orbit$1['default'] : Orbit$1;

function getRecord(source, record) {
    return source.getRecord(record).catch(function () {
        return Orbit.cloneRecordIdentity(record);
    });
}
var transformOperators = {
    addRecord: function (source, operation) {
        return source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        return source.getRecord(updates).catch(function () {
            return null;
        }).then(function (current) {
            var record = Orbit.mergeRecords(current, updates);
            return source.putRecord(record);
        });
    },
    removeRecord: function (source, operation) {
        return source.removeRecord(operation.record);
    },
    replaceKey: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            record.keys = record.keys || {};
            record.keys[operation.key] = operation.value;
            return source.putRecord(record);
        });
    },
    replaceAttribute: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            record.attributes = record.attributes || {};
            record.attributes[operation.attribute] = operation.value;
            return source.putRecord(record);
        });
    },
    addToRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            var relationships = _orbit_utils.deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                relationships.push(operation.relatedRecord);
            } else {
                _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
            }
            return source.putRecord(record);
        });
    },
    removeFromRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            var relationships = _orbit_utils.deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (var i = 0, l = relationships.length; i < l; i++) {
                    if (Orbit.equalRecordIdentities(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        });
    },
    replaceRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
            return source.putRecord(record);
        });
    },
    replaceRelatedRecord: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
            return source.putRecord(record);
        });
    }
};

var PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce(function (chain, type) {
            return chain.then(function () {
                return source.getRecords(type).then(function (records) {
                    records.forEach(function (record) {
                        operations.push({
                            op: 'addRecord',
                            record: record
                        });
                    });
                });
            });
        }, Orbit__default.Promise.resolve()).then(function () {
            return [Orbit.buildTransform(operations)];
        });
    },
    findRecord: function (source, expression) {
        return source.getRecord(expression.record).then(function (record) {
            var operations = [{
                op: 'addRecord',
                record: record
            }];
            return [Orbit.buildTransform(operations)];
        });
    }
};

function supportsIndexedDB() {
    return !!Orbit$1.globals.indexedDB;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

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

        _orbit_utils.assert('IndexedDBSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        _orbit_utils.assert('Your browser does not support IndexedDB!', supportsIndexedDB());
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

        return new Orbit__default.Promise(function (resolve, reject) {
            if (_this2._db) {
                resolve(_this2._db);
            } else {
                var request = Orbit__default.globals.indexedDB.open(_this2.dbName, _this2.dbVersion);
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
        return new Orbit__default.Promise(function (resolve, reject) {
            var request = Orbit__default.globals.indexedDB.deleteDatabase(_this4.dbName);
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

        return new Orbit__default.Promise(function (resolve, reject) {
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
                    reject(new Orbit.RecordNotFoundException(record.type, record.id));
                }
            };
        });
    };

    IndexedDBSource.prototype.getRecords = function getRecords(type) {
        var _this6 = this;

        return new Orbit__default.Promise(function (resolve, reject) {
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
        return new Orbit__default.Promise(function (resolve, reject) {
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

        return new Orbit__default.Promise(function (resolve, reject) {
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
            return Orbit__default.Promise.resolve();
        }
        return new Orbit__default.Promise(function (resolve, reject) {
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
            var result = Orbit__default.Promise.resolve();
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
}(Orbit.Source);
IndexedDBSource = __decorate([Orbit.pullable, Orbit.pushable, Orbit.syncable], IndexedDBSource);
var IndexedDBSource$1 = IndexedDBSource;

exports['default'] = IndexedDBSource$1;
exports.supportsIndexedDB = supportsIndexedDB;

Object.defineProperty(exports, '__esModule', { value: true });

});
