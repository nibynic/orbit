function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  The `Notifier` class can emit messages to an array of subscribed listeners.
 * Here's a simple example:
 *
 * ```ts
 * import { Notifier } from '@orbit/core';
 *
 * let notifier = new Notifier();
 * notifier.addListener((message: string) => {
 *   console.log("I heard " + message);
 * });
 * notifier.addListener((message: string) => {
 *   console.log("I also heard " + message);
 * });
 *
 * notifier.emit('hello'); // logs "I heard hello" and "I also heard hello"
 * ```
 *
 * Calls to `emit` will send along all of their arguments.
 *
 * @export
 * @class Notifier
 */
var Notifier = function () {
    function Notifier() {
        _classCallCheck(this, Notifier);

        this.listeners = [];
    }
    /**
     * Add a callback as a listener, which will be triggered when sending
     * notifications.
     *
     * @param {Function} callback Function to call as a notification
     * @param {object} binding Context in which to call `callback`
     *
     * @memberOf Notifier
     */


    Notifier.prototype.addListener = function addListener(callback, binding) {
        binding = binding || this;
        this.listeners.push([callback, binding]);
    };
    /**
     * Remove a listener so that it will no longer receive notifications.
     *
     * @param {Function} callback Function registered as a callback
     * @param {object} binding Context in which `callback` was registered
     * @returns
     *
     * @memberOf Notifier
     */


    Notifier.prototype.removeListener = function removeListener(callback, binding) {
        var listeners = this.listeners;
        var listener = void 0;
        binding = binding || this;
        for (var i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            if (listener && listener[0] === callback && listener[1] === binding) {
                listeners.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Notify registered listeners.
     *
     * @param {any} args Params to be sent to listeners
     *
     * @memberOf Notifier
     */


    Notifier.prototype.emit = function emit() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this.listeners.slice(0).forEach(function (listener) {
            listener[0].apply(listener[1], args);
        });
    };

    return Notifier;
}();

export default Notifier;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vdGlmaWVyLmpzIl0sIm5hbWVzIjpbIk5vdGlmaWVyIiwibGlzdGVuZXJzIiwiYWRkTGlzdGVuZXIiLCJjYWxsYmFjayIsImJpbmRpbmciLCJwdXNoIiwicmVtb3ZlTGlzdGVuZXIiLCJsaXN0ZW5lciIsImkiLCJsZW4iLCJsZW5ndGgiLCJzcGxpY2UiLCJlbWl0IiwiYXJncyIsInNsaWNlIiwiZm9yRWFjaCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCcUJBLFE7QUFDakIsd0JBQWM7QUFBQTs7QUFDVixhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7dUJBU0FDLFcsd0JBQVlDLFEsRUFBVUMsTyxFQUFTO0FBQzNCQSxrQkFBVUEsV0FBVyxJQUFyQjtBQUNBLGFBQUtILFNBQUwsQ0FBZUksSUFBZixDQUFvQixDQUFDRixRQUFELEVBQVdDLE9BQVgsQ0FBcEI7QUFDSCxLO0FBQ0Q7Ozs7Ozs7Ozs7O3VCQVNBRSxjLDJCQUFlSCxRLEVBQVVDLE8sRUFBUztBQUM5QixZQUFJSCxZQUFZLEtBQUtBLFNBQXJCO0FBQ0EsWUFBSU0saUJBQUo7QUFDQUgsa0JBQVVBLFdBQVcsSUFBckI7QUFDQSxhQUFLLElBQUlJLElBQUksQ0FBUixFQUFXQyxNQUFNUixVQUFVUyxNQUFoQyxFQUF3Q0YsSUFBSUMsR0FBNUMsRUFBaURELEdBQWpELEVBQXNEO0FBQ2xERCx1QkFBV04sVUFBVU8sQ0FBVixDQUFYO0FBQ0EsZ0JBQUlELFlBQVlBLFNBQVMsQ0FBVCxNQUFnQkosUUFBNUIsSUFBd0NJLFNBQVMsQ0FBVCxNQUFnQkgsT0FBNUQsRUFBcUU7QUFDakVILDBCQUFVVSxNQUFWLENBQWlCSCxDQUFqQixFQUFvQixDQUFwQjtBQUNBO0FBQ0g7QUFDSjtBQUNKLEs7QUFDRDs7Ozs7Ozs7O3VCQU9BSSxJLG1CQUFjO0FBQUEsMENBQU5DLElBQU07QUFBTkEsZ0JBQU07QUFBQTs7QUFDVixhQUFLWixTQUFMLENBQWVhLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0JDLE9BQXhCLENBQWdDLG9CQUFZO0FBQ3hDUixxQkFBUyxDQUFULEVBQVlTLEtBQVosQ0FBa0JULFNBQVMsQ0FBVCxDQUFsQixFQUErQk0sSUFBL0I7QUFDSCxTQUZEO0FBR0gsSzs7Ozs7ZUFqRGdCYixRIiwiZmlsZSI6Im5vdGlmaWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgVGhlIGBOb3RpZmllcmAgY2xhc3MgY2FuIGVtaXQgbWVzc2FnZXMgdG8gYW4gYXJyYXkgb2Ygc3Vic2NyaWJlZCBsaXN0ZW5lcnMuXG4gKiBIZXJlJ3MgYSBzaW1wbGUgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgTm90aWZpZXIgfSBmcm9tICdAb3JiaXQvY29yZSc7XG4gKlxuICogbGV0IG5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKCk7XG4gKiBub3RpZmllci5hZGRMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKFwiSSBoZWFyZCBcIiArIG1lc3NhZ2UpO1xuICogfSk7XG4gKiBub3RpZmllci5hZGRMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKFwiSSBhbHNvIGhlYXJkIFwiICsgbWVzc2FnZSk7XG4gKiB9KTtcbiAqXG4gKiBub3RpZmllci5lbWl0KCdoZWxsbycpOyAvLyBsb2dzIFwiSSBoZWFyZCBoZWxsb1wiIGFuZCBcIkkgYWxzbyBoZWFyZCBoZWxsb1wiXG4gKiBgYGBcbiAqXG4gKiBDYWxscyB0byBgZW1pdGAgd2lsbCBzZW5kIGFsb25nIGFsbCBvZiB0aGVpciBhcmd1bWVudHMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE5vdGlmaWVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmaWVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGEgY2FsbGJhY2sgYXMgYSBsaXN0ZW5lciwgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBzZW5kaW5nXG4gICAgICogbm90aWZpY2F0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGNhbGwgYXMgYSBub3RpZmljYXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYmluZGluZyBDb250ZXh0IGluIHdoaWNoIHRvIGNhbGwgYGNhbGxiYWNrYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIE5vdGlmaWVyXG4gICAgICovXG4gICAgYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpIHtcbiAgICAgICAgYmluZGluZyA9IGJpbmRpbmcgfHwgdGhpcztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChbY2FsbGJhY2ssIGJpbmRpbmddKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgc28gdGhhdCBpdCB3aWxsIG5vIGxvbmdlciByZWNlaXZlIG5vdGlmaWNhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiByZWdpc3RlcmVkIGFzIGEgY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYmluZGluZyBDb250ZXh0IGluIHdoaWNoIGBjYWxsYmFja2Agd2FzIHJlZ2lzdGVyZWRcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqXG4gICAgICogQG1lbWJlck9mIE5vdGlmaWVyXG4gICAgICovXG4gICAgcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgICBsZXQgbGlzdGVuZXI7XG4gICAgICAgIGJpbmRpbmcgPSBiaW5kaW5nIHx8IHRoaXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyICYmIGxpc3RlbmVyWzBdID09PSBjYWxsYmFjayAmJiBsaXN0ZW5lclsxXSA9PT0gYmluZGluZykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5vdGlmeSByZWdpc3RlcmVkIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YW55fSBhcmdzIFBhcmFtcyB0byBiZSBzZW50IHRvIGxpc3RlbmVyc1xuICAgICAqXG4gICAgICogQG1lbWJlck9mIE5vdGlmaWVyXG4gICAgICovXG4gICAgZW1pdCguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNsaWNlKDApLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgICAgICAgbGlzdGVuZXJbMF0uYXBwbHkobGlzdGVuZXJbMV0sIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19