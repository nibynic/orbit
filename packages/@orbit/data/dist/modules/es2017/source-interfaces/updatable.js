import Orbit from '../main';
import { assert } from '@orbit/utils';
import { settleInSeries, fulfillInSeries } from '@orbit/core';
import { Source } from '../source';
import { buildTransform } from '../transform';
export const UPDATABLE = '__updatable__';
/**
 * Has a source been decorated as `@updatable`?
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function isUpdatable(source) {
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
export default function updatable(Klass) {
    let proto = Klass.prototype;
    if (isUpdatable(proto)) {
        return;
    }
    assert('Updatable interface can only be applied to a Source', proto instanceof Source);
    proto[UPDATABLE] = true;
    proto.update = function (transformOrOperations, options, id) {
        const transform = buildTransform(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve();
        }
        return this._enqueueRequest('update', transform);
    };
    proto.__update__ = function (transform) {
        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve();
        }
        return fulfillInSeries(this, 'beforeUpdate', transform).then(() => {
            if (this.transformLog.contains(transform.id)) {
                return Orbit.Promise.resolve();
            } else {
                return this._update(transform).then(result => {
                    return this._transformed([transform]).then(() => settleInSeries(this, 'update', transform, result)).then(() => result);
                });
            }
        }).catch(error => {
            return settleInSeries(this, 'updateFail', transform, error).then(() => {
                throw error;
            });
        });
    };
}