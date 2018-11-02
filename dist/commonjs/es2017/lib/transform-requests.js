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
            } else {
                return [];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tcmVxdWVzdHMuanMiXSwibmFtZXMiOlsiZ2V0VHJhbnNmb3JtUmVxdWVzdHMiLCJUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyIsImFkZFJlY29yZCIsInNvdXJjZSIsInJlcXVlc3QiLCJzZXJpYWxpemVyIiwicmVjb3JkIiwicmVxdWVzdERvYyIsInNlcmlhbGl6ZURvY3VtZW50Iiwic2V0dGluZ3MiLCJvcHRpb25zIiwibWV0aG9kIiwianNvbiIsImZldGNoIiwicmVzb3VyY2VVUkwiLCJ0eXBlIiwidGhlbiIsInJhdyIsImhhbmRsZUNoYW5nZXMiLCJkZXNlcmlhbGl6ZURvY3VtZW50IiwicmVtb3ZlUmVjb3JkIiwiaWQiLCJyZXBsYWNlUmVjb3JkIiwiYWRkVG9SZWxhdGVkUmVjb3JkcyIsInJlbGF0aW9uc2hpcCIsImRhdGEiLCJyZWxhdGVkUmVjb3JkcyIsIm1hcCIsInIiLCJyZXNvdXJjZUlkZW50aXR5IiwicmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCIsInJlbGF0ZWRSZWNvcmQiLCJyZXBsYWNlUmVsYXRlZFJlY29yZHMiLCJ0cmFuc2Zvcm0iLCJyZXF1ZXN0cyIsInByZXZSZXF1ZXN0Iiwib3BlcmF0aW9ucyIsImZvckVhY2giLCJvcGVyYXRpb24iLCJuZXdSZXF1ZXN0TmVlZGVkIiwib3AiLCJwb3AiLCJyZXBsYWNlUmVjb3JkQXR0cmlidXRlIiwiYXR0cmlidXRlIiwidmFsdWUiLCJyZXBsYWNlUmVjb3JkSGFzT25lIiwicmVwbGFjZVJlY29yZEhhc01hbnkiLCJwdXNoIiwiT3BlcmF0aW9uVG9SZXF1ZXN0TWFwIiwicmVwbGFjZUF0dHJpYnV0ZSIsInJlc3BvbnNlRG9jIiwidXBkYXRlZFJlY29yZCIsInRyYW5zZm9ybXMiLCJ1cGRhdGVPcHMiLCJsZW5ndGgiLCJpbmNsdWRlZCIsImluY2x1ZGVkT3BzIl0sIm1hcHBpbmdz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OUQsd0JBQVEzQixNQUFSLEVBQWdCLENBQUMsZUFBRCxFQUFrQmtCLFlBQWxCLEVBQWdDLE1BQWhDLENBQWhCLEVBQXlEUyxnQkFBZ0IsK0JBQW9CQSxhQUFwQixDQUFoQixHQUFxRCxJQUE5RztBQUNIO0FBQ0QsU0FBU2Usb0JBQVQsQ0FBOEIxQyxNQUE5QixFQUFzQ2tCLFlBQXRDLEVBQW9ERSxjQUFwRCxFQUFvRTtBQUNoRSx3QkFBUXBCLE1BQVIsRUFBZ0IsQ0FBQyxlQUFELEVBQWtCa0IsWUFBbEIsRUFBZ0MsTUFBaEMsQ0FBaEIsRUFBeURFLGVBQWVDLEdBQWYsQ0FBbUJDLEtBQUssK0JBQW9CQSxDQUFwQixDQUF4QixDQUF6RDtBQUNIO0FBQ0QsU0FBU1YsYUFBVCxDQUF1QlosTUFBdkIsRUFBK0I4QyxXQUEvQixFQUE0QztBQUN4QyxRQUFJQyxnQkFBZ0JELFlBQVkzQixJQUFoQztBQUNBLFFBQUk2QixhQUFhLEVBQWpCO0FBQ0EsUUFBSUMsWUFBWSx1QkFBWWpELE1BQVosRUFBb0IrQyxhQUFwQixDQUFoQjtBQUNBLFFBQUlFLFVBQVVDLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEJGLG1CQUFXTCxJQUFYLENBQWdCLDBCQUFlTSxTQUFmLENBQWhCO0FBQ0g7QUFDRCxRQUFJSCxZQUFZSyxRQUFaLElBQXdCTCxZQUFZSyxRQUFaLENBQXFCRCxNQUFyQixHQUE4QixDQUExRCxFQUE2RDtBQUN6RCxZQUFJRSxjQUFjTixZQUFZSyxRQUFaLENBQXFCOUIsR0FBckIsQ0FBeUJyQixVQUFVO0FBQ2pELG1CQUFPLEVBQUVvQyxJQUFJLGVBQU4sRUFBdUJwQyxNQUF2QixFQUFQO0FBQ0gsU0FGaUIsQ0FBbEI7QUFHQWdELG1CQUFXTCxJQUFYLENBQWdCLDBCQUFlUyxXQUFmLENBQWhCO0FBQ0g7QUFDRCxXQUFPSixVQUFQO0FBQ0giLCJmaWxlIjoibGliL3RyYW5zZm9ybS1yZXF1ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lUmVjb3JkSWRlbnRpdHksIGVxdWFsUmVjb3JkSWRlbnRpdGllcywgcmVjb3JkRGlmZnMsIGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgY2xvbmUsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgYnVpbGRGZXRjaFNldHRpbmdzLCBjdXN0b21SZXF1ZXN0T3B0aW9ucyB9IGZyb20gJy4vcmVxdWVzdC1zZXR0aW5ncyc7XG5leHBvcnQgY29uc3QgVHJhbnNmb3JtUmVxdWVzdFByb2Nlc3NvcnMgPSB7XG4gICAgYWRkUmVjb3JkKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHNlcmlhbGl6ZXIgfSA9IHNvdXJjZTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REb2MgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZURvY3VtZW50KHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQT1NUJywganNvbjogcmVxdWVzdERvYyB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VVUkwocmVjb3JkLnR5cGUpLCBzZXR0aW5ncykudGhlbihyYXcgPT4gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChyYXcsIHJlY29yZCkpKTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTCh0eXBlLCBpZCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gc291cmNlO1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVjb3JkO1xuICAgICAgICBjb25zdCByZXF1ZXN0RG9jID0gc2VyaWFsaXplci5zZXJpYWxpemVEb2N1bWVudChyZWNvcmQpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uOiByZXF1ZXN0RG9jIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTCh0eXBlLCBpZCksIHNldHRpbmdzKS50aGVuKHJhdyA9PiB7XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNoYW5nZXMocmVjb3JkLCBzZXJpYWxpemVyLmRlc2VyaWFsaXplRG9jdW1lbnQocmF3LCByZWNvcmQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlcXVlc3QucmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAgfSA9IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGpzb24gPSB7XG4gICAgICAgICAgICBkYXRhOiByZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLm1hcChyID0+IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlSWRlbnRpdHkocikpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdERUxFVEUnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlbGF0ZWRSZWNvcmQgPyBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHJlbGF0ZWRSZWNvcmQpIDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgeyByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BBVENIJywganNvbiB9KTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5mZXRjaChzb3VyY2UucmVzb3VyY2VSZWxhdGlvbnNoaXBVUkwodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCksIHNldHRpbmdzKS50aGVuKCgpID0+IFtdKTtcbiAgICB9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybVJlcXVlc3RzKHNvdXJjZSwgdHJhbnNmb3JtKSB7XG4gICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICBsZXQgcHJldlJlcXVlc3Q7XG4gICAgdHJhbnNmb3JtLm9wZXJhdGlvbnMuZm9yRWFjaChvcGVyYXRpb24gPT4ge1xuICAgICAgICBsZXQgcmVxdWVzdDtcbiAgICAgICAgbGV0IG5ld1JlcXVlc3ROZWVkZWQgPSB0cnVlO1xuICAgICAgICBpZiAocHJldlJlcXVlc3QgJiYgZXF1YWxSZWNvcmRJZGVudGl0aWVzKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlY29yZCkpIHtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZW1vdmVSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2UmVxdWVzdC5vcCAhPT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldlJlcXVlc3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkUmVjb3JkJyB8fCBwcmV2UmVxdWVzdC5vcCA9PT0gJ3JlcGxhY2VSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3ROZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShwcmV2UmVxdWVzdC5yZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVjb3JkSGFzT25lKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWNvcmRIYXNNYW55KHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZSZXF1ZXN0Lm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgb3BlcmF0aW9uLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgcHJldlJlcXVlc3QucmVsYXRpb25zaGlwID09PSBvcGVyYXRpb24ucmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHByZXZSZXF1ZXN0LnJlbGF0ZWRSZWNvcmRzLnB1c2goY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0TmVlZGVkKSB7XG4gICAgICAgICAgICByZXF1ZXN0ID0gT3BlcmF0aW9uVG9SZXF1ZXN0TWFwW29wZXJhdGlvbi5vcF0ob3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBjdXN0b21SZXF1ZXN0T3B0aW9ucyhzb3VyY2UsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgcHJldlJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3RzO1xufVxuY29uc3QgT3BlcmF0aW9uVG9SZXF1ZXN0TWFwID0ge1xuICAgIGFkZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShyZWNvcmQsIG9wZXJhdGlvbi5hdHRyaWJ1dGUsIG9wZXJhdGlvbi52YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmUob3BlcmF0aW9uLnJlY29yZClcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcGVyYXRpb24ucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IFtjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKV1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgIHJlY29yZDogY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKSxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBbY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVsYXRlZFJlY29yZCldXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgdHlwZTogb3BlcmF0aW9uLnJlY29yZC50eXBlLFxuICAgICAgICAgICAgaWQ6IG9wZXJhdGlvbi5yZWNvcmQuaWRcbiAgICAgICAgfTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGF0dHJpYnV0ZV0sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VSZWNvcmRIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3JkID8gY2xvbmVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKSA6IG51bGwpO1xufVxuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgcmVsYXRlZFJlY29yZHMubWFwKHIgPT4gY2xvbmVSZWNvcmRJZGVudGl0eShyKSkpO1xufVxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHJlc3BvbnNlRG9jKSB7XG4gICAgbGV0IHVwZGF0ZWRSZWNvcmQgPSByZXNwb25zZURvYy5kYXRhO1xuICAgIGxldCB0cmFuc2Zvcm1zID0gW107XG4gICAgbGV0IHVwZGF0ZU9wcyA9IHJlY29yZERpZmZzKHJlY29yZCwgdXBkYXRlZFJlY29yZCk7XG4gICAgaWYgKHVwZGF0ZU9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybSh1cGRhdGVPcHMpKTtcbiAgICB9XG4gICAgaWYgKHJlc3BvbnNlRG9jLmluY2x1ZGVkICYmIHJlc3BvbnNlRG9jLmluY2x1ZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGluY2x1ZGVkT3BzID0gcmVzcG9uc2VEb2MuaW5jbHVkZWQubWFwKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWNvcmQnLCByZWNvcmQgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRyYW5zZm9ybXMucHVzaChidWlsZFRyYW5zZm9ybShpbmNsdWRlZE9wcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3Jtcztcbn0iXX0=