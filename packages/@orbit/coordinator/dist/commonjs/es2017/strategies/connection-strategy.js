'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectionStrategy = undefined;

var _strategy = require('../strategy');

var _utils = require('@orbit/utils');

class ConnectionStrategy extends _strategy.Strategy {
    constructor(options) {
        (0, _utils.assert)('A `source` must be specified for a ConnectionStrategy', !!options.source);
        (0, _utils.assert)('`source` should be a Source name specified as a string', typeof options.source === 'string');
        (0, _utils.assert)('`on` should be specified as the name of the event a ConnectionStrategy listens for', typeof options.on === 'string');
        options.sources = [options.source];
        let defaultName = `${options.source}:${options.on}`;
        delete options.source;
        if (options.target) {
            (0, _utils.assert)('`target` should be a Source name specified as a string', typeof options.target === 'string');
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
exports.ConnectionStrategy = ConnectionStrategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvY29ubmVjdGlvbi1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJDb25uZWN0aW9uU3RyYXRlZ3kiLCJTdHJhdGVneSIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsInNvdXJjZSIsIm9uIiwic291cmNlcyIsImRlZmF1bHROYW1lIiwidGFyZ2V0IiwicHVzaCIsImFjdGlvbiIsIm5hbWUiLCJfZXZlbnQiLCJfYWN0aW9uIiwiX2NhdGNoIiwiY2F0Y2giLCJfZmlsdGVyIiwiZmlsdGVyIiwiX2Jsb2NraW5nIiwiYmxvY2tpbmciLCJfc291cmNlcyIsImFjdGl2YXRlIiwiY29vcmRpbmF0b3IiLCJ0aGVuIiwiX2xpc3RlbmVyIiwiX2dlbmVyYXRlTGlzdGVuZXIiLCJkZWFjdGl2YXRlIiwib2ZmIiwiYXJncyIsInJlc3VsdCIsImFwcGx5IiwiZSIsInVuc2hpZnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDTyxNQUFNQSxrQkFBTixTQUFpQ0Msa0JBQWpDLENBQTBDO0FBQzdDQyxnQkFBWUMsT0FBWixFQUFxQjtBQUNqQiwyQkFBTyx1REFBUCxFQUFnRSxDQUFDLENBQUNBLFFBQVFDLE1BQTFFO0FBQ0EsMkJBQU8sd0RBQVAsRUFBaUUsT0FBT0QsUUFBUUMsTUFBZixLQUEwQixRQUEzRjtBQUNBLDJCQUFPLG9GQUFQLEVBQTZGLE9BQU9ELFFBQVFFLEVBQWYsS0FBc0IsUUFBbkg7QUFDQUYsZ0JBQVFHLE9BQVIsR0FBa0IsQ0FBQ0gsUUFBUUMsTUFBVCxDQUFsQjtBQUNBLFlBQUlHLGNBQWUsR0FBRUosUUFBUUMsTUFBTyxJQUFHRCxRQUFRRSxFQUFHLEVBQWxEO0FBQ0EsZUFBT0YsUUFBUUMsTUFBZjtBQUNBLFlBQUlELFFBQVFLLE1BQVosRUFBb0I7QUFDaEIsK0JBQU8sd0RBQVAsRUFBaUUsT0FBT0wsUUFBUUssTUFBZixLQUEwQixRQUEzRjtBQUNBTCxvQkFBUUcsT0FBUixDQUFnQkcsSUFBaEIsQ0FBcUJOLFFBQVFL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LENBQUosRUFBc0M7QUFDbEMsMkJBQU9DLE1BQVA7QUFDSDtBQUNKLGFBSkQsTUFJTyxJQUFJLEtBQUtYLFNBQVQsRUFBb0I7QUFDdkIsdUJBQU9XLE1BQVA7QUFDSDtBQUNKLFNBekJEO0FBMEJIO0FBMUU0QztRQUFwQzdCLGtCLEdBQUFBLGtCIiwiZmlsZSI6InN0cmF0ZWdpZXMvY29ubmVjdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnLi4vc3RyYXRlZ3knO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBhc3NlcnQoJ0EgYHNvdXJjZWAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGEgQ29ubmVjdGlvblN0cmF0ZWd5JywgISFvcHRpb25zLnNvdXJjZSk7XG4gICAgICAgIGFzc2VydCgnYHNvdXJjZWAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMuc291cmNlID09PSAnc3RyaW5nJyk7XG4gICAgICAgIGFzc2VydCgnYG9uYCBzaG91bGQgYmUgc3BlY2lmaWVkIGFzIHRoZSBuYW1lIG9mIHRoZSBldmVudCBhIENvbm5lY3Rpb25TdHJhdGVneSBsaXN0ZW5zIGZvcicsIHR5cGVvZiBvcHRpb25zLm9uID09PSAnc3RyaW5nJyk7XG4gICAgICAgIG9wdGlvbnMuc291cmNlcyA9IFtvcHRpb25zLnNvdXJjZV07XG4gICAgICAgIGxldCBkZWZhdWx0TmFtZSA9IGAke29wdGlvbnMuc291cmNlfToke29wdGlvbnMub259YDtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuc291cmNlO1xuICAgICAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgICAgIGFzc2VydCgnYHRhcmdldGAgc2hvdWxkIGJlIGEgU291cmNlIG5hbWUgc3BlY2lmaWVkIGFzIGEgc3RyaW5nJywgdHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSAnc3RyaW5nJyk7XG4gICAgICAgICAgICBvcHRpb25zLnNvdXJjZXMucHVzaChvcHRpb25zLnRhcmdldCk7XG4gICAgICAgICAgICBkZWZhdWx0TmFtZSArPSBgIC0+ICR7b3B0aW9ucy50YXJnZXR9YDtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdE5hbWUgKz0gYDoke29wdGlvbnMuYWN0aW9ufWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgb3B0aW9ucy50YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGRlZmF1bHROYW1lO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZXZlbnQgPSBvcHRpb25zLm9uO1xuICAgICAgICB0aGlzLl9hY3Rpb24gPSBvcHRpb25zLmFjdGlvbjtcbiAgICAgICAgdGhpcy5fY2F0Y2ggPSBvcHRpb25zLmNhdGNoO1xuICAgICAgICB0aGlzLl9maWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgdGhpcy5fYmxvY2tpbmcgPSB0eXBlb2Ygb3B0aW9ucy5ibG9ja2luZyA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuYmxvY2tpbmcgOiAhIW9wdGlvbnMuYmxvY2tpbmc7XG4gICAgfVxuICAgIGdldCBzb3VyY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VzWzBdO1xuICAgIH1cbiAgICBnZXQgdGFyZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlc1sxXTtcbiAgICB9XG4gICAgZ2V0IGJsb2NraW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tpbmc7XG4gICAgfVxuICAgIGFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFjdGl2YXRlKGNvb3JkaW5hdG9yLCBvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyID0gdGhpcy5fZ2VuZXJhdGVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2Uub24odGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWFjdGl2YXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5vZmYodGhpcy5fZXZlbnQsIHRoaXMuX2xpc3RlbmVyLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9nZW5lcmF0ZUxpc3RlbmVyKCkge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2ZpbHRlci5hcHBseSh0aGlzLCBhcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9hY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy50YXJnZXRbdGhpcy5fYWN0aW9uXSguLi5hcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fYWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhdGNoICYmIHJlc3VsdCAmJiByZXN1bHQuY2F0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ibG9ja2luZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ibG9ja2luZy5hcHBseSh0aGlzLCBhcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYmxvY2tpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0iXX0=