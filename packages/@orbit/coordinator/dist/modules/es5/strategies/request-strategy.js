function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { ConnectionStrategy } from './connection-strategy';
export var RequestStrategy = function (_ConnectionStrategy) {
    _inherits(RequestStrategy, _ConnectionStrategy);

    function RequestStrategy(options) {
        _classCallCheck(this, RequestStrategy);

        return _possibleConstructorReturn(this, _ConnectionStrategy.call(this, options));
    }

    return RequestStrategy;
}(ConnectionStrategy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmF0ZWdpZXMvcmVxdWVzdC1zdHJhdGVneS5qcyJdLCJuYW1lcyI6WyJDb25uZWN0aW9uU3RyYXRlZ3kiLCJSZXF1ZXN0U3RyYXRlZ3kiLCJvcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLGtCQUFULFFBQW1DLHVCQUFuQztBQUNBLFdBQWFDLGVBQWI7QUFBQTs7QUFDSSw2QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLGdEQUNqQiwrQkFBTUEsT0FBTixDQURpQjtBQUVwQjs7QUFITDtBQUFBLEVBQXFDRixrQkFBckMiLCJmaWxlIjoic3RyYXRlZ2llcy9yZXF1ZXN0LXN0cmF0ZWd5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9jb25uZWN0aW9uLXN0cmF0ZWd5JztcbmV4cG9ydCBjbGFzcyBSZXF1ZXN0U3RyYXRlZ3kgZXh0ZW5kcyBDb25uZWN0aW9uU3RyYXRlZ3kge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufSJdfQ==