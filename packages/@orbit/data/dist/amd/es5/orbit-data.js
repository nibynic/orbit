define('@orbit/data', ['exports', '@orbit/core', '@orbit/utils'], function (exports, Orbit, _orbit_utils) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
var ClientError = function (_Exception) {
    _inherits(ClientError, _Exception);

    function ClientError(description) {
        _classCallCheck(this, ClientError);

        var _this = _possibleConstructorReturn(this, _Exception.call(this, 'Client error: ' + description));

        _this.description = description;
        return _this;
    }

    return ClientError;
}(Orbit.Exception);
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
var ServerError = function (_Exception2) {
    _inherits(ServerError, _Exception2);

    function ServerError(description) {
        _classCallCheck(this, ServerError);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, 'Server error: ' + description));

        _this2.description = description;
        return _this2;
    }

    return ServerError;
}(Orbit.Exception);
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
var NetworkError = function (_Exception3) {
    _inherits(NetworkError, _Exception3);

    function NetworkError(description) {
        _classCallCheck(this, NetworkError);

        var _this3 = _possibleConstructorReturn(this, _Exception3.call(this, 'Network error: ' + description));

        _this3.description = description;
        return _this3;
    }

    return NetworkError;
}(Orbit.Exception);
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
var QueryExpressionParseError = function (_Exception4) {
    _inherits(QueryExpressionParseError, _Exception4);

    function QueryExpressionParseError(description, expression) {
        _classCallCheck(this, QueryExpressionParseError);

        var _this4 = _possibleConstructorReturn(this, _Exception4.call(this, 'Query expression parse error: ' + description));

        _this4.description = description;
        _this4.expression = expression;
        return _this4;
    }

    return QueryExpressionParseError;
}(Orbit.Exception);
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
var QueryNotAllowed = function (_Exception5) {
    _inherits(QueryNotAllowed, _Exception5);

    function QueryNotAllowed(description, query) {
        _classCallCheck(this, QueryNotAllowed);

        var _this5 = _possibleConstructorReturn(this, _Exception5.call(this, 'Query not allowed: ' + description));

        _this5.description = description;
        _this5.query = query;
        return _this5;
    }

    return QueryNotAllowed;
}(Orbit.Exception);
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
var TransformNotAllowed = function (_Exception6) {
    _inherits(TransformNotAllowed, _Exception6);

    function TransformNotAllowed(description, transform) {
        _classCallCheck(this, TransformNotAllowed);

        var _this6 = _possibleConstructorReturn(this, _Exception6.call(this, 'Transform not allowed: ' + description));

        _this6.description = description;
        _this6.transform = transform;
        return _this6;
    }

    return TransformNotAllowed;
}(Orbit.Exception);
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
var SchemaError = function (_Exception7) {
    _inherits(SchemaError, _Exception7);

    function SchemaError(description) {
        _classCallCheck(this, SchemaError);

        var _this7 = _possibleConstructorReturn(this, _Exception7.call(this, 'Schema error: ' + description));

        _this7.description = description;
        return _this7;
    }

    return SchemaError;
}(Orbit.Exception);
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
var ModelNotFound = function (_SchemaError) {
    _inherits(ModelNotFound, _SchemaError);

    function ModelNotFound(type) {
        _classCallCheck(this, ModelNotFound);

        return _possibleConstructorReturn(this, _SchemaError.call(this, 'Model definition for ' + type + ' not found'));
    }

    return ModelNotFound;
}(SchemaError);
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
var RecordException = function (_Exception8) {
    _inherits(RecordException, _Exception8);

    function RecordException(description, type, id, relationship) {
        _classCallCheck(this, RecordException);

        var message = description + ': ' + type + ':' + id;
        if (relationship) {
            message += '/' + relationship;
        }

        var _this9 = _possibleConstructorReturn(this, _Exception8.call(this, message));

        _this9.description = description;
        _this9.type = type;
        _this9.id = id;
        _this9.relationship = relationship;
        return _this9;
    }

    return RecordException;
}(Orbit.Exception);
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
var RecordNotFoundException = function (_RecordException) {
    _inherits(RecordNotFoundException, _RecordException);

    function RecordNotFoundException(type, id) {
        _classCallCheck(this, RecordNotFoundException);

        return _possibleConstructorReturn(this, _RecordException.call(this, 'Record not found', type, id));
    }

    return RecordNotFoundException;
}(RecordException);
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
var RelationshipNotFoundException = function (_RecordException2) {
    _inherits(RelationshipNotFoundException, _RecordException2);

    function RelationshipNotFoundException(type, id, relationship) {
        _classCallCheck(this, RelationshipNotFoundException);

        return _possibleConstructorReturn(this, _RecordException2.call(this, 'Relationship not found', type, id, relationship));
    }

    return RelationshipNotFoundException;
}(RecordException);
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
var RecordAlreadyExistsException = function (_RecordException3) {
    _inherits(RecordAlreadyExistsException, _RecordException3);

    function RecordAlreadyExistsException(type, id) {
        _classCallCheck(this, RecordAlreadyExistsException);

        return _possibleConstructorReturn(this, _RecordException3.call(this, 'Record already exists', type, id));
    }

    return RecordAlreadyExistsException;
}(RecordException);

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maintains a map between records' ids and keys.
 *
 * @export
 * @class KeyMap
 */

var KeyMap = function () {
    function KeyMap() {
        _classCallCheck$1(this, KeyMap);

        this.reset();
    }
    /**
     * Resets the contents of the key map.
     *
     * @memberof KeyMap
     */


    KeyMap.prototype.reset = function reset() {
        this._idsToKeys = {};
        this._keysToIds = {};
    };
    /**
     * Return a key value given a model type, key name, and id.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} idValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.idToKey = function idToKey(type, keyName, idValue) {
        return _orbit_utils.deepGet(this._idsToKeys, [type, keyName, idValue]);
    };
    /**
     * Return an id value given a model type, key name, and key value.
     *
     * @param {string} type
     * @param {string} keyName
     * @param {string} keyValue
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.keyToId = function keyToId(type, keyName, keyValue) {
        return _orbit_utils.deepGet(this._keysToIds, [type, keyName, keyValue]);
    };
    /**
     * Store the id and key values of a record in this key map.
     *
     * @param {Record} record
     * @returns {void}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.pushRecord = function pushRecord(record) {
        var _this = this;

        var type = record.type,
            id = record.id,
            keys = record.keys;

        if (!keys || !id) {
            return;
        }
        Object.keys(keys).forEach(function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                _orbit_utils.deepSet(_this._idsToKeys, [type, keyName, id], keyValue);
                _orbit_utils.deepSet(_this._keysToIds, [type, keyName, keyValue], id);
            }
        });
    };
    /**
     * Given a record, find the cached id if it exists.
     *
     * @param {string} type
     * @param {Dict<string>} keys
     * @returns {string}
     *
     * @memberOf KeyMap
     */


    KeyMap.prototype.idFromKeys = function idFromKeys(type, keys) {
        var _this2 = this;

        var keyNames = Object.keys(keys);
        return _orbit_utils.firstResult(keyNames, function (keyName) {
            var keyValue = keys[keyName];
            if (keyValue) {
                return _this2.keyToId(type, keyName, keyValue);
            }
        });
    };

    return KeyMap;
}();

function cloneRecordIdentity(identity) {
    var type = identity.type,
        id = identity.id;

    return { type: type, id: id };
}
function equalRecordIdentities(record1, record2) {
    return _orbit_utils.isNone(record1) && _orbit_utils.isNone(record2) || _orbit_utils.isObject(record1) && _orbit_utils.isObject(record2) && record1.type === record2.type && record1.id === record2.id;
}
function mergeRecords(current, updates) {
    if (current) {
        var record = cloneRecordIdentity(current);
        ['attributes', 'keys', 'relationships'].forEach(function (grouping) {
            if (current[grouping] && updates[grouping]) {
                record[grouping] = _orbit_utils.merge({}, current[grouping], updates[grouping]);
            } else if (current[grouping]) {
                record[grouping] = _orbit_utils.merge({}, current[grouping]);
            } else if (updates[grouping]) {
                record[grouping] = _orbit_utils.merge({}, updates[grouping]);
            }
        });
        return record;
    } else {
        return updates;
    }
}

function markOperationToDelete(operation) {
    var o = operation;
    o._deleted = true;
}
function isOperationMarkedToDelete(operation) {
    var o = operation;
    return o._deleted === true;
}
function mergeOperations(superceded, superceding, consecutiveOps) {
    if (equalRecordIdentities(superceded.record, superceding.record)) {
        if (superceding.op === 'removeRecord') {
            markOperationToDelete(superceded);
            if (superceded.op === 'addRecord') {
                markOperationToDelete(superceding);
            }
        } else if (!isOperationMarkedToDelete(superceding) && (consecutiveOps || superceding.op === 'replaceAttribute')) {
            if (isReplaceFieldOp(superceded.op) && isReplaceFieldOp(superceding.op)) {
                if (superceded.op === 'replaceAttribute' && superceding.op === 'replaceAttribute' && superceded.attribute === superceding.attribute) {
                    markOperationToDelete(superceded);
                } else if (superceded.op === 'replaceRelatedRecord' && superceding.op === 'replaceRelatedRecord' && superceded.relationship === superceding.relationship) {
                    markOperationToDelete(superceded);
                } else if (superceded.op === 'replaceRelatedRecords' && superceding.op === 'replaceRelatedRecords' && superceded.relationship === superceding.relationship) {
                    markOperationToDelete(superceded);
                } else {
                    if (superceded.op === 'replaceAttribute') {
                        updateRecordReplaceAttribute(superceded.record, superceded.attribute, superceded.value);
                        delete superceded.attribute;
                        delete superceded.value;
                    } else if (superceded.op === 'replaceRelatedRecord') {
                        updateRecordReplaceHasOne(superceded.record, superceded.relationship, superceded.relatedRecord);
                        delete superceded.relationship;
                        delete superceded.relatedRecord;
                    } else if (superceded.op === 'replaceRelatedRecords') {
                        updateRecordReplaceHasMany(superceded.record, superceded.relationship, superceded.relatedRecords);
                        delete superceded.relationship;
                        delete superceded.relatedRecords;
                    }
                    if (superceding.op === 'replaceAttribute') {
                        updateRecordReplaceAttribute(superceded.record, superceding.attribute, superceding.value);
                    } else if (superceding.op === 'replaceRelatedRecord') {
                        updateRecordReplaceHasOne(superceded.record, superceding.relationship, superceding.relatedRecord);
                    } else if (superceding.op === 'replaceRelatedRecords') {
                        updateRecordReplaceHasMany(superceded.record, superceding.relationship, superceding.relatedRecords);
                    }
                    superceded.op = 'replaceRecord';
                    markOperationToDelete(superceding);
                }
            } else if ((superceded.op === 'addRecord' || superceded.op === 'replaceRecord') && isReplaceFieldOp(superceding.op)) {
                if (superceding.op === 'replaceAttribute') {
                    updateRecordReplaceAttribute(superceded.record, superceding.attribute, superceding.value);
                } else if (superceding.op === 'replaceRelatedRecord') {
                    updateRecordReplaceHasOne(superceded.record, superceding.relationship, superceding.relatedRecord);
                } else if (superceding.op === 'replaceRelatedRecords') {
                    updateRecordReplaceHasMany(superceded.record, superceding.relationship, superceding.relatedRecords);
                }
                markOperationToDelete(superceding);
            } else if (superceding.op === 'addToRelatedRecords') {
                if (superceded.op === 'addRecord') {
                    updateRecordAddToHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                    markOperationToDelete(superceding);
                } else if (superceded.op === 'replaceRecord') {
                    if (superceded.record.relationships && superceded.record.relationships[superceding.relationship] && superceded.record.relationships[superceding.relationship].data) {
                        updateRecordAddToHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                        markOperationToDelete(superceding);
                    }
                }
            } else if (superceding.op === 'removeFromRelatedRecords') {
                if (superceded.op === 'addToRelatedRecords' && superceded.relationship === superceding.relationship && equalRecordIdentities(superceded.relatedRecord, superceding.relatedRecord)) {
                    markOperationToDelete(superceded);
                    markOperationToDelete(superceding);
                } else if (superceded.op === 'addRecord' || superceded.op === 'replaceRecord') {
                    if (superceded.record.relationships && superceded.record.relationships[superceding.relationship] && superceded.record.relationships[superceding.relationship].data) {
                        updateRecordRemoveFromHasMany(superceded.record, superceding.relationship, superceding.relatedRecord);
                        markOperationToDelete(superceding);
                    }
                }
            }
        }
    }
}
function isReplaceFieldOp(op) {
    return op === 'replaceAttribute' || op === 'replaceRelatedRecord' || op === 'replaceRelatedRecords';
}
function updateRecordReplaceAttribute(record, attribute, value) {
    record.attributes = record.attributes || {};
    record.attributes[attribute] = value;
}
function updateRecordReplaceHasOne(record, relationship, relatedRecord) {
    _orbit_utils.deepSet(record, ['relationships', relationship, 'data'], cloneRecordIdentity(relatedRecord));
}
function updateRecordReplaceHasMany(record, relationship, relatedRecords) {
    _orbit_utils.deepSet(record, ['relationships', relationship, 'data'], relatedRecords.map(cloneRecordIdentity));
}
function updateRecordAddToHasMany(record, relationship, relatedRecord) {
    var data = _orbit_utils.deepGet(record, ['relationships', relationship, 'data']) || [];
    data.push(cloneRecordIdentity(relatedRecord));
    _orbit_utils.deepSet(record, ['relationships', relationship, 'data'], data);
}
function updateRecordRemoveFromHasMany(record, relationship, relatedRecord) {
    var data = _orbit_utils.deepGet(record, ['relationships', relationship, 'data']);
    if (data) {
        for (var i = 0, l = data.length; i < l; i++) {
            var r = data[i];
            if (equalRecordIdentities(r, relatedRecord)) {
                data.splice(i, 1);
                break;
            }
        }
    }
}
/**
 * Coalesces operations into a minimal set of equivalent operations.
 *
 * This method respects the order of the operations array and does not allow
 * reordering of operations that affect relationships.
 *
 * @export
 * @param {RecordOperation[]} operations
 * @returns {RecordOperation[]}
 */
function coalesceRecordOperations(operations) {
    for (var i = 0, l = operations.length; i < l; i++) {
        var currentOp = operations[i];
        var consecutiveOps = true;
        for (var j = i + 1; j < l; j++) {
            var nextOp = operations[j];
            mergeOperations(currentOp, nextOp, consecutiveOps);
            if (isOperationMarkedToDelete(currentOp)) {
                break;
            } else if (!isOperationMarkedToDelete(nextOp)) {
                consecutiveOps = false;
            }
        }
    }
    return operations.filter(function (o) {
        return !isOperationMarkedToDelete(o);
    });
}
/**
 * Determine the differences between a record and its updated version in terms
 * of a set of operations.
 *
 * @export
 * @param {Record} record
 * @param {Record} updatedRecord
 * @returns {RecordOperation[]}
 */
function recordDiffs(record, updatedRecord) {
    var diffs = [];
    if (record && updatedRecord) {
        var recordIdentity = cloneRecordIdentity(record);
        if (updatedRecord.attributes) {
            Object.keys(updatedRecord.attributes).forEach(function (attribute) {
                var value = updatedRecord.attributes[attribute];
                if (record.attributes === undefined || !_orbit_utils.eq(record.attributes[attribute], value)) {
                    var op = {
                        op: 'replaceAttribute',
                        record: recordIdentity,
                        attribute: attribute,
                        value: value
                    };
                    diffs.push(op);
                }
            });
        }
        if (updatedRecord.keys) {
            Object.keys(updatedRecord.keys).forEach(function (key) {
                var value = updatedRecord.keys[key];
                if (record.keys === undefined || !_orbit_utils.eq(record.keys[key], value)) {
                    var op = {
                        op: 'replaceKey',
                        record: recordIdentity,
                        key: key,
                        value: value
                    };
                    diffs.push(op);
                }
            });
        }
        // TODO - handle relationships
    }
    return diffs;
}

function _defaults$1(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$1(subClass, superClass); }

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Query terms are used by query builders to allow for the construction of
 * query expressions in composable patterns.
 *
 * @export
 * @class QueryTerm
 */
var QueryTerm = function () {
    function QueryTerm(expression) {
        _classCallCheck$3(this, QueryTerm);

        this.expression = expression;
    }

    QueryTerm.prototype.toQueryExpression = function toQueryExpression() {
        return this.expression;
    };

    return QueryTerm;
}();
/**
 * A query term representing a single record.
 *
 * @export
 * @class FindRecordTerm
 * @extends {QueryTerm}
 */
var FindRecordTerm = function (_QueryTerm) {
    _inherits$1(FindRecordTerm, _QueryTerm);

    function FindRecordTerm(record) {
        _classCallCheck$3(this, FindRecordTerm);

        var expression = {
            op: 'findRecord',
            record: record
        };
        return _possibleConstructorReturn$1(this, _QueryTerm.call(this, expression));
    }

    return FindRecordTerm;
}(QueryTerm);
var FindRelatedRecordTerm = function (_QueryTerm2) {
    _inherits$1(FindRelatedRecordTerm, _QueryTerm2);

    function FindRelatedRecordTerm(record, relationship) {
        _classCallCheck$3(this, FindRelatedRecordTerm);

        var expression = {
            op: 'findRelatedRecord',
            record: record,
            relationship: relationship
        };
        return _possibleConstructorReturn$1(this, _QueryTerm2.call(this, expression));
    }

    return FindRelatedRecordTerm;
}(QueryTerm);
var FindRelatedRecordsTerm = function (_QueryTerm3) {
    _inherits$1(FindRelatedRecordsTerm, _QueryTerm3);

    function FindRelatedRecordsTerm(record, relationship) {
        _classCallCheck$3(this, FindRelatedRecordsTerm);

        var expression = {
            op: 'findRelatedRecords',
            record: record,
            relationship: relationship
        };
        return _possibleConstructorReturn$1(this, _QueryTerm3.call(this, expression));
    }

    return FindRelatedRecordsTerm;
}(QueryTerm);
var FindRecordsTerm = function (_QueryTerm4) {
    _inherits$1(FindRecordsTerm, _QueryTerm4);

    function FindRecordsTerm(type) {
        _classCallCheck$3(this, FindRecordsTerm);

        var expression = {
            op: 'findRecords',
            type: type
        };
        return _possibleConstructorReturn$1(this, _QueryTerm4.call(this, expression));
    }
    /**
     * Applies sorting to a collection query.
     *
     * Sort specifiers can be expressed in object form, like:
     *
     * ```ts
     * { attribute: 'name', order: 'descending' }
     * { attribute: 'name', order: 'ascending' }
     * ```
     *
     * Or in string form, like:
     *
     * ```ts
     * '-name' // descending order
     * 'name'  // ascending order
     * ```
     *
     * @param {SortSpecifier[] | string[]} sortSpecifiers
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */


    FindRecordsTerm.prototype.sort = function sort() {
        for (var _len = arguments.length, sortSpecifiers = Array(_len), _key = 0; _key < _len; _key++) {
            sortSpecifiers[_key] = arguments[_key];
        }

        var specifiers = sortSpecifiers.map(parseSortSpecifier);
        this.expression.sort = (this.expression.sort || []).concat(specifiers);
        return this;
    };
    /**
     * Applies pagination to a collection query.
     *
     * Note: Options are currently an opaque pass-through to remote sources.
     *
     * @param {object} options
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */


    FindRecordsTerm.prototype.page = function page(options) {
        this.expression.page = options;
        return this;
    };
    /**
     * Apply an advanced filter expression based on a `RecordCursor`.
     *
     * For example:
     *
     * ```ts
     * oqb
     *   .records('planet')
     *   .filter(record =>
     *     oqb.or(
     *       record.attribute('name').equal('Jupiter'),
     *       record.attribute('name').equal('Pluto')
     *     )
     *   )
     * ```
     *
     * @param {(RecordCursor) => void} predicateExpression
     * @returns {RecordsTerm}
     *
     * @memberOf RecordsTerm
     */


    FindRecordsTerm.prototype.filter = function filter() {
        for (var _len2 = arguments.length, filterSpecifiers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            filterSpecifiers[_key2] = arguments[_key2];
        }

        var expressions = filterSpecifiers.map(parseFilterSpecifier);
        this.expression.filter = (this.expression.filter || []).concat(filterSpecifiers);
        return this;
    };

    return FindRecordsTerm;
}(QueryTerm);
function parseFilterSpecifier(filterSpecifier) {
    if (_orbit_utils.isObject(filterSpecifier)) {
        var s = filterSpecifier;
        if (!s.kind) {
            if (s.hasOwnProperty('relation')) {
                if (s.hasOwnProperty('record')) {
                    s.kind = 'relatedRecord';
                } else if (s.hasOwnProperty('records')) {
                    s.kind = 'relatedRecords';
                }
            } else {
                s.kind = 'attribute';
            }
        }
        s.op = s.op || 'equal';
        return s;
    }
}
function parseSortSpecifier(sortSpecifier) {
    if (_orbit_utils.isObject(sortSpecifier)) {
        var s = sortSpecifier;
        s.kind = s.kind || 'attribute';
        s.order = s.order || 'ascending';
        return s;
    } else if (typeof sortSpecifier === 'string') {
        return parseSortSpecifierString(sortSpecifier);
    }
    throw new Error('Sort expression must be either an object or a string.');
}
function parseSortSpecifierString(sortSpecifier) {
    var attribute = void 0;
    var order = void 0;
    if (sortSpecifier[0] === '-') {
        attribute = sortSpecifier.slice(1);
        order = 'descending';
    } else {
        attribute = sortSpecifier;
        order = 'ascending';
    }
    return {
        kind: 'attribute',
        attribute: attribute,
        order: order
    };
}

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = function () {
    function QueryBuilder() {
        _classCallCheck$2(this, QueryBuilder);
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

/**
 * A builder function for creating a Query from its constituent parts.
 *
 * If a `Query` is passed in with an `id` and `expression`, and no replacement
 * `id` or `options` are also passed in, then the `Query` will be returned
 * unchanged.
 *
 * For all other cases, a new `Query` object will be created and returned.
 *
 * Queries will be assigned the specified `queryId` as `id`. If none is
 * specified, a UUID will be generated.
 *
 * @export
 * @param {QueryOrExpression} queryOrExpression
 * @param {object} [queryOptions]
 * @param {string} [queryId]
 * @param {QueryBuilder} [queryBuilder]
 * @returns {Query}
 */
function buildQuery(queryOrExpression, queryOptions, queryId, queryBuilder) {
    if (typeof queryOrExpression === 'function') {
        return buildQuery(queryOrExpression(queryBuilder), queryOptions, queryId);
    } else {
        var query = queryOrExpression;
        var expression = void 0;
        var options = void 0;
        if (_orbit_utils.isObject(query) && query.expression) {
            if (query.id && !queryOptions && !queryId) {
                return query;
            }
            expression = query.expression;
            options = queryOptions || query.options;
        } else {
            if (queryOrExpression instanceof QueryTerm) {
                expression = queryOrExpression.toQueryExpression();
            } else {
                expression = queryOrExpression;
            }
            options = queryOptions;
        }
        var id = queryId || Orbit__default.uuid();
        return { expression: expression, options: options, id: id };
    }
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */
/**
 * A `Schema` defines the models allowed in a source, including their keys,
 * attributes, and relationships. A single schema may be shared across multiple
 * sources.
 *
 * @export
 * @class Schema
 * @implements {Evented}
 */
var Schema = function () {
    /**
     * Create a new Schema.
     *
     * @constructor
     * @param {SchemaSettings} [settings={}] Optional. Configuration settings.
     * @param {Integer}        [settings.version]       Optional. Schema version. Defaults to 1.
     * @param {Object}   [settings.models]        Optional. Schemas for individual models supported by this schema.
     * @param {Function} [settings.generateId]    Optional. Function used to generate IDs.
     * @param {Function} [settings.pluralize]     Optional. Function used to pluralize names.
     * @param {Function} [settings.singularize]   Optional. Function used to singularize names.
     */
    function Schema() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$4(this, Schema);

        if (settings.version === undefined) {
            settings.version = 1;
        }
        if (settings.models === undefined) {
            settings.models = {};
        }
        this._applySettings(settings);
    }
    /**
     * Version
     * @return {Integer} Version of schema.
     */


    /**
     * Upgrades Schema to a new version with new settings.
     *
     * Emits the `upgrade` event to cue sources to upgrade their data.
     *
     * @param {SchemaSettings} [settings={}]          Settings.
     * @param {Integer}        [settings.version]     Optional. Schema version. Defaults to the current version + 1.
     * @param {Object}         [settings.models]      Schemas for individual models supported by this schema.
     * @param {Function}       [settings.pluralize]   Optional. Function used to pluralize names.
     * @param {Function}       [settings.singularize] Optional. Function used to singularize names.
     */
    Schema.prototype.upgrade = function upgrade() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        this._applySettings(settings);
        this.emit('upgrade', this._version);
    };
    /**
     * Registers a complete set of settings
     *
     * @private
     * @param {Object} settings Settings passed into `constructor` or `upgrade`.
     */


    Schema.prototype._applySettings = function _applySettings(settings) {
        // Version
        this._version = settings.version;
        // Allow overrides
        if (settings.generateId) {
            this.generateId = settings.generateId;
        }
        if (settings.pluralize) {
            this.pluralize = settings.pluralize;
        }
        if (settings.singularize) {
            this.singularize = settings.singularize;
        }
        // Register model schemas
        if (settings.models) {
            this._models = settings.models;
        }
    };
    /**
     * Generate an id for a given model type.
     *
     * @param {String} type Optional. Type of the model for which the ID is being generated.
     * @return {String} Generated model ID
     */


    Schema.prototype.generateId = function generateId(type) {
        return Orbit__default.uuid();
    };
    /**
     * A naive pluralization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} plural form of `word`
     */


    Schema.prototype.pluralize = function pluralize(word) {
        return word + 's';
    };
    /**
     * A naive singularization method.
     *
     * Override with a more robust general purpose inflector or provide an
     * inflector tailored to the vocabularly of your application.
     *
     * @param  {String} word
     * @return {String} singular form of `word`
     */


    Schema.prototype.singularize = function singularize(word) {
        if (word.lastIndexOf('s') === word.length - 1) {
            return word.substr(0, word.length - 1);
        } else {
            return word;
        }
    };

    Schema.prototype.initializeRecord = function initializeRecord(record) {
        if (record.id === undefined) {
            record.id = this.generateId(record.type);
        }
    };

    Schema.prototype.getModel = function getModel(type) {
        var model = this.models[type];
        if (model) {
            return model;
        } else {
            throw new ModelNotFound(type);
        }
    };

    Schema.prototype.hasAttribute = function hasAttribute(type, attribute) {
        var model = this.getModel(type);
        if (model.attributes && model.attributes[attribute]) {
            return true;
        } else {
            return false;
        }
    };

    Schema.prototype.hasRelationship = function hasRelationship(type, relationship) {
        var model = this.getModel(type);
        if (model.relationships && model.relationships[relationship]) {
            return true;
        } else {
            return false;
        }
    };

    _createClass(Schema, [{
        key: "version",
        get: function () {
            return this._version;
        }
    }, {
        key: "models",
        get: function () {
            return this._models;
        }
    }]);

    return Schema;
}();
Schema = __decorate([Orbit.evented], Schema);
var Schema$1 = Schema;

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransformBuilder = function () {
    function TransformBuilder() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$6(this, TransformBuilder);

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

    _createClass$2(TransformBuilder, [{
        key: 'recordInitializer',
        get: function () {
            return this._recordInitializer;
        }
    }]);

    return TransformBuilder;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate$1 = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 Base class for sources.

 @class Source
 @namespace Orbit
 @param {Object} [settings] - settings for source
 @param {String} [settings.name] - Name for source
 @param {Schema} [settings.schema] - Schema for source
 @constructor
 */
exports.Source = function () {
    function Source() {
        var _this = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$5(this, Source);

        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        var name = this._name = settings.name;
        var bucket = this._bucket = settings.bucket;
        this._queryBuilder = settings.queryBuilder;
        this._transformBuilder = settings.transformBuilder;
        var requestQueueSettings = settings.requestQueueSettings || {};
        var syncQueueSettings = settings.syncQueueSettings || {};
        if (bucket) {
            _orbit_utils.assert('TransformLog requires a name if it has a bucket', !!name);
        }
        this._transformLog = new Orbit.Log({ name: name ? name + "-log" : undefined, bucket: bucket });
        this._requestQueue = new Orbit.TaskQueue(this, Object.assign({ name: name ? name + "-requests" : undefined, bucket: bucket }, requestQueueSettings));
        this._syncQueue = new Orbit.TaskQueue(this, Object.assign({ name: name ? name + "-sync" : undefined, bucket: bucket }, syncQueueSettings));
        if (this._schema && (settings.autoUpgrade === undefined || settings.autoUpgrade)) {
            this._schema.on('upgrade', function () {
                return _this.upgrade();
            });
        }
    }

    // Performer interface
    Source.prototype.perform = function perform(task) {
        var method = "__" + task.type + "__";
        return this[method].call(this, task.data);
    };

    /**
     * Upgrade source as part of a schema upgrade.
     *
     * @returns {Promise<void>}
     * @memberof Source
     */


    Source.prototype.upgrade = function upgrade() {
        return Orbit__default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Private methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Notifies listeners that this source has been transformed by emitting the
     `transform` event.
        Resolves when any promises returned to event listeners are resolved.
        Also, adds an entry to the Source's `transformLog` for each transform.
        @protected
     @method _transformed
     @param {Array} transforms - Transforms that have occurred.
     @returns {Promise} Promise that resolves to transforms.
    */


    Source.prototype._transformed = function _transformed(transforms) {
        var _this2 = this;

        return transforms.reduce(function (chain, transform) {
            return chain.then(function () {
                if (_this2._transformLog.contains(transform.id)) {
                    return Orbit__default.Promise.resolve();
                }
                return _this2._transformLog.append(transform.id).then(function () {
                    return Orbit.settleInSeries(_this2, 'transform', transform);
                });
            });
        }, Orbit__default.Promise.resolve()).then(function () {
            return transforms;
        });
    };

    Source.prototype._enqueueRequest = function _enqueueRequest(type, data) {
        return this._requestQueue.push({ type: type, data: data });
    };

    Source.prototype._enqueueSync = function _enqueueSync(type, data) {
        return this._syncQueue.push({ type: type, data: data });
    };

    _createClass$1(Source, [{
        key: "name",
        get: function () {
            return this._name;
        }
    }, {
        key: "schema",
        get: function () {
            return this._schema;
        }
    }, {
        key: "keyMap",
        get: function () {
            return this._keyMap;
        }
    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
    }, {
        key: "transformLog",
        get: function () {
            return this._transformLog;
        }
    }, {
        key: "requestQueue",
        get: function () {
            return this._requestQueue;
        }
    }, {
        key: "syncQueue",
        get: function () {
            return this._syncQueue;
        }
    }, {
        key: "queryBuilder",
        get: function () {
            var qb = this._queryBuilder;
            if (qb === undefined) {
                qb = this._queryBuilder = new QueryBuilder();
            }
            return qb;
        }
    }, {
        key: "transformBuilder",
        get: function () {
            var tb = this._transformBuilder;
            if (tb === undefined) {
                tb = this._transformBuilder = new TransformBuilder({
                    recordInitializer: this._schema
                });
            }
            return tb;
        }
    }]);

    return Source;
}();
exports.Source = __decorate$1([Orbit.evented], exports.Source);

/* eslint-disable valid-jsdoc */
/**
 * A builder function for creating a Transform from its constituent parts.
 *
 * If a `Transform` is passed in with an `id` and `operations`, and no
 * replacement `id` or `options` are also passed in, then the `Transform`
 * will be returned unchanged.
 *
 * For all other cases, a new `Transform` object will be created and returned.
 *
 * Transforms will be assigned the specified `transformId` as `id`. If none
 * is specified, a UUID will be generated.
 *
 * @export
 * @param {TransformOrOperations} transformOrOperations
 * @param {object} [transformOptions]
 * @param {string} [transformId] Unique id for this transform (otherwise a UUID will be assigned)
 * @param {TransformBuilder} [transformBuilder]
 * @returns {Transform}
 */
function buildTransform(transformOrOperations, transformOptions, transformId, transformBuilder) {
    if (typeof transformOrOperations === 'function') {
        return buildTransform(transformOrOperations(transformBuilder), transformOptions, transformId);
    } else {
        var transform = transformOrOperations;
        var operations = void 0;
        var options = void 0;
        if (_orbit_utils.isObject(transform) && transform.operations) {
            if (transform.id && !transformOptions && !transformId) {
                return transform;
            }
            operations = transform.operations;
            options = transformOptions || transform.options;
        } else {
            if (_orbit_utils.isArray(transformOrOperations)) {
                operations = transformOrOperations;
            } else {
                operations = [transformOrOperations];
            }
            options = transformOptions;
        }
        var id = transformId || Orbit__default.uuid();
        return { operations: operations, options: options, id: id };
    }
}

var PULLABLE = '__pullable__';
/**
 * Has a source been decorated as `@pullable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPullable(source) {
    return !!source[PULLABLE];
}
/**
 * Marks a source as "pullable" and adds an implementation of the `Pullable`
 * interface.
 *
 * The `pull` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pullable source emits the following events:
 *
 * - `beforePull` - emitted prior to the processing of `pull`, this event
 * includes the requested `Query` as an argument.
 *
 * - `pull` - emitted after a `pull` has successfully been requested, this
 * event's arguments include both the requested `Query` and an array of the
 * resulting `Transform` instances.
 *
 * - `pullFail` - emitted when an error has occurred processing a `pull`, this
 * event's arguments include both the requested `Query` and the error.
 *
 * A pullable source must implement a private method `_pull`, which performs
 * the processing required for `pull` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function pullable(Klass) {
    var proto = Klass.prototype;
    if (isPullable(proto)) {
        return;
    }
    _orbit_utils.assert('Pullable interface can only be applied to a Source', proto instanceof exports.Source);
    proto[PULLABLE] = true;
    proto.pull = function (queryOrExpression, options, id) {
        var query = buildQuery(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('pull', query);
    };
    proto.__pull__ = function (query) {
        var _this = this;

        return Orbit.fulfillInSeries(this, 'beforePull', query).then(function () {
            return _this._pull(query);
        }).then(function (result) {
            return _this._transformed(result);
        }).then(function (result) {
            return Orbit.settleInSeries(_this, 'pull', query, result).then(function () {
                return result;
            });
        }).catch(function (error) {
            return Orbit.settleInSeries(_this, 'pullFail', query, error).then(function () {
                throw error;
            });
        });
    };
}

var PUSHABLE = '__pushable__';
/**
 * Has a source been decorated as `@pushable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
function isPushable(source) {
    return !!source[PUSHABLE];
}
/**
 * Marks a source as "pushable" and adds an implementation of the `Pushable`
 * interface.
 *
 * The `push` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * A pushable source emits the following events:
 *
 * - `beforePush` - emitted prior to the processing of `push`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `push` - emitted after a `push` has successfully been applied, this event's
 * arguments include both the requested `Transform` and an array of the actual
 * applied `Transform` instances.
 *
 * - `pushFail` - emitted when an error has occurred pushing a transform, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * A pushable source must implement a private method `_push`, which performs
 * the processing required for `push` and returns a promise that resolves to an
 * array of `Transform` instances.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function pushable(Klass) {
    var proto = Klass.prototype;
    if (isPushable(proto)) {
        return;
    }
    _orbit_utils.assert('Pushable interface can only be applied to a Source', proto instanceof exports.Source);
    proto[PUSHABLE] = true;
    proto.push = function (transformOrOperations, options, id) {
        var transform = buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return Orbit__default.Promise.resolve([]);
        }
        return this._enqueueRequest('push', transform);
    };
    proto.__push__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit__default.Promise.resolve([]);
        }
        return Orbit.fulfillInSeries(this, 'beforePush', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return Orbit__default.Promise.resolve([]);
            } else {
                return _this._push(transform).then(function (result) {
                    return _this._transformed(result).then(function () {
                        return Orbit.settleInSeries(_this, 'push', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return Orbit.settleInSeries(_this, 'pushFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}

var QUERYABLE = '__queryable__';
/**
 * Has a source been decorated as `@queryable`?
 *
 * @export
 * @param {object} obj
 * @returns
 */
function isQueryable(source) {
    return !!source[QUERYABLE];
}
/**
 * Marks a source as "queryable" and adds an implementation of the `Queryable`
 * interface.
 *
 * The `query` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * The `Queryable` interface introduces the following events:
 *
 * - `beforeQuery` - emitted prior to the processing of `query`, this event
 * includes the requested `Query` as an argument.
 *
 * - `query` - emitted after a `query` has successfully returned, this event's
 * arguments include both the requested `Query` and the results.
 *
 * - `queryFail` - emitted when an error has occurred processing a query, this
 * event's arguments include both the requested `Query` and the error.
 *
 * A queryable source must implement a private method `_query`, which performs
 * the processing required for `query` and returns a promise that resolves to a
 * set of results.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function queryable(Klass) {
    var proto = Klass.prototype;
    if (isQueryable(proto)) {
        return;
    }
    _orbit_utils.assert('Queryable interface can only be applied to a Source', proto instanceof exports.Source);
    proto[QUERYABLE] = true;
    proto.query = function (queryOrExpression, options, id) {
        var query = buildQuery(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('query', query);
    };
    proto.__query__ = function (query) {
        var _this = this;

        return Orbit.fulfillInSeries(this, 'beforeQuery', query).then(function () {
            return _this._query(query);
        }).then(function (result) {
            return Orbit.settleInSeries(_this, 'query', query, result).then(function () {
                return result;
            });
        }).catch(function (error) {
            return Orbit.settleInSeries(_this, 'queryFail', query, error).then(function () {
                throw error;
            });
        });
    };
}

var SYNCABLE = '__syncable__';
/**
 * Has a source been decorated as `@syncable`?
 *
 * @export
 * @param {SourceClass} source
 * @returns
 */
function isSyncable(source) {
    return !!source[SYNCABLE];
}
/**
 * Marks a source as "syncable" and adds an implementation of the `Syncable`
 * interface.
 *
 * The `sync` method is part of the "sync flow" in Orbit. This flow is used to
 * synchronize the contents of sources.
 *
 * Other sources can participate in the resolution of a `sync` by observing the
 * `transform` event, which is emitted whenever a new `Transform` is applied to
 * a source.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function syncable(Klass) {
    var proto = Klass.prototype;
    if (isSyncable(proto)) {
        return;
    }
    _orbit_utils.assert('Syncable interface can only be applied to a Source', proto instanceof exports.Source);
    proto[SYNCABLE] = true;
    proto.sync = function (transformOrTransforms) {
        var _this = this;

        if (_orbit_utils.isArray(transformOrTransforms)) {
            var transforms = transformOrTransforms;
            return transforms.reduce(function (chain, transform) {
                return chain.then(function () {
                    return _this.sync(transform);
                });
            }, Orbit__default.Promise.resolve());
        } else {
            var transform = transformOrTransforms;
            if (this.transformLog.contains(transform.id)) {
                return Orbit__default.Promise.resolve();
            }
            return this._enqueueSync('sync', transform);
        }
    };
    proto.__sync__ = function (transform) {
        var _this2 = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit__default.Promise.resolve();
        }
        return Orbit.fulfillInSeries(this, 'beforeSync', transform).then(function () {
            if (_this2.transformLog.contains(transform.id)) {
                return Orbit__default.Promise.resolve();
            } else {
                return _this2._sync(transform).then(function () {
                    return _this2._transformed([transform]);
                }).then(function () {
                    return Orbit.settleInSeries(_this2, 'sync', transform);
                });
            }
        }).catch(function (error) {
            return Orbit.settleInSeries(_this2, 'syncFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}

var UPDATABLE = '__updatable__';
/**
 * Has a source been decorated as `@updatable`?
 *
 * @export
 * @param {*} obj
 * @returns
 */
function isUpdatable(source) {
    return !!source[UPDATABLE];
}
/**
 * Marks a source as "updatable" and adds an implementation of the `Updatable`
 * interface.
 *
 * The `update` method is part of the "request flow" in Orbit. Requests trigger
 * events before and after processing of each request. Observers can delay the
 * resolution of a request by returning a promise in an event listener.
 *
 * An updatable source emits the following events:
 *
 * - `beforeUpdate` - emitted prior to the processing of `update`, this event
 * includes the requested `Transform` as an argument.
 *
 * - `update` - emitted after an `update` has successfully been applied, this
 * event includes the requested `Transform` as an argument.
 *
 * - `updateFail` - emitted when an error has occurred applying an update, this
 * event's arguments include both the requested `Transform` and the error.
 *
 * An updatable source must implement a private method `_update`, which performs
 * the processing required for `update` and returns a promise that resolves when
 * complete.
 *
 * @export
 * @decorator
 * @param {SourceClass} Klass
 * @returns {void}
 */
function updatable(Klass) {
    var proto = Klass.prototype;
    if (isUpdatable(proto)) {
        return;
    }
    _orbit_utils.assert('Updatable interface can only be applied to a Source', proto instanceof exports.Source);
    proto[UPDATABLE] = true;
    proto.update = function (transformOrOperations, options, id) {
        var transform = buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return Orbit__default.Promise.resolve();
        }
        return this._enqueueRequest('update', transform);
    };
    proto.__update__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit__default.Promise.resolve();
        }
        return Orbit.fulfillInSeries(this, 'beforeUpdate', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return Orbit__default.Promise.resolve();
            } else {
                return _this._update(transform).then(function (result) {
                    return _this._transformed([transform]).then(function () {
                        return Orbit.settleInSeries(_this, 'update', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return Orbit.settleInSeries(_this, 'updateFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}

exports['default'] = Orbit__default;
exports.KeyMap = KeyMap;
exports.QueryBuilder = QueryBuilder;
exports.Schema = Schema$1;
exports.TransformBuilder = TransformBuilder;
exports.pullable = pullable;
exports.isPullable = isPullable;
exports.pushable = pushable;
exports.isPushable = isPushable;
exports.queryable = queryable;
exports.isQueryable = isQueryable;
exports.syncable = syncable;
exports.isSyncable = isSyncable;
exports.updatable = updatable;
exports.isUpdatable = isUpdatable;
exports.ClientError = ClientError;
exports.ServerError = ServerError;
exports.NetworkError = NetworkError;
exports.QueryExpressionParseError = QueryExpressionParseError;
exports.QueryNotAllowed = QueryNotAllowed;
exports.TransformNotAllowed = TransformNotAllowed;
exports.SchemaError = SchemaError;
exports.ModelNotFound = ModelNotFound;
exports.RecordException = RecordException;
exports.RecordNotFoundException = RecordNotFoundException;
exports.RelationshipNotFoundException = RelationshipNotFoundException;
exports.RecordAlreadyExistsException = RecordAlreadyExistsException;
exports.coalesceRecordOperations = coalesceRecordOperations;
exports.recordDiffs = recordDiffs;
exports.QueryTerm = QueryTerm;
exports.FindRecordTerm = FindRecordTerm;
exports.FindRelatedRecordTerm = FindRelatedRecordTerm;
exports.FindRelatedRecordsTerm = FindRelatedRecordsTerm;
exports.FindRecordsTerm = FindRecordsTerm;
exports.buildQuery = buildQuery;
exports.cloneRecordIdentity = cloneRecordIdentity;
exports.equalRecordIdentities = equalRecordIdentities;
exports.mergeRecords = mergeRecords;
exports.buildTransform = buildTransform;

Object.defineProperty(exports, '__esModule', { value: true });

});
