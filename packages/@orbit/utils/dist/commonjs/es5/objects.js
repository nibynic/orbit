'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clone = clone;
exports.expose = expose;
exports.extend = extend;
exports.isArray = isArray;
exports.toArray = toArray;
exports.isObject = isObject;
exports.isNone = isNone;
exports.merge = merge;
exports.deepMerge = deepMerge;
exports.deepGet = deepGet;
exports.deepSet = deepSet;
exports.objectValues = objectValues;
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
function clone(obj) {
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
function expose(destination, source) {
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
function extend(destination) {
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
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * Converts an object to an `Array` if it's not already.
 *
 * @export
 * @param {*} obj
 * @returns {any[]}
 */
function toArray(obj) {
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
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
/**
 * Checks whether an object is null or undefined
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
function isNone(obj) {
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
function merge(object) {
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
function deepMerge(object) {
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
function deepGet(obj, path) {
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
function deepSet(obj, path, value) {
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
function objectValues(obj) {
    if (Object.values) {
        return Object.values(obj);
    } else {
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdHMuanMiXSwibmFtZXMiOlsib2JqIiwiZHVwIiwidHlwZSIsIk9iamVjdCIsImkiLCJsZW4iLCJjbG9uZSIsInZhbCIsInByb3BlcnRpZXMiLCJhcmd1bWVudHMiLCJBcnJheSIsInNvdXJjZSIsImRlc3RpbmF0aW9uIiwic291cmNlcyIsImlzTm9uZSIsImlzQXJyYXkiLCJ2YWx1ZSIsIm9iamVjdCIsImEiLCJiIiwiaXNPYmplY3QiLCJkZWVwTWVyZ2UiLCJpbmRleCIsInJlc3VsdCIsInBhdGgiLCJwdHIiLCJwcm9wIiwic2VnbWVudCIsImwiXSwibWFwcGluZ3MiOiI7Ozs7O1FBV08sSyxHQUFBLEs7UUEwQ0EsTSxHQUFBLE07UUF5QkEsTSxHQUFBLE07UUFpQkEsTyxHQUFBLE87UUFVQSxPLEdBQUEsTztRQWNBLFEsR0FBQSxRO1FBVUEsTSxHQUFBLE07UUFhQSxLLEdBQUEsSztRQXlCQSxTLEdBQUEsUztRQTBCQSxPLEdBQUEsTztRQTBCQSxPLEdBQUEsTztRQTJCQSxZLEdBQUEsWTs7QUFyUFA7Ozs7Ozs7Ozs7QUFVTyxTQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQW9CO0FBQ3ZCLFFBQUlBLFFBQUFBLFNBQUFBLElBQXFCQSxRQUFyQkEsSUFBQUEsSUFBcUMsT0FBQSxHQUFBLEtBQXpDLFFBQUEsRUFBa0U7QUFDOUQsZUFBQSxHQUFBO0FBQ0g7QUFDRCxRQUFJQyxNQUFBQSxLQUFKLENBQUE7QUFDQSxRQUFJQyxPQUFPQyxPQUFBQSxTQUFBQSxDQUFBQSxRQUFBQSxDQUFBQSxJQUFBQSxDQUFYLEdBQVdBLENBQVg7QUFDQSxRQUFJRCxTQUFKLGVBQUEsRUFBOEI7QUFDMUJELGNBQU0sSUFBTkEsSUFBTSxFQUFOQTtBQUNBQSxZQUFBQSxPQUFBQSxDQUFZRCxJQUFaQyxPQUFZRCxFQUFaQztBQUZKLEtBQUEsTUFHTyxJQUFJQyxTQUFKLGlCQUFBLEVBQWdDO0FBQ25DRCxjQUFNRCxJQUFBQSxXQUFBQSxDQUFOQyxHQUFNRCxDQUFOQztBQURH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QUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBbUM7QUFDdEMsUUFBSUUsTUFBSixHQUFBO0FBQ0EsUUFBSUMsT0FBT0YsS0FBWCxHQUFXQSxFQUFYO0FBQ0EsUUFBSUcsVUFBQUEsS0FBSixDQUFBO0FBQ0EsU0FBSyxJQUFJdkIsSUFBSixDQUFBLEVBQVd3QixJQUFJSixLQUFwQixNQUFBLEVBQWlDcEIsSUFBakMsQ0FBQSxFQUFBLEdBQUEsRUFBNkM7QUFDekN1QixrQkFBVUgsS0FBVkcsQ0FBVUgsQ0FBVkc7QUFDQSxZQUFJRixJQUFBQSxPQUFBQSxNQUFKLFNBQUEsRUFBZ0M7QUFDNUJBLGdCQUFBQSxPQUFBQSxJQUFlLE9BQUEsT0FBQSxLQUFBLFFBQUEsR0FBQSxFQUFBLEdBQWZBLEVBQUFBO0FBQ0g7QUFDREEsY0FBTUEsSUFBTkEsT0FBTUEsQ0FBTkE7QUFDSDtBQUNELFFBQUlBLElBQUFBLElBQUFBLE1BQUosS0FBQSxFQUF5QjtBQUNyQixlQUFBLEtBQUE7QUFESixLQUFBLE1BRU87QUFDSEEsWUFBQUEsSUFBQUEsSUFBQUEsS0FBQUE7QUFDQSxlQUFBLElBQUE7QUFDSDtBQUNKO0FBQ0Q7Ozs7Ozs7OztBQVNPLFNBQUEsWUFBQSxDQUFBLEdBQUEsRUFBMkI7QUFDOUIsUUFBSXRCLE9BQUosTUFBQSxFQUFtQjtBQUNmLGVBQU9BLE9BQUFBLE1BQUFBLENBQVAsR0FBT0EsQ0FBUDtBQURKLEtBQUEsTUFFTztBQUNILGVBQU8sT0FBQSxJQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsQ0FBcUIsVUFBQSxDQUFBLEVBQUE7QUFBQSxtQkFBS0gsSUFBTCxDQUFLQSxDQUFMO0FBQTVCLFNBQU8sQ0FBUDtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuLyoqXG4gKiBDbG9uZXMgYSB2YWx1ZS4gSWYgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCwgYSBkZWVwbHkgbmVzdGVkIGNsb25lIHdpbGwgYmVcbiAqIGNyZWF0ZWQuXG4gKlxuICogVHJhdmVyc2VzIGFsbCBvYmplY3QgcHJvcGVydGllcyAoYnV0IG5vdCBwcm90b3R5cGUgcHJvcGVydGllcykuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHsqfSBDbG9uZSBvZiB0aGUgaW5wdXQgYG9iamBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgbGV0IGR1cDtcbiAgICBsZXQgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICAgIGlmICh0eXBlID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAgICAgZHVwID0gbmV3IERhdGUoKTtcbiAgICAgICAgZHVwLnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgICBkdXAgPSBvYmouY29uc3RydWN0b3Iob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgZHVwID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBkdXAucHVzaChjbG9uZShvYmpbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB2YWw7XG4gICAgICAgIGR1cCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gY2xvbmUodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHVwW2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGR1cDtcbn1cbi8qKlxuICogRXhwb3NlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgZnJvbSBvbmUgb2JqZWN0IG9uIGFub3RoZXIuXG4gKlxuICogTWV0aG9kcyB3aWxsIGJlIGNhbGxlZCBvbiBgc291cmNlYCBhbmQgd2lsbCBtYWludGFpbiBgc291cmNlYCBhcyB0aGUgY29udGV4dC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IGRlc3RpbmF0aW9uXG4gKiBAcGFyYW0geyp9IHNvdXJjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhwb3NlKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICBsZXQgcHJvcGVydGllcztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgcHJvcGVydGllcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VbcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uW3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VbcF0uYXBwbHkoc291cmNlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uW3BdID0gc291cmNlW3BdO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBvdGhlciBvYmplY3RzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gZGVzdGluYXRpb25cbiAqIEBwYXJhbSB7Li4uYW55W119IHNvdXJjZXNcbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb24sIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgZm9yIChsZXQgcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGFuIGBBcnJheWBcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbi8qKlxuICogQ29udmVydHMgYW4gb2JqZWN0IHRvIGFuIGBBcnJheWAgaWYgaXQncyBub3QgYWxyZWFkeS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2FueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShvYmopIHtcbiAgICBpZiAoaXNOb25lKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KG9iaikgPyBvYmogOiBbb2JqXTtcbiAgICB9XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgYSBub24tbnVsbCBvYmplY3RcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgbnVsbCBvciB1bmRlZmluZWRcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vbmUob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iaiA9PT0gbnVsbDtcbn1cbi8qKlxuICogTWVyZ2VzIHByb3BlcnRpZXMgZnJvbSBvdGhlciBvYmplY3RzIGludG8gYSBiYXNlIG9iamVjdC4gUHJvcGVydGllcyB0aGF0XG4gKiByZXNvbHZlIHRvIGB1bmRlZmluZWRgIHdpbGwgbm90IG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9uIHRoZSBiYXNlIG9iamVjdFxuICogdGhhdCBhbHJlYWR5IGV4aXN0LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gYmFzZVxuICogQHBhcmFtIHsuLi5hbnlbXX0gc291cmNlc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShvYmplY3QsIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbZmllbGRdID0gY2xvbmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogTWVyZ2VzIHByb3BlcnRpZXMgZnJvbSBvdGhlciBvYmplY3RzIGludG8gYSBiYXNlIG9iamVjdCwgdHJhdmVyc2luZyBhbmRcbiAqIG1lcmdpbmcgYW55IG9iamVjdHMgdGhhdCBhcmUgZW5jb3VudGVyZWQuXG4gKlxuICogUHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgd2lsbCBub3Qgb3ZlcndyaXRlIHByb3BlcnRpZXMgb24gdGhlXG4gKiBiYXNlIG9iamVjdCB0aGF0IGFscmVhZHkgZXhpc3QuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBiYXNlXG4gKiBAcGFyYW0gey4uLmFueVtdfSBzb3VyY2VzXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNZXJnZShvYmplY3QsIC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzLmZvckVhY2goc291cmNlID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBvYmplY3RbZmllbGRdO1xuICAgICAgICAgICAgICAgIGxldCBiID0gc291cmNlW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QoYSkgJiYgaXNPYmplY3QoYikgJiYgIWlzQXJyYXkoYSkgJiYgIWlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVlcE1lcmdlKGEsIGIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBjbG9uZShiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gYSBuZXN0ZWQgcGF0aCBvbiBhbiBvYmplY3QuXG4gKlxuICogUmV0dXJucyBhbnkgZmFsc3kgdmFsdWUgZW5jb3VudGVyZWQgd2hpbGUgdHJhdmVyc2luZyB0aGUgcGF0aC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aFxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwR2V0KG9iaiwgcGF0aCkge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgd2hpbGUgKCsraW5kZXggPCBwYXRoLmxlbmd0aCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbcGF0aFtpbmRleF1dO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBTZXRzIGEgdmFsdWUgb24gYW4gb2JqZWN0IGF0IGEgbmVzdGVkIHBhdGguXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGNyZWF0ZSBvYmplY3RzIGFsb25nIHRoZSBwYXRoIGlmIG5lY2Vzc2FyeSB0byBhbGxvd1xuICogc2V0dGluZyBhIGRlZXBseSBuZXN0ZWQgdmFsdWUuXG4gKlxuICogUmV0dXJucyBgZmFsc2VgIG9ubHkgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgYWxyZWFkeSBzdHJpY3RseSBlcXVhbCB0byB0aGVcbiAqIHJlcXVlc3RlZCBgdmFsdWVgIGFyZ3VtZW50LiBPdGhlcndpc2UgcmV0dXJucyBgdHJ1ZWAuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufSB3YXMgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkP1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gICAgbGV0IHB0ciA9IG9iajtcbiAgICBsZXQgcHJvcCA9IHBhdGgucG9wKCk7XG4gICAgbGV0IHNlZ21lbnQ7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBzZWdtZW50ID0gcGF0aFtpXTtcbiAgICAgICAgaWYgKHB0cltzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwdHJbc2VnbWVudF0gPSB0eXBlb2Ygc2VnbWVudCA9PT0gJ251bWJlcicgPyBbXSA6IHt9O1xuICAgICAgICB9XG4gICAgICAgIHB0ciA9IHB0cltzZWdtZW50XTtcbiAgICB9XG4gICAgaWYgKHB0cltwcm9wXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHB0cltwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmQgYW4gYXJyYXkgb2YgdmFsdWVzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiBhbiBvYmplY3QuXG4gKlxuICogVGhpcyBpcyBhIHBvbnlmaWxsIGZvciBgT2JqZWN0LnZhbHVlc2AsIHdoaWNoIGlzIHN0aWxsIGV4cGVyaW1lbnRhbC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybnMge2FueVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0VmFsdWVzKG9iaikge1xuICAgIGlmIChPYmplY3QudmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGsgPT4gb2JqW2tdKTtcbiAgICB9XG59Il19