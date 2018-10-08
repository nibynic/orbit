import { cloneRecordIdentity, equalRecordIdentities } from './record';
import { eq, deepGet, deepSet } from '@orbit/utils';
function markOperationToDelete(operation) {
    var o = operation;
    o._deleted = true;
}
function isOperationMarkedToDelete(operation) {
    var o = operation;
    return o._deleted === true;
}
function mergeOperations(superceded, superceding, consecutiveOps) {
    if (equalRecordIdentities(superceded.record, superceding.record)) {
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
                if (superceded.op === 'addToRelatedRecords' && superceded.relationship === superceding.relationship && equalRecordIdentities(superceded.relatedRecord, superceding.relatedRecord)) {
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
    deepSet(record, ['relationships', relationship, 'data'], cloneRecordIdentity(relatedRecord));
}
function updateRecordReplaceHasMany(record, relationship, relatedRecords) {
    deepSet(record, ['relationships', relationship, 'data'], relatedRecords.map(cloneRecordIdentity));
}
function updateRecordAddToHasMany(record, relationship, relatedRecord) {
    var data = deepGet(record, ['relationships', relationship, 'data']) || [];
    data.push(cloneRecordIdentity(relatedRecord));
    deepSet(record, ['relationships', relationship, 'data'], data);
}
function updateRecordRemoveFromHasMany(record, relationship, relatedRecord) {
    var data = deepGet(record, ['relationships', relationship, 'data']);
    if (data) {
        for (var i = 0, l = data.length; i < l; i++) {
            var r = data[i];
            if (equalRecordIdentities(r, relatedRecord)) {
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
export function coalesceRecordOperations(operations) {
    for (var i = 0, l = operations.length; i < l; i++) {
        var currentOp = operations[i];
        var consecutiveOps = true;
        for (var j = i + 1; j < l; j++) {
            var nextOp = operations[j];
            mergeOperations(currentOp, nextOp, consecutiveOps);
            if (isOperationMarkedToDelete(currentOp)) {
                break;
            } else if (!isOperationMarkedToDelete(nextOp)) {
                consecutiveOps = false;
            }
        }
    }
    return operations.filter(function (o) {
        return !isOperationMarkedToDelete(o);
    });
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
export function recordDiffs(record, updatedRecord) {
    var diffs = [];
    if (record && updatedRecord) {
        var recordIdentity = cloneRecordIdentity(record);
        if (updatedRecord.attributes) {
            Object.keys(updatedRecord.attributes).forEach(function (attribute) {
                var value = updatedRecord.attributes[attribute];
                if (record.attributes === undefined || !eq(record.attributes[attribute], value)) {
                    var op = {
                        op: 'replaceAttribute',
                        record: recordIdentity,
                        attribute: attribute,
                        value: value
                    };
                    diffs.push(op);
                }
            });
        }
        if (updatedRecord.keys) {
            Object.keys(updatedRecord.keys).forEach(function (key) {
                var value = updatedRecord.keys[key];
                if (record.keys === undefined || !eq(record.keys[key], value)) {
                    var op = {
                        op: 'replaceKey',
                        record: recordIdentity,
                        key: key,
                        value: value
                    };
                    diffs.push(op);
                }
            });
        }
        // TODO - handle relationships
    }
    return diffs;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZXJhdGlvbi5qcyJdLCJuYW1lcyI6WyJjbG9uZVJlY29yZElkZW50aXR5IiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIiwiZXEiLCJkZWVwR2V0IiwiZGVlcFNldCIsIm1hcmtPcGVyYXRpb25Ub0RlbGV0ZSIsIm9wZXJhdGlvbiIsIm8iLCJfZGVsZXRlZCIsImlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUiLCJtZXJnZU9wZXJhdGlvbnMiLCJzdXBlcmNlZGVkIiwic3VwZXJjZWRpbmciLCJjb25zZWN1dGl2ZU9wcyIsInJlY29yZCIsIm9wIiwiaXNSZXBsYWNlRmllbGRPcCIsImF0dHJpYnV0ZSIsInJlbGF0aW9uc2hpcCIsInVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUiLCJ2YWx1ZSIsInVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUiLCJyZWxhdGVkUmVjb3JkIiwidXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkiLCJyZWxhdGVkUmVjb3JkcyIsInVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueSIsInJlbGF0aW9uc2hpcHMiLCJkYXRhIiwidXBkYXRlUmVjb3JkUmVtb3ZlRnJvbUhhc01hbnkiLCJhdHRyaWJ1dGVzIiwibWFwIiwicHVzaCIsImkiLCJsIiwibGVuZ3RoIiwiciIsInNwbGljZSIsImNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyIsIm9wZXJhdGlvbnMiLCJjdXJyZW50T3AiLCJqIiwibmV4dE9wIiwiZmlsdGVyIiwicmVjb3JkRGlmZnMiLCJ1cGRhdGVkUmVjb3JkIiwiZGlmZnMiLCJyZWNvcmRJZGVudGl0eSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwidW5kZWZpbmVkIiwia2V5Il0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxtQkFBVCxFQUE4QkMscUJBQTlCLFFBQTJELFVBQTNEO0FBQ0EsU0FBU0MsRUFBVCxFQUFhQyxPQUFiLEVBQXNCQyxPQUF0QixRQUFxQyxjQUFyQztBQUNBLFNBQVNDLHFCQUFULENBQStCQyxTQUEvQixF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YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgeyBlcSwgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5mdW5jdGlvbiBtYXJrT3BlcmF0aW9uVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICBvLl9kZWxldGVkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICByZXR1cm4gby5fZGVsZXRlZCA9PT0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1lcmdlT3BlcmF0aW9ucyhzdXBlcmNlZGVkLCBzdXBlcmNlZGluZywgY29uc2VjdXRpdmVPcHMpIHtcbiAgICBpZiAoZXF1YWxSZWNvcmRJZGVudGl0aWVzKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWNvcmQpKSB7XG4gICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGVkKTtcbiAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoc3VwZXJjZWRpbmcpICYmIChjb25zZWN1dGl2ZU9wcyB8fCBzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSkge1xuICAgICAgICAgICAgaWYgKGlzUmVwbGFjZUZpZWxkT3Aoc3VwZXJjZWRlZC5vcCkgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgJiYgc3VwZXJjZWRlZC5hdHRyaWJ1dGUgPT09IHN1cGVyY2VkaW5nLmF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQuYXR0cmlidXRlLCBzdXBlcmNlZGVkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLmF0dHJpYnV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRlZFJlY29yZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc09uZShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXAsIHN1cGVyY2VkaW5nLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdXBlcmNlZGVkLm9wID0gJ3JlcGxhY2VSZWNvcmQnO1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnIHx8IHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlQXR0cmlidXRlJykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ2FkZFRvUmVsYXRlZFJlY29yZHMnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkaW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwcyAmJiBzdXBlcmNlZGVkLnJlY29yZC5yZWxhdGlvbnNoaXBzW3N1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcF0gJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRlZC5yZWxhdGlvbnNoaXAgPT09IHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCAmJiBlcXVhbFJlY29yZElkZW50aXRpZXMoc3VwZXJjZWRlZC5yZWxhdGVkUmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJyB8fCBzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHMgJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdICYmIHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHNbc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwXS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZW1vdmVGcm9tSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpc1JlcGxhY2VGaWVsZE9wKG9wKSB7XG4gICAgcmV0dXJuIG9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVwbGFjZUF0dHJpYnV0ZShyZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgIHJlY29yZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCBjbG9uZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmRzLm1hcChjbG9uZVJlY29yZElkZW50aXR5KSk7XG59XG5mdW5jdGlvbiB1cGRhdGVSZWNvcmRBZGRUb0hhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSkgfHwgW107XG4gICAgZGF0YS5wdXNoKGNsb25lUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCkpO1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIGRhdGEpO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVtb3ZlRnJvbUhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHIgPSBkYXRhW2ldO1xuICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBDb2FsZXNjZXMgb3BlcmF0aW9ucyBpbnRvIGEgbWluaW1hbCBzZXQgb2YgZXF1aXZhbGVudCBvcGVyYXRpb25zLlxuICpcbiAqIFRoaXMgbWV0aG9kIHJlc3BlY3RzIHRoZSBvcmRlciBvZiB0aGUgb3BlcmF0aW9ucyBhcnJheSBhbmQgZG9lcyBub3QgYWxsb3dcbiAqIHJlb3JkZXJpbmcgb2Ygb3BlcmF0aW9ucyB0aGF0IGFmZmVjdCByZWxhdGlvbnNoaXBzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9uW119IG9wZXJhdGlvbnNcbiAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyhvcGVyYXRpb25zKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBvcGVyYXRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBsZXQgY3VycmVudE9wID0gb3BlcmF0aW9uc1tpXTtcbiAgICAgICAgbGV0IGNvbnNlY3V0aXZlT3BzID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dE9wID0gb3BlcmF0aW9uc1tqXTtcbiAgICAgICAgICAgIG1lcmdlT3BlcmF0aW9ucyhjdXJyZW50T3AsIG5leHRPcCwgY29uc2VjdXRpdmVPcHMpO1xuICAgICAgICAgICAgaWYgKGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoY3VycmVudE9wKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShuZXh0T3ApKSB7XG4gICAgICAgICAgICAgICAgY29uc2VjdXRpdmVPcHMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9ucy5maWx0ZXIobyA9PiAhaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShvKSk7XG59XG4vKipcbiAqIERldGVybWluZSB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBhIHJlY29yZCBhbmQgaXRzIHVwZGF0ZWQgdmVyc2lvbiBpbiB0ZXJtc1xuICogb2YgYSBzZXQgb2Ygb3BlcmF0aW9ucy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gKiBAcGFyYW0ge1JlY29yZH0gdXBkYXRlZFJlY29yZFxuICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkRGlmZnMocmVjb3JkLCB1cGRhdGVkUmVjb3JkKSB7XG4gICAgY29uc3QgZGlmZnMgPSBbXTtcbiAgICBpZiAocmVjb3JkICYmIHVwZGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIGlmICh1cGRhdGVkUmVjb3JkLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdO1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkIHx8ICFlcShyZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlQXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVjb3JkSWRlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkaWZmcy5wdXNoKG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZFJlY29yZC5rZXlzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh1cGRhdGVkUmVjb3JkLmtleXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB1cGRhdGVkUmVjb3JkLmtleXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkLmtleXMgPT09IHVuZGVmaW5lZCB8fCAhZXEocmVjb3JkLmtleXNba2V5XSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZUtleScsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlY29yZElkZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGlmZnMucHVzaChvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETyAtIGhhbmRsZSByZWxhdGlvbnNoaXBzXG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbn0iXX0=