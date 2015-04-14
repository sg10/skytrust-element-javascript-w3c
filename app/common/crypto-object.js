define(function() {

    // ------- imports 

    var CryptoObject = function(payload_) {

        // ------- private members  

        var header = {};
        var payload = {};
        var error = 0;
        var local = false;


        // ------- public members

        this.resolve = function() {}; // for promise
        this.reject = function() {}; // for promise
        

        // ------- public methods  

        this.setHeader = function(h) {
            // clone object
            header = JSON.parse(JSON.stringify(h));
        };

        this.getHeader = function() {
            return header;
        };

        this.setPayload = function(p) {
            // clone object
            payload = JSON.parse(JSON.stringify(p));
        };

        this.getPayload = function() {
            return payload;
        };

        this.setErrorCode = function(e) {
            error = e;
        };

        this.getErrorCode = function() {
            return error;
        };

        this.jsonSkyTrust = function() {
            return JSON.stringify({
                "header" : header,
                "payload" : payload
            });
        };

        this.comObjectData = function() {
            return {
                "header" : header,
                "payload" : payload,
                "error" : error
            };
        };

        this.setLocal = function() {
            local = true;
        }

        this.isLocal = function() {
            return local;
        }

        this.toString = function() {
            return "[CryptoObject] header=" + header + ", payload="
                 + payload + ", error=" + error;
        };


        // ------- C'tor

        if(payload_) {
            this.setPayload(payload_);
        }

    };


    // ------- export  

    return CryptoObject;


});