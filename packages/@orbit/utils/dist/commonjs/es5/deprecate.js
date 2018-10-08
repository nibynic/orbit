'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deprecate = deprecate;
/**
 * Display a deprecation warning with the provided message if the
 * provided `test` evaluates to a falsy value (or is missing).
 *
 * @export
 * @param {string} message Description of the deprecation
 * @param {(boolean | (() => boolean))} test An optional boolean or function that evaluates to a boolean.
 * @returns
 */
function deprecate(message, test) {
    if (typeof test === 'function') {
        if (test()) {
            return;
        }
    } else {
        if (test) {
            return;
        }
    }
    console.warn(message);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlcHJlY2F0ZS5qcyJdLCJuYW1lcyI6WyJjb25zb2xlIl0sIm1hcHBpbmdzIjoiOzs7OztRQVNPLFMsR0FBQSxTOzs7Ozs7Ozs7O0FBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxFQUFBLElBQUEsRUFBa0M7QUFDckMsUUFBSSxPQUFBLElBQUEsS0FBSixVQUFBLEVBQWdDO0FBQzVCLFlBQUEsTUFBQSxFQUFZO0FBQ1I7QUFDSDtBQUhMLEtBQUEsTUFJTztBQUNILFlBQUEsSUFBQSxFQUFVO0FBQ047QUFDSDtBQUNKO0FBQ0RBLFlBQUFBLElBQUFBLENBQUFBLE9BQUFBO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdpdGggdGhlIHByb3ZpZGVkIG1lc3NhZ2UgaWYgdGhlXG4gKiBwcm92aWRlZCBgdGVzdGAgZXZhbHVhdGVzIHRvIGEgZmFsc3kgdmFsdWUgKG9yIGlzIG1pc3NpbmcpLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIERlc2NyaXB0aW9uIG9mIHRoZSBkZXByZWNhdGlvblxuICogQHBhcmFtIHsoYm9vbGVhbiB8ICgoKSA9PiBib29sZWFuKSl9IHRlc3QgQW4gb3B0aW9uYWwgYm9vbGVhbiBvciBmdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyB0byBhIGJvb2xlYW4uXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwcmVjYXRlKG1lc3NhZ2UsIHRlc3QpIHtcbiAgICBpZiAodHlwZW9mIHRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKHRlc3QoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG59Il19