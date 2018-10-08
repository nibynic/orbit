import { cloneRecordIdentity, equalRecordIdentities, recordDiffs, buildTransform } from '@orbit/data';
import { clone, deepSet } from '@orbit/utils';
import { buildFetchSettings, customRequestOptions } from './request-settings';
export const TransformRequestProcessors = {
    addRecord(source, request) {
        const { serializer } = source;
        const record = request.record;
        const requestDoc = serializer.serializeDocument(record);
        const settings = buildFetchSettings(request.options, { method: 'POST', json: requestDoc });
        return source.fetch(source.resourceURL(record.type), settings).then(raw => handleChanges(record, serializer.deserializeDocument(raw, record)));
    },
    removeRecord(source, request) {
        const { type, id } = request.record;
        const settings = buildFetchSettings(request.options, { method: 'DELETE' });
        return source.fetch(source.resourceURL(type, id), settings).then(() => []);
    },
    replaceRecord(source, request) {
        const { serializer } = source;
        const record = request.record;
        const { type, id } = record;
        const requestDoc = serializer.serializeDocument(record);
        const settings = buildFetchSettings(request.options, { method: 'PATCH', json: requestDoc });
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
        const settings = buildFetchSettings(request.options, { method: 'POST', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    removeFromRelatedRecords(source, request) {
        const { type, id } = request.record;
        const { relationship } = request;
        const json = {
            data: request.relatedRecords.map(r => source.serializer.resourceIdentity(r))
        };
        const settings = buildFetchSettings(request.options, { method: 'DELETE', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    replaceRelatedRecord(source, request) {
        const { type, id } = request.record;
        const { relationship, relatedRecord } = request;
        const json = {
            data: relatedRecord ? source.serializer.resourceIdentity(relatedRecord) : null
        };
        const settings = buildFetchSettings(request.options, { method: 'PATCH', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    },
    replaceRelatedRecords(source, request) {
        const { type, id } = request.record;
        const { relationship, relatedRecords } = request;
        const json = {
            data: relatedRecords.map(r => source.serializer.resourceIdentity(r))
        };
        const settings = buildFetchSettings(request.options, { method: 'PATCH', json });
        return source.fetch(source.resourceRelationshipURL(type, id, relationship), settings).then(() => []);
    }
};
export function getTransformRequests(source, transform) {
    const requests = [];
    let prevRequest;
    transform.operations.forEach(operation => {
        let request;
        let newRequestNeeded = true;
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
            let options = customRequestOptions(source, transform);
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
            record: clone(operation.record)
        };
    },
    removeRecord(operation) {
        return {
            op: 'removeRecord',
            record: cloneRecordIdentity(operation.record)
        };
    },
    replaceAttribute(operation) {
        const record = cloneRecordIdentity(operation.record);
        replaceRecordAttribute(record, operation.attribute, operation.value);
        return {
            op: 'replaceRecord',
            record
        };
    },
    replaceRecord(operation) {
        return {
            op: 'replaceRecord',
            record: clone(operation.record)
        };
    },
    addToRelatedRecords(operation) {
        return {
            op: 'addToRelatedRecords',
            record: cloneRecordIdentity(operation.record),
            relationship: operation.relationship,
            relatedRecords: [cloneRecordIdentity(operation.relatedRecord)]
        };
    },
    removeFromRelatedRecords(operation) {
        return {
            op: 'removeFromRelatedRecords',
            record: cloneRecordIdentity(operation.record),
            relationship: operation.relationship,
            relatedRecords: [cloneRecordIdentity(operation.relatedRecord)]
        };
    },
    replaceRelatedRecord(operation) {
        const record = {
            type: operation.record.type,
            id: operation.record.id
        };
        deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        return {
            op: 'replaceRecord',
            record
        };
    },
    replaceRelatedRecords(operation) {
        const record = cloneRecordIdentity(operation.record);
        deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        return {
            op: 'replaceRecord',
            record
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
    deepSet(record, ['relationships', relationship, 'data'], relatedRecords.map(r => cloneRecordIdentity(r)));
}
function handleChanges(record, responseDoc) {
    let updatedRecord = responseDoc.data;
    let transforms = [];
    let updateOps = recordDiffs(record, updatedRecord);
    if (updateOps.length > 0) {
        transforms.push(buildTransform(updateOps));
    }
    if (responseDoc.included && responseDoc.included.length > 0) {
        let includedOps = responseDoc.included.map(record => {
            return { op: 'replaceRecord', record };
        });
        transforms.push(buildTransform(includedOps));
    }
    return transforms;
}