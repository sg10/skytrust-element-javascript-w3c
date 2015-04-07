define(function() {

	// ------- imports	


	// ------- C'tor

	var Component = function() {
		if(this.window === window) {
			return false;
		}
	};


	// ------- private/"protected" methods	

	// send object to another component
	Component.prototype.send = function(to, object) {
		console.log("[WARNING] abstract method was not overwritten");
		console.log("to=" + to + ", object=" + object);
	};


	// ------- public methods	

	// event handler for receiving an object (via router)
	Component.prototype.onReceive = function(object)  {
		console.log("[WARNING] abstract method was not overwritten");
		console.log("object=" + object);
	};




	// ------- export	

	return Component;
});