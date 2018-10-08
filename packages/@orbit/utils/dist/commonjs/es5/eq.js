'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eq = eq;
/* eslint-disable eqeqeq, no-eq-null, valid-jsdoc */
/**
 * `eq` checks the equality of two objects.
 *
 * The properties belonging to objects (but not their prototypes) will be
 * traversed deeply and compared.
 *
 * Includes special handling for strings, numbers, dates, booleans, regexes, and
 * arrays
 *
 * @export
 * @param {*} a
 * @param {*} b
 * @returns {boolean} are `a` and `b` equal?
 */
function eq(a, b) {
    // Some elements of this function come from underscore
    // (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    //
    // https://github.com/jashkenas/underscore/blob/master/underscore.js
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) {
        return a !== 0 || 1 / a == 1 / b;
    }
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) {
        return a === b;
    }
    var type = Object.prototype.toString.call(a);
    if (type !== Object.prototype.toString.call(b)) {
        return false;
    }
    switch (type) {
        case '[object String]':
            return a == String(b);
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
            // other numeric values.
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') {
        return false;
    }
    if (type === '[object Array]') {
        if (a.length !== b.length) {
            return false;
        }
    }
    var i;
    for (i in b) {
        if (b.hasOwnProperty(i)) {
            if (!eq(a[i], b[i])) {
                return false;
            }
        }
    }
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            if (!eq(a[i], b[i])) {
                return false;
            }
        }
    }
    return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVxLmpzIl0sIm5hbWVzIjpbImEiLCJiIiwidHlwZSIsIk9iamVjdCIsIlN0cmluZyIsImVxIl0sIm1hcHBpbmdzIjoiOzs7OztRQWVPLEUsR0FBQSxFOztBQWRQOzs7Ozs7Ozs7Ozs7OztBQWNPLFNBQUEsRUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQWtCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUlBLE1BQUosQ0FBQSxFQUFhO0FBQ1QsZUFBT0EsTUFBQUEsQ0FBQUEsSUFBVyxJQUFBLENBQUEsSUFBUyxJQUEzQixDQUFBO0FBQ0g7QUFDRDtBQUNBLFFBQUlBLEtBQUFBLElBQUFBLElBQWFDLEtBQWpCLElBQUEsRUFBNEI7QUFDeEIsZUFBT0QsTUFBUCxDQUFBO0FBQ0g7QUFDRCxRQUFJRSxPQUFPQyxPQUFBQSxTQUFBQSxDQUFBQSxRQUFBQSxDQUFBQSxJQUFBQSxDQUFYLENBQVdBLENBQVg7QUFDQSxRQUFJRCxTQUFTQyxPQUFBQSxTQUFBQSxDQUFBQSxRQUFBQSxDQUFBQSxJQUFBQSxDQUFiLENBQWFBLENBQWIsRUFBZ0Q7QUFDNUMsZUFBQSxLQUFBO0FBQ0g7QUFDRCxZQUFBLElBQUE7QUFDSSxhQUFBLGlCQUFBO0FBQ0ksbUJBQU9ILEtBQUtJLE9BQVosQ0FBWUEsQ0FBWjtBQUNKLGFBQUEsaUJBQUE7QUFDSTtBQUNBO0FBQ0EsbUJBQU9KLEtBQUssQ0FBTEEsQ0FBQUEsR0FBVUMsS0FBSyxDQUFmRCxDQUFBQSxHQUFvQkEsS0FBQUEsQ0FBQUEsR0FBUyxJQUFBLENBQUEsSUFBUyxJQUFsQkEsQ0FBQUEsR0FBMEJBLEtBQUssQ0FBMUQsQ0FBQTtBQUNKLGFBQUEsZUFBQTtBQUNBLGFBQUEsa0JBQUE7QUFDSTtBQUNBO0FBQ0E7QUFDQSxtQkFBTyxDQUFBLENBQUEsSUFBTSxDQUFiLENBQUE7QUFDSjtBQUNBLGFBQUEsaUJBQUE7QUFDSSxtQkFBT0EsRUFBQUEsTUFBQUEsSUFBWUMsRUFBWkQsTUFBQUEsSUFBd0JBLEVBQUFBLE1BQUFBLElBQVlDLEVBQXBDRCxNQUFBQSxJQUFnREEsRUFBQUEsU0FBQUEsSUFBZUMsRUFBL0RELFNBQUFBLElBQThFQSxFQUFBQSxVQUFBQSxJQUFnQkMsRUFBckcsVUFBQTtBQWZSO0FBaUJBLFFBQUksT0FBQSxDQUFBLElBQUEsUUFBQSxJQUF3QixPQUFBLENBQUEsSUFBNUIsUUFBQSxFQUFrRDtBQUM5QyxlQUFBLEtBQUE7QUFDSDtBQUNELFFBQUlDLFNBQUosZ0JBQUEsRUFBK0I7QUFDM0IsWUFBSUYsRUFBQUEsTUFBQUEsS0FBYUMsRUFBakIsTUFBQSxFQUEyQjtBQUN2QixtQkFBQSxLQUFBO0FBQ0g7QUFDSjtBQUNELFFBQUEsQ0FBQTtBQUNBLFNBQUEsQ0FBQSxJQUFBLENBQUEsRUFBYTtBQUNULFlBQUlBLEVBQUFBLGNBQUFBLENBQUosQ0FBSUEsQ0FBSixFQUF5QjtBQUNyQixnQkFBSSxDQUFDSSxHQUFHTCxFQUFISyxDQUFHTCxDQUFISyxFQUFTSixFQUFkLENBQWNBLENBQVRJLENBQUwsRUFBcUI7QUFDakIsdUJBQUEsS0FBQTtBQUNIO0FBQ0o7QUFDSjtBQUNELFNBQUEsQ0FBQSxJQUFBLENBQUEsRUFBYTtBQUNULFlBQUlMLEVBQUFBLGNBQUFBLENBQUosQ0FBSUEsQ0FBSixFQUF5QjtBQUNyQixnQkFBSSxDQUFDSyxHQUFHTCxFQUFISyxDQUFHTCxDQUFISyxFQUFTSixFQUFkLENBQWNBLENBQVRJLENBQUwsRUFBcUI7QUFDakIsdUJBQUEsS0FBQTtBQUNIO0FBQ0o7QUFDSjtBQUNELFdBQUEsSUFBQTtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgZXFlcWVxLCBuby1lcS1udWxsLCB2YWxpZC1qc2RvYyAqL1xuLyoqXG4gKiBgZXFgIGNoZWNrcyB0aGUgZXF1YWxpdHkgb2YgdHdvIG9iamVjdHMuXG4gKlxuICogVGhlIHByb3BlcnRpZXMgYmVsb25naW5nIHRvIG9iamVjdHMgKGJ1dCBub3QgdGhlaXIgcHJvdG90eXBlcykgd2lsbCBiZVxuICogdHJhdmVyc2VkIGRlZXBseSBhbmQgY29tcGFyZWQuXG4gKlxuICogSW5jbHVkZXMgc3BlY2lhbCBoYW5kbGluZyBmb3Igc3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGJvb2xlYW5zLCByZWdleGVzLCBhbmRcbiAqIGFycmF5c1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGBhYCBhbmQgYGJgIGVxdWFsP1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXEoYSwgYikge1xuICAgIC8vIFNvbWUgZWxlbWVudHMgb2YgdGhpcyBmdW5jdGlvbiBjb21lIGZyb20gdW5kZXJzY29yZVxuICAgIC8vIChjKSAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAgICAvL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9ibG9iL21hc3Rlci91bmRlcnNjb3JlLmpzXG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIH1cbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgfVxuICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmICh0eXBlICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcbiAgICAgICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiO1xuICAgICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiYgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiYgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiYgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBpO1xuICAgIGZvciAoaSBpbiBiKSB7XG4gICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBpZiAoIWVxKGFbaV0sIGJbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoaSBpbiBhKSB7XG4gICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBpZiAoIWVxKGFbaV0sIGJbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufSJdfQ==