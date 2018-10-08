var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import Orbit, { Bucket } from '@orbit/core';
import { assert } from '@orbit/utils';
import { supportsLocalStorage } from './lib/local-storage';
/**
 * Bucket for persisting transient data in localStorage.
 *
 * @class LocalStorageBucket
 * @extends Bucket
 */

var LocalStorageBucket = function (_Bucket) {
    _inherits(LocalStorageBucket, _Bucket);

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
    function LocalStorageBucket() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalStorageBucket);

        assert('Your browser does not support local storage!', supportsLocalStorage());
        settings.name = settings.name || 'localStorage';

        var _this = _possibleConstructorReturn(this, _Bucket.call(this, settings));

        _this._delimiter = settings.delimiter || '/';
        return _this;
    }

    LocalStorageBucket.prototype.getFullKeyForItem = function getFullKeyForItem(key) {
        return [this.namespace, key].join(this.delimiter);
    };

    LocalStorageBucket.prototype.getItem = function getItem(key) {
        var fullKey = this.getFullKeyForItem(key);
        return Orbit.Promise.resolve(JSON.parse(Orbit.globals.localStorage.getItem(fullKey)));
    };

    LocalStorageBucket.prototype.setItem = function setItem(key, value) {
        var fullKey = this.getFullKeyForItem(key);
        Orbit.globals.localStorage.setItem(fullKey, JSON.stringify(value));
        return Orbit.Promise.resolve();
    };

    LocalStorageBucket.prototype.removeItem = function removeItem(key) {
        var fullKey = this.getFullKeyForItem(key);
        Orbit.globals.localStorage.removeItem(fullKey);
        return Orbit.Promise.resolve();
    };

    _createClass(LocalStorageBucket, [{
        key: 'delimiter',
        get: function () {
            return this._delimiter;
        }
    }]);

    return LocalStorageBucket;
}(Bucket);

export default LocalStorageBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJPcmJpdCIsIkJ1Y2tldCIsImFzc2VydCIsInN1cHBvcnRzTG9jYWxTdG9yYWdlIiwiTG9jYWxTdG9yYWdlQnVja2V0Iiwic2V0dGluZ3MiLCJuYW1lIiwiX2RlbGltaXRlciIsImRlbGltaXRlciIsImdldEZ1bGxLZXlGb3JJdGVtIiwia2V5IiwibmFtZXNwYWNlIiwiam9pbiIsImdldEl0ZW0iLCJmdWxsS2V5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJKU09OIiwicGFyc2UiLCJnbG9iYWxzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInZhbHVlIiwic3RyaW5naWZ5IiwicmVtb3ZlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsSUFBZ0JDLE1BQWhCLFFBQThCLGFBQTlCO0FBQ0EsU0FBU0MsTUFBVCxRQUF1QixjQUF2QjtBQUNBLFNBQVNDLG9CQUFULFFBQXFDLHFCQUFyQztBQUNBOzs7Ozs7O0lBTXFCQyxrQjs7O0FBQ2pCOzs7Ozs7Ozs7O0FBVUEsa0NBQTJCO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkgsZUFBTyw4Q0FBUCxFQUF1REMsc0JBQXZEO0FBQ0FFLGlCQUFTQyxJQUFULEdBQWdCRCxTQUFTQyxJQUFULElBQWlCLGNBQWpDOztBQUZ1QixxREFHdkIsbUJBQU1ELFFBQU4sQ0FIdUI7O0FBSXZCLGNBQUtFLFVBQUwsR0FBa0JGLFNBQVNHLFNBQVQsSUFBc0IsR0FBeEM7QUFKdUI7QUFLMUI7O2lDQUlEQyxpQiw4QkFBa0JDLEcsRUFBSztBQUNuQixlQUFPLENBQUMsS0FBS0MsU0FBTixFQUFpQkQsR0FBakIsRUFBc0JFLElBQXRCLENBQTJCLEtBQUtKLFNBQWhDLENBQVA7QUFDSCxLOztpQ0FDREssTyxvQkFBUUgsRyxFQUFLO0FBQ1QsWUFBTUksVUFBVSxLQUFLTCxpQkFBTCxDQUF1QkMsR0FBdkIsQ0FBaEI7QUFDQSxlQUFPVixNQUFNZSxPQUFOLENBQWNDLE9BQWQsQ0FBc0JDLEtBQUtDLEtBQUwsQ0FBV2xCLE1BQU1tQixPQUFOLENBQWNDLFlBQWQsQ0FBMkJQLE9BQTNCLENBQW1DQyxPQUFuQyxDQUFYLENBQXRCLENBQVA7QUFDSCxLOztpQ0FDRE8sTyxvQkFBUVgsRyxFQUFLWSxLLEVBQU87QUFDaEIsWUFBTVIsVUFBVSxLQUFLTCxpQkFBTCxDQUF1QkMsR0FBdkIsQ0FBaEI7QUFDQVYsY0FBTW1CLE9BQU4sQ0FBY0MsWUFBZCxDQUEyQkMsT0FBM0IsQ0FBbUNQLE9BQW5DLEVBQTRDRyxLQUFLTSxTQUFMLENBQWVELEtBQWYsQ0FBNUM7QUFDQSxlQUFPdEIsTUFBTWUsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSCxLOztpQ0FDRFEsVSx1QkFBV2QsRyxFQUFLO0FBQ1osWUFBTUksVUFBVSxLQUFLTCxpQkFBTCxDQUF1QkMsR0FBdkIsQ0FBaEI7QUFDQVYsY0FBTW1CLE9BQU4sQ0FBY0MsWUFBZCxDQUEyQkksVUFBM0IsQ0FBc0NWLE9BQXRDO0FBQ0EsZUFBT2QsTUFBTWUsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSCxLOzs7O3lCQW5CZTtBQUNaLG1CQUFPLEtBQUtULFVBQVo7QUFDSDs7OztFQW5CMkNOLE07O2VBQTNCRyxrQiIsImZpbGUiOiJidWNrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHsgQnVja2V0IH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IHN1cHBvcnRzTG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9saWIvbG9jYWwtc3RvcmFnZSc7XG4vKipcbiAqIEJ1Y2tldCBmb3IgcGVyc2lzdGluZyB0cmFuc2llbnQgZGF0YSBpbiBsb2NhbFN0b3JhZ2UuXG4gKlxuICogQGNsYXNzIExvY2FsU3RvcmFnZUJ1Y2tldFxuICogQGV4dGVuZHMgQnVja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2FsU3RvcmFnZUJ1Y2tldCBleHRlbmRzIEJ1Y2tldCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IExvY2FsU3RvcmFnZUJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgW3NldHRpbmdzXSAgICAgICAgICAgU2V0dGluZ3MuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZV0gICAgICBPcHRpb25hbC4gTmFtZSBvZiB0aGlzIGJ1Y2tldC4gRGVmYXVsdHMgdG8gJ2xvY2FsU3RvcmFnZUJ1Y2tldCcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc2V0dGluZ3MubmFtZXNwYWNlXSBPcHRpb25hbC4gUHJlZml4IGZvciBrZXlzIHVzZWQgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnb3JiaXQtYnVja2V0Jy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5kZWxpbWl0ZXJdIE9wdGlvbmFsLiBEZWxpbWl0ZXIgdXNlZCB0byBzZXBhcmF0ZSBrZXkgc2VnbWVudHMgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnLycuXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBbc2V0dGluZ3MudmVyc2lvbl0gICBPcHRpb25hbC4gRGVmYXVsdHMgdG8gMS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbG9jYWwgc3RvcmFnZSEnLCBzdXBwb3J0c0xvY2FsU3RvcmFnZSgpKTtcbiAgICAgICAgc2V0dGluZ3MubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJ2xvY2FsU3RvcmFnZSc7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5fZGVsaW1pdGVyID0gc2V0dGluZ3MuZGVsaW1pdGVyIHx8ICcvJztcbiAgICB9XG4gICAgZ2V0IGRlbGltaXRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlbGltaXRlcjtcbiAgICB9XG4gICAgZ2V0RnVsbEtleUZvckl0ZW0oa2V5KSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5uYW1lc3BhY2UsIGtleV0uam9pbih0aGlzLmRlbGltaXRlcik7XG4gICAgfVxuICAgIGdldEl0ZW0oa2V5KSB7XG4gICAgICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLmdldEZ1bGxLZXlGb3JJdGVtKGtleSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoSlNPTi5wYXJzZShPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGZ1bGxLZXkpKSk7XG4gICAgfVxuICAgIHNldEl0ZW0oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBmdWxsS2V5ID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGZ1bGxLZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmVtb3ZlSXRlbShrZXkpIHtcbiAgICAgICAgY29uc3QgZnVsbEtleSA9IHRoaXMuZ2V0RnVsbEtleUZvckl0ZW0oa2V5KTtcbiAgICAgICAgT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShmdWxsS2V5KTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbn0iXX0=