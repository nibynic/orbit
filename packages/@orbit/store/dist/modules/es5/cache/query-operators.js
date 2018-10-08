import { deepGet, isNone } from '@orbit/utils';
import { RecordNotFoundException, QueryExpressionParseError } from '@orbit/data';
var EMPTY = function () {};
export var QueryOperators = {
    findRecord: function (cache, expression) {
        var _expression$record = expression.record,
            type = _expression$record.type,
            id = _expression$record.id;

        var record = cache.records(type).get(id);
        if (!record) {
            throw new RecordNotFoundException(type, id);
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
        var data = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
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
        var data = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
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
        var actual = deepGet(record, ['attributes', filter.attribute]);
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
                throw new QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecords') {
        var relation = deepGet(record, ['relationships', filter.relation]);
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
                throw new QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecord') {
        var _relation = deepGet(record, ["relationships", filter.relation]);
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
                throw new QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    }
    return false;
}
function sortRecords(records, sortSpecifiers) {
    var comparisonValues = new Map();
    records.forEach(function (record) {
        comparisonValues.set(record, sortSpecifiers.map(function (sortSpecifier) {
            if (sortSpecifier.kind === 'attribute') {
                return deepGet(record, ['attributes', sortSpecifier.attribute]);
            } else {
                throw new QueryExpressionParseError('Sort specifier ${sortSpecifier.kind} not recognized for Store.', sortSpecifier);
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
            } else if (isNone(values1[i]) && !isNone(values2[i])) {
                return comparisonOrders[i];
            } else if (isNone(values2[i]) && !isNone(values1[i])) {
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
        throw new QueryExpressionParseError('Pagination options not recognized for Store. Please specify `offset` and `limit`.', paginationOptions);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3F1ZXJ5LW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJkZWVwR2V0IiwiaXNOb25lIiwiUmVjb3JkTm90Rm91bmRFeGNlcHRpb24iLCJRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIiwiRU1QVFkiLCJRdWVyeU9wZXJhdG9ycyIsImZpbmRSZWNvcmQiLCJjYWNoZSIsImV4cHJlc3Npb24iLCJyZWNvcmQiLCJ0eXBlIiwiaWQiLCJyZWNvcmRzIiwiZ2V0IiwiZmluZFJlY29yZHMiLCJyZXN1bHRzIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwiZmlsdGVyIiwiZmlsdGVyUmVjb3JkcyIsInNvcnQiLCJzb3J0UmVjb3JkcyIsInBhZ2UiLCJwYWdpbmF0ZVJlY29yZHMiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJjdXJyZW50UmVjb3JkIiwiZGF0YSIsIm1hcCIsInIiLCJmaW5kUmVsYXRlZFJlY29yZCIsImZpbHRlcnMiLCJpIiwibCIsImxlbmd0aCIsImFwcGx5RmlsdGVyIiwia2luZCIsImFjdHVhbCIsImF0dHJpYnV0ZSIsImV4cGVjdGVkIiwidmFsdWUiLCJvcCIsInJlbGF0aW9uIiwidW5kZWZpbmVkIiwiZXZlcnkiLCJzb21lIiwiYSIsImUiLCJpc0FycmF5Iiwic29ydFNwZWNpZmllcnMiLCJjb21wYXJpc29uVmFsdWVzIiwiTWFwIiwiZm9yRWFjaCIsInNldCIsInNvcnRTcGVjaWZpZXIiLCJjb21wYXJpc29uT3JkZXJzIiwic29ydEV4cHJlc3Npb24iLCJvcmRlciIsInJlY29yZDEiLCJyZWNvcmQyIiwidmFsdWVzMSIsInZhbHVlczIiLCJwYWdpbmF0aW9uT3B0aW9ucyIsImxpbWl0Iiwib2Zmc2V0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLE9BQVQsRUFBa0JDLE1BQWxCLFFBQWdDLGNBQWhDO0FBQ0EsU0FBU0MsdUJBQVQsRUFBa0NDLHlCQUFsQyxRQUFtRSxhQUFuRTtBQUNBLElBQU1DLFFB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QVA7QUFDSCxhQUZNLE1BRUEsSUFBSWhDLE9BQU80RCxRQUFRNUIsQ0FBUixDQUFQLEtBQXNCLENBQUNoQyxPQUFPNkQsUUFBUTdCLENBQVIsQ0FBUCxDQUEzQixFQUErQztBQUNsRCx1QkFBT3VCLGlCQUFpQnZCLENBQWpCLENBQVA7QUFDSCxhQUZNLE1BRUEsSUFBSWhDLE9BQU82RCxRQUFRN0IsQ0FBUixDQUFQLEtBQXNCLENBQUNoQyxPQUFPNEQsUUFBUTVCLENBQVIsQ0FBUCxDQUEzQixFQUErQztBQUNsRCx1QkFBTyxDQUFDdUIsaUJBQWlCdkIsQ0FBakIsQ0FBUjtBQUNIO0FBQ0o7QUFDRCxlQUFPLENBQVA7QUFDSCxLQWZNLENBQVA7QUFnQkg7QUFDRCxTQUFTVCxlQUFULENBQXlCWixPQUF6QixFQUFrQ21ELGlCQUFsQyxFQUFxRDtBQUNqRCxRQUFJQSxrQkFBa0JDLEtBQWxCLEtBQTRCcEIsU0FBaEMsRUFBMkM7QUFDdkMsWUFBSXFCLFNBQVNGLGtCQUFrQkUsTUFBbEIsS0FBNkJyQixTQUE3QixHQUF5QyxDQUF6QyxHQUE2Q21CLGtCQUFrQkUsTUFBNUU7QUFDQSxZQUFJRCxRQUFRRCxrQkFBa0JDLEtBQTlCO0FBQ0EsZUFBT3BELFFBQVFzRCxLQUFSLENBQWNELE1BQWQsRUFBc0JBLFNBQVNELEtBQS9CLENBQVA7QUFDSCxLQUpELE1BSU87QUFDSCxjQUFNLElBQUk3RCx5QkFBSixDQUE4QixtRkFBOUIsRUFBbUg0RCxpQkFBbkgsQ0FBTjtBQUNIO0FBQ0oiLCJmaWxlIjoiY2FjaGUvcXVlcnktb3BlcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgaXNOb25lIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uLCBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuY29uc3QgRU1QVFkgPSAoKSA9PiB7fTtcbmV4cG9ydCBjb25zdCBRdWVyeU9wZXJhdG9ycyA9IHtcbiAgICBmaW5kUmVjb3JkKGNhY2hlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IGV4cHJlc3Npb24ucmVjb3JkO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVjb3JkTm90Rm91bmRFeGNlcHRpb24odHlwZSwgaWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfSxcbiAgICBmaW5kUmVjb3JkcyhjYWNoZSwgZXhwcmVzc2lvbikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IEFycmF5LmZyb20oY2FjaGUucmVjb3JkcyhleHByZXNzaW9uLnR5cGUpLnZhbHVlcygpKTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24uZmlsdGVyKSB7XG4gICAgICAgICAgICByZXN1bHRzID0gZmlsdGVyUmVjb3JkcyhyZXN1bHRzLCBleHByZXNzaW9uLmZpbHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHJlc3Npb24uc29ydCkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHNvcnRSZWNvcmRzKHJlc3VsdHMsIGV4cHJlc3Npb24uc29ydCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHJlc3Npb24ucGFnZSkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHBhZ2luYXRlUmVjb3JkcyhyZXN1bHRzLCBleHByZXNzaW9uLnBhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmRzKGNhY2hlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlY29yZDtcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YS5tYXAociA9PiBjYWNoZS5yZWNvcmRzKHIudHlwZSkuZ2V0KHIuaWQpKTtcbiAgICB9LFxuICAgIGZpbmRSZWxhdGVkUmVjb3JkKGNhY2hlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlY29yZDtcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHIgPSBkYXRhO1xuICAgICAgICByZXR1cm4gY2FjaGUucmVjb3JkcyhyLnR5cGUpLmdldChyLmlkKTtcbiAgICB9XG59O1xuZnVuY3Rpb24gZmlsdGVyUmVjb3JkcyhyZWNvcmRzLCBmaWx0ZXJzKSB7XG4gICAgcmV0dXJuIHJlY29yZHMuZmlsdGVyKHJlY29yZCA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghYXBwbHlGaWx0ZXIocmVjb3JkLCBmaWx0ZXJzW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFwcGx5RmlsdGVyKHJlY29yZCwgZmlsdGVyKSB7XG4gICAgaWYgKGZpbHRlci5raW5kID09PSAnYXR0cmlidXRlJykge1xuICAgICAgICBsZXQgYWN0dWFsID0gZGVlcEdldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGZpbHRlci5hdHRyaWJ1dGVdKTtcbiAgICAgICAgbGV0IGV4cGVjdGVkID0gZmlsdGVyLnZhbHVlO1xuICAgICAgICBzd2l0Y2ggKGZpbHRlci5vcCkge1xuICAgICAgICAgICAgY2FzZSAnZXF1YWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgPT09IGV4cGVjdGVkO1xuICAgICAgICAgICAgY2FzZSAnZ3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgPiBleHBlY3RlZDtcbiAgICAgICAgICAgIGNhc2UgJ2d0ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbCA+PSBleHBlY3RlZDtcbiAgICAgICAgICAgIGNhc2UgJ2x0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0dWFsIDwgZXhwZWN0ZWQ7XG4gICAgICAgICAgICBjYXNlICdsdGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgPD0gZXhwZWN0ZWQ7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yKCdGaWx0ZXIgb3BlcmF0aW9uICR7ZmlsdGVyLm9wfSBub3QgcmVjb2duaXplZCBmb3IgU3RvcmUuJywgZmlsdGVyKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmlsdGVyLmtpbmQgPT09ICdyZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIGZpbHRlci5yZWxhdGlvbl0pO1xuICAgICAgICBsZXQgYWN0dWFsID0gcmVsYXRpb24gPT09IHVuZGVmaW5lZCA/IFtdIDogcmVsYXRpb24uZGF0YTtcbiAgICAgICAgbGV0IGV4cGVjdGVkID0gZmlsdGVyLnJlY29yZHM7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdlcXVhbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbC5sZW5ndGggPT09IGV4cGVjdGVkLmxlbmd0aCAmJiBleHBlY3RlZC5ldmVyeShlID0+IGFjdHVhbC5zb21lKGEgPT4gYS5pZCA9PT0gZS5pZCAmJiBhLnR5cGUgPT09IGUudHlwZSkpO1xuICAgICAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwZWN0ZWQuZXZlcnkoZSA9PiBhY3R1YWwuc29tZShhID0+IGEuaWQgPT09IGUuaWQgJiYgYS50eXBlID09PSBlLnR5cGUpKTtcbiAgICAgICAgICAgIGNhc2UgJ3NvbWUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBleHBlY3RlZC5zb21lKGUgPT4gYWN0dWFsLnNvbWUoYSA9PiBhLmlkID09PSBlLmlkICYmIGEudHlwZSA9PT0gZS50eXBlKSk7XG4gICAgICAgICAgICBjYXNlICdub25lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gIWV4cGVjdGVkLnNvbWUoZSA9PiBhY3R1YWwuc29tZShhID0+IGEuaWQgPT09IGUuaWQgJiYgYS50eXBlID09PSBlLnR5cGUpKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoJ0ZpbHRlciBvcGVyYXRpb24gJHtmaWx0ZXIub3B9IG5vdCByZWNvZ25pemVkIGZvciBTdG9yZS4nLCBmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIua2luZCA9PT0gJ3JlbGF0ZWRSZWNvcmQnKSB7XG4gICAgICAgIGxldCByZWxhdGlvbiA9IGRlZXBHZXQocmVjb3JkLCBbXCJyZWxhdGlvbnNoaXBzXCIsIGZpbHRlci5yZWxhdGlvbl0pO1xuICAgICAgICBsZXQgYWN0dWFsID0gcmVsYXRpb24gPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlbGF0aW9uLmRhdGE7XG4gICAgICAgIGxldCBleHBlY3RlZCA9IGZpbHRlci5yZWNvcmQ7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdlcXVhbCc6XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwZWN0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgIT09IHVuZGVmaW5lZCAmJiBleHBlY3RlZC5zb21lKGUgPT4gYWN0dWFsLnR5cGUgPT09IGUudHlwZSAmJiBhY3R1YWwuaWQgPT09IGUuaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3R1YWwgIT09IHVuZGVmaW5lZCAmJiBhY3R1YWwudHlwZSA9PT0gZXhwZWN0ZWQudHlwZSAmJiBhY3R1YWwuaWQgPT09IGV4cGVjdGVkLmlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoJ0ZpbHRlciBvcGVyYXRpb24gJHtmaWx0ZXIub3B9IG5vdCByZWNvZ25pemVkIGZvciBTdG9yZS4nLCBmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIHNvcnRSZWNvcmRzKHJlY29yZHMsIHNvcnRTcGVjaWZpZXJzKSB7XG4gICAgY29uc3QgY29tcGFyaXNvblZhbHVlcyA9IG5ldyBNYXAoKTtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgY29tcGFyaXNvblZhbHVlcy5zZXQocmVjb3JkLCBzb3J0U3BlY2lmaWVycy5tYXAoc29ydFNwZWNpZmllciA9PiB7XG4gICAgICAgICAgICBpZiAoc29ydFNwZWNpZmllci5raW5kID09PSAnYXR0cmlidXRlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWVwR2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgc29ydFNwZWNpZmllci5hdHRyaWJ1dGVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoJ1NvcnQgc3BlY2lmaWVyICR7c29ydFNwZWNpZmllci5raW5kfSBub3QgcmVjb2duaXplZCBmb3IgU3RvcmUuJywgc29ydFNwZWNpZmllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbiAgICBjb25zdCBjb21wYXJpc29uT3JkZXJzID0gc29ydFNwZWNpZmllcnMubWFwKHNvcnRFeHByZXNzaW9uID0+IHNvcnRFeHByZXNzaW9uLm9yZGVyID09PSAnZGVzY2VuZGluZycgPyAtMSA6IDEpO1xuICAgIHJldHVybiByZWNvcmRzLnNvcnQoKHJlY29yZDEsIHJlY29yZDIpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWVzMSA9IGNvbXBhcmlzb25WYWx1ZXMuZ2V0KHJlY29yZDEpO1xuICAgICAgICBjb25zdCB2YWx1ZXMyID0gY29tcGFyaXNvblZhbHVlcy5nZXQocmVjb3JkMik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydFNwZWNpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZXMxW2ldIDwgdmFsdWVzMltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtY29tcGFyaXNvbk9yZGVyc1tpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVzMVtpXSA+IHZhbHVlczJbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyaXNvbk9yZGVyc1tpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOb25lKHZhbHVlczFbaV0pICYmICFpc05vbmUodmFsdWVzMltpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyaXNvbk9yZGVyc1tpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOb25lKHZhbHVlczJbaV0pICYmICFpc05vbmUodmFsdWVzMVtpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLWNvbXBhcmlzb25PcmRlcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBwYWdpbmF0ZVJlY29yZHMocmVjb3JkcywgcGFnaW5hdGlvbk9wdGlvbnMpIHtcbiAgICBpZiAocGFnaW5hdGlvbk9wdGlvbnMubGltaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgb2Zmc2V0ID0gcGFnaW5hdGlvbk9wdGlvbnMub2Zmc2V0ID09PSB1bmRlZmluZWQgPyAwIDogcGFnaW5hdGlvbk9wdGlvbnMub2Zmc2V0O1xuICAgICAgICBsZXQgbGltaXQgPSBwYWdpbmF0aW9uT3B0aW9ucy5saW1pdDtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBsaW1pdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoJ1BhZ2luYXRpb24gb3B0aW9ucyBub3QgcmVjb2duaXplZCBmb3IgU3RvcmUuIFBsZWFzZSBzcGVjaWZ5IGBvZmZzZXRgIGFuZCBgbGltaXRgLicsIHBhZ2luYXRpb25PcHRpb25zKTtcbiAgICB9XG59Il19