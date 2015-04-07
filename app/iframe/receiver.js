define(function(require) {

	// ------- imports	
	
	var Component = require('../common/component');
	var CryptoObject = require('../common/crypto-object');


    var Receiver = function() {

    	// ------- private members	

        var self = this;


    	// ------- private methods	

        var initPostMessageListener = function() {
            console.log("[iframe] init post message listener");

            window.addEventListener("message", onReceivePostMessage, false);
        };


        var onReceivePostMessage = function(event) {
            console.log("[iframe] received post message ...");
            console.log("[iframe] postMessage origin: " + event.origin);

            var dataReceived = JSON.parse(event.data);

            console.log("[iframe] data received post message");

            var object = new CryptoObject(dataReceived.payload);
            object.setHeader(dataReceived.header);
            object.setRequestID(dataReceived.requestID);
            
            object.resolve = function() {
                console.log("[iframe] sending post message back ...");
                event.source.postMessage(object.jsonWithRequestID(), "*"); // remove *
            };

            object.reject = function(error) {
                console.log("[iframe] sending post message back ...");
                object.payload.nodeError = error.toString(); // make skytrust protocol conform
                event.source.postMessage(object.jsonWithRequestID(), "*"); // remove *
            };

            self.send('communication', object);
        };

    	// ------- public methods

        this.onReceive = function(object) {
    		console.log('[iframe] received at receiver component');
            object.resolve();
    	};


        // ------- C'tor

        initPostMessageListener();

    };

    Receiver.prototype = Object.create(Component);


    // ------- export

    return Receiver;


});