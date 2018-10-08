"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.every = every;
exports.some = some;
exports.firstResult = firstResult;
/**
 * Like the Lodash _.every function, this function takes an array and a
 * predicate function and returns true or false depending on whether the
 * predicate is true for every item in the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => boolean} predicate
 * @returns {boolean}
 */
function every(array, predicate) {
    let index = -1;
    let length = array.length;
    while (++index < length) {
        if (!predicate(array[index], index)) {
            return false;
        }
    }
    return true;
}
/**
 * Like the Lodash _.some function, this function takes an array and a predicate
 * function and returns true or false depending on whether the predicate is true
 * for any of the items in the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => boolean} predicate
 * @returns {boolean}
 */
function some(array, predicate) {
    let index = -1;
    let length = array.length;
    while (++index < length) {
        if (predicate(array[index], index)) {
            return true;
        }
    }
    return false;
}
/**
 * This function is similar to Array.prototype.find, but it returns the result
 * of calling the value function rather than an item of the array.
 *
 * @export
 * @param {any[]} array
 * @param {(member: any, index: number) => any} valueFn
 * @returns {*} the first result of `valueFn` that returned true or undefined
 */
function firstResult(array, valueFn) {
    let index = -1;
    let length = array.length;
    while (++index < length) {
        let result = valueFn(array[index], index);
        if (result) {
            return result;
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFycmF5cy5qcyJdLCJuYW1lcyI6WyJldmVyeSIsInNvbWUiLCJmaXJzdFJlc3VsdCIsImFycmF5IiwicHJlZGljYXRlIiwiaW5kZXgiLCJsZW5ndGgiLCJ2YWx1ZUZuIiwicmVzdWx0Il0sIm1hcHBpbmdzIjoiOzs7OztRQVVnQkEsSyxHQUFBQSxLO1FBb0JBQyxJLEdBQUFBLEk7UUFtQkFDLFcsR0FBQUEsVztBQWpEaEI7Ozs7Ozs7Ozs7QUFVTyxTQUFTRixLQUFULENBQWVHLEtBQWYsRUFBc0JDLFNBQXRCLEVBQWlDO0FBQ3BDLFFBQUlDLFFBQVEsQ0FBQyxDQUFiO0FBQ0EsUUFBSUMsU0FBU0gsTUFBTUcsTUFBbkI7QUFDQSxXQUFPLEVBQUVELEtBQUYsR0FBVUMsTUFBakIsRUFBeUI7QUFDckIsWUFBSSxDQUFDRixVQUFVRCxNQUFNRSxLQUFOLENBQVYsRUFBd0JBLEtBQXhCLENBQUwsRUFBcUM7QUFDakMsbUJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDRCxXQUFPLElBQVA7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBVU8sU0FBU0osSUFBVCxDQUFjRSxLQUFkLEVBQXFCQyxTQUFyQixFQUFnQztBQUNuQyxRQUFJQyxRQUFRLENBQUMsQ0FBYjtBQUNBLFFBQUlDLFNBQVNILE1BQU1HLE1BQW5CO0FBQ0EsV0FBTyxFQUFFRCxLQUFGLEdBQVVDLE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUlGLFVBQVVELE1BQU1FLEtBQU4sQ0FBVixFQUF3QkEsS0FBeEIsQ0FBSixFQUFvQztBQUNoQyxtQkFBTyxJQUFQO0FBQ0g7QUFDSjtBQUNELFdBQU8sS0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7OztBQVNPLFNBQVNILFdBQVQsQ0FBcUJDLEtBQXJCLEVBQTRCSSxPQUE1QixFQUFxQztBQUN4QyxRQUFJRixRQUFRLENBQUMsQ0FBYjtBQUNBLFFBQUlDLFNBQVNILE1BQU1HLE1BQW5CO0FBQ0EsV0FBTyxFQUFFRCxLQUFGLEdBQVVDLE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUlFLFNBQVNELFFBQVFKLE1BQU1FLEtBQU4sQ0FBUixFQUFzQkEsS0FBdEIsQ0FBYjtBQUNBLFlBQUlHLE1BQUosRUFBWTtBQUNSLG1CQUFPQSxNQUFQO0FBQ0g7QUFDSjtBQUNKIiwiZmlsZSI6ImFycmF5cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTGlrZSB0aGUgTG9kYXNoIF8uZXZlcnkgZnVuY3Rpb24sIHRoaXMgZnVuY3Rpb24gdGFrZXMgYW4gYXJyYXkgYW5kIGFcbiAqIHByZWRpY2F0ZSBmdW5jdGlvbiBhbmQgcmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZVxuICogcHJlZGljYXRlIGlzIHRydWUgZm9yIGV2ZXJ5IGl0ZW0gaW4gdGhlIGFycmF5LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7YW55W119IGFycmF5XG4gKiBAcGFyYW0geyhtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbn0gcHJlZGljYXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV2ZXJ5KGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGlmICghcHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4vKipcbiAqIExpa2UgdGhlIExvZGFzaCBfLnNvbWUgZnVuY3Rpb24sIHRoaXMgZnVuY3Rpb24gdGFrZXMgYW4gYXJyYXkgYW5kIGEgcHJlZGljYXRlXG4gKiBmdW5jdGlvbiBhbmQgcmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBwcmVkaWNhdGUgaXMgdHJ1ZVxuICogZm9yIGFueSBvZiB0aGUgaXRlbXMgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7YW55W119IGFycmF5XG4gKiBAcGFyYW0geyhtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbn0gcHJlZGljYXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHNpbWlsYXIgdG8gQXJyYXkucHJvdG90eXBlLmZpbmQsIGJ1dCBpdCByZXR1cm5zIHRoZSByZXN1bHRcbiAqIG9mIGNhbGxpbmcgdGhlIHZhbHVlIGZ1bmN0aW9uIHJhdGhlciB0aGFuIGFuIGl0ZW0gb2YgdGhlIGFycmF5LlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7YW55W119IGFycmF5XG4gKiBAcGFyYW0geyhtZW1iZXI6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYW55fSB2YWx1ZUZuXG4gKiBAcmV0dXJucyB7Kn0gdGhlIGZpcnN0IHJlc3VsdCBvZiBgdmFsdWVGbmAgdGhhdCByZXR1cm5lZCB0cnVlIG9yIHVuZGVmaW5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3RSZXN1bHQoYXJyYXksIHZhbHVlRm4pIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZUZuKGFycmF5W2luZGV4XSwgaW5kZXgpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==