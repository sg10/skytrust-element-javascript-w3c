define(function(require) {

	// ------- imports	
	
	var Component = require('../common/component');
	var CryptoObject = require('../common/crypto-object');
    var ComObject = require('../common/com-object');


    var Receiver = function() {

    	// ------- private members	

        var self = this;
        var eventSource = null; // reference to parent window (postMessage)

    	// ------- private methods	

        var sendHelloToParentIFrame = function() {
            var comObject = new ComObject();
            comObject.type = "hello";
            window.parent.postMessage(comObject, "*"); // remove *
        }

        var initPostMessageListener = function() {
            console.log("[iframe] init post message listener");

            window.addEventListener("message", onReceivePostMessage, false);

            sendHelloToParentIFrame();
        };


        var onReceivePostMessage = function(event) {
            console.log("[iframe] received post message ...");
            console.log("[iframe] postMessage origin: " + event.origin);

            eventSource = event.source;

            var comObject = event.data;

            console.log("[iframe] data received post message");

            if(comObject.type !== "request" || !comObject.data ||
                !comObject.data.payload || !comObject.data.header) {
                console.log(comObject);
                console.log(comObject.data);
                console.log(comObject.data.payload);
                console.log(comObject.data.header);
                console.log(comObject.data.type);
                throw new Error("invalid data received from top-level element");
            }

            var requestID = comObject.requestID;            

            var cryptoObject = new CryptoObject(comObject.data.payload);
            cryptoObject.setHeader(comObject.data.header);
            
            cryptoObject.resolve = function() {
                console.log("[iframe] sending post message back ...");

                var comObject = new ComObject();
                comObject.type = "request";
                comObject.data = cryptoObject.comObjectData();
                comObject.requestID = requestID;

                eventSource.postMessage(comObject, "*"); // remove *
            };

            cryptoObject.reject = function(error) {
                console.log("[iframe] sending post message back ...");
                cryptoObject.error = error;

                var comObject = new ComObject();
                comObject.type = "request";
                comObject.data = cryptoObject.comObjectData();
                comObject.requestID = requestID;

                eventSource.postMessage(comObject, "*"); // remove *
            };

            self.send('communication', cryptoObject);
        };

    	// ------- public methods

        this.onReceive = function(cryptoObject) {
    		console.log('[iframe] received at receiver component');
            cryptoObject.resolve();
    	};

        this.sendShowAuth = function() {
            var comObject = new ComObject();
            comObject.type = "show-auth";
            eventSource.postMessage(comObject, "*"); // remove *
        };

        this.sendHideAuth = function() {
            var comObject = new ComObject();
            comObject.type = "hide-auth";
            eventSource.postMessage(comObject, "*"); // remove *
        };


        // ------- C'tor

        initPostMessageListener();

    };

    Receiver.prototype = Object.create(Component);


    // ------- export

    return Receiver;


});