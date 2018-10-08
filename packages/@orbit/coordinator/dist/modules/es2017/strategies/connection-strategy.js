import { Strategy } from '../strategy';
import { assert } from '@orbit/utils';
export class ConnectionStrategy extends Strategy {
    constructor(options) {
        assert('A `source` must be specified for a ConnectionStrategy', !!options.source);
        assert('`source` should be a Source name specified as a string', typeof options.source === 'string');
        assert('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        let defaultName = `${options.source}:${options.on}`;
        delete options.source;
        if (options.target) {
            assert('`target` should be a Source name specified as a string', typeof options.target === 'string');
            options.sources.push(options.target);
            defaultName += ` -> ${options.target}`;
            if (typeof options.action === 'string') {
                defaultName += `:${options.action}`;
            }
            delete options.target;
        }
        options.name = options.name || defaultName;
        super(options);
        this._event = options.on;
        this._action = options.action;
        this._catch = options.catch;
        this._filter = options.filter;
        this._blocking = typeof options.blocking === 'function' ? options.blocking : !!options.blocking;
    }
    get source() {
        return this._sources[0];
    }
    get target() {
        return this._sources[1];
    }
    get blocking() {
        return this._blocking;
    }
    activate(coordinator, options = {}) {
        return super.activate(coordinator, options).then(() => {
            this._listener = this._generateListener();
            this.source.on(this._event, this._listener, this);
        });
    }
    deactivate() {
        return super.deactivate().then(() => {
            this.source.off(this._event, this._listener, this);
            this._listener = null;
        });
    }
    _generateListener() {
        let target = this.target;
        return (...args) => {
            let result;
            if (this._filter) {
                if (!this._filter.apply(this, args)) {
                    return;
                }
            }
            if (typeof this._action === 'string') {
                result = this.target[this._action](...args);
            } else {
                result = this._action.apply(this, args);
            }
            if (this._catch && result && result.catch) {
                result = result.catch(e => {
                    args.unshift(e);
                    return this._catch.apply(this, args);
                });
            }
            if (typeof this._blocking === 'function') {
                if (this._blocking.apply(this, args)) {
                    return result;
                }
            } else if (this._blocking) {
                return result;
            }
        };
    }
}