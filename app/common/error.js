define(function(require){

    var E = {};


    // Custom errors

    /**
     * Description
     * @method NotYetImplementedError
     * @param {} message
     * @return 
     */
    E.NotYetImplementedError = function(message) {
        Error.call(this);
        this.name = "NotYetImplementedException";
        this.message = message;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.NotYetImplementedError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NoSuchProviderError
     * @return 
     */
    E.NoSuchProviderError = function() {
        Error.call(this);
        this.name = "NoSuchProviderError";
        this.message = "Provider does not exist.";
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.NoSuchProviderError.prototype = Object.create(Error.prototype);

    /**
     * [UnauthorizedError description]
     */
    E.UnauthorizedError = function() {
        Error.call(this);
        this.name = "UnauthorizedError";
        this.message = "Please authorize, no active or invalid session.";
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.UnauthorizedError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method KeyError
     * @return 
     */
    E.KeyError = function(message) {
        Error.call(this);
        this.name = "KeyError";
        this.message = "CryptoKey provided to an operation does not meet requirements"
                        + ((message !== null) ? ":" + message : "");
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.KeyError.prototype = Object.create(Error.prototype);


    /**
     * Description
     * @method SkyTrustError
     * @return 
     */
    E.SkyTrustError = function(code, message) {
        Error.call(this);
        this.name = "KeyError";
        this.message = "CryptoKey provided to an operation does not meet requirements"
                        + ((message !== null) ? ": " + message : "");
        this.code = code;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.SkyTrustError.prototype = Object.create(Error.prototype);


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
    E.QuotaExceededError = function(message) {
        Error.call(this);
        this.name = "QuotaExceededError";
        this.message = message;
        this.code = 22;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.QuotaExceededError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method InvalidAccessError
     * @return 
     */
    E.InvalidAccessError = function() {
        Error.call(this);
        this.name = "InvalidAccessError";
        this.message = "The requested operation is not valid for the provided key.";
        this.code = 15;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.InvalidAccessError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method SyntaxError
     * @return 
     */
    E.SyntaxError = function() {
        Error.call(this);
        this.name = "SyntaxError";
        this.message = "A required parameter was missing or out-of-range";
        this.code = 12;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.SyntaxError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NotSupportedError
     * @return 
     */
    E.NotSupportedError = function(algorithm) {
        Error.call(this);
        this.name = "NotSupportedError";
        this.message = "This algorithm is not supported: " + algorithm;
        this.code = 9;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.NotSupportedError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NotSupportedError
     * @return 
     */
    E.OperationNotSupportedError = function() {
        Error.call(this);
        this.name = "OperationNotSupported";
        this.message = "SkyTrust doesn't support this operation.";
        this.code = 9;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.OperationNotSupportedError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method InvalidStateError
     * @return 
     */
    E.InvalidStateError = function() {
        Error.call(this);
        this.name = "InvalidStateError";
        this.message = "The requested operation is not valid for the current state of the provided key.";
        this.code = 11;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.InvalidStateError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method OperationError
     * @return 
     */
    E.OperationError = function() {
        Error.call(this);
        this.name = "OperationError";
        this.message = "The operation failed for an operation-specific reason.";
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.OperationError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method UnknownError
     * @return 
     */
    E.UnknownError = function() {
        Error.call(this);
        this.name = "UnknownError";
        this.message = "The operation failed for an unknown transient reason (e.g. out of memory).";
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.UnknownError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method DataError
     * @return 
     */
    E.DataError = function(message) {
        Error.call(this);
        this.name = "DataError";
        this.message = "Data provided to an operation does not meet requirements"
                        + ((message !== null) ? ":" + message : "");
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.DataError.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method TypeMismatchError 
     * @return 
     */
    E.TypeMismatchError = function(message) {
        Error.call(this);
        this.name = "TypeMismatchError";
        this.message = message;
        this.stack = (new Error()).stack;
        this.toStringError = function() {return "Error: " + this.name + ": " + this.message;};
    };
    E.TypeMismatchError.prototype = Object.create(Error.prototype);

    return E;

});