import { LogLevel } from '../coordinator';
import { Strategy } from '../strategy';
import { isPullable, isPushable, isQueryable, isSyncable, isUpdatable } from '@orbit/data';
import { deepGet, deepSet } from '@orbit/utils';
export class EventLoggingStrategy extends Strategy {
    constructor(options = {}) {
        options.name = options.name || 'event-logging';
        super(options);
        this._events = options.events;
        this._interfaces = options.interfaces;
        this._logPrefix = options.logPrefix || '[source-event]';
    }
    activate(coordinator, options = {}) {
        return super.activate(coordinator, options).then(() => {
            this._eventListeners = {};
            this._sources.forEach(source => this._activateSource(source));
        });
    }
    deactivate() {
        return super.deactivate().then(() => {
            this._sources.forEach(source => this._deactivateSource(source));
            this._eventListeners = null;
        });
    }
    _activateSource(source) {
        this._sourceEvents(source).forEach(event => {
            this._addListener(source, event);
        });
    }
    _deactivateSource(source) {
        this._sourceEvents(source).forEach(event => {
            this._removeListener(source, event);
        });
    }
    _sourceEvents(source) {
        if (this._events) {
            return this._events;
        } else {
            let events = [];
            let interfaces = this._interfaces || this._sourceInterfaces(source);
            interfaces.forEach(i => {
                Array.prototype.push.apply(events, this._interfaceEvents(i));
            });
            return events;
        }
    }
    _sourceInterfaces(source) {
        let interfaces = ['transformable'];
        if (isPullable(source)) {
            interfaces.push('pullable');
        }
        if (isPushable(source)) {
            interfaces.push('pushable');
        }
        if (isQueryable(source)) {
            interfaces.push('queryable');
        }
        if (isSyncable(source)) {
            interfaces.push('syncable');
        }
        if (isUpdatable(source)) {
            interfaces.push('updatable');
        }
        return interfaces;
    }
    _interfaceEvents(interfaceName) {
        if (this._logLevel === LogLevel.Info) {
            switch (interfaceName) {
                case 'pullable':
                    return ['beforePull', 'pull', 'pullFail'];
                case 'pushable':
                    return ['beforePush', 'push', 'pushFail'];
                case 'queryable':
                    return ['beforeQuery', 'query', 'queryFail'];
                case 'updatable':
                    return ['beforeUpdate', 'update', 'updateFail'];
                case 'syncable':
                    return ['beforeSync', 'sync', 'syncFail'];
                case 'transformable':
                    return ['transform'];
            }
        } else if (this._logLevel > LogLevel.None) {
            switch (interfaceName) {
                case 'pullable':
                    return ['pullFail'];
                case 'pushable':
                    return ['pushFail'];
                case 'queryable':
                    return ['queryFail'];
                case 'syncable':
                    return ['syncFail'];
                case 'updatable':
                    return ['updateFail'];
            }
        }
    }
    _addListener(source, event) {
        const listener = this._generateListener(source, event);
        deepSet(this._eventListeners, [source.name, event], listener);
        source.on(event, listener, this);
    }
    _removeListener(source, event) {
        const listener = deepGet(this._eventListeners, [source.name, event]);
        source.off(event, listener, this);
        this._eventListeners[source.name][event] = null;
    }
    _generateListener(source, event) {
        return (...args) => {
            console.log(this._logPrefix, source.name, event, ...args);
        };
    }
}