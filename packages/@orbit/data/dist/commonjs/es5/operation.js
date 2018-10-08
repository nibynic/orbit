'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.coalesceRecordOperations = coalesceRecordOperations;
exports.recordDiffs = recordDiffs;

var _record = require('./record');

var _utils = require('@orbit/utils');

function markOperationToDelete(operation) {
    var o = operation;
    o._deleted = true;
}
function isOperationMarkedToDelete(operation) {
    var o = operation;
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
    var data = (0, _utils.deepGet)(record, ['relationships', relationship, 'data']) || [];
    data.push((0, _record.cloneRecordIdentity)(relatedRecord));
    (0, _utils.deepSet)(record, ['relationships', relationship, 'data'], data);
}
function updateRecordRemoveFromHasMany(record, relationship, relatedRecord) {
    var data = (0, _utils.deepGet)(record, ['relationships', relationship, 'data']);
    if (data) {
        for (var i = 0, l = data.length; i < l; i++) {
            var r = data[i];
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
function recordDiffs(record, updatedRecord) {
    var diffs = [];
    if (record && updatedRecord) {
        var recordIdentity = (0, _record.cloneRecordIdentity)(record);
        if (updatedRecord.attributes) {
            Object.keys(updatedRecord.attributes).forEach(function (attribute) {
                var value = updatedRecord.attributes[attribute];
                if (record.attributes === undefined || !(0, _utils.eq)(record.attributes[attribute], value)) {
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
                if (record.keys === undefined || !(0, _utils.eq)(record.keys[key], value)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZXJhdGlvbi5qcyJdLCJuYW1lcyI6WyJvIiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIiwic3VwZXJjZWRlZCIsInN1cGVyY2VkaW5nIiwibWFya09wZXJhdGlvblRvRGVsZXRlIiwiaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZSIsImNvbnNlY3V0aXZlT3BzIiwiaXNSZXBsYWNlRmllbGRPcCIsInVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUiLCJ1cGRhdGVSZWNvcmRSZXBsYWNlSGFzT25lIiwidXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkiLCJ1cGRhdGVSZWNvcmRBZGRUb0hhc01hbnkiLCJ1cGRhdGVSZWNvcmRSZW1vdmVGcm9tSGFzTWFueSIsIm9wIiwicmVjb3JkIiwiZGVlcFNldCIsImNsb25lUmVjb3JkSWRlbnRpdHkiLCJyZWxhdGVkUmVjb3JkcyIsImRhdGEiLCJkZWVwR2V0IiwiaSIsImwiLCJyIiwib3BlcmF0aW9ucyIsImN1cnJlbnRPcCIsImoiLCJuZXh0T3AiLCJtZXJnZU9wZXJhdGlvbnMiLCJkaWZmcyIsInJlY29yZElkZW50aXR5IiwidXBkYXRlZFJlY29yZCIsIk9iamVjdCIsInZhbHVlIiwiZXEiLCJhdHRyaWJ1dGUiLCJrZXkiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMEhPLHdCLEdBQUEsd0I7UUF5QkEsVyxHQUFBLFc7Ozs7QUFsSlA7O0FBQ0EsU0FBQSxxQkFBQSxDQUFBLFNBQUEsRUFBMEM7QUFDdEMsUUFBTUEsSUFBTixTQUFBO0FBQ0FBLE1BQUFBLFFBQUFBLEdBQUFBLElBQUFBO0FBQ0g7QUFDRCxTQUFBLHlCQUFBLENBQUEsU0FBQSxFQUE4QztBQUMxQyxRQUFNQSxJQUFOLFNBQUE7QUFDQSxXQUFPQSxFQUFBQSxRQUFBQSxLQUFQLElBQUE7QUFDSDtBQUNELFNBQUEsZUFBQSxDQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsY0FBQSxFQUFrRTtBQUM5RCxRQUFJQyxtQ0FBc0JDLFdBQXRCRCxNQUFBQSxFQUF5Q0Us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LHdCQUFJcEIsS0FBSztBQUNMQSw0QkFESyxrQkFBQTtBQUVMQyxnQ0FGSyxjQUFBO0FBR0xvQixtQ0FISyxTQUFBO0FBSUxGLCtCQUFBQTtBQUpLLHFCQUFUO0FBTUFKLDBCQUFBQSxJQUFBQSxDQUFBQSxFQUFBQTtBQUNIO0FBVkxHLGFBQUFBO0FBWUg7QUFDRCxZQUFJRCxjQUFKLElBQUEsRUFBd0I7QUFDcEJDLG1CQUFBQSxJQUFBQSxDQUFZRCxjQUFaQyxJQUFBQSxFQUFBQSxPQUFBQSxDQUF3QyxVQUFBLEdBQUEsRUFBTztBQUMzQyxvQkFBSUMsUUFBUUYsY0FBQUEsSUFBQUEsQ0FBWixHQUFZQSxDQUFaO0FBQ0Esb0JBQUloQixPQUFBQSxJQUFBQSxLQUFBQSxTQUFBQSxJQUE2QixDQUFDbUIsZUFBR25CLE9BQUFBLElBQUFBLENBQUhtQixHQUFHbkIsQ0FBSG1CLEVBQWxDLEtBQWtDQSxDQUFsQyxFQUErRDtBQUMzRCx3QkFBSXBCLEtBQUs7QUFDTEEsNEJBREssWUFBQTtBQUVMQyxnQ0FGSyxjQUFBO0FBR0xxQiw2QkFISyxHQUFBO0FBSUxILCtCQUFBQTtBQUpLLHFCQUFUO0FBTUFKLDBCQUFBQSxJQUFBQSxDQUFBQSxFQUFBQTtBQUNIO0FBVkxHLGFBQUFBO0FBWUg7QUFDRDtBQUNIO0FBQ0QsV0FBQSxLQUFBO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZVJlY29yZElkZW50aXR5LCBlcXVhbFJlY29yZElkZW50aXRpZXMgfSBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgeyBlcSwgZGVlcEdldCwgZGVlcFNldCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5mdW5jdGlvbiBtYXJrT3BlcmF0aW9uVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICBvLl9kZWxldGVkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUob3BlcmF0aW9uKSB7XG4gICAgY29uc3QgbyA9IG9wZXJhdGlvbjtcbiAgICByZXR1cm4gby5fZGVsZXRlZCA9PT0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG1lcmdlT3BlcmF0aW9ucyhzdXBlcmNlZGVkLCBzdXBlcmNlZGluZywgY29uc2VjdXRpdmVPcHMpIHtcbiAgICBpZiAoZXF1YWxSZWNvcmRJZGVudGl0aWVzKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWNvcmQpKSB7XG4gICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlbW92ZVJlY29yZCcpIHtcbiAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGVkKTtcbiAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoc3VwZXJjZWRpbmcpICYmIChjb25zZWN1dGl2ZU9wcyB8fCBzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSkge1xuICAgICAgICAgICAgaWYgKGlzUmVwbGFjZUZpZWxkT3Aoc3VwZXJjZWRlZC5vcCkgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgJiYgc3VwZXJjZWRlZC5hdHRyaWJ1dGUgPT09IHN1cGVyY2VkaW5nLmF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VwZXJjZWRlZC5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnICYmIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwID09PSBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VBdHRyaWJ1dGUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQuYXR0cmlidXRlLCBzdXBlcmNlZGVkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLmF0dHJpYnV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1cGVyY2VkZWQucmVsYXRlZFJlY29yZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkZWQucmVsYXRpb25zaGlwLCBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0aW9uc2hpcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdXBlcmNlZGVkLnJlbGF0ZWRSZWNvcmRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VBdHRyaWJ1dGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc09uZShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXAsIHN1cGVyY2VkaW5nLnJlbGF0ZWRSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdXBlcmNlZGVkLm9wID0gJ3JlcGxhY2VSZWNvcmQnO1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnIHx8IHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykgJiYgaXNSZXBsYWNlRmllbGRPcChzdXBlcmNlZGluZy5vcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRpbmcub3AgPT09ICdyZXBsYWNlQXR0cmlidXRlJykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZXBsYWNlQXR0cmlidXRlKHN1cGVyY2VkZWQucmVjb3JkLCBzdXBlcmNlZGluZy5hdHRyaWJ1dGUsIHN1cGVyY2VkaW5nLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVjb3JkUmVwbGFjZUhhc01hbnkoc3VwZXJjZWRlZC5yZWNvcmQsIHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCwgc3VwZXJjZWRpbmcucmVsYXRlZFJlY29yZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGluZy5vcCA9PT0gJ2FkZFRvUmVsYXRlZFJlY29yZHMnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdhZGRSZWNvcmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya09wZXJhdGlvblRvRGVsZXRlKHN1cGVyY2VkaW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkZWQub3AgPT09ICdyZXBsYWNlUmVjb3JkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwcyAmJiBzdXBlcmNlZGVkLnJlY29yZC5yZWxhdGlvbnNoaXBzW3N1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcF0gJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlY29yZEFkZFRvSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN1cGVyY2VkaW5nLm9wID09PSAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJykge1xuICAgICAgICAgICAgICAgIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkVG9SZWxhdGVkUmVjb3JkcycgJiYgc3VwZXJjZWRlZC5yZWxhdGlvbnNoaXAgPT09IHN1cGVyY2VkaW5nLnJlbGF0aW9uc2hpcCAmJiBlcXVhbFJlY29yZElkZW50aXRpZXMoc3VwZXJjZWRlZC5yZWxhdGVkUmVjb3JkLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrT3BlcmF0aW9uVG9EZWxldGUoc3VwZXJjZWRlZCk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdXBlcmNlZGVkLm9wID09PSAnYWRkUmVjb3JkJyB8fCBzdXBlcmNlZGVkLm9wID09PSAncmVwbGFjZVJlY29yZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHMgJiYgc3VwZXJjZWRlZC5yZWNvcmQucmVsYXRpb25zaGlwc1tzdXBlcmNlZGluZy5yZWxhdGlvbnNoaXBdICYmIHN1cGVyY2VkZWQucmVjb3JkLnJlbGF0aW9uc2hpcHNbc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwXS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZWNvcmRSZW1vdmVGcm9tSGFzTWFueShzdXBlcmNlZGVkLnJlY29yZCwgc3VwZXJjZWRpbmcucmVsYXRpb25zaGlwLCBzdXBlcmNlZGluZy5yZWxhdGVkUmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtPcGVyYXRpb25Ub0RlbGV0ZShzdXBlcmNlZGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpc1JlcGxhY2VGaWVsZE9wKG9wKSB7XG4gICAgcmV0dXJuIG9wID09PSAncmVwbGFjZUF0dHJpYnV0ZScgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcgfHwgb3AgPT09ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVwbGFjZUF0dHJpYnV0ZShyZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgIHJlY29yZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNPbmUocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBkZWVwU2V0KHJlY29yZCwgWydyZWxhdGlvbnNoaXBzJywgcmVsYXRpb25zaGlwLCAnZGF0YSddLCBjbG9uZVJlY29yZElkZW50aXR5KHJlbGF0ZWRSZWNvcmQpKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVJlY29yZFJlcGxhY2VIYXNNYW55KHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIHJlbGF0ZWRSZWNvcmRzLm1hcChjbG9uZVJlY29yZElkZW50aXR5KSk7XG59XG5mdW5jdGlvbiB1cGRhdGVSZWNvcmRBZGRUb0hhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSkgfHwgW107XG4gICAgZGF0YS5wdXNoKGNsb25lUmVjb3JkSWRlbnRpdHkocmVsYXRlZFJlY29yZCkpO1xuICAgIGRlZXBTZXQocmVjb3JkLCBbJ3JlbGF0aW9uc2hpcHMnLCByZWxhdGlvbnNoaXAsICdkYXRhJ10sIGRhdGEpO1xufVxuZnVuY3Rpb24gdXBkYXRlUmVjb3JkUmVtb3ZlRnJvbUhhc01hbnkocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICBjb25zdCBkYXRhID0gZGVlcEdldChyZWNvcmQsIFsncmVsYXRpb25zaGlwcycsIHJlbGF0aW9uc2hpcCwgJ2RhdGEnXSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHIgPSBkYXRhW2ldO1xuICAgICAgICAgICAgaWYgKGVxdWFsUmVjb3JkSWRlbnRpdGllcyhyLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBDb2FsZXNjZXMgb3BlcmF0aW9ucyBpbnRvIGEgbWluaW1hbCBzZXQgb2YgZXF1aXZhbGVudCBvcGVyYXRpb25zLlxuICpcbiAqIFRoaXMgbWV0aG9kIHJlc3BlY3RzIHRoZSBvcmRlciBvZiB0aGUgb3BlcmF0aW9ucyBhcnJheSBhbmQgZG9lcyBub3QgYWxsb3dcbiAqIHJlb3JkZXJpbmcgb2Ygb3BlcmF0aW9ucyB0aGF0IGFmZmVjdCByZWxhdGlvbnNoaXBzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9uW119IG9wZXJhdGlvbnNcbiAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvYWxlc2NlUmVjb3JkT3BlcmF0aW9ucyhvcGVyYXRpb25zKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBvcGVyYXRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBsZXQgY3VycmVudE9wID0gb3BlcmF0aW9uc1tpXTtcbiAgICAgICAgbGV0IGNvbnNlY3V0aXZlT3BzID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dE9wID0gb3BlcmF0aW9uc1tqXTtcbiAgICAgICAgICAgIG1lcmdlT3BlcmF0aW9ucyhjdXJyZW50T3AsIG5leHRPcCwgY29uc2VjdXRpdmVPcHMpO1xuICAgICAgICAgICAgaWYgKGlzT3BlcmF0aW9uTWFya2VkVG9EZWxldGUoY3VycmVudE9wKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShuZXh0T3ApKSB7XG4gICAgICAgICAgICAgICAgY29uc2VjdXRpdmVPcHMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9ucy5maWx0ZXIobyA9PiAhaXNPcGVyYXRpb25NYXJrZWRUb0RlbGV0ZShvKSk7XG59XG4vKipcbiAqIERldGVybWluZSB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBhIHJlY29yZCBhbmQgaXRzIHVwZGF0ZWQgdmVyc2lvbiBpbiB0ZXJtc1xuICogb2YgYSBzZXQgb2Ygb3BlcmF0aW9ucy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gKiBAcGFyYW0ge1JlY29yZH0gdXBkYXRlZFJlY29yZFxuICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkRGlmZnMocmVjb3JkLCB1cGRhdGVkUmVjb3JkKSB7XG4gICAgY29uc3QgZGlmZnMgPSBbXTtcbiAgICBpZiAocmVjb3JkICYmIHVwZGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkSWRlbnRpdHkgPSBjbG9uZVJlY29yZElkZW50aXR5KHJlY29yZCk7XG4gICAgICAgIGlmICh1cGRhdGVkUmVjb3JkLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHVwZGF0ZWRSZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdO1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkIHx8ICFlcShyZWNvcmQuYXR0cmlidXRlc1thdHRyaWJ1dGVdLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlQXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVjb3JkSWRlbnRpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkaWZmcy5wdXNoKG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZFJlY29yZC5rZXlzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh1cGRhdGVkUmVjb3JkLmtleXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB1cGRhdGVkUmVjb3JkLmtleXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkLmtleXMgPT09IHVuZGVmaW5lZCB8fCAhZXEocmVjb3JkLmtleXNba2V5XSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZUtleScsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlY29yZElkZW50aXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGlmZnMucHVzaChvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETyAtIGhhbmRsZSByZWxhdGlvbnNoaXBzXG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbn0iXX0=