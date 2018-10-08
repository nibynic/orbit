'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PULLABLE = undefined;
exports.isPullable = isPullable;
exports.default = pullable;

var _utils = require('@orbit/utils');

var _core = require('@orbit/core');

var _source = require('../source');

var _query = require('../query');

const PULLABLE = exports.PULLABLE = '__pullable__';
/**
 * Has a source been decorated as `@pullable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPullable(source) {
    return !!source[PULLABLE];
}
/**
 * Marks a source as "pullable" and adds an implementation of the `Pullable`
 * interface.
 *
 * The `pull` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pullable source emits the following events:
 *
 * - `beforePull` - emitted prior to the processing of `pull`, this event
 * includes the requested `Query` as an argument.
 *
 * - `pull` - emitted after a `pull` has successfully been requested, this
 * event's arguments include both the requested `Query` and an array of the
 * resulting `Transform` instances.
 *
 * - `pullFail` - emitted when an error has occurred processing a `pull`, this
 * event's arguments include both the requested `Query` and the error.
 *
 * A pullable source must implement a private method `_pull`, which performs
 * the processing required for `pull` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function pullable(Klass) {
    let proto = Klass.prototype;
    if (isPullable(proto)) {
        return;
    }
    (0, _utils.assert)('Pullable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[PULLABLE] = true;
    proto.pull = function (queryOrExpression, options, id) {
        const query = (0, _query.buildQuery)(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('pull', query);
    };
    proto.__pull__ = function (query) {
        return (0, _core.fulfillInSeries)(this, 'beforePull', query).then(() => this._pull(query)).then(result => this._transformed(result)).then(result => {
            return (0, _core.settleInSeries)(this, 'pull', query, result).then(() => result);
        }).catch(error => {
            return (0, _core.settleInSeries)(this, 'pullFail', query, error).then(() => {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3B1bGxhYmxlLmpzIl0sIm5hbWVzIjpbImlzUHVsbGFibGUiLCJwdWxsYWJsZSIsIlBVTExBQkxFIiwic291cmNlIiwiS2xhc3MiLCJwcm90byIsInByb3RvdHlwZSIsIlNvdXJjZSIsInB1bGwiLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm9wdGlvbnMiLCJpZCIsInF1ZXJ5IiwicXVlcnlCdWlsZGVyIiwiX2VucXVldWVSZXF1ZXN0IiwiX19wdWxsX18iLCJ0aGVuIiwiX3B1bGwiLCJyZXN1bHQiLCJfdHJhbnNmb3JtZWQiLCJjYXRjaCIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFZZ0JBLFUsR0FBQUEsVTtrQkFnQ1FDLFE7O0FBNUN4Qjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDTyxNQUFNQyw4QkFBVyxjQUFqQjtBQUNQOzs7Ozs7O0FBT08sU0FBU0YsVUFBVCxDQUFvQkcsTUFBcEIsRUFBNEI7QUFDL0IsV0FBTyxDQUFDLENBQUNBLE9BQU9ELFFBQVAsQ0FBVDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJlLFNBQVNELFFBQVQsQ0FBa0JHLEtBQWxCLEVBQXlCO0FBQ3BDLFFBQUlDLFFBQVFELE1BQU1FLFNBQWxCO0FBQ0EsUUFBSU4sV0FBV0ssS0FBWCxDQUFKLEVBQXVCO0FBQ25CO0FBQ0g7QUFDRCx1QkFBTyxvREFBUCxFQUE2REEsaUJBQWlCRSxjQUE5RTtBQUNBRixVQUFNSCxRQUFOLElBQWtCLElBQWxCO0FBQ0FHLFVBQU1HLElBQU4sR0FBYSxVQUFVQyxpQkFBVixFQUE2QkMsT0FBN0IsRUFBc0NDLEVBQXRDLEVBQTBDO0FBQ25ELGNBQU1DLFFBQVEsdUJBQVdILGlCQUFYLEVBQThCQyxPQUE5QixFQUF1Q0MsRUFBdkMsRUFBMkMsS0FBS0UsWUFBaEQsQ0FBZDtBQUNBLGVBQU8sS0FBS0MsZUFBTCxDQUFxQixNQUFyQixFQUE2QkYsS0FBN0IsQ0FBUDtBQUNILEtBSEQ7QUFJQVAsVUFBTVUsUUFBTixHQUFpQixVQUFVSCxLQUFWLEVBQWlCO0FBQzlCLGVBQU8sMkJBQWdCLElBQWhCLEVBQXNCLFlBQXRCLEVBQW9DQSxLQUFwQyxFQUEyQ0ksSUFBM0MsQ0FBZ0QsTUFBTSxLQUFLQyxLQUFMLENBQVdMLEtBQVgsQ0FBdEQsRUFBeUVJLElBQXpFLENBQThFRSxVQUFVLEtBQUtDLFlBQUwsQ0FBa0JELE1BQWxCLENBQXhGLEVBQW1IRixJQUFuSCxDQUF3SEUsVUFBVTtBQUNySSxtQkFBTywwQkFBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCTixLQUE3QixFQUFvQ00sTUFBcEMsRUFBNENGLElBQTVDLENBQWlELE1BQU1FLE1BQXZELENBQVA7QUFDSCxTQUZNLEVBRUpFLEtBRkksQ0FFRUMsU0FBUztBQUNkLG1CQUFPLDBCQUFlLElBQWYsRUFBcUIsVUFBckIsRUFBaUNULEtBQWpDLEVBQXdDUyxLQUF4QyxFQUErQ0wsSUFBL0MsQ0FBb0QsTUFBTTtBQUM3RCxzQkFBTUssS0FBTjtBQUNILGFBRk0sQ0FBUDtBQUdILFNBTk0sQ0FBUDtBQU9ILEtBUkQ7QUFTSCIsImZpbGUiOiJzb3VyY2UtaW50ZXJmYWNlcy9wdWxsYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBzZXR0bGVJblNlcmllcywgZnVsZmlsbEluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi4vc291cmNlJztcbmltcG9ydCB7IGJ1aWxkUXVlcnkgfSBmcm9tICcuLi9xdWVyeSc7XG5leHBvcnQgY29uc3QgUFVMTEFCTEUgPSAnX19wdWxsYWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAcHVsbGFibGVgP1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7U291cmNlfSBzb3VyY2VcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1B1bGxhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtQVUxMQUJMRV07XG59XG4vKipcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicHVsbGFibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFB1bGxhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgcHVsbGAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBBIHB1bGxhYmxlIHNvdXJjZSBlbWl0cyB0aGUgZm9sbG93aW5nIGV2ZW50czpcbiAqXG4gKiAtIGBiZWZvcmVQdWxsYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHB1bGxgLCB0aGlzIGV2ZW50XG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYXMgYW4gYXJndW1lbnQuXG4gKlxuICogLSBgcHVsbGAgLSBlbWl0dGVkIGFmdGVyIGEgYHB1bGxgIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiByZXF1ZXN0ZWQsIHRoaXNcbiAqIGV2ZW50J3MgYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYW5kIGFuIGFycmF5IG9mIHRoZVxuICogcmVzdWx0aW5nIGBUcmFuc2Zvcm1gIGluc3RhbmNlcy5cbiAqXG4gKiAtIGBwdWxsRmFpbGAgLSBlbWl0dGVkIHdoZW4gYW4gZXJyb3IgaGFzIG9jY3VycmVkIHByb2Nlc3NpbmcgYSBgcHVsbGAsIHRoaXNcbiAqIGV2ZW50J3MgYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYW5kIHRoZSBlcnJvci5cbiAqXG4gKiBBIHB1bGxhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfcHVsbGAsIHdoaWNoIHBlcmZvcm1zXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHB1bGxgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuXG4gKiBhcnJheSBvZiBgVHJhbnNmb3JtYCBpbnN0YW5jZXMuXG4gKlxuICogQGV4cG9ydFxuICogQGRlY29yYXRvclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwdWxsYWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNQdWxsYWJsZShwcm90bykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoJ1B1bGxhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xuICAgIHByb3RvW1BVTExBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8ucHVsbCA9IGZ1bmN0aW9uIChxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQpIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCwgdGhpcy5xdWVyeUJ1aWxkZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVJlcXVlc3QoJ3B1bGwnLCBxdWVyeSk7XG4gICAgfTtcbiAgICBwcm90by5fX3B1bGxfXyA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVQdWxsJywgcXVlcnkpLnRoZW4oKCkgPT4gdGhpcy5fcHVsbChxdWVyeSkpLnRoZW4ocmVzdWx0ID0+IHRoaXMuX3RyYW5zZm9ybWVkKHJlc3VsdCkpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAncHVsbCcsIHF1ZXJ5LCByZXN1bHQpLnRoZW4oKCkgPT4gcmVzdWx0KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdwdWxsRmFpbCcsIHF1ZXJ5LCBlcnJvcikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iXX0=