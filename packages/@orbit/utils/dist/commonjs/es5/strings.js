'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.capitalize = capitalize;
exports.camelize = camelize;
exports.decamelize = decamelize;
exports.dasherize = dasherize;
exports.underscore = underscore;
/**
 * Uppercase the first letter of a string, but don't change the remainder.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Convert underscored, dasherized, or space-delimited words into
 * lowerCamelCase.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function camelize(str) {
    return str.replace(/(\-|\_|\.|\s)+(.)?/g, function (match, separator, chr) {
        return chr ? chr.toUpperCase() : '';
    }).replace(/(^|\/)([A-Z])/g, function (match) {
        return match.toLowerCase();
    });
}
/**
 * Converts a camelized string into all lowercase separated by underscores.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function decamelize(str) {
    return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
}
/**
 * Dasherize words that are underscored, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function dasherize(str) {
    return decamelize(str).replace(/[ _]/g, '-');
}
/**
 * Underscore words that are dasherized, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function underscore(str) {
    return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-|\s+/g, '_').toLowerCase();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ3MuanMiXSwibmFtZXMiOlsic3RyIiwiY2hyIiwibWF0Y2giLCJkZWNhbWVsaXplIl0sIm1hcHBpbmdzIjoiOzs7OztRQU9PLFUsR0FBQSxVO1FBV0EsUSxHQUFBLFE7UUFjQSxVLEdBQUEsVTtRQVVBLFMsR0FBQSxTO1FBVUEsVSxHQUFBLFU7Ozs7Ozs7O0FBN0NBLFNBQUEsVUFBQSxDQUFBLEdBQUEsRUFBeUI7QUFDNUIsV0FBT0EsSUFBQUEsTUFBQUEsQ0FBQUEsQ0FBQUEsRUFBQUEsV0FBQUEsS0FBOEJBLElBQUFBLEtBQUFBLENBQXJDLENBQXFDQSxDQUFyQztBQUNIO0FBQ0Q7Ozs7Ozs7O0FBUU8sU0FBQSxRQUFBLENBQUEsR0FBQSxFQUF1QjtBQUMxQixXQUFPLElBQUEsT0FBQSxDQUFBLHFCQUFBLEVBQW1DLFVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxHQUFBLEVBQWlDO0FBQ3ZFLGVBQU9DLE1BQU1BLElBQU5BLFdBQU1BLEVBQU5BLEdBQVAsRUFBQTtBQURHLEtBQUEsRUFBQSxPQUFBLENBQUEsZ0JBQUEsRUFFc0IsVUFBQSxLQUFBLEVBQWlCO0FBQzFDLGVBQU9DLE1BQVAsV0FBT0EsRUFBUDtBQUhKLEtBQU8sQ0FBUDtBQUtIO0FBQ0Q7Ozs7Ozs7QUFPTyxTQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQXlCO0FBQzVCLFdBQU9GLElBQUFBLE9BQUFBLENBQUFBLG1CQUFBQSxFQUFBQSxPQUFBQSxFQUFQLFdBQU9BLEVBQVA7QUFDSDtBQUNEOzs7Ozs7O0FBT08sU0FBQSxTQUFBLENBQUEsR0FBQSxFQUF3QjtBQUMzQixXQUFPRyxXQUFBQSxHQUFBQSxFQUFBQSxPQUFBQSxDQUFBQSxPQUFBQSxFQUFQLEdBQU9BLENBQVA7QUFDSDtBQUNEOzs7Ozs7O0FBT08sU0FBQSxVQUFBLENBQUEsR0FBQSxFQUF5QjtBQUM1QixXQUFPSCxJQUFBQSxPQUFBQSxDQUFBQSxvQkFBQUEsRUFBQUEsT0FBQUEsRUFBQUEsT0FBQUEsQ0FBQUEsU0FBQUEsRUFBQUEsR0FBQUEsRUFBUCxXQUFPQSxFQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVwcGVyY2FzZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nLCBidXQgZG9uJ3QgY2hhbmdlIHRoZSByZW1haW5kZXIuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cbi8qKlxuICogQ29udmVydCB1bmRlcnNjb3JlZCwgZGFzaGVyaXplZCwgb3Igc3BhY2UtZGVsaW1pdGVkIHdvcmRzIGludG9cbiAqIGxvd2VyQ2FtZWxDYXNlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW1lbGl6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhcXC18XFxffFxcLnxcXHMpKyguKT8vZywgZnVuY3Rpb24gKG1hdGNoLCBzZXBhcmF0b3IsIGNocikge1xuICAgICAgICByZXR1cm4gY2hyID8gY2hyLnRvVXBwZXJDYXNlKCkgOiAnJztcbiAgICB9KS5yZXBsYWNlKC8oXnxcXC8pKFtBLVpdKS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59XG4vKipcbiAqIENvbnZlcnRzIGEgY2FtZWxpemVkIHN0cmluZyBpbnRvIGFsbCBsb3dlcmNhc2Ugc2VwYXJhdGVkIGJ5IHVuZGVyc2NvcmVzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNhbWVsaXplKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSkvZywgJyQxXyQyJykudG9Mb3dlckNhc2UoKTtcbn1cbi8qKlxuICogRGFzaGVyaXplIHdvcmRzIHRoYXQgYXJlIHVuZGVyc2NvcmVkLCBzcGFjZS1kZWxpbWl0ZWQsIG9yIGNhbWVsQ2FzZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhc2hlcml6ZShzdHIpIHtcbiAgICByZXR1cm4gZGVjYW1lbGl6ZShzdHIpLnJlcGxhY2UoL1sgX10vZywgJy0nKTtcbn1cbi8qKlxuICogVW5kZXJzY29yZSB3b3JkcyB0aGF0IGFyZSBkYXNoZXJpemVkLCBzcGFjZS1kZWxpbWl0ZWQsIG9yIGNhbWVsQ2FzZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZGVyc2NvcmUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKykvZywgJyQxXyQyJykucmVwbGFjZSgvXFwtfFxccysvZywgJ18nKS50b0xvd2VyQ2FzZSgpO1xufSJdfQ==