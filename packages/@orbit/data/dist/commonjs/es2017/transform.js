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
        let transform = transformOrOperations;
        let operations;
        let options;
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
        let id = transformId || _main2.default.uuid();
        return { operations, options, id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS5qcyJdLCJuYW1lcyI6WyJidWlsZFRyYW5zZm9ybSIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRyYW5zZm9ybU9wdGlvbnMiLCJ0cmFuc2Zvcm1JZCIsInRyYW5zZm9ybUJ1aWxkZXIiLCJ0cmFuc2Zvcm0iLCJvcGVyYXRpb25zIiwib3B0aW9ucyIsImlkIiwiT3JiaXQiLCJ1dWlkIl0sIm1hcHBpbmdzIjoiOzs7OztRQXNCZ0JBLGMsR0FBQUEsYzs7QUFyQmhCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUhBO0FBc0JPLFNBQVNBLGNBQVQsQ0FBd0JDLHFCQUF4QixFQUErQ0MsZ0JBQS9DLEVBQWlFQyxXQUFqRSxFQUE4RUMsZ0JBQTlFLEVBQWdHO0FBQ25HLFFBQUksT0FBT0gscUJBQVAsS0FBaUMsVUFBckMsRUFBaUQ7QUFDN0MsZUFBT0QsZUFBZUMsc0JBQXNCRyxnQkFBdEIsQ0FBZixFQUF3REYsZ0JBQXhELEVBQTBFQyxXQUExRSxDQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsWUFBSUUsWUFBWUoscUJBQWhCO0FBQ0EsWUFBSUssVUFBSjtBQUNBLFlBQUlDLE9BQUo7QUFDQSxZQUFJLHFCQUFTRixTQUFULEtBQXVCQSxVQUFVQyxVQUFyQyxFQUFpRDtBQUM3QyxnQkFBSUQsVUFBVUcsRUFBVixJQUFnQixDQUFDTixnQkFBakIsSUFBcUMsQ0FBQ0MsV0FBMUMsRUFBdUQ7QUFDbkQsdUJBQU9FLFNBQVA7QUFDSDtBQUNEQyx5QkFBYUQsVUFBVUMsVUFBdkI7QUFDQUMsc0JBQVVMLG9CQUFvQkcsVUFBVUUsT0FBeEM7QUFDSCxTQU5ELE1BTU87QUFDSCxnQkFBSSxvQkFBUU4scUJBQVIsQ0FBSixFQUFvQztBQUNoQ0ssNkJBQWFMLHFCQUFiO0FBQ0gsYUFGRCxNQUVPO0FBQ0hLLDZCQUFhLENBQUNMLHFCQUFELENBQWI7QUFDSDtBQUNETSxzQkFBVUwsZ0JBQVY7QUFDSDtBQUNELFlBQUlNLEtBQUtMLGVBQWVNLGVBQU1DLElBQU4sRUFBeEI7QUFDQSxlQUFPLEVBQUVKLFVBQUYsRUFBY0MsT0FBZCxFQUF1QkMsRUFBdkIsRUFBUDtBQUNIO0FBQ0oiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgaXNPYmplY3QsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBBIGJ1aWxkZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgVHJhbnNmb3JtIGZyb20gaXRzIGNvbnN0aXR1ZW50IHBhcnRzLlxuICpcbiAqIElmIGEgYFRyYW5zZm9ybWAgaXMgcGFzc2VkIGluIHdpdGggYW4gYGlkYCBhbmQgYG9wZXJhdGlvbnNgLCBhbmQgbm9cbiAqIHJlcGxhY2VtZW50IGBpZGAgb3IgYG9wdGlvbnNgIGFyZSBhbHNvIHBhc3NlZCBpbiwgdGhlbiB0aGUgYFRyYW5zZm9ybWBcbiAqIHdpbGwgYmUgcmV0dXJuZWQgdW5jaGFuZ2VkLlxuICpcbiAqIEZvciBhbGwgb3RoZXIgY2FzZXMsIGEgbmV3IGBUcmFuc2Zvcm1gIG9iamVjdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxuICpcbiAqIFRyYW5zZm9ybXMgd2lsbCBiZSBhc3NpZ25lZCB0aGUgc3BlY2lmaWVkIGB0cmFuc2Zvcm1JZGAgYXMgYGlkYC4gSWYgbm9uZVxuICogaXMgc3BlY2lmaWVkLCBhIFVVSUQgd2lsbCBiZSBnZW5lcmF0ZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtUcmFuc2Zvcm1Pck9wZXJhdGlvbnN9IHRyYW5zZm9ybU9yT3BlcmF0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IFt0cmFuc2Zvcm1PcHRpb25zXVxuICogQHBhcmFtIHtzdHJpbmd9IFt0cmFuc2Zvcm1JZF0gVW5pcXVlIGlkIGZvciB0aGlzIHRyYW5zZm9ybSAob3RoZXJ3aXNlIGEgVVVJRCB3aWxsIGJlIGFzc2lnbmVkKVxuICogQHBhcmFtIHtUcmFuc2Zvcm1CdWlsZGVyfSBbdHJhbnNmb3JtQnVpbGRlcl1cbiAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFRyYW5zZm9ybSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnMsIHRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybUlkLCB0cmFuc2Zvcm1CdWlsZGVyKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm1Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucyh0cmFuc2Zvcm1CdWlsZGVyKSwgdHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtSWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnM7XG4gICAgICAgIGxldCBvcGVyYXRpb25zO1xuICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRyYW5zZm9ybSkgJiYgdHJhbnNmb3JtLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0uaWQgJiYgIXRyYW5zZm9ybU9wdGlvbnMgJiYgIXRyYW5zZm9ybUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wZXJhdGlvbnMgPSB0cmFuc2Zvcm0ub3BlcmF0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zIHx8IHRyYW5zZm9ybS5vcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodHJhbnNmb3JtT3JPcGVyYXRpb25zKSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMgPSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMgPSBbdHJhbnNmb3JtT3JPcGVyYXRpb25zXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZCA9IHRyYW5zZm9ybUlkIHx8IE9yYml0LnV1aWQoKTtcbiAgICAgICAgcmV0dXJuIHsgb3BlcmF0aW9ucywgb3B0aW9ucywgaWQgfTtcbiAgICB9XG59Il19