'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _immutable = require('@orbit/immutable');

class InverseRelationshipAccessor {
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
    all(record) {
        return this._relationships[record.type].get(record.id) || [];
    }
    recordAdded(record) {
        const relationships = record.relationships;
        const recordIdentity = (0, _data.cloneRecordIdentity)(record);
        if (relationships) {
            Object.keys(relationships).forEach(relationship => {
                const relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if ((0, _utils.isArray)(relationshipData)) {
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
                    if ((0, _utils.isArray)(relationshipData)) {
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
                const recordIdentity = (0, _data.cloneRecordIdentity)(record);
                this.add(relatedRecord, { record: recordIdentity, relationship });
            }
        }
    }
    relatedRecordsAdded(record, relationship, relatedRecords) {
        if (relatedRecords && relatedRecords.length > 0) {
            const relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                const recordIdentity = (0, _data.cloneRecordIdentity)(record);
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
                relatedRecord = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
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
                relatedRecords = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecords) {
                relatedRecords.forEach(relatedRecord => this.remove(relatedRecord, { record, relationship }));
            }
        }
    }
    add(record, inverseRelationship) {
        let rels = this._relationships[record.type].get(record.id);
        rels = rels ? (0, _utils.clone)(rels) : [];
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
exports.default = InverseRelationshipAccessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIl0sIm5hbWVzIjpbIkludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciIsImNvbnN0cnVjdG9yIiwiY2FjaGUiLCJiYXNlIiwiX2NhY2hlIiwicmVzZXQiLCJyZWxhdGlvbnNoaXBzIiwiT2JqZWN0Iiwia2V5cyIsInNjaGVtYSIsIm1vZGVscyIsImZvckVhY2giLCJ0eXBlIiwiYmFzZVJlbGF0aW9uc2hpcHMiLCJfcmVsYXRpb25zaGlwcyIsIkltbXV0YWJsZU1hcCIsInVwZ3JhZGUiLCJhbGwiLCJyZWNvcmQiLCJnZXQiLCJpZCIsInJlY29yZEFkZGVkIiwicmVjb3JkSWRlbnRpdHkiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGlvbnNoaXBEYXRhIiwiZGF0YSIsInJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZCIsImFkZCIsInJlY29yZFJlbW92ZWQiLCJyZWNvcmRJbkNhY2hlIiwicmVjb3JkcyIsInJlbW92ZSIsInJlbGF0ZWRSZWNvcmRBZGRlZCIsInJlbGF0aW9uc2hpcERlZiIsImdldE1vZGVsIiwiaW52ZXJzZSIsInJlbGF0ZWRSZWNvcmRzQWRkZWQiLCJsZW5ndGgiLCJyZWxhdGVkUmVjb3JkUmVtb3ZlZCIsInVuZGVmaW5lZCIsImN1cnJlbnRSZWNvcmQiLCJyZWxhdGVkUmVjb3Jkc1JlbW92ZWQiLCJpbnZlcnNlUmVsYXRpb25zaGlwIiwicmVscyIsInB1c2giLCJzZXQiLCJuZXdSZWxzIiwiZmlsdGVyIiwiciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ2UsTUFBTUEsMkJBQU4sQ0FBa0M7QUFDN0NDLGdCQUFZQyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUNyQixhQUFLQyxNQUFMLEdBQWNGLEtBQWQ7QUFDQSxhQUFLRyxLQUFMLENBQVdGLElBQVg7QUFDSDtBQUNERSxVQUFNRixJQUFOLEVBQVk7QUFDUixZQUFJRyxnQkFBZ0IsRUFB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YWNjZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0FycmF5LCBjbG9uZSwgZGVlcEdldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5IH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3Ige1xuICAgIGNvbnN0cnVjdG9yKGNhY2hlLCBiYXNlKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XG4gICAgICAgIHRoaXMucmVzZXQoYmFzZSk7XG4gICAgfVxuICAgIHJlc2V0KGJhc2UpIHtcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGxldCBiYXNlUmVsYXRpb25zaGlwcyA9IGJhc2UgJiYgYmFzZS5fcmVsYXRpb25zaGlwc1t0eXBlXTtcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWxhdGlvbnNoaXBzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFsbChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpIHx8IFtdO1xuICAgIH1cbiAgICByZWNvcmRBZGRlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZC5yZWxhdGlvbnNoaXBzO1xuICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVjb3JkUmVtb3ZlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkSW5DYWNoZSA9IHRoaXMuX2NhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkSW5DYWNoZSAmJiByZWNvcmRJbkNhY2hlLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShyZWxhdGlvbnNoaXBEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWxhdGlvbnNoaXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkID0gcmVsYXRpb25zaGlwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5yZW1vdmUocmVjb3JkLmlkKTtcbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZEFkZGVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmRzQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3JkcyAmJiByZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkOiByZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmRSZW1vdmVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZCA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmRzUmVtb3ZlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB0aGlzLnJlbW92ZShyZWxhdGVkUmVjb3JkLCB7IHJlY29yZCwgcmVsYXRpb25zaGlwIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQocmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIHJlbHMgPSByZWxzID8gY2xvbmUocmVscykgOiBbXTtcbiAgICAgICAgcmVscy5wdXNoKGludmVyc2VSZWxhdGlvbnNoaXApO1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICB9XG4gICAgcmVtb3ZlKHJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICBsZXQgcmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAocmVscykge1xuICAgICAgICAgICAgbGV0IG5ld1JlbHMgPSByZWxzLmZpbHRlcihyID0+ICEoci5yZWNvcmQudHlwZSA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQudHlwZSAmJiByLnJlY29yZC5pZCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWNvcmQuaWQgJiYgci5yZWxhdGlvbnNoaXAgPT09IGludmVyc2VSZWxhdGlvbnNoaXAucmVsYXRpb25zaGlwKSk7XG4gICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCBuZXdSZWxzKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=