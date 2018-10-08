import { isObject, isNone, merge } from '@orbit/utils';
export function cloneRecordIdentity(identity) {
    const { type, id } = identity;
    return { type, id };
}
export function equalRecordIdentities(record1, record2) {
    return isNone(record1) && isNone(record2) || isObject(record1) && isObject(record2) && record1.type === record2.type && record1.id === record2.id;
}
export function mergeRecords(current, updates) {
    if (current) {
        let record = cloneRecordIdentity(current);
        ['attributes', 'keys', 'relationships'].forEach(grouping => {
            if (current[grouping] && updates[grouping]) {
                record[grouping] = merge({}, current[grouping], updates[grouping]);
            } else if (current[grouping]) {
                record[grouping] = merge({}, current[grouping]);
            } else if (updates[grouping]) {
                record[grouping] = merge({}, updates[grouping]);
            }
        });
        return record;
    } else {
        return updates;
    }
}