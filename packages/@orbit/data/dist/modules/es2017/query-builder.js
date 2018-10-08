import { FindRecordTerm, FindRecordsTerm, FindRelatedRecordTerm, FindRelatedRecordsTerm } from './query-term';
export default class QueryBuilder {
    /**
     * Find a record by its identity.
     *
     * @param {RecordIdentity} recordIdentity
     * @returns {FindRecordTerm}
     */
    findRecord(record) {
        return new FindRecordTerm(record);
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
        return new FindRecordsTerm(type);
    }
    /**
     * Find a record in a to-one relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordTerm}
     */
    findRelatedRecord(record, relationship) {
        return new FindRelatedRecordTerm(record, relationship);
    }
    /**
     * Find records in a to-many relationship.
     *
     * @param {RecordIdentity} record
     * @param {string} relationship
     * @returns {FindRelatedRecordsTerm}
     */
    findRelatedRecords(record, relationship) {
        return new FindRelatedRecordsTerm(record, relationship);
    }
}