'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildQuery = buildQuery;

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _queryTerm = require('./query-term');

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A builder function for creating a Query from its constituent parts.
 *
 * If a `Query` is passed in with an `id` and `expression`, and no replacement
 * `id` or `options` are also passed in, then the `Query` will be returned
 * unchanged.
 *
 * For all other cases, a new `Query` object will be created and returned.
 *
 * Queries will be assigned the specified `queryId` as `id`. If none is
 * specified, a UUID will be generated.
 *
 * @export
 * @param {QueryOrExpression} queryOrExpression
 * @param {object} [queryOptions]
 * @param {string} [queryId]
 * @param {QueryBuilder} [queryBuilder]
 * @returns {Query}
 */
function buildQuery(queryOrExpression, queryOptions, queryId, queryBuilder) {
    if (typeof queryOrExpression === 'function') {
        return buildQuery(queryOrExpression(queryBuilder), queryOptions, queryId);
    } else {
        var query = queryOrExpression;
        var expression = void 0;
        var options = void 0;
        if ((0, _utils.isObject)(query) && query.expression) {
            if (query.id && !queryOptions && !queryId) {
                return query;
            }
            expression = query.expression;
            options = queryOptions || query.options;
        } else {
            if (queryOrExpression instanceof _queryTerm.QueryTerm) {
                expression = queryOrExpression.toQueryExpression();
            } else {
                expression = queryOrExpression;
            }
            options = queryOptions;
        }
        var id = queryId || _main2.default.uuid();
        return { expression: expression, options: options, id: id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LmpzIl0sIm5hbWVzIjpbImJ1aWxkUXVlcnkiLCJxdWVyeU9yRXhwcmVzc2lvbiIsInF1ZXJ5IiwiZXhwcmVzc2lvbiIsIm9wdGlvbnMiLCJpc09iamVjdCIsInF1ZXJ5T3B0aW9ucyIsImlkIiwicXVlcnlJZCIsIk9yYml0Il0sIm1hcHBpbmdzIjoiOzs7OztRQXNCTyxVLEdBQUEsVTs7Ozs7O0FBckJQOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sU0FBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsRUFBNEU7QUFDL0UsUUFBSSxPQUFBLGlCQUFBLEtBQUosVUFBQSxFQUE2QztBQUN6QyxlQUFPQSxXQUFXQyxrQkFBWEQsWUFBV0MsQ0FBWEQsRUFBQUEsWUFBQUEsRUFBUCxPQUFPQSxDQUFQO0FBREosS0FBQSxNQUVPO0FBQ0gsWUFBSUUsUUFBSixpQkFBQTtBQUNBLFlBQUlDLGFBQUFBLEtBQUosQ0FBQTtBQUNBLFlBQUlDLFVBQUFBLEtBQUosQ0FBQTtBQUNBLFlBQUlDLHFCQUFBQSxLQUFBQSxLQUFtQkgsTUFBdkIsVUFBQSxFQUF5QztBQUNyQyxnQkFBSUEsTUFBQUEsRUFBQUEsSUFBWSxDQUFaQSxZQUFBQSxJQUE2QixDQUFqQyxPQUFBLEVBQTJDO0FBQ3ZDLHVCQUFBLEtBQUE7QUFDSDtBQUNEQyx5QkFBYUQsTUFBYkMsVUFBQUE7QUFDQUMsc0JBQVVFLGdCQUFnQkosTUFBMUJFLE9BQUFBO0FBTEosU0FBQSxNQU1PO0FBQ0gsZ0JBQUlILDZCQUFKLG9CQUFBLEVBQTRDO0FBQ3hDRSw2QkFBYUYsa0JBQWJFLGlCQUFhRixFQUFiRTtBQURKLGFBQUEsTUFFTztBQUNIQSw2QkFBQUEsaUJBQUFBO0FBQ0g7QUFDREMsc0JBQUFBLFlBQUFBO0FBQ0g7QUFDRCxZQUFJRyxLQUFLQyxXQUFXQyxlQUFwQixJQUFvQkEsRUFBcEI7QUFDQSxlQUFPLEVBQUVOLFlBQUYsVUFBQSxFQUFjQyxTQUFkLE9BQUEsRUFBdUJHLElBQTlCLEVBQU8sRUFBUDtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IFF1ZXJ5VGVybSB9IGZyb20gJy4vcXVlcnktdGVybSc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vKipcbiAqIEEgYnVpbGRlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBRdWVyeSBmcm9tIGl0cyBjb25zdGl0dWVudCBwYXJ0cy5cbiAqXG4gKiBJZiBhIGBRdWVyeWAgaXMgcGFzc2VkIGluIHdpdGggYW4gYGlkYCBhbmQgYGV4cHJlc3Npb25gLCBhbmQgbm8gcmVwbGFjZW1lbnRcbiAqIGBpZGAgb3IgYG9wdGlvbnNgIGFyZSBhbHNvIHBhc3NlZCBpbiwgdGhlbiB0aGUgYFF1ZXJ5YCB3aWxsIGJlIHJldHVybmVkXG4gKiB1bmNoYW5nZWQuXG4gKlxuICogRm9yIGFsbCBvdGhlciBjYXNlcywgYSBuZXcgYFF1ZXJ5YCBvYmplY3Qgd2lsbCBiZSBjcmVhdGVkIGFuZCByZXR1cm5lZC5cbiAqXG4gKiBRdWVyaWVzIHdpbGwgYmUgYXNzaWduZWQgdGhlIHNwZWNpZmllZCBgcXVlcnlJZGAgYXMgYGlkYC4gSWYgbm9uZSBpc1xuICogc3BlY2lmaWVkLCBhIFVVSUQgd2lsbCBiZSBnZW5lcmF0ZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtRdWVyeU9yRXhwcmVzc2lvbn0gcXVlcnlPckV4cHJlc3Npb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBbcXVlcnlPcHRpb25zXVxuICogQHBhcmFtIHtzdHJpbmd9IFtxdWVyeUlkXVxuICogQHBhcmFtIHtRdWVyeUJ1aWxkZXJ9IFtxdWVyeUJ1aWxkZXJdXG4gKiBAcmV0dXJucyB7UXVlcnl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMsIHF1ZXJ5SWQsIHF1ZXJ5QnVpbGRlcikge1xuICAgIGlmICh0eXBlb2YgcXVlcnlPckV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb24ocXVlcnlCdWlsZGVyKSwgcXVlcnlPcHRpb25zLCBxdWVyeUlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcXVlcnkgPSBxdWVyeU9yRXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IGV4cHJlc3Npb247XG4gICAgICAgIGxldCBvcHRpb25zO1xuICAgICAgICBpZiAoaXNPYmplY3QocXVlcnkpICYmIHF1ZXJ5LmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChxdWVyeS5pZCAmJiAhcXVlcnlPcHRpb25zICYmICFxdWVyeUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgICAgICBvcHRpb25zID0gcXVlcnlPcHRpb25zIHx8IHF1ZXJ5Lm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocXVlcnlPckV4cHJlc3Npb24gaW5zdGFuY2VvZiBRdWVyeVRlcm0pIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gcXVlcnlPckV4cHJlc3Npb24udG9RdWVyeUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5T3JFeHByZXNzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucyA9IHF1ZXJ5T3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBsZXQgaWQgPSBxdWVyeUlkIHx8IE9yYml0LnV1aWQoKTtcbiAgICAgICAgcmV0dXJuIHsgZXhwcmVzc2lvbiwgb3B0aW9ucywgaWQgfTtcbiAgICB9XG59Il19