'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FindRecordsTerm = exports.FindRelatedRecordsTerm = exports.FindRelatedRecordTerm = exports.FindRecordTerm = exports.QueryTerm = undefined;

var _utils = require('@orbit/utils');

/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
class QueryTerm {
    constructor(expression) {
        this.expression = expression;
    }
    toQueryExpression() {
        return this.expression;
    }
}
exports.QueryTerm = QueryTerm; /**
                                * A query term representing a single record.
                                *
                                * @export
                                * @class FindRecordTerm
                                * @extends {QueryTerm}
                                */

class FindRecordTerm extends QueryTerm {
    constructor(record) {
        let expression = {
            op: 'findRecord',
            record
        };
        super(expression);
    }
}
exports.FindRecordTerm = FindRecordTerm;
class FindRelatedRecordTerm extends QueryTerm {
    constructor(record, relationship) {
        let expression = {
            op: 'findRelatedRecord',
            record,
            relationship
        };
        super(expression);
    }
}
exports.FindRelatedRecordTerm = FindRelatedRecordTerm;
class FindRelatedRecordsTerm extends QueryTerm {
    constructor(record, relationship) {
        let expression = {
            op: 'findRelatedRecords',
            record,
            relationship
        };
        super(expression);
    }
}
exports.FindRelatedRecordsTerm = FindRelatedRecordsTerm;
class FindRecordsTerm extends QueryTerm {
    constructor(type) {
        let expression = {
            op: 'findRecords',
            type
        };
        super(expression);
    }
    /**
     * Applies sorting to a collection query.
     *
     * Sort specifiers can be expressed in object form, like:
     *
     * ```ts
     * { attribute: 'name', order: 'descending' }
     * { attribute: 'name', order: 'ascending' }
     * ```
     *
     * Or in string form, like:
     *
     * ```ts
     * '-name' // descending order
     * 'name'  // ascending order
     * ```
     *
     * @param {SortSpecifier[] | string[]} sortSpecifiers
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    sort(...sortSpecifiers) {
        const specifiers = sortSpecifiers.map(parseSortSpecifier);
        this.expression.sort = (this.expression.sort || []).concat(specifiers);
        return this;
    }
    /**
     * Applies pagination to a collection query.
     *
     * Note: Options are currently an opaque pass-through to remote sources.
     *
     * @param {object} options
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    page(options) {
        this.expression.page = options;
        return this;
    }
    /**
     * Apply an advanced filter expression based on a `RecordCursor`.
     *
     * For example:
     *
     * ```ts
     * oqb
     *   .records('planet')
     *   .filter(record =>
     *     oqb.or(
     *       record.attribute('name').equal('Jupiter'),
     *       record.attribute('name').equal('Pluto')
     *     )
     *   )
     * ```
     *
     * @param {(RecordCursor) => void} predicateExpression
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */
    filter(...filterSpecifiers) {
        const expressions = filterSpecifiers.map(parseFilterSpecifier);
        this.expression.filter = (this.expression.filter || []).concat(filterSpecifiers);
        return this;
    }
}
exports.FindRecordsTerm = FindRecordsTerm;
function parseFilterSpecifier(filterSpecifier) {
    if ((0, _utils.isObject)(filterSpecifier)) {
        let s = filterSpecifier;
        if (!s.kind) {
            if (s.hasOwnProperty('relation')) {
                if (s.hasOwnProperty('record')) {
                    s.kind = 'relatedRecord';
                } else if (s.hasOwnProperty('records')) {
                    s.kind = 'relatedRecords';
                }
            } else {
                s.kind = 'attribute';
            }
        }
        s.op = s.op || 'equal';
        return s;
    }
}
function parseSortSpecifier(sortSpecifier) {
    if ((0, _utils.isObject)(sortSpecifier)) {
        let s = sortSpecifier;
        s.kind = s.kind || 'attribute';
        s.order = s.order || 'ascending';
        return s;
    } else if (typeof sortSpecifier === 'string') {
        return parseSortSpecifierString(sortSpecifier);
    }
    throw new Error('Sort expression must be either an object or a string.');
}
function parseSortSpecifierString(sortSpecifier) {
    let attribute;
    let order;
    if (sortSpecifier[0] === '-') {
        attribute = sortSpecifier.slice(1);
        order = 'descending';
    } else {
        attribute = sortSpecifier;
        order = 'ascending';
    }
    return {
        kind: 'attribute',
        attribute,
        order
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LXRlcm0uanMiXSwibmFtZXMiOlsiUXVlcnlUZXJtIiwiY29uc3RydWN0b3IiLCJleHByZXNzaW9uIiwidG9RdWVyeUV4cHJlc3Npb24iLCJGaW5kUmVjb3JkVGVybSIsInJlY29yZCIsIm9wIiwiRmluZFJlbGF0ZWRSZWNvcmRUZXJtIiwicmVsYXRpb25zaGlwIiwiRmluZFJlbGF0ZWRSZWNvcmRzVGVybSIsIkZpbmRSZWNvcmRzVGVybSIsInR5cGUiLCJzb3J0Iiwic29ydFNwZWNpZmllcnMiLCJzcGVjaWZpZXJzIiwibWFwIiwicGFyc2VTb3J0U3BlY2lmaWVyIiwiY29uY2F0IiwicGFnZSIsIm9wdGlvbnMiLCJmaWx0ZXIiLCJmaWx0ZXJTcGVjaWZpZXJzIiwiZXhwcmVzc2lvbnMiLCJwYXJzZUZpbHRlclNwZWNpZmllciIsImZpbHRlclNwZWNpZmllciIsInMiLCJraW5kIiwiaGFzT3duUHJvcGVydHkiLCJzb3J0U3BlY2lmaWVyIiwib3JkZXIiLCJwYXJzZVNvcnRTcGVjaWZpZXJTdHJpbmciLCJFcnJvciIsImF0dHJpYnV0ZSIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7QUFPTyxNQUFNQSxTQUFOLENBQWdCO0FBQ25CQyxnQkFBWUMsVUFBWixFQUF3QjtBQUNwQixhQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIO0FBQ0RDLHdCQUFvQjtBQUNoQixlQUFPLEtBQUtELFVBQVo7QUFDSDtBQU5rQjtRQUFWRixTLEdBQUFBLFMsRUFRYjs7Ozs7Ozs7QUFPTyxNQUFNSSxjQUFOLFNBQTZCSixTQUE3QixDQUF1QztBQUMxQ0MsZ0JBQVlJLE1BQVosRUFBb0I7QUFDaEIsWUFBSUgsYUFBYTtBQUNiSSxnQkFBSSxZQURTO0FBRWJEO0FBRmEsU0FBakI7QUFJQSxjQUFNSCxVQUFOO0FBQ0g7QUFQeUM7UUFBakNFLGMsR0FBQUEsYztBQVNOLE1BQU1HLHFCQUFOLFNBQW9DUCxTQUFwQyxDQUE4QztBQUNqREMs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SDtBQUNELFVBQU0sSUFBSUcsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDSDtBQUNELFNBQVNELHdCQUFULENBQWtDRixhQUFsQyxFQUFpRDtBQUM3QyxRQUFJSSxTQUFKO0FBQ0EsUUFBSUgsS0FBSjtBQUNBLFFBQUlELGNBQWMsQ0FBZCxNQUFxQixHQUF6QixFQUE4QjtBQUMxQkksb0JBQVlKLGNBQWNLLEtBQWQsQ0FBb0IsQ0FBcEIsQ0FBWjtBQUNBSixnQkFBUSxZQUFSO0FBQ0gsS0FIRCxNQUdPO0FBQ0hHLG9CQUFZSixhQUFaO0FBQ0FDLGdCQUFRLFdBQVI7QUFDSDtBQUNELFdBQU87QUFDSEgsY0FBTSxXQURIO0FBRUhNLGlCQUZHO0FBR0hIO0FBSEcsS0FBUDtBQUtIIiwiZmlsZSI6InF1ZXJ5LXRlcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vKipcbiAqIFF1ZXJ5IHRlcm1zIGFyZSB1c2VkIGJ5IHF1ZXJ5IGJ1aWxkZXJzIHRvIGFsbG93IGZvciB0aGUgY29uc3RydWN0aW9uIG9mXG4gKiBxdWVyeSBleHByZXNzaW9ucyBpbiBjb21wb3NhYmxlIHBhdHRlcm5zLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBRdWVyeVRlcm1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5VGVybSB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgICB0b1F1ZXJ5RXhwcmVzc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwcmVzc2lvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgcXVlcnkgdGVybSByZXByZXNlbnRpbmcgYSBzaW5nbGUgcmVjb3JkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBGaW5kUmVjb3JkVGVybVxuICogQGV4dGVuZHMge1F1ZXJ5VGVybX1cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbmRSZWNvcmRUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcbiAgICBjb25zdHJ1Y3RvcihyZWNvcmQpIHtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSB7XG4gICAgICAgICAgICBvcDogJ2ZpbmRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaW5kUmVsYXRlZFJlY29yZFRlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIoZXhwcmVzc2lvbik7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaW5kUmVjb3Jkc1Rlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSB7XG4gICAgICAgICAgICBvcDogJ2ZpbmRSZWNvcmRzJyxcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIoZXhwcmVzc2lvbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgc29ydGluZyB0byBhIGNvbGxlY3Rpb24gcXVlcnkuXG4gICAgICpcbiAgICAgKiBTb3J0IHNwZWNpZmllcnMgY2FuIGJlIGV4cHJlc3NlZCBpbiBvYmplY3QgZm9ybSwgbGlrZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogeyBhdHRyaWJ1dGU6ICduYW1lJywgb3JkZXI6ICdkZXNjZW5kaW5nJyB9XG4gICAgICogeyBhdHRyaWJ1dGU6ICduYW1lJywgb3JkZXI6ICdhc2NlbmRpbmcnIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIE9yIGluIHN0cmluZyBmb3JtLCBsaWtlOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiAnLW5hbWUnIC8vIGRlc2NlbmRpbmcgb3JkZXJcbiAgICAgKiAnbmFtZScgIC8vIGFzY2VuZGluZyBvcmRlclxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb3J0U3BlY2lmaWVyW10gfCBzdHJpbmdbXX0gc29ydFNwZWNpZmllcnNcbiAgICAgKiBAcmV0dXJucyB7UmVjb3Jkc1Rlcm19XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgUmVjb3Jkc1Rlcm1cbiAgICAgKi9cbiAgICBzb3J0KC4uLnNvcnRTcGVjaWZpZXJzKSB7XG4gICAgICAgIGNvbnN0IHNwZWNpZmllcnMgPSBzb3J0U3BlY2lmaWVycy5tYXAocGFyc2VTb3J0U3BlY2lmaWVyKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uLnNvcnQgPSAodGhpcy5leHByZXNzaW9uLnNvcnQgfHwgW10pLmNvbmNhdChzcGVjaWZpZXJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgcGFnaW5hdGlvbiB0byBhIGNvbGxlY3Rpb24gcXVlcnkuXG4gICAgICpcbiAgICAgKiBOb3RlOiBPcHRpb25zIGFyZSBjdXJyZW50bHkgYW4gb3BhcXVlIHBhc3MtdGhyb3VnaCB0byByZW1vdGUgc291cmNlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXG4gICAgICovXG4gICAgcGFnZShvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbi5wYWdlID0gb3B0aW9ucztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGx5IGFuIGFkdmFuY2VkIGZpbHRlciBleHByZXNzaW9uIGJhc2VkIG9uIGEgYFJlY29yZEN1cnNvcmAuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogb3FiXG4gICAgICogICAucmVjb3JkcygncGxhbmV0JylcbiAgICAgKiAgIC5maWx0ZXIocmVjb3JkID0+XG4gICAgICogICAgIG9xYi5vcihcbiAgICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ0p1cGl0ZXInKSxcbiAgICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ1BsdXRvJylcbiAgICAgKiAgICAgKVxuICAgICAqICAgKVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHsoUmVjb3JkQ3Vyc29yKSA9PiB2b2lkfSBwcmVkaWNhdGVFeHByZXNzaW9uXG4gICAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXG4gICAgICovXG4gICAgZmlsdGVyKC4uLmZpbHRlclNwZWNpZmllcnMpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBmaWx0ZXJTcGVjaWZpZXJzLm1hcChwYXJzZUZpbHRlclNwZWNpZmllcik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbi5maWx0ZXIgPSAodGhpcy5leHByZXNzaW9uLmZpbHRlciB8fCBbXSkuY29uY2F0KGZpbHRlclNwZWNpZmllcnMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5mdW5jdGlvbiBwYXJzZUZpbHRlclNwZWNpZmllcihmaWx0ZXJTcGVjaWZpZXIpIHtcbiAgICBpZiAoaXNPYmplY3QoZmlsdGVyU3BlY2lmaWVyKSkge1xuICAgICAgICBsZXQgcyA9IGZpbHRlclNwZWNpZmllcjtcbiAgICAgICAgaWYgKCFzLmtpbmQpIHtcbiAgICAgICAgICAgIGlmIChzLmhhc093blByb3BlcnR5KCdyZWxhdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaGFzT3duUHJvcGVydHkoJ3JlY29yZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHMua2luZCA9ICdyZWxhdGVkUmVjb3JkJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHMuaGFzT3duUHJvcGVydHkoJ3JlY29yZHMnKSkge1xuICAgICAgICAgICAgICAgICAgICBzLmtpbmQgPSAncmVsYXRlZFJlY29yZHMnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcy5raW5kID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcy5vcCA9IHMub3AgfHwgJ2VxdWFsJztcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufVxuZnVuY3Rpb24gcGFyc2VTb3J0U3BlY2lmaWVyKHNvcnRTcGVjaWZpZXIpIHtcbiAgICBpZiAoaXNPYmplY3Qoc29ydFNwZWNpZmllcikpIHtcbiAgICAgICAgbGV0IHMgPSBzb3J0U3BlY2lmaWVyO1xuICAgICAgICBzLmtpbmQgPSBzLmtpbmQgfHwgJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHMub3JkZXIgPSBzLm9yZGVyIHx8ICdhc2NlbmRpbmcnO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3J0U3BlY2lmaWVyID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gcGFyc2VTb3J0U3BlY2lmaWVyU3RyaW5nKHNvcnRTcGVjaWZpZXIpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvcnQgZXhwcmVzc2lvbiBtdXN0IGJlIGVpdGhlciBhbiBvYmplY3Qgb3IgYSBzdHJpbmcuJyk7XG59XG5mdW5jdGlvbiBwYXJzZVNvcnRTcGVjaWZpZXJTdHJpbmcoc29ydFNwZWNpZmllcikge1xuICAgIGxldCBhdHRyaWJ1dGU7XG4gICAgbGV0IG9yZGVyO1xuICAgIGlmIChzb3J0U3BlY2lmaWVyWzBdID09PSAnLScpIHtcbiAgICAgICAgYXR0cmlidXRlID0gc29ydFNwZWNpZmllci5zbGljZSgxKTtcbiAgICAgICAgb3JkZXIgPSAnZGVzY2VuZGluZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cmlidXRlID0gc29ydFNwZWNpZmllcjtcbiAgICAgICAgb3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGF0dHJpYnV0ZSxcbiAgICAgICAgb3JkZXJcbiAgICB9O1xufSJdfQ==