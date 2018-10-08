function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { isArray } from '@orbit/utils';
import { equalRecordIdentities } from '@orbit/data';
import { ImmutableMap } from '@orbit/immutable';
import RecordIdentityMap from './record-identity-map';

var RelationshipAccessor = function () {
    function RelationshipAccessor(cache, base) {
        _classCallCheck(this, RelationshipAccessor);

        this._cache = cache;
        this.reset(base);
    }

    RelationshipAccessor.prototype.reset = function reset(base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    RelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new ImmutableMap();
            }
        });
    };

    RelationshipAccessor.prototype.relationshipExists = function relationshipExists(record, relationship, relatedRecord) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var rel = rels[relationship];
            if (rel) {
                if (rel instanceof RecordIdentityMap) {
                    return rel.has(relatedRecord);
                } else {
                    return equalRecordIdentities(relatedRecord, rel);
                }
            }
        }
        return !relatedRecord;
    };

    RelationshipAccessor.prototype.relatedRecord = function relatedRecord(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };

    RelationshipAccessor.prototype.relatedRecords = function relatedRecords(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        var map = rels && rels[relationship];
        if (map) {
            return Array.from(map.values);
        }
    };

    RelationshipAccessor.prototype.relatedRecordsMap = function relatedRecordsMap(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };

    RelationshipAccessor.prototype.relatedRecordsMatch = function relatedRecordsMatch(record, relationship, relatedRecords) {
        var map = this.relatedRecordsMap(record, relationship);
        if (map) {
            var otherMap = new RecordIdentityMap();
            relatedRecords.forEach(function (id) {
                return otherMap.add(id);
            });
            return map.equals(otherMap);
        } else {
            return relatedRecords.length === 0;
        }
    };

    RelationshipAccessor.prototype.addRecord = function addRecord(record) {
        if (record.relationships) {
            var rels = {};
            Object.keys(record.relationships).forEach(function (name) {
                var rel = record.relationships[name];
                if (rel.data !== undefined) {
                    if (isArray(rel.data)) {
                        var relMap = rels[name] = new RecordIdentityMap();
                        rel.data.forEach(function (r) {
                            return relMap.add(r);
                        });
                    } else {
                        rels[name] = rel.data;
                    }
                }
            });
            this._relationships[record.type].set(record.id, rels);
        }
    };

    RelationshipAccessor.prototype.replaceRecord = function replaceRecord(record) {
        this.addRecord(record);
    };

    RelationshipAccessor.prototype.clearRecord = function clearRecord(record) {
        this._relationships[record.type].remove(record.id);
    };

    RelationshipAccessor.prototype.addToRelatedRecords = function addToRelatedRecords(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        rel.add(relatedRecord);
        this._relationships[record.type].set(record.id, rels);
    };

    RelationshipAccessor.prototype.removeFromRelatedRecords = function removeFromRelatedRecords(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship]) {
            var rels = cloneRelationships(currentRels);
            var rel = rels[relationship];
            rel.remove(relatedRecord);
            this._relationships[record.type].set(record.id, rels);
        }
    };

    RelationshipAccessor.prototype.replaceRelatedRecords = function replaceRelatedRecords(record, relationship, relatedRecords) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        relatedRecords.forEach(function (relatedRecord) {
            return rel.add(relatedRecord);
        });
        this._relationships[record.type].set(record.id, rels);
    };

    RelationshipAccessor.prototype.replaceRelatedRecord = function replaceRelatedRecord(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship] || relatedRecord) {
            var rels = currentRels ? cloneRelationships(currentRels) : {};
            rels[relationship] = relatedRecord;
            this._relationships[record.type].set(record.id, rels);
        }
    };

    return RelationshipAccessor;
}();

export default RelationshipAccessor;

function cloneRelationships(rels) {
    var clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(function (name) {
            var value = rels[name];
            if (value instanceof RecordIdentityMap) {
                clonedRels[name] = new RecordIdentityMap(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvci5qcyJdLCJuYW1lcyI6WyJpc0FycmF5IiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIiwiSW1tdXRhYmxlTWFwIiwiUmVjb3JkSWRlbnRpdHlNYXAiLCJSZWxhdGlvbnNoaXBBY2Nlc3NvciIsImNhY2hlIiwiYmFzZSIsIl9jYWNoZSIsInJlc2V0IiwicmVsYXRpb25zaGlwcyIsIk9iamVjdCIsImtleXMiLCJzY2hlbWEiLCJtb2RlbHMiLCJmb3JFYWNoIiwiYmFzZVJlbGF0aW9uc2hpcHMiLCJfcmVsYXRpb25zaGlwcyIsInR5cGUiLCJ1cGdyYWRlIiwicmVsYXRpb25zaGlwRXhpc3RzIiwicmVjb3JkIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCIsInJlbHMiLCJnZXQiLCJpZCIsInJlbCIsImhhcyIsInJlbGF0ZWRSZWNvcmRzIiwibWFwIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwicmVsYXRlZFJlY29yZHNNYXAiLCJyZWxhdGVkUmVjb3Jkc01hdGNoIiwib3RoZXJNYXAiLCJhZGQiLCJlcXVhbHMiLCJsZW5ndGgiLCJhZGRSZWNvcmQiLCJuYW1lIiwiZGF0YSIsInVuZGVmaW5lZCIsInJlbE1hcCIsInIiLCJzZXQiLCJyZXBsYWNlUmVjb3JkIiwiY2xlYXJSZWNvcmQiLCJyZW1vdmUiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwiY3VycmVudFJlbHMiLCJjbG9uZVJlbGF0aW9uc2hpcHMiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCIsImNsb25lZFJlbHMiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxPQUFULFFBQXdCLGNBQXhCO0FBQ0EsU0FBU0MscUJBQVQsUUFBc0MsYUFBdEM7QUFDQSxTQUFTQyxZQUFULFFBQTZCLGtCQUE3QjtBQUNBLE9BQU9DLGlCQUFQLE1BQThCLHVCQUE5Qjs7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aUIsSUFBTCxDQUFaO0FBQ0EsZ0JBQUlnQixpQkFBaUJyRCxpQkFBckIsRUFBd0M7QUFDcENvRCwyQkFBV2YsSUFBWCxJQUFtQixJQUFJckMsaUJBQUosQ0FBc0JxRCxLQUF0QixDQUFuQjtBQUNILGFBRkQsTUFFTztBQUNIRCwyQkFBV2YsSUFBWCxJQUFtQmdCLEtBQW5CO0FBQ0g7QUFDSixTQVBEO0FBUUg7QUFDRCxXQUFPRCxVQUFQO0FBQ0giLCJmaWxlIjoiY2FjaGUvcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcbmltcG9ydCBSZWNvcmRJZGVudGl0eU1hcCBmcm9tICcuL3JlY29yZC1pZGVudGl0eS1tYXAnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKGNhY2hlLCBiYXNlKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XG4gICAgICAgIHRoaXMucmVzZXQoYmFzZSk7XG4gICAgfVxuICAgIHJlc2V0KGJhc2UpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGxldCBiYXNlUmVsYXRpb25zaGlwcyA9IGJhc2UgJiYgYmFzZS5fcmVsYXRpb25zaGlwc1t0eXBlXTtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAocmVscykge1xuICAgICAgICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgIGlmIChyZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVsIGluc3RhbmNlb2YgUmVjb3JkSWRlbnRpdHlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbC5oYXMocmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGVkUmVjb3JkLCByZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXJlbGF0ZWRSZWNvcmQ7XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKHJlbHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgbGV0IG1hcCA9IHJlbHMgJiYgcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShtYXAudmFsdWVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc01hcChyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAocmVscykge1xuICAgICAgICAgICAgcmV0dXJuIHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc01hdGNoKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5yZWxhdGVkUmVjb3Jkc01hcChyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XG4gICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgIGxldCBvdGhlck1hcCA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChpZCA9PiBvdGhlck1hcC5hZGQoaWQpKTtcbiAgICAgICAgICAgIHJldHVybiBtYXAuZXF1YWxzKG90aGVyTWFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPT09IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBpZiAocmVjb3JkLnJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbHMgPSB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZC5yZWxhdGlvbnNoaXBzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWwgPSByZWNvcmQucmVsYXRpb25zaGlwc1tuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAocmVsLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyZWwuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWxNYXAgPSByZWxzW25hbWVdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWwuZGF0YS5mb3JFYWNoKHIgPT4gcmVsTWFwLmFkZChyKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxzW25hbWVdID0gcmVsLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcGxhY2VSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuYWRkUmVjb3JkKHJlY29yZCk7XG4gICAgfVxuICAgIGNsZWFyUmVjb3JkKHJlY29yZCkge1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5yZW1vdmUocmVjb3JkLmlkKTtcbiAgICB9XG4gICAgYWRkVG9SZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgY3VycmVudFJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgbGV0IHJlbHMgPSBjdXJyZW50UmVscyA/IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscykgOiB7fTtcbiAgICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgaWYgKCFyZWwpIHtcbiAgICAgICAgICAgIHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbC5hZGQocmVsYXRlZFJlY29yZCk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgIH1cbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGlmIChjdXJyZW50UmVscyAmJiBjdXJyZW50UmVsc1tyZWxhdGlvbnNoaXBdKSB7XG4gICAgICAgICAgICBsZXQgcmVscyA9IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscyk7XG4gICAgICAgICAgICBsZXQgcmVsID0gcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgcmVsLnJlbW92ZShyZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGxldCByZWxzID0gY3VycmVudFJlbHMgPyBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpIDoge307XG4gICAgICAgIGxldCByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGlmICghcmVsKSB7XG4gICAgICAgICAgICByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF0gPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gcmVsLmFkZChyZWxhdGVkUmVjb3JkKSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgIH1cbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBsZXQgY3VycmVudFJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSZWxzICYmIGN1cnJlbnRSZWxzW3JlbGF0aW9uc2hpcF0gfHwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgbGV0IHJlbHMgPSBjdXJyZW50UmVscyA/IGNsb25lUmVsYXRpb25zaGlwcyhjdXJyZW50UmVscykgOiB7fTtcbiAgICAgICAgICAgIHJlbHNbcmVsYXRpb25zaGlwXSA9IHJlbGF0ZWRSZWNvcmQ7XG4gICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGNsb25lUmVsYXRpb25zaGlwcyhyZWxzKSB7XG4gICAgY29uc3QgY2xvbmVkUmVscyA9IHt9O1xuICAgIGlmIChyZWxzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHJlbHMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSByZWxzW25hbWVdO1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVjb3JkSWRlbnRpdHlNYXApIHtcbiAgICAgICAgICAgICAgICBjbG9uZWRSZWxzW25hbWVdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvbmVkUmVsc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lZFJlbHM7XG59Il19