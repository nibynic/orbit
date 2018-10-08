var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

export default TransformBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS1idWlsZGVyLmpzIl0sIm5hbWVzIjpbIlRyYW5zZm9ybUJ1aWxkZXIiLCJzZXR0aW5ncyIsIl9yZWNvcmRJbml0aWFsaXplciIsInJlY29yZEluaXRpYWxpemVyIiwiYWRkUmVjb3JkIiwicmVjb3JkIiwiaW5pdGlhbGl6ZVJlY29yZCIsIm9wIiwicmVwbGFjZVJlY29yZCIsInJlbW92ZVJlY29yZCIsInJlcGxhY2VLZXkiLCJrZXkiLCJ2YWx1ZSIsInJlcGxhY2VBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJhZGRUb1JlbGF0ZWRSZWNvcmRzIiwicmVsYXRpb25zaGlwIiwicmVsYXRlZFJlY29yZCIsInJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyIsInJlcGxhY2VSZWxhdGVkUmVjb3JkcyIsInJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmQiXSwibWFwcGluZ3MiOiI7Ozs7SUFBcUJBLGdCO0FBQ2pCLGdDQUEyQjtBQUFBLFlBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBS0Msa0JBQUwsR0FBMEJELFNBQVNFLGlCQUFuQztBQUNIOztBQUlEOzs7Ozs7K0JBTUFDLFMsc0JBQVVDLE0sRUFBUTtBQUNkLFlBQUksS0FBS0gsa0JBQVQsRUFBNkI7QUFDekIsaUJBQUtBLGtCQUFMLENBQXdCSSxnQkFBeEIsQ0FBeUNELE1BQXpDO0FBQ0g7QUFDRCxlQUFPLEVBQUVFLElBQUksV0FBTixFQUFtQkYsY0FBbkIsRUFBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7K0JBTUFHLGEsMEJBQWNILE0sRUFBUTtBQUNsQixlQUFPLEVBQUVFLElBQUksZUFBTixFQUF1QkYsY0FBdkIsRUFBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7K0JBTUFJLFkseUJBQWFKLE0sRUFBUTtBQUNqQixlQUFPLEVBQUVFLElBQUksY0FBTixFQUFzQkYsY0FBdEIsRUFBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7OzsrQkFRQUssVSx1QkFBV0wsTSxFQUFRTSxHLEVBQUtDLEssRUFBTztBQUMzQixlQUFPLEVBQUVMLElBQUksWUFBTixFQUFvQkYsY0FBcEIsRUFBNEJNLFFBQTVCLEVBQWlDQyxZQUFqQyxFQUFQO0FBQ0gsSztBQUNEOzs7Ozs7Ozs7OytCQVFBQyxnQiw2QkFBaUJSLE0sRUFBUVMsUyxFQUFXRixLLEVBQU87QUFDdkMsZUFBTyxFQUFFTCxJQUFJLGtCQUFOLEVBQTBCRixjQUExQixFQUFrQ1Msb0JBQWxDLEVBQTZDRixZQUE3QyxFQUFQO0FBQ0gsSztBQUNEOzs7Ozs7Ozs7OytCQVFBRyxtQixnQ0FBb0JWLE0sRUFBUVcsWSxFQUFjQyxhLEVBQWU7QUFDckQsZUFBTyxFQUFFVixJQUFJLHFCQUFOLEVBQTZCRixjQUE3QixFQUFxQ1csMEJBQXJDLEVBQW1EQyw0QkFBbkQsRUFBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7OzsrQkFRQUMsd0IscUNBQXlCYixNLEVBQVFXLFksRUFBY0MsYSxFQUFlO0FBQzFELGVBQU8sRUFBRVYsSUFBSSwwQkFBTixFQUFrQ0YsY0FBbEMsRUFBMENXLDBCQUExQyxFQUF3REMsNEJBQXhELEVBQVA7QUFDSCxLO0FBQ0Q7Ozs7Ozs7Ozs7K0JBUUFFLHFCLGtDQUFzQmQsTSxFQUFRVyxZLEVBQWNJLGMsRUFBZ0I7QUFDeEQsZUFBTyxFQUFFYixJQUFJLHVCQUFOLEVBQStCRixjQUEvQixFQUF1Q1csMEJBQXZDLEVBQXFESSw4QkFBckQsRUFBUDtBQUNILEs7QUFDRDs7Ozs7Ozs7OzsrQkFRQUMsb0IsaUNBQXFCaEIsTSxFQUFRVyxZLEVBQWNDLGEsRUFBZTtBQUN0RCxlQUFPLEVBQUVWLElBQUksc0JBQU4sRUFBOEJGLGNBQTlCLEVBQXNDVywwQkFBdEMsRUFBb0RDLDRCQUFwRCxFQUFQO0FBQ0gsSzs7Ozt5QkFsR3VCO0FBQ3BCLG1CQUFPLEtBQUtmLGtCQUFaO0FBQ0g7Ozs7OztlQU5nQkYsZ0IiLCJmaWxlIjoidHJhbnNmb3JtLWJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc2Zvcm1CdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX3JlY29yZEluaXRpYWxpemVyID0gc2V0dGluZ3MucmVjb3JkSW5pdGlhbGl6ZXI7XG4gICAgfVxuICAgIGdldCByZWNvcmRJbml0aWFsaXplcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZEluaXRpYWxpemVyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgYWRkUmVjb3JkYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gICAgICogQHJldHVybnMge0FkZFJlY29yZE9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICBhZGRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNvcmRJbml0aWFsaXplcikge1xuICAgICAgICAgICAgdGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXIuaW5pdGlhbGl6ZVJlY29yZChyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IG9wOiAnYWRkUmVjb3JkJywgcmVjb3JkIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlUmVjb3JkYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gICAgICogQHJldHVybnMge1JlcGxhY2VSZWNvcmRPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVwbGFjZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlUmVjb3JkJywgcmVjb3JkIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZW1vdmVSZWNvcmRgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEByZXR1cm5zIHtSZW1vdmVSZWNvcmRPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVtb3ZlUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlbW92ZVJlY29yZCcsIHJlY29yZCB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZUtleWAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHtSZXBsYWNlS2V5T3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlcGxhY2VLZXkocmVjb3JkLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZUtleScsIHJlY29yZCwga2V5LCB2YWx1ZSB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZUF0dHJpYnV0ZWAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7UmVwbGFjZUF0dHJpYnV0ZU9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZXBsYWNlQXR0cmlidXRlKHJlY29yZCwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VBdHRyaWJ1dGUnLCByZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYGFkZFRvUmVsYXRlZFJlY29yZHNgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWxhdGVkUmVjb3JkXG4gICAgICogQHJldHVybnMge0FkZFRvUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XG4gICAgICovXG4gICAgYWRkVG9SZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICByZXR1cm4geyBvcDogJ2FkZFRvUmVsYXRlZFJlY29yZHMnLCByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVsYXRlZFJlY29yZFxuICAgICAqIEByZXR1cm5zIHtSZW1vdmVGcm9tUmVsYXRlZFJlY29yZHNPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzKHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzJywgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VSZWxhdGVkUmVjb3Jkc2Agb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHlbXX0gcmVsYXRlZFJlY29yZHNcbiAgICAgKiBAcmV0dXJucyB7UmVwbGFjZVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlcGxhY2VSZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZHMnLCByZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZHMgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VSZWxhdGVkUmVjb3JkYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVsYXRlZFJlY29yZFxuICAgICAqIEByZXR1cm5zIHtSZXBsYWNlUmVsYXRlZFJlY29yZE9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZChyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VSZWxhdGVkUmVjb3JkJywgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfTtcbiAgICB9XG59Il19