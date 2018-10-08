"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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

exports.default = Notifier;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vdGlmaWVyLmpzIl0sIm5hbWVzIjpbIk5vdGlmaWVyIiwiYWRkTGlzdGVuZXIiLCJjYWxsYmFjayIsImJpbmRpbmciLCJyZW1vdmVMaXN0ZW5lciIsImxpc3RlbmVycyIsImxpc3RlbmVyIiwiaSIsImxlbiIsImVtaXQiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCcUJBLFc7QUFDakIsYUFBQSxRQUFBLEdBQWM7QUFBQSx3QkFBQSxJQUFBLEVBQUEsUUFBQTs7QUFDVixhQUFBLFNBQUEsR0FBQSxFQUFBO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozt1QkFTQUMsVyx3QkFBWUMsUSxFQUFVQyxPLEVBQVM7QUFDM0JBLGtCQUFVQSxXQUFWQSxJQUFBQTtBQUNBLGFBQUEsU0FBQSxDQUFBLElBQUEsQ0FBb0IsQ0FBQSxRQUFBLEVBQXBCLE9BQW9CLENBQXBCOztBQUVKOzs7Ozs7Ozs7O3VCQVNBQyxjLDJCQUFlRixRLEVBQVVDLE8sRUFBUztBQUM5QixZQUFJRSxZQUFZLEtBQWhCLFNBQUE7QUFDQSxZQUFJQyxXQUFBQSxLQUFKLENBQUE7QUFDQUgsa0JBQVVBLFdBQVZBLElBQUFBO0FBQ0EsYUFBSyxJQUFJSSxJQUFKLENBQUEsRUFBV0MsTUFBTUgsVUFBdEIsTUFBQSxFQUF3Q0UsSUFBeEMsR0FBQSxFQUFBLEdBQUEsRUFBc0Q7QUFDbERELHVCQUFXRCxVQUFYQyxDQUFXRCxDQUFYQztBQUNBLGdCQUFJQSxZQUFZQSxTQUFBQSxDQUFBQSxNQUFaQSxRQUFBQSxJQUF3Q0EsU0FBQUEsQ0FBQUEsTUFBNUMsT0FBQSxFQUFxRTtBQUNqRUQsMEJBQUFBLE1BQUFBLENBQUFBLENBQUFBLEVBQUFBLENBQUFBO0FBQ0E7QUFDSDtBQUNKOztBQUVMOzs7Ozs7Ozt1QkFPQUksSSxtQkFBYztBQUFBLGFBQUEsSUFBQSxPQUFBLFVBQUEsTUFBQSxFQUFOQyxPQUFNLE1BQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxDQUFBLEVBQUEsT0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBO0FBQU5BLGlCQUFNLElBQU5BLElBQU0sVUFBQSxJQUFBLENBQU5BO0FBQU07O0FBQ1YsYUFBQSxTQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsRUFBQSxPQUFBLENBQWdDLFVBQUEsUUFBQSxFQUFZO0FBQ3hDSixxQkFBQUEsQ0FBQUEsRUFBQUEsS0FBQUEsQ0FBa0JBLFNBQWxCQSxDQUFrQkEsQ0FBbEJBLEVBQUFBLElBQUFBO0FBREosU0FBQTs7Ozs7O2tCQTlDYU4sUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIFRoZSBgTm90aWZpZXJgIGNsYXNzIGNhbiBlbWl0IG1lc3NhZ2VzIHRvIGFuIGFycmF5IG9mIHN1YnNjcmliZWQgbGlzdGVuZXJzLlxuICogSGVyZSdzIGEgc2ltcGxlIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IE5vdGlmaWVyIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuICpcbiAqIGxldCBub3RpZmllciA9IG5ldyBOb3RpZmllcigpO1xuICogbm90aWZpZXIuYWRkTGlzdGVuZXIoKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICogICBjb25zb2xlLmxvZyhcIkkgaGVhcmQgXCIgKyBtZXNzYWdlKTtcbiAqIH0pO1xuICogbm90aWZpZXIuYWRkTGlzdGVuZXIoKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICogICBjb25zb2xlLmxvZyhcIkkgYWxzbyBoZWFyZCBcIiArIG1lc3NhZ2UpO1xuICogfSk7XG4gKlxuICogbm90aWZpZXIuZW1pdCgnaGVsbG8nKTsgLy8gbG9ncyBcIkkgaGVhcmQgaGVsbG9cIiBhbmQgXCJJIGFsc28gaGVhcmQgaGVsbG9cIlxuICogYGBgXG4gKlxuICogQ2FsbHMgdG8gYGVtaXRgIHdpbGwgc2VuZCBhbG9uZyBhbGwgb2YgdGhlaXIgYXJndW1lbnRzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBOb3RpZmllclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RpZmllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNhbGxiYWNrIGFzIGEgbGlzdGVuZXIsIHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIHdoZW4gc2VuZGluZ1xuICAgICAqIG5vdGlmaWNhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBjYWxsIGFzIGEgbm90aWZpY2F0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGJpbmRpbmcgQ29udGV4dCBpbiB3aGljaCB0byBjYWxsIGBjYWxsYmFja2BcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBOb3RpZmllclxuICAgICAqL1xuICAgIGFkZExpc3RlbmVyKGNhbGxiYWNrLCBiaW5kaW5nKSB7XG4gICAgICAgIGJpbmRpbmcgPSBiaW5kaW5nIHx8IHRoaXM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goW2NhbGxiYWNrLCBiaW5kaW5nXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGxpc3RlbmVyIHNvIHRoYXQgaXQgd2lsbCBubyBsb25nZXIgcmVjZWl2ZSBub3RpZmljYXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgRnVuY3Rpb24gcmVnaXN0ZXJlZCBhcyBhIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGJpbmRpbmcgQ29udGV4dCBpbiB3aGljaCBgY2FsbGJhY2tgIHdhcyByZWdpc3RlcmVkXG4gICAgICogQHJldHVybnNcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBOb3RpZmllclxuICAgICAqL1xuICAgIHJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrLCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgbGV0IGxpc3RlbmVyO1xuICAgICAgICBiaW5kaW5nID0gYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciAmJiBsaXN0ZW5lclswXSA9PT0gY2FsbGJhY2sgJiYgbGlzdGVuZXJbMV0gPT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBOb3RpZnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FueX0gYXJncyBQYXJhbXMgdG8gYmUgc2VudCB0byBsaXN0ZW5lcnNcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBOb3RpZmllclxuICAgICAqL1xuICAgIGVtaXQoLi4uYXJncykge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zbGljZSgwKS5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVyWzBdLmFwcGx5KGxpc3RlbmVyWzFdLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==