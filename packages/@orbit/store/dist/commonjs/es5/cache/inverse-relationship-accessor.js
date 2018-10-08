'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _immutable = require('@orbit/immutable');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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
            relationships[type] = new _immutable.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    InverseRelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new _immutable.ImmutableMap();
            }
        });
    };

    InverseRelationshipAccessor.prototype.all = function all(record) {
        return this._relationships[record.type].get(record.id) || [];
    };

    InverseRelationshipAccessor.prototype.recordAdded = function recordAdded(record) {
        var _this2 = this;

        var relationships = record.relationships;
        var recordIdentity = (0, _data.cloneRecordIdentity)(record);
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if ((0, _utils.isArray)(relationshipData)) {
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
                    if ((0, _utils.isArray)(relationshipData)) {
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
                var recordIdentity = (0, _data.cloneRecordIdentity)(record);
                this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordsAdded = function relatedRecordsAdded(record, relationship, relatedRecords) {
        var _this4 = this;

        if (relatedRecords && relatedRecords.length > 0) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = (0, _data.cloneRecordIdentity)(record);
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
                relatedRecord = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
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
                relatedRecords = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
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
        rels = rels ? (0, _utils.clone)(rels) : [];
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

exports.default = InverseRelationshipAccessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yLmpzIl0sIm5hbWVzIjpbIkludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciIsInJlc2V0IiwiYmFzZSIsInJlbGF0aW9uc2hpcHMiLCJPYmplY3QiLCJiYXNlUmVsYXRpb25zaGlwcyIsInVwZ3JhZGUiLCJhbGwiLCJyZWNvcmQiLCJyZWNvcmRBZGRlZCIsInJlY29yZElkZW50aXR5IiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsInJlbGF0aW9uc2hpcERhdGEiLCJpc0FycmF5IiwicmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwicmVjb3JkUmVtb3ZlZCIsInJlY29yZEluQ2FjaGUiLCJyZWxhdGVkUmVjb3JkQWRkZWQiLCJyZWxhdGlvbnNoaXBEZWYiLCJyZWxhdGVkUmVjb3Jkc0FkZGVkIiwicmVsYXRlZFJlY29yZFJlbW92ZWQiLCJjdXJyZW50UmVjb3JkIiwiZGVlcEdldCIsInJlbGF0ZWRSZWNvcmRzUmVtb3ZlZCIsImFkZCIsImludmVyc2VSZWxhdGlvbnNoaXAiLCJyZWxzIiwiY2xvbmUiLCJyZW1vdmUiLCJuZXdSZWxzIiwiciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0lBQ3FCQSw4QjtBQUNqQixhQUFBLDJCQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsRUFBeUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsMkJBQUE7O0FBQ3JCLGFBQUEsTUFBQSxHQUFBLEtBQUE7QUFDQSxhQUFBLEtBQUEsQ0FBQSxJQUFBO0FBQ0g7OzBDQUNEQyxLLGtCQUFNQyxJLEVBQU07QUFDUixZQUFJQyxnQkFBSixFQUFBO0FBQ0FDLGVBQUFBLElBQUFBLENBQVksS0FBQSxNQUFBLENBQUEsTUFBQSxDQUFaQSxNQUFBQSxFQUFBQSxPQUFBQSxDQUErQyxVQUFBLElBQUEsRUFBUTtBQUNuRCxnQkFBSUMsb0JBQW9CSCxRQUFRQSxLQUFBQSxj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QUFDSDtBQUNKOzs7MENBRUxZLEcsZ0JBQUlsQixNLEVBQVFtQixtQixFQUFxQjtBQUM3QixZQUFJQyxPQUFPLEtBQUEsY0FBQSxDQUFvQnBCLE9BQXBCLElBQUEsRUFBQSxHQUFBLENBQXFDQSxPQUFoRCxFQUFXLENBQVg7QUFDQW9CLGVBQU9BLE9BQU9DLGtCQUFQRCxJQUFPQyxDQUFQRCxHQUFQQSxFQUFBQTtBQUNBQSxhQUFBQSxJQUFBQSxDQUFBQSxtQkFBQUE7QUFDQSxhQUFBLGNBQUEsQ0FBb0JwQixPQUFwQixJQUFBLEVBQUEsR0FBQSxDQUFxQ0EsT0FBckMsRUFBQSxFQUFBLElBQUE7OzswQ0FFSnNCLE0sbUJBQU90QixNLEVBQVFtQixtQixFQUFxQjtBQUNoQyxZQUFJQyxPQUFPLEtBQUEsY0FBQSxDQUFvQnBCLE9BQXBCLElBQUEsRUFBQSxHQUFBLENBQXFDQSxPQUFoRCxFQUFXLENBQVg7QUFDQSxZQUFBLElBQUEsRUFBVTtBQUNOLGdCQUFJdUIsVUFBVSxLQUFBLE1BQUEsQ0FBWSxVQUFBLENBQUEsRUFBQTtBQUFBLHVCQUFLLEVBQUVDLEVBQUFBLE1BQUFBLENBQUFBLElBQUFBLEtBQWtCTCxvQkFBQUEsTUFBQUEsQ0FBbEJLLElBQUFBLElBQXFEQSxFQUFBQSxNQUFBQSxDQUFBQSxFQUFBQSxLQUFnQkwsb0JBQUFBLE1BQUFBLENBQXJFSyxFQUFBQSxJQUFzR0EsRUFBQUEsWUFBQUEsS0FBbUJMLG9CQUFoSSxZQUFLLENBQUw7QUFBMUIsYUFBYyxDQUFkO0FBQ0EsaUJBQUEsY0FBQSxDQUFvQm5CLE9BQXBCLElBQUEsRUFBQSxHQUFBLENBQXFDQSxPQUFyQyxFQUFBLEVBQUEsT0FBQTtBQUNIOzs7Ozs7a0JBdkhZUiwyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzQXJyYXksIGNsb25lLCBkZWVwR2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IGNsb25lUmVjb3JkSWRlbnRpdHkgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBJbW11dGFibGVNYXAgfSBmcm9tICdAb3JiaXQvaW1tdXRhYmxlJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciB7XG4gICAgY29uc3RydWN0b3IoY2FjaGUsIGJhc2UpIHtcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcbiAgICAgICAgdGhpcy5yZXNldChiYXNlKTtcbiAgICB9XG4gICAgcmVzZXQoYmFzZSkge1xuICAgICAgICBsZXQgcmVsYXRpb25zaGlwcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZS5zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgbGV0IGJhc2VSZWxhdGlvbnNoaXBzID0gYmFzZSAmJiBiYXNlLl9yZWxhdGlvbnNoaXBzW3R5cGVdO1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoYmFzZVJlbGF0aW9uc2hpcHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlbGF0aW9uc2hpcHNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWxsKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCkgfHwgW107XG4gICAgfVxuICAgIHJlY29yZEFkZGVkKHJlY29yZCkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gcmVjb3JkLnJlbGF0aW9uc2hpcHM7XG4gICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykuZm9yRWFjaChyZWxhdGlvbnNoaXAgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVsYXRpb25zaGlwRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmRzID0gcmVsYXRpb25zaGlwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWNvcmRSZW1vdmVkKHJlY29yZCkge1xuICAgICAgICBjb25zdCByZWNvcmRJbkNhY2hlID0gdGhpcy5fY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmRJbkNhY2hlICYmIHJlY29yZEluQ2FjaGUucmVsYXRpb25zaGlwcztcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdICYmIHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXS5kYXRhO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHJlbGF0aW9uc2hpcERhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlbGF0aW9uc2hpcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRSZWNvcmQgPSByZWxhdGlvbnNoaXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocmVsYXRlZFJlY29yZCwgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnJlbW92ZShyZWNvcmQuaWQpO1xuICAgIH1cbiAgICByZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHNBZGRlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuX2NhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQocmVsYXRlZFJlY29yZCwgeyByZWNvcmQ6IHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5fY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHNSZW1vdmVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLl9jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLl9jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkcyA9IGN1cnJlbnRSZWNvcmQgJiYgZGVlcEdldChjdXJyZW50UmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHRoaXMucmVtb3ZlKHJlbGF0ZWRSZWNvcmQsIHsgcmVjb3JkLCByZWxhdGlvbnNoaXAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChyZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgcmVscyA9IHJlbHMgPyBjbG9uZShyZWxzKSA6IFtdO1xuICAgICAgICByZWxzLnB1c2goaW52ZXJzZVJlbGF0aW9uc2hpcCk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIHJlbHMpO1xuICAgIH1cbiAgICByZW1vdmUocmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGlmIChyZWxzKSB7XG4gICAgICAgICAgICBsZXQgbmV3UmVscyA9IHJlbHMuZmlsdGVyKHIgPT4gIShyLnJlY29yZC50eXBlID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC50eXBlICYmIHIucmVjb3JkLmlkID09PSBpbnZlcnNlUmVsYXRpb25zaGlwLnJlY29yZC5pZCAmJiByLnJlbGF0aW9uc2hpcCA9PT0gaW52ZXJzZVJlbGF0aW9uc2hpcC5yZWxhdGlvbnNoaXApKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLnNldChyZWNvcmQuaWQsIG5ld1JlbHMpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==