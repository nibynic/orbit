var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

export default RecordIdentityMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlL3JlY29yZC1pZGVudGl0eS1tYXAuanMiXSwibmFtZXMiOlsic2VyaWFsaXplUmVjb3JkSWRlbnRpdHkiLCJyZWNvcmQiLCJ0eXBlIiwiaWQiLCJkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5IiwiaWRlbnRpdHkiLCJzcGxpdCIsIlJlY29yZElkZW50aXR5TWFwIiwiYmFzZSIsImlkZW50aXRpZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJhZGQiLCJyZW1vdmUiLCJoYXMiLCJleGNsdXNpdmVPZiIsIm90aGVyIiwiZmlsdGVyIiwibWFwIiwiZXF1YWxzIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsU0FBU0EsdUJBQVQsQ0FBaUNDLE1BQWpDLEVBQXlDO0FBQ3JDLFdBQVVBLE9BQU9DLElBQWpCLFNBQXlCRCxPQUFPRSxFQUFoQztBQUNIO0FBQ0QsU0FBU0MseUJBQVQsQ0FBbUNDLFFBQW5DLEVBQTZDO0FBQUEsMEJBQ3RCQSxTQUFTQyxLQUFULENBQWUsR0FBZixDQURzQjtBQUFBLFFBQ2xDSixJQURrQztBQUFBLFFBQzVCQyxFQUQ0Qjs7QUFFekMsV0FBTyxFQUFFRCxVQUFGLEVBQVFDLE1BQVIsRUFBUDtBQUNIOztJQUNvQkksaUI7QUFDakIsK0JBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDZCxZQUFNQyxhQUFhLEtBQUtBLFVBQUwsR0FBa0IsRUFBckM7QUFDQSxZQUFJRCxJQUFKLEVBQVU7QUFDTkUsbUJBQU9DLElBQVAsQ0FBWUgsS0FBS0MsVUFBakIsRUFBNkJHLE9BQTdCLENBQXFDLGFBQUs7QUFDdENILDJCQUFXSSxDQUFYLElBQWdCLElBQWhCO0FBQ0gsYUFGRDtBQUdIO0FBQ0o7O2dDQUNEQyxHLGdCQUFJYixNLEVBQVE7QUFDUixhQUFLUSxVQUFMLENBQWdCVCx3QkFBd0JDLE1BQXhCLENBQWhCLElBQW1ELElBQW5EO0FBQ0gsSzs7Z0NBQ0RjLE0sbUJBQU9kLE0sRUFBUTtBQUNYLGVBQU8sS0FBS1EsVUFBTCxDQUFnQlQsd0JBQXdCQyxNQUF4QixDQUFoQixDQUFQO0FBQ0gsSzs7Z0NBSURlLEcsZ0JBQUlmLE0sRUFBUTtBQUNSLFlBQUlBLE1BQUosRUFBWTtBQUNSLG1CQUFPLENBQUMsQ0FBQyxLQUFLUSxVQUFMLENBQWdCVCx3QkFBd0JDLE1BQXhCLENBQWhCLENBQVQ7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxLQUFQO0FBQ0g7QUFDSixLOztnQ0FDRGdCLFcsd0JBQVlDLEssRUFBTztBQUNmLGVBQU9SLE9BQU9DLElBQVAsQ0FBWSxLQUFLRixVQUFqQixFQUE2QlUsTUFBN0IsQ0FBb0M7QUFBQSxtQkFBTSxDQUFDRCxNQUFNVCxVQUFOLENBQWlCTixFQUFqQixDQUFQO0FBQUEsU0FBcEMsRUFBaUVpQixHQUFqRSxDQUFxRTtBQUFBLG1CQUFNaEIsMEJBQTBCRCxFQUExQixDQUFOO0FBQUEsU0FBckUsQ0FBUDtBQUNILEs7O2dDQUNEa0IsTSxtQkFBT0gsSyxFQUFPO0FBQ1YsZUFBTyxLQUFLRCxXQUFMLENBQWlCQyxLQUFqQixFQUF3QkksTUFBeEIsS0FBbUMsQ0FBbkMsSUFBd0NKLE1BQU1ELFdBQU4sQ0FBa0IsSUFBbEIsRUFBd0JLLE1BQXhCLEtBQW1DLENBQWxGO0FBQ0gsSzs7Ozt5QkFmWTtBQUNULG1CQUFPWixPQUFPQyxJQUFQLENBQVksS0FBS0YsVUFBakIsRUFBNkJXLEdBQTdCLENBQWlDO0FBQUEsdUJBQU1oQiwwQkFBMEJELEVBQTFCLENBQU47QUFBQSxhQUFqQyxDQUFQO0FBQ0g7Ozs7OztlQWpCZ0JJLGlCIiwiZmlsZSI6ImNhY2hlL3JlY29yZC1pZGVudGl0eS1tYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpIHtcbiAgICByZXR1cm4gYCR7cmVjb3JkLnR5cGV9OiR7cmVjb3JkLmlkfWA7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVJlY29yZElkZW50aXR5KGlkZW50aXR5KSB7XG4gICAgY29uc3QgW3R5cGUsIGlkXSA9IGlkZW50aXR5LnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIHsgdHlwZSwgaWQgfTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY29yZElkZW50aXR5TWFwIHtcbiAgICBjb25zdHJ1Y3RvcihiYXNlKSB7XG4gICAgICAgIGNvbnN0IGlkZW50aXRpZXMgPSB0aGlzLmlkZW50aXRpZXMgPSB7fTtcbiAgICAgICAgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGJhc2UuaWRlbnRpdGllcykuZm9yRWFjaChrID0+IHtcbiAgICAgICAgICAgICAgICBpZGVudGl0aWVzW2tdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChyZWNvcmQpIHtcbiAgICAgICAgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldID0gdHJ1ZTtcbiAgICB9XG4gICAgcmVtb3ZlKHJlY29yZCkge1xuICAgICAgICBkZWxldGUgdGhpcy5pZGVudGl0aWVzW3NlcmlhbGl6ZVJlY29yZElkZW50aXR5KHJlY29yZCldO1xuICAgIH1cbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKS5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xuICAgIH1cbiAgICBoYXMocmVjb3JkKSB7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaWRlbnRpdGllc1tzZXJpYWxpemVSZWNvcmRJZGVudGl0eShyZWNvcmQpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleGNsdXNpdmVPZihvdGhlcikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pZGVudGl0aWVzKS5maWx0ZXIoaWQgPT4gIW90aGVyLmlkZW50aXRpZXNbaWRdKS5tYXAoaWQgPT4gZGVzZXJpYWxpemVSZWNvcmRJZGVudGl0eShpZCkpO1xuICAgIH1cbiAgICBlcXVhbHMob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhjbHVzaXZlT2Yob3RoZXIpLmxlbmd0aCA9PT0gMCAmJiBvdGhlci5leGNsdXNpdmVPZih0aGlzKS5sZW5ndGggPT09IDA7XG4gICAgfVxufSJdfQ==