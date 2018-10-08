function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { FindRecordTerm, FindRecordsTerm, FindRelatedRecordTerm, FindRelatedRecordsTerm } from './query-term';

var QueryBuilder = function () {
    function QueryBuilder() {
        _classCallCheck(this, QueryBuilder);
    }

    /**
     * Find a record by its identity.
     *
     * @param {RecordIdentity} recordIdentity
     * @returns {FindRecordTerm}
     */
    QueryBuilder.prototype.findRecord = function findRecord(record) {
        return new FindRecordTerm(record);
    };
    /**
     * Find all records of a specific type.
     *
     * If `type` is unspecified, find all records unfiltered by type.
     *
     * @param {string} [type]
     * @returns {FindRecordsTerm}
     */


    QueryBuilder.prototype.findRecords = function findRecords(type) {
        return new FindRecordsTerm(type);
    };
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */


    QueryBuilder.prototype.findRelatedRecord = function findRelatedRecord(record, relationship) {
        return new FindRelatedRecordTerm(record, relationship);
    };
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */


    QueryBuilder.prototype.findRelatedRecords = function findRelatedRecords(record, relationship) {
        return new FindRelatedRecordsTerm(record, relationship);
    };

    return QueryBuilder;
}();

export default QueryBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LWJ1aWxkZXIuanMiXSwibmFtZXMiOlsiRmluZFJlY29yZFRlcm0iLCJGaW5kUmVjb3Jkc1Rlcm0iLCJGaW5kUmVsYXRlZFJlY29yZFRlcm0iLCJGaW5kUmVsYXRlZFJlY29yZHNUZXJtIiwiUXVlcnlCdWlsZGVyIiwiZmluZFJlY29yZCIsInJlY29yZCIsImZpbmRSZWNvcmRzIiwidHlwZSIsImZpbmRSZWxhdGVkUmVjb3JkIiwicmVsYXRpb25zaGlwIiwiZmluZFJlbGF0ZWRSZWNvcmRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLGNBQVQsRUFBeUJDLGVBQXpCLEVBQTBDQyxxQkFBMUMsRUFBaUVDLHNCQUFqRSxRQUErRixjQUEvRjs7SUFDcUJDLFk7Ozs7O0FBQ2pCOzs7Ozs7MkJBTUFDLFUsdUJBQVdDLE0sRUFBUTtBQUNmLGVBQU8sSUFBSU4sY0FBSixDQUFtQk0sTUFBbkIsQ0FBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7OzsyQkFRQUMsVyx3QkFBWUMsSSxFQUFNO0FBQ2QsZUFBTyxJQUFJUCxlQUFKLENBQW9CTyxJQUFwQixDQUFQO0FBQ0gsSztBQUNEOzs7Ozs7Ozs7MkJBT0FDLGlCLDhCQUFrQkgsTSxFQUFRSSxZLEVBQWM7QUFDcEMsZUFBTyxJQUFJUixxQkFBSixDQUEwQkksTUFBMUIsRUFBa0NJLFlBQWxDLENBQVA7QUFDSCxLO0FBQ0Q7Ozs7Ozs7OzsyQkFPQUMsa0IsK0JBQW1CTCxNLEVBQVFJLFksRUFBYztBQUNyQyxlQUFPLElBQUlQLHNCQUFKLENBQTJCRyxNQUEzQixFQUFtQ0ksWUFBbkMsQ0FBUDtBQUNILEs7Ozs7O2VBeENnQk4sWSIsImZpbGUiOiJxdWVyeS1idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmluZFJlY29yZFRlcm0sIEZpbmRSZWNvcmRzVGVybSwgRmluZFJlbGF0ZWRSZWNvcmRUZXJtLCBGaW5kUmVsYXRlZFJlY29yZHNUZXJtIH0gZnJvbSAnLi9xdWVyeS10ZXJtJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5QnVpbGRlciB7XG4gICAgLyoqXG4gICAgICogRmluZCBhIHJlY29yZCBieSBpdHMgaWRlbnRpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRJZGVudGl0eVxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVjb3JkVGVybX1cbiAgICAgKi9cbiAgICBmaW5kUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gbmV3IEZpbmRSZWNvcmRUZXJtKHJlY29yZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgYWxsIHJlY29yZHMgb2YgYSBzcGVjaWZpYyB0eXBlLlxuICAgICAqXG4gICAgICogSWYgYHR5cGVgIGlzIHVuc3BlY2lmaWVkLCBmaW5kIGFsbCByZWNvcmRzIHVuZmlsdGVyZWQgYnkgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAgICAgKiBAcmV0dXJucyB7RmluZFJlY29yZHNUZXJtfVxuICAgICAqL1xuICAgIGZpbmRSZWNvcmRzKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVjb3Jkc1Rlcm0odHlwZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgYSByZWNvcmQgaW4gYSB0by1vbmUgcmVsYXRpb25zaGlwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVsYXRlZFJlY29yZFRlcm19XG4gICAgICovXG4gICAgZmluZFJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZFRlcm0ocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaW5kIHJlY29yZHMgaW4gYSB0by1tYW55IHJlbGF0aW9uc2hpcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcmV0dXJucyB7RmluZFJlbGF0ZWRSZWNvcmRzVGVybX1cbiAgICAgKi9cbiAgICBmaW5kUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaW5kUmVsYXRlZFJlY29yZHNUZXJtKHJlY29yZCwgcmVsYXRpb25zaGlwKTtcbiAgICB9XG59Il19