define('@orbit/store', ['exports', '@orbit/data', '@orbit/utils', '@orbit/core', '@orbit/immutable'], function (exports, Orbit, _orbit_utils, _orbit_core, _orbit_immutable) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Operation processors are used to identify operations that should be performed
 * together to ensure that a `Cache` or other container of data remains
 * consistent and correct.
 *
 * `OperationProcessor` is an abstract base class to be extended by specific
 * operation processors.
 *
 * @export
 * @abstract
 * @class OperationProcessor
 */
var OperationProcessor = function () {
  _createClass$2(OperationProcessor, [{
    key: "cache",

    /**
     * The `Cache` that is monitored.
     *
     * @readonly
     * @memberof OperationProcessor
     */
    get: function () {
      return this._cache;
    }
    /**
     * Creates an instance of OperationProcessor.
     *
     * @param {Cache} cache
     * @memberof OperationProcessor
     */

  }]);

  function OperationProcessor(cache) {
    _classCallCheck$3(this, OperationProcessor);

    this._cache = cache;
  }
  /**
   * Called when all the data in a cache has been reset.
   *
   * If `base` is included, the cache is being reset to match a base cache.
   *
   * @param {Cache} [base]
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.reset = function reset(base) {};
  /**
   * Allow the processor to perform an upgrade as part of a cache upgrade.
   *
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.upgrade = function upgrade() {};
  /**
   * Validates an operation before processing it.
   *
   * @param {RecordOperation} operation
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.validate = function validate(operation) {};
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **BEFORE** the `operation`
   * itself is applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.before = function before(operation) {
    return [];
  };
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * has been applied successfully.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.after = function after(operation) {
    return [];
  };
  /**
   * Called immediately after an `operation` has been applied and before the
   * `patch` event has been emitted (i.e. before any listeners have been
   * notified that the operation was applied).
   *
   * No operations may be returned.
   *
   * @param {RecordOperation} operation
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.immediate = function immediate(operation) {};
  /**
   * Called after an `operation` _and_ any related operations have been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * itself and any operations returned from the `after` hook have been applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */


  OperationProcessor.prototype.finally = function _finally(operation) {
    return [];
  };

  return OperationProcessor;
}();

function _defaults$1(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$1(subClass, superClass); }

/**
 * An operation processor that ensures that a cache's data is consistent and
 * doesn't contain any dead references.
 *
 * This is achieved by maintaining a mapping of reverse relationships for each
 * record. When a record is removed, any references to it can also be identified
 * and removed.
 *
 * @export
 * @class CacheIntegrityProcessor
 * @extends {OperationProcessor}
 */

var CacheIntegrityProcessor = function (_OperationProcessor) {
    _inherits$1(CacheIntegrityProcessor, _OperationProcessor);

    function CacheIntegrityProcessor() {
        _classCallCheck$2(this, CacheIntegrityProcessor);

        return _possibleConstructorReturn$1(this, _OperationProcessor.apply(this, arguments));
    }

    CacheIntegrityProcessor.prototype.after = function after(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsRemoved(operation.record, operation.relationship);
                return [];
            case 'removeFromRelatedRecords':
                this.cache.inverseRelationships.relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'removeRecord':
                var ops = this.clearInverseRelationshipOps(operation.record);
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return ops;
            case 'replaceRecord':
                this.cache.inverseRelationships.recordRemoved(operation.record);
                return [];
            default:
                return [];
        }
    };

    CacheIntegrityProcessor.prototype.immediate = function immediate(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.relationships.replaceRelatedRecord(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'replaceRelatedRecords':
                this.cache.relationships.replaceRelatedRecords(operation.record, operation.relationship, operation.relatedRecords);
                return;
            case 'addToRelatedRecords':
                this.cache.relationships.addToRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'removeFromRelatedRecords':
                this.cache.relationships.removeFromRelatedRecords(operation.record, operation.relationship, operation.relatedRecord);
                return;
            case 'addRecord':
                this.cache.relationships.addRecord(operation.record);
                return;
            case 'replaceRecord':
                this.cache.relationships.replaceRecord(operation.record);
                return;
            case 'removeRecord':
                this.cache.relationships.clearRecord(operation.record);
                return;
        }
    };

    CacheIntegrityProcessor.prototype.finally = function _finally(operation) {
        switch (operation.op) {
            case 'replaceRelatedRecord':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'replaceRelatedRecords':
                this.cache.inverseRelationships.relatedRecordsAdded(operation.record, operation.relationship, operation.relatedRecords);
                return [];
            case 'addToRelatedRecords':
                this.cache.inverseRelationships.relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
                return [];
            case 'addRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            case 'replaceRecord':
                this.cache.inverseRelationships.recordAdded(operation.record);
                return [];
            default:
                return [];
        }
    };

    CacheIntegrityProcessor.prototype.clearInverseRelationshipOps = function clearInverseRelationshipOps(record) {
        var _this2 = this;

        var ops = [];
        var inverseRels = this.cache.inverseRelationships.all(record);
        if (inverseRels.length > 0) {
            var recordIdentity = Orbit.cloneRecordIdentity(record);
            inverseRels.forEach(function (rel) {
                var relationshipDef = _this2.cache.schema.getModel(rel.record.type).relationships[rel.relationship];
                if (relationshipDef.type === 'hasMany') {
                    ops.push({
                        op: 'removeFromRelatedRecords',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: recordIdentity
                    });
                } else {
                    ops.push({
                        op: 'replaceRelatedRecord',
                        record: rel.record,
                        relationship: rel.relationship,
                        relatedRecord: null
                    });
                }
            });
        }
        return ops;
    };

    return CacheIntegrityProcessor;
}(OperationProcessor);

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function serializeRecordIdentity(record) {
    return record.type + ':' + record.id;
}
function deserializeRecordIdentity(identity) {
    var _identity$split = identity.split(':'),
        type = _identity$split[0],
        id = _identity$split[1];

    return { type: type, id: id };
}

var RecordIdentityMap = function () {
    function RecordIdentityMap(base) {
        _classCallCheck$5(this, RecordIdentityMap);

        var identities = this.identities = {};
        if (base) {
            Object.keys(base.identities).forEach(function (k) {
                identities[k] = true;
            });
        }
    }

    RecordIdentityMap.prototype.add = function add(record) {
        this.identities[serializeRecordIdentity(record)] = true;
    };

    RecordIdentityMap.prototype.remove = function remove(record) {
        delete this.identities[serializeRecordIdentity(record)];
    };

    RecordIdentityMap.prototype.has = function has(record) {
        if (record) {
            return !!this.identities[serializeRecordIdentity(record)];
        } else {
            return false;
        }
    };

    RecordIdentityMap.prototype.exclusiveOf = function exclusiveOf(other) {
        return Object.keys(this.identities).filter(function (id) {
            return !other.identities[id];
        }).map(function (id) {
            return deserializeRecordIdentity(id);
        });
    };

    RecordIdentityMap.prototype.equals = function equals(other) {
        return this.exclusiveOf(other).length === 0 && other.exclusiveOf(this).length === 0;
    };

    _createClass$3(RecordIdentityMap, [{
        key: 'values',
        get: function () {
            return Object.keys(this.identities).map(function (id) {
                return deserializeRecordIdentity(id);
            });
        }
    }]);

    return RecordIdentityMap;
}();

function _defaults$2(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$2(subClass, superClass); }

/**
 * An operation processor that ensures that a cache's data is consistent with
 * its associated schema.
 *
 * This includes maintenance of inverse and dependent relationships.
 *
 * @export
 * @class SchemaConsistencyProcessor
 * @extends {OperationProcessor}
 */

var SchemaConsistencyProcessor = function (_OperationProcessor) {
    _inherits$2(SchemaConsistencyProcessor, _OperationProcessor);

    function SchemaConsistencyProcessor() {
        _classCallCheck$4(this, SchemaConsistencyProcessor);

        return _possibleConstructorReturn$2(this, _OperationProcessor.apply(this, arguments));
    }

    SchemaConsistencyProcessor.prototype.after = function after(operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            default:
                return [];
        }
    };

    SchemaConsistencyProcessor.prototype._relatedRecordAdded = function _relatedRecordAdded(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecord) {
            ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsAdded = function _relatedRecordsAdded(record, relationship, relatedRecords) {
        var _this2 = this;

        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship && relatedRecords && relatedRecords.length > 0) {
            relatedRecords.forEach(function (relatedRecord) {
                ops.push(_this2._addRelationshipOp(relatedRecord, inverseRelationship, record));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordRemoved = function _relatedRecordRemoved(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecord === undefined) {
                var currentRecord = this.cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && _orbit_utils.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                ops.push(this._removeRelationshipOp(relatedRecord, inverseRelationship, record));
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordReplaced = function _relatedRecordReplaced(record, relationship, relatedRecord) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            var currentRelatedRecord = this.cache.relationships.relatedRecord(record, relationship);
            if (!Orbit.equalRecordIdentities(relatedRecord, currentRelatedRecord)) {
                if (currentRelatedRecord) {
                    ops.push(this._removeRelationshipOp(currentRelatedRecord, inverseRelationship, record));
                }
                if (relatedRecord) {
                    ops.push(this._addRelationshipOp(relatedRecord, inverseRelationship, record));
                }
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsRemoved = function _relatedRecordsRemoved(record, relationship, relatedRecords) {
        var _this3 = this;

        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var inverseRelationship = relationshipDef.inverse;
        if (inverseRelationship) {
            if (relatedRecords === undefined) {
                relatedRecords = this.cache.relationships.relatedRecords(record, relationship);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return ops.push(_this3._removeRelationshipOp(relatedRecord, inverseRelationship, record));
                });
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._relatedRecordsReplaced = function _relatedRecordsReplaced(record, relationship, relatedRecords) {
        var ops = [];
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var currentRelatedRecordsMap = this.cache.relationships.relatedRecordsMap(record, relationship);
        var addedRecords = void 0;
        if (currentRelatedRecordsMap) {
            var relatedRecordsMap = new RecordIdentityMap();
            relatedRecords.forEach(function (r) {
                return relatedRecordsMap.add(r);
            });
            var removedRecords = currentRelatedRecordsMap.exclusiveOf(relatedRecordsMap);
            Array.prototype.push.apply(ops, this._removeRelatedRecordsOps(record, relationshipDef, removedRecords));
            addedRecords = relatedRecordsMap.exclusiveOf(currentRelatedRecordsMap);
        } else {
            addedRecords = relatedRecords;
        }
        Array.prototype.push.apply(ops, this._addRelatedRecordsOps(record, relationshipDef, addedRecords));
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordAdded = function _recordAdded(record) {
        var _this4 = this;

        var ops = [];
        var relationships = record.relationships;
        if (relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = Orbit.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this4._addRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordRemoved = function _recordRemoved(record) {
        var _this5 = this;

        var ops = [];
        var currentRecord = this.cache.records(record.type).get(record.id);
        var relationships = currentRecord && currentRecord.relationships;
        if (relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = Orbit.cloneRecordIdentity(record);
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                var relatedRecords = recordArrayFromData(relationshipData);
                Array.prototype.push.apply(ops, _this5._removeRelatedRecordsOps(recordIdentity, relationshipDef, relatedRecords));
            });
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._recordReplaced = function _recordReplaced(record) {
        var ops = [];
        if (record.relationships) {
            var modelDef = this.cache.schema.getModel(record.type);
            var recordIdentity = Orbit.cloneRecordIdentity(record);
            for (var relationship in record.relationships) {
                var relationshipDef = modelDef.relationships[relationship];
                var relationshipData = record && _orbit_utils.deepGet(record, ['relationships', relationship, 'data']);
                if (relationshipDef.type === 'hasMany') {
                    Array.prototype.push.apply(ops, this._relatedRecordsReplaced(recordIdentity, relationship, relationshipData));
                } else {
                    Array.prototype.push.apply(ops, this._relatedRecordReplaced(recordIdentity, relationship, relationshipData));
                }
            }
        }
        return ops;
    };

    SchemaConsistencyProcessor.prototype._addRelatedRecordsOps = function _addRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        var _this6 = this;

        if (relatedRecords.length > 0 && relationshipDef.inverse) {
            return relatedRecords.map(function (relatedRecord) {
                return _this6._addRelationshipOp(relatedRecord, relationshipDef.inverse, record);
            });
        }
        return [];
    };

    SchemaConsistencyProcessor.prototype._removeRelatedRecordsOps = function _removeRelatedRecordsOps(record, relationshipDef, relatedRecords) {
        var _this7 = this;

        if (relatedRecords.length > 0) {
            if (relationshipDef.dependent === 'remove') {
                return this._removeDependentRecords(relatedRecords);
            } else if (relationshipDef.inverse) {
                return relatedRecords.map(function (relatedRecord) {
                    return _this7._removeRelationshipOp(relatedRecord, relationshipDef.inverse, record);
                });
            }
        }
        return [];
    };

    SchemaConsistencyProcessor.prototype._addRelationshipOp = function _addRelationshipOp(record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'addToRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: relatedRecord
        };
    };

    SchemaConsistencyProcessor.prototype._removeRelationshipOp = function _removeRelationshipOp(record, relationship, relatedRecord) {
        var relationshipDef = this.cache.schema.getModel(record.type).relationships[relationship];
        var isHasMany = relationshipDef.type === 'hasMany';
        return {
            op: isHasMany ? 'removeFromRelatedRecords' : 'replaceRelatedRecord',
            record: record,
            relationship: relationship,
            relatedRecord: isHasMany ? relatedRecord : null
        };
    };

    SchemaConsistencyProcessor.prototype._removeDependentRecords = function _removeDependentRecords(relatedRecords) {
        return relatedRecords.map(function (record) {
            return {
                op: 'removeRecord',
                record: record
            };
        });
    };

    return SchemaConsistencyProcessor;
}(OperationProcessor);

function recordArrayFromData(data) {
    if (_orbit_utils.isArray(data)) {
        return data;
    } else if (data) {
        return [data];
    } else {
        return [];
    }
}

function _defaults$3(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$3(subClass, superClass); }

/**
 * An operation processor that ensures that an operation is compatible with
 * its associated schema.
 *
 * @export
 * @class SchemaValidationProcessor
 * @extends {OperationProcessor}
 */

var SchemaValidationProcessor = function (_OperationProcessor) {
    _inherits$3(SchemaValidationProcessor, _OperationProcessor);

    function SchemaValidationProcessor() {
        _classCallCheck$6(this, SchemaValidationProcessor);

        return _possibleConstructorReturn$3(this, _OperationProcessor.apply(this, arguments));
    }

    SchemaValidationProcessor.prototype.validate = function validate(operation) {
        switch (operation.op) {
            case 'addRecord':
                return this._recordAdded(operation.record);
            case 'replaceRecord':
                return this._recordReplaced(operation.record);
            case 'removeRecord':
                return this._recordRemoved(operation.record);
            case 'replaceKey':
                return this._keyReplaced(operation.record);
            case 'replaceAttribute':
                return this._attributeReplaced(operation.record);
            case 'addToRelatedRecords':
                return this._relatedRecordAdded(operation.record, operation.relationship, operation.relatedRecord);
            case 'removeFromRelatedRecords':
                return this._relatedRecordRemoved(operation.record, operation.relationship, operation.relatedRecord);
            case 'replaceRelatedRecords':
                return this._relatedRecordsReplaced(operation.record, operation.relationship, operation.relatedRecords);
            case 'replaceRelatedRecord':
                return this._relatedRecordReplaced(operation.record, operation.relationship, operation.relatedRecord);
            default:
                return;
        }
    };

    SchemaValidationProcessor.prototype._recordAdded = function _recordAdded(record) {
        this._validateRecord(record);
    };

    SchemaValidationProcessor.prototype._recordReplaced = function _recordReplaced(record) {
        this._validateRecord(record);
    };

    SchemaValidationProcessor.prototype._recordRemoved = function _recordRemoved(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._keyReplaced = function _keyReplaced(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._attributeReplaced = function _attributeReplaced(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._relatedRecordAdded = function _relatedRecordAdded(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };

    SchemaValidationProcessor.prototype._relatedRecordRemoved = function _relatedRecordRemoved(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        this._validateRecordIdentity(relatedRecord);
    };

    SchemaValidationProcessor.prototype._relatedRecordsReplaced = function _relatedRecordsReplaced(record, relationship, relatedRecords) {
        var _this2 = this;

        this._validateRecordIdentity(record);
        relatedRecords.forEach(function (record) {
            _this2._validateRecordIdentity(record);
        });
    };

    SchemaValidationProcessor.prototype._relatedRecordReplaced = function _relatedRecordReplaced(record, relationship, relatedRecord) {
        this._validateRecordIdentity(record);
        if (relatedRecord) {
            this._validateRecordIdentity(relatedRecord);
        }
    };

    SchemaValidationProcessor.prototype._validateRecord = function _validateRecord(record) {
        this._validateRecordIdentity(record);
    };

    SchemaValidationProcessor.prototype._validateRecordIdentity = function _validateRecordIdentity(record) {
        this.cache.schema.getModel(record.type);
    };

    return SchemaValidationProcessor;
}(OperationProcessor);

var QueryOperators = {
    findRecord: function (cache, expression) {
        var _expression$record = expression.record,
            type = _expression$record.type,
            id = _expression$record.id;

        var record = cache.records(type).get(id);
        if (!record) {
            throw new Orbit.RecordNotFoundException(type, id);
        }
        return record;
    },
    findRecords: function (cache, expression) {
        var results = Array.from(cache.records(expression.type).values());
        if (expression.filter) {
            results = filterRecords(results, expression.filter);
        }
        if (expression.sort) {
            results = sortRecords(results, expression.sort);
        }
        if (expression.page) {
            results = paginateRecords(results, expression.page);
        }
        return results;
    },
    findRelatedRecords: function (cache, expression) {
        var record = expression.record,
            relationship = expression.relationship;
        var type = record.type,
            id = record.id;

        var currentRecord = cache.records(type).get(id);
        var data = currentRecord && _orbit_utils.deepGet(currentRecord, ['relationships', relationship, 'data']);
        if (!data) {
            return [];
        }
        return data.map(function (r) {
            return cache.records(r.type).get(r.id);
        });
    },
    findRelatedRecord: function (cache, expression) {
        var record = expression.record,
            relationship = expression.relationship;
        var type = record.type,
            id = record.id;

        var currentRecord = cache.records(type).get(id);
        var data = currentRecord && _orbit_utils.deepGet(currentRecord, ['relationships', relationship, 'data']);
        if (!data) {
            return null;
        }
        var r = data;
        return cache.records(r.type).get(r.id);
    }
};
function filterRecords(records, filters) {
    return records.filter(function (record) {
        for (var i = 0, l = filters.length; i < l; i++) {
            if (!applyFilter(record, filters[i])) {
                return false;
            }
        }
        return true;
    });
}
function applyFilter(record, filter) {
    if (filter.kind === 'attribute') {
        var actual = _orbit_utils.deepGet(record, ['attributes', filter.attribute]);
        var expected = filter.value;
        switch (filter.op) {
            case 'equal':
                return actual === expected;
            case 'gt':
                return actual > expected;
            case 'gte':
                return actual >= expected;
            case 'lt':
                return actual < expected;
            case 'lte':
                return actual <= expected;
            default:
                throw new Orbit.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecords') {
        var relation = _orbit_utils.deepGet(record, ['relationships', filter.relation]);
        var _actual = relation === undefined ? [] : relation.data;
        var _expected = filter.records;
        switch (filter.op) {
            case 'equal':
                return _actual.length === _expected.length && _expected.every(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'all':
                return _expected.every(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'some':
                return _expected.some(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            case 'none':
                return !_expected.some(function (e) {
                    return _actual.some(function (a) {
                        return a.id === e.id && a.type === e.type;
                    });
                });
            default:
                throw new Orbit.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    } else if (filter.kind === 'relatedRecord') {
        var _relation = _orbit_utils.deepGet(record, ["relationships", filter.relation]);
        var _actual2 = _relation === undefined ? undefined : _relation.data;
        var _expected2 = filter.record;
        switch (filter.op) {
            case 'equal':
                if (Array.isArray(_expected2)) {
                    return _actual2 !== undefined && _expected2.some(function (e) {
                        return _actual2.type === e.type && _actual2.id === e.id;
                    });
                } else {
                    return _actual2 !== undefined && _actual2.type === _expected2.type && _actual2.id === _expected2.id;
                }
            default:
                throw new Orbit.QueryExpressionParseError('Filter operation ${filter.op} not recognized for Store.', filter);
        }
    }
    return false;
}
function sortRecords(records, sortSpecifiers) {
    var comparisonValues = new Map();
    records.forEach(function (record) {
        comparisonValues.set(record, sortSpecifiers.map(function (sortSpecifier) {
            if (sortSpecifier.kind === 'attribute') {
                return _orbit_utils.deepGet(record, ['attributes', sortSpecifier.attribute]);
            } else {
                throw new Orbit.QueryExpressionParseError('Sort specifier ${sortSpecifier.kind} not recognized for Store.', sortSpecifier);
            }
        }));
    });
    var comparisonOrders = sortSpecifiers.map(function (sortExpression) {
        return sortExpression.order === 'descending' ? -1 : 1;
    });
    return records.sort(function (record1, record2) {
        var values1 = comparisonValues.get(record1);
        var values2 = comparisonValues.get(record2);
        for (var i = 0; i < sortSpecifiers.length; i++) {
            if (values1[i] < values2[i]) {
                return -comparisonOrders[i];
            } else if (values1[i] > values2[i]) {
                return comparisonOrders[i];
            } else if (_orbit_utils.isNone(values1[i]) && !_orbit_utils.isNone(values2[i])) {
                return comparisonOrders[i];
            } else if (_orbit_utils.isNone(values2[i]) && !_orbit_utils.isNone(values1[i])) {
                return -comparisonOrders[i];
            }
        }
        return 0;
    });
}
function paginateRecords(records, paginationOptions) {
    if (paginationOptions.limit !== undefined) {
        var offset = paginationOptions.offset === undefined ? 0 : paginationOptions.offset;
        var limit = paginationOptions.limit;
        return records.slice(offset, offset + limit);
    } else {
        throw new Orbit.QueryExpressionParseError('Pagination options not recognized for Store. Please specify `offset` and `limit`.', paginationOptions);
    }
}

var PatchTransforms = {
    addRecord: function (cache, op) {
        var record = op.record;
        var records = cache.records(record.type);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceRecord: function (cache, op) {
        var updates = op.record;
        var records = cache.records(updates.type);
        var current = records.get(updates.id);
        var record = Orbit.mergeRecords(current, updates);
        records.set(record.id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    removeRecord: function (cache, op) {
        var _op$record = op.record,
            type = _op$record.type,
            id = _op$record.id;

        var records = cache.records(type);
        var result = records.get(id);
        if (result) {
            records.remove(id);
            return result;
        } else {
            return null;
        }
    },
    replaceKey: function (cache, op) {
        var _op$record2 = op.record,
            type = _op$record2.type,
            id = _op$record2.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
        } else {
            record = { type: type, id: id };
        }
        _orbit_utils.deepSet(record, ['keys', op.key], op.value);
        records.set(id, record);
        if (cache.keyMap) {
            cache.keyMap.pushRecord(record);
        }
        return record;
    },
    replaceAttribute: function (cache, op) {
        var _op$record3 = op.record,
            type = _op$record3.type,
            id = _op$record3.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
        } else {
            record = { type: type, id: id };
        }
        _orbit_utils.deepSet(record, ['attributes', op.attribute], op.value);
        records.set(id, record);
        return record;
    },
    addToRelatedRecords: function (cache, op) {
        var _op$record4 = op.record,
            type = _op$record4.type,
            id = _op$record4.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
        } else {
            record = { type: type, id: id };
        }
        var relatedRecords = _orbit_utils.deepGet(record, ['relationships', op.relationship, 'data']) || [];
        relatedRecords.push(op.relatedRecord);
        _orbit_utils.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords);
        records.set(id, record);
        return record;
    },
    removeFromRelatedRecords: function (cache, op) {
        var _op$record5 = op.record,
            type = _op$record5.type,
            id = _op$record5.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
            var relatedRecords = _orbit_utils.deepGet(record, ['relationships', op.relationship, 'data']);
            if (relatedRecords) {
                relatedRecords = relatedRecords.filter(function (r) {
                    return !Orbit.equalRecordIdentities(r, op.relatedRecord);
                });
                if (_orbit_utils.deepSet(record, ['relationships', op.relationship, 'data'], relatedRecords)) {
                    records.set(id, record);
                }
            }
            return record;
        }
        return null;
    },
    replaceRelatedRecords: function (cache, op) {
        var _op$record6 = op.record,
            type = _op$record6.type,
            id = _op$record6.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
        } else {
            record = { type: type, id: id };
        }
        if (_orbit_utils.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecords)) {
            records.set(id, record);
        }
        return record;
    },
    replaceRelatedRecord: function (cache, op) {
        var _op$record7 = op.record,
            type = _op$record7.type,
            id = _op$record7.id;

        var records = cache.records(type);
        var record = records.get(id);
        if (record) {
            record = _orbit_utils.clone(record);
        } else {
            record = { type: type, id: id };
        }
        if (_orbit_utils.deepSet(record, ['relationships', op.relationship, 'data'], op.relatedRecord)) {
            records.set(id, record);
        }
        return record;
    }
};

var InverseTransforms = {
    addRecord: function (cache, op) {
        var _op$record = op.record,
            type = _op$record.type,
            id = _op$record.id;

        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else if (_orbit_utils.eq(current, op.record)) {
            return;
        } else {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceRecord: function (cache, op) {
        var replacement = op.record;
        var type = replacement.type,
            id = replacement.id;

        var current = cache.records(type).get(id);
        if (current === undefined) {
            return {
                op: 'removeRecord',
                record: { type: type, id: id }
            };
        } else {
            var result = { type: type, id: id };
            var changed = false;
            ['attributes', 'keys'].forEach(function (grouping) {
                if (replacement[grouping]) {
                    Object.keys(replacement[grouping]).forEach(function (field) {
                        var value = replacement[grouping][field];
                        var currentValue = _orbit_utils.deepGet(current, [grouping, field]);
                        if (!_orbit_utils.eq(value, currentValue)) {
                            changed = true;
                            _orbit_utils.deepSet(result, [grouping, field], currentValue === undefined ? null : currentValue);
                        }
                    });
                }
            });
            if (replacement.relationships) {
                Object.keys(replacement.relationships).forEach(function (field) {
                    var currentValue = _orbit_utils.deepGet(current, ['relationships', field]);
                    var value = replacement.relationships[field];
                    var data = value && value.data;
                    var relationshipMatch = void 0;
                    if (_orbit_utils.isArray(data)) {
                        relationshipMatch = cache.relationships.relatedRecordsMatch(op.record, field, data);
                    } else {
                        relationshipMatch = _orbit_utils.eq(value, currentValue);
                    }
                    if (!relationshipMatch) {
                        changed = true;
                        _orbit_utils.deepSet(result, ['relationships', field], currentValue === undefined ? null : currentValue);
                    }
                });
            }
            if (changed) {
                return {
                    op: 'replaceRecord',
                    record: result
                };
            }
        }
    },
    removeRecord: function (cache, op) {
        var _op$record2 = op.record,
            type = _op$record2.type,
            id = _op$record2.id;

        var current = cache.records(type).get(id);
        if (current !== undefined) {
            return {
                op: 'replaceRecord',
                record: current
            };
        }
    },
    replaceKey: function (cache, op) {
        var _op$record3 = op.record,
            type = _op$record3.type,
            id = _op$record3.id;

        var record = cache.records(type).get(id);
        var current = record && _orbit_utils.deepGet(record, ['keys', op.key]);
        if (!_orbit_utils.eq(current, op.value)) {
            return {
                op: 'replaceKey',
                record: { type: type, id: id },
                key: op.key,
                value: current
            };
        }
    },
    replaceAttribute: function (cache, op) {
        var _op$record4 = op.record,
            type = _op$record4.type,
            id = _op$record4.id;
        var attribute = op.attribute;

        var record = cache.records(type).get(id);
        var current = record && _orbit_utils.deepGet(record, ['attributes', attribute]);
        if (!_orbit_utils.eq(current, op.value)) {
            return {
                op: 'replaceAttribute',
                record: { type: type, id: id },
                attribute: attribute,
                value: current
            };
        }
    },
    addToRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'removeFromRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    removeFromRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'addToRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecord: relatedRecord
            };
        }
    },
    replaceRelatedRecords: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecords = op.relatedRecords;

        if (!cache.relationships.relatedRecordsMatch(record, relationship, relatedRecords)) {
            return {
                op: 'replaceRelatedRecords',
                record: record,
                relationship: relationship,
                relatedRecords: cache.relationships.relatedRecords(record, relationship)
            };
        }
    },
    replaceRelatedRecord: function (cache, op) {
        var record = op.record,
            relationship = op.relationship,
            relatedRecord = op.relatedRecord;

        if (!cache.relationships.relationshipExists(record, relationship, relatedRecord)) {
            return {
                op: 'replaceRelatedRecord',
                record: record,
                relationship: relationship,
                relatedRecord: cache.relationships.relatedRecord(record, relationship) || null
            };
        }
    }
};

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelationshipAccessor = function () {
    function RelationshipAccessor(cache, base) {
        _classCallCheck$7(this, RelationshipAccessor);

        this._cache = cache;
        this.reset(base);
    }

    RelationshipAccessor.prototype.reset = function reset(base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new _orbit_immutable.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    RelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new _orbit_immutable.ImmutableMap();
            }
        });
    };

    RelationshipAccessor.prototype.relationshipExists = function relationshipExists(record, relationship, relatedRecord) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var rel = rels[relationship];
            if (rel) {
                if (rel instanceof RecordIdentityMap) {
                    return rel.has(relatedRecord);
                } else {
                    return Orbit.equalRecordIdentities(relatedRecord, rel);
                }
            }
        }
        return !relatedRecord;
    };

    RelationshipAccessor.prototype.relatedRecord = function relatedRecord(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };

    RelationshipAccessor.prototype.relatedRecords = function relatedRecords(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        var map = rels && rels[relationship];
        if (map) {
            return Array.from(map.values);
        }
    };

    RelationshipAccessor.prototype.relatedRecordsMap = function relatedRecordsMap(record, relationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            return rels[relationship];
        }
    };

    RelationshipAccessor.prototype.relatedRecordsMatch = function relatedRecordsMatch(record, relationship, relatedRecords) {
        var map = this.relatedRecordsMap(record, relationship);
        if (map) {
            var otherMap = new RecordIdentityMap();
            relatedRecords.forEach(function (id) {
                return otherMap.add(id);
            });
            return map.equals(otherMap);
        } else {
            return relatedRecords.length === 0;
        }
    };

    RelationshipAccessor.prototype.addRecord = function addRecord(record) {
        if (record.relationships) {
            var rels = {};
            Object.keys(record.relationships).forEach(function (name) {
                var rel = record.relationships[name];
                if (rel.data !== undefined) {
                    if (_orbit_utils.isArray(rel.data)) {
                        var relMap = rels[name] = new RecordIdentityMap();
                        rel.data.forEach(function (r) {
                            return relMap.add(r);
                        });
                    } else {
                        rels[name] = rel.data;
                    }
                }
            });
            this._relationships[record.type].set(record.id, rels);
        }
    };

    RelationshipAccessor.prototype.replaceRecord = function replaceRecord(record) {
        this.addRecord(record);
    };

    RelationshipAccessor.prototype.clearRecord = function clearRecord(record) {
        this._relationships[record.type].remove(record.id);
    };

    RelationshipAccessor.prototype.addToRelatedRecords = function addToRelatedRecords(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        rel.add(relatedRecord);
        this._relationships[record.type].set(record.id, rels);
    };

    RelationshipAccessor.prototype.removeFromRelatedRecords = function removeFromRelatedRecords(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship]) {
            var rels = cloneRelationships(currentRels);
            var rel = rels[relationship];
            rel.remove(relatedRecord);
            this._relationships[record.type].set(record.id, rels);
        }
    };

    RelationshipAccessor.prototype.replaceRelatedRecords = function replaceRelatedRecords(record, relationship, relatedRecords) {
        var currentRels = this._relationships[record.type].get(record.id);
        var rels = currentRels ? cloneRelationships(currentRels) : {};
        var rel = rels[relationship];
        if (!rel) {
            rel = rels[relationship] = new RecordIdentityMap();
        }
        relatedRecords.forEach(function (relatedRecord) {
            return rel.add(relatedRecord);
        });
        this._relationships[record.type].set(record.id, rels);
    };

    RelationshipAccessor.prototype.replaceRelatedRecord = function replaceRelatedRecord(record, relationship, relatedRecord) {
        var currentRels = this._relationships[record.type].get(record.id);
        if (currentRels && currentRels[relationship] || relatedRecord) {
            var rels = currentRels ? cloneRelationships(currentRels) : {};
            rels[relationship] = relatedRecord;
            this._relationships[record.type].set(record.id, rels);
        }
    };

    return RelationshipAccessor;
}();

function cloneRelationships(rels) {
    var clonedRels = {};
    if (rels) {
        Object.keys(rels).forEach(function (name) {
            var value = rels[name];
            if (value instanceof RecordIdentityMap) {
                clonedRels[name] = new RecordIdentityMap(value);
            } else {
                clonedRels[name] = value;
            }
        });
    }
    return clonedRels;
}

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InverseRelationshipAccessor = function () {
    function InverseRelationshipAccessor(cache, base) {
        _classCallCheck$8(this, InverseRelationshipAccessor);

        this._cache = cache;
        this.reset(base);
    }

    InverseRelationshipAccessor.prototype.reset = function reset(base) {
        var relationships = {};
        Object.keys(this._cache.schema.models).forEach(function (type) {
            var baseRelationships = base && base._relationships[type];
            relationships[type] = new _orbit_immutable.ImmutableMap(baseRelationships);
        });
        this._relationships = relationships;
    };

    InverseRelationshipAccessor.prototype.upgrade = function upgrade() {
        var _this = this;

        Object.keys(this._cache.schema.models).forEach(function (type) {
            if (!_this._relationships[type]) {
                _this._relationships[type] = new _orbit_immutable.ImmutableMap();
            }
        });
    };

    InverseRelationshipAccessor.prototype.all = function all(record) {
        return this._relationships[record.type].get(record.id) || [];
    };

    InverseRelationshipAccessor.prototype.recordAdded = function recordAdded(record) {
        var _this2 = this;

        var relationships = record.relationships;
        var recordIdentity = Orbit.cloneRecordIdentity(record);
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (_orbit_utils.isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this2.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this2.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                    }
                }
            });
        }
    };

    InverseRelationshipAccessor.prototype.recordRemoved = function recordRemoved(record) {
        var _this3 = this;

        var recordInCache = this._cache.records(record.type).get(record.id);
        var relationships = recordInCache && recordInCache.relationships;
        if (relationships) {
            Object.keys(relationships).forEach(function (relationship) {
                var relationshipData = relationships[relationship] && relationships[relationship].data;
                if (relationshipData) {
                    if (_orbit_utils.isArray(relationshipData)) {
                        var relatedRecords = relationshipData;
                        relatedRecords.forEach(function (relatedRecord) {
                            _this3.remove(relatedRecord, { record: record, relationship: relationship });
                        });
                    } else {
                        var relatedRecord = relationshipData;
                        _this3.remove(relatedRecord, { record: record, relationship: relationship });
                    }
                }
            });
        }
        this._relationships[record.type].remove(record.id);
    };

    InverseRelationshipAccessor.prototype.relatedRecordAdded = function relatedRecordAdded(record, relationship, relatedRecord) {
        if (relatedRecord) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = Orbit.cloneRecordIdentity(record);
                this.add(relatedRecord, { record: recordIdentity, relationship: relationship });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordsAdded = function relatedRecordsAdded(record, relationship, relatedRecords) {
        var _this4 = this;

        if (relatedRecords && relatedRecords.length > 0) {
            var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
            if (relationshipDef.inverse) {
                var recordIdentity = Orbit.cloneRecordIdentity(record);
                relatedRecords.forEach(function (relatedRecord) {
                    _this4.add(relatedRecord, { record: recordIdentity, relationship: relationship });
                });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordRemoved = function relatedRecordRemoved(record, relationship, relatedRecord) {
        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecord === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecord = currentRecord && _orbit_utils.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecord) {
                this.remove(relatedRecord, { record: record, relationship: relationship });
            }
        }
    };

    InverseRelationshipAccessor.prototype.relatedRecordsRemoved = function relatedRecordsRemoved(record, relationship, relatedRecords) {
        var _this5 = this;

        var relationshipDef = this._cache.schema.getModel(record.type).relationships[relationship];
        if (relationshipDef.inverse) {
            if (relatedRecords === undefined) {
                var currentRecord = this._cache.records(record.type).get(record.id);
                relatedRecords = currentRecord && _orbit_utils.deepGet(currentRecord, ['relationships', relationship, 'data']);
            }
            if (relatedRecords) {
                relatedRecords.forEach(function (relatedRecord) {
                    return _this5.remove(relatedRecord, { record: record, relationship: relationship });
                });
            }
        }
    };

    InverseRelationshipAccessor.prototype.add = function add(record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        rels = rels ? _orbit_utils.clone(rels) : [];
        rels.push(inverseRelationship);
        this._relationships[record.type].set(record.id, rels);
    };

    InverseRelationshipAccessor.prototype.remove = function remove(record, inverseRelationship) {
        var rels = this._relationships[record.type].get(record.id);
        if (rels) {
            var newRels = rels.filter(function (r) {
                return !(r.record.type === inverseRelationship.record.type && r.record.id === inverseRelationship.record.id && r.relationship === inverseRelationship.relationship);
            });
            this._relationships[record.type].set(record.id, newRels);
        }
    };

    return InverseRelationshipAccessor;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate$1 = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */
/**
 * A `Cache` is an in-memory data store that can be accessed synchronously.
 *
 * Caches use operation processors to maintain internal consistency.
 *
 * Because data is stored in immutable maps, caches can be forked efficiently.
 *
 * @export
 * @class Cache
 * @implements {Evented}
 */
var Cache = function () {
    function Cache() {
        var _this = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$1(this, Cache);

        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new Orbit.QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new Orbit.TransformBuilder({
            recordInitializer: this._schema
        });
        var processors = settings.processors ? settings.processors : [SchemaValidationProcessor, SchemaConsistencyProcessor, CacheIntegrityProcessor];
        this._processors = processors.map(function (Processor) {
            return new Processor(_this);
        });
        this.reset(settings.base);
    }

    Cache.prototype.records = function records(type) {
        return this._records[type];
    };

    /**
     Allows a client to run queries against the cache.
        @example
     ``` javascript
     // using a query builder callback
     cache.query(qb.record('planet', 'idabc123')).then(results => {});
     ```
        @example
     ``` javascript
     // using an expression
     cache.query(oqe('record', 'planet', 'idabc123')).then(results => {});
     ```
        @method query
     @param {Expression} query
     @return {Object} result of query (type depends on query)
     */
    Cache.prototype.query = function query(queryOrExpression, options, id) {
        var query = Orbit.buildQuery(queryOrExpression, options, id, this._queryBuilder);
        return this._query(query.expression);
    };
    /**
     * Resets the cache's state to be either empty or to match the state of
     * another cache.
     *
     * @example
     * ``` javascript
     * cache.reset(); // empties cache
     * cache.reset(cache2); // clones the state of cache2
     * ```
     *
     * @param {Cache} [base]
     * @memberof Cache
     */


    Cache.prototype.reset = function reset(base) {
        var _this2 = this;

        this._records = {};
        Object.keys(this._schema.models).forEach(function (type) {
            var baseRecords = base && base.records(type);
            _this2._records[type] = new _orbit_immutable.ImmutableMap(baseRecords);
        });
        this._relationships = new RelationshipAccessor(this, base && base.relationships);
        this._inverseRelationships = new InverseRelationshipAccessor(this, base && base.inverseRelationships);
        this._processors.forEach(function (processor) {
            return processor.reset(base);
        });
        this.emit('reset');
    };
    /**
     * Upgrade the cache based on the current state of the schema.
     *
     * @memberof Cache
     */


    Cache.prototype.upgrade = function upgrade() {
        var _this3 = this;

        Object.keys(this._schema.models).forEach(function (type) {
            if (!_this3._records[type]) {
                _this3._records[type] = new _orbit_immutable.ImmutableMap();
            }
        });
        this._relationships.upgrade();
        this._inverseRelationships.upgrade();
        this._processors.forEach(function (processor) {
            return processor.upgrade();
        });
    };
    /**
     * Patches the document with an operation.
     *
     * @param {(Operation | Operation[] | TransformBuilderFunc)} operationOrOperations
     * @returns {Operation[]}
     * @memberof Cache
     */


    Cache.prototype.patch = function patch(operationOrOperations) {
        if (typeof operationOrOperations === 'function') {
            operationOrOperations = operationOrOperations(this._transformBuilder);
        }
        var result = {
            inverse: [],
            data: []
        };
        if (_orbit_utils.isArray(operationOrOperations)) {
            this._applyOperations(operationOrOperations, result, true);
        } else {
            this._applyOperation(operationOrOperations, result, true);
        }
        result.inverse.reverse();
        return result;
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////


    Cache.prototype._applyOperations = function _applyOperations(ops, result) {
        var _this4 = this;

        var primary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        ops.forEach(function (op) {
            return _this4._applyOperation(op, result, primary);
        });
    };

    Cache.prototype._applyOperation = function _applyOperation(operation, result) {
        var _this5 = this;

        var primary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this._processors.forEach(function (processor) {
            return processor.validate(operation);
        });
        var inverseTransform = InverseTransforms[operation.op];
        var inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.push(inverseOp);
            // Query and perform related `before` operations
            this._processors.map(function (processor) {
                return processor.before(operation);
            }).forEach(function (ops) {
                return _this5._applyOperations(ops, result);
            });
            // Query related `after` operations before performing
            // the requested operation. These will be applied on success.
            var preparedOps = this._processors.map(function (processor) {
                return processor.after(operation);
            });
            // Perform the requested operation
            var patchTransform = PatchTransforms[operation.op];
            var data = patchTransform(this, operation);
            if (primary) {
                result.data.push(data);
            }
            // Query and perform related `immediate` operations
            this._processors.forEach(function (processor) {
                return processor.immediate(operation);
            });
            // Emit event
            this.emit('patch', operation, data);
            // Perform prepared operations after performing the requested operation
            preparedOps.forEach(function (ops) {
                return _this5._applyOperations(ops, result);
            });
            // Query and perform related `finally` operations
            this._processors.map(function (processor) {
                return processor.finally(operation);
            }).forEach(function (ops) {
                return _this5._applyOperations(ops, result);
            });
        } else if (primary) {
            result.data.push(null);
        }
    };

    Cache.prototype._query = function _query(expression) {
        var operator = QueryOperators[expression.op];
        if (!operator) {
            throw new Error('Unable to find operator: ' + expression.op);
        }
        return operator(this, expression);
    };

    _createClass$1(Cache, [{
        key: "keyMap",
        get: function () {
            return this._keyMap;
        }
    }, {
        key: "schema",
        get: function () {
            return this._schema;
        }
    }, {
        key: "queryBuilder",
        get: function () {
            return this._queryBuilder;
        }
    }, {
        key: "transformBuilder",
        get: function () {
            return this._transformBuilder;
        }
    }, {
        key: "relationships",
        get: function () {
            return this._relationships;
        }
    }, {
        key: "inverseRelationships",
        get: function () {
            return this._inverseRelationships;
        }
    }]);

    return Cache;
}();
Cache = __decorate$1([_orbit_core.evented], Cache);
var Cache$1 = Cache;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Store = Store_1 = function (_Source) {
    _inherits(Store, _Source);

    function Store() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Store);

        _orbit_utils.assert('Store\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        var keyMap = settings.keyMap;
        var schema = settings.schema;
        settings.name = settings.name || 'store';

        var _this = _possibleConstructorReturn(this, _Source.call(this, settings));

        _this._transforms = {};
        _this._transformInverses = {};
        _this.transformLog.on('clear', _this._logCleared, _this);
        _this.transformLog.on('truncate', _this._logTruncated, _this);
        _this.transformLog.on('rollback', _this._logRolledback, _this);
        var cacheSettings = settings.cacheSettings || {};
        cacheSettings.schema = schema;
        cacheSettings.keyMap = keyMap;
        cacheSettings.queryBuilder = cacheSettings.queryBuilder || _this.queryBuilder;
        cacheSettings.transformBuilder = cacheSettings.transformBuilder || _this.transformBuilder;
        if (settings.base) {
            _this._base = settings.base;
            _this._forkPoint = _this._base.transformLog.head;
            cacheSettings.base = _this._base.cache;
        }
        _this._cache = new Cache$1(cacheSettings);
        return _this;
    }

    Store.prototype.upgrade = function upgrade() {
        this._cache.upgrade();
        return Orbit__default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._sync = function _sync(transform) {
        this._applyTransform(transform);
        return Orbit__default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Updatable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._update = function _update(transform) {
        var results = this._applyTransform(transform);
        return Orbit__default.Promise.resolve(results.length === 1 ? results[0] : results);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Queryable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._query = function _query(query) {
        return Orbit__default.Promise.resolve(this._cache.query(query));
    };
    /////////////////////////////////////////////////////////////////////////////
    // Public methods
    /////////////////////////////////////////////////////////////////////////////
    /**
     Create a clone, or "fork", from a "base" store.
        The forked store will have the same `schema` and `keyMap` as its base store.
     The forked store's cache will start with the same immutable document as
     the base store. Its contents and log will evolve independently.
        @method fork
     @returns {Store} The forked store.
    */


    Store.prototype.fork = function fork() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        settings.schema = this._schema;
        settings.cacheSettings = settings.cacheSettings || {};
        settings.keyMap = this._keyMap;
        settings.queryBuilder = this.queryBuilder;
        settings.transformBuilder = this.transformBuilder;
        settings.base = this;
        return new Store_1(settings);
    };
    /**
     Merge transforms from a forked store back into a base store.
        By default, all of the operations from all of the transforms in the forked
     store's history will be reduced into a single transform. A subset of
     operations can be selected by specifying the `sinceTransformId` option.
        The `coalesce` option controls whether operations are coalesced into a
     minimal equivalent set before being reduced into a transform.
        @method merge
     @param {Store} forkedStore - The store to merge.
     @param {Object}  [options] settings
     @param {Boolean} [options.coalesce = true] Should operations be coalesced into a minimal equivalent set?
     @param {String}  [options.sinceTransformId = null] Select only transforms since the specified ID.
     @returns {Promise} The result of calling `update()` with the forked transforms.
    */


    Store.prototype.merge = function merge(forkedStore) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var transforms = void 0;
        if (options.sinceTransformId) {
            transforms = forkedStore.transformsSince(options.sinceTransformId);
        } else {
            transforms = forkedStore.allTransforms();
        }
        var reducedTransform = void 0;
        var ops = [];
        transforms.forEach(function (t) {
            Array.prototype.push.apply(ops, t.operations);
        });
        if (options.coalesce !== false) {
            ops = Orbit.coalesceRecordOperations(ops);
        }
        reducedTransform = Orbit.buildTransform(ops, options.transformOptions);
        return this.update(reducedTransform);
    };
    /**
     Rolls back the Store to a particular transformId
        @method rollback
     @param {string} transformId - The ID of the transform to roll back to
     @param {number} relativePosition - A positive or negative integer to specify a position relative to `transformId`
     @returns {undefined}
    */


    Store.prototype.rollback = function rollback(transformId) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        return this.transformLog.rollback(transformId, relativePosition);
    };
    /**
     Returns all transforms since a particular `transformId`.
        @method transformsSince
     @param {string} transformId - The ID of the transform to start with.
     @returns {Array} Array of transforms.
    */


    Store.prototype.transformsSince = function transformsSince(transformId) {
        var _this2 = this;

        return this.transformLog.after(transformId).map(function (id) {
            return _this2._transforms[id];
        });
    };
    /**
     Returns all tracked transforms.
        @method allTransforms
     @returns {Array} Array of transforms.
    */


    Store.prototype.allTransforms = function allTransforms() {
        var _this3 = this;

        return this.transformLog.entries.map(function (id) {
            return _this3._transforms[id];
        });
    };

    Store.prototype.getTransform = function getTransform(transformId) {
        return this._transforms[transformId];
    };

    Store.prototype.getInverseOperations = function getInverseOperations(transformId) {
        return this._transformInverses[transformId];
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////


    Store.prototype._applyTransform = function _applyTransform(transform) {
        var result = this.cache.patch(transform.operations);
        this._transforms[transform.id] = transform;
        this._transformInverses[transform.id] = result.inverse;
        return result.data;
    };

    Store.prototype._clearTransformFromHistory = function _clearTransformFromHistory(transformId) {
        delete this._transforms[transformId];
        delete this._transformInverses[transformId];
    };

    Store.prototype._logCleared = function _logCleared() {
        this._transforms = {};
        this._transformInverses = {};
    };

    Store.prototype._logTruncated = function _logTruncated(transformId, relativePosition, removed) {
        var _this4 = this;

        removed.forEach(function (id) {
            return _this4._clearTransformFromHistory(id);
        });
    };

    Store.prototype._logRolledback = function _logRolledback(transformId, relativePosition, removed) {
        var _this5 = this;

        removed.reverse().forEach(function (id) {
            var inverseOperations = _this5._transformInverses[id];
            if (inverseOperations) {
                _this5.cache.patch(inverseOperations);
            }
            _this5._clearTransformFromHistory(id);
        });
    };

    _createClass(Store, [{
        key: "cache",
        get: function () {
            return this._cache;
        }
    }, {
        key: "base",
        get: function () {
            return this._base;
        }
    }, {
        key: "forkPoint",
        get: function () {
            return this._forkPoint;
        }
    }]);

    return Store;
}(Orbit.Source);
Store = Store_1 = __decorate([Orbit.syncable, Orbit.queryable, Orbit.updatable], Store);
var Store$1 = Store;
var Store_1;

exports['default'] = Store$1;
exports.Cache = Cache$1;
exports.OperationProcessor = OperationProcessor;
exports.CacheIntegrityProcessor = CacheIntegrityProcessor;
exports.SchemaConsistencyProcessor = SchemaConsistencyProcessor;
exports.SchemaValidationProcessor = SchemaValidationProcessor;

Object.defineProperty(exports, '__esModule', { value: true });

});
