'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVENTED = undefined;
exports.isEvented = isEvented;
exports.default = evented;
exports.settleInSeries = settleInSeries;
exports.fulfillInSeries = fulfillInSeries;

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _notifier = require('./notifier');

var _notifier2 = _interopRequireDefault(_notifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EVENTED = exports.EVENTED = '__evented__';
/**
 * Has a class been decorated as `@evented`?
 *
 * @export
 * @param {object} obj
 * @returns {boolean}
 */
function isEvented(obj) {
    return !!obj[EVENTED];
}
/**
 * Marks a class as evented.
 *
 * An evented class should also implement the `Evented` interface.
 *
 * ```ts
 * import { evented, Evented } from '@orbit/core';
 *
 * @evented
 * class Source implements Evented {
 *   ...
 * }
 * ```
 *
 * Listeners can then register themselves for particular events with `on`:
 *
 * ```ts
 * let source = new Source();
 *
 * function listener1(message: string) {
 *   console.log('listener1 heard ' + message);
 * };
 * function listener2(message: string) {
 *   console.log('listener2 heard ' + message);
 * };
 *
 * source.on('greeting', listener1);
 * source.on('greeting', listener2);
 *
 * evented.emit('greeting', 'hello'); // logs "listener1 heard hello" and
 *                                    //      "listener2 heard hello"
 * ```
 *
 * Listeners can be unregistered from events at any time with `off`:
 *
 * ```ts
 * source.off('greeting', listener2);
 * ```
 *
 * @decorator
 * @export
 * @param {*} Klass
 */
function evented(Klass) {
    let proto = Klass.prototype;
    if (isEvented(proto)) {
        return;
    }
    proto[EVENTED] = true;
    proto.on = function (eventName, callback, _binding) {
        const binding = _binding || this;
        notifierForEvent(this, eventName, true).addListener(callback, binding);
    };
    proto.off = function (eventName, callback, _binding) {
        const binding = _binding || this;
        const notifier = notifierForEvent(this, eventName);
        if (notifier) {
            if (callback) {
                notifier.removeListener(callback, binding);
            } else {
                removeNotifierForEvent(this, eventName);
            }
        }
    };
    proto.one = function (eventName, callback, _binding) {
        let callOnce;
        let notifier;
        let binding = _binding || this;
        notifier = notifierForEvent(this, eventName, true);
        callOnce = function () {
            callback.apply(binding, arguments);
            notifier.removeListener(callOnce, binding);
        };
        notifier.addListener(callOnce, binding);
    };
    proto.emit = function (eventName, ...args) {
        let notifier = notifierForEvent(this, eventName);
        if (notifier) {
            notifier.emit.apply(notifier, args);
        }
    };
    proto.listeners = function (eventName) {
        let notifier = notifierForEvent(this, eventName);
        return notifier ? notifier.listeners : [];
    };
}
/**
 * Settle any promises returned by event listeners in series.
 *
 * If any errors are encountered during processing, they will be ignored.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function settleInSeries(obj, eventName, ...args) {
    const listeners = obj.listeners(eventName);
    return listeners.reduce((chain, [callback, binding]) => {
        return chain.then(() => callback.apply(binding, args)).catch(e => {});
    }, _main2.default.Promise.resolve());
}
/**
 * Fulfill any promises returned by event listeners in series.
 *
 * Processing will stop if an error is encountered and the returned promise will
 * be rejected.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function fulfillInSeries(obj, eventName, ...args) {
    const listeners = obj.listeners(eventName);
    return new _main2.default.Promise((resolve, reject) => {
        fulfillEach(listeners, args, resolve, reject);
    });
}
function notifierForEvent(object, eventName, createIfUndefined = false) {
    if (object._eventedNotifiers === undefined) {
        object._eventedNotifiers = {};
    }
    let notifier = object._eventedNotifiers[eventName];
    if (!notifier && createIfUndefined) {
        notifier = object._eventedNotifiers[eventName] = new _notifier2.default();
    }
    return notifier;
}
function removeNotifierForEvent(object, eventName) {
    if (object._eventedNotifiers && object._eventedNotifiers[eventName]) {
        delete object._eventedNotifiers[eventName];
    }
}
function fulfillEach(listeners, args, resolve, reject) {
    if (listeners.length === 0) {
        resolve();
    } else {
        let listener;
        [listener, ...listeners] = listeners;
        let [callback, binding] = listener;
        let response = callback.apply(binding, args);
        if (response) {
            return _main2.default.Promise.resolve(response).then(() => fulfillEach(listeners, args, resolve, reject)).catch(error => reject(error));
        } else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50ZWQuanMiXSwibmFtZXMiOlsiaXNFdmVudGVkIiwiZXZlbnRlZCIsInNldHRsZUluU2VyaWVzIiwiZnVsZmlsbEluU2VyaWVzIiwiRVZFTlRFRCIsIm9iaiIsIktsYXNzIiwicHJvdG8iLCJwcm90b3R5cGUiLCJvbiIsImV2ZW50TmFtZSIsImNhbGxiYWNrIiwiX2JpbmRpbmciLCJiaW5kaW5nIiwibm90aWZpZXJGb3JFdmVudCIsImFkZExpc3RlbmVyIiwib2ZmIiwibm90aWZpZXIiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZU5vdGlmaWVyRm9yRXZlbnQiLCJvbmUiLCJjYWxsT25jZSIsImFwcGx5IiwiYXJndW1lbnRzIiwiZW1pdCIsImFyZ3MiLCJsaXN0ZW5lcnMiLCJyZWR1Y2UiLCJjaGFpbiIsInRoZW4iLCJjYXRjaCIsImUiLCJPcmJpdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbEVhY2giLCJvYmplY3QiLCJjcmVhdGVJZlVuZGVmaW5lZCIsIl9ldmVudGVkTm90aWZpZXJzIiwidW5kZWZpbmVkIiwiTm90aWZpZXIiLCJsZW5ndGgiLCJsaXN0ZW5lciIsInJlc3BvbnNlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztRQVVnQkEsUyxHQUFBQSxTO2tCQThDUUMsTztRQXNEUkMsYyxHQUFBQSxjO1FBa0JBQyxlLEdBQUFBLGU7O0FBaEloQjs7OztBQUNBOzs7Ozs7QUFDTyxNQUFNQyw0QkFBVSxhQUFoQjtBQUNQOzs7Ozs7O0FBT08sU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0I7QUFDM0IsV0FBTyxDQUFDLENBQUNBLElBQUlELE9BQUosQ0FBVDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ2UsU0FBU0gsT0FBVCxDQUFpQkssS0FBakIsRUFBd0I7QUFDbkMsUUFBSUMsUUFBUUQsTUFBTUUsU0FBbEI7QUFDQSxRQUFJUixVQUFVTyxLQUFWLENB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Q0EsWUFBSW1CLFFBQUosRUFBYztBQUNWLG1CQUFPWixlQUFNQyxPQUFOLENBQWNDLE9BQWQsQ0FBc0JVLFFBQXRCLEVBQWdDZixJQUFoQyxDQUFxQyxNQUFNTyxZQUFZVixTQUFaLEVBQXVCRCxJQUF2QixFQUE2QlMsT0FBN0IsRUFBc0NDLE1BQXRDLENBQTNDLEVBQTBGTCxLQUExRixDQUFnR2UsU0FBU1YsT0FBT1UsS0FBUCxDQUF6RyxDQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0hULHdCQUFZVixTQUFaLEVBQXVCRCxJQUF2QixFQUE2QlMsT0FBN0IsRUFBc0NDLE1BQXRDO0FBQ0g7QUFDSjtBQUNKIiwiZmlsZSI6ImV2ZW50ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCBOb3RpZmllciBmcm9tICcuL25vdGlmaWVyJztcbmV4cG9ydCBjb25zdCBFVkVOVEVEID0gJ19fZXZlbnRlZF9fJztcbi8qKlxuICogSGFzIGEgY2xhc3MgYmVlbiBkZWNvcmF0ZWQgYXMgYEBldmVudGVkYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXZlbnRlZChvYmopIHtcbiAgICByZXR1cm4gISFvYmpbRVZFTlRFRF07XG59XG4vKipcbiAqIE1hcmtzIGEgY2xhc3MgYXMgZXZlbnRlZC5cbiAqXG4gKiBBbiBldmVudGVkIGNsYXNzIHNob3VsZCBhbHNvIGltcGxlbWVudCB0aGUgYEV2ZW50ZWRgIGludGVyZmFjZS5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbiAqXG4gKiBAZXZlbnRlZFxuICogY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCB7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiB0aGVuIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgZm9yIHBhcnRpY3VsYXIgZXZlbnRzIHdpdGggYG9uYDpcbiAqXG4gKiBgYGB0c1xuICogbGV0IHNvdXJjZSA9IG5ldyBTb3VyY2UoKTtcbiAqXG4gKiBmdW5jdGlvbiBsaXN0ZW5lcjEobWVzc2FnZTogc3RyaW5nKSB7XG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW5lcjEgaGVhcmQgJyArIG1lc3NhZ2UpO1xuICogfTtcbiAqIGZ1bmN0aW9uIGxpc3RlbmVyMihtZXNzYWdlOiBzdHJpbmcpIHtcbiAqICAgY29uc29sZS5sb2coJ2xpc3RlbmVyMiBoZWFyZCAnICsgbWVzc2FnZSk7XG4gKiB9O1xuICpcbiAqIHNvdXJjZS5vbignZ3JlZXRpbmcnLCBsaXN0ZW5lcjEpO1xuICogc291cmNlLm9uKCdncmVldGluZycsIGxpc3RlbmVyMik7XG4gKlxuICogZXZlbnRlZC5lbWl0KCdncmVldGluZycsICdoZWxsbycpOyAvLyBsb2dzIFwibGlzdGVuZXIxIGhlYXJkIGhlbGxvXCIgYW5kXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXCJsaXN0ZW5lcjIgaGVhcmQgaGVsbG9cIlxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiBiZSB1bnJlZ2lzdGVyZWQgZnJvbSBldmVudHMgYXQgYW55IHRpbWUgd2l0aCBgb2ZmYDpcbiAqXG4gKiBgYGB0c1xuICogc291cmNlLm9mZignZ3JlZXRpbmcnLCBsaXN0ZW5lcjIpO1xuICogYGBgXG4gKlxuICogQGRlY29yYXRvclxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBLbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldmVudGVkKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc0V2ZW50ZWQocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJvdG9bRVZFTlRFRF0gPSB0cnVlO1xuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSwgdHJ1ZSkuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpO1xuICAgIH07XG4gICAgcHJvdG8ub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBjb25zdCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ub25lID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGxldCBjYWxsT25jZTtcbiAgICAgICAgbGV0IG5vdGlmaWVyO1xuICAgICAgICBsZXQgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XG4gICAgICAgIG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUsIHRydWUpO1xuICAgICAgICBjYWxsT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsT25jZSwgYmluZGluZyk7XG4gICAgICAgIH07XG4gICAgICAgIG5vdGlmaWVyLmFkZExpc3RlbmVyKGNhbGxPbmNlLCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGxldCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBub3RpZmllci5lbWl0LmFwcGx5KG5vdGlmaWVyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ubGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBsZXQgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBub3RpZmllciA/IG5vdGlmaWVyLmxpc3RlbmVycyA6IFtdO1xuICAgIH07XG59XG4vKipcbiAqIFNldHRsZSBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgYnkgZXZlbnQgbGlzdGVuZXJzIGluIHNlcmllcy5cbiAqXG4gKiBJZiBhbnkgZXJyb3JzIGFyZSBlbmNvdW50ZXJlZCBkdXJpbmcgcHJvY2Vzc2luZywgdGhleSB3aWxsIGJlIGlnbm9yZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtFdmVudGVkfSBvYmpcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWVcbiAqIEBwYXJhbSB7YW55fSBhcmdzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHRsZUluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBsaXN0ZW5lcnMucmVkdWNlKChjaGFpbiwgW2NhbGxiYWNrLCBiaW5kaW5nXSkgPT4ge1xuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmdzKSkuY2F0Y2goZSA9PiB7fSk7XG4gICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xufVxuLyoqXG4gKiBGdWxmaWxsIGFueSBwcm9taXNlcyByZXR1cm5lZCBieSBldmVudCBsaXN0ZW5lcnMgaW4gc2VyaWVzLlxuICpcbiAqIFByb2Nlc3Npbmcgd2lsbCBzdG9wIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGFuZCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsXG4gKiBiZSByZWplY3RlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge0V2ZW50ZWR9IG9ialxuICogQHBhcmFtIHthbnl9IGV2ZW50TmFtZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVsZmlsbEluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5vdGlmaWVyRm9yRXZlbnQob2JqZWN0LCBldmVudE5hbWUsIGNyZWF0ZUlmVW5kZWZpbmVkID0gZmFsc2UpIHtcbiAgICBpZiAob2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID0ge307XG4gICAgfVxuICAgIGxldCBub3RpZmllciA9IG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbm90aWZpZXIgJiYgY3JlYXRlSWZVbmRlZmluZWQpIHtcbiAgICAgICAgbm90aWZpZXIgPSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSA9IG5ldyBOb3RpZmllcigpO1xuICAgIH1cbiAgICByZXR1cm4gbm90aWZpZXI7XG59XG5mdW5jdGlvbiByZW1vdmVOb3RpZmllckZvckV2ZW50KG9iamVjdCwgZXZlbnROYW1lKSB7XG4gICAgaWYgKG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyAmJiBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSkge1xuICAgICAgICBkZWxldGUgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV07XG4gICAgfVxufVxuZnVuY3Rpb24gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxpc3RlbmVyO1xuICAgICAgICBbbGlzdGVuZXIsIC4uLmxpc3RlbmVyc10gPSBsaXN0ZW5lcnM7XG4gICAgICAgIGxldCBbY2FsbGJhY2ssIGJpbmRpbmddID0gbGlzdGVuZXI7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzcG9uc2UpLnRoZW4oKCkgPT4gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpKS5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=