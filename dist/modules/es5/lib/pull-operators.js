import { toArray } from '@orbit/utils';
import { buildTransform } from '@orbit/data';
import { GetOperators } from "./get-operators";
function deserialize(source, document) {
    var deserialized = source.serializer.deserializeDocument(document);
    var records = toArray(deserialized.data);
    if (deserialized.included) {
        Array.prototype.push.apply(records, deserialized.included);
    }
    return records.map(function (record) {
        return {
            op: 'replaceRecord',
            record: record
        };
    });
}
function extractRecords(source, document) {
    var deserialized = source.serializer.deserializeDocument(document);
    return toArray(deserialized.data);
}
export var PullOperators = {
    findRecord: function (source, query) {
        return GetOperators.findRecord(source, query).then(function (data) {
            return [buildTransform(deserialize(source, data))];
        });
    },
    findRecords: function (source, query) {
        return GetOperators.findRecords(source, query).then(function (data) {
            return [buildTransform(deserialize(source, data))];
        });
    },
    findRelatedRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        return GetOperators.findRelatedRecord(source, query).then(function (data) {
            var operations = deserialize(source, data);
            var records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecord',
                record: record,
                relationship: relationship,
                relatedRecord: {
                    type: records[0].type,
                    id: records[0].id
                }
            });
            return [buildTransform(operations)];
        });
    },
    findRelatedRecords: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        return GetOperators.findRelatedRecords(source, query).then(function (data) {
            var operations = deserialize(source, data);
            var records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecords: records.map(function (r) {
                    return {
                        type: r.type,
                        id: r.id
                    };
                })
            });
            return [buildTransform(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJ0b0FycmF5IiwiYnVpbGRUcmFuc2Zvcm0iLCJHZXRPcGVyYXRvcnMiLCJkZXNlcmlhbGl6ZSIsInNvdXJjZSIsImRvY3VtZW50IiwiZGVzZXJpYWxpemVkIiwic2VyaWFsaXplciIsImRlc2VyaWFsaXplRG9jdW1lbnQiLCJyZWNvcmRzIiwiZGF0YSIsImluY2x1ZGVkIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJtYXAiLCJvcCIsInJlY29yZCIsImV4dHJhY3RSZWNvcmRzIiwiUHVsbE9wZXJhdG9ycyIsImZpbmRSZWNvcmQiLCJxdWVyeSIsInRoZW4iLCJmaW5kUmVjb3JkcyIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZXhwcmVzc2lvbiIsInJlbGF0aW9uc2hpcCIsIm9wZXJhdGlvbnMiLCJyZWxhdGVkUmVjb3JkIiwidHlwZSIsImlkIiwiZmluZFJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZHMiLCJyIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxPQUFULFFBQXdCLGNBQXhCO0FBQ0EsU0FBU0MsY0FBVCxRQUErQixhQUEvQjtBQUNBLFNBQVNDLFlBQVQsUUFBNkIsaUJBQTdCO0FBQ0EsU0FBU0MsV0FBVCxDQUFxQkMsTUFBckIsRUFBNkJDLFFBQTdCLEVBQXVDO0FBQ25DLFFBQU1DLGVBQWVGLE9BQU9HLFVBQVAsQ0FBa0JDLG1CQUFsQixDQUFzQ0gsUUFBdEMsQ0FBckI7QUFDQSxRQUFNSSxVQUFVVCxRQUFRTSxhQUFhSSxJQUFyQixDQUFoQjtBQUNBLFFBQUlKLGFBQWFLLFFBQWpCLEVBQTJCO0FBQ3ZCQyxjQUFNQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsS0FBckIsQ0FBMkJOLE9BQTNCLEVBQW9DSCxhQUFhSyxRQUFqRDtBQUNIO0FBQ0QsV0FBT0YsUUFBUU8sR0FBUixDQUFZLGtCQUFVO0FBQ3pCLGVBQU87QUFDSEMsZ0JBQUksZUFERDtBQUVIQztB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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBHZXRPcGVyYXRvcnMgfSBmcm9tIFwiLi9nZXQtb3BlcmF0b3JzXCI7XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZShzb3VyY2UsIGRvY3VtZW50KSB7XG4gICAgY29uc3QgZGVzZXJpYWxpemVkID0gc291cmNlLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChkb2N1bWVudCk7XG4gICAgY29uc3QgcmVjb3JkcyA9IHRvQXJyYXkoZGVzZXJpYWxpemVkLmRhdGEpO1xuICAgIGlmIChkZXNlcmlhbGl6ZWQuaW5jbHVkZWQpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVjb3JkcywgZGVzZXJpYWxpemVkLmluY2x1ZGVkKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBleHRyYWN0UmVjb3Jkcyhzb3VyY2UsIGRvY3VtZW50KSB7XG4gICAgY29uc3QgZGVzZXJpYWxpemVkID0gc291cmNlLnNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChkb2N1bWVudCk7XG4gICAgcmV0dXJuIHRvQXJyYXkoZGVzZXJpYWxpemVkLmRhdGEpO1xufVxuZXhwb3J0IGNvbnN0IFB1bGxPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZChzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBHZXRPcGVyYXRvcnMuZmluZFJlY29yZChzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4gW2J1aWxkVHJhbnNmb3JtKGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSkpXSk7XG4gICAgfSxcbiAgICBmaW5kUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBHZXRPcGVyYXRvcnMuZmluZFJlY29yZHMoc291cmNlLCBxdWVyeSkudGhlbihkYXRhID0+IFtidWlsZFRyYW5zZm9ybShkZXNlcmlhbGl6ZShzb3VyY2UsIGRhdGEpKV0pO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQoc291cmNlLCBxdWVyeSkge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcXVlcnkuZXhwcmVzc2lvbjtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9ID0gZXhwcmVzc2lvbjtcbiAgICAgICAgcmV0dXJuIEdldE9wZXJhdG9ycy5maW5kUmVsYXRlZFJlY29yZChzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gZXh0cmFjdFJlY29yZHMoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHJlY29yZHNbMF0udHlwZSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlY29yZHNbMF0uaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGZpbmRSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xuICAgICAgICByZXR1cm4gR2V0T3BlcmF0b3JzLmZpbmRSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzID0gZXh0cmFjdFJlY29yZHMoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IHJlY29yZHMubWFwKHIgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogci50eXBlLFxuICAgICAgICAgICAgICAgICAgICBpZDogci5pZFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gW2J1aWxkVHJhbnNmb3JtKG9wZXJhdGlvbnMpXTtcbiAgICAgICAgfSk7XG4gICAgfVxufTsiXX0=