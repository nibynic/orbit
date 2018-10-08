'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require('@orbit/core');

var _core2 = _interopRequireDefault(_core);

var _utils = require('@orbit/utils');

var _localStorage = require('./lib/local-storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bucket for persisting transient data in localStorage.
 *
 * @class LocalStorageBucket
 * @extends Bucket
 */
class LocalStorageBucket extends _core.Bucket {
    /**
     * Create a new LocalStorageBucket.
     *
     * @constructor
     * @param {Object}  [settings]           Settings.
     * @param {String}  [settings.name]      Optional. Name of this bucket. Defaults to 'localStorageBucket'.
     * @param {String}  [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit-bucket'.
     * @param {String}  [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     * @param {Integer} [settings.version]   Optional. Defaults to 1.
     */
    constructor(settings = {}) {
        (0, _utils.assert)('Your browser does not support local storage!', (0, _localStorage.supportsLocalStorage)());
        settings.name = settings.name || 'localStorage';
        super(settings);
        this._delimiter = settings.delimiter || '/';
    }
    get delimiter() {
        return this._delimiter;
    }
    getFullKeyForItem(key) {
        return [this.namespace, key].join(this.delimiter);
    }
    getItem(key) {
        const fullKey = this.getFullKeyForItem(key);
        return _core2.default.Promise.resolve(JSON.parse(_core2.default.globals.localStorage.getItem(fullKey)));
    }
    setItem(key, value) {
        const fullKey = this.getFullKeyForItem(key);
        _core2.default.globals.localStorage.setItem(fullKey, JSON.stringify(value));
        return _core2.default.Promise.resolve();
    }
    removeItem(key) {
        const fullKey = this.getFullKeyForItem(key);
        _core2.default.globals.localStorage.removeItem(fullKey);
        return _core2.default.Promise.resolve();
    }
}
exports.default = LocalStorageBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJMb2NhbFN0b3JhZ2VCdWNrZXQiLCJCdWNrZXQiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZSIsIl9kZWxpbWl0ZXIiLCJkZWxpbWl0ZXIiLCJnZXRGdWxsS2V5Rm9ySXRlbSIsImtleSIsIm5hbWVzcGFjZSIsImpvaW4iLCJnZXRJdGVtIiwiZnVsbEtleSIsIk9yYml0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJKU09OIiwicGFyc2UiLCJnbG9iYWxzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInZhbHVlIiwic3RyaW5naWZ5IiwicmVtb3ZlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFNZSxNQUFNQSxrQkFBTixTQUFpQ0MsWUFBakMsQ0FBd0M7QUFDbkQ7Ozs7Ozs7Ozs7QUFVQUMsZ0JBQVlDLFdBQVcsRUFBdkIsRUFBMkI7QUFDdkIsMkJBQU8sOENBQVAsRUFBdUQseUNBQXZEO0FBQ0FBLGlCQUFTQyxJQUFULEdBQWdCRCxTQUFTQyxJQUFULElBQWlCLGNBQWpDO0FBQ0EsY0FBTUQsUUFBTjtBQUNBLGFBQUtFLFVBQUwsR0FBa0JGLFNBQVNHLFNBQVQsSUFBc0IsR0FBeEM7QUFDSDtBQUNELFFBQUlBLFNBQUosR0FBZ0I7QUFDWixlQUFPLEtBQUtELFVBQVo7QUFDSDtBQUNERSxzQkFBa0JDLEdBQWxCLEVBQXVCO0FBQ25CLGVBQU8sQ0FBQyxLQUFLQyxTQUFOLEVBQWlCRCxHQUFqQixFQUFzQkUsSUFBdEIsQ0FBMkIsS0FBS0osU0FBaEMsQ0FBUDtBQUNIO0FBQ0RLLFlBQVFILEdBQVIsRUFBYTtBQUNULGNBQU1JLFVBQVUsS0FBS0wsaUJBQUwsQ0FBdUJDLEdBQXZCLENBQWhCO0FBQ0EsZUFBT0ssZUFBTUMsT0FBTixDQUFjQyxPQUFkLENBQXNCQyxLQUFLQyxLQUFMLENBQVdKLGVBQU1LLE9BQU4sQ0FBY0MsWUFBZCxDQUEyQlIsT0FBM0IsQ0FBbUNDLE9BQW5DLENBQVgsQ0FBdEIsQ0FBUDtBQUNIO0FBQ0RRLFlBQVFaLEdBQVIsRUFBYWEsS0FBYixFQUFvQjtBQUNoQixjQUFNVCxVQUFVLEtBQUtMLGlCQUFMLENBQXVCQyxHQUF2QixDQUFoQjtBQUNBSyx1QkFBTUssT0FBTixDQUFjQyxZQUFkLENBQTJCQyxPQUEzQixDQUFtQ1IsT0FBbkMsRUFBNENJLEtBQUtNLFNBQUwsQ0FBZUQsS0FBZixDQUE1QztBQUNBLGVBQU9SLGVBQU1DLE9BQU4sQ0FBY0MsT0FBZCxFQUFQO0FBQ0g7QUFDRFEsZUFBV2YsR0FBWCxFQUFnQjtBQUNaLGNBQU1JLFVBQVUsS0FBS0wsaUJBQUwsQ0FBdUJDLEdBQXZCLENBQWhCO0FBQ0FLLHVCQUFNSyxPQUFOLENBQWNDLFlBQWQsQ0FBMkJJLFVBQTNCLENBQXNDWCxPQUF0QztBQUNBLGVBQU9DLGVBQU1DLE9BQU4sQ0FBY0MsT0FBZCxFQUFQO0FBQ0g7QUFwQ2tEO2tCQUFsQ2Ysa0IiLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7IEJ1Y2tldCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBzdXBwb3J0c0xvY2FsU3RvcmFnZSB9IGZyb20gJy4vbGliL2xvY2FsLXN0b3JhZ2UnO1xuLyoqXG4gKiBCdWNrZXQgZm9yIHBlcnNpc3RpbmcgdHJhbnNpZW50IGRhdGEgaW4gbG9jYWxTdG9yYWdlLlxuICpcbiAqIEBjbGFzcyBMb2NhbFN0b3JhZ2VCdWNrZXRcbiAqIEBleHRlbmRzIEJ1Y2tldFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbFN0b3JhZ2VCdWNrZXQgZXh0ZW5kcyBCdWNrZXQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBMb2NhbFN0b3JhZ2VCdWNrZXQuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gIFtzZXR0aW5nc10gICAgICAgICAgIFNldHRpbmdzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVdICAgICAgT3B0aW9uYWwuIE5hbWUgb2YgdGhpcyBidWNrZXQuIERlZmF1bHRzIHRvICdsb2NhbFN0b3JhZ2VCdWNrZXQnLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIFByZWZpeCBmb3Iga2V5cyB1c2VkIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJ29yYml0LWJ1Y2tldCcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MuZGVsaW1pdGVyXSBPcHRpb25hbC4gRGVsaW1pdGVyIHVzZWQgdG8gc2VwYXJhdGUga2V5IHNlZ21lbnRzIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJy8nLlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gW3NldHRpbmdzLnZlcnNpb25dICAgT3B0aW9uYWwuIERlZmF1bHRzIHRvIDEuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsIHN0b3JhZ2UhJywgc3VwcG9ydHNMb2NhbFN0b3JhZ2UoKSk7XG4gICAgICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdsb2NhbFN0b3JhZ2UnO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuX2RlbGltaXRlciA9IHNldHRpbmdzLmRlbGltaXRlciB8fCAnLyc7XG4gICAgfVxuICAgIGdldCBkZWxpbWl0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWxpbWl0ZXI7XG4gICAgfVxuICAgIGdldEZ1bGxLZXlGb3JJdGVtKGtleSkge1xuICAgICAgICByZXR1cm4gW3RoaXMubmFtZXNwYWNlLCBrZXldLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xuICAgIH1cbiAgICBnZXRJdGVtKGtleSkge1xuICAgICAgICBjb25zdCBmdWxsS2V5ID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShmdWxsS2V5KSkpO1xuICAgIH1cbiAgICBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgZnVsbEtleSA9IHRoaXMuZ2V0RnVsbEtleUZvckl0ZW0oa2V5KTtcbiAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShmdWxsS2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJlbW92ZUl0ZW0oa2V5KSB7XG4gICAgICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLmdldEZ1bGxLZXlGb3JJdGVtKGtleSk7XG4gICAgICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oZnVsbEtleSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59Il19