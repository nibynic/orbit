import Orbit from '../main';
import { assert } from '@orbit/utils';
import { settleInSeries, fulfillInSeries } from '@orbit/core';
import { Source } from '../source';
import { buildTransform } from '../transform';
export var UPDATABLE = '__updatable__';
/**
 * Has a source been decorated as `@updatable`?
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function isUpdatable(source) {
    return !!source[UPDATABLE];
}
/**
 * Marks a source as "updatable" and adds an implementation of the `Updatable`
 * interface.
 *
 * The `update` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * An updatable source emits the following events:
 *
 * - `beforeUpdate` - emitted prior to the processing of `update`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `update` - emitted after an `update` has successfully been applied, this
 * event includes the requested `Transform` as an argument.
 *
 * - `updateFail` - emitted when an error has occurred applying an update, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * An updatable source must implement a private method `_update`, which performs
 * the processing required for `update` and returns a promise that resolves when
 * complete.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
export default function updatable(Klass) {
    var proto = Klass.prototype;
    if (isUpdatable(proto)) {
        return;
    }
    assert('Updatable interface can only be applied to a Source', proto instanceof Source);
    proto[UPDATABLE] = true;
    proto.update = function (transformOrOperations, options, id) {
        var transform = buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve();
        }
        return this._enqueueRequest('update', transform);
    };
    proto.__update__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve();
        }
        return fulfillInSeries(this, 'beforeUpdate', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return Orbit.Promise.resolve();
            } else {
                return _this._update(transform).then(function (result) {
                    return _this._transformed([transform]).then(function () {
                        return settleInSeries(_this, 'update', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return settleInSeries(_this, 'updateFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3VwZGF0YWJsZS5qcyJdLCJuYW1lcyI6WyJPcmJpdCIsImFzc2VydCIsInNldHRsZUluU2VyaWVzIiwiZnVsZmlsbEluU2VyaWVzIiwiU291cmNlIiwiYnVpbGRUcmFuc2Zvcm0iLCJVUERBVEFCTEUiLCJpc1VwZGF0YWJsZSIsInNvdXJjZSIsInVwZGF0YWJsZSIsIktsYXNzIiwicHJvdG8iLCJwcm90b3R5cGUiLCJ1cGRhdGUiLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJvcHRpb25zIiwiaWQiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2Zvcm1CdWlsZGVyIiwidHJhbnNmb3JtTG9nIiwiY29udGFpbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIl9lbnF1ZXVlUmVxdWVzdCIsIl9fdXBkYXRlX18iLCJ0aGVuIiwiX3VwZGF0ZSIsIl90cmFuc2Zvcm1lZCIsInJlc3VsdCIsImNhdGNoIiwiZXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLEtBQVAsTUFBa0IsU0FBbEI7QUFDQSxTQUFTQyxNQUFULFFBQXVCLGNBQXZCO0FBQ0EsU0FBU0MsY0FBVCxFQUF5QkMsZUFBekIsUUFBZ0QsYUFBaEQ7QUFDQSxTQUFTQyxNQUFULFFBQXVCLFdBQXZCO0FBQ0EsU0FBU0MsY0FBVCxRQUErQixjQUEvQjtBQUNBLE9BQU8sSUFBTUMsWUFBWSxlQUFsQjtBQUNQOzs7Ozs7O0FBT0EsT0FBTyxTQUFTQyxXQUFULENBQXFCQyxNQUFyQixFQUE2QjtBQUNoQyxXQUFPLENBQUMsQ0FBQ0EsT0FBT0YsU0FBUCxDQUFUO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxlQUFlLFNBQVNHLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQ3JDLFFBQUlDLFFBQVFELE1BQU1FLFNBQWxCO0FBQ0EsUUFBSUwsWUFBWUksS0FBWixDQUFKLEVBQXdCO0FBQ3BCO0FBQ0g7QUFDRFYsV0FBTyxxREFBUCxFQUE4RFUsaUJBQWlCUCxNQUEvRTtBQUNBTyxVQUFNTCxTQUFOLElBQW1CLElBQW5CO0FBQ0FLLFVBQU1FLE1BQU4sR0FBZSxVQUFVQyxxQkFBVixFQUFpQ0MsT0FBakMsRUFBMENDLEVBQTFDLEVBQThDO0FBQ3pELFlBQU1DLFlBQVlaLGVBQWVTLHFCQUFmLEVBQXNDQyxPQUF0QyxFQUErQ0MsRUFBL0MsRUFBbUQsS0FBS0UsZ0JBQXhELENBQWxCO0FBQ0EsWUFBSSxLQUFLQyxZQUFMLENBQWtCQyxRQUFsQixDQUEyQkgsVUFBVUQsRUFBckMsQ0FBSixFQUE4QztBQUMxQyxtQkFBT2hCLE1BQU1xQixPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNIO0FBQ0QsZUFBTyxLQUFLQyxlQUFMLENBQXFCLFFBQXJCLEVBQStCTixTQUEvQixDQUFQO0FBQ0gsS0FORDtBQU9BTixVQUFNYSxVQUFOLEdBQW1CLFVBQVVQLFNBQVYsRUFBcUI7QUFBQTs7QUFDcEMsWUFBSSxLQUFLRSxZQUFMLENBQWtCQyxRQUFsQixDQUEyQkgsVUFBVUQsRUFBckMsQ0FBSixFQUE4QztBQUMxQyxtQkFBT2hCLE1BQU1xQixPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNIO0FBQ0QsZUFBT25CLGdCQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQ2MsU0FBdEMsRUFBaURRLElBQWpELENBQXNELFlBQU07QUFDL0QsZ0JBQUksTUFBS04sWUFBTCxDQUFrQkMsUUFBbEIsQ0FBMkJILFVBQVVELEVBQXJDLENBQUosRUFBOEM7QUFDMUMsdUJBQU9oQixNQUFNcUIsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSCxhQUZELE1BRU87QUFDSCx1QkFBTyxNQUFLSSxPQUFMLENBQWFULFNBQWIsRUFBd0JRLElBQXhCLENBQTZCLGtCQUFVO0FBQzFDLDJCQUFPLE1BQUtFLFlBQUwsQ0FBa0IsQ0FBQ1YsU0FBRCxDQUFsQixFQUErQlEsSUFBL0IsQ0FBb0M7QUFBQSwrQkFBTXZCLGVBQWUsS0FBZixFQUFxQixRQUFyQixFQUErQmUsU0FBL0IsRUFBMENXLE1BQTFDLENBQU47QUFBQSxxQkFBcEMsRUFBNkZILElBQTdGLENBQWtHO0FBQUEsK0JBQU1HLE1BQU47QUFBQSxxQkFBbEcsQ0FBUDtBQUNILGlCQUZNLENBQVA7QUFHSDtBQUNKLFNBUk0sRUFRSkMsS0FSSSxDQVFFLGlCQUFTO0FBQ2QsbUJBQU8zQixlQUFlLEtBQWYsRUFBcUIsWUFBckIsRUFBbUNlLFNBQW5DLEVBQThDYSxLQUE5QyxFQUFxREwsSUFBckQsQ0FBMEQsWUFBTTtBQUNuRSxzQkFBTUssS0FBTjtBQUNILGFBRk0sQ0FBUDtBQUdILFNBWk0sQ0FBUDtBQWFILEtBakJEO0FBa0JIIiwiZmlsZSI6InNvdXJjZS1pbnRlcmZhY2VzL3VwZGF0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBzZXR0bGVJblNlcmllcywgZnVsZmlsbEluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi4vc291cmNlJztcbmltcG9ydCB7IGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmV4cG9ydCBjb25zdCBVUERBVEFCTEUgPSAnX191cGRhdGFibGVfXyc7XG4vKipcbiAqIEhhcyBhIHNvdXJjZSBiZWVuIGRlY29yYXRlZCBhcyBgQHVwZGF0YWJsZWA/XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VwZGF0YWJsZShzb3VyY2UpIHtcbiAgICByZXR1cm4gISFzb3VyY2VbVVBEQVRBQkxFXTtcbn1cbi8qKlxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJ1cGRhdGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFVwZGF0YWJsZWBcbiAqIGludGVyZmFjZS5cbiAqXG4gKiBUaGUgYHVwZGF0ZWAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBBbiB1cGRhdGFibGUgc291cmNlIGVtaXRzIHRoZSBmb2xsb3dpbmcgZXZlbnRzOlxuICpcbiAqIC0gYGJlZm9yZVVwZGF0ZWAgLSBlbWl0dGVkIHByaW9yIHRvIHRoZSBwcm9jZXNzaW5nIG9mIGB1cGRhdGVgLCB0aGlzIGV2ZW50XG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIC0gYHVwZGF0ZWAgLSBlbWl0dGVkIGFmdGVyIGFuIGB1cGRhdGVgIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiBhcHBsaWVkLCB0aGlzXG4gKiBldmVudCBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIC0gYHVwZGF0ZUZhaWxgIC0gZW1pdHRlZCB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCBhcHBseWluZyBhbiB1cGRhdGUsIHRoaXNcbiAqIGV2ZW50J3MgYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFuZCB0aGUgZXJyb3IuXG4gKlxuICogQW4gdXBkYXRhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfdXBkYXRlYCwgd2hpY2ggcGVyZm9ybXNcbiAqIHRoZSBwcm9jZXNzaW5nIHJlcXVpcmVkIGZvciBgdXBkYXRlYCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuXG4gKiBjb21wbGV0ZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAZGVjb3JhdG9yXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVwZGF0YWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNVcGRhdGFibGUocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KCdVcGRhdGFibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XG4gICAgcHJvdG9bVVBEQVRBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zLCBpZCwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyKTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVJlcXVlc3QoJ3VwZGF0ZScsIHRyYW5zZm9ybSk7XG4gICAgfTtcbiAgICBwcm90by5fX3VwZGF0ZV9fID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdWxmaWxsSW5TZXJpZXModGhpcywgJ2JlZm9yZVVwZGF0ZScsIHRyYW5zZm9ybSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZSh0cmFuc2Zvcm0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybWVkKFt0cmFuc2Zvcm1dKS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd1cGRhdGUnLCB0cmFuc2Zvcm0sIHJlc3VsdCkpLnRoZW4oKCkgPT4gcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICd1cGRhdGVGYWlsJywgdHJhbnNmb3JtLCBlcnJvcikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iXX0=