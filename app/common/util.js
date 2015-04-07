define(function(require) {

    var E = require('../common/error');


    // ------- public methods

    var Util = {};

    Util.atob = function(base64Data) {
        if( typeof plainTextData === "string" ) {
            return window.atob(base64Data);
        }
        else {
            var plainTextArray = [];
            for(var i=0; i<base64Data.length; i++) {
                plainTextArray.push(window.atob(base64Data[i]));
            }

            return plainTextArray;
        }
    };

    Util.btoa = function(plainTextData) {
        if( typeof plainTextData === "string" ) {
            return window.btoa(plainTextData);
        }
        else {
            var base64Array = [];
            for(var i=0; i<plainTextData.length; i++) {
                base64Array.push(window.btoa(plainTextData[i]));
            }

            return base64Array;
        }
    };

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