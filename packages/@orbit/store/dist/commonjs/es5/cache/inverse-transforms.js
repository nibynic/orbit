'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('@orbit/utils');

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
        } else if ((0, _utils.eq)(current, op.record)) {
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
                        var currentValue = (0, _utils.deepGet)(current, [grouping, field]);
                        if (!(0, _utils.eq)(value, currentValue)) {
                            changed = true;
                            (0, _utils.deepSet)(result, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(function (field) {
                    var currentValue = (0, _utils.deepGet)(current, ['relationships', field]);
                    var value = replacement.relationships[field];
                    var data = value && value.data;
                    var relationshipMatch = void 0;
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
        var current = record && (0, _utils.deepGet)(record, ['keys', op.key]);
        if (!(0, _utils.eq)(current, op.value)) {
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
        var current = record && (0, _utils.deepGet)(record, ['attributes', attribute]);
        if (!(0, _utils.eq)(current, op.value)) {
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
exports.default = InverseTransforms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL2ludmVyc2UtdHJhbnNmb3Jtcy5qcyJdLCJuYW1lcyI6WyJJbnZlcnNlVHJhbnNmb3JtcyIsIm9wIiwiY3VycmVudCIsImNhY2hlIiwicmVjb3JkIiwidHlwZSIsImlkIiwiZXEiLCJyZXBsYWNlbWVudCIsInJlc3VsdCIsImNoYW5nZWQiLCJPYmplY3QiLCJ2YWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZXBHZXQiLCJkZWVwU2V0IiwiZGF0YSIsInJlbGF0aW9uc2hpcE1hdGNoIiwiaXNBcnJheSIsImtleSIsImF0dHJpYnV0ZSIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRSZWNvcmQiLCJyZWxhdGVkUmVjb3JkcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQSxJQUFNQSxvQkFBb0I7QUFBQSxlQUFBLFVBQUEsS0FBQSxFQUFBLEVBQUEsRUFDRDtBQUFBLFlBQUEsYUFDSUMsR0FESixNQUFBO0FBQUEsWUFBQSxPQUFBLFdBQUEsSUFBQTtBQUFBLFlBQUEsS0FBQSxXQUFBLEVBQUE7O0FBRWpCLFlBQU1DLFVBQVVDLE1BQUFBLE9BQUFBLENBQUFBLElBQUFBLEVBQUFBLEdBQUFBLENBQWhCLEVBQWdCQSxDQUFoQjtBQUNBLFlBQUlELFlBQUosU0FBQSxFQUEyQjtBQUN2QixtQkFBTztBQUNIRCxvQkFERyxjQUFBO0FBRUhHLHdCQUFRLEVBQUVDLE1BQUYsSUFBQSxFQUFRQyxJQUFSLEVBQUE7QUFGTCxhQUFQO0FBREosU0FBQSxNQUtPLElBQUlDLGVBQUFBLE9BQUFBLEVBQVlOLEdBQWhCLE1BQUlNLENBQUosRUFBNEI7QUFDL0I7QUFERyxTQUFBLE1BRUE7QUFDSCxtQkFBTztBQUNITixvQkFERyxlQUFBO0FBRUhHLHdCQUFRRjtBQUZMLGFBQVA7QUFJSDtBQWhCaUIsS0FBQTtBQUFBLG1CQUFBLFVBQUEsS0FBQSxFQUFBLEVBQUEsRUFrQkc7QUFDckIsWUFBTU0sY0FBY1AsR0FBcEIsTUFBQTtBQURxQixZQUFBLE9BQUEsWUFBQSxJQUFBO0FBQUEsWUFBQSxLQUFBLFlBQUEsRUFBQTs7QUFHckIsWUFBTUMsVUFBVUMsTUFBQUEsT0FBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsR0FBQUEsQ0FBaEIsRUFBZ0JBLENBQWhCO0FBQ0EsWUFBSUQsWUFBSixTQUFBLEVBQTJCO0FBQ3ZCLG1CQUFPO0FBQ0hELG9CQURHLGNBQUE7QUFFSEcsd0JBQVEsRUFBRUMsTUFBRixJQUFBLEVBQVFDLElBQVIsRUFBQTtBQUZMLGFBQVA7QUFESixTQUFBLE1BS087QUFDSCxnQkFBSUcsU0FBUyxFQUFFSixNQUFGLElBQUEsRUFBUUMsSUFBckIsRUFBYSxFQUFiO0FBQ0EsZ0JBQUlJLFVBQUosS0FBQTtBQUNBLGFBQUEsWUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLENBQStCLFVBQUEsUUFBQSxFQUFZO0FBQ3ZDLG9CQUFJRixZQUFKLFFBQUlBLENBQUosRUFBMkI7QUFDdkJHLDJCQUFBQSxJQUFBQSxDQUFZSCxZQUFaRyxRQUFZSCxDQUFaRyxFQUFBQSxPQUFBQSxDQUEyQyxVQUFBLEtBQUEsRUFBUztBQUNoRCw0QkFBSUMsUUFBUUosWUFBQUEsUUFBQUEsRUFBWixLQUFZQSxDQUFaO0FBQ0EsNEJBQUlLLGVBQWVDLG9CQUFBQSxPQUFBQSxFQUFpQixDQUFBLFFBQUEsRUFBcEMsS0FBb0MsQ0FBakJBLENBQW5CO0FBQ0EsNEJBQUksQ0FBQ1AsZUFBQUEsS0FBQUEsRUFBTCxZQUFLQSxDQUFMLEVBQThCO0FBQzFCRyxzQ0FBQUEsSUFBQUE7QUFDQUssZ0RBQUFBLE1BQUFBLEVBQWdCLENBQUEsUUFBQSxFQUFoQkEsS0FBZ0IsQ0FBaEJBLEVBQW1DRixpQkFBQUEsU0FBQUEsR0FBQUEsSUFBQUEsR0FBbkNFLFlBQUFBO0FBQ0g7QUFOTEoscUJBQUFBO0FBUUg7QUFWTCxhQUFBO0FBWUEsZ0JBQUlILFlBQUosYUFBQSxFQUErQjtBQUMzQkcsdUJBQUFBLElBQUFBLENBQVlILFlBQVpHLGFBQUFBLEVBQUFBLE9BQUFBLENBQStDLFVBQUEsS0FBQSxFQUFTO0FBQ3BELHdCQUFJRSxlQUFlQyxvQkFBQUEsT0FBQUEsRUFBaUIsQ0FBQSxlQUFBLEVBQXBDLEtBQW9DLENBQWpCQSxDQUFuQjtBQUNBLHdCQUFJRixRQUFRSixZQUFBQSxhQUFBQSxDQUFaLEtBQVlBLENBQVo7QUFDQSx3QkFBSVEsT0FBT0osU0FBU0EsTUFBcEIsSUFBQTtBQUNBLHdCQUFJSyxvQkFBQUEsS0FBSixDQUFBO0FBQ0Esd0JBQUlDLG9CQUFKLElBQUlBLENBQUosRUFBbUI7QUFDZkQsNENBQW9CZCxNQUFBQSxhQUFBQSxDQUFBQSxtQkFBQUEsQ0FBd0NGLEdBQXhDRSxNQUFBQSxFQUFBQSxLQUFBQSxFQUFwQmMsSUFBb0JkLENBQXBCYztBQURKLHFCQUFBLE1BRU87QUFDSEEsNENBQW9CVixlQUFBQSxLQUFBQSxFQUFwQlUsWUFBb0JWLENBQXBCVTtBQUNIO0FBQ0Qsd0JBQUksQ0FBSixpQkFBQSxFQUF3QjtBQUNwQlAsa0NBQUFBLElBQUFBO0FBQ0FLLDRDQUFBQSxNQUFBQSxFQUFnQixDQUFBLGVBQUEsRUFBaEJBLEtBQWdCLENBQWhCQSxFQUEwQ0YsaUJBQUFBLFNBQUFBLEdBQUFBLElBQUFBLEdBQTFDRSxZQUFBQTtBQUNIO0FBYkxKLGlCQUFBQTtBQWVIO0FBQ0QsZ0JBQUEsT0FBQSxFQUFhO0FBQ1QsdUJBQU87QUFDSFYsd0JBREcsZUFBQTtBQUVIRyw0QkFBUUs7QUFGTCxpQkFBUDtBQUlIO0FBQ0o7QUFqRWlCLEtBQUE7QUFBQSxrQkFBQSxVQUFBLEtBQUEsRUFBQSxFQUFBLEVBbUVFO0FBQUEsWUFBQSxjQUNDUixHQURELE1BQUE7QUFBQSxZQUFBLE9BQUEsWUFBQSxJQUFBO0FBQUEsWUFBQSxLQUFBLFlBQUEsRUFBQTs7QUFFcEIsWUFBTUMsVUFBVUMsTUFBQUEsT0FBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsR0FBQUEsQ0FBaEIsRUFBZ0JBLENBQWhCO0FBQ0EsWUFBSUQsWUFBSixTQUFBLEVBQTJCO0FBQ3ZCLG1CQUFPO0FBQ0hELG9CQURHLGVBQUE7QUFFSEcsd0JBQVFGO0FBRkwsYUFBUDtBQUlIO0FBM0VpQixLQUFBO0FBQUEsZ0JBQUEsVUFBQSxLQUFBLEVBQUEsRUFBQSxFQTZFQTtBQUFBLFlBQUEsY0FDR0QsR0FESCxNQUFBO0FBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQTtBQUFBLFlBQUEsS0FBQSxZQUFBLEVBQUE7O0FBRWxCLFlBQU1HLFNBQVNELE1BQUFBLE9BQUFBLENBQUFBLElBQUFBLEVBQUFBLEdBQUFBLENBQWYsRUFBZUEsQ0FBZjtBQUNBLFlBQU1ELFVBQVVFLFVBQVVVLG9CQUFBQSxNQUFBQSxFQUFnQixDQUFBLE1BQUEsRUFBU2IsR0FBbkQsR0FBMEMsQ0FBaEJhLENBQTFCO0FBQ0EsWUFBSSxDQUFDUCxlQUFBQSxPQUFBQSxFQUFZTixHQUFqQixLQUFLTSxDQUFMLEVBQTRCO0FBQ3hCLG1CQUFPO0FBQ0hOLG9CQURHLFlBQUE7QUFFSEcsd0JBQVEsRUFBRUMsTUFBRixJQUFBLEVBQVFDLElBRmIsRUFFSyxFQUZMO0FBR0hhLHFCQUFLbEIsR0FIRixHQUFBO0FBSUhXLHVCQUFPVjtBQUpKLGFBQVA7QUFNSDtBQXhGaUIsS0FBQTtBQUFBLHNCQUFBLFVBQUEsS0FBQSxFQUFBLEVBQUEsRUEwRk07QUFBQSxZQUFBLGNBQ0hELEdBREcsTUFBQTtBQUFBLFlBQUEsT0FBQSxZQUFBLElBQUE7QUFBQSxZQUFBLEtBQUEsWUFBQSxFQUFBO0FBQUEsWUFBQSxZQUFBLEdBQUEsU0FBQTs7QUFHeEIsWUFBTUcsU0FBU0QsTUFBQUEsT0FBQUEsQ0FBQUEsSUFBQUEsRUFBQUEsR0FBQUEsQ0FBZixFQUFlQSxDQUFmO0FBQ0EsWUFBTUQsVUFBVUUsVUFBVVUsb0JBQUFBLE1BQUFBLEVBQWdCLENBQUEsWUFBQSxFQUExQyxTQUEwQyxDQUFoQkEsQ0FBMUI7QUFDQSxZQUFJLENBQUNQLGVBQUFBLE9BQUFBLEVBQVlOLEdBQWpCLEtBQUtNLENBQUwsRUFBNEI7QUFDeEIsbUJBQU87QUFDSE4sb0JBREcsa0JBQUE7QUFFSEcsd0JBQVEsRUFBRUMsTUFBRixJQUFBLEVBQVFDLElBRmIsRUFFSyxFQUZMO0FBR0hjLDJCQUhHLFNBQUE7QUFJSFIsdUJBQU9WO0FBSkosYUFBUDtBQU1IO0FBdEdpQixLQUFBO0FBQUEseUJBQUEsVUFBQSxLQUFBLEVBQUEsRUFBQSxFQXdHUztBQUFBLFlBQUEsU0FBQSxHQUFBLE1BQUE7QUFBQSxZQUFBLGVBQUEsR0FBQSxZQUFBO0FBQUEsWUFBQSxnQkFBQSxHQUFBLGFBQUE7O0FBRTNCLFlBQUksQ0FBQ0MsTUFBQUEsYUFBQUEsQ0FBQUEsa0JBQUFBLENBQUFBLE1BQUFBLEVBQUFBLFlBQUFBLEVBQUwsYUFBS0EsQ0FBTCxFQUFrRjtBQUM5RSxtQkFBTztBQUNIRixvQkFERywwQkFBQTtBQUVIRyx3QkFGRyxNQUFBO0FBR0hpQiw4QkFIRyxZQUFBO0FBSUhDLCtCQUFBQTtBQUpHLGFBQVA7QUFNSDtBQWpIaUIsS0FBQTtBQUFBLDhCQUFBLFVBQUEsS0FBQSxFQUFBLEVBQUEsRUFtSGM7QUFBQSxZQUFBLFNBQUEsR0FBQSxNQUFBO0FBQUEsWUFBQSxlQUFBLEdBQUEsWUFBQTtBQUFBLFlBQUEsZ0JBQUEsR0FBQSxhQUFBOztBQUVoQyxZQUFJbkIsTUFBQUEsYUFBQUEsQ0FBQUEsa0JBQUFBLENBQUFBLE1BQUFBLEVBQUFBLFlBQUFBLEVBQUosYUFBSUEsQ0FBSixFQUFpRjtBQUM3RSxtQkFBTztBQUNIRixvQkFERyxxQkFBQTtBQUVIRyx3QkFGRyxNQUFBO0FBR0hpQiw4QkFIRyxZQUFBO0FBSUhDLCtCQUFBQTtBQUpHLGFBQVA7QUFNSDtBQTVIaUIsS0FBQTtBQUFBLDJCQUFBLFVBQUEsS0FBQSxFQUFBLEVBQUEsRUE4SFc7QUFBQSxZQUFBLFNBQUEsR0FBQSxNQUFBO0FBQUEsWUFBQSxlQUFBLEdBQUEsWUFBQTtBQUFBLFlBQUEsaUJBQUEsR0FBQSxjQUFBOztBQUU3QixZQUFJLENBQUNuQixNQUFBQSxhQUFBQSxDQUFBQSxtQkFBQUEsQ0FBQUEsTUFBQUEsRUFBQUEsWUFBQUEsRUFBTCxjQUFLQSxDQUFMLEVBQW9GO0FBQ2hGLG1CQUFPO0FBQ0hGLG9CQURHLHVCQUFBO0FBRUhHLHdCQUZHLE1BQUE7QUFHSGlCLDhCQUhHLFlBQUE7QUFJSEUsZ0NBQWdCcEIsTUFBQUEsYUFBQUEsQ0FBQUEsY0FBQUEsQ0FBQUEsTUFBQUEsRUFBQUEsWUFBQUE7QUFKYixhQUFQO0FBTUg7QUF2SWlCLEtBQUE7QUFBQSwwQkFBQSxVQUFBLEtBQUEsRUFBQSxFQUFBLEVBeUlVO0FBQUEsWUFBQSxTQUFBLEdBQUEsTUFBQTtBQUFBLFlBQUEsZUFBQSxHQUFBLFlBQUE7QUFBQSxZQUFBLGdCQUFBLEdBQUEsYUFBQTs7QUFFNUIsWUFBSSxDQUFDQSxNQUFBQSxhQUFBQSxDQUFBQSxrQkFBQUEsQ0FBQUEsTUFBQUEsRUFBQUEsWUFBQUEsRUFBTCxhQUFLQSxDQUFMLEVBQWtGO0FBQzlFLG1CQUFPO0FBQ0hGLG9CQURHLHNCQUFBO0FBRUhHLHdCQUZHLE1BQUE7QUFHSGlCLDhCQUhHLFlBQUE7QUFJSEMsK0JBQWVuQixNQUFBQSxhQUFBQSxDQUFBQSxhQUFBQSxDQUFBQSxNQUFBQSxFQUFBQSxZQUFBQSxLQUEyRDtBQUp2RSxhQUFQO0FBTUg7QUFDSjtBQW5KcUIsQ0FBMUI7a0JBcUpBLGlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVlcEdldCwgZGVlcFNldCwgZXEsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuY29uc3QgSW52ZXJzZVRyYW5zZm9ybXMgPSB7XG4gICAgYWRkUmVjb3JkKGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGlmIChjdXJyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZW1vdmVSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGVxKGN1cnJlbnQsIG9wLnJlY29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdyZXBsYWNlUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQ6IGN1cnJlbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VSZWNvcmQoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gb3AucmVjb3JkO1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSByZXBsYWNlbWVudDtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlbW92ZVJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0geyB0eXBlLCBpZCB9O1xuICAgICAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIFsnYXR0cmlidXRlcycsICdrZXlzJ10uZm9yRWFjaChncm91cGluZyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcGxhY2VtZW50W2dyb3VwaW5nXSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZXBsYWNlbWVudFtncm91cGluZ10pLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZW1lbnRbZ3JvdXBpbmddW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgPSBkZWVwR2V0KGN1cnJlbnQsIFtncm91cGluZywgZmllbGRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXEodmFsdWUsIGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwU2V0KHJlc3VsdCwgW2dyb3VwaW5nLCBmaWVsZF0sIGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlcGxhY2VtZW50LnJlbGF0aW9uc2hpcHMpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZXBsYWNlbWVudC5yZWxhdGlvbnNoaXBzKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGRlZXBHZXQoY3VycmVudCwgWydyZWxhdGlvbnNoaXBzJywgZmllbGRdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZW1lbnQucmVsYXRpb25zaGlwc1tmaWVsZF07XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdmFsdWUgJiYgdmFsdWUuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbGF0aW9uc2hpcE1hdGNoO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwTWF0Y2ggPSBjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzTWF0Y2gob3AucmVjb3JkLCBmaWVsZCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBNYXRjaCA9IGVxKHZhbHVlLCBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVsYXRpb25zaGlwTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFNldChyZXN1bHQsIFsncmVsYXRpb25zaGlwcycsIGZpZWxkXSwgY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWNvcmQnLFxuICAgICAgICAgICAgICAgICAgICByZWNvcmQ6IHJlc3VsdFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZVJlY29yZChjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpZCB9ID0gb3AucmVjb3JkO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY2FjaGUucmVjb3Jkcyh0eXBlKS5nZXQoaWQpO1xuICAgICAgICBpZiAoY3VycmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiBjdXJyZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZXBsYWNlS2V5KGNhY2hlLCBvcCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIGlkIH0gPSBvcC5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGNhY2hlLnJlY29yZHModHlwZSkuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHJlY29yZCAmJiBkZWVwR2V0KHJlY29yZCwgWydrZXlzJywgb3Aua2V5XSk7XG4gICAgICAgIGlmICghZXEoY3VycmVudCwgb3AudmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZUtleScsXG4gICAgICAgICAgICAgICAgcmVjb3JkOiB7IHR5cGUsIGlkIH0sXG4gICAgICAgICAgICAgICAga2V5OiBvcC5rZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGN1cnJlbnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VBdHRyaWJ1dGUoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaWQgfSA9IG9wLnJlY29yZDtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJ1dGUgfSA9IG9wO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBjYWNoZS5yZWNvcmRzKHR5cGUpLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSByZWNvcmQgJiYgZGVlcEdldChyZWNvcmQsIFsnYXR0cmlidXRlcycsIGF0dHJpYnV0ZV0pO1xuICAgICAgICBpZiAoIWVxKGN1cnJlbnQsIG9wLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VBdHRyaWJ1dGUnLFxuICAgICAgICAgICAgICAgIHJlY29yZDogeyB0eXBlLCBpZCB9LFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogY3VycmVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYWRkVG9SZWxhdGVkUmVjb3JkcyhjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gb3A7XG4gICAgICAgIGlmICghY2FjaGUucmVsYXRpb25zaGlwcy5yZWxhdGlvbnNoaXBFeGlzdHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9ID0gb3A7XG4gICAgICAgIGlmIChjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0aW9uc2hpcEV4aXN0cyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3A6ICdhZGRUb1JlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhjYWNoZSwgb3ApIHtcbiAgICAgICAgY29uc3QgeyByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMgfSA9IG9wO1xuICAgICAgICBpZiAoIWNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZHNNYXRjaChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJyxcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmRzOiBjYWNoZS5yZWxhdGlvbnNoaXBzLnJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQoY2FjaGUsIG9wKSB7XG4gICAgICAgIGNvbnN0IHsgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfSA9IG9wO1xuICAgICAgICBpZiAoIWNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRpb25zaGlwRXhpc3RzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgICAgIHJlbGF0ZWRSZWNvcmQ6IGNhY2hlLnJlbGF0aW9uc2hpcHMucmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCkgfHwgbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBJbnZlcnNlVHJhbnNmb3JtczsiXX0=