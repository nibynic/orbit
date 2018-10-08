"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _queryTerm = require("./query-term");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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
        return new _queryTerm.FindRecordTerm(record);
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
        return new _queryTerm.FindRecordsTerm(type);
    };
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */

    QueryBuilder.prototype.findRelatedRecord = function findRelatedRecord(record, relationship) {
        return new _queryTerm.FindRelatedRecordTerm(record, relationship);
    };
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */

    QueryBuilder.prototype.findRelatedRecords = function findRelatedRecords(record, relationship) {
        return new _queryTerm.FindRelatedRecordsTerm(record, relationship);
    };

    return QueryBuilder;
}();

exports.default = QueryBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXJ5LWJ1aWxkZXIuanMiXSwibmFtZXMiOlsiUXVlcnlCdWlsZGVyIiwiZmluZFJlY29yZCIsInJlY29yZCIsImZpbmRSZWNvcmRzIiwidHlwZSIsImZpbmRSZWxhdGVkUmVjb3JkIiwicmVsYXRpb25zaGlwIiwiZmluZFJlbGF0ZWRSZWNvcmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7SUFDcUJBLGU7Ozs7O0FBQ2pCOzs7Ozs7MkJBTUFDLFUsdUJBQVdDLE0sRUFBUTtBQUNmLGVBQU8sSUFBQSx5QkFBQSxDQUFQLE1BQU8sQ0FBUDs7QUFFSjs7Ozs7Ozs7OzJCQVFBQyxXLHdCQUFZQyxJLEVBQU07QUFDZCxlQUFPLElBQUEsMEJBQUEsQ0FBUCxJQUFPLENBQVA7O0FBRUo7Ozs7Ozs7OzJCQU9BQyxpQiw4QkFBa0JILE0sRUFBUUksWSxFQUFjO0FBQ3BDLGVBQU8sSUFBQSxnQ0FBQSxDQUFBLE1BQUEsRUFBUCxZQUFPLENBQVA7O0FBRUo7Ozs7Ozs7OzJCQU9BQyxrQiwrQkFBbUJMLE0sRUFBUUksWSxFQUFjO0FBQ3JDLGVBQU8sSUFBQSxpQ0FBQSxDQUFBLE1BQUEsRUFBUCxZQUFPLENBQVA7Ozs7OztrQkF2Q2FOLFkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGaW5kUmVjb3JkVGVybSwgRmluZFJlY29yZHNUZXJtLCBGaW5kUmVsYXRlZFJlY29yZFRlcm0sIEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0gfSBmcm9tICcuL3F1ZXJ5LXRlcm0nO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlCdWlsZGVyIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIGEgcmVjb3JkIGJ5IGl0cyBpZGVudGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZElkZW50aXR5XG4gICAgICogQHJldHVybnMge0ZpbmRSZWNvcmRUZXJtfVxuICAgICAqL1xuICAgIGZpbmRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmluZFJlY29yZFRlcm0ocmVjb3JkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZCBhbGwgcmVjb3JkcyBvZiBhIHNwZWNpZmljIHR5cGUuXG4gICAgICpcbiAgICAgKiBJZiBgdHlwZWAgaXMgdW5zcGVjaWZpZWQsIGZpbmQgYWxsIHJlY29yZHMgdW5maWx0ZXJlZCBieSB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVjb3Jkc1Rlcm19XG4gICAgICovXG4gICAgZmluZFJlY29yZHModHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IEZpbmRSZWNvcmRzVGVybSh0eXBlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZCBhIHJlY29yZCBpbiBhIHRvLW9uZSByZWxhdGlvbnNoaXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXG4gICAgICogQHJldHVybnMge0ZpbmRSZWxhdGVkUmVjb3JkVGVybX1cbiAgICAgKi9cbiAgICBmaW5kUmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICByZXR1cm4gbmV3IEZpbmRSZWxhdGVkUmVjb3JkVGVybShyZWNvcmQsIHJlbGF0aW9uc2hpcCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgcmVjb3JkcyBpbiBhIHRvLW1hbnkgcmVsYXRpb25zaGlwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEByZXR1cm5zIHtGaW5kUmVsYXRlZFJlY29yZHNUZXJtfVxuICAgICAqL1xuICAgIGZpbmRSZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICByZXR1cm4gbmV3IEZpbmRSZWxhdGVkUmVjb3Jkc1Rlcm0ocmVjb3JkLCByZWxhdGlvbnNoaXApO1xuICAgIH1cbn0iXX0=