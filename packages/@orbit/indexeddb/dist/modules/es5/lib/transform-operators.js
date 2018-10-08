import { mergeRecords, cloneRecordIdentity, equalRecordIdentities } from '@orbit/data';
import { deepGet, deepSet } from '@orbit/utils';
function getRecord(source, record) {
    return source.getRecord(record).catch(function () {
        return cloneRecordIdentity(record);
    });
}
export default {
    addRecord: function (source, operation) {
        return source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        return source.getRecord(updates).catch(function () {
            return null;
        }).then(function (current) {
            var record = mergeRecords(current, updates);
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
            var relationships = deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                relationships.push(operation.relatedRecord);
            } else {
                deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
            }
            return source.putRecord(record);
        });
    },
    removeFromRelatedRecords: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            var relationships = deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (var i = 0, l = relationships.length; i < l; i++) {
                    if (equalRecordIdentities(relationships[i], operation.relatedRecord)) {
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
            deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
            return source.putRecord(record);
        });
    },
    replaceRelatedRecord: function (source, operation) {
        return getRecord(source, operation.record).then(function (record) {
            deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
            return source.putRecord(record);
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi90cmFuc2Zvcm0tb3BlcmF0b3JzLmpzIl0sIm5hbWVzIjpbIm1lcmdlUmVjb3JkcyIsImNsb25lUmVjb3JkSWRlbnRpdHkiLCJlcXVhbFJlY29yZElkZW50aXRpZXMiLCJkZWVwR2V0IiwiZGVlcFNldCIsImdldFJlY29yZCIsInNvdXJjZSIsInJlY29yZCIsImNhdGNoIiwiYWRkUmVjb3JkIiwib3BlcmF0aW9uIiwicHV0UmVjb3JkIiwicmVwbGFjZVJlY29yZCIsInVwZGF0ZXMiLCJ0aGVuIiwiY3VycmVudCIsInJlbW92ZVJlY29yZCIsInJlcGxhY2VLZXkiLCJrZXlzIiwia2V5IiwidmFsdWUiLCJyZXBsYWNlQXR0cmlidXRlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZSIsImFkZFRvUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXBzIiwicmVsYXRpb25zaGlwIiwicHVzaCIsInJlbGF0ZWRSZWNvcmQiLCJyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMiLCJpIiwibCIsImxlbmd0aCIsInNwbGljZSIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLFlBQVQsRUFBdUJDLG1CQUF2QixFQUE0Q0MscUJBQTVDLFFBQXlFLGFBQXpFO0FBQ0EsU0FBU0MsT0FBVCxFQUFrQkMsT0FBbEIsUUFBaUMsY0FBakM7QUFDQSxTQUFTQyxTQUFULENBQW1CQyxNQUFuQixFQUEyQkMsTUFBM0IsRUFBbUM7QUFDL0IsV0FBT0QsT0FBT0QsU0FBUCxDQUFpQkUsTUFBakIsRUFBeUJDLEtBQXpCLENBQStCLFlBQU07QUFDeEMsZUFBT1Asb0JBQW9CTSxNQUFwQixDQUFQO0FBQ0gsS0FGTSxDQUFQO0FBR0g7QUFDRCxlQUFlO0FBQ1hFLGFBRFcsWUFDREgsTUFEQyxFQUNPSSxTQURQLEVBQ2tCO0FBQ3pCLGVBQU9KLE9BQU9LLFNBQVAsQ0FBaUJELFVBQVVI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QXdDcEIsVUFBVWtCLGFBQWxELENBQUosRUFBc0U7QUFDbEVILHNDQUFjUSxNQUFkLENBQXFCSCxDQUFyQixFQUF3QixDQUF4QjtBQUNBO0FBQ0g7QUFDSjtBQUNELHVCQUFPeEIsT0FBT0ssU0FBUCxDQUFpQkosTUFBakIsQ0FBUDtBQUNIO0FBQ0osU0FYTSxDQUFQO0FBWUgsS0FwRFU7QUFxRFgyQix5QkFyRFcsWUFxRFc1QixNQXJEWCxFQXFEbUJJLFNBckRuQixFQXFEOEI7QUFDckMsZUFBT0wsVUFBVUMsTUFBVixFQUFrQkksVUFBVUgsTUFBNUIsRUFBb0NPLElBQXBDLENBQXlDLGtCQUFVO0FBQ3REVixvQkFBUUcsTUFBUixFQUFnQixDQUFDLGVBQUQsRUFBa0JHLFVBQVVnQixZQUE1QixFQUEwQyxNQUExQyxDQUFoQixFQUFtRWhCLFVBQVV5QixjQUE3RTtBQUNBLG1CQUFPN0IsT0FBT0ssU0FBUCxDQUFpQkosTUFBakIsQ0FBUDtBQUNILFNBSE0sQ0FBUDtBQUlILEtBMURVO0FBMkRYNkIsd0JBM0RXLFlBMkRVOUIsTUEzRFYsRUEyRGtCSSxTQTNEbEIsRUEyRDZCO0FBQ3BDLGVBQU9MLFVBQVVDLE1BQVYsRUFBa0JJLFVBQVVILE1BQTVCLEVBQW9DTyxJQUFwQyxDQUF5QyxrQkFBVTtBQUN0RFYsb0JBQVFHLE1BQVIsRUFBZ0IsQ0FBQyxlQUFELEVBQWtCRyxVQUFVZ0IsWUFBNUIsRUFBMEMsTUFBMUMsQ0FBaEIsRUFBbUVoQixVQUFVa0IsYUFBN0U7QUFDQSxtQkFBT3RCLE9BQU9LLFNBQVAsQ0FBaUJKLE1BQWpCLENBQVA7QUFDSCxTQUhNLENBQVA7QUFJSDtBQWhFVSxDQUFmIiwiZmlsZSI6ImxpYi90cmFuc2Zvcm0tb3BlcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2VSZWNvcmRzLCBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmZ1bmN0aW9uIGdldFJlY29yZChzb3VyY2UsIHJlY29yZCkge1xuICAgIHJldHVybiBzb3VyY2UuZ2V0UmVjb3JkKHJlY29yZCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICByZXR1cm4gY2xvbmVSZWNvcmRJZGVudGl0eShyZWNvcmQpO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFkZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChvcGVyYXRpb24ucmVjb3JkKTtcbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgbGV0IHVwZGF0ZXMgPSBvcGVyYXRpb24ucmVjb3JkO1xuICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZCh1cGRhdGVzKS5jYXRjaCgoKSA9PiBudWxsKS50aGVuKGN1cnJlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHJlY29yZCA9IG1lcmdlUmVjb3JkcyhjdXJyZW50LCB1cGRhdGVzKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UucmVtb3ZlUmVjb3JkKG9wZXJhdGlvbi5yZWNvcmQpO1xuICAgIH0sXG4gICAgcmVwbGFjZUtleShzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgcmVjb3JkLmtleXMgPSByZWNvcmQua2V5cyB8fCB7fTtcbiAgICAgICAgICAgIHJlY29yZC5rZXlzW29wZXJhdGlvbi5rZXldID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlQXR0cmlidXRlKHNvdXJjZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybiBnZXRSZWNvcmQoc291cmNlLCBvcGVyYXRpb24ucmVjb3JkKS50aGVuKHJlY29yZCA9PiB7XG4gICAgICAgICAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbb3BlcmF0aW9uLmF0dHJpYnV0ZV0gPSBvcGVyYXRpb24udmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdldFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbi5yZWNvcmQpLnRoZW4ocmVjb3JkID0+IHtcbiAgICAgICAgICAgIGxldCByZWxhdGlvbnNoaXBzID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10pO1xuICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzLnB1c2gob3BlcmF0aW9uLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSwgW29wZXJhdGlvbi5yZWxhdGVkUmVjb3JkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLnB1dFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkcyhzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSBkZWVwR2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgb3BlcmF0aW9uLnJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVsYXRpb25zaGlwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyZWxhdGlvbnNoaXBzW2ldLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMoc291cmNlLCBvcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGdldFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbi5yZWNvcmQpLnRoZW4ocmVjb3JkID0+IHtcbiAgICAgICAgICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCBvcGVyYXRpb24ucmVsYXRpb25zaGlwLCAnZGF0YSddLCBvcGVyYXRpb24ucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5wdXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChzb3VyY2UsIG9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm4gZ2V0UmVjb3JkKHNvdXJjZSwgb3BlcmF0aW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgZGVlcFNldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIG9wZXJhdGlvbi5yZWxhdGlvbnNoaXAsICdkYXRhJ10sIG9wZXJhdGlvbi5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UucHV0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07Il19