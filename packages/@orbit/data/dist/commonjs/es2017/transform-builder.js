'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class TransformBuilder {
    constructor(settings = {}) {
        this._recordInitializer = settings.recordInitializer;
    }
    get recordInitializer() {
        return this._recordInitializer;
    }
    /**
     * Instantiate a new `addRecord` operation.
     *
     * @param {Record} record
     * @returns {AddRecordOperation}
     */
    addRecord(record) {
        if (this._recordInitializer) {
            this._recordInitializer.initializeRecord(record);
        }
        return { op: 'addRecord', record };
    }
    /**
     * Instantiate a new `replaceRecord` operation.
     *
     * @param {Record} record
     * @returns {ReplaceRecordOperation}
     */
    replaceRecord(record) {
        return { op: 'replaceRecord', record };
    }
    /**
     * Instantiate a new `removeRecord` operation.
     *
     * @param {RecordIdentity} record
     * @returns {RemoveRecordOperation}
     */
    removeRecord(record) {
        return { op: 'removeRecord', record };
    }
    /**
     * Instantiate a new `replaceKey` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} key
     * @param {string} value
     * @returns {ReplaceKeyOperation}
     */
    replaceKey(record, key, value) {
        return { op: 'replaceKey', record, key, value };
    }
    /**
     * Instantiate a new `replaceAttribute` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} attribute
     * @param {*} value
     * @returns {ReplaceAttributeOperation}
     */
    replaceAttribute(record, attribute, value) {
        return { op: 'replaceAttribute', record, attribute, value };
    }
    /**
     * Instantiate a new `addToRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {AddToRelatedRecordsOperation}
     */
    addToRelatedRecords(record, relationship, relatedRecord) {
        return { op: 'addToRelatedRecords', record, relationship, relatedRecord };
    }
    /**
     * Instantiate a new `removeFromRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {RemoveFromRelatedRecordsOperation}
     */
    removeFromRelatedRecords(record, relationship, relatedRecord) {
        return { op: 'removeFromRelatedRecords', record, relationship, relatedRecord };
    }
    /**
     * Instantiate a new `replaceRelatedRecords` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity[]} relatedRecords
     * @returns {ReplaceRelatedRecordsOperation}
     */
    replaceRelatedRecords(record, relationship, relatedRecords) {
        return { op: 'replaceRelatedRecords', record, relationship, relatedRecords };
    }
    /**
     * Instantiate a new `replaceRelatedRecord` operation.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @param {RecordIdentity} relatedRecord
     * @returns {ReplaceRelatedRecordOperation}
     */
    replaceRelatedRecord(record, relationship, relatedRecord) {
        return { op: 'replaceRelatedRecord', record, relationship, relatedRecord };
    }
}
exports.default = TransformBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS1idWlsZGVyLmpzIl0sIm5hbWVzIjpbIlRyYW5zZm9ybUJ1aWxkZXIiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwiX3JlY29yZEluaXRpYWxpemVyIiwicmVjb3JkSW5pdGlhbGl6ZXIiLCJhZGRSZWNvcmQiLCJyZWNvcmQiLCJpbml0aWFsaXplUmVjb3JkIiwib3AiLCJyZXBsYWNlUmVjb3JkIiwicmVtb3ZlUmVjb3JkIiwicmVwbGFjZUtleSIsImtleSIsInZhbHVlIiwicmVwbGFjZUF0dHJpYnV0ZSIsImF0dHJpYnV0ZSIsImFkZFRvUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJyZWxhdGVkUmVjb3JkIiwicmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzIiwicmVwbGFjZVJlbGF0ZWRSZWNvcmRzIiwicmVsYXRlZFJlY29yZHMiLCJyZXBsYWNlUmVsYXRlZFJlY29yZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBZSxNQUFNQSxnQkFBTixDQUF1QjtBQUNsQ0MsZ0JBQVlDLFdBQVcsRUFBdkIsRUFBMkI7QUFDdkIsYUFBS0Msa0JBQUwsR0FBMEJELFNBQVNFLGlCQUFuQztBQUNIO0FBQ0QsUUFBSUEsaUJBQUosR0FBd0I7QUFDcEIsZUFBTyxLQUFLRCxrQkFBWjtBQUNIO0FBQ0Q7Ozs7OztBQU1BRSxjQUFVQyxNQUFWLEVBQWtCO0FBQ2QsWUFBSSxLQUFLSCxrQkFBVCxFQUE2QjtBQUN6QixpQkFBS0Esa0JBQUwsQ0FBd0JJLGdCQUF4QixDQUF5Q0QsTUFBekM7QUFDSDtBQUNELGVBQU8sRUFBRUUsSUFBSSxXQUFOLEVBQW1CRixNQUFuQixFQUFQO0FBQ0g7QUFDRDs7Ozs7O0FBTUFHLGtCQUFjSCxNQUFkLEVBQXNCO0FBQ2xCLGVBQU8sRUFBRUUsSUFBSSxlQUFOLEVBQXVCRixNQUF2QixFQUFQO0FBQ0g7QUFDRDs7Ozs7O0FBTUFJLGlCQUFhSixNQUFiLEVBQXFCO0FBQ2pCLGVBQU8sRUFBRUUsSUFBSSxjQUFOLEVBQXNCRixNQUF0QixFQUFQO0FBQ0g7QUFDRDs7Ozs7Ozs7QUFRQUssZUFBV0wsTUFBWCxFQUFtQk0sR0FBbkIsRUFBd0JDLEtBQXhCLEVBQStCO0FBQzNCLGVBQU8sRUFBRUwsSUFBSSxZQUFOLEVBQW9CRixNQUFwQixFQUE0Qk0sR0FBNUIsRUFBaUNDLEtBQWpDLEVBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBQyxxQkFBaUJSLE1BQWpCLEVBQXlCUyxTQUF6QixFQUFvQ0YsS0FBcEMsRUFBMkM7QUFDdkMsZUFBTyxFQUFFTCxJQUFJLGtCQUFOLEVBQTBCRixNQUExQixFQUFrQ1MsU0FBbEMsRUFBNkNGLEtBQTdDLEVBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBRyx3QkFBb0JWLE1BQXBCLEVBQTRCVyxZQUE1QixFQUEwQ0MsYUFBMUMsRUFBeUQ7QUFDckQsZUFBTyxFQUFFVixJQUFJLHFCQUFOLEVBQTZCRixNQUE3QixFQUFxQ1csWUFBckMsRUFBbURDLGFBQW5ELEVBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBQyw2QkFBeUJiLE1BQXpCLEVBQWlDVyxZQUFqQyxFQUErQ0MsYUFBL0MsRUFBOEQ7QUFDMUQsZUFBTyxFQUFFVixJQUFJLDBCQUFOLEVBQWtDRixNQUFsQyxFQUEwQ1csWUFBMUMsRUFBd0RDLGFBQXhELEVBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBRSwwQkFBc0JkLE1BQXRCLEVBQThCVyxZQUE5QixFQUE0Q0ksY0FBNUMsRUFBNEQ7QUFDeEQsZUFBTyxFQUFFYixJQUFJLHVCQUFOLEVBQStCRixNQUEvQixFQUF1Q1csWUFBdkMsRUFBcURJLGNBQXJELEVBQVA7QUFDSDtBQUNEOzs7Ozs7OztBQVFBQyx5QkFBcUJoQixNQUFyQixFQUE2QlcsWUFBN0IsRUFBMkNDLGFBQTNDLEVBQTBEO0FBQ3RELGVBQU8sRUFBRVYsSUFBSSxzQkFBTixFQUE4QkYsTUFBOUIsRUFBc0NXLFlBQXRDLEVBQW9EQyxhQUFwRCxFQUFQO0FBQ0g7QUF0R2lDO2tCQUFqQmxCLGdCIiwiZmlsZSI6InRyYW5zZm9ybS1idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNmb3JtQnVpbGRlciB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICB0aGlzLl9yZWNvcmRJbml0aWFsaXplciA9IHNldHRpbmdzLnJlY29yZEluaXRpYWxpemVyO1xuICAgIH1cbiAgICBnZXQgcmVjb3JkSW5pdGlhbGl6ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRJbml0aWFsaXplcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYGFkZFJlY29yZGAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZFxuICAgICAqIEByZXR1cm5zIHtBZGRSZWNvcmRPcGVyYXRpb259XG4gICAgICovXG4gICAgYWRkUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBpZiAodGhpcy5fcmVjb3JkSW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY29yZEluaXRpYWxpemVyLmluaXRpYWxpemVSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBvcDogJ2FkZFJlY29yZCcsIHJlY29yZCB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVwbGFjZVJlY29yZGAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZFxuICAgICAqIEByZXR1cm5zIHtSZXBsYWNlUmVjb3JkT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlcGxhY2VSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZVJlY29yZCcsIHJlY29yZCB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZSBhIG5ldyBgcmVtb3ZlUmVjb3JkYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7UmVtb3ZlUmVjb3JkT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlbW92ZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZW1vdmVSZWNvcmQnLCByZWNvcmQgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VLZXlgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7UmVwbGFjZUtleU9wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZXBsYWNlS2V5KHJlY29yZCwga2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlcGxhY2VLZXknLCByZWNvcmQsIGtleSwgdmFsdWUgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlcGxhY2VBdHRyaWJ1dGVgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICogQHJldHVybnMge1JlcGxhY2VBdHRyaWJ1dGVPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVwbGFjZUF0dHJpYnV0ZShyZWNvcmQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlQXR0cmlidXRlJywgcmVjb3JkLCBhdHRyaWJ1dGUsIHZhbHVlIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGBhZGRUb1JlbGF0ZWRSZWNvcmRzYCBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5fSByZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpb25zaGlwXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVsYXRlZFJlY29yZFxuICAgICAqIEByZXR1cm5zIHtBZGRUb1JlbGF0ZWRSZWNvcmRzT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIGFkZFRvUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdhZGRUb1JlbGF0ZWRSZWNvcmRzJywgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGUgYSBuZXcgYHJlbW92ZUZyb21SZWxhdGVkUmVjb3Jkc2Agb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlbGF0ZWRSZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7UmVtb3ZlRnJvbVJlbGF0ZWRSZWNvcmRzT3BlcmF0aW9ufVxuICAgICAqL1xuICAgIHJlbW92ZUZyb21SZWxhdGVkUmVjb3JkcyhyZWNvcmQsIHJlbGF0aW9uc2hpcCwgcmVsYXRlZFJlY29yZCkge1xuICAgICAgICByZXR1cm4geyBvcDogJ3JlbW92ZUZyb21SZWxhdGVkUmVjb3JkcycsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlUmVsYXRlZFJlY29yZHNgIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGlvbnNoaXBcbiAgICAgKiBAcGFyYW0ge1JlY29yZElkZW50aXR5W119IHJlbGF0ZWRSZWNvcmRzXG4gICAgICogQHJldHVybnMge1JlcGxhY2VSZWxhdGVkUmVjb3Jkc09wZXJhdGlvbn1cbiAgICAgKi9cbiAgICByZXBsYWNlUmVsYXRlZFJlY29yZHMocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzKSB7XG4gICAgICAgIHJldHVybiB7IG9wOiAncmVwbGFjZVJlbGF0ZWRSZWNvcmRzJywgcmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmRzIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlIGEgbmV3IGByZXBsYWNlUmVsYXRlZFJlY29yZGAgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRJZGVudGl0eX0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aW9uc2hpcFxuICAgICAqIEBwYXJhbSB7UmVjb3JkSWRlbnRpdHl9IHJlbGF0ZWRSZWNvcmRcbiAgICAgKiBAcmV0dXJucyB7UmVwbGFjZVJlbGF0ZWRSZWNvcmRPcGVyYXRpb259XG4gICAgICovXG4gICAgcmVwbGFjZVJlbGF0ZWRSZWNvcmQocmVjb3JkLCByZWxhdGlvbnNoaXAsIHJlbGF0ZWRSZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHsgb3A6ICdyZXBsYWNlUmVsYXRlZFJlY29yZCcsIHJlY29yZCwgcmVsYXRpb25zaGlwLCByZWxhdGVkUmVjb3JkIH07XG4gICAgfVxufSJdfQ==