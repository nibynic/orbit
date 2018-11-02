'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _getOperators = require('./get-operators');

function deserialize(source, document) {
    var deserialized = source.serializer.deserializeDocument(document);
    var records = (0, _utils.toArray)(deserialized.data);
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
    return (0, _utils.toArray)(deserialized.data);
}
var PullOperators = exports.PullOperators = {
    findRecord: function (source, query) {
        return _getOperators.GetOperators.findRecord(source, query).then(function (data) {
            return [(0, _data.buildTransform)(deserialize(source, data))];
        });
    },
    findRecords: function (source, query) {
        return _getOperators.GetOperators.findRecords(source, query).then(function (data) {
            return [(0, _data.buildTransform)(deserialize(source, data))];
        });
    },
    findRelatedRecord: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        return _getOperators.GetOperators.findRelatedRecord(source, query).then(function (data) {
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
            return [(0, _data.buildTransform)(operations)];
        });
    },
    findRelatedRecords: function (source, query) {
        var expression = query.expression;
        var record = expression.record,
            relationship = expression.relationship;

        return _getOperators.GetOperators.findRelatedRecords(source, query).then(function (data) {
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
            return [(0, _data.buildTransform)(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJkZXNlcmlhbGl6ZWQiLCJzb3VyY2UiLCJyZWNvcmRzIiwidG9BcnJheSIsIkFycmF5Iiwib3AiLCJyZWNvcmQiLCJQdWxsT3BlcmF0b3JzIiwiYnVpbGRUcmFuc2Zvcm0iLCJkZXNlcmlhbGl6ZSIsImV4cHJlc3Npb24iLCJxdWVyeSIsIm9wZXJhdGlvbnMiLCJleHRyYWN0UmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmQiLCJ0eXBlIiwiaWQiLCJyZWxhdGVkUmVjb3JkcyIsInIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBLFNBQUEsV0FBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLEVBQXVDO0FBQ25DLFFBQU1BLGVBQWVDLE9BQUFBLFVBQUFBLENBQUFBLG1CQUFBQSxDQUFyQixRQUFxQkEsQ0FBckI7QUFDQSxRQUFNQyxVQUFVQyxvQkFBUUgsYUFBeEIsSUFBZ0JHLENBQWhCO0FBQ0EsUUFBSUgsYUFBSixRQUFBLEVBQTJCO0FBQ3ZCSSxjQUFBQSxTQUFBQSxDQUFBQSxJQUFBQSxDQUFBQSxLQUFBQSxDQUFBQSxPQUFBQSxFQUFvQ0osYUFBcENJLFFBQUFBO0FBQ0g7QUFDRCxXQUFPLFFBQUEsR0FBQSxDQUFZLFVBQUEsTUFBQSxFQUFVO0FBQ3pCLGVBQU87QUFDSEMsZ0JBREcsZUFBQTtBQUVIQyxvQkFBQUE7QUFGRyxTQUFQO0FBREosS0FBTyxDQUFQO0FBTUg7QUFDRCxTQUFBLGNBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxFQUEwQztBQUN0QyxRQUFNTixlQUFlQyxPQUFBQSxVQUFBQSxDQUFBQSxtQkFBQUEsQ0FBckIsUUFBcUJBLENBQXJCO0FBQ0EsV0FBT0Usb0JBQVFILGFBQWYsSUFBT0csQ0FBUDtBQUNIO0FBQ00sSUFBTUksd0NBQWdCO0FBQUEsZ0JBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQUNDO0FBQ3RCLGVBQU8sMkJBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUE0QyxVQUFBLElBQUEsRUFBQTtBQUFBLG1CQUFRLENBQUNDLDBCQUFlQyxZQUFBQSxNQUFBQSxFQUF4QixJQUF3QkEsQ0FBZkQsQ0FBRCxDQUFSO0FBQW5ELFNBQU8sQ0FBUDtBQUZxQixLQUFBO0FBQUEsaUJBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQUlFO0FBQ3ZCLGVBQU8sMkJBQUEsV0FBQSxDQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUE2QyxVQUFBLElBQUEsRUFBQTtBQUFBLG1CQUFRLENBQUNBLDBCQUFlQyxZQUFBQSxNQUFBQSxFQUF4QixJQUF3QkEsQ0FBZkQsQ0FBRCxDQUFSO0FBQXBELFNBQU8sQ0FBUDtBQUxxQixLQUFBO0FBQUEsdUJBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQU9RO0FBQzdCLFlBQU1FLGFBQWFDLE1BQW5CLFVBQUE7QUFENkIsWUFBQSxTQUFBLFdBQUEsTUFBQTtBQUFBLFlBQUEsZUFBQSxXQUFBLFlBQUE7O0FBRzdCLGVBQU8sMkJBQUEsaUJBQUEsQ0FBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBbUQsVUFBQSxJQUFBLEVBQVE7QUFDOUQsZ0JBQU1DLGFBQWFILFlBQUFBLE1BQUFBLEVBQW5CLElBQW1CQSxDQUFuQjtBQUNBLGdCQUFNUCxVQUFVVyxlQUFBQSxNQUFBQSxFQUFoQixJQUFnQkEsQ0FBaEI7QUFDQUQsdUJBQUFBLElBQUFBLENBQWdCO0FBQ1pQLG9CQURZLHNCQUFBO0FBRVpDLHdCQUZZLE1BQUE7QUFHWlEsOEJBSFksWUFBQTtBQUlaQywrQkFBZTtBQUNYQywwQkFBTWQsUUFBQUEsQ0FBQUEsRUFESyxJQUFBO0FBRVhlLHdCQUFJZixRQUFBQSxDQUFBQSxFQUFXZTtBQUZKO0FBSkgsYUFBaEJMO0FBU0EsbUJBQU8sQ0FBQ0osMEJBQVIsVUFBUUEsQ0FBRCxDQUFQO0FBWkosU0FBTyxDQUFQO0FBVnFCLEtBQUE7QUFBQSx3QkFBQSxVQUFBLE1BQUEsRUFBQSxLQUFBLEVBeUJTO0FBQzlCLFlBQU1FLGFBQWFDLE1BQW5CLFVBQUE7QUFEOEIsWUFBQSxTQUFBLFdBQUEsTUFBQTtBQUFBLFlBQUEsZUFBQSxXQUFBLFlBQUE7O0FBRzlCLGVBQU8sMkJBQUEsa0JBQUEsQ0FBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBb0QsVUFBQSxJQUFBLEVBQVE7QUFDL0QsZ0JBQU1DLGFBQWFILFlBQUFBLE1BQUFBLEVBQW5CLElBQW1CQSxDQUFuQjtBQUNBLGdCQUFNUCxVQUFVVyxlQUFBQSxNQUFBQSxFQUFoQixJQUFnQkEsQ0FBaEI7QUFDQUQsdUJBQUFBLElBQUFBLENBQWdCO0FBQ1pQLG9CQURZLHVCQUFBO0FBRVpDLHdCQUZZLE1BQUE7QUFHWlEsOEJBSFksWUFBQTtBQUlaSSxnQ0FBZ0IsUUFBQSxHQUFBLENBQVksVUFBQSxDQUFBLEVBQUE7QUFBQSwyQkFBTTtBQUM5QkYsOEJBQU1HLEVBRHdCLElBQUE7QUFFOUJGLDRCQUFJRSxFQUFFRjtBQUZ3QixxQkFBTjtBQUFaLGlCQUFBO0FBSkosYUFBaEJMO0FBU0EsbUJBQU8sQ0FBQ0osMEJBQVIsVUFBUUEsQ0FBRCxDQUFQO0FBWkosU0FBTyxDQUFQO0FBY0g7QUExQ3dCLENBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdG9BcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBidWlsZFRyYW5zZm9ybSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IEdldE9wZXJhdG9ycyB9IGZyb20gXCIuL2dldC1vcGVyYXRvcnNcIjtcbmZ1bmN0aW9uIGRlc2VyaWFsaXplKHNvdXJjZSwgZG9jdW1lbnQpIHtcbiAgICBjb25zdCBkZXNlcmlhbGl6ZWQgPSBzb3VyY2Uuc2VyaWFsaXplci5kZXNlcmlhbGl6ZURvY3VtZW50KGRvY3VtZW50KTtcbiAgICBjb25zdCByZWNvcmRzID0gdG9BcnJheShkZXNlcmlhbGl6ZWQuZGF0YSk7XG4gICAgaWYgKGRlc2VyaWFsaXplZC5pbmNsdWRlZCkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZWNvcmRzLCBkZXNlcmlhbGl6ZWQuaW5jbHVkZWQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RSZWNvcmRzKHNvdXJjZSwgZG9jdW1lbnQpIHtcbiAgICBjb25zdCBkZXNlcmlhbGl6ZWQgPSBzb3VyY2Uuc2VyaWFsaXplci5kZXNlcmlhbGl6ZURvY3VtZW50KGRvY3VtZW50KTtcbiAgICByZXR1cm4gdG9BcnJheShkZXNlcmlhbGl6ZWQuZGF0YSk7XG59XG5leHBvcnQgY29uc3QgUHVsbE9wZXJhdG9ycyA9IHtcbiAgICBmaW5kUmVjb3JkKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIEdldE9wZXJhdG9ycy5maW5kUmVjb3JkKHNvdXJjZSwgcXVlcnkpLnRoZW4oZGF0YSA9PiBbYnVpbGRUcmFuc2Zvcm0oZGVzZXJpYWxpemUoc291cmNlLCBkYXRhKSldKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmRzKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIEdldE9wZXJhdG9ycy5maW5kUmVjb3Jkcyhzb3VyY2UsIHF1ZXJ5KS50aGVuKGRhdGEgPT4gW2J1aWxkVHJhbnNmb3JtKGRlc2VyaWFsaXplKHNvdXJjZSwgZGF0YSkpXSk7XG4gICAgfSxcbiAgICBmaW5kUmVsYXRlZFJlY29yZChzb3VyY2UsIHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBxdWVyeS5leHByZXNzaW9uO1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0gPSBleHByZXNzaW9uO1xuICAgICAgICByZXR1cm4gR2V0T3BlcmF0b3JzLmZpbmRSZWxhdGVkUmVjb3JkKHNvdXJjZSwgcXVlcnkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gZGVzZXJpYWxpemUoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBleHRyYWN0UmVjb3Jkcyhzb3VyY2UsIGRhdGEpO1xuICAgICAgICAgICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogcmVjb3Jkc1swXS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBpZDogcmVjb3Jkc1swXS5pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFtidWlsZFRyYW5zZm9ybShvcGVyYXRpb25zKV07XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZmluZFJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcXVlcnkpIHtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHF1ZXJ5LmV4cHJlc3Npb247XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSA9IGV4cHJlc3Npb247XG4gICAgICAgIHJldHVybiBHZXRPcGVyYXRvcnMuZmluZFJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcXVlcnkpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gZGVzZXJpYWxpemUoc291cmNlLCBkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHMgPSBleHRyYWN0UmVjb3Jkcyhzb3VyY2UsIGRhdGEpO1xuICAgICAgICAgICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkczogcmVjb3Jkcy5tYXAociA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiByLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGlkOiByLmlkXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xuICAgICAgICB9KTtcbiAgICB9XG59OyJdfQ==