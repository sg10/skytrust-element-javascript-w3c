define(function() {

	// ------- imports	


	// ------- C'tor

	var Component = function() {
		if(!(this instanceof Component)) {
			throw new Error("Component called statically");
		}
	};


	// ------- private/"protected" methods	

	// send object to another component
	Component.prototype.send = function(to, cryptoObject) {
		console.log("[WARNING] abstract method was not overwritten");
		console.log("to=" + to + ", cryptoObject=" + cryptoObject);
	};


	// ------- public methods	

	// event handler for receiving an cryptoObject (via router)
	Component.prototype.onReceive = function(cryptoObject)  {
		console.log("[WARNING] abstract method was not overwritten");
		console.log("cryptoObject=" + cryptoObject);
	};




	// ------- export	

	return Component;
});