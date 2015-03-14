define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../skytrust-node-common/component');
	var Protocol = require('../skytrust-node-common/protocol');


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

	var onReceive = function(object) {
		console.log("[iframe] received at authentication component");

		// TODO: check if request still active
		$('#loginform').show();
		$('#loginform-message').hide();
		$('#loginform').submit(object, onLoginFormSubmit);

		// auth failure
		if(Protocol.getError(object) == "609") {
			$('#loginform-message').html("Invalid username/password");
			$('#loginform-message').show();
		}
	};


	// ------- export	

	return function() {
		self = this;

		return $.extend(this, Component, {

			onReceive : onReceive

		});
	};


});