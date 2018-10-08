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
export function eq(a, b) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVxLmpzIl0sIm5hbWVzIjpbImVxIiwiYSIsImIiLCJ0eXBlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiU3RyaW5nIiwic291cmNlIiwiZ2xvYmFsIiwibXVsdGlsaW5lIiwiaWdub3JlQ2FzZSIsImxlbmd0aCIsImkiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxPQUFPLFNBQVNBLEVBQVQsQ0FBWUMsQ0FBWixFQUFlQyxDQUFmLEVBQWtCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUlELE1BQU1DLENBQVYsRUFBYTtBQUNULGVBQU9ELE1BQU0sQ0FBTixJQUFXLElBQUlBLENBQUosSUFBUyxJQUFJQyxDQUEvQjtBQUNIO0FBQ0Q7QUFDQSxRQUFJRCxLQUFLLElBQUwsSUFBYUMsS0FBSyxJQUF0QixFQUE0QjtBQUN4QixlQUFPRCxNQUFNQyxDQUFiO0FBQ0g7QUFDRCxRQUFJQyxPQUFPQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLENBQS9CLENBQVg7QUFDQSxRQUFJRSxTQUFTQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JMLENBQS9CLENBQWIsRUFBZ0Q7QUFDNUMsZUFBTyxLQUFQO0FBQ0g7QUFDRCxZQUFRQyxJQUFSO0FBQ0ksYUFBSyxpQkFBTDtBQUNJLG1CQUFPRixLQUFLTyxPQUFPTixDQUFQLENBQVo7QUFDSixhQUFLLGlCQUFMO0FBQ0k7QUFDQTtBQUNBLG1CQUFPRCxLQUFLLENBQUNBLENBQU4sR0FBVUMsS0FBSyxDQUFDQSxDQUFoQixHQUFvQkQsS0FBSyxDQUFMLEdBQVMsSUFBSUEsQ0FBSixJQUFTLElBQUlDLENBQXRCLEdBQTBCRCxLQUFLLENBQUNDLENBQTNEO0FBQ0osYUFBSyxlQUFMO0FBQ0EsYUFBSyxrQkFBTDtBQUNJO0FBQ0E7QUFDQTtBQUNBLG1CQUFPLENBQUNELENBQUQsSUFBTSxDQUFDQyxDQUFkO0FBQ0o7QUFDQSxhQUFLLGlCQUFMO0FBQ0ksbUJBQU9ELEVBQUVRLE1BQUYsSUFBWVAsRUFBRU8sTUFBZCxJQUF3QlIsRUFBRVMsTUFBRixJQUFZUixFQUFFUSxNQUF0QyxJQUFnRFQsRUFBRVUsU0FBRixJQUFlVCxFQUFFUyxTQUFqRSxJQUE4RVYsRUFBRVcsVUFBRixJQUFnQlYsRUFBRVUsVUFBdkc7QUFmUjtBQWlCQSxRQUFJLE9BQU9YLENBQVAsSUFBWSxRQUFaLElBQXdCLE9BQU9DLENBQVAsSUFBWSxRQUF4QyxFQUFrRDtBQUM5QyxlQUFPLEtBQVA7QUFDSDtBQUNELFFBQUlDLFNBQVMsZ0JBQWIsRUFBK0I7QUFDM0IsWUFBSUYsRUFBRVksTUFBRixLQUFhWCxFQUFFVyxNQUFuQixFQUEyQjtBQUN2QixtQkFBTyxLQUFQO0FBQ0g7QUFDSjtBQUNELFFBQUlDLENBQUo7QUFDQSxTQUFLQSxDQUFMLElBQVVaLENBQVYsRUFBYTtBQUNULFlBQUlBLEVBQUVhLGNBQUYsQ0FBaUJELENBQWpCLENBQUosRUFBeUI7QUFDckIsZ0JBQUksQ0FBQ2QsR0FBR0MsRUFBRWEsQ0FBRixDQUFILEVBQVNaLEVBQUVZLENBQUYsQ0FBVCxDQUFMLEVBQXFCO0FBQ2pCLHVCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0o7QUFDRCxTQUFLQSxDQUFMLElBQVViLENBQVYsRUFBYTtBQUNULFlBQUlBLEVBQUVjLGNBQUYsQ0FBaUJELENBQWpCLENBQUosRUFBeUI7QUFDckIsZ0JBQUksQ0FBQ2QsR0FBR0MsRUFBRWEsQ0FBRixDQUFILEVBQVNaLEVBQUVZLENBQUYsQ0FBVCxDQUFMLEVBQXFCO0FBQ2pCLHVCQUFPLEtBQVA7QUFDSDtBQUNKO0FBQ0o7QUFDRCxXQUFPLElBQVA7QUFDSCIsImZpbGUiOiJlcS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSwgbm8tZXEtbnVsbCwgdmFsaWQtanNkb2MgKi9cbi8qKlxuICogYGVxYCBjaGVja3MgdGhlIGVxdWFsaXR5IG9mIHR3byBvYmplY3RzLlxuICpcbiAqIFRoZSBwcm9wZXJ0aWVzIGJlbG9uZ2luZyB0byBvYmplY3RzIChidXQgbm90IHRoZWlyIHByb3RvdHlwZXMpIHdpbGwgYmVcbiAqIHRyYXZlcnNlZCBkZWVwbHkgYW5kIGNvbXBhcmVkLlxuICpcbiAqIEluY2x1ZGVzIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBib29sZWFucywgcmVnZXhlcywgYW5kXG4gKiBhcnJheXNcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBgYWAgYW5kIGBiYCBlcXVhbD9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxKGEsIGIpIHtcbiAgICAvLyBTb21lIGVsZW1lbnRzIG9mIHRoaXMgZnVuY3Rpb24gY29tZSBmcm9tIHVuZGVyc2NvcmVcbiAgICAvLyAoYykgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gICAgLy9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvYmxvYi9tYXN0ZXIvdW5kZXJzY29yZS5qc1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICB9XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgIH1cbiAgICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAodHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYjtcbiAgICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICAgICAgcmV0dXJuICthID09ICtiO1xuICAgICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgaW4gYikge1xuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgaWYgKCFlcShhW2ldLCBiW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGkgaW4gYSkge1xuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgaWYgKCFlcShhW2ldLCBiW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn0iXX0=