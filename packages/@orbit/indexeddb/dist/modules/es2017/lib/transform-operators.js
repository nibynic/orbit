import { mergeRecords, cloneRecordIdentity, equalRecordIdentities } from '@orbit/data';
import { deepGet, deepSet } from '@orbit/utils';
function getRecord(source, record) {
    return source.getRecord(record).catch(() => {
        return cloneRecordIdentity(record);
    });
}
export default {
    addRecord(source, operation) {
        return source.putRecord(operation.record);
    },
    replaceRecord(source, operation) {
        let updates = operation.record;
        return source.getRecord(updates).catch(() => null).then(current => {
            let record = mergeRecords(current, updates);
            return source.putRecord(record);
        });
    },
    removeRecord(source, operation) {
        return source.removeRecord(operation.record);
    },
    replaceKey(source, operation) {
        return getRecord(source, operation.record).then(record => {
            record.keys = record.keys || {};
            record.keys[operation.key] = operation.value;
            return source.putRecord(record);
        });
    },
    replaceAttribute(source, operation) {
        return getRecord(source, operation.record).then(record => {
            record.attributes = record.attributes || {};
            record.attributes[operation.attribute] = operation.value;
            return source.putRecord(record);
        });
    },
    addToRelatedRecords(source, operation) {
        return getRecord(source, operation.record).then(record => {
            let relationships = deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                relationships.push(operation.relatedRecord);
            } else {
                deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
            }
            return source.putRecord(record);
        });
    },
    removeFromRelatedRecords(source, operation) {
        return getRecord(source, operation.record).then(record => {
            let relationships = deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (let i = 0, l = relationships.length; i < l; i++) {
                    if (equalRecordIdentities(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        });
    },
    replaceRelatedRecords(source, operation) {
        return getRecord(source, operation.record).then(record => {
            deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
            return source.putRecord(record);
        });
    },
    replaceRelatedRecord(source, operation) {
        return getRecord(source, operation.record).then(record => {
            deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
            return source.putRecord(record);
        });
    }
};