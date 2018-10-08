'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueryOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var EMPTY = function () {};
var QueryOperators = exports.QueryOperators = {
    findRecord: function (cache, expression) {
        var _expression$record = expression.record,
            type = _expression$record.type,
            id = _expression$record.id;

        var record = cache.records(type).get(id);
        if (!record) {
            throw new _data.RecordNotFoundException(type, id);
        }
        return record;
    },
    findRecords: function (cache, expression) {
        var results = Array.from(cache.records(expression.type).values());
        if (expression.filter) {
            results = filterRecords(results, expression.filter);
        }
        if (expression.sort) {
            results = sortRecords(results, expression.sort);
        }
        if (expression.page) {
            results = paginateRecords(results, expression.page);
        }
        return results;
    },
    findRelatedRecords: function (cache, expression) {
        var record = expression.record,
            relationship = expression.relationship;
        var type = record.type,
            id = record.id;

        var currentRecord = cache.records(type).get(id);
        var data = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
        if (!data) {
            return [];
        }
        return data.map(function (r) {
            return cache.records(r.type).get(r.id);
        });
    },
    findRelatedRecord: function (cache, expression) {
        var record = expression.record,
            relationship = expression.relationship;
        var type = record.type,
            id = record.id;

        var currentRecord = cache.records(type).get(id);
        var data = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
        if (!data) {
            return null;
        }
        var r = data;
        return cache.records(r.type).get(r.id);
    }
};
function filterRecords(records, filters) {
    return records.filter(function (record) {
        for (var i = 0, l = filters.length; i < l; i++) {
            if (!applyFilter(record, filters[i])) {
                return false;
            }
        }
        return true;
    });
}
function applyFilter(record, filter) {
    if (filter.kind === 'attribute') {
        var actual = (0, _utils.deepGet)(record, ['attributes', filter.attribute]);
        var expected = filter.value;
        switch (filter.op) {
            case 'equal':
                return actual === expected;
            case 'gt':
                return actual > expected;
            case 'gte':
                return actual >= expected;
            case 'lt':
                return actual < expected;
            case 'lte':
                return actual <= expected;
            default:
                throw new _data.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecords') {
        var relation = (0, _utils.deepGet)(record, ['relationships', filter.relation]);
        var _actual = relation === undefined ? [] : relation.data;
        var _expected = filter.records;
        switch (filter.op) {
            case 'equal':
                return _actual.length === _expected.length && _expected.every(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'all':
                return _expected.every(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'some':
                return _expected.some(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'none':
                return !_expected.some(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            default:
                throw new _data.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecord') {
        var _relation = (0, _utils.deepGet)(record, ["relationships", filter.relation]);
        var _actual2 = _relation === undefined ? undefined : _relation.data;
        var _expected2 = filter.record;
        switch (filter.op) {
            case 'equal':
                if (Array.isArray(_expected2)) {
                    return _actual2 !== undefined && _expected2.some(function (e) {
                        return _actual2.type === e.type && _actual2.id === e.id;
                    });
                } else {
                    return _actual2 !== undefined && _actual2.type === _expected2.type && _actual2.id === _expected2.id;
                }
            default:
                throw new _data.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    }
    return false;
}
function sortRecords(records, sortSpecifiers) {
    var comparisonValues = new Map();
    records.forEach(function (record) {
        comparisonValues.set(record, sortSpecifiers.map(function (sortSpecifier) {
            if (sortSpecifier.kind === 'attribute') {
                return (0, _utils.deepGet)(record, ['attributes', sortSpecifier.attribute]);
            } else {
                throw new _data.QueryExpressionParseError('Sort specifier ${sortSpecifier.kind} not recognized for Store.', sortSpecifier);
            }
        }));
    });
    var comparisonOrders = sortSpecifiers.map(function (sortExpression) {
        return sortExpression.order === 'descending' ? -1 : 1;
    });
    return records.sort(function (record1, record2) {
        var values1 = comparisonValues.get(record1);
        var values2 = comparisonValues.get(record2);
        for (var i = 0; i < sortSpecifiers.length; i++) {
            if (values1[i] < values2[i]) {
                return -comparisonOrders[i];
            } else if (values1[i] > values2[i]) {
                return comparisonOrders[i];
            } else if ((0, _utils.isNone)(values1[i]) && !(0, _utils.isNone)(values2[i])) {
                return comparisonOrders[i];
            } else if ((0, _utils.isNone)(values2[i]) && !(0, _utils.isNone)(values1[i])) {
                return -comparisonOrders[i];
            }
        }
        return 0;
    });
}
function paginateRecords(records, paginationOptions) {
    if (paginationOptions.limit !== undefined) {
        var offset = paginationOptions.offset === undefined ? 0 : paginationOptions.offset;
        var limit = paginationOptions.limit;
        return records.slice(offset, offset + limit);
    } else {
        throw new _data.QueryExpressionParseError('Pagination options not recognized for Store. Please specify `offset` and `limit`.', paginationOptions);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3F1ZXJ5LW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJFTVBUWSIsIlF1ZXJ5T3BlcmF0b3JzIiwiZXhwcmVzc2lvbiIsInJlY29yZCIsImNhY2hlIiwicmVzdWx0cyIsIkFycmF5IiwiZmlsdGVyUmVjb3JkcyIsInNvcnRSZWNvcmRzIiwicGFnaW5hdGVSZWNvcmRzIiwiY3VycmVudFJlY29yZCIsImRhdGEiLCJkZWVwR2V0IiwiciIsImkiLCJsIiwiZmlsdGVycyIsImFwcGx5RmlsdGVyIiwiZmlsdGVyIiwiYWN0dWFsIiwiZXhwZWN0ZWQiLCJyZWxhdGlvbiIsImEiLCJlIiwiY29tcGFyaXNvblZhbHVlcyIsInJlY29yZHMiLCJzb3J0U3BlY2lmaWVyIiwiY29tcGFyaXNvbk9yZGVycyIsInNvcnRFeHByZXNzaW9uIiwidmFsdWVzMSIsInZhbHVlczIiLCJzb3J0U3BlY2lmaWVycyIsImlzTm9uZSIsInBhZ2luYXRpb25PcHRpb25zIiwib2Zmc2V0IiwibGltaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOztBQUNBLElBQU1BLFFBQVEsWUFBTSxDQUFwQixDQUFBO0FBQ08sSUFBTUMsMENBQWlCO0FBQUEsZ0JBQUEsVUFBQSxLQUFBLEVBQUEsVUFBQSxFQUNJO0FBQUEsWUFBQSxxQkFDTEMsV0FESyxNQUFBO0FBQUEsWUFBQSxPQUFBLG1CQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsbUJBQUEsRUFBQTs7QUFFMUIsWUFBTUMsU0FBU0MsTUFBQUEsT0FBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsR0FBQUEsQ0FBZixFQUFlQSxDQUFmO0FBQ0EsWUFBSSxDQUFKLE1BQUEsRUFBYTtBQUNULGtCQUFNLElBQUEsNkJBQUEsQ0FBQSxJQUFBLEVBQU4sRUFBTSxDQUFOO0FBQ0g7QUFDRCxlQUFBLE1BQUE7QUFQc0IsS0FBQTtBQUFBLGlCQUFBLFVBQUEsS0FBQSxFQUFBLFVBQUEsRUFTSztBQUMzQixZQUFJQyxVQUFVQyxNQUFBQSxJQUFBQSxDQUFX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QkFBQSxDQUFBLG1GQUFBLEVBQU4saUJBQU0sQ0FBTjtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBpc05vbmUgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24sIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5jb25zdCBFTVBUWSA9ICgpID0+IHt9O1xuZXhwb3J0IGNvbnN0IFF1ZXJ5T3BlcmF0b3JzID0ge1xuICAgIGZpbmRSZWNvcmQoY2FjaGUsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gZXhwcmVzc2lvbi5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgaWYgKCFyZWNvcmQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbih0eXBlLCBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmRzKGNhY2hlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gQXJyYXkuZnJvbShjYWNoZS5yZWNvcmRzKGV4cHJlc3Npb24udHlwZSkudmFsdWVzKCkpO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbi5maWx0ZXIpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBmaWx0ZXJSZWNvcmRzKHJlc3VsdHMsIGV4cHJlc3Npb24uZmlsdGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbi5zb3J0KSB7XG4gICAgICAgICAgICByZXN1bHRzID0gc29ydFJlY29yZHMocmVzdWx0cywgZXhwcmVzc2lvbi5zb3J0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbi5wYWdlKSB7XG4gICAgICAgICAgICByZXN1bHRzID0gcGFnaW5hdGVSZWNvcmRzKHJlc3VsdHMsIGV4cHJlc3Npb24ucGFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSxcbiAgICBmaW5kUmVsYXRlZFJlY29yZHMoY2FjaGUsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVjb3JkO1xuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBjb25zdCBkYXRhID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhLm1hcChyID0+IGNhY2hlLnJlY29yZHMoci50eXBlKS5nZXQoci5pZCkpO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQoY2FjaGUsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVjb3JkO1xuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBjb25zdCBkYXRhID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgciA9IGRhdGE7XG4gICAgICAgIHJldHVybiBjYWNoZS5yZWNvcmRzKHIudHlwZSkuZ2V0KHIuaWQpO1xuICAgIH1cbn07XG5mdW5jdGlvbiBmaWx0ZXJSZWNvcmRzKHJlY29yZHMsIGZpbHRlcnMpIHtcbiAgICByZXR1cm4gcmVjb3Jkcy5maWx0ZXIocmVjb3JkID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKCFhcHBseUZpbHRlcihyZWNvcmQsIGZpbHRlcnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYXBwbHlGaWx0ZXIocmVjb3JkLCBmaWx0ZXIpIHtcbiAgICBpZiAoZmlsdGVyLmtpbmQgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgIGxldCBhY3R1YWwgPSBkZWVwR2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgZmlsdGVyLmF0dHJpYnV0ZV0pO1xuICAgICAgICBsZXQgZXhwZWN0ZWQgPSBmaWx0ZXIudmFsdWU7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdlcXVhbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCA9PT0gZXhwZWN0ZWQ7XG4gICAgICAgICAgICBjYXNlICdndCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCA+IGV4cGVjdGVkO1xuICAgICAgICAgICAgY2FzZSAnZ3RlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0dWFsID49IGV4cGVjdGVkO1xuICAgICAgICAgICAgY2FzZSAnbHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgPCBleHBlY3RlZDtcbiAgICAgICAgICAgIGNhc2UgJ2x0ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCA8PSBleHBlY3RlZDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoJ0ZpbHRlciBvcGVyYXRpb24gJHtmaWx0ZXIub3B9IG5vdCByZWNvZ25pemVkIGZvciBTdG9yZS4nLCBmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIua2luZCA9PT0gJ3JlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICBsZXQgcmVsYXRpb24gPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgZmlsdGVyLnJlbGF0aW9uXSk7XG4gICAgICAgIGxldCBhY3R1YWwgPSByZWxhdGlvbiA9PT0gdW5kZWZpbmVkID8gW10gOiByZWxhdGlvbi5kYXRhO1xuICAgICAgICBsZXQgZXhwZWN0ZWQgPSBmaWx0ZXIucmVjb3JkcztcbiAgICAgICAgc3dpdGNoIChmaWx0ZXIub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ2VxdWFsJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0dWFsLmxlbmd0aCA9PT0gZXhwZWN0ZWQubGVuZ3RoICYmIGV4cGVjdGVkLmV2ZXJ5KGUgPT4gYWN0dWFsLnNvbWUoYSA9PiBhLmlkID09PSBlLmlkICYmIGEudHlwZSA9PT0gZS50eXBlKSk7XG4gICAgICAgICAgICBjYXNlICdhbGwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBleHBlY3RlZC5ldmVyeShlID0+IGFjdHVhbC5zb21lKGEgPT4gYS5pZCA9PT0gZS5pZCAmJiBhLnR5cGUgPT09IGUudHlwZSkpO1xuICAgICAgICAgICAgY2FzZSAnc29tZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cGVjdGVkLnNvbWUoZSA9PiBhY3R1YWwuc29tZShhID0+IGEuaWQgPT09IGUuaWQgJiYgYS50eXBlID09PSBlLnR5cGUpKTtcbiAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiAhZXhwZWN0ZWQuc29tZShlID0+IGFjdHVhbC5zb21lKGEgPT4gYS5pZCA9PT0gZS5pZCAmJiBhLnR5cGUgPT09IGUudHlwZSkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignRmlsdGVyIG9wZXJhdGlvbiAke2ZpbHRlci5vcH0gbm90IHJlY29nbml6ZWQgZm9yIFN0b3JlLicsIGZpbHRlcik7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpbHRlci5raW5kID09PSAncmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uID0gZGVlcEdldChyZWNvcmQsIFtcInJlbGF0aW9uc2hpcHNcIiwgZmlsdGVyLnJlbGF0aW9uXSk7XG4gICAgICAgIGxldCBhY3R1YWwgPSByZWxhdGlvbiA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVsYXRpb24uZGF0YTtcbiAgICAgICAgbGV0IGV4cGVjdGVkID0gZmlsdGVyLnJlY29yZDtcbiAgICAgICAgc3dpdGNoIChmaWx0ZXIub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ2VxdWFsJzpcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShleHBlY3RlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCAhPT0gdW5kZWZpbmVkICYmIGV4cGVjdGVkLnNvbWUoZSA9PiBhY3R1YWwudHlwZSA9PT0gZS50eXBlICYmIGFjdHVhbC5pZCA9PT0gZS5pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCAhPT0gdW5kZWZpbmVkICYmIGFjdHVhbC50eXBlID09PSBleHBlY3RlZC50eXBlICYmIGFjdHVhbC5pZCA9PT0gZXhwZWN0ZWQuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignRmlsdGVyIG9wZXJhdGlvbiAke2ZpbHRlci5vcH0gbm90IHJlY29nbml6ZWQgZm9yIFN0b3JlLicsIGZpbHRlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gc29ydFJlY29yZHMocmVjb3Jkcywgc29ydFNwZWNpZmllcnMpIHtcbiAgICBjb25zdCBjb21wYXJpc29uVmFsdWVzID0gbmV3IE1hcCgpO1xuICAgIHJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICBjb21wYXJpc29uVmFsdWVzLnNldChyZWNvcmQsIHNvcnRTcGVjaWZpZXJzLm1hcChzb3J0U3BlY2lmaWVyID0+IHtcbiAgICAgICAgICAgIGlmIChzb3J0U3BlY2lmaWVyLmtpbmQgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZXBHZXQocmVjb3JkLCBbJ2F0dHJpYnV0ZXMnLCBzb3J0U3BlY2lmaWVyLmF0dHJpYnV0ZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignU29ydCBzcGVjaWZpZXIgJHtzb3J0U3BlY2lmaWVyLmtpbmR9IG5vdCByZWNvZ25pemVkIGZvciBTdG9yZS4nLCBzb3J0U3BlY2lmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNvbXBhcmlzb25PcmRlcnMgPSBzb3J0U3BlY2lmaWVycy5tYXAoc29ydEV4cHJlc3Npb24gPT4gc29ydEV4cHJlc3Npb24ub3JkZXIgPT09ICdkZXNjZW5kaW5nJyA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHJlY29yZHMuc29ydCgocmVjb3JkMSwgcmVjb3JkMikgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZXMxID0gY29tcGFyaXNvblZhbHVlcy5nZXQocmVjb3JkMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlczIgPSBjb21wYXJpc29uVmFsdWVzLmdldChyZWNvcmQyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3J0U3BlY2lmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbHVlczFbaV0gPCB2YWx1ZXMyW2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC1jb21wYXJpc29uT3JkZXJzW2ldO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZXMxW2ldID4gdmFsdWVzMltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJpc29uT3JkZXJzW2ldO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc05vbmUodmFsdWVzMVtpXSkgJiYgIWlzTm9uZSh2YWx1ZXMyW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJpc29uT3JkZXJzW2ldO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc05vbmUodmFsdWVzMltpXSkgJiYgIWlzTm9uZSh2YWx1ZXMxW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtY29tcGFyaXNvbk9yZGVyc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHBhZ2luYXRlUmVjb3JkcyhyZWNvcmRzLCBwYWdpbmF0aW9uT3B0aW9ucykge1xuICAgIGlmIChwYWdpbmF0aW9uT3B0aW9ucy5saW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBvZmZzZXQgPSBwYWdpbmF0aW9uT3B0aW9ucy5vZmZzZXQgPT09IHVuZGVmaW5lZCA/IDAgOiBwYWdpbmF0aW9uT3B0aW9ucy5vZmZzZXQ7XG4gICAgICAgIGxldCBsaW1pdCA9IHBhZ2luYXRpb25PcHRpb25zLmxpbWl0O1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5zbGljZShvZmZzZXQsIG9mZnNldCArIGxpbWl0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcignUGFnaW5hdGlvbiBvcHRpb25zIG5vdCByZWNvZ25pemVkIGZvciBTdG9yZS4gUGxlYXNlIHNwZWNpZnkgYG9mZnNldGAgYW5kIGBsaW1pdGAuJywgcGFnaW5hdGlvbk9wdGlvbnMpO1xuICAgIH1cbn0iXX0=