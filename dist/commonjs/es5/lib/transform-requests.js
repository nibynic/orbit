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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tcmVxdWVzdHMuanMiXSwibmFtZXMiOlsiVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMiLCJyZWNvcmQiLCJyZXF1ZXN0IiwicmVxdWVzdERvYyIsInNlcmlhbGl6ZXIiLCJzZXR0aW5ncyIsImJ1aWxkRmV0Y2hTZXR0aW5ncyIsIm1ldGhvZCIsImpzb24iLCJzb3VyY2UiLCJoYW5kbGVDaGFuZ2VzIiwiZGF0YSIsInJlbGF0ZWRSZWNvcmQiLCJyZXF1ZXN0cyIsInByZXZSZXF1ZXN0IiwidHJhbnNmb3JtIiwibmV3UmVxdWVzdE5lZWRlZCIsImVxdWFsUmVjb3JkSWRlbnRpdGllcyIsIm9wZXJhdGlvbiIsInJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUiLCJyZXBsYWNlUmVjb3JkSGFzT25lIiwicmVwbGFjZVJlY29yZEhhc01hbnkiLCJjbG9uZVJlY29yZElkZW50aXR5IiwiT3BlcmF0aW9uVG9SZXF1ZXN0TWFwIiwib3B0aW9ucyIsImN1c3RvbVJlcXVlc3RPcHRpb25zIiwib3AiLCJjbG9uZSIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmRzIiwidHlwZSIsImlkIiwiZGVlcFNldCIsInVwZGF0ZWRSZWNvcmQiLCJyZXNwb25zZURvYyIsInRyYW5zZm9ybXMiLCJ1cGRhdGVPcHMiLCJyZWNvcmREaWZmcyIsImJ1aWxkVHJhbnNmb3JtIiwiaW5jbHVkZWRPcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztRQWlFTyxvQixHQUFBLG9COzs7O0FBaEVQOztBQUNBOztBQUNPLElBQU1BLGtFQUE2QjtBQUFBLGVBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQUNYO0FBQUEsWUFBQSxhQUFBLE9BQUEsVUFBQTs7QUFFdkIsWUFBTUMsU0FBU0MsUUFBZixNQUFBO0FBQ0EsWUFBTUMsYUFBYUMsV0FBQUEsaUJBQUFBLENBQW5CLE1BQW1CQSxDQUFuQjtBQUNBLFlBQU1DLFdBQVdDLHlDQUFtQkosUUFBbkJJLE9BQUFBLEVBQW9DLEVBQUVDLFFB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RUFBQSxZQUFBLEVBQWhCQSxNQUFnQixDQUFoQkEsRUFBeURwQixnQkFBZ0JVLCtCQUFoQlYsYUFBZ0JVLENBQWhCVixHQUF6RG9CLElBQUFBO0FBQ0g7QUFDRCxTQUFBLG9CQUFBLENBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxjQUFBLEVBQW9FO0FBQ2hFQSx3QkFBQUEsTUFBQUEsRUFBZ0IsQ0FBQSxlQUFBLEVBQUEsWUFBQSxFQUFoQkEsTUFBZ0IsQ0FBaEJBLEVBQXlELGVBQUEsR0FBQSxDQUFtQixVQUFBLENBQUEsRUFBQTtBQUFBLGVBQUtWLCtCQUFMLENBQUtBLENBQUw7QUFBNUVVLEtBQXlELENBQXpEQTtBQUNIO0FBQ0QsU0FBQSxhQUFBLENBQUEsTUFBQSxFQUFBLFdBQUEsRUFBNEM7QUFDeEMsUUFBSUMsZ0JBQWdCQyxZQUFwQixJQUFBO0FBQ0EsUUFBSUMsYUFBSixFQUFBO0FBQ0EsUUFBSUMsWUFBWUMsdUJBQUFBLE1BQUFBLEVBQWhCLGFBQWdCQSxDQUFoQjtBQUNBLFFBQUlELFVBQUFBLE1BQUFBLEdBQUosQ0FBQSxFQUEwQjtBQUN0QkQsbUJBQUFBLElBQUFBLENBQWdCRywwQkFBaEJILFNBQWdCRyxDQUFoQkg7QUFDSDtBQUNELFFBQUlELFlBQUFBLFFBQUFBLElBQXdCQSxZQUFBQSxRQUFBQSxDQUFBQSxNQUFBQSxHQUE1QixDQUFBLEVBQTZEO0FBQ3pELFlBQUlLLGNBQWMsWUFBQSxRQUFBLENBQUEsR0FBQSxDQUF5QixVQUFBLE1BQUEsRUFBVTtBQUNqRCxtQkFBTyxFQUFFYixJQUFGLGVBQUEsRUFBdUJ6QixRQUE5QixNQUFPLEVBQVA7QUFESixTQUFrQixDQUFsQjtBQUdBa0MsbUJBQUFBLElBQUFBLENBQWdCRywwQkFBaEJILFdBQWdCRyxDQUFoQkg7QUFDSDtBQUNELFdBQUEsVUFBQTtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmVSZWNvcmRJZGVudGl0eSwgZXF1YWxSZWNvcmRJZGVudGl0aWVzLCByZWNvcmREaWZmcywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBjbG9uZSwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBidWlsZEZldGNoU2V0dGluZ3MsIGN1c3RvbVJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi9yZXF1ZXN0LXNldHRpbmdzJztcbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyA9IHtcbiAgICBhZGRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gc291cmNlO1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgcmVxdWVzdERvYyA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplRG9jdW1lbnQocmVjb3JkKTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uOiByZXF1ZXN0RG9jIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTChyZWNvcmQudHlwZSksIHNldHRpbmdzKS50aGVuKHJhdyA9PiBoYW5kbGVDaGFuZ2VzKHJlY29yZCwgc2VyaWFsaXplci5kZXNlcmlhbGl6ZURvY3VtZW50KHJhdywgcmVjb3JkKSkpO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyBzZXJpYWxpemVyIH0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REb2MgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZURvY3VtZW50KHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQQVRDSCcsIGpzb246IHJlcXVlc3REb2MgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4ocmF3ID0+IHtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChyYXcsIHJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlcXVlc3QucmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAgfSA9IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGpzb24gPSB7XG4gICAgICAgICAgICBkYXRhOiByZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLm1hcChyID0+IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlSWRlbnRpdHkocikpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlbGF0ZWRSZWNvcmQgPyBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHJlbGF0ZWRSZWNvcmQpIDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BBVENIJywganNvbiB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybVJlcXVlc3RzKHNvdXJjZSwgdHJhbnNmb3JtKSB7XG4gICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICBsZXQgcHJldlJlcXVlc3Q7XG4gICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICBsZXQgcmVxdWVzdDtcbiAgICAgICAgbGV0IG5ld1JlcXVlc3ROZWVkZWQgPSB0cnVlO1xuICAgICAgICBpZiAocHJldlJlcXVlc3QgJiYgZXF1YWxSZWNvcmRJZGVudGl0aWVzKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlY29yZCkpIHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZW1vdmVSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2UmVxdWVzdC5vcCAhPT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlcXVlc3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkUmVjb3JkJyB8fCBwcmV2UmVxdWVzdC5vcCA9PT0gJ3JlcGxhY2VSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3ROZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShwcmV2UmVxdWVzdC5yZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVjb3JkSGFzT25lKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWNvcmRIYXNNYW55KHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgb3BlcmF0aW9uLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgcHJldlJlcXVlc3QucmVsYXRpb25zaGlwID09PSBvcGVyYXRpb24ucmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHByZXZSZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLnB1c2goY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0TmVlZGVkKSB7XG4gICAgICAgICAgICByZXF1ZXN0ID0gT3BlcmF0aW9uVG9SZXF1ZXN0TWFwW29wZXJhdGlvbi5vcF0ob3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgcHJldlJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3RzO1xufVxuY29uc3QgT3BlcmF0aW9uVG9SZXF1ZXN0TWFwID0ge1xuICAgIGFkZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShyZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcGVyYXRpb24ucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IFtjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKV1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKSxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBbY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCldXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgdHlwZTogb3BlcmF0aW9uLnJlY29yZC50eXBlLFxuICAgICAgICAgICAgaWQ6IG9wZXJhdGlvbi5yZWNvcmQuaWRcbiAgICAgICAgfTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGF0dHJpYnV0ZV0sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3JkID8gY2xvbmVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKSA6IG51bGwpO1xufVxuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gY2xvbmVSZWNvcmRJZGVudGl0eShyKSkpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHJlc3BvbnNlRG9jKSB7XG4gICAgbGV0IHVwZGF0ZWRSZWNvcmQgPSByZXNwb25zZURvYy5kYXRhO1xuICAgIGxldCB0cmFuc2Zvcm1zID0gW107XG4gICAgbGV0IHVwZGF0ZU9wcyA9IHJlY29yZERpZmZzKHJlY29yZCwgdXBkYXRlZFJlY29yZCk7XG4gICAgaWYgKHVwZGF0ZU9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybSh1cGRhdGVPcHMpKTtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlRG9jLmluY2x1ZGVkICYmIHJlc3BvbnNlRG9jLmluY2x1ZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGluY2x1ZGVkT3BzID0gcmVzcG9uc2VEb2MuaW5jbHVkZWQubWFwKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWNvcmQnLCByZWNvcmQgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybShpbmNsdWRlZE9wcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3Jtcztcbn0iXX0=