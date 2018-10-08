"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _data = require("@orbit/data");

var _data2 = _interopRequireDefault(_data);

var _utils = require("@orbit/utils");

var _transformOperators = require("./lib/transform-operators");

var _transformOperators2 = _interopRequireDefault(_transformOperators);

var _pullOperators = require("./lib/pull-operators");

var _localStorage = require("./lib/local-storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Source for storing data in localStorage.
 *
 * @class LocalStorageSource
 * @extends Source
 */
var LocalStorageSource = function (_Source) {
    _inherits(LocalStorageSource, _Source);

    /**
     * Create a new LocalStorageSource.
     *
     * @constructor
     * @param {Object} [settings]           Settings.
     * @param {Schema} [settings.schema]    Schema for source.
     * @param {String} [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit'.
     * @param {String} [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
     */
    function LocalStorageSource() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LocalStorageSource);

        (0, _utils.assert)('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        (0, _utils.assert)('Your browser does not support local storage!', (0, _localStorage.supportsLocalStorage)());
        settings.name = settings.name || 'localStorage';

        var _this = _possibleConstructorReturn(this, _Source.call(this, settings));

        _this._namespace = settings.namespace || 'orbit';
        _this._delimiter = settings.delimiter || '/';
        return _this;
    }

    LocalStorageSource.prototype.getKeyForRecord = function getKeyForRecord(record) {
        return [this.namespace, record.type, record.id].join(this.delimiter);
    };

    LocalStorageSource.prototype.getRecord = function getRecord(record) {
        var key = this.getKeyForRecord(record);
        var result = JSON.parse(_data2.default.globals.localStorage.getItem(key));
        if (result && this._keyMap) {
            this._keyMap.pushRecord(result);
        }
        return result;
    };

    LocalStorageSource.prototype.putRecord = function putRecord(record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#putRecord', key, JSON.stringify(record));
        if (this._keyMap) {
            this._keyMap.pushRecord(record);
        }
        _data2.default.globals.localStorage.setItem(key, JSON.stringify(record));
    };

    LocalStorageSource.prototype.removeRecord = function removeRecord(record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        _data2.default.globals.localStorage.removeItem(key);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype.reset = function reset() {
        for (var key in _data2.default.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                _data2.default.globals.localStorage.removeItem(key);
            }
        }
        return _data2.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._sync = function _sync(transform) {
        this._applyTransform(transform);
        return _data2.default.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._push = function _push(transform) {
        this._applyTransform(transform);
        return _data2.default.Promise.resolve([transform]);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._pull = function _pull(query) {
        var operator = _pullOperators.PullOperators[query.expression.op];
        if (!operator) {
            throw new Error('LocalStorageSource does not support the `${query.expression.op}` operator for queries.');
        }
        return operator(this, query.expression);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Protected
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._applyTransform = function _applyTransform(transform) {
        var _this2 = this;

        transform.operations.forEach(function (operation) {
            _transformOperators2.default[operation.op](_this2, operation);
        });
    };

    _createClass(LocalStorageSource, [{
        key: "namespace",
        get: function () {
            return this._namespace;
        }
    }, {
        key: "delimiter",
        get: function () {
            return this._delimiter;
        }
    }]);

    return LocalStorageSource;
}(_data.Source);
LocalStorageSource = __decorate([_data.pullable, _data.pushable, _data.syncable], LocalStorageSource);
exports.default = LocalStorageSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiYyIsImFyZ3VtZW50cyIsInIiLCJkZXNjIiwiT2JqZWN0IiwiUmVmbGVjdCIsImkiLCJkZWNvcmF0b3JzIiwiZCIsInNldHRpbmdzIiwiYXNzZXJ0IiwicmVjb3JkIiwia2V5IiwicmVzdWx0IiwiSlNPTiIsIk9yYml0Iiwib3BlcmF0b3IiLCJQdWxsT3BlcmF0b3JzIiwicXVlcnkiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2Zvcm1PcGVyYXRvcnMiLCJvcGVyYXRpb24iLCJMb2NhbFN0b3JhZ2VTb3VyY2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVhBLElBQUlBLGFBQWEsYUFBUSxVQUFSLFVBQUEsSUFBMkIsVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQXlDO0FBQ2pGLFFBQUlDLElBQUlDLFVBQVIsTUFBQTtBQUFBLFFBQ0lDLElBQUlGLElBQUFBLENBQUFBLEdBQUFBLE1BQUFBLEdBQWlCRyxTQUFBQSxJQUFBQSxHQUFnQkEsT0FBT0MsT0FBQUEsd0JBQUFBLENBQUFBLE1BQUFBLEVBQXZCRCxHQUF1QkMsQ0FBdkJELEdBRHpCLElBQUE7QUFBQSxRQUFBLENBQUE7QUFHQSxRQUFJLE9BQUEsT0FBQSxLQUFBLFFBQUEsSUFBK0IsT0FBT0UsUUFBUCxRQUFBLEtBQW5DLFVBQUEsRUFBMkVILElBQUlHLFFBQUFBLFFBQUFBLENBQUFBLFVBQUFBLEVBQUFBLE1BQUFBLEVBQUFBLEdBQUFBLEVBQS9FLElBQStFQSxDQUFKSCxDQUEzRSxLQUFvSSxLQUFLLElBQUlJLElBQUlDLFdBQUFBLE1BQUFBLEdBQWIsQ0FBQSxFQUFvQ0QsS0FBcEMsQ0FBQSxFQUFBLEdBQUEsRUFBQTtBQUFpRCxZQUFJRSxJQUFJRCxXQUFSLENBQVFBLENBQVIsRUFBdUJM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QUEsWUFBQSxTQUFBLElBQUE7O0FBQ3ZCRyxrQkFBQUEsVUFBQUEsQ0FBQUEsT0FBQUEsQ0FBNkIsVUFBQSxTQUFBLEVBQWE7QUFDdENDLHlDQUFtQkMsVUFBbkJELEVBQUFBLEVBQUFBLE1BQUFBLEVBQUFBLFNBQUFBO0FBREpELFNBQUFBO0FBdkZKLEtBQUE7O0FBQUEsaUJBQUEsa0JBQUEsRUFBQSxDQUFBO0FBQUEsYUFBQSxXQUFBO0FBQUEsYUFBQSxZQWtCZ0I7QUFDWixtQkFBTyxLQUFQLFVBQUE7QUFDSDtBQXBCRCxLQUFBLEVBQUE7QUFBQSxhQUFBLFdBQUE7QUFBQSxhQUFBLFlBcUJnQjtBQUNaLG1CQUFPLEtBQVAsVUFBQTtBQUNIO0FBdkJELEtBQUEsQ0FBQTs7QUFBQSxXQUFBLGtCQUFBO0FBQUEsQ0FBQSxDQUFKLFlBQUksQ0FBSjtBQTRGQUcscUJBQXFCdkIsV0FBVyxDQUFBLGNBQUEsRUFBQSxjQUFBLEVBQVhBLGNBQVcsQ0FBWEEsRUFBckJ1QixrQkFBcUJ2QixDQUFyQnVCO2tCQUNBLGtCIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSB0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLFxuICAgICAgICBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7ZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCBPcmJpdCwgeyBwdWxsYWJsZSwgcHVzaGFibGUsIHN5bmNhYmxlLCBTb3VyY2UgfSBmcm9tICdAb3JiaXQvZGF0YSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IHRyYW5zZm9ybU9wZXJhdG9ycyBmcm9tICcuL2xpYi90cmFuc2Zvcm0tb3BlcmF0b3JzJztcbmltcG9ydCB7IFB1bGxPcGVyYXRvcnMgfSBmcm9tICcuL2xpYi9wdWxsLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBzdXBwb3J0c0xvY2FsU3RvcmFnZSB9IGZyb20gJy4vbGliL2xvY2FsLXN0b3JhZ2UnO1xuLyoqXG4gKiBTb3VyY2UgZm9yIHN0b3JpbmcgZGF0YSBpbiBsb2NhbFN0b3JhZ2UuXG4gKlxuICogQGNsYXNzIExvY2FsU3RvcmFnZVNvdXJjZVxuICogQGV4dGVuZHMgU291cmNlXG4gKi9cbmxldCBMb2NhbFN0b3JhZ2VTb3VyY2UgPSBjbGFzcyBMb2NhbFN0b3JhZ2VTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBMb2NhbFN0b3JhZ2VTb3VyY2UuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3NldHRpbmdzXSAgICAgICAgICAgU2V0dGluZ3MuXG4gICAgICogQHBhcmFtIHtTY2hlbWF9IFtzZXR0aW5ncy5zY2hlbWFdICAgIFNjaGVtYSBmb3Igc291cmNlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MubmFtZXNwYWNlXSBPcHRpb25hbC4gUHJlZml4IGZvciBrZXlzIHVzZWQgaW4gbG9jYWxTdG9yYWdlLiBEZWZhdWx0cyB0byAnb3JiaXQnLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbc2V0dGluZ3MuZGVsaW1pdGVyXSBPcHRpb25hbC4gRGVsaW1pdGVyIHVzZWQgdG8gc2VwYXJhdGUga2V5IHNlZ21lbnRzIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJy8nLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgYXNzZXJ0KCdMb2NhbFN0b3JhZ2VTb3VyY2VcXCdzIGBzY2hlbWFgIG11c3QgYmUgc3BlY2lmaWVkIGluIGBzZXR0aW5ncy5zY2hlbWFgIGNvbnN0cnVjdG9yIGFyZ3VtZW50JywgISFzZXR0aW5ncy5zY2hlbWEpO1xuICAgICAgICBhc3NlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGxvY2FsIHN0b3JhZ2UhJywgc3VwcG9ydHNMb2NhbFN0b3JhZ2UoKSk7XG4gICAgICAgIHNldHRpbmdzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICdsb2NhbFN0b3JhZ2UnO1xuICAgICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuX25hbWVzcGFjZSA9IHNldHRpbmdzLm5hbWVzcGFjZSB8fCAnb3JiaXQnO1xuICAgICAgICB0aGlzLl9kZWxpbWl0ZXIgPSBzZXR0aW5ncy5kZWxpbWl0ZXIgfHwgJy8nO1xuICAgIH1cbiAgICBnZXQgbmFtZXNwYWNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlO1xuICAgIH1cbiAgICBnZXQgZGVsaW1pdGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVsaW1pdGVyO1xuICAgIH1cbiAgICBnZXRLZXlGb3JSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5uYW1lc3BhY2UsIHJlY29yZC50eXBlLCByZWNvcmQuaWRdLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xuICAgIH1cbiAgICBnZXRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgdGhpcy5fa2V5TWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHB1dFJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xvY2FsU3RvcmFnZVNvdXJjZSNwdXRSZWNvcmQnLCBrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xuICAgICAgICBpZiAodGhpcy5fa2V5TWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlNYXAucHVzaFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShyZWNvcmQpKTtcbiAgICB9XG4gICAgcmVtb3ZlUmVjb3JkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleUZvclJlY29yZChyZWNvcmQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnTG9jYWxTdG9yYWdlU291cmNlI3JlbW92ZVJlY29yZCcsIGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XG4gICAgICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZXNldHRhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHRoaXMubmFtZXNwYWNlKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIE9yYml0Lmdsb2JhbHMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3luY2FibGUgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfc3luYyh0cmFuc2Zvcm0pIHtcbiAgICAgICAgdGhpcy5fYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFB1c2hhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3B1c2godHJhbnNmb3JtKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoW3RyYW5zZm9ybV0pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFB1bGxhYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfcHVsbChxdWVyeSkge1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IFB1bGxPcGVyYXRvcnNbcXVlcnkuZXhwcmVzc2lvbi5vcF07XG4gICAgICAgIGlmICghb3BlcmF0b3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTG9jYWxTdG9yYWdlU291cmNlIGRvZXMgbm90IHN1cHBvcnQgdGhlIGAke3F1ZXJ5LmV4cHJlc3Npb24ub3B9YCBvcGVyYXRvciBmb3IgcXVlcmllcy4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BlcmF0b3IodGhpcywgcXVlcnkuZXhwcmVzc2lvbik7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJvdGVjdGVkXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBfYXBwbHlUcmFuc2Zvcm0odHJhbnNmb3JtKSB7XG4gICAgICAgIHRyYW5zZm9ybS5vcGVyYXRpb25zLmZvckVhY2gob3BlcmF0aW9uID0+IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybU9wZXJhdG9yc1tvcGVyYXRpb24ub3BdKHRoaXMsIG9wZXJhdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5Mb2NhbFN0b3JhZ2VTb3VyY2UgPSBfX2RlY29yYXRlKFtwdWxsYWJsZSwgcHVzaGFibGUsIHN5bmNhYmxlXSwgTG9jYWxTdG9yYWdlU291cmNlKTtcbmV4cG9ydCBkZWZhdWx0IExvY2FsU3RvcmFnZVNvdXJjZTsiXX0=