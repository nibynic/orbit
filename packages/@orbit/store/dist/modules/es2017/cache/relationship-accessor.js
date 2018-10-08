import { isArray } from '@orbit/utils';
import { equalRecordIdentities } from '@orbit/data';
import { ImmutableMap } from '@orbit/immutable';
import RecordIdentityMap from './record-identity-map';
export default class RelationshipAccessor {
    constructor(cache, base) {
        this._cache = cache;
        this.reset(base);
    }
    reset(base) {
        let relationships = {};
        Object.keys(this._cache.schema.models).forEach(type => {
            let baseRelationships = base && base._relationships[type];
            relationships[type] = new ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    }
    upgrade() {
        Object.keys(this._cache.schema.models).forEach(type => {
            if (!this._relationships[type]) {
                this._relationships[type] = new ImmutableMap();
            }
        });
    }
    relationshipExists(record, relationship, relatedRecord) {
        let rels = this._relationships[record.type].get(record.id);
        if (rels) {
            let rel = rels[relationship];
            if (rel) {
                if (rel instanceof RecordIdentityMap) {
                    return rel.has(relatedRecord);
                } else {
                    return equalRecordIdentities(relatedRecord, rel);
                }
            }
        }
        return !relatedRecord;
    }
    relatedRecord(record, relationship) {
        let rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    }
    relatedRecords(record, relationship) {
        let rels = this._relationships[record.type].get(record.id);
        let map = rels && rels[relationship];
        if (map) {
            return Array.from(map.values);
        }
    }
    relatedRecordsMap(record, relationship) {
        let rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    }
    relatedRecordsMatch(record, relationship, relatedRecords) {
        let map = this.relatedRecordsMap(record, relationship);
        if (map) {
            let otherMap = new RecordIdentityMap();
            relatedRecords.forEach(id => otherMap.add(id));
            return map.equals(otherMap);
        } else {
            return relatedRecords.length === 0;
        }
    }
    addRecord(record) {
        if (record.relationships) {
            const rels = {};
            Object.keys(record.relationships).forEach(name => {
                let rel = record.relationships[name];
                if (rel.data !== undefined) {
                    if (isArray(rel.data)) {
                        let relMap = rels[name] = new RecordIdentityMap();
                        rel.data.forEach(r => relMap.add(r));
                    } else {
                        rels[name] = rel.data;
                    }
                }
            });
            this._relationships[record.type].set(record.id, rels);
        }
    }
    replaceRecord(record) {
        this.addRecord(record);
    }
    clearRecord(record) {
        this._relationships[record.type].remove(record.id);
    }
    addToRelatedRecords(record, relationship, relatedRecord) {
        let currentRels = this._relationships[record.type].get(record.id);
        let rels = currentRels ? cloneRelationships(currentRels) : {};
        let rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        rel.add(relatedRecord);
        this._relationships[record.type].set(record.id, rels);
    }
    removeFromRelatedRecords(record, relationship, relatedRecord) {
        let currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship]) {
            let rels = cloneRelationships(currentRels);
            let rel = rels[relationship];
            rel.remove(relatedRecord);
            this._relationships[record.type].set(record.id, rels);
        }
    }
    replaceRelatedRecords(record, relationship, relatedRecords) {
        let currentRels = this._relationships[record.type].get(record.id);
        let rels = currentRels ? cloneRelationships(currentRels) : {};
        let rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        relatedRecords.forEach(relatedRecord => rel.add(relatedRecord));
        this._relationships[record.type].set(record.id, rels);
    }
    replaceRelatedRecord(record, relationship, relatedRecord) {
        let currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship] || relatedRecord) {
            let rels = currentRels ? cloneRelationships(currentRels) : {};
            rels[relationship] = relatedRecord;
            this._relationships[record.type].set(record.id, rels);
        }
    }
}
function cloneRelationships(rels) {
    const clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(name => {
            let value = rels[name];
            if (value instanceof RecordIdentityMap) {
                clonedRels[name] = new RecordIdentityMap(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}