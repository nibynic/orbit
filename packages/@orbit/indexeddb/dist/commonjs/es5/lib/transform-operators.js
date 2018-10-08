'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

function getRecord(source, record) {
    return source.getRecord(record).catch(function () {
        return (0, _data.cloneRecordIdentity)(record);
    });
}
exports.default = {
    addRecord: function (source, operation) {
        return source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        return source.getRecord(updates).catch(function () {
            return null;
        }).then(function (current) {
            var record = (0, _data.mergeRecords)(current, updates);
            return source.putRecord(record);
        });
    },
    removeRecord: function (source, operation) {
        return source.removeRecord(operation.record);
    },
    replaceKey: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            record.keys = record.keys || {};
            record.keys[operation.key] = operation.value;
            return source.putRecord(record);
        });
    },
    replaceAttribute: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            record.attributes = record.attributes || {};
            record.attributes[operation.attribute] = operation.value;
            return source.putRecord(record);
        });
    },
    addToRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            var relationships = (0, _utils.deepGet)(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                relationships.push(operation.relatedRecord);
            } else {
                (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
            }
            return source.putRecord(record);
        });
    },
    removeFromRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            var relationships = (0, _utils.deepGet)(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (var i = 0, l = relationships.length; i < l; i++) {
                    if ((0, _data.equalRecordIdentities)(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        });
    },
    replaceRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
            return source.putRecord(record);
        });
    },
    replaceRelatedRecord: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
            return source.putRecord(record);
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbImNsb25lUmVjb3JkSWRlbnRpdHkiLCJzb3VyY2UiLCJvcGVyYXRpb24iLCJ1cGRhdGVzIiwicmVjb3JkIiwibWVyZ2VSZWNvcmRzIiwicmVsYXRpb25zaGlwcyIsImRlZXBHZXQiLCJkZWVwU2V0IiwiaSIsImwiLCJlcXVhbFJlY29yZElkZW50aXRpZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7O0FBQ0EsU0FBQSxTQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsRUFBbUM7QUFDL0IsV0FBTyxPQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUEsS0FBQSxDQUErQixZQUFNO0FBQ3hDLGVBQU9BLCtCQUFQLE1BQU9BLENBQVA7QUFESixLQUFPLENBQVA7QUFHSDtrQkFDYztBQUFBLGVBQUEsVUFBQSxNQUFBLEVBQUEsU0FBQSxFQUNrQjtBQUN6QixlQUFPQyxPQUFBQSxTQUFBQSxDQUFpQkMsVUFBeEIsTUFBT0QsQ0FBUDtBQUZPLEtBQUE7QUFBQSxtQkFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBSXNCO0FBQzdCLFlBQUlFLFVBQVVELFVBQWQsTUFBQTtBQUNBLGVBQU8sT0FBQSxTQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsQ0FBZ0MsWUFBQTtBQUFBLG1CQUFBLElBQUE7QUFBaEMsU0FBQSxFQUFBLElBQUEsQ0FBaUQsVUFBQSxPQUFBLEVBQVc7QUFDL0QsZ0JBQUlFLFNBQVNDLHdCQUFBQSxPQUFBQSxFQUFiLE9BQWFBLENBQWI7QUFDQSxtQkFBT0osT0FBQUEsU0FBQUEsQ0FBUCxNQUFPQSxDQUFQO0FBRkosU0FBTyxDQUFQO0FBTk8sS0FBQTtBQUFBLGtCQUFBLFVBQUEsTUFBQSxFQUFBLFNBQUEsRUFXcUI7QUFDNUIsZUFBT0EsT0FBQUEsWUFBQUEsQ0FBb0JDLFVBQTNCLE1BQU9ELENBQVA7QUFaTyxLQUFBO0FBQUEsZ0JBQUEsVUFBQSxNQUFBLEVBQUEsU0FBQSxFQWNtQjtBQUMx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TyxVQUFBLE1BQUEsRUFBa0JDLFVBQWxCLE1BQUEsRUFBQSxJQUFBLENBQXlDLFVBQUEsTUFBQSxFQUFVO0FBQ3RETSxnQ0FBQUEsTUFBQUEsRUFBZ0IsQ0FBQSxlQUFBLEVBQWtCTixVQUFsQixZQUFBLEVBQWhCTSxNQUFnQixDQUFoQkEsRUFBbUVOLFVBQW5FTSxhQUFBQTtBQUNBLG1CQUFPUCxPQUFBQSxTQUFBQSxDQUFQLE1BQU9BLENBQVA7QUFGSixTQUFPLENBQVA7QUFJSDtBQWhFVSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2VSZWNvcmRzLCBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmZ1bmN0aW9uIGdldFJlY29yZChzb3VyY2UsIHJlY29yZCkge1xuICAgIHJldHVybiBzb3VyY2UuZ2V0UmVjb3JkKHJlY29yZCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICByZXR1cm4gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFkZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHVwZGF0ZXMgPSBvcGVyYXRpb24ucmVjb3JkO1xuICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZCh1cGRhdGVzKS5jYXRjaCgoKSA9PiBudWxsKS50aGVuKGN1cnJlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHJlY29yZCA9IG1lcmdlUmVjb3JkcyhjdXJyZW50LCB1cGRhdGVzKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UucmVtb3ZlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgIH0sXG4gICAgcmVwbGFjZUtleShzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgcmVjb3JkLmtleXMgPSByZWNvcmQua2V5cyB8fCB7fTtcbiAgICAgICAgICAgIHJlY29yZC5rZXlzW29wZXJhdGlvbi5rZXldID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlQXR0cmlidXRlKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZXRSZWNvcmQoc291cmNlLCBvcGVyYXRpb24ucmVjb3JkKS50aGVuKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbb3BlcmF0aW9uLmF0dHJpYnV0ZV0gPSBvcGVyYXRpb24udmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdldFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbi5yZWNvcmQpLnRoZW4ocmVjb3JkID0+IHtcbiAgICAgICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzLnB1c2gob3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgW29wZXJhdGlvbi5yZWxhdGVkUmVjb3JkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVsYXRpb25zaGlwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGlvbnNoaXBzW2ldLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdldFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbi5yZWNvcmQpLnRoZW4ocmVjb3JkID0+IHtcbiAgICAgICAgICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07Il19