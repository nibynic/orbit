"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function serializeRecordIdentity(record) {
    return record.type + ':' + record.id;
}
function deserializeRecordIdentity(identity) {
    var _identity$split = identity.split(':'),
        type = _identity$split[0],
        id = _identity$split[1];

    return { type: type, id: id };
}

var RecordIdentityMap = function () {
    function RecordIdentityMap(base) {
        _classCallCheck(this, RecordIdentityMap);

        var identities = this.identities = {};
        if (base) {
            Object.keys(base.identities).forEach(function (k) {
                identities[k] = true;
            });
        }
    }

    RecordIdentityMap.prototype.add = function add(record) {
        this.identities[serializeRecordIdentity(record)] = true;
    };

    RecordIdentityMap.prototype.remove = function remove(record) {
        delete this.identities[serializeRecordIdentity(record)];
    };

    RecordIdentityMap.prototype.has = function has(record) {
        if (record) {
            return !!this.identities[serializeRecordIdentity(record)];
        } else {
            return false;
        }
    };

    RecordIdentityMap.prototype.exclusiveOf = function exclusiveOf(other) {
        return Object.keys(this.identities).filter(function (id) {
            return !other.identities[id];
        }).map(function (id) {
            return deserializeRecordIdentity(id);
        });
    };

    RecordIdentityMap.prototype.equals = function equals(other) {
        return this.exclusiveOf(other).length === 0 && other.exclusiveOf(this).length === 0;
    };

    _createClass(RecordIdentityMap, [{
        key: 'values',
        get: function () {
            return Object.keys(this.identities).map(function (id) {
                return deserializeRecordIdentity(id);
            });
        }
    }]);

    return RecordIdentityMap;
}();

exports.default = RecordIdentityMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3JlY29yZC1pZGVudGl0eS1tYXAuanMiXSwibmFtZXMiOlsicmVjb3JkIiwiaWRlbnRpdHkiLCJ0eXBlIiwiaWQiLCJSZWNvcmRJZGVudGl0eU1hcCIsImlkZW50aXRpZXMiLCJPYmplY3QiLCJiYXNlIiwiYWRkIiwic2VyaWFsaXplUmVjb3JkSWRlbnRpdHkiLCJyZW1vdmUiLCJkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5IiwiaGFzIiwiZXhjbHVzaXZlT2YiLCJvdGhlciIsImVxdWFscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBQSx1QkFBQSxDQUFBLE1BQUEsRUFBeUM7QUFDckMsV0FBVUEsT0FBVixJQUFVQSxHQUFWLEdBQVVBLEdBQWVBLE9BQXpCLEVBQUE7QUFDSDtBQUNELFNBQUEseUJBQUEsQ0FBQSxRQUFBLEVBQTZDO0FBQUEsUUFBQSxrQkFDdEJDLFNBQUFBLEtBQUFBLENBRHNCLEdBQ3RCQSxDQURzQjtBQUFBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLENBQUE7QUFBQSxRQUFBLEtBQUEsZ0JBQUEsQ0FBQSxDQUFBOztBQUV6QyxXQUFPLEVBQUVDLE1BQUYsSUFBQSxFQUFRQyxJQUFmLEVBQU8sRUFBUDtBQUNIOztJQUNvQkMsb0I7QUFDakIsYUFBQSxpQkFBQSxDQUFBLElBQUEsRUFBa0I7QUFBQSx3QkFBQSxJQUFBLEVBQUEsaUJBQUE7O0FBQ2QsWUFBTUMsYUFBYSxLQUFBLFVBQUEsR0FBbkIsRUFBQTtBQUNBLFlBQUEsSUFBQSxFQUFVO0FBQ05DLG1CQUFBQSxJQUFBQSxDQUFZQyxLQUFaRCxVQUFBQSxFQUFBQSxPQUFBQSxDQUFxQyxVQUFBLENBQUEsRUFBSztBQUN0Q0QsMkJBQUFBLENBQUFBLElBQUFBLElBQUFBO0FBREpDLGFBQUFBO0FBR0g7QUFDSjs7Z0NBQ0RFLEcsZ0JBQUlSLE0sRUFBUTtBQUNSLGFBQUEsVUFBQSxDQUFnQlMsd0JBQWhCLE1BQWdCQSxDQUFoQixJQUFBLElBQUE7OztnQ0FFSkMsTSxtQkFBT1YsTSxFQUFRO0FBQ1gsZUFBTyxLQUFBLFVBQUEsQ0FBZ0JTLHdCQUF2QixNQUF1QkEsQ0FBaEIsQ0FBUDs7O2dDQUtKRyxHLGdCQUFJWixNLEVBQVE7QUFDUixZQUFBLE1BQUEsRUFBWTtBQUNSLG1CQUFPLENBQUMsQ0FBQyxLQUFBLFVBQUEsQ0FBZ0JTLHdCQUF6QixNQUF5QkEsQ0FBaEIsQ0FBVDtBQURKLFNBQUEsTUFFTztBQUNILG1CQUFBLEtBQUE7QUFDSDs7O2dDQUVMSSxXLHdCQUFZQyxLLEVBQU87QUFDZixlQUFPLE9BQUEsSUFBQSxDQUFZLEtBQVosVUFBQSxFQUFBLE1BQUEsQ0FBb0MsVUFBQSxFQUFBLEVBQUE7QUFBQSxtQkFBTSxDQUFDQSxNQUFBQSxVQUFBQSxDQUFQLEVBQU9BLENBQVA7QUFBcEMsU0FBQSxFQUFBLEdBQUEsQ0FBcUUsVUFBQSxFQUFBLEVBQUE7QUFBQSxtQkFBTUgsMEJBQU4sRUFBTUEsQ0FBTjtBQUE1RSxTQUFPLENBQVA7OztnQ0FFSkksTSxtQkFBT0QsSyxFQUFPO0FBQ1YsZUFBTyxLQUFBLFdBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQSxLQUFBLENBQUEsSUFBd0NBLE1BQUFBLFdBQUFBLENBQUFBLElBQUFBLEVBQUFBLE1BQUFBLEtBQS9DLENBQUE7Ozs7O3lCQWRTO0FBQ1QsbUJBQU8sT0FBQSxJQUFBLENBQVksS0FBWixVQUFBLEVBQUEsR0FBQSxDQUFpQyxVQUFBLEVBQUEsRUFBQTtBQUFBLHVCQUFNSCwwQkFBTixFQUFNQSxDQUFOO0FBQXhDLGFBQU8sQ0FBUDtBQUNIOzs7Ozs7a0JBakJnQlAsaUIiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpIHtcbiAgICByZXR1cm4gYCR7cmVjb3JkLnR5cGV9OiR7cmVjb3JkLmlkfWA7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5KGlkZW50aXR5KSB7XG4gICAgY29uc3QgW3R5cGUsIGlkXSA9IGlkZW50aXR5LnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY29yZElkZW50aXR5TWFwIHtcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XG4gICAgICAgIGNvbnN0IGlkZW50aXRpZXMgPSB0aGlzLmlkZW50aXRpZXMgPSB7fTtcbiAgICAgICAgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGJhc2UuaWRlbnRpdGllcykuZm9yRWFjaChrID0+IHtcbiAgICAgICAgICAgICAgICBpZGVudGl0aWVzW2tdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChyZWNvcmQpIHtcbiAgICAgICAgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldID0gdHJ1ZTtcbiAgICB9XG4gICAgcmVtb3ZlKHJlY29yZCkge1xuICAgICAgICBkZWxldGUgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldO1xuICAgIH1cbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKS5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xuICAgIH1cbiAgICBoYXMocmVjb3JkKSB7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaWRlbnRpdGllc1tzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleGNsdXNpdmVPZihvdGhlcikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKS5maWx0ZXIoaWQgPT4gIW90aGVyLmlkZW50aXRpZXNbaWRdKS5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xuICAgIH1cbiAgICBlcXVhbHMob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhjbHVzaXZlT2Yob3RoZXIpLmxlbmd0aCA9PT0gMCAmJiBvdGhlci5leGNsdXNpdmVPZih0aGlzKS5sZW5ndGggPT09IDA7XG4gICAgfVxufSJdfQ==