var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        assert('TaskQueue requires Orbit.Promise to be defined', Orbit.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            assert('TaskQueue requires a name if it has a bucket', !!this._name);
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
        let processor = new TaskProcessor(this._performer, task);
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
        let processor = new TaskProcessor(this._performer, task);
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
                    this._resolution = resolution = new Orbit.Promise((resolve, reject) => {
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
            return Orbit.Promise.resolve();
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
        return settleInSeries(this, 'complete');
    }
    _fail(task, e) {
        if (this._reject) {
            this._reject(e);
        }
        this._resolve = null;
        this._reject = null;
        this._error = e;
        this._resolution = null;
        return settleInSeries(this, 'fail', task, e);
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
            return settleInSeries(this, 'beforeTask', task).then(() => processor.process()).then(result => {
                if (resolution === this._resolution) {
                    this._tasks.shift();
                    this._processors.shift();
                    return this._persist().then(() => settleInSeries(this, 'task', task)).then(() => this._settleEach(resolution));
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
                    this._processors = tasks.map(task => new TaskProcessor(this._performer, task));
                }
            });
        } else {
            this._reified = Orbit.Promise.resolve();
        }
        return this._reified;
    }
    _persist() {
        this.emit('change');
        if (this._bucket) {
            return this._bucket.setItem(this._name, this._tasks);
        } else {
            return Orbit.Promise.resolve();
        }
    }
};
TaskQueue = __decorate([evented], TaskQueue);
export default TaskQueue;