'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

const InverseTransforms = {
    addRecord(cache, op) {
        const { type, id } = op.record;
        const current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type, id }
            };
        } else if ((0, _utils.eq)(current, op.record)) {
            return;
        } else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord(cache, op) {
        const replacement = op.record;
        const { type, id } = replacement;
        const current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type, id }
            };
        } else {
            let result = { type, id };
            let changed = false;
            ['attributes', 'keys'].forEach(grouping => {
                if (replacement[grouping]) {
                    Object.keys(replacement[grouping]).forEach(field => {
                        let value = replacement[grouping][field];
                        let currentValue = (0, _utils.deepGet)(current, [grouping, field]);
                        if (!(0, _utils.eq)(value, currentValue)) {
                            changed = true;
                            (0, _utils.deepSet)(result, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(field => {
                    let currentValue = (0, _utils.deepGet)(current, ['relationships', field]);
                    let value = replacement.relationships[field];
                    let data = value && value.data;
                    let relationshipMatch;
                    if ((0, _utils.isArray)(data)) {
                        relationshipMatch = cache.relationships.relatedRecordsMatch(op.record, field, data);
                    } else {
                        relationshipMatch = (0, _utils.eq)(value, currentValue);
                    }
                    if (!relationshipMatch) {
                        changed = true;
                        (0, _utils.deepSet)(result, ['relationships', field], currentValue === undefined ? null : currentValue);
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
    removeRecord(cache, op) {
        const { type, id } = op.record;
        const current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey(cache, op) {
        const { type, id } = op.record;
        const record = cache.records(type).get(id);
        const current = record && (0, _utils.deepGet)(record, ['keys', op.key]);
        if (!(0, _utils.eq)(current, op.value)) {
            return {
                op: 'replaceKey',
                record: { type, id },
                key: op.key,
                value: current
            };
        }
    },
    replaceAttribute(cache, op) {
        const { type, id } = op.record;
        const { attribute } = op;
        const record = cache.records(type).get(id);
        const current = record && (0, _utils.deepGet)(record, ['attributes', attribute]);
        if (!(0, _utils.eq)(current, op.value)) {
            return {
                op: 'replaceAttribute',
                record: { type, id },
                attribute,
                value: current
            };
        }
    },
    addToRelatedRecords(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'removeFromRelatedRecords',
                record,
                relationship,
                relatedRecord
            };
        }
    },
    removeFromRelatedRecords(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'addToRelatedRecords',
                record,
                relationship,
                relatedRecord
            };
        }
    },
    replaceRelatedRecords(cache, op) {
        const { record, relationship, relatedRecords } = op;
        if (!cache.relationships.relatedRecordsMatch(record, relationship, relatedRecords)) {
            return {
                op: 'replaceRelatedRecords',
                record,
                relationship,
                relatedRecords: cache.relationships.relatedRecords(record, relationship)
            };
        }
    },
    replaceRelatedRecord(cache, op) {
        const { record, relationship, relatedRecord } = op;
        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'replaceRelatedRecord',
                record,
                relationship,
                relatedRecord: cache.relationships.relatedRecord(record, relationship) || null
            };
        }
    }
};
exports.default = InverseTransforms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy5qcyJdLCJuYW1lcyI6WyJJbnZlcnNlVHJhbnNmb3JtcyIsImFkZFJlY29yZCIsImNhY2hlIiwib3AiLCJ0eXBlIiwiaWQiLCJyZWNvcmQiLCJjdXJyZW50IiwicmVjb3JkcyIsImdldCIsInVuZGVmaW5lZCIsInJlcGxhY2VSZWNvcmQiLCJyZXBsYWNlbWVudCIsInJlc3VsdCIsImNoYW5nZWQiLCJmb3JFYWNoIiwiZ3JvdXBpbmciLCJPYmplY3QiLCJrZXlzIiwiZmllbGQiLCJ2YWx1ZSIsImN1cnJlbnRWYWx1ZSIsInJlbGF0aW9uc2hpcHMiLCJkYXRhIiwicmVsYXRpb25zaGlwTWF0Y2giLCJyZWxhdGVkUmVjb3Jkc01hdGNoIiwicmVtb3ZlUmVjb3JkIiwicmVwbGFjZUtleSIsImtleSIsInJlcGxhY2VBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCIsInJlbGF0aW9uc2hpcEV4aXN0cyIsInJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBLE1BQU1BLG9CQUFvQjtBQUN0QkMsY0FBVUMsS0FBVixFQUFpQkMsRUFBakIsRUFBcUI7QUFDakIsY0FBTSxFQUFFQyxJQUFGLEVBQVFDLEVBQVIsS0FBZUYsR0FBR0csTUFBeEI7QUFDQSxjQUFNQyxVQUFVTCxNQUFNTSxPQUFOLENBQWNKLElBQWQsRUFBb0JLLEdBQXBCLENBQXdCSixFQUF4QixDQUFoQjtBQUNBLFlBQUlFLFlBQVlHLFNBQWhCLEVBQTJCO0FBQ3ZCLG1CQUFPO0FBQ0hQLG9CQUFJLGNBREQ7QUFFSEcsd0JBQVEsRUFBRUYsSUFBRixFQUFRQyxFQUFSO0FBRkwsYUFBUDtBQUlILFNBTEQsTUFLTyxJ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QUFDSGxDLG9CQUFJLHVCQUREO0FBRUhHLHNCQUZHO0FBR0gwQiw0QkFIRztBQUlISyxnQ0FBZ0JuQyxNQUFNb0IsYUFBTixDQUFvQmUsY0FBcEIsQ0FBbUMvQixNQUFuQyxFQUEyQzBCLFlBQTNDO0FBSmIsYUFBUDtBQU1IO0FBQ0osS0F4SXFCO0FBeUl0Qk0seUJBQXFCcEMsS0FBckIsRUFBNEJDLEVBQTVCLEVBQWdDO0FBQzVCLGNBQU0sRUFBRUcsTUFBRixFQUFVMEIsWUFBVixFQUF3QkMsYUFBeEIsS0FBMEM5QixFQUFoRDtBQUNBLFlBQUksQ0FBQ0QsTUFBTW9CLGFBQU4sQ0FBb0JZLGtCQUFwQixDQUF1QzVCLE1BQXZDLEVBQStDMEIsWUFBL0MsRUFBNkRDLGFBQTdELENBQUwsRUFBa0Y7QUFDOUUsbUJBQU87QUFDSDlCLG9CQUFJLHNCQUREO0FBRUhHLHNCQUZHO0FBR0gwQiw0QkFIRztBQUlIQywrQkFBZS9CLE1BQU1vQixhQUFOLENBQW9CVyxhQUFwQixDQUFrQzNCLE1BQWxDLEVBQTBDMEIsWUFBMUMsS0FBMkQ7QUFKdkUsYUFBUDtBQU1IO0FBQ0o7QUFuSnFCLENBQTFCO2tCQXFKZWhDLGlCIiwiZmlsZSI6ImNhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZXBHZXQsIGRlZXBTZXQsIGVxLCBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmNvbnN0IEludmVyc2VUcmFuc2Zvcm1zID0ge1xuICAgIGFkZFJlY29yZChjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVtb3ZlUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChlcShjdXJyZW50LCBvcC5yZWNvcmQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiBjdXJyZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXBsYWNlUmVjb3JkKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCByZXBsYWNlbWVudCA9IG9wLnJlY29yZDtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gcmVwbGFjZW1lbnQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGlmIChjdXJyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHsgdHlwZSwgaWQgfTtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBbJ2F0dHJpYnV0ZXMnLCAna2V5cyddLmZvckVhY2goZ3JvdXBpbmcgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudFtncm91cGluZ10pIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVwbGFjZW1lbnRbZ3JvdXBpbmddKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlcGxhY2VtZW50W2dyb3VwaW5nXVtmaWVsZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlID0gZGVlcEdldChjdXJyZW50LCBbZ3JvdXBpbmcsIGZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVxKHZhbHVlLCBjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFNldChyZXN1bHQsIFtncm91cGluZywgZmllbGRdLCBjdXJyZW50VmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudC5yZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVwbGFjZW1lbnQucmVsYXRpb25zaGlwcykuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBkZWVwR2V0KGN1cnJlbnQsIFsncmVsYXRpb25zaGlwcycsIGZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHNbZmllbGRdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHZhbHVlICYmIHZhbHVlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWxhdGlvbnNoaXBNYXRjaDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcE1hdGNoID0gY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3Jkc01hdGNoKG9wLnJlY29yZCwgZmllbGQsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwTWF0Y2ggPSBlcSh2YWx1ZSwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbGF0aW9uc2hpcE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBTZXQocmVzdWx0LCBbJ3JlbGF0aW9uc2hpcHMnLCBmaWVsZF0sIGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkOiByZXN1bHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVSZWNvcmQoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZDogY3VycmVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZUtleShjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSByZWNvcmQgJiYgZGVlcEdldChyZWNvcmQsIFsna2V5cycsIG9wLmtleV0pO1xuICAgICAgICBpZiAoIWVxKGN1cnJlbnQsIG9wLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VLZXknLFxuICAgICAgICAgICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9LFxuICAgICAgICAgICAgICAgIGtleTogb3Aua2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBjdXJyZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXBsYWNlQXR0cmlidXRlKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlidXRlIH0gPSBvcDtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gcmVjb3JkICYmIGRlZXBHZXQocmVjb3JkLCBbJ2F0dHJpYnV0ZXMnLCBhdHRyaWJ1dGVdKTtcbiAgICAgICAgaWYgKCFlcShjdXJyZW50LCBvcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlQXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IHsgdHlwZSwgaWQgfSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGN1cnJlbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xuICAgICAgICBpZiAoIWNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xuICAgICAgICBpZiAoY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAnYWRkVG9SZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH0gPSBvcDtcbiAgICAgICAgaWYgKCFjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzTWF0Y2gocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkczogY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH0gPSBvcDtcbiAgICAgICAgaWYgKCFjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcbiAgICAgICAgICAgICAgICByZWxhdGVkUmVjb3JkOiBjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHx8IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgSW52ZXJzZVRyYW5zZm9ybXM7Il19