define(function(require) {

    // ---------- IMPORTS ----------------------------

    var $ = require('jQuery');

    // ---------- MEMBERS ----------------------------

    var header = null;
    var payload = null;
    var postponedObject = null;

    var self = null;


    // ---------- PRIVATE ----------------------------


    function CryptoKey() { } // dummy class for prototype lookup

    var isValidHeader = function(h) {
        return true;
    }

    var isValidPayload = function(h) {
        return true;
    }


    // ---------- PUBLIC -----------------------------

    var setHeader = function(h) {
        if( !isValidHeader(h) ) {
            return false;
        }

        // clone object
        header = JSON.parse(JSON.stringify(h));
    }

    var setPayload = function(p) {
        if( !isValidPayload(p) ) {
            return false;
        }

        // clone object
        payload = JSON.parse(JSON.stringify(p));
    }

    var json = function() {
        return JSON.stringify({
            header : header,
            payload : payload
        })
    }

    return function(p) {

        if(p) {
            setPayload(p);
        }

        self = this;

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


});