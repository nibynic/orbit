/* eslint-disable valid-jsdoc */
import Orbit from './main';
import { isObject, isArray } from '@orbit/utils';
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
export function buildTransform(transformOrOperations, transformOptions, transformId, transformBuilder) {
    if (typeof transformOrOperations === 'function') {
        return buildTransform(transformOrOperations(transformBuilder), transformOptions, transformId);
    } else {
        var transform = transformOrOperations;
        var operations = void 0;
        var options = void 0;
        if (isObject(transform) && transform.operations) {
            if (transform.id && !transformOptions && !transformId) {
                return transform;
            }
            operations = transform.operations;
            options = transformOptions || transform.options;
        } else {
            if (isArray(transformOrOperations)) {
                operations = transformOrOperations;
            } else {
                operations = [transformOrOperations];
            }
            options = transformOptions;
        }
        var id = transformId || Orbit.uuid();
        return { operations: operations, options: options, id: id };
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYW5zZm9ybS5qcyJdLCJuYW1lcyI6WyJPcmJpdCIsImlzT2JqZWN0IiwiaXNBcnJheSIsImJ1aWxkVHJhbnNmb3JtIiwidHJhbnNmb3JtT3JPcGVyYXRpb25zIiwidHJhbnNmb3JtT3B0aW9ucyIsInRyYW5zZm9ybUlkIiwidHJhbnNmb3JtQnVpbGRlciIsInRyYW5zZm9ybSIsIm9wZXJhdGlvbnMiLCJvcHRpb25zIiwiaWQiLCJ1dWlkIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLE9BQU9BLEtBQVAsTUFBa0IsUUFBbEI7QUFDQSxTQUFTQyxRQUFULEVBQW1CQyxPQUFuQixRQUFrQyxjQUFsQztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sU0FBU0MsY0FBVCxDQUF3QkMscUJBQXhCLEVBQStDQyxnQkFBL0MsRUFBaUVDLFdBQWpFLEVBQThFQyxnQkFBOUUsRUFBZ0c7QUFDbkcsUUFBSSxPQUFPSCxxQkFBUCxLQUFpQyxVQUFyQyxFQUFpRDtBQUM3QyxlQUFPRCxlQUFlQyxzQkFBc0JHLGdCQUF0QixDQUFmLEVBQXdERixnQkFBeEQsRUFBMEVDLFdBQTFFLENBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFJRSxZQUFZSixxQkFBaEI7QUFDQSxZQUFJSyxtQkFBSjtBQUNBLFlBQUlDLGdCQUFKO0FBQ0EsWUFBSVQsU0FBU08sU0FBVCxLQUF1QkEsVUFBVUMsVUFBckMsRUFBaUQ7QUFDN0MsZ0JBQUlELFVBQVVHLEVBQVYsSUFBZ0IsQ0FBQ04sZ0JBQWpCLElBQXFDLENBQUNDLFdBQTFDLEVBQXVEO0FBQ25ELHVCQUFPRSxTQUFQO0FBQ0g7QUFDREMseUJBQWFELFVBQVVDLFVBQXZCO0FBQ0FDLHNCQUFVTCxvQkFBb0JHLFVBQVVFLE9BQXhDO0FBQ0gsU0FORCxNQU1PO0FBQ0gsZ0JBQUlSLFFBQVFFLHFCQUFSLENBQUosRUFBb0M7QUFDaENLLDZCQUFhTCxxQkFBYjtBQUNILGFBRkQsTUFFTztBQUNISyw2QkFBYSxDQUFDTCxxQkFBRCxDQUFiO0FBQ0g7QUFDRE0sc0JBQVVMLGdCQUFWO0FBQ0g7QUFDRCxZQUFJTSxLQUFLTCxlQUFlTixNQUFNWSxJQUFOLEVBQXhCO0FBQ0EsZUFBTyxFQUFFSCxzQkFBRixFQUFjQyxnQkFBZCxFQUF1QkMsTUFBdkIsRUFBUDtBQUNIO0FBQ0oiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgaXNPYmplY3QsIGlzQXJyYXkgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBBIGJ1aWxkZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgVHJhbnNmb3JtIGZyb20gaXRzIGNvbnN0aXR1ZW50IHBhcnRzLlxuICpcbiAqIElmIGEgYFRyYW5zZm9ybWAgaXMgcGFzc2VkIGluIHdpdGggYW4gYGlkYCBhbmQgYG9wZXJhdGlvbnNgLCBhbmQgbm9cbiAqIHJlcGxhY2VtZW50IGBpZGAgb3IgYG9wdGlvbnNgIGFyZSBhbHNvIHBhc3NlZCBpbiwgdGhlbiB0aGUgYFRyYW5zZm9ybWBcbiAqIHdpbGwgYmUgcmV0dXJuZWQgdW5jaGFuZ2VkLlxuICpcbiAqIEZvciBhbGwgb3RoZXIgY2FzZXMsIGEgbmV3IGBUcmFuc2Zvcm1gIG9iamVjdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxuICpcbiAqIFRyYW5zZm9ybXMgd2lsbCBiZSBhc3NpZ25lZCB0aGUgc3BlY2lmaWVkIGB0cmFuc2Zvcm1JZGAgYXMgYGlkYC4gSWYgbm9uZVxuICogaXMgc3BlY2lmaWVkLCBhIFVVSUQgd2lsbCBiZSBnZW5lcmF0ZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtUcmFuc2Zvcm1Pck9wZXJhdGlvbnN9IHRyYW5zZm9ybU9yT3BlcmF0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IFt0cmFuc2Zvcm1PcHRpb25zXVxuICogQHBhcmFtIHtzdHJpbmd9IFt0cmFuc2Zvcm1JZF0gVW5pcXVlIGlkIGZvciB0aGlzIHRyYW5zZm9ybSAob3RoZXJ3aXNlIGEgVVVJRCB3aWxsIGJlIGFzc2lnbmVkKVxuICogQHBhcmFtIHtUcmFuc2Zvcm1CdWlsZGVyfSBbdHJhbnNmb3JtQnVpbGRlcl1cbiAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFRyYW5zZm9ybSh0cmFuc2Zvcm1Pck9wZXJhdGlvbnMsIHRyYW5zZm9ybU9wdGlvbnMsIHRyYW5zZm9ybUlkLCB0cmFuc2Zvcm1CdWlsZGVyKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm1Pck9wZXJhdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkVHJhbnNmb3JtKHRyYW5zZm9ybU9yT3BlcmF0aW9ucyh0cmFuc2Zvcm1CdWlsZGVyKSwgdHJhbnNmb3JtT3B0aW9ucywgdHJhbnNmb3JtSWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnM7XG4gICAgICAgIGxldCBvcGVyYXRpb25zO1xuICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgaWYgKGlzT2JqZWN0KHRyYW5zZm9ybSkgJiYgdHJhbnNmb3JtLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0uaWQgJiYgIXRyYW5zZm9ybU9wdGlvbnMgJiYgIXRyYW5zZm9ybUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wZXJhdGlvbnMgPSB0cmFuc2Zvcm0ub3BlcmF0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zIHx8IHRyYW5zZm9ybS5vcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodHJhbnNmb3JtT3JPcGVyYXRpb25zKSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMgPSB0cmFuc2Zvcm1Pck9wZXJhdGlvbnM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMgPSBbdHJhbnNmb3JtT3JPcGVyYXRpb25zXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpZCA9IHRyYW5zZm9ybUlkIHx8IE9yYml0LnV1aWQoKTtcbiAgICAgICAgcmV0dXJuIHsgb3BlcmF0aW9ucywgb3B0aW9ucywgaWQgfTtcbiAgICB9XG59Il19