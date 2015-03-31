define(function(require) {

    // Custom errors

    /**
     * Description
     * @method NotYetImplementedError
     * @param {} message
     * @return 
     */
    var NotYetImplemented = function(message) {
        Error.call(this);
        this.name = "NotYetImplementedException";
        this.message = message;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    NotYetImplemented.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NoSuchProviderError
     * @return 
     */
    var NoSuchProvider = function() {
        Error.call(this);
        this.name = "NoSuchProviderError";
        this.message = "Provider does not exist.";
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    NoSuchProvider.prototype = Object.create(Error.prototype);

    /**
     * [UnauthorizedError description]
     */
    var Unauthorized = function() {
        Error.call(this);
        this.name = "UnauthorizedError";
        this.message = "Please authorize, no active or invalid session."
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    Unauthorized.prototype = Object.create(Error.prototype);


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
    var QuotaExceeded = function(message) {
        Error.call(this);
        this.name = "QuotaExceededError";
        this.message = message;
        this.code = 22;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    QuotaExceeded.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method InvalidAccessError
     * @return 
     */
    var InvalidAccess = function() {
        Error.call(this);
        this.name = "InvalidAccessError";
        this.message = "The requested operation is not valid for the provided key.";
        this.code = 15;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    InvalidAccess.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method SyntaxError
     * @return 
     */
    var Syntax = function() {
        Error.call(this);
        this.name = "SyntaxError";
        this.message = "A required parameter was missing or out-of-range";
        this.code = 12;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    Syntax.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NotSupportedError
     * @return 
     */
    var AlgorithmNotSupported = function() {
        Error.call(this);
        this.name = "AlgorithmNotSupportedError";
        this.message = "The algorithm is not supported.";
        this.code = 9;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    AlgorithmNotSupported.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method NotSupportedError
     * @return 
     */
    var OperationNotSupported = function() {
        Error.call(this);
        this.name = "OperationNotSupported";
        this.message = "SkyTrust doesn't support this operation.";
        this.code = 9;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    OperationNotSupported.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method InvalidStateError
     * @return 
     */
    var InvalidState = function() {
        Error.call(this);
        this.name = "InvalidStateError";
        this.message = "The requested operation is not valid for the current state of the provided key.";
        this.code = 11;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    InvalidState.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method OperationError
     * @return 
     */
    var Operation = function() {
        Error.call(this);
        this.name = "OperationError";
        this.message = "The operation failed for an operation-specific reason.";
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    Operation.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method UnknownError
     * @return 
     */
    var Unknown = function() {
        Error.call(this);
        this.name = "UnknownError";
        this.message = "The operation failed for an unknown transient reason (e.g. out of memory).";
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    Unknown.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method DataError
     * @return 
     */
    var Data = function() {
        Error.call(this);
        this.name = "DataError";
        this.message = "Data provided to an operation does not meet requirements.";
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    Data.prototype = Object.create(Error.prototype);

    /**
     * Description
     * @method TypeMismatchError 
     * @return 
     */
    var TypeMismatch = function(message) {
        Error.call(this);
        this.name = "TypeMismatchError";
        this.message = message;
        this.stack = (new Error()).stack;
        this.toString = function() {return "Error: " + this.name + ": " + this.message;}
    }
    TypeMismatch.prototype = Object.create(Error.prototype);

    return {
        NotYetImplementedException :    NotYetImplemented,
        NoSuchProviderError :           NoSuchProvider,
        UnauthorizedError :             Unauthorized,
        QuotaExceededError :            QuotaExceeded,
        InvalidStateError :             InvalidState,
        SyntaxError :                   Syntax,
        OperationNotSupportedError :    OperationNotSupported,
        AlgorithmNotSupportedError :    AlgorithmNotSupported,
        InvalidStateError :             InvalidState,
        OperationError :                Operation,
        UnknownError :                  Unknown,
        DataError :                     Data,
        TypeMismatchError :             TypeMismatch
    };

});