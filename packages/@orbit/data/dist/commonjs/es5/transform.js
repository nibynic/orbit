'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildTransform = buildTransform;

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A builder function for creating a Transform from its constituent parts.
 *
 * If a `Transform` is passed in with an `id` and `operations`, and no
 * replacement `id` or `options` are also passed in, then the `Transform`
 * will be returned unchanged.
 *
 * For all other cases, a new `Transform` object will be created and returned.
 *
 * Transforms will be assigned the specified `transformId` as `id`. If none
 * is specified, a UUID will be generated.
 *
 * @export
 * @param {TransformOrOperations} transformOrOperations
 * @param {object} [transformOptions]
 * @param {string} [transformId] Unique id for this transform (otherwise a UUID will be assigned)
 * @param {TransformBuilder} [transformBuilder]
 * @returns {Transform}
 */
/* eslint-disable valid-jsdoc */
function buildTransform(transformOrOperations, transformOptions, transformId, transformBuilder) {
    if (typeof transformOrOperations === 'function') {
        return buildTransform(transformOrOperations(transformBuilder), transformOptions, transformId);
    } else {
        var transform = transformOrOperations;
        var operations = void 0;
        var options = void 0;
        if ((0, _utils.isObject)(transform) && transform.operations) {
            if (transform.id && !transformOptions && !transformId) {
                return transform;
            }
            operations = transform.operations;
            options = transformOptions || transform.options;
        } else {
            if ((0, _utils.isArray)(transformOrOperations)) {
                operations = transformOrOperations;
            } else {
                operations = [transformOrOperations];
            }
            options = transformOptions;
        }
        var id = transformId || _main2.default.uuid();
        return { operations: operations, options: options, id: id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS5qcyJdLCJuYW1lcyI6WyJidWlsZFRyYW5zZm9ybSIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRyYW5zZm9ybSIsIm9wZXJhdGlvbnMiLCJvcHRpb25zIiwiaXNPYmplY3QiLCJ0cmFuc2Zvcm1PcHRpb25zIiwiaXNBcnJheSIsImlkIiwidHJhbnNmb3JtSWQiLCJPcmJpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFzQk8sYyxHQUFBLGM7O0FBckJQOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQk8sU0FBQSxjQUFBLENBQUEscUJBQUEsRUFBQSxnQkFBQSxFQUFBLFdBQUEsRUFBQSxnQkFBQSxFQUFnRztBQUNuRyxRQUFJLE9BQUEscUJBQUEsS0FBSixVQUFBLEVBQWlEO0FBQzdDLGVBQU9BLGVBQWVDLHNCQUFmRCxnQkFBZUMsQ0FBZkQsRUFBQUEsZ0JBQUFBLEVBQVAsV0FBT0EsQ0FBUDtBQURKLEtBQUEsTUFFTztBQUNILFlBQUlFLFlBQUoscUJBQUE7QUFDQSxZQUFJQyxhQUFBQSxLQUFKLENBQUE7QUFDQSxZQUFJQyxVQUFBQSxLQUFKLENBQUE7QUFDQSxZQUFJQyxxQkFBQUEsU0FBQUEsS0FBdUJILFVBQTNCLFVBQUEsRUFBaUQ7QUFDN0MsZ0JBQUlBLFVBQUFBLEVBQUFBLElBQWdCLENBQWhCQSxnQkFBQUEsSUFBcUMsQ0FBekMsV0FBQSxFQUF1RDtBQUNuRCx1QkFBQSxTQUFBO0FBQ0g7QUFDREMseUJBQWFELFVBQWJDLFVBQUFBO0FBQ0FDLHNCQUFVRSxvQkFBb0JKLFVBQTlCRSxPQUFBQTtBQUxKLFNBQUEsTUFNTztBQUNILGdCQUFJRyxvQkFBSixxQkFBSUEsQ0FBSixFQUFvQztBQUNoQ0osNkJBQUFBLHFCQUFBQTtBQURKLGFBQUEsTUFFTztBQUNIQSw2QkFBYSxDQUFiQSxxQkFBYSxDQUFiQTtBQUNIO0FBQ0RDLHNCQUFBQSxnQkFBQUE7QUFDSDtBQUNELFlBQUlJLEtBQUtDLGVBQWVDLGVBQXhCLElBQXdCQSxFQUF4QjtBQUNBLGVBQU8sRUFBRVAsWUFBRixVQUFBLEVBQWNDLFNBQWQsT0FBQSxFQUF1QkksSUFBOUIsRUFBTyxFQUFQO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IGlzT2JqZWN0LCBpc0FycmF5IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8qKlxuICogQSBidWlsZGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIFRyYW5zZm9ybSBmcm9tIGl0cyBjb25zdGl0dWVudCBwYXJ0cy5cbiAqXG4gKiBJZiBhIGBUcmFuc2Zvcm1gIGlzIHBhc3NlZCBpbiB3aXRoIGFuIGBpZGAgYW5kIGBvcGVyYXRpb25zYCwgYW5kIG5vXG4gKiByZXBsYWNlbWVudCBgaWRgIG9yIGBvcHRpb25zYCBhcmUgYWxzbyBwYXNzZWQgaW4sIHRoZW4gdGhlIGBUcmFuc2Zvcm1gXG4gKiB3aWxsIGJlIHJldHVybmVkIHVuY2hhbmdlZC5cbiAqXG4gKiBGb3IgYWxsIG90aGVyIGNhc2VzLCBhIG5ldyBgVHJhbnNmb3JtYCBvYmplY3Qgd2lsbCBiZSBjcmVhdGVkIGFuZCByZXR1cm5lZC5cbiAqXG4gKiBUcmFuc2Zvcm1zIHdpbGwgYmUgYXNzaWduZWQgdGhlIHNwZWNpZmllZCBgdHJhbnNmb3JtSWRgIGFzIGBpZGAuIElmIG5vbmVcbiAqIGlzIHNwZWNpZmllZCwgYSBVVUlEIHdpbGwgYmUgZ2VuZXJhdGVkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7VHJhbnNmb3JtT3JPcGVyYXRpb25zfSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBbdHJhbnNmb3JtT3B0aW9uc11cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHJhbnNmb3JtSWRdIFVuaXF1ZSBpZCBmb3IgdGhpcyB0cmFuc2Zvcm0gKG90aGVyd2lzZSBhIFVVSUQgd2lsbCBiZSBhc3NpZ25lZClcbiAqIEBwYXJhbSB7VHJhbnNmb3JtQnVpbGRlcn0gW3RyYW5zZm9ybUJ1aWxkZXJdXG4gKiBAcmV0dXJucyB7VHJhbnNmb3JtfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRUcmFuc2Zvcm0odHJhbnNmb3JtT3JPcGVyYXRpb25zLCB0cmFuc2Zvcm1PcHRpb25zLCB0cmFuc2Zvcm1JZCwgdHJhbnNmb3JtQnVpbGRlcikge1xuICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtT3JPcGVyYXRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBidWlsZFRyYW5zZm9ybSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnModHJhbnNmb3JtQnVpbGRlciksIHRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybUlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdHJhbnNmb3JtID0gdHJhbnNmb3JtT3JPcGVyYXRpb25zO1xuICAgICAgICBsZXQgb3BlcmF0aW9ucztcbiAgICAgICAgbGV0IG9wdGlvbnM7XG4gICAgICAgIGlmIChpc09iamVjdCh0cmFuc2Zvcm0pICYmIHRyYW5zZm9ybS5vcGVyYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtLmlkICYmICF0cmFuc2Zvcm1PcHRpb25zICYmICF0cmFuc2Zvcm1JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYXRpb25zID0gdHJhbnNmb3JtLm9wZXJhdGlvbnM7XG4gICAgICAgICAgICBvcHRpb25zID0gdHJhbnNmb3JtT3B0aW9ucyB8fCB0cmFuc2Zvcm0ub3B0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHRyYW5zZm9ybU9yT3BlcmF0aW9ucykpIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zID0gdHJhbnNmb3JtT3JPcGVyYXRpb25zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zID0gW3RyYW5zZm9ybU9yT3BlcmF0aW9uc107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHRpb25zID0gdHJhbnNmb3JtT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBsZXQgaWQgPSB0cmFuc2Zvcm1JZCB8fCBPcmJpdC51dWlkKCk7XG4gICAgICAgIHJldHVybiB7IG9wZXJhdGlvbnMsIG9wdGlvbnMsIGlkIH07XG4gICAgfVxufSJdfQ==