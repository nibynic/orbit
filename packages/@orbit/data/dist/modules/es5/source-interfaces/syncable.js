import Orbit from '../main';
import { assert, isArray } from '@orbit/utils';
import { fulfillInSeries, settleInSeries } from '@orbit/core';
import { Source } from '../source';
export var SYNCABLE = '__syncable__';
/**
 * Has a source been decorated as `@syncable`?
 *
 * @export
 * @param {SourceClass} source
 * @returns
 */
export function isSyncable(source) {
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
export default function syncable(Klass) {
    var proto = Klass.prototype;
    if (isSyncable(proto)) {
        return;
    }
    assert('Syncable interface can only be applied to a Source', proto instanceof Source);
    proto[SYNCABLE] = true;
    proto.sync = function (transformOrTransforms) {
        var _this = this;

        if (isArray(transformOrTransforms)) {
            var transforms = transformOrTransforms;
            return transforms.reduce(function (chain, transform) {
                return chain.then(function () {
                    return _this.sync(transform);
                });
            }, Orbit.Promise.resolve());
        } else {
            var transform = transformOrTransforms;
            if (this.transformLog.contains(transform.id)) {
                return Orbit.Promise.resolve();
            }
            return this._enqueueSync('sync', transform);
        }
    };
    proto.__sync__ = function (transform) {
        var _this2 = this;

        if (this.transformLog.contains(transform.id)) {
            return Orbit.Promise.resolve();
        }
        return fulfillInSeries(this, 'beforeSync', transform).then(function () {
            if (_this2.transformLog.contains(transform.id)) {
                return Orbit.Promise.resolve();
            } else {
                return _this2._sync(transform).then(function () {
                    return _this2._transformed([transform]);
                }).then(function () {
                    return settleInSeries(_this2, 'sync', transform);
                });
            }
        }).catch(function (error) {
            return settleInSeries(_this2, 'syncFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3N5bmNhYmxlLmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiYXNzZXJ0IiwiaXNBcnJheSIsImZ1bGZpbGxJblNlcmllcyIsInNldHRsZUluU2VyaWVzIiwiU291cmNlIiwiU1lOQ0FCTEUiLCJpc1N5bmNhYmxlIiwic291cmNlIiwic3luY2FibGUiLCJLbGFzcyIsInByb3RvIiwicHJvdG90eXBlIiwic3luYyIsInRyYW5zZm9ybU9yVHJhbnNmb3JtcyIsInRyYW5zZm9ybXMiLCJyZWR1Y2UiLCJjaGFpbiIsInRyYW5zZm9ybSIsInRoZW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInRyYW5zZm9ybUxvZyIsImNvbnRhaW5zIiwiaWQiLCJfZW5xdWV1ZVN5bmMiLCJfX3N5bmNfXyIsIl9zeW5jIiwiX3RyYW5zZm9ybWVkIiwiY2F0Y2giLCJlcnJvciJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxNQUFrQixTQUFsQjtBQUNBLFNBQVNDLE1BQVQsRUFBaUJDLE9BQWpCLFFBQWdDLGNBQWhDO0FBQ0EsU0FBU0MsZUFBVCxFQUEwQkMsY0FBMUIsUUFBZ0QsYUFBaEQ7QUFDQSxTQUFTQyxNQUFULFFBQXVCLFdBQXZCO0FBQ0EsT0FBTyxJQUFNQyxXQUFXLGNBQWpCO0FBQ1A7Ozs7Ozs7QUFPQSxPQUFPLFNBQVNDLFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCO0FBQy9CLFdBQU8sQ0FBQyxDQUFDQSxPQUFPRixRQUFQLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLGVBQWUsU0FBU0csUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUI7QUFDcEMsUUFBSUMsUUFBUUQsTUFBTUUsU0FBbEI7QUFDQSxRQUFJTCxXQUFXSSxLQUFYLENBQUosRUFBdUI7QUFDbkI7QUFDSDtBQUNEVixXQUFPLG9EQUFQLEVBQTZEVSxpQkFBaUJOLE1BQTlFO0FBQ0FNLFVBQU1MLFFBQU4sSUFBa0IsSUFBbEI7QUFDQUssVUFBTUUsSUFBTixHQUFhLFVBQVVDLHFCQUFWLEVBQWlDO0FBQUE7O0FBQzFDLFlBQUlaLFFBQVFZLHFCQUFSLENBQUosRUFBb0M7QUFDaEMsZ0JBQU1DLGFBQWFELHFCQUFuQjtBQUNBLG1CQUFPQyxXQUFXQyxNQUFYLENBQWtCLFVBQUNDLEtBQUQsRUFBUUMsU0FBUixFQUFzQjtBQUMzQyx1QkFBT0QsTUFBTUUsSUFBTixDQUFXO0FBQUEsMkJBQU0sTUFBS04sSUFBTCxDQUFVSyxTQUFWLENBQU47QUFBQSxpQkFBWCxDQUFQO0FBQ0gsYUFGTSxFQUVKbEIsTUFBTW9CLE9BQU4sQ0FBY0MsT0FBZCxFQUZJLENBQVA7QUFHSCxTQUxELE1BS087QUFDSCxnQkFBTUgsWUFBWUoscUJBQWxCO0FBQ0EsZ0JBQUksS0FBS1EsWUFBTCxDQUFrQkMsUUFBbEIsQ0FBMkJMLFVBQVVNLEVBQXJDLENBQUosRUFBOEM7QUFDMUMsdUJBQU94QixNQUFNb0IsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSDtBQUNELG1CQUFPLEtBQUtJLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJQLFNBQTFCLENBQVA7QUFDSDtBQUNKLEtBYkQ7QUFjQVAsVUFBTWUsUUFBTixHQUFpQixVQUFVUixTQUFWLEVBQXFCO0FBQUE7O0FBQ2xDLFlBQUksS0FBS0ksWUFBTCxDQUFrQkMsUUFBbEIsQ0FBMkJMLFVBQVVNLEVBQXJDLENBQUosRUFBOEM7QUFDMUMsbUJBQU94QixNQUFNb0IsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSDtBQUNELGVBQU9sQixnQkFBZ0IsSUFBaEIsRUFBc0IsWUFBdEIsRUFBb0NlLFNBQXBDLEVBQStDQyxJQUEvQyxDQUFvRCxZQUFNO0FBQzdELGdCQUFJLE9BQUtHLFlBQUwsQ0FBa0JDLFFBQWxCLENBQTJCTCxVQUFVTSxFQUFyQyxDQUFKLEVBQThDO0FBQzFDLHVCQUFPeEIsTUFBTW9CLE9BQU4sQ0FBY0MsT0FBZCxFQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sT0FBS00sS0FBTCxDQUFXVCxTQUFYLEVBQXNCQyxJQUF0QixDQUEyQjtBQUFBLDJCQUFNLE9BQUtTLFlBQUwsQ0FBa0IsQ0FBQ1YsU0FBRCxDQUFsQixDQUFOO0FBQUEsaUJBQTNCLEVBQWlFQyxJQUFqRSxDQUFzRTtBQUFBLDJCQUFNZixlQUFlLE1BQWYsRUFBcUIsTUFBckIsRUFBNkJjLFNBQTdCLENBQU47QUFBQSxpQkFBdEUsQ0FBUDtBQUNIO0FBQ0osU0FOTSxFQU1KVyxLQU5JLENBTUUsaUJBQVM7QUFDZCxtQkFBT3pCLGVBQWUsTUFBZixFQUFxQixVQUFyQixFQUFpQ2MsU0FBakMsRUFBNENZLEtBQTVDLEVBQW1EWCxJQUFuRCxDQUF3RCxZQUFNO0FBQ2pFLHNCQUFNVyxLQUFOO0FBQ0gsYUFGTSxDQUFQO0FBR0gsU0FWTSxDQUFQO0FBV0gsS0FmRDtBQWdCSCIsImZpbGUiOiJzb3VyY2UtaW50ZXJmYWNlcy9zeW5jYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IGFzc2VydCwgaXNBcnJheSB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5pbXBvcnQgeyBmdWxmaWxsSW5TZXJpZXMsIHNldHRsZUluU2VyaWVzIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuaW1wb3J0IHsgU291cmNlIH0gZnJvbSAnLi4vc291cmNlJztcbmV4cG9ydCBjb25zdCBTWU5DQUJMRSA9ICdfX3N5bmNhYmxlX18nO1xuLyoqXG4gKiBIYXMgYSBzb3VyY2UgYmVlbiBkZWNvcmF0ZWQgYXMgYEBzeW5jYWJsZWA/XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gc291cmNlXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTeW5jYWJsZShzb3VyY2UpIHtcbiAgICByZXR1cm4gISFzb3VyY2VbU1lOQ0FCTEVdO1xufVxuLyoqXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInN5bmNhYmxlXCIgYW5kIGFkZHMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBTeW5jYWJsZWBcbiAqIGludGVyZmFjZS5cbiAqXG4gKiBUaGUgYHN5bmNgIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZSBcInN5bmMgZmxvd1wiIGluIE9yYml0LiBUaGlzIGZsb3cgaXMgdXNlZCB0b1xuICogc3luY2hyb25pemUgdGhlIGNvbnRlbnRzIG9mIHNvdXJjZXMuXG4gKlxuICogT3RoZXIgc291cmNlcyBjYW4gcGFydGljaXBhdGUgaW4gdGhlIHJlc29sdXRpb24gb2YgYSBgc3luY2AgYnkgb2JzZXJ2aW5nIHRoZVxuICogYHRyYW5zZm9ybWAgZXZlbnQsIHdoaWNoIGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYSBuZXcgYFRyYW5zZm9ybWAgaXMgYXBwbGllZCB0b1xuICogYSBzb3VyY2UuXG4gKlxuICogQGV4cG9ydFxuICogQGRlY29yYXRvclxuICogQHBhcmFtIHtTb3VyY2VDbGFzc30gS2xhc3NcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzeW5jYWJsZShLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBpZiAoaXNTeW5jYWJsZShwcm90bykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoJ1N5bmNhYmxlIGludGVyZmFjZSBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGEgU291cmNlJywgcHJvdG8gaW5zdGFuY2VvZiBTb3VyY2UpO1xuICAgIHByb3RvW1NZTkNBQkxFXSA9IHRydWU7XG4gICAgcHJvdG8uc3luYyA9IGZ1bmN0aW9uICh0cmFuc2Zvcm1PclRyYW5zZm9ybXMpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkodHJhbnNmb3JtT3JUcmFuc2Zvcm1zKSkge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtcyA9IHRyYW5zZm9ybU9yVHJhbnNmb3JtcztcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1zLnJlZHVjZSgoY2hhaW4sIHRyYW5zZm9ybSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKCgpID0+IHRoaXMuc3luYyh0cmFuc2Zvcm0pKTtcbiAgICAgICAgICAgIH0sIE9yYml0LlByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRyYW5zZm9ybU9yVHJhbnNmb3JtcztcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VucXVldWVTeW5jKCdzeW5jJywgdHJhbnNmb3JtKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8uX19zeW5jX18gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlU3luYycsIHRyYW5zZm9ybSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N5bmModHJhbnNmb3JtKS50aGVuKCgpID0+IHRoaXMuX3RyYW5zZm9ybWVkKFt0cmFuc2Zvcm1dKSkudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAnc3luYycsIHRyYW5zZm9ybSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3N5bmNGYWlsJywgdHJhbnNmb3JtLCBlcnJvcikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iXX0=