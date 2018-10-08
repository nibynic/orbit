function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { isArray, clone, deepGet } from '@orbit/utils';
import { cloneRecordIdentity } from '@orbit/data';
import { ImmutableMap } from '@orbit/immutable';

var InverseRelationshipAccessor = function () {
    function InverseRelationshipAccessor(cache, base) {
        _classCallCheck(this, InverseRelationshipAccessor);

        this._cache = cache;
        this.reset(base);
    }

    InverseRelationshipAccessor.prototype.reset = function reset(base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    InverseRelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new ImmutableMap();
            }
        });
    };

    InverseRelationshipAccessor.prototype.all = function all(record) {
        return this._relationships[record.type].get(record.id) || [];
    };

    InverseRelationshipAccessor.prototype.recordAdded = function recordAdded(record) {
        var _this2 = this;

        var relationships = record.relationships;
        var recordIdentity = cloneRecordIdentity(record);
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this2.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this2.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                    }
                }
            });
        }
    };

    InverseRelationshipAccessor.prototype.recordRemoved = function recordRemoved(record) {
        var _this3 = this;

        var recordInCache = this._cache.records(record.type).get(record.id);
        var relationships = recordInCache && recordInCache.relationships;
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this3.remove(relatedRecord, { record: record, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this3.remove(relatedRecord, { record: record, relationship: relationship });
                    }
                }
            });
        }
        this._relationships[record.type].remove(record.id);
    };

    InverseRelationshipAccessor.prototype.relatedRecordAdded = function relatedRecordAdded(record, relationship, relatedRecord) {
        if (relatedRecord) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = cloneRecordIdentity(record);
                this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordsAdded = function relatedRecordsAdded(record, relationship, relatedRecords) {
        var _this4 = this;

        if (relatedRecords && relatedRecords.length > 0) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = cloneRecordIdentity(record);
                relatedRecords.forEach(function (relatedRecord) {
                    _this4.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordRemoved = function relatedRecordRemoved(record, relationship, relatedRecord) {
        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecord === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                this.remove(relatedRecord, { record: record, relationship: relationship });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordsRemoved = function relatedRecordsRemoved(record, relationship, relatedRecords) {
        var _this5 = this;

        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecords === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecords = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return _this5.remove(relatedRecord, { record: record, relationship: relationship });
                });
            }
        }
    };

    InverseRelationshipAccessor.prototype.add = function add(record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        rels = rels ? clone(rels) : [];
        rels.push(inverseRelationship);
        this._relationships[record.type].set(record.id, rels);
    };

    InverseRelationshipAccessor.prototype.remove = function remove(record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var newRels = rels.filter(function (r) {
                return !(r.record.type === inverseRelationship.record.type && r.record.id === inverseRelationship.record.id && r.relationship === inverseRelationship.relationship);
            });
            this._relationships[record.type].set(record.id, newRels);
        }
    };

    return InverseRelationshipAccessor;
}();

export default InverseRelationshipAccessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIl0sIm5hbWVzIjpbImlzQXJyYXkiLCJjbG9uZSIsImRlZXBHZXQiLCJjbG9uZVJlY29yZElkZW50aXR5IiwiSW1tdXRhYmxlTWFwIiwiSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIiwiY2FjaGUiLCJiYXNlIiwiX2NhY2hlIiwicmVzZXQiLCJyZWxhdGlvbnNoaXBzIiwiT2JqZWN0Iiwia2V5cyIsInNjaGVtYSIsIm1vZGVscyIsImZvckVhY2giLCJiYXNlUmVsYXRpb25zaGlwcyIsIl9yZWxhdGlvbnNoaXBzIiwidHlwZSIsInVwZ3JhZGUiLCJhbGwiLCJyZWNvcmQiLCJnZXQiLCJpZCIsInJlY29yZEFkZGVkIiwicmVjb3JkSWRlbnRpdHkiLCJyZWxhdGlvbnNoaXBEYXRhIiwicmVsYXRpb25zaGlwIiwiZGF0YSIsInJlbGF0ZWRSZWNvcmRzIiwiYWRkIiwicmVsYXRlZFJlY29yZCIsInJlY29yZFJlbW92ZWQiLCJyZWNvcmRJbkNhY2hlIiwicmVjb3JkcyIsInJlbW92ZSIsInJlbGF0ZWRSZWNvcmRBZGRlZCIsInJlbGF0aW9uc2hpcERlZiIsImdldE1vZGVsIiwiaW52ZXJzZSIsInJlbGF0ZWRSZWNvcmRzQWRkZWQiLCJsZW5ndGgiLCJyZWxhdGVkUmVjb3JkUmVtb3ZlZCIsInVuZGVmaW5lZCIsImN1cnJlbnRSZWNvcmQiLCJyZWxhdGVkUmVjb3Jkc1JlbW92ZWQiLCJpbnZlcnNlUmVsYXRpb25zaGlwIiwicmVscyIsInB1c2giLCJzZXQiLCJuZXdSZWxzIiwiZmlsdGVyIiwiciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxPQUFULEVBQWtCQyxLQUFsQixFQUF5QkMsT0FBekIsUUFBd0MsY0FBeEM7QUFDQSxTQUFTQyxtQkFBVCxRQUFvQyxhQUFwQztBQUNBLFNBQVNDLFlBQVQsUUFBNkIsa0JBQTdCOztJQUNxQkMsMkI7QUFDakIseUNBQVlDLEtBQVosRUFBbUJDLElB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LG9CQUFvQm5CLFlBQS9JLENBQUw7QUFBQSxhQUFaLENBQWQ7QUFDQSxpQkFBS1YsY0FBTCxDQUFvQkksT0FBT0gsSUFBM0IsRUFBaUMrQixHQUFqQyxDQUFxQzVCLE9BQU9FLEVBQTVDLEVBQWdEMkIsT0FBaEQ7QUFDSDtBQUNKLEs7Ozs7O2VBeEhnQjdDLDJCIiwiZmlsZSI6ImNhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSwgY2xvbmUsIGRlZXBHZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgY2xvbmVSZWNvcmRJZGVudGl0eSB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW52ZXJzZVJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcihjYWNoZSwgYmFzZSkge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xuICAgICAgICB0aGlzLnJlc2V0KGJhc2UpO1xuICAgIH1cbiAgICByZXNldChiYXNlKSB7XG4gICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBsZXQgYmFzZVJlbGF0aW9uc2hpcHMgPSBiYXNlICYmIGJhc2UuX3JlbGF0aW9uc2hpcHNbdHlwZV07XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcChiYXNlUmVsYXRpb25zaGlwcyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcztcbiAgICB9XG4gICAgdXBncmFkZSgpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhbGwocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKSB8fCBbXTtcbiAgICB9XG4gICAgcmVjb3JkQWRkZWQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlY29yZFJlbW92ZWQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZEluQ2FjaGUgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZEluQ2FjaGUgJiYgcmVjb3JkSW5DYWNoZS5yZWxhdGlvbnNoaXBzO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZCA9IHJlbGF0aW9uc2hpcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0ucmVtb3ZlKHJlY29yZC5pZCk7XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc0FkZGVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMgJiYgcmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChyZWxhdGVkUmVjb3JkLCB7IHJlY29yZDogcmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3JkUmVtb3ZlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkUmVjb3Jkc1JlbW92ZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICByZWxzID0gcmVscyA/IGNsb25lKHJlbHMpIDogW107XG4gICAgICAgIHJlbHMucHVzaChpbnZlcnNlUmVsYXRpb25zaGlwKTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XG4gICAgfVxuICAgIHJlbW92ZShyZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKHJlbHMpIHtcbiAgICAgICAgICAgIGxldCBuZXdSZWxzID0gcmVscy5maWx0ZXIociA9PiAhKHIucmVjb3JkLnR5cGUgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLnR5cGUgJiYgci5yZWNvcmQuaWQgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVjb3JkLmlkICYmIHIucmVsYXRpb25zaGlwID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlbGF0aW9uc2hpcCkpO1xuICAgICAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgbmV3UmVscyk7XG4gICAgICAgIH1cbiAgICB9XG59Il19