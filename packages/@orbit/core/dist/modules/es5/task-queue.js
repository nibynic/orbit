var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit from './main';
import TaskProcessor from './task-processor';
import evented, { settleInSeries } from './evented';
import { assert } from '@orbit/utils';
/**
 * `TaskQueue` is a FIFO queue of asynchronous tasks that should be
 * performed sequentially.
 *
 * Tasks are added to the queue with `push`. Each task will be processed by
 * calling its `process` method.
 *
 * By default, task queues will be processed automatically, as soon as tasks
 * are pushed to them. This can be overridden by setting the `autoProcess`
 * setting to `false` and calling `process` when you'd like to start
 * processing.
 *
 * @export
 * @class TaskQueue
 * @implements {Evented}
 */
var TaskQueue = function () {
    /**
     * Creates an instance of `TaskQueue`.
     *
     * @param {Performer} target
     * @param {TaskQueueOptions} [options={}]
     *
     * @memberOf TaskQueue
     */
    function TaskQueue(target) {
        var _this = this;

        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TaskQueue);

        assert('TaskQueue requires Orbit.Promise to be defined', Orbit.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            assert('TaskQueue requires a name if it has a bucket', !!this._name);
        }
        this._reify().then(function () {
            if (_this.length > 0 && _this.autoProcess) {
                _this.process();
            }
        });
    }
    /**
     * Name used for tracking / debugging this queue.
     *
     * @readonly
     * @type {string}
     * @memberOf TaskQueue
     */


    /**
     * Push a new task onto the end of the queue.
     *
     * If `autoProcess` is enabled, this will automatically trigger processing of
     * the queue.
     *
     * Returns a promise that resolves when the pushed task has been processed.
     *
     * @param {Task} task
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    TaskQueue.prototype.push = function push(task) {
        var _this2 = this;

        var processor = new TaskProcessor(this._performer, task);
        return this._reified.then(function () {
            _this2._tasks.push(task);
            _this2._processors.push(processor);
            return _this2._persist();
        }).then(function () {
            return _this2._settle(processor);
        });
    };
    /**
     * Cancels and re-tries processing the current task.
     *
     * Returns a promise that resolves when the pushed task has been processed.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.retry = function retry() {
        var _this3 = this;

        var processor = void 0;
        return this._reified.then(function () {
            _this3._cancel();
            processor = _this3.currentProcessor;
            processor.reset();
            return _this3._persist();
        }).then(function () {
            return _this3._settle(processor, true);
        });
    };
    /**
     * Cancels and discards the current task.
     *
     * If `autoProcess` is enabled, this will automatically trigger processing of
     * the queue.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.skip = function skip() {
        var _this4 = this;

        return this._reified.then(function () {
            _this4._cancel();
            _this4._tasks.shift();
            _this4._processors.shift();
            return _this4._persist();
        }).then(function () {
            return _this4._settle();
        });
    };
    /**
     * Cancels the current task and completely clears the queue.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.clear = function clear() {
        var _this5 = this;

        return this._reified.then(function () {
            _this5._cancel();
            _this5._tasks = [];
            _this5._processors = [];
            return _this5._persist();
        }).then(function () {
            return _this5._settle(null, true);
        });
    };
    /**
     * Cancels the current task and removes it, but does not continue processing.
     *
     * Returns the canceled and removed task.
     *
     * @returns {Promise<Task>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.shift = function shift() {
        var _this6 = this;

        var task = void 0;
        return this._reified.then(function () {
            _this6._cancel();
            task = _this6._tasks.shift();
            _this6._processors.shift();
            return _this6._persist();
        }).then(function () {
            return task;
        });
    };
    /**
     * Cancels processing the current task and inserts a new task at the beginning
     * of the queue. This new task will be processed next.
     *
     * Returns a promise that resolves when the new task has been processed.
     *
     * @param {Task} task
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.unshift = function unshift(task) {
        var _this7 = this;

        var processor = new TaskProcessor(this._performer, task);
        return this._reified.then(function () {
            _this7._cancel();
            _this7._tasks.unshift(task);
            _this7._processors.unshift(processor);
            return _this7._persist();
        }).then(function () {
            return _this7._settle(processor);
        });
    };
    /**
     * Processes all the tasks in the queue. Resolves when the queue is empty.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskQueue
     */


    TaskQueue.prototype.process = function process() {
        var _this8 = this;

        return this._reified.then(function () {
            var resolution = _this8._resolution;
            if (!resolution) {
                if (_this8._tasks.length === 0) {
                    resolution = _this8._complete();
                } else {
                    _this8._error = null;
                    _this8._resolution = resolution = new Orbit.Promise(function (resolve, reject) {
                        _this8._resolve = resolve;
                        _this8._reject = reject;
                    });
                    _this8._settleEach(resolution);
                }
            }
            return resolution;
        });
    };

    TaskQueue.prototype._settle = function _settle(processor, alwaysProcess) {
        if (this.autoProcess || alwaysProcess) {
            var settle = processor ? function () {
                return processor.settle();
            } : function () {};
            return this.process().then(settle, settle);
        } else if (processor) {
            return processor.settle();
        } else {
            return Orbit.Promise.resolve();
        }
    };

    TaskQueue.prototype._complete = function _complete() {
        if (this._resolve) {
            this._resolve();
        }
        this._resolve = null;
        this._reject = null;
        this._error = null;
        this._resolution = null;
        return settleInSeries(this, 'complete');
    };

    TaskQueue.prototype._fail = function _fail(task, e) {
        if (this._reject) {
            this._reject(e);
        }
        this._resolve = null;
        this._reject = null;
        this._error = e;
        this._resolution = null;
        return settleInSeries(this, 'fail', task, e);
    };

    TaskQueue.prototype._cancel = function _cancel() {
        this._error = null;
        this._resolution = null;
    };

    TaskQueue.prototype._settleEach = function _settleEach(resolution) {
        var _this9 = this;

        if (this._tasks.length === 0) {
            return this._complete();
        } else {
            var task = this._tasks[0];
            var processor = this._processors[0];
            return settleInSeries(this, 'beforeTask', task).then(function () {
                return processor.process();
            }).then(function (result) {
                if (resolution === _this9._resolution) {
                    _this9._tasks.shift();
                    _this9._processors.shift();
                    return _this9._persist().then(function () {
                        return settleInSeries(_this9, 'task', task);
                    }).then(function () {
                        return _this9._settleEach(resolution);
                    });
                }
            }).catch(function (e) {
                if (resolution === _this9._resolution) {
                    return _this9._fail(task, e);
                }
            });
        }
    };

    TaskQueue.prototype._reify = function _reify() {
        var _this10 = this;

        this._tasks = [];
        this._processors = [];
        if (this._bucket) {
            this._reified = this._bucket.getItem(this._name).then(function (tasks) {
                if (tasks) {
                    _this10._tasks = tasks;
                    _this10._processors = tasks.map(function (task) {
                        return new TaskProcessor(_this10._performer, task);
                    });
                }
            });
        } else {
            this._reified = Orbit.Promise.resolve();
        }
        return this._reified;
    };

    TaskQueue.prototype._persist = function _persist() {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        } else {
            return Orbit.Promise.resolve();
        }
    };

    _createClass(TaskQueue, [{
        key: "name",
        get: function () {
            return this._name;
        }
        /**
         * The object which will `perform` the tasks in this queue.
         *
         * @readonly
         * @type {Performer}
         * @memberOf TaskQueue
         */

    }, {
        key: "performer",
        get: function () {
            return this._performer;
        }
        /**
         * A bucket used to persist the state of this queue.
         *
         * @readonly
         * @type {Bucket}
         * @memberOf TaskQueue
         */

    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
        /**
         * The number of tasks in the queue.
         *
         * @readonly
         * @type {number}
         * @memberOf TaskQueue
         */

    }, {
        key: "length",
        get: function () {
            return this._tasks ? this._tasks.length : 0;
        }
        /**
         * The tasks in the queue.
         *
         * @readonly
         * @type {Task[]}
         * @memberOf TaskQueue
         */

    }, {
        key: "entries",
        get: function () {
            return this._tasks;
        }
        /**
         * The current task being processed (if actively processing), or the next
         * task to be processed (if not actively processing).
         *
         * @readonly
         * @type {Task}
         * @memberOf TaskQueue
         */

    }, {
        key: "current",
        get: function () {
            return this._tasks && this._tasks[0];
        }
        /**
         * The processor wrapper that is processing the current task (or next task,
         * if none are being processed).
         *
         * @readonly
         * @type {TaskProcessor}
         * @memberOf TaskQueue
         */

    }, {
        key: "currentProcessor",
        get: function () {
            return this._processors && this._processors[0];
        }
        /**
         * If an error occurs while processing a task, processing will be halted, the
         * `fail` event will be emitted, and this property will reflect the error
         * encountered.
         *
         * @readonly
         * @type {Error}
         * @memberOf TaskQueue
         */

    }, {
        key: "error",
        get: function () {
            return this._error;
        }
        /**
         * Is the queue empty?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskQueue
         */

    }, {
        key: "empty",
        get: function () {
            return this.length === 0;
        }
        /**
         * Is the queue actively processing a task?
         *
         * @readonly
         * @type {boolean}
         * @memberOf TaskQueue
         */

    }, {
        key: "processing",
        get: function () {
            var processor = this.currentProcessor;
            return processor !== undefined && processor.started && !processor.settled;
        }
        /**
         * Resolves when the queue has been fully reified from its associated bucket,
         * if applicable.
         *
         * @readonly
         * @type {Promise<void>}
         * @memberOf TaskQueue
         */

    }, {
        key: "reified",
        get: function () {
            return this._reified;
        }
    }]);

    return TaskQueue;
}();
TaskQueue = __decorate([evented], TaskQueue);
export default TaskQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stcXVldWUuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiT3JiaXQiLCJUYXNrUHJvY2Vzc29yIiwiZXZlbnRlZCIsInNldHRsZUluU2VyaWVzIiwiYXNzZXJ0IiwiVGFza1F1ZXVlIiwic2V0dGluZ3MiLCJQcm9taXNlIiwiX3BlcmZvcm1lciIsIl9uYW1lIiwibmFtZSIsIl9idWNrZXQiLCJidWNrZXQiLCJhdXRvUHJvY2VzcyIsInVuZGVmaW5lZCIsIl9yZWlmeSIsInRoZW4iLCJwcm9jZXNzIiwicHVzaCIsInRhc2siLCJwcm9jZXNzb3IiLCJfcmVpZmllZCIsIl90YXNrcyIsIl9wcm9jZXNzb3JzIiwiX3BlcnNpc3QiLCJfc2V0dGxlIiwicmV0cnkiLCJfY2FuY2VsIiwiY3VycmVudFByb2Nlc3NvciIsInJlc2V0Iiwic2tpcCIsInNoaWZ0IiwiY2xlYXIiLCJ1bnNoaWZ0IiwicmVzb2x1dGlvbiIsIl9yZXNvbHV0aW9uIiwiX2NvbXBsZXRlIiwiX2Vycm9yIiwicmVzb2x2ZSIsInJlamVjdCIsIl9yZXNvbHZlIiwiX3JlamVjdCIsIl9zZXR0bGVFYWNoIiwiYWx3YXlzUHJvY2VzcyIsInNldHRsZSIsIl9mYWlsIiwiZSIsImNhdGNoIiwiZ2V0SXRlbSIsInRhc2tzIiwibWFwIiwiZW1pdCIsInNldEl0ZW0iLCJzdGFydGVkIiwic2V0dGxlZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLGFBQWEsUUFBUSxLQUFLQSxVQUFiLElBQTJCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFB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SUE7QUFBQTtBQUFBLHlCQXlJYztBQUNWLG1CQUFPLEtBQUtqQyxRQUFaO0FBQ0g7QUEzSUQ7O0FBQUE7QUFBQSxHQUFKO0FBZ1dBaEIsWUFBWXJCLFdBQVcsQ0FBQ2tCLE9BQUQsQ0FBWCxFQUFzQkcsU0FBdEIsQ0FBWjtBQUNBLGVBQWVBLFNBQWYiLCJmaWxlIjoidGFzay1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQgZnJvbSAnLi9tYWluJztcbmltcG9ydCBUYXNrUHJvY2Vzc29yIGZyb20gJy4vdGFzay1wcm9jZXNzb3InO1xuaW1wb3J0IGV2ZW50ZWQsIHsgc2V0dGxlSW5TZXJpZXMgfSBmcm9tICcuL2V2ZW50ZWQnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbi8qKlxuICogYFRhc2tRdWV1ZWAgaXMgYSBGSUZPIHF1ZXVlIG9mIGFzeW5jaHJvbm91cyB0YXNrcyB0aGF0IHNob3VsZCBiZVxuICogcGVyZm9ybWVkIHNlcXVlbnRpYWxseS5cbiAqXG4gKiBUYXNrcyBhcmUgYWRkZWQgdG8gdGhlIHF1ZXVlIHdpdGggYHB1c2hgLiBFYWNoIHRhc2sgd2lsbCBiZSBwcm9jZXNzZWQgYnlcbiAqIGNhbGxpbmcgaXRzIGBwcm9jZXNzYCBtZXRob2QuXG4gKlxuICogQnkgZGVmYXVsdCwgdGFzayBxdWV1ZXMgd2lsbCBiZSBwcm9jZXNzZWQgYXV0b21hdGljYWxseSwgYXMgc29vbiBhcyB0YXNrc1xuICogYXJlIHB1c2hlZCB0byB0aGVtLiBUaGlzIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNldHRpbmcgdGhlIGBhdXRvUHJvY2Vzc2BcbiAqIHNldHRpbmcgdG8gYGZhbHNlYCBhbmQgY2FsbGluZyBgcHJvY2Vzc2Agd2hlbiB5b3UnZCBsaWtlIHRvIHN0YXJ0XG4gKiBwcm9jZXNzaW5nLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBUYXNrUXVldWVcbiAqIEBpbXBsZW1lbnRzIHtFdmVudGVkfVxuICovXG5sZXQgVGFza1F1ZXVlID0gY2xhc3MgVGFza1F1ZXVlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGBUYXNrUXVldWVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQZXJmb3JtZXJ9IHRhcmdldFxuICAgICAqIEBwYXJhbSB7VGFza1F1ZXVlT3B0aW9uc30gW29wdGlvbnM9e31dXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGFyZ2V0LCBzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnVGFza1F1ZXVlIHJlcXVpcmVzIE9yYml0LlByb21pc2UgdG8gYmUgZGVmaW5lZCcsIE9yYml0LlByb21pc2UpO1xuICAgICAgICB0aGlzLl9wZXJmb3JtZXIgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuX25hbWUgPSBzZXR0aW5ncy5uYW1lO1xuICAgICAgICB0aGlzLl9idWNrZXQgPSBzZXR0aW5ncy5idWNrZXQ7XG4gICAgICAgIHRoaXMuYXV0b1Byb2Nlc3MgPSBzZXR0aW5ncy5hdXRvUHJvY2VzcyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNldHRpbmdzLmF1dG9Qcm9jZXNzO1xuICAgICAgICBpZiAodGhpcy5fYnVja2V0KSB7XG4gICAgICAgICAgICBhc3NlcnQoJ1Rhc2tRdWV1ZSByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISF0aGlzLl9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWlmeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCAmJiB0aGlzLmF1dG9Qcm9jZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOYW1lIHVzZWQgZm9yIHRyYWNraW5nIC8gZGVidWdnaW5nIHRoaXMgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBvYmplY3Qgd2hpY2ggd2lsbCBgcGVyZm9ybWAgdGhlIHRhc2tzIGluIHRoaXMgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7UGVyZm9ybWVyfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgcGVyZm9ybWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGVyZm9ybWVyO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGJ1Y2tldCB1c2VkIHRvIHBlcnNpc3QgdGhlIHN0YXRlIG9mIHRoaXMgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7QnVja2V0fVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgYnVja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIHRhc2tzIGluIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YXNrcyA/IHRoaXMuX3Rhc2tzLmxlbmd0aCA6IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB0YXNrcyBpbiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7VGFza1tdfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rhc2tzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCB0YXNrIGJlaW5nIHByb2Nlc3NlZCAoaWYgYWN0aXZlbHkgcHJvY2Vzc2luZyksIG9yIHRoZSBuZXh0XG4gICAgICogdGFzayB0byBiZSBwcm9jZXNzZWQgKGlmIG5vdCBhY3RpdmVseSBwcm9jZXNzaW5nKS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtUYXNrfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rhc2tzICYmIHRoaXMuX3Rhc2tzWzBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcHJvY2Vzc29yIHdyYXBwZXIgdGhhdCBpcyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2sgKG9yIG5leHQgdGFzayxcbiAgICAgKiBpZiBub25lIGFyZSBiZWluZyBwcm9jZXNzZWQpLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge1Rhc2tQcm9jZXNzb3J9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBjdXJyZW50UHJvY2Vzc29yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvY2Vzc29ycyAmJiB0aGlzLl9wcm9jZXNzb3JzWzBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcHJvY2Vzc2luZyBhIHRhc2ssIHByb2Nlc3Npbmcgd2lsbCBiZSBoYWx0ZWQsIHRoZVxuICAgICAqIGBmYWlsYCBldmVudCB3aWxsIGJlIGVtaXR0ZWQsIGFuZCB0aGlzIHByb3BlcnR5IHdpbGwgcmVmbGVjdCB0aGUgZXJyb3JcbiAgICAgKiBlbmNvdW50ZXJlZC5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtFcnJvcn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGVycm9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElzIHRoZSBxdWV1ZSBlbXB0eT9cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgZW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSXMgdGhlIHF1ZXVlIGFjdGl2ZWx5IHByb2Nlc3NpbmcgYSB0YXNrP1xuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBwcm9jZXNzaW5nKCkge1xuICAgICAgICBjb25zdCBwcm9jZXNzb3IgPSB0aGlzLmN1cnJlbnRQcm9jZXNzb3I7XG4gICAgICAgIHJldHVybiBwcm9jZXNzb3IgIT09IHVuZGVmaW5lZCAmJiBwcm9jZXNzb3Iuc3RhcnRlZCAmJiAhcHJvY2Vzc29yLnNldHRsZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGhhcyBiZWVuIGZ1bGx5IHJlaWZpZWQgZnJvbSBpdHMgYXNzb2NpYXRlZCBidWNrZXQsXG4gICAgICogaWYgYXBwbGljYWJsZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgcmVpZmllZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1c2ggYSBuZXcgdGFzayBvbnRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogSWYgYGF1dG9Qcm9jZXNzYCBpcyBlbmFibGVkLCB0aGlzIHdpbGwgYXV0b21hdGljYWxseSB0cmlnZ2VyIHByb2Nlc3Npbmcgb2ZcbiAgICAgKiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHB1c2hlZCB0YXNrIGhhcyBiZWVuIHByb2Nlc3NlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGFza30gdGFza1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHB1c2godGFzaykge1xuICAgICAgICBsZXQgcHJvY2Vzc29yID0gbmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5wdXNoKHByb2Nlc3Nvcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuX3NldHRsZShwcm9jZXNzb3IpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FuY2VscyBhbmQgcmUtdHJpZXMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrLlxuICAgICAqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBwdXNoZWQgdGFzayBoYXMgYmVlbiBwcm9jZXNzZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICByZXRyeSgpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NvcjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWwoKTtcbiAgICAgICAgICAgIHByb2Nlc3NvciA9IHRoaXMuY3VycmVudFByb2Nlc3NvcjtcbiAgICAgICAgICAgIHByb2Nlc3Nvci5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGUocHJvY2Vzc29yLCB0cnVlKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgYW5kIGRpc2NhcmRzIHRoZSBjdXJyZW50IHRhc2suXG4gICAgICpcbiAgICAgKiBJZiBgYXV0b1Byb2Nlc3NgIGlzIGVuYWJsZWQsIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcHJvY2Vzc2luZyBvZlxuICAgICAqIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHNraXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsKCk7XG4gICAgICAgICAgICB0aGlzLl90YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGUoKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgdGhlIGN1cnJlbnQgdGFzayBhbmQgY29tcGxldGVseSBjbGVhcnMgdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsKCk7XG4gICAgICAgICAgICB0aGlzLl90YXNrcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycyA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGUobnVsbCwgdHJ1ZSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIHRoZSBjdXJyZW50IHRhc2sgYW5kIHJlbW92ZXMgaXQsIGJ1dCBkb2VzIG5vdCBjb250aW51ZSBwcm9jZXNzaW5nLlxuICAgICAqXG4gICAgICogUmV0dXJucyB0aGUgY2FuY2VsZWQgYW5kIHJlbW92ZWQgdGFzay5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFRhc2s+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHNoaWZ0KCkge1xuICAgICAgICBsZXQgdGFzaztcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWwoKTtcbiAgICAgICAgICAgIHRhc2sgPSB0aGlzLl90YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0YXNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FuY2VscyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2sgYW5kIGluc2VydHMgYSBuZXcgdGFzayBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICogb2YgdGhlIHF1ZXVlLiBUaGlzIG5ldyB0YXNrIHdpbGwgYmUgcHJvY2Vzc2VkIG5leHQuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIG5ldyB0YXNrIGhhcyBiZWVuIHByb2Nlc3NlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGFza30gdGFza1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHVuc2hpZnQodGFzaykge1xuICAgICAgICBsZXQgcHJvY2Vzc29yID0gbmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzLnVuc2hpZnQodGFzayk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnVuc2hpZnQocHJvY2Vzc29yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlKHByb2Nlc3NvcikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgYWxsIHRoZSB0YXNrcyBpbiB0aGUgcXVldWUuIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBwcm9jZXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNvbHV0aW9uID0gdGhpcy5fcmVzb2x1dGlvbjtcbiAgICAgICAgICAgIGlmICghcmVzb2x1dGlvbikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x1dGlvbiA9IHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gcmVzb2x1dGlvbiA9IG5ldyBPcmJpdC5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGxlRWFjaChyZXNvbHV0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9zZXR0bGUocHJvY2Vzc29yLCBhbHdheXNQcm9jZXNzKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9Qcm9jZXNzIHx8IGFsd2F5c1Byb2Nlc3MpIHtcbiAgICAgICAgICAgIGxldCBzZXR0bGUgPSBwcm9jZXNzb3IgPyAoKSA9PiBwcm9jZXNzb3Iuc2V0dGxlKCkgOiAoKSA9PiB7fTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MoKS50aGVuKHNldHRsZSwgc2V0dGxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9jZXNzb3Iuc2V0dGxlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NvbXBsZXRlKCkge1xuICAgICAgICBpZiAodGhpcy5fcmVzb2x2ZSkge1xuICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZWplY3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ2NvbXBsZXRlJyk7XG4gICAgfVxuICAgIF9mYWlsKHRhc2ssIGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlamVjdCkge1xuICAgICAgICAgICAgdGhpcy5fcmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZWplY3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9lcnJvciA9IGU7XG4gICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xuICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ2ZhaWwnLCB0YXNrLCBlKTtcbiAgICB9XG4gICAgX2NhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgX3NldHRsZUVhY2gocmVzb2x1dGlvbikge1xuICAgICAgICBpZiAodGhpcy5fdGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0YXNrID0gdGhpcy5fdGFza3NbMF07XG4gICAgICAgICAgICBsZXQgcHJvY2Vzc29yID0gdGhpcy5fcHJvY2Vzc29yc1swXTtcbiAgICAgICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAnYmVmb3JlVGFzaycsIHRhc2spLnRoZW4oKCkgPT4gcHJvY2Vzc29yLnByb2Nlc3MoKSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNvbHV0aW9uID09PSB0aGlzLl9yZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKS50aGVuKCgpID0+IHNldHRsZUluU2VyaWVzKHRoaXMsICd0YXNrJywgdGFzaykpLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlRWFjaChyZXNvbHV0aW9uKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdXRpb24gPT09IHRoaXMuX3Jlc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZhaWwodGFzaywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3JlaWZ5KCkge1xuICAgICAgICB0aGlzLl90YXNrcyA9IFtdO1xuICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gW107XG4gICAgICAgIGlmICh0aGlzLl9idWNrZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlaWZpZWQgPSB0aGlzLl9idWNrZXQuZ2V0SXRlbSh0aGlzLl9uYW1lKS50aGVuKHRhc2tzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFza3MgPSB0YXNrcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycyA9IHRhc2tzLm1hcCh0YXNrID0+IG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzaykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmVpZmllZCA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkO1xuICAgIH1cbiAgICBfcGVyc2lzdCgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICAgICAgaWYgKHRoaXMuX2J1Y2tldCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1Y2tldC5zZXRJdGVtKHRoaXMuX25hbWUsIHRoaXMuX3Rhc2tzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5UYXNrUXVldWUgPSBfX2RlY29yYXRlKFtldmVudGVkXSwgVGFza1F1ZXVlKTtcbmV4cG9ydCBkZWZhdWx0IFRhc2tRdWV1ZTsiXX0=