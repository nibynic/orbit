import { assert } from '@orbit/utils';
import { settleInSeries, fulfillInSeries } from '@orbit/core';
import { Source } from '../source';
import { buildQuery } from '../query';
export const PULLABLE = '__pullable__';
/**
 * Has a source been decorated as `@pullable`?
 *
 * @export
 * @param {Source} source
 * @returns
 */
export function isPullable(source) {
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
export default function pullable(Klass) {
    let proto = Klass.prototype;
    if (isPullable(proto)) {
        return;
    }
    assert('Pullable interface can only be applied to a Source', proto instanceof Source);
    proto[PULLABLE] = true;
    proto.pull = function (queryOrExpression, options, id) {
        const query = buildQuery(queryOrExpression, options, id, this.queryBuilder);
        return this._enqueueRequest('pull', query);
    };
    proto.__pull__ = function (query) {
        return fulfillInSeries(this, 'beforePull', query).then(() => this._pull(query)).then(result => this._transformed(result)).then(result => {
            return settleInSeries(this, 'pull', query, result).then(() => result);
        }).catch(error => {
            return settleInSeries(this, 'pullFail', query, error).then(() => {
                throw error;
            });
        });
    };
}