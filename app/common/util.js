define(function(require) {

    var E = require('../common/error');


    // ------- public methods

    var Util = {};

    /**
     * Converts an ArrayBuffer to a base64 encoded string.
     * also works with ArrayBufferViews (typed arrays)
     * @method arrayBufferToBase64
     * @param {} buffer
     * @return CallExpression
     */
    Util.arrayBufferToBase64 = function(buffer) {
        var binary = "";
        var bytes = new Uint8Array((buffer.buffer) ? buffer.buffer : buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * Converts a base64 encoded String to a Uint8Array.
     * @method base64ToArrayBuffer
     * @param {} base64 encoded String
     * @return bytes
     */
    Util.base64ToArrayBuffer = function(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++){
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }


    Util.arrayBufferToBase64_array = function(buffers) {
        if(!$.isArray(buffers) && !(buffers[0] instanceof ArrayBuffer)) {
            return [];
        }

        var base64Array = [];
        $.each(buffers, function(key, value) {
            base64Array.push(Util.arrayBufferToBase64(value));
        });
        return base64Array;
    }

    Util.base64ToArrayBuffer_array = function(base64) {
        if(!$.isArray(base64)) {
            return [];
        }

        var buffersArray = [];
        $.each(base64, function(key, value) {
            buffersArray.push(Util.base64ToArrayBuffer(value));
        });
       
        return buffersArray;
    }

    Util.isArrayBufferView = function(value) {
        return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined;
    }

    Util.inArray = function(matchString, arr) {
        if(!arr || !arr.length) {
            return false;
        }

        var matchStringL = matchString.toLowerCase();

        for(var i=0; i<arr.length; i++) {
            if(matchStringL === arr[i].toLowerCase()) {
                return arr[i];
            }
        }

        return false;
    };


    Util.copyOf = function(obj) {
        var copy;

        if(typeof obj === "string") {
            return "" + obj;
        }

        if(typeof obj === "number" || typeof obj === "boolean") {
            return obj;
        }

        if(Object.prototype.toString.call(obj) === '[object Date]') {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if(Array.isArray(obj)) {
            copy = [];
            for (var i = 0; i < obj.length; i++) {
                copy[i] = Util.copyOf(obj[i]);
            }
            return copy;
        }

        if(obj instanceof ArrayBuffer) {
            return obj.slice(0);
        }

        if(typeof obj === "object" || obj instanceof Object) {
            return $.extend(true, {}, obj);
        }

        throw new Error("Copying type " + (typeof obj) + " is not supported!");


    };

    Util.rejectedPromise = function(error) {
        return new Promise(function(resolve, reject) {
            reject(error);
        });
    };


    Util.warningIfNotNull = function(objectLiteral) {
        $.each(objectLiteral, function(key, value) {
            if(value != null) {
                console.warn("Parameter '" + key + "' is not used via this API."
                    + " To disable this warning, set it to null.");
            }
        });
    };

    Util.throwNotSupportedError = function() {
        throw new E.OperationNotSupportedError();
    };


    // ------- export

    return Util;

});