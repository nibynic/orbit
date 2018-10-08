var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit, { Source, syncable, queryable, updatable, coalesceRecordOperations, buildTransform } from '@orbit/data';
import { assert } from '@orbit/utils';
import Cache from './cache';
var Store = Store_1 = function (_Source) {
    _inherits(Store, _Source);

    function Store() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Store);

        assert('Store\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        var keyMap = settings.keyMap;
        var schema = settings.schema;
        settings.name = settings.name || 'store';

        var _this = _possibleConstructorReturn(this, _Source.call(this, settings));

        _this._transforms = {};
        _this._transformInverses = {};
        _this.transformLog.on('clear', _this._logCleared, _this);
        _this.transformLog.on('truncate', _this._logTruncated, _this);
        _this.transformLog.on('rollback', _this._logRolledback, _this);
        var cacheSettings = settings.cacheSettings || {};
        cacheSettings.schema = schema;
        cacheSettings.keyMap = keyMap;
        cacheSettings.queryBuilder = cacheSettings.queryBuilder || _this.queryBuilder;
        cacheSettings.transformBuilder = cacheSettings.transformBuilder || _this.transformBuilder;
        if (settings.base) {
            _this._base = settings.base;
            _this._forkPoint = _this._base.transformLog.head;
            cacheSettings.base = _this._base.cache;
        }
        _this._cache = new Cache(cacheSettings);
        return _this;
    }

    Store.prototype.upgrade = function upgrade() {
        this._cache.upgrade();
        return Orbit.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._sync = function _sync(transform) {
        this._applyTransform(transform);
        return Orbit.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Updatable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._update = function _update(transform) {
        var results = this._applyTransform(transform);
        return Orbit.Promise.resolve(results.length === 1 ? results[0] : results);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Queryable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._query = function _query(query) {
        return Orbit.Promise.resolve(this._cache.query(query));
    };
    /////////////////////////////////////////////////////////////////////////////
    // Public methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Create a clone, or "fork", from a "base" store.
        The forked store will have the same `schema` and `keyMap` as its base store.
     The forked store's cache will start with the same immutable document as
     the base store. Its contents and log will evolve independently.
        @method fork
     @returns {Store} The forked store.
    */


    Store.prototype.fork = function fork() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        settings.schema = this._schema;
        settings.cacheSettings = settings.cacheSettings || {};
        settings.keyMap = this._keyMap;
        settings.queryBuilder = this.queryBuilder;
        settings.transformBuilder = this.transformBuilder;
        settings.base = this;
        return new Store_1(settings);
    };
    /**
     Merge transforms from a forked store back into a base store.
        By default, all of the operations from all of the transforms in the forked
     store's history will be reduced into a single transform. A subset of
     operations can be selected by specifying the `sinceTransformId` option.
        The `coalesce` option controls whether operations are coalesced into a
     minimal equivalent set before being reduced into a transform.
        @method merge
     @param {Store} forkedStore - The store to merge.
     @param {Object}  [options] settings
     @param {Boolean} [options.coalesce = true] Should operations be coalesced into a minimal equivalent set?
     @param {String}  [options.sinceTransformId = null] Select only transforms since the specified ID.
     @returns {Promise} The result of calling `update()` with the forked transforms.
    */


    Store.prototype.merge = function merge(forkedStore) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var transforms = void 0;
        if (options.sinceTransformId) {
            transforms = forkedStore.transformsSince(options.sinceTransformId);
        } else {
            transforms = forkedStore.allTransforms();
        }
        var reducedTransform = void 0;
        var ops = [];
        transforms.forEach(function (t) {
            Array.prototype.push.apply(ops, t.operations);
        });
        if (options.coalesce !== false) {
            ops = coalesceRecordOperations(ops);
        }
        reducedTransform = buildTransform(ops, options.transformOptions);
        return this.update(reducedTransform);
    };
    /**
     Rolls back the Store to a particular transformId
        @method rollback
     @param {string} transformId - The ID of the transform to roll back to
     @param {number} relativePosition - A positive or negative integer to specify a position relative to `transformId`
     @returns {undefined}
    */


    Store.prototype.rollback = function rollback(transformId) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        return this.transformLog.rollback(transformId, relativePosition);
    };
    /**
     Returns all transforms since a particular `transformId`.
        @method transformsSince
     @param {string} transformId - The ID of the transform to start with.
     @returns {Array} Array of transforms.
    */


    Store.prototype.transformsSince = function transformsSince(transformId) {
        var _this2 = this;

        return this.transformLog.after(transformId).map(function (id) {
            return _this2._transforms[id];
        });
    };
    /**
     Returns all tracked transforms.
        @method allTransforms
     @returns {Array} Array of transforms.
    */


    Store.prototype.allTransforms = function allTransforms() {
        var _this3 = this;

        return this.transformLog.entries.map(function (id) {
            return _this3._transforms[id];
        });
    };

    Store.prototype.getTransform = function getTransform(transformId) {
        return this._transforms[transformId];
    };

    Store.prototype.getInverseOperations = function getInverseOperations(transformId) {
        return this._transformInverses[transformId];
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._applyTransform = function _applyTransform(transform) {
        var result = this.cache.patch(transform.operations);
        this._transforms[transform.id] = transform;
        this._transformInverses[transform.id] = result.inverse;
        return result.data;
    };

    Store.prototype._clearTransformFromHistory = function _clearTransformFromHistory(transformId) {
        delete this._transforms[transformId];
        delete this._transformInverses[transformId];
    };

    Store.prototype._logCleared = function _logCleared() {
        this._transforms = {};
        this._transformInverses = {};
    };

    Store.prototype._logTruncated = function _logTruncated(transformId, relativePosition, removed) {
        var _this4 = this;

        removed.forEach(function (id) {
            return _this4._clearTransformFromHistory(id);
        });
    };

    Store.prototype._logRolledback = function _logRolledback(transformId, relativePosition, removed) {
        var _this5 = this;

        removed.reverse().forEach(function (id) {
            var inverseOperations = _this5._transformInverses[id];
            if (inverseOperations) {
                _this5.cache.patch(inverseOperations);
            }
            _this5._clearTransformFromHistory(id);
        });
    };

    _createClass(Store, [{
        key: "cache",
        get: function () {
            return this._cache;
        }
    }, {
        key: "base",
        get: function () {
            return this._base;
        }
    }, {
        key: "forkPoint",
        get: function () {
            return this._forkPoint;
        }
    }]);

    return Store;
}(Source);
Store = Store_1 = __decorate([syncable, queryable, updatable], Store);
export default Store;
var Store_1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIk9yYml0IiwiU291cmNlIiwic3luY2FibGUiLCJxdWVyeWFibGUiLCJ1cGRhdGFibGUiLCJjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMiLCJidWlsZFRyYW5zZm9ybSIsImFzc2VydCIsIkNhY2hlIiwiU3RvcmUiLCJTdG9yZV8xIiwic2V0dGluZ3MiLCJzY2hlbWEiLCJrZXlNYXAiLCJuYW1lIiwiX3RyYW5zZm9ybXMiLCJfdHJhbnNmb3JtSW52ZXJzZXMiLCJ0cmFuc2Zvcm1Mb2ciLCJvbiIsIl9sb2dDbGVhcmVkIiwiX2xvZ1RydW5jYXRlZCIsIl9sb2dSb2xsZWRiYWNrIiwiY2FjaGVTZXR0aW5ncyIsInF1ZXJ5QnVpbGRlciIsInRyYW5zZm9ybUJ1aWxkZXIiLCJiYXNlIiwiX2Jhc2UiLCJfZm9ya1BvaW50IiwiaGVhZCIsImNhY2hlIiwiX2NhY2hlIiwidXBncmFkZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiX3N5bmMiLCJ0cmFuc2Zvcm0iLCJfYXBwbHlUcmFuc2Zvcm0iLCJfdXBkYXRlIiwicmVzdWx0cyIsIl9xdWVyeSIsInF1ZXJ5IiwiZm9yayIsIl9zY2hlbWEiLCJfa2V5TWFwIiwibWVyZ2UiLCJmb3JrZWRTdG9yZSIsIm9wdGlvbnMiLCJ0cmFuc2Zvcm1zIiwic2luY2VUcmFuc2Zvcm1JZCIsInRyYW5zZm9ybXNTaW5jZSIsImFsbFRyYW5zZm9ybXMiLCJyZWR1Y2VkVHJhbnNmb3JtIiwib3BzIiwiZm9yRWFjaCIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5IiwidCIsIm9wZXJhdGlvbnMiLCJjb2FsZXNjZSIsInRyYW5zZm9ybU9wdGlvbnMiLCJ1cGRhdGUiLCJyb2xsYmFjayIsInRyYW5zZm9ybUlkIiwicmVsYXRpdmVQb3NpdGlvbiIsImFmdGVyIiwibWFwIiwiaWQiLCJlbnRyaWVzIiwiZ2V0VHJhbnNmb3JtIiwiZ2V0SW52ZXJzZU9wZXJhdGlvbnMiLCJyZXN1bHQiLCJwYXRjaCIsImludmVyc2UiLCJkYXRhIiwiX2NsZWFyVHJhbnNmb3JtRnJvbUhpc3RvcnkiLCJyZW1vdmVkIiwicmV2ZXJzZSIsImludmVyc2VPcGVyYXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFVQyxNQUFsQjtBQUFBLFFBQ0lDLElBQUlILElBQUksQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxTQUFTLElBQVQsR0FBZ0JBLE9BQU9LLE9BQU9DLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBRC9GO0FBQUEsUUFFSU8sQ0FGSjtBQUdBLFFBQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxRQUFRQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxJQUFJSSxRQUFRQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQW9JLEtBQUssSUFBSVUsSUFBSWIsV0FBV00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sS0FBSyxDQUF6QyxFQUE0Q0EsR0FBNUM7QUFBaUQsWUFBSUgsSUFBSVYsV0FBV2EsQ0FBWCxDQUFSLEVBQXVCTixJQUFJLENBQUNILElBQUksQ0FBSixHQUFRTSxFQUFFSCxDQUFGLENBQVIsR0FBZUgsSUFBSSxDQUFKLEdBQVFNLEVBQUVULE1BQUYsRUFBVUMsR0FBVixFQUFlSyxD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QkFBS0gsMEJBQUwsQ0FBZ0NSLEVBQWhDO0FBQ0gsU0FORDtBQU9ILEtBMUtPOztBQUFBO0FBQUE7QUFBQSx5QkF3Qkk7QUFDUixtQkFBTyxLQUFLdEMsTUFBWjtBQUNIO0FBMUJPO0FBQUE7QUFBQSx5QkEyQkc7QUFDUCxtQkFBTyxLQUFLSixLQUFaO0FBQ0g7QUE3Qk87QUFBQTtBQUFBLHlCQThCUTtBQUNaLG1CQUFPLEtBQUtDLFVBQVo7QUFDSDtBQWhDTzs7QUFBQTtBQUFBLEVBQThCMUIsTUFBOUIsQ0FBWjtBQTRLQVEsUUFBUUMsVUFBVTFCLFdBQVcsQ0FBQ2tCLFFBQUQsRUFBV0MsU0FBWCxFQUFzQkMsU0FBdEIsQ0FBWCxFQUE2Q0ssS0FBN0MsQ0FBbEI7QUFDQSxlQUFlQSxLQUFmO0FBQ0EsSUFBSUMsT0FBSiIsImZpbGUiOiJzdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQsIHsgU291cmNlLCBzeW5jYWJsZSwgcXVlcnlhYmxlLCB1cGRhdGFibGUsIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IENhY2hlIGZyb20gJy4vY2FjaGUnO1xubGV0IFN0b3JlID0gU3RvcmVfMSA9IGNsYXNzIFN0b3JlIGV4dGVuZHMgU291cmNlIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnU3RvcmVcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xuICAgICAgICBsZXQga2V5TWFwID0gc2V0dGluZ3Mua2V5TWFwO1xuICAgICAgICBsZXQgc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xuICAgICAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnc3RvcmUnO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybXMgPSB7fTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXMgPSB7fTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1Mb2cub24oJ2NsZWFyJywgdGhpcy5fbG9nQ2xlYXJlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCd0cnVuY2F0ZScsIHRoaXMuX2xvZ1RydW5jYXRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtTG9nLm9uKCdyb2xsYmFjaycsIHRoaXMuX2xvZ1JvbGxlZGJhY2ssIHRoaXMpO1xuICAgICAgICBsZXQgY2FjaGVTZXR0aW5ncyA9IHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgfHwge307XG4gICAgICAgIGNhY2hlU2V0dGluZ3Muc2NoZW1hID0gc2NoZW1hO1xuICAgICAgICBjYWNoZVNldHRpbmdzLmtleU1hcCA9IGtleU1hcDtcbiAgICAgICAgY2FjaGVTZXR0aW5ncy5xdWVyeUJ1aWxkZXIgPSBjYWNoZVNldHRpbmdzLnF1ZXJ5QnVpbGRlciB8fCB0aGlzLnF1ZXJ5QnVpbGRlcjtcbiAgICAgICAgY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyID0gY2FjaGVTZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyIHx8IHRoaXMudHJhbnNmb3JtQnVpbGRlcjtcbiAgICAgICAgaWYgKHNldHRpbmdzLmJhc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2Jhc2UgPSBzZXR0aW5ncy5iYXNlO1xuICAgICAgICAgICAgdGhpcy5fZm9ya1BvaW50ID0gdGhpcy5fYmFzZS50cmFuc2Zvcm1Mb2cuaGVhZDtcbiAgICAgICAgICAgIGNhY2hlU2V0dGluZ3MuYmFzZSA9IHRoaXMuX2Jhc2UuY2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGUgPSBuZXcgQ2FjaGUoY2FjaGVTZXR0aW5ncyk7XG4gICAgfVxuICAgIGdldCBjYWNoZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xuICAgIH1cbiAgICBnZXQgYmFzZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2U7XG4gICAgfVxuICAgIGdldCBmb3JrUG9pbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JrUG9pbnQ7XG4gICAgfVxuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlLnVwZ3JhZGUoKTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3N5bmModHJhbnNmb3JtKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBVcGRhdGFibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfdXBkYXRlKHRyYW5zZm9ybSkge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzdWx0cy5sZW5ndGggPT09IDEgPyByZXN1bHRzWzBdIDogcmVzdWx0cyk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUXVlcnlhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3F1ZXJ5KHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUodGhpcy5fY2FjaGUucXVlcnkocXVlcnkpKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQdWJsaWMgbWV0aG9kc1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLyoqXG4gICAgIENyZWF0ZSBhIGNsb25lLCBvciBcImZvcmtcIiwgZnJvbSBhIFwiYmFzZVwiIHN0b3JlLlxuICAgICAgICBUaGUgZm9ya2VkIHN0b3JlIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc2NoZW1hYCBhbmQgYGtleU1hcGAgYXMgaXRzIGJhc2Ugc3RvcmUuXG4gICAgIFRoZSBmb3JrZWQgc3RvcmUncyBjYWNoZSB3aWxsIHN0YXJ0IHdpdGggdGhlIHNhbWUgaW1tdXRhYmxlIGRvY3VtZW50IGFzXG4gICAgIHRoZSBiYXNlIHN0b3JlLiBJdHMgY29udGVudHMgYW5kIGxvZyB3aWxsIGV2b2x2ZSBpbmRlcGVuZGVudGx5LlxuICAgICAgICBAbWV0aG9kIGZvcmtcbiAgICAgQHJldHVybnMge1N0b3JlfSBUaGUgZm9ya2VkIHN0b3JlLlxuICAgICovXG4gICAgZm9yayhzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHNldHRpbmdzLnNjaGVtYSA9IHRoaXMuX3NjaGVtYTtcbiAgICAgICAgc2V0dGluZ3MuY2FjaGVTZXR0aW5ncyA9IHNldHRpbmdzLmNhY2hlU2V0dGluZ3MgfHwge307XG4gICAgICAgIHNldHRpbmdzLmtleU1hcCA9IHRoaXMuX2tleU1hcDtcbiAgICAgICAgc2V0dGluZ3MucXVlcnlCdWlsZGVyID0gdGhpcy5xdWVyeUJ1aWxkZXI7XG4gICAgICAgIHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgPSB0aGlzLnRyYW5zZm9ybUJ1aWxkZXI7XG4gICAgICAgIHNldHRpbmdzLmJhc2UgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFN0b3JlXzEoc2V0dGluZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgTWVyZ2UgdHJhbnNmb3JtcyBmcm9tIGEgZm9ya2VkIHN0b3JlIGJhY2sgaW50byBhIGJhc2Ugc3RvcmUuXG4gICAgICAgIEJ5IGRlZmF1bHQsIGFsbCBvZiB0aGUgb3BlcmF0aW9ucyBmcm9tIGFsbCBvZiB0aGUgdHJhbnNmb3JtcyBpbiB0aGUgZm9ya2VkXG4gICAgIHN0b3JlJ3MgaGlzdG9yeSB3aWxsIGJlIHJlZHVjZWQgaW50byBhIHNpbmdsZSB0cmFuc2Zvcm0uIEEgc3Vic2V0IG9mXG4gICAgIG9wZXJhdGlvbnMgY2FuIGJlIHNlbGVjdGVkIGJ5IHNwZWNpZnlpbmcgdGhlIGBzaW5jZVRyYW5zZm9ybUlkYCBvcHRpb24uXG4gICAgICAgIFRoZSBgY29hbGVzY2VgIG9wdGlvbiBjb250cm9scyB3aGV0aGVyIG9wZXJhdGlvbnMgYXJlIGNvYWxlc2NlZCBpbnRvIGFcbiAgICAgbWluaW1hbCBlcXVpdmFsZW50IHNldCBiZWZvcmUgYmVpbmcgcmVkdWNlZCBpbnRvIGEgdHJhbnNmb3JtLlxuICAgICAgICBAbWV0aG9kIG1lcmdlXG4gICAgIEBwYXJhbSB7U3RvcmV9IGZvcmtlZFN0b3JlIC0gVGhlIHN0b3JlIHRvIG1lcmdlLlxuICAgICBAcGFyYW0ge09iamVjdH0gIFtvcHRpb25zXSBzZXR0aW5nc1xuICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvYWxlc2NlID0gdHJ1ZV0gU2hvdWxkIG9wZXJhdGlvbnMgYmUgY29hbGVzY2VkIGludG8gYSBtaW5pbWFsIGVxdWl2YWxlbnQgc2V0P1xuICAgICBAcGFyYW0ge1N0cmluZ30gIFtvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQgPSBudWxsXSBTZWxlY3Qgb25seSB0cmFuc2Zvcm1zIHNpbmNlIHRoZSBzcGVjaWZpZWQgSUQuXG4gICAgIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcmVzdWx0IG9mIGNhbGxpbmcgYHVwZGF0ZSgpYCB3aXRoIHRoZSBmb3JrZWQgdHJhbnNmb3Jtcy5cbiAgICAqL1xuICAgIG1lcmdlKGZvcmtlZFN0b3JlLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IHRyYW5zZm9ybXM7XG4gICAgICAgIGlmIChvcHRpb25zLnNpbmNlVHJhbnNmb3JtSWQpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS50cmFuc2Zvcm1zU2luY2Uob3B0aW9ucy5zaW5jZVRyYW5zZm9ybUlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybXMgPSBmb3JrZWRTdG9yZS5hbGxUcmFuc2Zvcm1zKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlZHVjZWRUcmFuc2Zvcm07XG4gICAgICAgIGxldCBvcHMgPSBbXTtcbiAgICAgICAgdHJhbnNmb3Jtcy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0Lm9wZXJhdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29hbGVzY2UgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvcHMgPSBjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMob3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZWR1Y2VkVHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0ob3BzLCBvcHRpb25zLnRyYW5zZm9ybU9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGUocmVkdWNlZFRyYW5zZm9ybSk7XG4gICAgfVxuICAgIC8qKlxuICAgICBSb2xscyBiYWNrIHRoZSBTdG9yZSB0byBhIHBhcnRpY3VsYXIgdHJhbnNmb3JtSWRcbiAgICAgICAgQG1ldGhvZCByb2xsYmFja1xuICAgICBAcGFyYW0ge3N0cmluZ30gdHJhbnNmb3JtSWQgLSBUaGUgSUQgb2YgdGhlIHRyYW5zZm9ybSB0byByb2xsIGJhY2sgdG9cbiAgICAgQHBhcmFtIHtudW1iZXJ9IHJlbGF0aXZlUG9zaXRpb24gLSBBIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGludGVnZXIgdG8gc3BlY2lmeSBhIHBvc2l0aW9uIHJlbGF0aXZlIHRvIGB0cmFuc2Zvcm1JZGBcbiAgICAgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAqL1xuICAgIHJvbGxiYWNrKHRyYW5zZm9ybUlkLCByZWxhdGl2ZVBvc2l0aW9uID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Mb2cucm9sbGJhY2sodHJhbnNmb3JtSWQsIHJlbGF0aXZlUG9zaXRpb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgUmV0dXJucyBhbGwgdHJhbnNmb3JtcyBzaW5jZSBhIHBhcnRpY3VsYXIgYHRyYW5zZm9ybUlkYC5cbiAgICAgICAgQG1ldGhvZCB0cmFuc2Zvcm1zU2luY2VcbiAgICAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybUlkIC0gVGhlIElEIG9mIHRoZSB0cmFuc2Zvcm0gdG8gc3RhcnQgd2l0aC5cbiAgICAgQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0cmFuc2Zvcm1zLlxuICAgICovXG4gICAgdHJhbnNmb3Jtc1NpbmNlKHRyYW5zZm9ybUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5hZnRlcih0cmFuc2Zvcm1JZCkubWFwKGlkID0+IHRoaXMuX3RyYW5zZm9ybXNbaWRdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgIFJldHVybnMgYWxsIHRyYWNrZWQgdHJhbnNmb3Jtcy5cbiAgICAgICAgQG1ldGhvZCBhbGxUcmFuc2Zvcm1zXG4gICAgIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdHJhbnNmb3Jtcy5cbiAgICAqL1xuICAgIGFsbFRyYW5zZm9ybXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUxvZy5lbnRyaWVzLm1hcChpZCA9PiB0aGlzLl90cmFuc2Zvcm1zW2lkXSk7XG4gICAgfVxuICAgIGdldFRyYW5zZm9ybSh0cmFuc2Zvcm1JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3Jtc1t0cmFuc2Zvcm1JZF07XG4gICAgfVxuICAgIGdldEludmVyc2VPcGVyYXRpb25zKHRyYW5zZm9ybUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1JbnZlcnNlc1t0cmFuc2Zvcm1JZF07XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jYWNoZS5wYXRjaCh0cmFuc2Zvcm0ub3BlcmF0aW9ucyk7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybXNbdHJhbnNmb3JtLmlkXSA9IHRyYW5zZm9ybTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbdHJhbnNmb3JtLmlkXSA9IHJlc3VsdC5pbnZlcnNlO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmRhdGE7XG4gICAgfVxuICAgIF9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KHRyYW5zZm9ybUlkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90cmFuc2Zvcm1zW3RyYW5zZm9ybUlkXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zZm9ybUludmVyc2VzW3RyYW5zZm9ybUlkXTtcbiAgICB9XG4gICAgX2xvZ0NsZWFyZWQoKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybXMgPSB7fTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXMgPSB7fTtcbiAgICB9XG4gICAgX2xvZ1RydW5jYXRlZCh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbiwgcmVtb3ZlZCkge1xuICAgICAgICByZW1vdmVkLmZvckVhY2goaWQgPT4gdGhpcy5fY2xlYXJUcmFuc2Zvcm1Gcm9tSGlzdG9yeShpZCkpO1xuICAgIH1cbiAgICBfbG9nUm9sbGVkYmFjayh0cmFuc2Zvcm1JZCwgcmVsYXRpdmVQb3NpdGlvbiwgcmVtb3ZlZCkge1xuICAgICAgICByZW1vdmVkLnJldmVyc2UoKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGludmVyc2VPcGVyYXRpb25zID0gdGhpcy5fdHJhbnNmb3JtSW52ZXJzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGludmVyc2VPcGVyYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wYXRjaChpbnZlcnNlT3BlcmF0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jbGVhclRyYW5zZm9ybUZyb21IaXN0b3J5KGlkKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblN0b3JlID0gU3RvcmVfMSA9IF9fZGVjb3JhdGUoW3N5bmNhYmxlLCBxdWVyeWFibGUsIHVwZGF0YWJsZV0sIFN0b3JlKTtcbmV4cG9ydCBkZWZhdWx0IFN0b3JlO1xudmFyIFN0b3JlXzE7Il19