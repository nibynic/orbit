'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GetOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _requestSettings = require('./request-settings');

var GetOperators = exports.GetOperators = {
    findRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record;

        var requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        var settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
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
        var customOptions = (0, _requestSettings.customRequestOptions)(source, query);
        if (customOptions) {
            (0, _utils.merge)(requestOptions, customOptions);
        }
        var settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.resourceURL(type), settings);
    },
    findRelatedRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        var requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        var settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
        return source.fetch(source.relatedResourceURL(record.type, record.id, relationship), settings);
    },
    findRelatedRecords: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        var requestOptions = (0, _requestSettings.customRequestOptions)(source, query);
        var settings = (0, _requestSettings.buildFetchSettings)(requestOptions);
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
            throw new _data.QueryExpressionParseError('Filter operation ' + filterSpecifier.op + ' not recognized for JSONAPISource.', filterSpecifier);
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
        throw new _data.QueryExpressionParseError('Sort specifier ' + sortSpecifier.kind + ' not recognized for JSONAPISource.', sortSpecifier);
    }).join(',');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9nZXQtb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbIkdldE9wZXJhdG9ycyIsImV4cHJlc3Npb24iLCJxdWVyeSIsInJlcXVlc3RPcHRpb25zIiwiY3VzdG9tUmVxdWVzdE9wdGlvbnMiLCJzZXR0aW5ncyIsImJ1aWxkRmV0Y2hTZXR0aW5ncyIsInNvdXJjZSIsInJlY29yZCIsImJ1aWxkRmlsdGVyUGFyYW0iLCJidWlsZFNvcnRQYXJhbSIsImN1c3RvbU9wdGlvbnMiLCJtZXJnZSIsImZpbHRlcnMiLCJmaWx0ZXJTcGVjaWZpZXJzIiwiZmlsdGVyU3BlY2lmaWVyIiwiYXR0cmlidXRlRmlsdGVyIiwicmVzb3VyY2VBdHRyaWJ1dGUiLCJyZWxhdGVkUmVjb3JkRmlsdGVyIiwiQXJyYXkiLCJlIiwicmVsYXRlZFJlY29yZHNGaWx0ZXIiLCJzb3J0U3BlY2lmaWVyIiwiYXR0cmlidXRlU29ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ08sSUFBTUEsc0NBQWU7QUFBQSxnQkFBQSxVQUFBLE1BQUEsRUFBQSxLQUFBLEVBQ0U7QUFDdEIsWUFBTUMsYUFBYUMsTUFBbkIsVUFBQTtBQURzQixZQUFBLFNBQUEsV0FBQSxNQUFBOztBQUd0QixZQUFNQyxpQkFBaUJDLDJDQUFBQSxNQUFBQSxFQUF2QixLQUF1QkEsQ0FBdkI7QUFDQSxZQUFNQyxXQUFXQyx5Q0FBakIsY0FBaUJBLENBQWpCO0FBQ0EsZUFBT0MsT0FBQUEsS0FBQUEsQ0FBYUEsT0FBQUEsV0FBQUEsQ0FBbUJDLE9BQW5CRCxJQUFBQSxFQUFnQ0MsT0FBN0NELEVBQWFBLENBQWJBLEVBQVAsUUFBT0EsQ0FBUDtBQU5vQixLQUFBO0FBQUEsaUJBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQVFHO0FBQ3ZCLFlBQU1OLGFBQWFDLE1BQW5CLFVBQUE7QUFEdUIsWUFBQSxPQUFBLFdBQUEsSUFBQTs7QUFHdkIsWUFBSUMsaUJBQUosRUFBQTtBQUNBLFlBQUlGLFdBQUosTUFBQSxF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QUFBO0FBQ0E7QUFDQSxnQkFBTU4sb0JBQW9CVixPQUFBQSxVQUFBQSxDQUFBQSxpQkFBQUEsQ0FBQUEsSUFBQUEsRUFBMENnQixjQUFwRSxTQUEwQmhCLENBQTFCO0FBQ0EsbUJBQU8sQ0FBQ2UsY0FBQUEsS0FBQUEsS0FBQUEsWUFBQUEsR0FBQUEsR0FBQUEsR0FBRCxFQUFBLElBQVAsaUJBQUE7QUFDSDtBQUNELGNBQU0sSUFBQSwrQkFBQSxDQUFBLG9CQUFnREEsY0FBaEQsSUFBQSxHQUFBLG9DQUFBLEVBQU4sYUFBTSxDQUFOO0FBUEcsS0FBQSxFQUFBLElBQUEsQ0FBUCxHQUFPLENBQVA7QUFTSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1lcmdlIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBidWlsZEZldGNoU2V0dGluZ3MsIGN1c3RvbVJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi9yZXF1ZXN0LXNldHRpbmdzJztcbmV4cG9ydCBjb25zdCBHZXRPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZChzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHF1ZXJ5KTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdE9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTChyZWNvcmQudHlwZSwgcmVjb3JkLmlkKSwgc2V0dGluZ3MpO1xuICAgIH0sXG4gICAgZmluZFJlY29yZHMoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSBleHByZXNzaW9uO1xuICAgICAgICBsZXQgcmVxdWVzdE9wdGlvbnMgPSB7fTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24uZmlsdGVyKSB7XG4gICAgICAgICAgICByZXF1ZXN0T3B0aW9ucy5maWx0ZXIgPSBidWlsZEZpbHRlclBhcmFtKHNvdXJjZSwgZXhwcmVzc2lvbi5maWx0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHByZXNzaW9uLnNvcnQpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zLnNvcnQgPSBidWlsZFNvcnRQYXJhbShzb3VyY2UsIGV4cHJlc3Npb24uc29ydCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHJlc3Npb24ucGFnZSkge1xuICAgICAgICAgICAgcmVxdWVzdE9wdGlvbnMucGFnZSA9IGV4cHJlc3Npb24ucGFnZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VzdG9tT3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgcXVlcnkpO1xuICAgICAgICBpZiAoY3VzdG9tT3B0aW9ucykge1xuICAgICAgICAgICAgbWVyZ2UocmVxdWVzdE9wdGlvbnMsIGN1c3RvbU9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VVUkwodHlwZSksIHNldHRpbmdzKTtcbiAgICB9LFxuICAgIGZpbmRSZWxhdGVkUmVjb3JkKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0gY3VzdG9tUmVxdWVzdE9wdGlvbnMoc291cmNlLCBxdWVyeSk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3RPcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVsYXRlZFJlc291cmNlVVJMKHJlY29yZC50eXBlLCByZWNvcmQuaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKTtcbiAgICB9LFxuICAgIGZpbmRSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xuICAgICAgICBsZXQgcmVxdWVzdE9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHF1ZXJ5KTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdE9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZWxhdGVkUmVzb3VyY2VVUkwocmVjb3JkLnR5cGUsIHJlY29yZC5pZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpO1xuICAgIH1cbn07XG5mdW5jdGlvbiBidWlsZEZpbHRlclBhcmFtKHNvdXJjZSwgZmlsdGVyU3BlY2lmaWVycykge1xuICAgIGNvbnN0IGZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJTcGVjaWZpZXJzLmZvckVhY2goZmlsdGVyU3BlY2lmaWVyID0+IHtcbiAgICAgICAgaWYgKGZpbHRlclNwZWNpZmllci5raW5kID09PSAnYXR0cmlidXRlJyAmJiBmaWx0ZXJTcGVjaWZpZXIub3AgPT09ICdlcXVhbCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZUZpbHRlciA9IGZpbHRlclNwZWNpZmllcjtcbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGRvbid0IGtub3cgdGhlIGB0eXBlYCBvZiB0aGUgYXR0cmlidXRlIGhlcmUsIHNvIHBhc3NpbmcgYG51bGxgXG4gICAgICAgICAgICBjb25zdCByZXNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlQXR0cmlidXRlKG51bGwsIGF0dHJpYnV0ZUZpbHRlci5hdHRyaWJ1dGUpO1xuICAgICAgICAgICAgZmlsdGVycy5wdXNoKHsgW3Jlc291cmNlQXR0cmlidXRlXTogYXR0cmlidXRlRmlsdGVyLnZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGZpbHRlclNwZWNpZmllci5raW5kID09PSAncmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRGaWx0ZXIgPSBmaWx0ZXJTcGVjaWZpZXI7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZWxhdGVkUmVjb3JkRmlsdGVyLnJlY29yZCkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goeyBbcmVsYXRlZFJlY29yZEZpbHRlci5yZWxhdGlvbl06IHJlbGF0ZWRSZWNvcmRGaWx0ZXIucmVjb3JkLm1hcChlID0+IGUuaWQpLmpvaW4oJywnKSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHsgW3JlbGF0ZWRSZWNvcmRGaWx0ZXIucmVsYXRpb25dOiByZWxhdGVkUmVjb3JkRmlsdGVyLnJlY29yZC5pZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXJTcGVjaWZpZXIua2luZCA9PT0gJ3JlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgaWYgKGZpbHRlclNwZWNpZmllci5vcCAhPT0gJ2VxdWFsJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgT3BlcmF0aW9uIFwiJHtmaWx0ZXJTcGVjaWZpZXIub3B9XCIgaXMgbm90IHN1cHBvcnRlZCBpbiBKU09OQVBJIGZvciByZWxhdGVkUmVjb3JkcyBmaWx0ZXJpbmdgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzRmlsdGVyID0gZmlsdGVyU3BlY2lmaWVyO1xuICAgICAgICAgICAgZmlsdGVycy5wdXNoKHsgW3JlbGF0ZWRSZWNvcmRzRmlsdGVyLnJlbGF0aW9uXTogcmVsYXRlZFJlY29yZHNGaWx0ZXIucmVjb3Jkcy5tYXAoZSA9PiBlLmlkKS5qb2luKCcsJykgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvcihgRmlsdGVyIG9wZXJhdGlvbiAke2ZpbHRlclNwZWNpZmllci5vcH0gbm90IHJlY29nbml6ZWQgZm9yIEpTT05BUElTb3VyY2UuYCwgZmlsdGVyU3BlY2lmaWVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXJzO1xufVxuZnVuY3Rpb24gYnVpbGRTb3J0UGFyYW0oc291cmNlLCBzb3J0U3BlY2lmaWVycykge1xuICAgIHJldHVybiBzb3J0U3BlY2lmaWVycy5tYXAoc29ydFNwZWNpZmllciA9PiB7XG4gICAgICAgIGlmIChzb3J0U3BlY2lmaWVyLmtpbmQgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVTb3J0ID0gc29ydFNwZWNpZmllcjtcbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGRvbid0IGtub3cgdGhlIGB0eXBlYCBvZiB0aGUgYXR0cmlidXRlIGhlcmUsIHNvIHBhc3NpbmcgYG51bGxgXG4gICAgICAgICAgICBjb25zdCByZXNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlQXR0cmlidXRlKG51bGwsIGF0dHJpYnV0ZVNvcnQuYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHJldHVybiAoc29ydFNwZWNpZmllci5vcmRlciA9PT0gJ2Rlc2NlbmRpbmcnID8gJy0nIDogJycpICsgcmVzb3VyY2VBdHRyaWJ1dGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IoYFNvcnQgc3BlY2lmaWVyICR7c29ydFNwZWNpZmllci5raW5kfSBub3QgcmVjb2duaXplZCBmb3IgSlNPTkFQSVNvdXJjZS5gLCBzb3J0U3BlY2lmaWVyKTtcbiAgICB9KS5qb2luKCcsJyk7XG59Il19