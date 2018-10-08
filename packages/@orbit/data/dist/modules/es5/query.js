import Orbit from './main';
import { QueryTerm } from './query-term';
import { isObject } from '@orbit/utils';
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
export function buildQuery(queryOrExpression, queryOptions, queryId, queryBuilder) {
    if (typeof queryOrExpression === 'function') {
        return buildQuery(queryOrExpression(queryBuilder), queryOptions, queryId);
    } else {
        var query = queryOrExpression;
        var expression = void 0;
        var options = void 0;
        if (isObject(query) && query.expression) {
            if (query.id && !queryOptions && !queryId) {
                return query;
            }
            expression = query.expression;
            options = queryOptions || query.options;
        } else {
            if (queryOrExpression instanceof QueryTerm) {
                expression = queryOrExpression.toQueryExpression();
            } else {
                expression = queryOrExpression;
            }
            options = queryOptions;
        }
        var id = queryId || Orbit.uuid();
        return { expression: expression, options: options, id: id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiUXVlcnlUZXJtIiwiaXNPYmplY3QiLCJidWlsZFF1ZXJ5IiwicXVlcnlPckV4cHJlc3Npb24iLCJxdWVyeU9wdGlvbnMiLCJxdWVyeUlkIiwicXVlcnlCdWlsZGVyIiwicXVlcnkiLCJleHByZXNzaW9uIiwib3B0aW9ucyIsImlkIiwidG9RdWVyeUV4cHJlc3Npb24iLCJ1dWlkIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxLQUFQLE1BQWtCLFFBQWxCO0FBQ0EsU0FBU0MsU0FBVCxRQUEwQixjQUExQjtBQUNBLFNBQVNDLFFBQVQsUUFBeUIsY0FBekI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLFNBQVNDLFVBQVQsQ0FBb0JDLGlCQUFwQixFQUF1Q0MsWUFBdkMsRUFBcURDLE9BQXJELEVBQThEQyxZQUE5RCxFQUE0RTtBQUMvRSxRQUFJLE9BQU9ILGlCQUFQLEtBQTZCLFVBQWpDLEVBQTZDO0FBQ3pDLGVBQU9ELFdBQVdDLGtCQUFrQkcsWUFBbEIsQ0FBWCxFQUE0Q0YsWUFBNUMsRUFBMERDLE9BQTFELENBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFJRSxRQUFRSixpQkFBWjtBQUNBLFlBQUlLLG1CQUFKO0FBQ0EsWUFBSUMsZ0JBQUo7QUFDQSxZQUFJUixTQUFTTSxLQUFULEtBQW1CQSxNQUFNQyxVQUE3QixFQUF5QztBQUNyQyxnQkFBSUQsTUFBTUcsRUFBTixJQUFZLENBQUNOLFlBQWIsSUFBNkIsQ0FBQ0MsT0FBbEMsRUFBMkM7QUFDdkMsdUJBQU9FLEtBQVA7QUFDSDtBQUNEQyx5QkFBYUQsTUFBTUMsVUFBbkI7QUFDQUMsc0JBQVVMLGdCQUFnQkcsTUFBTUUsT0FBaEM7QUFDSCxTQU5ELE1BTU87QUFDSCxnQkFBSU4sNkJBQTZCSCxTQUFqQyxFQUE0QztBQUN4Q1EsNkJBQWFMLGtCQUFrQlEsaUJBQWxCLEVBQWI7QUFDSCxhQUZELE1BRU87QUFDSEgsNkJBQWFMLGlCQUFiO0FBQ0g7QUFDRE0sc0JBQVVMLFlBQVY7QUFDSDtBQUNELFlBQUlNLEtBQUtMLFdBQVdOLE1BQU1hLElBQU4sRUFBcEI7QUFDQSxlQUFPLEVBQUVKLHNCQUFGLEVBQWNDLGdCQUFkLEVBQXVCQyxNQUF2QixFQUFQO0FBQ0g7QUFDSiIsImZpbGUiOiJxdWVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgUXVlcnlUZXJtIH0gZnJvbSAnLi9xdWVyeS10ZXJtJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8qKlxuICogQSBidWlsZGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIFF1ZXJ5IGZyb20gaXRzIGNvbnN0aXR1ZW50IHBhcnRzLlxuICpcbiAqIElmIGEgYFF1ZXJ5YCBpcyBwYXNzZWQgaW4gd2l0aCBhbiBgaWRgIGFuZCBgZXhwcmVzc2lvbmAsIGFuZCBubyByZXBsYWNlbWVudFxuICogYGlkYCBvciBgb3B0aW9uc2AgYXJlIGFsc28gcGFzc2VkIGluLCB0aGVuIHRoZSBgUXVlcnlgIHdpbGwgYmUgcmV0dXJuZWRcbiAqIHVuY2hhbmdlZC5cbiAqXG4gKiBGb3IgYWxsIG90aGVyIGNhc2VzLCBhIG5ldyBgUXVlcnlgIG9iamVjdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxuICpcbiAqIFF1ZXJpZXMgd2lsbCBiZSBhc3NpZ25lZCB0aGUgc3BlY2lmaWVkIGBxdWVyeUlkYCBhcyBgaWRgLiBJZiBub25lIGlzXG4gKiBzcGVjaWZpZWQsIGEgVVVJRCB3aWxsIGJlIGdlbmVyYXRlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge1F1ZXJ5T3JFeHByZXNzaW9ufSBxdWVyeU9yRXhwcmVzc2lvblxuICogQHBhcmFtIHtvYmplY3R9IFtxdWVyeU9wdGlvbnNdXG4gKiBAcGFyYW0ge3N0cmluZ30gW3F1ZXJ5SWRdXG4gKiBAcGFyYW0ge1F1ZXJ5QnVpbGRlcn0gW3F1ZXJ5QnVpbGRlcl1cbiAqIEByZXR1cm5zIHtRdWVyeX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUXVlcnkocXVlcnlPckV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucywgcXVlcnlJZCwgcXVlcnlCdWlsZGVyKSB7XG4gICAgaWYgKHR5cGVvZiBxdWVyeU9yRXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbihxdWVyeUJ1aWxkZXIpLCBxdWVyeU9wdGlvbnMsIHF1ZXJ5SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBxdWVyeSA9IHF1ZXJ5T3JFeHByZXNzaW9uO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IG9wdGlvbnM7XG4gICAgICAgIGlmIChpc09iamVjdChxdWVyeSkgJiYgcXVlcnkuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKHF1ZXJ5LmlkICYmICFxdWVyeU9wdGlvbnMgJiYgIXF1ZXJ5SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBxdWVyeU9wdGlvbnMgfHwgcXVlcnkub3B0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChxdWVyeU9yRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFF1ZXJ5VGVybSkge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBxdWVyeU9yRXhwcmVzc2lvbi50b1F1ZXJ5RXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gcXVlcnlPckV4cHJlc3Npb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHRpb25zID0gcXVlcnlPcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZCA9IHF1ZXJ5SWQgfHwgT3JiaXQudXVpZCgpO1xuICAgICAgICByZXR1cm4geyBleHByZXNzaW9uLCBvcHRpb25zLCBpZCB9O1xuICAgIH1cbn0iXX0=