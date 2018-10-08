import Orbit, { buildTransform } from '@orbit/data';
export const PullOperators = {
    findRecords(source, expression) {
        const operations = [];
        let types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce((chain, type) => {
            return chain.then(() => {
                return source.getRecords(type).then(records => {
                    records.forEach(record => {
                        operations.push({
                            op: 'addRecord',
                            record
                        });
                    });
                });
            });
        }, Orbit.Promise.resolve()).then(() => [buildTransform(operations)]);
    },
    findRecord(source, expression) {
        return source.getRecord(expression.record).then(record => {
            const operations = [{
                op: 'addRecord',
                record
            }];
            return [buildTransform(operations)];
        });
    }
};