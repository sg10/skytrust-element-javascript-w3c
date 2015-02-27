// Custom errors

/**
 * Description
 * @method NotYetImplementedError
 * @param {} message
 * @return 
 */
function NotYetImplementedError(message) {
    Error.call(this);
    this.name = "NotYetImplementedError";
    this.message = message;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
NotYetImplementedError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method NoSuchProviderError
 * @return 
 */
function NoSuchProviderError() {
    Error.call(this);
    this.name = "NoSuchProviderError";
    this.message = "Provider does not exist.";
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
NoSuchProviderError.prototype = Object.create(Error.prototype);

/**
 * [UnauthorizedError description]
 */
function UnauthorizedError() {
    Error.call(this);
    this.name = "UnauthorizedError";
    this.message = "Please authorize, no active or invalid session."
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
UnauthorizedError.prototype = Object.create(Error.prototype);


// Errors defined by the W3C Crypto API
// See http://www.w3.org/TR/WebCryptoAPI/#SubtleCrypto-Exceptions
// Errors already defined as DOMException have been equipped with the corresponding
// Error code, see http://www.w3.org/TR/dom/#errors

/**
 * Description
 * @method QuotaExceededError
 * @param {} message
 * @return 
 */
function QuotaExceededError(message) {
    Error.call(this);
    this.name = "QuotaExceededError";
    this.message = message;
    this.code = 22;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
QuotaExceededError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method InvalidAccessError
 * @return 
 */
function InvalidAccessError() {
    Error.call(this);
    this.name = "InvalidAccessError";
    this.message = "The requested operation is not valid for the provided key.";
    this.code = 15;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
InvalidAccessError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method SyntaxError
 * @return 
 */
function SyntaxError() {
    Error.call(this);
    this.name = "SyntaxError";
    this.message = "A required parameter was missing or out-of-range";
    this.code = 12;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
SyntaxError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method NotSupportedError
 * @return 
 */
function NotSupportedError() {
    Error.call(this);
    this.name = "NotSupportedError";
    this.message = "The algorithm is not supported.";
    this.code = 9;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
NotSupportedError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method InvalidStateError
 * @return 
 */
function InvalidStateError() {
    Error.call(this);
    this.name = "InvalidStateError";
    this.message = "The requested operation is not valid for the current state of the provided key.";
    this.code = 11;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
InvalidStateError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method OperationError
 * @return 
 */
function OperationError() {
    Error.call(this);
    this.name = "OperationError";
    this.message = "The operation failed for an operation-specific reason.";
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
OperationError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method UnknownError
 * @return 
 */
function UnknownError() {
    Error.call(this);
    this.name = "UnknownError";
    this.message = "The operation failed for an unknown transient reason (e.g. out of memory).";
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
UnknownError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method DataError
 * @return 
 */
function DataError() {
    Error.call(this);
    this.name = "DataError";
    this.message = "Data provided to an operation does not meet requirements.";
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
DataError.prototype = Object.create(Error.prototype);

/**
 * Description
 * @method TypeMismatchError 
 * @return 
 */
function TypeMismatchError(message) {
    Error.call(this);
    this.name = "TypeMismatchError";
    this.message = message;
    this.stack = (new Error()).stack;
    this.toString = function() {return "Error: " + this.name + ": " + this.message;}
}
TypeMismatchError.prototype = Object.create(Error.prototype);