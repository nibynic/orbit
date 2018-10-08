'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloneRecordIdentity = cloneRecordIdentity;
exports.equalRecordIdentities = equalRecordIdentities;
exports.mergeRecords = mergeRecords;

var _utils = require('@orbit/utils');

function cloneRecordIdentity(identity) {
    const { type, id } = identity;
    return { type, id };
}
function equalRecordIdentities(record1, record2) {
    return (0, _utils.isNone)(record1) && (0, _utils.isNone)(record2) || (0, _utils.isObject)(record1) && (0, _utils.isObject)(record2) && record1.type === record2.type && record1.id === record2.id;
}
function mergeRecords(current, updates) {
    if (current) {
        let record = cloneRecordIdentity(current);
        ['attributes', 'keys', 'relationships'].forEach(grouping => {
            if (current[grouping] && updates[grouping]) {
                record[grouping] = (0, _utils.merge)({}, current[grouping], updates[grouping]);
            } else if (current[grouping]) {
                record[grouping] = (0, _utils.merge)({}, current[grouping]);
            } else if (updates[grouping]) {
                record[grouping] = (0, _utils.merge)({}, updates[grouping]);
            }
        });
        return record;
    } else {
        return updates;
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY29yZC5qcyJdLCJuYW1lcyI6WyJjbG9uZVJlY29yZElkZW50aXR5IiwiZXF1YWxSZWNvcmRJZGVudGl0aWVzIiwibWVyZ2VSZWNvcmRzIiwiaWRlbnRpdHkiLCJ0eXBlIiwiaWQiLCJyZWNvcmQxIiwicmVjb3JkMiIsImN1cnJlbnQiLCJ1cGRhdGVzIiwicmVjb3JkIiwiZm9yRWFjaCIsImdyb3VwaW5nIl0sIm1hcHBpbmdzIjoiOzs7OztRQUNnQkEsbUIsR0FBQUEsbUI7UUFJQUMscUIsR0FBQUEscUI7UUFHQUMsWSxHQUFBQSxZOztBQVJoQjs7QUFDTyxTQUFTRixtQkFBVCxDQUE2QkcsUUFBN0IsRUFBdUM7QUFDMUMsVUFBTSxFQUFFQyxJQUFGLEVBQVFDLEVBQVIsS0FBZUYsUUFBckI7QUFDQSxXQUFPLEVBQUVDLElBQUYsRUFBUUMsRUFBUixFQUFQO0FBQ0g7QUFDTSxTQUFTSixxQkFBVCxDQUErQkssT0FBL0IsRUFBd0NDLE9BQXhDLEVBQWlEO0FBQ3BELFdBQU8sbUJBQU9ELE9BQVAsS0FBbUIsbUJBQU9DLE9BQVAsQ0FBbkIsSUFBc0MscUJBQVNELE9BQVQsS0FBcUIscUJBQVNDLE9BQVQsQ0FBckIsSUFBMENELFFBQVFGLElBQVIsS0FBaUJHLFFBQVFILElBQW5FLElBQTJFRSxRQUFRRCxFQUFSLEtBQWVFLFFBQVFGLEVBQS9JO0FBQ0g7QUFDTSxTQUFTSCxZQUFULENBQXNCTSxPQUF0QixFQUErQkMsT0FBL0IsRUFBd0M7QUFDM0MsUUFBSUQsT0FBSixFQUFhO0FBQ1QsWUFBSUUsU0FBU1Ysb0JBQW9CUSxPQUFwQixDQUFiO0FBQ0EsU0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixlQUF2QixFQUF3Q0csT0FBeEMsQ0FBZ0RDLFlBQVk7QUFDeEQsZ0JBQUlKLFFBQVFJLFFBQVIsS0FBcUJILFFBQVFHLFFBQVIsQ0FBekIsRUFBNEM7QUFDeENGLHVCQUFPRSxRQUFQLElBQW1CLGtCQUFNLEVBQU4sRUFBVUosUUFBUUksUUFBUixDQUFWLEVBQTZCSCxRQUFRRyxRQUFSLENBQTdCLENBQW5CO0FBQ0gsYUFGRCxNQUVPLElBQUlKLFFBQVFJLFFBQVIsQ0FBSixFQUF1QjtBQUMxQkYsdUJBQU9FLFFBQVAsSUFBbUIsa0JBQU0sRUFBTixFQUFVSixRQUFRSSxRQUFSLENBQVYsQ0FBbkI7QUFDSCxhQUZNLE1BRUEsSUFBSUgsUUFBUUcsUUFBUixDQUFKLEVBQXVCO0FBQzFCRix1QkFBT0UsUUFBUCxJQUFtQixrQkFBTSxFQUFOLEVBQVVILFFBQVFHLFFBQVIsQ0FBVixDQUFuQjtBQUNIO0FBQ0osU0FSRDtBQVNBLGVBQU9GLE1BQVA7QUFDSCxLQVpELE1BWU87QUFDSCxlQUFPRCxPQUFQO0FBQ0g7QUFDSiIsImZpbGUiOiJyZWNvcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCwgaXNOb25lLCBtZXJnZSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgZnVuY3Rpb24gY2xvbmVSZWNvcmRJZGVudGl0eShpZGVudGl0eSkge1xuICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IGlkZW50aXR5O1xuICAgIHJldHVybiB7IHR5cGUsIGlkIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZXF1YWxSZWNvcmRJZGVudGl0aWVzKHJlY29yZDEsIHJlY29yZDIpIHtcbiAgICByZXR1cm4gaXNOb25lKHJlY29yZDEpICYmIGlzTm9uZShyZWNvcmQyKSB8fCBpc09iamVjdChyZWNvcmQxKSAmJiBpc09iamVjdChyZWNvcmQyKSAmJiByZWNvcmQxLnR5cGUgPT09IHJlY29yZDIudHlwZSAmJiByZWNvcmQxLmlkID09PSByZWNvcmQyLmlkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUmVjb3JkcyhjdXJyZW50LCB1cGRhdGVzKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgbGV0IHJlY29yZCA9IGNsb25lUmVjb3JkSWRlbnRpdHkoY3VycmVudCk7XG4gICAgICAgIFsnYXR0cmlidXRlcycsICdrZXlzJywgJ3JlbGF0aW9uc2hpcHMnXS5mb3JFYWNoKGdyb3VwaW5nID0+IHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50W2dyb3VwaW5nXSAmJiB1cGRhdGVzW2dyb3VwaW5nXSkge1xuICAgICAgICAgICAgICAgIHJlY29yZFtncm91cGluZ10gPSBtZXJnZSh7fSwgY3VycmVudFtncm91cGluZ10sIHVwZGF0ZXNbZ3JvdXBpbmddKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFtncm91cGluZ10pIHtcbiAgICAgICAgICAgICAgICByZWNvcmRbZ3JvdXBpbmddID0gbWVyZ2Uoe30sIGN1cnJlbnRbZ3JvdXBpbmddKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXBkYXRlc1tncm91cGluZ10pIHtcbiAgICAgICAgICAgICAgICByZWNvcmRbZ3JvdXBpbmddID0gbWVyZ2Uoe30sIHVwZGF0ZXNbZ3JvdXBpbmddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVwZGF0ZXM7XG4gICAgfVxufSJdfQ==