'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PUSHABLE = undefined;
exports.isPushable = isPushable;
exports.default = pushable;

var _main = require('../main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('@orbit/utils');

var _core = require('@orbit/core');

var _source = require('../source');

var _transform = require('../transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PUSHABLE = exports.PUSHABLE = '__pushable__';
/**
 * Has a source been decorated as `@pushable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPushable(source) {
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
function pushable(Klass) {
    var proto = Klass.prototype;
    if (isPushable(proto)) {
        return;
    }
    (0, _utils.assert)('Pushable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[PUSHABLE] = true;
    proto.push = function (transformOrOperations, options, id) {
        var transform = (0, _transform.buildTransform)(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve([]);
        }
        return this._enqueueRequest('push', transform);
    };
    proto.__push__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve([]);
        }
        return (0, _core.fulfillInSeries)(this, 'beforePush', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve([]);
            } else {
                return _this._push(transform).then(function (result) {
                    return _this._transformed(result).then(function () {
                        return (0, _core.settleInSeries)(_this, 'push', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return (0, _core.settleInSeries)(_this, 'pushFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3B1c2hhYmxlLmpzIl0sIm5hbWVzIjpbIlBVU0hBQkxFIiwic291cmNlIiwicHJvdG8iLCJLbGFzcyIsImlzUHVzaGFibGUiLCJhc3NlcnQiLCJ0cmFuc2Zvcm0iLCJidWlsZFRyYW5zZm9ybSIsIk9yYml0Iiwic2V0dGxlSW5TZXJpZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztRQWFPLFUsR0FBQSxVO2tCQWdDUSxROzs7Ozs7QUE1Q2Y7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDTyxJQUFNQSw4QkFBTixjQUFBO0FBQ1A7Ozs7Ozs7QUFPTyxTQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQTRCO0FBQy9CLFdBQU8sQ0FBQyxDQUFDQyxPQUFULFFBQVNBLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCZSxTQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQXlCO0FBQ3BDLFFBQUlDLFFBQVFDLE1BQVosU0FBQTtBQUNBLFFBQUlDLFdBQUosS0FBSUEsQ0FBSixFQUF1QjtBQUNuQjtBQUNIO0FBQ0RDLHVCQUFBQSxvREFBQUEsRUFBNkRILGlCQUE3REcsY0FBQUE7QUFDQUgsVUFBQUEsUUFBQUEsSUFBQUEsSUFBQUE7QUFDQUEsVUFBQUEsSUFBQUEsR0FBYSxVQUFBLHFCQUFBLEVBQUEsT0FBQSxFQUFBLEVBQUEsRUFBOEM7QUFDdkQsWUFBTUksWUFBWUMsK0JBQUFBLHFCQUFBQSxFQUFBQSxPQUFBQSxFQUFBQSxFQUFBQSxFQUFtRCxLQUFyRSxnQkFBa0JBLENBQWxCO0FBQ0EsWUFBSSxLQUFBLFlBQUEsQ0FBQSxRQUFBLENBQTJCRCxVQUEvQixFQUFJLENBQUosRUFBOEM7QUFDMUMsbUJBQU9FLGVBQUFBLE9BQUFBLENBQUFBLE9BQUFBLENBQVAsRUFBT0EsQ0FBUDtBQUNIO0FBQ0QsZUFBTyxLQUFBLGVBQUEsQ0FBQSxNQUFBLEVBQVAsU0FBTyxDQUFQO0FBTEpOLEtBQUFBO0FBT0FBLFVBQUFBLFFBQUFBLEdBQWlCLFVBQUEsU0FBQSxFQUFxQjtBQUFBLFlBQUEsUUFBQSxJQUFBOztBQUNsQyxZQUFJLEtBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBMkJJLFVBQS9CLEVBQUksQ0FBSixFQUE4QztBQUMxQyxtQkFBT0UsZUFBQUEsT0FBQUEsQ0FBQUEsT0FBQUEsQ0FBUCxFQUFPQSxDQUFQO0FBQ0g7QUFDRCxlQUFPLDJCQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsQ0FBb0QsWUFBTTtBQUM3RCxnQkFBSSxNQUFBLFlBQUEsQ0FBQSxRQUFBLENBQTJCRixVQUEvQixFQUFJLENBQUosRUFBOEM7QUFDMUMsdUJBQU9FLGVBQUFBLE9BQUFBLENBQUFBLE9BQUFBLENBQVAsRUFBT0EsQ0FBUDtBQURKLGFBQUEsTUFFTztBQUNILHVCQUFPLE1BQUEsS0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQTJCLFVBQUEsTUFBQSxFQUFVO0FBQ3hDLDJCQUFPLE1BQUEsWUFBQSxDQUFBLE1BQUEsRUFBQSxJQUFBLENBQStCLFlBQUE7QUFBQSwrQkFBTUMsMEJBQUFBLEtBQUFBLEVBQUFBLE1BQUFBLEVBQUFBLFNBQUFBLEVBQU4sTUFBTUEsQ0FBTjtBQUEvQixxQkFBQSxFQUFBLElBQUEsQ0FBMkYsWUFBQTtBQUFBLCtCQUFBLE1BQUE7QUFBbEcscUJBQU8sQ0FBUDtBQURKLGlCQUFPLENBQVA7QUFHSDtBQVBFLFNBQUEsRUFBQSxLQUFBLENBUUUsVUFBQSxLQUFBLEVBQVM7QUFDZCxtQkFBTywwQkFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUF3RCxZQUFNO0FBQ2pFLHNCQUFBLEtBQUE7QUFESixhQUFPLENBQVA7QUFUSixTQUFPLENBQVA7QUFKSlAsS0FBQUE7QUFrQkgiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgc2V0dGxlSW5TZXJpZXMsIGZ1bGZpbGxJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gJy4uL3NvdXJjZSc7XG5pbXBvcnQgeyBidWlsZFRyYW5zZm9ybSB9IGZyb20gJy4uL3RyYW5zZm9ybSc7XG5leHBvcnQgY29uc3QgUFVTSEFCTEUgPSAnX19wdXNoYWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAcHVzaGFibGVgP1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7U291cmNlfSBzb3VyY2VcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1B1c2hhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtQVVNIQUJMRV07XG59XG4vKipcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicHVzaGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFB1c2hhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgcHVzaGAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBlbWl0cyB0aGUgZm9sbG93aW5nIGV2ZW50czpcbiAqXG4gKiAtIGBiZWZvcmVQdXNoYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHB1c2hgLCB0aGlzIGV2ZW50XG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBUcmFuc2Zvcm1gIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIC0gYHB1c2hgIC0gZW1pdHRlZCBhZnRlciBhIGBwdXNoYCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gYXBwbGllZCwgdGhpcyBldmVudCdzXG4gKiBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIGFuIGFycmF5IG9mIHRoZSBhY3R1YWxcbiAqIGFwcGxpZWQgYFRyYW5zZm9ybWAgaW5zdGFuY2VzLlxuICpcbiAqIC0gYHB1c2hGYWlsYCAtIGVtaXR0ZWQgd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgcHVzaGluZyBhIHRyYW5zZm9ybSwgdGhpc1xuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIHRoZSBlcnJvci5cbiAqXG4gKiBBIHB1c2hhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfcHVzaGAsIHdoaWNoIHBlcmZvcm1zXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHB1c2hgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuXG4gKiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXG4gKlxuICogQGV4cG9ydFxuICogQGRlY29yYXRvclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwdXNoYWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNQdXNoYWJsZShwcm90bykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoJ1B1c2hhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xuICAgIHByb3RvW1BVU0hBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8ucHVzaCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnMsIGlkKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQsIHRoaXMudHJhbnNmb3JtQnVpbGRlcik7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVJlcXVlc3QoJ3B1c2gnLCB0cmFuc2Zvcm0pO1xuICAgIH07XG4gICAgcHJvdG8uX19wdXNoX18gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVQdXNoJywgdHJhbnNmb3JtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wdXNoKHRyYW5zZm9ybSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWQocmVzdWx0KS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICdwdXNoJywgdHJhbnNmb3JtLCByZXN1bHQpKS50aGVuKCgpID0+IHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAncHVzaEZhaWwnLCB0cmFuc2Zvcm0sIGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSJdfQ==