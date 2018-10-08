import { isNone } from '@orbit/utils';
import Orbit, { buildTransform } from '@orbit/data';
export const PullOperators = {
    findRecords(source, expression) {
        const operations = [];
        const typeFilter = expression.type;
        for (let key in Orbit.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                let typesMatch = isNone(typeFilter);
                if (!typesMatch) {
                    let fragments = key.split(source.delimiter);
                    let type = fragments[1];
                    typesMatch = typeFilter === type;
                }
                if (typesMatch) {
                    let record = JSON.parse(Orbit.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record
                    });
                }
            }
        }
        return Orbit.Promise.resolve([buildTransform(operations)]);
    },
    findRecord(source, expression) {
        const operations = [];
        const requestedRecord = expression.record;
        for (let key in Orbit.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                let fragments = key.split(source.delimiter);
                let type = fragments[1];
                let id = fragments[2];
                if (type === requestedRecord.type && id === requestedRecord.id) {
                    let record = JSON.parse(Orbit.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record
                    });
                    break;
                }
            }
        }
        return Orbit.Promise.resolve([buildTransform(operations)]);
    }
};