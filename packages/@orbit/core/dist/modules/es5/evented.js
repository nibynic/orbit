import Orbit from './main';
import Notifier from './notifier';
export var EVENTED = '__evented__';
/**
 * Has a class been decorated as `@evented`?
 *
 * @export
 * @param {object} obj
 * @returns {boolean}
 */
export function isEvented(obj) {
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
export default function evented(Klass) {
    var proto = Klass.prototype;
    if (isEvented(proto)) {
        return;
    }
    proto[EVENTED] = true;
    proto.on = function (eventName, callback, _binding) {
        var binding = _binding || this;
        notifierForEvent(this, eventName, true).addListener(callback, binding);
    };
    proto.off = function (eventName, callback, _binding) {
        var binding = _binding || this;
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            if (callback) {
                notifier.removeListener(callback, binding);
            } else {
                removeNotifierForEvent(this, eventName);
            }
        }
    };
    proto.one = function (eventName, callback, _binding) {
        var callOnce = void 0;
        var notifier = void 0;
        var binding = _binding || this;
        notifier = notifierForEvent(this, eventName, true);
        callOnce = function () {
            callback.apply(binding, arguments);
            notifier.removeListener(callOnce, binding);
        };
        notifier.addListener(callOnce, binding);
    };
    proto.emit = function (eventName) {
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            notifier.emit.apply(notifier, args);
        }
    };
    proto.listeners = function (eventName) {
        var notifier = notifierForEvent(this, eventName);
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
export function settleInSeries(obj, eventName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
    }

    var listeners = obj.listeners(eventName);
    return listeners.reduce(function (chain, _ref) {
        var callback = _ref[0],
            binding = _ref[1];

        return chain.then(function () {
            return callback.apply(binding, args);
        }).catch(function (e) {});
    }, Orbit.Promise.resolve());
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
export function fulfillInSeries(obj, eventName) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
    }

    var listeners = obj.listeners(eventName);
    return new Orbit.Promise(function (resolve, reject) {
        fulfillEach(listeners, args, resolve, reject);
    });
}
function notifierForEvent(object, eventName) {
    var createIfUndefined = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (object._eventedNotifiers === undefined) {
        object._eventedNotifiers = {};
    }
    var notifier = object._eventedNotifiers[eventName];
    if (!notifier && createIfUndefined) {
        notifier = object._eventedNotifiers[eventName] = new Notifier();
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
        var listener = void 0;
        var _listeners = listeners;
        listener = _listeners[0];
        listeners = _listeners.slice(1);
        var _listener = listener,
            callback = _listener[0],
            binding = _listener[1];

        var response = callback.apply(binding, args);
        if (response) {
            return Orbit.Promise.resolve(response).then(function () {
                return fulfillEach(listeners, args, resolve, reject);
            }).catch(function (error) {
                return reject(error);
            });
        } else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50ZWQuanMiXSwibmFtZXMiOlsiT3JiaXQiLCJOb3RpZmllciIsIkVWRU5URUQiLCJpc0V2ZW50ZWQiLCJvYmoiLCJldmVudGVkIiwiS2xhc3MiLCJwcm90byIsInByb3RvdHlwZSIsIm9uIiwiZXZlbnROYW1lIiwiY2FsbGJhY2siLCJfYmluZGluZyIsImJpbmRpbmciLCJub3RpZmllckZvckV2ZW50IiwiYWRkTGlzdGVuZXIiLCJvZmYiLCJub3RpZmllciIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlTm90aWZpZXJGb3JFdmVudCIsIm9uZSIsImNhbGxPbmNlIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJlbWl0IiwiYXJncyIsImxpc3RlbmVycyIsInNldHRsZUluU2VyaWVzIiwicmVkdWNlIiwiY2hhaW4iLCJ0aGVuIiwiY2F0Y2giLCJQcm9taXNlIiwicmVzb2x2ZSIsImZ1bGZpbGxJblNlcmllcyIsInJlamVjdCIsImZ1bGZpbGxFYWNoIiwib2JqZWN0IiwiY3JlYXRlSWZVbmRlZmluZWQiLCJfZXZlbnRlZE5vdGlmaWVycyIsInVuZGVmaW5lZCIsImxlbmd0aCIsImxpc3RlbmVyIiwicmVzcG9uc2UiLCJlcnJvciJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxNQUFrQixRQUFsQjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIsWUFBckI7QUFDQSxPQUFPLElBQU1DLFVBQVUsYUFBaEI7QUFDUDs7Ozs7OztBQU9BLE9BQU8sU0FBU0MsU0FBVCxDQUFtQkMsR0FBbkIsRUFBd0I7QUFDM0IsV0FBTyxDQUFDLENBQUNBLElBQUlGLE9BQUosQ0FBVDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0EsZUFBZSxTQUFTRyxPQUFULENBQWlCQyxLQUFqQixFQUF3QjtBQUNuQyxRQUFJQyxRQUFRRCxNQUFNRSxTQUFsQjtBQUNBLFFBQUlMLFVBQVVJLEtBQVYsQ0FBSixFQUFzQjtBQUNsQjtBQUNIO0FB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SEY7QUFBQSxZQUdZRSxPQUhaOztBQUlILFlBQUk4QixXQUFXaEMsU0FBU1csS0FBVCxDQUFlVCxPQUFmLEVBQXdCWSxJQUF4QixDQUFmO0FBQ0EsWUFBSWtCLFFBQUosRUFBYztBQUNWLG1CQUFPM0MsTUFBTWdDLE9BQU4sQ0FBY0MsT0FBZCxDQUFzQlUsUUFBdEIsRUFBZ0NiLElBQWhDLENBQXFDO0FBQUEsdUJBQU1NLFlBQVlWLFNBQVosRUFBdUJELElBQXZCLEVBQTZCUSxPQUE3QixFQUFzQ0UsTUFBdEMsQ0FBTjtBQUFBLGFBQXJDLEVBQTBGSixLQUExRixDQUFnRztBQUFBLHVCQUFTSSxPQUFPUyxLQUFQLENBQVQ7QUFBQSxhQUFoRyxDQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0hSLHdCQUFZVixTQUFaLEVBQXVCRCxJQUF2QixFQUE2QlEsT0FBN0IsRUFBc0NFLE1BQXRDO0FBQ0g7QUFDSjtBQUNKIiwiZmlsZSI6ImV2ZW50ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCBOb3RpZmllciBmcm9tICcuL25vdGlmaWVyJztcbmV4cG9ydCBjb25zdCBFVkVOVEVEID0gJ19fZXZlbnRlZF9fJztcbi8qKlxuICogSGFzIGEgY2xhc3MgYmVlbiBkZWNvcmF0ZWQgYXMgYEBldmVudGVkYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXZlbnRlZChvYmopIHtcbiAgICByZXR1cm4gISFvYmpbRVZFTlRFRF07XG59XG4vKipcbiAqIE1hcmtzIGEgY2xhc3MgYXMgZXZlbnRlZC5cbiAqXG4gKiBBbiBldmVudGVkIGNsYXNzIHNob3VsZCBhbHNvIGltcGxlbWVudCB0aGUgYEV2ZW50ZWRgIGludGVyZmFjZS5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbiAqXG4gKiBAZXZlbnRlZFxuICogY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCB7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiB0aGVuIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgZm9yIHBhcnRpY3VsYXIgZXZlbnRzIHdpdGggYG9uYDpcbiAqXG4gKiBgYGB0c1xuICogbGV0IHNvdXJjZSA9IG5ldyBTb3VyY2UoKTtcbiAqXG4gKiBmdW5jdGlvbiBsaXN0ZW5lcjEobWVzc2FnZTogc3RyaW5nKSB7XG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW5lcjEgaGVhcmQgJyArIG1lc3NhZ2UpO1xuICogfTtcbiAqIGZ1bmN0aW9uIGxpc3RlbmVyMihtZXNzYWdlOiBzdHJpbmcpIHtcbiAqICAgY29uc29sZS5sb2coJ2xpc3RlbmVyMiBoZWFyZCAnICsgbWVzc2FnZSk7XG4gKiB9O1xuICpcbiAqIHNvdXJjZS5vbignZ3JlZXRpbmcnLCBsaXN0ZW5lcjEpO1xuICogc291cmNlLm9uKCdncmVldGluZycsIGxpc3RlbmVyMik7XG4gKlxuICogZXZlbnRlZC5lbWl0KCdncmVldGluZycsICdoZWxsbycpOyAvLyBsb2dzIFwibGlzdGVuZXIxIGhlYXJkIGhlbGxvXCIgYW5kXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXCJsaXN0ZW5lcjIgaGVhcmQgaGVsbG9cIlxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiBiZSB1bnJlZ2lzdGVyZWQgZnJvbSBldmVudHMgYXQgYW55IHRpbWUgd2l0aCBgb2ZmYDpcbiAqXG4gKiBgYGB0c1xuICogc291cmNlLm9mZignZ3JlZXRpbmcnLCBsaXN0ZW5lcjIpO1xuICogYGBgXG4gKlxuICogQGRlY29yYXRvclxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBLbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldmVudGVkKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc0V2ZW50ZWQocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJvdG9bRVZFTlRFRF0gPSB0cnVlO1xuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSwgdHJ1ZSkuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpO1xuICAgIH07XG4gICAgcHJvdG8ub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBjb25zdCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ub25lID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGxldCBjYWxsT25jZTtcbiAgICAgICAgbGV0IG5vdGlmaWVyO1xuICAgICAgICBsZXQgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XG4gICAgICAgIG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUsIHRydWUpO1xuICAgICAgICBjYWxsT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsT25jZSwgYmluZGluZyk7XG4gICAgICAgIH07XG4gICAgICAgIG5vdGlmaWVyLmFkZExpc3RlbmVyKGNhbGxPbmNlLCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGxldCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBub3RpZmllci5lbWl0LmFwcGx5KG5vdGlmaWVyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ubGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBsZXQgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBub3RpZmllciA/IG5vdGlmaWVyLmxpc3RlbmVycyA6IFtdO1xuICAgIH07XG59XG4vKipcbiAqIFNldHRsZSBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgYnkgZXZlbnQgbGlzdGVuZXJzIGluIHNlcmllcy5cbiAqXG4gKiBJZiBhbnkgZXJyb3JzIGFyZSBlbmNvdW50ZXJlZCBkdXJpbmcgcHJvY2Vzc2luZywgdGhleSB3aWxsIGJlIGlnbm9yZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtFdmVudGVkfSBvYmpcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWVcbiAqIEBwYXJhbSB7YW55fSBhcmdzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHRsZUluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBsaXN0ZW5lcnMucmVkdWNlKChjaGFpbiwgW2NhbGxiYWNrLCBiaW5kaW5nXSkgPT4ge1xuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmdzKSkuY2F0Y2goZSA9PiB7fSk7XG4gICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xufVxuLyoqXG4gKiBGdWxmaWxsIGFueSBwcm9taXNlcyByZXR1cm5lZCBieSBldmVudCBsaXN0ZW5lcnMgaW4gc2VyaWVzLlxuICpcbiAqIFByb2Nlc3Npbmcgd2lsbCBzdG9wIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGFuZCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsXG4gKiBiZSByZWplY3RlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge0V2ZW50ZWR9IG9ialxuICogQHBhcmFtIHthbnl9IGV2ZW50TmFtZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVsZmlsbEluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5vdGlmaWVyRm9yRXZlbnQob2JqZWN0LCBldmVudE5hbWUsIGNyZWF0ZUlmVW5kZWZpbmVkID0gZmFsc2UpIHtcbiAgICBpZiAob2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID0ge307XG4gICAgfVxuICAgIGxldCBub3RpZmllciA9IG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbm90aWZpZXIgJiYgY3JlYXRlSWZVbmRlZmluZWQpIHtcbiAgICAgICAgbm90aWZpZXIgPSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSA9IG5ldyBOb3RpZmllcigpO1xuICAgIH1cbiAgICByZXR1cm4gbm90aWZpZXI7XG59XG5mdW5jdGlvbiByZW1vdmVOb3RpZmllckZvckV2ZW50KG9iamVjdCwgZXZlbnROYW1lKSB7XG4gICAgaWYgKG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyAmJiBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSkge1xuICAgICAgICBkZWxldGUgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV07XG4gICAgfVxufVxuZnVuY3Rpb24gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxpc3RlbmVyO1xuICAgICAgICBbbGlzdGVuZXIsIC4uLmxpc3RlbmVyc10gPSBsaXN0ZW5lcnM7XG4gICAgICAgIGxldCBbY2FsbGJhY2ssIGJpbmRpbmddID0gbGlzdGVuZXI7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzcG9uc2UpLnRoZW4oKCkgPT4gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpKS5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=