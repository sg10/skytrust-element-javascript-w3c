define(function(require) {

	// ------- imports	
	
	var Hias = require('../common/crypto-object');


	var ActorPlus = function() {


		// ------- private members

		var self = this;


		// ------- private methods	

        
        // ------- public methods

		this.onReceive = function(cryptoObject) {
			// data from Receiver
			// 
			// 	window.crypto shit	
			
			self.send('receiver', cryptoObject);
		};


		// ------- C'tor

		if(!(this instanceof ActorPlus)) {
			throw new Error("ActorPlus called statically");
		}
		

	};

	ActorPlus.prototype = Object.create(Component);


	// ------- export

	return ActorPlus;

});