'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordAlreadyExistsException = exports.RelationshipNotFoundException = exports.RecordNotFoundException = exports.RecordException = exports.ModelNotFound = exports.SchemaError = exports.TransformNotAllowed = exports.QueryNotAllowed = exports.QueryExpressionParseError = exports.NetworkError = exports.ServerError = exports.ClientError = undefined;

var _core = require('@orbit/core');

/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
class ClientError extends _core.Exception {
    constructor(description) {
        super(`Client error: ${description}`);
        this.description = description;
    }
}
exports.ClientError = ClientError; /**
                                    * A server-side error occurred while communicating with a remote server.
                                    *
                                    * @export
                                    * @class ServerError
                                    * @extends {Exception}
                                    */

class ServerError extends _core.Exception {
    constructor(description) {
        super(`Server error: ${description}`);
        this.description = description;
    }
}
exports.ServerError = ServerError; /**
                                    * A networking error occurred while attempting to communicate with a remote
                                    * server.
                                    *
                                    * @export
                                    * @class NetworkError
                                    * @extends {Exception}
                                    */

class NetworkError extends _core.Exception {
    constructor(description) {
        super(`Network error: ${description}`);
        this.description = description;
    }
}
exports.NetworkError = NetworkError; /**
                                      * A query expression could not be parsed.
                                      *
                                      * @export
                                      * @class QueryExpressionParseError
                                      * @extends {Exception}
                                      */

class QueryExpressionParseError extends _core.Exception {
    constructor(description, expression) {
        super(`Query expression parse error: ${description}`);
        this.description = description;
        this.expression = expression;
    }
}
exports.QueryExpressionParseError = QueryExpressionParseError; /**
                                                                * A query is invalid for a particular source.
                                                                *
                                                                * @export
                                                                * @class QueryNotAllowed
                                                                * @extends {Exception}
                                                                */

class QueryNotAllowed extends _core.Exception {
    constructor(description, query) {
        super(`Query not allowed: ${description}`);
        this.description = description;
        this.query = query;
    }
}
exports.QueryNotAllowed = QueryNotAllowed; /**
                                            * A transform is invalid for a particular source.
                                            *
                                            * @export
                                            * @class TransformNotAllowed
                                            * @extends {Exception}
                                            */

class TransformNotAllowed extends _core.Exception {
    constructor(description, transform) {
        super(`Transform not allowed: ${description}`);
        this.description = description;
        this.transform = transform;
    }
}
exports.TransformNotAllowed = TransformNotAllowed; /**
                                                    * An error occured related to the schema.
                                                    *
                                                    * @export
                                                    * @class SchemaError
                                                    */

class SchemaError extends _core.Exception {
    constructor(description) {
        super(`Schema error: ${description}`);
        this.description = description;
    }
}
exports.SchemaError = SchemaError; /**
                                    * A model could not be found in the schema.
                                    *
                                    * @export
                                    * @class ModelNotFound
                                    */

class ModelNotFound extends SchemaError {
    constructor(type) {
        super(`Model definition for ${type} not found`);
    }
}
exports.ModelNotFound = ModelNotFound; /**
                                        * An error occurred related to a particular record.
                                        *
                                        * @export
                                        * @abstract
                                        * @class RecordException
                                        * @extends {Exception}
                                        */

class RecordException extends _core.Exception {
    constructor(description, type, id, relationship) {
        let message = `${description}: ${type}:${id}`;
        if (relationship) {
            message += '/' + relationship;
        }
        super(message);
        this.description = description;
        this.type = type;
        this.id = id;
        this.relationship = relationship;
    }
}
exports.RecordException = RecordException; /**
                                            * A record could not be found.
                                            *
                                            * @export
                                            * @class RecordNotFoundException
                                            * @extends {RecordException}
                                            */

class RecordNotFoundException extends RecordException {
    constructor(type, id) {
        super('Record not found', type, id);
    }
}
exports.RecordNotFoundException = RecordNotFoundException; /**
                                                            * A relationship could not be found.
                                                            *
                                                            * @export
                                                            * @class RelationshipNotFoundException
                                                            * @extends {RecordException}
                                                            */

class RelationshipNotFoundException extends RecordException {
    constructor(type, id, relationship) {
        super('Relationship not found', type, id, relationship);
    }
}
exports.RelationshipNotFoundException = RelationshipNotFoundException; /**
                                                                        * The record already exists.
                                                                        *
                                                                        * @export
                                                                        * @class RecordAlreadyExistsException
                                                                        * @extends {RecordException}
                                                                        */

class RecordAlreadyExistsException extends RecordException {
    constructor(type, id) {
        super('Record already exists', type, id);
    }
}
exports.RecordAlreadyExistsException = RecordAlreadyExistsException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJDbGllbnRFcnJvciIsIkV4Y2VwdGlvbiIsImNvbnN0cnVjdG9yIiwiZGVzY3JpcHRpb24iLCJTZXJ2ZXJFcnJvciIsIk5ldHdvcmtFcnJvciIsIlF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IiLCJleHByZXNzaW9uIiwiUXVlcnlOb3RBbGxvd2VkIiwicXVlcnkiLCJUcmFuc2Zvcm1Ob3RBbGxvd2VkIiwidHJhbnNmb3JtIiwiU2NoZW1hRXJyb3IiLCJNb2RlbE5vdEZvdW5kIiwidHlwZSIsIlJlY29yZEV4Y2VwdGlvbiIsImlkIiwicmVsYXRpb25zaGlwIiwibWVzc2FnZSIsIlJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIiwiUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb24iLCJSZWNvcmRBbHJlYWR5RXhpc3RzRXhjZXB0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7QUFPTyxNQUFNQSxXQUFOLFNBQTBCQyxlQUExQixDQUFvQztBQUN2Q0MsZ0JBQVlDLFdBQVosRUFBeUI7QUFDckIsY0FBTyxpQkFBZ0JBLFdBQVksRUFBbkM7QUFDQSxhQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUNIO0FBSnNDO1FBQTlCSCxXLEdBQUFBLFcsRUFNYjs7Ozs7Ozs7QUFPTyxNQUFNSSxXQUFOLFNBQTBCSCxlQUExQixDQUFvQztBQUN2Q0MsZ0JBQVlDLFdBQVosRUFBeUI7QUFDckIsY0FBTyxpQkFBZ0JBLFdBQVksRUFBbkM7QUFDQSxhQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUNIO0FBSnNDO1FBQTlCQyxXLEdBQUFBLFcsRUFNYjs7Ozs7Ozs7O0FBUU8sTUFBTUMsWUFBTixTQUEyQkosZUFBM0IsQ0FBcUM7QUFDeENDLGdCQUFZQyxXQUFaLEVBQXlCO0FBQ3JCLGNBQU8sa0JBQWlCQSxXQUFZLEVBQXBDO0FBQ0EsYUFBS0EsV0FBTCxHQUFtQkEsV0FBbkI7QUFDSDtBQUp1QztRQUEvQkUs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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeGNlcHRpb24gfSBmcm9tICdAb3JiaXQvY29yZSc7XG4vKipcbiAqIEFuIGNsaWVudC1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBhIHJlbW90ZSBzZXJ2ZXIuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENsaWVudEVycm9yXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50RXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBDbGllbnQgZXJyb3I6ICR7ZGVzY3JpcHRpb259YCk7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG59XG4vKipcbiAqIEEgc2VydmVyLXNpZGUgZXJyb3Igb2NjdXJyZWQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIGEgcmVtb3RlIHNlcnZlci5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgU2VydmVyRXJyb3JcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoYFNlcnZlciBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBuZXR3b3JraW5nIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gY29tbXVuaWNhdGUgd2l0aCBhIHJlbW90ZVxuICogc2VydmVyLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBOZXR3b3JrRXJyb3JcbiAqIEBleHRlbmRzIHtFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKGBOZXR3b3JrIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHF1ZXJ5IGV4cHJlc3Npb24gY291bGQgbm90IGJlIHBhcnNlZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUXVlcnlFeHByZXNzaW9uUGFyc2VFcnJvclxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5RXhwcmVzc2lvblBhcnNlRXJyb3IgZXh0ZW5kcyBFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBleHByZXNzaW9uKSB7XG4gICAgICAgIHN1cGVyKGBRdWVyeSBleHByZXNzaW9uIHBhcnNlIGVycm9yOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgfVxufVxuLyoqXG4gKiBBIHF1ZXJ5IGlzIGludmFsaWQgZm9yIGEgcGFydGljdWxhciBzb3VyY2UuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZFxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5Tm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHF1ZXJ5KSB7XG4gICAgICAgIHN1cGVyKGBRdWVyeSBub3QgYWxsb3dlZDogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgfVxufVxuLyoqXG4gKiBBIHRyYW5zZm9ybSBpcyBpbnZhbGlkIGZvciBhIHBhcnRpY3VsYXIgc291cmNlLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBUcmFuc2Zvcm1Ob3RBbGxvd2VkXG4gKiBAZXh0ZW5kcyB7RXhjZXB0aW9ufVxuICovXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtTm90QWxsb3dlZCBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHRyYW5zZm9ybSkge1xuICAgICAgICBzdXBlcihgVHJhbnNmb3JtIG5vdCBhbGxvd2VkOiAke2Rlc2NyaXB0aW9ufWApO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgIH1cbn1cbi8qKlxuICogQW4gZXJyb3Igb2NjdXJlZCByZWxhdGVkIHRvIHRoZSBzY2hlbWEuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIFNjaGVtYUVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlbWFFcnJvciBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoYFNjaGVtYSBlcnJvcjogJHtkZXNjcmlwdGlvbn1gKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbi8qKlxuICogQSBtb2RlbCBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIHNjaGVtYS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTW9kZWxOb3RGb3VuZFxuICovXG5leHBvcnQgY2xhc3MgTW9kZWxOb3RGb3VuZCBleHRlbmRzIFNjaGVtYUVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgICAgIHN1cGVyKGBNb2RlbCBkZWZpbml0aW9uIGZvciAke3R5cGV9IG5vdCBmb3VuZGApO1xuICAgIH1cbn1cbi8qKlxuICogQW4gZXJyb3Igb2NjdXJyZWQgcmVsYXRlZCB0byBhIHBhcnRpY3VsYXIgcmVjb3JkLlxuICpcbiAqIEBleHBvcnRcbiAqIEBhYnN0cmFjdFxuICogQGNsYXNzIFJlY29yZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge0V4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApIHtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBgJHtkZXNjcmlwdGlvbn06ICR7dHlwZX06JHtpZH1gO1xuICAgICAgICBpZiAocmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9ICcvJyArIHJlbGF0aW9uc2hpcDtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xuICAgIH1cbn1cbi8qKlxuICogQSByZWNvcmQgY291bGQgbm90IGJlIGZvdW5kLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBSZWNvcmROb3RGb3VuZEV4Y2VwdGlvblxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgUmVjb3JkRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBpZCkge1xuICAgICAgICBzdXBlcignUmVjb3JkIG5vdCBmb3VuZCcsIHR5cGUsIGlkKTtcbiAgICB9XG59XG4vKipcbiAqIEEgcmVsYXRpb25zaGlwIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUmVsYXRpb25zaGlwTm90Rm91bmRFeGNlcHRpb25cbiAqIEBleHRlbmRzIHtSZWNvcmRFeGNlcHRpb259XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWxhdGlvbnNoaXBOb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIFJlY29yZEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IodHlwZSwgaWQsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBzdXBlcignUmVsYXRpb25zaGlwIG5vdCBmb3VuZCcsIHR5cGUsIGlkLCByZWxhdGlvbnNoaXApO1xuICAgIH1cbn1cbi8qKlxuICogVGhlIHJlY29yZCBhbHJlYWR5IGV4aXN0cy5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUmVjb3JkQWxyZWFkeUV4aXN0c0V4Y2VwdGlvblxuICogQGV4dGVuZHMge1JlY29yZEV4Y2VwdGlvbn1cbiAqL1xuZXhwb3J0IGNsYXNzIFJlY29yZEFscmVhZHlFeGlzdHNFeGNlcHRpb24gZXh0ZW5kcyBSZWNvcmRFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGlkKSB7XG4gICAgICAgIHN1cGVyKCdSZWNvcmQgYWxyZWFkeSBleGlzdHMnLCB0eXBlLCBpZCk7XG4gICAgfVxufSJdfQ==