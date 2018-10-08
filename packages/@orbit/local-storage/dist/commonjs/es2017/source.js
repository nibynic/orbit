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

var _localStorage = require("./lib/local-storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
let LocalStorageSource = class LocalStorageSource extends _data.Source {
    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    constructor(settings = {}) {
        (0, _utils.assert)('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        (0, _utils.assert)('Your browser does not support local storage!', (0, _localStorage.supportsLocalStorage)());
        settings.name = settings.name || 'localStorage';
        super(settings);
        this._namespace = settings.namespace || 'orbit';
        this._delimiter = settings.delimiter || '/';
    }
    get namespace() {
        return this._namespace;
    }
    get delimiter() {
        return this._delimiter;
    }
    getKeyForRecord(record) {
        return [this.namespace, record.type, record.id].join(this.delimiter);
    }
    getRecord(record) {
        const key = this.getKeyForRecord(record);
        let result = JSON.parse(_data2.default.globals.localStorage.getItem(key));
        if (result && this._keyMap) {
            this._keyMap.pushRecord(result);
        }
        return result;
    }
    putRecord(record) {
        const key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#putRecord', key, JSON.stringify(record));
        if (this._keyMap) {
            this._keyMap.pushRecord(record);
        }
        _data2.default.globals.localStorage.setItem(key, JSON.stringify(record));
    }
    removeRecord(record) {
        const key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        _data2.default.globals.localStorage.removeItem(key);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    reset() {
        for (let key in _data2.default.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                _data2.default.globals.localStorage.removeItem(key);
            }
        }
        return _data2.default.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _sync(transform) {
        this._applyTransform(transform);
        return _data2.default.Promise.resolve();
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////
    _push(transform) {
        this._applyTransform(transform);
        return _data2.default.Promise.resolve([transform]);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////
    _pull(query) {
        const operator = _pullOperators.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('LocalStorageSource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query.expression);
    }
    /////////////////////////////////////////////////////////////////////////////
    // Protected
    /////////////////////////////////////////////////////////////////////////////
    _applyTransform(transform) {
        transform.operations.forEach(operation => {
            _transformOperators2.default[operation.op](this, operation);
        });
    }
};
LocalStorageSource = __decorate([_data.pullable, _data.pushable, _data.syncable], LocalStorageSource);
exports.default = LocalStorageSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJMb2NhbFN0b3JhZ2VTb3VyY2UiLCJTb3VyY2UiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwic2NoZW1hIiwibmFtZSIsIl9uYW1lc3BhY2UiLCJuYW1lc3BhY2UiLCJfZGVsaW1pdGVyIiwiZGVsaW1pdGVyIiwiZ2V0S2V5Rm9yUmVjb3JkIiwicmVjb3JkIiwidHlwZSIsImlkIiwiam9pbiIsImdldFJlY29yZCIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsIk9yYml0IiwiZ2xvYmFscyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJfa2V5TWFwIiwicHVzaFJlY29yZCIsInB1dFJlY29yZCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJyZW1vdmVSZWNvcmQiLCJyZW1vdmVJdGVtIiwicmVzZXQiLCJpbmRleE9mIiwiUHJvbWlzZSIsInJlc29sdmUiLCJfc3luYyIsInRyYW5zZm9ybSIsIl9hcHBseVRyYW5zZm9ybSIsIl9wdXNoIiwiX3B1bGwiLCJxdWVyeSIsIm9wZXJhdG9yIiwiUHVsbE9wZXJhdG9ycyIsImV4cHJlc3Npb24iLCJvcCIsIkVycm9yIiwib3BlcmF0aW9ucyIsImZvckVhY2giLCJvcGVyYXRpb24iLCJ0cmFuc2Zvcm1PcGVyYXRvcnMiLCJwdWxsYWJsZSIsInB1c2hhYmxlIiwic3luY2FibGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQVhBLElBQUlBLGFBQWEsYUFBUSxVQUFLQSxVQUFiLElBQTJCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThC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QkQsU0FBaEIsRUFBMkI7QUFDdkJBLGtCQUFVVSxVQUFWLENBQXFCQyxPQUFyQixDQUE2QkMsYUFBYTtBQUN0Q0MseUNBQW1CRCxVQUFVSixFQUE3QixFQUFpQyxJQUFqQyxFQUF1Q0ksU0FBdkM7QUFDSCxTQUZEO0FBR0g7QUExRjRELENBQWpFO0FBNEZBL0MscUJBQXFCaEIsV0FBVyxDQUFDaUUsY0FBRCxFQUFXQyxjQUFYLEVBQXFCQyxjQUFyQixDQUFYLEVBQTJDbkQsa0JBQTNDLENBQXJCO2tCQUNlQSxrQiIsImZpbGUiOiJzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9IHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IE9yYml0LCB7IHB1bGxhYmxlLCBwdXNoYWJsZSwgc3luY2FibGUsIFNvdXJjZSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgdHJhbnNmb3JtT3BlcmF0b3JzIGZyb20gJy4vbGliL3RyYW5zZm9ybS1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUHVsbE9wZXJhdG9ycyB9IGZyb20gJy4vbGliL3B1bGwtb3BlcmF0b3JzJztcbmltcG9ydCB7IHN1cHBvcnRzTG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9saWIvbG9jYWwtc3RvcmFnZSc7XG4vKipcbiAqIFNvdXJjZSBmb3Igc3RvcmluZyBkYXRhIGluIGxvY2FsU3RvcmFnZS5cbiAqXG4gKiBAY2xhc3MgTG9jYWxTdG9yYWdlU291cmNlXG4gKiBAZXh0ZW5kcyBTb3VyY2VcbiAqL1xubGV0IExvY2FsU3RvcmFnZVNvdXJjZSA9IGNsYXNzIExvY2FsU3RvcmFnZVNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IExvY2FsU3RvcmFnZVNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dGluZ3NdICAgICAgICAgICBTZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge1NjaGVtYX0gW3NldHRpbmdzLnNjaGVtYV0gICAgU2NoZW1hIGZvciBzb3VyY2UuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBQcmVmaXggZm9yIGtleXMgdXNlZCBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICdvcmJpdCcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtzZXR0aW5ncy5kZWxpbWl0ZXJdIE9wdGlvbmFsLiBEZWxpbWl0ZXIgdXNlZCB0byBzZXBhcmF0ZSBrZXkgc2VnbWVudHMgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnLycuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ0xvY2FsU3RvcmFnZVNvdXJjZVxcJ3MgYHNjaGVtYWAgbXVzdCBiZSBzcGVjaWZpZWQgaW4gYHNldHRpbmdzLnNjaGVtYWAgY29uc3RydWN0b3IgYXJndW1lbnQnLCAhIXNldHRpbmdzLnNjaGVtYSk7XG4gICAgICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbG9jYWwgc3RvcmFnZSEnLCBzdXBwb3J0c0xvY2FsU3RvcmFnZSgpKTtcbiAgICAgICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2xvY2FsU3RvcmFnZSc7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdCc7XG4gICAgICAgIHRoaXMuX2RlbGltaXRlciA9IHNldHRpbmdzLmRlbGltaXRlciB8fCAnLyc7XG4gICAgfVxuICAgIGdldCBuYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gICAgfVxuICAgIGdldCBkZWxpbWl0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWxpbWl0ZXI7XG4gICAgfVxuICAgIGdldEtleUZvclJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLm5hbWVzcGFjZSwgcmVjb3JkLnR5cGUsIHJlY29yZC5pZF0uam9pbih0aGlzLmRlbGltaXRlcik7XG4gICAgfVxuICAgIGdldFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiB0aGlzLl9rZXlNYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHV0UmVjb3JkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleUZvclJlY29yZChyZWNvcmQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnTG9jYWxTdG9yYWdlU291cmNlI3B1dFJlY29yZCcsIGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XG4gICAgICAgIGlmICh0aGlzLl9rZXlNYXApIHtcbiAgICAgICAgICAgIHRoaXMuX2tleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xuICAgIH1cbiAgICByZW1vdmVSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMb2NhbFN0b3JhZ2VTb3VyY2UjcmVtb3ZlUmVjb3JkJywga2V5LCBKU09OLnN0cmluZ2lmeShyZWNvcmQpKTtcbiAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFJlc2V0dGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5uYW1lc3BhY2UpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBTeW5jYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9zeW5jKHRyYW5zZm9ybSkge1xuICAgICAgICB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVzaGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfcHVzaCh0cmFuc2Zvcm0pIHtcbiAgICAgICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbdHJhbnNmb3JtXSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHVsbGFibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9wdWxsKHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gUHVsbE9wZXJhdG9yc1txdWVyeS5leHByZXNzaW9uLm9wXTtcbiAgICAgICAgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMb2NhbFN0b3JhZ2VTb3VyY2UgZG9lcyBub3Qgc3VwcG9ydCB0aGUgYCR7cXVlcnkuZXhwcmVzc2lvbi5vcH1gIG9wZXJhdG9yIGZvciBxdWVyaWVzLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBxdWVyeS5leHByZXNzaW9uKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQcm90ZWN0ZWRcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pIHtcbiAgICAgICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICAgICAgdHJhbnNmb3JtT3BlcmF0b3JzW29wZXJhdGlvbi5vcF0odGhpcywgb3BlcmF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbkxvY2FsU3RvcmFnZVNvdXJjZSA9IF9fZGVjb3JhdGUoW3B1bGxhYmxlLCBwdXNoYWJsZSwgc3luY2FibGVdLCBMb2NhbFN0b3JhZ2VTb3VyY2UpO1xuZXhwb3J0IGRlZmF1bHQgTG9jYWxTdG9yYWdlU291cmNlOyJdfQ==