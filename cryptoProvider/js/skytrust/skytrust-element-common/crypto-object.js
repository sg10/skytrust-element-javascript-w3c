define(function(require) {

    // ------- imports 

    var $ = require('jQuery');


    // ------- private members  

    var header = null;
    var payload = null;

    var self = null;


    // ------- private methods/classes  


    function CryptoKey() { } // dummy class for prototype lookup


    // ------- public methods  

    var setHeader = function(h) {
        // clone object
        header = JSON.parse(JSON.stringify(h));
    }

    var setPayload = function(p) {
        // clone object
        payload = JSON.parse(JSON.stringify(p));
    }

    var json = function() {
        return JSON.stringify({
            header : header,
            payload : payload
        });
    }

    var CryptoObject = function(p) {

        self = this;

        if(p) {
            setPayload(p);
        }

        return $.extend(this, {
            getPayload :        function() { return payload; },
            setPayload :        setPayload,

            getHeader :         function() { return header; },
            setHeader :         setHeader,

            json :              json,

            resolve :           function()     {}, // for promise
            reject :            function()     {}  // for promise
        });
    };
    

    // ------- export  

    return CryptoObject;


});