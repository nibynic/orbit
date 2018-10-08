"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _taskProcessor = require("./task-processor");

var _taskProcessor2 = _interopRequireDefault(_taskProcessor);

var _evented = require("./evented");

var _evented2 = _interopRequireDefault(_evented);

var _utils = require("@orbit/utils");

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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};

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

        (0, _utils.assert)('TaskQueue requires Orbit.Promise to be defined', _main2.default.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            (0, _utils.assert)('TaskQueue requires a name if it has a bucket', !!this._name);
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

        var processor = new _taskProcessor2.default(this._performer, task);
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

        var processor = new _taskProcessor2.default(this._performer, task);
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
                    _this8._resolution = resolution = new _main2.default.Promise(function (resolve, reject) {
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
            return _main2.default.Promise.resolve();
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
        return (0, _evented.settleInSeries)(this, 'complete');
    };

    TaskQueue.prototype._fail = function _fail(task, e) {
        if (this._reject) {
            this._reject(e);
        }
        this._resolve = null;
        this._reject = null;
        this._error = e;
        this._resolution = null;
        return (0, _evented.settleInSeries)(this, 'fail', task, e);
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
            return (0, _evented.settleInSeries)(this, 'beforeTask', task).then(function () {
                return processor.process();
            }).then(function (result) {
                if (resolution === _this9._resolution) {
                    _this9._tasks.shift();
                    _this9._processors.shift();
                    return _this9._persist().then(function () {
                        return (0, _evented.settleInSeries)(_this9, 'task', task);
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
                        return new _taskProcessor2.default(_this10._performer, task);
                    });
                }
            });
        } else {
            this._reified = _main2.default.Promise.resolve();
        }
        return this._reified;
    };

    TaskQueue.prototype._persist = function _persist() {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        } else {
            return _main2.default.Promise.resolve();
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
TaskQueue = __decorate([_evented2.default], TaskQueue);
exports.default = TaskQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stcXVldWUuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImMiLCJhcmd1bWVudHMiLCJyIiwiZGVzYyIsIk9iamVjdCIsIlJlZmxlY3QiLCJpIiwiZGVjb3JhdG9ycyIsImQiLCJzZXR0aW5ncyIsImFzc2VydCIsIk9yYml0IiwicHJvY2Vzc29yIiwidGFzayIsInJlc29sdXRpb24iLCJzZXR0bGUiLCJzZXR0bGVJblNlcmllcyIsIlRhc2tRdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBT0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVkEsSUFBSUEsYUFBYSxhQUFRLFVBQVIsVUFBQSxJQUEyQixVQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBUixNQUFBO0FBQUEsUUFDSUMsSUFBSUYsSUFBQUEsQ0FBQUEsR0FBQUEsTUFBQUEsR0FBaUJHLFNBQUFBLElBQUFBLEdBQWdCQSxPQUFPQyxPQUFBQSx3QkFBQUEsQ0FBQUEsTUFBQUEsRUFBdkJELEdBQXVCQyxDQUF2QkQsR0FEekIsSUFBQTtBQUFBLFFBQUEsQ0FBQTtBQUdBLFFBQUksT0FBQSxPQUFBLEtBQUEsUUFBQSxJQUErQixPQUFPRSxRQUFQLFFBQUEsS0FBbkMsVUFBQSxFQUEyRUgsSUFBSUcsUUFBQUEsUUFBQUEsQ0FBQUEsVUFBQUEsRUFBQUEsTUFBQUEsRUFBQUEsR0FBQUEsRUFBL0UsSUFBK0VBLENBQUpILENBQTNFLEtBQW9JLEtBQUssSUFBSUksSUFBSUMsV0FBQUEsTUFBQUEsR0FBYixDQUFBLEVBQW9DRCxLQUFwQyxDQUFBLEVBQUEsR0FBQSxFQUFBO0FBQWlELFlBQUlFLElBQUlELFdBQVIsQ0FBUUEsQ0FBUixFQUF1QkwsSUFBSSxDQUFDRixJQUFBQSxDQUFBQSxHQUFRUSxFQUFSUixDQUFRUSxDQUFSUixHQUFlQSxJQUFBQSxDQUFBQSxHQUFRUSxFQUFBQSxNQUFB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UUFBQTtBQUNIO0FBM0lELEtBQUEsQ0FBQTs7QUFBQSxXQUFBLFNBQUE7QUFBSixDQUFJLEVBQUo7QUFnV0FLLFlBQVlsQixXQUFXLENBQVhBLGlCQUFXLENBQVhBLEVBQVprQixTQUFZbEIsQ0FBWmtCO2tCQUNBLFMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9IHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsXG4gICAgICAgIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgVGFza1Byb2Nlc3NvciBmcm9tICcuL3Rhc2stcHJvY2Vzc29yJztcbmltcG9ydCBldmVudGVkLCB7IHNldHRsZUluU2VyaWVzIH0gZnJvbSAnLi9ldmVudGVkJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG4vKipcbiAqIGBUYXNrUXVldWVgIGlzIGEgRklGTyBxdWV1ZSBvZiBhc3luY2hyb25vdXMgdGFza3MgdGhhdCBzaG91bGQgYmVcbiAqIHBlcmZvcm1lZCBzZXF1ZW50aWFsbHkuXG4gKlxuICogVGFza3MgYXJlIGFkZGVkIHRvIHRoZSBxdWV1ZSB3aXRoIGBwdXNoYC4gRWFjaCB0YXNrIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5XG4gKiBjYWxsaW5nIGl0cyBgcHJvY2Vzc2AgbWV0aG9kLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRhc2sgcXVldWVzIHdpbGwgYmUgcHJvY2Vzc2VkIGF1dG9tYXRpY2FsbHksIGFzIHNvb24gYXMgdGFza3NcbiAqIGFyZSBwdXNoZWQgdG8gdGhlbS4gVGhpcyBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzZXR0aW5nIHRoZSBgYXV0b1Byb2Nlc3NgXG4gKiBzZXR0aW5nIHRvIGBmYWxzZWAgYW5kIGNhbGxpbmcgYHByb2Nlc3NgIHdoZW4geW91J2QgbGlrZSB0byBzdGFydFxuICogcHJvY2Vzc2luZy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgVGFza1F1ZXVlXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cbiAqL1xubGV0IFRhc2tRdWV1ZSA9IGNsYXNzIFRhc2tRdWV1ZSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBgVGFza1F1ZXVlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGVyZm9ybWVyfSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge1Rhc2tRdWV1ZU9wdGlvbnN9IFtvcHRpb25zPXt9XVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1Rhc2tRdWV1ZSByZXF1aXJlcyBPcmJpdC5Qcm9taXNlIHRvIGJlIGRlZmluZWQnLCBPcmJpdC5Qcm9taXNlKTtcbiAgICAgICAgdGhpcy5fcGVyZm9ybWVyID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLl9uYW1lID0gc2V0dGluZ3MubmFtZTtcbiAgICAgICAgdGhpcy5fYnVja2V0ID0gc2V0dGluZ3MuYnVja2V0O1xuICAgICAgICB0aGlzLmF1dG9Qcm9jZXNzID0gc2V0dGluZ3MuYXV0b1Byb2Nlc3MgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBzZXR0aW5ncy5hdXRvUHJvY2VzcztcbiAgICAgICAgaWYgKHRoaXMuX2J1Y2tldCkge1xuICAgICAgICAgICAgYXNzZXJ0KCdUYXNrUXVldWUgcmVxdWlyZXMgYSBuYW1lIGlmIGl0IGhhcyBhIGJ1Y2tldCcsICEhdGhpcy5fbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVpZnkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxlbmd0aCA+IDAgJiYgdGhpcy5hdXRvUHJvY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2VzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTmFtZSB1c2VkIGZvciB0cmFja2luZyAvIGRlYnVnZ2luZyB0aGlzIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgb2JqZWN0IHdoaWNoIHdpbGwgYHBlcmZvcm1gIHRoZSB0YXNrcyBpbiB0aGlzIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge1BlcmZvcm1lcn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IHBlcmZvcm1lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcmZvcm1lcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBidWNrZXQgdXNlZCB0byBwZXJzaXN0IHRoZSBzdGF0ZSBvZiB0aGlzIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0J1Y2tldH1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGJ1Y2tldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1Y2tldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiB0YXNrcyBpbiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFza3MgPyB0aGlzLl90YXNrcy5sZW5ndGggOiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgdGFza3MgaW4gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge1Rhc2tbXX1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YXNrcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdGFzayBiZWluZyBwcm9jZXNzZWQgKGlmIGFjdGl2ZWx5IHByb2Nlc3NpbmcpLCBvciB0aGUgbmV4dFxuICAgICAqIHRhc2sgdG8gYmUgcHJvY2Vzc2VkIChpZiBub3QgYWN0aXZlbHkgcHJvY2Vzc2luZykuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7VGFza31cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGN1cnJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90YXNrcyAmJiB0aGlzLl90YXNrc1swXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHByb2Nlc3NvciB3cmFwcGVyIHRoYXQgaXMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrIChvciBuZXh0IHRhc2ssXG4gICAgICogaWYgbm9uZSBhcmUgYmVpbmcgcHJvY2Vzc2VkKS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtUYXNrUHJvY2Vzc29yfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgY3VycmVudFByb2Nlc3NvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NvcnMgJiYgdGhpcy5fcHJvY2Vzc29yc1swXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHByb2Nlc3NpbmcgYSB0YXNrLCBwcm9jZXNzaW5nIHdpbGwgYmUgaGFsdGVkLCB0aGVcbiAgICAgKiBgZmFpbGAgZXZlbnQgd2lsbCBiZSBlbWl0dGVkLCBhbmQgdGhpcyBwcm9wZXJ0eSB3aWxsIHJlZmxlY3QgdGhlIGVycm9yXG4gICAgICogZW5jb3VudGVyZWQuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7RXJyb3J9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBlcnJvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJcyB0aGUgcXVldWUgZW1wdHk/XG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElzIHRoZSBxdWV1ZSBhY3RpdmVseSBwcm9jZXNzaW5nIGEgdGFzaz9cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgcHJvY2Vzc2luZygpIHtcbiAgICAgICAgY29uc3QgcHJvY2Vzc29yID0gdGhpcy5jdXJyZW50UHJvY2Vzc29yO1xuICAgICAgICByZXR1cm4gcHJvY2Vzc29yICE9PSB1bmRlZmluZWQgJiYgcHJvY2Vzc29yLnN0YXJ0ZWQgJiYgIXByb2Nlc3Nvci5zZXR0bGVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyB3aGVuIHRoZSBxdWV1ZSBoYXMgYmVlbiBmdWxseSByZWlmaWVkIGZyb20gaXRzIGFzc29jaWF0ZWQgYnVja2V0LFxuICAgICAqIGlmIGFwcGxpY2FibGUuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IHJlaWZpZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdXNoIGEgbmV3IHRhc2sgb250byB0aGUgZW5kIG9mIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIElmIGBhdXRvUHJvY2Vzc2AgaXMgZW5hYmxlZCwgdGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciBwcm9jZXNzaW5nIG9mXG4gICAgICogdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBwdXNoZWQgdGFzayBoYXMgYmVlbiBwcm9jZXNzZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Rhc2t9IHRhc2tcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBwdXNoKHRhc2spIHtcbiAgICAgICAgbGV0IHByb2Nlc3NvciA9IG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMucHVzaChwcm9jZXNzb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGUocHJvY2Vzc29yKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgYW5kIHJlLXRyaWVzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgKlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgcHVzaGVkIHRhc2sgaGFzIGJlZW4gcHJvY2Vzc2VkLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgcmV0cnkoKSB7XG4gICAgICAgIGxldCBwcm9jZXNzb3I7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsKCk7XG4gICAgICAgICAgICBwcm9jZXNzb3IgPSB0aGlzLmN1cnJlbnRQcm9jZXNzb3I7XG4gICAgICAgICAgICBwcm9jZXNzb3IucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlKHByb2Nlc3NvciwgdHJ1ZSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIGFuZCBkaXNjYXJkcyB0aGUgY3VycmVudCB0YXNrLlxuICAgICAqXG4gICAgICogSWYgYGF1dG9Qcm9jZXNzYCBpcyBlbmFibGVkLCB0aGlzIHdpbGwgYXV0b21hdGljYWxseSB0cmlnZ2VyIHByb2Nlc3Npbmcgb2ZcbiAgICAgKiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBza2lwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbCgpO1xuICAgICAgICAgICAgdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlKCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIHRoZSBjdXJyZW50IHRhc2sgYW5kIGNvbXBsZXRlbHkgY2xlYXJzIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbCgpO1xuICAgICAgICAgICAgdGhpcy5fdGFza3MgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBbXTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlKG51bGwsIHRydWUpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FuY2VscyB0aGUgY3VycmVudCB0YXNrIGFuZCByZW1vdmVzIGl0LCBidXQgZG9lcyBub3QgY29udGludWUgcHJvY2Vzc2luZy5cbiAgICAgKlxuICAgICAqIFJldHVybnMgdGhlIGNhbmNlbGVkIGFuZCByZW1vdmVkIHRhc2suXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUYXNrPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBzaGlmdCgpIHtcbiAgICAgICAgbGV0IHRhc2s7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsKCk7XG4gICAgICAgICAgICB0YXNrID0gdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMuc2hpZnQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGFzayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgcHJvY2Vzc2luZyB0aGUgY3VycmVudCB0YXNrIGFuZCBpbnNlcnRzIGEgbmV3IHRhc2sgYXQgdGhlIGJlZ2lubmluZ1xuICAgICAqIG9mIHRoZSBxdWV1ZS4gVGhpcyBuZXcgdGFzayB3aWxsIGJlIHByb2Nlc3NlZCBuZXh0LlxuICAgICAqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBuZXcgdGFzayBoYXMgYmVlbiBwcm9jZXNzZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Rhc2t9IHRhc2tcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICB1bnNoaWZ0KHRhc2spIHtcbiAgICAgICAgbGV0IHByb2Nlc3NvciA9IG5ldyBUYXNrUHJvY2Vzc29yKHRoaXMuX3BlcmZvcm1lciwgdGFzayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsKCk7XG4gICAgICAgICAgICB0aGlzLl90YXNrcy51bnNoaWZ0KHRhc2spO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy51bnNoaWZ0KHByb2Nlc3Nvcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuX3NldHRsZShwcm9jZXNzb3IpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGFsbCB0aGUgdGFza3MgaW4gdGhlIHF1ZXVlLiBSZXNvbHZlcyB3aGVuIHRoZSBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgcHJvY2VzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzb2x1dGlvbiA9IHRoaXMuX3Jlc29sdXRpb247XG4gICAgICAgICAgICBpZiAoIXJlc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdXRpb24gPSB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IHJlc29sdXRpb24gPSBuZXcgT3JiaXQuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRsZUVhY2gocmVzb2x1dGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb247XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfc2V0dGxlKHByb2Nlc3NvciwgYWx3YXlzUHJvY2Vzcykge1xuICAgICAgICBpZiAodGhpcy5hdXRvUHJvY2VzcyB8fCBhbHdheXNQcm9jZXNzKSB7XG4gICAgICAgICAgICBsZXQgc2V0dGxlID0gcHJvY2Vzc29yID8gKCkgPT4gcHJvY2Vzc29yLnNldHRsZSgpIDogKCkgPT4ge307XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzKCkudGhlbihzZXR0bGUsIHNldHRsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzc29yKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yLnNldHRsZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc29sdmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZXNvbHZlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVqZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdjb21wbGV0ZScpO1xuICAgIH1cbiAgICBfZmFpbCh0YXNrLCBlKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWplY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZXNvbHZlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVqZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlO1xuICAgICAgICB0aGlzLl9yZXNvbHV0aW9uID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdmYWlsJywgdGFzaywgZSk7XG4gICAgfVxuICAgIF9jYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XG4gICAgfVxuICAgIF9zZXR0bGVFYWNoKHJlc29sdXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX3Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGFzayA9IHRoaXMuX3Rhc2tzWzBdO1xuICAgICAgICAgICAgbGV0IHByb2Nlc3NvciA9IHRoaXMuX3Byb2Nlc3NvcnNbMF07XG4gICAgICAgICAgICByZXR1cm4gc2V0dGxlSW5TZXJpZXModGhpcywgJ2JlZm9yZVRhc2snLCB0YXNrKS50aGVuKCgpID0+IHByb2Nlc3Nvci5wcm9jZXNzKCkpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x1dGlvbiA9PT0gdGhpcy5fcmVzb2x1dGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCkudGhlbigoKSA9PiBzZXR0bGVJblNlcmllcyh0aGlzLCAndGFzaycsIHRhc2spKS50aGVuKCgpID0+IHRoaXMuX3NldHRsZUVhY2gocmVzb2x1dGlvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNvbHV0aW9uID09PSB0aGlzLl9yZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYWlsKHRhc2ssIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZWlmeSgpIHtcbiAgICAgICAgdGhpcy5fdGFza3MgPSBbXTtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc29ycyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5fYnVja2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWlmaWVkID0gdGhpcy5fYnVja2V0LmdldEl0ZW0odGhpcy5fbmFtZSkudGhlbih0YXNrcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Rhc2tzID0gdGFza3M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSB0YXNrcy5tYXAodGFzayA9PiBuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3JlaWZpZWQgPSBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZDtcbiAgICB9XG4gICAgX3BlcnNpc3QoKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgICAgIGlmICh0aGlzLl9idWNrZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWNrZXQuc2V0SXRlbSh0aGlzLl9uYW1lLCB0aGlzLl90YXNrcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuVGFza1F1ZXVlID0gX19kZWNvcmF0ZShbZXZlbnRlZF0sIFRhc2tRdWV1ZSk7XG5leHBvcnQgZGVmYXVsdCBUYXNrUXVldWU7Il19