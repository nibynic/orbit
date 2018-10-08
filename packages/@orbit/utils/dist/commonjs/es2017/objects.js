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
    let dup;
    let type = Object.prototype.toString.call(obj);
    if (type === '[object Date]') {
        dup = new Date();
        dup.setTime(obj.getTime());
    } else if (type === '[object RegExp]') {
        dup = obj.constructor(obj);
    } else if (type === '[object Array]') {
        dup = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            if (obj.hasOwnProperty(i)) {
                dup.push(clone(obj[i]));
            }
        }
    } else {
        let val;
        dup = {};
        for (let key in obj) {
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
    let properties;
    if (arguments.length > 2) {
        properties = Array.prototype.slice.call(arguments, 2);
    } else {
        properties = Object.keys(source);
    }
    properties.forEach(p => {
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
function extend(destination, ...sources) {
    sources.forEach(source => {
        for (let p in source) {
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
function merge(object, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(field => {
            if (source.hasOwnProperty(field)) {
                let value = source[field];
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
function deepMerge(object, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(field => {
            if (source.hasOwnProperty(field)) {
                let a = object[field];
                let b = source[field];
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
    let index = -1;
    let result = obj;
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
    let ptr = obj;
    let prop = path.pop();
    let segment;
    for (let i = 0, l = path.length; i < l; i++) {
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
        return Object.keys(obj).map(k => obj[k]);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdHMuanMiXSwibmFtZXMiOlsiY2xvbmUiLCJleHBvc2UiLCJleHRlbmQiLCJpc0FycmF5IiwidG9BcnJheSIsImlzT2JqZWN0IiwiaXNOb25lIiwibWVyZ2UiLCJkZWVwTWVyZ2UiLCJkZWVwR2V0IiwiZGVlcFNldCIsIm9iamVjdFZhbHVlcyIsIm9iaiIsInVuZGVmaW5lZCIsImR1cCIsInR5cGUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJEYXRlIiwic2V0VGltZSIsImdldFRpbWUiLCJjb25zdHJ1Y3RvciIsImkiLCJsZW4iLCJsZW5ndGgiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJ2YWwiLCJrZXkiLCJkZXN0aW5hdGlvbiIsInNvdXJjZSIsInByb3BlcnRpZXMiLCJhcmd1bWVudHMiLCJBcnJheSIsInNsaWNlIiwia2V5cyIsImZvckVhY2giLCJwIiwiYXBwbHkiLCJzb3VyY2VzIiwib2JqZWN0IiwiZmllbGQiLCJ2YWx1ZSIsImEiLCJiIiwicGF0aCIsImluZGV4IiwicmVzdWx0IiwicHRyIiwicHJvcCIsInBvcCIsInNlZ21lbnQiLCJsIiwidmFsdWVzIiwibWFwIiwiayJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFXZ0JBLEssR0FBQUEsSztRQTBDQUMsTSxHQUFBQSxNO1FBeUJBQyxNLEdBQUFBLE07UUFpQkFDLE8sR0FBQUEsTztRQVVBQyxPLEdBQUFBLE87UUFjQUMsUSxHQUFBQSxRO1FBVUFDLE0sR0FBQUEsTTtRQWFBQyxLLEdBQUFBLEs7UUF5QkFDLFMsR0FBQUEsUztRQTBCQUMsTyxHQUFBQSxPO1FBMEJBQyxPLEdBQUFBLE87UUEyQkFDLFksR0FBQUEsWTtBQXRQaEI7QUFDQTs7Ozs7Ozs7OztBQVVPLFNBQVNYLEtBQVQsQ0FBZVksR0FBZixFQUFvQjtBQUN2QixRQUFJQSxRQUFRQyxTQUFSLElBQXFCRCxRQUFRLElBQTdCLElBQXFDLE9BQU9BLEdBQVAsS0FBZSxRQUF4RCxFQUFrRTtBQUM5RCxl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QUFLdkIsQ0FBTCxDQUFWO0FBQ0EsWUFBSTBCLElBQUlHLE9BQUosTUFBaUJ4QyxTQUFyQixFQUFnQztBQUM1QnFDLGdCQUFJRyxPQUFKLElBQWUsT0FBT0EsT0FBUCxLQUFtQixRQUFuQixHQUE4QixFQUE5QixHQUFtQyxFQUFsRDtBQUNIO0FBQ0RILGNBQU1BLElBQUlHLE9BQUosQ0FBTjtBQUNIO0FBQ0QsUUFBSUgsSUFBSUMsSUFBSixNQUFjUCxLQUFsQixFQUF5QjtBQUNyQixlQUFPLEtBQVA7QUFDSCxLQUZELE1BRU87QUFDSE0sWUFBSUMsSUFBSixJQUFZUCxLQUFaO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7QUFDSjtBQUNEOzs7Ozs7Ozs7QUFTTyxTQUFTakMsWUFBVCxDQUFzQkMsR0FBdEIsRUFBMkI7QUFDOUIsUUFBSUksT0FBT3VDLE1BQVgsRUFBbUI7QUFDZixlQUFPdkMsT0FBT3VDLE1BQVAsQ0FBYzNDLEdBQWQsQ0FBUDtBQUNILEtBRkQsTUFFTztBQUNILGVBQU9JLE9BQU9xQixJQUFQLENBQVl6QixHQUFaLEVBQWlCNEMsR0FBakIsQ0FBcUJDLEtBQUs3QyxJQUFJNkMsQ0FBSixDQUExQixDQUFQO0FBQ0g7QUFDSiIsImZpbGUiOiJvYmplY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cbi8qKlxuICogQ2xvbmVzIGEgdmFsdWUuIElmIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3QsIGEgZGVlcGx5IG5lc3RlZCBjbG9uZSB3aWxsIGJlXG4gKiBjcmVhdGVkLlxuICpcbiAqIFRyYXZlcnNlcyBhbGwgb2JqZWN0IHByb3BlcnRpZXMgKGJ1dCBub3QgcHJvdG90eXBlIHByb3BlcnRpZXMpLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJucyB7Kn0gQ2xvbmUgb2YgdGhlIGlucHV0IGBvYmpgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGxldCBkdXA7XG4gICAgbGV0IHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgRGF0ZV0nKSB7XG4gICAgICAgIGR1cCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGR1cC5zZXRUaW1lKG9iai5nZXRUaW1lKCkpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgICAgZHVwID0gb2JqLmNvbnN0cnVjdG9yKG9iaik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIGR1cCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgZHVwLnB1c2goY2xvbmUob2JqW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdmFsO1xuICAgICAgICBkdXAgPSB7fTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gb2JqW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IGNsb25lKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGR1cFtrZXldID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkdXA7XG59XG4vKipcbiAqIEV4cG9zZSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGZyb20gb25lIG9iamVjdCBvbiBhbm90aGVyLlxuICpcbiAqIE1ldGhvZHMgd2lsbCBiZSBjYWxsZWQgb24gYHNvdXJjZWAgYW5kIHdpbGwgbWFpbnRhaW4gYHNvdXJjZWAgYXMgdGhlIGNvbnRleHQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBkZXN0aW5hdGlvblxuICogQHBhcmFtIHsqfSBzb3VyY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZShkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gICAgbGV0IHByb3BlcnRpZXM7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgIHByb3BlcnRpZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlW3BdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltwXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlW3BdLmFwcGx5KHNvdXJjZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltwXSA9IHNvdXJjZVtwXTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyoqXG4gKiBFeHRlbmQgYW4gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgb3RoZXIgb2JqZWN0cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IGRlc3RpbmF0aW9uXG4gKiBAcGFyYW0gey4uLmFueVtdfSBzb3VyY2VzXG4gKiBAcmV0dXJucyB7YW55fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCAuLi5zb3VyY2VzKSB7XG4gICAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG4gICAgICAgIGZvciAobGV0IHAgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25bcF0gPSBzb3VyY2VbcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVzdGluYXRpb247XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhbiBgQXJyYXlgXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG4vKipcbiAqIENvbnZlcnRzIGFuIG9iamVjdCB0byBhbiBgQXJyYXlgIGlmIGl0J3Mgbm90IGFscmVhZHkuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHthbnlbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XG4gICAgaWYgKGlzTm9uZShvYmopKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXNBcnJheShvYmopID8gb2JqIDogW29ial07XG4gICAgfVxufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIHZhbHVlIGlzIGEgbm9uLW51bGwgb2JqZWN0XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jztcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIG51bGwgb3IgdW5kZWZpbmVkXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOb25lKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCB8fCBvYmogPT09IG51bGw7XG59XG4vKipcbiAqIE1lcmdlcyBwcm9wZXJ0aWVzIGZyb20gb3RoZXIgb2JqZWN0cyBpbnRvIGEgYmFzZSBvYmplY3QuIFByb3BlcnRpZXMgdGhhdFxuICogcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCB3aWxsIG5vdCBvdmVyd3JpdGUgcHJvcGVydGllcyBvbiB0aGUgYmFzZSBvYmplY3RcbiAqIHRoYXQgYWxyZWFkeSBleGlzdC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IGJhc2VcbiAqIEBwYXJhbSB7Li4uYW55W119IHNvdXJjZXNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2Uob2JqZWN0LCAuLi5zb3VyY2VzKSB7XG4gICAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNvdXJjZVtmaWVsZF07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W2ZpZWxkXSA9IGNsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIE1lcmdlcyBwcm9wZXJ0aWVzIGZyb20gb3RoZXIgb2JqZWN0cyBpbnRvIGEgYmFzZSBvYmplY3QsIHRyYXZlcnNpbmcgYW5kXG4gKiBtZXJnaW5nIGFueSBvYmplY3RzIHRoYXQgYXJlIGVuY291bnRlcmVkLlxuICpcbiAqIFByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIHdpbGwgbm90IG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9uIHRoZVxuICogYmFzZSBvYmplY3QgdGhhdCBhbHJlYWR5IGV4aXN0LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gYmFzZVxuICogQHBhcmFtIHsuLi5hbnlbXX0gc291cmNlc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwTWVyZ2Uob2JqZWN0LCAuLi5zb3VyY2VzKSB7XG4gICAgc291cmNlcy5mb3JFYWNoKHNvdXJjZSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgICAgICAgICAgICAgIGxldCBhID0gb2JqZWN0W2ZpZWxkXTtcbiAgICAgICAgICAgICAgICBsZXQgYiA9IHNvdXJjZVtmaWVsZF07XG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGEpICYmIGlzT2JqZWN0KGIpICYmICFpc0FycmF5KGEpICYmICFpc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZXBNZXJnZShhLCBiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbZmllbGRdID0gY2xvbmUoYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIGEgbmVzdGVkIHBhdGggb24gYW4gb2JqZWN0LlxuICpcbiAqIFJldHVybnMgYW55IGZhbHN5IHZhbHVlIGVuY291bnRlcmVkIHdoaWxlIHRyYXZlcnNpbmcgdGhlIHBhdGguXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEdldChvYmosIHBhdGgpIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgcmVzdWx0ID0gb2JqO1xuICAgIHdoaWxlICgrK2luZGV4IDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3BhdGhbaW5kZXhdXTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogU2V0cyBhIHZhbHVlIG9uIGFuIG9iamVjdCBhdCBhIG5lc3RlZCBwYXRoLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBjcmVhdGUgb2JqZWN0cyBhbG9uZyB0aGUgcGF0aCBpZiBuZWNlc3NhcnkgdG8gYWxsb3dcbiAqIHNldHRpbmcgYSBkZWVwbHkgbmVzdGVkIHZhbHVlLlxuICpcbiAqIFJldHVybnMgYGZhbHNlYCBvbmx5IGlmIHRoZSBjdXJyZW50IHZhbHVlIGlzIGFscmVhZHkgc3RyaWN0bHkgZXF1YWwgdG8gdGhlXG4gKiByZXF1ZXN0ZWQgYHZhbHVlYCBhcmd1bWVudC4gT3RoZXJ3aXNlIHJldHVybnMgYHRydWVgLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gd2FzIHRoZSB2YWx1ZSB3YXMgYWN0dWFsbHkgY2hhbmdlZD9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBTZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICAgIGxldCBwdHIgPSBvYmo7XG4gICAgbGV0IHByb3AgPSBwYXRoLnBvcCgpO1xuICAgIGxldCBzZWdtZW50O1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgc2VnbWVudCA9IHBhdGhbaV07XG4gICAgICAgIGlmIChwdHJbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHRyW3NlZ21lbnRdID0gdHlwZW9mIHNlZ21lbnQgPT09ICdudW1iZXInID8gW10gOiB7fTtcbiAgICAgICAgfVxuICAgICAgICBwdHIgPSBwdHJbc2VnbWVudF07XG4gICAgfVxuICAgIGlmIChwdHJbcHJvcF0gPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwdHJbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuLyoqXG4gKiBGaW5kIGFuIGFycmF5IG9mIHZhbHVlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgYW4gb2JqZWN0LlxuICpcbiAqIFRoaXMgaXMgYSBwb255ZmlsbCBmb3IgYE9iamVjdC52YWx1ZXNgLCB3aGljaCBpcyBzdGlsbCBleHBlcmltZW50YWwuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm5zIHthbnlbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdFZhbHVlcyhvYmopIHtcbiAgICBpZiAoT2JqZWN0LnZhbHVlcykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChrID0+IG9ialtrXSk7XG4gICAgfVxufSJdfQ==