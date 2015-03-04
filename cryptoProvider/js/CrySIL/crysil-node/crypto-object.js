define(function(require) {

    // ---------- IMPORTS ----------------------------

    var $ = require('jQuery');

    // ---------- MEMBERS ----------------------------

    var header = null;
    var payload = null;

    // var transactionInfo = { id : 0, from : "", to : "" };

    // ---------- PRIVATE ----------------------------


    function CryptoKey() { } // dummy class for prototype lookup

    var isValidHeader = function(h) {

        console.log("[ header validation not yet implemented ]");

        return true;
    }

    var isValidPayload = function(h) {

        console.log("[ payload validation not yet implemented ]");

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

    // var setTransaction = function(from, to, id) {
    //     transactionInfo.from = from;
    //     transactionInfo.to = to;
    //     transactionInfo.id = id;
    // }

    var json = function() {
        return JSON.stringify({
            header : header,
            payload : payload
        })
    }

    return function(payload) {

        setPayload(payload);

        return $.extend(this, {
            getPayload :        function()     { return data; },
            setPayload :        setPayload,

            getHeader :         function()     { return header; },
            setHeader :         setHeader,

            // getTransaction :    function()     { return transactionInfo; },      
            // setTransaction :    setTransaction,

            json :              json,

            resolve :           function()     {},
            reject :            function()     {}
        });
    };


});