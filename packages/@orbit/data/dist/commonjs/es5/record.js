'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloneRecordIdentity = cloneRecordIdentity;
exports.equalRecordIdentities = equalRecordIdentities;
exports.mergeRecords = mergeRecords;

var _utils = require('@orbit/utils');

function cloneRecordIdentity(identity) {
    var type = identity.type,
        id = identity.id;

    return { type: type, id: id };
}
function equalRecordIdentities(record1, record2) {
    return (0, _utils.isNone)(record1) && (0, _utils.isNone)(record2) || (0, _utils.isObject)(record1) && (0, _utils.isObject)(record2) && record1.type === record2.type && record1.id === record2.id;
}
function mergeRecords(current, updates) {
    if (current) {
        var record = cloneRecordIdentity(current);
        ['attributes', 'keys', 'relationships'].forEach(function (grouping) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY29yZC5qcyJdLCJuYW1lcyI6WyJ0eXBlIiwiaWQiLCJpc05vbmUiLCJpc09iamVjdCIsInJlY29yZDEiLCJyZWNvcmQyIiwicmVjb3JkIiwiY2xvbmVSZWNvcmRJZGVudGl0eSIsImN1cnJlbnQiLCJ1cGRhdGVzIiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBQ08sbUIsR0FBQSxtQjtRQUlBLHFCLEdBQUEscUI7UUFHQSxZLEdBQUEsWTs7OztBQVBBLFNBQUEsbUJBQUEsQ0FBQSxRQUFBLEVBQXVDO0FBQUEsUUFBQSxPQUFBLFNBQUEsSUFBQTtBQUFBLFFBQUEsS0FBQSxTQUFBLEVBQUE7O0FBRTFDLFdBQU8sRUFBRUEsTUFBRixJQUFBLEVBQVFDLElBQWYsRUFBTyxFQUFQO0FBQ0g7QUFDTSxTQUFBLHFCQUFBLENBQUEsT0FBQSxFQUFBLE9BQUEsRUFBaUQ7QUFDcEQsV0FBT0MsbUJBQUFBLE9BQUFBLEtBQW1CQSxtQkFBbkJBLE9BQW1CQSxDQUFuQkEsSUFBc0NDLHFCQUFBQSxPQUFBQSxLQUFxQkEscUJBQXJCQSxPQUFxQkEsQ0FBckJBLElBQTBDQyxRQUFBQSxJQUFBQSxLQUFpQkMsUUFBM0RGLElBQUFBLElBQTJFQyxRQUFBQSxFQUFBQSxLQUFlQyxRQUF2SSxFQUFBO0FBQ0g7QUFDTSxTQUFBLFlBQUEsQ0FBQSxPQUFBLEVBQUEsT0FBQSxFQUF3QztBQUMzQyxRQUFBLE9BQUEsRUFBYTtBQUNULFlBQUlDLFNBQVNDLG9CQUFiLE9BQWFBLENBQWI7QUFDQSxTQUFBLFlBQUEsRUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBLE9BQUEsQ0FBZ0QsVUFBQSxRQUFBLEVBQVk7QUFDeEQsZ0JBQUlDLFFBQUFBLFFBQUFBLEtBQXFCQyxRQUF6QixRQUF5QkEsQ0FBekIsRUFBNEM7QUFDeENILHVCQUFBQSxRQUFBQSxJQUFtQkksa0JBQUFBLEVBQUFBLEVBQVVGLFFBQVZFLFFBQVVGLENBQVZFLEVBQTZCRCxRQUFoREgsUUFBZ0RHLENBQTdCQyxDQUFuQko7QUFESixhQUFBLE1BRU8sSUFBSUUsUUFBSixRQUFJQSxDQUFKLEVBQXVCO0FBQzFCRix1QkFBQUEsUUFBQUEsSUFBbUJJLGtCQUFBQSxFQUFBQSxFQUFVRixRQUE3QkYsUUFBNkJFLENBQVZFLENBQW5CSjtBQURHLGFBQUEsTUFFQSxJQUFJRyxRQUFKLFFBQUlBLENBQUosRUFBdUI7QUFDMUJILHVCQUFBQSxRQUFBQSxJQUFtQkksa0JBQUFBLEVBQUFBLEVBQVVELFFBQTdCSCxRQUE2QkcsQ0FBVkMsQ0FBbkJKO0FBQ0g7QUFQTCxTQUFBO0FBU0EsZUFBQSxNQUFBO0FBWEosS0FBQSxNQVlPO0FBQ0gsZUFBQSxPQUFBO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzT2JqZWN0LCBpc05vbmUsIG1lcmdlIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBjbG9uZVJlY29yZElkZW50aXR5KGlkZW50aXR5KSB7XG4gICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gaWRlbnRpdHk7XG4gICAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbFJlY29yZElkZW50aXRpZXMocmVjb3JkMSwgcmVjb3JkMikge1xuICAgIHJldHVybiBpc05vbmUocmVjb3JkMSkgJiYgaXNOb25lKHJlY29yZDIpIHx8IGlzT2JqZWN0KHJlY29yZDEpICYmIGlzT2JqZWN0KHJlY29yZDIpICYmIHJlY29yZDEudHlwZSA9PT0gcmVjb3JkMi50eXBlICYmIHJlY29yZDEuaWQgPT09IHJlY29yZDIuaWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VSZWNvcmRzKGN1cnJlbnQsIHVwZGF0ZXMpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgICBsZXQgcmVjb3JkID0gY2xvbmVSZWNvcmRJZGVudGl0eShjdXJyZW50KTtcbiAgICAgICAgWydhdHRyaWJ1dGVzJywgJ2tleXMnLCAncmVsYXRpb25zaGlwcyddLmZvckVhY2goZ3JvdXBpbmcgPT4ge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRbZ3JvdXBpbmddICYmIHVwZGF0ZXNbZ3JvdXBpbmddKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkW2dyb3VwaW5nXSA9IG1lcmdlKHt9LCBjdXJyZW50W2dyb3VwaW5nXSwgdXBkYXRlc1tncm91cGluZ10pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50W2dyb3VwaW5nXSkge1xuICAgICAgICAgICAgICAgIHJlY29yZFtncm91cGluZ10gPSBtZXJnZSh7fSwgY3VycmVudFtncm91cGluZ10pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1cGRhdGVzW2dyb3VwaW5nXSkge1xuICAgICAgICAgICAgICAgIHJlY29yZFtncm91cGluZ10gPSBtZXJnZSh7fSwgdXBkYXRlc1tncm91cGluZ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXBkYXRlcztcbiAgICB9XG59Il19