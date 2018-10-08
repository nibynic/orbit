"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
var Exception =
/**
 * Creates an instance of Exception.
 *
 * @param {string} message
 *
 * @memberOf Exception
 */
exports.Exception = function Exception(message) {
    _classCallCheck(this, Exception);

    this.message = message;
    this.error = new Error(this.message);
    this.stack = this.error.stack;
};
/**
 * Exception raised when an item does not exist in a log.
 *
 * @export
 * @class NotLoggedException
 * @extends {Exception}
 */
var NotLoggedException = exports.NotLoggedException = function (_Exception) {
    _inherits(NotLoggedException, _Exception);

    function NotLoggedException(id) {
        _classCallCheck(this, NotLoggedException);

        var _this = _possibleConstructorReturn(this, _Exception.call(this, "Action not logged: " + id));

        _this.id = id;
        return _this;
    }

    return NotLoggedException;
}(Exception);
/**
 * Exception raised when a value is outside an allowed range.
 *
 * @export
 * @class OutOfRangeException
 * @extends {Exception}
 */
var OutOfRangeException = exports.OutOfRangeException = function (_Exception2) {
    _inherits(OutOfRangeException, _Exception2);

    function OutOfRangeException(value) {
        _classCallCheck(this, OutOfRangeException);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, "Out of range: " + value));

        _this2.value = value;
        return _this2;
    }

    return OutOfRangeException;
}(Exception);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQU1BLElBQUE7QUFDSTs7Ozs7OztBQURKLG9CQVFJLFNBQUEsU0FBQSxDQUFBLE9BQUEsRUFBcUI7QUFBQSxvQkFBQSxJQUFBLEVBQUEsU0FBQTs7QUFDakIsU0FBQSxPQUFBLEdBQUEsT0FBQTtBQUNBLFNBQUEsS0FBQSxHQUFhLElBQUEsS0FBQSxDQUFVLEtBQXZCLE9BQWEsQ0FBYjtBQUNBLFNBQUEsS0FBQSxHQUFhLEtBQUEsS0FBQSxDQUFiLEtBQUE7QUFYUixDQUFBO0FBY0E7Ozs7Ozs7QUFPQSxJQUFBLGtEQUFBLFVBQUEsVUFBQSxFQUFBO0FBQUEsY0FBQSxrQkFBQSxFQUFBLFVBQUE7O0FBQ0ksYUFBQSxrQkFBQSxDQUFBLEVBQUEsRUFBZ0I7QUFBQSx3QkFBQSxJQUFBLEVBQUEsa0JBQUE7O0FBQUEsWUFBQSxRQUFBLDJCQUFBLElBQUEsRUFDWixXQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsd0JBRFksRUFDWixDQURZLENBQUE7O0FBRVosY0FBQSxFQUFBLEdBQUEsRUFBQTtBQUZZLGVBQUEsS0FBQTtBQUdmOztBQUpMLFdBQUEsa0JBQUE7QUFBQSxDQUFBLENBQUEsU0FBQSxDQUFBO0FBTUE7Ozs7Ozs7QUFPQSxJQUFBLG9EQUFBLFVBQUEsV0FBQSxFQUFBO0FBQUEsY0FBQSxtQkFBQSxFQUFBLFdBQUE7O0FBQ0ksYUFBQSxtQkFBQSxDQUFBLEtBQUEsRUFBbUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsbUJBQUE7O0FBQUEsWUFBQSxTQUFBLDJCQUFBLElBQUEsRUFDZixZQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsbUJBRGUsS0FDZixDQURlLENBQUE7O0FBRWYsZUFBQSxLQUFBLEdBQUEsS0FBQTtBQUZlLGVBQUEsTUFBQTtBQUdsQjs7QUFKTCxXQUFBLG1CQUFBO0FBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBleGNlcHRpb24gY2xhc3MuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIEV4Y2VwdGlvblxuICovXG5leHBvcnQgY2xhc3MgRXhjZXB0aW9uIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEV4Y2VwdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgRXhjZXB0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmVycm9yID0gbmV3IEVycm9yKHRoaXMubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuc3RhY2sgPSB0aGlzLmVycm9yLnN0YWNrO1xuICAgIH1cbn1cbi8qKlxuICogRXhjZXB0aW9uIHJhaXNlZCB3aGVuIGFuIGl0ZW0gZG9lcyBub3QgZXhpc3QgaW4gYSBsb2cuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoaWQpIHtcbiAgICAgICAgc3VwZXIoYEFjdGlvbiBub3QgbG9nZ2VkOiAke2lkfWApO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxufVxuLyoqXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYSB2YWx1ZSBpcyBvdXRzaWRlIGFuIGFsbG93ZWQgcmFuZ2UuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE91dE9mUmFuZ2VFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBPdXRPZlJhbmdlRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICBzdXBlcihgT3V0IG9mIHJhbmdlOiAke3ZhbHVlfWApO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSJdfQ==