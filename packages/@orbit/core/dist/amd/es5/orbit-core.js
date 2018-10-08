define('@orbit/core', ['exports', '@orbit/utils'], function (exports, _orbit_utils) { 'use strict';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
//
// Source: https://github.com/jashkenas/underscore/blob/master/underscore.js#L11-L17
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
var globals = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global || {};
var Orbit = {
    globals: globals,
    Promise: globals.Promise,
    uuid: _orbit_utils.uuid
};

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        _classCallCheck$1(this, TaskProcessor);

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

    _createClass$1(TaskProcessor, [{
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

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  The `Notifier` class can emit messages to an array of subscribed listeners.
 * Here's a simple example:
 *
 * ```ts
 * import { Notifier } from '@orbit/core';
 *
 * let notifier = new Notifier();
 * notifier.addListener((message: string) => {
 *   console.log("I heard " + message);
 * });
 * notifier.addListener((message: string) => {
 *   console.log("I also heard " + message);
 * });
 *
 * notifier.emit('hello'); // logs "I heard hello" and "I also heard hello"
 * ```
 *
 * Calls to `emit` will send along all of their arguments.
 *
 * @export
 * @class Notifier
 */
var Notifier = function () {
    function Notifier() {
        _classCallCheck$2(this, Notifier);

        this.listeners = [];
    }
    /**
     * Add a callback as a listener, which will be triggered when sending
     * notifications.
     *
     * @param {Function} callback Function to call as a notification
     * @param {object} binding Context in which to call `callback`
     *
     * @memberOf Notifier
     */


    Notifier.prototype.addListener = function addListener(callback, binding) {
        binding = binding || this;
        this.listeners.push([callback, binding]);
    };
    /**
     * Remove a listener so that it will no longer receive notifications.
     *
     * @param {Function} callback Function registered as a callback
     * @param {object} binding Context in which `callback` was registered
     * @returns
     *
     * @memberOf Notifier
     */


    Notifier.prototype.removeListener = function removeListener(callback, binding) {
        var listeners = this.listeners;
        var listener = void 0;
        binding = binding || this;
        for (var i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            if (listener && listener[0] === callback && listener[1] === binding) {
                listeners.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Notify registered listeners.
     *
     * @param {any} args Params to be sent to listeners
     *
     * @memberOf Notifier
     */


    Notifier.prototype.emit = function emit() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        this.listeners.slice(0).forEach(function (listener) {
            listener[0].apply(listener[1], args);
        });
    };

    return Notifier;
}();

var EVENTED = '__evented__';
/**
 * Has a class been decorated as `@evented`?
 *
 * @export
 * @param {object} obj
 * @returns {boolean}
 */
function isEvented(obj) {
    return !!obj[EVENTED];
}
/**
 * Marks a class as evented.
 *
 * An evented class should also implement the `Evented` interface.
 *
 * ```ts
 * import { evented, Evented } from '@orbit/core';
 *
 * @evented
 * class Source implements Evented {
 *   ...
 * }
 * ```
 *
 * Listeners can then register themselves for particular events with `on`:
 *
 * ```ts
 * let source = new Source();
 *
 * function listener1(message: string) {
 *   console.log('listener1 heard ' + message);
 * };
 * function listener2(message: string) {
 *   console.log('listener2 heard ' + message);
 * };
 *
 * source.on('greeting', listener1);
 * source.on('greeting', listener2);
 *
 * evented.emit('greeting', 'hello'); // logs "listener1 heard hello" and
 *                                    //      "listener2 heard hello"
 * ```
 *
 * Listeners can be unregistered from events at any time with `off`:
 *
 * ```ts
 * source.off('greeting', listener2);
 * ```
 *
 * @decorator
 * @export
 * @param {*} Klass
 */
function evented(Klass) {
    var proto = Klass.prototype;
    if (isEvented(proto)) {
        return;
    }
    proto[EVENTED] = true;
    proto.on = function (eventName, callback, _binding) {
        var binding = _binding || this;
        notifierForEvent(this, eventName, true).addListener(callback, binding);
    };
    proto.off = function (eventName, callback, _binding) {
        var binding = _binding || this;
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            if (callback) {
                notifier.removeListener(callback, binding);
            } else {
                removeNotifierForEvent(this, eventName);
            }
        }
    };
    proto.one = function (eventName, callback, _binding) {
        var callOnce = void 0;
        var notifier = void 0;
        var binding = _binding || this;
        notifier = notifierForEvent(this, eventName, true);
        callOnce = function () {
            callback.apply(binding, arguments);
            notifier.removeListener(callOnce, binding);
        };
        notifier.addListener(callOnce, binding);
    };
    proto.emit = function (eventName) {
        var notifier = notifierForEvent(this, eventName);
        if (notifier) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            notifier.emit.apply(notifier, args);
        }
    };
    proto.listeners = function (eventName) {
        var notifier = notifierForEvent(this, eventName);
        return notifier ? notifier.listeners : [];
    };
}
/**
 * Settle any promises returned by event listeners in series.
 *
 * If any errors are encountered during processing, they will be ignored.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function settleInSeries(obj, eventName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
    }

    var listeners = obj.listeners(eventName);
    return listeners.reduce(function (chain, _ref) {
        var callback = _ref[0],
            binding = _ref[1];

        return chain.then(function () {
            return callback.apply(binding, args);
        }).catch(function (e) {});
    }, Orbit.Promise.resolve());
}
/**
 * Fulfill any promises returned by event listeners in series.
 *
 * Processing will stop if an error is encountered and the returned promise will
 * be rejected.
 *
 * @export
 * @param {Evented} obj
 * @param {any} eventName
 * @param {any} args
 * @returns {Promise<void>}
 */
function fulfillInSeries(obj, eventName) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
    }

    var listeners = obj.listeners(eventName);
    return new Orbit.Promise(function (resolve, reject) {
        fulfillEach(listeners, args, resolve, reject);
    });
}
function notifierForEvent(object, eventName) {
    var createIfUndefined = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (object._eventedNotifiers === undefined) {
        object._eventedNotifiers = {};
    }
    var notifier = object._eventedNotifiers[eventName];
    if (!notifier && createIfUndefined) {
        notifier = object._eventedNotifiers[eventName] = new Notifier();
    }
    return notifier;
}
function removeNotifierForEvent(object, eventName) {
    if (object._eventedNotifiers && object._eventedNotifiers[eventName]) {
        delete object._eventedNotifiers[eventName];
    }
}
function fulfillEach(listeners, args, resolve, reject) {
    if (listeners.length === 0) {
        resolve();
    } else {
        var listener = void 0;
        var _listeners = listeners;
        listener = _listeners[0];
        listeners = _listeners.slice(1);
        var _listener = listener,
            callback = _listener[0],
            binding = _listener[1];

        var response = callback.apply(binding, args);
        if (response) {
            return Orbit.Promise.resolve(response).then(function () {
                return fulfillEach(listeners, args, resolve, reject);
            }).catch(function (error) {
                return reject(error);
            });
        } else {
            fulfillEach(listeners, args, resolve, reject);
        }
    }
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        _orbit_utils.assert('TaskQueue requires Orbit.Promise to be defined', Orbit.Promise);
        this._performer = target;
        this._name = settings.name;
        this._bucket = settings.bucket;
        this.autoProcess = settings.autoProcess === undefined ? true : settings.autoProcess;
        if (this._bucket) {
            _orbit_utils.assert('TaskQueue requires a name if it has a bucket', !!this._name);
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
var TaskQueue$1 = TaskQueue;

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate$1 = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Buckets can persist state. The base `Bucket` class is abstract and should be
 * extended to created buckets with different persistence strategies.
 *
 * Buckets have a simple map-like interface with methods like `getItem`,
 * `setItem`, and `removeItem`. All methods return promises to enable usage with
 * asynchronous stores like IndexedDB.
 *
 * Buckets can be assigned a unique `namespace` in order to avoid collisions.
 *
 * Buckets can be assigned a version, and can be "upgraded" to a new version.
 * The upgrade process allows buckets to migrate their data between versions.
 *
 * @export
 * @abstract
 * @class Bucket
 * @implements {Evented}
 */
exports.Bucket = function () {
    /**
     * Creates an instance of `Bucket`.
     *
     * @param {BucketSettings} [settings={}]
     *
     * @memberOf Bucket
     */
    function Bucket() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$3(this, Bucket);

        if (settings.version === undefined) {
            settings.version = 1;
        }
        settings.namespace = settings.namespace || 'orbit-bucket';
        this._applySettings(settings);
    }
    /**
     * Name used for tracking and debugging a bucket instance.
     *
     * @readonly
     * @type {string}
     * @memberOf Bucket
     */


    /**
     * Upgrades Bucket to a new version with new settings.
     *
     * Settings, beyond `version`, are bucket-specific.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
      */
    Bucket.prototype.upgrade = function upgrade() {
        var _this = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (settings.version === undefined) {
            settings.version = this._version + 1;
        }
        return this._applySettings(settings).then(function () {
            return _this.emit('upgrade', _this._version);
        });
    };
    /**
     * Applies settings passed from a `constructor` or `upgrade`.
     *
     * @param {BucketSettings} settings
     * @returns {Promise<void>}
     * @memberOf Bucket
     */


    Bucket.prototype._applySettings = function _applySettings(settings) {
        if (settings.name) {
            this._name = settings.name;
        }
        if (settings.namespace) {
            this._namespace = settings.namespace;
        }
        this._version = settings.version;
        return Orbit.Promise.resolve();
    };

    _createClass$2(Bucket, [{
        key: "name",
        get: function () {
            return this._name;
        }
        /**
         * The namespace used by the bucket when accessing any items.
         *
         * This is used to distinguish one bucket's contents from another.
         *
         * @readonly
         * @type {string}
         * @memberOf Bucket
         */

    }, {
        key: "namespace",
        get: function () {
            return this._namespace;
        }
        /**
         * The current version of the bucket.
         *
         * To change versions, `upgrade` should be invoked.
         *
         * @readonly
         * @type {number}
         * @memberOf Bucket
         */

    }, {
        key: "version",
        get: function () {
            return this._version;
        }
    }]);

    return Bucket;
}();
exports.Bucket = __decorate$1([evented], exports.Bucket);

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base exception class.
 *
 * @export
 * @class Exception
 */
var Exception =
/**
 * Creates an instance of Exception.
 *
 * @param {string} message
 *
 * @memberOf Exception
 */
function Exception(message) {
    _classCallCheck$4(this, Exception);

    this.message = message;
    this.error = new Error(this.message);
    this.stack = this.error.stack;
};
/**
 * Exception raised when an item does not exist in a log.
 *
 * @export
 * @class NotLoggedException
 * @extends {Exception}
 */
var NotLoggedException = function (_Exception) {
    _inherits(NotLoggedException, _Exception);

    function NotLoggedException(id) {
        _classCallCheck$4(this, NotLoggedException);

        var _this = _possibleConstructorReturn(this, _Exception.call(this, "Action not logged: " + id));

        _this.id = id;
        return _this;
    }

    return NotLoggedException;
}(Exception);
/**
 * Exception raised when a value is outside an allowed range.
 *
 * @export
 * @class OutOfRangeException
 * @extends {Exception}
 */
var OutOfRangeException = function (_Exception2) {
    _inherits(OutOfRangeException, _Exception2);

    function OutOfRangeException(value) {
        _classCallCheck$4(this, OutOfRangeException);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, "Out of range: " + value));

        _this2.value = value;
        return _this2;
    }

    return OutOfRangeException;
}(Exception);

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate$2 = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Logs track a series of unique events that have occurred. Each event is
 * tracked based on its unique id. The log only tracks the ids but currently
 * does not track any details.
 *
 * Logs can automatically be persisted by assigning them a bucket.
 *
 * @export
 * @class Log
 * @implements {Evented}
 */
var Log = function () {
    function Log() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck$5(this, Log);

        this._name = options.name;
        this._bucket = options.bucket;
        if (this._bucket) {
            _orbit_utils.assert('Log requires a name if it has a bucket', !!this._name);
        }
        this._reify(options.data);
    }

    Log.prototype.append = function append() {
        var _this = this;

        for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
            ids[_key] = arguments[_key];
        }

        return this.reified.then(function () {
            Array.prototype.push.apply(_this._data, ids);
            return _this._persist();
        }).then(function () {
            _this.emit('append', ids);
        });
    };

    Log.prototype.before = function before(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new NotLoggedException(id);
        }
        var position = index + relativePosition;
        if (position < 0 || position >= this._data.length) {
            throw new OutOfRangeException(position);
        }
        return this._data.slice(0, position);
    };

    Log.prototype.after = function after(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new NotLoggedException(id);
        }
        var position = index + 1 + relativePosition;
        if (position < 0 || position > this._data.length) {
            throw new OutOfRangeException(position);
        }
        return this._data.slice(position);
    };

    Log.prototype.truncate = function truncate(id) {
        var _this2 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this2._data.indexOf(id);
            if (index === -1) {
                throw new NotLoggedException(id);
            }
            var position = index + relativePosition;
            if (position < 0 || position > _this2._data.length) {
                throw new OutOfRangeException(position);
            }
            if (position === _this2._data.length) {
                removed = _this2._data;
                _this2._data = [];
            } else {
                removed = _this2._data.slice(0, position);
                _this2._data = _this2._data.slice(position);
            }
            return _this2._persist();
        }).then(function () {
            _this2.emit('truncate', id, relativePosition, removed);
        });
    };

    Log.prototype.rollback = function rollback(id) {
        var _this3 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this3._data.indexOf(id);
            if (index === -1) {
                throw new NotLoggedException(id);
            }
            var position = index + 1 + relativePosition;
            if (position < 0 || position > _this3._data.length) {
                throw new OutOfRangeException(position);
            }
            removed = _this3._data.slice(position);
            _this3._data = _this3._data.slice(0, position);
            return _this3._persist();
        }).then(function () {
            _this3.emit('rollback', id, relativePosition, removed);
        });
    };

    Log.prototype.clear = function clear() {
        var _this4 = this;

        var clearedData = void 0;
        return this.reified.then(function () {
            clearedData = _this4._data;
            _this4._data = [];
            return _this4._persist();
        }).then(function () {
            return _this4.emit('clear', clearedData);
        });
    };

    Log.prototype.contains = function contains(id) {
        return this._data.indexOf(id) > -1;
    };

    Log.prototype._persist = function _persist() {
        this.emit('change');
        if (this.bucket) {
            return this._bucket.setItem(this.name, this._data);
        } else {
            return Orbit.Promise.resolve();
        }
    };

    Log.prototype._reify = function _reify(data) {
        var _this5 = this;

        if (!data && this._bucket) {
            this.reified = this._bucket.getItem(this._name).then(function (bucketData) {
                return _this5._initData(bucketData);
            });
        } else {
            this._initData(data);
            this.reified = Orbit.Promise.resolve();
        }
    };

    Log.prototype._initData = function _initData(data) {
        if (data) {
            this._data = data;
        } else {
            this._data = [];
        }
    };

    _createClass$3(Log, [{
        key: "name",
        get: function () {
            return this._name;
        }
    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
    }, {
        key: "head",
        get: function () {
            return this._data[this._data.length - 1];
        }
    }, {
        key: "entries",
        get: function () {
            return this._data;
        }
    }, {
        key: "length",
        get: function () {
            return this._data.length;
        }
    }]);

    return Log;
}();
Log = __decorate$2([evented], Log);
var Log$1 = Log;

exports['default'] = Orbit;
exports.TaskQueue = TaskQueue$1;
exports.TaskProcessor = TaskProcessor;
exports.evented = evented;
exports.isEvented = isEvented;
exports.settleInSeries = settleInSeries;
exports.fulfillInSeries = fulfillInSeries;
exports.Notifier = Notifier;
exports.Log = Log$1;
exports.Exception = Exception;
exports.NotLoggedException = NotLoggedException;
exports.OutOfRangeException = OutOfRangeException;

Object.defineProperty(exports, '__esModule', { value: true });

});
