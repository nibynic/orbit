'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assert = assert;
/**
 * Throw an exception if `test` is not truthy.
 *
 * @export
 * @param {string} description Description of the error thrown
 * @param {boolean} test Value that should be truthy for assertion to pass
 */
function assert(description, test) {
    if (!test) {
        throw new Error('Assertion failed: ' + description);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2VydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQU9PLE0sR0FBQSxNOzs7Ozs7OztBQUFBLFNBQUEsTUFBQSxDQUFBLFdBQUEsRUFBQSxJQUFBLEVBQW1DO0FBQ3RDLFFBQUksQ0FBSixJQUFBLEVBQVc7QUFDUCxjQUFNLElBQUEsS0FBQSxDQUFVLHVCQUFoQixXQUFNLENBQU47QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaHJvdyBhbiBleGNlcHRpb24gaWYgYHRlc3RgIGlzIG5vdCB0cnV0aHkuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIERlc2NyaXB0aW9uIG9mIHRoZSBlcnJvciB0aHJvd25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVzdCBWYWx1ZSB0aGF0IHNob3VsZCBiZSB0cnV0aHkgZm9yIGFzc2VydGlvbiB0byBwYXNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnQoZGVzY3JpcHRpb24sIHRlc3QpIHtcbiAgICBpZiAoIXRlc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3NlcnRpb24gZmFpbGVkOiAnICsgZGVzY3JpcHRpb24pO1xuICAgIH1cbn0iXX0=