'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Strategy = undefined;

var _data = require('@orbit/data');

var _data2 = _interopRequireDefault(_data);

var _utils = require('@orbit/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Strategy {
    constructor(options = {}) {
        (0, _utils.assert)('Strategy requires a name', !!options.name);
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
        return _data2.default.Promise.resolve();
    }
    deactivate() {
        this._coordinator = null;
        return _data2.default.Promise.resolve();
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
exports.Strategy = Strategy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbIlN0cmF0ZWd5IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwibmFtZSIsIl9uYW1lIiwiX3NvdXJjZU5hbWVzIiwic291cmNlcyIsIl9sb2dQcmVmaXgiLCJsb2dQcmVmaXgiLCJfbG9nTGV2ZWwiLCJfY3VzdG9tTG9nTGV2ZWwiLCJsb2dMZXZlbCIsImFjdGl2YXRlIiwiY29vcmRpbmF0b3IiLCJfY29vcmRpbmF0b3IiLCJ1bmRlZmluZWQiLCJfc291cmNlcyIsIm1hcCIsImdldFNvdXJjZSIsIk9yYml0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJkZWFjdGl2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNPLE1BQU1BLFFBQU4sQ0FBZTtBQUNsQkMsZ0JBQVlDLFVBQVUsRUFBdEIsRUFBMEI7QUFDdEIsMkJBQU8sMEJBQVAsRUFBbUMsQ0FBQyxDQUFDQSxRQUFRQyxJQUE3QztBQUNBLGFBQUtDLEtBQUwsR0FBYUYsUUFBUUMsSUFBckI7QUFDQSxhQUFLRSxZQUFMLEdBQW9CSCxRQUFRSSxPQUE1QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JMLFFBQVFNLFNBQVIsSUFBc0IsSUFBRyxLQUFLSixLQUFNLEdBQXREO0FBQ0EsYUFBS0ssU0FBTCxHQUFpQixLQUFLQyxlQUFMLEdBQXVCUixRQUFRUyxRQUFoRDtBQUNIO0FBQ0RDLGFBQVNDLFdBQVQsRUFBc0JYLFVBQVUsRUFBaEMsRUFBb0M7QUFDaEMsYUFBS1ksWUFBTCxHQUFvQkQsV0FBcEI7QUFDQSxZQUFJLEtBQUtILGVBQUwsS0FBeUJLLFNBQTdCLEVBQXdDO0FBQ3BDLGlCQUFLTixTQUFMLEdBQWlCUCxRQUFRUyxRQUF6QjtBQUNIO0FBQ0QsWUFBSSxLQUFLTixZQUFULEVBQXVCO0FBQ25CLGlCQUFLVyxRQUFMLEdBQWdCLEtBQUtYLFlBQUwsQ0FBa0JZLEdBQWxCLENBQXNCZCxRQUFRVSxZQUFZSyxTQUFaLENBQXNCZixJQUF0QixDQUE5QixDQUFoQjtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLYSxRQUFMLEdBQWdCSCxZQUFZUCxPQUE1QjtBQUNIO0FBQ0QsZUFBT2EsZUFBTUMsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSDtBQUNEQyxpQkFBYTtBQUNULGFBQUtSLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxlQUFPSyxlQUFNQyxPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNIO0FBQ0QsUUFBSWxCLElBQUosR0FBVztBQUNQLGVBQU8sS0FBS0MsS0FBWjtBQUNIO0FBQ0QsUUFBSVMsV0FBSixHQUFrQjtBQUNkLGVBQU8sS0FBS0MsWUFBWjtBQUNIO0FBQ0QsUUFBSVIsT0FBSixHQUFjO0FBQ1YsZUFBTyxLQUFLVSxRQUFaO0FBQ0g7QUFDRCxRQUFJUixTQUFKLEdBQWdCO0FBQ1osZUFBTyxLQUFLRCxVQUFaO0FBQ0g7QUFDRCxRQUFJSSxRQUFKLEdBQWU7QUFDWCxlQUFPLEtBQUtGLFNBQVo7QUFDSDtBQXRDaUI7UUFBVFQsUSxHQUFBQSxRIiwiZmlsZSI6InN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgY2xhc3MgU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1N0cmF0ZWd5IHJlcXVpcmVzIGEgbmFtZScsICEhb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fc291cmNlTmFtZXMgPSBvcHRpb25zLnNvdXJjZXM7XG4gICAgICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8IGBbJHt0aGlzLl9uYW1lfV1gO1xuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHRoaXMuX2N1c3RvbUxvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbDtcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9jb29yZGluYXRvciA9IGNvb3JkaW5hdG9yO1xuICAgICAgICBpZiAodGhpcy5fY3VzdG9tTG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2VOYW1lcykge1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcyA9IHRoaXMuX3NvdXJjZU5hbWVzLm1hcChuYW1lID0+IGNvb3JkaW5hdG9yLmdldFNvdXJjZShuYW1lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzID0gY29vcmRpbmF0b3Iuc291cmNlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuX2Nvb3JkaW5hdG9yID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCBjb29yZGluYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkaW5hdG9yO1xuICAgIH1cbiAgICBnZXQgc291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXM7XG4gICAgfVxuICAgIGdldCBsb2dQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dQcmVmaXg7XG4gICAgfVxuICAgIGdldCBsb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xuICAgIH1cbn0iXX0=