'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _operationProcessor = require('./operation-processor');

var _recordIdentityMap = require('../record-identity-map');

var _recordIdentityMap2 = _interopRequireDefault(_recordIdentityMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An operation processor that ensures that a cache's data is consistent with
 * its associated schema.
 *
 * This includes maintenance of inverse and dependent relationships.
 *
 * @export
 * @class SchemaConsistencyProcessor
 * @extends {OperationProcessor}
 */
class SchemaConsistencyProcessor extends _operationProcessor.OperationProcessor {
    after(operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            default:
                return [];
        }
    }
    _relatedRecordAdded(record, relationship, relatedRecord) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecord) {
            ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
        }
        return ops;
    }
    _relatedRecordsAdded(record, relationship, relatedRecords) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecords && relatedRecords.length > 0) {
            relatedRecords.forEach(relatedRecord => {
                ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
            });
        }
        return ops;
    }
    _relatedRecordRemoved(record, relationship, relatedRecord) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecord === undefined) {
                const currentRecord = this.cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                ops.push(this._removeRelationshipOp(relatedRecord, inverseRelationship, record));
            }
        }
        return ops;
    }
    _relatedRecordReplaced(record, relationship, relatedRecord) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            let currentRelatedRecord = this.cache.relationships.relatedRecord(record, relationship);
            if (!(0, _data.equalRecordIdentities)(relatedRecord, currentRelatedRecord)) {
                if (currentRelatedRecord) {
                    ops.push(this._removeRelationshipOp(currentRelatedRecord, inverseRelationship, record));
                }
                if (relatedRecord) {
                    ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
                }
            }
        }
        return ops;
    }
    _relatedRecordsRemoved(record, relationship, relatedRecords) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecords === undefined) {
                relatedRecords = this.cache.relationships.relatedRecords(record, relationship);
            }
            if (relatedRecords) {
                relatedRecords.forEach(relatedRecord => ops.push(this._removeRelationshipOp(relatedRecord, inverseRelationship, record)));
            }
        }
        return ops;
    }
    _relatedRecordsReplaced(record, relationship, relatedRecords) {
        const ops = [];
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const currentRelatedRecordsMap = this.cache.relationships.relatedRecordsMap(record, relationship);
        let addedRecords;
        if (currentRelatedRecordsMap) {
            const relatedRecordsMap = new _recordIdentityMap2.default();
            relatedRecords.forEach(r => relatedRecordsMap.add(r));
            let removedRecords = currentRelatedRecordsMap.exclusiveOf(relatedRecordsMap);
            Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(record, relationshipDef, removedRecords));
            addedRecords = relatedRecordsMap.exclusiveOf(currentRelatedRecordsMap);
        } else {
            addedRecords = relatedRecords;
        }
        Array.prototype.push.apply(ops, this._addRelatedRecordsOps(record, relationshipDef, addedRecords));
        return ops;
    }
    _recordAdded(record) {
        const ops = [];
        const relationships = record.relationships;
        if (relationships) {
            const modelDef = this.cache.schema.getModel(record.type);
            const recordIdentity = (0, _data.cloneRecordIdentity)(record);
            Object.keys(relationships).forEach(relationship => {
                const relationshipDef = modelDef.relationships[relationship];
                const relationshipData = relationships[relationship] && relationships[relationship].data;
                const relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, this._addRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    }
    _recordRemoved(record) {
        const ops = [];
        const currentRecord = this.cache.records(record.type).get(record.id);
        const relationships = currentRecord && currentRecord.relationships;
        if (relationships) {
            const modelDef = this.cache.schema.getModel(record.type);
            const recordIdentity = (0, _data.cloneRecordIdentity)(record);
            Object.keys(relationships).forEach(relationship => {
                const relationshipDef = modelDef.relationships[relationship];
                const relationshipData = relationships[relationship] && relationships[relationship].data;
                const relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    }
    _recordReplaced(record) {
        const ops = [];
        if (record.relationships) {
            const modelDef = this.cache.schema.getModel(record.type);
            const recordIdentity = (0, _data.cloneRecordIdentity)(record);
            for (let relationship in record.relationships) {
                const relationshipDef = modelDef.relationships[relationship];
                const relationshipData = record && (0, _utils.deepGet)(record, ['relationships', relationship, 'data']);
                if (relationshipDef.type === 'hasMany') {
                    Array.prototype.push.apply(ops, this._relatedRecordsReplaced(recordIdentity, relationship, relationshipData));
                } else {
                    Array.prototype.push.apply(ops, this._relatedRecordReplaced(recordIdentity, relationship, relationshipData));
                }
            }
        }
        return ops;
    }
    _addRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        if (relatedRecords.length > 0 && relationshipDef.inverse) {
            return relatedRecords.map(relatedRecord => this._addRelationshipOp(relatedRecord, relationshipDef.inverse, record));
        }
        return [];
    }
    _removeRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        if (relatedRecords.length > 0) {
            if (relationshipDef.dependent === 'remove') {
                return this._removeDependentRecords(relatedRecords);
            } else if (relationshipDef.inverse) {
                return relatedRecords.map(relatedRecord => this._removeRelationshipOp(relatedRecord, relationshipDef.inverse, record));
            }
        }
        return [];
    }
    _addRelationshipOp(record, relationship, relatedRecord) {
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'addToRelatedRecords' : 'replaceRelatedRecord',
            record,
            relationship,
            relatedRecord
        };
    }
    _removeRelationshipOp(record, relationship, relatedRecord) {
        const relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        const isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'removeFromRelatedRecords' : 'replaceRelatedRecord',
            record,
            relationship,
            relatedRecord: isHasMany ? relatedRecord : null
        };
    }
    _removeDependentRecords(relatedRecords) {
        return relatedRecords.map(record => ({
            op: 'removeRecord',
            record
        }));
    }
}
exports.default = SchemaConsistencyProcessor;
function recordArrayFromData(data) {
    if ((0, _utils.isArray)(data)) {
        return data;
    } else if (data) {
        return [data];
    } else {
        return [];
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IiLCJPcGVyYXRpb25Qcm9jZXNzb3IiLCJhZnRlciIsIm9wZXJhdGlvbiIsIm9wIiwiX3JlY29yZEFkZGVkIiwicmVjb3JkIiwiX3JlbGF0ZWRSZWNvcmRBZGRlZCIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmQiLCJfcmVsYXRlZFJlY29yZFJlcGxhY2VkIiwiX3JlbGF0ZWRSZWNvcmRzUmVwbGFjZWQiLCJyZWxhdGVkUmVjb3JkcyIsIl9yZWxhdGVkUmVjb3JkUmVtb3ZlZCIsIl9yZWNvcmRSZW1vdmVkIiwiX3JlY29yZFJlcGxhY2VkIiwib3BzIiwicmVsYXRpb25zaGlwRGVmIiwiY2FjaGUiLCJzY2hlbWEiLCJnZXRNb2RlbCIsInR5cGUiLCJyZWxhdGlvbnNoaXBzIiwiaW52ZXJzZVJlbGF0aW9uc2hpcCIsImludmVyc2UiLCJwdXNoIiwiX2FkZFJlbGF0aW9uc2hpcE9wIiwiX3JlbGF0ZWRSZWNvcmRzQWRkZWQiLCJsZW5ndGgiLCJmb3JFYWNoIiwidW5kZWZpbmVkIiwiY3VycmVudFJlY29yZCIsInJlY29yZHMiLCJnZXQiLCJpZCIsIl9yZW1vdmVSZWxhdGlvbnNoaXBPcCIsImN1cnJlbnRSZWxhdGVkUmVjb3JkIiwiX3JlbGF0ZWRSZWNvcmRzUmVtb3ZlZCIsImN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCIsInJlbGF0ZWRSZWNvcmRzTWFwIiwiYWRkZWRSZWNvcmRzIiwiUmVjb3JkSWRlbnRpdHlNYXAiLCJyIiwiYWRkIiwicmVtb3ZlZFJlY29yZHMiLCJleGNsdXNpdmVPZiIsIkFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJfcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMiLCJfYWRkUmVsYXRlZFJlY29yZHNPcHMiLCJtb2RlbERlZiIsInJlY29yZElkZW50aXR5IiwiT2JqZWN0Iiwia2V5cyIsInJlbGF0aW9uc2hpcERhdGEiLCJkYXRhIiwicmVjb3JkQXJyYXlGcm9tRGF0YSIsIm1hcCIsImRlcGVuZGVudCIsIl9yZW1vdmVEZXBlbmRlbnRSZWNvcmRzIiwiaXNIYXNNYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7QUFVZSxNQUFNQSwwQkFBTixTQUF5Q0Msc0NBQXpDLENBQTREO0FBQ3ZFQyxVQUFNQyxTQUFOLEVBQWlCO0FBQ2IsZ0JBQVFBLFVBQVVDLEVBQWxCO0FBQ0ksaUJBQUssV0FBTDtBQUNJLHVCQUFPLEtBQUtDLFlBQUwsQ0FBa0JGLFVBQVVHLE1BQTVCLENBQVA7QUFDSixpQkFBSyxxQkFBTDtBQUNJLHVCQUFPLEtBQUtDLG1CQUFMLENBQXlCSixVQUFVRyxNQUFuQyxFQUEyQ0gsVUFBVUssWUFBckQsRUFBbUVMLFVBQVVNLGFBQTdFLENBQVA7QUFDSixpQkFBSyxzQkFBTDtBQUNJLHVCQUFPLEtBQUtDLHNCQUFMLENBQTRCUCxVQUFVRyxNQUF0QyxFQUE4Q0gsVUFBVUssWUFBeEQsRUFBc0VMLFVBQVVNLGFBQWhGLENBQVA7QUFDSixpQkFBSyx1QkFBTDtBQUNJLHVCQUFPLEtBQUtFLHVCQUFMLENBQTZCUixVQUFVRyxNQUF2QyxFQUErQ0gsVUFBVUssWUFBekQsRUFBdUVMLFVBQVVTLGNBQWpGLENBQVA7QUFDSixpQkFBSywwQkFBTDtBQUNJLHVCQUFPLEtBQUtDLHFCQUFMLENBQTJCVixVQUFVRyxNQUFyQyxFQUE2Q0gsVUFBVUssWUFBdkQsRUFBcUVMLFVBQVVNLGFBQS9FLENBQVA7QUFDSixpQkFBSyxjQUFMO0FBQ0ksdUJBQU8sS0FBS0ssY0FBTCxDQUFvQlgsVUFBVUcsTUFBOUIsQ0FBUDtBQUNKLGlCQUFLLGVBQUw7QUFDSSx1QkFBTyxLQUFLUyxlQUFMLENBQXFCWixVQUFVRyxNQUEvQixDQUFQO0FBQ0o7QUFDSSx1QkFBTyxFQUFQO0FBaEJSO0FBa0JIO0FBQ0RD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QkFGRztBQUdIRSx3QkFIRztBQUlIQztBQUpHLFNBQVA7QUFNSDtBQUNEMEIsMEJBQXNCN0IsTUFBdEIsRUFBOEJFLFlBQTlCLEVBQTRDQyxhQUE1QyxFQUEyRDtBQUN2RCxjQUFNUSxrQkFBa0IsS0FBS0MsS0FBTCxDQUFXQyxNQUFYLENBQWtCQyxRQUFsQixDQUEyQmQsT0FBT2UsSUFBbEMsRUFBd0NDLGFBQXhDLENBQXNEZCxZQUF0RCxDQUF4QjtBQUNBLGNBQU1xRCxZQUFZNUMsZ0JBQWdCSSxJQUFoQixLQUF5QixTQUEzQztBQUNBLGVBQU87QUFDSGpCLGdCQUFJeUQsWUFBWSwwQkFBWixHQUF5QyxzQkFEMUM7QUFFSHZELGtCQUZHO0FBR0hFLHdCQUhHO0FBSUhDLDJCQUFlb0QsWUFBWXBELGFBQVosR0FBNEI7QUFKeEMsU0FBUDtBQU1IO0FBQ0RtRCw0QkFBd0JoRCxjQUF4QixFQUF3QztBQUNwQyxlQUFPQSxlQUFlOEMsR0FBZixDQUFtQnBELFdBQVc7QUFDakNGLGdCQUFJLGNBRDZCO0FBRWpDRTtBQUZpQyxTQUFYLENBQW5CLENBQVA7QUFJSDtBQWpNc0U7a0JBQXRETiwwQjtBQW1NckIsU0FBU3lELG1CQUFULENBQTZCRCxJQUE3QixFQUFtQztBQUMvQixRQUFJLG9CQUFRQSxJQUFSLENBQUosRUFBbUI7QUFDZixlQUFPQSxJQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUlBLElBQUosRUFBVTtBQUNiLGVBQU8sQ0FBQ0EsSUFBRCxDQUFQO0FBQ0gsS0FGTSxNQUVBO0FBQ0gsZUFBTyxFQUFQO0FBQ0g7QUFDSiIsImZpbGUiOiJjYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBPcGVyYXRpb25Qcm9jZXNzb3IgfSBmcm9tICcuL29wZXJhdGlvbi1wcm9jZXNzb3InO1xuaW1wb3J0IFJlY29yZElkZW50aXR5TWFwIGZyb20gJy4uL3JlY29yZC1pZGVudGl0eS1tYXAnO1xuLyoqXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGEgY2FjaGUncyBkYXRhIGlzIGNvbnNpc3RlbnQgd2l0aFxuICogaXRzIGFzc29jaWF0ZWQgc2NoZW1hLlxuICpcbiAqIFRoaXMgaW5jbHVkZXMgbWFpbnRlbmFuY2Ugb2YgaW52ZXJzZSBhbmQgZGVwZW5kZW50IHJlbGF0aW9uc2hpcHMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XG4gICAgYWZ0ZXIob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdhZGRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXAgJiYgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRzQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBpbnZlcnNlUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVmLmludmVyc2U7XG4gICAgICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwICYmIHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UmVsYXRlZFJlY29yZCA9IHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgIGlmICghZXF1YWxSZWNvcmRJZGVudGl0aWVzKHJlbGF0ZWRSZWNvcmQsIGN1cnJlbnRSZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHMucHVzaCh0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXBPcChjdXJyZW50UmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX2FkZFJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfcmVsYXRlZFJlY29yZHNSZW1vdmVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xuICAgICAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkcyA9IHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gb3BzLnB1c2godGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwID0gdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzTWFwKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICAgICAgbGV0IGFkZGVkUmVjb3JkcztcbiAgICAgICAgaWYgKGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHNNYXAgPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gociA9PiByZWxhdGVkUmVjb3Jkc01hcC5hZGQocikpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRSZWNvcmRzID0gY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwLmV4Y2x1c2l2ZU9mKHJlbGF0ZWRSZWNvcmRzTWFwKTtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbW92ZWRSZWNvcmRzKSk7XG4gICAgICAgICAgICBhZGRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3Jkc01hcC5leGNsdXNpdmVPZihjdXJyZW50UmVsYXRlZFJlY29yZHNNYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkZWRSZWNvcmRzID0gcmVsYXRlZFJlY29yZHM7XG4gICAgICAgIH1cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgYWRkZWRSZWNvcmRzKSk7XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRBZGRlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWNvcmRBcnJheUZyb21EYXRhKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fYWRkUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRSZW1vdmVkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSBjdXJyZW50UmVjb3JkICYmIGN1cnJlbnRSZWNvcmQucmVsYXRpb25zaGlwcztcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWNvcmRBcnJheUZyb21EYXRhKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRSZXBsYWNlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGlmIChyZWNvcmQucmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIGZvciAobGV0IHJlbGF0aW9uc2hpcCBpbiByZWNvcmQucmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IG1vZGVsRGVmLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwLCByZWxhdGlvbnNoaXBEYXRhKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCwgcmVsYXRpb25zaGlwRGF0YSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfYWRkUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwICYmIHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgcmVsYXRpb25zaGlwRGVmLmludmVyc2UsIHJlY29yZCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgX3JlbW92ZVJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZCwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5kZXBlbmRlbnQgPT09ICdyZW1vdmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZURlcGVuZGVudFJlY29yZHMocmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5tYXAocmVsYXRlZFJlY29yZCA9PiB0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSwgcmVjb3JkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBfYWRkUmVsYXRpb25zaGlwT3AocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiBpc0hhc01hbnkgPyAnYWRkVG9SZWxhdGVkUmVjb3JkcycgOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiBpc0hhc01hbnkgPyAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyA6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICByZWxhdGVkUmVjb3JkOiBpc0hhc01hbnkgPyByZWxhdGVkUmVjb3JkIDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfcmVtb3ZlRGVwZW5kZW50UmVjb3JkcyhyZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlY29yZCA9PiAoe1xuICAgICAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH0pKTtcbiAgICB9XG59XG5mdW5jdGlvbiByZWNvcmRBcnJheUZyb21EYXRhKGRhdGEpIHtcbiAgICBpZiAoaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGVsc2UgaWYgKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufSJdfQ==