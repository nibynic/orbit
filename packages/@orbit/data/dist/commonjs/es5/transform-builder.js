"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TransformBuilder = function () {
    function TransformBuilder() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TransformBuilder);

        this._recordInitializer = settings.recordInitializer;
    }

    /**
     * Instantiate a new `addRecord` operation.
     *
     * @param {Record} record
     * @returns {AddRecordOperation}
     */
    TransformBuilder.prototype.addRecord = function addRecord(record) {
        if (this._recordInitializer) {
            this._recordInitializer.initializeRecord(record);
        }
        return { op: 'addRecord', record: record };
    };
    /**
     * Instantiate a new `replaceRecord` operation.
     *
     * @param {Record} record
     * @returns {ReplaceRecordOperation}
     */

    TransformBuilder.prototype.replaceRecord = function replaceRecord(record) {
        return { op: 'replaceRecord', record: record };
    };
    /**
     * Instantiate a new `removeRecord` operation.
     *
     * @param {RecordIdentity} record
     * @returns {RemoveRecordOperation}
     */

    TransformBuilder.prototype.removeRecord = function removeRecord(record) {
        return { op: 'removeRecord', record: record };
    };
    /**
     * Instantiate a new `replaceKey` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} key
     * @param {string} value
     * @returns {ReplaceKeyOperation}
     */

    TransformBuilder.prototype.replaceKey = function replaceKey(record, key, value) {
        return { op: 'replaceKey', record: record, key: key, value: value };
    };
    /**
     * Instantiate a new `replaceAttribute` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} attribute
     * @param {*} value
     * @returns {ReplaceAttributeOperation}
     */

    TransformBuilder.prototype.replaceAttribute = function replaceAttribute(record, attribute, value) {
        return { op: 'replaceAttribute', record: record, attribute: attribute, value: value };
    };
    /**
     * Instantiate a new `addToRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {AddToRelatedRecordsOperation}
     */

    TransformBuilder.prototype.addToRelatedRecords = function addToRelatedRecords(record, relationship, relatedRecord) {
        return { op: 'addToRelatedRecords', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };
    /**
     * Instantiate a new `removeFromRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {RemoveFromRelatedRecordsOperation}
     */

    TransformBuilder.prototype.removeFromRelatedRecords = function removeFromRelatedRecords(record, relationship, relatedRecord) {
        return { op: 'removeFromRelatedRecords', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };
    /**
     * Instantiate a new `replaceRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity[]} relatedRecords
     * @returns {ReplaceRelatedRecordsOperation}
     */

    TransformBuilder.prototype.replaceRelatedRecords = function replaceRelatedRecords(record, relationship, relatedRecords) {
        return { op: 'replaceRelatedRecords', record: record, relationship: relationship, relatedRecords: relatedRecords };
    };
    /**
     * Instantiate a new `replaceRelatedRecord` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {ReplaceRelatedRecordOperation}
     */

    TransformBuilder.prototype.replaceRelatedRecord = function replaceRelatedRecord(record, relationship, relatedRecord) {
        return { op: 'replaceRelatedRecord', record: record, relationship: relationship, relatedRecord: relatedRecord };
    };

    _createClass(TransformBuilder, [{
        key: 'recordInitializer',
        get: function () {
            return this._recordInitializer;
        }
    }]);

    return TransformBuilder;
}();

exports.default = TransformBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS1idWlsZGVyLmpzIl0sIm5hbWVzIjpbIlRyYW5zZm9ybUJ1aWxkZXIiLCJzZXR0aW5ncyIsImFkZFJlY29yZCIsInJlY29yZCIsIm9wIiwicmVwbGFjZVJlY29yZCIsInJlbW92ZVJlY29yZCIsInJlcGxhY2VLZXkiLCJrZXkiLCJ2YWx1ZSIsInJlcGxhY2VBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCIsInJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFxQkEsbUI7QUFDakIsYUFBQSxnQkFBQSxHQUEyQjtBQUFBLFlBQWZDLFdBQWUsVUFBQSxNQUFBLEdBQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFNBQUEsR0FBQSxVQUFBLENBQUEsQ0FBQSxHQUFKLEVBQUk7O0FBQUEsd0JBQUEsSUFBQSxFQUFBLGdCQUFBOztBQUN2QixhQUFBLGtCQUFBLEdBQTBCQSxTQUExQixpQkFBQTtBQUNIOztBQUlEOzs7Ozs7K0JBTUFDLFMsc0JBQVVDLE0sRUFBUTtBQUNkLFlBQUksS0FBSixrQkFBQSxFQUE2QjtBQUN6QixpQkFBQSxrQkFBQSxDQUFBLGdCQUFBLENBQUEsTUFBQTtBQUNIO0FBQ0QsZUFBTyxFQUFFQyxJQUFGLFdBQUEsRUFBbUJELFFBQTFCLE1BQU8sRUFBUDs7QUFFSjs7Ozs7OzsrQkFNQUUsYSwwQkFBY0YsTSxFQUFRO0FBQ2xCLGVBQU8sRUFBRUMsSUFBRixlQUFBLEVBQXVCRCxRQUE5QixNQUFPLEVBQVA7O0FBRUo7Ozs7Ozs7K0JBTUFHLFkseUJBQWFILE0sRUFBUTtBQUNqQixlQUFPLEVBQUVDLElBQUYsY0FBQSxFQUFzQkQsUUFBN0IsTUFBTyxFQUFQOztBQUVKOzs7Ozs7Ozs7K0JBUUFJLFUsdUJBQVdKLE0sRUFBUUssRyxFQUFLQyxLLEVBQU87QUFDM0IsZUFBTyxFQUFFTCxJQUFGLFlBQUEsRUFBb0JELFFBQXBCLE1BQUEsRUFBNEJLLEtBQTVCLEdBQUEsRUFBaUNDLE9BQXhDLEtBQU8sRUFBUDs7QUFFSjs7Ozs7Ozs7OytCQVFBQyxnQiw2QkFBaUJQLE0sRUFBUVEsUyxFQUFXRixLLEVBQU87QUFDdkMsZUFBTyxFQUFFTCxJQUFGLGtCQUFBLEVBQTBCRCxRQUExQixNQUFBLEVBQWtDUSxXQUFsQyxTQUFBLEVBQTZDRixPQUFwRCxLQUFPLEVBQVA7O0FBRUo7Ozs7Ozs7OzsrQkFRQUcsbUIsZ0NBQW9CVCxNLEVBQVFVLFksRUFBY0MsYSxFQUFlO0FBQ3JELGVBQU8sRUFBRVYsSUFBRixxQkFBQSxFQUE2QkQsUUFBN0IsTUFBQSxFQUFxQ1UsY0FBckMsWUFBQSxFQUFtREMsZUFBMUQsYUFBTyxFQUFQOztBQUVKOzs7Ozs7Ozs7K0JBUUFDLHdCLHFDQUF5QlosTSxFQUFRVSxZLEVBQWNDLGEsRUFBZTtBQUMxRCxlQUFPLEVBQUVWLElBQUYsMEJBQUEsRUFBa0NELFFBQWxDLE1BQUEsRUFBMENVLGNBQTFDLFlBQUEsRUFBd0RDLGVBQS9ELGFBQU8sRUFBUDs7QUFFSjs7Ozs7Ozs7OytCQVFBRSxxQixrQ0FBc0JiLE0sRUFBUVUsWSxFQUFjSSxjLEVBQWdCO0FBQ3hELGVBQU8sRUFBRWIsSUFBRix1QkFBQSxFQUErQkQsUUFBL0IsTUFBQSxFQUF1Q1UsY0FBdkMsWUFBQSxFQUFxREksZ0JBQTVELGNBQU8sRUFBUDs7QUFFSjs7Ozs7Ozs7OytCQVFBQyxvQixpQ0FBcUJmLE0sRUFBUVUsWSxFQUFjQyxhLEVBQWU7QUFDdEQsZUFBTyxFQUFFVixJQUFGLHNCQUFBLEVBQThCRCxRQUE5QixNQUFBLEVBQXNDVSxjQUF0QyxZQUFBLEVBQW9EQyxlQUEzRCxhQUFPLEVBQVA7Ozs7O3lCQWpHb0I7QUFDcEIsbUJBQU8sS0FBUCxrQkFBQTtBQUNIOzs7Ozs7a0JBTmdCZCxnQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zZm9ybUJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgdGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXIgPSBzZXR0aW5ncy5yZWNvcmRJbml0aWFsaXplcjtcbiAgICB9XG4gICAgZ2V0IHJlY29yZEluaXRpYWxpemVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGBhZGRSZWNvcmRgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkfSByZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7QWRkUmVjb3JkT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIGFkZFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY29yZEluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWNvcmRJbml0aWFsaXplci5pbml0aWFsaXplUmVjb3JkKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgb3A6ICdhZGRSZWNvcmQnLCByZWNvcmQgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VSZWNvcmRgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkfSByZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7UmVwbGFjZVJlY29yZE9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZXBsYWNlUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWNvcmQnLCByZWNvcmQgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlbW92ZVJlY29yZGAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHJldHVybnMge1JlbW92ZVJlY29yZE9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZW1vdmVSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVtb3ZlUmVjb3JkJywgcmVjb3JkIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlS2V5YCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAgICogQHJldHVybnMge1JlcGxhY2VLZXlPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVwbGFjZUtleShyZWNvcmQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlS2V5JywgcmVjb3JkLCBrZXksIHZhbHVlIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlQXR0cmlidXRlYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHtSZXBsYWNlQXR0cmlidXRlT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlcGxhY2VBdHRyaWJ1dGUocmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZUF0dHJpYnV0ZScsIHJlY29yZCwgYXR0cmlidXRlLCB2YWx1ZSB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgYWRkVG9SZWxhdGVkUmVjb3Jkc2Agb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlbGF0ZWRSZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7QWRkVG9SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbn1cbiAgICAgKi9cbiAgICBhZGRUb1JlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAnYWRkVG9SZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWxhdGVkUmVjb3JkXG4gICAgICogQHJldHVybnMge1JlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc09wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZW1vdmVGcm9tUmVsYXRlZFJlY29yZHMnLCByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eVtdfSByZWxhdGVkUmVjb3Jkc1xuICAgICAqIEByZXR1cm5zIHtSZXBsYWNlUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3Jkcykge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkcyB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZVJlbGF0ZWRSZWNvcmRgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWxhdGVkUmVjb3JkXG4gICAgICogQHJldHVybnMge1JlcGxhY2VSZWxhdGVkUmVjb3JkT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmQnLCByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9O1xuICAgIH1cbn0iXX0=