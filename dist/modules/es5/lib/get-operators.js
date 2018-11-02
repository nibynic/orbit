import { merge } from '@orbit/utils';
import { QueryExpressionParseError } from '@orbit/data';
import { buildFetchSettings, customRequestOptions } from './request-settings';
export var GetOperators = {
    findRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record;

        var requestOptions = customRequestOptions(source, query);
        var settings = buildFetchSettings(requestOptions);
        return source.fetch(source.resourceURL(record.type, record.id), settings);
    },
    findRecords: function (source, query) {
        var expression = query.expression;
        var type = expression.type;

        var requestOptions = {};
        if (expression.filter) {
            requestOptions.filter = buildFilterParam(source, expression.filter);
        }
        if (expression.sort) {
            requestOptions.sort = buildSortParam(source, expression.sort);
        }
        if (expression.page) {
            requestOptions.page = expression.page;
        }
        var customOptions = customRequestOptions(source, query);
        if (customOptions) {
            merge(requestOptions, customOptions);
        }
        var settings = buildFetchSettings(requestOptions);
        return source.fetch(source.resourceURL(type), settings);
    },
    findRelatedRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        var requestOptions = customRequestOptions(source, query);
        var settings = buildFetchSettings(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings);
    },
    findRelatedRecords: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        var requestOptions = customRequestOptions(source, query);
        var settings = buildFetchSettings(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings);
    }
};
function buildFilterParam(source, filterSpecifiers) {
    var filters = [];
    filterSpecifiers.forEach(function (filterSpecifier) {
        if (filterSpecifier.kind === 'attribute' && filterSpecifier.op === 'equal') {
            var _filters$push;

            var attributeFilter = filterSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            var resourceAttribute = source.serializer.resourceAttribute(null, attributeFilter.attribute);
            filters.push((_filters$push = {}, _filters$push[resourceAttribute] = attributeFilter.value, _filters$push));
        } else if (filterSpecifier.kind === 'relatedRecord') {
            var relatedRecordFilter = filterSpecifier;
            if (Array.isArray(relatedRecordFilter.record)) {
                var _filters$push2;

                filters.push((_filters$push2 = {}, _filters$push2[relatedRecordFilter.relation] = relatedRecordFilter.record.map(function (e) {
                    return e.id;
                }).join(','), _filters$push2));
            } else {
                var _filters$push3;

                filters.push((_filters$push3 = {}, _filters$push3[relatedRecordFilter.relation] = relatedRecordFilter.record.id, _filters$push3));
            }
        } else if (filterSpecifier.kind === 'relatedRecords') {
            var _filters$push4;

            if (filterSpecifier.op !== 'equal') {
                throw new Error('Operation "' + filterSpecifier.op + '" is not supported in JSONAPI for relatedRecords filtering');
            }
            var relatedRecordsFilter = filterSpecifier;
            filters.push((_filters$push4 = {}, _filters$push4[relatedRecordsFilter.relation] = relatedRecordsFilter.records.map(function (e) {
                return e.id;
            }).join(','), _filters$push4));
        } else {
            throw new QueryExpressionParseError('Filter operation ' + filterSpecifier.op + ' not recognized for JSONAPISource.', filterSpecifier);
        }
    });
    return filters;
}
function buildSortParam(source, sortSpecifiers) {
    return sortSpecifiers.map(function (sortSpecifier) {
        if (sortSpecifier.kind === 'attribute') {
            var attributeSort = sortSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            var resourceAttribute = source.serializer.resourceAttribute(null, attributeSort.attribute);
            return (sortSpecifier.order === 'descending' ? '-' : '') + resourceAttribute;
        }
        throw new QueryExpressionParseError('Sort specifier ' + sortSpecifier.kind + ' not recognized for JSONAPISource.', sortSpecifier);
    }).join(',');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9nZXQtb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbIm1lcmdlIiwiUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvciIsImJ1aWxkRmV0Y2hTZXR0aW5ncyIsImN1c3RvbVJlcXVlc3RPcHRpb25zIiwiR2V0T3BlcmF0b3JzIiwiZmluZFJlY29yZCIsInNvdXJjZSIsInF1ZXJ5IiwiZXhwcmVzc2lvbiIsInJlY29yZCIsInJlcXVlc3RPcHRpb25zIiwic2V0dGluZ3MiLCJmZXRjaCIsInJlc291cmNlVVJMIiwidHlwZSIsImlkIiwiZmluZFJlY29yZHMiLCJmaWx0ZXIiLCJidWlsZEZpbHRlclBhcmFtIiwic29ydCIsImJ1aWxkU29ydFBhcmFtIiwicGFnZSIsImN1c3RvbU9wdGlvbnMiLCJmaW5kUmVsYXRlZFJlY29yZCIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZXNvdXJjZVVSTCIsImZpbmRSZWxhdGVkUmVjb3JkcyIsImZpbHRlclNwZWNpZmllcnMiLCJmaWx0ZXJzIiwiZm9yRWFjaCIsImZpbHRlclNwZWNpZmllciIsImtpbmQiLCJvcCIsImF0dHJpYnV0ZUZpbHRlciIsInJlc291cmNlQXR0cmlidXRlIiwic2VyaWFsaXplciIsImF0dHJpYnV0ZSIsInB1c2giLCJ2YWx1ZSIsInJlbGF0ZWRSZWNvcmRGaWx0ZXIiLCJBcnJheSIsImlzQXJyYXkiLCJyZWxhdGlvbiIsIm1hcCIsImUiLCJqb2luIiwiRXJyb3IiLCJyZWxhdGVkUmVjb3Jkc0ZpbHRlciIsInJlY29yZHMiLCJzb3J0U3BlY2lmaWVycyIsInNvcnRTcGVjaWZpZXIiLCJhdHRyaWJ1dGVTb3J0Iiwib3JkZXIiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLEtBQVQsUUFBc0IsY0FBdEI7QUFDQSxTQUFTQyx5QkFBVCxRQUEwQyxhQUExQztBQUNBLFNBQVNDLGtCQUFULEVBQTZCQyxvQkFBN0IsUUFBeUQsb0JBQXpEO0FBQ0EsT0FBTyxJQUFNQyxlQUFlO0FBQ3hCQyxjQUR3QixZQUNiQyxN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QixDQUE2QkwsR0FBN0IsQ0FBaUM7QUFBQSx1QkFBS0MsRUFBRTdCLEVBQVA7QUFBQSxhQUFqQyxFQUE0QzhCLElBQTVDLENBQWlELEdBQWpELENBQWhEO0FBQ0gsU0FOTSxNQU1BO0FBQ0gsa0JBQU0sSUFBSTVDLHlCQUFKLHVCQUFrRDZCLGdCQUFnQkUsRUFBbEUseUNBQTBHRixlQUExRyxDQUFOO0FBQ0g7QUFDSixLQXRCRDtBQXVCQSxXQUFPRixPQUFQO0FBQ0g7QUFDRCxTQUFTUixjQUFULENBQXdCZCxNQUF4QixFQUFnQzJDLGNBQWhDLEVBQWdEO0FBQzVDLFdBQU9BLGVBQWVOLEdBQWYsQ0FBbUIseUJBQWlCO0FBQ3ZDLFlBQUlPLGNBQWNuQixJQUFkLEtBQXVCLFdBQTNCLEVBQXdDO0FBQ3BDLGdCQUFNb0IsZ0JBQWdCRCxhQUF0QjtBQUNBO0FBQ0EsZ0JBQU1oQixvQkFBb0I1QixPQUFPNkIsVUFBUCxDQUFrQkQsaUJBQWxCLENBQW9DLElBQXBDLEVBQTBDaUIsY0FBY2YsU0FBeEQsQ0FBMUI7QUFDQSxtQkFBTyxDQUFDYyxjQUFjRSxLQUFkLEtBQXdCLFlBQXhCLEdBQXVDLEdBQXZDLEdBQTZDLEVBQTlDLElBQW9EbEIsaUJBQTNEO0FBQ0g7QUFDRCxjQUFNLElBQUlqQyx5QkFBSixxQkFBZ0RpRCxjQUFjbkIsSUFBOUQseUNBQXdHbUIsYUFBeEcsQ0FBTjtBQUNILEtBUk0sRUFRSkwsSUFSSSxDQVFDLEdBUkQsQ0FBUDtBQVNIIiwiZmlsZSI6ImxpYi9nZXQtb3BlcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvciB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGJ1aWxkRmV0Y2hTZXR0aW5ncywgY3VzdG9tUmVxdWVzdE9wdGlvbnMgfSBmcm9tICcuL3JlcXVlc3Qtc2V0dGluZ3MnO1xuZXhwb3J0IGNvbnN0IEdldE9wZXJhdG9ycyA9IHtcbiAgICBmaW5kUmVjb3JkKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkIH0gPSBleHByZXNzaW9uO1xuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHJlY29yZC50eXBlLCByZWNvcmQuaWQpLCBzZXR0aW5ncyk7XG4gICAgfSxcbiAgICBmaW5kUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHR5cGUgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IHt9O1xuICAgICAgICBpZiAoZXhwcmVzc2lvbi5maWx0ZXIpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLmZpbHRlciA9IGJ1aWxkRmlsdGVyUGFyYW0oc291cmNlLCBleHByZXNzaW9uLmZpbHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHJlc3Npb24uc29ydCkge1xuICAgICAgICAgICAgcmVxdWVzdE9wdGlvbnMuc29ydCA9IGJ1aWxkU29ydFBhcmFtKHNvdXJjZSwgZXhwcmVzc2lvbi5zb3J0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbi5wYWdlKSB7XG4gICAgICAgICAgICByZXF1ZXN0T3B0aW9ucy5wYWdlID0gZXhwcmVzc2lvbi5wYWdlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXN0b21PcHRpb25zID0gY3VzdG9tUmVxdWVzdE9wdGlvbnMoc291cmNlLCBxdWVyeSk7XG4gICAgICAgIGlmIChjdXN0b21PcHRpb25zKSB7XG4gICAgICAgICAgICBtZXJnZShyZXF1ZXN0T3B0aW9ucywgY3VzdG9tT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdE9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTCh0eXBlKSwgc2V0dGluZ3MpO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHF1ZXJ5KTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdE9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZWxhdGVkUmVzb3VyY2VVUkwocmVjb3JkLnR5cGUsIHJlY29yZC5pZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlbGF0ZWRSZXNvdXJjZVVSTChyZWNvcmQudHlwZSwgcmVjb3JkLmlkLCByZWxhdGlvbnNoaXApLCBzZXR0aW5ncyk7XG4gICAgfVxufTtcbmZ1bmN0aW9uIGJ1aWxkRmlsdGVyUGFyYW0oc291cmNlLCBmaWx0ZXJTcGVjaWZpZXJzKSB7XG4gICAgY29uc3QgZmlsdGVycyA9IFtdO1xuICAgIGZpbHRlclNwZWNpZmllcnMuZm9yRWFjaChmaWx0ZXJTcGVjaWZpZXIgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyU3BlY2lmaWVyLmtpbmQgPT09ICdhdHRyaWJ1dGUnICYmIGZpbHRlclNwZWNpZmllci5vcCA9PT0gJ2VxdWFsJykge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlRmlsdGVyID0gZmlsdGVyU3BlY2lmaWVyO1xuICAgICAgICAgICAgLy8gTm90ZTogV2UgZG9uJ3Qga25vdyB0aGUgYHR5cGVgIG9mIHRoZSBhdHRyaWJ1dGUgaGVyZSwgc28gcGFzc2luZyBgbnVsbGBcbiAgICAgICAgICAgIGNvbnN0IHJlc291cmNlQXR0cmlidXRlID0gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VBdHRyaWJ1dGUobnVsbCwgYXR0cmlidXRlRmlsdGVyLmF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2goeyBbcmVzb3VyY2VBdHRyaWJ1dGVdOiBhdHRyaWJ1dGVGaWx0ZXIudmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyU3BlY2lmaWVyLmtpbmQgPT09ICdyZWxhdGVkUmVjb3JkJykge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZEZpbHRlciA9IGZpbHRlclNwZWNpZmllcjtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlbGF0ZWRSZWNvcmRGaWx0ZXIucmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7IFtyZWxhdGVkUmVjb3JkRmlsdGVyLnJlbGF0aW9uXTogcmVsYXRlZFJlY29yZEZpbHRlci5yZWNvcmQubWFwKGUgPT4gZS5pZCkuam9pbignLCcpIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goeyBbcmVsYXRlZFJlY29yZEZpbHRlci5yZWxhdGlvbl06IHJlbGF0ZWRSZWNvcmRGaWx0ZXIucmVjb3JkLmlkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbHRlclNwZWNpZmllci5raW5kID09PSAncmVsYXRlZFJlY29yZHMnKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyU3BlY2lmaWVyLm9wICE9PSAnZXF1YWwnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBPcGVyYXRpb24gXCIke2ZpbHRlclNwZWNpZmllci5vcH1cIiBpcyBub3Qgc3VwcG9ydGVkIGluIEpTT05BUEkgZm9yIHJlbGF0ZWRSZWNvcmRzIGZpbHRlcmluZ2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHNGaWx0ZXIgPSBmaWx0ZXJTcGVjaWZpZXI7XG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2goeyBbcmVsYXRlZFJlY29yZHNGaWx0ZXIucmVsYXRpb25dOiByZWxhdGVkUmVjb3Jkc0ZpbHRlci5yZWNvcmRzLm1hcChlID0+IGUuaWQpLmpvaW4oJywnKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yKGBGaWx0ZXIgb3BlcmF0aW9uICR7ZmlsdGVyU3BlY2lmaWVyLm9wfSBub3QgcmVjb2duaXplZCBmb3IgSlNPTkFQSVNvdXJjZS5gLCBmaWx0ZXJTcGVjaWZpZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlcnM7XG59XG5mdW5jdGlvbiBidWlsZFNvcnRQYXJhbShzb3VyY2UsIHNvcnRTcGVjaWZpZXJzKSB7XG4gICAgcmV0dXJuIHNvcnRTcGVjaWZpZXJzLm1hcChzb3J0U3BlY2lmaWVyID0+IHtcbiAgICAgICAgaWYgKHNvcnRTcGVjaWZpZXIua2luZCA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZVNvcnQgPSBzb3J0U3BlY2lmaWVyO1xuICAgICAgICAgICAgLy8gTm90ZTogV2UgZG9uJ3Qga25vdyB0aGUgYHR5cGVgIG9mIHRoZSBhdHRyaWJ1dGUgaGVyZSwgc28gcGFzc2luZyBgbnVsbGBcbiAgICAgICAgICAgIGNvbnN0IHJlc291cmNlQXR0cmlidXRlID0gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VBdHRyaWJ1dGUobnVsbCwgYXR0cmlidXRlU29ydC5hdHRyaWJ1dGUpO1xuICAgICAgICAgICAgcmV0dXJuIChzb3J0U3BlY2lmaWVyLm9yZGVyID09PSAnZGVzY2VuZGluZycgPyAnLScgOiAnJykgKyByZXNvdXJjZUF0dHJpYnV0ZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcihgU29ydCBzcGVjaWZpZXIgJHtzb3J0U3BlY2lmaWVyLmtpbmR9IG5vdCByZWNvZ25pemVkIGZvciBKU09OQVBJU291cmNlLmAsIHNvcnRTcGVjaWZpZXIpO1xuICAgIH0pLmpvaW4oJywnKTtcbn0iXX0=