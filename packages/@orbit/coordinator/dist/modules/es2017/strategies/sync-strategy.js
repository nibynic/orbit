import { ConnectionStrategy } from './connection-strategy';
import { assert } from '@orbit/utils';
export class SyncStrategy extends ConnectionStrategy {
    constructor(options) {
        let opts = options;
        assert('A `source` must be specified for a SyncStrategy', !!opts.source);
        assert('A `target` must be specified for a SyncStrategy', !!opts.target);
        assert('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        assert('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        super(opts);
    }
}