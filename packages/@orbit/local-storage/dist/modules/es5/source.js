var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Orbit, { pullable, pushable, syncable, Source } from '@orbit/data';
import { assert } from '@orbit/utils';
import transformOperators from './lib/transform-operators';
import { PullOperators } from './lib/pull-operators';
import { supportsLocalStorage } from './lib/local-storage';
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

        assert('LocalStorageSource\'s `schema` must be specified in `settings.schema` constructor argument', !!settings.schema);
        assert('Your browser does not support local storage!', supportsLocalStorage());
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
        var result = JSON.parse(Orbit.globals.localStorage.getItem(key));
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
        Orbit.globals.localStorage.setItem(key, JSON.stringify(record));
    };

    LocalStorageSource.prototype.removeRecord = function removeRecord(record) {
        var key = this.getKeyForRecord(record);
        // console.log('LocalStorageSource#removeRecord', key, JSON.stringify(record));
        Orbit.globals.localStorage.removeItem(key);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Resettable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype.reset = function reset() {
        for (var key in Orbit.globals.localStorage) {
            if (key.indexOf(this.namespace) === 0) {
                Orbit.globals.localStorage.removeItem(key);
            }
        }
        return Orbit.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Syncable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._sync = function _sync(transform) {
        this._applyTransform(transform);
        return Orbit.Promise.resolve();
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pushable interface implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._push = function _push(transform) {
        this._applyTransform(transform);
        return Orbit.Promise.resolve([transform]);
    };
    /////////////////////////////////////////////////////////////////////////////
    // Pullable implementation
    /////////////////////////////////////////////////////////////////////////////


    LocalStorageSource.prototype._pull = function _pull(query) {
        var operator = PullOperators[query.expression.op];
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
            transformOperators[operation.op](_this2, operation);
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
}(Source);
LocalStorageSource = __decorate([pullable, pushable, syncable], LocalStorageSource);
export default LocalStorageSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJPcmJpdCIsInB1bGxhYmxlIiwicHVzaGFibGUiLCJzeW5jYWJsZSIsIlNvdXJjZSIsImFzc2VydCIsInRyYW5zZm9ybU9wZXJhdG9ycyIsIlB1bGxPcGVyYXRvcnMiLCJzdXBwb3J0c0xvY2FsU3RvcmFnZSIsIkxvY2FsU3RvcmFnZVNvdXJjZSIsInNldHRpbmdzIiwic2NoZW1hIiwibmFtZSIsIl9uYW1lc3BhY2UiLCJuYW1lc3BhY2UiLCJfZGVsaW1pdGVyIiwiZGVsaW1pdGVyIiwiZ2V0S2V5Rm9yUmVjb3JkIiwicmVjb3JkIiwidHlwZSIsImlkIiwiam9pbiIsImdldFJlY29yZCIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsImdsb2JhbHMiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiX2tleU1hcCIsInB1c2hSZWNvcmQiLCJwdXRSZWNvcmQiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwicmVtb3ZlUmVjb3JkIiwicmVtb3ZlSXRlbSIsInJlc2V0IiwiaW5kZXhPZiIsIlByb21pc2UiLCJyZXNvbHZlIiwiX3N5bmMiLCJ0cmFuc2Zvcm0iLCJfYXBwbHlUcmFuc2Zvcm0iLCJfcHVzaCIsIl9wdWxsIiwicXVlcnkiLCJvcGVyYXRvciIsImV4cHJlc3Npb24iLCJvcCIsIkVycm9yIiwib3BlcmF0aW9ucyIsImZvckVhY2giLCJvcGVyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxhQUFhLFFBQVEsS0FBS0EsVUFBYixJQUEyQixVQUFVQyxVQUFWLEVBQXNCQyxNQUF0QixFQUE4QkMsR0FBOUIsRUFBbUND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QyxPQUFkLENBQXNCLENBQUNFLFNBQUQsQ0FBdEIsQ0FBUDtBQUNILEtBeEVEO0FBeUVBO0FBQ0E7QUFDQTs7O0FBM0VBLGlDQTRFQUcsS0E1RUEsa0JBNEVNQyxLQTVFTixFQTRFYTtBQUNULFlBQU1DLFdBQVd2QyxjQUFjc0MsTUFBTUUsVUFBTixDQUFpQkMsRUFBL0IsQ0FBakI7QUFDQSxZQUFJLENBQUNGLFFBQUwsRUFBZTtBQUNYLGtCQUFNLElBQUlHLEtBQUosQ0FBVSx3RkFBVixDQUFOO0FBQ0g7QUFDRCxlQUFPSCxTQUFTLElBQVQsRUFBZUQsTUFBTUUsVUFBckIsQ0FBUDtBQUNILEtBbEZEO0FBbUZBO0FBQ0E7QUFDQTs7O0FBckZBLGlDQXNGQUwsZUF0RkEsNEJBc0ZnQkQsU0F0RmhCLEVBc0YyQjtBQUFBOztBQUN2QkEsa0JBQVVTLFVBQVYsQ0FBcUJDLE9BQXJCLENBQTZCLHFCQUFhO0FBQ3RDN0MsK0JBQW1COEMsVUFBVUosRUFBN0IsRUFBaUMsTUFBakMsRUFBdUNJLFNBQXZDO0FBQ0gsU0FGRDtBQUdILEtBMUZEOztBQUFBO0FBQUE7QUFBQSx5QkFrQmdCO0FBQ1osbUJBQU8sS0FBS3ZDLFVBQVo7QUFDSDtBQXBCRDtBQUFBO0FBQUEseUJBcUJnQjtBQUNaLG1CQUFPLEtBQUtFLFVBQVo7QUFDSDtBQXZCRDs7QUFBQTtBQUFBLEVBQXNEWCxNQUF0RCxDQUFKO0FBNEZBSyxxQkFBcUJ6QixXQUFXLENBQUNpQixRQUFELEVBQVdDLFFBQVgsRUFBcUJDLFFBQXJCLENBQVgsRUFBMkNNLGtCQUEzQyxDQUFyQjtBQUNBLGVBQWVBLGtCQUFmIiwiZmlsZSI6InNvdXJjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgT3JiaXQsIHsgcHVsbGFibGUsIHB1c2hhYmxlLCBzeW5jYWJsZSwgU291cmNlIH0gZnJvbSAnQG9yYml0L2RhdGEnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQG9yYml0L3V0aWxzJztcbmltcG9ydCB0cmFuc2Zvcm1PcGVyYXRvcnMgZnJvbSAnLi9saWIvdHJhbnNmb3JtLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBQdWxsT3BlcmF0b3JzIH0gZnJvbSAnLi9saWIvcHVsbC1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgc3VwcG9ydHNMb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xpYi9sb2NhbC1zdG9yYWdlJztcbi8qKlxuICogU291cmNlIGZvciBzdG9yaW5nIGRhdGEgaW4gbG9jYWxTdG9yYWdlLlxuICpcbiAqIEBjbGFzcyBMb2NhbFN0b3JhZ2VTb3VyY2VcbiAqIEBleHRlbmRzIFNvdXJjZVxuICovXG5sZXQgTG9jYWxTdG9yYWdlU291cmNlID0gY2xhc3MgTG9jYWxTdG9yYWdlU291cmNlIGV4dGVuZHMgU291cmNlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgTG9jYWxTdG9yYWdlU291cmNlLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtzZXR0aW5nc10gICAgICAgICAgIFNldHRpbmdzLlxuICAgICAqIEBwYXJhbSB7U2NoZW1hfSBbc2V0dGluZ3Muc2NoZW1hXSAgICBTY2hlbWEgZm9yIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLm5hbWVzcGFjZV0gT3B0aW9uYWwuIFByZWZpeCBmb3Iga2V5cyB1c2VkIGluIGxvY2FsU3RvcmFnZS4gRGVmYXVsdHMgdG8gJ29yYml0Jy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3NldHRpbmdzLmRlbGltaXRlcl0gT3B0aW9uYWwuIERlbGltaXRlciB1c2VkIHRvIHNlcGFyYXRlIGtleSBzZWdtZW50cyBpbiBsb2NhbFN0b3JhZ2UuIERlZmF1bHRzIHRvICcvJy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICAgIGFzc2VydCgnTG9jYWxTdG9yYWdlU291cmNlXFwncyBgc2NoZW1hYCBtdXN0IGJlIHNwZWNpZmllZCBpbiBgc2V0dGluZ3Muc2NoZW1hYCBjb25zdHJ1Y3RvciBhcmd1bWVudCcsICEhc2V0dGluZ3Muc2NoZW1hKTtcbiAgICAgICAgYXNzZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbCBzdG9yYWdlIScsIHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpO1xuICAgICAgICBzZXR0aW5ncy5uYW1lID0gc2V0dGluZ3MubmFtZSB8fCAnbG9jYWxTdG9yYWdlJztcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2UgPSBzZXR0aW5ncy5uYW1lc3BhY2UgfHwgJ29yYml0JztcbiAgICAgICAgdGhpcy5fZGVsaW1pdGVyID0gc2V0dGluZ3MuZGVsaW1pdGVyIHx8ICcvJztcbiAgICB9XG4gICAgZ2V0IG5hbWVzcGFjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZTtcbiAgICB9XG4gICAgZ2V0IGRlbGltaXRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlbGltaXRlcjtcbiAgICB9XG4gICAgZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCkge1xuICAgICAgICByZXR1cm4gW3RoaXMubmFtZXNwYWNlLCByZWNvcmQudHlwZSwgcmVjb3JkLmlkXS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcbiAgICB9XG4gICAgZ2V0UmVjb3JkKHJlY29yZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleUZvclJlY29yZChyZWNvcmQpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICBpZiAocmVzdWx0ICYmIHRoaXMuX2tleU1hcCkge1xuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwdXRSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5Rm9yUmVjb3JkKHJlY29yZCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMb2NhbFN0b3JhZ2VTb3VyY2UjcHV0UmVjb3JkJywga2V5LCBKU09OLnN0cmluZ2lmeShyZWNvcmQpKTtcbiAgICAgICAgaWYgKHRoaXMuX2tleU1hcCkge1xuICAgICAgICAgICAgdGhpcy5fa2V5TWFwLnB1c2hSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkocmVjb3JkKSk7XG4gICAgfVxuICAgIHJlbW92ZVJlY29yZChyZWNvcmQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5nZXRLZXlGb3JSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xvY2FsU3RvcmFnZVNvdXJjZSNyZW1vdmVSZWNvcmQnLCBrZXksIEpTT04uc3RyaW5naWZ5KHJlY29yZCkpO1xuICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUmVzZXR0YWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gT3JiaXQuZ2xvYmFscy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZih0aGlzLm5hbWVzcGFjZSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBPcmJpdC5nbG9iYWxzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFN5bmNhYmxlIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3N5bmModHJhbnNmb3JtKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gICAgICAgIHJldHVybiBPcmJpdC5Qcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQdXNoYWJsZSBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb25cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIF9wdXNoKHRyYW5zZm9ybSkge1xuICAgICAgICB0aGlzLl9hcHBseVRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICAgICAgICByZXR1cm4gT3JiaXQuUHJvbWlzZS5yZXNvbHZlKFt0cmFuc2Zvcm1dKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQdWxsYWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX3B1bGwocXVlcnkpIHtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBQdWxsT3BlcmF0b3JzW3F1ZXJ5LmV4cHJlc3Npb24ub3BdO1xuICAgICAgICBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xvY2FsU3RvcmFnZVNvdXJjZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBgJHtxdWVyeS5leHByZXNzaW9uLm9wfWAgb3BlcmF0b3IgZm9yIHF1ZXJpZXMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wZXJhdG9yKHRoaXMsIHF1ZXJ5LmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByb3RlY3RlZFxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgX2FwcGx5VHJhbnNmb3JtKHRyYW5zZm9ybSkge1xuICAgICAgICB0cmFuc2Zvcm0ub3BlcmF0aW9ucy5mb3JFYWNoKG9wZXJhdGlvbiA9PiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1PcGVyYXRvcnNbb3BlcmF0aW9uLm9wXSh0aGlzLCBvcGVyYXRpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuTG9jYWxTdG9yYWdlU291cmNlID0gX19kZWNvcmF0ZShbcHVsbGFibGUsIHB1c2hhYmxlLCBzeW5jYWJsZV0sIExvY2FsU3RvcmFnZVNvdXJjZSk7XG5leHBvcnQgZGVmYXVsdCBMb2NhbFN0b3JhZ2VTb3VyY2U7Il19