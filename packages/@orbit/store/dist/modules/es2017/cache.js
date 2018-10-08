var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let Cache = class Cache {
    constructor(settings = {}) {
        this._schema = settings.schema;
        this._keyMap = settings.keyMap;
        this._queryBuilder = settings.queryBuilder || new QueryBuilder();
        this._transformBuilder = settings.transformBuilder || new TransformBuilder({
            recordInitializer: this._schema
        });
        const processors = settings.processors ? settings.processors : [SchemaValidationProcessor, SchemaConsistencyProcessor, CacheIntegrityProcessor];
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
        const query = buildQuery(queryOrExpression, options, id, this._queryBuilder);
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
            this._records[type] = new ImmutableMap(baseRecords);
        });
        this._relationships = new RelationshipAccessor(this, base && base.relationships);
        this._inverseRelationships = new InverseRelationshipAccessor(this, base && base.inverseRelationships);
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
                this._records[type] = new ImmutableMap();
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
        if (isArray(operationOrOperations)) {
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
        const inverseTransform = InverseTransforms[operation.op];
        const inverseOp = inverseTransform(this, operation);
        if (inverseOp) {
            result.inverse.push(inverseOp);
            // Query and perform related `before` operations
            this._processors.map(processor => processor.before(operation)).forEach(ops => this._applyOperations(ops, result));
            // Query related `after` operations before performing
            // the requested operation. These will be applied on success.
            let preparedOps = this._processors.map(processor => processor.after(operation));
            // Perform the requested operation
            let patchTransform = PatchTransforms[operation.op];
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
        const operator = QueryOperators[expression.op];
        if (!operator) {
            throw new Error('Unable to find operator: ' + expression.op);
        }
        return operator(this, expression);
    }
};
Cache = __decorate([evented], Cache);
export default Cache;