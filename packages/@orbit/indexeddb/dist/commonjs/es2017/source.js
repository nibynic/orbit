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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Source for storing data in IndexedDB.
 *
 * @class IndexedDBSource
 * @extends Source
 */
let IndexedDBSource = class IndexedDBSource extends _data.Source {
    /**
     * Create a new IndexedDBSource.
     *
     * @constructor
     * @param {Object}  [settings = {}]
     * @param {Schema}  [settings.schema]    Orbit Schema.
     * @param {String}  [settings.name]      Optional. Name for source. Defaults to 'indexedDB'.
     * @param {String}  [settings.namespace] Optional. Namespace of the application. Will be used for the IndexedDB database name. Defaults to 'orbit'.
     */
    constructor(settings = {}) {
        (0, _utils.assert)('IndexedDBSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        (0, _utils.assert)('Your browser does not support IndexedDB!', (0, _indexeddb.supportsIndexedDB)());
        settings.name = settings.name || 'indexedDB';
        super(settings);
        this._namespace = settings.namespace || 'orbit';
    }
    upgrade() {
        return this.reopenDB();
    }
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * @return {Integer} Version number.
     */
    get dbVersion() {
        return this._schema.version;
    }
    /**
     * IndexedDB database name.
     *
     * Defaults to the namespace of the app, which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    get dbName() {
        return this._namespace;
    }
    get isDBOpen() {
        return !!this._db;
    }
    openDB() {
        return new _data2.default.Promise((resolve, reject) => {
            if (this._db) {
                resolve(this._db);
            } else {
                let request = _data2.default.globals.indexedDB.open(this.dbName, this.dbVersion);
                request.onerror = () => {
                    // console.error('error opening indexedDB', this.dbName);
                    reject(request.error);
                };
                request.onsuccess = () => {
                    // console.log('success opening indexedDB', this.dbName);
                    const db = this._db = request.result;
                    resolve(db);
                };
                request.onupgradeneeded = event => {
                    // console.log('indexedDB upgrade needed');
                    const db = this._db = event.target.result;
                    if (event && event.oldVersion > 0) {
                        this.migrateDB(db, event);
                    } else {
                        this.createDB(db);
                    }
                };
            }
        });
    }
    closeDB() {
        if (this.isDBOpen) {
            this._db.close();
            this._db = null;
        }
    }
    reopenDB() {
        this.closeDB();
        return this.openDB();
    }
    createDB(db) {
        // console.log('createDB');
        Object.keys(this.schema.models).forEach(model => {
            this.registerModel(db, model);
        });
    }
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    migrateDB(db, event) {
        console.error('IndexedDBSource#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    }
    deleteDB() {
        this.closeDB();
        return new _data2.default.Promise((resolve, reject) => {
            let request = _data2.default.globals.indexedDB.deleteDatabase(this.dbName);
            request.onerror = () => {
                // console.error('error deleting indexedDB', this.dbName);
                reject(request.error);
            };
            request.onsuccess = () => {
                // console.log('success deleting indexedDB', this.dbName);
                resolve();
            };
        });
    }
    registerModel(db, model) {
        // console.log('registerModel', model);
        db.createObjectStore(model, { keyPath: 'id' });
        // TODO - create indices
    }
    getRecord(record) {
        return new _data2.default.Promise((resolve, reject) => {
            const transaction = this._db.transaction([record.type]);
            const objectStore = transaction.objectStore(record.type);
            const request = objectStore.get(record.id);
            request.onerror = function () {
                console.error('error - getRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = () => {
                // console.log('success - getRecord', request.result);
                let result = request.result;
                if (result) {
                    if (this._keyMap) {
                        this._keyMap.pushRecord(result);
                    }
                    resolve(result);
                } else {
                    reject(new _data.RecordNotFoundException(record.type, record.id));
                }
            };
        });
    }
    getRecords(type) {
        return new _data2.default.Promise((resolve, reject) => {
            const transaction = this._db.transaction([type]);
            const objectStore = transaction.objectStore(type);
            const request = objectStore.openCursor();
            const records = [];
            request.onerror = function () {
                console.error('error - getRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = event => {
                // console.log('success - getRecords', request.result);
                const cursor = event.target.result;
                if (cursor) {
                    let record = cursor.value;
                    if (this._keyMap) {
                        this._keyMap.pushRecord(record);
                    }
                    records.push(record);
                    cursor.continue();
                } else {
                    resolve(records);
                }
            };
        });
    }
    get availableTypes() {
        const objectStoreNames = this._db.objectStoreNames;
        const types = [];
        for (let i = 0; i < objectStoreNames.length; i++) {
            types.push(objectStoreNames.item(i));
        }
        return types;
    }
    putRecord(record) {
        const transaction = this._db.transaction([record.type], 'readwrite');
        const objectStore = transaction.objectStore(record.type);
        return new _data2.default.Promise((resolve, reject) => {
            const request = objectStore.put(record);
            request.onerror = function () {
                console.error('error - putRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = () => {
                // console.log('success - putRecord');
                if (this._keyMap) {
                    this._keyMap.pushRecord(record);
                }
                resolve();
            };
        });
    }
    removeRecord(record) {
        return new _data2.default.Promise((resolve, reject) => {
            const transaction = this._db.transaction([record.type], 'readwrite');
            const objectStore = transaction.objectStore(record.type);
            const request = objectStore.delete(record.id);
            request.onerror = function () {
                console.error('error - removeRecord', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecord');
                resolve();
            };
        });
    }
    clearRecords(type) {
        if (!this._db) {
            return _data2.default.Promise.resolve();
        }
        return new _data2.default.Promise((resolve, reject) => {
            const transaction = this._db.transaction([type], 'readwrite');
            const objectStore = transaction.objectStore(type);
            const request = objectStore.clear();
            request.onerror = function () {
                console.error('error - removeRecords', request.error);
                reject(request.error);
            };
            request.onsuccess = function () {
                // console.log('success - removeRecords');
                resolve();
            };
        });
    }
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    reset() {
        return this.deleteDB();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _sync(transform) {
        return this._processTransform(transform);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _push(transform) {
        return this._processTransform(transform).then(() => [transform]);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////
    _pull(query) {
        const operator = _pullOperators.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('IndexedDBSource does not support the `${query.expression.op}` operator for queries.');
        }
        return this.openDB().then(() => operator(this, query.expression));
    }
    /////////////////////////////////////////////////////////////////////////////
    // Private
    /////////////////////////////////////////////////////////////////////////////
    _processTransform(transform) {
        return this.openDB().then(() => {
            let result = _data2.default.Promise.resolve();
            transform.operations.forEach(operation => {
                let processor = _transformOperators2.default[operation.op];
                result = result.then(() => processor(this, operation));
            });
            return result;
        });
    }
};
IndexedDBSource = __decorate([_data.pullable, _data.pushable, _data.syncable], IndexedDBSource);
exports.default = IndexedDBSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJJbmRleGVkREJTb3VyY2UiLCJTb3VyY2UiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwic2NoZW1hIiwibmFtZSIsIl9uYW1lc3BhY2UiLCJuYW1lc3BhY2UiLCJ1cGdyYWRlIiwicmVvcGVuREIiLCJkYlZlcnNpb24iLCJfc2NoZW1hIiwidmVyc2lvbiIsImRiTmFtZSIsImlzREJPcGVuIiwiX2RiIiwib3BlbkRCIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJnbG9iYWxzIiwiaW5kZXhlZERCIiwib3BlbiIsIm9uZXJyb3IiLCJlcnJvciIsIm9uc3VjY2VzcyIsImRiIiwicmVzdWx0Iiwib251cGdyYWRlbmVlZGVkIiwiZXZlbnQiLCJvbGRWZXJzaW9uIiwibWlncmF0ZURCIiwiY3JlYXRlREIiLCJjbG9zZURCIiwiY2xvc2UiLCJrZXlzIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwicmVnaXN0ZXJNb2RlbCIsImNvbnNvbGUiLCJuZXdWZXJzaW9uIiwiZGVsZXRlREIiLCJkZWxldGVEYXRhYmFzZSIsImNyZWF0ZU9iamVjdFN0b3JlIiwia2V5UGF0aCIsImdldFJlY29yZCIsInJlY29yZCIsInRyYW5zYWN0aW9uIiwidHlwZSIsIm9iamVjdFN0b3JlIiwiZ2V0IiwiaWQiLCJfa2V5TWFwIiwicHVzaFJlY29yZCIsIlJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIiwiZ2V0UmVjb3JkcyIsIm9wZW5DdXJzb3IiLCJyZWNvcmRzIiwiY3Vyc29yIiwidmFsdWUiLCJwdXNoIiwiY29udGludWUiLCJhdmFpbGFibGVUeXBlcyIsIm9iamVjdFN0b3JlTmFtZXMiLCJ0eXBlcyIsIml0ZW0iLCJwdXRSZWNvcmQiLCJwdXQiLCJyZW1vdmVSZWNvcmQiLCJkZWxldGUiLCJjbGVhclJlY29yZHMiLCJjbGVhciIsInJlc2V0IiwiX3N5bmMiLCJ0cmFuc2Zvcm0iLCJfcHJvY2Vzc1RyYW5zZm9ybSIsIl9wdXNoIiwidGhlbiIsIl9wdWxsIiwicXVlcnkiLCJvcGVyYXRvciIsIlB1bGxPcGVyYXRvcnMiLCJleHByZXNzaW9uIiwib3AiLCJFcnJvciIsIm9wZXJhdGlvbnMiLCJvcGVyYXRpb24iLCJwcm9jZXNzb3IiLCJ0cmFuc2Zvcm1PcGVyYXRvcnMiLCJwdWxsYWJsZSIsInB1c2hhYmxlIiwic3luY2FibGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQVhBLElBQUlBLGFBQWEsYUFBUSxVQUFLQSxVQUFiLElBQTJCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBVUMsTUFBbEI7QUFBQSxRQUNJQyxJQUFJSCxJQUFJLENBQUosR0FBUUgsTUFBUixHQUFpQkUsU0FBUyxJQUFULEdBQWdCQSxPQUFPSyxPQUFPQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUQvRjtBQUFBLFFBRUlPLENBRko7QUFHQSxRQUFJLE9BQU9DLE9BQVAsS0FBbUIsUUFBbkIsSUFBK0IsT0FBT0EsUUFBUUMsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsSUFBSUksUUFBUUMsUUFBUixDQUFpQlosVUFBakIsRUFBNkJDLE1BQTdCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsSUFBMUMsQ0FBSixDQUEzRSxLQUFvSSxLQUFLLElBQUlVLElBQUliLFdBQVdNLE1BQVgsR0FBb0IsQ0FBakMsRUFBb0NPLEtBQUssQ0FBekMsRUFBNENBLEdBQTVDLEVBQWlE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LEVBQTdCLENBQWhCO0FBQ0F6RCx5QkFBU0EsT0FBT21ELElBQVAsQ0FBWSxNQUFNVSxVQUFVLElBQVYsRUFBZ0JELFNBQWhCLENBQWxCLENBQVQ7QUFDSCxhQUhEO0FBSUEsbUJBQU81RCxNQUFQO0FBQ0gsU0FQTSxDQUFQO0FBUUg7QUFwUXNELENBQTNEO0FBc1FBN0Isa0JBQWtCaEIsV0FBVyxDQUFDNEcsY0FBRCxFQUFXQyxjQUFYLEVBQXFCQyxjQUFyQixDQUFYLEVBQTJDOUYsZUFBM0MsQ0FBbEI7a0JBQ2VBLGUiLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCBPcmJpdCwgeyBwdWxsYWJsZSwgcHVzaGFibGUsIHN5bmNhYmxlLCBTb3VyY2UsIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB0cmFuc2Zvcm1PcGVyYXRvcnMgZnJvbSAnLi9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgc3VwcG9ydHNJbmRleGVkREIgfSBmcm9tICcuL2xpYi9pbmRleGVkZGInO1xuLyoqXG4gKiBTb3VyY2UgZm9yIHN0b3JpbmcgZGF0YSBpbiBJbmRleGVkREIuXG4gKlxuICogQGNsYXNzIEluZGV4ZWREQlNvdXJjZVxuICogQGV4dGVuZHMgU291cmNlXG4gKi9cbmxldCBJbmRleGVkREJTb3VyY2UgPSBjbGFzcyBJbmRleGVkREJTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBJbmRleGVkREJTb3VyY2UuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gIFtzZXR0aW5ncyA9IHt9XVxuICAgICAqIEBwYXJhbSB7U2NoZW1hfSAgW3NldHRpbmdzLnNjaGVtYV0gICAgT3JiaXQgU2NoZW1hLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVdICAgICAgT3B0aW9uYWwuIE5hbWUgZm9yIHNvdXJjZS4gRGVmYXVsdHMgdG8gJ2luZGV4ZWREQicuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSBPcHRpb25hbC4gTmFtZXNwYWNlIG9mIHRoZSBhcHBsaWNhdGlvbi4gV2lsbCBiZSB1c2VkIGZvciB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuIERlZmF1bHRzIHRvICdvcmJpdCcuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ0luZGV4ZWREQlNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XG4gICAgICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgSW5kZXhlZERCIScsIHN1cHBvcnRzSW5kZXhlZERCKCkpO1xuICAgICAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0JztcbiAgICB9XG4gICAgdXBncmFkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVvcGVuREIoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gdG8gc3BlY2lmeSB3aGVuIG9wZW5pbmcgdGhlIEluZGV4ZWREQiBkYXRhYmFzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IFZlcnNpb24gbnVtYmVyLlxuICAgICAqL1xuICAgIGdldCBkYlZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2hlbWEudmVyc2lvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5kZXhlZERCIGRhdGFiYXNlIG5hbWUuXG4gICAgICpcbiAgICAgKiBEZWZhdWx0cyB0byB0aGUgbmFtZXNwYWNlIG9mIHRoZSBhcHAsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cbiAgICAgKi9cbiAgICBnZXQgZGJOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xuICAgIH1cbiAgICBnZXQgaXNEQk9wZW4oKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RiO1xuICAgIH1cbiAgICBvcGVuREIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGIpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuX2RiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBPcmJpdC5nbG9iYWxzLmluZGV4ZWREQi5vcGVuKHRoaXMuZGJOYW1lLCB0aGlzLmRiVmVyc2lvbik7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdlcnJvciBvcGVuaW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gcmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGIpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleGVkREIgdXBncmFkZSBuZWVkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGIgPSB0aGlzLl9kYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC5vbGRWZXJzaW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taWdyYXRlREIoZGIsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlREIoZGIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsb3NlREIoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzREJPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLl9kYi5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlb3BlbkRCKCkge1xuICAgICAgICB0aGlzLmNsb3NlREIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCk7XG4gICAgfVxuICAgIGNyZWF0ZURCKGRiKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjcmVhdGVEQicpO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnNjaGVtYS5tb2RlbHMpLmZvckVhY2gobW9kZWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlck1vZGVsKGRiLCBtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNaWdyYXRlIGRhdGFiYXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7SURCRGF0YWJhc2V9IGRiICAgICAgICAgICAgICBEYXRhYmFzZSB0byB1cGdyYWRlLlxuICAgICAqIEBwYXJhbSAge0lEQlZlcnNpb25DaGFuZ2VFdmVudH0gZXZlbnQgRXZlbnQgcmVzdWx0aW5nIGZyb20gdmVyc2lvbiBjaGFuZ2UuXG4gICAgICovXG4gICAgbWlncmF0ZURCKGRiLCBldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdJbmRleGVkREJTb3VyY2UjbWlncmF0ZURCIC0gc2hvdWxkIGJlIG92ZXJyaWRkZW4gdG8gdXBncmFkZSBJREJEYXRhYmFzZSBmcm9tOiAnLCBldmVudC5vbGRWZXJzaW9uLCAnIC0+ICcsIGV2ZW50Lm5ld1ZlcnNpb24pO1xuICAgIH1cbiAgICBkZWxldGVEQigpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdlcnJvciBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJNb2RlbChkYiwgbW9kZWwpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZ2lzdGVyTW9kZWwnLCBtb2RlbCk7XG4gICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKG1vZGVsLCB7IGtleVBhdGg6ICdpZCcgfSk7XG4gICAgICAgIC8vIFRPRE8gLSBjcmVhdGUgaW5kaWNlc1xuICAgIH1cbiAgICBnZXRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFtyZWNvcmQudHlwZV0pO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRSZWNvcmQnLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSBnZXRSZWNvcmQnLCByZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbihyZWNvcmQudHlwZSwgcmVjb3JkLmlkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFJlY29yZHModHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdHlwZV0pO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5vcGVuQ3Vyc29yKCk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gW107XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSBnZXRSZWNvcmRzJywgcmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0UmVjb3JkcycsIHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY29yZCA9IGN1cnNvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IGF2YWlsYWJsZVR5cGVzKCkge1xuICAgICAgICBjb25zdCBvYmplY3RTdG9yZU5hbWVzID0gdGhpcy5fZGIub2JqZWN0U3RvcmVOYW1lcztcbiAgICAgICAgY29uc3QgdHlwZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RTdG9yZU5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0eXBlcy5wdXNoKG9iamVjdFN0b3JlTmFtZXMuaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cbiAgICBwdXRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHJlY29yZC50eXBlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5wdXQocmVjb3JkKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHB1dFJlY29yZCcsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHB1dFJlY29yZCcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbW92ZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3JlY29yZC50eXBlXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKHJlY29yZC5pZCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgLSByZW1vdmVSZWNvcmQnLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MgLSByZW1vdmVSZWNvcmQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXJSZWNvcmRzKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kYikge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0eXBlXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5jbGVhcigpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIC0gcmVtb3ZlUmVjb3JkcycsIHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcyAtIHJlbW92ZVJlY29yZHMnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGV0ZURCKCk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfc3luYyh0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NUcmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9wdXNoKHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm0pLnRoZW4oKCkgPT4gW3RyYW5zZm9ybV0pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFB1bGxhYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfcHVsbChxdWVyeSkge1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XG4gICAgICAgIGlmICghb3BlcmF0b3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5kZXhlZERCU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKS50aGVuKCgpID0+IG9wZXJhdG9yKHRoaXMsIHF1ZXJ5LmV4cHJlc3Npb24pKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQcml2YXRlXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfcHJvY2Vzc1RyYW5zZm9ybSh0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB0cmFuc2Zvcm0ub3BlcmF0aW9ucy5mb3JFYWNoKG9wZXJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NvciA9IHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC50aGVuKCgpID0+IHByb2Nlc3Nvcih0aGlzLCBvcGVyYXRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbkluZGV4ZWREQlNvdXJjZSA9IF9fZGVjb3JhdGUoW3B1bGxhYmxlLCBwdXNoYWJsZSwgc3luY2FibGVdLCBJbmRleGVkREJTb3VyY2UpO1xuZXhwb3J0IGRlZmF1bHQgSW5kZXhlZERCU291cmNlOyJdfQ==