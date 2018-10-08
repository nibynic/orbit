"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bucket = undefined;

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _evented = require("./evented");

var _evented2 = _interopRequireDefault(_evented);

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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
 * Buckets can persist state. The base `Bucket` class is abstract and should be
 * extended to created buckets with different persistence strategies.
 *
 * Buckets have a simple map-like interface with methods like `getItem`,
 * `setItem`, and `removeItem`. All methods return promises to enable usage with
 * asynchronous stores like IndexedDB.
 *
 * Buckets can be assigned a unique `namespace` in order to avoid collisions.
 *
 * Buckets can be assigned a version, and can be "upgraded" to a new version.
 * The upgrade process allows buckets to migrate their data between versions.
 *
 * @export
 * @abstract
 * @class Bucket
 * @implements {Evented}
 */
var Bucket = function () {
    /**
     * Creates an instance of `Bucket`.
     *
     * @param {BucketSettings} [settings={}]
     *
     * @memberOf Bucket
     */
    function Bucket() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Bucket);

        if (settings.version === undefined) {
            settings.version = 1;
        }
        settings.namespace = settings.namespace || 'orbit-bucket';
        this._applySettings(settings);
    }
    /**
     * Name used for tracking and debugging a bucket instance.
     *
     * @readonly
     * @type {string}
     * @memberOf Bucket
     */

    /**
     * Upgrades Bucket to a new version with new settings.
     *
     * Settings, beyond `version`, are bucket-specific.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
      */
    Bucket.prototype.upgrade = function upgrade() {
        var _this = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        return this._applySettings(settings).then(function () {
            return _this.emit('upgrade', _this._version);
        });
    };
    /**
     * Applies settings passed from a `constructor` or `upgrade`.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
     */

    Bucket.prototype._applySettings = function _applySettings(settings) {
        if (settings.name) {
            this._name = settings.name;
        }
        if (settings.namespace) {
            this._namespace = settings.namespace;
        }
        this._version = settings.version;
        return _main2.default.Promise.resolve();
    };

    _createClass(Bucket, [{
        key: "name",
        get: function () {
            return this._name;
        }
        /**
         * The namespace used by the bucket when accessing any items.
         *
         * This is used to distinguish one bucket's contents from another.
         *
         * @readonly
         * @type {string}
         * @memberOf Bucket
         */

    }, {
        key: "namespace",
        get: function () {
            return this._namespace;
        }
        /**
         * The current version of the bucket.
         *
         * To change versions, `upgrade` should be invoked.
         *
         * @readonly
         * @type {number}
         * @memberOf Bucket
         */

    }, {
        key: "version",
        get: function () {
            return this._version;
        }
    }]);

    return Bucket;
}();
exports.Bucket = Bucket = __decorate([_evented2.default], Bucket);
exports.Bucket = Bucket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsInNldHRpbmdzIiwiT3JiaXQiLCJCdWNrZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFPQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUkEsSUFBSUEsYUFBYSxhQUFRLFVBQVIsVUFBQSxJQUEyQixVQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBUixNQUFBO0FBQUEsUUFDSUMsSUFBSUYsSUFBQUEsQ0FBQUEsR0FBQUEsTUFBQUEsR0FBaUJHLFNBQUFBLElBQUFBLEdBQWdCQSxPQUFPQyxPQUFBQSx3QkFBQUEsQ0FBQUEsTUFBQUEsRUFBdkJELEdBQXVCQyxDQUF2QkQsR0FEekIsSUFBQTtBQUFBLFFBQUEsQ0FBQTtBQUdBLFFBQUksT0FBQSxPQUFBLEtBQUEsUUFBQSxJQUErQixPQUFPRSxRQUFQLFFBQUEsS0FBbkMsVUFBQSxFQUEyRUgsSUFBSUcsUUFBQUEsUUFBQUEsQ0FBQUEsVUFBQUEsRUFBQUEsTUFBQUEsRUFBQUEsR0FBQUEsRUFBL0UsSUFBK0VBLENBQUpILENBQTNFLEtBQW9JLEtBQUssSUFBSUksSUFBSUMsV0FBQUEsTUFBQUEsR0FBYixDQUFBLEVBQW9DRCxLQUFwQyxDQUFBLEVBQUEsR0FBQSxFQUFBO0FBQWlELFlBQUlFLElBQUlELFdBQVIsQ0FBUUEsQ0FBUixFQUF1QkwsSUFBSSxDQUFDRixJQUFBQSxDQUFBQSxHQUFRUSxFQUFSUixDQUFRUSxDQUFSUixHQUFlQSxJQUFBQSxDQUFBQSxHQUFRUSxFQUFBQSxNQUFBQSxFQUFBQSxHQUFBQSxFQUFSUixDQUFRUSxDQUFSUixHQUE0QlEsRUFBQUEsTUFBQUEsRUFBNUMsR0FBNENBLENBQTVDLEtBQUpOLENBQUFBO0FBQzVNLFlBQU9GLElBQUFBLENBQUFBLElBQUFBLENBQUFBLElBQWNJLE9BQUFBLGNBQUFBLENBQUFBLE1BQUFBLEVBQUFBLEdBQUFBLEVBQWRKLENBQWNJLENBQWRKLEVBQVAsQ0FBQTtBQUxKLENBQUE7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxJQUFJLFNBQUEsWUFBQTtBQUNBOzs7Ozs7O0FBT0EsYUFBQSxNQUFBLEdBQTJCO0FBQUEsWUFBZlMsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsTUFBQTs7QUFDdkIsWUFBSUEsU0FBQUEsT0FBQUEsS0FBSixTQUFBLEVBQW9DO0FBQ2hDQSxxQkFBQUEsT0FBQUEsR0FBQUEsQ0FBQUE7QUFDSDtBQUNEQSxpQkFBQUEsU0FBQUEsR0FBcUJBLFNBQUFBLFNBQUFBLElBQXJCQSxjQUFBQTtBQUNBLGFBQUEsY0FBQSxDQUFBLFFBQUE7QUFDSDtBQUNEOzs7Ozs7OztBQWtDQTs7Ozs7Ozs7O0FBakRBLFdBQUEsU0FBQSxDQUFBLE9BQUEsR0FBQSxTQUFBLE9BQUEsR0EwRHVCO0FBQUEsWUFBQSxRQUFBLElBQUE7O0FBQUEsWUFBZkEsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFDbkIsWUFBSUEsU0FBQUEsT0FBQUEsS0FBSixTQUFBLEVBQW9DO0FBQ2hDQSxxQkFBQUEsT0FBQUEsR0FBbUIsS0FBQSxRQUFBLEdBQW5CQSxDQUFBQTtBQUNIO0FBQ0QsZUFBTyxLQUFBLGNBQUEsQ0FBQSxRQUFBLEVBQUEsSUFBQSxDQUFtQyxZQUFBO0FBQUEsbUJBQU0sTUFBQSxJQUFBLENBQUEsU0FBQSxFQUFxQixNQUEzQixRQUFNLENBQU47QUFBMUMsU0FBTyxDQUFQO0FBOURKLEtBQUE7QUFnRUE7Ozs7Ozs7O0FBaEVBLFdBQUEsU0FBQSxDQUFBLGNBQUEsR0FBQSxTQUFBLGNBQUEsQ0FBQSxRQUFBLEVBdUV5QjtBQUNyQixZQUFJQSxTQUFKLElBQUEsRUFBbUI7QUFDZixpQkFBQSxLQUFBLEdBQWFBLFNBQWIsSUFBQTtBQUNIO0FBQ0QsWUFBSUEsU0FBSixTQUFBLEVBQXdCO0FBQ3BCLGlCQUFBLFVBQUEsR0FBa0JBLFNBQWxCLFNBQUE7QUFDSDtBQUNELGFBQUEsUUFBQSxHQUFnQkEsU0FBaEIsT0FBQTtBQUNBLGVBQU9DLGVBQUFBLE9BQUFBLENBQVAsT0FBT0EsRUFBUDtBQS9FSixLQUFBOztBQUFBLGlCQUFBLE1BQUEsRUFBQSxDQUFBO0FBQUEsYUFBQSxNQUFBO0FBQUEsYUFBQSxZQXNCVztBQUNQLG1CQUFPLEtBQVAsS0FBQTtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7QUF6QkEsS0FBQSxFQUFBO0FBQUEsYUFBQSxXQUFBO0FBQUEsYUFBQSxZQWtDZ0I7QUFDWixtQkFBTyxLQUFQLFVBQUE7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBckNBLEtBQUEsRUFBQTtBQUFBLGFBQUEsU0FBQTtBQUFBLGFBQUEsWUE4Q2M7QUFDVixtQkFBTyxLQUFQLFFBQUE7QUFDSDtBQWhERCxLQUFBLENBQUE7O0FBQUEsV0FBQSxNQUFBO0FBQUosQ0FBSSxFQUFKO0FBa0ZBQyxRQUNBLE1BREFBLFlBQVNaLFdBQVcsQ0FBWEEsaUJBQVcsQ0FBWEEsRUFBVFksTUFBU1osQ0FBVFk7UUFDQSxNLEdBQUEsTSIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCBldmVudGVkIGZyb20gJy4vZXZlbnRlZCc7XG4vKipcbiAqIEJ1Y2tldHMgY2FuIHBlcnNpc3Qgc3RhdGUuIFRoZSBiYXNlIGBCdWNrZXRgIGNsYXNzIGlzIGFic3RyYWN0IGFuZCBzaG91bGQgYmVcbiAqIGV4dGVuZGVkIHRvIGNyZWF0ZWQgYnVja2V0cyB3aXRoIGRpZmZlcmVudCBwZXJzaXN0ZW5jZSBzdHJhdGVnaWVzLlxuICpcbiAqIEJ1Y2tldHMgaGF2ZSBhIHNpbXBsZSBtYXAtbGlrZSBpbnRlcmZhY2Ugd2l0aCBtZXRob2RzIGxpa2UgYGdldEl0ZW1gLFxuICogYHNldEl0ZW1gLCBhbmQgYHJlbW92ZUl0ZW1gLiBBbGwgbWV0aG9kcyByZXR1cm4gcHJvbWlzZXMgdG8gZW5hYmxlIHVzYWdlIHdpdGhcbiAqIGFzeW5jaHJvbm91cyBzdG9yZXMgbGlrZSBJbmRleGVkREIuXG4gKlxuICogQnVja2V0cyBjYW4gYmUgYXNzaWduZWQgYSB1bmlxdWUgYG5hbWVzcGFjZWAgaW4gb3JkZXIgdG8gYXZvaWQgY29sbGlzaW9ucy5cbiAqXG4gKiBCdWNrZXRzIGNhbiBiZSBhc3NpZ25lZCBhIHZlcnNpb24sIGFuZCBjYW4gYmUgXCJ1cGdyYWRlZFwiIHRvIGEgbmV3IHZlcnNpb24uXG4gKiBUaGUgdXBncmFkZSBwcm9jZXNzIGFsbG93cyBidWNrZXRzIHRvIG1pZ3JhdGUgdGhlaXIgZGF0YSBiZXR3ZWVuIHZlcnNpb25zLlxuICpcbiAqIEBleHBvcnRcbiAqIEBhYnN0cmFjdFxuICogQGNsYXNzIEJ1Y2tldFxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XG4gKi9cbmxldCBCdWNrZXQgPSBjbGFzcyBCdWNrZXQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYEJ1Y2tldGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBbc2V0dGluZ3M9e31dXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQnVja2V0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy52ZXJzaW9uID0gMTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0aW5ncy5uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0LWJ1Y2tldCc7XG4gICAgICAgIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIGFuZCBkZWJ1Z2dpbmcgYSBidWNrZXQgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBCdWNrZXRcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lc3BhY2UgdXNlZCBieSB0aGUgYnVja2V0IHdoZW4gYWNjZXNzaW5nIGFueSBpdGVtcy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdXNlZCB0byBkaXN0aW5ndWlzaCBvbmUgYnVja2V0J3MgY29udGVudHMgZnJvbSBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgQnVja2V0XG4gICAgICovXG4gICAgZ2V0IG5hbWVzcGFjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgYnVja2V0LlxuICAgICAqXG4gICAgICogVG8gY2hhbmdlIHZlcnNpb25zLCBgdXBncmFkZWAgc2hvdWxkIGJlIGludm9rZWQuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBCdWNrZXRcbiAgICAgKi9cbiAgICBnZXQgdmVyc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnNpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGVzIEJ1Y2tldCB0byBhIG5ldyB2ZXJzaW9uIHdpdGggbmV3IHNldHRpbmdzLlxuICAgICAqXG4gICAgICogU2V0dGluZ3MsIGJleW9uZCBgdmVyc2lvbmAsIGFyZSBidWNrZXQtc3BlY2lmaWMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBzZXR0aW5nc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqIEBtZW1iZXJPZiBCdWNrZXRcbiAgICAgICovXG4gICAgdXBncmFkZShzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNldHRpbmdzLnZlcnNpb24gPSB0aGlzLl92ZXJzaW9uICsgMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykudGhlbigoKSA9PiB0aGlzLmVtaXQoJ3VwZ3JhZGUnLCB0aGlzLl92ZXJzaW9uKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgc2V0dGluZ3MgcGFzc2VkIGZyb20gYSBgY29uc3RydWN0b3JgIG9yIGB1cGdyYWRlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QnVja2V0U2V0dGluZ3N9IHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICogQG1lbWJlck9mIEJ1Y2tldFxuICAgICAqL1xuICAgIF9hcHBseVNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3MubmFtZXNwYWNlKSB7XG4gICAgICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdmVyc2lvbiA9IHNldHRpbmdzLnZlcnNpb247XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG59O1xuQnVja2V0ID0gX19kZWNvcmF0ZShbZXZlbnRlZF0sIEJ1Y2tldCk7XG5leHBvcnQgeyBCdWNrZXQgfTsiXX0=