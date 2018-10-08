"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
class Notifier {
    constructor() {
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
    addListener(callback, binding) {
        binding = binding || this;
        this.listeners.push([callback, binding]);
    }
    /**
     * Remove a listener so that it will no longer receive notifications.
     *
     * @param {Function} callback Function registered as a callback
     * @param {object} binding Context in which `callback` was registered
     * @returns
     *
     * @memberOf Notifier
     */
    removeListener(callback, binding) {
        let listeners = this.listeners;
        let listener;
        binding = binding || this;
        for (var i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            if (listener && listener[0] === callback && listener[1] === binding) {
                listeners.splice(i, 1);
                return;
            }
        }
    }
    /**
     * Notify registered listeners.
     *
     * @param {any} args Params to be sent to listeners
     *
     * @memberOf Notifier
     */
    emit(...args) {
        this.listeners.slice(0).forEach(listener => {
            listener[0].apply(listener[1], args);
        });
    }
}
exports.default = Notifier;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vdGlmaWVyLmpzIl0sIm5hbWVzIjpbIk5vdGlmaWVyIiwiY29uc3RydWN0b3IiLCJsaXN0ZW5lcnMiLCJhZGRMaXN0ZW5lciIsImNhbGxiYWNrIiwiYmluZGluZyIsInB1c2giLCJyZW1vdmVMaXN0ZW5lciIsImxpc3RlbmVyIiwiaSIsImxlbiIsImxlbmd0aCIsInNwbGljZSIsImVtaXQiLCJhcmdzIiwic2xpY2UiLCJmb3JFYWNoIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJlLE1BQU1BLFFBQU4sQ0FBZTtBQUMxQkMsa0JBQWM7QUFDVixhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0g7QUFDRDs7Ozs7Ozs7O0FBU0FDLGdCQUFZQyxRQUFaLEVBQXNCQyxPQUF0QixFQUErQjtBQUMzQkEsa0JBQVVBLFdBQVcsSUFBckI7QUFDQSxhQUFLSCxTQUFMLENBQWVJLElBQWYsQ0FBb0IsQ0FBQ0YsUUFBRCxFQUFXQyxPQUFYLENBQXBCO0FBQ0g7QUFDRDs7Ozs7Ozs7O0FBU0FFLG1CQUFlSCxRQUFmLEVBQXlCQyxPQUF6QixFQUFrQztBQUM5QixZQUFJSCxZQUFZLEtBQUtBLFNBQXJCO0FBQ0EsWUFBSU0sUUFBSjtBQUNBSCxrQkFBVUEsV0FBVyxJQUFyQjtBQUNBLGFBQUssSUFBSUksSUFBSSxDQUFSLEVBQVdDLE1BQU1SLFVBQVVTLE1BQWhDLEVBQXdDRixJQUFJQyxHQUE1QyxFQUFpREQsR0FBakQsRUFBc0Q7QUFDbERELHVCQUFXTixVQUFVTyxDQUFWLENBQVg7QUFDQSxnQkFBSUQsWUFBWUEsU0FBUyxDQUFULE1BQWdCSixRQUE1QixJQUF3Q0ksU0FBUyxDQUFULE1BQWdCSCxPQUE1RCxFQUFxRTtBQUNqRUgsMEJBQVVVLE1BQVYsQ0FBaUJILENBQWpCLEVBQW9CLENBQXBCO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDs7Ozs7OztBQU9BSSxTQUFLLEdBQUdDLElBQVIsRUFBYztBQUNWLGFBQUtaLFNBQUwsQ0FBZWEsS0FBZixDQUFxQixDQUFyQixFQUF3QkMsT0FBeEIsQ0FBZ0NSLFlBQVk7QUFDeENBLHFCQUFTLENBQVQsRUFBWVMsS0FBWixDQUFrQlQsU0FBUyxDQUFULENBQWxCLEVBQStCTSxJQUEvQjtBQUNILFNBRkQ7QUFHSDtBQWpEeUI7a0JBQVRkLFEiLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICBUaGUgYE5vdGlmaWVyYCBjbGFzcyBjYW4gZW1pdCBtZXNzYWdlcyB0byBhbiBhcnJheSBvZiBzdWJzY3JpYmVkIGxpc3RlbmVycy5cbiAqIEhlcmUncyBhIHNpbXBsZSBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBOb3RpZmllciB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbiAqXG4gKiBsZXQgbm90aWZpZXIgPSBuZXcgTm90aWZpZXIoKTtcbiAqIG5vdGlmaWVyLmFkZExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAqICAgY29uc29sZS5sb2coXCJJIGhlYXJkIFwiICsgbWVzc2FnZSk7XG4gKiB9KTtcbiAqIG5vdGlmaWVyLmFkZExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAqICAgY29uc29sZS5sb2coXCJJIGFsc28gaGVhcmQgXCIgKyBtZXNzYWdlKTtcbiAqIH0pO1xuICpcbiAqIG5vdGlmaWVyLmVtaXQoJ2hlbGxvJyk7IC8vIGxvZ3MgXCJJIGhlYXJkIGhlbGxvXCIgYW5kIFwiSSBhbHNvIGhlYXJkIGhlbGxvXCJcbiAqIGBgYFxuICpcbiAqIENhbGxzIHRvIGBlbWl0YCB3aWxsIHNlbmQgYWxvbmcgYWxsIG9mIHRoZWlyIGFyZ3VtZW50cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTm90aWZpZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjYWxsYmFjayBhcyBhIGxpc3RlbmVyLCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIHNlbmRpbmdcbiAgICAgKiBub3RpZmljYXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gY2FsbCBhcyBhIG5vdGlmaWNhdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBiaW5kaW5nIENvbnRleHQgaW4gd2hpY2ggdG8gY2FsbCBgY2FsbGJhY2tgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcbiAgICAgKi9cbiAgICBhZGRMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZykge1xuICAgICAgICBiaW5kaW5nID0gYmluZGluZyB8fCB0aGlzO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKFtjYWxsYmFjaywgYmluZGluZ10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBzbyB0aGF0IGl0IHdpbGwgbm8gbG9uZ2VyIHJlY2VpdmUgbm90aWZpY2F0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHJlZ2lzdGVyZWQgYXMgYSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBiaW5kaW5nIENvbnRleHQgaW4gd2hpY2ggYGNhbGxiYWNrYCB3YXMgcmVnaXN0ZXJlZFxuICAgICAqIEByZXR1cm5zXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcbiAgICAgKi9cbiAgICByZW1vdmVMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZykge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIGxldCBsaXN0ZW5lcjtcbiAgICAgICAgYmluZGluZyA9IGJpbmRpbmcgfHwgdGhpcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgJiYgbGlzdGVuZXJbMF0gPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyWzFdID09PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90aWZ5IHJlZ2lzdGVyZWQgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHthbnl9IGFyZ3MgUGFyYW1zIHRvIGJlIHNlbnQgdG8gbGlzdGVuZXJzXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgTm90aWZpZXJcbiAgICAgKi9cbiAgICBlbWl0KC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2xpY2UoMCkuZm9yRWFjaChsaXN0ZW5lciA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lclswXS5hcHBseShsaXN0ZW5lclsxXSwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=