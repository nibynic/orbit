'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SyncStrategy = undefined;

var _connectionStrategy = require('./connection-strategy');

var _utils = require('@orbit/utils');

class SyncStrategy extends _connectionStrategy.ConnectionStrategy {
    constructor(options) {
        let opts = options;
        (0, _utils.assert)('A `source` must be specified for a SyncStrategy', !!opts.source);
        (0, _utils.assert)('A `target` must be specified for a SyncStrategy', !!opts.target);
        (0, _utils.assert)('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        (0, _utils.assert)('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        super(opts);
    }
}
exports.SyncStrategy = SyncStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvc3luYy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJTeW5jU3RyYXRlZ3kiLCJDb25uZWN0aW9uU3RyYXRlZ3kiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJvcHRzIiwic291cmNlIiwidGFyZ2V0Iiwib24iLCJhY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDTyxNQUFNQSxZQUFOLFNBQTJCQyxzQ0FBM0IsQ0FBOEM7QUFDakRDLGdCQUFZQyxPQUFaLEVBQXFCO0FBQ2pCLFlBQUlDLE9BQU9ELE9BQVg7QUFDQSwyQkFBTyxpREFBUCxFQUEwRCxDQUFDLENBQUNDLEtBQUtDLE1BQWpFO0FBQ0EsMkJBQU8saURBQVAsRUFBMEQsQ0FBQyxDQUFDRCxLQUFLRSxNQUFqRTtBQUNBLDJCQUFPLHdEQUFQLEVBQWlFLE9BQU9GLEtBQUtDLE1BQVosS0FBdUIsUUFBeEY7QUFDQSwyQkFBTyx3REFBUCxFQUFpRSxPQUFPRCxLQUFLRSxNQUFaLEtBQXVCLFFBQXhGO0FBQ0FGLGFBQUtHLEVBQUwsR0FBVUgsS0FBS0csRUFBTCxJQUFXLFdBQXJCO0FBQ0FILGFBQUtJLE1BQUwsR0FBY0osS0FBS0ksTUFBTCxJQUFlLE1BQTdCO0FBQ0EsY0FBTUosSUFBTjtBQUNIO0FBVmdEO1FBQXhDSixZLEdBQUFBLFkiLCJmaWxlIjoic3RyYXRlZ2llcy9zeW5jLXN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9jb25uZWN0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgY2xhc3MgU3luY1N0cmF0ZWd5IGV4dGVuZHMgQ29ubmVjdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGxldCBvcHRzID0gb3B0aW9ucztcbiAgICAgICAgYXNzZXJ0KCdBIGBzb3VyY2VgIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIFN5bmNTdHJhdGVneScsICEhb3B0cy5zb3VyY2UpO1xuICAgICAgICBhc3NlcnQoJ0EgYHRhcmdldGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgU3luY1N0cmF0ZWd5JywgISFvcHRzLnRhcmdldCk7XG4gICAgICAgIGFzc2VydCgnYHNvdXJjZWAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdHMuc291cmNlID09PSAnc3RyaW5nJyk7XG4gICAgICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdHMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XG4gICAgICAgIG9wdHMub24gPSBvcHRzLm9uIHx8ICd0cmFuc2Zvcm0nO1xuICAgICAgICBvcHRzLmFjdGlvbiA9IG9wdHMuYWN0aW9uIHx8ICdzeW5jJztcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgfVxufSJdfQ==