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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let Cache = class Cache {
    constructor(settings = {}) {
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new _data.QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new _data.TransformBuilder({
            recordInitializer: this._schema
        });
        const processors = settings.processors ? settings.processors : [_schemaValidationProcessor2.default, _schemaConsistencyProcessor2.default, _cacheIntegrityProcessor2.default];
        this._processors = processors.map(Processor => new Processor(this));
        this.reset(settings.base);
    }
    get keyMap() {
        return this._keyMap;
    }
    get schema() {
        return this._schema;
    }
    get queryBuilder() {
        return this._queryBuilder;
    }
    get transformBuilder() {
        return this._transformBuilder;
    }
    records(type) {
        return this._records[type];
    }
    get relationships() {
        return this._relationships;
    }
    get inverseRelationships() {
        return this._inverseRelationships;
    }
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
    query(queryOrExpression, options, id) {
        const query = (0, _data.buildQuery)(queryOrExpression, options, id, this._queryBuilder);
        return this._query(query.expression);
    }
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
    reset(base) {
        this._records = {};
        Object.keys(this._schema.models).forEach(type => {
            let baseRecords = base && base.records(type);
            this._records[type] = new _immutable.ImmutableMap(baseRecords);
        });
        this._relationships = new _relationshipAccessor2.default(this, base && base.relationships);
        this._inverseRelationships = new _inverseRelationshipAccessor2.default(this, base && base.inverseRelationships);
        this._processors.forEach(processor => processor.reset(base));
        this.emit('reset');
    }
    /**
     * Upgrade the cache based on the current state of the schema.
     *
     * @memberof Cache
     */
    upgrade() {
        Object.keys(this._schema.models).forEach(type => {
            if (!this._records[type]) {
                this._records[type] = new _immutable.ImmutableMap();
            }
        });
        this._relationships.upgrade();
        this._inverseRelationships.upgrade();
        this._processors.forEach(processor => processor.upgrade());
    }
    /**
     * Patches the document with an operation.
     *
     * @param {(Operation | Operation[] | TransformBuilderFunc)} operationOrOperations
     * @returns {Operation[]}
     * @memberof Cache
     */
    patch(operationOrOperations) {
        if (typeof operationOrOperations === 'function') {
            operationOrOperations = operationOrOperations(this._transformBuilder);
        }
        const result = {
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
    }
    /////////////////////////////////////////////////////////////////////////////
    // Protected methods
    /////////////////////////////////////////////////////////////////////////////
    _applyOperations(ops, result, primary = false) {
        ops.forEach(op => this._applyOperation(op, result, primary));
    }
    _applyOperation(operation, result, primary = false) {
        this._processors.forEach(processor => processor.validate(operation));
        const inverseTransform = _inverseTransforms2.default[operation.op];
        const inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.push(inverseOp);
            // Query and perform related `before` operations
            this._processors.map(processor => processor.before(operation)).forEach(ops => this._applyOperations(ops, result));
            // Query related `after` operations before performing
            // the requested operation. These will be applied on success.
            let preparedOps = this._processors.map(processor => processor.after(operation));
            // Perform the requested operation
            let patchTransform = _patchTransforms2.default[operation.op];
            let data = patchTransform(this, operation);
            if (primary) {
                result.data.push(data);
            }
            // Query and perform related `immediate` operations
            this._processors.forEach(processor => processor.immediate(operation));
            // Emit event
            this.emit('patch', operation, data);
            // Perform prepared operations after performing the requested operation
            preparedOps.forEach(ops => this._applyOperations(ops, result));
            // Query and perform related `finally` operations
            this._processors.map(processor => processor.finally(operation)).forEach(ops => this._applyOperations(ops, result));
        } else if (primary) {
            result.data.push(null);
        }
    }
    _query(expression) {
        const operator = _queryOperators.QueryOperators[expression.op];
        if (!operator) {
            throw new Error('Unable to find operator: ' + expression.op);
        }
        return operator(this, expression);
    }
};
Cache = __decorate([_core.evented], Cache);
exports.default = Cache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlLmpzIl0sIm5hbWVzIjpbIl9fZGVjb3JhdGUiLCJkZWNvcmF0b3JzIiwidGFyZ2V0Iiwia2V5IiwiZGVzYyIsImMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZCIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsImkiLCJkZWZpbmVQcm9wZXJ0eSIsIkNhY2hlIiwiY29uc3RydWN0b3IiLCJzZXR0aW5ncyIsIl9zY2hlbWEiLCJzY2hlbWEiLCJfa2V5TWFwIiwia2V5TWFwIiwiX3F1ZXJ5QnVpbGRlciIsInF1ZXJ5QnVpbGRlciIsIlF1ZXJ5QnVpbGRlciIsIl90cmFuc2Zvcm1CdWlsZGVyIiwidHJhbnNmb3JtQnVpbGRlciIsIlRyYW5zZm9ybUJ1aWxkZXIiLCJyZWNvcmRJbml0aWFsaXplciIsInByb2Nlc3NvcnMiLCJTY2hlbWFWYWxpZGF0aW9uUHJvY2Vzc29yIiwiU2NoZW1hQ29uc2lzdGVuY3lQcm9jZXNzb3IiLCJDYWNoZUludGVncml0eVByb2Nlc3NvciIsIl9wcm9jZXNzb3JzIiwibWFwIiwiUHJvY2Vzc29yIiwicmVzZXQiLCJiYXNlIiwicmVjb3JkcyIsInR5cGUiLCJfcmVjb3JkcyIsInJlbGF0aW9uc2hpcHMiLCJfcmVsYXRpb25zaGlwcyIsImludmVyc2VSZWxhdGlvbnNoaXBzIiwiX2ludmVyc2VSZWxhdGlvbnNoaXBzIiwicXVlcnkiLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm9wdGlvbnMiLCJpZCIsIl9xdWVyeSIsImV4cHJlc3Npb24iLCJrZXlzIiwibW9kZWxzIiwiZm9yRWFjaCIsImJhc2VSZWNvcmRzIiwiSW1tdXRhYmxlTWFwIiwiUmVsYXRpb25zaGlwQWNjZXNzb3IiLCJJbnZlcnNlUmVsYXRpb25zaGlwQWNjZXNzb3IiLCJwcm9jZXNzb3IiLCJlbWl0IiwidXBncmFkZSIsInBhdGNoIiwib3BlcmF0aW9uT3JPcGVyYXRpb25zIiwicmVzdWx0IiwiaW52ZXJzZSIsImRhdGEiLCJfYXBwbHlPcGVyYXRpb25zIiwiX2FwcGx5T3BlcmF0aW9uIiwicmV2ZXJzZSIsIm9wcyIsInByaW1hcnkiLCJvcCIsIm9wZXJhdGlvbiIsInZhbGlkYXRlIiwiaW52ZXJzZVRyYW5zZm9ybSIsIkludmVyc2VUcmFuc2Zvcm1zIiwiaW52ZXJzZU9wIiwicHVzaCIsImJlZm9yZSIsInByZXBhcmVkT3BzIiwiYWZ0ZXIiLCJwYXRjaFRyYW5zZm9ybSIsIlBhdGNoVHJhbnNmb3JtcyIsImltbWVkaWF0ZSIsImZpbmFsbHkiLCJvcGVyYXRvciIsIlF1ZXJ5T3BlcmF0b3JzIiwiRXJyb3IiLCJldmVudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBbkJBLElBQUlBLGFBQWEsYUFBUSxVQUFLQSxVQUFiLElBQTJCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBVUMsTUFBbEI7QUFBQSxRQUNJQyxJQUFJSCxJQUFJLENBQUosR0FBUUgsTUFBUixHQUFpQkUsU0FBUyxJQUFULEdBQWdCQSxPQUFPSyxPQUFPQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUQvRjtBQUFBLFFBRUlPLENBRko7QUFHQSxRQUFJLE9BQU9DLE9BQVAsS0FBbUIsUUFBbkIsSUFBK0IsT0FBT0EsUUFBUUMsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsSUFBSUksUUFBUUMsUUFBUixDQUFpQlosVUFBakIsRUFBNkJDLE1BQTdCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsSUFBMUMsQ0FBSixDQUEzRSxLQUFvSSxLQUFLLElBQUlVLElBQUliLFdBQVdNLE1BQVgsR0FBb0IsQ0FBakMsRUFBb0NPLEtBQUssQ0FBekMsRUFBNENBLEdBQTVDLEVB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QVYsQ0FBb0JYLFNBQXBCLENBQXRDO0FBQ0E7QUFDQSxpQkFBS2IsSUFBTCxDQUFVLE9BQVYsRUFBbUJhLFNBQW5CLEVBQThCUCxJQUE5QjtBQUNBO0FBQ0FjLHdCQUFZMUIsT0FBWixDQUFvQmdCLE9BQU8sS0FBS0gsZ0JBQUwsQ0FBc0JHLEdBQXRCLEVBQTJCTixNQUEzQixDQUEzQjtBQUNBO0FBQ0EsaUJBQUs5QixXQUFMLENBQWlCQyxHQUFqQixDQUFxQndCLGFBQWFBLFVBQVUwQixPQUFWLENBQWtCWixTQUFsQixDQUFsQyxFQUFnRW5CLE9BQWhFLENBQXdFZ0IsT0FBTyxLQUFLSCxnQkFBTCxDQUFzQkcsR0FBdEIsRUFBMkJOLE1BQTNCLENBQS9FO0FBQ0gsU0FyQkQsTUFxQk8sSUFBSU8sT0FBSixFQUFhO0FBQ2hCUCxtQkFBT0UsSUFBUCxDQUFZWSxJQUFaLENBQWlCLElBQWpCO0FBQ0g7QUFDSjtBQUNENUIsV0FBT0MsVUFBUCxFQUFtQjtBQUNmLGNBQU1tQyxXQUFXQywrQkFBZXBDLFdBQVdxQixFQUExQixDQUFqQjtBQUNBLFlBQUksQ0FBQ2MsUUFBTCxFQUFlO0FBQ1gsa0JBQU0sSUFBSUUsS0FBSixDQUFVLDhCQUE4QnJDLFdBQVdxQixFQUFuRCxDQUFOO0FBQ0g7QUFDRCxlQUFPYyxTQUFTLElBQVQsRUFBZW5DLFVBQWYsQ0FBUDtBQUNIO0FBNUptQixDQUF4QjtBQThKQW5DLFFBQVFoQixXQUFXLENBQUN5RixhQUFELENBQVgsRUFBc0J6RSxLQUF0QixDQUFSO2tCQUNlQSxLIiwiZmlsZSI6ImNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IGV2ZW50ZWQgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBRdWVyeUJ1aWxkZXIsIFRyYW5zZm9ybUJ1aWxkZXIsIGJ1aWxkUXVlcnkgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgQ2FjaGVJbnRlZ3JpdHlQcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9jYWNoZS1pbnRlZ3JpdHktcHJvY2Vzc29yJztcbmltcG9ydCBTY2hlbWFDb25zaXN0ZW5jeVByb2Nlc3NvciBmcm9tICcuL2NhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL3NjaGVtYS1jb25zaXN0ZW5jeS1wcm9jZXNzb3InO1xuaW1wb3J0IFNjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IgZnJvbSAnLi9jYWNoZS9vcGVyYXRpb24tcHJvY2Vzc29ycy9zY2hlbWEtdmFsaWRhdGlvbi1wcm9jZXNzb3InO1xuaW1wb3J0IHsgUXVlcnlPcGVyYXRvcnMgfSBmcm9tICcuL2NhY2hlL3F1ZXJ5LW9wZXJhdG9ycyc7XG5pbXBvcnQgUGF0Y2hUcmFuc2Zvcm1zIGZyb20gJy4vY2FjaGUvcGF0Y2gtdHJhbnNmb3Jtcyc7XG5pbXBvcnQgSW52ZXJzZVRyYW5zZm9ybXMgZnJvbSAnLi9jYWNoZS9pbnZlcnNlLXRyYW5zZm9ybXMnO1xuaW1wb3J0IHsgSW1tdXRhYmxlTWFwIH0gZnJvbSAnQG9yYml0L2ltbXV0YWJsZSc7XG5pbXBvcnQgUmVsYXRpb25zaGlwQWNjZXNzb3IgZnJvbSAnLi9jYWNoZS9yZWxhdGlvbnNoaXAtYWNjZXNzb3InO1xuaW1wb3J0IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3NvciBmcm9tICcuL2NhY2hlL2ludmVyc2UtcmVsYXRpb25zaGlwLWFjY2Vzc29yJztcbi8qKlxuICogQSBgQ2FjaGVgIGlzIGFuIGluLW1lbW9yeSBkYXRhIHN0b3JlIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHN5bmNocm9ub3VzbHkuXG4gKlxuICogQ2FjaGVzIHVzZSBvcGVyYXRpb24gcHJvY2Vzc29ycyB0byBtYWludGFpbiBpbnRlcm5hbCBjb25zaXN0ZW5jeS5cbiAqXG4gKiBCZWNhdXNlIGRhdGEgaXMgc3RvcmVkIGluIGltbXV0YWJsZSBtYXBzLCBjYWNoZXMgY2FuIGJlIGZvcmtlZCBlZmZpY2llbnRseS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgQ2FjaGVcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgQ2FjaGUgPSBjbGFzcyBDYWNoZSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICB0aGlzLl9zY2hlbWEgPSBzZXR0aW5ncy5zY2hlbWE7XG4gICAgICAgIHRoaXMuX2tleU1hcCA9IHNldHRpbmdzLmtleU1hcDtcbiAgICAgICAgdGhpcy5fcXVlcnlCdWlsZGVyID0gc2V0dGluZ3MucXVlcnlCdWlsZGVyIHx8IG5ldyBRdWVyeUJ1aWxkZXIoKTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtQnVpbGRlciA9IHNldHRpbmdzLnRyYW5zZm9ybUJ1aWxkZXIgfHwgbmV3IFRyYW5zZm9ybUJ1aWxkZXIoe1xuICAgICAgICAgICAgcmVjb3JkSW5pdGlhbGl6ZXI6IHRoaXMuX3NjaGVtYVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcHJvY2Vzc29ycyA9IHNldHRpbmdzLnByb2Nlc3NvcnMgPyBzZXR0aW5ncy5wcm9jZXNzb3JzIDogW1NjaGVtYVZhbGlkYXRpb25Qcm9jZXNzb3IsIFNjaGVtYUNvbnNpc3RlbmN5UHJvY2Vzc29yLCBDYWNoZUludGVncml0eVByb2Nlc3Nvcl07XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBwcm9jZXNzb3JzLm1hcChQcm9jZXNzb3IgPT4gbmV3IFByb2Nlc3Nvcih0aGlzKSk7XG4gICAgICAgIHRoaXMucmVzZXQoc2V0dGluZ3MuYmFzZSk7XG4gICAgfVxuICAgIGdldCBrZXlNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlNYXA7XG4gICAgfVxuICAgIGdldCBzY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2hlbWE7XG4gICAgfVxuICAgIGdldCBxdWVyeUJ1aWxkZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeUJ1aWxkZXI7XG4gICAgfVxuICAgIGdldCB0cmFuc2Zvcm1CdWlsZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQnVpbGRlcjtcbiAgICB9XG4gICAgcmVjb3Jkcyh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRzW3R5cGVdO1xuICAgIH1cbiAgICBnZXQgcmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbGF0aW9uc2hpcHM7XG4gICAgfVxuICAgIGdldCBpbnZlcnNlUmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzO1xuICAgIH1cbiAgICAvKipcbiAgICAgQWxsb3dzIGEgY2xpZW50IHRvIHJ1biBxdWVyaWVzIGFnYWluc3QgdGhlIGNhY2hlLlxuICAgICAgICBAZXhhbXBsZVxuICAgICBgYGAgamF2YXNjcmlwdFxuICAgICAvLyB1c2luZyBhIHF1ZXJ5IGJ1aWxkZXIgY2FsbGJhY2tcbiAgICAgY2FjaGUucXVlcnkocWIucmVjb3JkKCdwbGFuZXQnLCAnaWRhYmMxMjMnKSkudGhlbihyZXN1bHRzID0+IHt9KTtcbiAgICAgYGBgXG4gICAgICAgIEBleGFtcGxlXG4gICAgIGBgYCBqYXZhc2NyaXB0XG4gICAgIC8vIHVzaW5nIGFuIGV4cHJlc3Npb25cbiAgICAgY2FjaGUucXVlcnkob3FlKCdyZWNvcmQnLCAncGxhbmV0JywgJ2lkYWJjMTIzJykpLnRoZW4ocmVzdWx0cyA9PiB7fSk7XG4gICAgIGBgYFxuICAgICAgICBAbWV0aG9kIHF1ZXJ5XG4gICAgIEBwYXJhbSB7RXhwcmVzc2lvbn0gcXVlcnlcbiAgICAgQHJldHVybiB7T2JqZWN0fSByZXN1bHQgb2YgcXVlcnkgKHR5cGUgZGVwZW5kcyBvbiBxdWVyeSlcbiAgICAgKi9cbiAgICBxdWVyeShxdWVyeU9yRXhwcmVzc2lvbiwgb3B0aW9ucywgaWQpIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBidWlsZFF1ZXJ5KHF1ZXJ5T3JFeHByZXNzaW9uLCBvcHRpb25zLCBpZCwgdGhpcy5fcXVlcnlCdWlsZGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXJ5KHF1ZXJ5LmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGNhY2hlJ3Mgc3RhdGUgdG8gYmUgZWl0aGVyIGVtcHR5IG9yIHRvIG1hdGNoIHRoZSBzdGF0ZSBvZlxuICAgICAqIGFub3RoZXIgY2FjaGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYCBqYXZhc2NyaXB0XG4gICAgICogY2FjaGUucmVzZXQoKTsgLy8gZW1wdGllcyBjYWNoZVxuICAgICAqIGNhY2hlLnJlc2V0KGNhY2hlMik7IC8vIGNsb25lcyB0aGUgc3RhdGUgb2YgY2FjaGUyXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0NhY2hlfSBbYmFzZV1cbiAgICAgKiBAbWVtYmVyb2YgQ2FjaGVcbiAgICAgKi9cbiAgICByZXNldChiYXNlKSB7XG4gICAgICAgIHRoaXMuX3JlY29yZHMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2NoZW1hLm1vZGVscykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIGxldCBiYXNlUmVjb3JkcyA9IGJhc2UgJiYgYmFzZS5yZWNvcmRzKHR5cGUpO1xuICAgICAgICAgICAgdGhpcy5fcmVjb3Jkc1t0eXBlXSA9IG5ldyBJbW11dGFibGVNYXAoYmFzZVJlY29yZHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwcyA9IG5ldyBSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UucmVsYXRpb25zaGlwcyk7XG4gICAgICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzID0gbmV3IEludmVyc2VSZWxhdGlvbnNoaXBBY2Nlc3Nvcih0aGlzLCBiYXNlICYmIGJhc2UuaW52ZXJzZVJlbGF0aW9uc2hpcHMpO1xuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLmZvckVhY2gocHJvY2Vzc29yID0+IHByb2Nlc3Nvci5yZXNldChiYXNlKSk7XG4gICAgICAgIHRoaXMuZW1pdCgncmVzZXQnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBncmFkZSB0aGUgY2FjaGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHNjaGVtYS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBDYWNoZVxuICAgICAqL1xuICAgIHVwZ3JhZGUoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlY29yZHNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRzW3R5cGVdID0gbmV3IEltbXV0YWJsZU1hcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVsYXRpb25zaGlwcy51cGdyYWRlKCk7XG4gICAgICAgIHRoaXMuX2ludmVyc2VSZWxhdGlvbnNoaXBzLnVwZ3JhZGUoKTtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IudXBncmFkZSgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGF0Y2hlcyB0aGUgZG9jdW1lbnQgd2l0aCBhbiBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcGVyYXRpb24gfCBPcGVyYXRpb25bXSB8IFRyYW5zZm9ybUJ1aWxkZXJGdW5jKX0gb3BlcmF0aW9uT3JPcGVyYXRpb25zXG4gICAgICogQHJldHVybnMge09wZXJhdGlvbltdfVxuICAgICAqIEBtZW1iZXJvZiBDYWNoZVxuICAgICAqL1xuICAgIHBhdGNoKG9wZXJhdGlvbk9yT3BlcmF0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIG9wZXJhdGlvbk9yT3BlcmF0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgb3BlcmF0aW9uT3JPcGVyYXRpb25zID0gb3BlcmF0aW9uT3JPcGVyYXRpb25zKHRoaXMuX3RyYW5zZm9ybUJ1aWxkZXIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGludmVyc2U6IFtdLFxuICAgICAgICAgICAgZGF0YTogW11cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlzQXJyYXkob3BlcmF0aW9uT3JPcGVyYXRpb25zKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5T3BlcmF0aW9uKG9wZXJhdGlvbk9yT3BlcmF0aW9ucywgcmVzdWx0LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuaW52ZXJzZS5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9hcHBseU9wZXJhdGlvbnMob3BzLCByZXN1bHQsIHByaW1hcnkgPSBmYWxzZSkge1xuICAgICAgICBvcHMuZm9yRWFjaChvcCA9PiB0aGlzLl9hcHBseU9wZXJhdGlvbihvcCwgcmVzdWx0LCBwcmltYXJ5KSk7XG4gICAgfVxuICAgIF9hcHBseU9wZXJhdGlvbihvcGVyYXRpb24sIHJlc3VsdCwgcHJpbWFyeSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuZm9yRWFjaChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLnZhbGlkYXRlKG9wZXJhdGlvbikpO1xuICAgICAgICBjb25zdCBpbnZlcnNlVHJhbnNmb3JtID0gSW52ZXJzZVRyYW5zZm9ybXNbb3BlcmF0aW9uLm9wXTtcbiAgICAgICAgY29uc3QgaW52ZXJzZU9wID0gaW52ZXJzZVRyYW5zZm9ybSh0aGlzLCBvcGVyYXRpb24pO1xuICAgICAgICBpZiAoaW52ZXJzZU9wKSB7XG4gICAgICAgICAgICByZXN1bHQuaW52ZXJzZS5wdXNoKGludmVyc2VPcCk7XG4gICAgICAgICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBiZWZvcmVgIG9wZXJhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYmVmb3JlKG9wZXJhdGlvbikpLmZvckVhY2gob3BzID0+IHRoaXMuX2FwcGx5T3BlcmF0aW9ucyhvcHMsIHJlc3VsdCkpO1xuICAgICAgICAgICAgLy8gUXVlcnkgcmVsYXRlZCBgYWZ0ZXJgIG9wZXJhdGlvbnMgYmVmb3JlIHBlcmZvcm1pbmdcbiAgICAgICAgICAgIC8vIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uLiBUaGVzZSB3aWxsIGJlIGFwcGxpZWQgb24gc3VjY2Vzcy5cbiAgICAgICAgICAgIGxldCBwcmVwYXJlZE9wcyA9IHRoaXMuX3Byb2Nlc3NvcnMubWFwKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuYWZ0ZXIob3BlcmF0aW9uKSk7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHRoZSByZXF1ZXN0ZWQgb3BlcmF0aW9uXG4gICAgICAgICAgICBsZXQgcGF0Y2hUcmFuc2Zvcm0gPSBQYXRjaFRyYW5zZm9ybXNbb3BlcmF0aW9uLm9wXTtcbiAgICAgICAgICAgIGxldCBkYXRhID0gcGF0Y2hUcmFuc2Zvcm0odGhpcywgb3BlcmF0aW9uKTtcbiAgICAgICAgICAgIGlmIChwcmltYXJ5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEucHVzaChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFF1ZXJ5IGFuZCBwZXJmb3JtIHJlbGF0ZWQgYGltbWVkaWF0ZWAgb3BlcmF0aW9uc1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5mb3JFYWNoKHByb2Nlc3NvciA9PiBwcm9jZXNzb3IuaW1tZWRpYXRlKG9wZXJhdGlvbikpO1xuICAgICAgICAgICAgLy8gRW1pdCBldmVudFxuICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXRjaCcsIG9wZXJhdGlvbiwgZGF0YSk7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHByZXBhcmVkIG9wZXJhdGlvbnMgYWZ0ZXIgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvblxuICAgICAgICAgICAgcHJlcGFyZWRPcHMuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XG4gICAgICAgICAgICAvLyBRdWVyeSBhbmQgcGVyZm9ybSByZWxhdGVkIGBmaW5hbGx5YCBvcGVyYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLm1hcChwcm9jZXNzb3IgPT4gcHJvY2Vzc29yLmZpbmFsbHkob3BlcmF0aW9uKSkuZm9yRWFjaChvcHMgPT4gdGhpcy5fYXBwbHlPcGVyYXRpb25zKG9wcywgcmVzdWx0KSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJpbWFyeSkge1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfcXVlcnkoZXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IFF1ZXJ5T3BlcmF0b3JzW2V4cHJlc3Npb24ub3BdO1xuICAgICAgICBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIG9wZXJhdG9yOiAnICsgZXhwcmVzc2lvbi5vcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIGV4cHJlc3Npb24pO1xuICAgIH1cbn07XG5DYWNoZSA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBDYWNoZSk7XG5leHBvcnQgZGVmYXVsdCBDYWNoZTsiXX0=