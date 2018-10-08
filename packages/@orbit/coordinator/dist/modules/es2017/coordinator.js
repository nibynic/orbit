import Orbit from '@orbit/data';
import { assert, objectValues } from '@orbit/utils';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Errors"] = 1] = "Errors";
    LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    LogLevel[LogLevel["Info"] = 3] = "Info";
})(LogLevel || (LogLevel = {}));
/**
 * The Coordinator class manages a set of sources to which it applies a set of
 * coordination strategies.
 *
 * @export
 * @class Coordinator
 */
export default class Coordinator {
    constructor(options = {}) {
        this._sources = {};
        this._strategies = {};
        if (options.sources) {
            options.sources.forEach(source => this.addSource(source));
        }
        if (options.strategies) {
            options.strategies.forEach(strategy => this.addStrategy(strategy));
        }
        this._defaultActivationOptions = options.defaultActivationOptions || {};
        if (this._defaultActivationOptions.logLevel === undefined) {
            this._defaultActivationOptions.logLevel = LogLevel.Info;
        }
    }
    addSource(source) {
        const name = source.name;
        assert(`Sources require a 'name' to be added to a coordinator.`, !!name);
        assert(`A source named '${name}' has already been added to this coordinator.`, !this._sources[name]);
        assert(`A coordinator's sources can not be changed while it is active.`, !this._activated);
        this._sources[name] = source;
    }
    removeSource(name) {
        let source = this._sources[name];
        assert(`Source '${name}' has not been added to this coordinator.`, !!source);
        assert(`A coordinator's sources can not be changed while it is active.`, !this._activated);
        delete this._sources[name];
    }
    getSource(name) {
        return this._sources[name];
    }
    get sources() {
        return objectValues(this._sources);
    }
    get sourceNames() {
        return Object.keys(this._sources);
    }
    addStrategy(strategy) {
        const name = strategy.name;
        assert(`A strategy named '${name}' has already been added to this coordinator.`, !this._strategies[name]);
        assert(`A coordinator's strategies can not be changed while it is active.`, !this._activated);
        this._strategies[name] = strategy;
    }
    removeStrategy(name) {
        let strategy = this._strategies[name];
        assert(`Strategy '${name}' has not been added to this coordinator.`, !!strategy);
        assert(`A coordinator's strategies can not be changed while it is active.`, !this._activated);
        delete this._strategies[name];
    }
    getStrategy(name) {
        return this._strategies[name];
    }
    get strategies() {
        return objectValues(this._strategies);
    }
    get strategyNames() {
        return Object.keys(this._strategies);
    }
    get activated() {
        return this._activated;
    }
    activate(options = {}) {
        if (!this._activated) {
            if (options.logLevel === undefined) {
                options.logLevel = this._defaultActivationOptions.logLevel;
            }
            this._currentActivationOptions = options;
            this._activated = this.strategies.reduce((chain, strategy) => {
                return chain.then(() => strategy.activate(this, options));
            }, Orbit.Promise.resolve());
        }
        return this._activated;
    }
    deactivate() {
        if (this._activated) {
            return this._activated.then(() => {
                return this.strategies.reverse().reduce((chain, strategy) => {
                    return chain.then(() => strategy.deactivate());
                }, Orbit.Promise.resolve());
            }).then(() => {
                this._activated = null;
            });
        } else {
            return Orbit.Promise.resolve();
        }
    }
}