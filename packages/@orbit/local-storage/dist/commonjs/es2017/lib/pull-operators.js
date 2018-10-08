'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PullOperators = undefined;

var _utils = require('@orbit/utils');

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PullOperators = exports.PullOperators = {
    findRecords(source, expression) {
        const operations = [];
        const typeFilter = expression.type;
        for (let key in _data2.default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                let typesMatch = (0, _utils.isNone)(typeFilter);
                if (!typesMatch) {
                    let fragments = key.split(source.delimiter);
                    let type = fragments[1];
                    typesMatch = typeFilter === type;
                }
                if (typesMatch) {
                    let record = JSON.parse(_data2.default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record
                    });
                }
            }
        }
        return _data2.default.Promise.resolve([(0, _data.buildTransform)(operations)]);
    },
    findRecord(source, expression) {
        const operations = [];
        const requestedRecord = expression.record;
        for (let key in _data2.default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                let fragments = key.split(source.delimiter);
                let type = fragments[1];
                let id = fragments[2];
                if (type === requestedRecord.type && id === requestedRecord.id) {
                    let record = JSON.parse(_data2.default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record
                    });
                    break;
                }
            }
        }
        return _data2.default.Promise.resolve([(0, _data.buildTransform)(operations)]);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wdWxsLW9wZXJhdG9ycy5qcyJdLCJuYW1lcyI6WyJQdWxsT3BlcmF0b3JzIiwiZmluZFJlY29yZHMiLCJzb3VyY2UiLCJleHByZXNzaW9uIiwib3BlcmF0aW9ucyIsInR5cGVGaWx0ZXIiLCJ0eXBlIiwia2V5IiwiT3JiaXQiLCJnbG9iYWxzIiwibG9jYWxTdG9yYWdlIiwiaW5kZXhPZiIsIm5hbWVzcGFjZSIsInR5cGVzTWF0Y2giLCJmcmFnbWVudHMiLCJzcGxpdCIsImRlbGltaXRlciIsInJlY29yZCIsIkpTT04iLCJwYXJzZSIsImdldEl0ZW0iLCJrZXlNYXAiLCJwdXNoUmVjb3JkIiwicHVzaCIsIm9wIiwiUHJvbWlzZSIsInJlc29sdmUiLCJmaW5kUmVjb3JkIiwicmVxdWVzdGVkUmVjb3JkIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBQ08sTUFBTUEsd0NBQWdCO0FBQ3pCQyxnQkFBWUMsTUFBWixFQUFvQkMsVUFBcEIsRUFBZ0M7QUFDNUIsY0FBTUMsYUFBYSxFQUFuQjtBQUNBLGNBQU1DLGFBQWFGLFdBQVdHLElBQTlCO0FBQ0EsYUFBSyxJQUFJQyxHQUFULElBQWdCQyxlQUFNQyxPQUFOLENBQWNDLFlBQTlCLEVBQTRDO0FBQ3hDLGdCQUFJSCxJQUFJSSxPQUFKLENBQVlULE9BQU9VLFNBQW5CLE1BQWtDLENBQXRDLEVBQXlDO0FBQ3JDLG9CQUFJQyxhQUFhLG1CQUFPUixVQUFQLENBQWpCO0FBQ0Esb0JBQUksQ0FBQ1EsVUFBTCxFQUFpQjtBQUNiLHdCQUFJQyxZQUFZUCxJQUFJUSxLQUFKLENBQVViLE9BQU9jLFNBQWpCLENBQWhCO0FBQ0Esd0JBQUlWLE9BQU9RLFVBQVUsQ0FBVixDQUFYO0FBQ0FELGlDQUFhUixlQUFlQyxJQUE1QjtBQUNIO0FBQ0Qsb0JBQUlPLFVBQUosRUFBZ0I7QUFDWix3QkFBSUksU0FBU0MsS0FBS0MsS0FBTCxDQUFXWCxlQUFNQyxPQUFOLENBQWNDLFlBQWQsQ0FBMkJVLE9BQTNCLENBQW1DYixHQUFuQyxDQUFYLENBQWI7QUFDQSx3QkFBSUwsT0FBT21CLE1BQVgsRUFBbUI7QUFDZm5CLCtCQUFPbUIsTUFBUCxDQUFjQyxVQUFkLENBQXlCTCxNQUF6QjtBQUNIO0FBQ0RiLCtCQUFXbUIsSUFBWCxDQUFnQjtBQUNaQyw0QkFBSSxXQURRO0FBRVpQO0FBRlkscUJBQWhCO0FBSUg7QUFDSjtBQUNKO0FBQ0QsZUFBT1QsZUFBTWlCLE9BQU4sQ0FBY0MsT0FBZCxDQUFzQixDQUFDLDBCQUFldEIsVUFBZixDQUFELENBQXRCLENBQVA7QUFDSCxLQXpCd0I7QUEwQnpCdUIsZUFBV3pCLE1BQVgsRUFBbUJDLFVBQW5CLEVBQStCO0FBQzNCLGNBQU1DLGFBQWEsRUFBbkI7QUFDQSxjQUFNd0Isa0JBQWtCekIsV0FBV2MsTUFBbkM7QUFDQSxhQUFLLElBQUlWLEdBQVQsSUFBZ0JDLGVBQU1DLE9BQU4sQ0FBY0MsWUFBOUIsRUFBNEM7QUFDeEMsZ0JBQUlILElBQUlJLE9BQUosQ0FBWVQsT0FBT1UsU0FBbkIsTUFBa0MsQ0FBdEMsRUFBeUM7QUFDckMsb0JBQUlFLFlBQVlQLElBQUlRLEtBQUosQ0FBVWIsT0FBT2MsU0FBakIsQ0FBaEI7QUFDQSxvQkFBSVYsT0FBT1EsVUFBVSxDQUFWLENBQVg7QUFDQSxvQkFBSWUsS0FBS2YsVUFBVSxDQUFWLENBQVQ7QUFDQSxvQkFBSVIsU0FBU3NCLGdCQUFnQnRCLElBQXpCLElBQWlDdUIsT0FBT0QsZ0JBQWdCQyxFQUE1RCxFQUFnRTtBQUM1RCx3QkFBSVosU0FBU0MsS0FBS0MsS0FBTCxDQUFXWCxlQUFNQyxPQUFOLENBQWNDLFlBQWQsQ0FBMkJVLE9BQTNCLENBQW1DYixHQUFuQyxDQUFYLENBQWI7QUFDQSx3QkFBSUwsT0FBT21CLE1BQVgsRUFBbUI7QUFDZm5CLCtCQUFPbUIsTUFBUCxDQUFjQyxVQUFkLENBQXlCTCxNQUF6QjtBQUNIO0FBQ0RiLCtCQUFXbUIsSUFBWCxDQUFnQjtBQUNaQyw0QkFBSSxXQURRO0FBRVpQO0FBRlkscUJBQWhCO0FBSUE7QUFDSDtBQUNKO0FBQ0o7QUFDRCxlQUFPVCxlQUFNaUIsT0FBTixDQUFjQyxPQUFkLENBQXNCLENBQUMsMEJBQWV0QixVQUFmLENBQUQsQ0FBdEIsQ0FBUDtBQUNIO0FBaER3QixDQUF0QiIsImZpbGUiOiJsaWIvcHVsbC1vcGVyYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc05vbmUgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IE9yYml0LCB7IGJ1aWxkVHJhbnNmb3JtIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuZXhwb3J0IGNvbnN0IFB1bGxPcGVyYXRvcnMgPSB7XG4gICAgZmluZFJlY29yZHMoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgY29uc3QgdHlwZUZpbHRlciA9IGV4cHJlc3Npb24udHlwZTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2Yoc291cmNlLm5hbWVzcGFjZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZXNNYXRjaCA9IGlzTm9uZSh0eXBlRmlsdGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoIXR5cGVzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYWdtZW50cyA9IGtleS5zcGxpdChzb3VyY2UuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBmcmFnbWVudHNbMV07XG4gICAgICAgICAgICAgICAgICAgIHR5cGVzTWF0Y2ggPSB0eXBlRmlsdGVyID09PSB0eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZXNNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjb3JkID0gSlNPTi5wYXJzZShPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmtleU1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLmtleU1hcC5wdXNoUmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wOiAnYWRkUmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZShbYnVpbGRUcmFuc2Zvcm0ob3BlcmF0aW9ucyldKTtcbiAgICB9LFxuICAgIGZpbmRSZWNvcmQoc291cmNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVxdWVzdGVkUmVjb3JkID0gZXhwcmVzc2lvbi5yZWNvcmQ7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHNvdXJjZS5uYW1lc3BhY2UpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYWdtZW50cyA9IGtleS5zcGxpdChzb3VyY2UuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGZyYWdtZW50c1sxXTtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBmcmFnbWVudHNbMl07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHJlcXVlc3RlZFJlY29yZC50eXBlICYmIGlkID09PSByZXF1ZXN0ZWRSZWNvcmQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY29yZCA9IEpTT04ucGFyc2UoT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5rZXlNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcDogJ2FkZFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFtidWlsZFRyYW5zZm9ybShvcGVyYXRpb25zKV0pO1xuICAgIH1cbn07Il19