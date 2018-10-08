var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Orbit from '@orbit/data';
import { assert } from '@orbit/utils';
export var Strategy = function () {
    function Strategy() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Strategy);

        assert('Strategy requires a name', !!options.name);
        this._name = options.name;
        this._sourceNames = options.sources;
        this._logPrefix = options.logPrefix || '[' + this._name + ']';
        this._logLevel = this._customLogLevel = options.logLevel;
    }

    Strategy.prototype.activate = function activate(coordinator) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this._coordinator = coordinator;
        if (this._customLogLevel === undefined) {
            this._logLevel = options.logLevel;
        }
        if (this._sourceNames) {
            this._sources = this._sourceNames.map(function (name) {
                return coordinator.getSource(name);
            });
        } else {
            this._sources = coordinator.sources;
        }
        return Orbit.Promise.resolve();
    };

    Strategy.prototype.deactivate = function deactivate() {
        this._coordinator = null;
        return Orbit.Promise.resolve();
    };

    _createClass(Strategy, [{
        key: 'name',
        get: function () {
            return this._name;
        }
    }, {
        key: 'coordinator',
        get: function () {
            return this._coordinator;
        }
    }, {
        key: 'sources',
        get: function () {
            return this._sources;
        }
    }, {
        key: 'logPrefix',
        get: function () {
            return this._logPrefix;
        }
    }, {
        key: 'logLevel',
        get: function () {
            return this._logLevel;
        }
    }]);

    return Strategy;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbIk9yYml0IiwiYXNzZXJ0IiwiU3RyYXRlZ3kiLCJvcHRpb25zIiwibmFtZSIsIl9uYW1lIiwiX3NvdXJjZU5hbWVzIiwic291cmNlcyIsIl9sb2dQcmVmaXgiLCJsb2dQcmVmaXgiLCJfbG9nTGV2ZWwiLCJfY3VzdG9tTG9nTGV2ZWwiLCJsb2dMZXZlbCIsImFjdGl2YXRlIiwiY29vcmRpbmF0b3IiLCJfY29vcmRpbmF0b3IiLCJ1bmRlZmluZWQiLCJfc291cmNlcyIsIm1hcCIsImdldFNvdXJjZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZGVhY3RpdmF0ZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsYUFBbEI7QUFDQSxTQUFTQyxNQUFULFFBQXVCLGNBQXZCO0FBQ0EsV0FBYUMsUUFBYjtBQUNJLHdCQUEwQjtBQUFBLFlBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDdEJGLGVBQU8sMEJBQVAsRUFBbUMsQ0FBQyxDQUFDRSxRQUFRQyxJQUE3QztBQUNBLGFBQUtDLEtBQUwsR0FBYUYsUUFBUUMsSUFBckI7QUFDQSxhQUFLRSxZQUFMLEdBQW9CSCxRQUFRSSxPQUE1QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JMLFFBQVFNLFNBQVIsVUFBeUIsS0FBS0osS0FBOUIsTUFBbEI7QUFDQSxhQUFLSyxTQUFMLEdBQWlCLEtBQUtDLGVBQUwsR0FBdUJSLFFBQVFTLFFBQWhEO0FBQ0g7O0FBUEwsdUJBUUlDLFFBUkoscUJBUWFDLFdBUmIsRUFRd0M7QUFBQSxZQUFkWCxPQUFjLHVFQUFKLEVBQUk7O0FBQ2hDLGFBQUtZLFlBQUwsR0FBb0JELFdBQXBCO0FBQ0EsWUFBSSxLQUFLSCxlQUFMLEtBQXlCSyxTQUE3QixFQUF3QztBQUNwQyxpQkFBS04sU0FBTCxHQUFpQlAsUUFBUVMsUUFBekI7QUFDSDtBQUNELFlBQUksS0FBS04sWUFBVCxFQUF1QjtBQUNuQixpQkFBS1csUUFBTCxHQUFnQixLQUFLWCxZQUFMLENBQWtCWSxHQUFsQixDQUFzQjtBQUFBLHVCQUFRSixZQUFZSyxTQUFaLENBQXNCZixJQUF0QixDQUFSO0FBQUEsYUFBdEIsQ0FBaEI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS2EsUUFBTCxHQUFnQkgsWUFBWVAsT0FBNUI7QUFDSDtBQUNELGVBQU9QLE1BQU1vQixPQUFOLENBQWNDLE9BQWQsRUFBUDtBQUNILEtBbkJMOztBQUFBLHVCQW9CSUMsVUFwQkoseUJBb0JpQjtBQUNULGFBQUtQLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxlQUFPZixNQUFNb0IsT0FBTixDQUFjQyxPQUFkLEVBQVA7QUFDSCxLQXZCTDs7QUFBQTtBQUFBO0FBQUEseUJBd0JlO0FBQ1AsbUJBQU8sS0FBS2hCLEtBQVo7QUFDSDtBQTFCTDtBQUFBO0FBQUEseUJBMkJzQjtBQUNkLG1CQUFPLEtBQUtVLFlBQVo7QUFDSDtBQTdCTDtBQUFBO0FBQUEseUJBOEJrQjtBQUNWLG1CQUFPLEtBQUtFLFFBQVo7QUFDSDtBQWhDTDtBQUFBO0FBQUEseUJBaUNvQjtBQUNaLG1CQUFPLEtBQUtULFVBQVo7QUFDSDtBQW5DTDtBQUFBO0FBQUEseUJBb0NtQjtBQUNYLG1CQUFPLEtBQUtFLFNBQVo7QUFDSDtBQXRDTDs7QUFBQTtBQUFBIiwiZmlsZSI6InN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9yYml0IGZyb20gJ0BvcmJpdC9kYXRhJztcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XG5leHBvcnQgY2xhc3MgU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhc3NlcnQoJ1N0cmF0ZWd5IHJlcXVpcmVzIGEgbmFtZScsICEhb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgdGhpcy5fc291cmNlTmFtZXMgPSBvcHRpb25zLnNvdXJjZXM7XG4gICAgICAgIHRoaXMuX2xvZ1ByZWZpeCA9IG9wdGlvbnMubG9nUHJlZml4IHx8IGBbJHt0aGlzLl9uYW1lfV1gO1xuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHRoaXMuX2N1c3RvbUxvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbDtcbiAgICB9XG4gICAgYWN0aXZhdGUoY29vcmRpbmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9jb29yZGluYXRvciA9IGNvb3JkaW5hdG9yO1xuICAgICAgICBpZiAodGhpcy5fY3VzdG9tTG9nTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBvcHRpb25zLmxvZ0xldmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2VOYW1lcykge1xuICAgICAgICAgICAgdGhpcy5fc291cmNlcyA9IHRoaXMuX3NvdXJjZU5hbWVzLm1hcChuYW1lID0+IGNvb3JkaW5hdG9yLmdldFNvdXJjZShuYW1lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2VzID0gY29vcmRpbmF0b3Iuc291cmNlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIHRoaXMuX2Nvb3JkaW5hdG9yID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCBjb29yZGluYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkaW5hdG9yO1xuICAgIH1cbiAgICBnZXQgc291cmNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZXM7XG4gICAgfVxuICAgIGdldCBsb2dQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dQcmVmaXg7XG4gICAgfVxuICAgIGdldCBsb2dMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xuICAgIH1cbn0iXX0=