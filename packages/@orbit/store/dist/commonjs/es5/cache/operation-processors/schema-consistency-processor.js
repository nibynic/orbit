"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("@orbit/utils");

var _data = require("@orbit/data");

var _operationProcessor = require("./operation-processor");

var _recordIdentityMap = require("../record-identity-map");

var _recordIdentityMap2 = _interopRequireDefault(_recordIdentityMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

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
                relatedRecord = currentRecord && (0, _utils.deepGet)(currentRecord, ['relationships', relationship, 'data']);
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
            var relatedRecordsMap = new _recordIdentityMap2.default();
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
            var recordIdentity = (0, _data.cloneRecordIdentity)(record);
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
            var recordIdentity = (0, _data.cloneRecordIdentity)(record);
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
            var recordIdentity = (0, _data.cloneRecordIdentity)(record);
            for (var relationship in record.relationships) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = record && (0, _utils.deepGet)(record, ['relationships', relationship, 'data']);
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
}(_operationProcessor.OperationProcessor);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IiLCJPcGVyYXRpb25Qcm9jZXNzb3IiLCJhZnRlciIsIm9wZXJhdGlvbiIsIl9yZWxhdGVkUmVjb3JkQWRkZWQiLCJyZWNvcmQiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwib3BzIiwicmVsYXRpb25zaGlwRGVmIiwiaW52ZXJzZVJlbGF0aW9uc2hpcCIsIl9yZWxhdGVkUmVjb3Jkc0FkZGVkIiwicmVsYXRlZFJlY29yZHMiLCJfcmVsYXRlZFJlY29yZFJlbW92ZWQiLCJjdXJyZW50UmVjb3JkIiwiZGVlcEdldCIsIl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQiLCJjdXJyZW50UmVsYXRlZFJlY29yZCIsImVxdWFsUmVjb3JkSWRlbnRpdGllcyIsIl9yZWxhdGVkUmVjb3Jkc1JlbW92ZWQiLCJfcmVsYXRlZFJlY29yZHNSZXBsYWNlZCIsImN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCIsImFkZGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzTWFwIiwicmVtb3ZlZFJlY29yZHMiLCJBcnJheSIsIl9yZWNvcmRBZGRlZCIsInJlbGF0aW9uc2hpcHMiLCJtb2RlbERlZiIsInJlY29yZElkZW50aXR5IiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsIk9iamVjdCIsInJlbGF0aW9uc2hpcERhdGEiLCJyZWNvcmRBcnJheUZyb21EYXRhIiwiX3JlY29yZFJlbW92ZWQiLCJfcmVjb3JkUmVwbGFjZWQiLCJfYWRkUmVsYXRlZFJlY29yZHNPcHMiLCJfcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMiLCJfYWRkUmVsYXRpb25zaGlwT3AiLCJpc0hhc01hbnkiLCJvcCIsIl9yZW1vdmVSZWxhdGlvbnNoaXBPcCIsIl9yZW1vdmVEZXBlbmRlbnRSZWNvcmRzIiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6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QUFnQjtBQUNwQyxlQUFPLGVBQUEsR0FBQSxDQUFtQixVQUFBLE1BQUEsRUFBQTtBQUFBLG1CQUFXO0FBQ2pDNEIsb0JBRGlDLGNBQUE7QUFFakNuQyx3QkFBQUE7QUFGaUMsYUFBWDtBQUExQixTQUFPLENBQVA7Ozs7RUE3TGdESixzQzs7a0JBQW5DRCwwQjs7O0FBbU1yQixTQUFBLG1CQUFBLENBQUEsSUFBQSxFQUFtQztBQUMvQixRQUFJMkMsb0JBQUosSUFBSUEsQ0FBSixFQUFtQjtBQUNmLGVBQUEsSUFBQTtBQURKLEtBQUEsTUFFTyxJQUFBLElBQUEsRUFBVTtBQUNiLGVBQU8sQ0FBUCxJQUFPLENBQVA7QUFERyxLQUFBLE1BRUE7QUFDSCxlQUFBLEVBQUE7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBPcGVyYXRpb25Qcm9jZXNzb3IgfSBmcm9tICcuL29wZXJhdGlvbi1wcm9jZXNzb3InO1xuaW1wb3J0IFJlY29yZElkZW50aXR5TWFwIGZyb20gJy4uL3JlY29yZC1pZGVudGl0eS1tYXAnO1xuLyoqXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGEgY2FjaGUncyBkYXRhIGlzIGNvbnNpc3RlbnQgd2l0aFxuICogaXRzIGFzc29jaWF0ZWQgc2NoZW1hLlxuICpcbiAqIFRoaXMgaW5jbHVkZXMgbWFpbnRlbmFuY2Ugb2YgaW52ZXJzZSBhbmQgZGVwZW5kZW50IHJlbGF0aW9uc2hpcHMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBleHRlbmRzIE9wZXJhdGlvblByb2Nlc3NvciB7XG4gICAgYWZ0ZXIob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdhZGRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXAgJiYgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRzQWRkZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGNvbnN0IG9wcyA9IFtdO1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICBjb25zdCBpbnZlcnNlUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVmLmludmVyc2U7XG4gICAgICAgIGlmIChpbnZlcnNlUmVsYXRpb25zaGlwICYmIHJlbGF0ZWRSZWNvcmRzICYmIHJlbGF0ZWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVsYXRlZFJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgb3BzLnB1c2godGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfcmVsYXRlZFJlY29yZFJlbW92ZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5jYWNoZS5yZWNvcmRzKHJlY29yZC50eXBlKS5nZXQocmVjb3JkLmlkKTtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkID0gY3VycmVudFJlY29yZCAmJiBkZWVwR2V0KGN1cnJlbnRSZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKS5yZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UmVsYXRlZFJlY29yZCA9IHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICAgICAgICAgIGlmICghZXF1YWxSZWNvcmRJZGVudGl0aWVzKHJlbGF0ZWRSZWNvcmQsIGN1cnJlbnRSZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHMucHVzaCh0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXBPcChjdXJyZW50UmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wcy5wdXNoKHRoaXMuX2FkZFJlbGF0aW9uc2hpcE9wKHJlbGF0ZWRSZWNvcmQsIGludmVyc2VSZWxhdGlvbnNoaXAsIHJlY29yZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfcmVsYXRlZFJlY29yZHNSZW1vdmVkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlO1xuICAgICAgICBpZiAoaW52ZXJzZVJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgaWYgKHJlbGF0ZWRSZWNvcmRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkcyA9IHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3Jkcy5mb3JFYWNoKHJlbGF0ZWRSZWNvcmQgPT4gb3BzLnB1c2godGhpcy5fcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgaW52ZXJzZVJlbGF0aW9uc2hpcCwgcmVjb3JkKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwID0gdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzTWFwKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICAgICAgbGV0IGFkZGVkUmVjb3JkcztcbiAgICAgICAgaWYgKGN1cnJlbnRSZWxhdGVkUmVjb3Jkc01hcCkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHNNYXAgPSBuZXcgUmVjb3JkSWRlbnRpdHlNYXAoKTtcbiAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gociA9PiByZWxhdGVkUmVjb3Jkc01hcC5hZGQocikpO1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRSZWNvcmRzID0gY3VycmVudFJlbGF0ZWRSZWNvcmRzTWFwLmV4Y2x1c2l2ZU9mKHJlbGF0ZWRSZWNvcmRzTWFwKTtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbW92ZWRSZWNvcmRzKSk7XG4gICAgICAgICAgICBhZGRlZFJlY29yZHMgPSByZWxhdGVkUmVjb3Jkc01hcC5leGNsdXNpdmVPZihjdXJyZW50UmVsYXRlZFJlY29yZHNNYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkZWRSZWNvcmRzID0gcmVsYXRlZFJlY29yZHM7XG4gICAgICAgIH1cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9hZGRSZWxhdGVkUmVjb3Jkc09wcyhyZWNvcmQsIHJlbGF0aW9uc2hpcERlZiwgYWRkZWRSZWNvcmRzKSk7XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRBZGRlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSByZWNvcmQucmVsYXRpb25zaGlwcztcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWNvcmRBcnJheUZyb21EYXRhKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fYWRkUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRSZW1vdmVkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBvcHMgPSBbXTtcbiAgICAgICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuY2FjaGUucmVjb3JkcyhyZWNvcmQudHlwZSkuZ2V0KHJlY29yZC5pZCk7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSBjdXJyZW50UmVjb3JkICYmIGN1cnJlbnRSZWNvcmQucmVsYXRpb25zaGlwcztcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5mb3JFYWNoKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gbW9kZWxEZWYucmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERhdGEgPSByZWxhdGlvbnNoaXBzW3JlbGF0aW9uc2hpcF0gJiYgcmVsYXRpb25zaGlwc1tyZWxhdGlvbnNoaXBdLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZFJlY29yZHMgPSByZWNvcmRBcnJheUZyb21EYXRhKHJlbGF0aW9uc2hpcERhdGEpO1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVtb3ZlUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcERlZiwgcmVsYXRlZFJlY29yZHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHM7XG4gICAgfVxuICAgIF9yZWNvcmRSZXBsYWNlZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGlmIChyZWNvcmQucmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxEZWYgPSB0aGlzLmNhY2hlLnNjaGVtYS5nZXRNb2RlbChyZWNvcmQudHlwZSk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZGVudGl0eSA9IGNsb25lUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgICAgIGZvciAobGV0IHJlbGF0aW9uc2hpcCBpbiByZWNvcmQucmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IG1vZGVsRGVmLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBEYXRhID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGlvbnNoaXBEZWYudHlwZSA9PT0gJ2hhc01hbnknKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG9wcywgdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChyZWNvcmRJZGVudGl0eSwgcmVsYXRpb25zaGlwLCByZWxhdGlvbnNoaXBEYXRhKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3BzLCB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkSWRlbnRpdHksIHJlbGF0aW9uc2hpcCwgcmVsYXRpb25zaGlwRGF0YSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BzO1xuICAgIH1cbiAgICBfYWRkUmVsYXRlZFJlY29yZHNPcHMocmVjb3JkLCByZWxhdGlvbnNoaXBEZWYsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWxhdGVkUmVjb3Jkcy5sZW5ndGggPiAwICYmIHJlbGF0aW9uc2hpcERlZi5pbnZlcnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlbGF0ZWRSZWNvcmQgPT4gdGhpcy5fYWRkUmVsYXRpb25zaGlwT3AocmVsYXRlZFJlY29yZCwgcmVsYXRpb25zaGlwRGVmLmludmVyc2UsIHJlY29yZCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgX3JlbW92ZVJlbGF0ZWRSZWNvcmRzT3BzKHJlY29yZCwgcmVsYXRpb25zaGlwRGVmLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICBpZiAocmVsYXRlZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcERlZi5kZXBlbmRlbnQgPT09ICdyZW1vdmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZURlcGVuZGVudFJlY29yZHMocmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWxhdGVkUmVjb3Jkcy5tYXAocmVsYXRlZFJlY29yZCA9PiB0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXBPcChyZWxhdGVkUmVjb3JkLCByZWxhdGlvbnNoaXBEZWYuaW52ZXJzZSwgcmVjb3JkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBfYWRkUmVsYXRpb25zaGlwT3AocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiBpc0hhc01hbnkgPyAnYWRkVG9SZWxhdGVkUmVjb3JkcycgOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcmVsYXRlZFJlY29yZFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfcmVtb3ZlUmVsYXRpb25zaGlwT3AocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwRGVmID0gdGhpcy5jYWNoZS5zY2hlbWEuZ2V0TW9kZWwocmVjb3JkLnR5cGUpLnJlbGF0aW9uc2hpcHNbcmVsYXRpb25zaGlwXTtcbiAgICAgICAgY29uc3QgaXNIYXNNYW55ID0gcmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55JztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wOiBpc0hhc01hbnkgPyAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyA6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICByZWxhdGVkUmVjb3JkOiBpc0hhc01hbnkgPyByZWxhdGVkUmVjb3JkIDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfcmVtb3ZlRGVwZW5kZW50UmVjb3JkcyhyZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICByZXR1cm4gcmVsYXRlZFJlY29yZHMubWFwKHJlY29yZCA9PiAoe1xuICAgICAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxuICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgIH0pKTtcbiAgICB9XG59XG5mdW5jdGlvbiByZWNvcmRBcnJheUZyb21EYXRhKGRhdGEpIHtcbiAgICBpZiAoaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGVsc2UgaWYgKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufSJdfQ==