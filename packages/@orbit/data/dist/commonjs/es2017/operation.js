'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.coalesceRecordOperations = coalesceRecordOperations;
exports.recordDiffs = recordDiffs;

var _record = require('./record');

var _utils = require('@orbit/utils');

function markOperationToDelete(operation) {
    const o = operation;
    o._deleted = true;
}
function isOperationMarkedToDelete(operation) {
    const o = operation;
    return o._deleted === true;
}
function mergeOperations(superceded, superceding, consecutiveOps) {
    if ((0, _record.equalRecordIdentities)(superceded.record, superceding.record)) {
        if (superceding.op === 'removeRecord') {
            markOperationToDelete(superceded);
            if (superceded.op === 'addRecord') {
                markOperationToDelete(superceding);
            }
        } else if (!isOperationMarkedToDelete(superceding) && (consecutiveOps || superceding.op === 'replaceAttribute')) {
            if (isReplaceFieldOp(superceded.op) && isReplaceFieldOp(superceding.op)) {
                if (superceded.op === 'replaceAttribute' && superceding.op === 'replaceAttribute' && superceded.attribute === superceding.attribute) {
                    markOperationToDelete(superceded);
                } else if (superceded.op === 'replaceRelatedRecord' && superceding.op === 'replaceRelatedRecord' && superceded.relationship === superceding.relationship) {
                    markOperationToDelete(superceded);
                } else if (superceded.op === 'replaceRelatedRecords' && superceding.op === 'replaceRelatedRecords' && superceded.relationship === superceding.relationship) {
                    markOperationToDelete(superceded);
                } else {
                    if (superceded.op === 'replaceAttribute') {
                        updateRecordReplaceAttribute(superceded.record, superceded.attribute, superceded.value);
                        delete superceded.attribute;
                        delete superceded.value;
                    } else if (superceded.op === 'replaceRelatedRecord') {
                        updateRecordReplaceHasOne(superceded.record, superceded.relationship, superceded.relatedRecord);
                        delete superceded.relationship;
                        delete superceded.relatedRecord;
                    } else if (superceded.op === 'replaceRelatedRecords') {
                        updateRecordReplaceHasMany(superceded.record, superceded.relationship, superceded.relatedRecords);
                        delete superceded.relationship;
                        delete superceded.relatedRecords;
                    }
                    if (superceding.op === 'replaceAttribute') {
                        updateRecordReplaceAttribute(superceded.record, superceding.attribute, superceding.value);
                    } else if (superceding.op === 'replaceRelatedRecord') {
                        updateRecordReplaceHasOne(superceded.record, superceding.relationship, superceding.relatedRecord);
                    } else if (superceding.op === 'replaceRelatedRecords') {
                        updateRecordReplaceHasMany(superceded.record, superceding.relationship, superceding.relatedRecords);
                    }
                    superceded.op = 'replaceRecord';
                    markOperationToDelete(superceding);
                }
            } else if ((superceded.op === 'addRecord' || superceded.op === 'replaceRecord') && isReplaceFieldOp(superceding.op)) {
                if (superceding.op === 'replaceAttribute') {
                    updateRecordReplaceAttribute(superceded.record, superceding.attribute, superceding.value);
                } else if (superceding.op === 'replaceRelatedRecord') {
                    updateRecordReplaceHasOne(superceded.record, superceding.relationship, superceding.relatedRecord);
                } else if (superceding.op === 'replaceRelatedRecords') {
                    updateRecordReplaceHasMany(superceded.record, superceding.relationship, superceding.relatedRecords);
                }
                markOperationToDelete(superceding);
            } else if (superceding.op === 'addToRelatedRecords') {
                if (superceded.op === 'addRecord') {
                    updateRecordAddToHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                    markOperationToDelete(superceding);
                } else if (superceded.op === 'replaceRecord') {
                    if (superceded.record.relationships && superceded.record.relationships[superceding.relationship] && superceded.record.relationships[superceding.relationship].data) {
                        updateRecordAddToHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                        markOperationToDelete(superceding);
                    }
                }
            } else if (superceding.op === 'removeFromRelatedRecords') {
                if (superceded.op === 'addToRelatedRecords' && superceded.relationship === superceding.relationship && (0, _record.equalRecordIdentities)(superceded.relatedRecord, superceding.relatedRecord)) {
                    markOperationToDelete(superceded);
                    markOperationToDelete(superceding);
                } else if (superceded.op === 'addRecord' || superceded.op === 'replaceRecord') {
                    if (superceded.record.relationships && superceded.record.relationships[superceding.relationship] && superceded.record.relationships[superceding.relationship].data) {
                        updateRecordRemoveFromHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                        markOperationToDelete(superceding);
                    }
                }
            }
        }
    }
}
function isReplaceFieldOp(op) {
    return op === 'replaceAttribute' || op === 'replaceRelatedRecord' || op === 'replaceRelatedRecords';
}
function updateRecordReplaceAttribute(record, attribute, value) {
    record.attributes = record.attributes || {};
    record.attributes[attribute] = value;
}
function updateRecordReplaceHasOne(record, relationship, relatedRecord) {
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], (0, _record.cloneRecordIdentity)(relatedRecord));
}
function updateRecordReplaceHasMany(record, relationship, relatedRecords) {
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], relatedRecords.map(_record.cloneRecordIdentity));
}
function updateRecordAddToHasMany(record, relationship, relatedRecord) {
    const data = (0, _utils.deepGet)(record, ['relationships', relationship, 'data']) || [];
    data.push((0, _record.cloneRecordIdentity)(relatedRecord));
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], data);
}
function updateRecordRemoveFromHasMany(record, relationship, relatedRecord) {
    const data = (0, _utils.deepGet)(record, ['relationships', relationship, 'data']);
    if (data) {
        for (let i = 0, l = data.length; i < l; i++) {
            let r = data[i];
            if ((0, _record.equalRecordIdentities)(r, relatedRecord)) {
                data.splice(i, 1);
                break;
            }
        }
    }
}
/**
 * Coalesces operations into a minimal set of equivalent operations.
 *
 * This method respects the order of the operations array and does not allow
 * reordering of operations that affect relationships.
 *
 * @export
 * @param {RecordOperation[]} operations
 * @returns {RecordOperation[]}
 */
function coalesceRecordOperations(operations) {
    for (let i = 0, l = operations.length; i < l; i++) {
        let currentOp = operations[i];
        let consecutiveOps = true;
        for (let j = i + 1; j < l; j++) {
            let nextOp = operations[j];
            mergeOperations(currentOp, nextOp, consecutiveOps);
            if (isOperationMarkedToDelete(currentOp)) {
                break;
            } else if (!isOperationMarkedToDelete(nextOp)) {
                consecutiveOps = false;
            }
        }
    }
    return operations.filter(o => !isOperationMarkedToDelete(o));
}
/**
 * Determine the differences between a record and its updated version in terms
 * of a set of operations.
 *
 * @export
 * @param {Record} record
 * @param {Record} updatedRecord
 * @returns {RecordOperation[]}
 */
function recordDiffs(record, updatedRecord) {
    const diffs = [];
    if (record && updatedRecord) {
        const recordIdentity = (0, _record.cloneRecordIdentity)(record);
        if (updatedRecord.attributes) {
            Object.keys(updatedRecord.attributes).forEach(attribute => {
                let value = updatedRecord.attributes[attribute];
                if (record.attributes === undefined || !(0, _utils.eq)(record.attributes[attribute], value)) {
                    let op = {
                        op: 'replaceAttribute',
                        record: recordIdentity,
                        attribute,
                        value
                    };
                    diffs.push(op);
                }
            });
        }
        if (updatedRecord.keys) {
            Object.keys(updatedRecord.keys).forEach(key => {
                let value = updatedRecord.keys[key];
                if (record.keys === undefined || !(0, _utils.eq)(record.keys[key], value)) {
                    let op = {
                        op: 'replaceKey',
                        record: recordIdentity,
                        key,
                        value
                    };
                    diffs.push(op);
                }
            });
        }
        // TODO - handle relationships
    }
    return diffs;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZXJhdGlvbi5qcyJdLCJuYW1lcyI6WyJjb2FsZXNjZVJlY29yZE9wZXJhdGlvbnMiLCJyZWNvcmREaWZmcyIsIm1hcmtPcGVyYXRpb25Ub0RlbGV0ZSIsIm9wZXJhdGlvbiIsIm8iLCJfZGVsZXRlZCIsImlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUiLCJtZXJnZU9wZXJhdGlvbnMiLCJzdXBlcmNlZGVkIiwic3VwZXJjZWRpbmciLCJjb25zZWN1dGl2ZU9wcyIsInJlY29yZCIsIm9wIiwiaXNSZXBsYWNlRmllbGRPcCIsImF0dHJpYnV0ZSIsInJlbGF0aW9uc2hpcCIsInVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUiLCJ2YWx1ZSIsInVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUiLCJyZWxhdGVkUmVjb3JkIiwidXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkiLCJyZWxhdGVkUmVjb3JkcyIsInVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueSIsInJlbGF0aW9uc2hpcHMiLCJkYXRhIiwidXBkYXRlUmVjb3JkUmVtb3ZlRnJvbUhhc01hbnkiLCJhdHRyaWJ1dGVzIiwibWFwIiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsInB1c2giLCJpIiwibCIsImxlbmd0aCIsInIiLCJzcGxpY2UiLCJvcGVyYXRpb25zIiwiY3VycmVudE9wIiwiaiIsIm5leHRPcCIsImZpbHRlciIsInVwZGF0ZWRSZWNvcmQiLCJkaWZmcyIsInJlY29yZElkZW50aXR5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJ1bmRlZmluZWQiLCJrZXkiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMEhnQkEsd0IsR0FBQUEsd0I7UUF5QkFDLFcsR0FBQUEsVzs7QUFuSmhCOztBQUNBOztBQUNBLFNBQVNDLHFCQUFULENBQStCQyxTQUEvQixFQUEwQztBQUN0QyxVQUFNQyxJQUFJRCxTQUFWO0FBQ0FDLE1BQUVDLFFBQUYsR0FBYSxJQUFiO0FBQ0g7QUFDRCxTQUFTQyx5QkFBVCxDQUFtQ0gsU0FB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WUosY0FBY2QsVUFBMUIsRUFBc0NtQixPQUF0QyxDQUE4Qy9CLGFBQWE7QUFDdkQsb0JBQUlHLFFBQVF1QixjQUFjZCxVQUFkLENBQXlCWixTQUF6QixDQUFaO0FBQ0Esb0JBQUlILE9BQU9lLFVBQVAsS0FBc0JvQixTQUF0QixJQUFtQyxDQUFDLGVBQUduQyxPQUFPZSxVQUFQLENBQWtCWixTQUFsQixDQUFILEVBQWlDRyxLQUFqQyxDQUF4QyxFQUFpRjtBQUM3RSx3QkFBSUwsS0FBSztBQUNMQSw0QkFBSSxrQkFEQztBQUVMRCxnQ0FBUStCLGNBRkg7QUFHTDVCLGlDQUhLO0FBSUxHO0FBSksscUJBQVQ7QUFNQXdCLDBCQUFNWixJQUFOLENBQVdqQixFQUFYO0FBQ0g7QUFDSixhQVhEO0FBWUg7QUFDRCxZQUFJNEIsY0FBY0ksSUFBbEIsRUFBd0I7QUFDcEJELG1CQUFPQyxJQUFQLENBQVlKLGNBQWNJLElBQTFCLEVBQWdDQyxPQUFoQyxDQUF3Q0UsT0FBTztBQUMzQyxvQkFBSTlCLFFBQVF1QixjQUFjSSxJQUFkLENBQW1CRyxHQUFuQixDQUFaO0FBQ0Esb0JBQUlwQyxPQUFPaUMsSUFBUCxLQUFnQkUsU0FBaEIsSUFBNkIsQ0FBQyxlQUFHbkMsT0FBT2lDLElBQVAsQ0FBWUcsR0FBWixDQUFILEVBQXFCOUIsS0FBckIsQ0FBbEMsRUFBK0Q7QUFDM0Qsd0JBQUlMLEtBQUs7QUFDTEEsNEJBQUksWUFEQztBQUVMRCxnQ0FBUStCLGNBRkg7QUFHTEssMkJBSEs7QUFJTDlCO0FBSksscUJBQVQ7QUFNQXdCLDBCQUFNWixJQUFOLENBQVdqQixFQUFYO0FBQ0g7QUFDSixhQVhEO0FBWUg7QUFDRDtBQUNIO0FBQ0QsV0FBTzZCLEtBQVA7QUFDSCIsImZpbGUiOiJvcGVyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgeyBlcSwgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5mdW5jdGlvbiBtYXJrT3BlcmF0aW9uVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICBvLl9kZWxldGVkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICByZXR1cm4gby5fZGVsZXRlZCA9PT0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1lcmdlT3BlcmF0aW9ucyhzdXBlcmNlZGVkLCBzdXBlcmNlZGluZywgY29uc2VjdXRpdmVPcHMpIHtcbiAgICBpZiAoZXF1YWxSZWNvcmRJZGVudGl0aWVzKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWNvcmQpKSB7XG4gICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGVkKTtcbiAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoc3VwZXJjZWRpbmcpICYmIChjb25zZWN1dGl2ZU9wcyB8fCBzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSkge1xuICAgICAgICAgICAgaWYgKGlzUmVwbGFjZUZpZWxkT3Aoc3VwZXJjZWRlZC5vcCkgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgJiYgc3VwZXJjZWRlZC5hdHRyaWJ1dGUgPT09IHN1cGVyY2VkaW5nLmF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQuYXR0cmlidXRlLCBzdXBlcmNlZGVkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLmF0dHJpYnV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRlZFJlY29yZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc09uZShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXAsIHN1cGVyY2VkaW5nLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdXBlcmNlZGVkLm9wID0gJ3JlcGxhY2VSZWNvcmQnO1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnIHx8IHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlQXR0cmlidXRlJykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ2FkZFRvUmVsYXRlZFJlY29yZHMnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkaW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwcyAmJiBzdXBlcmNlZGVkLnJlY29yZC5yZWxhdGlvbnNoaXBzW3N1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcF0gJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRlZC5yZWxhdGlvbnNoaXAgPT09IHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCAmJiBlcXVhbFJlY29yZElkZW50aXRpZXMoc3VwZXJjZWRlZC5yZWxhdGVkUmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJyB8fCBzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHMgJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdICYmIHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHNbc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwXS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZW1vdmVGcm9tSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpc1JlcGxhY2VGaWVsZE9wKG9wKSB7XG4gICAgcmV0dXJuIG9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVwbGFjZUF0dHJpYnV0ZShyZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgIHJlY29yZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCBjbG9uZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmRzLm1hcChjbG9uZVJlY29yZElkZW50aXR5KSk7XG59XG5mdW5jdGlvbiB1cGRhdGVSZWNvcmRBZGRUb0hhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSkgfHwgW107XG4gICAgZGF0YS5wdXNoKGNsb25lUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCkpO1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIGRhdGEpO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVtb3ZlRnJvbUhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHIgPSBkYXRhW2ldO1xuICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBDb2FsZXNjZXMgb3BlcmF0aW9ucyBpbnRvIGEgbWluaW1hbCBzZXQgb2YgZXF1aXZhbGVudCBvcGVyYXRpb25zLlxuICpcbiAqIFRoaXMgbWV0aG9kIHJlc3BlY3RzIHRoZSBvcmRlciBvZiB0aGUgb3BlcmF0aW9ucyBhcnJheSBhbmQgZG9lcyBub3QgYWxsb3dcbiAqIHJlb3JkZXJpbmcgb2Ygb3BlcmF0aW9ucyB0aGF0IGFmZmVjdCByZWxhdGlvbnNoaXBzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9uW119IG9wZXJhdGlvbnNcbiAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyhvcGVyYXRpb25zKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBvcGVyYXRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBsZXQgY3VycmVudE9wID0gb3BlcmF0aW9uc1tpXTtcbiAgICAgICAgbGV0IGNvbnNlY3V0aXZlT3BzID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dE9wID0gb3BlcmF0aW9uc1tqXTtcbiAgICAgICAgICAgIG1lcmdlT3BlcmF0aW9ucyhjdXJyZW50T3AsIG5leHRPcCwgY29uc2VjdXRpdmVPcHMpO1xuICAgICAgICAgICAgaWYgKGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoY3VycmVudE9wKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShuZXh0T3ApKSB7XG4gICAgICAgICAgICAgICAgY29uc2VjdXRpdmVPcHMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9ucy5maWx0ZXIobyA9PiAhaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShvKSk7XG59XG4vKipcbiAqIERldGVybWluZSB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBhIHJlY29yZCBhbmQgaXRzIHVwZGF0ZWQgdmVyc2lvbiBpbiB0ZXJtc1xuICogb2YgYSBzZXQgb2Ygb3BlcmF0aW9ucy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gKiBAcGFyYW0ge1JlY29yZH0gdXBkYXRlZFJlY29yZFxuICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkRGlmZnMocmVjb3JkLCB1cGRhdGVkUmVjb3JkKSB7XG4gICAgY29uc3QgZGlmZnMgPSBbXTtcbiAgICBpZiAocmVjb3JkICYmIHVwZGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIGlmICh1cGRhdGVkUmVjb3JkLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdO1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkIHx8ICFlcShyZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlQXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVjb3JkSWRlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkaWZmcy5wdXNoKG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZFJlY29yZC5rZXlzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh1cGRhdGVkUmVjb3JkLmtleXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB1cGRhdGVkUmVjb3JkLmtleXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkLmtleXMgPT09IHVuZGVmaW5lZCB8fCAhZXEocmVjb3JkLmtleXNba2V5XSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZUtleScsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlY29yZElkZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGlmZnMucHVzaChvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETyAtIGhhbmRsZSByZWxhdGlvbnNoaXBzXG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbn0iXX0=