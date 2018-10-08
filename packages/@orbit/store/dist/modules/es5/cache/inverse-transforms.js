import { deepGet, deepSet, eq, isArray } from '@orbit/utils';
var InverseTransforms = {
    addRecord: function (cache, op) {
        var _op$record = op.record,
            type = _op$record.type,
            id = _op$record.id;

        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else if (eq(current, op.record)) {
            return;
        } else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord: function (cache, op) {
        var replacement = op.record;
        var type = replacement.type,
            id = replacement.id;

        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else {
            var result = { type: type, id: id };
            var changed = false;
            ['attributes', 'keys'].forEach(function (grouping) {
                if (replacement[grouping]) {
                    Object.keys(replacement[grouping]).forEach(function (field) {
                        var value = replacement[grouping][field];
                        var currentValue = deepGet(current, [grouping, field]);
                        if (!eq(value, currentValue)) {
                            changed = true;
                            deepSet(result, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(function (field) {
                    var currentValue = deepGet(current, ['relationships', field]);
                    var value = replacement.relationships[field];
                    var data = value && value.data;
                    var relationshipMatch = void 0;
                    if (isArray(data)) {
                        relationshipMatch = cache.relationships.relatedRecordsMatch(op.record, field, data);
                    } else {
                        relationshipMatch = eq(value, currentValue);
                    }
                    if (!relationshipMatch) {
                        changed = true;
                        deepSet(result, ['relationships', field], currentValue === undefined ? null : currentValue);
                    }
                });
            }
            if (changed) {
                return {
                    op: 'replaceRecord',
                    record: result
                };
            }
        }
    },
    removeRecord: function (cache, op) {
        var _op$record2 = op.record,
            type = _op$record2.type,
            id = _op$record2.id;

        var current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey: function (cache, op) {
        var _op$record3 = op.record,
            type = _op$record3.type,
            id = _op$record3.id;

        var record = cache.records(type).get(id);
        var current = record && deepGet(record, ['keys', op.key]);
        if (!eq(current, op.value)) {
            return {
                op: 'replaceKey',
                record: { type: type, id: id },
                key: op.key,
                value: current
            };
        }
    },
    replaceAttribute: function (cache, op) {
        var _op$record4 = op.record,
            type = _op$record4.type,
            id = _op$record4.id;
        var attribute = op.attribute;

        var record = cache.records(type).get(id);
        var current = record && deepGet(record, ['attributes', attribute]);
        if (!eq(current, op.value)) {
            return {
                op: 'replaceAttribute',
                record: { type: type, id: id },
                attribute: attribute,
                value: current
            };
        }
    },
    addToRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'removeFromRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    removeFromRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'addToRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    replaceRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecords = op.relatedRecords;

        if (!cache.relationships.relatedRecordsMatch(record, relationship, relatedRecords)) {
            return {
                op: 'replaceRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecords: cache.relationships.relatedRecords(record, relationship)
            };
        }
    },
    replaceRelatedRecord: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'replaceRelatedRecord',
                record: record,
                relationship: relationship,
                relatedRecord: cache.relationships.relatedRecord(record, relationship) || null
            };
        }
    }
};
export default InverseTransforms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy5qcyJdLCJuYW1lcyI6WyJkZWVwR2V0IiwiZGVlcFNldCIsImVxIiwiaXNBcnJheSIsIkludmVyc2VUcmFuc2Zvcm1zIiwiYWRkUmVjb3JkIiwiY2FjaGUiLCJvcCIsInJlY29yZCIsInR5cGUiLCJpZCIsImN1cnJlbnQiLCJyZWNvcmRzIiwiZ2V0IiwidW5kZWZpbmVkIiwicmVwbGFjZVJlY29yZCIsInJlcGxhY2VtZW50IiwicmVzdWx0IiwiY2hhbmdlZCIsImZvckVhY2giLCJncm91cGluZyIsIk9iamVjdCIsImtleXMiLCJ2YWx1ZSIsImZpZWxkIiwiY3VycmVudFZhbHVlIiwicmVsYXRpb25zaGlwcyIsImRhdGEiLCJyZWxhdGlvbnNoaXBNYXRjaCIsInJlbGF0ZWRSZWNvcmRzTWF0Y2giLCJyZW1vdmVSZWNvcmQiLCJyZXBsYWNlS2V5Iiwia2V5IiwicmVwbGFjZUF0dHJpYnV0ZSIsImF0dHJpYnV0ZSIsImFkZFRvUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwicmVsYXRpb25zaGlwRXhpc3RzIiwicmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkJDLEVBQTNCLEVBQStCQyxPQUEvQixRQUE4QyxjQUE5QztBQUNBLElBQU1DLG9CQUFvQjtBQUN0QkMsYUFEc0IsWUFDWkMsS0FEWSxFQUNMQyxFQURLLEVBQ0Q7QUFBQSx5QkFDSUEsR0FBR0MsTUFEUDtBQUFBLFlBQ1RDLElBRFMsY0FDVEEsSUFEUztBQUFBLFlBQ0hDLEVBREcsY0FDSEEsRUFERzs7QUFFakIsWUFBTUMsVUFBVUwsTUFBTU0sT0FBTixDQUFjSCxJQUFkLEVBQW9CSSxHQUFwQixDQUF3QkgsRUFBeEIsQ0FB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LGtCQUFwQixDQUF1QzlCLE1BQXZDLEVBQStDNEIsWUFBL0MsRUFBNkRDLGFBQTdELENBQUwsRUFBa0Y7QUFDOUUsbUJBQU87QUFDSDlCLG9CQUFJLHNCQUREO0FBRUhDLDhCQUZHO0FBR0g0QiwwQ0FIRztBQUlIQywrQkFBZS9CLE1BQU1vQixhQUFOLENBQW9CVyxhQUFwQixDQUFrQzdCLE1BQWxDLEVBQTBDNEIsWUFBMUMsS0FBMkQ7QUFKdkUsYUFBUDtBQU1IO0FBQ0o7QUFuSnFCLENBQTFCO0FBcUpBLGVBQWVoQyxpQkFBZiIsImZpbGUiOiJjYWNoZS9pbnZlcnNlLXRyYW5zZm9ybXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwR2V0LCBkZWVwU2V0LCBlcSwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5jb25zdCBJbnZlcnNlVHJhbnNmb3JtcyA9IHtcbiAgICBhZGRSZWNvcmQoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlbW92ZVJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZXEoY3VycmVudCwgb3AucmVjb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZDogY3VycmVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZVJlY29yZChjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgcmVwbGFjZW1lbnQgPSBvcC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IHJlcGxhY2VtZW50O1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7IHR5cGUsIGlkIH07XG4gICAgICAgICAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgWydhdHRyaWJ1dGVzJywgJ2tleXMnXS5mb3JFYWNoKGdyb3VwaW5nID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVwbGFjZW1lbnRbZ3JvdXBpbmddKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcGxhY2VtZW50W2dyb3VwaW5nXSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByZXBsYWNlbWVudFtncm91cGluZ11bZmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGRlZXBHZXQoY3VycmVudCwgW2dyb3VwaW5nLCBmaWVsZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcSh2YWx1ZSwgY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBTZXQocmVzdWx0LCBbZ3JvdXBpbmcsIGZpZWxkXSwgY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVwbGFjZW1lbnQucmVsYXRpb25zaGlwcykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlID0gZGVlcEdldChjdXJyZW50LCBbJ3JlbGF0aW9uc2hpcHMnLCBmaWVsZF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByZXBsYWNlbWVudC5yZWxhdGlvbnNoaXBzW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB2YWx1ZSAmJiB2YWx1ZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVsYXRpb25zaGlwTWF0Y2g7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBNYXRjaCA9IGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNNYXRjaChvcC5yZWNvcmQsIGZpZWxkLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1hdGNoID0gZXEodmFsdWUsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWxhdGlvbnNoaXBNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWVwU2V0KHJlc3VsdCwgWydyZWxhdGlvbnNoaXBzJywgZmllbGRdLCBjdXJyZW50VmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZDogcmVzdWx0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlUmVjb3JkKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGlmIChjdXJyZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IGN1cnJlbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VLZXkoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ2tleXMnLCBvcC5rZXldKTtcbiAgICAgICAgaWYgKCFlcShjdXJyZW50LCBvcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlS2V5JyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfSxcbiAgICAgICAgICAgICAgICBrZXk6IG9wLmtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogY3VycmVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xuICAgICAgICBjb25zdCB7IGF0dHJpYnV0ZSB9ID0gb3A7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHJlY29yZCAmJiBkZWVwR2V0KHJlY29yZCwgWydhdHRyaWJ1dGVzJywgYXR0cmlidXRlXSk7XG4gICAgICAgIGlmICghZXEoY3VycmVudCwgb3AudmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZUF0dHJpYnV0ZScsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH0sXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjdXJyZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBhZGRUb1JlbGF0ZWRSZWNvcmRzKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSBvcDtcbiAgICAgICAgaWYgKCFjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSBvcDtcbiAgICAgICAgaWYgKGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcyB9ID0gb3A7XG4gICAgICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc01hdGNoKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcykpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZHM6IGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gb3A7XG4gICAgICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAsXG4gICAgICAgICAgICAgICAgcmVsYXRlZFJlY29yZDogY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwKSB8fCBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IEludmVyc2VUcmFuc2Zvcm1zOyJdfQ==