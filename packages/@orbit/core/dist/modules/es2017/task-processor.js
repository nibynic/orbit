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
export default class TaskProcessor {
    /**
     * Creates an instance of TaskProcessor.
     *
     * @param {Taskable} target Target that performs tasks
     * @param {Task} task Task to be performed
     *
     * @memberOf TaskProcessor
     */
    constructor(target, task) {
        this.target = target;
        this.task = task;
        this.reset();
    }
    /**
     * Clears the processor state, allowing for a fresh call to `process()`.
     *
     * @memberOf TaskProcessor
     */
    reset() {
        this._started = false;
        this._settled = false;
        this._settlement = new Orbit.Promise((resolve, reject) => {
            this._success = r => {
                this._settled = true;
                resolve(r);
            };
            this._fail = e => {
                this._settled = true;
                reject(e);
            };
        });
    }
    /**
     * Has `process` been invoked?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskProcessor
     */
    get started() {
        return this._started;
    }
    /**
     * Has `process` been invoked and settled?
     *
     * @readonly
     * @type {boolean}
     * @memberOf TaskProcessor
     */
    get settled() {
        return this._settled;
    }
    /**
     * The eventual result of processing.
     *
     * @returns {Promise<any>}
     *
     * @memberOf TaskProcessor
     */
    settle() {
        return this._settlement;
    }
    /**
     * Invokes `perform` on the target.
     *
     * @returns {Promise<any>} The result of processing
     *
     * @memberOf TaskProcessor
     */
    process() {
        if (!this._started) {
            this._started = true;
            this.target.perform(this.task).then(this._success, this._fail);
        }
        return this.settle();
    }
}