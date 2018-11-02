'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _getOperators = require('./get-operators');

function deserialize(source, document) {
    const deserialized = source.serializer.deserializeDocument(document);
    const records = (0, _utils.toArray)(deserialized.data);
    if (deserialized.included) {
        Array.prototype.push.apply(records, deserialized.included);
    }
    return records.map(record => {
        return {
            op: 'replaceRecord',
            record
        };
    });
}
function extractRecords(source, document) {
    const deserialized = source.serializer.deserializeDocument(document);
    return (0, _utils.toArray)(deserialized.data);
}
const PullOperators = exports.PullOperators = {
    findRecord(source, query) {
        return _getOperators.GetOperators.findRecord(source, query).then(data => [(0, _data.buildTransform)(deserialize(source, data))]);
    },
    findRecords(source, query) {
        return _getOperators.GetOperators.findRecords(source, query).then(data => [(0, _data.buildTransform)(deserialize(source, data))]);
    },
    findRelatedRecord(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        return _getOperators.GetOperators.findRelatedRecord(source, query).then(data => {
            const operations = deserialize(source, data);
            const records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecord',
                record,
                relationship,
                relatedRecord: {
                    type: records[0].type,
                    id: records[0].id
                }
            });
            return [(0, _data.buildTransform)(operations)];
        });
    },
    findRelatedRecords(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        return _getOperators.GetOperators.findRelatedRecords(source, query).then(data => {
            const operations = deserialize(source, data);
            const records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecords',
                record,
                relationship,
                relatedRecords: records.map(r => ({
                    type: r.type,
                    id: r.id
                }))
            });
            return [(0, _data.buildTransform)(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJkZXNlcmlhbGl6ZSIsInNvdXJjZSIsImRvY3VtZW50IiwiZGVzZXJpYWxpemVkIiwic2VyaWFsaXplciIsImRlc2VyaWFsaXplRG9jdW1lbnQiLCJyZWNvcmRzIiwiZGF0YSIsImluY2x1ZGVkIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJtYXAiLCJyZWNvcmQiLCJvcCIsImV4dHJhY3RSZWNvcmRzIiwiUHVsbE9wZXJhdG9ycyIsImZpbmRSZWNvcmQiLCJxdWVyeSIsIkdldE9wZXJhdG9ycyIsInRoZW4iLCJmaW5kUmVjb3JkcyIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZXhwcmVzc2lvbiIsInJlbGF0aW9uc2hpcCIsIm9wZXJhdGlvbnMiLCJyZWxhdGVkUmVjb3JkIiwidHlwZSIsImlkIiwiZmluZFJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZHMiLCJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0EsU0FBU0EsV0FBVCxDQUFxQkMsTUFBckIsRUFBNkJDLFFBQTdCLEVBQXVDO0FBQ25DLFVBQU1DLGVBQWVGLE9BQU9HLFVBQVAsQ0FBa0JDLG1CQUFsQixDQUFzQ0gsUUFBdEMsQ0FBckI7QUFDQSxVQUFNSSxVQUFVLG9CQUFRSCxhQUFhSSxJQUFyQixDQUFoQjtBQUNBLFFBQUlKLGFBQWFLLFFBQWpCLEVBQTJCO0FBQ3ZCQyxjQUFNQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsS0FBckIsQ0FBMkJOLE9BQTNCLEVBQW9DSCxhQUFhSyxRQUFqRDtBQUNIO0FBQ0QsV0FBT0YsUUFBUU8sR0FBUixDQUFZQyxVQUFVO0FBQ3pCLGVBQU87QUFDSEMsZ0JBQUksZUFERDtBQUVIRDtBQUZHLFNBQVA7QUFJSCxLQUxNLENBQVA7QUFNSDtBQUNELFNBQVNFLGNBQVQsQ0FBd0JmLE1BQXhCLEVBQWdDQyxRQUFoQyxFQUEwQztBQUN0QyxVQUFNQyxlQUFlRixPQUFPRyxVQUFQLENBQWtCQyxtQkFBbEIsQ0FBc0NILFFBQXRDLENBQXJCO0FBQ0EsV0FBTyxvQkFBUUMsYUFBYUksSUFBckIsQ0FBUDtBQUNIO0FBQ00sTUFBTVUsd0NBQWdCO0FBQ3pCQyxlQUFXakIsTUFBWCxFQUFtQmtCLEtBQW5CLEVBQTBCO0FBQ3RCLGVBQU9DLDJCQUFhRixVQUFiLENBQXdCakIsTUFBeEIsRUFBZ0NrQixLQUFoQyxFQUF1Q0UsSUFBdkMsQ0FBNENkLFFBQVEsQ0FBQywwQkFBZVAsWUFBWUMsTUFBWixFQUFvQk0sSUFBcEIsQ0FBZixDQUFELENBQXBELENBQVA7QUFDSCxLQUh3QjtBQUl6QmUsZ0JBQVlyQixNQUFaLEVBQW9Ca0IsS0FBcEIsRUFBMkI7QUFDdkIsZUFBT0MsMkJBQWFFLFdBQWIsQ0FBeUJyQixNQUF6QixFQUFpQ2tCLEtBQWpDLEVBQXdDRSxJQUF4QyxDQUE2Q2QsUUFBUSxDQUFDLDBCQUFlUCxZQUFZQyxNQUFaLEVBQW9CTSxJQUFwQixDQUFmLENBQUQsQ0FBckQsQ0FBUDtBQUNILEtBTndCO0FBT3pCZ0Isc0JBQWtCdEIsTUFBbEIsRUFBMEJrQixLQUExQixFQUFpQztBQUM3QixjQUFNSyxhQUFhTCxNQUFNSyxVQUF6QjtBQUNBLGNBQU0sRUFBRVYsTUFBRixFQUFVVyxZQUFWLEtBQTJCRCxVQUFqQztBQUNBLGVBQU9KLDJCQUFhRyxpQkFBYixDQUErQnRCLE1BQS9CLEVBQXVDa0IsS0FBdkMsRUFBOENFLElBQTlDLENBQW1EZCxRQUFRO0FBQzlELGtCQUFNbUIsYUFBYTFCLFlBQVlDLE1BQVosRUFBb0JNLElBQXBCLENBQW5CO0FBQ0Esa0JBQU1ELFVBQVVVLGVBQWVmLE1BQWYsRUFBdUJNLElBQXZCLENBQWhCO0FBQ0FtQix1QkFBV2YsSUFBWCxDQUFnQjtBQUNaSSxvQkFBSSxzQkFEUTtBQUVaRCxzQkFGWTtBQUdaVyw0QkFIWTtBQUlaRSwrQkFBZTtBQUNYQywwQkFBTXRCLFFBQVEsQ0FBUixFQUFXc0IsSUFETjtBQUVYQyx3QkFBSXZCLFFBQVEsQ0FBUixFQUFXdUI7QUFGSjtBQUpILGFBQWhCO0FBU0EsbUJBQU8sQ0FBQywwQkFBZUgsVUFBZixDQUFELENBQVA7QUFDSCxTQWJNLENBQVA7QUFjSCxLQXhCd0I7QUF5QnpCSSx1QkFBbUI3QixNQUFuQixFQUEyQmtCLEtBQTNCLEVBQWtDO0FBQzlCLGNBQU1LLGFBQWFMLE1BQU1LLFVBQXpCO0FBQ0EsY0FBTSxFQUFFVixNQUFGLEVBQVVXLFlBQVYsS0FBMkJELFVBQWpDO0FBQ0EsZUFBT0osMkJBQWFVLGtCQUFiLENBQWdDN0IsTUFBaEMsRUFBd0NrQixLQUF4QyxFQUErQ0UsSUFBL0MsQ0FBb0RkLFFBQVE7QUFDL0Qsa0JBQU1tQixhQUFhMUIsWUFBWUMsTUFBWixFQUFvQk0sSUFBcEIsQ0FBbkI7QUFDQSxrQkFBTUQsVUFBVVUsZUFBZWYsTUFBZixFQUF1Qk0sSUFBdkIsQ0FBaEI7QUFDQW1CLHVCQUFXZixJQUFYLENBQWdCO0FBQ1pJLG9CQUFJLHVCQURRO0FBRVpELHNCQUZZO0FBR1pXLDRCQUhZO0FBSVpNLGdDQUFnQnpCLFFBQVFPLEdBQVIsQ0FBWW1CLE1BQU07QUFDOUJKLDBCQUFNSSxFQUFFSixJQURzQjtBQUU5QkMsd0JBQUlHLEVBQUVIO0FBRndCLGlCQUFOLENBQVo7QUFKSixhQUFoQjtBQVNBLG1CQUFPLENBQUMsMEJBQWVILFVBQWYsQ0FBRCxDQUFQO0FBQ0gsU0FiTSxDQUFQO0FBY0g7QUExQ3dCLENBQXRCIiwiZmlsZSI6ImxpYi9wdWxsLW9wZXJhdG9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBHZXRPcGVyYXRvcnMgfSBmcm9tIFwiLi9nZXQtb3BlcmF0b3JzXCI7XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZShzb3VyY2UsIGRvY3VtZW50KSB7XG4gICAgY29uc3QgZGVzZXJpYWxpemVkID0gc291cmNlLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChkb2N1bWVudCk7XG4gICAgY29uc3QgcmVjb3JkcyA9IHRvQXJyYXkoZGVzZXJpYWxpemVkLmRhdGEpO1xuICAgIGlmIChkZXNlcmlhbGl6ZWQuaW5jbHVkZWQpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVjb3JkcywgZGVzZXJpYWxpemVkLmluY2x1ZGVkKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBleHRyYWN0UmVjb3Jkcyhzb3VyY2UsIGRvY3VtZW50KSB7XG4gICAgY29uc3QgZGVzZXJpYWxpemVkID0gc291cmNlLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChkb2N1bWVudCk7XG4gICAgcmV0dXJuIHRvQXJyYXkoZGVzZXJpYWxpemVkLmRhdGEpO1xufVxuZXhwb3J0IGNvbnN0IFB1bGxPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZChzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBHZXRPcGVyYXRvcnMuZmluZFJlY29yZChzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4gW2J1aWxkVHJhbnNmb3JtKGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSkpXSk7XG4gICAgfSxcbiAgICBmaW5kUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBHZXRPcGVyYXRvcnMuZmluZFJlY29yZHMoc291cmNlLCBxdWVyeSkudGhlbihkYXRhID0+IFtidWlsZFRyYW5zZm9ybShkZXNlcmlhbGl6ZShzb3VyY2UsIGRhdGEpKV0pO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgcmV0dXJuIEdldE9wZXJhdG9ycy5maW5kUmVsYXRlZFJlY29yZChzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gZXh0cmFjdFJlY29yZHMoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJlY29yZHNbMF0udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlY29yZHNbMF0uaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGZpbmRSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xuICAgICAgICByZXR1cm4gR2V0T3BlcmF0b3JzLmZpbmRSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gZXh0cmFjdFJlY29yZHMoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IHJlY29yZHMubWFwKHIgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogci50eXBlLFxuICAgICAgICAgICAgICAgICAgICBpZDogci5pZFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gW2J1aWxkVHJhbnNmb3JtKG9wZXJhdGlvbnMpXTtcbiAgICAgICAgfSk7XG4gICAgfVxufTsiXX0=