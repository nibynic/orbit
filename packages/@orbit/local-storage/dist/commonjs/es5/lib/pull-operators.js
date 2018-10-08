'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PullOperators = exports.PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var typeFilter = expression.type;
        for (var key in _data2.default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                var typesMatch = (0, _utils.isNone)(typeFilter);
                if (!typesMatch) {
                    var fragments = key.split(source.delimiter);
                    var type = fragments[1];
                    typesMatch = typeFilter === type;
                }
                if (typesMatch) {
                    var record = JSON.parse(_data2.default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record: record
                    });
                }
            }
        }
        return _data2.default.Promise.resolve([(0, _data.buildTransform)(operations)]);
    },
    findRecord: function (source, expression) {
        var operations = [];
        var requestedRecord = expression.record;
        for (var key in _data2.default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                var fragments = key.split(source.delimiter);
                var type = fragments[1];
                var id = fragments[2];
                if (type === requestedRecord.type && id === requestedRecord.id) {
                    var record = JSON.parse(_data2.default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record: record
                    });
                    break;
                }
            }
        }
        return _data2.default.Promise.resolve([(0, _data.buildTransform)(operations)]);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJQdWxsT3BlcmF0b3JzIiwib3BlcmF0aW9ucyIsInR5cGVGaWx0ZXIiLCJleHByZXNzaW9uIiwiT3JiaXQiLCJrZXkiLCJzb3VyY2UiLCJ0eXBlc01hdGNoIiwiaXNOb25lIiwiZnJhZ21lbnRzIiwidHlwZSIsInJlY29yZCIsIkpTT04iLCJvcCIsImJ1aWxkVHJhbnNmb3JtIiwicmVxdWVzdGVkUmVjb3JkIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7Ozs7QUFDTyxJQUFNQSx3Q0FBZ0I7QUFBQSxpQkFBQSxVQUFBLE1BQUEsRUFBQSxVQUFBLEVBQ087QUFDNUIsWUFBTUMsYUFBTixFQUFBO0FBQ0EsWUFBTUMsYUFBYUMsV0FBbkIsSUFBQTtBQUNBLGFBQUssSUFBTCxHQUFBLElBQWdCQyxlQUFBQSxPQUFBQSxDQUFoQixZQUFBLEVBQTRDO0FBQ3hDLGdCQUFJQyxJQUFBQSxPQUFBQSxDQUFZQyxPQUFaRCxTQUFBQSxNQUFKLENBQUEsRUFBeUM7QUFDckMsb0JBQUlFLGFBQWFDLG1CQUFqQixVQUFpQkEsQ0FBakI7QUFDQSxvQkFBSSxDQUFKLFVBQUEsRUFBaUI7QUFDYix3QkFBSUMsWUFBWUosSUFBQUEsS0FBQUEsQ0FBVUMsT0FBMUIsU0FBZ0JELENBQWhCO0FBQ0Esd0JBQUlLLE9BQU9ELFVBQVgsQ0FBV0EsQ0FBWDtBQUNBRixpQ0FBYUwsZUFBYkssSUFBQUE7QUFDSDtBQUNELG9CQUFBLFVBQUEsRUFBZ0I7QUFDWix3QkFBSUksU0FBU0MsS0FBQUEsS0FBQUEsQ0FBV1IsZUFBQUEsT0FBQUEsQ0FBQUEsWUFBQUEsQ0FBQUEsT0FBQUEsQ0FBeEIsR0FBd0JBLENBQVhRLENBQWI7QUFDQSx3QkFBSU4sT0FBSixNQUFBLEVBQW1CO0FBQ2ZBLCtCQUFBQSxNQUFBQSxDQUFBQSxVQUFBQSxDQUFBQSxNQUFBQTtBQUNIO0FBQ0RMLCtCQUFBQSxJQUFBQSxDQUFnQjtBQUNaWSw0QkFEWSxXQUFBO0FBRVpGLGdDQUFBQTtBQUZZLHFCQUFoQlY7QUFJSDtBQUNKO0FBQ0o7QUFDRCxlQUFPRyxlQUFBQSxPQUFBQSxDQUFBQSxPQUFBQSxDQUFzQixDQUFDVSwwQkFBOUIsVUFBOEJBLENBQUQsQ0FBdEJWLENBQVA7QUF4QnFCLEtBQUE7QUFBQSxnQkFBQSxVQUFBLE1BQUEsRUFBQSxVQUFBLEVBMEJNO0FBQzNCLFlBQU1ILGFBQU4sRUFBQTtBQUNBLFlBQU1jLGtCQUFrQlosV0FBeEIsTUFBQTtBQUNBLGFBQUssSUFBTCxHQUFBLElBQWdCQyxlQUFBQSxPQUFBQSxDQUFoQixZQUFBLEVBQTRDO0FBQ3hDLGdCQUFJQyxJQUFBQSxPQUFBQSxDQUFZQyxPQUFaRCxTQUFBQSxNQUFKLENBQUEsRUFBeUM7QUFDckMsb0JBQUlJLFlBQVlKLElBQUFBLEtBQUFBLENBQVVDLE9BQTFCLFNBQWdCRCxDQUFoQjtBQUNBLG9CQUFJSyxPQUFPRCxVQUFYLENBQVdBLENBQVg7QUFDQSxvQkFBSU8sS0FBS1AsVUFBVCxDQUFTQSxDQUFUO0FBQ0Esb0JBQUlDLFNBQVNLLGdCQUFUTCxJQUFBQSxJQUFpQ00sT0FBT0QsZ0JBQTVDLEVBQUEsRUFBZ0U7QUFDNUQsd0JBQUlKLFNBQVNDLEtBQUFBLEtBQUFBLENBQVdSLGVBQUFBLE9BQUFBLENBQUFBLFlBQUFBLENBQUFBLE9BQUFBLENBQXhCLEdBQXdCQSxDQUFYUSxDQUFiO0FBQ0Esd0JBQUlOLE9BQUosTUFBQSxFQUFtQjtBQUNmQSwrQkFBQUEsTUFBQUEsQ0FBQUEsVUFBQUEsQ0FBQUEsTUFBQUE7QUFDSDtBQUNETCwrQkFBQUEsSUFBQUEsQ0FBZ0I7QUFDWlksNEJBRFksV0FBQTtBQUVaRixnQ0FBQUE7QUFGWSxxQkFBaEJWO0FBSUE7QUFDSDtBQUNKO0FBQ0o7QUFDRCxlQUFPRyxlQUFBQSxPQUFBQSxDQUFBQSxPQUFBQSxDQUFzQixDQUFDVSwwQkFBOUIsVUFBOEJBLENBQUQsQ0FBdEJWLENBQVA7QUFDSDtBQWhEd0IsQ0FBdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc05vbmUgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IE9yYml0LCB7IGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuZXhwb3J0IGNvbnN0IFB1bGxPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZHMoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgY29uc3QgdHlwZUZpbHRlciA9IGV4cHJlc3Npb24udHlwZTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2Yoc291cmNlLm5hbWVzcGFjZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZXNNYXRjaCA9IGlzTm9uZSh0eXBlRmlsdGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoIXR5cGVzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYWdtZW50cyA9IGtleS5zcGxpdChzb3VyY2UuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBmcmFnbWVudHNbMV07XG4gICAgICAgICAgICAgICAgICAgIHR5cGVzTWF0Y2ggPSB0eXBlRmlsdGVyID09PSB0eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZXNNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjb3JkID0gSlNPTi5wYXJzZShPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmtleU1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLmtleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmQoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVxdWVzdGVkUmVjb3JkID0gZXhwcmVzc2lvbi5yZWNvcmQ7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHNvdXJjZS5uYW1lc3BhY2UpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYWdtZW50cyA9IGtleS5zcGxpdChzb3VyY2UuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGZyYWdtZW50c1sxXTtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBmcmFnbWVudHNbMl07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHJlcXVlc3RlZFJlY29yZC50eXBlICYmIGlkID09PSByZXF1ZXN0ZWRSZWNvcmQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY29yZCA9IEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5rZXlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcDogJ2FkZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtidWlsZFRyYW5zZm9ybShvcGVyYXRpb25zKV0pO1xuICAgIH1cbn07Il19