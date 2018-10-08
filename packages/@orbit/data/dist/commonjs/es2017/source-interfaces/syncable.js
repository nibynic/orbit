'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SYNCABLE = undefined;
exports.isSyncable = isSyncable;
exports.default = syncable;

var _main = require('../main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('@orbit/utils');

var _core = require('@orbit/core');

var _source = require('../source');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SYNCABLE = exports.SYNCABLE = '__syncable__';
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
    let proto = Klass.prototype;
    if (isSyncable(proto)) {
        return;
    }
    (0, _utils.assert)('Syncable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[SYNCABLE] = true;
    proto.sync = function (transformOrTransforms) {
        if ((0, _utils.isArray)(transformOrTransforms)) {
            const transforms = transformOrTransforms;
            return transforms.reduce((chain, transform) => {
                return chain.then(() => this.sync(transform));
            }, _main2.default.Promise.resolve());
        } else {
            const transform = transformOrTransforms;
            if (this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve();
            }
            return this._enqueueSync('sync', transform);
        }
    };
    proto.__sync__ = function (transform) {
        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve();
        }
        return (0, _core.fulfillInSeries)(this, 'beforeSync', transform).then(() => {
            if (this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve();
            } else {
                return this._sync(transform).then(() => this._transformed([transform])).then(() => (0, _core.settleInSeries)(this, 'sync', transform));
            }
        }).catch(error => {
            return (0, _core.settleInSeries)(this, 'syncFail', transform, error).then(() => {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3N5bmNhYmxlLmpzIl0sIm5hbWVzIjpbImlzU3luY2FibGUiLCJzeW5jYWJsZSIsIlNZTkNBQkxFIiwic291cmNlIiwiS2xhc3MiLCJwcm90byIsInByb3RvdHlwZSIsIlNvdXJjZSIsInN5bmMiLCJ0cmFuc2Zvcm1PclRyYW5zZm9ybXMiLCJ0cmFuc2Zvcm1zIiwicmVkdWNlIiwiY2hhaW4iLCJ0cmFuc2Zvcm0iLCJ0aGVuIiwiT3JiaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRyYW5zZm9ybUxvZyIsImNvbnRhaW5zIiwiaWQiLCJfZW5xdWV1ZVN5bmMiLCJfX3N5bmNfXyIsIl9zeW5jIiwiX3RyYW5zZm9ybWVkIiwiY2F0Y2giLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBWWdCQSxVLEdBQUFBLFU7a0JBbUJRQyxROztBQS9CeEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNPLE1BQU1DLDhCQUFXLGNBQWpCO0FBQ1A7Ozs7Ozs7QUFPTyxTQUFTRixVQUFULENBQW9CRyxNQUFwQixFQUE0QjtBQUMvQixXQUFPLENBQUMsQ0FBQ0EsT0FBT0QsUUFBUCxDQUFUO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7OztBQWdCZSxTQUFTRCxRQUFULENBQWtCRyxLQUFsQixFQUF5QjtBQUNwQyxRQUFJQyxRQUFRRCxNQUFNRSxTQUFsQjtBQUNBLFFBQUlOLFdBQVdLLEtBQVgsQ0FBSixFQUF1QjtBQUNuQjtBQUNIO0FBQ0QsdUJBQU8sb0RBQVAsRUFBNkRBLGlCQUFpQkUsY0FBOUU7QUFDQUYsVUFBTUgsUUFBTixJQUFrQixJQUFsQjtBQUNBRyxVQUFNRyxJQUFOLEdBQWEsVUFBVUMscUJBQVYsRUFBaUM7QUFDMUMsWUFBSSxvQkFBUUEscUJBQVIsQ0FBSixFQUFvQztBQUNoQyxrQkFBTUMsYUFBYUQscUJBQW5CO0FBQ0EsbUJBQU9DLFdBQVdDLE1BQVgsQ0FBa0IsQ0FBQ0MsS0FBRCxFQUFRQyxTQUFSLEtBQXNCO0FBQzNDLHVCQUFPRCxNQUFNRSxJQUFOLENBQVcsTUFBTSxLQUFLTixJQUFMLENBQVVLLFNBQVYsQ0FBakIsQ0FBUDtBQUNILGFBRk0sRUFFSkUsZUFBTUMsT0FBTixDQUFjQyxPQUFkLEVBRkksQ0FBUDtBQUdILFNBTEQsTUFLTztBQUNILGtCQUFNSixZQUFZSixxQkFBbEI7QUFDQSxnQkFBSSxLQUFLUyxZQUFMLENBQWtCQyxRQUFsQixDQUEyQk4sVUFBVU8sRUFBckMsQ0FBSixFQUE4QztBQUMxQyx1QkFBT0wsZUFBTUMsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSDtBQUNELG1CQUFPLEtBQUtJLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJSLFNBQTFCLENBQVA7QUFDSDtBQUNKLEtBYkQ7QUFjQVIsVUFBTWlCLFFBQU4sR0FBaUIsVUFBVVQsU0FBVixFQUFxQjtBQUNsQyxZQUFJLEtBQUtLLFlBQUwsQ0FBa0JDLFFBQWxCLENBQTJCTixVQUFVTyxFQUFyQyxDQUFKLEVBQThDO0FBQzFDLG1CQUFPTCxlQUFNQyxPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNIO0FBQ0QsZUFBTywyQkFBZ0IsSUFBaEIsRUFBc0IsWUFBdEIsRUFBb0NKLFNBQXBDLEVBQStDQyxJQUEvQyxDQUFvRCxNQUFNO0FBQzdELGdCQUFJLEtBQUtJLFlBQUwsQ0FBa0JDLFFBQWxCLENBQTJCTixVQUFVTyxFQUFyQyxDQUFKLEVBQThDO0FBQzFDLHVCQUFPTCxlQUFNQyxPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNILGFBRkQsTUFFTztBQUNILHVCQUFPLEtBQUtNLEtBQUwsQ0FBV1YsU0FBWCxFQUFzQkMsSUFBdEIsQ0FBMkIsTUFBTSxLQUFLVSxZQUFMLENBQWtCLENBQUNYLFNBQUQsQ0FBbEIsQ0FBakMsRUFBaUVDLElBQWpFLENBQXNFLE1BQU0sMEJBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QkQsU0FBN0IsQ0FBNUUsQ0FBUDtBQUNIO0FBQ0osU0FOTSxFQU1KWSxLQU5JLENBTUVDLFNBQVM7QUFDZCxtQkFBTywwQkFBZSxJQUFmLEVBQXFCLFVBQXJCLEVBQWlDYixTQUFqQyxFQUE0Q2EsS0FBNUMsRUFBbURaLElBQW5ELENBQXdELE1BQU07QUFDakUsc0JBQU1ZLEtBQU47QUFDSCxhQUZNLENBQVA7QUFHSCxTQVZNLENBQVA7QUFXSCxLQWZEO0FBZ0JIIiwiZmlsZSI6InNvdXJjZS1pbnRlcmZhY2VzL3N5bmNhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4uL21haW4nO1xuaW1wb3J0IHsgYXNzZXJ0LCBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IGZ1bGZpbGxJblNlcmllcywgc2V0dGxlSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tICcuLi9zb3VyY2UnO1xuZXhwb3J0IGNvbnN0IFNZTkNBQkxFID0gJ19fc3luY2FibGVfXyc7XG4vKipcbiAqIEhhcyBhIHNvdXJjZSBiZWVuIGRlY29yYXRlZCBhcyBgQHN5bmNhYmxlYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBzb3VyY2VcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N5bmNhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtTWU5DQUJMRV07XG59XG4vKipcbiAqIE1hcmtzIGEgc291cmNlIGFzIFwic3luY2FibGVcIiBhbmQgYWRkcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYFN5bmNhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgc3luY2AgbWV0aG9kIGlzIHBhcnQgb2YgdGhlIFwic3luYyBmbG93XCIgaW4gT3JiaXQuIFRoaXMgZmxvdyBpcyB1c2VkIHRvXG4gKiBzeW5jaHJvbml6ZSB0aGUgY29udGVudHMgb2Ygc291cmNlcy5cbiAqXG4gKiBPdGhlciBzb3VyY2VzIGNhbiBwYXJ0aWNpcGF0ZSBpbiB0aGUgcmVzb2x1dGlvbiBvZiBhIGBzeW5jYCBieSBvYnNlcnZpbmcgdGhlXG4gKiBgdHJhbnNmb3JtYCBldmVudCwgd2hpY2ggaXMgZW1pdHRlZCB3aGVuZXZlciBhIG5ldyBgVHJhbnNmb3JtYCBpcyBhcHBsaWVkIHRvXG4gKiBhIHNvdXJjZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAZGVjb3JhdG9yXG4gKiBAcGFyYW0ge1NvdXJjZUNsYXNzfSBLbGFzc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5bmNhYmxlKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc1N5bmNhYmxlKHByb3RvKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydCgnU3luY2FibGUgaW50ZXJmYWNlIGNhbiBvbmx5IGJlIGFwcGxpZWQgdG8gYSBTb3VyY2UnLCBwcm90byBpbnN0YW5jZW9mIFNvdXJjZSk7XG4gICAgcHJvdG9bU1lOQ0FCTEVdID0gdHJ1ZTtcbiAgICBwcm90by5zeW5jID0gZnVuY3Rpb24gKHRyYW5zZm9ybU9yVHJhbnNmb3Jtcykge1xuICAgICAgICBpZiAoaXNBcnJheSh0cmFuc2Zvcm1PclRyYW5zZm9ybXMpKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1zID0gdHJhbnNmb3JtT3JUcmFuc2Zvcm1zO1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXMucmVkdWNlKChjaGFpbiwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYWluLnRoZW4oKCkgPT4gdGhpcy5zeW5jKHRyYW5zZm9ybSkpO1xuICAgICAgICAgICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gdHJhbnNmb3JtT3JUcmFuc2Zvcm1zO1xuICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZVN5bmMoJ3N5bmMnLCB0cmFuc2Zvcm0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm90by5fX3N5bmNfXyA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVsZmlsbEluU2VyaWVzKHRoaXMsICdiZWZvcmVTeW5jJywgdHJhbnNmb3JtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3luYyh0cmFuc2Zvcm0pLnRoZW4oKCkgPT4gdGhpcy5fdHJhbnNmb3JtZWQoW3RyYW5zZm9ybV0pKS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICdzeW5jJywgdHJhbnNmb3JtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAnc3luY0ZhaWwnLCB0cmFuc2Zvcm0sIGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSJdfQ==