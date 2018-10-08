'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _queryTerm = require('./query-term');

class QueryBuilder {
    /**
     * Find a record by its identity.
     *
     * @param {RecordIdentity} recordIdentity
     * @returns {FindRecordTerm}
     */
    findRecord(record) {
        return new _queryTerm.FindRecordTerm(record);
    }
    /**
     * Find all records of a specific type.
     *
     * If `type` is unspecified, find all records unfiltered by type.
     *
     * @param {string} [type]
     * @returns {FindRecordsTerm}
     */
    findRecords(type) {
        return new _queryTerm.FindRecordsTerm(type);
    }
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */
    findRelatedRecord(record, relationship) {
        return new _queryTerm.FindRelatedRecordTerm(record, relationship);
    }
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */
    findRelatedRecords(record, relationship) {
        return new _queryTerm.FindRelatedRecordsTerm(record, relationship);
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LWJ1aWxkZXIuanMiXSwibmFtZXMiOlsiUXVlcnlCdWlsZGVyIiwiZmluZFJlY29yZCIsInJlY29yZCIsIkZpbmRSZWNvcmRUZXJtIiwiZmluZFJlY29yZHMiLCJ0eXBlIiwiRmluZFJlY29yZHNUZXJtIiwiZmluZFJlbGF0ZWRSZWNvcmQiLCJyZWxhdGlvbnNoaXAiLCJGaW5kUmVsYXRlZFJlY29yZFRlcm0iLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJGaW5kUmVsYXRlZFJlY29yZHNUZXJtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDZSxNQUFNQSxZQUFOLENBQW1CO0FBQzlCOzs7Ozs7QUFNQUMsZUFBV0MsTUFBWCxFQUFtQjtBQUNmLGVBQU8sSUFBSUMseUJBQUosQ0FBbUJELE1BQW5CLENBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBRSxnQkFBWUMsSUFBWixFQUFrQjtBQUNkLGVBQU8sSUFBSUMsMEJBQUosQ0FBb0JELElBQXBCLENBQVA7QUFDSDtBQUNEOzs7Ozs7O0FBT0FFLHNCQUFrQkwsTUFBbEIsRUFBMEJNLFlBQTFCLEVBQXdDO0FBQ3BDLGVBQU8sSUFBSUMsZ0NBQUosQ0FBMEJQLE1BQTFCLEVBQWtDTSxZQUFsQyxDQUFQO0FBQ0g7QUFDRDs7Ozs7OztBQU9BRSx1QkFBbUJSLE1BQW5CLEVBQTJCTSxZQUEzQixFQUF5QztBQUNyQyxlQUFPLElBQUlHLGlDQUFKLENBQTJCVCxNQUEzQixFQUFtQ00sWUFBbkMsQ0FBUDtBQUNIO0FBeEM2QjtrQkFBYlIsWSIsImZpbGUiOiJxdWVyeS1idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmluZFJlY29yZFRlcm0sIEZpbmRSZWNvcmRzVGVybSwgRmluZFJlbGF0ZWRSZWNvcmRUZXJtLCBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIH0gZnJvbSAnLi9xdWVyeS10ZXJtJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5QnVpbGRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCBhIHJlY29yZCBieSBpdHMgaWRlbnRpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRJZGVudGl0eVxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVjb3JkVGVybX1cbiAgICAgKi9cbiAgICBmaW5kUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gbmV3IEZpbmRSZWNvcmRUZXJtKHJlY29yZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgYWxsIHJlY29yZHMgb2YgYSBzcGVjaWZpYyB0eXBlLlxuICAgICAqXG4gICAgICogSWYgYHR5cGVgIGlzIHVuc3BlY2lmaWVkLCBmaW5kIGFsbCByZWNvcmRzIHVuZmlsdGVyZWQgYnkgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAgICAgKiBAcmV0dXJucyB7RmluZFJlY29yZHNUZXJtfVxuICAgICAqL1xuICAgIGZpbmRSZWNvcmRzKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVjb3Jkc1Rlcm0odHlwZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgYSByZWNvcmQgaW4gYSB0by1vbmUgcmVsYXRpb25zaGlwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVsYXRlZFJlY29yZFRlcm19XG4gICAgICovXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZFRlcm0ocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaW5kIHJlY29yZHMgaW4gYSB0by1tYW55IHJlbGF0aW9uc2hpcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcmV0dXJucyB7RmluZFJlbGF0ZWRSZWNvcmRzVGVybX1cbiAgICAgKi9cbiAgICBmaW5kUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZHNUZXJtKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICB9XG59Il19