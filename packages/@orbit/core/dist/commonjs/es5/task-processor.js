"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this._settlement = new _main2.default.Promise(function (resolve, reject) {
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

exports.default = TaskProcessor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stcHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbIlRhc2tQcm9jZXNzb3IiLCJyZXNldCIsIk9yYml0IiwicmVzb2x2ZSIsInJlamVjdCIsInNldHRsZSIsInByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztJQWNxQkEsZ0I7QUFDakI7Ozs7Ozs7O0FBUUEsYUFBQSxhQUFBLENBQUEsTUFBQSxFQUFBLElBQUEsRUFBMEI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsYUFBQTs7QUFDdEIsYUFBQSxNQUFBLEdBQUEsTUFBQTtBQUNBLGFBQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxhQUFBLEtBQUE7QUFDSDtBQUNEOzs7Ozs7NEJBS0FDLEssb0JBQVE7QUFBQSxZQUFBLFFBQUEsSUFBQTs7QUFDSixhQUFBLFFBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsV0FBQSxHQUFtQixJQUFJQyxlQUFKLE9BQUEsQ0FBa0IsVUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFxQjtBQUN0RCxrQkFBQSxRQUFBLEdBQWdCLFVBQUEsQ0FBQSxFQUFLO0FBQ2pCLHNCQUFBLFFBQUEsR0FBQSxJQUFBO0FBQ0FDLHdCQUFBQSxDQUFBQTtBQUZKLGFBQUE7QUFJQSxrQkFBQSxLQUFBLEdBQWEsVUFBQSxDQUFBLEVBQUs7QUFDZCxzQkFBQSxRQUFBLEdBQUEsSUFBQTtBQUNBQyx1QkFBQUEsQ0FBQUE7QUFGSixhQUFBO0FBTEosU0FBbUIsQ0FBbkI7O0FBV0o7Ozs7Ozs7O0FBb0JBOzs7Ozs7OzRCQU9BQyxNLHFCQUFTO0FBQ0wsZUFBTyxLQUFQLFdBQUE7O0FBRUo7Ozs7Ozs7OzRCQU9BQyxPLHNCQUFVO0FBQ04sWUFBSSxDQUFDLEtBQUwsUUFBQSxFQUFvQjtBQUNoQixpQkFBQSxRQUFBLEdBQUEsSUFBQTtBQUNBLGlCQUFBLE1BQUEsQ0FBQSxPQUFBLENBQW9CLEtBQXBCLElBQUEsRUFBQSxJQUFBLENBQW9DLEtBQXBDLFFBQUEsRUFBbUQsS0FBbkQsS0FBQTtBQUNIO0FBQ0QsZUFBTyxLQUFQLE1BQU8sRUFBUDs7Ozs7eUJBbkNVO0FBQ1YsbUJBQU8sS0FBUCxRQUFBO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozt5QkFPYztBQUNWLG1CQUFPLEtBQVAsUUFBQTtBQUNIOzs7Ozs7a0JBcERnQk4sYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuLyoqXG4gKiBBIGBUYXNrUHJvY2Vzc29yYCBwZXJmb3JtcyBhIGBUYXNrYCBieSBjYWxsaW5nIGBwZXJmb3JtKClgIG9uIGl0cyB0YXJnZXQuXG4gKiBUaGlzIGlzIHRyaWdnZXJlZCBieSBjYWxsaW5nIGBwcm9jZXNzKClgIG9uIHRoZSBwcm9jZXNzb3IuXG4gKlxuICogQSBwcm9jZXNzb3IgbWFpbnRhaW5zIGEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIGV2ZW50dWFsIHN0YXRlIChyZXNvbHZlZFxuICogb3IgcmVqZWN0ZWQpIG9mIHRoZSB0YXNrLiBUaGlzIHByb21pc2UgaXMgY3JlYXRlZCB1cG9uIGNvbnN0cnVjdGlvbiwgYW5kXG4gKiB3aWxsIGJlIHJldHVybmVkIGJ5IGNhbGxpbmcgYHNldHRsZSgpYC5cbiAqXG4gKiBBIHRhc2sgY2FuIGJlIHJlLXRyaWVkIGJ5IGZpcnN0IGNhbGxpbmcgYHJlc2V0KClgIG9uIHRoZSBwcm9jZXNzb3IuIFRoaXNcbiAqIHdpbGwgY2xlYXIgdGhlIHByb2Nlc3NvcidzIHN0YXRlIGFuZCBhbGxvdyBgcHJvY2VzcygpYCB0byBiZSBpbnZva2VkIGFnYWluLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBUYXNrUHJvY2Vzc29yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2tQcm9jZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgVGFza1Byb2Nlc3Nvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGFza2FibGV9IHRhcmdldCBUYXJnZXQgdGhhdCBwZXJmb3JtcyB0YXNrc1xuICAgICAqIEBwYXJhbSB7VGFza30gdGFzayBUYXNrIHRvIGJlIHBlcmZvcm1lZFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tQcm9jZXNzb3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIHRhc2spIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMudGFzayA9IHRhc2s7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xlYXJzIHRoZSBwcm9jZXNzb3Igc3RhdGUsIGFsbG93aW5nIGZvciBhIGZyZXNoIGNhbGwgdG8gYHByb2Nlc3MoKWAuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NldHRsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2V0dGxlbWVudCA9IG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2Nlc3MgPSByID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2ZhaWwgPSBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFzIGBwcm9jZXNzYCBiZWVuIGludm9rZWQ/XG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxuICAgICAqL1xuICAgIGdldCBzdGFydGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFzIGBwcm9jZXNzYCBiZWVuIGludm9rZWQgYW5kIHNldHRsZWQ/XG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1Byb2Nlc3NvclxuICAgICAqL1xuICAgIGdldCBzZXR0bGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGxlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBwcm9jZXNzaW5nLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUHJvY2Vzc29yXG4gICAgICovXG4gICAgc2V0dGxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGxlbWVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52b2tlcyBgcGVyZm9ybWAgb24gdGhlIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59IFRoZSByZXN1bHQgb2YgcHJvY2Vzc2luZ1xuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tQcm9jZXNzb3JcbiAgICAgKi9cbiAgICBwcm9jZXNzKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3N0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy50YXJnZXQucGVyZm9ybSh0aGlzLnRhc2spLnRoZW4odGhpcy5fc3VjY2VzcywgdGhpcy5fZmFpbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGxlKCk7XG4gICAgfVxufSJdfQ==