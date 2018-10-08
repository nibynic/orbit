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

var EVENTED = exports.EVENTED = '__evented__';
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
function settleInSeries(obj, eventName) {
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
function fulfillInSeries(obj, eventName) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
    }

    var listeners = obj.listeners(eventName);
    return new _main2.default.Promise(function (resolve, reject) {
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
        var listener = void 0;
        var _listeners = listeners;
        listener = _listeners[0];
        listeners = _listeners.slice(1);
        var _listener = listener,
            callback = _listener[0],
            binding = _listener[1];

        var response = callback.apply(binding, args);
        if (response) {
            return _main2.default.Promise.resolve(response).then(function () {
                return fulfillEach(listeners, args, resolve, reject);
            }).catch(function (error) {
                return reject(error);
            });
        } else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50ZWQuanMiXSwibmFtZXMiOlsiRVZFTlRFRCIsIm9iaiIsInByb3RvIiwiS2xhc3MiLCJpc0V2ZW50ZWQiLCJiaW5kaW5nIiwiX2JpbmRpbmciLCJub3RpZmllckZvckV2ZW50Iiwibm90aWZpZXIiLCJyZW1vdmVOb3RpZmllckZvckV2ZW50IiwiY2FsbE9uY2UiLCJjYWxsYmFjayIsImFyZ3MiLCJsaXN0ZW5lcnMiLCJPcmJpdCIsImZ1bGZpbGxFYWNoIiwiY3JlYXRlSWZVbmRlZmluZWQiLCJvYmplY3QiLCJyZXNvbHZlIiwibGlzdGVuZXIiLCJyZXNwb25zZSIsInJlamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBVU8sUyxHQUFBLFM7a0JBOENRLE87UUFzRFIsYyxHQUFBLGM7UUFrQkEsZSxHQUFBLGU7Ozs7OztBQS9IUDs7Ozs7O0FBQ08sSUFBTUEsNEJBQU4sYUFBQTtBQUNQOzs7Ozs7O0FBT08sU0FBQSxTQUFBLENBQUEsR0FBQSxFQUF3QjtBQUMzQixXQUFPLENBQUMsQ0FBQ0MsSUFBVCxPQUFTQSxDQUFUO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJDZSxTQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQXdCO0FBQ25DLFFBQUlDLFFBQVFDLE1BQVosU0FBQTtBQUNBLFFBQUlDLFVBQUosS0FBSUEsQ0FBSixFQUFzQjtBQUNsQjtBQUNIO0FBQ0RGLFVBQUFBLE9BQUFBLElBQUFBLElBQUFBO0FBQ0FBLFVBQUFBLEVBQUFBLEdBQVcsVUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBeUM7QUFDaEQsWUFBTUcsVUFBVUMsWUFBaEIsSUFBQTtBQUNBQyx5QkFBQUEsSUFBQUEsRUFBQUEsU0FBQUEsRUFBQUEsSUFBQUEsRUFBQUEsV0FBQUEsQ0FBQUEsUUFBQUEsRUFBQUEsT0FBQUE7QUFGSkwsS0FBQUE7QUFJQUEsVUFBQUEsR0FBQUEsR0FBWSxVQUFBLFNBQUEsRUFBQSxRQUFBLEVB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LFdBQUEsQ0FBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQXVEO0FBQ25ELFFBQUlKLFVBQUFBLE1BQUFBLEtBQUosQ0FBQSxFQUE0QjtBQUN4Qks7QUFESixLQUFBLE1BRU87QUFDSCxZQUFJQyxXQUFBQSxLQUFKLENBQUE7QUFERyxZQUFBLGFBQUEsU0FBQTtBQUFBLG1CQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQUEsb0JBQUEsV0FBQSxLQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFBQSxZQUFBLFFBQUE7QUFBQSxZQUFBLFdBQUEsVUFBQSxDQUFBLENBQUE7QUFBQSxZQUFBLFVBQUEsVUFBQSxDQUFBLENBQUE7O0FBSUgsWUFBSUMsV0FBV1QsU0FBQUEsS0FBQUEsQ0FBQUEsT0FBQUEsRUFBZixJQUFlQSxDQUFmO0FBQ0EsWUFBQSxRQUFBLEVBQWM7QUFDVixtQkFBTyxlQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0FBcUMsWUFBQTtBQUFBLHVCQUFNSSxZQUFBQSxTQUFBQSxFQUFBQSxJQUFBQSxFQUFBQSxPQUFBQSxFQUFOLE1BQU1BLENBQU47QUFBckMsYUFBQSxFQUFBLEtBQUEsQ0FBZ0csVUFBQSxLQUFBLEVBQUE7QUFBQSx1QkFBU00sT0FBVCxLQUFTQSxDQUFUO0FBQXZHLGFBQU8sQ0FBUDtBQURKLFNBQUEsTUFFTztBQUNITix3QkFBQUEsU0FBQUEsRUFBQUEsSUFBQUEsRUFBQUEsT0FBQUEsRUFBQUEsTUFBQUE7QUFDSDtBQUNKO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCBOb3RpZmllciBmcm9tICcuL25vdGlmaWVyJztcbmV4cG9ydCBjb25zdCBFVkVOVEVEID0gJ19fZXZlbnRlZF9fJztcbi8qKlxuICogSGFzIGEgY2xhc3MgYmVlbiBkZWNvcmF0ZWQgYXMgYEBldmVudGVkYD9cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXZlbnRlZChvYmopIHtcbiAgICByZXR1cm4gISFvYmpbRVZFTlRFRF07XG59XG4vKipcbiAqIE1hcmtzIGEgY2xhc3MgYXMgZXZlbnRlZC5cbiAqXG4gKiBBbiBldmVudGVkIGNsYXNzIHNob3VsZCBhbHNvIGltcGxlbWVudCB0aGUgYEV2ZW50ZWRgIGludGVyZmFjZS5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgZXZlbnRlZCwgRXZlbnRlZCB9IGZyb20gJ0BvcmJpdC9jb3JlJztcbiAqXG4gKiBAZXZlbnRlZFxuICogY2xhc3MgU291cmNlIGltcGxlbWVudHMgRXZlbnRlZCB7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiB0aGVuIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgZm9yIHBhcnRpY3VsYXIgZXZlbnRzIHdpdGggYG9uYDpcbiAqXG4gKiBgYGB0c1xuICogbGV0IHNvdXJjZSA9IG5ldyBTb3VyY2UoKTtcbiAqXG4gKiBmdW5jdGlvbiBsaXN0ZW5lcjEobWVzc2FnZTogc3RyaW5nKSB7XG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW5lcjEgaGVhcmQgJyArIG1lc3NhZ2UpO1xuICogfTtcbiAqIGZ1bmN0aW9uIGxpc3RlbmVyMihtZXNzYWdlOiBzdHJpbmcpIHtcbiAqICAgY29uc29sZS5sb2coJ2xpc3RlbmVyMiBoZWFyZCAnICsgbWVzc2FnZSk7XG4gKiB9O1xuICpcbiAqIHNvdXJjZS5vbignZ3JlZXRpbmcnLCBsaXN0ZW5lcjEpO1xuICogc291cmNlLm9uKCdncmVldGluZycsIGxpc3RlbmVyMik7XG4gKlxuICogZXZlbnRlZC5lbWl0KCdncmVldGluZycsICdoZWxsbycpOyAvLyBsb2dzIFwibGlzdGVuZXIxIGhlYXJkIGhlbGxvXCIgYW5kXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgXCJsaXN0ZW5lcjIgaGVhcmQgaGVsbG9cIlxuICogYGBgXG4gKlxuICogTGlzdGVuZXJzIGNhbiBiZSB1bnJlZ2lzdGVyZWQgZnJvbSBldmVudHMgYXQgYW55IHRpbWUgd2l0aCBgb2ZmYDpcbiAqXG4gKiBgYGB0c1xuICogc291cmNlLm9mZignZ3JlZXRpbmcnLCBsaXN0ZW5lcjIpO1xuICogYGBgXG4gKlxuICogQGRlY29yYXRvclxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSBLbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldmVudGVkKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChpc0V2ZW50ZWQocHJvdG8pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJvdG9bRVZFTlRFRF0gPSB0cnVlO1xuICAgIHByb3RvLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSwgdHJ1ZSkuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGJpbmRpbmcpO1xuICAgIH07XG4gICAgcHJvdG8ub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBfYmluZGluZyB8fCB0aGlzO1xuICAgICAgICBjb25zdCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsYmFjaywgYmluZGluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ub25lID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2ssIF9iaW5kaW5nKSB7XG4gICAgICAgIGxldCBjYWxsT25jZTtcbiAgICAgICAgbGV0IG5vdGlmaWVyO1xuICAgICAgICBsZXQgYmluZGluZyA9IF9iaW5kaW5nIHx8IHRoaXM7XG4gICAgICAgIG5vdGlmaWVyID0gbm90aWZpZXJGb3JFdmVudCh0aGlzLCBldmVudE5hbWUsIHRydWUpO1xuICAgICAgICBjYWxsT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsT25jZSwgYmluZGluZyk7XG4gICAgICAgIH07XG4gICAgICAgIG5vdGlmaWVyLmFkZExpc3RlbmVyKGNhbGxPbmNlLCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGxldCBub3RpZmllciA9IG5vdGlmaWVyRm9yRXZlbnQodGhpcywgZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKG5vdGlmaWVyKSB7XG4gICAgICAgICAgICBub3RpZmllci5lbWl0LmFwcGx5KG5vdGlmaWVyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8ubGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBsZXQgbm90aWZpZXIgPSBub3RpZmllckZvckV2ZW50KHRoaXMsIGV2ZW50TmFtZSk7XG4gICAgICAgIHJldHVybiBub3RpZmllciA/IG5vdGlmaWVyLmxpc3RlbmVycyA6IFtdO1xuICAgIH07XG59XG4vKipcbiAqIFNldHRsZSBhbnkgcHJvbWlzZXMgcmV0dXJuZWQgYnkgZXZlbnQgbGlzdGVuZXJzIGluIHNlcmllcy5cbiAqXG4gKiBJZiBhbnkgZXJyb3JzIGFyZSBlbmNvdW50ZXJlZCBkdXJpbmcgcHJvY2Vzc2luZywgdGhleSB3aWxsIGJlIGlnbm9yZWQuXG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtFdmVudGVkfSBvYmpcbiAqIEBwYXJhbSB7YW55fSBldmVudE5hbWVcbiAqIEBwYXJhbSB7YW55fSBhcmdzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHRsZUluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBsaXN0ZW5lcnMucmVkdWNlKChjaGFpbiwgW2NhbGxiYWNrLCBiaW5kaW5nXSkgPT4ge1xuICAgICAgICByZXR1cm4gY2hhaW4udGhlbigoKSA9PiBjYWxsYmFjay5hcHBseShiaW5kaW5nLCBhcmdzKSkuY2F0Y2goZSA9PiB7fSk7XG4gICAgfSwgT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCkpO1xufVxuLyoqXG4gKiBGdWxmaWxsIGFueSBwcm9taXNlcyByZXR1cm5lZCBieSBldmVudCBsaXN0ZW5lcnMgaW4gc2VyaWVzLlxuICpcbiAqIFByb2Nlc3Npbmcgd2lsbCBzdG9wIGlmIGFuIGVycm9yIGlzIGVuY291bnRlcmVkIGFuZCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsXG4gKiBiZSByZWplY3RlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge0V2ZW50ZWR9IG9ialxuICogQHBhcmFtIHthbnl9IGV2ZW50TmFtZVxuICogQHBhcmFtIHthbnl9IGFyZ3NcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVsZmlsbEluU2VyaWVzKG9iaiwgZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gb2JqLmxpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIHJldHVybiBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5vdGlmaWVyRm9yRXZlbnQob2JqZWN0LCBldmVudE5hbWUsIGNyZWF0ZUlmVW5kZWZpbmVkID0gZmFsc2UpIHtcbiAgICBpZiAob2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzID0ge307XG4gICAgfVxuICAgIGxldCBub3RpZmllciA9IG9iamVjdC5fZXZlbnRlZE5vdGlmaWVyc1tldmVudE5hbWVdO1xuICAgIGlmICghbm90aWZpZXIgJiYgY3JlYXRlSWZVbmRlZmluZWQpIHtcbiAgICAgICAgbm90aWZpZXIgPSBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSA9IG5ldyBOb3RpZmllcigpO1xuICAgIH1cbiAgICByZXR1cm4gbm90aWZpZXI7XG59XG5mdW5jdGlvbiByZW1vdmVOb3RpZmllckZvckV2ZW50KG9iamVjdCwgZXZlbnROYW1lKSB7XG4gICAgaWYgKG9iamVjdC5fZXZlbnRlZE5vdGlmaWVycyAmJiBvYmplY3QuX2V2ZW50ZWROb3RpZmllcnNbZXZlbnROYW1lXSkge1xuICAgICAgICBkZWxldGUgb2JqZWN0Ll9ldmVudGVkTm90aWZpZXJzW2V2ZW50TmFtZV07XG4gICAgfVxufVxuZnVuY3Rpb24gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxpc3RlbmVyO1xuICAgICAgICBbbGlzdGVuZXIsIC4uLmxpc3RlbmVyc10gPSBsaXN0ZW5lcnM7XG4gICAgICAgIGxldCBbY2FsbGJhY2ssIGJpbmRpbmddID0gbGlzdGVuZXI7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGNhbGxiYWNrLmFwcGx5KGJpbmRpbmcsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUocmVzcG9uc2UpLnRoZW4oKCkgPT4gZnVsZmlsbEVhY2gobGlzdGVuZXJzLCBhcmdzLCByZXNvbHZlLCByZWplY3QpKS5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGZpbGxFYWNoKGxpc3RlbmVycywgYXJncywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=