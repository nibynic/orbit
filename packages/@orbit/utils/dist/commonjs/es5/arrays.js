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
    var index = -1;
    var length = array.length;
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
    var index = -1;
    var length = array.length;
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
    var index = -1;
    var length = array.length;
    while (++index < length) {
        var result = valueFn(array[index], index);
        if (result) {
            return result;
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFycmF5cy5qcyJdLCJuYW1lcyI6WyJpbmRleCIsImxlbmd0aCIsImFycmF5IiwicHJlZGljYXRlIiwicmVzdWx0IiwidmFsdWVGbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFVTyxLLEdBQUEsSztRQW9CQSxJLEdBQUEsSTtRQW1CQSxXLEdBQUEsVzs7Ozs7Ozs7Ozs7QUF2Q0EsU0FBQSxLQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBaUM7QUFDcEMsUUFBSUEsUUFBUSxDQUFaLENBQUE7QUFDQSxRQUFJQyxTQUFTQyxNQUFiLE1BQUE7QUFDQSxXQUFPLEVBQUEsS0FBQSxHQUFQLE1BQUEsRUFBeUI7QUFDckIsWUFBSSxDQUFDQyxVQUFVRCxNQUFWQyxLQUFVRCxDQUFWQyxFQUFMLEtBQUtBLENBQUwsRUFBcUM7QUFDakMsbUJBQUEsS0FBQTtBQUNIO0FBQ0o7QUFDRCxXQUFBLElBQUE7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBVU8sU0FBQSxJQUFBLENBQUEsS0FBQSxFQUFBLFNBQUEsRUFBZ0M7QUFDbkMsUUFBSUgsUUFBUSxDQUFaLENBQUE7QUFDQSxRQUFJQyxTQUFTQyxNQUFiLE1BQUE7QUFDQSxXQUFPLEVBQUEsS0FBQSxHQUFQLE1BQUEsRUFBeUI7QUFDckIsWUFBSUMsVUFBVUQsTUFBVkMsS0FBVUQsQ0FBVkMsRUFBSixLQUFJQSxDQUFKLEVBQW9DO0FBQ2hDLG1CQUFBLElBQUE7QUFDSDtBQUNKO0FBQ0QsV0FBQSxLQUFBO0FBQ0g7QUFDRDs7Ozs7Ozs7O0FBU08sU0FBQSxXQUFBLENBQUEsS0FBQSxFQUFBLE9BQUEsRUFBcUM7QUFDeEMsUUFBSUgsUUFBUSxDQUFaLENBQUE7QUFDQSxRQUFJQyxTQUFTQyxNQUFiLE1BQUE7QUFDQSxXQUFPLEVBQUEsS0FBQSxHQUFQLE1BQUEsRUFBeUI7QUFDckIsWUFBSUUsU0FBU0MsUUFBUUgsTUFBUkcsS0FBUUgsQ0FBUkcsRUFBYixLQUFhQSxDQUFiO0FBQ0EsWUFBQSxNQUFBLEVBQVk7QUFDUixtQkFBQSxNQUFBO0FBQ0g7QUFDSjtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBMaWtlIHRoZSBMb2Rhc2ggXy5ldmVyeSBmdW5jdGlvbiwgdGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBhbmQgYVxuICogcHJlZGljYXRlIGZ1bmN0aW9uIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlXG4gKiBwcmVkaWNhdGUgaXMgdHJ1ZSBmb3IgZXZlcnkgaXRlbSBpbiB0aGUgYXJyYXkuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHthbnlbXX0gYXJyYXlcbiAqIEBwYXJhbSB7KG1lbWJlcjogYW55LCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFufSBwcmVkaWNhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXZlcnkoYXJyYXksIHByZWRpY2F0ZSkge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogTGlrZSB0aGUgTG9kYXNoIF8uc29tZSBmdW5jdGlvbiwgdGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBhbmQgYSBwcmVkaWNhdGVcbiAqIGZ1bmN0aW9uIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIHByZWRpY2F0ZSBpcyB0cnVlXG4gKiBmb3IgYW55IG9mIHRoZSBpdGVtcyBpbiB0aGUgYXJyYXkuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHthbnlbXX0gYXJyYXlcbiAqIEBwYXJhbSB7KG1lbWJlcjogYW55LCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFufSBwcmVkaWNhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgc2ltaWxhciB0byBBcnJheS5wcm90b3R5cGUuZmluZCwgYnV0IGl0IHJldHVybnMgdGhlIHJlc3VsdFxuICogb2YgY2FsbGluZyB0aGUgdmFsdWUgZnVuY3Rpb24gcmF0aGVyIHRoYW4gYW4gaXRlbSBvZiB0aGUgYXJyYXkuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHthbnlbXX0gYXJyYXlcbiAqIEBwYXJhbSB7KG1lbWJlcjogYW55LCBpbmRleDogbnVtYmVyKSA9PiBhbnl9IHZhbHVlRm5cbiAqIEByZXR1cm5zIHsqfSB0aGUgZmlyc3QgcmVzdWx0IG9mIGB2YWx1ZUZuYCB0aGF0IHJldHVybmVkIHRydWUgb3IgdW5kZWZpbmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdFJlc3VsdChhcnJheSwgdmFsdWVGbikge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlRm4oYXJyYXlbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG59Il19