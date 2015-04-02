define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-element-common/component');
	var Protocol = require('../skytrust-element-common/protocol');


	var Authentication = function() {

		// ------- private members	

		var self = this;


		// ------- private methods	

		var onLoginFormSubmit = function(event) {
			var object = event.data;

			var username = $("#loginusername").val();
			var password = $("#loginpassword").val();
			console.log("[iframe] user name: " + username);
			console.log("[iframe] password: " + password);

			Protocol.setUserPasswortAuth(object, username, password);

			console.log("[iframe] object after auth");
			console.log(object.json());

			$('#loginform').hide();
			$('#loginform').off('submit');        

	        self.send('communication', object);
		};


		// ------- public methods

		this.onReceive = function(object) {
			console.log("[iframe] received at authentication component");

			// TODO: check if request still active
			$('#loginform').show();
			$('#loginform-message').hide();
			$('#loginform').submit(object, onLoginFormSubmit);

			// auth failure on SkyTrust server
			if(Protocol.getError(object) == "609") {
				$('#loginform-message').html("Invalid username/password");
				$('#loginform-message').show();
			}
		};


		// ------- C'tor

		if(this instanceof Window) {
			throw Error('Authentication called statically'); // define exception
		}

	}

	Authentication.prototype = Object.create(Component);

	// ------- export	

	return Authentication;
});