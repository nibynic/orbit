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

var SYNCABLE = exports.SYNCABLE = '__syncable__';
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
    var proto = Klass.prototype;
    if (isSyncable(proto)) {
        return;
    }
    (0, _utils.assert)('Syncable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[SYNCABLE] = true;
    proto.sync = function (transformOrTransforms) {
        var _this = this;

        if ((0, _utils.isArray)(transformOrTransforms)) {
            var transforms = transformOrTransforms;
            return transforms.reduce(function (chain, transform) {
                return chain.then(function () {
                    return _this.sync(transform);
                });
            }, _main2.default.Promise.resolve());
        } else {
            var transform = transformOrTransforms;
            if (this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve();
            }
            return this._enqueueSync('sync', transform);
        }
    };
    proto.__sync__ = function (transform) {
        var _this2 = this;

        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve();
        }
        return (0, _core.fulfillInSeries)(this, 'beforeSync', transform).then(function () {
            if (_this2.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve();
            } else {
                return _this2._sync(transform).then(function () {
                    return _this2._transformed([transform]);
                }).then(function () {
                    return (0, _core.settleInSeries)(_this2, 'sync', transform);
                });
            }
        }).catch(function (error) {
            return (0, _core.settleInSeries)(_this2, 'syncFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3N5bmNhYmxlLmpzIl0sIm5hbWVzIjpbIlNZTkNBQkxFIiwic291cmNlIiwicHJvdG8iLCJLbGFzcyIsImlzU3luY2FibGUiLCJhc3NlcnQiLCJpc0FycmF5IiwidHJhbnNmb3JtcyIsIk9yYml0IiwidHJhbnNmb3JtIiwic2V0dGxlSW5TZXJpZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztRQVlPLFUsR0FBQSxVO2tCQW1CUSxROzs7Ozs7QUE5QmY7O0FBQ0E7O0FBQ0E7Ozs7QUFDTyxJQUFNQSw4QkFBTixjQUFBO0FBQ1A7Ozs7Ozs7QUFPTyxTQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQTRCO0FBQy9CLFdBQU8sQ0FBQyxDQUFDQyxPQUFULFFBQVNBLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JlLFNBQUEsUUFBQSxDQUFBLEtBQUEsRUFBeUI7QUFDcEMsUUFBSUMsUUFBUUMsTUFBWixTQUFBO0FBQ0EsUUFBSUMsV0FBSixLQUFJQSxDQUFKLEVBQXVCO0FBQ25CO0FBQ0g7QUFDREMsdUJBQUFBLG9EQUFBQSxFQUE2REgsaUJBQTdERyxjQUFBQTtBQUNBSCxVQUFBQSxRQUFBQSxJQUFBQSxJQUFBQTtBQUNBQSxVQUFBQSxJQUFBQSxHQUFhLFVBQUEscUJBQUEsRUFBaUM7QUFBQSxZQUFBLFFBQUEsSUFBQTs7QUFDMUMsWUFBSUksb0JBQUoscUJBQUlBLENBQUosRUFBb0M7QUFDaEMsZ0JBQU1DLGFBQU4scUJBQUE7QUFDQSxtQkFBTyxXQUFBLE1BQUEsQ0FBa0IsVUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFzQjtBQUMzQyx1QkFBTyxNQUFBLElBQUEsQ0FBVyxZQUFBO0FBQUEsMkJBQU0sTUFBQSxJQUFBLENBQU4sU0FBTSxDQUFOO0FBQWxCLGlCQUFPLENBQVA7QUFERyxhQUFBLEVBRUpDLGVBQUFBLE9BQUFBLENBRkgsT0FFR0EsRUFGSSxDQUFQO0FBRkosU0FBQSxNQUtPO0FBQ0gsZ0JBQU1DLFlBQU4scUJBQUE7QUFDQSxnQkFBSSxLQUFBLFlBQUEsQ0FBQSxRQUFBLENBQTJCQSxVQUEvQixFQUFJLENBQUosRUFBOEM7QUFDMUMsdUJBQU9ELGVBQUFBLE9BQUFBLENBQVAsT0FBT0EsRUFBUDtBQUNIO0FBQ0QsbUJBQU8sS0FBQSxZQUFBLENBQUEsTUFBQSxFQUFQLFNBQU8sQ0FBUDtBQUNIO0FBWkxOLEtBQUFBO0FBY0FBLFVBQUFBLFFBQUFBLEdBQWlCLFVBQUEsU0FBQSxFQUFxQjtBQUFBLFlBQUEsU0FBQSxJQUFBOztBQUNsQyxZQUFJLEtBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBMkJPLFVBQS9CLEVBQUksQ0FBSixFQUE4QztBQUMxQyxtQkFBT0QsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQO0FBQ0g7QUFDRCxlQUFPLDJCQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsQ0FBb0QsWUFBTTtBQUM3RCxnQkFBSSxPQUFBLFlBQUEsQ0FBQSxRQUFBLENBQTJCQyxVQUEvQixFQUFJLENBQUosRUFBOEM7QUFDMUMsdUJBQU9ELGVBQUFBLE9BQUFBLENBQVAsT0FBT0EsRUFBUDtBQURKLGFBQUEsTUFFTztBQUNILHVCQUFPLE9BQUEsS0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQTJCLFlBQUE7QUFBQSwyQkFBTSxPQUFBLFlBQUEsQ0FBa0IsQ0FBeEIsU0FBd0IsQ0FBbEIsQ0FBTjtBQUEzQixpQkFBQSxFQUFBLElBQUEsQ0FBc0UsWUFBQTtBQUFBLDJCQUFNRSwwQkFBQUEsTUFBQUEsRUFBQUEsTUFBQUEsRUFBTixTQUFNQSxDQUFOO0FBQTdFLGlCQUFPLENBQVA7QUFDSDtBQUxFLFNBQUEsRUFBQSxLQUFBLENBTUUsVUFBQSxLQUFBLEVBQVM7QUFDZCxtQkFBTywwQkFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUF3RCxZQUFNO0FBQ2pFLHNCQUFBLEtBQUE7QUFESixhQUFPLENBQVA7QUFQSixTQUFPLENBQVA7QUFKSlIsS0FBQUE7QUFnQkgiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi4vbWFpbic7XG5pbXBvcnQgeyBhc3NlcnQsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHsgZnVsZmlsbEluU2VyaWVzLCBzZXR0bGVJblNlcmllcyB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbmltcG9ydCB7IFNvdXJjZSB9IGZyb20gJy4uL3NvdXJjZSc7XG5leHBvcnQgY29uc3QgU1lOQ0FCTEUgPSAnX19zeW5jYWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAc3luY2FibGVgP1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IHNvdXJjZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3luY2FibGUoc291cmNlKSB7XG4gICAgcmV0dXJuICEhc291cmNlW1NZTkNBQkxFXTtcbn1cbi8qKlxuICogTWFya3MgYSBzb3VyY2UgYXMgXCJzeW5jYWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgU3luY2FibGVgXG4gKiBpbnRlcmZhY2UuXG4gKlxuICogVGhlIGBzeW5jYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJzeW5jIGZsb3dcIiBpbiBPcmJpdC4gVGhpcyBmbG93IGlzIHVzZWQgdG9cbiAqIHN5bmNocm9uaXplIHRoZSBjb250ZW50cyBvZiBzb3VyY2VzLlxuICpcbiAqIE90aGVyIHNvdXJjZXMgY2FuIHBhcnRpY2lwYXRlIGluIHRoZSByZXNvbHV0aW9uIG9mIGEgYHN5bmNgIGJ5IG9ic2VydmluZyB0aGVcbiAqIGB0cmFuc2Zvcm1gIGV2ZW50LCB3aGljaCBpcyBlbWl0dGVkIHdoZW5ldmVyIGEgbmV3IGBUcmFuc2Zvcm1gIGlzIGFwcGxpZWQgdG9cbiAqIGEgc291cmNlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IEtsYXNzXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3luY2FibGUoS2xhc3MpIHtcbiAgICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XG4gICAgaWYgKGlzU3luY2FibGUocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KCdTeW5jYWJsZSBpbnRlcmZhY2UgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBhIFNvdXJjZScsIHByb3RvIGluc3RhbmNlb2YgU291cmNlKTtcbiAgICBwcm90b1tTWU5DQUJMRV0gPSB0cnVlO1xuICAgIHByb3RvLnN5bmMgPSBmdW5jdGlvbiAodHJhbnNmb3JtT3JUcmFuc2Zvcm1zKSB7XG4gICAgICAgIGlmIChpc0FycmF5KHRyYW5zZm9ybU9yVHJhbnNmb3JtcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1PclRyYW5zZm9ybXM7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3Jtcy5yZWR1Y2UoKGNoYWluLCB0cmFuc2Zvcm0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiB0aGlzLnN5bmModHJhbnNmb3JtKSk7XG4gICAgICAgICAgICB9LCBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1PclRyYW5zZm9ybXM7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlU3luYygnc3luYycsIHRyYW5zZm9ybSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb3RvLl9fc3luY19fID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdWxmaWxsSW5TZXJpZXModGhpcywgJ2JlZm9yZVN5bmMnLCB0cmFuc2Zvcm0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTG9nLmNvbnRhaW5zKHRyYW5zZm9ybS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zeW5jKHRyYW5zZm9ybSkudGhlbigoKSA9PiB0aGlzLl90cmFuc2Zvcm1lZChbdHJhbnNmb3JtXSkpLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3N5bmMnLCB0cmFuc2Zvcm0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdzeW5jRmFpbCcsIHRyYW5zZm9ybSwgZXJyb3IpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59Il19