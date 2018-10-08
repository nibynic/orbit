var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
export var OperationProcessor = function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL29wZXJhdGlvbi1wcm9jZXNzb3IuanMiXSwibmFtZXMiOlsiT3BlcmF0aW9uUHJvY2Vzc29yIiwiX2NhY2hlIiwiY2FjaGUiLCJyZXNldCIsImJhc2UiLCJ1cGdyYWRlIiwidmFsaWRhdGUiLCJvcGVyYXRpb24iLCJiZWZvcmUiLCJhZnRlciIsImltbWVkaWF0ZSIsImZpbmFsbHkiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBWUEsV0FBYUEsa0JBQWI7QUFBQTtBQUFBOztBQUNFOzs7Ozs7QUFERixxQkFPYztBQUNWLGFBQU8sS0FBS0MsTUFBWjtBQUNEO0FBQ0Q7Ozs7Ozs7QUFWRjs7QUFnQkUsOEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0QsTUFBTCxHQUFjQyxLQUFkO0FBQ0Q7QUFDRDs7Ozs7Ozs7OztBQW5CRiwrQkEyQkVDLEtBM0JGLGtCQTJCUUMsSUEzQlIsRUEyQmMsQ0FBRSxDQTNCaEI7QUE0QkU7Ozs7Ozs7QUE1QkYsK0JBaUNFQyxPQWpDRixzQkFpQ1ksQ0FBRSxDQWpDZDtBQWtDRTs7Ozs7Ozs7QUFsQ0YsK0JBd0NFQyxRQXhDRixxQkF3Q1dDLFNBeENYLEVBd0NzQixDQUFFLENBeEN4QjtBQXlDRTs7Ozs7Ozs7Ozs7O0FBekNGLCtCQW1ERUMsTUFuREYsbUJBbURTRCxTQW5EVCxFQW1Eb0I7QUFDaEIsV0FBTyxFQUFQO0FBQ0QsR0FyREg7QUFzREU7Ozs7Ozs7Ozs7OztBQXRERiwrQkFnRUVFLEtBaEVGLGtCQWdFUUYsU0FoRVIsRUFnRW1CO0FBQ2YsV0FBTyxFQUFQO0FBQ0QsR0FsRUg7QUFtRUU7Ozs7Ozs7Ozs7OztBQW5FRiwrQkE2RUVHLFNBN0VGLHNCQTZFWUgsU0E3RVosRUE2RXVCLENBQUUsQ0E3RXpCO0FBOEVFOzs7Ozs7Ozs7Ozs7QUE5RUYsK0JBd0ZFSSxPQXhGRixxQkF3RlVKLFNBeEZWLEVBd0ZxQjtBQUNqQixXQUFPLEVBQVA7QUFDRCxHQTFGSDs7QUFBQTtBQUFBIiwiZmlsZSI6ImNhY2hlL29wZXJhdGlvbi1wcm9jZXNzb3JzL29wZXJhdGlvbi1wcm9jZXNzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE9wZXJhdGlvbiBwcm9jZXNzb3JzIGFyZSB1c2VkIHRvIGlkZW50aWZ5IG9wZXJhdGlvbnMgdGhhdCBzaG91bGQgYmUgcGVyZm9ybWVkXG4gKiB0b2dldGhlciB0byBlbnN1cmUgdGhhdCBhIGBDYWNoZWAgb3Igb3RoZXIgY29udGFpbmVyIG9mIGRhdGEgcmVtYWluc1xuICogY29uc2lzdGVudCBhbmQgY29ycmVjdC5cbiAqXG4gKiBgT3BlcmF0aW9uUHJvY2Vzc29yYCBpcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGJ5IHNwZWNpZmljXG4gKiBvcGVyYXRpb24gcHJvY2Vzc29ycy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAYWJzdHJhY3RcbiAqIEBjbGFzcyBPcGVyYXRpb25Qcm9jZXNzb3JcbiAqL1xuZXhwb3J0IGNsYXNzIE9wZXJhdGlvblByb2Nlc3NvciB7XG4gIC8qKlxuICAgKiBUaGUgYENhY2hlYCB0aGF0IGlzIG1vbml0b3JlZC5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIGdldCBjYWNoZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGU7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgT3BlcmF0aW9uUHJvY2Vzc29yLlxuICAgKlxuICAgKiBAcGFyYW0ge0NhY2hlfSBjYWNoZVxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjYWNoZSkge1xuICAgIHRoaXMuX2NhY2hlID0gY2FjaGU7XG4gIH1cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFsbCB0aGUgZGF0YSBpbiBhIGNhY2hlIGhhcyBiZWVuIHJlc2V0LlxuICAgKlxuICAgKiBJZiBgYmFzZWAgaXMgaW5jbHVkZWQsIHRoZSBjYWNoZSBpcyBiZWluZyByZXNldCB0byBtYXRjaCBhIGJhc2UgY2FjaGUuXG4gICAqXG4gICAqIEBwYXJhbSB7Q2FjaGV9IFtiYXNlXVxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXG4gICAqL1xuICByZXNldChiYXNlKSB7fVxuICAvKipcbiAgICogQWxsb3cgdGhlIHByb2Nlc3NvciB0byBwZXJmb3JtIGFuIHVwZ3JhZGUgYXMgcGFydCBvZiBhIGNhY2hlIHVwZ3JhZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIHVwZ3JhZGUoKSB7fVxuICAvKipcbiAgICogVmFsaWRhdGVzIGFuIG9wZXJhdGlvbiBiZWZvcmUgcHJvY2Vzc2luZyBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxuICAgKiBAbWVtYmVyb2YgT3BlcmF0aW9uUHJvY2Vzc29yXG4gICAqL1xuICB2YWxpZGF0ZShvcGVyYXRpb24pIHt9XG4gIC8qKlxuICAgKiBDYWxsZWQgYmVmb3JlIGFuIGBvcGVyYXRpb25gIGhhcyBiZWVuIGFwcGxpZWQuXG4gICAqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBiZSBhcHBsaWVkICoqQkVGT1JFKiogdGhlIGBvcGVyYXRpb25gXG4gICAqIGl0c2VsZiBpcyBhcHBsaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgYmVmb3JlKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICAvKipcbiAgICogQ2FsbGVkIGJlZm9yZSBhbiBgb3BlcmF0aW9uYCBoYXMgYmVlbiBhcHBsaWVkLlxuICAgKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gYmUgYXBwbGllZCAqKkFGVEVSKiogdGhlIGBvcGVyYXRpb25gXG4gICAqIGhhcyBiZWVuIGFwcGxpZWQgc3VjY2Vzc2Z1bGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHtSZWNvcmRPcGVyYXRpb25bXX1cbiAgICogQG1lbWJlcm9mIE9wZXJhdGlvblByb2Nlc3NvclxuICAgKi9cbiAgYWZ0ZXIob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8qKlxuICAgKiBDYWxsZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYW4gYG9wZXJhdGlvbmAgaGFzIGJlZW4gYXBwbGllZCBhbmQgYmVmb3JlIHRoZVxuICAgKiBgcGF0Y2hgIGV2ZW50IGhhcyBiZWVuIGVtaXR0ZWQgKGkuZS4gYmVmb3JlIGFueSBsaXN0ZW5lcnMgaGF2ZSBiZWVuXG4gICAqIG5vdGlmaWVkIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXMgYXBwbGllZCkuXG4gICAqXG4gICAqIE5vIG9wZXJhdGlvbnMgbWF5IGJlIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlY29yZE9wZXJhdGlvbn0gb3BlcmF0aW9uXG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIGltbWVkaWF0ZShvcGVyYXRpb24pIHt9XG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgYW4gYG9wZXJhdGlvbmAgX2FuZF8gYW55IHJlbGF0ZWQgb3BlcmF0aW9ucyBoYXZlIGJlZW4gYXBwbGllZC5cbiAgICpcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvcGVyYXRpb25zIHRvIGJlIGFwcGxpZWQgKipBRlRFUioqIHRoZSBgb3BlcmF0aW9uYFxuICAgKiBpdHNlbGYgYW5kIGFueSBvcGVyYXRpb25zIHJldHVybmVkIGZyb20gdGhlIGBhZnRlcmAgaG9vayBoYXZlIGJlZW4gYXBwbGllZC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWNvcmRPcGVyYXRpb259IG9wZXJhdGlvblxuICAgKiBAcmV0dXJucyB7UmVjb3JkT3BlcmF0aW9uW119XG4gICAqIEBtZW1iZXJvZiBPcGVyYXRpb25Qcm9jZXNzb3JcbiAgICovXG4gIGZpbmFsbHkob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59Il19