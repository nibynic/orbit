/* eslint-disable valid-jsdoc */
/**
 * Clones a value. If the value is an object, a deeply nested clone will be
 * created.
 *
 * Traverses all object properties (but not prototype properties).
 *
 * @export
 * @param {*} obj
 * @returns {*} Clone of the input `obj`
 */
export function clone(obj) {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
        return obj;
    }
    var dup = void 0;
    var type = Object.prototype.toString.call(obj);
    if (type === '[object Date]') {
        dup = new Date();
        dup.setTime(obj.getTime());
    } else if (type === '[object RegExp]') {
        dup = obj.constructor(obj);
    } else if (type === '[object Array]') {
        dup = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            if (obj.hasOwnProperty(i)) {
                dup.push(clone(obj[i]));
            }
        }
    } else {
        var val = void 0;
        dup = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object') {
                    val = clone(val);
                }
                dup[key] = val;
            }
        }
    }
    return dup;
}
/**
 * Expose properties and methods from one object on another.
 *
 * Methods will be called on `source` and will maintain `source` as the context.
 *
 * @export
 * @param {*} destination
 * @param {*} source
 */
export function expose(destination, source) {
    var properties = void 0;
    if (arguments.length > 2) {
        properties = Array.prototype.slice.call(arguments, 2);
    } else {
        properties = Object.keys(source);
    }
    properties.forEach(function (p) {
        if (typeof source[p] === 'function') {
            destination[p] = function () {
                return source[p].apply(source, arguments);
            };
        } else {
            destination[p] = source[p];
        }
    });
}
/**
 * Extend an object with the properties of one or more other objects.
 *
 * @export
 * @param {*} destination
 * @param {...any[]} sources
 * @returns {any}
 */
export function extend(destination) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                destination[p] = source[p];
            }
        }
    });
    return destination;
}
/**
 * Checks whether an object is an instance of an `Array`
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * Converts an object to an `Array` if it's not already.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
export function toArray(obj) {
    if (isNone(obj)) {
        return [];
    } else {
        return isArray(obj) ? obj : [obj];
    }
}
/**
 * Checks whether a value is a non-null object
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
/**
 * Checks whether an object is null or undefined
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isNone(obj) {
    return obj === undefined || obj === null;
}
/**
 * Merges properties from other objects into a base object. Properties that
 * resolve to `undefined` will not overwrite properties on the base object
 * that already exist.
 *
 * @export
 * @param {*} base
 * @param {...any[]} sources
 * @returns {*}
 */
export function merge(object) {
    for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        sources[_key2 - 1] = arguments[_key2];
    }

    sources.forEach(function (source) {
        Object.keys(source).forEach(function (field) {
            if (source.hasOwnProperty(field)) {
                var value = source[field];
                if (value !== undefined) {
                    object[field] = clone(value);
                }
            }
        });
    });
    return object;
}
/**
 * Merges properties from other objects into a base object, traversing and
 * merging any objects that are encountered.
 *
 * Properties that resolve to `undefined` will not overwrite properties on the
 * base object that already exist.
 *
 * @export
 * @param {*} base
 * @param {...any[]} sources
 * @returns {*}
 */
export function deepMerge(object) {
    for (var _len3 = arguments.length, sources = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        sources[_key3 - 1] = arguments[_key3];
    }

    sources.forEach(function (source) {
        Object.keys(source).forEach(function (field) {
            if (source.hasOwnProperty(field)) {
                var a = object[field];
                var b = source[field];
                if (isObject(a) && isObject(b) && !isArray(a) && !isArray(b)) {
                    deepMerge(a, b);
                } else if (b !== undefined) {
                    object[field] = clone(b);
                }
            }
        });
    });
    return object;
}
/**
 * Retrieves a value from a nested path on an object.
 *
 * Returns any falsy value encountered while traversing the path.
 *
 * @export
 * @param {*} obj
 * @param {string[]} path
 * @returns {*}
 */
export function deepGet(obj, path) {
    var index = -1;
    var result = obj;
    while (++index < path.length) {
        result = result[path[index]];
        if (!result) {
            return result;
        }
    }
    return result;
}
/**
 * Sets a value on an object at a nested path.
 *
 * This function will create objects along the path if necessary to allow
 * setting a deeply nested value.
 *
 * Returns `false` only if the current value is already strictly equal to the
 * requested `value` argument. Otherwise returns `true`.
 *
 * @export
 * @param {*} obj
 * @param {string[]} path
 * @param {*} value
 * @returns {boolean} was the value was actually changed?
 */
export function deepSet(obj, path, value) {
    var ptr = obj;
    var prop = path.pop();
    var segment = void 0;
    for (var i = 0, l = path.length; i < l; i++) {
        segment = path[i];
        if (ptr[segment] === undefined) {
            ptr[segment] = typeof segment === 'number' ? [] : {};
        }
        ptr = ptr[segment];
    }
    if (ptr[prop] === value) {
        return false;
    } else {
        ptr[prop] = value;
        return true;
    }
}
/**
 * Find an array of values that correspond to the keys of an object.
 *
 * This is a ponyfill for `Object.values`, which is still experimental.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
export function objectValues(obj) {
    if (Object.values) {
        return Object.values(obj);
    } else {
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdHMuanMiXSwibmFtZXMiOlsiY2xvbmUiLCJvYmoiLCJ1bmRlZmluZWQiLCJkdXAiLCJ0eXBlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiRGF0ZSIsInNldFRpbWUiLCJnZXRUaW1lIiwiY29uc3RydWN0b3IiLCJpIiwibGVuIiwibGVuZ3RoIiwiaGFzT3duUHJvcGVydHkiLCJwdXNoIiwidmFsIiwia2V5IiwiZXhwb3NlIiwiZGVzdGluYXRpb24iLCJzb3VyY2UiLCJwcm9wZXJ0aWVzIiwiYXJndW1lbnRzIiwiQXJyYXkiLCJzbGljZSIsImtleXMiLCJmb3JFYWNoIiwicCIsImFwcGx5IiwiZXh0ZW5kIiwic291cmNlcyIsImlzQXJyYXkiLCJ0b0FycmF5IiwiaXNOb25lIiwiaXNPYmplY3QiLCJtZXJnZSIsIm9iamVjdCIsImZpZWxkIiwidmFsdWUiLCJkZWVwTWVyZ2UiLCJhIiwiYiIsImRlZXBHZXQiLCJwYXRoIiwiaW5kZXgiLCJyZXN1bHQiLCJkZWVwU2V0IiwicHRyIiwicHJvcCIsInBvcCIsInNlZ21lbnQiLCJsIiwib2JqZWN0VmFsdWVzIiwidmFsdWVzIiwibWFwIiwiayJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7Ozs7Ozs7OztBQVVBLE9BQU8sU0FBU0EsS0FBVCxDQUFlQyxHQUFmLEVBQW9CO0FBQ3ZCLFFBQUlBLFFBQVFDLFNBQVIsSUFBcUJELFFBQVEsSUFBN0IsSUFBcUMsT0FBT0EsR0FBUCxLQUFlLFFBQXhELEVBQWtFO0FBQzlELGVBQU9BLEdBQVA7QUFDSDtBQUNELFFBQUlFLFlBQUo7QUFDQSxRQUFJQyxPQUFPQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JQLEdBQS9CLENBQVg7QUFDQSxRQUFJRyxTQUFTLGVBQWIsRUFBOEI7QUFDMUJELGNBQU0sSUFBSU0sSUFBSixFQUFOO0FBQ0FOLFlBQUlPLE9BQUosQ0FBWVQsSUFBSVUsT0FBSixFQUFaO0FBQ0gs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QUFuQixHQUE4QixFQUE5QixHQUFtQyxFQUFsRDtBQUNIO0FBQ0RILGNBQU1BLElBQUlHLE9BQUosQ0FBTjtBQUNIO0FBQ0QsUUFBSUgsSUFBSUMsSUFBSixNQUFjVixLQUFsQixFQUF5QjtBQUNyQixlQUFPLEtBQVA7QUFDSCxLQUZELE1BRU87QUFDSFMsWUFBSUMsSUFBSixJQUFZVixLQUFaO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7QUFDSjtBQUNEOzs7Ozs7Ozs7QUFTQSxPQUFPLFNBQVNjLFlBQVQsQ0FBc0JyRCxHQUF0QixFQUEyQjtBQUM5QixRQUFJSSxPQUFPa0QsTUFBWCxFQUFtQjtBQUNmLGVBQU9sRCxPQUFPa0QsTUFBUCxDQUFjdEQsR0FBZCxDQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsZUFBT0ksT0FBT3NCLElBQVAsQ0FBWTFCLEdBQVosRUFBaUJ1RCxHQUFqQixDQUFxQjtBQUFBLG1CQUFLdkQsSUFBSXdELENBQUosQ0FBTDtBQUFBLFNBQXJCLENBQVA7QUFDSDtBQUNKIiwiZmlsZSI6Im9iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuLyoqXG4gKiBDbG9uZXMgYSB2YWx1ZS4gSWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCwgYSBkZWVwbHkgbmVzdGVkIGNsb25lIHdpbGwgYmVcbiAqIGNyZWF0ZWQuXG4gKlxuICogVHJhdmVyc2VzIGFsbCBvYmplY3QgcHJvcGVydGllcyAoYnV0IG5vdCBwcm90b3R5cGUgcHJvcGVydGllcykuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHsqfSBDbG9uZSBvZiB0aGUgaW5wdXQgYG9iamBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgbGV0IGR1cDtcbiAgICBsZXQgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICAgIGlmICh0eXBlID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAgICAgZHVwID0gbmV3IERhdGUoKTtcbiAgICAgICAgZHVwLnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgICBkdXAgPSBvYmouY29uc3RydWN0b3Iob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgZHVwID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBkdXAucHVzaChjbG9uZShvYmpbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB2YWw7XG4gICAgICAgIGR1cCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gY2xvbmUodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHVwW2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGR1cDtcbn1cbi8qKlxuICogRXhwb3NlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgZnJvbSBvbmUgb2JqZWN0IG9uIGFub3RoZXIuXG4gKlxuICogTWV0aG9kcyB3aWxsIGJlIGNhbGxlZCBvbiBgc291cmNlYCBhbmQgd2lsbCBtYWludGFpbiBgc291cmNlYCBhcyB0aGUgY29udGV4dC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IGRlc3RpbmF0aW9uXG4gKiBAcGFyYW0geyp9IHNvdXJjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhwb3NlKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICBsZXQgcHJvcGVydGllcztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgcHJvcGVydGllcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uW3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VbcF0uYXBwbHkoc291cmNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uW3BdID0gc291cmNlW3BdO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBvdGhlciBvYmplY3RzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gZGVzdGluYXRpb25cbiAqIEBwYXJhbSB7Li4uYW55W119IHNvdXJjZXNcbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb24sIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgZm9yIChsZXQgcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGFuIGBBcnJheWBcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbi8qKlxuICogQ29udmVydHMgYW4gb2JqZWN0IHRvIGFuIGBBcnJheWAgaWYgaXQncyBub3QgYWxyZWFkeS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2FueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShvYmopIHtcbiAgICBpZiAoaXNOb25lKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KG9iaikgPyBvYmogOiBbb2JqXTtcbiAgICB9XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgYSBub24tbnVsbCBvYmplY3RcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgbnVsbCBvciB1bmRlZmluZWRcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vbmUob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iaiA9PT0gbnVsbDtcbn1cbi8qKlxuICogTWVyZ2VzIHByb3BlcnRpZXMgZnJvbSBvdGhlciBvYmplY3RzIGludG8gYSBiYXNlIG9iamVjdC4gUHJvcGVydGllcyB0aGF0XG4gKiByZXNvbHZlIHRvIGB1bmRlZmluZWRgIHdpbGwgbm90IG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9uIHRoZSBiYXNlIG9iamVjdFxuICogdGhhdCBhbHJlYWR5IGV4aXN0LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gYmFzZVxuICogQHBhcmFtIHsuLi5hbnlbXX0gc291cmNlc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShvYmplY3QsIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbZmllbGRdID0gY2xvbmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogTWVyZ2VzIHByb3BlcnRpZXMgZnJvbSBvdGhlciBvYmplY3RzIGludG8gYSBiYXNlIG9iamVjdCwgdHJhdmVyc2luZyBhbmRcbiAqIG1lcmdpbmcgYW55IG9iamVjdHMgdGhhdCBhcmUgZW5jb3VudGVyZWQuXG4gKlxuICogUHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgd2lsbCBub3Qgb3ZlcndyaXRlIHByb3BlcnRpZXMgb24gdGhlXG4gKiBiYXNlIG9iamVjdCB0aGF0IGFscmVhZHkgZXhpc3QuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBiYXNlXG4gKiBAcGFyYW0gey4uLmFueVtdfSBzb3VyY2VzXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNZXJnZShvYmplY3QsIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBvYmplY3RbZmllbGRdO1xuICAgICAgICAgICAgICAgIGxldCBiID0gc291cmNlW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QoYSkgJiYgaXNPYmplY3QoYikgJiYgIWlzQXJyYXkoYSkgJiYgIWlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVlcE1lcmdlKGEsIGIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBjbG9uZShiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gYSBuZXN0ZWQgcGF0aCBvbiBhbiBvYmplY3QuXG4gKlxuICogUmV0dXJucyBhbnkgZmFsc3kgdmFsdWUgZW5jb3VudGVyZWQgd2hpbGUgdHJhdmVyc2luZyB0aGUgcGF0aC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aFxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwR2V0KG9iaiwgcGF0aCkge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgd2hpbGUgKCsraW5kZXggPCBwYXRoLmxlbmd0aCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbcGF0aFtpbmRleF1dO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBTZXRzIGEgdmFsdWUgb24gYW4gb2JqZWN0IGF0IGEgbmVzdGVkIHBhdGguXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBvYmplY3RzIGFsb25nIHRoZSBwYXRoIGlmIG5lY2Vzc2FyeSB0byBhbGxvd1xuICogc2V0dGluZyBhIGRlZXBseSBuZXN0ZWQgdmFsdWUuXG4gKlxuICogUmV0dXJucyBgZmFsc2VgIG9ubHkgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgYWxyZWFkeSBzdHJpY3RseSBlcXVhbCB0byB0aGVcbiAqIHJlcXVlc3RlZCBgdmFsdWVgIGFyZ3VtZW50LiBPdGhlcndpc2UgcmV0dXJucyBgdHJ1ZWAuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufSB3YXMgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkP1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gICAgbGV0IHB0ciA9IG9iajtcbiAgICBsZXQgcHJvcCA9IHBhdGgucG9wKCk7XG4gICAgbGV0IHNlZ21lbnQ7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBzZWdtZW50ID0gcGF0aFtpXTtcbiAgICAgICAgaWYgKHB0cltzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwdHJbc2VnbWVudF0gPSB0eXBlb2Ygc2VnbWVudCA9PT0gJ251bWJlcicgPyBbXSA6IHt9O1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHB0cltzZWdtZW50XTtcbiAgICB9XG4gICAgaWYgKHB0cltwcm9wXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB0cltwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmQgYW4gYXJyYXkgb2YgdmFsdWVzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiBhbiBvYmplY3QuXG4gKlxuICogVGhpcyBpcyBhIHBvbnlmaWxsIGZvciBgT2JqZWN0LnZhbHVlc2AsIHdoaWNoIGlzIHN0aWxsIGV4cGVyaW1lbnRhbC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2FueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0VmFsdWVzKG9iaikge1xuICAgIGlmIChPYmplY3QudmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGsgPT4gb2JqW2tdKTtcbiAgICB9XG59Il19