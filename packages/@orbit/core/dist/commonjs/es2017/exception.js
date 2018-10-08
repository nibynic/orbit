"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
class Exception {
    /**
     * Creates an instance of Exception.
     *
     * @param {string} message
     *
     * @memberOf Exception
     */
    constructor(message) {
        this.message = message;
        this.error = new Error(this.message);
        this.stack = this.error.stack;
    }
}
exports.Exception = Exception; /**
                                * Exception raised when an item does not exist in a log.
                                *
                                * @export
                                * @class NotLoggedException
                                * @extends {Exception}
                                */

class NotLoggedException extends Exception {
    constructor(id) {
        super(`Action not logged: ${id}`);
        this.id = id;
    }
}
exports.NotLoggedException = NotLoggedException; /**
                                                  * Exception raised when a value is outside an allowed range.
                                                  *
                                                  * @export
                                                  * @class OutOfRangeException
                                                  * @extends {Exception}
                                                  */

class OutOfRangeException extends Exception {
    constructor(value) {
        super(`Out of range: ${value}`);
        this.value = value;
    }
}
exports.OutOfRangeException = OutOfRangeException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJFeGNlcHRpb24iLCJjb25zdHJ1Y3RvciIsIm1lc3NhZ2UiLCJlcnJvciIsIkVycm9yIiwic3RhY2siLCJOb3RMb2dnZWRFeGNlcHRpb24iLCJpZCIsIk91dE9mUmFuZ2VFeGNlcHRpb24iLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0FBTU8sTUFBTUEsU0FBTixDQUFnQjtBQUNuQjs7Ozs7OztBQU9BQyxnQkFBWUMsT0FBWixFQUFxQjtBQUNqQixhQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxLQUFMLEdBQWEsSUFBSUMsS0FBSixDQUFVLEtBQUtGLE9BQWYsQ0FBYjtBQUNBLGFBQUtHLEtBQUwsR0FBYSxLQUFLRixLQUFMLENBQVdFLEtBQXhCO0FBQ0g7QUFaa0I7UUFBVkwsUyxHQUFBQSxTLEVBY2I7Ozs7Ozs7O0FBT08sTUFBTU0sa0JBQU4sU0FBaUNOLFNBQWpDLENBQTJDO0FBQzlDQyxnQkFBWU0sRUFBWixFQUFnQjtBQUNaLGNBQU8sc0JBQXFCQSxFQUFHLEVBQS9CO0FBQ0EsYUFBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0g7QUFKNkM7UUFBckNELGtCLEdBQUFBLGtCLEVBTWI7Ozs7Ozs7O0FBT08sTUFBTUUsbUJBQU4sU0FBa0NSLFNBQWxDLENBQTRDO0FBQy9DQyxnQkFBWVEsS0FBWixFQUFtQjtBQUNmLGNBQU8saUJBQWdCQSxLQUFNLEVBQTdCO0FBQ0EsYUFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFKOEM7UUFBdENELG1CLEdBQUFBLG1CIiwiZmlsZSI6ImV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBleGNlcHRpb24gY2xhc3MuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIEV4Y2VwdGlvblxuICovXG5leHBvcnQgY2xhc3MgRXhjZXB0aW9uIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEV4Y2VwdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgRXhjZXB0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmVycm9yID0gbmV3IEVycm9yKHRoaXMubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuc3RhY2sgPSB0aGlzLmVycm9yLnN0YWNrO1xuICAgIH1cbn1cbi8qKlxuICogRXhjZXB0aW9uIHJhaXNlZCB3aGVuIGFuIGl0ZW0gZG9lcyBub3QgZXhpc3QgaW4gYSBsb2cuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIE5vdExvZ2dlZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoaWQpIHtcbiAgICAgICAgc3VwZXIoYEFjdGlvbiBub3QgbG9nZ2VkOiAke2lkfWApO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxufVxuLyoqXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYSB2YWx1ZSBpcyBvdXRzaWRlIGFuIGFsbG93ZWQgcmFuZ2UuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE91dE9mUmFuZ2VFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBPdXRPZlJhbmdlRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICBzdXBlcihgT3V0IG9mIHJhbmdlOiAke3ZhbHVlfWApO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSJdfQ==