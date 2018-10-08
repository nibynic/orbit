'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require('@orbit/data');

var _utils = require('@orbit/utils');

exports.default = {
    addRecord: function (source, operation) {
        source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        var current = source.getRecord(updates);
        var record = (0, _data.mergeRecords)(current, updates);
        source.putRecord(record);
    },
    removeRecord: function (source, operation) {
        source.removeRecord(operation.record);
    },
    replaceKey: function (source, operation) {
        var record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        record.keys = record.keys || {};
        record.keys[operation.key] = operation.value;
        source.putRecord(record);
    },
    replaceAttribute: function (source, operation) {
        var record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        record.attributes = record.attributes || {};
        record.attributes[operation.attribute] = operation.value;
        source.putRecord(record);
    },
    addToRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        var relationships = (0, _utils.deepGet)(record, ['relationships', operation.relationship, 'data']);
        if (relationships) {
            relationships.push(operation.relatedRecord);
        } else {
            (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
        }
        source.putRecord(record);
    },
    removeFromRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record);
        if (record) {
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
        }
    },
    replaceRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        source.putRecord(record);
    },
    replaceRelatedRecord: function (source, operation) {
        var record = source.getRecord(operation.record) || (0, _data.cloneRecordIdentity)(operation.record);
        (0, _utils.deepSet)(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        source.putRecord(record);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbInNvdXJjZSIsIm9wZXJhdGlvbiIsInVwZGF0ZXMiLCJjdXJyZW50IiwicmVjb3JkIiwibWVyZ2VSZWNvcmRzIiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsInJlbGF0aW9uc2hpcHMiLCJkZWVwR2V0IiwiZGVlcFNldCIsImkiLCJsIiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBOztrQkFDZTtBQUFBLGVBQUEsVUFBQSxNQUFBLEVBQUEsU0FBQSxFQUNrQjtBQUN6QkEsZUFBQUEsU0FBQUEsQ0FBaUJDLFVBQWpCRCxNQUFBQTtBQUZPLEtBQUE7QUFBQSxtQkFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBSXNCO0FBQzdCLFlBQUlFLFVBQVVELFVBQWQsTUFBQTtBQUNBLFlBQUlFLFVBQVVILE9BQUFBLFNBQUFBLENBQWQsT0FBY0EsQ0FBZDtBQUNBLFlBQUlJLFNBQVNDLHdCQUFBQSxPQUFBQSxFQUFiLE9BQWFBLENBQWI7QUFDQUwsZUFBQUEsU0FBQUEsQ0FBQUEsTUFBQUE7QUFSTyxLQUFBO0FBQUEsa0JBQUEsVUFBQSxNQUFBLEVBQUEsU0FBQSxFQVVxQjtBQUM1QkEsZUFBQUEsWUFBQUEsQ0FBb0JDLFVBQXBCRCxNQUFBQTtBQVhPLEtBQUE7QUFBQSxnQkFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBYW1CO0FBQzFCLFlBQUlJLFNBQVNKLE9BQUFBLFNBQUFBLENBQWlCQyxVQUFqQkQsTUFBQUEsS0FBc0NNLCtCQUFvQkwsVUFBdkUsTUFBbURLLENBQW5EO0FBQ0FGLGVBQUFBLElBQUFBLEdBQWNBLE9BQUFBLElBQUFBLElBQWRBLEVBQUFBO0FBQ0FBLGVBQUFBLElBQUFBLENBQVlILFVBQVpHLEdBQUFBLElBQTZCSCxVQUE3QkcsS0FBQUE7QUFDQUosZUFBQUEsU0FBQUEsQ0FBQUEsTUFBQUE7QUFqQk8sS0FBQTtBQUFBLHNCQUFBLFVBQUEsTUFBQSxFQUFBLFNBQUEsRUFtQnlCO0FBQ2hDLFlBQUlJLFNBQVNKLE9BQUFBLFNBQUFBLENBQWlCQyxVQUFqQkQsTUFBQUEsS0FBc0NNLCtCQUFvQkwsVUFBdkUsTUFBbURLLENBQW5EO0FBQ0FGLGVBQUFBLFVBQUFBLEdBQW9CQSxPQUFBQSxVQUFBQSxJQUFwQkEsRUFBQUE7QUFDQUEsZUFBQUEsVUFBQUEsQ0FBa0JILFVBQWxCRyxTQUFBQSxJQUF5Q0gsVUFBekNHLEtBQUFBO0FBQ0FKLGVBQUFBLFNBQUFBLENBQUFBLE1BQUFBO0FBdkJPLEtBQUE7QUFBQSx5QkFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBeUI0QjtBQUNuQyxZQUFJSSxTQUFTSixPQUFBQSxTQUFBQSxDQUFpQkMsVUFBakJELE1BQUFBLEtBQXNDTSwrQkFBb0JMLFVBQXZFLE1BQW1ESyxDQUFuRDtBQUNBLFlBQUlDLGdCQUFnQkMsb0JBQUFBLE1BQUFBLEVBQWdCLENBQUEsZUFBQSxFQUFrQlAsVUFBbEIsWUFBQSxFQUFwQyxNQUFvQyxDQUFoQk8sQ0FBcEI7QUFDQSxZQUFBLGFBQUEsRUFBbUI7QUFDZkQsMEJBQUFBLElBQUFBLENBQW1CTixVQUFuQk0sYUFBQUE7QUFESixTQUFBLE1BRU87QUFDSEUsZ0NBQUFBLE1BQUFBLEVBQWdCLENBQUEsZUFBQSxFQUFrQlIsVUFBbEIsWUFBQSxFQUFoQlEsTUFBZ0IsQ0FBaEJBLEVBQW1FLENBQUNSLFVBQXBFUSxhQUFtRSxDQUFuRUE7QUFDSDtBQUNEVCxlQUFBQSxTQUFBQSxDQUFBQSxNQUFBQTtBQWpDTyxLQUFBO0FBQUEsOEJBQUEsVUFBQSxNQUFBLEVBQUEsU0FBQSxFQW1DaUM7QUFDeEMsWUFBSUksU0FBU0osT0FBQUEsU0FBQUEsQ0FBaUJDLFVBQTlCLE1BQWFELENBQWI7QUFDQSxZQUFBLE1BQUEsRUFBWTtBQUNSLGdCQUFJTyxnQkFBZ0JDLG9CQUFBQSxNQUFBQSxFQUFnQixDQUFBLGVBQUEsRUFBa0JQLFVBQWxCLFlBQUEsRUFBcEMsTUFBb0MsQ0FBaEJPLENBQXBCO0FBQ0EsZ0JBQUEsYUFBQSxFQUFtQjtBQUNmLHFCQUFLLElBQUlFLElBQUosQ0FBQSxFQUFXQyxJQUFJSixjQUFwQixNQUFBLEVBQTBDRyxJQUExQyxDQUFBLEVBQUEsR0FBQSxFQUFzRDtBQUNsRCx3QkFBSUUsaUNBQXNCTCxjQUF0QkssQ0FBc0JMLENBQXRCSyxFQUF3Q1gsVUFBNUMsYUFBSVcsQ0FBSixFQUFzRTtBQUNsRUwsc0NBQUFBLE1BQUFBLENBQUFBLENBQUFBLEVBQUFBLENBQUFBO0FBQ0E7QUFDSDtBQUNKO0FBQ0QsdUJBQU9QLE9BQUFBLFNBQUFBLENBQVAsTUFBT0EsQ0FBUDtBQUNIO0FBQ0o7QUFoRE0sS0FBQTtBQUFBLDJCQUFBLFVBQUEsTUFBQSxFQUFBLFNBQUEsRUFrRDhCO0FBQ3JDLFlBQUlJLFNBQVNKLE9BQUFBLFNBQUFBLENBQWlCQyxVQUFqQkQsTUFBQUEsS0FBc0NNLCtCQUFvQkwsVUFBdkUsTUFBbURLLENBQW5EO0FBQ0FHLDRCQUFBQSxNQUFBQSxFQUFnQixDQUFBLGVBQUEsRUFBa0JSLFVBQWxCLFlBQUEsRUFBaEJRLE1BQWdCLENBQWhCQSxFQUFtRVIsVUFBbkVRLGNBQUFBO0FBQ0FULGVBQUFBLFNBQUFBLENBQUFBLE1BQUFBO0FBckRPLEtBQUE7QUFBQSwwQkFBQSxVQUFBLE1BQUEsRUFBQSxTQUFBLEVBdUQ2QjtBQUNwQyxZQUFJSSxTQUFTSixPQUFBQSxTQUFBQSxDQUFpQkMsVUFBakJELE1BQUFBLEtBQXNDTSwrQkFBb0JMLFVBQXZFLE1BQW1ESyxDQUFuRDtBQUNBRyw0QkFBQUEsTUFBQUEsRUFBZ0IsQ0FBQSxlQUFBLEVBQWtCUixVQUFsQixZQUFBLEVBQWhCUSxNQUFnQixDQUFoQkEsRUFBbUVSLFVBQW5FUSxhQUFBQTtBQUNBVCxlQUFBQSxTQUFBQSxDQUFBQSxNQUFBQTtBQUNIO0FBM0RVLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZVJlY29yZHMsIGNsb25lUmVjb3JkSWRlbnRpdHksIGVxdWFsUmVjb3JkSWRlbnRpdGllcyB9IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGRlZXBHZXQsIGRlZXBTZXQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFkZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICBsZXQgdXBkYXRlcyA9IG9wZXJhdGlvbi5yZWNvcmQ7XG4gICAgICAgIGxldCBjdXJyZW50ID0gc291cmNlLmdldFJlY29yZCh1cGRhdGVzKTtcbiAgICAgICAgbGV0IHJlY29yZCA9IG1lcmdlUmVjb3JkcyhjdXJyZW50LCB1cGRhdGVzKTtcbiAgICAgICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHNvdXJjZS5yZW1vdmVSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgfSxcbiAgICByZXBsYWNlS2V5KHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIGxldCByZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgIHJlY29yZC5rZXlzID0gcmVjb3JkLmtleXMgfHwge307XG4gICAgICAgIHJlY29yZC5rZXlzW29wZXJhdGlvbi5rZXldID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfSxcbiAgICByZXBsYWNlQXR0cmlidXRlKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIGxldCByZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzID0gcmVjb3JkLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW29wZXJhdGlvbi5hdHRyaWJ1dGVdID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfSxcbiAgICBhZGRUb1JlbGF0ZWRSZWNvcmRzKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIGxldCByZWNvcmQgPSBzb3VyY2UuZ2V0UmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpIHx8IGNsb25lUmVjb3JkSWRlbnRpdHkob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwcy5wdXNoKG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBbb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRdKTtcbiAgICAgICAgfVxuICAgICAgICBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgfSxcbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbGF0aW9uc2hpcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcXVhbFJlY29yZElkZW50aXRpZXMocmVsYXRpb25zaGlwc1tpXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICBsZXQgcmVjb3JkID0gc291cmNlLmdldFJlY29yZChvcGVyYXRpb24ucmVjb3JkKSB8fCBjbG9uZVJlY29yZElkZW50aXR5KG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgb3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IHNvdXJjZS5nZXRSZWNvcmQob3BlcmF0aW9uLnJlY29yZCkgfHwgY2xvbmVSZWNvcmRJZGVudGl0eShvcGVyYXRpb24ucmVjb3JkKTtcbiAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgIH1cbn07Il19