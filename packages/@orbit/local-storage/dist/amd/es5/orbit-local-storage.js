define('@orbit/local-storage', ['exports', '@orbit/data', '@orbit/utils', '@orbit/core'], function (exports, Orbit, _orbit_utils, Orbit$1) { 'use strict';

var Orbit__default = 'default' in Orbit ? Orbit['default'] : Orbit;
Orbit$1 = 'default' in Orbit$1 ? Orbit$1['default'] : Orbit$1;

var transformOperators = {
    addRecord: function (source, operation) {
        source.putRecord(operation.record);
    },
    replaceRecord: function (source, operation) {
        var updates = operation.record;
        var current = source.getRecord(updates);
        var record = Orbit.mergeRecords(current, updates);
        source.putRecord(record);
    },
    removeRecord: function (source, operation) {
        source.removeRecord(operation.record);
    },
    replaceKey: function (source, operation) {
        var record = source.getRecord(operation.record) || Orbit.cloneRecordIdentity(operation.record);
        record.keys = record.keys || {};
        record.keys[operation.key] = operation.value;
        source.putRecord(record);
    },
    replaceAttribute: function (source, operation) {
        var record = source.getRecord(operation.record) || Orbit.cloneRecordIdentity(operation.record);
        record.attributes = record.attributes || {};
        record.attributes[operation.attribute] = operation.value;
        source.putRecord(record);
    },
    addToRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || Orbit.cloneRecordIdentity(operation.record);
        var relationships = _orbit_utils.deepGet(record, ['relationships', operation.relationship, 'data']);
        if (relationships) {
            relationships.push(operation.relatedRecord);
        } else {
            _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], [operation.relatedRecord]);
        }
        source.putRecord(record);
    },
    removeFromRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record);
        if (record) {
            var relationships = _orbit_utils.deepGet(record, ['relationships', operation.relationship, 'data']);
            if (relationships) {
                for (var i = 0, l = relationships.length; i < l; i++) {
                    if (Orbit.equalRecordIdentities(relationships[i], operation.relatedRecord)) {
                        relationships.splice(i, 1);
                        break;
                    }
                }
                return source.putRecord(record);
            }
        }
    },
    replaceRelatedRecords: function (source, operation) {
        var record = source.getRecord(operation.record) || Orbit.cloneRecordIdentity(operation.record);
        _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecords);
        source.putRecord(record);
    },
    replaceRelatedRecord: function (source, operation) {
        var record = source.getRecord(operation.record) || Orbit.cloneRecordIdentity(operation.record);
        _orbit_utils.deepSet(record, ['relationships', operation.relationship, 'data'], operation.relatedRecord);
        source.putRecord(record);
    }
};

var PullOperators = {
    findRecords: function (source, expression) {
        var operations = [];
        var typeFilter = expression.type;
        for (var key in Orbit__default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                var typesMatch = _orbit_utils.isNone(typeFilter);
                if (!typesMatch) {
                    var fragments = key.split(source.delimiter);
                    var type = fragments[1];
                    typesMatch = typeFilter === type;
                }
                if (typesMatch) {
                    var record = JSON.parse(Orbit__default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record: record
                    });
                }
            }
        }
        return Orbit__default.Promise.resolve([Orbit.buildTransform(operations)]);
    },
    findRecord: function (source, expression) {
        var operations = [];
        var requestedRecord = expression.record;
        for (var key in Orbit__default.globals.localStorage) {
            if (key.indexOf(source.namespace) === 0) {
                var fragments = key.split(source.delimiter);
                var type = fragments[1];
                var id = fragments[2];
                if (type === requestedRecord.type && id === requestedRecord.id) {
                    var record = JSON.parse(Orbit__default.globals.localStorage.getItem(key));
                    if (source.keyMap) {
                        source.keyMap.pushRecord(record);
                    }
                    operations.push({
                        op: 'addRecord',
                        record: record
                    });
                    break;
                }
            }
        }
        return Orbit__default.Promise.resolve([Orbit.buildTransform(operations)]);
    }
};

function supportsLocalStorage() {
    return !!Orbit$1.globals.localStorage;
}

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
/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
var LocalStorageSource = function (_Source) {
    _inherits(LocalStorageSource, _Source);

    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    function LocalStorageSource() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalStorageSource);

        _orbit_utils.assert('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        _orbit_utils.assert('Your browser does not support local storage!', supportsLocalStorage());
        settings.name = settings.name || 'localStorage';

        var _this = _possibleConstructorReturn(this, _Source.call(this, settings));

        _this._namespace = settings.namespace || 'orbit';
        _this._delimiter = settings.delimiter || '/';
        return _this;
    }

    LocalStorageSource.prototype.getKeyForRecord = function getKeyForRecord(record) {
        return [this.namespace, record.type, record.id].join(this.delimiter);
    };

    LocalStorageSource.prototype.getRecord = function getRecord(record) {
        var key = this.getKeyForRecord(record);
        var result = JSON.parse(Orbit__default.globals.localStorage.getItem(key));
        if (result && this._keyMap) {
            this._keyMap.pushRecord(result);
        }
        return result;
    };

    LocalStorageSource.prototype.putRecord = function putRecord(record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#putRecord', key, JSON.stringify(record));
        if (this._keyMap) {
            this._keyMap.pushRecord(record);
        }
        Orbit__default.globals.localStorage.setItem(key, JSON.stringify(record));
    };

    LocalStorageSource.prototype.removeRecord = function removeRecord(record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        Orbit__default.globals.localStorage.removeItem(key);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype.reset = function reset() {
        for (var key in Orbit__default.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                Orbit__default.globals.localStorage.removeItem(key);
            }
        }
        return Orbit__default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._sync = function _sync(transform) {
        this._applyTransform(transform);
        return Orbit__default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._push = function _push(transform) {
        this._applyTransform(transform);
        return Orbit__default.Promise.resolve([transform]);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._pull = function _pull(query) {
        var operator = PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('LocalStorageSource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query.expression);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._applyTransform = function _applyTransform(transform) {
        var _this2 = this;

        transform.operations.forEach(function (operation) {
            transformOperators[operation.op](_this2, operation);
        });
    };

    _createClass(LocalStorageSource, [{
        key: "namespace",
        get: function () {
            return this._namespace;
        }
    }, {
        key: "delimiter",
        get: function () {
            return this._delimiter;
        }
    }]);

    return LocalStorageSource;
}(Orbit.Source);
LocalStorageSource = __decorate([Orbit.pullable, Orbit.pushable, Orbit.syncable], LocalStorageSource);
var LocalStorageSource$1 = LocalStorageSource;

exports['default'] = LocalStorageSource$1;
exports.supportsLocalStorage = supportsLocalStorage;

Object.defineProperty(exports, '__esModule', { value: true });

});
