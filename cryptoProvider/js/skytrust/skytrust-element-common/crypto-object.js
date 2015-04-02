define(function(require) {

    // ------- imports 

    var $ = require('jQuery');

    var CryptoObject = function(payload_) {

        // ------- private members  

        var header = {};
        var payload = {};


        // ------- public members

        this.resolve = function() {}; // for promise
        this.reject = function() {}; // for promise
        

        // ------- public methods  

        this.setHeader = function(h) {
            // clone object
            header = JSON.parse(JSON.stringify(h));
        }

        this.getHeader = function() {
            return header;
        }

        this.setPayload = function(p) {
            // clone object
            payload = JSON.parse(JSON.stringify(p));
        }

        this.getPayload = function() {
            return payload;
        }

        this.json = function() {
            return JSON.stringify({
                "header" : header,
                "payload" : payload
            });
        }

        this.toString = function() {
            return "[CryptoObject] header=" + header + ", payload=" + payload;
        }


        // ------- C'tor

        if(payload_) {
            this.setPayload(payload_);
        }

    }


    // ------- export  

    return CryptoObject;


});