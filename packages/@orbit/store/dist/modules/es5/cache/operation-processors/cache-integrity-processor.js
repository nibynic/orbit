function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { cloneRecordIdentity } from '@orbit/data';
import { OperationProcessor } from './operation-processor';
/**
 * An operation processor that ensures that a cache's data is consistent and
 * doesn't contain any dead references.
 *
 * This is achieved by maintaining a mapping of reverse relationships for each
 * record. When a record is removed, any references to it can also be identified
 * and removed.
 *
 * @export
 * @class CacheIntegrityProcessor
 * @extends {OperationProcessor}
 */

var CacheIntegrityProcessor = function (_OperationProcessor) {
    _inherits(CacheIntegrityProcessor, _OperationProcessor);

    function CacheIntegrityProcessor() {
        _classCallCheck(this, CacheIntegrityProcessor);

        return _possibleConstructorReturn(this, _OperationProcessor.apply(this, arguments));
    }

    CacheIntegrityProcessor.prototype.after = function after(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsRemoved(operation.record, operation.relationship);
                return [];
            case 'removeFromRelatedRecords':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'removeRecord':
                var ops = this.clearInverseRelationshipOps(operation.record);
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return ops;
            case 'replaceRecord':
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return [];
            default:
                return [];
        }
    };

    CacheIntegrityProcessor.prototype.immediate = function immediate(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.relationships.replaceRelatedRecord(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'replaceRelatedRecords':
                this.cache.relationships.replaceRelatedRecords(operation.record, operation.relationship, operation.relatedRecords);
                return;
            case 'addToRelatedRecords':
                this.cache.relationships.addToRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'removeFromRelatedRecords':
                this.cache.relationships.removeFromRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'addRecord':
                this.cache.relationships.addRecord(operation.record);
                return;
            case 'replaceRecord':
                this.cache.relationships.replaceRecord(operation.record);
                return;
            case 'removeRecord':
                this.cache.relationships.clearRecord(operation.record);
                return;
        }
    };

    CacheIntegrityProcessor.prototype.finally = function _finally(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsAdded(operation.record, operation.relationship, operation.relatedRecords);
                return [];
            case 'addToRelatedRecords':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'addRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            case 'replaceRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            default:
                return [];
        }
    };

    CacheIntegrityProcessor.prototype.clearInverseRelationshipOps = function clearInverseRelationshipOps(record) {
        var _this2 = this;

        var ops = [];
        var inverseRels = this.cache.inverseRelationships.all(record);
        if (inverseRels.length > 0) {
            var recordIdentity = cloneRecordIdentity(record);
            inverseRels.forEach(function (rel) {
                var relationshipDef = _this2.cache.schema.getModel(rel.record.type).relationships[rel.relationship];
                if (relationshipDef.type === 'hasMany') {
                    ops.push({
                        op: 'removeFromRelatedRecords',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: recordIdentity
                    });
                } else {
                    ops.push({
                        op: 'replaceRelatedRecord',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: null
                    });
                }
            });
        }
        return ops;
    };

    return CacheIntegrityProcessor;
}(OperationProcessor);

export default CacheIntegrityProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiY2xvbmVSZWNvcmRJZGVudGl0eSIsIk9wZXJhdGlvblByb2Nlc3NvciIsIkNhY2hlSW50ZWdyaXR5UHJvY2Vzc29yIiwiYWZ0ZXIiLCJvcGVyYXRpb24iLCJvcCIsImNhY2hlIiwiaW52ZXJzZVJlbGF0aW9uc2hpcHMiLCJyZWxhdGVkUmVjb3JkUmVtb3ZlZCIsInJlY29yZCIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmRzUmVtb3ZlZCIsInJlbGF0ZWRSZWNvcmQiLCJvcHMiLCJjbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMiLCJyZWNvcmRSZW1vdmVkIiwiaW1tZWRpYXRlIiwicmVsYXRpb25zaGlwcyIsInJlcGxhY2VSZWxhdGVkUmVjb3JkIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZHMiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwicmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzIiwiYWRkUmVjb3JkIiwicmVwbGFjZVJlY29yZCIsImNsZWFyUmVjb3JkIiwiZmluYWxseSIsInJlbGF0ZWRSZWNvcmRBZGRlZCIsInJlbGF0ZWRSZWNvcmRzQWRkZWQiLCJyZWNvcmRBZGRlZCIsImludmVyc2VSZWxzIiwiYWxsIiwibGVuZ3RoIiwicmVjb3JkSWRlbnRpdHkiLCJmb3JFYWNoIiwicmVsYXRpb25zaGlwRGVmIiwic2NoZW1hIiwiZ2V0TW9kZWwiLCJyZWwiLCJ0eXBlIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxTQUFTQSxtQkFBVCxRQUFvQyxhQUFwQztBQUNBLFNBQVNDLGtCQUFULFFBQW1DLHVCQUFuQztBQUNBOzs7Ozs7Ozs7Ozs7O0lBWXFCQyx1Qjs7Ozs7Ozs7O3NDQUNqQkMsSyxrQkFBTUMsUyxFQUFXO0FBQ2IsZ0JBQVFBLFVBQVVDLEVBQWxCO0FBQ0ksaUJBQUssc0JBQUw7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LGdDQUFRNkIsSUFBSTdCLE1BRlA7QUFHTEMsc0NBQWM0QixJQUFJNUIsWUFIYjtBQUlMRSx1Q0FBZTtBQUpWLHFCQUFUO0FBTUg7QUFDSixhQWpCRDtBQWtCSDtBQUNELGVBQU9DLEdBQVA7QUFDSCxLOzs7RUE5RmdEWixrQjs7ZUFBaENDLHVCIiwiZmlsZSI6ImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5IH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9vcGVyYXRpb24tcHJvY2Vzc29yJztcbi8qKlxuICogQW4gb3BlcmF0aW9uIHByb2Nlc3NvciB0aGF0IGVuc3VyZXMgdGhhdCBhIGNhY2hlJ3MgZGF0YSBpcyBjb25zaXN0ZW50IGFuZFxuICogZG9lc24ndCBjb250YWluIGFueSBkZWFkIHJlZmVyZW5jZXMuXG4gKlxuICogVGhpcyBpcyBhY2hpZXZlZCBieSBtYWludGFpbmluZyBhIG1hcHBpbmcgb2YgcmV2ZXJzZSByZWxhdGlvbnNoaXBzIGZvciBlYWNoXG4gKiByZWNvcmQuIFdoZW4gYSByZWNvcmQgaXMgcmVtb3ZlZCwgYW55IHJlZmVyZW5jZXMgdG8gaXQgY2FuIGFsc28gYmUgaWRlbnRpZmllZFxuICogYW5kIHJlbW92ZWQuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZUludGVncml0eVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XG4gICAgYWZ0ZXIob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICBsZXQgb3BzID0gdGhpcy5jbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHM7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW1tZWRpYXRlKG9wZXJhdGlvbikge1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVwbGFjZVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYWRkUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuYWRkUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmNsZWFyUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaW5hbGx5KG9wZXJhdGlvbikge1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdhZGRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCBpbnZlcnNlUmVscyA9IHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMuYWxsKHJlY29yZCk7XG4gICAgICAgIGlmIChpbnZlcnNlUmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIGludmVyc2VSZWxzLmZvckVhY2gocmVsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWwucmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsLnJlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueScpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWwucmVjb3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiByZWwucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZDogcmVjb3JkSWRlbnRpdHlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlbC5yZWNvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHJlbC5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxufSJdfQ==