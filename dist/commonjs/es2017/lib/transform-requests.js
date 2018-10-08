'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransformRequestProcessors = undefined;
exports.getTransformRequests = getTransformRequests;

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

var _requestSettings = require('./request-settings');

const TransformRequestProcessors = exports.TransformRequestProcessors = {
    addRecord(source, request) {
        const { serializer } = source;
        const record = request.record;
        const requestDoc = serializer.serializeDocument(record);
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'POST', json: requestDoc });
        return source.fetch(source.resourceURL(record.type), settings).then(raw => handleChanges(record, serializer.deserializeDocument(raw, record)));
    },
    removeRecord(source, request) {
        const { type, id } = request.record;
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'DELETE' });
        return source.fetch(source.resourceURL(type, id), settings).then(() => []);
    },
    replaceRecord(source, request) {
        const { serializer } = source;
        const record = request.record;
        const { type, id } = record;
        const requestDoc = serializer.serializeDocument(record);
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json: requestDoc });
        return source.fetch(source.resourceURL(type, id), settings).then(raw => {
            if (raw) {
                return handleChanges(record, serializer.deserializeDocument(raw, record));
            }
        });
    },
    addToRelatedRecords(source, request) {
        const { type, id } = request.record;
        const { relationship } = request;
        const json = {
            data: request.relatedRecords.map(r => source.serializer.resourceIdentity(r))
        };
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'POST', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    removeFromRelatedRecords(source, request) {
        const { type, id } = request.record;
        const { relationship } = request;
        const json = {
            data: request.relatedRecords.map(r => source.serializer.resourceIdentity(r))
        };
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'DELETE', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    replaceRelatedRecord(source, request) {
        const { type, id } = request.record;
        const { relationship, relatedRecord } = request;
        const json = {
            data: relatedRecord ? source.serializer.resourceIdentity(relatedRecord) : null
        };
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    replaceRelatedRecords(source, request) {
        const { type, id } = request.record;
        const { relationship, relatedRecords } = request;
        const json = {
            data: relatedRecords.map(r => source.serializer.resourceIdentity(r))
        };
        const settings = (0, _requestSettings.buildFetchSettings)(request.options, { method: 'PATCH', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    }
};
function getTransformRequests(source, transform) {
    const requests = [];
    let prevRequest;
    transform.operations.forEach(operation => {
        let request;
        let newRequestNeeded = true;
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
            let options = (0, _requestSettings.customRequestOptions)(source, transform);
            if (options) {
                request.options = options;
            }
            requests.push(request);
            prevRequest = request;
        }
    });
    return requests;
}
const OperationToRequestMap = {
    addRecord(operation) {
        return {
            op: 'addRecord',
            record: (0, _utils.clone)(operation.record)
        };
    },
    removeRecord(operation) {
        return {
            op: 'removeRecord',
            record: (0, _data.cloneRecordIdentity)(operation.record)
        };
    },
    replaceAttribute(operation) {
        const record = (0, _data.cloneRecordIdentity)(operation.record);
        replaceRecordAttribute(record, operation.attribute, operation.value);
        return {
            op: 'replaceRecord',
            record
        };
    },
    replaceRecord(operation) {
        return {
            op: 'replaceRecord',
            record: (0, _utils.clone)(operation.record)
        };
    },
    addToRelatedRecords(operation) {
        return {
            op: 'addToRelatedRecords',
            record: (0, _data.cloneRecordIdentity)(operation.record),
            relationship: operation.relationship,
            relatedRecords: [(0, _data.cloneRecordIdentity)(operation.relatedRecord)]
        };
    },
    removeFromRelatedRecords(operation) {
        return {
            op: 'removeFromRelatedRecords',
            record: (0, _data.cloneRecordIdentity)(operation.record),
            relationship: operation.relationship,
            relatedRecords: [(0, _data.cloneRecordIdentity)(operation.relatedRecord)]
        };
    },
    replaceRelatedRecord(operation) {
        const record = {
            type: operation.record.type,
            id: operation.record.id
        };
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        return {
            op: 'replaceRecord',
            record
        };
    },
    replaceRelatedRecords(operation) {
        const record = (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        return {
            op: 'replaceRecord',
            record
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
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], relatedRecords.map(r => (0, _data.cloneRecordIdentity)(r)));
}
function handleChanges(record, responseDoc) {
    let updatedRecord = responseDoc.data;
    let transforms = [];
    let updateOps = (0, _data.recordDiffs)(record, updatedRecord);
    if (updateOps.length > 0) {
        transforms.push((0, _data.buildTransform)(updateOps));
    }
    if (responseDoc.included && responseDoc.included.length > 0) {
        let includedOps = responseDoc.included.map(record => {
            return { op: 'replaceRecord', record };
        });
        transforms.push((0, _data.buildTransform)(includedOps));
    }
    return transforms;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tcmVxdWVzdHMuanMiXSwibmFtZXMiOlsiZ2V0VHJhbnNmb3JtUmVxdWVzdHMiLCJUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyIsImFkZFJlY29yZCIsInNvdXJjZSIsInJlcXVlc3QiLCJzZXJpYWxpemVyIiwicmVjb3JkIiwicmVxdWVzdERvYyIsInNlcmlhbGl6ZURvY3VtZW50Iiwic2V0dGluZ3MiLCJvcHRpb25zIiwibWV0aG9kIiwianNvbiIsImZldGNoIiwicmVzb3VyY2VVUkwiLCJ0eXBlIiwidGhlbiIsInJhdyIsImhhbmRsZUNoYW5nZXMiLCJkZXNlcmlhbGl6ZURvY3VtZW50IiwicmVtb3ZlUmVjb3JkIiwiaWQiLCJyZXBsYWNlUmVjb3JkIiwiYWRkVG9SZWxhdGVkUmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsImRhdGEiLCJyZWxhdGVkUmVjb3JkcyIsIm1hcCIsInIiLCJyZXNvdXJjZUlkZW50aXR5IiwicmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCIsInJlbGF0ZWRSZWNvcmQiLCJyZXBsYWNlUmVsYXRlZFJlY29yZHMiLCJ0cmFuc2Zvcm0iLCJyZXF1ZXN0cyIsInByZXZSZXF1ZXN0Iiwib3BlcmF0aW9ucyIsImZvckVhY2giLCJvcGVyYXRpb24iLCJuZXdSZXF1ZXN0TmVlZGVkIiwib3AiLCJwb3AiLCJyZXBsYWNlUmVjb3JkQXR0cmlidXRlIiwiYXR0cmlidXRlIiwidmFsdWUiLCJyZXBsYWNlUmVjb3JkSGFzT25lIiwicmVwbGFjZVJlY29yZEhhc01hbnkiLCJwdXNoIiwiT3BlcmF0aW9uVG9SZXF1ZXN0TWFwIiwicmVwbGFjZUF0dHJpYnV0ZSIsInJlc3BvbnNlRG9jIiwidXBkYXRlZFJlY29yZCIsInRyYW5zZm9ybXMiLCJ1cGRhdGVPcHMiLCJsZW5ndGgiLCJpbmNsdWRlZCIsImluY2x1ZGVkT3BzIl0sIm1hcHBpbmdz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LEVBQWtCa0IsWUFBbEIsRUFBZ0MsTUFBaEMsQ0FBaEIsRUFBeURTLGdCQUFnQiwrQkFBb0JBLGFBQXBCLENBQWhCLEdBQXFELElBQTlHO0FBQ0g7QUFDRCxTQUFTZSxvQkFBVCxDQUE4QjFDLE1BQTlCLEVBQXNDa0IsWUFBdEMsRUFBb0RFLGNBQXBELEVBQW9FO0FBQ2hFLHdCQUFRcEIsTUFBUixFQUFnQixDQUFDLGVBQUQsRUFBa0JrQixZQUFsQixFQUFnQyxNQUFoQyxDQUFoQixFQUF5REUsZUFBZUMsR0FBZixDQUFtQkMsS0FBSywrQkFBb0JBLENBQXBCLENBQXhCLENBQXpEO0FBQ0g7QUFDRCxTQUFTVixhQUFULENBQXVCWixNQUF2QixFQUErQjhDLFdBQS9CLEVBQTRDO0FBQ3hDLFFBQUlDLGdCQUFnQkQsWUFBWTNCLElBQWhDO0FBQ0EsUUFBSTZCLGFBQWEsRUFBakI7QUFDQSxRQUFJQyxZQUFZLHVCQUFZakQsTUFBWixFQUFvQitDLGFBQXBCLENBQWhCO0FBQ0EsUUFBSUUsVUFBVUMsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN0QkYsbUJBQVdMLElBQVgsQ0FBZ0IsMEJBQWVNLFNBQWYsQ0FBaEI7QUFDSDtBQUNELFFBQUlILFlBQVlLLFFBQVosSUFBd0JMLFlBQVlLLFFBQVosQ0FBcUJELE1BQXJCLEdBQThCLENBQTFELEVBQTZEO0FBQ3pELFlBQUlFLGNBQWNOLFlBQVlLLFFBQVosQ0FBcUI5QixHQUFyQixDQUF5QnJCLFVBQVU7QUFDakQsbUJBQU8sRUFBRW9DLElBQUksZUFBTixFQUF1QnBDLE1BQXZCLEVBQVA7QUFDSCxTQUZpQixDQUFsQjtBQUdBZ0QsbUJBQVdMLElBQVgsQ0FBZ0IsMEJBQWVTLFdBQWYsQ0FBaEI7QUFDSDtBQUNELFdBQU9KLFVBQVA7QUFDSCIsImZpbGUiOiJsaWIvdHJhbnNmb3JtLXJlcXVlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmVSZWNvcmRJZGVudGl0eSwgZXF1YWxSZWNvcmRJZGVudGl0aWVzLCByZWNvcmREaWZmcywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBjbG9uZSwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBidWlsZEZldGNoU2V0dGluZ3MsIGN1c3RvbVJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi9yZXF1ZXN0LXNldHRpbmdzJztcbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyA9IHtcbiAgICBhZGRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gc291cmNlO1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgcmVxdWVzdERvYyA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplRG9jdW1lbnQocmVjb3JkKTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uOiByZXF1ZXN0RG9jIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTChyZWNvcmQudHlwZSksIHNldHRpbmdzKS50aGVuKHJhdyA9PiBoYW5kbGVDaGFuZ2VzKHJlY29yZCwgc2VyaWFsaXplci5kZXNlcmlhbGl6ZURvY3VtZW50KHJhdywgcmVjb3JkKSkpO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyBzZXJpYWxpemVyIH0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REb2MgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZURvY3VtZW50KHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQQVRDSCcsIGpzb246IHJlcXVlc3REb2MgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4ocmF3ID0+IHtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChyYXcsIHJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlcXVlc3QucmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAgfSA9IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGpzb24gPSB7XG4gICAgICAgICAgICBkYXRhOiByZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLm1hcChyID0+IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlSWRlbnRpdHkocikpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlbGF0ZWRSZWNvcmQgPyBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHJlbGF0ZWRSZWNvcmQpIDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BBVENIJywganNvbiB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybVJlcXVlc3RzKHNvdXJjZSwgdHJhbnNmb3JtKSB7XG4gICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICBsZXQgcHJldlJlcXVlc3Q7XG4gICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICBsZXQgcmVxdWVzdDtcbiAgICAgICAgbGV0IG5ld1JlcXVlc3ROZWVkZWQgPSB0cnVlO1xuICAgICAgICBpZiAocHJldlJlcXVlc3QgJiYgZXF1YWxSZWNvcmRJZGVudGl0aWVzKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlY29yZCkpIHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZW1vdmVSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2UmVxdWVzdC5vcCAhPT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlcXVlc3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkUmVjb3JkJyB8fCBwcmV2UmVxdWVzdC5vcCA9PT0gJ3JlcGxhY2VSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3ROZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShwcmV2UmVxdWVzdC5yZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVjb3JkSGFzT25lKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWNvcmRIYXNNYW55KHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgb3BlcmF0aW9uLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgcHJldlJlcXVlc3QucmVsYXRpb25zaGlwID09PSBvcGVyYXRpb24ucmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHByZXZSZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLnB1c2goY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0TmVlZGVkKSB7XG4gICAgICAgICAgICByZXF1ZXN0ID0gT3BlcmF0aW9uVG9SZXF1ZXN0TWFwW29wZXJhdGlvbi5vcF0ob3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgcHJldlJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3RzO1xufVxuY29uc3QgT3BlcmF0aW9uVG9SZXF1ZXN0TWFwID0ge1xuICAgIGFkZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShyZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcGVyYXRpb24ucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IFtjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKV1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKSxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBbY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCldXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgdHlwZTogb3BlcmF0aW9uLnJlY29yZC50eXBlLFxuICAgICAgICAgICAgaWQ6IG9wZXJhdGlvbi5yZWNvcmQuaWRcbiAgICAgICAgfTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGF0dHJpYnV0ZV0sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3JkID8gY2xvbmVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKSA6IG51bGwpO1xufVxuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gY2xvbmVSZWNvcmRJZGVudGl0eShyKSkpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHJlc3BvbnNlRG9jKSB7XG4gICAgbGV0IHVwZGF0ZWRSZWNvcmQgPSByZXNwb25zZURvYy5kYXRhO1xuICAgIGxldCB0cmFuc2Zvcm1zID0gW107XG4gICAgbGV0IHVwZGF0ZU9wcyA9IHJlY29yZERpZmZzKHJlY29yZCwgdXBkYXRlZFJlY29yZCk7XG4gICAgaWYgKHVwZGF0ZU9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybSh1cGRhdGVPcHMpKTtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlRG9jLmluY2x1ZGVkICYmIHJlc3BvbnNlRG9jLmluY2x1ZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGluY2x1ZGVkT3BzID0gcmVzcG9uc2VEb2MuaW5jbHVkZWQubWFwKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWNvcmQnLCByZWNvcmQgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybShpbmNsdWRlZE9wcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3Jtcztcbn0iXX0=