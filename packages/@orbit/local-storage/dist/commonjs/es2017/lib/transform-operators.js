'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

exports.default = {
    addRecord(source, operation) {
        source.putRecord(operation.record);
    },
    replaceRecord(source, operation) {
        let updates = operation.record;
        let current = source.getRecord(updates);
        let record = (0, _data.mergeRecords)(current, updates);
        source.putRecord(record);
    },
    removeRecord(source, operation) {
        source.removeRecord(operation.record);
    },
    replaceKey(source, operation) {
        let record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        record.keys = record.keys || {};
        record.keys[operation.key] = operation.value;
        source.putRecord(record);
    },
    replaceAttribute(source, operation) {
        let record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        record.attributes = record.attributes || {};
        record.attributes[operation.attribute] = operation.value;
        source.putRecord(record);
    },
    addToRelatedRecords(source, operation) {
        let record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        let relationships = (0, _utils.deepGet)(record, ['relationships', operation.relationship, 'data']);
        if (relationships) {
            relationships.push(operation.relatedRecord);
        } else {
            (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
        }
        source.putRecord(record);
    },
    removeFromRelatedRecords(source, operation) {
        let record = source.getRecord(operation.record);
        if (record) {
            let relationships = (0, _utils.deepGet)(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (let i = 0, l = relationships.length; i < l; i++) {
                    if ((0, _data.equalRecordIdentities)(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        }
    },
    replaceRelatedRecords(source, operation) {
        let record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        source.putRecord(record);
    },
    replaceRelatedRecord(source, operation) {
        let record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        source.putRecord(record);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbImFkZFJlY29yZCIsInNvdXJjZSIsIm9wZXJhdGlvbiIsInB1dFJlY29yZCIsInJlY29yZCIsInJlcGxhY2VSZWNvcmQiLCJ1cGRhdGVzIiwiY3VycmVudCIsImdldFJlY29yZCIsInJlbW92ZVJlY29yZCIsInJlcGxhY2VLZXkiLCJrZXlzIiwia2V5IiwidmFsdWUiLCJyZXBsYWNlQXR0cmlidXRlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZSIsImFkZFRvUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXBzIiwicmVsYXRpb25zaGlwIiwicHVzaCIsInJlbGF0ZWRSZWNvcmQiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJpIiwibCIsImxlbmd0aCIsInNwbGljZSIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztrQkFDZTtBQUNYQSxjQUFVQyxNQUFWLEVBQWtCQyxTQUFsQixFQUE2QjtBQUN6QkQsZUFBT0UsU0FBUCxDQUFpQkQsVUFBVUUsTUFBM0I7QUFDSCxLQUhVO0FBSVhDLGtCQUFjSixNQUFkLEVBQXNCQyxTQUF0QixFQUFpQztBQUM3QixZQUFJSSxVQUFVSixVQUFVRSxNQUF4QjtBQUNBLFlBQUlHLFVBQVVOLE9BQU9PLFNBQVAsQ0FBaUJGLE9BQWpCLENBQWQ7QUFDQSxZQUFJRixTQUFTLHdCQUFhRyxPQUFiLEVBQXNCRCxPQUF0QixDQUFiO0FBQ0FMLGVBQU9FLFNBQVAsQ0FBaUJDLE1BQWpCO0FBQ0gsS0FUVTtBQVVYSyxpQkFBYVIsTUFBYixFQUFxQkMsU0FBckIsRUFBZ0M7QUFDNUJELGVBQU9RLFlBQVAsQ0FBb0JQLFVBQVVFLE1BQTlCO0FBQ0gsS0FaVTtBQWFYTSxlQUFXVCxNQUFYLEVBQW1CQyxTQUFuQixFQUE4QjtBQUMxQixZQUFJ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Q0EsNEJBQVFBLE1BQVIsRUFBZ0IsQ0FBQyxlQUFELEVBQWtCRixVQUFVaUIsWUFBNUIsRUFBMEMsTUFBMUMsQ0FBaEIsRUFBbUVqQixVQUFVbUIsYUFBN0U7QUFDQXBCLGVBQU9FLFNBQVAsQ0FBaUJDLE1BQWpCO0FBQ0g7QUEzRFUsQyIsImZpbGUiOiJsaWIvdHJhbnNmb3JtLW9wZXJhdG9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1lcmdlUmVjb3JkcywgY2xvbmVSZWNvcmRJZGVudGl0eSwgZXF1YWxSZWNvcmRJZGVudGl0aWVzIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgYWRkUmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHNvdXJjZS5wdXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIGxldCB1cGRhdGVzID0gb3BlcmF0aW9uLnJlY29yZDtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBzb3VyY2UuZ2V0UmVjb3JkKHVwZGF0ZXMpO1xuICAgICAgICBsZXQgcmVjb3JkID0gbWVyZ2VSZWNvcmRzKGN1cnJlbnQsIHVwZGF0ZXMpO1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfSxcbiAgICByZW1vdmVSZWNvcmQoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgc291cmNlLnJlbW92ZVJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICB9LFxuICAgIHJlcGxhY2VLZXkoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVjb3JkLmtleXMgPSByZWNvcmQua2V5cyB8fCB7fTtcbiAgICAgICAgcmVjb3JkLmtleXNbb3BlcmF0aW9uLmtleV0gPSBvcGVyYXRpb24udmFsdWU7XG4gICAgICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICB9LFxuICAgIHJlcGxhY2VBdHRyaWJ1dGUoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXMgPSByZWNvcmQuYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbb3BlcmF0aW9uLmF0dHJpYnV0ZV0gPSBvcGVyYXRpb24udmFsdWU7XG4gICAgICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzLnB1c2gob3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIFtvcGVyYXRpb24ucmVsYXRlZFJlY29yZF0pO1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICBsZXQgcmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVsYXRpb25zaGlwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGlvbnNoaXBzW2ldLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIGxldCByZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICBsZXQgcmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKSB8fCBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfVxufTsiXX0=