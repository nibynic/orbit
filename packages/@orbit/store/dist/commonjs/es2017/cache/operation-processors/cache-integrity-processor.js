'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require('@orbit/data');

var _operationProcessor = require('./operation-processor');

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
class CacheIntegrityProcessor extends _operationProcessor.OperationProcessor {
    after(operation) {
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
                let ops = this.clearInverseRelationshipOps(operation.record);
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return ops;
            case 'replaceRecord':
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return [];
            default:
                return [];
        }
    }
    immediate(operation) {
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
    }
    finally(operation) {
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
    }
    clearInverseRelationshipOps(record) {
        const ops = [];
        const inverseRels = this.cache.inverseRelationships.all(record);
        if (inverseRels.length > 0) {
            const recordIdentity = (0, _data.cloneRecordIdentity)(record);
            inverseRels.forEach(rel => {
                const relationshipDef = this.cache.schema.getModel(rel.record.type).relationships[rel.relationship];
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
    }
}
exports.default = CacheIntegrityProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IiLCJPcGVyYXRpb25Qcm9jZXNzb3IiLCJhZnRlciIsIm9wZXJhdGlvbiIsIm9wIiwiY2FjaGUiLCJpbnZlcnNlUmVsYXRpb25zaGlwcyIsInJlbGF0ZWRSZWNvcmRSZW1vdmVkIiwicmVjb3JkIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZHNSZW1vdmVkIiwicmVsYXRlZFJlY29yZCIsIm9wcyIsImNsZWFySW52ZXJzZVJlbGF0aW9uc2hpcE9wcyIsInJlY29yZFJlbW92ZWQiLCJpbW1lZGlhdGUiLCJyZWxhdGlvbnNoaXBzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiLCJyZXBsYWNlUmVsYXRlZFJlY29yZHMiLCJyZWxhdGVkUmVjb3JkcyIsImFkZFRvUmVsYXRlZFJlY29yZHMiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJhZGRSZWNvcmQiLCJyZXBsYWNlUmVjb3JkIiwiY2xlYXJSZWNvcmQiLCJmaW5hbGx5IiwicmVsYXRlZFJlY29yZEFkZGVkIiwicmVsYXRlZFJlY29yZHNBZGRlZCIsInJlY29yZEFkZGVkIiwiaW52ZXJzZVJlbHMiLCJhbGwiLCJsZW5ndGgiLCJyZWNvcmRJZGVudGl0eSIsImZvckVhY2giLCJyZWwiLCJyZWxhdGlvbnNoaXBEZWYiLCJzY2hlbWEiLCJnZXRNb2RlbCIsInR5cGUiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBWWUsTUFBTUEsdUJBQU4sU0FBc0NDLHNDQUF0QyxDQUF5RDtBQUNwRUMsVUFBTUMsU0FBTixFQUFpQjtBQUNiLGdCQUFRQSxVQUFVQyxFQUFsQjtBQUNJLGlCQUFLLHNCQUFMO0FBQ0kscUJBQUtDLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NDLG9CQUFoQyxDQUFxREosVUFBVUssTUFBL0QsRUFBdUVMLFVBQVVNLFlBQWpGO0FBQ0EsdUJBQU8sRUFBUDtBQUNKLGlCQUFLLHVCQUFMO0FBQ0kscUJBQUtKLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NJLHFCQUFoQyxDQUFzRFAsVUFBVUssTUFBaEUsRUFBd0VMLFVBQVVNLFlBQWxGO0FBQ0EsdUJBQU8sRUFBUDtBQUNKLGlCQUFLLDBCQUFMO0FBQ0kscUJBQUtKLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NDLG9CQUFoQyxDQUFxREosVUFBVUssTUFBL0QsRUFBdUVMLFVBQVVNLFlBQWpGLEVBQStGTixVQUFVUSxhQUF6RztBQUNBLHVCQUFPLEVBQVA7QUFDSixpQkFBSyxjQUFMO0FBQ0ksb0JBQUlDLE1BQU0sS0FBS0MsMkJBQUwsQ0FBaUNWLFVBQVVLLE1BQTNDLENBQVY7QUFDQSxxQkFBS0gsS0FBTCxDQUFXQyxvQkFBWCxDQUFnQ1EsYUFBaEMsQ0FBOENYLFVBQVVLLE1BQXhEO0FBQ0EsdUJBQU9JLEdBQVA7QUFDSixpQkFBSyxlQUFMO0FBQ0kscUJBQUtQLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NRLGFBQWhDLENBQThDWCxVQUFVSyxNQUF4RDtBQUNBLHVCQUFPLEVBQVA7QUFDSjtBQUNJLHVCQUFPLEVBQVA7QUFsQlI7QUFvQkg7QUFDRE8sY0FBVVosU0FBVixFQUFxQjtBQUNqQixnQkFBUUEsVUFBVUMsRUFBbEI7QUFDSSxpQkFBSyxzQkFBTDtBQUNJLHFCQUFLQyxLQUFMLENBQVdXLGFBQVgsQ0FBeUJDLG9CQUF6QixDQUE4Q2QsVUFBVUssTUFBeEQsRUFBZ0VMLFVBQVVNLFlBQTFFLEVBQXdGTixVQUFVUSxhQUFsRztBQUNBO0FBQ0osaUJBQUssdUJBQUw7QUFDSSxxQkFBS04sS0FBTCxDQUFXVyxhQUFYLENBQXlCRSxxQkFBekIsQ0FBK0NmLFVBQVVLLE1BQXpELEVBQWlFTCxVQUFVTSxZQUEzRSxFQUF5Rk4sVUFBVWdCLGNBQW5HO0FBQ0E7QUFDSixpQkFBSyxxQkFBTDtBQUNJLHFCQUFLZCxLQUFMLENBQVdXLGFBQVgsQ0FBeUJJLG1CQUF6QixDQUE2Q2pCLFVBQVVLLE1BQXZELEVBQStETCxVQUFVTSxZQUF6RSxFQUF1Rk4sVUFBVVEsYUFBakc7QUFDQTtBQUNKLGlCQUFLLDBCQUFMO0FBQ0kscUJBQUtOLEtBQUwsQ0FBV1csYUFBWCxDQUF5Qkssd0JBQXpCLENBQWtEbEIsVUFBVUssTUFBNUQsRUFBb0VMLFVBQVVNLFlBQTlFLEVBQTRGTixVQUFVUSxhQUF0RztBQUNBO0FBQ0osaUJBQUssV0FBTDtBQUNJLHFCQUFLTixLQUFMLENBQVdXLGFBQVgsQ0FBeUJNLFNBQXpCLENBQW1DbkIsVUFBVUssTUFBN0M7QUFDQTtBQUNKLGlCQUFLLGVBQUw7QUFDSSxxQkFBS0gsS0FBTCxDQUFXVyxhQUFYLENBQXlCTyxhQUF6QixDQUF1Q3BCLFVBQVVLLE1BQWpEO0FBQ0E7QUFDSixpQkFBSyxjQUFMO0FBQ0kscUJBQUtILEtBQUwsQ0FBV1csYUFBWCxDQUF5QlEsV0FBekIsQ0FBcUNyQixVQUFVSyxNQUEvQztBQUNBO0FBckJSO0FBdUJIO0FBQ0RpQixZQUFRdEIsU0FBUixFQUFtQjtBQUNmLGdCQUFRQSxVQUFVQyxFQUFsQjtBQUNJLGlCQUFLLHNCQUFMO0FBQ0kscUJBQUtDLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NvQixrQkFBaEMsQ0FBbUR2QixVQUFVSyxNQUE3RCxFQUFxRUwsVUFBVU0sWUFBL0UsRUFBNkZOLFVBQVVRLGFBQXZHO0FBQ0EsdUJBQU8sRUFBUDtBQUNKLGlCQUFLLHVCQUFMO0FBQ0kscUJBQUtOLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NxQixtQkFBaEMsQ0FBb0R4QixVQUFVSyxNQUE5RCxFQUFzRUwsVUFBVU0sWUFBaEYsRUFBOEZOLFVBQVVnQixjQUF4RztBQUNBLHVCQUFPLEVBQVA7QUFDSixpQkFBSyxxQkFBTDtBQUNJLHFCQUFLZCxLQUFMLENBQVdDLG9CQUFYLENBQWdDb0Isa0JBQWhDLENBQW1EdkIsVUFBVUssTUFBN0QsRUFBcUVMLFVBQVVNLFlBQS9FLEVBQTZGTixVQUFVUSxhQUF2RztBQUNBLHVCQUFPLEVBQVA7QUFDSixpQkFBSyxXQUFMO0FBQ0kscUJBQUtOLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0NzQixXQUFoQyxDQUE0Q3pCLFVBQVVLLE1BQXREO0FBQ0EsdUJBQU8sRUFBUDtBQUNKLGlCQUFLLGVBQUw7QUFDSSxxQkFBS0gsS0FBTCxDQUFXQyxvQkFBWCxDQUFnQ3NCLFdBQWhDLENBQTRDekIsVUFBVUssTUFBdEQ7QUFDQSx1QkFBTyxFQUFQO0FBQ0o7QUFDSSx1QkFBTyxFQUFQO0FBakJSO0FBbUJIO0FBQ0RLLGdDQUE0QkwsTUFBNUIsRUFBb0M7QUFDaEMsY0FBTUksTUFBTSxFQUFaO0FBQ0EsY0FBTWlCLGNBQWMsS0FBS3hCLEtBQUwsQ0FBV0Msb0JBQVgsQ0FBZ0N3QixHQUFoQyxDQUFvQ3RCLE1BQXBDLENBQXBCO0FBQ0EsWUFBSXFCLFlBQVlFLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDeEIsa0JBQU1DLGlCQUFpQiwrQkFBb0J4QixNQUFwQixDQUF2QjtBQUNBcUIsd0JBQVlJLE9BQVosQ0FBb0JDLE9BQU87QUFDdkIsc0JBQU1DLGtCQUFrQixLQUFLOUIsS0FBTCxDQUFXK0IsTUFBWCxDQUFrQkMsUUFBbEIsQ0FBMkJILElBQUkxQixNQUFKLENBQVc4QixJQUF0QyxFQUE0Q3RCLGFBQTVDLENBQTBEa0IsSUFBSXpCLFlBQTlELENBQXhCO0FBQ0Esb0JBQUkwQixnQkFBZ0JHLElBQWhCLEtBQXlCLFNBQTdCLEVBQXdDO0FBQ3BDMUIsd0JBQUkyQixJQUFKLENBQVM7QUFDTG5DLDRCQUFJLDBCQURDO0FBRUxJLGdDQUFRMEIsSUFBSTFCLE1BRlA7QUFHTEMsc0NBQWN5QixJQUFJekIsWUFIYjtBQUlMRSx1Q0FBZXFCO0FBSlYscUJBQVQ7QUFNSCxpQkFQRCxNQU9PO0FBQ0hwQix3QkFBSTJCLElBQUosQ0FBUztBQUNMbkMsNEJBQUksc0JBREM7QUFFTEksZ0NBQVEwQixJQUFJMUIsTUFGUDtBQUdMQyxzQ0FBY3lCLElBQUl6QixZQUhiO0FBSUxFLHVDQUFlO0FBSlYscUJBQVQ7QUFNSDtBQUNKLGFBakJEO0FBa0JIO0FBQ0QsZUFBT0MsR0FBUDtBQUNIO0FBOUZtRTtrQkFBbkRaLHVCIiwiZmlsZSI6ImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5IH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgT3BlcmF0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9vcGVyYXRpb24tcHJvY2Vzc29yJztcbi8qKlxuICogQW4gb3BlcmF0aW9uIHByb2Nlc3NvciB0aGF0IGVuc3VyZXMgdGhhdCBhIGNhY2hlJ3MgZGF0YSBpcyBjb25zaXN0ZW50IGFuZFxuICogZG9lc24ndCBjb250YWluIGFueSBkZWFkIHJlZmVyZW5jZXMuXG4gKlxuICogVGhpcyBpcyBhY2hpZXZlZCBieSBtYWludGFpbmluZyBhIG1hcHBpbmcgb2YgcmV2ZXJzZSByZWxhdGlvbnNoaXBzIGZvciBlYWNoXG4gKiByZWNvcmQuIFdoZW4gYSByZWNvcmQgaXMgcmVtb3ZlZCwgYW55IHJlZmVyZW5jZXMgdG8gaXQgY2FuIGFsc28gYmUgaWRlbnRpZmllZFxuICogYW5kIHJlbW92ZWQuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZUludGVncml0eVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XG4gICAgYWZ0ZXIob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICBsZXQgb3BzID0gdGhpcy5jbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHM7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW1tZWRpYXRlKG9wZXJhdGlvbikge1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVsYXRlZFJlY29yZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVwbGFjZVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmFkZFRvUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYWRkUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuYWRkUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLmNsZWFyUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaW5hbGx5KG9wZXJhdGlvbikge1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbi5vcCkge1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdhZGRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCBpbnZlcnNlUmVscyA9IHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMuYWxsKHJlY29yZCk7XG4gICAgICAgIGlmIChpbnZlcnNlUmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIGludmVyc2VSZWxzLmZvckVhY2gocmVsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWwucmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsLnJlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueScpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZWwucmVjb3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOiByZWwucmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZDogcmVjb3JkSWRlbnRpdHlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlbC5yZWNvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHJlbC5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxufSJdfQ==