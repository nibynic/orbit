"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("@orbit/utils");

var _core = require("@orbit/core");

var _data = require("@orbit/data");

var _cacheIntegrityProcessor = require("./cache/operation-processors/cache-integrity-processor");

var _cacheIntegrityProcessor2 = _interopRequireDefault(_cacheIntegrityProcessor);

var _schemaConsistencyProcessor = require("./cache/operation-processors/schema-consistency-processor");

var _schemaConsistencyProcessor2 = _interopRequireDefault(_schemaConsistencyProcessor);

var _schemaValidationProcessor = require("./cache/operation-processors/schema-validation-processor");

var _schemaValidationProcessor2 = _interopRequireDefault(_schemaValidationProcessor);

var _queryOperators = require("./cache/query-operators");

var _patchTransforms = require("./cache/patch-transforms");

var _patchTransforms2 = _interopRequireDefault(_patchTransforms);

var _inverseTransforms = require("./cache/inverse-transforms");

var _inverseTransforms2 = _interopRequireDefault(_inverseTransforms);

var _immutable = require("@orbit/immutable");

var _relationshipAccessor = require("./cache/relationship-accessor");

var _relationshipAccessor2 = _interopRequireDefault(_relationshipAccessor);

var _inverseRelationshipAccessor = require("./cache/inverse-relationship-accessor");

var _inverseRelationshipAccessor2 = _interopRequireDefault(_inverseRelationshipAccessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        _classCallCheck(this, Cache);

        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new _data.QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new _data.TransformBuilder({
            recordInitializer: this._schema
        });
        var processors = settings.processors ? settings.processors : [_schemaValidationProcessor2.default, _schemaConsistencyProcessor2.default, _cacheIntegrityProcessor2.default];
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
        var query = (0, _data.buildQuery)(queryOrExpression, options, id, this._queryBuilder);
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
            _this2._records[type] = new _immutable.ImmutableMap(baseRecords);
        });
        this._relationships = new _relationshipAccessor2.default(this, base && base.relationships);
        this._inverseRelationships = new _inverseRelationshipAccessor2.default(this, base && base.inverseRelationships);
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
                _this3._records[type] = new _immutable.ImmutableMap();
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
        if ((0, _utils.isArray)(operationOrOperations)) {
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
        var inverseTransform = _inverseTransforms2.default[operation.op];
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
            var patchTransform = _patchTransforms2.default[operation.op];
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
        var operator = _queryOperators.QueryOperators[expression.op];
        if (!operator) {
            throw new Error('Unable to find operator: ' + expression.op);
        }
        return operator(this, expression);
    };

    _createClass(Cache, [{
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
Cache = __decorate([_core.evented], Cache);
exports.default = Cache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJjIiwiYXJndW1lbnRzIiwiciIsImRlc2MiLCJPYmplY3QiLCJSZWZsZWN0IiwiaSIsImRlY29yYXRvcnMiLCJkIiwic2V0dGluZ3MiLCJyZWNvcmRJbml0aWFsaXplciIsIl9zY2hlbWEiLCJwcm9jZXNzb3JzIiwicXVlcnkiLCJidWlsZFF1ZXJ5IiwiYmFzZVJlY29yZHMiLCJiYXNlIiwicHJvY2Vzc29yIiwib3BlcmF0aW9uT3JPcGVyYXRpb25zIiwicmVzdWx0IiwiaW52ZXJzZSIsImRhdGEiLCJpc0FycmF5IiwicHJpbWFyeSIsIm9wcyIsImludmVyc2VUcmFuc2Zvcm0iLCJJbnZlcnNlVHJhbnNmb3JtcyIsIm9wZXJhdGlvbiIsImludmVyc2VPcCIsInByZXBhcmVkT3BzIiwicGF0Y2hUcmFuc2Zvcm0iLCJQYXRjaFRyYW5zZm9ybXMiLCJvcGVyYXRvciIsIlF1ZXJ5T3BlcmF0b3JzIiwiZXhwcmVzc2lvbiIsIkNhY2hlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW5CQSxJQUFJQSxhQUFhLGFBQVEsVUFBUixVQUFBLElBQTJCLFVBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFSLE1BQUE7QUFBQSxRQUNJQyxJQUFJRixJQUFBQSxDQUFBQSxHQUFBQSxNQUFBQSxHQUFpQkcsU0FBQUEsSUFBQUEsR0FBZ0JBLE9BQU9DLE9BQUFBLHdCQUFBQSxDQUFBQSxNQUFBQSxFQUF2QkQsR0FBdUJDLENBQXZCRCxHQUR6QixJQUFBO0FBQUEsUUFBQSxDQUFBO0FBR0EsUUFBSSxPQUFBLE9BQUEsS0FBQSxRQUFBLElBQStCLE9BQU9FLFFBQVAsUUFBQSxLQUFuQyxVQUFBLEVBQTJFSCxJQUFJRyxRQUFBQSxRQUFBQSxDQUFBQSxVQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxHQUFBQSxFQUEvRSxJQUErRUEsQ0FBSkgsQ0FBM0UsS0FBb0ksS0FBSyxJQUFJSSxJQUFJQyxXQUFBQSxNQUFBQSxHQUFiLENBQUEsRUFBb0NELEtBQXBDLENBQUEsRUFBQSxHQUFBLEVBQUE7QUFBaUQsWUFBSUUsSUFBSUQsV0FBUixDQUFRQSxDQUFSLEVBQXVCTCxJQUFJLENBQUNGLElBQUFBLENBQUFBLEdBQVFRLEVBQVJSLENBQVFRLENBQVJSLEdBQWVBLElBQUFBLENBQUFBLEdBQVFRLEVBQUFBLE1BQUFBLEVBQUFBLEdBQUFBLEVBQVJSLENBQVFRLENBQVJSLEdBQTRCUSxFQUFBQSxNQUFBQSxFQUE1QyxHQUE0Q0EsQ0FBNUMsS0FBSk4sQ0FBQUE7QUFDNU0sWUFBT0YsSUFBQUEsQ0FBQUEsSUFBQUEsQ0FBQUEsSUFBY0ksT0FBQUEsY0FBQUEsQ0FBQUEsTUFBQUEsRUFBQUEsR0FBQUEsRUFBZEosQ0FBY0ksQ0FBZEosRUFBUCxDQUFBO0FBTEosQ0FBQTtBQU9BOztBQWFBOzs7Ozs7Ozs7OztBQVdBLElBQUksUUFBQSxZQUFBO0FBQ0EsYUFBQSxLQUFBLEdBQTJCO0FBQUEsWUFBQSxRQUFBLElBQUE7O0FBQUEsWUFBZlMsV0FBZSxVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQUosRUFBSTs7QUFBQSx3QkFBQSxJQUFBLEVBQUEsS0FBQTs7QUFDdkIsYUFBQSxPQUFBLEdBQWVBLFNBQWYsTUFBQTtBQUNBLGFBQUEsT0FBQSxHQUFlQSxTQUFmLE1BQUE7QUFDQSxhQUFBLGFBQUEsR0FBcUJBLFNBQUFBLFlBQUFBLElBQXlCLElBQTlDLGtCQUE4QyxFQUE5QztBQUNBLGFBQUEsaUJBQUEsR0FBeUJBLFNBQUFBLGdCQUFBQSxJQUE2QixJQUFBLHNCQUFBLENBQXFCO0FBQ3ZFQywrQkFBbUIsS0FBS0M7QUFEK0MsU0FBckIsQ0FBdEQ7QUFHQSxZQUFNQyxhQUFhSCxTQUFBQSxVQUFBQSxHQUFzQkEsU0FBdEJBLFVBQUFBLEdBQTRDLENBQUEsbUNBQUEsRUFBQSxvQ0FBQSxFQUEvRCxpQ0FBK0QsQ0FBL0Q7QUFDQSxhQUFBLFdBQUEsR0FBbUIsV0FBQSxHQUFBLENBQWUsVUFBQSxTQUFBLEVBQUE7QUFBQSxtQkFBYSxJQUFBLFNBQUEsQ0FBYixLQUFhLENBQWI7QUFBbEMsU0FBbUIsQ0FBbkI7QUFDQSxhQUFBLEtBQUEsQ0FBV0EsU0FBWCxJQUFBO0FBQ0g7O0FBWEQsVUFBQSxTQUFBLENBQUEsT0FBQSxHQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsRUF3QmM7QUFDVixlQUFPLEtBQUEsUUFBQSxDQUFQLElBQU8sQ0FBUDtBQXpCSixLQUFBOztBQWlDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWpDQSxVQUFBLFNBQUEsQ0FBQSxLQUFBLEdBQUEsU0FBQSxLQUFBLENBQUEsaUJBQUEsRUFBQSxPQUFBLEVBQUEsRUFBQSxFQWlEc0M7QUFDbEMsWUFBTUksUUFBUUMsc0JBQUFBLGlCQUFBQSxFQUFBQSxPQUFBQSxFQUFBQSxFQUFBQSxFQUEyQyxLQUF6RCxhQUFjQSxDQUFkO0FBQ0EsZUFBTyxLQUFBLE1BQUEsQ0FBWUQsTUFBbkIsVUFBTyxDQUFQO0FBbkRKLEtBQUE7QUFxREE7Ozs7Ozs7Ozs7Ozs7O0FBckRBLFVBQUEsU0FBQSxDQUFBLEtBQUEsR0FBQSxTQUFBLEtBQUEsQ0FBQSxJQUFBLEVBa0VZO0FBQUEsWUFBQSxTQUFBLElBQUE7O0FBQ1IsYUFBQSxRQUFBLEdBQUEsRUFBQTtBQUNBVCxlQUFBQSxJQUFBQSxDQUFZLEtBQUEsT0FBQSxDQUFaQSxNQUFBQSxFQUFBQSxPQUFBQSxDQUF5QyxVQUFBLElBQUEsRUFBUTtBQUM3QyxnQkFBSVcsY0FBY0MsUUFBUUEsS0FBQUEsT0FBQUEsQ0FBMUIsSUFBMEJBLENBQTFCO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsSUFBc0IsSUFBQSx1QkFBQSxDQUF0QixXQUFzQixDQUF0QjtBQUZKWixTQUFBQTtBQUlBLGFBQUEsY0FBQSxHQUFzQixJQUFBLDhCQUFBLENBQUEsSUFBQSxFQUErQlksUUFBUUEsS0FBN0QsYUFBc0IsQ0FBdEI7QUFDQSxhQUFBLHFCQUFBLEdBQTZCLElBQUEscUNBQUEsQ0FBQSxJQUFBLEVBQXNDQSxRQUFRQSxLQUEzRSxvQkFBNkIsQ0FBN0I7QUFDQSxhQUFBLFdBQUEsQ0FBQSxPQUFBLENBQXlCLFVBQUEsU0FBQSxFQUFBO0FBQUEsbUJBQWFDLFVBQUFBLEtBQUFBLENBQWIsSUFBYUEsQ0FBYjtBQUF6QixTQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsT0FBQTtBQTNFSixLQUFBO0FBNkVBOzs7Ozs7QUE3RUEsVUFBQSxTQUFBLENBQUEsT0FBQSxHQUFBLFNBQUEsT0FBQSxHQWtGVTtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUNOYixlQUFBQSxJQUFBQSxDQUFZLEtBQUEsT0FBQSxDQUFaQSxNQUFBQSxFQUFBQSxPQUFBQSxDQUF5QyxVQUFBLElBQUEsRUFBUTtBQUM3QyxnQkFBSSxDQUFDLE9BQUEsUUFBQSxDQUFMLElBQUssQ0FBTCxFQUEwQjtBQUN0Qix1QkFBQSxRQUFBLENBQUEsSUFBQSxJQUFzQixJQUF0Qix1QkFBc0IsRUFBdEI7QUFDSDtBQUhMQSxTQUFBQTtBQUtBLGFBQUEsY0FBQSxDQUFBLE9BQUE7QUFDQSxhQUFBLHFCQUFBLENBQUEsT0FBQTtBQUNBLGFBQUEsV0FBQSxDQUFBLE9BQUEsQ0FBeUIsVUFBQSxTQUFBLEVBQUE7QUFBQSxtQkFBYWEsVUFBYixPQUFhQSxFQUFiO0FBQXpCLFNBQUE7QUExRkosS0FBQTtBQTRGQTs7Ozs7Ozs7QUE1RkEsVUFBQSxTQUFBLENBQUEsS0FBQSxHQUFBLFNBQUEsS0FBQSxDQUFBLHFCQUFBLEVBbUc2QjtBQUN6QixZQUFJLE9BQUEscUJBQUEsS0FBSixVQUFBLEVBQWlEO0FBQzdDQyxvQ0FBd0JBLHNCQUFzQixLQUE5Q0EsaUJBQXdCQSxDQUF4QkE7QUFDSDtBQUNELFlBQU1DLFNBQVM7QUFDWEMscUJBRFcsRUFBQTtBQUVYQyxrQkFBTTtBQUZLLFNBQWY7QUFJQSxZQUFJQyxvQkFBSixxQkFBSUEsQ0FBSixFQUFvQztBQUNoQyxpQkFBQSxnQkFBQSxDQUFBLHFCQUFBLEVBQUEsTUFBQSxFQUFBLElBQUE7QUFESixTQUFBLE1BRU87QUFDSCxpQkFBQSxlQUFBLENBQUEscUJBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQTtBQUNIO0FBQ0RILGVBQUFBLE9BQUFBLENBQUFBLE9BQUFBO0FBQ0EsZUFBQSxNQUFBO0FBakhKLEtBQUE7QUFtSEE7QUFDQTtBQUNBOzs7QUFySEEsVUFBQSxTQUFBLENBQUEsZ0JBQUEsR0FBQSxTQUFBLGdCQUFBLENBQUEsR0FBQSxFQUFBLE1BQUEsRUFzSCtDO0FBQUEsWUFBQSxTQUFBLElBQUE7O0FBQUEsWUFBakJJLFVBQWlCLFVBQUEsTUFBQSxHQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsTUFBQSxTQUFBLEdBQUEsVUFBQSxDQUFBLENBQUEsR0FBUCxLQUFPOztBQUMzQ0MsWUFBQUEsT0FBQUEsQ0FBWSxVQUFBLEVBQUEsRUFBQTtBQUFBLG1CQUFNLE9BQUEsZUFBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLEVBQU4sT0FBTSxDQUFOO0FBQVpBLFNBQUFBO0FBdkhKLEtBQUE7O0FBQUEsVUFBQSxTQUFBLENBQUEsZUFBQSxHQUFBLFNBQUEsZUFBQSxDQUFBLFNBQUEsRUFBQSxNQUFBLEVBeUhvRDtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUFBLFlBQWpCRCxVQUFpQixVQUFBLE1BQUEsR0FBQSxDQUFBLElBQUEsVUFBQSxDQUFBLE1BQUEsU0FBQSxHQUFBLFVBQUEsQ0FBQSxDQUFBLEdBQVAsS0FBTzs7QUFDaEQsYUFBQSxXQUFBLENBQUEsT0FBQSxDQUF5QixVQUFBLFNBQUEsRUFBQTtBQUFBLG1CQUFhTixVQUFBQSxRQUFBQSxDQUFiLFNBQWFBLENBQWI7QUFBekIsU0FBQTtBQUNBLFlBQU1RLG1CQUFtQkMsNEJBQWtCQyxVQUEzQyxFQUF5QkQsQ0FBekI7QUFDQSxZQUFNRSxZQUFZSCxpQkFBQUEsSUFBQUEsRUFBbEIsU0FBa0JBLENBQWxCO0FBQ0EsWUFBQSxTQUFBLEVBQWU7QUFDWE4sbUJBQUFBLE9BQUFBLENBQUFBLElBQUFBLENBQUFBLFNBQUFBO0FBQ0E7QUFDQSxpQkFBQSxXQUFBLENBQUEsR0FBQSxDQUFxQixVQUFBLFNBQUEsRUFBQTtBQUFBLHVCQUFhRixVQUFBQSxNQUFBQSxDQUFiLFNBQWFBLENBQWI7QUFBckIsYUFBQSxFQUFBLE9BQUEsQ0FBdUUsVUFBQSxHQUFBLEVBQUE7QUFBQSx1QkFBTyxPQUFBLGdCQUFBLENBQUEsR0FBQSxFQUFQLE1BQU8sQ0FBUDtBQUF2RSxhQUFBO0FBQ0E7QUFDQTtBQUNBLGdCQUFJWSxjQUFjLEtBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBcUIsVUFBQSxTQUFBLEVBQUE7QUFBQSx1QkFBYVosVUFBQUEsS0FBQUEsQ0FBYixTQUFhQSxDQUFiO0FBQXZDLGFBQWtCLENBQWxCO0FBQ0E7QUFDQSxnQkFBSWEsaUJBQWlCQywwQkFBZ0JKLFVBQXJDLEVBQXFCSSxDQUFyQjtBQUNBLGdCQUFJVixPQUFPUyxlQUFBQSxJQUFBQSxFQUFYLFNBQVdBLENBQVg7QUFDQSxnQkFBQSxPQUFBLEVBQWE7QUFDVFgsdUJBQUFBLElBQUFBLENBQUFBLElBQUFBLENBQUFBLElBQUFBO0FBQ0g7QUFDRDtBQUNBLGlCQUFBLFdBQUEsQ0FBQSxPQUFBLENBQXlCLFVBQUEsU0FBQSxFQUFBO0FBQUEsdUJBQWFGLFVBQUFBLFNBQUFBLENBQWIsU0FBYUEsQ0FBYjtBQUF6QixhQUFBO0FBQ0E7QUFDQSxpQkFBQSxJQUFBLENBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBO0FBQ0E7QUFDQVksd0JBQUFBLE9BQUFBLENBQW9CLFVBQUEsR0FBQSxFQUFBO0FBQUEsdUJBQU8sT0FBQSxnQkFBQSxDQUFBLEdBQUEsRUFBUCxNQUFPLENBQVA7QUFBcEJBLGFBQUFBO0FBQ0E7QUFDQSxpQkFBQSxXQUFBLENBQUEsR0FBQSxDQUFxQixVQUFBLFNBQUEsRUFBQTtBQUFBLHVCQUFhWixVQUFBQSxPQUFBQSxDQUFiLFNBQWFBLENBQWI7QUFBckIsYUFBQSxFQUFBLE9BQUEsQ0FBd0UsVUFBQSxHQUFBLEVBQUE7QUFBQSx1QkFBTyxPQUFBLGdCQUFBLENBQUEsR0FBQSxFQUFQLE1BQU8sQ0FBUDtBQUF4RSxhQUFBO0FBcEJKLFNBQUEsTUFxQk8sSUFBQSxPQUFBLEVBQWE7QUFDaEJFLG1CQUFBQSxJQUFBQSxDQUFBQSxJQUFBQSxDQUFBQSxJQUFBQTtBQUNIO0FBcEpMLEtBQUE7O0FBQUEsVUFBQSxTQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsTUFBQSxDQUFBLFVBQUEsRUFzSm1CO0FBQ2YsWUFBTWEsV0FBV0MsK0JBQWVDLFdBQWhDLEVBQWlCRCxDQUFqQjtBQUNBLFlBQUksQ0FBSixRQUFBLEVBQWU7QUFDWCxrQkFBTSxJQUFBLEtBQUEsQ0FBVSw4QkFBOEJDLFdBQTlDLEVBQU0sQ0FBTjtBQUNIO0FBQ0QsZUFBT0YsU0FBQUEsSUFBQUEsRUFBUCxVQUFPQSxDQUFQO0FBM0pKLEtBQUE7O0FBQUEsaUJBQUEsS0FBQSxFQUFBLENBQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLFlBWWE7QUFDVCxtQkFBTyxLQUFQLE9BQUE7QUFDSDtBQWRELEtBQUEsRUFBQTtBQUFBLGFBQUEsUUFBQTtBQUFBLGFBQUEsWUFlYTtBQUNULG1CQUFPLEtBQVAsT0FBQTtBQUNIO0FBakJELEtBQUEsRUFBQTtBQUFBLGFBQUEsY0FBQTtBQUFBLGFBQUEsWUFrQm1CO0FBQ2YsbUJBQU8sS0FBUCxhQUFBO0FBQ0g7QUFwQkQsS0FBQSxFQUFBO0FBQUEsYUFBQSxrQkFBQTtBQUFBLGFBQUEsWUFxQnVCO0FBQ25CLG1CQUFPLEtBQVAsaUJBQUE7QUFDSDtBQXZCRCxLQUFBLEVBQUE7QUFBQSxhQUFBLGVBQUE7QUFBQSxhQUFBLFlBMkJvQjtBQUNoQixtQkFBTyxLQUFQLGNBQUE7QUFDSDtBQTdCRCxLQUFBLEVBQUE7QUFBQSxhQUFBLHNCQUFBO0FBQUEsYUFBQSxZQThCMkI7QUFDdkIsbUJBQU8sS0FBUCxxQkFBQTtBQUNIO0FBaENELEtBQUEsQ0FBQTs7QUFBQSxXQUFBLEtBQUE7QUFBSixDQUFJLEVBQUo7QUE4SkFHLFFBQVFwQyxXQUFXLENBQVhBLGFBQVcsQ0FBWEEsRUFBUm9DLEtBQVFwQyxDQUFSb0M7a0JBQ0EsSyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBldmVudGVkIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgUXVlcnlCdWlsZGVyLCBUcmFuc2Zvcm1CdWlsZGVyLCBidWlsZFF1ZXJ5IH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IENhY2hlSW50ZWdyaXR5UHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvY2FjaGUtaW50ZWdyaXR5LXByb2Nlc3Nvcic7XG5pbXBvcnQgU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtY29uc2lzdGVuY3ktcHJvY2Vzc29yJztcbmltcG9ydCBTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIGZyb20gJy4vY2FjaGUvb3BlcmF0aW9uLXByb2Nlc3NvcnMvc2NoZW1hLXZhbGlkYXRpb24tcHJvY2Vzc29yJztcbmltcG9ydCB7IFF1ZXJ5T3BlcmF0b3JzIH0gZnJvbSAnLi9jYWNoZS9xdWVyeS1vcGVyYXRvcnMnO1xuaW1wb3J0IFBhdGNoVHJhbnNmb3JtcyBmcm9tICcuL2NhY2hlL3BhdGNoLXRyYW5zZm9ybXMnO1xuaW1wb3J0IEludmVyc2VUcmFuc2Zvcm1zIGZyb20gJy4vY2FjaGUvaW52ZXJzZS10cmFuc2Zvcm1zJztcbmltcG9ydCB7IEltbXV0YWJsZU1hcCB9IGZyb20gJ0BvcmJpdC9pbW11dGFibGUnO1xuaW1wb3J0IFJlbGF0aW9uc2hpcEFjY2Vzc29yIGZyb20gJy4vY2FjaGUvcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcbmltcG9ydCBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXJlbGF0aW9uc2hpcC1hY2Nlc3Nvcic7XG4vKipcbiAqIEEgYENhY2hlYCBpcyBhbiBpbi1tZW1vcnkgZGF0YSBzdG9yZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBzeW5jaHJvbm91c2x5LlxuICpcbiAqIENhY2hlcyB1c2Ugb3BlcmF0aW9uIHByb2Nlc3NvcnMgdG8gbWFpbnRhaW4gaW50ZXJuYWwgY29uc2lzdGVuY3kuXG4gKlxuICogQmVjYXVzZSBkYXRhIGlzIHN0b3JlZCBpbiBpbW11dGFibGUgbWFwcywgY2FjaGVzIGNhbiBiZSBmb3JrZWQgZWZmaWNpZW50bHkuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENhY2hlXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cbiAqL1xubGV0IENhY2hlID0gY2xhc3MgQ2FjaGUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgdGhpcy5fc2NoZW1hID0gc2V0dGluZ3Muc2NoZW1hO1xuICAgICAgICB0aGlzLl9rZXlNYXAgPSBzZXR0aW5ncy5rZXlNYXA7XG4gICAgICAgIHRoaXMuX3F1ZXJ5QnVpbGRlciA9IHNldHRpbmdzLnF1ZXJ5QnVpbGRlciB8fCBuZXcgUXVlcnlCdWlsZGVyKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIgPSBzZXR0aW5ncy50cmFuc2Zvcm1CdWlsZGVyIHx8IG5ldyBUcmFuc2Zvcm1CdWlsZGVyKHtcbiAgICAgICAgICAgIHJlY29yZEluaXRpYWxpemVyOiB0aGlzLl9zY2hlbWFcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHByb2Nlc3NvcnMgPSBzZXR0aW5ncy5wcm9jZXNzb3JzID8gc2V0dGluZ3MucHJvY2Vzc29ycyA6IFtTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yLCBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciwgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3JdO1xuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gcHJvY2Vzc29ycy5tYXAoUHJvY2Vzc29yID0+IG5ldyBQcm9jZXNzb3IodGhpcykpO1xuICAgICAgICB0aGlzLnJlc2V0KHNldHRpbmdzLmJhc2UpO1xuICAgIH1cbiAgICBnZXQga2V5TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5TWFwO1xuICAgIH1cbiAgICBnZXQgc2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1hO1xuICAgIH1cbiAgICBnZXQgcXVlcnlCdWlsZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcXVlcnlCdWlsZGVyO1xuICAgIH1cbiAgICBnZXQgdHJhbnNmb3JtQnVpbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXI7XG4gICAgfVxuICAgIHJlY29yZHModHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVjb3Jkc1t0eXBlXTtcbiAgICB9XG4gICAgZ2V0IHJlbGF0aW9uc2hpcHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICBnZXQgaW52ZXJzZVJlbGF0aW9uc2hpcHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcztcbiAgICB9XG4gICAgLyoqXG4gICAgIEFsbG93cyBhIGNsaWVudCB0byBydW4gcXVlcmllcyBhZ2FpbnN0IHRoZSBjYWNoZS5cbiAgICAgICAgQGV4YW1wbGVcbiAgICAgYGBgIGphdmFzY3JpcHRcbiAgICAgLy8gdXNpbmcgYSBxdWVyeSBidWlsZGVyIGNhbGxiYWNrXG4gICAgIGNhY2hlLnF1ZXJ5KHFiLnJlY29yZCgncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XG4gICAgIGBgYFxuICAgICAgICBAZXhhbXBsZVxuICAgICBgYGAgamF2YXNjcmlwdFxuICAgICAvLyB1c2luZyBhbiBleHByZXNzaW9uXG4gICAgIGNhY2hlLnF1ZXJ5KG9xZSgncmVjb3JkJywgJ3BsYW5ldCcsICdpZGFiYzEyMycpKS50aGVuKHJlc3VsdHMgPT4ge30pO1xuICAgICBgYGBcbiAgICAgICAgQG1ldGhvZCBxdWVyeVxuICAgICBAcGFyYW0ge0V4cHJlc3Npb259IHF1ZXJ5XG4gICAgIEByZXR1cm4ge09iamVjdH0gcmVzdWx0IG9mIHF1ZXJ5ICh0eXBlIGRlcGVuZHMgb24gcXVlcnkpXG4gICAgICovXG4gICAgcXVlcnkocXVlcnlPckV4cHJlc3Npb24sIG9wdGlvbnMsIGlkKSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gYnVpbGRRdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQsIHRoaXMuX3F1ZXJ5QnVpbGRlcik7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeShxdWVyeS5leHByZXNzaW9uKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBjYWNoZSdzIHN0YXRlIHRvIGJlIGVpdGhlciBlbXB0eSBvciB0byBtYXRjaCB0aGUgc3RhdGUgb2ZcbiAgICAgKiBhbm90aGVyIGNhY2hlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGAgamF2YXNjcmlwdFxuICAgICAqIGNhY2hlLnJlc2V0KCk7IC8vIGVtcHRpZXMgY2FjaGVcbiAgICAgKiBjYWNoZS5yZXNldChjYWNoZTIpOyAvLyBjbG9uZXMgdGhlIHN0YXRlIG9mIGNhY2hlMlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtDYWNoZX0gW2Jhc2VdXG4gICAgICogQG1lbWJlcm9mIENhY2hlXG4gICAgICovXG4gICAgcmVzZXQoYmFzZSkge1xuICAgICAgICB0aGlzLl9yZWNvcmRzID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBsZXQgYmFzZVJlY29yZHMgPSBiYXNlICYmIGJhc2UucmVjb3Jkcyh0eXBlKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY29yZHNbdHlwZV0gPSBuZXcgSW1tdXRhYmxlTWFwKGJhc2VSZWNvcmRzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMgPSBuZXcgUmVsYXRpb25zaGlwQWNjZXNzb3IodGhpcywgYmFzZSAmJiBiYXNlLnJlbGF0aW9uc2hpcHMpO1xuICAgICAgICB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcyA9IG5ldyBJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IodGhpcywgYmFzZSAmJiBiYXNlLmludmVyc2VSZWxhdGlvbnNoaXBzKTtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IucmVzZXQoYmFzZSkpO1xuICAgICAgICB0aGlzLmVtaXQoJ3Jlc2V0Jyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGUgdGhlIGNhY2hlIGJhc2VkIG9uIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzY2hlbWEuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2FjaGVcbiAgICAgKi9cbiAgICB1cGdyYWRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9yZWNvcmRzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3Jkc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3JlbGF0aW9uc2hpcHMudXBncmFkZSgpO1xuICAgICAgICB0aGlzLl9pbnZlcnNlUmVsYXRpb25zaGlwcy51cGdyYWRlKCk7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnVwZ3JhZGUoKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhdGNoZXMgdGhlIGRvY3VtZW50IHdpdGggYW4gb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoT3BlcmF0aW9uIHwgT3BlcmF0aW9uW10gfCBUcmFuc2Zvcm1CdWlsZGVyRnVuYyl9IG9wZXJhdGlvbk9yT3BlcmF0aW9uc1xuICAgICAqIEByZXR1cm5zIHtPcGVyYXRpb25bXX1cbiAgICAgKiBAbWVtYmVyb2YgQ2FjaGVcbiAgICAgKi9cbiAgICBwYXRjaChvcGVyYXRpb25Pck9wZXJhdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGVyYXRpb25Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9IG9wZXJhdGlvbk9yT3BlcmF0aW9ucyh0aGlzLl90cmFuc2Zvcm1CdWlsZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBpbnZlcnNlOiBbXSxcbiAgICAgICAgICAgIGRhdGE6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpc0FycmF5KG9wZXJhdGlvbk9yT3BlcmF0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcGVyYXRpb25Pck9wZXJhdGlvbnMsIHJlc3VsdCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hcHBseU9wZXJhdGlvbihvcGVyYXRpb25Pck9wZXJhdGlvbnMsIHJlc3VsdCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmludmVyc2UucmV2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0LCBwcmltYXJ5ID0gZmFsc2UpIHtcbiAgICAgICAgb3BzLmZvckVhY2gob3AgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb24ob3AsIHJlc3VsdCwgcHJpbWFyeSkpO1xuICAgIH1cbiAgICBfYXBwbHlPcGVyYXRpb24ob3BlcmF0aW9uLCByZXN1bHQsIHByaW1hcnkgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci52YWxpZGF0ZShvcGVyYXRpb24pKTtcbiAgICAgICAgY29uc3QgaW52ZXJzZVRyYW5zZm9ybSA9IEludmVyc2VUcmFuc2Zvcm1zW29wZXJhdGlvbi5vcF07XG4gICAgICAgIGNvbnN0IGludmVyc2VPcCA9IGludmVyc2VUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcbiAgICAgICAgaWYgKGludmVyc2VPcCkge1xuICAgICAgICAgICAgcmVzdWx0LmludmVyc2UucHVzaChpbnZlcnNlT3ApO1xuICAgICAgICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgYmVmb3JlYCBvcGVyYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmJlZm9yZShvcGVyYXRpb24pKS5mb3JFYWNoKG9wcyA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQpKTtcbiAgICAgICAgICAgIC8vIFF1ZXJ5IHJlbGF0ZWQgYGFmdGVyYCBvcGVyYXRpb25zIGJlZm9yZSBwZXJmb3JtaW5nXG4gICAgICAgICAgICAvLyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvbi4gVGhlc2Ugd2lsbCBiZSBhcHBsaWVkIG9uIHN1Y2Nlc3MuXG4gICAgICAgICAgICBsZXQgcHJlcGFyZWRPcHMgPSB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmFmdGVyKG9wZXJhdGlvbikpO1xuICAgICAgICAgICAgLy8gUGVyZm9ybSB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxuICAgICAgICAgICAgbGV0IHBhdGNoVHJhbnNmb3JtID0gUGF0Y2hUcmFuc2Zvcm1zW29wZXJhdGlvbi5vcF07XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHBhdGNoVHJhbnNmb3JtKHRoaXMsIG9wZXJhdGlvbik7XG4gICAgICAgICAgICBpZiAocHJpbWFyeSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBpbW1lZGlhdGVgIG9wZXJhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmltbWVkaWF0ZShvcGVyYXRpb24pKTtcbiAgICAgICAgICAgIC8vIEVtaXQgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncGF0Y2gnLCBvcGVyYXRpb24sIGRhdGEpO1xuICAgICAgICAgICAgLy8gUGVyZm9ybSBwcmVwYXJlZCBvcGVyYXRpb25zIGFmdGVyIHBlcmZvcm1pbmcgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb25cbiAgICAgICAgICAgIHByZXBhcmVkT3BzLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xuICAgICAgICAgICAgLy8gUXVlcnkgYW5kIHBlcmZvcm0gcmVsYXRlZCBgZmluYWxseWAgb3BlcmF0aW9uc1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5tYXAocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5maW5hbGx5KG9wZXJhdGlvbikpLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHByaW1hcnkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5kYXRhLnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3F1ZXJ5KGV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBRdWVyeU9wZXJhdG9yc1tleHByZXNzaW9uLm9wXTtcbiAgICAgICAgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBvcGVyYXRvcjogJyArIGV4cHJlc3Npb24ub3ApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcGVyYXRvcih0aGlzLCBleHByZXNzaW9uKTtcbiAgICB9XG59O1xuQ2FjaGUgPSBfX2RlY29yYXRlKFtldmVudGVkXSwgQ2FjaGUpO1xuZXhwb3J0IGRlZmF1bHQgQ2FjaGU7Il19