"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FindRecordsTerm = exports.FindRelatedRecordsTerm = exports.FindRelatedRecordTerm = exports.FindRecordTerm = exports.QueryTerm = undefined;

var _utils = require("@orbit/utils");

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
var QueryTerm = exports.QueryTerm = function () {
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
var FindRecordTerm = exports.FindRecordTerm = function (_QueryTerm) {
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
var FindRelatedRecordTerm = exports.FindRelatedRecordTerm = function (_QueryTerm2) {
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
var FindRelatedRecordsTerm = exports.FindRelatedRecordsTerm = function (_QueryTerm3) {
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
var FindRecordsTerm = exports.FindRecordsTerm = function (_QueryTerm4) {
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
    if ((0, _utils.isObject)(filterSpecifier)) {
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
    if ((0, _utils.isObject)(sortSpecifier)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LXRlcm0uanMiXSwibmFtZXMiOlsiZXhwcmVzc2lvbiIsIm9wIiwicmVjb3JkIiwicmVsYXRpb25zaGlwIiwidHlwZSIsInNvcnRTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlclNwZWNpZmllcnMiLCJleHByZXNzaW9ucyIsImlzT2JqZWN0IiwicyIsInBhcnNlU29ydFNwZWNpZmllclN0cmluZyIsImF0dHJpYnV0ZSIsIm9yZGVyIiwic29ydFNwZWNpZmllciIsImtpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7Ozs7O0FBT0EsSUFBQSxnQ0FBQSxZQUFBO0FBQ0ksYUFBQSxTQUFBLENBQUEsVUFBQSxFQUF3QjtBQUFBLHdCQUFBLElBQUEsRUFBQSxTQUFBOztBQUNwQixhQUFBLFVBQUEsR0FBQSxVQUFBO0FBQ0g7O0FBSEwsY0FBQSxTQUFBLENBQUEsaUJBQUEsR0FBQSxTQUFBLGlCQUFBLEdBSXdCO0FBQ2hCLGVBQU8sS0FBUCxVQUFBO0FBTFIsS0FBQTs7QUFBQSxXQUFBLFNBQUE7QUFBQSxDQUFBLEVBQUE7QUFRQTs7Ozs7OztBQU9BLElBQUEsMENBQUEsVUFBQSxVQUFBLEVBQUE7QUFBQSxjQUFBLGNBQUEsRUFBQSxVQUFBOztBQUNJLGFBQUEsY0FBQSxDQUFBLE1BQUEsRUFBb0I7QUFBQSx3QkFBQSxJQUFBLEVBQUEsY0FBQTs7QUFDaEIsWUFBSUEsYUFBYTtBQUNiQyxnQkFEYSxZQUFBO0FBRWJDLG9CQUFBQTtBQUZhLFNBQWpCO0FBRGdCLGVBQUEsMkJBQUEsSUFBQSxFQUtoQixXQUFBLElBQUEsQ0FBQSxJQUFBLEVBTGdCLFVBS2hCLENBTGdCLENBQUE7QUFNbkI7O0FBUEwsV0FBQSxjQUFBO0FBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQTtBQVNBLElBQUEsd0RBQUEsVUFBQSxXQUFBLEVBQUE7QUFBQSxjQUFBLHFCQUFBLEVBQUEsV0FBQTs7QUFDSSxhQUFB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QUEsTUFBSixHQUFBLEVBQThCO0FBQzFCRixvQkFBWUUsY0FBQUEsS0FBQUEsQ0FBWkYsQ0FBWUUsQ0FBWkY7QUFDQUMsZ0JBQUFBLFlBQUFBO0FBRkosS0FBQSxNQUdPO0FBQ0hELG9CQUFBQSxhQUFBQTtBQUNBQyxnQkFBQUEsV0FBQUE7QUFDSDtBQUNELFdBQU87QUFDSEUsY0FERyxXQUFBO0FBRUhILG1CQUZHLFNBQUE7QUFHSEMsZUFBQUE7QUFIRyxLQUFQO0FBS0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vKipcbiAqIFF1ZXJ5IHRlcm1zIGFyZSB1c2VkIGJ5IHF1ZXJ5IGJ1aWxkZXJzIHRvIGFsbG93IGZvciB0aGUgY29uc3RydWN0aW9uIG9mXG4gKiBxdWVyeSBleHByZXNzaW9ucyBpbiBjb21wb3NhYmxlIHBhdHRlcm5zLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBRdWVyeVRlcm1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5VGVybSB7XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbiAgICB0b1F1ZXJ5RXhwcmVzc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwcmVzc2lvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgcXVlcnkgdGVybSByZXByZXNlbnRpbmcgYSBzaW5nbGUgcmVjb3JkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBGaW5kUmVjb3JkVGVybVxuICogQGV4dGVuZHMge1F1ZXJ5VGVybX1cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbmRSZWNvcmRUZXJtIGV4dGVuZHMgUXVlcnlUZXJtIHtcbiAgICBjb25zdHJ1Y3RvcihyZWNvcmQpIHtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSB7XG4gICAgICAgICAgICBvcDogJ2ZpbmRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaW5kUmVsYXRlZFJlY29yZFRlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIoZXhwcmVzc2lvbik7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0ge1xuICAgICAgICAgICAgb3A6ICdmaW5kUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKGV4cHJlc3Npb24pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGaW5kUmVjb3Jkc1Rlcm0gZXh0ZW5kcyBRdWVyeVRlcm0ge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSB7XG4gICAgICAgICAgICBvcDogJ2ZpbmRSZWNvcmRzJyxcbiAgICAgICAgICAgIHR5cGVcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIoZXhwcmVzc2lvbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgc29ydGluZyB0byBhIGNvbGxlY3Rpb24gcXVlcnkuXG4gICAgICpcbiAgICAgKiBTb3J0IHNwZWNpZmllcnMgY2FuIGJlIGV4cHJlc3NlZCBpbiBvYmplY3QgZm9ybSwgbGlrZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogeyBhdHRyaWJ1dGU6ICduYW1lJywgb3JkZXI6ICdkZXNjZW5kaW5nJyB9XG4gICAgICogeyBhdHRyaWJ1dGU6ICduYW1lJywgb3JkZXI6ICdhc2NlbmRpbmcnIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIE9yIGluIHN0cmluZyBmb3JtLCBsaWtlOlxuICAgICAqXG4gICAgICogYGBgdHNcbiAgICAgKiAnLW5hbWUnIC8vIGRlc2NlbmRpbmcgb3JkZXJcbiAgICAgKiAnbmFtZScgIC8vIGFzY2VuZGluZyBvcmRlclxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtTb3J0U3BlY2lmaWVyW10gfCBzdHJpbmdbXX0gc29ydFNwZWNpZmllcnNcbiAgICAgKiBAcmV0dXJucyB7UmVjb3Jkc1Rlcm19XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgUmVjb3Jkc1Rlcm1cbiAgICAgKi9cbiAgICBzb3J0KC4uLnNvcnRTcGVjaWZpZXJzKSB7XG4gICAgICAgIGNvbnN0IHNwZWNpZmllcnMgPSBzb3J0U3BlY2lmaWVycy5tYXAocGFyc2VTb3J0U3BlY2lmaWVyKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uLnNvcnQgPSAodGhpcy5leHByZXNzaW9uLnNvcnQgfHwgW10pLmNvbmNhdChzcGVjaWZpZXJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgcGFnaW5hdGlvbiB0byBhIGNvbGxlY3Rpb24gcXVlcnkuXG4gICAgICpcbiAgICAgKiBOb3RlOiBPcHRpb25zIGFyZSBjdXJyZW50bHkgYW4gb3BhcXVlIHBhc3MtdGhyb3VnaCB0byByZW1vdGUgc291cmNlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXG4gICAgICovXG4gICAgcGFnZShvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbi5wYWdlID0gb3B0aW9ucztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFwcGx5IGFuIGFkdmFuY2VkIGZpbHRlciBleHByZXNzaW9uIGJhc2VkIG9uIGEgYFJlY29yZEN1cnNvcmAuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIGBgYHRzXG4gICAgICogb3FiXG4gICAgICogICAucmVjb3JkcygncGxhbmV0JylcbiAgICAgKiAgIC5maWx0ZXIocmVjb3JkID0+XG4gICAgICogICAgIG9xYi5vcihcbiAgICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ0p1cGl0ZXInKSxcbiAgICAgKiAgICAgICByZWNvcmQuYXR0cmlidXRlKCduYW1lJykuZXF1YWwoJ1BsdXRvJylcbiAgICAgKiAgICAgKVxuICAgICAqICAgKVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHsoUmVjb3JkQ3Vyc29yKSA9PiB2b2lkfSBwcmVkaWNhdGVFeHByZXNzaW9uXG4gICAgICogQHJldHVybnMge1JlY29yZHNUZXJtfVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFJlY29yZHNUZXJtXG4gICAgICovXG4gICAgZmlsdGVyKC4uLmZpbHRlclNwZWNpZmllcnMpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBmaWx0ZXJTcGVjaWZpZXJzLm1hcChwYXJzZUZpbHRlclNwZWNpZmllcik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbi5maWx0ZXIgPSAodGhpcy5leHByZXNzaW9uLmZpbHRlciB8fCBbXSkuY29uY2F0KGZpbHRlclNwZWNpZmllcnMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5mdW5jdGlvbiBwYXJzZUZpbHRlclNwZWNpZmllcihmaWx0ZXJTcGVjaWZpZXIpIHtcbiAgICBpZiAoaXNPYmplY3QoZmlsdGVyU3BlY2lmaWVyKSkge1xuICAgICAgICBsZXQgcyA9IGZpbHRlclNwZWNpZmllcjtcbiAgICAgICAgaWYgKCFzLmtpbmQpIHtcbiAgICAgICAgICAgIGlmIChzLmhhc093blByb3BlcnR5KCdyZWxhdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuaGFzT3duUHJvcGVydHkoJ3JlY29yZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHMua2luZCA9ICdyZWxhdGVkUmVjb3JkJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHMuaGFzT3duUHJvcGVydHkoJ3JlY29yZHMnKSkge1xuICAgICAgICAgICAgICAgICAgICBzLmtpbmQgPSAncmVsYXRlZFJlY29yZHMnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcy5raW5kID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcy5vcCA9IHMub3AgfHwgJ2VxdWFsJztcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufVxuZnVuY3Rpb24gcGFyc2VTb3J0U3BlY2lmaWVyKHNvcnRTcGVjaWZpZXIpIHtcbiAgICBpZiAoaXNPYmplY3Qoc29ydFNwZWNpZmllcikpIHtcbiAgICAgICAgbGV0IHMgPSBzb3J0U3BlY2lmaWVyO1xuICAgICAgICBzLmtpbmQgPSBzLmtpbmQgfHwgJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHMub3JkZXIgPSBzLm9yZGVyIHx8ICdhc2NlbmRpbmcnO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3J0U3BlY2lmaWVyID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gcGFyc2VTb3J0U3BlY2lmaWVyU3RyaW5nKHNvcnRTcGVjaWZpZXIpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvcnQgZXhwcmVzc2lvbiBtdXN0IGJlIGVpdGhlciBhbiBvYmplY3Qgb3IgYSBzdHJpbmcuJyk7XG59XG5mdW5jdGlvbiBwYXJzZVNvcnRTcGVjaWZpZXJTdHJpbmcoc29ydFNwZWNpZmllcikge1xuICAgIGxldCBhdHRyaWJ1dGU7XG4gICAgbGV0IG9yZGVyO1xuICAgIGlmIChzb3J0U3BlY2lmaWVyWzBdID09PSAnLScpIHtcbiAgICAgICAgYXR0cmlidXRlID0gc29ydFNwZWNpZmllci5zbGljZSgxKTtcbiAgICAgICAgb3JkZXIgPSAnZGVzY2VuZGluZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cmlidXRlID0gc29ydFNwZWNpZmllcjtcbiAgICAgICAgb3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGF0dHJpYnV0ZSxcbiAgICAgICAgb3JkZXJcbiAgICB9O1xufSJdfQ==