import { Strategy } from '../strategy';
import Orbit from '@orbit/data';
export class LogTruncationStrategy extends Strategy {
    constructor(options = {}) {
        options.name = options.name || 'log-truncation';
        super(options);
    }
    activate(coordinator, options = {}) {
        return super.activate(coordinator, options).then(() => {
            return this._reifySources();
        }).then(() => {
            this._transformListeners = {};
            this._sources.forEach(source => this._activateSource(source));
        });
    }
    deactivate() {
        return super.deactivate().then(() => {
            this._sources.forEach(source => this._deactivateSource(source));
            this._transformListeners = null;
        });
    }
    _reifySources() {
        return this._sources.reduce((chain, source) => {
            return chain.then(() => source.transformLog.reified);
        }, Orbit.Promise.resolve());
    }
    _review(source) {
        let sources = this._sources;
        let transformId = source.transformLog.head;
        if (transformId && sources.length > 1) {
            let match = true;
            for (let i = 0; i < sources.length; i++) {
                let s = sources[i];
                if (s !== source) {
                    if (!s.requestQueue.empty || !s.syncQueue.empty || !s.transformLog.contains(transformId)) {
                        match = false;
                        break;
                    }
                }
            }
            if (match) {
                return this._truncateSources(transformId, 0);
            }
        }
    }
    _truncateSources(transformId, relativePosition) {
        return this._sources.reduce((chain, source) => {
            return chain.then(() => source.transformLog.truncate(transformId, relativePosition));
        }, Orbit.Promise.resolve());
    }
    _activateSource(source) {
        const listener = this._transformListeners[source.name] = () => {
            if (source.requestQueue.empty && source.syncQueue.empty) {
                return this._review(source);
            }
        };
        source.syncQueue.on('complete', listener);
        source.requestQueue.on('complete', listener);
    }
    _deactivateSource(source) {
        const listener = this._transformListeners[source.name];
        source.syncQueue.off('complete', listener);
        source.requestQueue.off('complete', listener);
        delete this._transformListeners[source.name];
    }
}