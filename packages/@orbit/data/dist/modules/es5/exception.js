function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import { Exception } from '@orbit/core';
/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
export var ClientError = function (_Exception) {
    _inherits(ClientError, _Exception);

    function ClientError(description) {
        _classCallCheck(this, ClientError);

        var _this = _possibleConstructorReturn(this, _Exception.call(this, 'Client error: ' + description));

        _this.description = description;
        return _this;
    }

    return ClientError;
}(Exception);
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
export var ServerError = function (_Exception2) {
    _inherits(ServerError, _Exception2);

    function ServerError(description) {
        _classCallCheck(this, ServerError);

        var _this2 = _possibleConstructorReturn(this, _Exception2.call(this, 'Server error: ' + description));

        _this2.description = description;
        return _this2;
    }

    return ServerError;
}(Exception);
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
export var NetworkError = function (_Exception3) {
    _inherits(NetworkError, _Exception3);

    function NetworkError(description) {
        _classCallCheck(this, NetworkError);

        var _this3 = _possibleConstructorReturn(this, _Exception3.call(this, 'Network error: ' + description));

        _this3.description = description;
        return _this3;
    }

    return NetworkError;
}(Exception);
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
export var QueryExpressionParseError = function (_Exception4) {
    _inherits(QueryExpressionParseError, _Exception4);

    function QueryExpressionParseError(description, expression) {
        _classCallCheck(this, QueryExpressionParseError);

        var _this4 = _possibleConstructorReturn(this, _Exception4.call(this, 'Query expression parse error: ' + description));

        _this4.description = description;
        _this4.expression = expression;
        return _this4;
    }

    return QueryExpressionParseError;
}(Exception);
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
export var QueryNotAllowed = function (_Exception5) {
    _inherits(QueryNotAllowed, _Exception5);

    function QueryNotAllowed(description, query) {
        _classCallCheck(this, QueryNotAllowed);

        var _this5 = _possibleConstructorReturn(this, _Exception5.call(this, 'Query not allowed: ' + description));

        _this5.description = description;
        _this5.query = query;
        return _this5;
    }

    return QueryNotAllowed;
}(Exception);
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
export var TransformNotAllowed = function (_Exception6) {
    _inherits(TransformNotAllowed, _Exception6);

    function TransformNotAllowed(description, transform) {
        _classCallCheck(this, TransformNotAllowed);

        var _this6 = _possibleConstructorReturn(this, _Exception6.call(this, 'Transform not allowed: ' + description));

        _this6.description = description;
        _this6.transform = transform;
        return _this6;
    }

    return TransformNotAllowed;
}(Exception);
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
export var SchemaError = function (_Exception7) {
    _inherits(SchemaError, _Exception7);

    function SchemaError(description) {
        _classCallCheck(this, SchemaError);

        var _this7 = _possibleConstructorReturn(this, _Exception7.call(this, 'Schema error: ' + description));

        _this7.description = description;
        return _this7;
    }

    return SchemaError;
}(Exception);
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
export var ModelNotFound = function (_SchemaError) {
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
export var RecordException = function (_Exception8) {
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
}(Exception);
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
export var RecordNotFoundException = function (_RecordException) {
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
export var RelationshipNotFoundException = function (_RecordException2) {
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
export var RecordAlreadyExistsException = function (_RecordException3) {
    _inherits(RecordAlreadyExistsException, _RecordException3);

    function RecordAlreadyExistsException(type, id) {
        _classCallCheck(this, RecordAlreadyExistsException);

        return _possibleConstructorReturn(this, _RecordException3.call(this, 'Record already exists', type, id));
    }

    return RecordAlreadyExistsException;
}(RecordException);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJFeGNlcHRpb24iLCJDbGllbnRFcnJvciIsImRlc2NyaXB0aW9uIiwiU2VydmVyRXJyb3IiLCJOZXR3b3JrRXJyb3IiLCJRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIiwiZXhwcmVzc2lvbiIsIlF1ZXJ5Tm90QWxsb3dlZCIsInF1ZXJ5IiwiVHJhbnNmb3JtTm90QWxsb3dlZCIsInRyYW5zZm9ybSIsIlNjaGVtYUVycm9yIiwiTW9kZWxOb3RGb3VuZCIsInR5cGUiLCJSZWNvcmRFeGNlcHRpb24iLCJpZCIsInJlbGF0aW9uc2hpcCIsIm1lc3NhZ2UiLCJSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbiIsIlJlbGF0aW9uc2hpcE5vdEZvdW5kRXhjZXB0aW9uIiwiUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxTQUFTQSxTQUFULFFBQTBCLGFBQTFCO0FBQ0E7Ozs7Ozs7QUFPQSxXQUFhQyxXQUFiO0FBQUE7O0FBQ0kseUJBQVlDLFdBQVosRUFBeUI7QUFBQTs7QUFBQSxxREFDckIseUNBQXVCQSxXQUF2QixDQURxQjs7QUFFckIsY0FBS0EsV0FBTCxHQUFtQkEsV0FBbkI7QUFGcUI7QUFHeEI7O0FBSkw7QUFBQSxFQUFpQ0YsU0FBakM7QUFNQTs7Ozs7OztBQU9BLFdBQWFHLFdBQWI7QUFBQTs7QUFDSSx5QkFBWUQsV0FBWixFQUF5QjtBQUFBOztBQUFBLHNEQUNyQiwwQ0FBdUJBLFdBQXZCLENBRHFCOztBQUVyQixlQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUZxQjtBQUd4Qjs7QUFKTDtBQUFBLEVBQWlDRixTQUFqQztBQU1BOzs7Ozs7OztBQVFBLFdBQWFJLFlBQWI7QUFBQTs7QUFDSSwwQkFBWUYsV0FBWixFQUF5QjtBQUFBOztBQUFBLHNEQUNyQiwyQ0FBd0JBLFdBQXhCLENBRHFCOztBQUVyQixlQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUZxQjtBQUd4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QSxFQUFrREQsZUFBbEQiLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhjZXB0aW9uIH0gZnJvbSAnQG9yYml0L2NvcmUnO1xuLyoqXG4gKiBBbiBjbGllbnQtc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggYSByZW1vdGUgc2VydmVyLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBDbGllbnRFcnJvclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWVudEVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbikge1xuICAgICAgICBzdXBlcihgQ2xpZW50IGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHNlcnZlci1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNlcnZlckVycm9yXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgU2VydmVyRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBTZXJ2ZXIgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgbmV0d29ya2luZyBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGNvbW11bmljYXRlIHdpdGggYSByZW1vdGVcbiAqIHNlcnZlci5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTmV0d29ya0Vycm9yXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0Vycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbikge1xuICAgICAgICBzdXBlcihgTmV0d29yayBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBxdWVyeSBleHByZXNzaW9uIGNvdWxkIG5vdCBiZSBwYXJzZWQuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3JcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBRdWVyeUV4cHJlc3Npb25QYXJzZUVycm9yIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgZXhwcmVzc2lvbikge1xuICAgICAgICBzdXBlcihgUXVlcnkgZXhwcmVzc2lvbiBwYXJzZSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBxdWVyeSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBRdWVyeU5vdEFsbG93ZWRcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBRdWVyeU5vdEFsbG93ZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBxdWVyeSkge1xuICAgICAgICBzdXBlcihgUXVlcnkgbm90IGFsbG93ZWQ6ICR7ZGVzY3JpcHRpb259YCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuICAgIH1cbn1cbi8qKlxuICogQSB0cmFuc2Zvcm0gaXMgaW52YWxpZCBmb3IgYSBwYXJ0aWN1bGFyIHNvdXJjZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZFxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybU5vdEFsbG93ZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCB0cmFuc2Zvcm0pIHtcbiAgICAgICAgc3VwZXIoYFRyYW5zZm9ybSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICB9XG59XG4vKipcbiAqIEFuIGVycm9yIG9jY3VyZWQgcmVsYXRlZCB0byB0aGUgc2NoZW1hLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBTY2hlbWFFcnJvclxuICovXG5leHBvcnQgY2xhc3MgU2NoZW1hRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBTY2hlbWEgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgbW9kZWwgY291bGQgbm90IGJlIGZvdW5kIGluIHRoZSBzY2hlbWEuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIE1vZGVsTm90Rm91bmRcbiAqL1xuZXhwb3J0IGNsYXNzIE1vZGVsTm90Rm91bmQgZXh0ZW5kcyBTY2hlbWFFcnJvciB7XG4gICAgY29uc3RydWN0b3IodHlwZSkge1xuICAgICAgICBzdXBlcihgTW9kZWwgZGVmaW5pdGlvbiBmb3IgJHt0eXBlfSBub3QgZm91bmRgKTtcbiAgICB9XG59XG4vKipcbiAqIEFuIGVycm9yIG9jY3VycmVkIHJlbGF0ZWQgdG8gYSBwYXJ0aWN1bGFyIHJlY29yZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAYWJzdHJhY3RcbiAqIEBjbGFzcyBSZWNvcmRFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNvcmRFeGNlcHRpb24gZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCB0eXBlLCBpZCwgcmVsYXRpb25zaGlwKSB7XG4gICAgICAgIGxldCBtZXNzYWdlID0gYCR7ZGVzY3JpcHRpb259OiAke3R5cGV9OiR7aWR9YDtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgbWVzc2FnZSArPSAnLycgKyByZWxhdGlvbnNoaXA7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcDtcbiAgICB9XG59XG4vKipcbiAqIEEgcmVjb3JkIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUmVjb3JkTm90Rm91bmRFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IodHlwZSwgaWQpIHtcbiAgICAgICAgc3VwZXIoJ1JlY29yZCBub3QgZm91bmQnLCB0eXBlLCBpZCk7XG4gICAgfVxufVxuLyoqXG4gKiBBIHJlbGF0aW9uc2hpcCBjb3VsZCBub3QgYmUgZm91bmQuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFJlbGF0aW9uc2hpcE5vdEZvdW5kRXhjZXB0aW9uXG4gKiBAZXh0ZW5kcyB7UmVjb3JkRXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGlkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgc3VwZXIoJ1JlbGF0aW9uc2hpcCBub3QgZm91bmQnLCB0eXBlLCBpZCwgcmVsYXRpb25zaGlwKTtcbiAgICB9XG59XG4vKipcbiAqIFRoZSByZWNvcmQgYWxyZWFkeSBleGlzdHMuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNvcmRBbHJlYWR5RXhpc3RzRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBpZCkge1xuICAgICAgICBzdXBlcignUmVjb3JkIGFscmVhZHkgZXhpc3RzJywgdHlwZSwgaWQpO1xuICAgIH1cbn0iXX0=