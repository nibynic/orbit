"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
 * An operation processor that ensures that an operation is compatible with
 * its associated schema.
 *
 * @export
 * @class SchemaValidationProcessor
 * @extends {OperationProcessor}
 */

var SchemaValidationProcessor = function (_OperationProcessor) {
    _inherits(SchemaValidationProcessor, _OperationProcessor);

    function SchemaValidationProcessor() {
        _classCallCheck(this, SchemaValidationProcessor);

        return _possibleConstructorReturn(this, _OperationProcessor.apply(this, arguments));
    }

    SchemaValidationProcessor.prototype.validate = function validate(operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceKey':
                return this._keyReplaced(operation.record);
            case 'replaceAttribute':
                return this._attributeReplaced(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            default:
                return;
        }
    };

    SchemaValidationProcessor.prototype._recordAdded = function _recordAdded(record) {
        this._validateRecord(record);
    };

    SchemaValidationProcessor.prototype._recordReplaced = function _recordReplaced(record) {
        this._validateRecord(record);
    };

    SchemaValidationProcessor.prototype._recordRemoved = function _recordRemoved(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._keyReplaced = function _keyReplaced(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._attributeReplaced = function _attributeReplaced(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._relatedRecordAdded = function _relatedRecordAdded(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };

    SchemaValidationProcessor.prototype._relatedRecordRemoved = function _relatedRecordRemoved(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };

    SchemaValidationProcessor.prototype._relatedRecordsReplaced = function _relatedRecordsReplaced(record, relationship, relatedRecords) {
        var _this2 = this;

        this._validateRecordIdentity(record);
        relatedRecords.forEach(function (record) {
            _this2._validateRecordIdentity(record);
        });
    };

    SchemaValidationProcessor.prototype._relatedRecordReplaced = function _relatedRecordReplaced(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        if (relatedRecord) {
            this._validateRecordIdentity(relatedRecord);
        }
    };

    SchemaValidationProcessor.prototype._validateRecord = function _validateRecord(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._validateRecordIdentity = function _validateRecordIdentity(record) {
        this.cache.schema.getModel(record.type);
    };

    return SchemaValidationProcessor;
}(_operationProcessor.OperationProcessor);

exports.default = SchemaValidationProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS12YWxpZGF0aW9uLXByb2Nlc3Nvci5qcyJdLCJuYW1lcyI6WyJTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIiwiT3BlcmF0aW9uUHJvY2Vzc29yIiwidmFsaWRhdGUiLCJvcGVyYXRpb24iLCJfcmVjb3JkQWRkZWQiLCJyZWNvcmQiLCJfcmVjb3JkUmVwbGFjZWQiLCJfcmVjb3JkUmVtb3ZlZCIsIl9rZXlSZXBsYWNlZCIsIl9hdHRyaWJ1dGVSZXBsYWNlZCIsIl9yZWxhdGVkUmVjb3JkQWRkZWQiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwiX3JlbGF0ZWRSZWNvcmRSZW1vdmVkIiwiX3JlbGF0ZWRSZWNvcmRzUmVwbGFjZWQiLCJyZWxhdGVkUmVjb3JkcyIsIl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQiLCJfdmFsaWRhdGVSZWNvcmQiLCJfdmFsaWRhdGVSZWNvcmRJZGVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7O0lBUXFCQSw0Qjs7Ozs7Ozs7O3dDQUNqQkUsUSxxQkFBU0MsUyxFQUFXO0FBQ2hCLGdCQUFRQSxVQUFSLEVBQUE7QUFDSSxpQkFBQSxXQUFBO0FBQ0ksdUJBQU8sS0FBQSxZQUFBLENBQWtCQSxVQUF6QixNQUFPLENBQVA7QUFDSixpQkFBQSxlQUFBO0FBQ0ksdUJBQU8sS0FBQSxlQUFBLENBQXFCQSxVQUE1QixNQUFPLENBQVA7QUFDSixpQkFBQSxjQUFBO0FBQ0ksdUJBQU8sS0FBQSxjQUFBLENBQW9CQSxVQUEzQixNQUFPLENBQVA7QUFDSixpQkFBQSxZQUFBO0FBQ0ksdUJBQU8sS0FBQSxZQUFBLENBQWtCQSxVQUF6QixNQUFPLENBQVA7QUFDSixpQkFBQSxrQkFBQTtBQUNJLHVCQUFPLEtBQUEsa0JBQUEsQ0FBd0JBLFVBQS9CLE1BQU8sQ0FBUDtBQUNKLGlCQUFBLHFCQUFBO0FBQ0ksdUJBQU8sS0FBQSxtQkFBQSxDQUF5QkEsVUFBekIsTUFBQSxFQUEyQ0EsVUFBM0MsWUFBQSxFQUFtRUEsVUFBMUUsYUFBTyxDQUFQO0FBQ0osaUJBQUEsMEJBQUE7QUFDSSx1QkFBTyxLQUFBLHFCQUFBLENBQTJCQSxVQUEzQixNQUFBLEVBQTZDQSxVQUE3QyxZQUFBLEVBQXFFQSxVQUE1RSxhQUFPLENBQVA7QUFDSixpQkFBQSx1QkFBQTtBQUNJLHVCQUFPLEtBQUEsdUJBQUEsQ0FBNkJBLFVBQTdCLE1BQUEsRUFBK0NBLFVBQS9DLFlBQUEsRUFBdUVBLFVBQTlFLGNBQU8sQ0FBUDtBQUNKLGlCQUFBLHNCQUFBO0FBQ0ksdUJBQU8sS0FBQSxzQkFBQSxDQUE0QkEsVUFBNUIsTUFBQSxFQUE4Q0EsVUFBOUMsWUFBQSxFQUFzRUEsVUFBN0UsYUFBTyxDQUFQO0FBQ0o7QUFDSTtBQXBCUjs7O3dDQXVCSkMsWSx5QkFBYUMsTSxFQUFRO0FBQ2pCLGFBQUEsZUFBQSxDQUFBLE1BQUE7Ozt3Q0FFSkMsZSw0QkFBZ0JELE0sRUFBUTtBQUNwQixhQUFBLGVBQUEsQ0FBQSxNQUFBOzs7d0NBRUpFLGMsMkJBQWVGLE0sRUFBUTtBQUNuQixhQUFBLHVCQUFBLENBQUEsTUFBQTs7O3dDQUVKRyxZLHlCQUFhSCxNLEVBQVE7QUFDakIsYUFBQSx1QkFBQSxDQUFBLE1BQUE7Ozt3Q0FFSkksa0IsK0JBQW1CSixNLEVBQVE7QUFDdkIsYUFBQSx1QkFBQSxDQUFBLE1BQUE7Ozt3Q0FFSkssbUIsZ0NBQW9CTCxNLEVBQVFNLFksRUFBY0MsYSxFQUFlO0FBQ3JELGFBQUEsdUJBQUEsQ0FBQSxNQUFBO0FBQ0EsYUFBQSx1QkFBQSxDQUFBLGFBQUE7Ozt3Q0FFSkMscUIsa0NBQXNCUixNLEVBQVFNLFksRUFBY0MsYSxFQUFlO0FBQ3ZELGFBQUEsdUJBQUEsQ0FBQSxNQUFBO0FBQ0EsYUFBQSx1QkFBQSxDQUFBLGFBQUE7Ozt3Q0FFSkUsdUIsb0NBQXdCVCxNLEVBQVFNLFksRUFBY0ksYyxFQUFnQjtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUMxRCxhQUFBLHVCQUFBLENBQUEsTUFBQTtBQUNBQSx1QkFBQUEsT0FBQUEsQ0FBdUIsVUFBQSxNQUFBLEVBQVU7QUFDN0IsbUJBQUEsdUJBQUEsQ0FBQSxNQUFBO0FBREpBLFNBQUFBOzs7d0NBSUpDLHNCLG1DQUF1QlgsTSxFQUFRTSxZLEVBQWNDLGEsRUFBZTtBQUN4RCxhQUFBLHVCQUFBLENBQUEsTUFBQTtBQUNBLFlBQUEsYUFBQSxFQUFtQjtBQUNmLGlCQUFBLHVCQUFBLENBQUEsYUFBQTtBQUNIOzs7d0NBRUxLLGUsNEJBQWdCWixNLEVBQVE7QUFDcEIsYUFBQSx1QkFBQSxDQUFBLE1BQUE7Ozt3Q0FFSmEsdUIsb0NBQXdCYixNLEVBQVE7QUFDNUIsYUFBQSxLQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBMkJBLE9BQTNCLElBQUE7Ozs7RUFoRStDSixzQzs7a0JBQWxDRCx5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vb3BlcmF0aW9uLXByb2Nlc3Nvcic7XG4vKipcbiAqIEFuIG9wZXJhdGlvbiBwcm9jZXNzb3IgdGhhdCBlbnN1cmVzIHRoYXQgYW4gb3BlcmF0aW9uIGlzIGNvbXBhdGlibGUgd2l0aFxuICogaXRzIGFzc29jaWF0ZWQgc2NoZW1hLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yXG4gKiBAZXh0ZW5kcyB7T3BlcmF0aW9uUHJvY2Vzc29yfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIGV4dGVuZHMgT3BlcmF0aW9uUHJvY2Vzc29yIHtcbiAgICB2YWxpZGF0ZShvcGVyYXRpb24pIHtcbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb24ub3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFJlY29yZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZEFkZGVkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlY29yZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZFJlcGxhY2VkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlUmVjb3JkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkUmVtb3ZlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VLZXknOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9rZXlSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2VBdHRyaWJ1dGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgICAgIGNhc2UgJ2FkZFRvUmVsYXRlZFJlY29yZHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkQWRkZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZFJlbW92ZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVsYXRlZFJlY29yZHNSZXBsYWNlZChvcGVyYXRpb24ucmVjb3JkLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGVkUmVjb3JkUmVwbGFjZWQob3BlcmF0aW9uLnJlY29yZCwgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3JlY29yZEFkZGVkKHJlY29yZCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZChyZWNvcmQpO1xuICAgIH1cbiAgICBfcmVjb3JkUmVwbGFjZWQocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkKHJlY29yZCk7XG4gICAgfVxuICAgIF9yZWNvcmRSZW1vdmVkKHJlY29yZCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgfVxuICAgIF9rZXlSZXBsYWNlZChyZWNvcmQpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgIH1cbiAgICBfYXR0cmlidXRlUmVwbGFjZWQocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICB9XG4gICAgX3JlbGF0ZWRSZWNvcmRBZGRlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCk7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkUmVtb3ZlZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCk7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3Jkc1JlcGxhY2VkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIHJlbGF0ZWRSZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9yZWxhdGVkUmVjb3JkUmVwbGFjZWQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgICAgICBpZiAocmVsYXRlZFJlY29yZCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWRhdGVSZWNvcmRJZGVudGl0eShyZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfdmFsaWRhdGVSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKTtcbiAgICB9XG4gICAgX3ZhbGlkYXRlUmVjb3JkSWRlbnRpdHkocmVjb3JkKSB7XG4gICAgICAgIHRoaXMuY2FjaGUuc2NoZW1hLmdldE1vZGVsKHJlY29yZC50eXBlKTtcbiAgICB9XG59Il19