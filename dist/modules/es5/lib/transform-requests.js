import { cloneRecordIdentity, equalRecordIdentities, recordDiffs, buildTransform } from '@orbit/data';
import { clone, deepSet } from '@orbit/utils';
import { buildFetchSettings, customRequestOptions } from './request-settings';
export var TransformRequestProcessors = {
    addRecord: function (source, request) {
        var serializer = source.serializer;

        var record = request.record;
        var requestDoc = serializer.serializeDocument(record);
        var settings = buildFetchSettings(request.options, { method: 'POST', json: requestDoc });
        return source.fetch(source.resourceURL(record.type), settings).then(function (raw) {
            return handleChanges(record, serializer.deserializeDocument(raw, record));
        });
    },
    removeRecord: function (source, request) {
        var _request$record = request.record,
            type = _request$record.type,
            id = _request$record.id;

        var settings = buildFetchSettings(request.options, { method: 'DELETE' });
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
        var settings = buildFetchSettings(request.options, { method: 'PATCH', json: requestDoc });
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
        var settings = buildFetchSettings(request.options, { method: 'POST', json: json });
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
        var settings = buildFetchSettings(request.options, { method: 'DELETE', json: json });
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
        var settings = buildFetchSettings(request.options, { method: 'PATCH', json: json });
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
        var settings = buildFetchSettings(request.options, { method: 'PATCH', json: json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(function () {
            return [];
        });
    }
};
export function getTransformRequests(source, transform) {
    var requests = [];
    var prevRequest = void 0;
    transform.operations.forEach(function (operation) {
        var request = void 0;
        var newRequestNeeded = true;
        if (prevRequest && equalRecordIdentities(prevRequest.record, operation.record)) {
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
                prevRequest.relatedRecords.push(cloneRecordIdentity(operation.relatedRecord));
            }
        }
        if (newRequestNeeded) {
            request = OperationToRequestMap[operation.op](operation);
        }
        if (request) {
            var options = customRequestOptions(source, transform);
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
            record: clone(operation.record)
        };
    },
    removeRecord: function (operation) {
        return {
            op: 'removeRecord',
            record: cloneRecordIdentity(operation.record)
        };
    },
    replaceAttribute: function (operation) {
        var record = cloneRecordIdentity(operation.record);
        replaceRecordAttribute(record, operation.attribute, operation.value);
        return {
            op: 'replaceRecord',
            record: record
        };
    },
    replaceRecord: function (operation) {
        return {
            op: 'replaceRecord',
            record: clone(operation.record)
        };
    },
    addToRelatedRecords: function (operation) {
        return {
            op: 'addToRelatedRecords',
            record: cloneRecordIdentity(operation.record),
            relationship: operation.relationship,
            relatedRecords: [cloneRecordIdentity(operation.relatedRecord)]
        };
    },
    removeFromRelatedRecords: function (operation) {
        return {
            op: 'removeFromRelatedRecords',
            record: cloneRecordIdentity(operation.record),
            relationship: operation.relationship,
            relatedRecords: [cloneRecordIdentity(operation.relatedRecord)]
        };
    },
    replaceRelatedRecord: function (operation) {
        var record = {
            type: operation.record.type,
            id: operation.record.id
        };
        deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        return {
            op: 'replaceRecord',
            record: record
        };
    },
    replaceRelatedRecords: function (operation) {
        var record = cloneRecordIdentity(operation.record);
        deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        return {
            op: 'replaceRecord',
            record: record
        };
    }
};
function replaceRecordAttribute(record, attribute, value) {
    deepSet(record, ['attributes', attribute], value);
}
function replaceRecordHasOne(record, relationship, relatedRecord) {
    deepSet(record, ['relationships', relationship, 'data'], relatedRecord ? cloneRecordIdentity(relatedRecord) : null);
}
function replaceRecordHasMany(record, relationship, relatedRecords) {
    deepSet(record, ['relationships', relationship, 'data'], relatedRecords.map(function (r) {
        return cloneRecordIdentity(r);
    }));
}
function handleChanges(record, responseDoc) {
    var updatedRecord = responseDoc.data;
    var transforms = [];
    var updateOps = recordDiffs(record, updatedRecord);
    if (updateOps.length > 0) {
        transforms.push(buildTransform(updateOps));
    }
    if (responseDoc.included && responseDoc.included.length > 0) {
        var includedOps = responseDoc.included.map(function (record) {
            return { op: 'replaceRecord', record: record };
        });
        transforms.push(buildTransform(includedOps));
    }
    return transforms;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tcmVxdWVzdHMuanMiXSwibmFtZXMiOlsiY2xvbmVSZWNvcmRJZGVudGl0eSIsImVxdWFsUmVjb3JkSWRlbnRpdGllcyIsInJlY29yZERpZmZzIiwiYnVpbGRUcmFuc2Zvcm0iLCJjbG9uZSIsImRlZXBTZXQiLCJidWlsZEZldGNoU2V0dGluZ3MiLCJjdXN0b21SZXF1ZXN0T3B0aW9ucyIsIlRyYW5zZm9ybVJlcXVlc3RQcm9jZXNzb3JzIiwiYWRkUmVjb3JkIiwic291cmNlIiwicmVxdWVzdCIsInNlcmlhbGl6ZXIiLCJyZWNvcmQiLCJyZXF1ZXN0RG9jIiwic2VyaWFsaXplRG9jdW1lbnQiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJtZXRob2QiLCJqc29uIiwiZmV0Y2giLCJyZXNvdXJjZVVSTCIsInR5cGUiLCJ0aGVuIiwiaGFuZGxlQ2hhbmdlcyIsImRlc2VyaWFsaXplRG9jdW1lbnQiLCJyYXciLCJyZW1vdmVSZWNvcmQiLCJpZCIsInJlcGxhY2VSZWNvcmQiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwiZGF0YSIsInJlbGF0ZWRSZWNvcmRzIiwibWFwIiwicmVzb3VyY2VJZGVudGl0eSIsInIiLCJyZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCIsInJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyIsInJlcGxhY2VSZWxhdGVkUmVjb3JkIiwicmVsYXRlZFJlY29yZCIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsImdldFRyYW5zZm9ybVJlcXVlc3RzIiwidHJhbnNmb3JtIiwicmVxdWVzdHMiLCJwcmV2UmVxdWVzdCIsIm9wZXJhdGlvbnMiLCJmb3JFYWNoIiwibmV3UmVxdWVzdE5lZWRlZCIsIm9wZXJhdGlvbiIsIm9wIiwicG9wIiwicmVwbGFjZVJlY29yZEF0dHJpYnV0ZSIsImF0dHJpYnV0ZSIsInZhbHVlIiwicmVwbGFjZVJlY29yZEhhc09uZSIsInJlcGxhY2VSZWNvcmRIYXNNYW55IiwicHVzaCIsIk9wZXJhdGlvblRvUmVxdWVzdE1hcCIsInJlcGxhY2VBdHRyaWJ1dGUiLCJyZXNwb25zZURvYyIsInVwZGF0ZWRSZWNvcmQiLCJ0cmFuc2Zvcm1zIiwidXBkYXRlT3BzIiwibGVuZ3RoIiwiaW5jbHVkZWQiLCJpbmNsdWRlZE9wcyJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsbUJBQVQsRUFBOEJDLHFCQUE5QixFQUFxREMsV0FBckQsRUFBa0VDLGNBQWxFLFFBQXdGLGFBQXhGO0FBQ0EsU0FBU0MsS0FBVCxFQUFnQkMsT0FBaEIsUUFBK0IsY0FBL0I7QUFDQSxTQUFTQyxrQkFBVCxFQUE2QkMsb0JBQTdCLFFBQXlELG9CQUF6RDtBQUNBLE9BQU8sSUFBTUMsNkJBQTZCO0FBQ3RDQyxhQURzQyxZQUM1QkMsTUFENEIsRUFDcEJDLE9BRG9CLEVBQ1g7QUFBQSxZQUNmQyxVQURlLEdBQ0FGLE1BREEsQ0FDZkUsVUFEZTs7QUFFdkIsWUFBTUMsU0FBU0YsUUFBUUUsTUFBdkI7QUFDQSxZQUFNQyxhQUFhRixXQUFXRyxpQkFBWCxDQUE2QkYsTUFBN0IsQ0FBbkI7QUFDQSxZQUFNRyxXQUFXVixtQkFBbUJLLFFBQVFNLE9BQTNCLEVBQW9DLEVBQUVDLFFBQVEsTUFBVixFQUFrQkMsTUFBTUwsVUFBeEIsRUFBcEMsQ0FBakI7QUFDQSxlQUFPSixPQUFPVSxLQUFQLENBQWFWLE9BQU9XLFdBQVAsQ0FBbUJSLE9BQU9TLElBQTFCLENBQWIsRUFBOENOLFFBQTlDLEVBQXdETyxJQUF4RCxDQUE2RDtBQUFBLG1CQUFPQyxjQUFjWCxNQUFkLEVBQXNCRCxXQUFXYSxtQkFBWCxDQUErQkMsR0FBL0IsRUFBb0NiLE1BQXBDLENBQXRCLENBQVA7QUFBQSxTQUE3RCxDQUFQO0FBQ0gsS0FQcUM7QUFRdENjLGdCQVJzQyxZQVF6QmpCLE1BUnlCLEVBUWpCQyxPQVJpQixFQVFSO0FBQUEsOEJBQ0xBLFFBQVFFLE1BREg7QUFBQSxZQUNsQlMsSUFEa0IsbUJBQ2xCQSxJQURrQjtBQUFBLFlBQ1pNLEVBRFksbUJBQ1pBLEVBRFk7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bEIsRUFBZ0MsTUFBaEMsQ0FBaEIsRUFBeURTLGdCQUFnQnhDLG9CQUFvQndDLGFBQXBCLENBQWhCLEdBQXFELElBQTlHO0FBQ0g7QUFDRCxTQUFTZ0Isb0JBQVQsQ0FBOEIzQyxNQUE5QixFQUFzQ2tCLFlBQXRDLEVBQW9ERSxjQUFwRCxFQUFvRTtBQUNoRTVCLFlBQVFRLE1BQVIsRUFBZ0IsQ0FBQyxlQUFELEVBQWtCa0IsWUFBbEIsRUFBZ0MsTUFBaEMsQ0FBaEIsRUFBeURFLGVBQWVDLEdBQWYsQ0FBbUI7QUFBQSxlQUFLbEMsb0JBQW9Cb0MsQ0FBcEIsQ0FBTDtBQUFBLEtBQW5CLENBQXpEO0FBQ0g7QUFDRCxTQUFTWixhQUFULENBQXVCWCxNQUF2QixFQUErQitDLFdBQS9CLEVBQTRDO0FBQ3hDLFFBQUlDLGdCQUFnQkQsWUFBWTVCLElBQWhDO0FBQ0EsUUFBSThCLGFBQWEsRUFBakI7QUFDQSxRQUFJQyxZQUFZN0QsWUFBWVcsTUFBWixFQUFvQmdELGFBQXBCLENBQWhCO0FBQ0EsUUFBSUUsVUFBVUMsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN0QkYsbUJBQVdMLElBQVgsQ0FBZ0J0RCxlQUFlNEQsU0FBZixDQUFoQjtBQUNIO0FBQ0QsUUFBSUgsWUFBWUssUUFBWixJQUF3QkwsWUFBWUssUUFBWixDQUFxQkQsTUFBckIsR0FBOEIsQ0FBMUQsRUFBNkQ7QUFDekQsWUFBSUUsY0FBY04sWUFBWUssUUFBWixDQUFxQi9CLEdBQXJCLENBQXlCLGtCQUFVO0FBQ2pELG1CQUFPLEVBQUVnQixJQUFJLGVBQU4sRUFBdUJyQyxjQUF2QixFQUFQO0FBQ0gsU0FGaUIsQ0FBbEI7QUFHQWlELG1CQUFXTCxJQUFYLENBQWdCdEQsZUFBZStELFdBQWYsQ0FBaEI7QUFDSDtBQUNELFdBQU9KLFVBQVA7QUFDSCIsImZpbGUiOiJsaWIvdHJhbnNmb3JtLXJlcXVlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmVSZWNvcmRJZGVudGl0eSwgZXF1YWxSZWNvcmRJZGVudGl0aWVzLCByZWNvcmREaWZmcywgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBjbG9uZSwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBidWlsZEZldGNoU2V0dGluZ3MsIGN1c3RvbVJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi9yZXF1ZXN0LXNldHRpbmdzJztcbmV4cG9ydCBjb25zdCBUcmFuc2Zvcm1SZXF1ZXN0UHJvY2Vzc29ycyA9IHtcbiAgICBhZGRSZWNvcmQoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gc291cmNlO1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3QgcmVxdWVzdERvYyA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplRG9jdW1lbnQocmVjb3JkKTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ1BPU1QnLCBqc29uOiByZXF1ZXN0RG9jIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVVSTChyZWNvcmQudHlwZSksIHNldHRpbmdzKS50aGVuKHJhdyA9PiBoYW5kbGVDaGFuZ2VzKHJlY29yZCwgc2VyaWFsaXplci5kZXNlcmlhbGl6ZURvY3VtZW50KHJhdywgcmVjb3JkKSkpO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgcmVxdWVzdCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXF1ZXN0LnJlY29yZDtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyBzZXJpYWxpemVyIH0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REb2MgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZURvY3VtZW50KHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQQVRDSCcsIGpzb246IHJlcXVlc3REb2MgfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlVVJMKHR5cGUsIGlkKSwgc2V0dGluZ3MpLnRoZW4ocmF3ID0+IHtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQ2hhbmdlcyhyZWNvcmQsIHNlcmlhbGl6ZXIuZGVzZXJpYWxpemVEb2N1bWVudChyYXcsIHJlY29yZCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYWRkVG9SZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHsgcmVsYXRpb25zaGlwIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVxdWVzdC5yZWxhdGVkUmVjb3Jkcy5tYXAociA9PiBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHIpKVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUE9TVCcsIGpzb24gfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlUmVsYXRpb25zaGlwVVJMKHR5cGUsIGlkLCByZWxhdGlvbnNoaXApLCBzZXR0aW5ncykudGhlbigoKSA9PiBbXSk7XG4gICAgfSxcbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCB9ID0gcmVxdWVzdDtcbiAgICAgICAgY29uc3QganNvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJlcXVlc3QucmVsYXRlZFJlY29yZHMubWFwKHIgPT4gc291cmNlLnNlcmlhbGl6ZXIucmVzb3VyY2VJZGVudGl0eShyKSlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBidWlsZEZldGNoU2V0dGluZ3MocmVxdWVzdC5vcHRpb25zLCB7IG1ldGhvZDogJ0RFTEVURScsIGpzb24gfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlUmVsYXRpb25zaGlwVVJMKHR5cGUsIGlkLCByZWxhdGlvbnNoaXApLCBzZXR0aW5ncykudGhlbigoKSA9PiBbXSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChzb3VyY2UsIHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVxdWVzdC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHsgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSByZXF1ZXN0O1xuICAgICAgICBjb25zdCBqc29uID0ge1xuICAgICAgICAgICAgZGF0YTogcmVsYXRlZFJlY29yZCA/IHNvdXJjZS5zZXJpYWxpemVyLnJlc291cmNlSWRlbnRpdHkocmVsYXRlZFJlY29yZCkgOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYnVpbGRGZXRjaFNldHRpbmdzKHJlcXVlc3Qub3B0aW9ucywgeyBtZXRob2Q6ICdQQVRDSCcsIGpzb24gfSk7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmV0Y2goc291cmNlLnJlc291cmNlUmVsYXRpb25zaGlwVVJMKHR5cGUsIGlkLCByZWxhdGlvbnNoaXApLCBzZXR0aW5ncykudGhlbigoKSA9PiBbXSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMoc291cmNlLCByZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcXVlc3QucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMgfSA9IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGpzb24gPSB7XG4gICAgICAgICAgICBkYXRhOiByZWxhdGVkUmVjb3Jkcy5tYXAociA9PiBzb3VyY2Uuc2VyaWFsaXplci5yZXNvdXJjZUlkZW50aXR5KHIpKVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IGJ1aWxkRmV0Y2hTZXR0aW5ncyhyZXF1ZXN0Lm9wdGlvbnMsIHsgbWV0aG9kOiAnUEFUQ0gnLCBqc29uIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlLmZldGNoKHNvdXJjZS5yZXNvdXJjZVJlbGF0aW9uc2hpcFVSTCh0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSwgc2V0dGluZ3MpLnRoZW4oKCkgPT4gW10pO1xuICAgIH1cbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtUmVxdWVzdHMoc291cmNlLCB0cmFuc2Zvcm0pIHtcbiAgICBjb25zdCByZXF1ZXN0cyA9IFtdO1xuICAgIGxldCBwcmV2UmVxdWVzdDtcbiAgICB0cmFuc2Zvcm0ub3BlcmF0aW9ucy5mb3JFYWNoKG9wZXJhdGlvbiA9PiB7XG4gICAgICAgIGxldCByZXF1ZXN0O1xuICAgICAgICBsZXQgbmV3UmVxdWVzdE5lZWRlZCA9IHRydWU7XG4gICAgICAgIGlmIChwcmV2UmVxdWVzdCAmJiBlcXVhbFJlY29yZElkZW50aXRpZXMocHJldlJlcXVlc3QucmVjb3JkLCBvcGVyYXRpb24ucmVjb3JkKSkge1xuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZSZXF1ZXN0Lm9wICE9PSAncmVtb3ZlUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICBwcmV2UmVxdWVzdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJldlJlcXVlc3Qub3AgPT09ICdhZGRSZWNvcmQnIHx8IHByZXZSZXF1ZXN0Lm9wID09PSAncmVwbGFjZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdE5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVjb3JkQXR0cmlidXRlKHByZXZSZXF1ZXN0LnJlY29yZCwgb3BlcmF0aW9uLmF0dHJpYnV0ZSwgb3BlcmF0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbi5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VSZWNvcmRIYXNPbmUocHJldlJlcXVlc3QucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24ub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3ROZWVkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlY29yZEhhc01hbnkocHJldlJlcXVlc3QucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJldlJlcXVlc3Qub3AgPT09ICdhZGRUb1JlbGF0ZWRSZWNvcmRzJyAmJiBvcGVyYXRpb24ub3AgPT09ICdhZGRUb1JlbGF0ZWRSZWNvcmRzJyAmJiBwcmV2UmVxdWVzdC5yZWxhdGlvbnNoaXAgPT09IG9wZXJhdGlvbi5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICBuZXdSZXF1ZXN0TmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcHJldlJlcXVlc3QucmVsYXRlZFJlY29yZHMucHVzaChjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld1JlcXVlc3ROZWVkZWQpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBPcGVyYXRpb25Ub1JlcXVlc3RNYXBbb3BlcmF0aW9uLm9wXShvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGN1c3RvbVJlcXVlc3RPcHRpb25zKHNvdXJjZSwgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG4gICAgICAgICAgICBwcmV2UmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVxdWVzdHM7XG59XG5jb25zdCBPcGVyYXRpb25Ub1JlcXVlc3RNYXAgPSB7XG4gICAgYWRkUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdhZGRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpXG4gICAgICAgIH07XG4gICAgfSxcbiAgICByZXBsYWNlQXR0cmlidXRlKG9wZXJhdGlvbikge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICByZXBsYWNlUmVjb3JkQXR0cmlidXRlKHJlY29yZCwgb3BlcmF0aW9uLmF0dHJpYnV0ZSwgb3BlcmF0aW9uLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQob3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZShvcGVyYXRpb24ucmVjb3JkKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgYWRkVG9SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAnYWRkVG9SZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICByZWNvcmQ6IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCksXG4gICAgICAgICAgICByZWxhdGlvbnNoaXA6IG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICByZWxhdGVkUmVjb3JkczogW2Nsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpXVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgcmVjb3JkOiBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiBvcGVyYXRpb24ucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IFtjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKV1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkKG9wZXJhdGlvbikge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB7XG4gICAgICAgICAgICB0eXBlOiBvcGVyYXRpb24ucmVjb3JkLnR5cGUsXG4gICAgICAgICAgICBpZDogb3BlcmF0aW9uLnJlY29yZC5pZFxuICAgICAgICB9O1xuICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbikge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfTtcbiAgICB9XG59O1xuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEF0dHJpYnV0ZShyZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgYXR0cmlidXRlXSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwbGFjZVJlY29yZEhhc09uZShyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmQgPyBjbG9uZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpIDogbnVsbCk7XG59XG5mdW5jdGlvbiByZXBsYWNlUmVjb3JkSGFzTWFueShyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCByZWxhdGVkUmVjb3Jkcy5tYXAociA9PiBjbG9uZVJlY29yZElkZW50aXR5KHIpKSk7XG59XG5mdW5jdGlvbiBoYW5kbGVDaGFuZ2VzKHJlY29yZCwgcmVzcG9uc2VEb2MpIHtcbiAgICBsZXQgdXBkYXRlZFJlY29yZCA9IHJlc3BvbnNlRG9jLmRhdGE7XG4gICAgbGV0IHRyYW5zZm9ybXMgPSBbXTtcbiAgICBsZXQgdXBkYXRlT3BzID0gcmVjb3JkRGlmZnMocmVjb3JkLCB1cGRhdGVkUmVjb3JkKTtcbiAgICBpZiAodXBkYXRlT3BzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdHJhbnNmb3Jtcy5wdXNoKGJ1aWxkVHJhbnNmb3JtKHVwZGF0ZU9wcykpO1xuICAgIH1cbiAgICBpZiAocmVzcG9uc2VEb2MuaW5jbHVkZWQgJiYgcmVzcG9uc2VEb2MuaW5jbHVkZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgaW5jbHVkZWRPcHMgPSByZXNwb25zZURvYy5pbmNsdWRlZC5tYXAocmVjb3JkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZVJlY29yZCcsIHJlY29yZCB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdHJhbnNmb3Jtcy5wdXNoKGJ1aWxkVHJhbnNmb3JtKGluY2x1ZGVkT3BzKSk7XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm1zO1xufSJdfQ==