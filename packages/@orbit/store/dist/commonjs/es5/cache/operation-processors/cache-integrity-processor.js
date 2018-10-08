"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require("@orbit/data");

var _operationProcessor = require("./operation-processor");

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
            var recordIdentity = (0, _data.cloneRecordIdentity)(record);
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
}(_operationProcessor.OperationProcessor);

exports.default = CacheIntegrityProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL2NhY2hlLWludGVncml0eS1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IiLCJPcGVyYXRpb25Qcm9jZXNzb3IiLCJhZnRlciIsIm9wZXJhdGlvbiIsIm9wcyIsImltbWVkaWF0ZSIsImZpbmFsbHkiLCJjbGVhckludmVyc2VSZWxhdGlvbnNoaXBPcHMiLCJyZWNvcmQiLCJpbnZlcnNlUmVscyIsInJlY29yZElkZW50aXR5IiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsInJlbGF0aW9uc2hpcERlZiIsInJlbCIsIm9wIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OztJQVlxQkEsMEI7Ozs7Ozs7OztzQ0FDakJFLEssa0JBQU1DLFMsRUFBVztBQUNiLGdCQUFRQSxVQUFSLEVBQUE7QUFDSSxpQkFBQSxzQkFBQTtBQUNJLHFCQUFBLEtBQUEsQ0FBQSxvQkFBQSxDQUFBLG9CQUFBLENBQXFEQSxVQUFyRCxNQUFBLEVBQXVFQSxVQUF2RSxZQUFBO0FBQ0EsdUJBQUEsRUFBQTtBQUNKLGlCQUFBLHVCQUFBO0FBQ0kscUJBQUEsS0FBQSxDQUFBLG9CQUFBLENBQUEscUJBQUEsQ0FBc0RBLFVBQXRELE1BQUEsRUFBd0VBLFVBQXhFLFlBQUE7QUFDQSx1QkFBQSxFQUFBO0FBQ0osaUJBQUEsMEJBQUE7QUFDSSxxQkFBQSxLQUFBLENBQUEsb0JBQUEsQ0FBQSxvQkFBQSxDQUFxREEsVUFBckQsTUFBQSxFQUF1RUEsVUFBdkUsWUFBQSxFQUErRkEsVUFBL0YsYUFBQTtBQUNBLHVCQUFBLEVBQUE7QUFDSixpQkFBQSxjQUFBO0FBQ0ksb0JBQUlDLE1BQU0sS0FBQSwyQkFBQSxDQUFpQ0QsVUFBM0MsTUFBVSxDQUFWO0FBQ0EscUJBQUEsS0FBQSxD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T0FBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBMkJDLElBQUFBLE1BQUFBLENBQTNCLElBQUEsRUFBQSxhQUFBLENBQTBEQSxJQUFsRixZQUF3QixDQUF4QjtBQUNBLG9CQUFJRCxnQkFBQUEsSUFBQUEsS0FBSixTQUFBLEVBQXdDO0FBQ3BDUix3QkFBQUEsSUFBQUEsQ0FBUztBQUNMVSw0QkFESywwQkFBQTtBQUVMTixnQ0FBUUssSUFGSCxNQUFBO0FBR0xFLHNDQUFjRixJQUhULFlBQUE7QUFJTEcsdUNBQWVOO0FBSlYscUJBQVROO0FBREosaUJBQUEsTUFPTztBQUNIQSx3QkFBQUEsSUFBQUEsQ0FBUztBQUNMVSw0QkFESyxzQkFBQTtBQUVMTixnQ0FBUUssSUFGSCxNQUFBO0FBR0xFLHNDQUFjRixJQUhULFlBQUE7QUFJTEcsdUNBQWU7QUFKVixxQkFBVFo7QUFNSDtBQWhCTEssYUFBQUE7QUFrQkg7QUFDRCxlQUFBLEdBQUE7Ozs7RUE3RjZDUixzQzs7a0JBQWhDRCx1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lUmVjb3JkSWRlbnRpdHkgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBPcGVyYXRpb25Qcm9jZXNzb3IgfSBmcm9tICcuL29wZXJhdGlvbi1wcm9jZXNzb3InO1xuLyoqXG4gKiBBbiBvcGVyYXRpb24gcHJvY2Vzc29yIHRoYXQgZW5zdXJlcyB0aGF0IGEgY2FjaGUncyBkYXRhIGlzIGNvbnNpc3RlbnQgYW5kXG4gKiBkb2Vzbid0IGNvbnRhaW4gYW55IGRlYWQgcmVmZXJlbmNlcy5cbiAqXG4gKiBUaGlzIGlzIGFjaGlldmVkIGJ5IG1haW50YWluaW5nIGEgbWFwcGluZyBvZiByZXZlcnNlIHJlbGF0aW9uc2hpcHMgZm9yIGVhY2hcbiAqIHJlY29yZC4gV2hlbiBhIHJlY29yZCBpcyByZW1vdmVkLCBhbnkgcmVmZXJlbmNlcyB0byBpdCBjYW4gYWxzbyBiZSBpZGVudGlmaWVkXG4gKiBhbmQgcmVtb3ZlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3JcbiAqIEBleHRlbmRzIHtPcGVyYXRpb25Qcm9jZXNzb3J9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yIGV4dGVuZHMgT3BlcmF0aW9uUHJvY2Vzc29yIHtcbiAgICBhZnRlcihvcGVyYXRpb24pIHtcbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXApO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc1JlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRSZW1vdmVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZW1vdmVSZWNvcmQnOlxuICAgICAgICAgICAgICAgIGxldCBvcHMgPSB0aGlzLmNsZWFySW52ZXJzZVJlbGF0aW9uc2hpcE9wcyhvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wcztcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW52ZXJzZVJlbGF0aW9uc2hpcHMucmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbW1lZGlhdGUob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlcGxhY2VSZWxhdGVkUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5yZXBsYWNlUmVsYXRlZFJlY29yZHMob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdhZGRUb1JlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuYWRkVG9SZWxhdGVkUmVjb3JkcyhvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMucmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdhZGRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucmVsYXRpb25zaGlwcy5hZGRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5yZWxhdGlvbnNoaXBzLnJlcGxhY2VSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnJlbGF0aW9uc2hpcHMuY2xlYXJSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpbmFsbHkob3BlcmF0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLm9wKSB7XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVsYXRlZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VSZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc0FkZGVkKG9wZXJhdGlvbi5yZWNvcmQsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3Jkcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY2FzZSAnYWRkVG9SZWxhdGVkUmVjb3Jkcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5yZWNvcmRBZGRlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICBjYXNlICdyZXBsYWNlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmludmVyc2VSZWxhdGlvbnNoaXBzLnJlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFySW52ZXJzZVJlbGF0aW9uc2hpcE9wcyhyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qgb3BzID0gW107XG4gICAgICAgIGNvbnN0IGludmVyc2VSZWxzID0gdGhpcy5jYWNoZS5pbnZlcnNlUmVsYXRpb25zaGlwcy5hbGwocmVjb3JkKTtcbiAgICAgICAgaWYgKGludmVyc2VSZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkZW50aXR5ID0gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICAgICAgaW52ZXJzZVJlbHMuZm9yRWFjaChyZWwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcERlZiA9IHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlbC5yZWNvcmQudHlwZSkucmVsYXRpb25zaGlwc1tyZWwucmVsYXRpb25zaGlwXTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwRGVmLnR5cGUgPT09ICdoYXNNYW55Jykge1xuICAgICAgICAgICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcDogJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlbC5yZWNvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6IHJlbC5yZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiByZWNvcmRJZGVudGl0eVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVsLnJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogcmVsLnJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wcztcbiAgICB9XG59Il19