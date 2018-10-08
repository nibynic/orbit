'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PullOperators = exports.PullOperators = {
    findRecords(source, expression) {
        const operations = [];
        let types = expression.type ? [expression.type] : source.availableTypes;
        return types.reduce((chain, type) => {
            return chain.then(() => {
                return source.getRecords(type).then(records => {
                    records.forEach(record => {
                        operations.push({
                            op: 'addRecord',
                            record
                        });
                    });
                });
            });
        }, _data2.default.Promise.resolve()).then(() => [(0, _data.buildTransform)(operations)]);
    },
    findRecord(source, expression) {
        return source.getRecord(expression.record).then(record => {
            const operations = [{
                op: 'addRecord',
                record
            }];
            return [(0, _data.buildTransform)(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJQdWxsT3BlcmF0b3JzIiwiZmluZFJlY29yZHMiLCJzb3VyY2UiLCJleHByZXNzaW9uIiwib3BlcmF0aW9ucyIsInR5cGVzIiwidHlwZSIsImF2YWlsYWJsZVR5cGVzIiwicmVkdWNlIiwiY2hhaW4iLCJ0aGVuIiwiZ2V0UmVjb3JkcyIsInJlY29yZHMiLCJmb3JFYWNoIiwicmVjb3JkIiwicHVzaCIsIm9wIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZpbmRSZWNvcmQiLCJnZXRSZWNvcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBQ08sTUFBTUEsd0NBQWdCO0FBQ3pCQyxnQkFBWUMsTUFBWixFQUFvQkMsVUFBcEIsRUFBZ0M7QUFDNUIsY0FBTUMsYUFBYSxFQUFuQjtBQUNBLFlBQUlDLFFBQVFGLFdBQVdHLElBQVgsR0FBa0IsQ0FBQ0gsV0FBV0csSUFBWixDQUFsQixHQUFzQ0osT0FBT0ssY0FBekQ7QUFDQSxlQUFPRixNQUFNRyxNQUFOLENBQWEsQ0FBQ0MsS0FBRCxFQUFRSCxJQUFSLEtBQWlCO0FBQ2pDLG1CQUFPRyxNQUFNQyxJQUFOLENBQVcsTUFBTTtBQUNwQix1QkFBT1IsT0FBT1MsVUFBUCxDQUFrQkwsSUFBbEIsRUFBd0JJLElBQXhCLENBQTZCRSxXQUFXO0FBQzNDQSw0QkFBUUMsT0FBUixDQUFnQkMsVUFBVTtBQUN0QlYsbUNBQVdXLElBQVgsQ0FBZ0I7QUFDWkMsZ0NBQUksV0FEUTtBQUVaRjtBQUZZLHlCQUFoQjtBQUlILHFCQUxEO0FBTUgsaUJBUE0sQ0FBUDtBQVFILGFBVE0sQ0FBUDtBQVVILFNBWE0sRUFXSkcsZUFBTUMsT0FBTixDQUFjQyxPQUFkLEVBWEksRUFXcUJULElBWHJCLENBVzBCLE1BQU0sQ0FBQywwQkFBZU4sVUFBZixDQUFELENBWGhDLENBQVA7QUFZSCxLQWhCd0I7QUFpQnpCZ0IsZUFBV2xCLE1BQVgsRUFBbUJDLFVBQW5CLEVBQStCO0FBQzNCLGVBQU9ELE9BQU9tQixTQUFQLENBQWlCbEIsV0FBV1csTUFBNUIsRUFBb0NKLElBQXBDLENBQXlDSSxVQUFVO0FBQ3RELGtCQUFNVixhQUFhLENBQUM7QUFDaEJZLG9CQUFJLFdBRFk7QUFFaEJGO0FBRmdCLGFBQUQsQ0FBbkI7QUFJQSxtQkFBTyxDQUFDLDBCQUFlVixVQUFmLENBQUQsQ0FBUDtBQUNILFNBTk0sQ0FBUDtBQU9IO0FBekJ3QixDQUF0QiIsImZpbGUiOiJsaWIvcHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5leHBvcnQgY29uc3QgUHVsbE9wZXJhdG9ycyA9IHtcbiAgICBmaW5kUmVjb3Jkcyhzb3VyY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgdHlwZXMgPSBleHByZXNzaW9uLnR5cGUgPyBbZXhwcmVzc2lvbi50eXBlXSA6IHNvdXJjZS5hdmFpbGFibGVUeXBlcztcbiAgICAgICAgcmV0dXJuIHR5cGVzLnJlZHVjZSgoY2hhaW4sIHR5cGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZHModHlwZSkudGhlbihyZWNvcmRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmQoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZ2V0UmVjb3JkKGV4cHJlc3Npb24ucmVjb3JkKS50aGVuKHJlY29yZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gW3tcbiAgICAgICAgICAgICAgICBvcDogJ2FkZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xuICAgICAgICB9KTtcbiAgICB9XG59OyJdfQ==