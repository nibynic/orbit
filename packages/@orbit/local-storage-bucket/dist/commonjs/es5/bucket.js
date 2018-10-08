"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require("@orbit/core");

var _core2 = _interopRequireDefault(_core);

var _utils = require("@orbit/utils");

var _localStorage = require("./lib/local-storage");

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

        (0, _utils.assert)('Your browser does not support local storage!', (0, _localStorage.supportsLocalStorage)());
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
        return _core2.default.Promise.resolve(JSON.parse(_core2.default.globals.localStorage.getItem(fullKey)));
    };

    LocalStorageBucket.prototype.setItem = function setItem(key, value) {
        var fullKey = this.getFullKeyForItem(key);
        _core2.default.globals.localStorage.setItem(fullKey, JSON.stringify(value));
        return _core2.default.Promise.resolve();
    };

    LocalStorageBucket.prototype.removeItem = function removeItem(key) {
        var fullKey = this.getFullKeyForItem(key);
        _core2.default.globals.localStorage.removeItem(fullKey);
        return _core2.default.Promise.resolve();
    };

    _createClass(LocalStorageBucket, [{
        key: 'delimiter',
        get: function () {
            return this._delimiter;
        }
    }]);

    return LocalStorageBucket;
}(_core.Bucket);

exports.default = LocalStorageBucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJMb2NhbFN0b3JhZ2VCdWNrZXQiLCJCdWNrZXQiLCJzZXR0aW5ncyIsImFzc2VydCIsImdldEZ1bGxLZXlGb3JJdGVtIiwia2V5IiwiZ2V0SXRlbSIsImZ1bGxLZXkiLCJPcmJpdCIsIkpTT04iLCJzZXRJdGVtIiwidmFsdWUiLCJyZW1vdmVJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7SUFNcUJBLHFCOzs7QUFDakI7Ozs7Ozs7Ozs7QUFVQSxhQUFBLGtCQUFBLEdBQTJCO0FBQUEsWUFBZkUsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsa0JBQUE7O0FBQ3ZCQywyQkFBQUEsOENBQUFBLEVBQUFBLHlDQUFBQTtBQUNBRCxpQkFBQUEsSUFBQUEsR0FBZ0JBLFNBQUFBLElBQUFBLElBQWhCQSxjQUFBQTs7QUFGdUIsWUFBQSxRQUFBLDJCQUFBLElBQUEsRUFHdkIsUUFBQSxJQUFBLENBQUEsSUFBQSxFQUh1QixRQUd2QixDQUh1QixDQUFBOztBQUl2QixjQUFBLFVBQUEsR0FBa0JBLFNBQUFBLFNBQUFBLElBQWxCLEdBQUE7QUFKdUIsZUFBQSxLQUFBO0FBSzFCOztpQ0FJREUsaUIsOEJBQWtCQyxHLEVBQUs7QUFDbkIsZUFBTyxDQUFDLEtBQUQsU0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLENBQTJCLEtBQWxDLFNBQU8sQ0FBUDs7O2lDQUVKQyxPLG9CQUFRRCxHLEVBQUs7QUFDVCxZQUFNRSxVQUFVLEtBQUEsaUJBQUEsQ0FBaEIsR0FBZ0IsQ0FBaEI7QUFDQSxlQUFPQyxlQUFBQSxPQUFBQSxDQUFBQSxPQUFBQSxDQUFzQkMsS0FBQUEsS0FBQUEsQ0FBV0QsZUFBQUEsT0FBQUEsQ0FBQUEsWUFBQUEsQ0FBQUEsT0FBQUEsQ0FBeEMsT0FBd0NBLENBQVhDLENBQXRCRCxDQUFQOzs7aUNBRUpFLE8sb0JBQVFMLEcsRUFBS00sSyxFQUFPO0FBQ2hCLFlBQU1KLFVBQVUsS0FBQSxpQkFBQSxDQUFoQixHQUFnQixDQUFoQjtBQUNBQyx1QkFBQUEsT0FBQUEsQ0FBQUEsWUFBQUEsQ0FBQUEsT0FBQUEsQ0FBQUEsT0FBQUEsRUFBNENDLEtBQUFBLFNBQUFBLENBQTVDRCxLQUE0Q0MsQ0FBNUNEO0FBQ0EsZUFBT0EsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQOzs7aUNBRUpJLFUsdUJBQVdQLEcsRUFBSztBQUNaLFlBQU1FLFVBQVUsS0FBQSxpQkFBQSxDQUFoQixHQUFnQixDQUFoQjtBQUNBQyx1QkFBQUEsT0FBQUEsQ0FBQUEsWUFBQUEsQ0FBQUEsVUFBQUEsQ0FBQUEsT0FBQUE7QUFDQSxlQUFPQSxlQUFBQSxPQUFBQSxDQUFQLE9BQU9BLEVBQVA7Ozs7O3lCQWxCWTtBQUNaLG1CQUFPLEtBQVAsVUFBQTtBQUNIOzs7O0VBbkIyQ1AsWTs7a0JBQTNCRCxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCwgeyBCdWNrZXQgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgc3VwcG9ydHNMb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xpYi9sb2NhbC1zdG9yYWdlJztcbi8qKlxuICogQnVja2V0IGZvciBwZXJzaXN0aW5nIHRyYW5zaWVudCBkYXRhIGluIGxvY2FsU3RvcmFnZS5cbiAqXG4gKiBAY2xhc3MgTG9jYWxTdG9yYWdlQnVja2V0XG4gKiBAZXh0ZW5kcyBCdWNrZXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxTdG9yYWdlQnVja2V0IGV4dGVuZHMgQnVja2V0IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgTG9jYWxTdG9yYWdlQnVja2V0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICBbc2V0dGluZ3NdICAgICAgICAgICBTZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lXSAgICAgIE9wdGlvbmFsLiBOYW1lIG9mIHRoaXMgYnVja2V0LiBEZWZhdWx0cyB0byAnbG9jYWxTdG9yYWdlQnVja2V0Jy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzZXR0aW5ncy5uYW1lc3BhY2VdIE9wdGlvbmFsLiBQcmVmaXggZm9yIGtleXMgdXNlZCBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICdvcmJpdC1idWNrZXQnLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NldHRpbmdzLmRlbGltaXRlcl0gT3B0aW9uYWwuIERlbGltaXRlciB1c2VkIHRvIHNlcGFyYXRlIGtleSBzZWdtZW50cyBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICcvJy5cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IFtzZXR0aW5ncy52ZXJzaW9uXSAgIE9wdGlvbmFsLiBEZWZhdWx0cyB0byAxLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbCBzdG9yYWdlIScsIHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpO1xuICAgICAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnbG9jYWxTdG9yYWdlJztcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLl9kZWxpbWl0ZXIgPSBzZXR0aW5ncy5kZWxpbWl0ZXIgfHwgJy8nO1xuICAgIH1cbiAgICBnZXQgZGVsaW1pdGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVsaW1pdGVyO1xuICAgIH1cbiAgICBnZXRGdWxsS2V5Rm9ySXRlbShrZXkpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLm5hbWVzcGFjZSwga2V5XS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcbiAgICB9XG4gICAgZ2V0SXRlbShrZXkpIHtcbiAgICAgICAgY29uc3QgZnVsbEtleSA9IHRoaXMuZ2V0RnVsbEtleUZvckl0ZW0oa2V5KTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShKU09OLnBhcnNlKE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLmdldEl0ZW0oZnVsbEtleSkpKTtcbiAgICB9XG4gICAgc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGZ1bGxLZXkgPSB0aGlzLmdldEZ1bGxLZXlGb3JJdGVtKGtleSk7XG4gICAgICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnNldEl0ZW0oZnVsbEtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZW1vdmVJdGVtKGtleSkge1xuICAgICAgICBjb25zdCBmdWxsS2V5ID0gdGhpcy5nZXRGdWxsS2V5Rm9ySXRlbShrZXkpO1xuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGZ1bGxLZXkpO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxufSJdfQ==