function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { ConnectionStrategy } from './connection-strategy';
import { assert } from '@orbit/utils';
export var SyncStrategy = function (_ConnectionStrategy) {
    _inherits(SyncStrategy, _ConnectionStrategy);

    function SyncStrategy(options) {
        _classCallCheck(this, SyncStrategy);

        var opts = options;
        assert('A `source` must be specified for a SyncStrategy', !!opts.source);
        assert('A `target` must be specified for a SyncStrategy', !!opts.target);
        assert('`source` should be a Source name specified as a string', typeof opts.source === 'string');
        assert('`target` should be a Source name specified as a string', typeof opts.target === 'string');
        opts.on = opts.on || 'transform';
        opts.action = opts.action || 'sync';
        return _possibleConstructorReturn(this, _ConnectionStrategy.call(this, opts));
    }

    return SyncStrategy;
}(ConnectionStrategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvc3luYy1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJDb25uZWN0aW9uU3RyYXRlZ3kiLCJhc3NlcnQiLCJTeW5jU3RyYXRlZ3kiLCJvcHRpb25zIiwib3B0cyIsInNvdXJjZSIsInRhcmdldCIsIm9uIiwiYWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLGtCQUFULFFBQW1DLHVCQUFuQztBQUNBLFNBQVNDLE1BQVQsUUFBdUIsY0FBdkI7QUFDQSxXQUFhQyxZQUFiO0FBQUE7O0FBQ0ksMEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDakIsWUFBSUMsT0FBT0QsT0FBWDtBQUNBRixlQUFPLGlEQUFQLEVBQTBELENBQUMsQ0FBQ0csS0FBS0MsTUFBakU7QUFDQUosZUFBTyxpREFBUCxFQUEwRCxDQUFDLENBQUNHLEtBQUtFLE1BQWpFO0FBQ0FMLGVBQU8sd0RBQVAsRUFBaUUsT0FBT0csS0FBS0MsTUFBWixLQUF1QixRQUF4RjtBQUNBSixlQUFPLHdEQUFQLEVBQWlFLE9BQU9HLEtBQUtFLE1BQVosS0FBdUIsUUFBeEY7QUFDQUYsYUFBS0csRUFBTCxHQUFVSCxLQUFLRyxFQUFMLElBQVcsV0FBckI7QUFDQUgsYUFBS0ksTUFBTCxHQUFjSixLQUFLSSxNQUFMLElBQWUsTUFBN0I7QUFQaUIsZ0RBUWpCLCtCQUFNSixJQUFOLENBUmlCO0FBU3BCOztBQVZMO0FBQUEsRUFBa0NKLGtCQUFsQyIsImZpbGUiOiJzdHJhdGVnaWVzL3N5bmMtc3RyYXRlZ3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25uZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICcuL2Nvbm5lY3Rpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCBjbGFzcyBTeW5jU3RyYXRlZ3kgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSBvcHRpb25zO1xuICAgICAgICBhc3NlcnQoJ0EgYHNvdXJjZWAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgU3luY1N0cmF0ZWd5JywgISFvcHRzLnNvdXJjZSk7XG4gICAgICAgIGFzc2VydCgnQSBgdGFyZ2V0YCBtdXN0IGJlIHNwZWNpZmllZCBmb3IgYSBTeW5jU3RyYXRlZ3knLCAhIW9wdHMudGFyZ2V0KTtcbiAgICAgICAgYXNzZXJ0KCdgc291cmNlYCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0cy5zb3VyY2UgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgYXNzZXJ0KCdgdGFyZ2V0YCBzaG91bGQgYmUgYSBTb3VyY2UgbmFtZSBzcGVjaWZpZWQgYXMgYSBzdHJpbmcnLCB0eXBlb2Ygb3B0cy50YXJnZXQgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgb3B0cy5vbiA9IG9wdHMub24gfHwgJ3RyYW5zZm9ybSc7XG4gICAgICAgIG9wdHMuYWN0aW9uID0gb3B0cy5hY3Rpb24gfHwgJ3N5bmMnO1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICB9XG59Il19