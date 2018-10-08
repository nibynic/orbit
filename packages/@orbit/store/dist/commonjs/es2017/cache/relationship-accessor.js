'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _immutable = require('@orbit/immutable');

var _recordIdentityMap = require('./record-identity-map');

var _recordIdentityMap2 = _interopRequireDefault(_recordIdentityMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RelationshipAccessor {
    constructor(cache, base) {
        this._cache = cache;
        this.reset(base);
    }
    reset(base) {
        let relationships = {};
        Object.keys(this._cache.schema.models).forEach(type => {
            let baseRelationships = base && base._relationships[type];
            relationships[type] = new _immutable.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    }
    upgrade() {
        Object.keys(this._cache.schema.models).forEach(type => {
            if (!this._relationships[type]) {
                this._relationships[type] = new _immutable.ImmutableMap();
            }
        });
    }
    relationshipExists(record, relationship, relatedRecord) {
        let rels = this._relationships[record.type].get(record.id);
        if (rels) {
            let rel = rels[relationship];
            if (rel) {
                if (rel instanceof _recordIdentityMap2.default) {
                    return rel.has(relatedRecord);
                } else {
                    return (0, _data.equalRecordIdentities)(relatedRecord, rel);
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
            let otherMap = new _recordIdentityMap2.default();
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
                    if ((0, _utils.isArray)(rel.data)) {
                        let relMap = rels[name] = new _recordIdentityMap2.default();
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
            rel = rels[relationship] = new _recordIdentityMap2.default();
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
            rel = rels[relationship] = new _recordIdentityMap2.default();
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
exports.default = RelationshipAccessor;
function cloneRelationships(rels) {
    const clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(name => {
            let value = rels[name];
            if (value instanceof _recordIdentityMap2.default) {
                clonedRels[name] = new _recordIdentityMap2.default(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvci5qcyJdLCJuYW1lcyI6WyJSZWxhdGlvbnNoaXBBY2Nlc3NvciIsImNvbnN0cnVjdG9yIiwiY2FjaGUiLCJiYXNlIiwiX2NhY2hlIiwicmVzZXQiLCJyZWxhdGlvbnNoaXBzIiwiT2JqZWN0Iiwia2V5cyIsInNjaGVtYSIsIm1vZGVscyIsImZvckVhY2giLCJ0eXBlIiwiYmFzZVJlbGF0aW9uc2hpcHMiLCJfcmVsYXRpb25zaGlwcyIsIkltbXV0YWJsZU1hcCIsInVwZ3JhZGUiLCJyZWxhdGlvbnNoaXBFeGlzdHMiLCJyZWNvcmQiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwicmVscyIsImdldCIsImlkIiwicmVsIiwiUmVjb3JkSWRlbnRpdHlNYXAiLCJoYXMiLCJyZWxhdGVkUmVjb3JkcyIsIm1hcCIsIkFycmF5IiwiZnJvbSIsInZhbHVlcyIsInJlbGF0ZWRSZWNvcmRzTWFwIiwicmVsYXRlZFJlY29yZHNNYXRjaCIsIm90aGVyTWFwIiwiYWRkIiwiZXF1YWxzIiwibGVuZ3RoIiwiYWRkUmVjb3JkIiwibmFtZSIsImRhdGEiLCJ1bmRlZmluZWQiLCJyZWxNYXAiLCJyIiwic2V0IiwicmVwbGFjZVJlY29yZCIsImNsZWFyUmVjb3JkIiwicmVtb3ZlIiwiYWRkVG9SZWxhdGVkUmVjb3JkcyIsImN1cnJlbnRSZWxzIiwiY2xvbmVSZWxhdGlvbnNoaXBzIiwicmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiLCJjbG9uZWRSZWxzIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFDZSxNQUFNQSxvQkFBTixDQUEyQjtBQUN0Q0MsZ0JBQVlDLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQ3JCLGFBQUtDLE1BQUwsR0FBY0YsS0FBZDtBQUNBLGFBQUtHLEtBQUws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TUFFTztBQUNIRCwyQkFBV2YsSUFBWCxJQUFtQmdCLEtBQW5CO0FBQ0g7QUFDSixTQVBEO0FBUUg7QUFDRCxXQUFPRCxVQUFQO0FBQ0giLCJmaWxlIjoiY2FjaGUvcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcbmltcG9ydCBSZWNvcmRJZGVudGl0eU1hcCBmcm9tICcuL3JlY29yZC1pZGVudGl0eS1tYXAnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKGNhY2hlLCBiYXNlKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XG4gICAgICAgIHRoaXMucmVzZXQoYmFzZSk7XG4gICAgfVxuICAgIHJlc2V0KGJhc2UpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGxldCBiYXNlUmVsYXRpb25zaGlwcyA9IGJhc2UgJiYgYmFzZS5fcmVsYXRpb25zaGlwc1t0eXBlXTtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAocmVscykge1xuICAgICAgICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgIGlmIChyZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVsIGluc3RhbmNlb2YgUmVjb3JkSWRlbnRpdHlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbC5oYXMocmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGVkUmVjb3JkLCByZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXJlbGF0ZWRSZWNvcmQ7XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKHJlbHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgbGV0IG1hcCA9IHJlbHMgJiYgcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShtYXAudmFsdWVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc01hcChyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAocmVscykge1xuICAgICAgICAgICAgcmV0dXJuIHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc01hdGNoKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5yZWxhdGVkUmVjb3Jkc01hcChyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XG4gICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgIGxldCBvdGhlck1hcCA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChpZCA9PiBvdGhlck1hcC5hZGQoaWQpKTtcbiAgICAgICAgICAgIHJldHVybiBtYXAuZXF1YWxzKG90aGVyTWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPT09IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBpZiAocmVjb3JkLnJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbHMgPSB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZC5yZWxhdGlvbnNoaXBzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWwgPSByZWNvcmQucmVsYXRpb25zaGlwc1tuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAocmVsLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyZWwuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWxNYXAgPSByZWxzW25hbWVdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWwuZGF0YS5mb3JFYWNoKHIgPT4gcmVsTWFwLmFkZChyKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxzW25hbWVdID0gcmVsLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcGxhY2VSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuYWRkUmVjb3JkKHJlY29yZCk7XG4gICAgfVxuICAgIGNsZWFyUmVjb3JkKHJlY29yZCkge1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5yZW1vdmUocmVjb3JkLmlkKTtcbiAgICB9XG4gICAgYWRkVG9SZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgY3VycmVudFJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgbGV0IHJlbHMgPSBjdXJyZW50UmVscyA/IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscykgOiB7fTtcbiAgICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgaWYgKCFyZWwpIHtcbiAgICAgICAgICAgIHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbC5hZGQocmVsYXRlZFJlY29yZCk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgIH1cbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGlmIChjdXJyZW50UmVscyAmJiBjdXJyZW50UmVsc1tyZWxhdGlvbnNoaXBdKSB7XG4gICAgICAgICAgICBsZXQgcmVscyA9IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscyk7XG4gICAgICAgICAgICBsZXQgcmVsID0gcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgcmVsLnJlbW92ZShyZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGxldCByZWxzID0gY3VycmVudFJlbHMgPyBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpIDoge307XG4gICAgICAgIGxldCByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGlmICghcmVsKSB7XG4gICAgICAgICAgICByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF0gPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gcmVsLmFkZChyZWxhdGVkUmVjb3JkKSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgIH1cbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgY3VycmVudFJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSZWxzICYmIGN1cnJlbnRSZWxzW3JlbGF0aW9uc2hpcF0gfHwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgbGV0IHJlbHMgPSBjdXJyZW50UmVscyA/IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscykgOiB7fTtcbiAgICAgICAgICAgIHJlbHNbcmVsYXRpb25zaGlwXSA9IHJlbGF0ZWRSZWNvcmQ7XG4gICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGNsb25lUmVsYXRpb25zaGlwcyhyZWxzKSB7XG4gICAgY29uc3QgY2xvbmVkUmVscyA9IHt9O1xuICAgIGlmIChyZWxzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHJlbHMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSByZWxzW25hbWVdO1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVjb3JkSWRlbnRpdHlNYXApIHtcbiAgICAgICAgICAgICAgICBjbG9uZWRSZWxzW25hbWVdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvbmVkUmVsc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lZFJlbHM7XG59Il19