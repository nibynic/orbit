'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require('@orbit/core');

var _core2 = _interopRequireDefault(_core);

var _utils = require('@orbit/utils');

var _indexeddb = require('./lib/indexeddb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bucket for persisting transient data in IndexedDB.
 *
 * @class IndexedDBBucket
 * @extends Bucket
 */
class IndexedDBBucket extends _core.Bucket {
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
    constructor(settings = {}) {
        (0, _utils.assert)('Your browser does not support IndexedDB!', (0, _indexeddb.supportsIndexedDB)());
        settings.name = settings.name || 'indexedDB';
        settings.storeName = settings.storeName || 'data';
        super(settings);
    }
    upgrade(settings) {
        this.closeDB();
        return super.upgrade(settings).then(() => this.openDB());
    }
    _applySettings(settings) {
        this._storeName = settings.storeName;
        return super._applySettings(settings);
    }
    /**
     * The version to specify when opening the IndexedDB database.
     *
     * IndexedDB's default verions is 1.
     *
     * @return {Integer} Version number.
     */
    get dbVersion() {
        return this.version;
    }
    /**
     * IndexedDB database name.
     *
     * Defaults to 'orbit-bucket', which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    get dbName() {
        return this.namespace;
    }
    /**
     * IndexedDB ObjectStore name.
     *
     * Defaults to 'settings', which can be overridden in the constructor.
     *
     * @return {String} Database name.
     */
    get dbStoreName() {
        return this._storeName;
    }
    get isDBOpen() {
        return !!this._db;
    }
    openDB() {
        return new _core2.default.Promise((resolve, reject) => {
            if (this._db) {
                resolve(this._db);
            } else {
                let request = _core2.default.globals.indexedDB.open(this.dbName, this.dbVersion);
                request.onerror = () => {
                    console.error('error opening indexedDB', this.dbName);
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
        db.createObjectStore(this.dbStoreName); //, { keyPath: 'key' });
    }
    /**
     * Migrate database.
     *
     * @param  {IDBDatabase} db              Database to upgrade.
     * @param  {IDBVersionChangeEvent} event Event resulting from version change.
     */
    migrateDB(db, event) {
        console.error('IndexedDBBucket#migrateDB - should be overridden to upgrade IDBDatabase from: ', event.oldVersion, ' -> ', event.newVersion);
    }
    deleteDB() {
        this.closeDB();
        return new _core2.default.Promise((resolve, reject) => {
            let request = _core2.default.globals.indexedDB.deleteDatabase(this.dbName);
            request.onerror = () => {
                console.error('error deleting indexedDB', this.dbName);
                reject(request.error);
            };
            request.onsuccess = () => {
                // console.log('success deleting indexedDB', this.dbName);
                this._db = null;
                resolve();
            };
        });
    }
    getItem(key) {
        return this.openDB().then(() => {
            return new _core2.default.Promise((resolve, reject) => {
                const transaction = this._db.transaction([this.dbStoreName]);
                const objectStore = transaction.objectStore(this.dbStoreName);
                const request = objectStore.get(key);
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
    }
    setItem(key, value) {
        return this.openDB().then(() => {
            const transaction = this._db.transaction([this.dbStoreName], 'readwrite');
            const objectStore = transaction.objectStore(this.dbStoreName);
            return new _core2.default.Promise((resolve, reject) => {
                const request = objectStore.put(value, key);
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
    }
    removeItem(key) {
        return this.openDB().then(() => {
            return new _core2.default.Promise((resolve, reject) => {
                const transaction = this._db.transaction([this.dbStoreName], 'readwrite');
                const objectStore = transaction.objectStore(this.dbStoreName);
                const request = objectStore.delete(key);
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
    }
}
exports.default = IndexedDBBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJJbmRleGVkREJCdWNrZXQiLCJCdWNrZXQiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZSIsInN0b3JlTmFtZSIsInVwZ3JhZGUiLCJjbG9zZURCIiwidGhlbiIsIm9wZW5EQiIsIl9hcHBseVNldHRpbmdzIiwiX3N0b3JlTmFtZSIsImRiVmVyc2lvbiIsInZlcnNpb24iLCJkYk5hbWUiLCJuYW1lc3BhY2UiLCJkYlN0b3JlTmFtZSIsImlzREJPcGVuIiwiX2RiIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJnbG9iYWxzIiwiaW5kZXhlZERCIiwib3BlbiIsIm9uZXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJvbnN1Y2Nlc3MiLCJkYiIsInJlc3VsdCIsIm9udXBncmFkZW5lZWRlZCIsImV2ZW50IiwidGFyZ2V0Iiwib2xkVmVyc2lvbiIsIm1pZ3JhdGVEQiIsImNyZWF0ZURCIiwiY2xvc2UiLCJyZW9wZW5EQiIsImNyZWF0ZU9iamVjdFN0b3JlIiwibmV3VmVyc2lvbiIsImRlbGV0ZURCIiwiZGVsZXRlRGF0YWJhc2UiLCJnZXRJdGVtIiwia2V5IiwidHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZSIsImdldCIsInNldEl0ZW0iLCJ2YWx1ZSIsInB1dCIsInJlbW92ZUl0ZW0iLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBTWUsTUFBTUEsZUFBTixTQUE4QkMsWUFBOUIsQ0FBcUM7QUFDaEQ7Ozs7Ozs7Ozs7QUFVQUMsZ0JBQVlDLFdBQVcsRUFBdkIsRUFBMkI7QUFDdkIsMkJBQU8sMENBQVAsRUFBbUQsbUNBQW5EO0FBQ0FBLGlCQUFTQyxJQUFULEdBQWdCRCxTQUFTQyxJQUFULElBQWlCLFdBQWpDO0FBQ0FELGlCQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCLE1BQTNDO0FBQ0EsY0FB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c0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7IEJ1Y2tldCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBzdXBwb3J0c0luZGV4ZWREQiB9IGZyb20gJy4vbGliL2luZGV4ZWRkYic7XG4vKipcbiAqIEJ1Y2tldCBmb3IgcGVyc2lzdGluZyB0cmFuc2llbnQgZGF0YSBpbiBJbmRleGVkREIuXG4gKlxuICogQGNsYXNzIEluZGV4ZWREQkJ1Y2tldFxuICogQGV4dGVuZHMgQnVja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4ZWREQkJ1Y2tldCBleHRlbmRzIEJ1Y2tldCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IEluZGV4ZWREQkJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgW3NldHRpbmdzID0ge31dXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZV0gICAgICAgIE9wdGlvbmFsLiBOYW1lIG9mIHRoaXMgYnVja2V0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gICBPcHRpb25hbC4gTmFtZXNwYWNlIG9mIHRoZSBidWNrZXQuIFdpbGwgYmUgdXNlZCBmb3IgdGhlIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lLiBEZWZhdWx0cyB0byAnb3JiaXQtYnVja2V0Jy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5zdG9yZU5hbWVdICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhlIEluZGV4ZWREQiBPYmplY3RTdG9yZS4gRGVmYXVsdHMgdG8gJ2RhdGEnLlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gW3NldHRpbmdzLnZlcnNpb25dICAgICBPcHRpb25hbC4gVGhlIHZlcnNpb24gdG8gb3BlbiB0aGUgSW5kZXhlZERCIGRhdGFiYXNlIHdpdGguIERlZmF1bHRzIHRvIGAxYC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgSW5kZXhlZERCIScsIHN1cHBvcnRzSW5kZXhlZERCKCkpO1xuICAgICAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnaW5kZXhlZERCJztcbiAgICAgICAgc2V0dGluZ3Muc3RvcmVOYW1lID0gc2V0dGluZ3Muc3RvcmVOYW1lIHx8ICdkYXRhJztcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cbiAgICB1cGdyYWRlKHNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuY2xvc2VEQigpO1xuICAgICAgICByZXR1cm4gc3VwZXIudXBncmFkZShzZXR0aW5ncykudGhlbigoKSA9PiB0aGlzLm9wZW5EQigpKTtcbiAgICB9XG4gICAgX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5fc3RvcmVOYW1lID0gc2V0dGluZ3Muc3RvcmVOYW1lO1xuICAgICAgICByZXR1cm4gc3VwZXIuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgdmVyc2lvbiB0byBzcGVjaWZ5IHdoZW4gb3BlbmluZyB0aGUgSW5kZXhlZERCIGRhdGFiYXNlLlxuICAgICAqXG4gICAgICogSW5kZXhlZERCJ3MgZGVmYXVsdCB2ZXJpb25zIGlzIDEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBWZXJzaW9uIG51bWJlci5cbiAgICAgKi9cbiAgICBnZXQgZGJWZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZS5cbiAgICAgKlxuICAgICAqIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IERhdGFiYXNlIG5hbWUuXG4gICAgICovXG4gICAgZ2V0IGRiTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbmRleGVkREIgT2JqZWN0U3RvcmUgbmFtZS5cbiAgICAgKlxuICAgICAqIERlZmF1bHRzIHRvICdzZXR0aW5ncycsIHdoaWNoIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gRGF0YWJhc2UgbmFtZS5cbiAgICAgKi9cbiAgICBnZXQgZGJTdG9yZU5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yZU5hbWU7XG4gICAgfVxuICAgIGdldCBpc0RCT3BlbigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGI7XG4gICAgfVxuICAgIG9wZW5EQigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kYikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5fZGIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLm9wZW4odGhpcy5kYk5hbWUsIHRoaXMuZGJWZXJzaW9uKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIG9wZW5pbmcgaW5kZXhlZERCJywgdGhpcy5kYk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3Mgb3BlbmluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4ZWREQiB1cGdyYWRlIG5lZWRlZCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYiA9IHRoaXMuX2RiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50Lm9sZFZlcnNpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1pZ3JhdGVEQihkYiwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEQihkYik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xvc2VEQigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEQk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2RiLmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLl9kYiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVvcGVuREIoKSB7XG4gICAgICAgIHRoaXMuY2xvc2VEQigpO1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuREIoKTtcbiAgICB9XG4gICAgY3JlYXRlREIoZGIpIHtcbiAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7IC8vLCB7IGtleVBhdGg6ICdrZXknIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNaWdyYXRlIGRhdGFiYXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7SURCRGF0YWJhc2V9IGRiICAgICAgICAgICAgICBEYXRhYmFzZSB0byB1cGdyYWRlLlxuICAgICAqIEBwYXJhbSAge0lEQlZlcnNpb25DaGFuZ2VFdmVudH0gZXZlbnQgRXZlbnQgcmVzdWx0aW5nIGZyb20gdmVyc2lvbiBjaGFuZ2UuXG4gICAgICovXG4gICAgbWlncmF0ZURCKGRiLCBldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdJbmRleGVkREJCdWNrZXQjbWlncmF0ZURCIC0gc2hvdWxkIGJlIG92ZXJyaWRkZW4gdG8gdXBncmFkZSBJREJEYXRhYmFzZSBmcm9tOiAnLCBldmVudC5vbGRWZXJzaW9uLCAnIC0+ICcsIGV2ZW50Lm5ld1ZlcnNpb24pO1xuICAgIH1cbiAgICBkZWxldGVEQigpIHtcbiAgICAgICAgdGhpcy5jbG9zZURCKCk7XG4gICAgICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IE9yYml0Lmdsb2JhbHMuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBkZWxldGluZyBpbmRleGVkREInLCB0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIGRlbGV0aW5nIGluZGV4ZWREQicsIHRoaXMuZGJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldEl0ZW0oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHRoaXMuX2RiLnRyYW5zYWN0aW9uKFt0aGlzLmRiU3RvcmVOYW1lXSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIGdldEl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gZ2V0SXRlbScsIHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5EQigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB0aGlzLl9kYi50cmFuc2FjdGlvbihbdGhpcy5kYlN0b3JlTmFtZV0sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5kYlN0b3JlTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5wdXQodmFsdWUsIGtleSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHNldEl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gc2V0SXRlbScpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVtb3ZlSXRlbShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkRCKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy5fZGIudHJhbnNhY3Rpb24oW3RoaXMuZGJTdG9yZU5hbWVdLCAncmVhZHdyaXRlJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZSh0aGlzLmRiU3RvcmVOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciAtIHJlbW92ZUl0ZW0nLCByZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzIC0gcmVtb3ZlSXRlbScpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19