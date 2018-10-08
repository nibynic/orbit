var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Orbit from './main';
/**
 * A `TaskProcessor` performs a `Task` by calling `perform()` on its target.
 * This is triggered by calling `process()` on the processor.
 *
 * A processor maintains a promise that represents the eventual state (resolved
 * or rejected) of the task. This promise is created upon construction, and
 * will be returned by calling `settle()`.
 *
 * A task can be re-tried by first calling `reset()` on the processor. This
 * will clear the processor's state and allow `process()` to be invoked again.
 *
 * @export
 * @class TaskProcessor
 */

var TaskProcessor = function () {
    /**
     * Creates an instance of TaskProcessor.
     *
     * @param {Taskable} target Target that performs tasks
     * @param {Task} task Task to be performed
     *
     * @memberOf TaskProcessor
     */
    function TaskProcessor(target, task) {
        _classCallCheck(this, TaskProcessor);

        this.target = target;
        this.task = task;
        this.reset();
    }
    /**
     * Clears the processor state, allowing for a fresh call to `process()`.
     *
     * @memberOf TaskProcessor
     */


    TaskProcessor.prototype.reset = function reset() {
        var _this = this;

        this._started = false;
        this._settled = false;
        this._settlement = new Orbit.Promise(function (resolve, reject) {
            _this._success = function (r) {
                _this._settled = true;
                resolve(r);
            };
            _this._fail = function (e) {
                _this._settled = true;
                reject(e);
            };
        });
    };
    /**
     * Has `process` been invoked?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskProcessor
     */


    /**
     * The eventual result of processing.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskProcessor
     */
    TaskProcessor.prototype.settle = function settle() {
        return this._settlement;
    };
    /**
     * Invokes `perform` on the target.
     *
     * @returns {Promise<any>} The result of processing
     *
     * @memberOf TaskProcessor
     */


    TaskProcessor.prototype.process = function process() {
        if (!this._started) {
            this._started = true;
            this.target.perform(this.task).then(this._success, this._fail);
        }
        return this.settle();
    };

    _createClass(TaskProcessor, [{
        key: 'started',
        get: function () {
            return this._started;
        }
        /**
         * Has `process` been invoked and settled?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskProcessor
         */

    }, {
        key: 'settled',
        get: function () {
            return this._settled;
        }
    }]);

    return TaskProcessor;
}();

export default TaskProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stcHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiVGFza1Byb2Nlc3NvciIsInRhcmdldCIsInRhc2siLCJyZXNldCIsIl9zdGFydGVkIiwiX3NldHRsZWQiLCJfc2V0dGxlbWVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX3N1Y2Nlc3MiLCJyIiwiX2ZhaWwiLCJlIiwic2V0dGxlIiwicHJvY2VzcyIsInBlcmZvcm0iLCJ0aGVuIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixRQUFsQjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7SUFjcUJDLGE7QUFDakI7Ozs7Ozs7O0FBUUEsMkJBQVlDLE1BQVosRUFBb0JDLElBQXBCLEVBQTBCO0FBQUE7O0FBQ3RCLGFBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtDLEtBQUw7QUFDSDtBQUNEOzs7Ozs7OzRCQUtBQSxLLG9CQUFRO0FBQUE7O0FBQ0osYUFBS0MsUUFBTCxHQUFnQixLQUFoQjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLElBQUlQLE1BQU1RLE9BQVYsQ0FBa0IsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RELGtCQUFLQyxRQUFMLEdBQWdCLGFBQUs7QUFDakIsc0JBQUtMLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQUcsd0JBQVFHLENBQVI7QUFDSCxhQUhEO0FBSUEsa0JBQUtDLEtBQUwsR0FBYSxhQUFLO0FBQ2Qsc0JBQUtQLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQUksdUJBQU9JLENBQVA7QUFDSCxhQUhEO0FBSUgsU0FUa0IsQ0FBbkI7QUFVSCxLO0FBQ0Q7Ozs7Ozs7OztBQW9CQTs7Ozs7Ozs0QkFPQUMsTSxxQkFBUztBQUNMLGVBQU8sS0FBS1IsV0FBWjtBQUNILEs7QUFDRDs7Ozs7Ozs7OzRCQU9BUyxPLHNCQUFVO0FBQ04sWUFBSSxDQUFDLEtBQUtYLFFBQVYsRUFBb0I7QUFDaEIsaUJBQUtBLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxpQkFBS0gsTUFBTCxDQUFZZSxPQUFaLENBQW9CLEtBQUtkLElBQXpCLEVBQStCZSxJQUEvQixDQUFvQyxLQUFLUCxRQUF6QyxFQUFtRCxLQUFLRSxLQUF4RDtBQUNIO0FBQ0QsZUFBTyxLQUFLRSxNQUFMLEVBQVA7QUFDSCxLOzs7O3lCQXBDYTtBQUNWLG1CQUFPLEtBQUtWLFFBQVo7QUFDSDtBQUNEOzs7Ozs7Ozs7O3lCQU9jO0FBQ1YsbUJBQU8sS0FBS0MsUUFBWjtBQUNIOzs7Ozs7ZUFwRGdCTCxhIiwiZmlsZSI6InRhc2stcHJvY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG4vKipcbiAqIEEgYFRhc2tQcm9jZXNzb3JgIHBlcmZvcm1zIGEgYFRhc2tgIGJ5IGNhbGxpbmcgYHBlcmZvcm0oKWAgb24gaXRzIHRhcmdldC5cbiAqIFRoaXMgaXMgdHJpZ2dlcmVkIGJ5IGNhbGxpbmcgYHByb2Nlc3MoKWAgb24gdGhlIHByb2Nlc3Nvci5cbiAqXG4gKiBBIHByb2Nlc3NvciBtYWludGFpbnMgYSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgZXZlbnR1YWwgc3RhdGUgKHJlc29sdmVkXG4gKiBvciByZWplY3RlZCkgb2YgdGhlIHRhc2suIFRoaXMgcHJvbWlzZSBpcyBjcmVhdGVkIHVwb24gY29uc3RydWN0aW9uLCBhbmRcbiAqIHdpbGwgYmUgcmV0dXJuZWQgYnkgY2FsbGluZyBgc2V0dGxlKClgLlxuICpcbiAqIEEgdGFzayBjYW4gYmUgcmUtdHJpZWQgYnkgZmlyc3QgY2FsbGluZyBgcmVzZXQoKWAgb24gdGhlIHByb2Nlc3Nvci4gVGhpc1xuICogd2lsbCBjbGVhciB0aGUgcHJvY2Vzc29yJ3Mgc3RhdGUgYW5kIGFsbG93IGBwcm9jZXNzKClgIHRvIGJlIGludm9rZWQgYWdhaW4uXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFRhc2tQcm9jZXNzb3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFza1Byb2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBUYXNrUHJvY2Vzc29yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUYXNrYWJsZX0gdGFyZ2V0IFRhcmdldCB0aGF0IHBlcmZvcm1zIHRhc2tzXG4gICAgICogQHBhcmFtIHtUYXNrfSB0YXNrIFRhc2sgdG8gYmUgcGVyZm9ybWVkXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgdGFzaykge1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdGhpcy50YXNrID0gdGFzaztcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIHByb2Nlc3NvciBzdGF0ZSwgYWxsb3dpbmcgZm9yIGEgZnJlc2ggY2FsbCB0byBgcHJvY2VzcygpYC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUHJvY2Vzc29yXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2V0dGxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zZXR0bGVtZW50ID0gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc3VjY2VzcyA9IHIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fZmFpbCA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYXMgYHByb2Nlc3NgIGJlZW4gaW52b2tlZD9cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUHJvY2Vzc29yXG4gICAgICovXG4gICAgZ2V0IHN0YXJ0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYXMgYHByb2Nlc3NgIGJlZW4gaW52b2tlZCBhbmQgc2V0dGxlZD9cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUHJvY2Vzc29yXG4gICAgICovXG4gICAgZ2V0IHNldHRsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXR0bGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgZXZlbnR1YWwgcmVzdWx0IG9mIHByb2Nlc3NpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tQcm9jZXNzb3JcbiAgICAgKi9cbiAgICBzZXR0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXR0bGVtZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGBwZXJmb3JtYCBvbiB0aGUgdGFyZ2V0LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn0gVGhlIHJlc3VsdCBvZiBwcm9jZXNzaW5nXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxuICAgICAqL1xuICAgIHByb2Nlc3MoKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5wZXJmb3JtKHRoaXMudGFzaykudGhlbih0aGlzLl9zdWNjZXNzLCB0aGlzLl9mYWlsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0bGUoKTtcbiAgICB9XG59Il19