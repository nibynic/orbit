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

const QUERYABLE = exports.QUERYABLE = '__queryable__';
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
    let proto = Klass.prototype;
    if (isQueryable(proto)) {
        return;
    }
    (0, _utils.assert)('Queryable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[QUERYABLE] = true;
    proto.query = function (queryOrExpression, options, id) {
        const query = (0, _query.buildQuery)(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('query', query);
    };
    proto.__query__ = function (query) {
        return (0, _core.fulfillInSeries)(this, 'beforeQuery', query).then(() => this._query(query)).then(result => {
            return (0, _core.settleInSeries)(this, 'query', query, result).then(() => result);
        }).catch(error => {
            return (0, _core.settleInSeries)(this, 'queryFail', query, error).then(() => {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3F1ZXJ5YWJsZS5qcyJdLCJuYW1lcyI6WyJpc1F1ZXJ5YWJsZSIsInF1ZXJ5YWJsZSIsIlFVRVJZQUJMRSIsInNvdXJjZSIsIktsYXNzIiwicHJvdG8iLCJwcm90b3R5cGUiLCJTb3VyY2UiLCJxdWVyeSIsInF1ZXJ5T3JFeHByZXNzaW9uIiwib3B0aW9ucyIsImlkIiwicXVlcnlCdWlsZGVyIiwiX2VucXVldWVSZXF1ZXN0IiwiX19xdWVyeV9fIiwidGhlbiIsIl9xdWVyeSIsInJlc3VsdCIsImNhdGNoIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztRQVlnQkEsVyxHQUFBQSxXO2tCQStCUUMsUzs7QUEzQ3hCOztBQUNBOztBQUNBOztBQUNBOztBQUNPLE1BQU1DLGdDQUFZLGVBQWxCO0FBQ1A7Ozs7Ozs7QUFPTyxTQUFTRixXQUFULENBQXFCRyxNQUFyQixFQUE2QjtBQUNoQyxXQUFPLENBQUMsQ0FBQ0EsT0FBT0QsU0FBUCxDQUFUO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCZSxTQUFTRCxTQUFULENBQW1CRyxLQUFuQixFQUEwQjtBQUNyQyxRQUFJQyxRQUFRRCxNQUFNRSxTQUFsQjtBQUNBLFFBQUlOLFlBQVlLLEtBQVosQ0FBSixFQUF3QjtBQUNwQjtBQUNIO0FBQ0QsdUJBQU8scURBQVAsRUFBOERBLGlCQUFpQkUsY0FBL0U7QUFDQUYsVUFBTUgsU0FBTixJQUFtQixJQUFuQjtBQUNBRyxVQUFNRyxLQUFOLEdBQWMsVUFBVUMsaUJBQVYsRUFBNkJDLE9BQTdCLEVBQXNDQyxFQUF0QyxFQUEwQztBQUNwRCxjQUFNSCxRQUFRLHVCQUFXQyxpQkFBWCxFQUE4QkMsT0FBOUIsRUFBdUNDLEVBQXZDLEVBQTJDLEtBQUtDLFlBQWhELENBQWQ7QUFDQSxlQUFPLEtBQUtDLGVBQUwsQ0FBcUIsT0FBckIsRUFBOEJMLEtBQTlCLENBQVA7QUFDSCxLQUhEO0FBSUFILFVBQU1TLFNBQU4sR0FBa0IsVUFBVU4sS0FBVixFQUFpQjtBQUMvQixlQUFPLDJCQUFnQixJQUFoQixFQUFzQixhQUF0QixFQUFxQ0EsS0FBckMsRUFBNENPLElBQTVDLENBQWlELE1BQU0sS0FBS0MsTUFBTCxDQUFZUixLQUFaLENBQXZELEVBQTJFTyxJQUEzRSxDQUFnRkUsVUFBVTtBQUM3RixtQkFBTywwQkFBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCVCxLQUE5QixFQUFxQ1MsTUFBckMsRUFBNkNGLElBQTdDLENBQWtELE1BQU1FLE1BQXhELENBQVA7QUFDSCxTQUZNLEVBRUpDLEtBRkksQ0FFRUMsU0FBUztBQUNkLG1CQUFPLDBCQUFlLElBQWYsRUFBcUIsV0FBckIsRUFBa0NYLEtBQWxDLEVBQXlDVyxLQUF6QyxFQUFnREosSUFBaEQsQ0FBcUQsTUFBTTtBQUM5RCxzQkFBTUksS0FBTjtBQUNILGFBRk0sQ0FBUDtBQUdILFNBTk0sQ0FBUDtBQU9ILEtBUkQ7QUFTSCIsImZpbGUiOiJzb3VyY2UtaW50ZXJmYWNlcy9xdWVyeWFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgc2V0dGxlSW5TZXJpZXMsIGZ1bGZpbGxJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IGJ1aWxkUXVlcnkgfSBmcm9tICcuLi9xdWVyeSc7XG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tICcuLi9zb3VyY2UnO1xuZXhwb3J0IGNvbnN0IFFVRVJZQUJMRSA9ICdfX3F1ZXJ5YWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAcXVlcnlhYmxlYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNRdWVyeWFibGUoc291cmNlKSB7XG4gICAgcmV0dXJuICEhc291cmNlW1FVRVJZQUJMRV07XG59XG4vKipcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwicXVlcnlhYmxlXCIgYW5kIGFkZHMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBRdWVyeWFibGVgXG4gKiBpbnRlcmZhY2UuXG4gKlxuICogVGhlIGBxdWVyeWAgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwicmVxdWVzdCBmbG93XCIgaW4gT3JiaXQuIFJlcXVlc3RzIHRyaWdnZXJcbiAqIGV2ZW50cyBiZWZvcmUgYW5kIGFmdGVyIHByb2Nlc3Npbmcgb2YgZWFjaCByZXF1ZXN0LiBPYnNlcnZlcnMgY2FuIGRlbGF5IHRoZVxuICogcmVzb2x1dGlvbiBvZiBhIHJlcXVlc3QgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiBhbiBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBUaGUgYFF1ZXJ5YWJsZWAgaW50ZXJmYWNlIGludHJvZHVjZXMgdGhlIGZvbGxvd2luZyBldmVudHM6XG4gKlxuICogLSBgYmVmb3JlUXVlcnlgIC0gZW1pdHRlZCBwcmlvciB0byB0aGUgcHJvY2Vzc2luZyBvZiBgcXVlcnlgLCB0aGlzIGV2ZW50XG4gKiBpbmNsdWRlcyB0aGUgcmVxdWVzdGVkIGBRdWVyeWAgYXMgYW4gYXJndW1lbnQuXG4gKlxuICogLSBgcXVlcnlgIC0gZW1pdHRlZCBhZnRlciBhIGBxdWVyeWAgaGFzIHN1Y2Nlc3NmdWxseSByZXR1cm5lZCwgdGhpcyBldmVudCdzXG4gKiBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFF1ZXJ5YCBhbmQgdGhlIHJlc3VsdHMuXG4gKlxuICogLSBgcXVlcnlGYWlsYCAtIGVtaXR0ZWQgd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgcHJvY2Vzc2luZyBhIHF1ZXJ5LCB0aGlzXG4gKiBldmVudCdzIGFyZ3VtZW50cyBpbmNsdWRlIGJvdGggdGhlIHJlcXVlc3RlZCBgUXVlcnlgIGFuZCB0aGUgZXJyb3IuXG4gKlxuICogQSBxdWVyeWFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF9xdWVyeWAsIHdoaWNoIHBlcmZvcm1zXG4gKiB0aGUgcHJvY2Vzc2luZyByZXF1aXJlZCBmb3IgYHF1ZXJ5YCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhXG4gKiBzZXQgb2YgcmVzdWx0cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAZGVjb3JhdG9yXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHF1ZXJ5YWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNRdWVyeWFibGUocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KCdRdWVyeWFibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XG4gICAgcHJvdG9bUVVFUllBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8ucXVlcnkgPSBmdW5jdGlvbiAocXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnMsIGlkKSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQsIHRoaXMucXVlcnlCdWlsZGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VucXVldWVSZXF1ZXN0KCdxdWVyeScsIHF1ZXJ5KTtcbiAgICB9O1xuICAgIHByb3RvLl9fcXVlcnlfXyA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVRdWVyeScsIHF1ZXJ5KS50aGVuKCgpID0+IHRoaXMuX3F1ZXJ5KHF1ZXJ5KSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdxdWVyeScsIHF1ZXJ5LCByZXN1bHQpLnRoZW4oKCkgPT4gcmVzdWx0KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdxdWVyeUZhaWwnLCBxdWVyeSwgZXJyb3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59Il19