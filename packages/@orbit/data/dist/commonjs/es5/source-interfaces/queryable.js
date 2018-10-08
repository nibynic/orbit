'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QUERYABLE = undefined;
exports.isQueryable = isQueryable;
exports.default = queryable;

var _utils = require('@orbit/utils');

var _core = require('@orbit/core');

var _query = require('../query');

var _source = require('../source');

var QUERYABLE = exports.QUERYABLE = '__queryable__';
/**
 * Has a source been decorated as `@queryable`?
 *
 * @export
 * @param {object} obj
 * @returns
 */
function isQueryable(source) {
    return !!source[QUERYABLE];
}
/**
 * Marks a source as "queryable" and adds an implementation of the `Queryable`
 * interface.
 *
 * The `query` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * The `Queryable` interface introduces the following events:
 *
 * - `beforeQuery` - emitted prior to the processing of `query`, this event
 * includes the requested `Query` as an argument.
 *
 * - `query` - emitted after a `query` has successfully returned, this event's
 * arguments include both the requested `Query` and the results.
 *
 * - `queryFail` - emitted when an error has occurred processing a query, this
 * event's arguments include both the requested `Query` and the error.
 *
 * A queryable source must implement a private method `_query`, which performs
 * the processing required for `query` and returns a promise that resolves to a
 * set of results.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function queryable(Klass) {
    var proto = Klass.prototype;
    if (isQueryable(proto)) {
        return;
    }
    (0, _utils.assert)('Queryable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[QUERYABLE] = true;
    proto.query = function (queryOrExpression, options, id) {
        var query = (0, _query.buildQuery)(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('query', query);
    };
    proto.__query__ = function (query) {
        var _this = this;

        return (0, _core.fulfillInSeries)(this, 'beforeQuery', query).then(function () {
            return _this._query(query);
        }).then(function (result) {
            return (0, _core.settleInSeries)(_this, 'query', query, result).then(function () {
                return result;
            });
        }).catch(function (error) {
            return (0, _core.settleInSeries)(_this, 'queryFail', query, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3F1ZXJ5YWJsZS5qcyJdLCJuYW1lcyI6WyJRVUVSWUFCTEUiLCJzb3VyY2UiLCJwcm90byIsIktsYXNzIiwiaXNRdWVyeWFibGUiLCJhc3NlcnQiLCJxdWVyeSIsImJ1aWxkUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7OztRQVlPLFcsR0FBQSxXO2tCQStCUSxTOzs7O0FBMUNmOztBQUNBOztBQUNBOztBQUNPLElBQU1BLGdDQUFOLGVBQUE7QUFDUDs7Ozs7OztBQU9PLFNBQUEsV0FBQSxDQUFBLE1BQUEsRUFBNkI7QUFDaEMsV0FBTyxDQUFDLENBQUNDLE9BQVQsU0FBU0EsQ0FBVDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QmUsU0FBQSxTQUFBLENBQUEsS0FBQSxFQUEwQjtBQUNyQyxRQUFJQyxRQUFRQyxNQUFaLFNBQUE7QUFDQSxRQUFJQyxZQUFKLEtBQUlBLENBQUosRUFBd0I7QUFDcEI7QUFDSDtBQUNEQyx1QkFBQUEscURBQUFBLEVBQThESCxpQkFBOURHLGNBQUFBO0FBQ0FILFVBQUFBLFNBQUFBLElBQUFBLElBQUFBO0FBQ0FBLFVBQUFBLEtBQUFBLEdBQWMsVUFBQSxpQkFBQSxFQUFBLE9BQUEsRUFBQSxFQUFBLEVBQTBDO0FBQ3BELFlBQU1JLFFBQVFDLHVCQUFBQSxpQkFBQUEsRUFBQUEsT0FBQUEsRUFBQUEsRUFBQUEsRUFBMkMsS0FBekQsWUFBY0EsQ0FBZDtBQUNBLGVBQU8sS0FBQSxlQUFBLENBQUEsT0FBQSxFQUFQLEtBQU8sQ0FBUDtBQUZKTCxLQUFBQTtBQUlBQSxVQUFBQSxTQUFBQSxHQUFrQixVQUFBLEtBQUEsRUFBaUI7QUFBQSxZQUFBLFFBQUEsSUFBQTs7QUFDL0IsZUFBTywyQkFBQSxJQUFBLEVBQUEsYUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLENBQWlELFlBQUE7QUFBQSxtQkFBTSxNQUFBLE1BQUEsQ0FBTixLQUFNLENBQU47QUFBakQsU0FBQSxFQUFBLElBQUEsQ0FBZ0YsVUFBQSxNQUFBLEVBQVU7QUFDN0YsbUJBQU8sMEJBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsQ0FBa0QsWUFBQTtBQUFBLHVCQUFBLE1BQUE7QUFBekQsYUFBTyxDQUFQO0FBREcsU0FBQSxFQUFBLEtBQUEsQ0FFRSxVQUFBLEtBQUEsRUFBUztBQUNkLG1CQUFPLDBCQUFBLEtBQUEsRUFBQSxXQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLENBQXFELFlBQU07QUFDOUQsc0JBQUEsS0FBQTtBQURKLGFBQU8sQ0FBUDtBQUhKLFNBQU8sQ0FBUDtBQURKQSxLQUFBQTtBQVNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IHNldHRsZUluU2VyaWVzLCBmdWxmaWxsSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBidWlsZFF1ZXJ5IH0gZnJvbSAnLi4vcXVlcnknO1xuaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi4vc291cmNlJztcbmV4cG9ydCBjb25zdCBRVUVSWUFCTEUgPSAnX19xdWVyeWFibGVfXyc7XG4vKipcbiAqIEhhcyBhIHNvdXJjZSBiZWVuIGRlY29yYXRlZCBhcyBgQHF1ZXJ5YWJsZWA/XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUXVlcnlhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtRVUVSWUFCTEVdO1xufVxuLyoqXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInF1ZXJ5YWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgUXVlcnlhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgcXVlcnlgIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZSBcInJlcXVlc3QgZmxvd1wiIGluIE9yYml0LiBSZXF1ZXN0cyB0cmlnZ2VyXG4gKiBldmVudHMgYmVmb3JlIGFuZCBhZnRlciBwcm9jZXNzaW5nIG9mIGVhY2ggcmVxdWVzdC4gT2JzZXJ2ZXJzIGNhbiBkZWxheSB0aGVcbiAqIHJlc29sdXRpb24gb2YgYSByZXF1ZXN0IGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gYW4gZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogVGhlIGBRdWVyeWFibGVgIGludGVyZmFjZSBpbnRyb2R1Y2VzIHRoZSBmb2xsb3dpbmcgZXZlbnRzOlxuICpcbiAqIC0gYGJlZm9yZVF1ZXJ5YCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHF1ZXJ5YCwgdGhpcyBldmVudFxuICogaW5jbHVkZXMgdGhlIHJlcXVlc3RlZCBgUXVlcnlgIGFzIGFuIGFyZ3VtZW50LlxuICpcbiAqIC0gYHF1ZXJ5YCAtIGVtaXR0ZWQgYWZ0ZXIgYSBgcXVlcnlgIGhhcyBzdWNjZXNzZnVsbHkgcmV0dXJuZWQsIHRoaXMgZXZlbnQnc1xuICogYXJndW1lbnRzIGluY2x1ZGUgYm90aCB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYW5kIHRoZSByZXN1bHRzLlxuICpcbiAqIC0gYHF1ZXJ5RmFpbGAgLSBlbWl0dGVkIHdoZW4gYW4gZXJyb3IgaGFzIG9jY3VycmVkIHByb2Nlc3NpbmcgYSBxdWVyeSwgdGhpc1xuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFF1ZXJ5YCBhbmQgdGhlIGVycm9yLlxuICpcbiAqIEEgcXVlcnlhYmxlIHNvdXJjZSBtdXN0IGltcGxlbWVudCBhIHByaXZhdGUgbWV0aG9kIGBfcXVlcnlgLCB3aGljaCBwZXJmb3Jtc1xuICogdGhlIHByb2Nlc3NpbmcgcmVxdWlyZWQgZm9yIGBxdWVyeWAgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYVxuICogc2V0IG9mIHJlc3VsdHMuXG4gKlxuICogQGV4cG9ydFxuICogQGRlY29yYXRvclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBxdWVyeWFibGUoS2xhc3MpIHtcbiAgICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XG4gICAgaWYgKGlzUXVlcnlhYmxlKHByb3RvKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydCgnUXVlcnlhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xuICAgIHByb3RvW1FVRVJZQUJMRV0gPSB0cnVlO1xuICAgIHByb3RvLnF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnMsIGlkLCB0aGlzLnF1ZXJ5QnVpbGRlcik7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlUmVxdWVzdCgncXVlcnknLCBxdWVyeSk7XG4gICAgfTtcbiAgICBwcm90by5fX3F1ZXJ5X18gPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlUXVlcnknLCBxdWVyeSkudGhlbigoKSA9PiB0aGlzLl9xdWVyeShxdWVyeSkpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAncXVlcnknLCBxdWVyeSwgcmVzdWx0KS50aGVuKCgpID0+IHJlc3VsdCk7XG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAncXVlcnlGYWlsJywgcXVlcnksIGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSJdfQ==