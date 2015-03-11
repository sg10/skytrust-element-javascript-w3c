define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Component = require('../crysil-node-common/component');
	var Protocol = require('../crysil-node-common/protocol');


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

		console.log("[iframe] payload after auth");
		console.log(object.getPayload());

		$('#loginform').hide();
		$('#loginform').off('submit');        

        self.send('communication', object);
	};


	// ------- public methods

	var onReceive = function(object) {
		console.log("[iframe] received at authentication component");

		// TODO: check if unused
		$('#loginform').show();
		$('#loginform').submit(object, onLoginFormSubmit);
	};


	// ------- export	

	return function() {

		self = this;

		return $.extend(this, Component, {

			onReceive : onReceive

		});
	};


});