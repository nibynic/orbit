define('@orbit/local-storage-bucket', ['exports', '@orbit/core', '@orbit/utils'], function (exports, Orbit, _orbit_utils) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;

function supportsLocalStorage() {
    return !!Orbit__default.globals.localStorage;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

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

        _orbit_utils.assert('Your browser does not support local storage!', supportsLocalStorage());
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
        return Orbit__default.Promise.resolve(JSON.parse(Orbit__default.globals.localStorage.getItem(fullKey)));
    };

    LocalStorageBucket.prototype.setItem = function setItem(key, value) {
        var fullKey = this.getFullKeyForItem(key);
        Orbit__default.globals.localStorage.setItem(fullKey, JSON.stringify(value));
        return Orbit__default.Promise.resolve();
    };

    LocalStorageBucket.prototype.removeItem = function removeItem(key) {
        var fullKey = this.getFullKeyForItem(key);
        Orbit__default.globals.localStorage.removeItem(fullKey);
        return Orbit__default.Promise.resolve();
    };

    _createClass(LocalStorageBucket, [{
        key: 'delimiter',
        get: function () {
            return this._delimiter;
        }
    }]);

    return LocalStorageBucket;
}(Orbit.Bucket);

exports['default'] = LocalStorageBucket;
exports.supportsLocalStorage = supportsLocalStorage;

Object.defineProperty(exports, '__esModule', { value: true });

});
