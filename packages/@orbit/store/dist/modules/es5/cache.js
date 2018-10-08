var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */
import { isArray } from '@orbit/utils';
import { evented } from '@orbit/core';
import { QueryBuilder, TransformBuilder, buildQuery } from '@orbit/data';
import CacheIntegrityProcessor from './cache/operation-processors/cache-integrity-processor';
import SchemaConsistencyProcessor from './cache/operation-processors/schema-consistency-processor';
import SchemaValidationProcessor from './cache/operation-processors/schema-validation-processor';
import { QueryOperators } from './cache/query-operators';
import PatchTransforms from './cache/patch-transforms';
import InverseTransforms from './cache/inverse-transforms';
import { ImmutableMap } from '@orbit/immutable';
import RelationshipAccessor from './cache/relationship-accessor';
import InverseRelationshipAccessor from './cache/inverse-relationship-accessor';
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
        this._queryBuilder = settings.queryBuilder || new QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new TransformBuilder({
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
        var query = buildQuery(queryOrExpression, options, id, this._queryBuilder);
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
            _this2._records[type] = new ImmutableMap(baseRecords);
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
                _this3._records[type] = new ImmutableMap();
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
        if (isArray(operationOrOperations)) {
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
Cache = __decorate([evented], Cache);
export default Cache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsImlzQXJyYXkiLCJldmVudGVkIiwiUXVlcnlCdWlsZGVyIiwiVHJhbnNmb3JtQnVpbGRlciIsImJ1aWxkUXVlcnkiLCJDYWNoZUludGVncml0eVByb2Nlc3NvciIsIlNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yIiwiU2NoZW1hVmFsaWRhdGlvblByb2Nlc3NvciIsIlF1ZXJ5T3BlcmF0b3JzIiwiUGF0Y2hUcmFuc2Zvcm1zIiwiSW52ZXJzZVRyYW5zZm9ybXMiLCJJbW11dGFibGVNYXAiLCJSZWxhdGlvbnNoaXBBY2Nlc3NvciIsIkludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciIsIkNhY2hlIiwic2V0dGluZ3MiLCJfc2NoZW1hIiwic2NoZW1hIiwiX2tleU1hcCIsImtleU1hcCIsIl9xdWVyeUJ1aWxkZXIiLCJxdWVyeUJ1aWxkZXIiLCJfdHJhbnNmb3JtQnVpbGRlciIsInRyYW5zZm9ybUJ1aWxkZXIiLCJyZWNvcmRJbml0aWFsaXplciIsInByb2Nlc3NvcnMiLCJfcHJvY2Vzc29ycyIsIm1hcCIsIlByb2Nlc3NvciIsInJlc2V0IiwiYmFzZSIsInJlY29yZHMiLCJ0eXBlIiwiX3JlY29yZHMiLCJxdWVyeSIsInF1ZXJ5T3JFeHByZXNzaW9uIiwib3B0aW9ucyIsImlkIiwiX3F1ZXJ5IiwiZXhwcmVzc2lvbiIsImtleXMiLCJtb2RlbHMiLCJmb3JFYWNoIiwiYmFzZVJlY29yZHMiLCJfcmVsYXRpb25zaGlwcyIsInJlbGF0aW9uc2hpcHMiLCJfaW52ZXJzZVJlbGF0aW9uc2hpcHMiLCJpbnZlcnNlUmVsYXRpb25zaGlwcyIsInByb2Nlc3NvciIsImVtaXQiLCJ1cGdyYWRlIiwicGF0Y2giLCJvcGVyYXRpb25Pck9wZXJhdGlvbnMiLCJyZXN1bHQiLCJpbnZlcnNlIiwiZGF0YSIsIl9hcHBseU9wZXJhdGlvbnMiLCJfYXBwbHlPcGVyYXRpb24iLCJyZXZlcnNlIiwib3BzIiwicHJpbWFyeSIsIm9wIiwib3BlcmF0aW9uIiwidmFsaWRhdGUiLCJpbnZlcnNlVHJhbnNmb3JtIiwiaW52ZXJzZU9wIiwicHVzaCIsImJlZm9yZSIsInByZXBhcmVkT3BzIiwiYWZ0ZXIiLCJwYXRjaFRyYW5zZm9ybSIsImltbWVkaWF0ZSIsImZpbmFsbHkiLCJvcGVyYXRvciIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsYUFBYSxRQUFRLEtBQUtBLFVBQWIsSUFBMkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNqRixRQUFJQyxJQUFJQyxVQUFVQyxNQUFsQjtBQUFBLFFBQ0lDLElBQUlILElBQUksQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxTQUFTLElBQVQsR0FBZ0JBLE9BQU9LLE9BQU9DLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBRC9GO0FBQUEsUUFFSU8sQ0FGSjtBQUdBLFFBQUksT0FBT0MsT0FBUCxLQUFtQixRQUFuQixJQUErQixPQUFPQSxRQUFRQyxRQUFmLEtBQTRCLFVBQS9ELEVBQTJFTCxJQUFJSSxRQUFRQyxRQUFSLENBQWlCWixVQUFqQixFQUE2QkMsTUFBN0IsRUFBcUNDLEdBQXJDLEVBQTBDQyxJQUExQyxDQUFKLENBQTNFLEtBQW9JLEtBQUssSUFBSVUsSUFBSWIsV0FBV00sTUFBWCxHQUFvQixDQUFqQyxFQUFvQ08sS0FBSyxDQUF6QyxFQUE0Q0EsR0FBNUM7QUFBaUQsWUFBSUgsSUFBSVYsV0FBV2EsQ0FBWCxDQUFSLEVBQXVCTixJQUFJLENBQUNILElBQUksQ0FBSixHQUFRTSxFQUFFSCxDQUFGLENBQVIs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MUIsQ0FBakI7QUFDQSxZQUFJLENBQUNZLFFBQUwsRUFBZTtBQUNYLGtCQUFNLElBQUlDLEtBQUosQ0FBVSw4QkFBOEJuQyxXQUFXc0IsRUFBbkQsQ0FBTjtBQUNIO0FBQ0QsZUFBT1ksU0FBUyxJQUFULEVBQWVsQyxVQUFmLENBQVA7QUFDSCxLQTVKRDs7QUFBQTtBQUFBO0FBQUEseUJBWWE7QUFDVCxtQkFBTyxLQUFLckIsT0FBWjtBQUNIO0FBZEQ7QUFBQTtBQUFBLHlCQWVhO0FBQ1QsbUJBQU8sS0FBS0YsT0FBWjtBQUNIO0FBakJEO0FBQUE7QUFBQSx5QkFrQm1CO0FBQ2YsbUJBQU8sS0FBS0ksYUFBWjtBQUNIO0FBcEJEO0FBQUE7QUFBQSx5QkFxQnVCO0FBQ25CLG1CQUFPLEtBQUtFLGlCQUFaO0FBQ0g7QUF2QkQ7QUFBQTtBQUFBLHlCQTJCb0I7QUFDaEIsbUJBQU8sS0FBS3NCLGNBQVo7QUFDSDtBQTdCRDtBQUFBO0FBQUEseUJBOEIyQjtBQUN2QixtQkFBTyxLQUFLRSxxQkFBWjtBQUNIO0FBaENEOztBQUFBO0FBQUEsR0FBSjtBQThKQWhDLFFBQVE5QixXQUFXLENBQUNpQixPQUFELENBQVgsRUFBc0JhLEtBQXRCLENBQVI7QUFDQSxlQUFlQSxLQUFmIiwiZmlsZSI6ImNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IGV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBRdWVyeUJ1aWxkZXIsIFRyYW5zZm9ybUJ1aWxkZXIsIGJ1aWxkUXVlcnkgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yJztcbmltcG9ydCBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3InO1xuaW1wb3J0IFNjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtdmFsaWRhdGlvbi1wcm9jZXNzb3InO1xuaW1wb3J0IHsgUXVlcnlPcGVyYXRvcnMgfSBmcm9tICcuL2NhY2hlL3F1ZXJ5LW9wZXJhdG9ycyc7XG5pbXBvcnQgUGF0Y2hUcmFuc2Zvcm1zIGZyb20gJy4vY2FjaGUvcGF0Y2gtdHJhbnNmb3Jtcyc7XG5pbXBvcnQgSW52ZXJzZVRyYW5zZm9ybXMgZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXRyYW5zZm9ybXMnO1xuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XG5pbXBvcnQgUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9yZWxhdGlvbnNoaXAtYWNjZXNzb3InO1xuaW1wb3J0IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcbi8qKlxuICogQSBgQ2FjaGVgIGlzIGFuIGluLW1lbW9yeSBkYXRhIHN0b3JlIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHN5bmNocm9ub3VzbHkuXG4gKlxuICogQ2FjaGVzIHVzZSBvcGVyYXRpb24gcHJvY2Vzc29ycyB0byBtYWludGFpbiBpbnRlcm5hbCBjb25zaXN0ZW5jeS5cbiAqXG4gKiBCZWNhdXNlIGRhdGEgaXMgc3RvcmVkIGluIGltbXV0YWJsZSBtYXBzLCBjYWNoZXMgY2FuIGJlIGZvcmtlZCBlZmZpY2llbnRseS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgQ2FjaGVcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgQ2FjaGUgPSBjbGFzcyBDYWNoZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICB0aGlzLl9zY2hlbWEgPSBzZXR0aW5ncy5zY2hlbWE7XG4gICAgICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcbiAgICAgICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyIHx8IG5ldyBRdWVyeUJ1aWxkZXIoKTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xuICAgICAgICAgICAgcmVjb3JkSW5pdGlhbGl6ZXI6IHRoaXMuX3NjaGVtYVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcHJvY2Vzc29ycyA9IHNldHRpbmdzLnByb2Nlc3NvcnMgPyBzZXR0aW5ncy5wcm9jZXNzb3JzIDogW1NjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IsIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yLCBDYWNoZUludGVncml0eVByb2Nlc3Nvcl07XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBwcm9jZXNzb3JzLm1hcChQcm9jZXNzb3IgPT4gbmV3IFByb2Nlc3Nvcih0aGlzKSk7XG4gICAgICAgIHRoaXMucmVzZXQoc2V0dGluZ3MuYmFzZSk7XG4gICAgfVxuICAgIGdldCBrZXlNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XG4gICAgfVxuICAgIGdldCBzY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2hlbWE7XG4gICAgfVxuICAgIGdldCBxdWVyeUJ1aWxkZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeUJ1aWxkZXI7XG4gICAgfVxuICAgIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcbiAgICB9XG4gICAgcmVjb3Jkcyh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRzW3R5cGVdO1xuICAgIH1cbiAgICBnZXQgcmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHM7XG4gICAgfVxuICAgIGdldCBpbnZlcnNlUmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICAvKipcbiAgICAgQWxsb3dzIGEgY2xpZW50IHRvIHJ1biBxdWVyaWVzIGFnYWluc3QgdGhlIGNhY2hlLlxuICAgICAgICBAZXhhbXBsZVxuICAgICBgYGAgamF2YXNjcmlwdFxuICAgICAvLyB1c2luZyBhIHF1ZXJ5IGJ1aWxkZXIgY2FsbGJhY2tcbiAgICAgY2FjaGUucXVlcnkocWIucmVjb3JkKCdwbGFuZXQnLCAnaWRhYmMxMjMnKSkudGhlbihyZXN1bHRzID0+IHt9KTtcbiAgICAgYGBgXG4gICAgICAgIEBleGFtcGxlXG4gICAgIGBgYCBqYXZhc2NyaXB0XG4gICAgIC8vIHVzaW5nIGFuIGV4cHJlc3Npb25cbiAgICAgY2FjaGUucXVlcnkob3FlKCdyZWNvcmQnLCAncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XG4gICAgIGBgYFxuICAgICAgICBAbWV0aG9kIHF1ZXJ5XG4gICAgIEBwYXJhbSB7RXhwcmVzc2lvbn0gcXVlcnlcbiAgICAgQHJldHVybiB7T2JqZWN0fSByZXN1bHQgb2YgcXVlcnkgKHR5cGUgZGVwZW5kcyBvbiBxdWVyeSlcbiAgICAgKi9cbiAgICBxdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQpIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCwgdGhpcy5fcXVlcnlCdWlsZGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXJ5KHF1ZXJ5LmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGNhY2hlJ3Mgc3RhdGUgdG8gYmUgZWl0aGVyIGVtcHR5IG9yIHRvIG1hdGNoIHRoZSBzdGF0ZSBvZlxuICAgICAqIGFub3RoZXIgY2FjaGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYCBqYXZhc2NyaXB0XG4gICAgICogY2FjaGUucmVzZXQoKTsgLy8gZW1wdGllcyBjYWNoZVxuICAgICAqIGNhY2hlLnJlc2V0KGNhY2hlMik7IC8vIGNsb25lcyB0aGUgc3RhdGUgb2YgY2FjaGUyXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0NhY2hlfSBbYmFzZV1cbiAgICAgKiBAbWVtYmVyb2YgQ2FjaGVcbiAgICAgKi9cbiAgICByZXNldChiYXNlKSB7XG4gICAgICAgIHRoaXMuX3JlY29yZHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGxldCBiYXNlUmVjb3JkcyA9IGJhc2UgJiYgYmFzZS5yZWNvcmRzKHR5cGUpO1xuICAgICAgICAgICAgdGhpcy5fcmVjb3Jkc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoYmFzZVJlY29yZHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IG5ldyBSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UucmVsYXRpb25zaGlwcyk7XG4gICAgICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzID0gbmV3IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UuaW52ZXJzZVJlbGF0aW9uc2hpcHMpO1xuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5yZXNldChiYXNlKSk7XG4gICAgICAgIHRoaXMuZW1pdCgncmVzZXQnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBncmFkZSB0aGUgY2FjaGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHNjaGVtYS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBDYWNoZVxuICAgICAqL1xuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlY29yZHNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwcy51cGdyYWRlKCk7XG4gICAgICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzLnVwZ3JhZGUoKTtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IudXBncmFkZSgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGF0Y2hlcyB0aGUgZG9jdW1lbnQgd2l0aCBhbiBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcGVyYXRpb24gfCBPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKX0gb3BlcmF0aW9uT3JPcGVyYXRpb25zXG4gICAgICogQHJldHVybnMge09wZXJhdGlvbltdfVxuICAgICAqIEBtZW1iZXJvZiBDYWNoZVxuICAgICAqL1xuICAgIHBhdGNoKG9wZXJhdGlvbk9yT3BlcmF0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgb3BlcmF0aW9uT3JPcGVyYXRpb25zID0gb3BlcmF0aW9uT3JPcGVyYXRpb25zKHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGludmVyc2U6IFtdLFxuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlzQXJyYXkob3BlcmF0aW9uT3JPcGVyYXRpb25zKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9uKG9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuaW52ZXJzZS5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQsIHByaW1hcnkgPSBmYWxzZSkge1xuICAgICAgICBvcHMuZm9yRWFjaChvcCA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbihvcCwgcmVzdWx0LCBwcmltYXJ5KSk7XG4gICAgfVxuICAgIF9hcHBseU9wZXJhdGlvbihvcGVyYXRpb24sIHJlc3VsdCwgcHJpbWFyeSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnZhbGlkYXRlKG9wZXJhdGlvbikpO1xuICAgICAgICBjb25zdCBpbnZlcnNlVHJhbnNmb3JtID0gSW52ZXJzZVRyYW5zZm9ybXNbb3BlcmF0aW9uLm9wXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZU9wID0gaW52ZXJzZVRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xuICAgICAgICBpZiAoaW52ZXJzZU9wKSB7XG4gICAgICAgICAgICByZXN1bHQuaW52ZXJzZS5wdXNoKGludmVyc2VPcCk7XG4gICAgICAgICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBiZWZvcmVgIG9wZXJhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYmVmb3JlKG9wZXJhdGlvbikpLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xuICAgICAgICAgICAgLy8gUXVlcnkgcmVsYXRlZCBgYWZ0ZXJgIG9wZXJhdGlvbnMgYmVmb3JlIHBlcmZvcm1pbmdcbiAgICAgICAgICAgIC8vIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uLiBUaGVzZSB3aWxsIGJlIGFwcGxpZWQgb24gc3VjY2Vzcy5cbiAgICAgICAgICAgIGxldCBwcmVwYXJlZE9wcyA9IHRoaXMuX3Byb2Nlc3NvcnMubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYWZ0ZXIob3BlcmF0aW9uKSk7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uXG4gICAgICAgICAgICBsZXQgcGF0Y2hUcmFuc2Zvcm0gPSBQYXRjaFRyYW5zZm9ybXNbb3BlcmF0aW9uLm9wXTtcbiAgICAgICAgICAgIGxldCBkYXRhID0gcGF0Y2hUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcbiAgICAgICAgICAgIGlmIChwcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEucHVzaChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGltbWVkaWF0ZWAgb3BlcmF0aW9uc1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuaW1tZWRpYXRlKG9wZXJhdGlvbikpO1xuICAgICAgICAgICAgLy8gRW1pdCBldmVudFxuICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXRjaCcsIG9wZXJhdGlvbiwgZGF0YSk7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHByZXBhcmVkIG9wZXJhdGlvbnMgYWZ0ZXIgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxuICAgICAgICAgICAgcHJlcGFyZWRPcHMuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XG4gICAgICAgICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBmaW5hbGx5YCBvcGVyYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmZpbmFsbHkob3BlcmF0aW9uKSkuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJpbWFyeSkge1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfcXVlcnkoZXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IFF1ZXJ5T3BlcmF0b3JzW2V4cHJlc3Npb24ub3BdO1xuICAgICAgICBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIG9wZXJhdG9yOiAnICsgZXhwcmVzc2lvbi5vcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIGV4cHJlc3Npb24pO1xuICAgIH1cbn07XG5DYWNoZSA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBDYWNoZSk7XG5leHBvcnQgZGVmYXVsdCBDYWNoZTsiXX0=