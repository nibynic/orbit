import { isArray, clone, deepGet } from '@orbit/utils';
import { cloneRecordIdentity } from '@orbit/data';
import { ImmutableMap } from '@orbit/immutable';
export default class InverseRelationshipAccessor {
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
    all(record) {
        return this._relationships[record.type].get(record.id) || [];
    }
    recordAdded(record) {
        const relationships = record.relationships;
        const recordIdentity = cloneRecordIdentity(record);
        if (relationships) {
            Object.keys(relationships).forEach(relationship => {
                const relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (isArray(relationshipData)) {
                        const relatedRecords = relationshipData;
                        relatedRecords.forEach(relatedRecord => {
                            this.add(relatedRecord, { record: recordIdentity, relationship });
                        });
                    } else {
                        const relatedRecord = relationshipData;
                        this.add(relatedRecord, { record: recordIdentity, relationship });
                    }
                }
            });
        }
    }
    recordRemoved(record) {
        const recordInCache = this._cache.records(record.type).get(record.id);
        const relationships = recordInCache && recordInCache.relationships;
        if (relationships) {
            Object.keys(relationships).forEach(relationship => {
                const relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (isArray(relationshipData)) {
                        const relatedRecords = relationshipData;
                        relatedRecords.forEach(relatedRecord => {
                            this.remove(relatedRecord, { record, relationship });
                        });
                    } else {
                        const relatedRecord = relationshipData;
                        this.remove(relatedRecord, { record, relationship });
                    }
                }
            });
        }
        this._relationships[record.type].remove(record.id);
    }
    relatedRecordAdded(record, relationship, relatedRecord) {
        if (relatedRecord) {
            const relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                const recordIdentity = cloneRecordIdentity(record);
                this.add(relatedRecord, { record: recordIdentity, relationship });
            }
        }
    }
    relatedRecordsAdded(record, relationship, relatedRecords) {
        if (relatedRecords && relatedRecords.length > 0) {
            const relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                const recordIdentity = cloneRecordIdentity(record);
                relatedRecords.forEach(relatedRecord => {
                    this.add(relatedRecord, { record: recordIdentity, relationship });
                });
            }
        }
    }
    relatedRecordRemoved(record, relationship, relatedRecord) {
        const relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecord === undefined) {
                const currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                this.remove(relatedRecord, { record, relationship });
            }
        }
    }
    relatedRecordsRemoved(record, relationship, relatedRecords) {
        const relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecords === undefined) {
                const currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecords = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecords) {
                relatedRecords.forEach(relatedRecord => this.remove(relatedRecord, { record, relationship }));
            }
        }
    }
    add(record, inverseRelationship) {
        let rels = this._relationships[record.type].get(record.id);
        rels = rels ? clone(rels) : [];
        rels.push(inverseRelationship);
        this._relationships[record.type].set(record.id, rels);
    }
    remove(record, inverseRelationship) {
        let rels = this._relationships[record.type].get(record.id);
        if (rels) {
            let newRels = rels.filter(r => !(r.record.type === inverseRelationship.record.type && r.record.id === inverseRelationship.record.id && r.relationship === inverseRelationship.relationship));
            this._relationships[record.type].set(record.id, newRels);
        }
    }
}