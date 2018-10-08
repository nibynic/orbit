import { Exception } from '@orbit/core';
/**
 * An client-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ClientError
 * @extends {Exception}
 */
export class ClientError extends Exception {
    constructor(description) {
        super(`Client error: ${description}`);
        this.description = description;
    }
}
/**
 * A server-side error occurred while communicating with a remote server.
 *
 * @export
 * @class ServerError
 * @extends {Exception}
 */
export class ServerError extends Exception {
    constructor(description) {
        super(`Server error: ${description}`);
        this.description = description;
    }
}
/**
 * A networking error occurred while attempting to communicate with a remote
 * server.
 *
 * @export
 * @class NetworkError
 * @extends {Exception}
 */
export class NetworkError extends Exception {
    constructor(description) {
        super(`Network error: ${description}`);
        this.description = description;
    }
}
/**
 * A query expression could not be parsed.
 *
 * @export
 * @class QueryExpressionParseError
 * @extends {Exception}
 */
export class QueryExpressionParseError extends Exception {
    constructor(description, expression) {
        super(`Query expression parse error: ${description}`);
        this.description = description;
        this.expression = expression;
    }
}
/**
 * A query is invalid for a particular source.
 *
 * @export
 * @class QueryNotAllowed
 * @extends {Exception}
 */
export class QueryNotAllowed extends Exception {
    constructor(description, query) {
        super(`Query not allowed: ${description}`);
        this.description = description;
        this.query = query;
    }
}
/**
 * A transform is invalid for a particular source.
 *
 * @export
 * @class TransformNotAllowed
 * @extends {Exception}
 */
export class TransformNotAllowed extends Exception {
    constructor(description, transform) {
        super(`Transform not allowed: ${description}`);
        this.description = description;
        this.transform = transform;
    }
}
/**
 * An error occured related to the schema.
 *
 * @export
 * @class SchemaError
 */
export class SchemaError extends Exception {
    constructor(description) {
        super(`Schema error: ${description}`);
        this.description = description;
    }
}
/**
 * A model could not be found in the schema.
 *
 * @export
 * @class ModelNotFound
 */
export class ModelNotFound extends SchemaError {
    constructor(type) {
        super(`Model definition for ${type} not found`);
    }
}
/**
 * An error occurred related to a particular record.
 *
 * @export
 * @abstract
 * @class RecordException
 * @extends {Exception}
 */
export class RecordException extends Exception {
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
/**
 * A record could not be found.
 *
 * @export
 * @class RecordNotFoundException
 * @extends {RecordException}
 */
export class RecordNotFoundException extends RecordException {
    constructor(type, id) {
        super('Record not found', type, id);
    }
}
/**
 * A relationship could not be found.
 *
 * @export
 * @class RelationshipNotFoundException
 * @extends {RecordException}
 */
export class RelationshipNotFoundException extends RecordException {
    constructor(type, id, relationship) {
        super('Relationship not found', type, id, relationship);
    }
}
/**
 * The record already exists.
 *
 * @export
 * @class RecordAlreadyExistsException
 * @extends {RecordException}
 */
export class RecordAlreadyExistsException extends RecordException {
    constructor(type, id) {
        super('Record already exists', type, id);
    }
}