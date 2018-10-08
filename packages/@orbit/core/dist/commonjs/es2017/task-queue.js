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

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let TaskQueue = class TaskQueue {
    /**
     * Creates an instance of `TaskQueue`.
     *
     * @param {Performer} target
     * @param {TaskQueueOptions} [options={}]
     *
     * @memberOf TaskQueue
     */
    constructor(target, settings = {}) {
        (0, _utils.assert)('TaskQueue requires Orbit.Promise to be defined', _main2.default.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            (0, _utils.assert)('TaskQueue requires a name if it has a bucket', !!this._name);
        }
        this._reify().then(() => {
            if (this.length > 0 && this.autoProcess) {
                this.process();
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
    get name() {
        return this._name;
    }
    /**
     * The object which will `perform` the tasks in this queue.
     *
     * @readonly
     * @type {Performer}
     * @memberOf TaskQueue
     */
    get performer() {
        return this._performer;
    }
    /**
     * A bucket used to persist the state of this queue.
     *
     * @readonly
     * @type {Bucket}
     * @memberOf TaskQueue
     */
    get bucket() {
        return this._bucket;
    }
    /**
     * The number of tasks in the queue.
     *
     * @readonly
     * @type {number}
     * @memberOf TaskQueue
     */
    get length() {
        return this._tasks ? this._tasks.length : 0;
    }
    /**
     * The tasks in the queue.
     *
     * @readonly
     * @type {Task[]}
     * @memberOf TaskQueue
     */
    get entries() {
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
    get current() {
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
    get currentProcessor() {
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
    get error() {
        return this._error;
    }
    /**
     * Is the queue empty?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskQueue
     */
    get empty() {
        return this.length === 0;
    }
    /**
     * Is the queue actively processing a task?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskQueue
     */
    get processing() {
        const processor = this.currentProcessor;
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
    get reified() {
        return this._reified;
    }
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
    push(task) {
        let processor = new _taskProcessor2.default(this._performer, task);
        return this._reified.then(() => {
            this._tasks.push(task);
            this._processors.push(processor);
            return this._persist();
        }).then(() => this._settle(processor));
    }
    /**
     * Cancels and re-tries processing the current task.
     *
     * Returns a promise that resolves when the pushed task has been processed.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    retry() {
        let processor;
        return this._reified.then(() => {
            this._cancel();
            processor = this.currentProcessor;
            processor.reset();
            return this._persist();
        }).then(() => this._settle(processor, true));
    }
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
    skip() {
        return this._reified.then(() => {
            this._cancel();
            this._tasks.shift();
            this._processors.shift();
            return this._persist();
        }).then(() => this._settle());
    }
    /**
     * Cancels the current task and completely clears the queue.
     *
     * @returns {Promise<void>}
     *
     * @memberOf TaskQueue
     */
    clear() {
        return this._reified.then(() => {
            this._cancel();
            this._tasks = [];
            this._processors = [];
            return this._persist();
        }).then(() => this._settle(null, true));
    }
    /**
     * Cancels the current task and removes it, but does not continue processing.
     *
     * Returns the canceled and removed task.
     *
     * @returns {Promise<Task>}
     *
     * @memberOf TaskQueue
     */
    shift() {
        let task;
        return this._reified.then(() => {
            this._cancel();
            task = this._tasks.shift();
            this._processors.shift();
            return this._persist();
        }).then(() => task);
    }
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
    unshift(task) {
        let processor = new _taskProcessor2.default(this._performer, task);
        return this._reified.then(() => {
            this._cancel();
            this._tasks.unshift(task);
            this._processors.unshift(processor);
            return this._persist();
        }).then(() => this._settle(processor));
    }
    /**
     * Processes all the tasks in the queue. Resolves when the queue is empty.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskQueue
     */
    process() {
        return this._reified.then(() => {
            let resolution = this._resolution;
            if (!resolution) {
                if (this._tasks.length === 0) {
                    resolution = this._complete();
                } else {
                    this._error = null;
                    this._resolution = resolution = new _main2.default.Promise((resolve, reject) => {
                        this._resolve = resolve;
                        this._reject = reject;
                    });
                    this._settleEach(resolution);
                }
            }
            return resolution;
        });
    }
    _settle(processor, alwaysProcess) {
        if (this.autoProcess || alwaysProcess) {
            let settle = processor ? () => processor.settle() : () => {};
            return this.process().then(settle, settle);
        } else if (processor) {
            return processor.settle();
        } else {
            return _main2.default.Promise.resolve();
        }
    }
    _complete() {
        if (this._resolve) {
            this._resolve();
        }
        this._resolve = null;
        this._reject = null;
        this._error = null;
        this._resolution = null;
        return (0, _evented.settleInSeries)(this, 'complete');
    }
    _fail(task, e) {
        if (this._reject) {
            this._reject(e);
        }
        this._resolve = null;
        this._reject = null;
        this._error = e;
        this._resolution = null;
        return (0, _evented.settleInSeries)(this, 'fail', task, e);
    }
    _cancel() {
        this._error = null;
        this._resolution = null;
    }
    _settleEach(resolution) {
        if (this._tasks.length === 0) {
            return this._complete();
        } else {
            let task = this._tasks[0];
            let processor = this._processors[0];
            return (0, _evented.settleInSeries)(this, 'beforeTask', task).then(() => processor.process()).then(result => {
                if (resolution === this._resolution) {
                    this._tasks.shift();
                    this._processors.shift();
                    return this._persist().then(() => (0, _evented.settleInSeries)(this, 'task', task)).then(() => this._settleEach(resolution));
                }
            }).catch(e => {
                if (resolution === this._resolution) {
                    return this._fail(task, e);
                }
            });
        }
    }
    _reify() {
        this._tasks = [];
        this._processors = [];
        if (this._bucket) {
            this._reified = this._bucket.getItem(this._name).then(tasks => {
                if (tasks) {
                    this._tasks = tasks;
                    this._processors = tasks.map(task => new _taskProcessor2.default(this._performer, task));
                }
            });
        } else {
            this._reified = _main2.default.Promise.resolve();
        }
        return this._reified;
    }
    _persist() {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        } else {
            return _main2.default.Promise.resolve();
        }
    }
};
TaskQueue = __decorate([_evented2.default], TaskQueue);
exports.default = TaskQueue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2stcXVldWUuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiVGFza1F1ZXVlIiwiY29uc3RydWN0b3IiLCJzZXR0aW5ncyIsIk9yYml0IiwiUHJvbWlzZSIsIl9wZXJmb3JtZXIiLCJfbmFtZSIsIm5hbWUiLCJfYnVja2V0IiwiYnVja2V0IiwiYXV0b1Byb2Nlc3MiLCJ1bmRlZmluZWQiLCJfcmVpZnkiLCJ0aGVuIiwicHJvY2VzcyIsInBlcmZvcm1lciIsIl90YXNrcyIsImVudHJpZXMiLCJjdXJyZW50IiwiY3VycmVudFByb2Nlc3NvciIsIl9wcm9jZXNzb3JzIiwiZXJyb3IiLCJfZXJyb3IiLCJlbXB0eSIsInByb2Nlc3NpbmciLCJwcm9jZXNzb3IiLCJzdGFydGVkIiwic2V0dGxlZCIsInJlaWZpZWQiLCJfcmVpZmllZCIsInB1c2giLCJ0YXNrIiwiVGFza1Byb2Nlc3NvciIsIl9wZXJzaXN0IiwiX3NldHRsZSIsInJldHJ5IiwiX2NhbmNlbCIsInJlc2V0Iiwic2tpcCIsInNoaWZ0IiwiY2xlYXIiLCJ1bnNoaWZ0IiwicmVzb2x1dGlvbiIsIl9yZXNvbHV0aW9uIiwiX2NvbXBsZXRlIiwicmVzb2x2ZSIsInJlamVjdCIsIl9yZXNvbHZlIiwiX3JlamVjdCIsIl9zZXR0bGVFYWNoIiwiYWx3YXlzUHJvY2VzcyIsInNldHRsZSIsIl9mYWlsIiwiZSIsInJlc3VsdCIsImNhdGNoIiwiZ2V0SXRlbSIsInRhc2tzIiwibWFwIiwiZW1pdCIsInNldEl0ZW0iLCJldmVudGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFPQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQVZBLElBQUlBLGFB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RUFBbUMwQixJQUFuQyxDQUFsQixDQUFuQjtBQUNIO0FBQ0osYUFMZSxDQUFoQjtBQU1ILFNBUEQsTUFPTztBQUNILGlCQUFLRixRQUFMLEdBQWdCMUIsZUFBTUMsT0FBTixDQUFjeUMsT0FBZCxFQUFoQjtBQUNIO0FBQ0QsZUFBTyxLQUFLaEIsUUFBWjtBQUNIO0FBQ0RJLGVBQVc7QUFDUCxhQUFLMEIsSUFBTCxDQUFVLFFBQVY7QUFDQSxZQUFJLEtBQUtuRCxPQUFULEVBQWtCO0FBQ2QsbUJBQU8sS0FBS0EsT0FBTCxDQUFhb0QsT0FBYixDQUFxQixLQUFLdEQsS0FBMUIsRUFBaUMsS0FBS1UsTUFBdEMsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPYixlQUFNQyxPQUFOLENBQWN5QyxPQUFkLEVBQVA7QUFDSDtBQUNKO0FBOVYyQixDQUFoQztBQWdXQTdDLFlBQVloQixXQUFXLENBQUM2RSxpQkFBRCxDQUFYLEVBQXNCN0QsU0FBdEIsQ0FBWjtrQkFDZUEsUyIsImZpbGUiOiJ0YXNrLXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCBPcmJpdCBmcm9tICcuL21haW4nO1xuaW1wb3J0IFRhc2tQcm9jZXNzb3IgZnJvbSAnLi90YXNrLXByb2Nlc3Nvcic7XG5pbXBvcnQgZXZlbnRlZCwgeyBzZXR0bGVJblNlcmllcyB9IGZyb20gJy4vZXZlbnRlZCc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuLyoqXG4gKiBgVGFza1F1ZXVlYCBpcyBhIEZJRk8gcXVldWUgb2YgYXN5bmNocm9ub3VzIHRhc2tzIHRoYXQgc2hvdWxkIGJlXG4gKiBwZXJmb3JtZWQgc2VxdWVudGlhbGx5LlxuICpcbiAqIFRhc2tzIGFyZSBhZGRlZCB0byB0aGUgcXVldWUgd2l0aCBgcHVzaGAuIEVhY2ggdGFzayB3aWxsIGJlIHByb2Nlc3NlZCBieVxuICogY2FsbGluZyBpdHMgYHByb2Nlc3NgIG1ldGhvZC5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0YXNrIHF1ZXVlcyB3aWxsIGJlIHByb2Nlc3NlZCBhdXRvbWF0aWNhbGx5LCBhcyBzb29uIGFzIHRhc2tzXG4gKiBhcmUgcHVzaGVkIHRvIHRoZW0uIFRoaXMgY2FuIGJlIG92ZXJyaWRkZW4gYnkgc2V0dGluZyB0aGUgYGF1dG9Qcm9jZXNzYFxuICogc2V0dGluZyB0byBgZmFsc2VgIGFuZCBjYWxsaW5nIGBwcm9jZXNzYCB3aGVuIHlvdSdkIGxpa2UgdG8gc3RhcnRcbiAqIHByb2Nlc3NpbmcuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFRhc2tRdWV1ZVxuICogQGltcGxlbWVudHMge0V2ZW50ZWR9XG4gKi9cbmxldCBUYXNrUXVldWUgPSBjbGFzcyBUYXNrUXVldWUge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYFRhc2tRdWV1ZWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BlcmZvcm1lcn0gdGFyZ2V0XG4gICAgICogQHBhcmFtIHtUYXNrUXVldWVPcHRpb25zfSBbb3B0aW9ucz17fV1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdUYXNrUXVldWUgcmVxdWlyZXMgT3JiaXQuUHJvbWlzZSB0byBiZSBkZWZpbmVkJywgT3JiaXQuUHJvbWlzZSk7XG4gICAgICAgIHRoaXMuX3BlcmZvcm1lciA9IHRhcmdldDtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHNldHRpbmdzLm5hbWU7XG4gICAgICAgIHRoaXMuX2J1Y2tldCA9IHNldHRpbmdzLmJ1Y2tldDtcbiAgICAgICAgdGhpcy5hdXRvUHJvY2VzcyA9IHNldHRpbmdzLmF1dG9Qcm9jZXNzID09PSB1bmRlZmluZWQgPyB0cnVlIDogc2V0dGluZ3MuYXV0b1Byb2Nlc3M7XG4gICAgICAgIGlmICh0aGlzLl9idWNrZXQpIHtcbiAgICAgICAgICAgIGFzc2VydCgnVGFza1F1ZXVlIHJlcXVpcmVzIGEgbmFtZSBpZiBpdCBoYXMgYSBidWNrZXQnLCAhIXRoaXMuX25hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlaWZ5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPiAwICYmIHRoaXMuYXV0b1Byb2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5hbWUgdXNlZCBmb3IgdHJhY2tpbmcgLyBkZWJ1Z2dpbmcgdGhpcyBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIG9iamVjdCB3aGljaCB3aWxsIGBwZXJmb3JtYCB0aGUgdGFza3MgaW4gdGhpcyBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtQZXJmb3JtZXJ9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBwZXJmb3JtZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJmb3JtZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgYnVja2V0IHVzZWQgdG8gcGVyc2lzdCB0aGUgc3RhdGUgb2YgdGhpcyBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtCdWNrZXR9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBidWNrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgdGFza3MgaW4gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Rhc2tzID8gdGhpcy5fdGFza3MubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHRhc2tzIGluIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtUYXNrW119XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBlbnRyaWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFza3M7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHRhc2sgYmVpbmcgcHJvY2Vzc2VkIChpZiBhY3RpdmVseSBwcm9jZXNzaW5nKSwgb3IgdGhlIG5leHRcbiAgICAgKiB0YXNrIHRvIGJlIHByb2Nlc3NlZCAoaWYgbm90IGFjdGl2ZWx5IHByb2Nlc3NpbmcpLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge1Rhc2t9XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBjdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFza3MgJiYgdGhpcy5fdGFza3NbMF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9jZXNzb3Igd3JhcHBlciB0aGF0IGlzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzayAob3IgbmV4dCB0YXNrLFxuICAgICAqIGlmIG5vbmUgYXJlIGJlaW5nIHByb2Nlc3NlZCkuXG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7VGFza1Byb2Nlc3Nvcn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IGN1cnJlbnRQcm9jZXNzb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9jZXNzb3JzICYmIHRoaXMuX3Byb2Nlc3NvcnNbMF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIGFuIGVycm9yIG9jY3VycyB3aGlsZSBwcm9jZXNzaW5nIGEgdGFzaywgcHJvY2Vzc2luZyB3aWxsIGJlIGhhbHRlZCwgdGhlXG4gICAgICogYGZhaWxgIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCwgYW5kIHRoaXMgcHJvcGVydHkgd2lsbCByZWZsZWN0IHRoZSBlcnJvclxuICAgICAqIGVuY291bnRlcmVkLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0Vycm9yfVxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBnZXQgZXJyb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lcnJvcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSXMgdGhlIHF1ZXVlIGVtcHR5P1xuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCBlbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJcyB0aGUgcXVldWUgYWN0aXZlbHkgcHJvY2Vzc2luZyBhIHRhc2s/XG4gICAgICpcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgZ2V0IHByb2Nlc3NpbmcoKSB7XG4gICAgICAgIGNvbnN0IHByb2Nlc3NvciA9IHRoaXMuY3VycmVudFByb2Nlc3NvcjtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NvciAhPT0gdW5kZWZpbmVkICYmIHByb2Nlc3Nvci5zdGFydGVkICYmICFwcm9jZXNzb3Iuc2V0dGxlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgd2hlbiB0aGUgcXVldWUgaGFzIGJlZW4gZnVsbHkgcmVpZmllZCBmcm9tIGl0cyBhc3NvY2lhdGVkIGJ1Y2tldCxcbiAgICAgKiBpZiBhcHBsaWNhYmxlLlxuICAgICAqXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge1Byb21pc2U8dm9pZD59XG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIGdldCByZWlmaWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVzaCBhIG5ldyB0YXNrIG9udG8gdGhlIGVuZCBvZiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBJZiBgYXV0b1Byb2Nlc3NgIGlzIGVuYWJsZWQsIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcHJvY2Vzc2luZyBvZlxuICAgICAqIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgcHVzaGVkIHRhc2sgaGFzIGJlZW4gcHJvY2Vzc2VkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUYXNrfSB0YXNrXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgcHVzaCh0YXNrKSB7XG4gICAgICAgIGxldCBwcm9jZXNzb3IgPSBuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzLnB1c2godGFzayk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnB1c2gocHJvY2Vzc29yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5fc2V0dGxlKHByb2Nlc3NvcikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIGFuZCByZS10cmllcyBwcm9jZXNzaW5nIHRoZSBjdXJyZW50IHRhc2suXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHB1c2hlZCB0YXNrIGhhcyBiZWVuIHByb2Nlc3NlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHJldHJ5KCkge1xuICAgICAgICBsZXQgcHJvY2Vzc29yO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbCgpO1xuICAgICAgICAgICAgcHJvY2Vzc29yID0gdGhpcy5jdXJyZW50UHJvY2Vzc29yO1xuICAgICAgICAgICAgcHJvY2Vzc29yLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuX3NldHRsZShwcm9jZXNzb3IsIHRydWUpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FuY2VscyBhbmQgZGlzY2FyZHMgdGhlIGN1cnJlbnQgdGFzay5cbiAgICAgKlxuICAgICAqIElmIGBhdXRvUHJvY2Vzc2AgaXMgZW5hYmxlZCwgdGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciBwcm9jZXNzaW5nIG9mXG4gICAgICogdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgc2tpcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuX3NldHRsZSgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FuY2VscyB0aGUgY3VycmVudCB0YXNrIGFuZCBjb21wbGV0ZWx5IGNsZWFycyB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBUYXNrUXVldWVcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Rhc2tzID0gW107XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gW107XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuX3NldHRsZShudWxsLCB0cnVlKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgdGhlIGN1cnJlbnQgdGFzayBhbmQgcmVtb3ZlcyBpdCwgYnV0IGRvZXMgbm90IGNvbnRpbnVlIHByb2Nlc3NpbmcuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIHRoZSBjYW5jZWxlZCBhbmQgcmVtb3ZlZCB0YXNrLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8VGFzaz59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgc2hpZnQoKSB7XG4gICAgICAgIGxldCB0YXNrO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbCgpO1xuICAgICAgICAgICAgdGFzayA9IHRoaXMuX3Rhc2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzLnNoaWZ0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHRhc2spO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIHByb2Nlc3NpbmcgdGhlIGN1cnJlbnQgdGFzayBhbmQgaW5zZXJ0cyBhIG5ldyB0YXNrIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgKiBvZiB0aGUgcXVldWUuIFRoaXMgbmV3IHRhc2sgd2lsbCBiZSBwcm9jZXNzZWQgbmV4dC5cbiAgICAgKlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgbmV3IHRhc2sgaGFzIGJlZW4gcHJvY2Vzc2VkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUYXNrfSB0YXNrXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgVGFza1F1ZXVlXG4gICAgICovXG4gICAgdW5zaGlmdCh0YXNrKSB7XG4gICAgICAgIGxldCBwcm9jZXNzb3IgPSBuZXcgVGFza1Byb2Nlc3Nvcih0aGlzLl9wZXJmb3JtZXIsIHRhc2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbCgpO1xuICAgICAgICAgICAgdGhpcy5fdGFza3MudW5zaGlmdCh0YXNrKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMudW5zaGlmdChwcm9jZXNzb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGUocHJvY2Vzc29yKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBhbGwgdGhlIHRhc2tzIGluIHRoZSBxdWV1ZS4gUmVzb2x2ZXMgd2hlbiB0aGUgcXVldWUgaXMgZW1wdHkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgICAqXG4gICAgICogQG1lbWJlck9mIFRhc2tRdWV1ZVxuICAgICAqL1xuICAgIHByb2Nlc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc29sdXRpb24gPSB0aGlzLl9yZXNvbHV0aW9uO1xuICAgICAgICAgICAgaWYgKCFyZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHV0aW9uID0gdGhpcy5fY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSByZXNvbHV0aW9uID0gbmV3IE9yYml0LlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QgPSByZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0bGVFYWNoKHJlc29sdXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNvbHV0aW9uO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3NldHRsZShwcm9jZXNzb3IsIGFsd2F5c1Byb2Nlc3MpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1Byb2Nlc3MgfHwgYWx3YXlzUHJvY2Vzcykge1xuICAgICAgICAgICAgbGV0IHNldHRsZSA9IHByb2Nlc3NvciA/ICgpID0+IHByb2Nlc3Nvci5zZXR0bGUoKSA6ICgpID0+IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcygpLnRoZW4oc2V0dGxlLCBzZXR0bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3Nvcikge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvci5zZXR0bGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfY29tcGxldGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZXNvbHZlKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3JlamVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XG4gICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAnY29tcGxldGUnKTtcbiAgICB9XG4gICAgX2ZhaWwodGFzaywgZSkge1xuICAgICAgICBpZiAodGhpcy5fcmVqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3JlamVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2Vycm9yID0gZTtcbiAgICAgICAgdGhpcy5fcmVzb2x1dGlvbiA9IG51bGw7XG4gICAgICAgIHJldHVybiBzZXR0bGVJblNlcmllcyh0aGlzLCAnZmFpbCcsIHRhc2ssIGUpO1xuICAgIH1cbiAgICBfY2FuY2VsKCkge1xuICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc29sdXRpb24gPSBudWxsO1xuICAgIH1cbiAgICBfc2V0dGxlRWFjaChyZXNvbHV0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl90YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRhc2sgPSB0aGlzLl90YXNrc1swXTtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzb3IgPSB0aGlzLl9wcm9jZXNzb3JzWzBdO1xuICAgICAgICAgICAgcmV0dXJuIHNldHRsZUluU2VyaWVzKHRoaXMsICdiZWZvcmVUYXNrJywgdGFzaykudGhlbigoKSA9PiBwcm9jZXNzb3IucHJvY2VzcygpKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc29sdXRpb24gPT09IHRoaXMuX3Jlc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc29ycy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcGVyc2lzdCgpLnRoZW4oKCkgPT4gc2V0dGxlSW5TZXJpZXModGhpcywgJ3Rhc2snLCB0YXNrKSkudGhlbigoKSA9PiB0aGlzLl9zZXR0bGVFYWNoKHJlc29sdXRpb24pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x1dGlvbiA9PT0gdGhpcy5fcmVzb2x1dGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmFpbCh0YXNrLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfcmVpZnkoKSB7XG4gICAgICAgIHRoaXMuX3Rhc2tzID0gW107XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NvcnMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuX2J1Y2tldCkge1xuICAgICAgICAgICAgdGhpcy5fcmVpZmllZCA9IHRoaXMuX2J1Y2tldC5nZXRJdGVtKHRoaXMuX25hbWUpLnRoZW4odGFza3MgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXNrcyA9IHRhc2tzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9jZXNzb3JzID0gdGFza3MubWFwKHRhc2sgPT4gbmV3IFRhc2tQcm9jZXNzb3IodGhpcy5fcGVyZm9ybWVyLCB0YXNrKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZWlmaWVkID0gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlaWZpZWQ7XG4gICAgfVxuICAgIF9wZXJzaXN0KCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgICAgICBpZiAodGhpcy5fYnVja2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVja2V0LnNldEl0ZW0odGhpcy5fbmFtZSwgdGhpcy5fdGFza3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblRhc2tRdWV1ZSA9IF9fZGVjb3JhdGUoW2V2ZW50ZWRdLCBUYXNrUXVldWUpO1xuZXhwb3J0IGRlZmF1bHQgVGFza1F1ZXVlOyJdfQ==