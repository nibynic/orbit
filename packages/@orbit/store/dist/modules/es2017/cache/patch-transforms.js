import { mergeRecords, equalRecordIdentities } from '@orbit/data';
import { clone, deepGet, deepSet } from '@orbit/utils';
export default {
    addRecord(cache, op) {
        let record = op.record;
        const records = cache.records(record.type);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceRecord(cache, op) {
        const updates = op.record;
        const records = cache.records(updates.type);
        const current = records.get(updates.id);
        const record = mergeRecords(current, updates);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    removeRecord(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        const result = records.get(id);
        if (result) {
            records.remove(id);
            return result;
        } else {
            return null;
        }
    },
    replaceKey(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
        } else {
            record = { type, id };
        }
        deepSet(record, ['keys', op.key], op.value);
        records.set(id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceAttribute(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
        } else {
            record = { type, id };
        }
        deepSet(record, ['attributes', op.attribute], op.value);
        records.set(id, record);
        return record;
    },
    addToRelatedRecords(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
        } else {
            record = { type, id };
        }
        const relatedRecords = deepGet(record, ['relationships', op.relationship, 'data']) || [];
        relatedRecords.push(op.relatedRecord);
        deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords);
        records.set(id, record);
        return record;
    },
    removeFromRelatedRecords(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
            let relatedRecords = deepGet(record, ['relationships', op.relationship, 'data']);
            if (relatedRecords) {
                relatedRecords = relatedRecords.filter(r => !equalRecordIdentities(r, op.relatedRecord));
                if (deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords)) {
                    records.set(id, record);
                }
            }
            return record;
        }
        return null;
    },
    replaceRelatedRecords(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
        } else {
            record = { type, id };
        }
        if (deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecords)) {
            records.set(id, record);
        }
        return record;
    },
    replaceRelatedRecord(cache, op) {
        const { type, id } = op.record;
        const records = cache.records(type);
        let record = records.get(id);
        if (record) {
            record = clone(record);
        } else {
            record = { type, id };
        }
        if (deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecord)) {
            records.set(id, record);
        }
        return record;
    }
};