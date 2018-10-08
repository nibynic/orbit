"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Operation processors are used to identify operations that should be performed
 * together to ensure that a `Cache` or other container of data remains
 * consistent and correct.
 *
 * `OperationProcessor` is an abstract base class to be extended by specific
 * operation processors.
 *
 * @export
 * @abstract
 * @class OperationProcessor
 */
var OperationProcessor = exports.OperationProcessor = function () {
  _createClass(OperationProcessor, [{
    key: "cache",

    /**
     * The `Cache` that is monitored.
     *
     * @readonly
     * @memberof OperationProcessor
     */
    get: function () {
      return this._cache;
    }
    /**
     * Creates an instance of OperationProcessor.
     *
     * @param {Cache} cache
     * @memberof OperationProcessor
     */

  }]);

  function OperationProcessor(cache) {
    _classCallCheck(this, OperationProcessor);

    this._cache = cache;
  }
  /**
   * Called when all the data in a cache has been reset.
   *
   * If `base` is included, the cache is being reset to match a base cache.
   *
   * @param {Cache} [base]
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.reset = function reset(base) {};
  /**
   * Allow the processor to perform an upgrade as part of a cache upgrade.
   *
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.upgrade = function upgrade() {};
  /**
   * Validates an operation before processing it.
   *
   * @param {RecordOperation} operation
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.validate = function validate(operation) {};
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **BEFORE** the `operation`
   * itself is applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.before = function before(operation) {
    return [];
  };
  /**
   * Called before an `operation` has been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * has been applied successfully.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.after = function after(operation) {
    return [];
  };
  /**
   * Called immediately after an `operation` has been applied and before the
   * `patch` event has been emitted (i.e. before any listeners have been
   * notified that the operation was applied).
   *
   * No operations may be returned.
   *
   * @param {RecordOperation} operation
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.immediate = function immediate(operation) {};
  /**
   * Called after an `operation` _and_ any related operations have been applied.
   *
   * Returns an array of operations to be applied **AFTER** the `operation`
   * itself and any operations returned from the `after` hook have been applied.
   *
   * @param {RecordOperation} operation
   * @returns {RecordOperation[]}
   * @memberof OperationProcessor
   */

  OperationProcessor.prototype.finally = function _finally(operation) {
    return [];
  };

  return OperationProcessor;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL29wZXJhdGlvbi1wcm9jZXNzb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQVlBLElBQUEsa0RBQUEsWUFBQTtBQUFBLGVBQUEsa0JBQUEsRUFBQSxDQUFBO0FBQUEsU0FBQSxPQUFBOztBQUNFOzs7Ozs7QUFERixTQUFBLFlBT2M7QUFDVixhQUFPLEtBQVAsTUFBQTtBQUNEO0FBQ0Q7Ozs7Ozs7QUFWRixHQUFBLENBQUE7O0FBZ0JFLFdBQUEsa0JBQUEsQ0FBQSxLQUFBLEVBQW1CO0FBQUEsb0JBQUEsSUFBQSxFQUFBLGtCQUFBOztBQUNqQixTQUFBLE1BQUEsR0FBQSxLQUFBO0FBQ0Q7QUFDRDs7Ozs7Ozs7O0FBbkJGLHFCQUFBLFNBQUEsQ0FBQSxLQUFBLEdBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxFQTJCYyxDQTNCZCxDQUFBO0FBNEJFOzs7Ozs7QUE1QkYscUJBQUEsU0FBQSxDQUFBLE9BQUEsR0FBQSxTQUFBLE9BQUEsR0FpQ1ksQ0FqQ1osQ0FBQTtBQWtDRTs7Ozs7OztBQWxDRixxQkFBQSxTQUFBLENBQUEsUUFBQSxHQUFBLFNBQUEsUUFBQSxDQUFBLFNBQUEsRUF3Q3NCLENBeEN0QixDQUFBO0FBeUNFOzs7Ozs7Ozs7OztBQXpDRixxQkFBQSxTQUFBLENBQUEsTUFBQSxHQUFBLFNBQUEsTUFBQSxDQUFBLFNBQUEsRUFtRG9CO0FBQ2hCLFdBQUEsRUFBQTtBQXBESixHQUFBO0FBc0RFOzs7Ozs7Ozs7OztBQXRERixxQkFBQSxTQUFBLENBQUEsS0FBQSxHQUFBLFNBQUEsS0FBQSxDQUFBLFNBQUEsRUFnRW1CO0FBQ2YsV0FBQSxFQUFBO0FBakVKLEdBQUE7QUFtRUU7Ozs7Ozs7Ozs7O0FBbkVGLHFCQUFBLFNBQUEsQ0FBQSxTQUFBLEdBQUEsU0FBQSxTQUFBLENBQUEsU0FBQSxFQTZFdUIsQ0E3RXZCLENBQUE7QUE4RUU7Ozs7Ozs7Ozs7O0FBOUVGLHFCQUFBLFNBQUEsQ0FBQSxPQUFBLEdBQUEsU0FBQSxRQUFBLENBQUEsU0FBQSxFQXdGcUI7QUFDakIsV0FBQSxFQUFBO0FBekZKLEdBQUE7O0FBQUEsU0FBQSxrQkFBQTtBQUFBLENBQUEsRUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT3BlcmF0aW9uIHByb2Nlc3NvcnMgYXJlIHVzZWQgdG8gaWRlbnRpZnkgb3BlcmF0aW9ucyB0aGF0IHNob3VsZCBiZSBwZXJmb3JtZWRcbiAqIHRvZ2V0aGVyIHRvIGVuc3VyZSB0aGF0IGEgYENhY2hlYCBvciBvdGhlciBjb250YWluZXIgb2YgZGF0YSByZW1haW5zXG4gKiBjb25zaXN0ZW50IGFuZCBjb3JyZWN0LlxuICpcbiAqIGBPcGVyYXRpb25Qcm9jZXNzb3JgIGlzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgYnkgc3BlY2lmaWNcbiAqIG9wZXJhdGlvbiBwcm9jZXNzb3JzLlxuICpcbiAqIEBleHBvcnRcbiAqIEBhYnN0cmFjdFxuICogQGNsYXNzIE9wZXJhdGlvblByb2Nlc3NvclxuICovXG5leHBvcnQgY2xhc3MgT3BlcmF0aW9uUHJvY2Vzc29yIHtcbiAgLyoqXG4gICAqIFRoZSBgQ2FjaGVgIHRoYXQgaXMgbW9uaXRvcmVkLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgZ2V0IGNhY2hlKCkge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBPcGVyYXRpb25Qcm9jZXNzb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7Q2FjaGV9IGNhY2hlXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhY2hlKSB7XG4gICAgdGhpcy5fY2FjaGUgPSBjYWNoZTtcbiAgfVxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYWxsIHRoZSBkYXRhIGluIGEgY2FjaGUgaGFzIGJlZW4gcmVzZXQuXG4gICAqXG4gICAqIElmIGBiYXNlYCBpcyBpbmNsdWRlZCwgdGhlIGNhY2hlIGlzIGJlaW5nIHJlc2V0IHRvIG1hdGNoIGEgYmFzZSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtDYWNoZX0gW2Jhc2VdXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIHJlc2V0KGJhc2UpIHt9XG4gIC8qKlxuICAgKiBBbGxvdyB0aGUgcHJvY2Vzc29yIHRvIHBlcmZvcm0gYW4gdXBncmFkZSBhcyBwYXJ0IG9mIGEgY2FjaGUgdXBncmFkZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgdXBncmFkZSgpIHt9XG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYW4gb3BlcmF0aW9uIGJlZm9yZSBwcm9jZXNzaW5nIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIHZhbGlkYXRlKG9wZXJhdGlvbikge31cbiAgLyoqXG4gICAqIENhbGxlZCBiZWZvcmUgYW4gYG9wZXJhdGlvbmAgaGFzIGJlZW4gYXBwbGllZC5cbiAgICpcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvcGVyYXRpb25zIHRvIGJlIGFwcGxpZWQgKipCRUZPUkUqKiB0aGUgYG9wZXJhdGlvbmBcbiAgICogaXRzZWxmIGlzIGFwcGxpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cbiAgICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXG4gICAqL1xuICBiZWZvcmUob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8qKlxuICAgKiBDYWxsZWQgYmVmb3JlIGFuIGBvcGVyYXRpb25gIGhhcyBiZWVuIGFwcGxpZWQuXG4gICAqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBiZSBhcHBsaWVkICoqQUZURVIqKiB0aGUgYG9wZXJhdGlvbmBcbiAgICogaGFzIGJlZW4gYXBwbGllZCBzdWNjZXNzZnVsbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cbiAgICogQHJldHVybnMge1JlY29yZE9wZXJhdGlvbltdfVxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXG4gICAqL1xuICBhZnRlcihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgLyoqXG4gICAqIENhbGxlZCBpbW1lZGlhdGVseSBhZnRlciBhbiBgb3BlcmF0aW9uYCBoYXMgYmVlbiBhcHBsaWVkIGFuZCBiZWZvcmUgdGhlXG4gICAqIGBwYXRjaGAgZXZlbnQgaGFzIGJlZW4gZW1pdHRlZCAoaS5lLiBiZWZvcmUgYW55IGxpc3RlbmVycyBoYXZlIGJlZW5cbiAgICogbm90aWZpZWQgdGhhdCB0aGUgb3BlcmF0aW9uIHdhcyBhcHBsaWVkKS5cbiAgICpcbiAgICogTm8gb3BlcmF0aW9ucyBtYXkgYmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkT3BlcmF0aW9ufSBvcGVyYXRpb25cbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgaW1tZWRpYXRlKG9wZXJhdGlvbikge31cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciBhbiBgb3BlcmF0aW9uYCBfYW5kXyBhbnkgcmVsYXRlZCBvcGVyYXRpb25zIGhhdmUgYmVlbiBhcHBsaWVkLlxuICAgKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gYmUgYXBwbGllZCAqKkFGVEVSKiogdGhlIGBvcGVyYXRpb25gXG4gICAqIGl0c2VsZiBhbmQgYW55IG9wZXJhdGlvbnMgcmV0dXJuZWQgZnJvbSB0aGUgYGFmdGVyYCBob29rIGhhdmUgYmVlbiBhcHBsaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgZmluYWxseShvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn0iXX0=