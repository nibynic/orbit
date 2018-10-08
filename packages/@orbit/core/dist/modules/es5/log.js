var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { assert } from '@orbit/utils';
import Orbit from './main';
import evented from './evented';
import { NotLoggedException, OutOfRangeException } from './exception';
/**
 * Logs track a series of unique events that have occurred. Each event is
 * tracked based on its unique id. The log only tracks the ids but currently
 * does not track any details.
 *
 * Logs can automatically be persisted by assigning them a bucket.
 *
 * @export
 * @class Log
 * @implements {Evented}
 */
var Log = function () {
    function Log() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Log);

        this._name = options.name;
        this._bucket = options.bucket;
        if (this._bucket) {
            assert('Log requires a name if it has a bucket', !!this._name);
        }
        this._reify(options.data);
    }

    Log.prototype.append = function append() {
        var _this = this;

        for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
            ids[_key] = arguments[_key];
        }

        return this.reified.then(function () {
            Array.prototype.push.apply(_this._data, ids);
            return _this._persist();
        }).then(function () {
            _this.emit('append', ids);
        });
    };

    Log.prototype.before = function before(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new NotLoggedException(id);
        }
        var position = index + relativePosition;
        if (position < 0 || position >= this._data.length) {
            throw new OutOfRangeException(position);
        }
        return this._data.slice(0, position);
    };

    Log.prototype.after = function after(id) {
        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var index = this._data.indexOf(id);
        if (index === -1) {
            throw new NotLoggedException(id);
        }
        var position = index + 1 + relativePosition;
        if (position < 0 || position > this._data.length) {
            throw new OutOfRangeException(position);
        }
        return this._data.slice(position);
    };

    Log.prototype.truncate = function truncate(id) {
        var _this2 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this2._data.indexOf(id);
            if (index === -1) {
                throw new NotLoggedException(id);
            }
            var position = index + relativePosition;
            if (position < 0 || position > _this2._data.length) {
                throw new OutOfRangeException(position);
            }
            if (position === _this2._data.length) {
                removed = _this2._data;
                _this2._data = [];
            } else {
                removed = _this2._data.slice(0, position);
                _this2._data = _this2._data.slice(position);
            }
            return _this2._persist();
        }).then(function () {
            _this2.emit('truncate', id, relativePosition, removed);
        });
    };

    Log.prototype.rollback = function rollback(id) {
        var _this3 = this;

        var relativePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var removed = void 0;
        return this.reified.then(function () {
            var index = _this3._data.indexOf(id);
            if (index === -1) {
                throw new NotLoggedException(id);
            }
            var position = index + 1 + relativePosition;
            if (position < 0 || position > _this3._data.length) {
                throw new OutOfRangeException(position);
            }
            removed = _this3._data.slice(position);
            _this3._data = _this3._data.slice(0, position);
            return _this3._persist();
        }).then(function () {
            _this3.emit('rollback', id, relativePosition, removed);
        });
    };

    Log.prototype.clear = function clear() {
        var _this4 = this;

        var clearedData = void 0;
        return this.reified.then(function () {
            clearedData = _this4._data;
            _this4._data = [];
            return _this4._persist();
        }).then(function () {
            return _this4.emit('clear', clearedData);
        });
    };

    Log.prototype.contains = function contains(id) {
        return this._data.indexOf(id) > -1;
    };

    Log.prototype._persist = function _persist() {
        this.emit('change');
        if (this.bucket) {
            return this._bucket.setItem(this.name, this._data);
        } else {
            return Orbit.Promise.resolve();
        }
    };

    Log.prototype._reify = function _reify(data) {
        var _this5 = this;

        if (!data && this._bucket) {
            this.reified = this._bucket.getItem(this._name).then(function (bucketData) {
                return _this5._initData(bucketData);
            });
        } else {
            this._initData(data);
            this.reified = Orbit.Promise.resolve();
        }
    };

    Log.prototype._initData = function _initData(data) {
        if (data) {
            this._data = data;
        } else {
            this._data = [];
        }
    };

    _createClass(Log, [{
        key: "name",
        get: function () {
            return this._name;
        }
    }, {
        key: "bucket",
        get: function () {
            return this._bucket;
        }
    }, {
        key: "head",
        get: function () {
            return this._data[this._data.length - 1];
        }
    }, {
        key: "entries",
        get: function () {
            return this._data;
        }
    }, {
        key: "length",
        get: function () {
            return this._data.length;
        }
    }]);

    return Log;
}();
Log = __decorate([evented], Log);
export default Log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZy5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJhc3NlcnQiLCJPcmJpdCIsImV2ZW50ZWQiLCJOb3RMb2dnZWRFeGNlcHRpb24iLCJPdXRPZlJhbmdlRXhjZXB0aW9uIiwiTG9nIiwib3B0aW9ucyIsIl9uYW1lIiwibmFtZSIsIl9idWNrZXQiLCJidWNrZXQiLCJfcmVpZnkiLCJkYXRhIiwiYXBwZW5kIiwiaWRzIiwicmVpZmllZCIsInRoZW4iLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsIl9kYXRhIiwiX3BlcnNpc3QiLCJlbWl0IiwiYmVmb3JlIiwiaWQiLCJyZWxhdGl2ZVBvc2l0aW9uIiwiaW5kZXgiLCJpbmRleE9mIiwicG9zaXRpb24iLCJzbGljZSIsImFmdGVyIiwidHJ1bmNhdGUiLCJyZW1vdmVkIiwicm9sbGJhY2siLCJjbGVhciIsImNsZWFyZWREYXRhIiwiY29udGFpbnMiLCJzZXRJdGVtIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnZXRJdGVtIiwiX2luaXREYXRhIiwiYnVja2V0RGF0YSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLGFBQWEsUUFBUSxLQUFLQSxVQUFiLElBQTJCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDakYsUUFBSUMsSUFBSUMsVUFBVUMsTUFBbEI7QUFBQSxRQUNJQyxJQUFJSCxJQUFJLENBQUosR0FBUUgsTUFBUixHQUFpQkUsU0FBUyxJQUFULEdBQWdCQSxPQUFPSyxPQUFPQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJ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TztBQUNILGlCQUFLRCxTQUFMLENBQWU5QixJQUFmO0FBQ0EsaUJBQUtHLE9BQUwsR0FBZWQsTUFBTXNDLE9BQU4sQ0FBY0MsT0FBZCxFQUFmO0FBQ0g7QUFDSixLQXpIRDs7QUFBQSxrQkEwSEFFLFNBMUhBLHNCQTBIVTlCLElBMUhWLEVBMEhnQjtBQUNaLFlBQUlBLElBQUosRUFBVTtBQUNOLGlCQUFLUyxLQUFMLEdBQWFULElBQWI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS1MsS0FBTCxHQUFhLEVBQWI7QUFDSDtBQUNKLEtBaElEOztBQUFBO0FBQUE7QUFBQSx5QkFTVztBQUNQLG1CQUFPLEtBQUtkLEtBQVo7QUFDSDtBQVhEO0FBQUE7QUFBQSx5QkFZYTtBQUNULG1CQUFPLEtBQUtFLE9BQVo7QUFDSDtBQWREO0FBQUE7QUFBQSx5QkFlVztBQUNQLG1CQUFPLEtBQUtZLEtBQUwsQ0FBVyxLQUFLQSxLQUFMLENBQVc5QixNQUFYLEdBQW9CLENBQS9CLENBQVA7QUFDSDtBQWpCRDtBQUFBO0FBQUEseUJBa0JjO0FBQ1YsbUJBQU8sS0FBSzhCLEtBQVo7QUFDSDtBQXBCRDtBQUFBO0FBQUEseUJBcUJhO0FBQ1QsbUJBQU8sS0FBS0EsS0FBTCxDQUFXOUIsTUFBbEI7QUFDSDtBQXZCRDs7QUFBQTtBQUFBLEdBQUo7QUFrSUFjLE1BQU1yQixXQUFXLENBQUNrQixPQUFELENBQVgsRUFBc0JHLEdBQXRCLENBQU47QUFDQSxlQUFlQSxHQUFmIiwiZmlsZSI6ImxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2RlY29yYXRlID0gdGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYyxcbiAgICAgICAgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO2Vsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAb3JiaXQvdXRpbHMnO1xuaW1wb3J0IE9yYml0IGZyb20gJy4vbWFpbic7XG5pbXBvcnQgZXZlbnRlZCBmcm9tICcuL2V2ZW50ZWQnO1xuaW1wb3J0IHsgTm90TG9nZ2VkRXhjZXB0aW9uLCBPdXRPZlJhbmdlRXhjZXB0aW9uIH0gZnJvbSAnLi9leGNlcHRpb24nO1xuLyoqXG4gKiBMb2dzIHRyYWNrIGEgc2VyaWVzIG9mIHVuaXF1ZSBldmVudHMgdGhhdCBoYXZlIG9jY3VycmVkLiBFYWNoIGV2ZW50IGlzXG4gKiB0cmFja2VkIGJhc2VkIG9uIGl0cyB1bmlxdWUgaWQuIFRoZSBsb2cgb25seSB0cmFja3MgdGhlIGlkcyBidXQgY3VycmVudGx5XG4gKiBkb2VzIG5vdCB0cmFjayBhbnkgZGV0YWlscy5cbiAqXG4gKiBMb2dzIGNhbiBhdXRvbWF0aWNhbGx5IGJlIHBlcnNpc3RlZCBieSBhc3NpZ25pbmcgdGhlbSBhIGJ1Y2tldC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTG9nXG4gKiBAaW1wbGVtZW50cyB7RXZlbnRlZH1cbiAqL1xubGV0IExvZyA9IGNsYXNzIExvZyB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgICAgIHRoaXMuX2J1Y2tldCA9IG9wdGlvbnMuYnVja2V0O1xuICAgICAgICBpZiAodGhpcy5fYnVja2V0KSB7XG4gICAgICAgICAgICBhc3NlcnQoJ0xvZyByZXF1aXJlcyBhIG5hbWUgaWYgaXQgaGFzIGEgYnVja2V0JywgISF0aGlzLl9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWlmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCBidWNrZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9idWNrZXQ7XG4gICAgfVxuICAgIGdldCBoZWFkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmxlbmd0aDtcbiAgICB9XG4gICAgYXBwZW5kKC4uLmlkcykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fZGF0YSwgaWRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdhcHBlbmQnLCBpZHMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYmVmb3JlKGlkLCByZWxhdGl2ZVBvc2l0aW9uID0gMCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGEuaW5kZXhPZihpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOb3RMb2dnZWRFeGNlcHRpb24oaWQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXggKyByZWxhdGl2ZVBvc2l0aW9uO1xuICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IHRoaXMuX2RhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT3V0T2ZSYW5nZUV4Y2VwdGlvbihwb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgIH1cbiAgICBhZnRlcihpZCwgcmVsYXRpdmVQb3NpdGlvbiA9IDApIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTm90TG9nZ2VkRXhjZXB0aW9uKGlkKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGluZGV4ICsgMSArIHJlbGF0aXZlUG9zaXRpb247XG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnNsaWNlKHBvc2l0aW9uKTtcbiAgICB9XG4gICAgdHJ1bmNhdGUoaWQsIHJlbGF0aXZlUG9zaXRpb24gPSAwKSB7XG4gICAgICAgIGxldCByZW1vdmVkO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RMb2dnZWRFeGNlcHRpb24oaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIHJlbGF0aXZlUG9zaXRpb247XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gdGhpcy5fZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgT3V0T2ZSYW5nZUV4Y2VwdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IHRoaXMuX2RhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZCA9IHRoaXMuX2RhdGE7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkID0gdGhpcy5fZGF0YS5zbGljZSgwLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuc2xpY2UocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RydW5jYXRlJywgaWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcm9sbGJhY2soaWQsIHJlbGF0aXZlUG9zaXRpb24gPSAwKSB7XG4gICAgICAgIGxldCByZW1vdmVkO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWlmaWVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhLmluZGV4T2YoaWQpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RMb2dnZWRFeGNlcHRpb24oaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBpbmRleCArIDEgKyByZWxhdGl2ZVBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE91dE9mUmFuZ2VFeGNlcHRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlZCA9IHRoaXMuX2RhdGEuc2xpY2UocG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNpc3QoKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JvbGxiYWNrJywgaWQsIHJlbGF0aXZlUG9zaXRpb24sIHJlbW92ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjbGVhcmVkRGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVpZmllZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyZWREYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0KCk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4gdGhpcy5lbWl0KCdjbGVhcicsIGNsZWFyZWREYXRhKSk7XG4gICAgfVxuICAgIGNvbnRhaW5zKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmluZGV4T2YoaWQpID4gLTE7XG4gICAgfVxuICAgIF9wZXJzaXN0KCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgICAgICBpZiAodGhpcy5idWNrZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWNrZXQuc2V0SXRlbSh0aGlzLm5hbWUsIHRoaXMuX2RhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZWlmeShkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSAmJiB0aGlzLl9idWNrZXQpIHtcbiAgICAgICAgICAgIHRoaXMucmVpZmllZCA9IHRoaXMuX2J1Y2tldC5nZXRJdGVtKHRoaXMuX25hbWUpLnRoZW4oYnVja2V0RGF0YSA9PiB0aGlzLl9pbml0RGF0YShidWNrZXREYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0RGF0YShkYXRhKTtcbiAgICAgICAgICAgIHRoaXMucmVpZmllZCA9IE9yYml0LlByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9pbml0RGF0YShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5Mb2cgPSBfX2RlY29yYXRlKFtldmVudGVkXSwgTG9nKTtcbmV4cG9ydCBkZWZhdWx0IExvZzsiXX0=