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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ3MuanMiXSwibmFtZXMiOlsiY2FwaXRhbGl6ZSIsImNhbWVsaXplIiwiZGVjYW1lbGl6ZSIsImRhc2hlcml6ZSIsInVuZGVyc2NvcmUiLCJzdHIiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwicmVwbGFjZSIsIm1hdGNoIiwic2VwYXJhdG9yIiwiY2hyIiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBT2dCQSxVLEdBQUFBLFU7UUFXQUMsUSxHQUFBQSxRO1FBY0FDLFUsR0FBQUEsVTtRQVVBQyxTLEdBQUFBLFM7UUFVQUMsVSxHQUFBQSxVO0FBcERoQjs7Ozs7OztBQU9PLFNBQVNKLFVBQVQsQ0FBb0JLLEdBQXBCLEVBQXlCO0FBQzVCLFdBQU9BLElBQUlDLE1BQUosQ0FBVyxDQUFYLEVBQWNDLFdBQWQsS0FBOEJGLElBQUlHLEtBQUosQ0FBVSxDQUFWLENBQXJDO0FBQ0g7QUFDRDs7Ozs7Ozs7QUFRTyxTQUFTUCxRQUFULENBQWtCSSxHQUFsQixFQUF1QjtBQUMxQixXQUFPQSxJQUFJSSxPQUFKLENBQVkscUJBQVosRUFBbUMsVUFBVUMsS0FBVixFQUFpQkMsU0FBakIsRUFBNEJDLEdBQTVCLEVBQWlDO0FBQ3ZFLGVBQU9BLE1BQU1BLElBQUlMLFdBQUosRUFBTixHQUEwQixFQUFqQztBQUNILEtBRk0sRUFFSkUsT0FGSSxDQUVJLGdCQUZKLEVBRXNCLFVBQVVDLEtBQVYsRUFBaUI7QUFDMUMsZUFBT0EsTUFBTUcsV0FBTixFQUFQO0FBQ0gsS0FKTSxDQUFQO0FBS0g7QUFDRDs7Ozs7OztBQU9PLFNBQVNYLFVBQVQsQ0FBb0JHLEdBQXBCLEVBQXlCO0FBQzVCLFdBQU9BLElBQUlJLE9BQUosQ0FBWSxtQkFBWixFQUFpQyxPQUFqQyxFQUEwQ0ksV0FBMUMsRUFBUDtBQUNIO0FBQ0Q7Ozs7Ozs7QUFPTyxTQUFTVixTQUFULENBQW1CRSxHQUFuQixFQUF3QjtBQUMzQixXQUFPSCxXQUFXRyxHQUFYLEVBQWdCSSxPQUFoQixDQUF3QixPQUF4QixFQUFpQyxHQUFqQyxDQUFQO0FBQ0g7QUFDRDs7Ozs7OztBQU9PLFNBQVNMLFVBQVQsQ0FBb0JDLEdBQXBCLEVBQXlCO0FBQzVCLFdBQU9BLElBQUlJLE9BQUosQ0FBWSxvQkFBWixFQUFrQyxPQUFsQyxFQUEyQ0EsT0FBM0MsQ0FBbUQsU0FBbkQsRUFBOEQsR0FBOUQsRUFBbUVJLFdBQW5FLEVBQVA7QUFDSCIsImZpbGUiOiJzdHJpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVcHBlcmNhc2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZywgYnV0IGRvbid0IGNoYW5nZSB0aGUgcmVtYWluZGVyLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cikge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG4vKipcbiAqIENvbnZlcnQgdW5kZXJzY29yZWQsIGRhc2hlcml6ZWQsIG9yIHNwYWNlLWRlbGltaXRlZCB3b3JkcyBpbnRvXG4gKiBsb3dlckNhbWVsQ2FzZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxpemUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFwtfFxcX3xcXC58XFxzKSsoLik/L2csIGZ1bmN0aW9uIChtYXRjaCwgc2VwYXJhdG9yLCBjaHIpIHtcbiAgICAgICAgcmV0dXJuIGNociA/IGNoci50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgfSkucmVwbGFjZSgvKF58XFwvKShbQS1aXSkvZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbWVsaXplZCBzdHJpbmcgaW50byBhbGwgbG93ZXJjYXNlIHNlcGFyYXRlZCBieSB1bmRlcnNjb3Jlcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjYW1lbGl6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0pL2csICckMV8kMicpLnRvTG93ZXJDYXNlKCk7XG59XG4vKipcbiAqIERhc2hlcml6ZSB3b3JkcyB0aGF0IGFyZSB1bmRlcnNjb3JlZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXNoZXJpemUoc3RyKSB7XG4gICAgcmV0dXJuIGRlY2FtZWxpemUoc3RyKS5yZXBsYWNlKC9bIF9dL2csICctJyk7XG59XG4vKipcbiAqIFVuZGVyc2NvcmUgd29yZHMgdGhhdCBhcmUgZGFzaGVyaXplZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmRlcnNjb3JlKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSspL2csICckMV8kMicpLnJlcGxhY2UoL1xcLXxcXHMrL2csICdfJykudG9Mb3dlckNhc2UoKTtcbn0iXX0=