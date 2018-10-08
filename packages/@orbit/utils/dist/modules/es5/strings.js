/**
 * Uppercase the first letter of a string, but don't change the remainder.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
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
export function camelize(str) {
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
export function decamelize(str) {
    return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
}
/**
 * Dasherize words that are underscored, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
export function dasherize(str) {
    return decamelize(str).replace(/[ _]/g, '-');
}
/**
 * Underscore words that are dasherized, space-delimited, or camelCased.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
export function underscore(str) {
    return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-|\s+/g, '_').toLowerCase();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ3MuanMiXSwibmFtZXMiOlsiY2FwaXRhbGl6ZSIsInN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJjYW1lbGl6ZSIsInJlcGxhY2UiLCJtYXRjaCIsInNlcGFyYXRvciIsImNociIsInRvTG93ZXJDYXNlIiwiZGVjYW1lbGl6ZSIsImRhc2hlcml6ZSIsInVuZGVyc2NvcmUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBT0EsT0FBTyxTQUFTQSxVQUFULENBQW9CQyxHQUFwQixFQUF5QjtBQUM1QixXQUFPQSxJQUFJQyxNQUFKLENBQVcsQ0FBWCxFQUFjQyxXQUFkLEtBQThCRixJQUFJRyxLQUFKLENBQVUsQ0FBVixDQUFyQztBQUNIO0FBQ0Q7Ozs7Ozs7O0FBUUEsT0FBTyxTQUFTQyxRQUFULENBQWtCSixHQUFsQixFQUF1QjtBQUMxQixXQUFPQSxJQUFJSyxPQUFKLENBQVkscUJBQVosRUFBbUMsVUFBVUMsS0FBVixFQUFpQkMsU0FBakIsRUFBNEJDLEdBQTVCLEVBQWlDO0FBQ3ZFLGVBQU9BLE1BQU1BLElBQUlOLFdBQUosRUFBTixHQUEwQixFQUFqQztBQUNILEtBRk0sRUFFSkcsT0FGSSxDQUVJLGdCQUZKLEVBRXNCLFVBQVVDLEtBQVYsRUFBaUI7QUFDMUMsZUFBT0EsTUFBTUcsV0FBTixFQUFQO0FBQ0gsS0FKTSxDQUFQO0FBS0g7QUFDRDs7Ozs7OztBQU9BLE9BQU8sU0FBU0MsVUFBVCxDQUFvQlYsR0FBcEIsRUFBeUI7QUFDNUIsV0FBT0EsSUFBSUssT0FBSixDQUFZLG1CQUFaLEVBQWlDLE9BQWpDLEVBQTBDSSxXQUExQyxFQUFQO0FBQ0g7QUFDRDs7Ozs7OztBQU9BLE9BQU8sU0FBU0UsU0FBVCxDQUFtQlgsR0FBbkIsRUFBd0I7QUFDM0IsV0FBT1UsV0FBV1YsR0FBWCxFQUFnQkssT0FBaEIsQ0FBd0IsT0FBeEIsRUFBaUMsR0FBakMsQ0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7QUFPQSxPQUFPLFNBQVNPLFVBQVQsQ0FBb0JaLEdBQXBCLEVBQXlCO0FBQzVCLFdBQU9BLElBQUlLLE9BQUosQ0FBWSxvQkFBWixFQUFrQyxPQUFsQyxFQUEyQ0EsT0FBM0MsQ0FBbUQsU0FBbkQsRUFBOEQsR0FBOUQsRUFBbUVJLFdBQW5FLEVBQVA7QUFDSCIsImZpbGUiOiJzdHJpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVcHBlcmNhc2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZywgYnV0IGRvbid0IGNoYW5nZSB0aGUgcmVtYWluZGVyLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cikge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG4vKipcbiAqIENvbnZlcnQgdW5kZXJzY29yZWQsIGRhc2hlcml6ZWQsIG9yIHNwYWNlLWRlbGltaXRlZCB3b3JkcyBpbnRvXG4gKiBsb3dlckNhbWVsQ2FzZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxpemUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXFwtfFxcX3xcXC58XFxzKSsoLik/L2csIGZ1bmN0aW9uIChtYXRjaCwgc2VwYXJhdG9yLCBjaHIpIHtcbiAgICAgICAgcmV0dXJuIGNociA/IGNoci50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgfSkucmVwbGFjZSgvKF58XFwvKShbQS1aXSkvZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbWVsaXplZCBzdHJpbmcgaW50byBhbGwgbG93ZXJjYXNlIHNlcGFyYXRlZCBieSB1bmRlcnNjb3Jlcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjYW1lbGl6ZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0pL2csICckMV8kMicpLnRvTG93ZXJDYXNlKCk7XG59XG4vKipcbiAqIERhc2hlcml6ZSB3b3JkcyB0aGF0IGFyZSB1bmRlcnNjb3JlZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXNoZXJpemUoc3RyKSB7XG4gICAgcmV0dXJuIGRlY2FtZWxpemUoc3RyKS5yZXBsYWNlKC9bIF9dL2csICctJyk7XG59XG4vKipcbiAqIFVuZGVyc2NvcmUgd29yZHMgdGhhdCBhcmUgZGFzaGVyaXplZCwgc3BhY2UtZGVsaW1pdGVkLCBvciBjYW1lbENhc2VkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmRlcnNjb3JlKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSspL2csICckMV8kMicpLnJlcGxhY2UoL1xcLXxcXHMrL2csICdfJykudG9Mb3dlckNhc2UoKTtcbn0iXX0=