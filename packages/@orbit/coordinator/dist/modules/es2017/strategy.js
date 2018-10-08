import Orbit from '@orbit/data';
import { assert } from '@orbit/utils';
export class Strategy {
    constructor(options = {}) {
        assert('Strategy requires a name', !!options.name);
        this._name = options.name;
        this._sourceNames = options.sources;
        this._logPrefix = options.logPrefix || `[${this._name}]`;
        this._logLevel = this._customLogLevel = options.logLevel;
    }
    activate(coordinator, options = {}) {
        this._coordinator = coordinator;
        if (this._customLogLevel === undefined) {
            this._logLevel = options.logLevel;
        }
        if (this._sourceNames) {
            this._sources = this._sourceNames.map(name => coordinator.getSource(name));
        } else {
            this._sources = coordinator.sources;
        }
        return Orbit.Promise.resolve();
    }
    deactivate() {
        this._coordinator = null;
        return Orbit.Promise.resolve();
    }
    get name() {
        return this._name;
    }
    get coordinator() {
        return this._coordinator;
    }
    get sources() {
        return this._sources;
    }
    get logPrefix() {
        return this._logPrefix;
    }
    get logLevel() {
        return this._logLevel;
    }
}