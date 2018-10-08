'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PullOperators = exports.PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce(function (chain, type) {
            return chain.then(function () {
                return source.getRecords(type).then(function (records) {
                    records.forEach(function (record) {
                        operations.push({
                            op: 'addRecord',
                            record: record
                        });
                    });
                });
            });
        }, _data2.default.Promise.resolve()).then(function () {
            return [(0, _data.buildTransform)(operations)];
        });
    },
    findRecord: function (source, expression) {
        return source.getRecord(expression.record).then(function (record) {
            var operations = [{
                op: 'addRecord',
                record: record
            }];
            return [(0, _data.buildTransform)(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJQdWxsT3BlcmF0b3JzIiwib3BlcmF0aW9ucyIsInR5cGVzIiwiZXhwcmVzc2lvbiIsInNvdXJjZSIsInJlY29yZHMiLCJvcCIsInJlY29yZCIsIk9yYml0IiwiYnVpbGRUcmFuc2Zvcm0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDTyxJQUFNQSx3Q0FBZ0I7QUFBQSxpQkFBQSxVQUFBLE1BQUEsRUFBQSxVQUFBLEVBQ087QUFDNUIsWUFBTUMsYUFBTixFQUFBO0FBQ0EsWUFBSUMsUUFBUUMsV0FBQUEsSUFBQUEsR0FBa0IsQ0FBQ0EsV0FBbkJBLElBQWtCLENBQWxCQSxHQUFzQ0MsT0FBbEQsY0FBQTtBQUNBLGVBQU8sTUFBQSxNQUFBLENBQWEsVUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFpQjtBQUNqQyxtQkFBTyxNQUFBLElBQUEsQ0FBVyxZQUFNO0FBQ3BCLHVCQUFPLE9BQUEsVUFBQSxDQUFBLElBQUEsRUFBQSxJQUFBLENBQTZCLFVBQUEsT0FBQSxFQUFXO0FBQzNDQyw0QkFBQUEsT0FBQUEsQ0FBZ0IsVUFBQSxNQUFBLEVBQVU7QUFDdEJKLG1DQUFBQSxJQUFBQSxDQUFnQjtBQUNaSyxnQ0FEWSxXQUFBO0FBRVpDLG9DQUFBQTtBQUZZLHlCQUFoQk47QUFESkkscUJBQUFBO0FBREosaUJBQU8sQ0FBUDtBQURKLGFBQU8sQ0FBUDtBQURHLFNBQUEsRUFXSkcsZUFBQUEsT0FBQUEsQ0FYSSxPQVdKQSxFQVhJLEVBQUEsSUFBQSxDQVcwQixZQUFBO0FBQUEsbUJBQU0sQ0FBQ0MsMEJBQVAsVUFBT0EsQ0FBRCxDQUFOO0FBWGpDLFNBQU8sQ0FBUDtBQUpxQixLQUFBO0FBQUEsZ0JBQUEsVUFBQSxNQUFBLEVBQUEsVUFBQSxFQWlCTTtBQUMzQixlQUFPLE9BQUEsU0FBQSxDQUFpQk4sV0FBakIsTUFBQSxFQUFBLElBQUEsQ0FBeUMsVUFBQSxNQUFBLEVBQVU7QUFDdEQsZ0JBQU1GLGFBQWEsQ0FBQztBQUNoQkssb0JBRGdCLFdBQUE7QUFFaEJDLHdCQUFBQTtBQUZnQixhQUFELENBQW5CO0FBSUEsbUJBQU8sQ0FBQ0UsMEJBQVIsVUFBUUEsQ0FBRCxDQUFQO0FBTEosU0FBTyxDQUFQO0FBT0g7QUF6QndCLENBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0LCB7IGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuZXhwb3J0IGNvbnN0IFB1bGxPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZHMoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgbGV0IHR5cGVzID0gZXhwcmVzc2lvbi50eXBlID8gW2V4cHJlc3Npb24udHlwZV0gOiBzb3VyY2UuYXZhaWxhYmxlVHlwZXM7XG4gICAgICAgIHJldHVybiB0eXBlcy5yZWR1Y2UoKGNoYWluLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5nZXRSZWNvcmRzKHR5cGUpLnRoZW4ocmVjb3JkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcDogJ2FkZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oKCkgPT4gW2J1aWxkVHJhbnNmb3JtKG9wZXJhdGlvbnMpXSk7XG4gICAgfSxcbiAgICBmaW5kUmVjb3JkKHNvdXJjZSwgZXhwcmVzc2lvbikge1xuICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZChleHByZXNzaW9uLnJlY29yZCkudGhlbihyZWNvcmQgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IFt7XG4gICAgICAgICAgICAgICAgb3A6ICdhZGRSZWNvcmQnLFxuICAgICAgICAgICAgICAgIHJlY29yZFxuICAgICAgICAgICAgfV07XG4gICAgICAgICAgICByZXR1cm4gW2J1aWxkVHJhbnNmb3JtKG9wZXJhdGlvbnMpXTtcbiAgICAgICAgfSk7XG4gICAgfVxufTsiXX0=