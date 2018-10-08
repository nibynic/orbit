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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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
            relationships[type] = new _immutable.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    RelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new _immutable.ImmutableMap();
            }
        });
    };

    RelationshipAccessor.prototype.relationshipExists = function relationshipExists(record, relationship, relatedRecord) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var rel = rels[relationship];
            if (rel) {
                if (rel instanceof _recordIdentityMap2.default) {
                    return rel.has(relatedRecord);
                } else {
                    return (0, _data.equalRecordIdentities)(relatedRecord, rel);
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
            var otherMap = new _recordIdentityMap2.default();
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
                    if ((0, _utils.isArray)(rel.data)) {
                        var relMap = rels[name] = new _recordIdentityMap2.default();
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
            rel = rels[relationship] = new _recordIdentityMap2.default();
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
            rel = rels[relationship] = new _recordIdentityMap2.default();
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

exports.default = RelationshipAccessor;


function cloneRelationships(rels) {
    var clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(function (name) {
            var value = rels[name];
            if (value instanceof _recordIdentityMap2.default) {
                clonedRels[name] = new _recordIdentityMap2.default(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3JlbGF0aW9uc2hpcC1hY2Nlc3Nvci5qcyJdLCJuYW1lcyI6WyJSZWxhdGlvbnNoaXBBY2Nlc3NvciIsInJlc2V0IiwiYmFzZSIsInJlbGF0aW9uc2hpcHMiLCJPYmplY3QiLCJiYXNlUmVsYXRpb25zaGlwcyIsInVwZ3JhZGUiLCJyZWxhdGlvbnNoaXBFeGlzdHMiLCJyZWNvcmQiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwicmVscyIsInJlbCIsImVxdWFsUmVjb3JkSWRlbnRpdGllcyIsInJlbGF0ZWRSZWNvcmRzIiwibWFwIiwiQXJyYXkiLCJyZWxhdGVkUmVjb3Jkc01hcCIsInJlbGF0ZWRSZWNvcmRzTWF0Y2giLCJvdGhlck1hcCIsImFkZFJlY29yZCIsImlzQXJyYXkiLCJyZWxNYXAiLCJyZXBsYWNlUmVjb3JkIiwiY2xlYXJSZWNvcmQiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwiY3VycmVudFJlbHMiLCJjbG9uZVJlbGF0aW9uc2hpcHMiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCIsImNsb25lZFJlbHMiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsdUI7QUFDakIsYUFBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxJQUFBLEVBQXlCO0FBQUEsd0JBQUEsSUFBQSxFQUFBLG9CQUFBOztBQUNyQixhQUFBLE1BQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxLQUFBLENBQUEsSUFBQTtBQUNIOzttQ0FDREMsSyxrQkFBTUMsSSxFQUFNO0FBQ1IsWUFBSUMsZ0JBQUosRUFBQTtBQUNBQyxlQUFBQSxJQUFBQSxDQUFZLEtBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBWkEsTUFBQUEsRUFBQUEsT0FBQUEsQ0FBK0MsVUFBQSxJQUFBLEVBQVE7QUFDbkQsZ0JBQUlDLG9CQUFvQkgs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ZTtBQUN0RCxZQUFJZ0IsY0FBYyxLQUFBLGNBQUEsQ0FBb0JsQixPQUFwQixJQUFBLEVBQUEsR0FBQSxDQUFxQ0EsT0FBdkQsRUFBa0IsQ0FBbEI7QUFDQSxZQUFJa0IsZUFBZUEsWUFBZkEsWUFBZUEsQ0FBZkEsSUFBSixhQUFBLEVBQStEO0FBQzNELGdCQUFJZixPQUFPZSxjQUFjQyxtQkFBZEQsV0FBY0MsQ0FBZEQsR0FBWCxFQUFBO0FBQ0FmLGlCQUFBQSxZQUFBQSxJQUFBQSxhQUFBQTtBQUNBLGlCQUFBLGNBQUEsQ0FBb0JILE9BQXBCLElBQUEsRUFBQSxHQUFBLENBQXFDQSxPQUFyQyxFQUFBLEVBQUEsSUFBQTtBQUNIOzs7Ozs7a0JBekhZUixvQjs7O0FBNEhyQixTQUFBLGtCQUFBLENBQUEsSUFBQSxFQUFrQztBQUM5QixRQUFNK0IsYUFBTixFQUFBO0FBQ0EsUUFBQSxJQUFBLEVBQVU7QUFDTjNCLGVBQUFBLElBQUFBLENBQUFBLElBQUFBLEVBQUFBLE9BQUFBLENBQTBCLFVBQUEsSUFBQSxFQUFRO0FBQzlCLGdCQUFJNEIsUUFBUXJCLEtBQVosSUFBWUEsQ0FBWjtBQUNBLGdCQUFJcUIsaUJBQUosMkJBQUEsRUFBd0M7QUFDcENELDJCQUFBQSxJQUFBQSxJQUFtQixJQUFBLDJCQUFBLENBQW5CQSxLQUFtQixDQUFuQkE7QUFESixhQUFBLE1BRU87QUFDSEEsMkJBQUFBLElBQUFBLElBQUFBLEtBQUFBO0FBQ0g7QUFOTDNCLFNBQUFBO0FBUUg7QUFDRCxXQUFBLFVBQUE7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgZXF1YWxSZWNvcmRJZGVudGl0aWVzIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XG5pbXBvcnQgUmVjb3JkSWRlbnRpdHlNYXAgZnJvbSAnLi9yZWNvcmQtaWRlbnRpdHktbWFwJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aW9uc2hpcEFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcihjYWNoZSwgYmFzZSkge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IGNhY2hlO1xuICAgICAgICB0aGlzLnJlc2V0KGJhc2UpO1xuICAgIH1cbiAgICByZXNldChiYXNlKSB7XG4gICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlLnNjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBsZXQgYmFzZVJlbGF0aW9uc2hpcHMgPSBiYXNlICYmIGJhc2UuX3JlbGF0aW9uc2hpcHNbdHlwZV07XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcChiYXNlUmVsYXRpb25zaGlwcyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcztcbiAgICB9XG4gICAgdXBncmFkZSgpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUuc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVsYXRpb25zaGlwc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKHJlbHMpIHtcbiAgICAgICAgICAgIGxldCByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICBpZiAocmVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbCBpbnN0YW5jZW9mIFJlY29yZElkZW50aXR5TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWwuaGFzKHJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRlZFJlY29yZCwgcmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFyZWxhdGVkUmVjb3JkO1xuICAgIH1cbiAgICByZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGlmIChyZWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCByZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGxldCBtYXAgPSByZWxzICYmIHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWFwLnZhbHVlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHNNYXAocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IHJlbHMgPSB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgaWYgKHJlbHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZFJlY29yZHNNYXRjaChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgbGV0IG1hcCA9IHRoaXMucmVsYXRlZFJlY29yZHNNYXAocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICBsZXQgb3RoZXJNYXAgPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2goaWQgPT4gb3RoZXJNYXAuYWRkKGlkKSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmVxdWFscyhvdGhlck1hcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubGVuZ3RoID09PSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHJlY29yZC5yZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICBjb25zdCByZWxzID0ge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWNvcmQucmVsYXRpb25zaGlwcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVsID0gcmVjb3JkLnJlbGF0aW9uc2hpcHNbbmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHJlbC5kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVsLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVsTWFwID0gcmVsc1tuYW1lXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsLmRhdGEuZm9yRWFjaChyID0+IHJlbE1hcC5hZGQocikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsc1tuYW1lXSA9IHJlbC5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXBsYWNlUmVjb3JkKHJlY29yZCkge1xuICAgICAgICB0aGlzLmFkZFJlY29yZChyZWNvcmQpO1xuICAgIH1cbiAgICBjbGVhclJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0ucmVtb3ZlKHJlY29yZC5pZCk7XG4gICAgfVxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGxldCByZWxzID0gY3VycmVudFJlbHMgPyBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpIDoge307XG4gICAgICAgIGxldCByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGlmICghcmVsKSB7XG4gICAgICAgICAgICByZWwgPSByZWxzW3JlbGF0aW9uc2hpcF0gPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICByZWwuYWRkKHJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICB9XG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIGxldCBjdXJyZW50UmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBpZiAoY3VycmVudFJlbHMgJiYgY3VycmVudFJlbHNbcmVsYXRpb25zaGlwXSkge1xuICAgICAgICAgICAgbGV0IHJlbHMgPSBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpO1xuICAgICAgICAgICAgbGV0IHJlbCA9IHJlbHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgIHJlbC5yZW1vdmUocmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGxldCBjdXJyZW50UmVscyA9IHRoaXMuX3JlbGF0aW9uc2hpcHNbcmVjb3JkLnR5cGVdLmdldChyZWNvcmQuaWQpO1xuICAgICAgICBsZXQgcmVscyA9IGN1cnJlbnRSZWxzID8gY2xvbmVSZWxhdGlvbnNoaXBzKGN1cnJlbnRSZWxzKSA6IHt9O1xuICAgICAgICBsZXQgcmVsID0gcmVsc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBpZiAoIXJlbCkge1xuICAgICAgICAgICAgcmVsID0gcmVsc1tyZWxhdGlvbnNoaXBdID0gbmV3IFJlY29yZElkZW50aXR5TWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHJlbC5hZGQocmVsYXRlZFJlY29yZCkpO1xuICAgICAgICB0aGlzLl9yZWxhdGlvbnNoaXBzW3JlY29yZC50eXBlXS5zZXQocmVjb3JkLmlkLCByZWxzKTtcbiAgICB9XG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWxzID0gdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGlmIChjdXJyZW50UmVscyAmJiBjdXJyZW50UmVsc1tyZWxhdGlvbnNoaXBdIHx8IHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgICAgIGxldCByZWxzID0gY3VycmVudFJlbHMgPyBjbG9uZVJlbGF0aW9uc2hpcHMoY3VycmVudFJlbHMpIDoge307XG4gICAgICAgICAgICByZWxzW3JlbGF0aW9uc2hpcF0gPSByZWxhdGVkUmVjb3JkO1xuICAgICAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwc1tyZWNvcmQudHlwZV0uc2V0KHJlY29yZC5pZCwgcmVscyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBjbG9uZVJlbGF0aW9uc2hpcHMocmVscykge1xuICAgIGNvbnN0IGNsb25lZFJlbHMgPSB7fTtcbiAgICBpZiAocmVscykge1xuICAgICAgICBPYmplY3Qua2V5cyhyZWxzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVsc1tuYW1lXTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFJlY29yZElkZW50aXR5TWFwKSB7XG4gICAgICAgICAgICAgICAgY2xvbmVkUmVsc1tuYW1lXSA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb25lZFJlbHNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjbG9uZWRSZWxzO1xufSJdfQ==