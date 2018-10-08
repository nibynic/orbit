var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit from './main';
import evented from './evented';
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
        return Orbit.Promise.resolve();
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
Bucket = __decorate([evented], Bucket);
export { Bucket };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1Y2tldC5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJPcmJpdCIsImV2ZW50ZWQiLCJCdWNrZXQiLCJzZXR0aW5ncyIsInZlcnNpb24iLCJ1bmRlZmluZWQiLCJuYW1lc3BhY2UiLCJfYXBwbHlTZXR0aW5ncyIsInVwZ3JhZGUiLCJfdmVyc2lvbiIsInRoZW4iLCJlbWl0IiwibmFtZSIsIl9uYW1lIiwiX25hbWVzcGFjZSIsIlByb21pc2UiLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFVQyxNQUFsQjtBQUFBLFFBQ0lDLElBQUlILElBQUksQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxTQUFTLElBQVQsR0FBZ0JBLE9BQU9LLE9BQU9DLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBRC9GO0FBQUEsUUFFSU8sQ0FGSjtBQUdBLFFBQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxRQUFRQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxJQUFJSSxRQUFRQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQW9JLEtBQUssSUFBSVUsSUFBSWIsV0FBV00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sS0FBSyxDQUF6QyxFQUE0Q0EsR0FBNUM7QUFBaUQsWUFBSUgsSUFBSVYsV0FBV2EsQ0FBWCxDQUFSLEVBQXVCTixJQUFJLENBQUNILElBQUksQ0FBSixHQUFRTSxFQUFFSCxDQUFGLENBQVIsR0FBZUgsSUFBSSxDQUFKLEdBQVFNLEVBQUVULE1BQUYsRUFBVUMsR0FBVixFQUFlSyxDQUFmLENBQVIsR0FBNEJHLEVBQUVULE1BQUYsRUFBVUMsR0FBVixDQUE1QyxLQUErREssQ0FBbkU7QUFBeEUsS0FDcEksT0FBT0gsSUFBSSxDQUFKLElBQVNHLENBQVQsSUFBY0MsT0FBT00sY0FBUCxDQUFzQmIsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DSyxDQUFuQyxDQUFkLEVBQXFEQSxDQUE1RDtBQUNILENBTkQ7QUFPQSxPQUFPUSxLQUFQLE1BQWtCLFFBQWxCO0FBQ0EsT0FBT0MsT0FBUCxNQUFvQixXQUFwQjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsSUFBSUM7QUFDQTs7Ozs7OztBQU9BLHNCQUEyQjtBQUFBLFlBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkIsWUFBSUEsU0FBU0MsT0FBVCxLQUFxQkMsU0FBekIsRUFBb0M7QUFDaENGLHFCQUFTQyxPQUFULEdBQW1CLENBQW5CO0FBQ0g7QUFDREQsaUJBQVNHLFNBQVQsR0FBcUJILFNBQVNHLFNBQVQsSUFBc0IsY0FBM0M7QUFDQSxhQUFLQyxjQUFMLENBQW9CSixRQUFwQjtBQUNIO0FBQ0Q7Ozs7Ozs7OztBQWtDQTs7Ozs7Ozs7O0FBakRBLHFCQTBEQUssT0ExREEsc0JBMER1QjtBQUFBOztBQUFBLFlBQWZMLFFBQWUsdUVBQUosRUFBSTs7QUFDbkIsWUFBSUEsU0FBU0MsT0FBVCxLQUFxQkMsU0FBekIsRUFBb0M7QUFDaENGLHFCQUFTQyxPQUFULEdBQW1CLEtBQUtLLFFBQUwsR0FBZ0IsQ0FBbkM7QUFDSDtBQUNELGVBQU8sS0FBS0YsY0FBTCxDQUFvQkosUUFBcEIsRUFBOEJPLElBQTlCLENBQW1DO0FBQUEsbUJBQU0sTUFBS0MsSUFBTCxDQUFVLFNBQVYsRUFBcUIsTUFBS0YsUUFBMUIsQ0FBTjtBQUFBLFNBQW5DLENBQVA7QUFDSCxLQS9ERDtBQWdFQTs7Ozs7Ozs7O0FBaEVBLHFCQXVFQUYsY0F2RUEsMkJBdUVlSixRQXZFZixFQXVFeUI7QUFDckIsWUFBSUEsU0FBU1MsSUFBYixFQUFtQjtBQUNmLGlCQUFLQyxLQUFMLEdBQWFWLFNBQVNTLElBQXRCO0FBQ0g7QUFDRCxZQUFJVCxTQUFTRyxTQUFiLEVBQXdCO0FBQ3BCLGlCQUFLUSxVQUFMLEdBQWtCWCxTQUFTRyxTQUEzQjtBQUNIO0FBQ0QsYUFBS0csUUFBTCxHQUFnQk4sU0FBU0MsT0FBekI7QUFDQSxlQUFPSixNQUFNZSxPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNILEtBaEZEOztBQUFBO0FBQUE7QUFBQSx5QkFzQlc7QUFDUCxtQkFBTyxLQUFLSCxLQUFaO0FBQ0g7QUFDRDs7Ozs7Ozs7OztBQXpCQTtBQUFBO0FBQUEseUJBa0NnQjtBQUNaLG1CQUFPLEtBQUtDLFVBQVo7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBckNBO0FBQUE7QUFBQSx5QkE4Q2M7QUFDVixtQkFBTyxLQUFLTCxRQUFaO0FBQ0g7QUFoREQ7O0FBQUE7QUFBQSxHQUFKO0FBa0ZBUCxTQUFTbEIsV0FBVyxDQUFDaUIsT0FBRCxDQUFYLEVBQXNCQyxNQUF0QixDQUFUO0FBQ0EsU0FBU0EsTUFBVCIsImZpbGUiOiJidWNrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9IHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgZXZlbnRlZCBmcm9tICcuL2V2ZW50ZWQnO1xuLyoqXG4gKiBCdWNrZXRzIGNhbiBwZXJzaXN0IHN0YXRlLiBUaGUgYmFzZSBgQnVja2V0YCBjbGFzcyBpcyBhYnN0cmFjdCBhbmQgc2hvdWxkIGJlXG4gKiBleHRlbmRlZCB0byBjcmVhdGVkIGJ1Y2tldHMgd2l0aCBkaWZmZXJlbnQgcGVyc2lzdGVuY2Ugc3RyYXRlZ2llcy5cbiAqXG4gKiBCdWNrZXRzIGhhdmUgYSBzaW1wbGUgbWFwLWxpa2UgaW50ZXJmYWNlIHdpdGggbWV0aG9kcyBsaWtlIGBnZXRJdGVtYCxcbiAqIGBzZXRJdGVtYCwgYW5kIGByZW1vdmVJdGVtYC4gQWxsIG1ldGhvZHMgcmV0dXJuIHByb21pc2VzIHRvIGVuYWJsZSB1c2FnZSB3aXRoXG4gKiBhc3luY2hyb25vdXMgc3RvcmVzIGxpa2UgSW5kZXhlZERCLlxuICpcbiAqIEJ1Y2tldHMgY2FuIGJlIGFzc2lnbmVkIGEgdW5pcXVlIGBuYW1lc3BhY2VgIGluIG9yZGVyIHRvIGF2b2lkIGNvbGxpc2lvbnMuXG4gKlxuICogQnVja2V0cyBjYW4gYmUgYXNzaWduZWQgYSB2ZXJzaW9uLCBhbmQgY2FuIGJlIFwidXBncmFkZWRcIiB0byBhIG5ldyB2ZXJzaW9uLlxuICogVGhlIHVwZ3JhZGUgcHJvY2VzcyBhbGxvd3MgYnVja2V0cyB0byBtaWdyYXRlIHRoZWlyIGRhdGEgYmV0d2VlbiB2ZXJzaW9ucy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAYWJzdHJhY3RcbiAqIEBjbGFzcyBCdWNrZXRcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgQnVja2V0ID0gY2xhc3MgQnVja2V0IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGBCdWNrZXRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCdWNrZXRTZXR0aW5nc30gW3NldHRpbmdzPXt9XVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJ1Y2tldFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0dGluZ3MudmVyc2lvbiA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgc2V0dGluZ3MubmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlIHx8ICdvcmJpdC1idWNrZXQnO1xuICAgICAgICB0aGlzLl9hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyBhbmQgZGVidWdnaW5nIGEgYnVja2V0IGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgQnVja2V0XG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZXNwYWNlIHVzZWQgYnkgdGhlIGJ1Y2tldCB3aGVuIGFjY2Vzc2luZyBhbnkgaXRlbXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHVzZWQgdG8gZGlzdGluZ3Vpc2ggb25lIGJ1Y2tldCdzIGNvbnRlbnRzIGZyb20gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEJ1Y2tldFxuICAgICAqL1xuICAgIGdldCBuYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIFRvIGNoYW5nZSB2ZXJzaW9ucywgYHVwZ3JhZGVgIHNob3VsZCBiZSBpbnZva2VkLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgQnVja2V0XG4gICAgICovXG4gICAgZ2V0IHZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlcyBCdWNrZXQgdG8gYSBuZXcgdmVyc2lvbiB3aXRoIG5ldyBzZXR0aW5ncy5cbiAgICAgKlxuICAgICAqIFNldHRpbmdzLCBiZXlvbmQgYHZlcnNpb25gLCBhcmUgYnVja2V0LXNwZWNpZmljLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCdWNrZXRTZXR0aW5nc30gc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKiBAbWVtYmVyT2YgQnVja2V0XG4gICAgICAqL1xuICAgIHVwZ3JhZGUoc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy52ZXJzaW9uID0gdGhpcy5fdmVyc2lvbiArIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5U2V0dGluZ3Moc2V0dGluZ3MpLnRoZW4oKCkgPT4gdGhpcy5lbWl0KCd1cGdyYWRlJywgdGhpcy5fdmVyc2lvbikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHNldHRpbmdzIHBhc3NlZCBmcm9tIGEgYGNvbnN0cnVjdG9yYCBvciBgdXBncmFkZWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0J1Y2tldFNldHRpbmdzfSBzZXR0aW5nc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqIEBtZW1iZXJPZiBCdWNrZXRcbiAgICAgKi9cbiAgICBfYXBwbHlTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLm5hbWVzcGFjZSkge1xuICAgICAgICAgICAgdGhpcy5fbmFtZXNwYWNlID0gc2V0dGluZ3MubmFtZXNwYWNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxufTtcbkJ1Y2tldCA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBCdWNrZXQpO1xuZXhwb3J0IHsgQnVja2V0IH07Il19