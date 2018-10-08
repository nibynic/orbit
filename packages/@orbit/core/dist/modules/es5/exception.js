function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
export var Exception =
/**
 * Creates an instance of Exception.
 *
 * @param {string} message
 *
 * @memberOf Exception
 */
function Exception(message) {
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
export var NotLoggedException = function (_Exception) {
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
export var OutOfRangeException = function (_Exception2) {
    _inherits(OutOfRangeException, _Exception2);

    function OutOfRangeException(value) {
        _classCallCheck(this, OutOfRangeException);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, "Out of range: " + value));

        _this2.value = value;
        return _this2;
    }

    return OutOfRangeException;
}(Exception);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJFeGNlcHRpb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJFcnJvciIsInN0YWNrIiwiTm90TG9nZ2VkRXhjZXB0aW9uIiwiaWQiLCJPdXRPZlJhbmdlRXhjZXB0aW9uIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztBQU1BLFdBQWFBLFNBQWI7QUFDSTs7Ozs7OztBQU9BLG1CQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFJQyxLQUFKLENBQVUsS0FBS0YsT0FBZixDQUFiO0FBQ0EsU0FBS0csS0FBTCxHQUFhLEtBQUtGLEtBQUwsQ0FBV0UsS0FBeEI7QUFDSCxDQVpMO0FBY0E7Ozs7Ozs7QUFPQSxXQUFhQyxrQkFBYjtBQUFBOztBQUNJLGdDQUFZQyxFQUFaLEVBQWdCO0FBQUE7O0FBQUEscURBQ1osOENBQTRCQSxFQUE1QixDQURZOztBQUVaLGNBQUtBLEVBQUwsR0FBVUEsRUFBVjtBQUZZO0FBR2Y7O0FBSkw7QUFBQSxFQUF3Q04sU0FBeEM7QUFNQTs7Ozs7OztBQU9BLFdBQWFPLG1CQUFiO0FBQUE7O0FBQ0ksaUNBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzREFDZiwwQ0FBdUJBLEtBQXZCLENBRGU7O0FBRWYsZUFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBRmU7QUFHbEI7O0FBSkw7QUFBQSxFQUF5Q1IsU0FBekMiLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGV4Y2VwdGlvbiBjbGFzcy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgRXhjZXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBFeGNlcHRpb24ge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRXhjZXB0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBFeGNlcHRpb25cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5zdGFjayA9IHRoaXMuZXJyb3Iuc3RhY2s7XG4gICAgfVxufVxuLyoqXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYW4gaXRlbSBkb2VzIG5vdCBleGlzdCBpbiBhIGxvZy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTm90TG9nZ2VkRXhjZXB0aW9uXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgTm90TG9nZ2VkRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xuICAgICAgICBzdXBlcihgQWN0aW9uIG5vdCBsb2dnZWQ6ICR7aWR9YCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9XG59XG4vKipcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhIHZhbHVlIGlzIG91dHNpZGUgYW4gYWxsb3dlZCByYW5nZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgT3V0T2ZSYW5nZUV4Y2VwdGlvblxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIE91dE9mUmFuZ2VFeGNlcHRpb24gZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgICAgIHN1cGVyKGBPdXQgb2YgcmFuZ2U6ICR7dmFsdWV9YCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59Il19