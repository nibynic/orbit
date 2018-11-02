import { toArray } from '@orbit/utils';
import { buildTransform } from '@orbit/data';
import { GetOperators } from "./get-operators";
function deserialize(source, document) {
    const deserialized = source.serializer.deserializeDocument(document);
    const records = toArray(deserialized.data);
    if (deserialized.included) {
        Array.prototype.push.apply(records, deserialized.included);
    }
    return records.map(record => {
        return {
            op: 'replaceRecord',
            record
        };
    });
}
function extractRecords(source, document) {
    const deserialized = source.serializer.deserializeDocument(document);
    return toArray(deserialized.data);
}
export const PullOperators = {
    findRecord(source, query) {
        return GetOperators.findRecord(source, query).then(data => [buildTransform(deserialize(source, data))]);
    },
    findRecords(source, query) {
        return GetOperators.findRecords(source, query).then(data => [buildTransform(deserialize(source, data))]);
    },
    findRelatedRecord(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        return GetOperators.findRelatedRecord(source, query).then(data => {
            const operations = deserialize(source, data);
            const records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecord',
                record,
                relationship,
                relatedRecord: {
                    type: records[0].type,
                    id: records[0].id
                }
            });
            return [buildTransform(operations)];
        });
    },
    findRelatedRecords(source, query) {
        const expression = query.expression;
        const { record, relationship } = expression;
        return GetOperators.findRelatedRecords(source, query).then(data => {
            const operations = deserialize(source, data);
            const records = extractRecords(source, data);
            operations.push({
                op: 'replaceRelatedRecords',
                record,
                relationship,
                relatedRecords: records.map(r => ({
                    type: r.type,
                    id: r.id
                }))
            });
            return [buildTransform(operations)];
        });
    }
};