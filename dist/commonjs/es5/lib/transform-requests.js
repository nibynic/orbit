'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransformRequestProcessors = undefined;
exports.getTransformRequests = getTransformRequests;

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

var _requestSettings = require('./request-settings');

var TransformRequestProcessors = exports.TransformRequestProcessors = {
    addRecord: function (source, request) {
        var serializer = source.serializer;

        var record = request.record;
        var requestDoc = serializer.serializeDocument(record);
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'POST', json: requestDoc });
        return source.fetch(source.resourceURL(record.type), settings).then(function (raw) {
            return handleChanges(record, serializer.deserializeDocument(raw, record));
        });
    },
    removeRecord: function (source, request) {
        var _request$record = request.record,
            type = _request$record.type,
            id = _request$record.id;

        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'DELETE' });
        return source.fetch(source.resourceURL(type, id), settings).then(function () {
            return [];
        });
    },
    replaceRecord: function (source, request) {
        var serializer = source.serializer;

        var record = request.record;
        var type = record.type,
            id = record.id;

        var requestDoc = serializer.serializeDocument(record);
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json: requestDoc });
        return source.fetch(source.resourceURL(type, id), settings).then(function (raw) {
            if (raw) {
                return handleChanges(record, serializer.deserializeDocument(raw, record));
            } else {
                return [];
            }
        });
    },
    addToRelatedRecords: function (source, request) {
        var _request$record2 = request.record,
            type = _request$record2.type,
            id = _request$record2.id;
        var relationship = request.relationship;

        var json = {
            data: request.relatedRecords.map(function (r) {
                return source.serializer.resourceIdentity(r);
            })
        };
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'POST', json: json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(function () {
            return [];
        });
    },
    removeFromRelatedRecords: function (source, request) {
        var _request$record3 = request.record,
            type = _request$record3.type,
            id = _request$record3.id;
        var relationship = request.relationship;

        var json = {
            data: request.relatedRecords.map(function (r) {
                return source.serializer.resourceIdentity(r);
            })
        };
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'DELETE', json: json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(function () {
            return [];
        });
    },
    replaceRelatedRecord: function (source, request) {
        var _request$record4 = request.record,
            type = _request$record4.type,
            id = _request$record4.id;
        var relationship = request.relationship,
            relatedRecord = request.relatedRecord;

        var json = {
            data: relatedRecord ? source.serializer.resourceIdentity(relatedRecord) : null
        };
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json: json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(function () {
            return [];
        });
    },
    replaceRelatedRecords: function (source, request) {
        var _request$record5 = request.record,
            type = _request$record5.type,
            id = _request$record5.id;
        var relationship = request.relationship,
            relatedRecords = request.relatedRecords;

        var json = {
            data: relatedRecords.map(function (r) {
                return source.serializer.resourceIdentity(r);
            })
        };
        var settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json: json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(function () {
            return [];
        });
    }
};
function getTransformRequests(source, transform) {
    var requests = [];
    var prevRequest = void 0;
    transform.operations.forEach(function (operation) {
        var request = void 0;
        var newRequestNeeded = true;
        if (prevRequest && (0, _data.equalRecordIdentities)(prevRequest.record, operation.record)) {
            if (operation.op === 'removeRecord') {
                newRequestNeeded = false;
                if (prevRequest.op !== 'removeRecord') {
                    prevRequest = null;
                    requests.pop();
                }
            } else if (prevRequest.op === 'addRecord' || prevRequest.op === 'replaceRecord') {
                if (operation.op === 'replaceAttribute') {
                    newRequestNeeded = false;
                    replaceRecordAttribute(prevRequest.record, operation.attribute, operation.value);
                } else if (operation.op === 'replaceRelatedRecord') {
                    newRequestNeeded = false;
                    replaceRecordHasOne(prevRequest.record, operation.relationship, operation.relatedRecord);
                } else if (operation.op === 'replaceRelatedRecords') {
                    newRequestNeeded = false;
                    replaceRecordHasMany(prevRequest.record, operation.relationship, operation.relatedRecords);
                }
            } else if (prevRequest.op === 'addToRelatedRecords' && operation.op === 'addToRelatedRecords' && prevRequest.relationship === operation.relationship) {
                newRequestNeeded = false;
                prevRequest.relatedRecords.push((0, _data.cloneRecordIdentity)(operation.relatedRecord));
            }
        }
        if (newRequestNeeded) {
            request = OperationToRequestMap[operation.op](operation);
        }
        if (request) {
            var options = (0, _requestSettings.customRequestOptions)(source, transform);
            if (options) {
                request.options = options;
            }
            requests.push(request);
            prevRequest = request;
        }
    });
    return requests;
}
var OperationToRequestMap = {
    addRecord: function (operation) {
        return {
            op: 'addRecord',
            record: (0, _utils.clone)(operation.record)
        };
    },
    removeRecord: function (operation) {
        return {
            op: 'removeRecord',
            record: (0, _data.cloneRecordIdentity)(operation.record)
        };
    },
    replaceAttribute: function (operation) {
        var record = (0, _data.cloneRecordIdentity)(operation.record);
        replaceRecordAttribute(record, operation.attribute, operation.value);
        return {
            op: 'replaceRecord',
            record: record
        };
    },
    replaceRecord: function (operation) {
        return {
            op: 'replaceRecord',
            record: (0, _utils.clone)(operation.record)
        };
    },
    addToRelatedRecords: function (operation) {
        return {
            op: 'addToRelatedRecords',
            record: (0, _data.cloneRecordIdentity)(operation.record),
            relationship: operation.relationship,
            relatedRecords: [(0, _data.cloneRecordIdentity)(operation.relatedRecord)]
        };
    },
    removeFromRelatedRecords: function (operation) {
        return {
            op: 'removeFromRelatedRecords',
            record: (0, _data.cloneRecordIdentity)(operation.record),
            relationship: operation.relationship,
            relatedRecords: [(0, _data.cloneRecordIdentity)(operation.relatedRecord)]
        };
    },
    replaceRelatedRecord: function (operation) {
        var record = {
            type: operation.record.type,
            id: operation.record.id
        };
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        return {
            op: 'replaceRecord',
            record: record
        };
    },
    replaceRelatedRecords: function (operation) {
        var record = (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        return {
            op: 'replaceRecord',
            record: record
        };
    }
};
function replaceRecordAttribute(record, attribute, value) {
    (0, _utils.deepSet)(record, ['attributes', attribute], value);
}
function replaceRecordHasOne(record, relationship, relatedRecord) {
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], relatedRecord ? (0, _data.cloneRecordIdentity)(relatedRecord) : null);
}
function replaceRecordHasMany(record, relationship, relatedRecords) {
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], relatedRecords.map(function (r) {
        return (0, _data.cloneRecordIdentity)(r);
    }));
}
function handleChanges(record, responseDoc) {
    var updatedRecord = responseDoc.data;
    var transforms = [];
    var updateOps = (0, _data.recordDiffs)(record, updatedRecord);
    if (updateOps.length > 0) {
        transforms.push((0, _data.buildTransform)(updateOps));
    }
    if (responseDoc.included && responseDoc.included.length > 0) {
        var includedOps = responseDoc.included.map(function (record) {
            return { op: 'replaceRecord', record: record };
        });
        transforms.push((0, _data.buildTransform)(includedOps));
    }
    return transforms;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tcmVxdWVzdHMuanMiXSwibmFtZXMiOlsiVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMiLCJyZWNvcmQiLCJyZXF1ZXN0IiwicmVxdWVzdERvYyIsInNlcmlhbGl6ZXIiLCJzZXR0aW5ncyIsImJ1aWxkRmV0Y2hTZXR0aW5ncyIsIm1ldGhvZCIsImpzb24iLCJzb3VyY2UiLCJoYW5kbGVDaGFuZ2VzIiwiZGF0YSIsInJlbGF0ZWRSZWNvcmQiLCJyZXF1ZXN0cyIsInByZXZSZXF1ZXN0IiwidHJhbnNmb3JtIiwibmV3UmVxdWVzdE5lZWRlZCIsImVxdWFsUmVjb3JkSWRlbnRpdGllcyIsIm9wZXJhdGlvbiIsInJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUiLCJyZXBsYWNlUmVjb3JkSGFzT25lIiwicmVwbGFjZVJlY29yZEhhc01hbnkiLCJjbG9uZVJlY29yZElkZW50aXR5IiwiT3BlcmF0aW9uVG9SZXF1ZXN0TWFwIiwib3B0aW9ucyIsImN1c3RvbVJlcXVlc3RPcHRpb25zIiwib3AiLCJjbG9uZSIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmRzIiwidHlwZSIsImlkIiwiZGVlcFNldCIsInVwZGF0ZWRSZWNvcmQiLCJyZXNwb25zZURvYyIsInRyYW5zZm9ybXMiLCJ1cGRhdGVPcHMiLCJyZWNvcmREaWZmcyIsImJ1aWxkVHJhbnNmb3JtIiwiaW5jbHVkZWRPcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztRQW1FTyxvQixHQUFBLG9COzs7O0FBbEVQOztBQUNBOztBQUNPLElBQU1BLGtFQUE2QjtBQUFBLGVBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQUNYO0FBQUEsWUFBQSxhQUFBLE9BQUEsVUFBQTs7QUFFdkIsWUFBTUMsU0FBU0MsUUFBZixNQUFBO0FBQ0EsWUFBTUMsYUFBYUMsV0FBQUEsaUJBQUFBLENBQW5CLE1BQW1CQSxDQUFuQjtBQUNBLFlBQU1DLFdBQVdDLHlDQUFtQkosUUFBbkJJLE9BQUFBLEVBQW9DLEVBQUVDLFFBQUYsTUFBQSxFQUFrQkMsTUFBdkUsVUFBcUQsRUFBcENGLENBQWpCO0FBQ0EsZUFBTyxPQUFBLEtBQUEsQ0FBYUcsT0FBQUEsV0FBQUEsQ0FBbUJSLE9BQWhDLElBQWFRLENBQWIsRUFBQSxRQUFBLEVBQUEsSUFBQSxDQUE2RCxVQUFBLEdBQUEsRUFBQTtBQUFBLG1CQUFPQyxjQUFBQSxNQUFBQSxFQUFzQk4sV0FBQUEsbUJBQUFBLENBQUFBLEdBQUFBLEVBQTdCLE1BQTZCQSxDQUF0Qk0sQ0FBUDtBQUFwRSxTQUFPLENBQVA7QUFOa0MsS0FBQTtBQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBLE9BQUEsRUFRUjtBQUFBLFlBQUEsa0JBQ0xSLFFBREssTUFBQTtBQUFBLFlBQUEsT0FBQSxnQkFBQSxJQUFBO0FBQUEsWUFBQSxLQUFBLGdCQUFBLEVBQUE7O0FBRTFCLFlBQU1HLFdBQVdDLHlDQUFtQkosUUFBbkJJLE9BQUFBLEVBQW9DLEVBQUVDLFFBQXZELFFBQXFELEVBQXBDRCxDQUFqQjtBQUNBLGVBQU8sT0FBQSxLQUFBLENBQWFHLE9BQUFBLFdBQUFBLENBQUFBLElBQUFBLEVBQWIsRUFBYUEsQ0FBYixFQUFBLFFBQUEsRUFBQSxJQUFBLENBQTBELFlBQUE7QUFBQSxtQkFBQSxFQUFBO0FBQWpFLFNBQU8sQ0FBUDtBQVhrQyxLQUFBO0FBQUEsbUJBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQWFQO0FBQUEsWUFBQSxhQUFBLE9BQUEsVUFBQTs7QUFFM0IsWUFBTVIsU0FBU0MsUUFBZixNQUFBO0FBRjJCLFlBQUEsT0FBQSxPQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsT0FBQSxFQUFBOztBQUkzQixZQUFNQyxhQUFhQyxXQUFBQSxpQkFBQUEsQ0FBbkIsTUFBbUJBLENBQW5CO0FBQ0EsWUFBTUMsV0FBV0MseUNBQW1CSixRQUFuQkksT0FBQUEsRUFBb0MsRUFBRUMsUUFBRixPQUFBLEVBQW1CQyxNQUF4RSxVQUFxRCxFQUFwQ0YsQ0FBakI7QUFDQSxlQUFPLE9BQUEsS0FBQSxDQUFhRyxPQUFBQSxXQUFBQSxDQUFBQSxJQUFBQSxFQUFiLEVBQWFBLENBQWIsRUFBQSxRQUFBLEVBQUEsSUFBQSxDQUEwRCxVQUFBLEdBQUEsRUFBTztBQUNwRSxnQkFBQSxHQUFBLEVBQVM7QUFDTCx1QkFBT0MsY0FBQUEsTUFBQUEsRUFBc0JOLFdBQUFBLG1CQUFBQSxDQUFBQSxHQUFBQSxFQUE3QixNQUE2QkEsQ0FBdEJNLENBQVA7QUFESixhQUFBLE1BRU87QUFDSCx1QkFBQSxFQUFBO0FBQ0g7QUFMTCxTQUFPLENBQVA7QUFuQmtDLEtBQUE7QUFBQSx5QkFBQSxVQUFBLE1BQUEsRUFBQSxPQUFBLEVBMkJEO0FBQUEsWUFBQSxtQkFDWlIsUUFEWSxNQUFBO0FBQUEsWUFBQSxPQUFBLGlCQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsaUJBQUEsRUFBQTtBQUFBLFlBQUEsZUFBQSxRQUFBLFlBQUE7O0FBR2pDLFlBQU1NLE9BQU87QUFDVEcsa0JBQU0sUUFBQSxjQUFBLENBQUEsR0FBQSxDQUEyQixVQUFBLENBQUEsRUFBQTtBQUFBLHVCQUFLRixPQUFBQSxVQUFBQSxDQUFBQSxnQkFBQUEsQ0FBTCxDQUFLQSxDQUFMO0FBQTNCLGFBQUE7QUFERyxTQUFiO0FBR0EsWUFBTUosV0FBV0MseUNBQW1CSixRQUFuQkksT0FBQUEsRUFBb0MsRUFBRUMsUUFBRixNQUFBLEVBQWtCQyxNQUF2RSxJQUFxRCxFQUFwQ0YsQ0FBakI7QUFDQSxlQUFPLE9BQUEsS0FBQSxDQUFhRyxPQUFBQSx1QkFBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsRUFBQUEsRUFBYixZQUFhQSxDQUFiLEVBQUEsUUFBQSxFQUFBLElBQUEsQ0FBb0YsWUFBQTtBQUFBLG1CQUFBLEVBQUE7QUFBM0YsU0FBTyxDQUFQO0FBbENrQyxLQUFBO0FBQUEsOEJBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQW9DSTtBQUFBLFlBQUEsbUJBQ2pCUCxRQURpQixNQUFBO0FBQUEsWUFBQSxPQUFBLGlCQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsaUJBQUEsRUFBQTtBQUFBLFlBQUEsZUFBQSxRQUFBLFlBQUE7O0FBR3RDLFlBQU1NLE9BQU87QUFDVEcsa0JBQU0sUUFBQSxjQUFBLENBQUEsR0FBQSxDQUEyQixVQUFBLENBQUEsRUFBQTtBQUFBLHVCQUFLRixPQUFBQSxVQUFBQSxDQUFBQSxnQkFBQUEsQ0FBTCxDQUFLQSxDQUFMO0FBQTNCLGFBQUE7QUFERyxTQUFiO0FBR0EsWUFBTUosV0FBV0MseUNBQW1CSixRQUFuQkksT0FBQUEsRUFBb0MsRUFBRUMsUUFBRixRQUFBLEVBQW9CQyxNQUF6RSxJQUFxRCxFQUFwQ0YsQ0FBakI7QUFDQSxlQUFPLE9BQUEsS0FBQSxDQUFhRyxPQUFBQSx1QkFBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsRUFBQUEsRUFBYixZQUFhQSxDQUFiLEVBQUEsUUFBQSxFQUFBLElBQUEsQ0FBb0YsWUFBQTtBQUFBLG1CQUFBLEVBQUE7QUFBM0YsU0FBTyxDQUFQO0FBM0NrQyxLQUFBO0FBQUEsMEJBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQTZDQTtBQUFBLFlBQUEsbUJBQ2JQLFFBRGEsTUFBQTtBQUFBLFlBQUEsT0FBQSxpQkFBQSxJQUFBO0FBQUEsWUFBQSxLQUFBLGlCQUFBLEVBQUE7QUFBQSxZQUFBLGVBQUEsUUFBQSxZQUFBO0FBQUEsWUFBQSxnQkFBQSxRQUFBLGFBQUE7O0FBR2xDLFlBQU1NLE9BQU87QUFDVEcsa0JBQU1DLGdCQUFnQkgsT0FBQUEsVUFBQUEsQ0FBQUEsZ0JBQUFBLENBQWhCRyxhQUFnQkgsQ0FBaEJHLEdBQW9FO0FBRGpFLFNBQWI7QUFHQSxZQUFNUCxXQUFXQyx5Q0FBbUJKLFFBQW5CSSxPQUFBQSxFQUFvQyxFQUFFQyxRQUFGLE9BQUEsRUFBbUJDLE1BQXhFLElBQXFELEVBQXBDRixDQUFqQjtBQUNBLGVBQU8sT0FBQSxLQUFBLENBQWFHLE9BQUFBLHVCQUFBQSxDQUFBQSxJQUFBQSxFQUFBQSxFQUFBQSxFQUFiLFlBQWFBLENBQWIsRUFBQSxRQUFBLEVBQUEsSUFBQSxDQUFvRixZQUFBO0FBQUEsbUJBQUEsRUFBQTtBQUEzRixTQUFPLENBQVA7QUFwRGtDLEtBQUE7QUFBQSwyQkFBQSxVQUFBLE1BQUEsRUFBQSxPQUFBLEVBc0RDO0FBQUEsWUFBQSxtQkFDZFAsUUFEYyxNQUFBO0FBQUEsWUFBQSxPQUFBLGlCQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsaUJBQUEsRUFBQTtBQUFBLFlBQUEsZUFBQSxRQUFBLFlBQUE7QUFBQSxZQUFBLGlCQUFBLFFBQUEsY0FBQTs7QUFHbkMsWUFBTU0sT0FBTztBQUNURyxrQkFBTSxlQUFBLEdBQUEsQ0FBbUIsVUFBQSxDQUFBLEVBQUE7QUFBQSx1QkFBS0YsT0FBQUEsVUFBQUEsQ0FBQUEsZ0JBQUFBLENBQUwsQ0FBS0EsQ0FBTDtBQUFuQixhQUFBO0FBREcsU0FBYjtBQUdBLFlBQU1KLFdBQVdDLHlDQUFtQkosUUFBbkJJLE9BQUFBLEVBQW9DLEVBQUVDLFFBQUYsT0FBQSxFQUFtQkMsTUFBeEUsSUFBcUQsRUFBcENGLENBQWpCO0FBQ0EsZUFBTyxPQUFBLEtBQUEsQ0FBYUcsT0FBQUEsdUJBQUFBLENBQUFBLElBQUFBLEVBQUFBLEVBQUFBLEVBQWIsWUFBYUEsQ0FBYixFQUFBLFFBQUEsRUFBQSxJQUFBLENBQW9GLFlBQUE7QUFBQSxtQkFBQSxFQUFBO0FBQTNGLFNBQU8sQ0FBUDtBQUNIO0FBOURxQyxDQUFuQztBQWdFQSxTQUFBLG9CQUFBLENBQUEsTUFBQSxFQUFBLFNBQUEsRUFBaUQ7QUFDcEQsUUFBTUksV0FBTixFQUFBO0FBQ0EsUUFBSUMsY0FBQUEsS0FBSixDQUFBO0FBQ0FDLGNBQUFBLFVBQUFBLENBQUFBLE9BQUFBLENBQTZCLFVBQUEsU0FBQSxFQUFhO0FBQ3RDLFlBQUliLFVBQUFBLEtBQUosQ0FBQTtBQUNBLFlBQUljLG1CQUFKLElBQUE7QUFDQSxZQUFJRixlQUFlRyxpQ0FBc0JILFlBQXRCRyxNQUFBQSxFQUEwQ0MsVUFBN0QsTUFBbUJELENBQW5CLEVBQWdGO0FBQzVFLGdCQUFJQyxVQUFBQSxFQUFBQSxLQUFKLGNBQUEsRUFBcUM7QUFDakNGLG1DQUFBQSxLQUFBQTtBQUNBLG9CQUFJRixZQUFBQSxFQUFBQSxLQUFKLGNBQUEsRUFBdUM7QUFDbkNBLGtDQUFBQSxJQUFBQTtBQUNBRCw2QkFBQUEsR0FBQUE7QUFDSDtBQUxMLGFBQUEsTUFNTyxJQUFJQyxZQUFBQSxFQUFBQSxLQUFBQSxXQUFBQSxJQUFrQ0EsWUFBQUEsRUFBQUEsS0FBdEMsZUFBQSxFQUEwRTtBQUM3RSxvQkFBSUksVUFBQUEsRUFBQUEsS0FBSixrQkFBQSxFQUF5QztBQUNyQ0YsdUNBQUFBLEtBQUFBO0FBQ0FHLDJDQUF1QkwsWUFBdkJLLE1BQUFBLEVBQTJDRCxVQUEzQ0MsU0FBQUEsRUFBZ0VELFVBQWhFQyxLQUFBQTtBQUZKLGlCQUFBLE1BR08sSUFBSUQsVUFBQUEsRUFBQUEsS0FBSixzQkFBQSxFQUE2QztBQUNoREYsdUNBQUFBLEtBQUFBO0FBQ0FJLHdDQUFvQk4sWUFBcEJNLE1BQUFBLEVBQXdDRixVQUF4Q0UsWUFBQUEsRUFBZ0VGLFVBQWhFRSxhQUFBQTtBQUZHLGlCQUFBLE1BR0EsSUFBSUYsVUFBQUEsRUFBQUEsS0FBSix1QkFBQSxFQUE4QztBQUNqREYsdUNBQUFBLEtBQUFBO0FBQ0FLLHlDQUFxQlAsWUFBckJPLE1BQUFBLEVBQXlDSCxVQUF6Q0csWUFBQUEsRUFBaUVILFVBQWpFRyxjQUFBQTtBQUNIO0FBVkUsYUFBQSxNQVdBLElBQUlQLFlBQUFBLEVBQUFBLEtBQUFBLHFCQUFBQSxJQUE0Q0ksVUFBQUEsRUFBQUEsS0FBNUNKLHFCQUFBQSxJQUFzRkEsWUFBQUEsWUFBQUEsS0FBNkJJLFVBQXZILFlBQUEsRUFBK0k7QUFDbEpGLG1DQUFBQSxLQUFBQTtBQUNBRiw0QkFBQUEsY0FBQUEsQ0FBQUEsSUFBQUEsQ0FBZ0NRLCtCQUFvQkosVUFBcERKLGFBQWdDUSxDQUFoQ1I7QUFDSDtBQUNKO0FBQ0QsWUFBQSxnQkFBQSxFQUFzQjtBQUNsQlosc0JBQVVxQixzQkFBc0JMLFVBQXRCSyxFQUFBQSxFQUFWckIsU0FBVXFCLENBQVZyQjtBQUNIO0FBQ0QsWUFBQSxPQUFBLEVBQWE7QUFDVCxnQkFBSXNCLFVBQVVDLDJDQUFBQSxNQUFBQSxFQUFkLFNBQWNBLENBQWQ7QUFDQSxnQkFBQSxPQUFBLEVBQWE7QUFDVHZCLHdCQUFBQSxPQUFBQSxHQUFBQSxPQUFBQTtBQUNIO0FBQ0RXLHFCQUFBQSxJQUFBQSxDQUFBQSxPQUFBQTtBQUNBQywwQkFBQUEsT0FBQUE7QUFDSDtBQXBDTEMsS0FBQUE7QUFzQ0EsV0FBQSxRQUFBO0FBQ0g7QUFDRCxJQUFNUSx3QkFBd0I7QUFBQSxlQUFBLFVBQUEsU0FBQSxFQUNMO0FBQ2pCLGVBQU87QUFDSEcsZ0JBREcsV0FBQTtBQUVIekIsb0JBQVEwQixrQkFBTVQsVUFBTlMsTUFBQUE7QUFGTCxTQUFQO0FBRnNCLEtBQUE7QUFBQSxrQkFBQSxVQUFBLFNBQUEsRUFPRjtBQUNwQixlQUFPO0FBQ0hELGdCQURHLGNBQUE7QUFFSHpCLG9CQUFRcUIsK0JBQW9CSixVQUFwQkksTUFBQUE7QUFGTCxTQUFQO0FBUnNCLEtBQUE7QUFBQSxzQkFBQSxVQUFBLFNBQUEsRUFhRTtBQUN4QixZQUFNckIsU0FBU3FCLCtCQUFvQkosVUFBbkMsTUFBZUksQ0FBZjtBQUNBSCwrQkFBQUEsTUFBQUEsRUFBK0JELFVBQS9CQyxTQUFBQSxFQUFvREQsVUFBcERDLEtBQUFBO0FBQ0EsZUFBTztBQUNITyxnQkFERyxlQUFBO0FBRUh6QixvQkFBQUE7QUFGRyxTQUFQO0FBaEJzQixLQUFBO0FBQUEsbUJBQUEsVUFBQSxTQUFBLEVBcUJEO0FBQ3JCLGVBQU87QUFDSHlCLGdCQURHLGVBQUE7QUFFSHpCLG9CQUFRMEIsa0JBQU1ULFVBQU5TLE1BQUFBO0FBRkwsU0FBUDtBQXRCc0IsS0FBQTtBQUFBLHlCQUFBLFVBQUEsU0FBQSxFQTJCSztBQUMzQixlQUFPO0FBQ0hELGdCQURHLHFCQUFBO0FBRUh6QixvQkFBUXFCLCtCQUFvQkosVUFGekIsTUFFS0ksQ0FGTDtBQUdITSwwQkFBY1YsVUFIWCxZQUFBO0FBSUhXLDRCQUFnQixDQUFDUCwrQkFBb0JKLFVBQXJCLGFBQUNJLENBQUQ7QUFKYixTQUFQO0FBNUJzQixLQUFBO0FBQUEsOEJBQUEsVUFBQSxTQUFBLEVBbUNVO0FBQ2hDLGVBQU87QUFDSEksZ0JBREcsMEJBQUE7QUFFSHpCLG9CQUFRcUIsK0JBQW9CSixVQUZ6QixNQUVLSSxDQUZMO0FBR0hNLDBCQUFjVixVQUhYLFlBQUE7QUFJSFcsNEJBQWdCLENBQUNQLCtCQUFvQkosVUFBckIsYUFBQ0ksQ0FBRDtBQUpiLFNBQVA7QUFwQ3NCLEtBQUE7QUFBQSwwQkFBQSxVQUFBLFNBQUEsRUEyQ007QUFDNUIsWUFBTXJCLFNBQVM7QUFDWDZCLGtCQUFNWixVQUFBQSxNQUFBQSxDQURLLElBQUE7QUFFWGEsZ0JBQUliLFVBQUFBLE1BQUFBLENBQWlCYTtBQUZWLFNBQWY7QUFJQUMsNEJBQUFBLE1BQUFBLEVBQWdCLENBQUEsZUFBQSxFQUFrQmQsVUFBbEIsWUFBQSxFQUFoQmMsTUFBZ0IsQ0FBaEJBLEVBQW1FZCxVQUFuRWMsYUFBQUE7QUFDQSxlQUFPO0FBQ0hOLGdCQURHLGVBQUE7QUFFSHpCLG9CQUFBQTtBQUZHLFNBQVA7QUFqRHNCLEtBQUE7QUFBQSwyQkFBQSxVQUFBLFNBQUEsRUFzRE87QUFDN0IsWUFBTUEsU0FBU3FCLCtCQUFvQkosVUFBbkMsTUFBZUksQ0FBZjtBQUNBVSw0QkFBQUEsTUFBQUEsRUFBZ0IsQ0FBQSxlQUFBLEVBQWtCZCxVQUFsQixZQUFBLEVBQWhCYyxNQUFnQixDQUFoQkEsRUFBbUVkLFVBQW5FYyxjQUFBQTtBQUNBLGVBQU87QUFDSE4sZ0JBREcsZUFBQTtBQUVIekIsb0JBQUFBO0FBRkcsU0FBUDtBQUlIO0FBN0R5QixDQUE5QjtBQStEQSxTQUFBLHNCQUFBLENBQUEsTUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQTBEO0FBQ3REK0Isd0JBQUFBLE1BQUFBLEVBQWdCLENBQUEsWUFBQSxFQUFoQkEsU0FBZ0IsQ0FBaEJBLEVBQUFBLEtBQUFBO0FBQ0g7QUFDRCxTQUFBLG1CQUFBLENBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxhQUFBLEVBQWtFO0FBQzlEQSx3QkFBQUEsTUFBQUEsRUFBZ0IsQ0FBQSxlQUFBLEVBQUEsWUFBQSxFQUFoQkEsTUFBZ0IsQ0FBaEJBLEVBQXlEcEIsZ0JBQWdCVSwrQkFBaEJWLGFBQWdCVSxDQUFoQlYsR0FBekRvQixJQUFBQTtBQUNIO0FBQ0QsU0FBQSxvQkFBQSxDQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUEsY0FBQSxFQUFvRTtBQUNoRUEsd0JBQUFBLE1BQUFBLEVBQWdCLENBQUEsZUFBQSxFQUFBLFlBQUEsRUFBaEJBLE1BQWdCLENBQWhCQSxFQUF5RCxlQUFBLEdBQUEsQ0FBbUIsVUFBQSxDQUFBLEVBQUE7QUFBQSxlQUFLViwrQkFBTCxDQUFLQSxDQUFMO0FBQTVFVSxLQUF5RCxDQUF6REE7QUFDSDtBQUNELFNBQUEsYUFBQSxDQUFBLE1BQUEsRUFBQSxXQUFBLEVBQTRDO0FBQ3hDLFFBQUlDLGdCQUFnQkMsWUFBcEIsSUFBQTtBQUNBLFFBQUlDLGFBQUosRUFBQTtBQUNBLFFBQUlDLFlBQVlDLHVCQUFBQSxNQUFBQSxFQUFoQixhQUFnQkEsQ0FBaEI7QUFDQSxRQUFJRCxVQUFBQSxNQUFBQSxHQUFKLENBQUEsRUFBMEI7QUFDdEJELG1CQUFBQSxJQUFBQSxDQUFnQkcsMEJBQWhCSCxTQUFnQkcsQ0FBaEJIO0FBQ0g7QUFDRCxRQUFJRCxZQUFBQSxRQUFBQSxJQUF3QkEsWUFBQUEsUUFBQUEsQ0FBQUEsTUFBQUEsR0FBNUIsQ0FBQSxFQUE2RDtBQUN6RCxZQUFJSyxjQUFjLFlBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBeUIsVUFBQSxNQUFBLEVBQVU7QUFDakQsbUJBQU8sRUFBRWIsSUFBRixlQUFBLEVBQXVCekIsUUFBOUIsTUFBTyxFQUFQO0FBREosU0FBa0IsQ0FBbEI7QUFHQWtDLG1CQUFBQSxJQUFBQSxDQUFnQkcsMEJBQWhCSCxXQUFnQkcsQ0FBaEJIO0FBQ0g7QUFDRCxXQUFBLFVBQUE7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lUmVjb3JkSWRlbnRpdHksIGVxdWFsUmVjb3JkSWRlbnRpdGllcywgcmVjb3JkRGlmZnMsIGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgY2xvbmUsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgYnVpbGRGZXRjaFNldHRpbmdzLCBjdXN0b21SZXF1ZXN0T3B0aW9ucyB9IGZyb20gJy4vcmVxdWVzdC1zZXR0aW5ncyc7XG5leHBvcnQgY29uc3QgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMgPSB7XG4gICAgYWRkUmVjb3JkKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHNlcmlhbGl6ZXIgfSA9IHNvdXJjZTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REb2MgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZURvY3VtZW50KHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQT1NUJywganNvbjogcmVxdWVzdERvYyB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VVUkwocmVjb3JkLnR5cGUpLCBzZXR0aW5ncykudGhlbihyYXcgPT4gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChyYXcsIHJlY29yZCkpKTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTCh0eXBlLCBpZCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gc291cmNlO1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVjb3JkO1xuICAgICAgICBjb25zdCByZXF1ZXN0RG9jID0gc2VyaWFsaXplci5zZXJpYWxpemVEb2N1bWVudChyZWNvcmQpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uOiByZXF1ZXN0RG9jIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTCh0eXBlLCBpZCksIHNldHRpbmdzKS50aGVuKHJhdyA9PiB7XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNoYW5nZXMocmVjb3JkLCBzZXJpYWxpemVyLmRlc2VyaWFsaXplRG9jdW1lbnQocmF3LCByZWNvcmQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlcXVlc3QucmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAgfSA9IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGpzb24gPSB7XG4gICAgICAgICAgICBkYXRhOiByZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLm1hcChyID0+IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlSWRlbnRpdHkocikpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlbGF0ZWRSZWNvcmQgPyBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHJlbGF0ZWRSZWNvcmQpIDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BBVENIJywganNvbiB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybVJlcXVlc3RzKHNvdXJjZSwgdHJhbnNmb3JtKSB7XG4gICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICBsZXQgcHJldlJlcXVlc3Q7XG4gICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICBsZXQgcmVxdWVzdDtcbiAgICAgICAgbGV0IG5ld1JlcXVlc3ROZWVkZWQgPSB0cnVlO1xuICAgICAgICBpZiAocHJldlJlcXVlc3QgJiYgZXF1YWxSZWNvcmRJZGVudGl0aWVzKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlY29yZCkpIHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZW1vdmVSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2UmVxdWVzdC5vcCAhPT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlcXVlc3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkUmVjb3JkJyB8fCBwcmV2UmVxdWVzdC5vcCA9PT0gJ3JlcGxhY2VSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3ROZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShwcmV2UmVxdWVzdC5yZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVjb3JkSGFzT25lKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWNvcmRIYXNNYW55KHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgb3BlcmF0aW9uLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgcHJldlJlcXVlc3QucmVsYXRpb25zaGlwID09PSBvcGVyYXRpb24ucmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHByZXZSZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLnB1c2goY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0TmVlZGVkKSB7XG4gICAgICAgICAgICByZXF1ZXN0ID0gT3BlcmF0aW9uVG9SZXF1ZXN0TWFwW29wZXJhdGlvbi5vcF0ob3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgcHJldlJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3RzO1xufVxuY29uc3QgT3BlcmF0aW9uVG9SZXF1ZXN0TWFwID0ge1xuICAgIGFkZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShyZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcGVyYXRpb24ucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IFtjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKV1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKSxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBbY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCldXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgdHlwZTogb3BlcmF0aW9uLnJlY29yZC50eXBlLFxuICAgICAgICAgICAgaWQ6IG9wZXJhdGlvbi5yZWNvcmQuaWRcbiAgICAgICAgfTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGF0dHJpYnV0ZV0sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3JkID8gY2xvbmVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKSA6IG51bGwpO1xufVxuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gY2xvbmVSZWNvcmRJZGVudGl0eShyKSkpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHJlc3BvbnNlRG9jKSB7XG4gICAgbGV0IHVwZGF0ZWRSZWNvcmQgPSByZXNwb25zZURvYy5kYXRhO1xuICAgIGxldCB0cmFuc2Zvcm1zID0gW107XG4gICAgbGV0IHVwZGF0ZU9wcyA9IHJlY29yZERpZmZzKHJlY29yZCwgdXBkYXRlZFJlY29yZCk7XG4gICAgaWYgKHVwZGF0ZU9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybSh1cGRhdGVPcHMpKTtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlRG9jLmluY2x1ZGVkICYmIHJlc3BvbnNlRG9jLmluY2x1ZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGluY2x1ZGVkT3BzID0gcmVzcG9uc2VEb2MuaW5jbHVkZWQubWFwKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWNvcmQnLCByZWNvcmQgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybShpbmNsdWRlZE9wcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3Jtcztcbn0iXX0=