import Orbit from '../main';
import { assert } from '@orbit/utils';
import { settleInSeries, fulfillInSeries } from '@orbit/core';
import { Source } from '../source';
import { buildTransform } from '../transform';
export var PUSHABLE = '__pushable__';
/**
 * Has a source been decorated as `@pushable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
export function isPushable(source) {
    return !!source[PUSHABLE];
}
/**
 * Marks a source as "pushable" and adds an implementation of the `Pushable`
 * interface.
 *
 * The `push` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pushable source emits the following events:
 *
 * - `beforePush` - emitted prior to the processing of `push`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `push` - emitted after a `push` has successfully been applied, this event's
 * arguments include both the requested `Transform` and an array of the actual
 * applied `Transform` instances.
 *
 * - `pushFail` - emitted when an error has occurred pushing a transform, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * A pushable source must implement a private method `_push`, which performs
 * the processing required for `push` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
export default function pushable(Klass) {
    var proto = Klass.prototype;
    if (isPushable(proto)) {
        return;
    }
    assert('Pushable interface can only be applied to a Source', proto instanceof Source);
    proto[PUSHABLE] = true;
    proto.push = function (transformOrOperations, options, id) {
        var transform = buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve([]);
        }
        return this._enqueueRequest('push', transform);
    };
    proto.__push__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve([]);
        }
        return fulfillInSeries(this, 'beforePush', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return Orbit.Promise.resolve([]);
            } else {
                return _this._push(transform).then(function (result) {
                    return _this._transformed(result).then(function () {
                        return settleInSeries(_this, 'push', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return settleInSeries(_this, 'pushFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3B1c2hhYmxlLmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiYXNzZXJ0Iiwic2V0dGxlSW5TZXJpZXMiLCJmdWxmaWxsSW5TZXJpZXMiLCJTb3VyY2UiLCJidWlsZFRyYW5zZm9ybSIsIlBVU0hBQkxFIiwiaXNQdXNoYWJsZSIsInNvdXJjZSIsInB1c2hhYmxlIiwiS2xhc3MiLCJwcm90byIsInByb3RvdHlwZSIsInB1c2giLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJvcHRpb25zIiwiaWQiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2Zvcm1CdWlsZGVyIiwidHJhbnNmb3JtTG9nIiwiY29udGFpbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIl9lbnF1ZXVlUmVxdWVzdCIsIl9fcHVzaF9fIiwidGhlbiIsIl9wdXNoIiwiX3RyYW5zZm9ybWVkIiwicmVzdWx0IiwiY2F0Y2giLCJlcnJvciJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxNQUFrQixTQUFsQjtBQUNBLFNBQVNDLE1BQVQsUUFBdUIsY0FBdkI7QUFDQSxTQUFTQyxjQUFULEVBQXlCQyxlQUF6QixRQUFnRCxhQUFoRDtBQUNBLFNBQVNDLE1BQVQsUUFBdUIsV0FBdkI7QUFDQSxTQUFTQyxjQUFULFFBQStCLGNBQS9CO0FBQ0EsT0FBTyxJQUFNQyxXQUFXLGNBQWpCO0FBQ1A7Ozs7Ozs7QUFPQSxPQUFPLFNBQVNDLFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCO0FBQy9CLFdBQU8sQ0FBQyxDQUFDQSxPQUFPRixRQUFQLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxlQUFlLFNBQVNHLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCO0FBQ3BDLFFBQUlDLFFBQVFELE1BQU1FLFNBQWxCO0FBQ0EsUUFBSUwsV0FBV0ksS0FBWCxDQUFKLEVBQXVCO0FBQ25CO0FBQ0g7QUFDRFYsV0FBTyxvREFBUCxFQUE2RFUsaUJBQWlCUCxNQUE5RTtBQUNBTyxVQUFNTCxRQUFOLElBQWtCLElBQWxCO0FBQ0FLLFVBQU1FLElBQU4sR0FBYSxVQUFVQyxxQkFBVixFQUFpQ0MsT0FBakMsRUFBMENDLEVBQTFDLEVBQThDO0FBQ3ZELFlBQU1DLFlBQVlaLGVBQWVTLHFCQUFmLEVBQXNDQyxPQUF0QyxFQUErQ0MsRUFBL0MsRUFBbUQsS0FBS0UsZ0JBQXhELENBQWxCO0FBQ0EsWUFBSSxLQUFLQyxZQUFMLENBQWtCQyxRQUFsQixDQUEyQkgsVUFBVUQsRUFBckMsQ0FBSixFQUE4QztBQUMxQyxtQkFBT2hCLE1BQU1xQixPQUFOLENBQWNDLE9BQWQsQ0FBc0IsRUFBdEIsQ0FBUDtBQUNIO0FBQ0QsZUFBTyxLQUFLQyxlQUFMLENBQXFCLE1BQXJCLEVBQTZCTixTQUE3QixDQUFQO0FBQ0gsS0FORDtBQU9BTixVQUFNYSxRQUFOLEdBQWlCLFVBQVVQLFNBQVYsRUFBcUI7QUFBQTs7QUFDbEMsWUFBSSxLQUFLRSxZQUFMLENBQWtCQyxRQUFsQixDQUEyQkgsVUFBVUQsRUFBckMsQ0FBSixFQUE4QztBQUMxQyxtQkFBT2hCLE1BQU1xQixPQUFOLENBQWNDLE9BQWQsQ0FBc0IsRUFBdEIsQ0FBUDtBQUNIO0FBQ0QsZUFBT25CLGdCQUFnQixJQUFoQixFQUFzQixZQUF0QixFQUFvQ2MsU0FBcEMsRUFBK0NRLElBQS9DLENBQW9ELFlBQU07QUFDN0QsZ0JBQUksTUFBS04sWUFBTCxDQUFrQkMsUUFBbEIsQ0FBMkJILFVBQVVELEVBQXJDLENBQUosRUFBOEM7QUFDMUMsdUJBQU9oQixNQUFNcUIsT0FBTixDQUFjQyxPQUFkLENBQXNCLEVBQXRCLENBQVA7QUFDSCxhQUZELE1BRU87QUFDSCx1QkFBTyxNQUFLSSxLQUFMLENBQVdULFNBQVgsRUFBc0JRLElBQXRCLENBQTJCLGtCQUFVO0FBQ3hDLDJCQUFPLE1BQUtFLFlBQUwsQ0FBa0JDLE1BQWxCLEVBQTBCSCxJQUExQixDQUErQjtBQUFBLCtCQUFNdkIsZUFBZSxLQUFmLEVBQXFCLE1BQXJCLEVBQTZCZSxTQUE3QixFQUF3Q1csTUFBeEMsQ0FBTjtBQUFBLHFCQUEvQixFQUFzRkgsSUFBdEYsQ0FBMkY7QUFBQSwrQkFBTUcsTUFBTjtBQUFBLHFCQUEzRixDQUFQO0FBQ0gsaUJBRk0sQ0FBUDtBQUdIO0FBQ0osU0FSTSxFQVFKQyxLQVJJLENBUUUsaUJBQVM7QUFDZCxtQkFBTzNCLGVBQWUsS0FBZixFQUFxQixVQUFyQixFQUFpQ2UsU0FBakMsRUFBNENhLEtBQTVDLEVBQW1ETCxJQUFuRCxDQUF3RCxZQUFNO0FBQ2pFLHNCQUFNSyxLQUFOO0FBQ0gsYUFGTSxDQUFQO0FBR0gsU0FaTSxDQUFQO0FBYUgsS0FqQkQ7QUFrQkgiLCJmaWxlIjoic291cmNlLWludGVyZmFjZXMvcHVzaGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgc2V0dGxlSW5TZXJpZXMsIGZ1bGZpbGxJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gJy4uL3NvdXJjZSc7XG5pbXBvcnQgeyBidWlsZFRyYW5zZm9ybSB9IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5leHBvcnQgY29uc3QgUFVTSEFCTEUgPSAnX19wdXNoYWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAcHVzaGFibGVgP1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7U291cmNlfSBzb3VyY2VcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1B1c2hhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtQVVNIQUJMRV07XG59XG4vKipcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicHVzaGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFB1c2hhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgcHVzaGAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBlbWl0cyB0aGUgZm9sbG93aW5nIGV2ZW50czpcbiAqXG4gKiAtIGBiZWZvcmVQdXNoYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHB1c2hgLCB0aGlzIGV2ZW50XG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIC0gYHB1c2hgIC0gZW1pdHRlZCBhZnRlciBhIGBwdXNoYCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gYXBwbGllZCwgdGhpcyBldmVudCdzXG4gKiBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIGFuIGFycmF5IG9mIHRoZSBhY3R1YWxcbiAqIGFwcGxpZWQgYFRyYW5zZm9ybWAgaW5zdGFuY2VzLlxuICpcbiAqIC0gYHB1c2hGYWlsYCAtIGVtaXR0ZWQgd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgcHVzaGluZyBhIHRyYW5zZm9ybSwgdGhpc1xuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIHRoZSBlcnJvci5cbiAqXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfcHVzaGAsIHdoaWNoIHBlcmZvcm1zXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHB1c2hgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuXG4gKiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXG4gKlxuICogQGV4cG9ydFxuICogQGRlY29yYXRvclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwdXNoYWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNQdXNoYWJsZShwcm90bykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoJ1B1c2hhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xuICAgIHByb3RvW1BVU0hBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8ucHVzaCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnMsIGlkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQsIHRoaXMudHJhbnNmb3JtQnVpbGRlcik7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVJlcXVlc3QoJ3B1c2gnLCB0cmFuc2Zvcm0pO1xuICAgIH07XG4gICAgcHJvdG8uX19wdXNoX18gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVQdXNoJywgdHJhbnNmb3JtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wdXNoKHRyYW5zZm9ybSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWQocmVzdWx0KS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICdwdXNoJywgdHJhbnNmb3JtLCByZXN1bHQpKS50aGVuKCgpID0+IHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAncHVzaEZhaWwnLCB0cmFuc2Zvcm0sIGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSJdfQ==