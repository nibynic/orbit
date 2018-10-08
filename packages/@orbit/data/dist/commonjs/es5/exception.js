"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordAlreadyExistsException = exports.RelationshipNotFoundException = exports.RecordNotFoundException = exports.RecordException = exports.ModelNotFound = exports.SchemaError = exports.TransformNotAllowed = exports.QueryNotAllowed = exports.QueryExpressionParseError = exports.NetworkError = exports.ServerError = exports.ClientError = undefined;

var _core = require("@orbit/core");

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

/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
var ClientError = exports.ClientError = function (_Exception) {
    _inherits(ClientError, _Exception);

    function ClientError(description) {
        _classCallCheck(this, ClientError);

        var _this = _possibleConstructorReturn(this, _Exception.call(this, 'Client error: ' + description));

        _this.description = description;
        return _this;
    }

    return ClientError;
}(_core.Exception);
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
var ServerError = exports.ServerError = function (_Exception2) {
    _inherits(ServerError, _Exception2);

    function ServerError(description) {
        _classCallCheck(this, ServerError);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, 'Server error: ' + description));

        _this2.description = description;
        return _this2;
    }

    return ServerError;
}(_core.Exception);
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
var NetworkError = exports.NetworkError = function (_Exception3) {
    _inherits(NetworkError, _Exception3);

    function NetworkError(description) {
        _classCallCheck(this, NetworkError);

        var _this3 = _possibleConstructorReturn(this, _Exception3.call(this, 'Network error: ' + description));

        _this3.description = description;
        return _this3;
    }

    return NetworkError;
}(_core.Exception);
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
var QueryExpressionParseError = exports.QueryExpressionParseError = function (_Exception4) {
    _inherits(QueryExpressionParseError, _Exception4);

    function QueryExpressionParseError(description, expression) {
        _classCallCheck(this, QueryExpressionParseError);

        var _this4 = _possibleConstructorReturn(this, _Exception4.call(this, 'Query expression parse error: ' + description));

        _this4.description = description;
        _this4.expression = expression;
        return _this4;
    }

    return QueryExpressionParseError;
}(_core.Exception);
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
var QueryNotAllowed = exports.QueryNotAllowed = function (_Exception5) {
    _inherits(QueryNotAllowed, _Exception5);

    function QueryNotAllowed(description, query) {
        _classCallCheck(this, QueryNotAllowed);

        var _this5 = _possibleConstructorReturn(this, _Exception5.call(this, 'Query not allowed: ' + description));

        _this5.description = description;
        _this5.query = query;
        return _this5;
    }

    return QueryNotAllowed;
}(_core.Exception);
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
var TransformNotAllowed = exports.TransformNotAllowed = function (_Exception6) {
    _inherits(TransformNotAllowed, _Exception6);

    function TransformNotAllowed(description, transform) {
        _classCallCheck(this, TransformNotAllowed);

        var _this6 = _possibleConstructorReturn(this, _Exception6.call(this, 'Transform not allowed: ' + description));

        _this6.description = description;
        _this6.transform = transform;
        return _this6;
    }

    return TransformNotAllowed;
}(_core.Exception);
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
var SchemaError = exports.SchemaError = function (_Exception7) {
    _inherits(SchemaError, _Exception7);

    function SchemaError(description) {
        _classCallCheck(this, SchemaError);

        var _this7 = _possibleConstructorReturn(this, _Exception7.call(this, 'Schema error: ' + description));

        _this7.description = description;
        return _this7;
    }

    return SchemaError;
}(_core.Exception);
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
var ModelNotFound = exports.ModelNotFound = function (_SchemaError) {
    _inherits(ModelNotFound, _SchemaError);

    function ModelNotFound(type) {
        _classCallCheck(this, ModelNotFound);

        return _possibleConstructorReturn(this, _SchemaError.call(this, 'Model definition for ' + type + ' not found'));
    }

    return ModelNotFound;
}(SchemaError);
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
var RecordException = exports.RecordException = function (_Exception8) {
    _inherits(RecordException, _Exception8);

    function RecordException(description, type, id, relationship) {
        _classCallCheck(this, RecordException);

        var message = description + ': ' + type + ':' + id;
        if (relationship) {
            message += '/' + relationship;
        }

        var _this9 = _possibleConstructorReturn(this, _Exception8.call(this, message));

        _this9.description = description;
        _this9.type = type;
        _this9.id = id;
        _this9.relationship = relationship;
        return _this9;
    }

    return RecordException;
}(_core.Exception);
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
var RecordNotFoundException = exports.RecordNotFoundException = function (_RecordException) {
    _inherits(RecordNotFoundException, _RecordException);

    function RecordNotFoundException(type, id) {
        _classCallCheck(this, RecordNotFoundException);

        return _possibleConstructorReturn(this, _RecordException.call(this, 'Record not found', type, id));
    }

    return RecordNotFoundException;
}(RecordException);
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
var RelationshipNotFoundException = exports.RelationshipNotFoundException = function (_RecordException2) {
    _inherits(RelationshipNotFoundException, _RecordException2);

    function RelationshipNotFoundException(type, id, relationship) {
        _classCallCheck(this, RelationshipNotFoundException);

        return _possibleConstructorReturn(this, _RecordException2.call(this, 'Relationship not found', type, id, relationship));
    }

    return RelationshipNotFoundException;
}(RecordException);
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
var RecordAlreadyExistsException = exports.RecordAlreadyExistsException = function (_RecordException3) {
    _inherits(RecordAlreadyExistsException, _RecordException3);

    function RecordAlreadyExistsException(type, id) {
        _classCallCheck(this, RecordAlreadyExistsException);

        return _possibleConstructorReturn(this, _RecordException3.call(this, 'Record already exists', type, id));
    }

    return RecordAlreadyExistsException;
}(RecordException);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7OztBQU9BLElBQUEsb0NBQUEsVUFBQSxVQUFBLEVBQUE7QUFBQSxjQUFBLFdBQUEsRUFBQSxVQUFBOztBQUNJLGFBQUEsV0FBQSxDQUFBLFdBQUEsRUFBeUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsV0FBQTs7QUFBQSxZQUFBLFFBQUEsMkJBQUEsSUFBQSxFQUNyQixXQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsbUJBRHFCLFdBQ3JCLENBRHFCLENBQUE7O0FBRXJCLGNBQUEsV0FBQSxHQUFBLFdBQUE7QUFGcUIsZUFBQSxLQUFBO0FBR3hCOztBQUpMLFdBQUEsV0FBQTtBQUFBLENBQUEsQ0FBQSxlQUFBLENBQUE7QUFNQTs7Ozs7OztBQU9BLElBQUEsb0NBQUEsVUFBQSxXQUFBLEVBQUE7QUFBQSxjQUFBLFdBQUEsRUFBQSxXQUFBOztBQUNJLGFBQUEsV0FBQSxDQUFBLFdBQUEsRUFBeUI7QUFBQSx3QkFBQSxJQUFBLEVBQUEsV0FBQTs7QUFBQSxZQUFBLFNBQUEsMkJBQUEsSUFBQSxFQUNyQixZQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsbUJBRHFCLFdBQ3JCLENBRHFCLENBQUE7O0FBRXJCLGVBQUEsV0FBQSxHQUFBLFdBQUE7QUFGcUIsZUFBQSxNQUFBO0FBR3hCOztBQUpMLFdBQUEsV0FBQTtBQUFBLENBQUEsQ0FBQSxlQUFBLENBQUE7QUFNQTs7Ozs7Ozs7QUFRQSxJQUFBLHNDQUFBLFVBQUEsV0FBQSxFQUFBO0FBQUEsY0FBQSxZQUFBLEVBQUEsV0FBQTs7QUFDSSxhQUFBLFlBQUEsQ0FBQSxXQUFBLEVBQXlCO0FBQUEsd0JBQUEsSUFBQSxFQUFBLFlBQUE7O0FBQUEsWUFBQSxTQUFBLDJCQUFBLElBQUEsRUFDckIsWUFBQSxJQUFBLENBQUEsSUFBQSxFQUFBLG9CQURxQixXQUNy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QUFBO0FBRW5DOztBQUhMLFdBQUEsNkJBQUE7QUFBQSxDQUFBLENBQUEsZUFBQSxDQUFBO0FBS0E7Ozs7Ozs7QUFPQSxJQUFBLHNFQUFBLFVBQUEsaUJBQUEsRUFBQTtBQUFBLGNBQUEsNEJBQUEsRUFBQSxpQkFBQTs7QUFDSSxhQUFBLDRCQUFBLENBQUEsSUFBQSxFQUFBLEVBQUEsRUFBc0I7QUFBQSx3QkFBQSxJQUFBLEVBQUEsNEJBQUE7O0FBQUEsZUFBQSwyQkFBQSxJQUFBLEVBQ2xCLGtCQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsdUJBQUEsRUFBQSxJQUFBLEVBRGtCLEVBQ2xCLENBRGtCLENBQUE7QUFFckI7O0FBSEwsV0FBQSw0QkFBQTtBQUFBLENBQUEsQ0FBQSxlQUFBLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeGNlcHRpb24gfSBmcm9tICdAb3JiaXQvY29yZSc7XG4vKipcbiAqIEFuIGNsaWVudC1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENsaWVudEVycm9yXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50RXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBDbGllbnQgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgc2VydmVyLXNpZGUgZXJyb3Igb2NjdXJyZWQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIGEgcmVtb3RlIHNlcnZlci5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgU2VydmVyRXJyb3JcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoYFNlcnZlciBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBuZXR3b3JraW5nIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gY29tbXVuaWNhdGUgd2l0aCBhIHJlbW90ZVxuICogc2VydmVyLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBOZXR3b3JrRXJyb3JcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBOZXR3b3JrIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHF1ZXJ5IGV4cHJlc3Npb24gY291bGQgbm90IGJlIHBhcnNlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHN1cGVyKGBRdWVyeSBleHByZXNzaW9uIHBhcnNlIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHF1ZXJ5IGlzIGludmFsaWQgZm9yIGEgcGFydGljdWxhciBzb3VyY2UuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZFxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHF1ZXJ5KSB7XG4gICAgICAgIHN1cGVyKGBRdWVyeSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgfVxufVxuLyoqXG4gKiBBIHRyYW5zZm9ybSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBUcmFuc2Zvcm1Ob3RBbGxvd2VkXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHRyYW5zZm9ybSkge1xuICAgICAgICBzdXBlcihgVHJhbnNmb3JtIG5vdCBhbGxvd2VkOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgIH1cbn1cbi8qKlxuICogQW4gZXJyb3Igb2NjdXJlZCByZWxhdGVkIHRvIHRoZSBzY2hlbWEuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNjaGVtYUVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlbWFFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoYFNjaGVtYSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBtb2RlbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIHNjaGVtYS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTW9kZWxOb3RGb3VuZFxuICovXG5leHBvcnQgY2xhc3MgTW9kZWxOb3RGb3VuZCBleHRlbmRzIFNjaGVtYUVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgICAgIHN1cGVyKGBNb2RlbCBkZWZpbml0aW9uIGZvciAke3R5cGV9IG5vdCBmb3VuZGApO1xuICAgIH1cbn1cbi8qKlxuICogQW4gZXJyb3Igb2NjdXJyZWQgcmVsYXRlZCB0byBhIHBhcnRpY3VsYXIgcmVjb3JkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBhYnN0cmFjdFxuICogQGNsYXNzIFJlY29yZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBgJHtkZXNjcmlwdGlvbn06ICR7dHlwZX06JHtpZH1gO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9ICcvJyArIHJlbGF0aW9uc2hpcDtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xuICAgIH1cbn1cbi8qKlxuICogQSByZWNvcmQgY291bGQgbm90IGJlIGZvdW5kLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBpZCkge1xuICAgICAgICBzdXBlcignUmVjb3JkIG5vdCBmb3VuZCcsIHR5cGUsIGlkKTtcbiAgICB9XG59XG4vKipcbiAqIEEgcmVsYXRpb25zaGlwIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBzdXBlcignUmVsYXRpb25zaGlwIG5vdCBmb3VuZCcsIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApO1xuICAgIH1cbn1cbi8qKlxuICogVGhlIHJlY29yZCBhbHJlYWR5IGV4aXN0cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvblxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGlkKSB7XG4gICAgICAgIHN1cGVyKCdSZWNvcmQgYWxyZWFkeSBleGlzdHMnLCB0eXBlLCBpZCk7XG4gICAgfVxufSJdfQ==