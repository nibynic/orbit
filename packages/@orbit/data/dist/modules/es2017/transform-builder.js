export default class TransformBuilder {
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