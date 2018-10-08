function serializeRecordIdentity(record) {
    return `${record.type}:${record.id}`;
}
function deserializeRecordIdentity(identity) {
    const [type, id] = identity.split(':');
    return { type, id };
}
export default class RecordIdentityMap {
    constructor(base) {
        const identities = this.identities = {};
        if (base) {
            Object.keys(base.identities).forEach(k => {
                identities[k] = true;
            });
        }
    }
    add(record) {
        this.identities[serializeRecordIdentity(record)] = true;
    }
    remove(record) {
        delete this.identities[serializeRecordIdentity(record)];
    }
    get values() {
        return Object.keys(this.identities).map(id => deserializeRecordIdentity(id));
    }
    has(record) {
        if (record) {
            return !!this.identities[serializeRecordIdentity(record)];
        } else {
            return false;
        }
    }
    exclusiveOf(other) {
        return Object.keys(this.identities).filter(id => !other.identities[id]).map(id => deserializeRecordIdentity(id));
    }
    equals(other) {
        return this.exclusiveOf(other).length === 0 && other.exclusiveOf(this).length === 0;
    }
}