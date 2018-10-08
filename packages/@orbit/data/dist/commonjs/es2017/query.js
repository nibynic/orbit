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
        let query = queryOrExpression;
        let expression;
        let options;
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
        let id = queryId || _main2.default.uuid();
        return { expression, options, id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LmpzIl0sIm5hbWVzIjpbImJ1aWxkUXVlcnkiLCJxdWVyeU9yRXhwcmVzc2lvbiIsInF1ZXJ5T3B0aW9ucyIsInF1ZXJ5SWQiLCJxdWVyeUJ1aWxkZXIiLCJxdWVyeSIsImV4cHJlc3Npb24iLCJvcHRpb25zIiwiaWQiLCJRdWVyeVRlcm0iLCJ0b1F1ZXJ5RXhwcmVzc2lvbiIsIk9yYml0IiwidXVpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFzQmdCQSxVLEdBQUFBLFU7O0FBdEJoQjs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sU0FBU0EsVUFBVCxDQUFvQkMsaUJBQXBCLEVBQXVDQyxZQUF2QyxFQUFxREMsT0FBckQsRUFBOERDLFlBQTlELEVBQTRFO0FBQy9FLFFBQUksT0FBT0gsaUJBQVAsS0FBNkIsVUFBakMsRUFBNkM7QUFDekMsZUFBT0QsV0FBV0Msa0JBQWtCRyxZQUFsQixDQUFYLEVBQTRDRixZQUE1QyxFQUEwREMsT0FBMUQsQ0FBUDtBQUNILEtBRkQsTUFFTztBQUNILFlBQUlFLFFBQVFKLGlCQUFaO0FBQ0EsWUFBSUssVUFBSjtBQUNBLFlBQUlDLE9BQUo7QUFDQSxZQUFJLHFCQUFTRixLQUFULEtBQW1CQSxNQUFNQyxVQUE3QixFQUF5QztBQUNyQyxnQkFBSUQsTUFBTUcsRUFBTixJQUFZLENBQUNOLFlBQWIsSUFBNkIsQ0FBQ0MsT0FBbEMsRUFBMkM7QUFDdkMsdUJBQU9FLEtBQVA7QUFDSDtBQUNEQyx5QkFBYUQsTUFBTUMsVUFBbkI7QUFDQUMsc0JBQVVMLGdCQUFnQkcsTUFBTUUsT0FBaEM7QUFDSCxTQU5ELE1BTU87QUFDSCxnQkFBSU4sNkJBQTZCUSxvQkFBakMsRUFBNEM7QUFDeENILDZCQUFhTCxrQkFBa0JTLGlCQUFsQixFQUFiO0FBQ0gsYUFGRCxNQUVPO0FBQ0hKLDZCQUFhTCxpQkFBYjtBQUNIO0FBQ0RNLHNCQUFVTCxZQUFWO0FBQ0g7QUFDRCxZQUFJTSxLQUFLTCxXQUFXUSxlQUFNQyxJQUFOLEVBQXBCO0FBQ0EsZUFBTyxFQUFFTixVQUFGLEVBQWNDLE9BQWQsRUFBdUJDLEVBQXZCLEVBQVA7QUFDSDtBQUNKIiwiZmlsZSI6InF1ZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgeyBRdWVyeVRlcm0gfSBmcm9tICcuL3F1ZXJ5LXRlcm0nO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBBIGJ1aWxkZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgUXVlcnkgZnJvbSBpdHMgY29uc3RpdHVlbnQgcGFydHMuXG4gKlxuICogSWYgYSBgUXVlcnlgIGlzIHBhc3NlZCBpbiB3aXRoIGFuIGBpZGAgYW5kIGBleHByZXNzaW9uYCwgYW5kIG5vIHJlcGxhY2VtZW50XG4gKiBgaWRgIG9yIGBvcHRpb25zYCBhcmUgYWxzbyBwYXNzZWQgaW4sIHRoZW4gdGhlIGBRdWVyeWAgd2lsbCBiZSByZXR1cm5lZFxuICogdW5jaGFuZ2VkLlxuICpcbiAqIEZvciBhbGwgb3RoZXIgY2FzZXMsIGEgbmV3IGBRdWVyeWAgb2JqZWN0IHdpbGwgYmUgY3JlYXRlZCBhbmQgcmV0dXJuZWQuXG4gKlxuICogUXVlcmllcyB3aWxsIGJlIGFzc2lnbmVkIHRoZSBzcGVjaWZpZWQgYHF1ZXJ5SWRgIGFzIGBpZGAuIElmIG5vbmUgaXNcbiAqIHNwZWNpZmllZCwgYSBVVUlEIHdpbGwgYmUgZ2VuZXJhdGVkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7UXVlcnlPckV4cHJlc3Npb259IHF1ZXJ5T3JFeHByZXNzaW9uXG4gKiBAcGFyYW0ge29iamVjdH0gW3F1ZXJ5T3B0aW9uc11cbiAqIEBwYXJhbSB7c3RyaW5nfSBbcXVlcnlJZF1cbiAqIEBwYXJhbSB7UXVlcnlCdWlsZGVyfSBbcXVlcnlCdWlsZGVyXVxuICogQHJldHVybnMge1F1ZXJ5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgcXVlcnlPcHRpb25zLCBxdWVyeUlkLCBxdWVyeUJ1aWxkZXIpIHtcbiAgICBpZiAodHlwZW9mIHF1ZXJ5T3JFeHByZXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uKHF1ZXJ5QnVpbGRlciksIHF1ZXJ5T3B0aW9ucywgcXVlcnlJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gcXVlcnlPckV4cHJlc3Npb247XG4gICAgICAgIGxldCBleHByZXNzaW9uO1xuICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgaWYgKGlzT2JqZWN0KHF1ZXJ5KSAmJiBxdWVyeS5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAocXVlcnkuaWQgJiYgIXF1ZXJ5T3B0aW9ucyAmJiAhcXVlcnlJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHF1ZXJ5T3B0aW9ucyB8fCBxdWVyeS5vcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHF1ZXJ5T3JFeHByZXNzaW9uIGluc3RhbmNlb2YgUXVlcnlUZXJtKSB7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHF1ZXJ5T3JFeHByZXNzaW9uLnRvUXVlcnlFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBxdWVyeU9yRXhwcmVzc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMgPSBxdWVyeU9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGlkID0gcXVlcnlJZCB8fCBPcmJpdC51dWlkKCk7XG4gICAgICAgIHJldHVybiB7IGV4cHJlc3Npb24sIG9wdGlvbnMsIGlkIH07XG4gICAgfVxufSJdfQ==