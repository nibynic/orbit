/**
 * Display a deprecation warning with the provided message if the
 * provided `test` evaluates to a falsy value (or is missing).
 *
 * @export
 * @param {string} message Description of the deprecation
 * @param {(boolean | (() => boolean))} test An optional boolean or function that evaluates to a boolean.
 * @returns
 */
export function deprecate(message, test) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlcHJlY2F0ZS5qcyJdLCJuYW1lcyI6WyJkZXByZWNhdGUiLCJtZXNzYWdlIiwidGVzdCIsImNvbnNvbGUiLCJ3YXJuIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FBU0EsT0FBTyxTQUFTQSxTQUFULENBQW1CQyxPQUFuQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDckMsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzVCLFlBQUlBLE1BQUosRUFBWTtBQUNSO0FBQ0g7QUFDSixLQUpELE1BSU87QUFDSCxZQUFJQSxJQUFKLEVBQVU7QUFDTjtBQUNIO0FBQ0o7QUFDREMsWUFBUUMsSUFBUixDQUFhSCxPQUFiO0FBQ0giLCJmaWxlIjoiZGVwcmVjYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IGEgZGVwcmVjYXRpb24gd2FybmluZyB3aXRoIHRoZSBwcm92aWRlZCBtZXNzYWdlIGlmIHRoZVxuICogcHJvdmlkZWQgYHRlc3RgIGV2YWx1YXRlcyB0byBhIGZhbHN5IHZhbHVlIChvciBpcyBtaXNzaW5nKS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBEZXNjcmlwdGlvbiBvZiB0aGUgZGVwcmVjYXRpb25cbiAqIEBwYXJhbSB7KGJvb2xlYW4gfCAoKCkgPT4gYm9vbGVhbikpfSB0ZXN0IEFuIG9wdGlvbmFsIGJvb2xlYW4gb3IgZnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgdG8gYSBib29sZWFuLlxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcHJlY2F0ZShtZXNzYWdlLCB0ZXN0KSB7XG4gICAgaWYgKHR5cGVvZiB0ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0ZXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xufSJdfQ==