import { deepGet, deepSet, eq, isArray } from '@orbit/utils';
const InverseTransforms = {
    addRecord(cache, op) {
        const { type, id } = op.record;
        const current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type, id }
            };
        } else if (eq(current, op.record)) {
            return;
        } else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord(cache, op) {
        const replacement = op.record;
        const { type, id } = replacement;
        const current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type, id }
            };
        } else {
            let result = { type, id };
            let changed = false;
            ['attributes', 'keys'].forEach(grouping => {
                if (replacement[grouping]) {
                    Object.keys(replacement[grouping]).forEach(field => {
                        let value = replacement[grouping][field];
                        let currentValue = deepGet(current, [grouping, field]);
                        if (!eq(value, currentValue)) {
                            changed = true;
                            deepSet(result, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(field => {
                    let currentValue = deepGet(current, ['relationships', field]);
                    let value = replacement.relationships[field];
                    let data = value && value.data;
                    let relationshipMatch;
                    if (isArray(data)) {
                        relationshipMatch = cache.relationships.relatedRecordsMatch(op.record, field, data);
                    } else {
                        relationshipMatch = eq(value, currentValue);
                    }
                    if (!relationshipMatch) {
                        changed = true;
                        deepSet(result, ['relationships', field], currentValue === undefined ? null : currentValue);
                    }
                });
            }
            if (changed) {
                return {
                    op: 'replaceRecord',
                    record: result
                };
            }
        }
    },
    removeRecord(cache, op) {
        const { type, id } = op.record;
        const current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey(cache, op) {
        const { type, id } = op.record;
        const record = cache.records(type).get(id);
        const current = record && deepGet(record, ['keys', op.key]);
        if (!eq(current, op.value)) {
            return {
                op: 'replaceKey',
                record: { type, id },
                key: op.key,
                value: current
            };
        }
    },
    replaceAttribute(cache, op) {
        const { type, id } = op.record;
        const { attribute } = op;
        const record = cache.records(type).get(id);
        const current = record && deepGet(record, ['attributes', attribute]);
        if (!eq(current, op.value)) {
            return {
                op: 'replaceAttribute',
                record: { type, id },
                attribute,
                value: current
            };
        }
    },
    addToRelatedRecords(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'removeFromRelatedRecords',
                record,
                relationship,
                relatedRecord
            };
        }
    },
    removeFromRelatedRecords(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'addToRelatedRecords',
                record,
                relationship,
                relatedRecord
            };
        }
    },
    replaceRelatedRecords(cache, op) {
        const { record, relationship, relatedRecords } = op;
        if (!cache.relationships.relatedRecordsMatch(record, relationship, relatedRecords)) {
            return {
                op: 'replaceRelatedRecords',
                record,
                relationship,
                relatedRecords: cache.relationships.relatedRecords(record, relationship)
            };
        }
    },
    replaceRelatedRecord(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'replaceRelatedRecord',
                record,
                relationship,
                relatedRecord: cache.relationships.relatedRecord(record, relationship) || null
            };
        }
    }
};
export default InverseTransforms;