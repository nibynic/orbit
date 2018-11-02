'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GetOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _requestSettings = require('./request-settings');

const GetOperators = exports.GetOperators = {
    findRecord(source, query) {
        const expression = query.expression;
        const { record } = expression;
        const requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        const settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.resourceURL(record.type, record.id), settings);
    },
    findRecords(source, query) {
        const expression = query.expression;
        const { type } = expression;
        let requestOptions = {};
        if (expression.filter) {
            requestOptions.filter = buildFilterParam(source, expression.filter);
        }
        if (expression.sort) {
            requestOptions.sort = buildSortParam(source, expression.sort);
        }
        if (expression.page) {
            requestOptions.page = expression.page;
        }
        let customOptions = (0, _requestSettings.customRequestOptions)(source, query);
        if (customOptions) {
            (0, _utils.merge)(requestOptions, customOptions);
        }
        const settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.resourceURL(type), settings);
    },
    findRelatedRecord(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        const requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        const settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings);
    },
    findRelatedRecords(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        let requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        const settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings);
    }
};
function buildFilterParam(source, filterSpecifiers) {
    const filters = [];
    filterSpecifiers.forEach(filterSpecifier => {
        if (filterSpecifier.kind === 'attribute' && filterSpecifier.op === 'equal') {
            const attributeFilter = filterSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            const resourceAttribute = source.serializer.resourceAttribute(null, attributeFilter.attribute);
            filters.push({ [resourceAttribute]: attributeFilter.value });
        } else if (filterSpecifier.kind === 'relatedRecord') {
            const relatedRecordFilter = filterSpecifier;
            if (Array.isArray(relatedRecordFilter.record)) {
                filters.push({ [relatedRecordFilter.relation]: relatedRecordFilter.record.map(e => e.id).join(',') });
            } else {
                filters.push({ [relatedRecordFilter.relation]: relatedRecordFilter.record.id });
            }
        } else if (filterSpecifier.kind === 'relatedRecords') {
            if (filterSpecifier.op !== 'equal') {
                throw new Error(`Operation "${filterSpecifier.op}" is not supported in JSONAPI for relatedRecords filtering`);
            }
            const relatedRecordsFilter = filterSpecifier;
            filters.push({ [relatedRecordsFilter.relation]: relatedRecordsFilter.records.map(e => e.id).join(',') });
        } else {
            throw new _data.QueryExpressionParseError(`Filter operation ${filterSpecifier.op} not recognized for JSONAPISource.`, filterSpecifier);
        }
    });
    return filters;
}
function buildSortParam(source, sortSpecifiers) {
    return sortSpecifiers.map(sortSpecifier => {
        if (sortSpecifier.kind === 'attribute') {
            const attributeSort = sortSpecifier;
            // Note: We don't know the `type` of the attribute here, so passing `null`
            const resourceAttribute = source.serializer.resourceAttribute(null, attributeSort.attribute);
            return (sortSpecifier.order === 'descending' ? '-' : '') + resourceAttribute;
        }
        throw new _data.QueryExpressionParseError(`Sort specifier ${sortSpecifier.kind} not recognized for JSONAPISource.`, sortSpecifier);
    }).join(',');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9nZXQtb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbIkdldE9wZXJhdG9ycyIsImZpbmRSZWNvcmQiLCJzb3VyY2UiLCJxdWVyeSIsImV4cHJlc3Npb24iLCJyZWNvcmQiLCJyZXF1ZXN0T3B0aW9ucyIsInNldHRpbmdzIiwiZmV0Y2giLCJyZXNvdXJjZVVSTCIsInR5cGUiLCJpZCIsImZpbmRSZWNvcmRzIiwiZmlsdGVyIiwiYnVpbGRGaWx0ZXJQYXJhbSIsInNvcnQiLCJidWlsZFNvcnRQYXJhbSIsInBhZ2UiLCJjdXN0b21PcHRpb25zIiwiZmluZFJlbGF0ZWRSZWNvcmQiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVzb3VyY2VVUkwiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJmaWx0ZXJTcGVjaWZpZXJzIiwiZmlsdGVycyIsImZvckVhY2giLCJmaWx0ZXJTcGVjaWZpZXIiLCJraW5kIiwib3AiLCJhdHRyaWJ1dGVGaWx0ZXIiLCJyZXNvdXJjZUF0dHJpYnV0ZSIsInNlcmlhbGl6ZXIiLCJhdHRyaWJ1dGUiLCJwdXNoIiwidmFsdWUiLCJyZWxhdGVkUmVjb3JkRmlsdGVyIiwiQXJyYXkiLCJpc0FycmF5IiwicmVsYXRpb24iLCJtYXAiLCJlIiwiam9pbiIsIkVycm9yIiwicmVsYXRlZFJlY29yZHNGaWx0ZXIiLCJyZWNvcmRzIiwiUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvciIsInNvcnRTcGVjaWZpZXJzIiwic29ydFNwZWNpZmllciIsImF0dHJpYnV0ZVNvcnQiLCJvcmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNPLE1BQU1BLHNDQUFlO0FBQ3hCQyxlQUFXQyxNQUFYLEVBQW1CQyxLQUFuQixFQUEwQjtBQUN0QixjQUFNQyxhQUFhRCxNQUFNQyxVQUF6QjtBQUNBLGNBQU0sRUFBRUMsTUFBRixLQUFhRCxVQUFuQjtBQUNBLGNBQU1FLGlCQUFpQiwyQ0FBcUJKLE1BQXJCLEVBQTZCQyxLQUE3QixDQUF2QjtB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QzRDLGNBQWhDLEVBQWdEO0FBQzVDLFdBQU9BLGVBQWVQLEdBQWYsQ0FBbUJRLGlCQUFpQjtBQUN2QyxZQUFJQSxjQUFjcEIsSUFBZCxLQUF1QixXQUEzQixFQUF3QztBQUNwQyxrQkFBTXFCLGdCQUFnQkQsYUFBdEI7QUFDQTtBQUNBLGtCQUFNakIsb0JBQW9CNUIsT0FBTzZCLFVBQVAsQ0FBa0JELGlCQUFsQixDQUFvQyxJQUFwQyxFQUEwQ2tCLGNBQWNoQixTQUF4RCxDQUExQjtBQUNBLG1CQUFPLENBQUNlLGNBQWNFLEtBQWQsS0FBd0IsWUFBeEIsR0FBdUMsR0FBdkMsR0FBNkMsRUFBOUMsSUFBb0RuQixpQkFBM0Q7QUFDSDtBQUNELGNBQU0sSUFBSWUsK0JBQUosQ0FBK0Isa0JBQWlCRSxjQUFjcEIsSUFBSyxvQ0FBbkUsRUFBd0dvQixhQUF4RyxDQUFOO0FBQ0gsS0FSTSxFQVFKTixJQVJJLENBUUMsR0FSRCxDQUFQO0FBU0giLCJmaWxlIjoibGliL2dldC1vcGVyYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYnVpbGRGZXRjaFNldHRpbmdzLCBjdXN0b21SZXF1ZXN0T3B0aW9ucyB9IGZyb20gJy4vcmVxdWVzdC1zZXR0aW5ncyc7XG5leHBvcnQgY29uc3QgR2V0T3BlcmF0b3JzID0ge1xuICAgIGZpbmRSZWNvcmQoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyByZWNvcmQgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0gY3VzdG9tUmVxdWVzdE9wdGlvbnMoc291cmNlLCBxdWVyeSk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VVUkwocmVjb3JkLnR5cGUsIHJlY29yZC5pZCksIHNldHRpbmdzKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmRzKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IHJlcXVlc3RPcHRpb25zID0ge307XG4gICAgICAgIGlmIChleHByZXNzaW9uLmZpbHRlcikge1xuICAgICAgICAgICAgcmVxdWVzdE9wdGlvbnMuZmlsdGVyID0gYnVpbGRGaWx0ZXJQYXJhbShzb3VyY2UsIGV4cHJlc3Npb24uZmlsdGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbi5zb3J0KSB7XG4gICAgICAgICAgICByZXF1ZXN0T3B0aW9ucy5zb3J0ID0gYnVpbGRTb3J0UGFyYW0oc291cmNlLCBleHByZXNzaW9uLnNvcnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHByZXNzaW9uLnBhZ2UpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLnBhZ2UgPSBleHByZXNzaW9uLnBhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1c3RvbU9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHF1ZXJ5KTtcbiAgICAgICAgaWYgKGN1c3RvbU9wdGlvbnMpIHtcbiAgICAgICAgICAgIG1lcmdlKHJlcXVlc3RPcHRpb25zLCBjdXN0b21PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUpLCBzZXR0aW5ncyk7XG4gICAgfSxcbiAgICBmaW5kUmVsYXRlZFJlY29yZChzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlbGF0ZWRSZXNvdXJjZVVSTChyZWNvcmQudHlwZSwgcmVjb3JkLmlkLCByZWxhdGlvbnNoaXApLCBzZXR0aW5ncyk7XG4gICAgfSxcbiAgICBmaW5kUmVsYXRlZFJlY29yZHMoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgbGV0IHJlcXVlc3RPcHRpb25zID0gY3VzdG9tUmVxdWVzdE9wdGlvbnMoc291cmNlLCBxdWVyeSk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVsYXRlZFJlc291cmNlVVJMKHJlY29yZC50eXBlLCByZWNvcmQuaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKTtcbiAgICB9XG59O1xuZnVuY3Rpb24gYnVpbGRGaWx0ZXJQYXJhbShzb3VyY2UsIGZpbHRlclNwZWNpZmllcnMpIHtcbiAgICBjb25zdCBmaWx0ZXJzID0gW107XG4gICAgZmlsdGVyU3BlY2lmaWVycy5mb3JFYWNoKGZpbHRlclNwZWNpZmllciA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJTcGVjaWZpZXIua2luZCA9PT0gJ2F0dHJpYnV0ZScgJiYgZmlsdGVyU3BlY2lmaWVyLm9wID09PSAnZXF1YWwnKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVGaWx0ZXIgPSBmaWx0ZXJTcGVjaWZpZXI7XG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBkb24ndCBrbm93IHRoZSBgdHlwZWAgb2YgdGhlIGF0dHJpYnV0ZSBoZXJlLCBzbyBwYXNzaW5nIGBudWxsYFxuICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUF0dHJpYnV0ZShudWxsLCBhdHRyaWJ1dGVGaWx0ZXIuYXR0cmlidXRlKTtcbiAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7IFtyZXNvdXJjZUF0dHJpYnV0ZV06IGF0dHJpYnV0ZUZpbHRlci52YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXJTcGVjaWZpZXIua2luZCA9PT0gJ3JlbGF0ZWRSZWNvcmQnKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkRmlsdGVyID0gZmlsdGVyU3BlY2lmaWVyO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVsYXRlZFJlY29yZEZpbHRlci5yZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHsgW3JlbGF0ZWRSZWNvcmRGaWx0ZXIucmVsYXRpb25dOiByZWxhdGVkUmVjb3JkRmlsdGVyLnJlY29yZC5tYXAoZSA9PiBlLmlkKS5qb2luKCcsJykgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7IFtyZWxhdGVkUmVjb3JkRmlsdGVyLnJlbGF0aW9uXTogcmVsYXRlZFJlY29yZEZpbHRlci5yZWNvcmQuaWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyU3BlY2lmaWVyLmtpbmQgPT09ICdyZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJTcGVjaWZpZXIub3AgIT09ICdlcXVhbCcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE9wZXJhdGlvbiBcIiR7ZmlsdGVyU3BlY2lmaWVyLm9wfVwiIGlzIG5vdCBzdXBwb3J0ZWQgaW4gSlNPTkFQSSBmb3IgcmVsYXRlZFJlY29yZHMgZmlsdGVyaW5nYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3Jkc0ZpbHRlciA9IGZpbHRlclNwZWNpZmllcjtcbiAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7IFtyZWxhdGVkUmVjb3Jkc0ZpbHRlci5yZWxhdGlvbl06IHJlbGF0ZWRSZWNvcmRzRmlsdGVyLnJlY29yZHMubWFwKGUgPT4gZS5pZCkuam9pbignLCcpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoYEZpbHRlciBvcGVyYXRpb24gJHtmaWx0ZXJTcGVjaWZpZXIub3B9IG5vdCByZWNvZ25pemVkIGZvciBKU09OQVBJU291cmNlLmAsIGZpbHRlclNwZWNpZmllcik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVycztcbn1cbmZ1bmN0aW9uIGJ1aWxkU29ydFBhcmFtKHNvdXJjZSwgc29ydFNwZWNpZmllcnMpIHtcbiAgICByZXR1cm4gc29ydFNwZWNpZmllcnMubWFwKHNvcnRTcGVjaWZpZXIgPT4ge1xuICAgICAgICBpZiAoc29ydFNwZWNpZmllci5raW5kID09PSAnYXR0cmlidXRlJykge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlU29ydCA9IHNvcnRTcGVjaWZpZXI7XG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBkb24ndCBrbm93IHRoZSBgdHlwZWAgb2YgdGhlIGF0dHJpYnV0ZSBoZXJlLCBzbyBwYXNzaW5nIGBudWxsYFxuICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUF0dHJpYnV0ZShudWxsLCBhdHRyaWJ1dGVTb3J0LmF0dHJpYnV0ZSk7XG4gICAgICAgICAgICByZXR1cm4gKHNvcnRTcGVjaWZpZXIub3JkZXIgPT09ICdkZXNjZW5kaW5nJyA/ICctJyA6ICcnKSArIHJlc291cmNlQXR0cmlidXRlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yKGBTb3J0IHNwZWNpZmllciAke3NvcnRTcGVjaWZpZXIua2luZH0gbm90IHJlY29nbml6ZWQgZm9yIEpTT05BUElTb3VyY2UuYCwgc29ydFNwZWNpZmllcik7XG4gICAgfSkuam9pbignLCcpO1xufSJdfQ==