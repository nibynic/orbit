function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { deepGet, isArray } from '@orbit/utils';
import { cloneRecordIdentity, equalRecordIdentities } from '@orbit/data';
import { OperationProcessor } from './operation-processor';
import RecordIdentityMap from '../record-identity-map';
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

var SchemaConsistencyProcessor = function (_OperationProcessor) {
    _inherits(SchemaConsistencyProcessor, _OperationProcessor);

    function SchemaConsistencyProcessor() {
        _classCallCheck(this, SchemaConsistencyProcessor);

        return _possibleConstructorReturn(this, _OperationProcessor.apply(this, arguments));
    }

    SchemaConsistencyProcessor.prototype.after = function after(operation) {
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
    };

    SchemaConsistencyProcessor.prototype._relatedRecordAdded = function _relatedRecordAdded(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecord) {
            ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsAdded = function _relatedRecordsAdded(record, relationship, relatedRecords) {
        var _this2 = this;

        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecords && relatedRecords.length > 0) {
            relatedRecords.forEach(function (relatedRecord) {
                ops.push(_this2._addRelationshipOp(relatedRecord, inverseRelationship, record));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordRemoved = function _relatedRecordRemoved(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecord === undefined) {
                var currentRecord = this.cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                ops.push(this._removeRelationshipOp(relatedRecord, inverseRelationship, record));
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordReplaced = function _relatedRecordReplaced(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            var currentRelatedRecord = this.cache.relationships.relatedRecord(record, relationship);
            if (!equalRecordIdentities(relatedRecord, currentRelatedRecord)) {
                if (currentRelatedRecord) {
                    ops.push(this._removeRelationshipOp(currentRelatedRecord, inverseRelationship, record));
                }
                if (relatedRecord) {
                    ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
                }
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsRemoved = function _relatedRecordsRemoved(record, relationship, relatedRecords) {
        var _this3 = this;

        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecords === undefined) {
                relatedRecords = this.cache.relationships.relatedRecords(record, relationship);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return ops.push(_this3._removeRelationshipOp(relatedRecord, inverseRelationship, record));
                });
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsReplaced = function _relatedRecordsReplaced(record, relationship, relatedRecords) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var currentRelatedRecordsMap = this.cache.relationships.relatedRecordsMap(record, relationship);
        var addedRecords = void 0;
        if (currentRelatedRecordsMap) {
            var relatedRecordsMap = new RecordIdentityMap();
            relatedRecords.forEach(function (r) {
                return relatedRecordsMap.add(r);
            });
            var removedRecords = currentRelatedRecordsMap.exclusiveOf(relatedRecordsMap);
            Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(record, relationshipDef, removedRecords));
            addedRecords = relatedRecordsMap.exclusiveOf(currentRelatedRecordsMap);
        } else {
            addedRecords = relatedRecords;
        }
        Array.prototype.push.apply(ops, this._addRelatedRecordsOps(record, relationshipDef, addedRecords));
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordAdded = function _recordAdded(record) {
        var _this4 = this;

        var ops = [];
        var relationships = record.relationships;
        if (relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this4._addRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordRemoved = function _recordRemoved(record) {
        var _this5 = this;

        var ops = [];
        var currentRecord = this.cache.records(record.type).get(record.id);
        var relationships = currentRecord && currentRecord.relationships;
        if (relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this5._removeRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordReplaced = function _recordReplaced(record) {
        var ops = [];
        if (record.relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = cloneRecordIdentity(record);
            for (var relationship in record.relationships) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = record && deepGet(record, ['relationships', relationship, 'data']);
                if (relationshipDef.type === 'hasMany') {
                    Array.prototype.push.apply(ops, this._relatedRecordsReplaced(recordIdentity, relationship, relationshipData));
                } else {
                    Array.prototype.push.apply(ops, this._relatedRecordReplaced(recordIdentity, relationship, relationshipData));
                }
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._addRelatedRecordsOps = function _addRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        var _this6 = this;

        if (relatedRecords.length > 0 && relationshipDef.inverse) {
            return relatedRecords.map(function (relatedRecord) {
                return _this6._addRelationshipOp(relatedRecord, relationshipDef.inverse, record);
            });
        }
        return [];
    };

    SchemaConsistencyProcessor.prototype._removeRelatedRecordsOps = function _removeRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        var _this7 = this;

        if (relatedRecords.length > 0) {
            if (relationshipDef.dependent === 'remove') {
                return this._removeDependentRecords(relatedRecords);
            } else if (relationshipDef.inverse) {
                return relatedRecords.map(function (relatedRecord) {
                    return _this7._removeRelationshipOp(relatedRecord, relationshipDef.inverse, record);
                });
            }
        }
        return [];
    };

    SchemaConsistencyProcessor.prototype._addRelationshipOp = function _addRelationshipOp(record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'addToRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: relatedRecord
        };
    };

    SchemaConsistencyProcessor.prototype._removeRelationshipOp = function _removeRelationshipOp(record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'removeFromRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: isHasMany ? relatedRecord : null
        };
    };

    SchemaConsistencyProcessor.prototype._removeDependentRecords = function _removeDependentRecords(relatedRecords) {
        return relatedRecords.map(function (record) {
            return {
                op: 'removeRecord',
                record: record
            };
        });
    };

    return SchemaConsistencyProcessor;
}(OperationProcessor);

export default SchemaConsistencyProcessor;

function recordArrayFromData(data) {
    if (isArray(data)) {
        return data;
    } else if (data) {
        return [data];
    } else {
        return [];
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiZGVlcEdldCIsImlzQXJyYXkiLCJjbG9uZVJlY29yZElkZW50aXR5IiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIiwiT3BlcmF0aW9uUHJvY2Vzc29yIiwiUmVjb3JkSWRlbnRpdHlNYXAiLCJTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciIsImFmdGVyIiwib3BlcmF0aW9uIiwib3AiLCJfcmVjb3JkQWRkZWQiLCJyZWNvcmQiLCJfcmVsYXRlZFJlY29yZEFkZGVkIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCIsIl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQiLCJfcmVsYXRlZFJlY29yZHNSZXBsYWNlZCIsInJlbGF0ZWRSZWNvcmRzIiwiX3JlbGF0ZWRSZWNvcmRSZW1vdmVkIiwiX3JlY29yZFJlbW92ZWQiLCJfcmVjb3JkUmVwbGFjZWQiLCJvcHMiLCJyZWxhdGlvbnNoaXBEZWYiLCJjYWNoZSIsInNjaGVtYSIsImdldE1vZGVsIiwidHlwZSIsInJlbGF0aW9uc2hpcHMiLCJpbnZlcnNlUmVsYXRpb25zaGlwIiwiaW52ZXJzZSIsInB1c2giLCJfYWRkUmVsYXRpb25zaGlwT3AiLCJfcmVsYXRlZFJlY29yZHNBZGRlZCIsImxlbmd0aCIsImZvckVhY2giLCJ1bmRlZmluZWQiLCJjdXJyZW50UmVjb3JkIiwicmVjb3JkcyIsImdldCIsImlkIiwiX3JlbW92ZVJlbGF0aW9uc2hpcE9wIiwiY3VycmVudFJlbGF0ZWRSZWNvcmQiLCJfcmVsYXRlZFJlY29yZHNSZW1vdmVkIiwiY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwIiwicmVsYXRlZFJlY29yZHNNYXAiLCJhZGRlZFJlY29yZHMiLCJhZGQiLCJyIiwicmVtb3ZlZFJlY29yZHMiLCJleGNsdXNpdmVPZiIsIkFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJfcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMiLCJfYWRkUmVsYXRlZFJlY29yZHNPcHMiLCJtb2RlbERlZiIsInJlY29yZElkZW50aXR5IiwiT2JqZWN0Iiwia2V5cyIsInJlbGF0aW9uc2hpcERhdGEiLCJkYXRhIiwicmVjb3JkQXJyYXlGcm9tRGF0YSIsIm1hcCIsImRlcGVuZGVudCIsIl9yZW1vdmVEZXBlbmRlbnRSZWNvcmRzIiwiaXNIYXNNYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLE9BQVQsRUFBa0JDLE9BQWxCLFFBQWlDLGNBQWpDO0FBQ0EsU0FBU0MsbUJBQVQsRUFBOEJDLHFCQUE5QixRQUEyRCxhQUEzRDtBQUNBLFNBQVNDLGtCQUFULFFBQW1DLHVCQUFuQztBQUNBLE9BQU9DLGlCQUFQLE1BQThCLHdCQUE5QjtBQUNBOzs7Ozs7Ozs7OztJQVVxQkMsMEI7Ozs7Ozs7Ozt5Q0FDakJDLEssa0JBQU1DLFMsRUFBVztBQUNiLGdCQUFRQSxVQUFVQyxFQUFsQjtBQUNJLGlCQUFLLFdBQUw7QUFDSSx1QkFBTyxLQUFLQyxZQUFMLENBQWtCRixVQUFVRyxNQUE1QixDQUFQO0FBQ0osaUJBQUsscUJBQUw7QUFDSSx1QkFBTyxLQUFLQyxtQkFBTCxDQUF5QkosVUFBVUcsTUFBbkMsRUFBMkNILFVBQVVLLFlBQXJELEVBQW1FTCxVQUFVTSxhQUE3RSxDQUFQO0FBQ0osaUJBQUssc0JBQUw7QUFDSSx1QkFBTyxLQUFLQyxzQkFBTCxDQUE0QlAsVUFBVUcsTUFBdEMsRUFBOENILFVBQVVLLFlBQXhELEVBQXNFTCxVQUFVTSxhQUFoRixDQUFQO0FBQ0osaUJBQUssdUJBQUw7QUFDSSx1QkFBTyxLQUFLRSx1QkFBTCxDQUE2QlIsVUFBVUcsTUFBdkMsRUFBK0NILFVBQVVLLFlBQXpELEVBQXVFTCxVQUFVUyxjQUFqRixDQUFQO0FBQ0osaUJBQUssMEJBQUw7QUFDSSx1QkFBTyxLQUFLQyxxQkFBTCxDQUEyQlYsVUFBVUcsTUFBckMsRUFBNkNILFVBQVVLLFlBQXZELEVBQXFFTCxVQUFVTSxhQUEvRSxD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QUNKIiwiZmlsZSI6ImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IGNsb25lUmVjb3JkSWRlbnRpdHksIGVxdWFsUmVjb3JkSWRlbnRpdGllcyB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vb3BlcmF0aW9uLXByb2Nlc3Nvcic7XG5pbXBvcnQgUmVjb3JkSWRlbnRpdHlNYXAgZnJvbSAnLi4vcmVjb3JkLWlkZW50aXR5LW1hcCc7XG4vKipcbiAqIEFuIG9wZXJhdGlvbiBwcm9jZXNzb3IgdGhhdCBlbnN1cmVzIHRoYXQgYSBjYWNoZSdzIGRhdGEgaXMgY29uc2lzdGVudCB3aXRoXG4gKiBpdHMgYXNzb2NpYXRlZCBzY2hlbWEuXG4gKlxuICogVGhpcyBpbmNsdWRlcyBtYWludGVuYW5jZSBvZiBpbnZlcnNlIGFuZCBkZXBlbmRlbnQgcmVsYXRpb25zaGlwcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3JcbiAqIEBleHRlbmRzIHtPcGVyYXRpb25Qcm9jZXNzb3J9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yIGV4dGVuZHMgT3BlcmF0aW9uUHJvY2Vzc29yIHtcbiAgICBhZnRlcihvcGVyYXRpb24pIHtcbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgICAgICBjYXNlICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICBjYXNlICdyZW1vdmVSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZFJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xuICAgICAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCAmJiByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICBvcHMucHVzaCh0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfcmVsYXRlZFJlY29yZHNBZGRlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXAgJiYgcmVsYXRlZFJlY29yZHMgJiYgcmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyZWxhdGVkUmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICBvcHMucHVzaCh0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkUmVtb3ZlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xuICAgICAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLmNhY2hlLnJlY29yZHMocmVjb3JkLnR5cGUpLmdldChyZWNvcmQuaWQpO1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQgPSBjdXJyZW50UmVjb3JkICYmIGRlZXBHZXQoY3VycmVudFJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xuICAgICAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRSZWxhdGVkUmVjb3JkID0gdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgaWYgKCFlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRlZFJlY29yZCwgY3VycmVudFJlbGF0ZWRSZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKGN1cnJlbnRSZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3Jkc1JlbW92ZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBpbnZlcnNlUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVmLmludmVyc2U7XG4gICAgICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzID0gdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiBvcHMucHVzaCh0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCBpbnZlcnNlUmVsYXRpb25zaGlwLCByZWNvcmQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRzUmVwbGFjZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBjdXJyZW50UmVsYXRlZFJlY29yZHNNYXAgPSB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNNYXAocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgICAgICBsZXQgYWRkZWRSZWNvcmRzO1xuICAgICAgICBpZiAoY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3Jkc01hcCA9IG5ldyBSZWNvcmRJZGVudGl0eU1hcCgpO1xuICAgICAgICAgICAgcmVsYXRlZFJlY29yZHMuZm9yRWFjaChyID0+IHJlbGF0ZWRSZWNvcmRzTWFwLmFkZChyKSk7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlZFJlY29yZHMgPSBjdXJyZW50UmVsYXRlZFJlY29yZHNNYXAuZXhjbHVzaXZlT2YocmVsYXRlZFJlY29yZHNNYXApO1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZW1vdmVSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgcmVtb3ZlZFJlY29yZHMpKTtcbiAgICAgICAgICAgIGFkZGVkUmVjb3JkcyA9IHJlbGF0ZWRSZWNvcmRzTWFwLmV4Y2x1c2l2ZU9mKGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX2FkZFJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZCwgcmVsYXRpb25zaGlwRGVmLCBhZGRlZFJlY29yZHMpKTtcbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlY29yZEFkZGVkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHJlY29yZC5yZWxhdGlvbnNoaXBzO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSBtb2RlbERlZi5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlY29yZEFycmF5RnJvbURhdGEocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3JkcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlY29yZFJlbW92ZWQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IGN1cnJlbnRSZWNvcmQgJiYgY3VycmVudFJlY29yZC5yZWxhdGlvbnNoaXBzO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmZvckVhY2gocmVsYXRpb25zaGlwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSBtb2RlbERlZi5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGF0YSA9IHJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXSAmJiByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0uZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGVkUmVjb3JkcyA9IHJlY29yZEFycmF5RnJvbURhdGEocmVsYXRpb25zaGlwRGF0YSk7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZW1vdmVSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3JkcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlY29yZFJlcGxhY2VkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgaWYgKHJlY29yZC5yZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICAgICAgZm9yIChsZXQgcmVsYXRpb25zaGlwIGluIHJlY29yZC5yZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWNvcmQgJiYgZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi50eXBlID09PSAnaGFzTWFueScpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZElkZW50aXR5LCByZWxhdGlvbnNoaXAsIHJlbGF0aW9uc2hpcERhdGEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvcHMsIHRoaXMuX3JlbGF0ZWRSZWNvcmRSZXBsYWNlZChyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwLCByZWxhdGlvbnNoaXBEYXRhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDAgJiYgcmVsYXRpb25zaGlwRGVmLmludmVyc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5tYXAocmVsYXRlZFJlY29yZCA9PiB0aGlzLl9hZGRSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSwgcmVjb3JkKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBfcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLmRlcGVuZGVudCA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlRGVwZW5kZW50UmVjb3JkcyhyZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRSZWNvcmRzLm1hcChyZWxhdGVkUmVjb3JkID0+IHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlLCByZWNvcmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIF9hZGRSZWxhdGlvbnNoaXBPcChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBpc0hhc01hbnkgPSByZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6IGlzSGFzTWFueSA/ICdhZGRUb1JlbGF0ZWRSZWNvcmRzJyA6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICByZWxhdGVkUmVjb3JkXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBpc0hhc01hbnkgPSByZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3A6IGlzSGFzTWFueSA/ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnIDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcbiAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IGlzSGFzTWFueSA/IHJlbGF0ZWRSZWNvcmQgOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9yZW1vdmVEZXBlbmRlbnRSZWNvcmRzKHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5tYXAocmVjb3JkID0+ICh7XG4gICAgICAgICAgICBvcDogJ3JlbW92ZVJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlY29yZEFycmF5RnJvbURhdGEoZGF0YSkge1xuICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gZWxzZSBpZiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gW2RhdGFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59Il19