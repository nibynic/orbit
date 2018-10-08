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
        let query = queryOrExpression;
        let expression;
        let options;
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
        let id = queryId || Orbit.uuid();
        return { expression, options, id };
    }
}