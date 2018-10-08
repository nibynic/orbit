'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UPDATABLE = undefined;
exports.isUpdatable = isUpdatable;
exports.default = updatable;

var _main = require('../main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('@orbit/utils');

var _core = require('@orbit/core');

var _source = require('../source');

var _transform = require('../transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UPDATABLE = exports.UPDATABLE = '__updatable__';
/**
 * Has a source been decorated as `@updatable`?
 *
 * @export
 * @param {*} obj
 * @returns
 */
function isUpdatable(source) {
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
function updatable(Klass) {
    var proto = Klass.prototype;
    if (isUpdatable(proto)) {
        return;
    }
    (0, _utils.assert)('Updatable interface can only be applied to a Source', proto instanceof _source.Source);
    proto[UPDATABLE] = true;
    proto.update = function (transformOrOperations, options, id) {
        var transform = (0, _transform.buildTransform)(transformOrOperations, options, id, this.transformBuilder);
        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve();
        }
        return this._enqueueRequest('update', transform);
    };
    proto.__update__ = function (transform) {
        var _this = this;

        if (this.transformLog.contains(transform.id)) {
            return _main2.default.Promise.resolve();
        }
        return (0, _core.fulfillInSeries)(this, 'beforeUpdate', transform).then(function () {
            if (_this.transformLog.contains(transform.id)) {
                return _main2.default.Promise.resolve();
            } else {
                return _this._update(transform).then(function (result) {
                    return _this._transformed([transform]).then(function () {
                        return (0, _core.settleInSeries)(_this, 'update', transform, result);
                    }).then(function () {
                        return result;
                    });
                });
            }
        }).catch(function (error) {
            return (0, _core.settleInSeries)(_this, 'updateFail', transform, error).then(function () {
                throw error;
            });
        });
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS1pbnRlcmZhY2VzL3VwZGF0YWJsZS5qcyJdLCJuYW1lcyI6WyJVUERBVEFCTEUiLCJzb3VyY2UiLCJwcm90byIsIktsYXNzIiwiaXNVcGRhdGFibGUiLCJhc3NlcnQiLCJ0cmFuc2Zvcm0iLCJidWlsZFRyYW5zZm9ybSIsIk9yYml0Iiwic2V0dGxlSW5TZXJpZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztRQWFPLFcsR0FBQSxXO2tCQStCUSxTOzs7Ozs7QUEzQ2Y7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDTyxJQUFNQSxnQ0FBTixlQUFBO0FBQ1A7Ozs7Ozs7QUFPTyxTQUFBLFdBQUEsQ0FBQSxNQUFBLEVBQTZCO0FBQ2hDLFdBQU8sQ0FBQyxDQUFDQyxPQUFULFNBQVNBLENBQVQ7QUFDSDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJlLFNBQUEsU0FBQSxDQUFBLEtBQUEsRUFBMEI7QUFDckMsUUFBSUMsUUFBUUMsTUFBWixTQUFBO0FBQ0EsUUFBSUMsWUFBSixLQUFJQSxDQUFKLEVBQXdCO0FBQ3BCO0FBQ0g7QUFDREMsdUJBQUFBLHFEQUFBQSxFQUE4REgsaUJBQTlERyxjQUFBQTtBQUNBSCxVQUFBQSxTQUFBQSxJQUFBQSxJQUFBQTtBQUNBQSxVQUFBQSxNQUFBQSxHQUFlLFVBQUEscUJBQUEsRUFBQSxPQUFBLEVBQUEsRUFBQSxFQUE4QztBQUN6RCxZQUFNSSxZQUFZQywrQkFBQUEscUJBQUFBLEVBQUFBLE9BQUFBLEVBQUFBLEVBQUFBLEVBQW1ELEtBQXJFLGdCQUFrQkEsQ0FBbEI7QUFDQSxZQUFJLEtBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBMkJELFVBQS9CLEVBQUksQ0FBSixFQUE4QztBQUMxQyxtQkFBT0UsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQO0FBQ0g7QUFDRCxlQUFPLEtBQUEsZUFBQSxDQUFBLFFBQUEsRUFBUCxTQUFPLENBQVA7QUFMSk4sS0FBQUE7QUFPQUEsVUFBQUEsVUFBQUEsR0FBbUIsVUFBQSxTQUFBLEVBQXFCO0FBQUEsWUFBQSxRQUFBLElBQUE7O0FBQ3BDLFlBQUksS0FBQSxZQUFBLENBQUEsUUFBQSxDQUEyQkksVUFBL0IsRUFBSSxDQUFKLEVBQThDO0FBQzFDLG1CQUFPRSxlQUFBQSxPQUFBQSxDQUFQLE9BQU9BLEVBQVA7QUFDSDtBQUNELGVBQU8sMkJBQUEsSUFBQSxFQUFBLGNBQUEsRUFBQSxTQUFBLEVBQUEsSUFBQSxDQUFzRCxZQUFNO0FBQy9ELGdCQUFJLE1BQUEsWUFBQSxDQUFBLFFBQUEsQ0FBMkJGLFVBQS9CLEVBQUksQ0FBSixFQUE4QztBQUMxQyx1QkFBT0UsZUFBQUEsT0FBQUEsQ0FBUCxPQUFPQSxFQUFQO0FBREosYUFBQSxNQUVPO0FBQ0gsdUJBQU8sTUFBQSxPQUFBLENBQUEsU0FBQSxFQUFBLElBQUEsQ0FBNkIsVUFBQSxNQUFBLEVBQVU7QUFDMUMsMkJBQU8sTUFBQSxZQUFBLENBQWtCLENBQWxCLFNBQWtCLENBQWxCLEVBQUEsSUFBQSxDQUFvQyxZQUFBO0FBQUEsK0JBQU1DLDBCQUFBQSxLQUFBQSxFQUFBQSxRQUFBQSxFQUFBQSxTQUFBQSxFQUFOLE1BQU1BLENBQU47QUFBcEMscUJBQUEsRUFBQSxJQUFBLENBQWtHLFlBQUE7QUFBQSwrQkFBQSxNQUFBO0FBQXpHLHFCQUFPLENBQVA7QUFESixpQkFBTyxDQUFQO0FBR0g7QUFQRSxTQUFBLEVBQUEsS0FBQSxDQVFFLFVBQUEsS0FBQSxFQUFTO0FBQ2QsbUJBQU8sMEJBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBMEQsWUFBTTtBQUNuRSxzQkFBQSxLQUFBO0FBREosYUFBTyxDQUFQO0FBVEosU0FBTyxDQUFQO0FBSkpQLEtBQUFBO0FBa0JIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4uL21haW4nO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB7IHNldHRsZUluU2VyaWVzLCBmdWxmaWxsSW5TZXJpZXMgfSBmcm9tICdAb3JiaXQvY29yZSc7XG5pbXBvcnQgeyBTb3VyY2UgfSBmcm9tICcuLi9zb3VyY2UnO1xuaW1wb3J0IHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICcuLi90cmFuc2Zvcm0nO1xuZXhwb3J0IGNvbnN0IFVQREFUQUJMRSA9ICdfX3VwZGF0YWJsZV9fJztcbi8qKlxuICogSGFzIGEgc291cmNlIGJlZW4gZGVjb3JhdGVkIGFzIGBAdXBkYXRhYmxlYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVXBkYXRhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiAhIXNvdXJjZVtVUERBVEFCTEVdO1xufVxuLyoqXG4gKiBNYXJrcyBhIHNvdXJjZSBhcyBcInVwZGF0YWJsZVwiIGFuZCBhZGRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgVXBkYXRhYmxlYFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFRoZSBgdXBkYXRlYCBtZXRob2QgaXMgcGFydCBvZiB0aGUgXCJyZXF1ZXN0IGZsb3dcIiBpbiBPcmJpdC4gUmVxdWVzdHMgdHJpZ2dlclxuICogZXZlbnRzIGJlZm9yZSBhbmQgYWZ0ZXIgcHJvY2Vzc2luZyBvZiBlYWNoIHJlcXVlc3QuIE9ic2VydmVycyBjYW4gZGVsYXkgdGhlXG4gKiByZXNvbHV0aW9uIG9mIGEgcmVxdWVzdCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIGFuIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIEFuIHVwZGF0YWJsZSBzb3VyY2UgZW1pdHMgdGhlIGZvbGxvd2luZyBldmVudHM6XG4gKlxuICogLSBgYmVmb3JlVXBkYXRlYCAtIGVtaXR0ZWQgcHJpb3IgdG8gdGhlIHByb2Nlc3Npbmcgb2YgYHVwZGF0ZWAsIHRoaXMgZXZlbnRcbiAqIGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXG4gKlxuICogLSBgdXBkYXRlYCAtIGVtaXR0ZWQgYWZ0ZXIgYW4gYHVwZGF0ZWAgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIGFwcGxpZWQsIHRoaXNcbiAqIGV2ZW50IGluY2x1ZGVzIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYXMgYW4gYXJndW1lbnQuXG4gKlxuICogLSBgdXBkYXRlRmFpbGAgLSBlbWl0dGVkIHdoZW4gYW4gZXJyb3IgaGFzIG9jY3VycmVkIGFwcGx5aW5nIGFuIHVwZGF0ZSwgdGhpc1xuICogZXZlbnQncyBhcmd1bWVudHMgaW5jbHVkZSBib3RoIHRoZSByZXF1ZXN0ZWQgYFRyYW5zZm9ybWAgYW5kIHRoZSBlcnJvci5cbiAqXG4gKiBBbiB1cGRhdGFibGUgc291cmNlIG11c3QgaW1wbGVtZW50IGEgcHJpdmF0ZSBtZXRob2QgYF91cGRhdGVgLCB3aGljaCBwZXJmb3Jtc1xuICogdGhlIHByb2Nlc3NpbmcgcmVxdWlyZWQgZm9yIGB1cGRhdGVgIGFuZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW5cbiAqIGNvbXBsZXRlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7U291cmNlQ2xhc3N9IEtsYXNzXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXBkYXRhYmxlKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc1VwZGF0YWJsZShwcm90bykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoJ1VwZGF0YWJsZSBpbnRlcmZhY2UgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBhIFNvdXJjZScsIHByb3RvIGluc3RhbmNlb2YgU291cmNlKTtcbiAgICBwcm90b1tVUERBVEFCTEVdID0gdHJ1ZTtcbiAgICBwcm90by51cGRhdGUgPSBmdW5jdGlvbiAodHJhbnNmb3JtT3JPcGVyYXRpb25zLCBvcHRpb25zLCBpZCkge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBidWlsZFRyYW5zZm9ybSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnMsIG9wdGlvbnMsIGlkLCB0aGlzLnRyYW5zZm9ybUJ1aWxkZXIpO1xuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1Mb2cuY29udGFpbnModHJhbnNmb3JtLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnF1ZXVlUmVxdWVzdCgndXBkYXRlJywgdHJhbnNmb3JtKTtcbiAgICB9O1xuICAgIHByb3RvLl9fdXBkYXRlX18gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bGZpbGxJblNlcmllcyh0aGlzLCAnYmVmb3JlVXBkYXRlJywgdHJhbnNmb3JtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybUxvZy5jb250YWlucyh0cmFuc2Zvcm0uaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlKHRyYW5zZm9ybSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWQoW3RyYW5zZm9ybV0pLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3VwZGF0ZScsIHRyYW5zZm9ybSwgcmVzdWx0KSkudGhlbigoKSA9PiByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3VwZGF0ZUZhaWwnLCB0cmFuc2Zvcm0sIGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufSJdfQ==