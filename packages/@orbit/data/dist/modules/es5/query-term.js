function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { isObject } from '@orbit/utils';
/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
export var QueryTerm = function () {
    function QueryTerm(expression) {
        _classCallCheck(this, QueryTerm);

        this.expression = expression;
    }

    QueryTerm.prototype.toQueryExpression = function toQueryExpression() {
        return this.expression;
    };

    return QueryTerm;
}();
/**
 * A query term representing a single record.
 *
 * @export
 * @class FindRecordTerm
 * @extends {QueryTerm}
 */
export var FindRecordTerm = function (_QueryTerm) {
    _inherits(FindRecordTerm, _QueryTerm);

    function FindRecordTerm(record) {
        _classCallCheck(this, FindRecordTerm);

        var expression = {
            op: 'findRecord',
            record: record
        };
        return _possibleConstructorReturn(this, _QueryTerm.call(this, expression));
    }

    return FindRecordTerm;
}(QueryTerm);
export var FindRelatedRecordTerm = function (_QueryTerm2) {
    _inherits(FindRelatedRecordTerm, _QueryTerm2);

    function FindRelatedRecordTerm(record, relationship) {
        _classCallCheck(this, FindRelatedRecordTerm);

        var expression = {
            op: 'findRelatedRecord',
            record: record,
            relationship: relationship
        };
        return _possibleConstructorReturn(this, _QueryTerm2.call(this, expression));
    }

    return FindRelatedRecordTerm;
}(QueryTerm);
export var FindRelatedRecordsTerm = function (_QueryTerm3) {
    _inherits(FindRelatedRecordsTerm, _QueryTerm3);

    function FindRelatedRecordsTerm(record, relationship) {
        _classCallCheck(this, FindRelatedRecordsTerm);

        var expression = {
            op: 'findRelatedRecords',
            record: record,
            relationship: relationship
        };
        return _possibleConstructorReturn(this, _QueryTerm3.call(this, expression));
    }

    return FindRelatedRecordsTerm;
}(QueryTerm);
export var FindRecordsTerm = function (_QueryTerm4) {
    _inherits(FindRecordsTerm, _QueryTerm4);

    function FindRecordsTerm(type) {
        _classCallCheck(this, FindRecordsTerm);

        var expression = {
            op: 'findRecords',
            type: type
        };
        return _possibleConstructorReturn(this, _QueryTerm4.call(this, expression));
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


    FindRecordsTerm.prototype.sort = function sort() {
        for (var _len = arguments.length, sortSpecifiers = Array(_len), _key = 0; _key < _len; _key++) {
            sortSpecifiers[_key] = arguments[_key];
        }

        var specifiers = sortSpecifiers.map(parseSortSpecifier);
        this.expression.sort = (this.expression.sort || []).concat(specifiers);
        return this;
    };
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


    FindRecordsTerm.prototype.page = function page(options) {
        this.expression.page = options;
        return this;
    };
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


    FindRecordsTerm.prototype.filter = function filter() {
        for (var _len2 = arguments.length, filterSpecifiers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            filterSpecifiers[_key2] = arguments[_key2];
        }

        var expressions = filterSpecifiers.map(parseFilterSpecifier);
        this.expression.filter = (this.expression.filter || []).concat(filterSpecifiers);
        return this;
    };

    return FindRecordsTerm;
}(QueryTerm);
function parseFilterSpecifier(filterSpecifier) {
    if (isObject(filterSpecifier)) {
        var s = filterSpecifier;
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
    if (isObject(sortSpecifier)) {
        var s = sortSpecifier;
        s.kind = s.kind || 'attribute';
        s.order = s.order || 'ascending';
        return s;
    } else if (typeof sortSpecifier === 'string') {
        return parseSortSpecifierString(sortSpecifier);
    }
    throw new Error('Sort expression must be either an object or a string.');
}
function parseSortSpecifierString(sortSpecifier) {
    var attribute = void 0;
    var order = void 0;
    if (sortSpecifier[0] === '-') {
        attribute = sortSpecifier.slice(1);
        order = 'descending';
    } else {
        attribute = sortSpecifier;
        order = 'ascending';
    }
    return {
        kind: 'attribute',
        attribute: attribute,
        order: order
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LXRlcm0uanMiXSwibmFtZXMiOlsiaXNPYmplY3QiLCJRdWVyeVRlcm0iLCJleHByZXNzaW9uIiwidG9RdWVyeUV4cHJlc3Npb24iLCJGaW5kUmVjb3JkVGVybSIsInJlY29yZCIsIm9wIiwiRmluZFJlbGF0ZWRSZWNvcmRUZXJtIiwicmVsYXRpb25zaGlwIiwiRmluZFJlbGF0ZWRSZWNvcmRzVGVybSIsIkZpbmRSZWNvcmRzVGVybSIsInR5cGUiLCJzb3J0Iiwic29ydFNwZWNpZmllcnMiLCJzcGVjaWZpZXJzIiwibWFwIiwicGFyc2VTb3J0U3BlY2lmaWVyIiwiY29uY2F0IiwicGFnZSIsIm9wdGlvbnMiLCJmaWx0ZXIiLCJmaWx0ZXJTcGVjaWZpZXJzIiwiZXhwcmVzc2lvbnMiLCJwYXJzZUZpbHRlclNwZWNpZmllciIsImZpbHRlclNwZWNpZmllciIsInMiLCJraW5kIiwiaGFzT3duUHJvcGVydHkiLCJzb3J0U3BlY2lmaWVyIiwib3JkZXIiLCJwYXJzZVNvcnRTcGVjaWZpZXJTdHJpbmciLCJFcnJvciIsImF0dHJpYnV0ZSIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLFFBQVQsUUFBeUIsY0FBekI7QUFDQTs7Ozs7OztBQU9BLFdBQWFDLFNBQWI7QUFDSSx1QkFBWUMsVUFBWixFQUF3QjtBQUFBOztBQUNwQixhQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztBQUhMLHdCQUlJQyxpQkFKSixnQ0FJd0I7QUFDaEIsZUFBTyxLQUFLRCxVQUFaO0FBQ0gsS0FOTDs7QUFBQTtBQUFBO0FBUUE7Ozs7Ozs7QUFPQSxXQUFhRSxjQUFiO0FBQUE7O0FBQ0ksNEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDaEIsWUFBSUgsYUFBYTtBQUNiSSxnQkFBSSxZQURTO0FBRWJEO0FBRmEsU0FBakI7QUFEZ0IsZ0RBS2hCLHNCQUFNSCxVQUFOLENBTGdCO0FBTW5COztBQVBMO0FBQUEsRUFBb0NELFNBQXBDO0FBU0EsV0FBYU0s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RixHQUFTRCxFQUFFQyxJQUFGLElBQVUsV0FBbkI7QUFDQUQsVUFBRUksS0FBRixHQUFVSixFQUFFSSxLQUFGLElBQVcsV0FBckI7QUFDQSxlQUFPSixDQUFQO0FBQ0gsS0FMRCxNQUtPLElBQUksT0FBT0csYUFBUCxLQUF5QixRQUE3QixFQUF1QztBQUMxQyxlQUFPRSx5QkFBeUJGLGFBQXpCLENBQVA7QUFDSDtBQUNELFVBQU0sSUFBSUcsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDSDtBQUNELFNBQVNELHdCQUFULENBQWtDRixhQUFsQyxFQUFpRDtBQUM3QyxRQUFJSSxrQkFBSjtBQUNBLFFBQUlILGNBQUo7QUFDQSxRQUFJRCxjQUFjLENBQWQsTUFBcUIsR0FBekIsRUFBOEI7QUFDMUJJLG9CQUFZSixjQUFjSyxLQUFkLENBQW9CLENBQXBCLENBQVo7QUFDQUosZ0JBQVEsWUFBUjtBQUNILEtBSEQsTUFHTztBQUNIRyxvQkFBWUosYUFBWjtBQUNBQyxnQkFBUSxXQUFSO0FBQ0g7QUFDRCxXQUFPO0FBQ0hILGNBQU0sV0FESDtBQUVITSw0QkFGRztBQUdISDtBQUhHLEtBQVA7QUFLSCIsImZpbGUiOiJxdWVyeS10ZXJtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBRdWVyeSB0ZXJtcyBhcmUgdXNlZCBieSBxdWVyeSBidWlsZGVycyB0byBhbGxvdyBmb3IgdGhlIGNvbnN0cnVjdGlvbiBvZlxuICogcXVlcnkgZXhwcmVzc2lvbnMgaW4gY29tcG9zYWJsZSBwYXR0ZXJucy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUXVlcnlUZXJtXG4gKi9cbmV4cG9ydCBjbGFzcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICB9XG4gICAgdG9RdWVyeUV4cHJlc3Npb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cHJlc3Npb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHF1ZXJ5IHRlcm0gcmVwcmVzZW50aW5nIGEgc2luZ2xlIHJlY29yZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgRmluZFJlY29yZFRlcm1cbiAqIEBleHRlbmRzIHtRdWVyeVRlcm19XG4gKi9cbmV4cG9ydCBjbGFzcyBGaW5kUmVjb3JkVGVybSBleHRlbmRzIFF1ZXJ5VGVybSB7XG4gICAgY29uc3RydWN0b3IocmVjb3JkKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZFxuICAgICAgICB9O1xuICAgICAgICBzdXBlcihleHByZXNzaW9uKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgRmluZFJlbGF0ZWRSZWNvcmRUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcbiAgICBjb25zdHJ1Y3RvcihyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IHtcbiAgICAgICAgICAgIG9wOiAnZmluZFJlbGF0ZWRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcbiAgICBjb25zdHJ1Y3RvcihyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IHtcbiAgICAgICAgICAgIG9wOiAnZmluZFJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcFxuICAgICAgICB9O1xuICAgICAgICBzdXBlcihleHByZXNzaW9uKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgRmluZFJlY29yZHNUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVjb3JkcycsXG4gICAgICAgICAgICB0eXBlXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHNvcnRpbmcgdG8gYSBjb2xsZWN0aW9uIHF1ZXJ5LlxuICAgICAqXG4gICAgICogU29ydCBzcGVjaWZpZXJzIGNhbiBiZSBleHByZXNzZWQgaW4gb2JqZWN0IGZvcm0sIGxpa2U6XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIHsgYXR0cmlidXRlOiAnbmFtZScsIG9yZGVyOiAnZGVzY2VuZGluZycgfVxuICAgICAqIHsgYXR0cmlidXRlOiAnbmFtZScsIG9yZGVyOiAnYXNjZW5kaW5nJyB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBPciBpbiBzdHJpbmcgZm9ybSwgbGlrZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogJy1uYW1lJyAvLyBkZXNjZW5kaW5nIG9yZGVyXG4gICAgICogJ25hbWUnICAvLyBhc2NlbmRpbmcgb3JkZXJcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U29ydFNwZWNpZmllcltdIHwgc3RyaW5nW119IHNvcnRTcGVjaWZpZXJzXG4gICAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXG4gICAgICovXG4gICAgc29ydCguLi5zb3J0U3BlY2lmaWVycykge1xuICAgICAgICBjb25zdCBzcGVjaWZpZXJzID0gc29ydFNwZWNpZmllcnMubWFwKHBhcnNlU29ydFNwZWNpZmllcik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbi5zb3J0ID0gKHRoaXMuZXhwcmVzc2lvbi5zb3J0IHx8IFtdKS5jb25jYXQoc3BlY2lmaWVycyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHBhZ2luYXRpb24gdG8gYSBjb2xsZWN0aW9uIHF1ZXJ5LlxuICAgICAqXG4gICAgICogTm90ZTogT3B0aW9ucyBhcmUgY3VycmVudGx5IGFuIG9wYXF1ZSBwYXNzLXRocm91Z2ggdG8gcmVtb3RlIHNvdXJjZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtSZWNvcmRzVGVybX1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBSZWNvcmRzVGVybVxuICAgICAqL1xuICAgIHBhZ2Uob3B0aW9ucykge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24ucGFnZSA9IG9wdGlvbnM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBseSBhbiBhZHZhbmNlZCBmaWx0ZXIgZXhwcmVzc2lvbiBiYXNlZCBvbiBhIGBSZWNvcmRDdXJzb3JgLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiBgYGB0c1xuICAgICAqIG9xYlxuICAgICAqICAgLnJlY29yZHMoJ3BsYW5ldCcpXG4gICAgICogICAuZmlsdGVyKHJlY29yZCA9PlxuICAgICAqICAgICBvcWIub3IoXG4gICAgICogICAgICAgcmVjb3JkLmF0dHJpYnV0ZSgnbmFtZScpLmVxdWFsKCdKdXBpdGVyJyksXG4gICAgICogICAgICAgcmVjb3JkLmF0dHJpYnV0ZSgnbmFtZScpLmVxdWFsKCdQbHV0bycpXG4gICAgICogICAgIClcbiAgICAgKiAgIClcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KFJlY29yZEN1cnNvcikgPT4gdm9pZH0gcHJlZGljYXRlRXhwcmVzc2lvblxuICAgICAqIEByZXR1cm5zIHtSZWNvcmRzVGVybX1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBSZWNvcmRzVGVybVxuICAgICAqL1xuICAgIGZpbHRlciguLi5maWx0ZXJTcGVjaWZpZXJzKSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gZmlsdGVyU3BlY2lmaWVycy5tYXAocGFyc2VGaWx0ZXJTcGVjaWZpZXIpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24uZmlsdGVyID0gKHRoaXMuZXhwcmVzc2lvbi5maWx0ZXIgfHwgW10pLmNvbmNhdChmaWx0ZXJTcGVjaWZpZXJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZnVuY3Rpb24gcGFyc2VGaWx0ZXJTcGVjaWZpZXIoZmlsdGVyU3BlY2lmaWVyKSB7XG4gICAgaWYgKGlzT2JqZWN0KGZpbHRlclNwZWNpZmllcikpIHtcbiAgICAgICAgbGV0IHMgPSBmaWx0ZXJTcGVjaWZpZXI7XG4gICAgICAgIGlmICghcy5raW5kKSB7XG4gICAgICAgICAgICBpZiAocy5oYXNPd25Qcm9wZXJ0eSgncmVsYXRpb24nKSkge1xuICAgICAgICAgICAgICAgIGlmIChzLmhhc093blByb3BlcnR5KCdyZWNvcmQnKSkge1xuICAgICAgICAgICAgICAgICAgICBzLmtpbmQgPSAncmVsYXRlZFJlY29yZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzLmhhc093blByb3BlcnR5KCdyZWNvcmRzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5raW5kID0gJ3JlbGF0ZWRSZWNvcmRzJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMua2luZCA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHMub3AgPSBzLm9wIHx8ICdlcXVhbCc7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBhcnNlU29ydFNwZWNpZmllcihzb3J0U3BlY2lmaWVyKSB7XG4gICAgaWYgKGlzT2JqZWN0KHNvcnRTcGVjaWZpZXIpKSB7XG4gICAgICAgIGxldCBzID0gc29ydFNwZWNpZmllcjtcbiAgICAgICAgcy5raW5kID0gcy5raW5kIHx8ICdhdHRyaWJ1dGUnO1xuICAgICAgICBzLm9yZGVyID0gcy5vcmRlciB8fCAnYXNjZW5kaW5nJztcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc29ydFNwZWNpZmllciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlU29ydFNwZWNpZmllclN0cmluZyhzb3J0U3BlY2lmaWVyKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb3J0IGV4cHJlc3Npb24gbXVzdCBiZSBlaXRoZXIgYW4gb2JqZWN0IG9yIGEgc3RyaW5nLicpO1xufVxuZnVuY3Rpb24gcGFyc2VTb3J0U3BlY2lmaWVyU3RyaW5nKHNvcnRTcGVjaWZpZXIpIHtcbiAgICBsZXQgYXR0cmlidXRlO1xuICAgIGxldCBvcmRlcjtcbiAgICBpZiAoc29ydFNwZWNpZmllclswXSA9PT0gJy0nKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IHNvcnRTcGVjaWZpZXIuc2xpY2UoMSk7XG4gICAgICAgIG9yZGVyID0gJ2Rlc2NlbmRpbmcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IHNvcnRTcGVjaWZpZXI7XG4gICAgICAgIG9yZGVyID0gJ2FzY2VuZGluZyc7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgIG9yZGVyXG4gICAgfTtcbn0iXX0=