import Orbit, { buildTransform } from '@orbit/data';
export var PullOperators = {
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
        }, Orbit.Promise.resolve()).then(function () {
            return [buildTransform(operations)];
        });
    },
    findRecord: function (source, expression) {
        return source.getRecord(expression.record).then(function (record) {
            var operations = [{
                op: 'addRecord',
                record: record
            }];
            return [buildTransform(operations)];
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJPcmJpdCIsImJ1aWxkVHJhbnNmb3JtIiwiUHVsbE9wZXJhdG9ycyIsImZpbmRSZWNvcmRzIiwic291cmNlIiwiZXhwcmVzc2lvbiIsIm9wZXJhdGlvbnMiLCJ0eXBlcyIsInR5cGUiLCJhdmFpbGFibGVUeXBlcyIsInJlZHVjZSIsImNoYWluIiwidGhlbiIsImdldFJlY29yZHMiLCJyZWNvcmRzIiwiZm9yRWFjaCIsInB1c2giLCJvcCIsInJlY29yZCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZmluZFJlY29yZCIsImdldFJlY29yZCJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxJQUFnQkMsY0FBaEIsUUFBc0MsYUFBdEM7QUFDQSxPQUFPLElBQU1DLGdCQUFnQjtBQUN6QkMsZUFEeUIsWUFDYkMsTUFEYSxFQUNMQyxVQURLLEVBQ087QUFDNUIsWUFBTUMsYUFBYSxFQUFuQjtBQUNBLFlBQUlDLFFBQVFGLFdBQVdHLElBQVgsR0FBa0IsQ0FBQ0gsV0FBV0csSUFBWixDQUFsQixHQUFzQ0osT0FBT0ssY0FBekQ7QUFDQSxlQUFPRixNQUFNRyxNQUFOLENBQWEsVUFBQ0MsS0FBRCxFQUFRSCxJQUFSLEVBQWlCO0FBQ2pDLG1CQUFPRyxNQUFNQyxJQUFOLENBQVcsWUFBTTtBQUNwQix1QkFBT1IsT0FBT1MsVUFBUCxDQUFrQkwsSUFBbEIsRUFBd0JJLElBQXhCLENBQTZCLG1CQUFXO0FBQzNDRSw0QkFBUUMsT0FBUixDQUFnQixrQkFBVTtBQUN0QlQsbUNBQVdVLElBQVgsQ0FBZ0I7QUFDWkMsZ0NBQUksV0FEUTtBQUVaQztBQUZZLHlCQUFoQjtBQUlILHFCQUxEO0FBTUgsaUJBUE0sQ0FBUDtBQVFILGFBVE0sQ0FBUDtBQVVILFNBWE0sRUFXSmxCLE1BQU1tQixPQUFOLENBQWNDLE9BQWQsRUFYSSxFQVdxQlIsSUFYckIsQ0FXMEI7QUFBQSxtQkFBTSxDQUFDWCxlQUFlSyxVQUFmLENBQUQsQ0FBTjtBQUFBLFNBWDFCLENBQVA7QUFZSCxLQWhCd0I7QUFpQnpCZSxjQWpCeUIsWUFpQmRqQixNQWpCYyxFQWlCTkMsVUFqQk0sRUFpQk07QUFDM0IsZUFBT0QsT0FBT2tCLFNBQVAsQ0FBaUJqQixXQUFXYSxNQUE1QixFQUFvQ04sSUFBcEMsQ0FBeUMsa0JBQVU7QUFDdEQsZ0JBQU1OLGFBQWEsQ0FBQztBQUNoQlcsb0JBQUksV0FEWTtBQUVoQkM7QUFGZ0IsYUFBRCxDQUFuQjtBQUlBLG1CQUFPLENBQUNqQixlQUFlSyxVQUFmLENBQUQsQ0FBUDtBQUNILFNBTk0sQ0FBUDtBQU9IO0FBekJ3QixDQUF0QiIsImZpbGUiOiJsaWIvcHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQsIHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5leHBvcnQgY29uc3QgUHVsbE9wZXJhdG9ycyA9IHtcbiAgICBmaW5kUmVjb3Jkcyhzb3VyY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgdHlwZXMgPSBleHByZXNzaW9uLnR5cGUgPyBbZXhwcmVzc2lvbi50eXBlXSA6IHNvdXJjZS5hdmFpbGFibGVUeXBlcztcbiAgICAgICAgcmV0dXJuIHR5cGVzLnJlZHVjZSgoY2hhaW4sIHR5cGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlLmdldFJlY29yZHModHlwZSkudGhlbihyZWNvcmRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmQoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZ2V0UmVjb3JkKGV4cHJlc3Npb24ucmVjb3JkKS50aGVuKHJlY29yZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gW3tcbiAgICAgICAgICAgICAgICBvcDogJ2FkZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgcmVjb3JkXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIHJldHVybiBbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldO1xuICAgICAgICB9KTtcbiAgICB9XG59OyJdfQ==