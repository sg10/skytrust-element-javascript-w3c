define(function(require) {

	// ------- imports	
	
	var Component = require('../common/component');
    var Config = require('../skytrust-config');
    var Protocol = require('../common/protocol');


    var Communication = function() {

        // ------- private members  

        var sessionId = "";
        var self = this;


    	// ------- private methods	

    	var makeServerRequest = function(requestObject) {

    		var jsonRequest = requestObject.jsonSkyTrust();

            // AJAX REQUEST
            $.ajax({
                url: Config.server,
                method: 'post',
                dataType: 'json',
                processData: false,
                contentType: 'application/json',
                data: jsonRequest })
                    .done(function(dataReceived) {
                        handleServerResponse(dataReceived, requestObject, jsonRequest);
                    })
                    .fail(function(jqXHR, statusText, errorThrown) {
                        console.log("[iframe] request error " + errorThrown);
                        requestObject.setErrorCode(jqXHR.status);
                        self.send('receiver', requestObject);
                    });
    	};

        var handleServerResponse = function(dataReceived, requestObject, jsonRequest) {

            console.log("[iframe] ajax response received");

            var responseObject = requestObject;
            responseObject.setHeader(dataReceived.header);
            responseObject.setPayload(dataReceived.payload);

            // set session ID for this SkyTrust element if it has changed
            var responseSessionId = responseObject.getHeader().sessionId;
            if(sessionId !== responseSessionId) {
                console.log("[iframe] setting session ID: " + responseSessionId);
                sessionId = responseSessionId;
            }

            console.log("[iframe] error code:" + Protocol.getError(responseObject));

            // Authentication: enter username/password
            if(Protocol.isAuthRequired(responseObject)) {
                var authTypes = Protocol.getAuthTypes(responseObject);

                // username password authentication
                if($.inArray("authChallengeRequest", authTypes)) {
                    self.send('authentication', responseObject);
                }
                else {
                    // TODO: error handling other auth methods
                }
            }
            // correct result or error from server
            else {
                self.send('receiver', requestObject);
            }
        };


    	// ------- public methods

    	this.onReceive = function(cryptoObject) {
    		console.log("[iframe] received at communication component");

    		if(cryptoObject.getHeader() === null) {
    			var header = Protocol.getBlankHeader();
    			console.log("[iframe] header was blank, setting new header");
    			cryptoObject.setHeader(header);
    		}

    		Protocol.setSessionId(cryptoObject, sessionId);

    		makeServerRequest(cryptoObject);
    	};

    };

    Communication.prototype = Object.create(Component);


	// ------- export	

	return Communication;


});