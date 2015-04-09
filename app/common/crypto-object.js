define(function() {

    // ------- imports 

    var CryptoObject = function(payload_) {

        // ------- private members  

        var header = {};
        var payload = {};
        var requestID = -1;
        var error = 0;


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

        this.setRequestID = function(id) {
            requestID = id;
        };

        this.getRequestID = function() {
            return requestID;
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

        this.jsonInternal = function() {
            return JSON.stringify({
                "header" : header,
                "payload" : payload,
                "requestID" : requestID,
                "error" : error
            });
        };

        this.toString = function() {
            return "[CryptoObject #"+requestID+"] header=" + header + ", payload="
                 + payload + ", requestID=" + requestID + ", error=" + error;
        };


        // ------- C'tor

        if(payload_) {
            this.setPayload(payload_);
        }

    };


    // ------- export  

    return CryptoObject;


});