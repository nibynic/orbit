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

const PUSHABLE = exports.PUSHABLE = '__pushable__';
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
    let proto = Klass.prototype;
    if (isPushable(proto)) {
        return;
    }
    (0, _utils.assert)('Pushable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[PUSHABLE] = true;
    proto.push = function (transformOrOperations, options, id) {
        const transform = (0, _transform.buildTransform)(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve([]);
        }
        return this._enqueueRequest('push', transform);
    };
    proto.__push__ = function (transform) {
        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve([]);
        }
        return (0, _core.fulfillInSeries)(this, 'beforePush', transform).then(() => {
            if (this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve([]);
            } else {
                return this._push(transform).then(result => {
                    return this._transformed(result).then(() => (0, _core.settleInSeries)(this, 'push', transform, result)).then(() => result);
                });
            }
        }).catch(error => {
            return (0, _core.settleInSeries)(this, 'pushFail', transform, error).then(() => {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3B1c2hhYmxlLmpzIl0sIm5hbWVzIjpbImlzUHVzaGFibGUiLCJwdXNoYWJsZSIsIlBVU0hBQkxFIiwic291cmNlIiwiS2xhc3MiLCJwcm90byIsInByb3RvdHlwZSIsIlNvdXJjZSIsInB1c2giLCJ0cmFuc2Zvcm1Pck9wZXJhdGlvbnMiLCJvcHRpb25zIiwiaWQiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2Zvcm1CdWlsZGVyIiwidHJhbnNmb3JtTG9nIiwiY29udGFpbnMiLCJPcmJpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwiX2VucXVldWVSZXF1ZXN0IiwiX19wdXNoX18iLCJ0aGVuIiwiX3B1c2giLCJyZXN1bHQiLCJfdHJhbnNmb3JtZWQiLCJjYXRjaCIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFhZ0JBLFUsR0FBQUEsVTtrQkFnQ1FDLFE7O0FBN0N4Qjs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ08sTUFBTUMsOEJBQVcsY0FBakI7QUFDUDs7Ozs7OztBQU9PLFNBQVNGLFVBQVQsQ0FBb0JHLE1BQXBCLEVBQTRCO0FBQy9CLFdBQU8sQ0FBQyxDQUFDQSxPQUFPRCxRQUFQLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCZSxTQUFTRCxRQUFULENBQWtCRyxLQUFsQixFQUF5QjtBQUNwQyxRQUFJQyxRQUFRRCxNQUFNRSxTQUFsQjtBQUNBLFFBQUlOLFdBQVdLLEtBQVgsQ0FBSixFQUF1QjtBQUNuQjtBQUNIO0FBQ0QsdUJBQU8sb0RBQVAsRUFBNkRBLGlCQUFpQkUsY0FBOUU7QUFDQUYsVUFBTUgsUUFBTixJQUFrQixJQUFsQjtBQUNBRyxVQUFNRyxJQUFOLEdBQWEsVUFBVUMscUJBQVYsRUFBaUNDLE9BQWpDLEVBQTBDQyxFQUExQyxFQUE4QztBQUN2RCxjQUFNQyxZQUFZLCtCQUFlSCxxQkFBZixFQUFzQ0MsT0FBdEMsRUFBK0NDLEVBQS9DLEVBQW1ELEtBQUtFLGdCQUF4RCxDQUFsQjtBQUNBLFlBQUksS0FBS0MsWUFBTCxDQUFrQkMsUUFBbEIsQ0FBMkJILFVBQVVELEVBQXJDLENBQUosRUFBOEM7QUFDMUMsbUJBQU9LLGVBQU1DLE9BQU4sQ0FBY0MsT0FBZCxDQUFzQixFQUF0QixDQUFQO0FBQ0g7QUFDRCxlQUFPLEtBQUtDLGVBQUwsQ0FBcUIsTUFBckIsRUFBNkJQLFNBQTdCLENBQVA7QUFDSCxLQU5EO0FBT0FQLFVBQU1lLFFBQU4sR0FBaUIsVUFBVVIsU0FBVixFQUFxQjtBQUNsQyxZQUFJLEtBQUtFLFlBQUwsQ0FBa0JDLFFBQWxCLENBQTJCSCxVQUFVRCxFQUFyQyxDQUFKLEVBQThDO0FBQzFDLG1CQUFPSyxlQUFNQyxPQUFOLENBQWNDLE9BQWQsQ0FBc0IsRUFBdEIsQ0FBUDtBQUNIO0FBQ0QsZUFBTywyQkFBZ0IsSUFBaEIsRUFBc0IsWUFBdEIsRUFBb0NOLFNBQXBDLEVBQStDUyxJQUEvQyxDQUFvRCxNQUFNO0FBQzdELGdCQUFJLEtBQUtQLFlBQUwsQ0FBa0JDLFFBQWxCLENBQTJCSCxVQUFVRCxFQUFyQyxDQUFKLEVBQThDO0FBQzFDLHVCQUFPSyxlQUFNQyxPQUFOLENBQWNDLE9BQWQsQ0FBc0IsRUFBdEIsQ0FBUDtBQUNILGFBRkQsTUFFTztBQUNILHVCQUFPLEtBQUtJLEtBQUwsQ0FBV1YsU0FBWCxFQUFzQlMsSUFBdEIsQ0FBMkJFLFVBQVU7QUFDeEMsMkJBQU8sS0FBS0MsWUFBTCxDQUFrQkQsTUFBbEIsRUFBMEJGLElBQTFCLENBQStCLE1BQU0sMEJBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QlQsU0FBN0IsRUFBd0NXLE1BQXhDLENBQXJDLEVBQXNGRixJQUF0RixDQUEyRixNQUFNRSxNQUFqRyxDQUFQO0FBQ0gsaUJBRk0sQ0FBUDtBQUdIO0FBQ0osU0FSTSxFQVFKRSxLQVJJLENBUUVDLFNBQVM7QUFDZCxtQkFBTywwQkFBZSxJQUFmLEVBQXFCLFVBQXJCLEVBQWlDZCxTQUFqQyxFQUE0Q2MsS0FBNUMsRUFBbURMLElBQW5ELENBQXdELE1BQU07QUFDakUsc0JBQU1LLEtBQU47QUFDSCxhQUZNLENBQVA7QUFHSCxTQVpNLENBQVA7QUFhSCxLQWpCRDtBQWtCSCIsImZpbGUiOiJzb3VyY2UtaW50ZXJmYWNlcy9wdXNoYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBzZXR0bGVJblNlcmllcywgZnVsZmlsbEluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi4vc291cmNlJztcbmltcG9ydCB7IGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHJhbnNmb3JtJztcbmV4cG9ydCBjb25zdCBQVVNIQUJMRSA9ICdfX3B1c2hhYmxlX18nO1xuLyoqXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEBwdXNoYWJsZWA/XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtTb3VyY2V9IHNvdXJjZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHVzaGFibGUoc291cmNlKSB7XG4gICAgcmV0dXJuICEhc291cmNlW1BVU0hBQkxFXTtcbn1cbi8qKlxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJwdXNoYWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgUHVzaGFibGVgXG4gKiBpbnRlcmZhY2UuXG4gKlxuICogVGhlIGBwdXNoYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJyZXF1ZXN0IGZsb3dcIiBpbiBPcmJpdC4gUmVxdWVzdHMgdHJpZ2dlclxuICogZXZlbnRzIGJlZm9yZSBhbmQgYWZ0ZXIgcHJvY2Vzc2luZyBvZiBlYWNoIHJlcXVlc3QuIE9ic2VydmVycyBjYW4gZGVsYXkgdGhlXG4gKiByZXNvbHV0aW9uIG9mIGEgcmVxdWVzdCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIGFuIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIEEgcHVzaGFibGUgc291cmNlIGVtaXRzIHRoZSBmb2xsb3dpbmcgZXZlbnRzOlxuICpcbiAqIC0gYGJlZm9yZVB1c2hgIC0gZW1pdHRlZCBwcmlvciB0byB0aGUgcHJvY2Vzc2luZyBvZiBgcHVzaGAsIHRoaXMgZXZlbnRcbiAqIGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXG4gKlxuICogLSBgcHVzaGAgLSBlbWl0dGVkIGFmdGVyIGEgYHB1c2hgIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiBhcHBsaWVkLCB0aGlzIGV2ZW50J3NcbiAqIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhbmQgYW4gYXJyYXkgb2YgdGhlIGFjdHVhbFxuICogYXBwbGllZCBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXG4gKlxuICogLSBgcHVzaEZhaWxgIC0gZW1pdHRlZCB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCBwdXNoaW5nIGEgdHJhbnNmb3JtLCB0aGlzXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgVHJhbnNmb3JtYCBhbmQgdGhlIGVycm9yLlxuICpcbiAqIEEgcHVzaGFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF9wdXNoYCwgd2hpY2ggcGVyZm9ybXNcbiAqIHRoZSBwcm9jZXNzaW5nIHJlcXVpcmVkIGZvciBgcHVzaGAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW5cbiAqIGFycmF5IG9mIGBUcmFuc2Zvcm1gIGluc3RhbmNlcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAZGVjb3JhdG9yXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHB1c2hhYmxlKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc1B1c2hhYmxlKHByb3RvKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydCgnUHVzaGFibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XG4gICAgcHJvdG9bUFVTSEFCTEVdID0gdHJ1ZTtcbiAgICBwcm90by5wdXNoID0gZnVuY3Rpb24gKHRyYW5zZm9ybU9yT3BlcmF0aW9ucywgb3B0aW9ucywgaWQpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zLCBpZCwgdGhpcy50cmFuc2Zvcm1CdWlsZGVyKTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlUmVxdWVzdCgncHVzaCcsIHRyYW5zZm9ybSk7XG4gICAgfTtcbiAgICBwcm90by5fX3B1c2hfXyA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdWxmaWxsSW5TZXJpZXModGhpcywgJ2JlZm9yZVB1c2gnLCB0cmFuc2Zvcm0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3B1c2godHJhbnNmb3JtKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1lZChyZXN1bHQpLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3B1c2gnLCB0cmFuc2Zvcm0sIHJlc3VsdCkpLnRoZW4oKCkgPT4gcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdwdXNoRmFpbCcsIHRyYW5zZm9ybSwgZXJyb3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59Il19