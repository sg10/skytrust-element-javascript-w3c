define(function(require) {

	// ------- imports	
	
	var $ = require('jQuery');

	var Config = require('../skytrust-config');
	var Component = require('../common/component');
	var Protocol = require('../common/protocol');


	var Authentication = function(element) {

		// ------- private members	

		var self = this;
		var queue = null;
		var formInUse = false;


		var RequestQueue = function() {
			var queue = [];
			var self_ = this;

			self_.enqueue = function(cryptoObject) {
				queue.push(cryptoObject);
			};

			self_.dequeue = function() {
				if(queue.length !== 0) {
					var cryptoObject = queue.slice(0, 1)[0];
					queue = queue.slice(1, queue.length);
					return cryptoObject;
				}
				
				return null;
			};
			
			this.length = function() {
				return queue.length;
			}

		};

		var showAuthFormForNextQueueObject = function() {
			var cryptoObject = queue.dequeue();
			updateQueueDiv();
			if(cryptoObject === null)  return;

			formInUse = true;

			$('#loginform').submit(cryptoObject, onLoginFormSubmit);
			element.parentAuthHandler.show();
		};

		var updateQueueDiv = function() {
			console.log("[iframe] queue length: " + queue.length());

			if(queue.length() > 0) {
				$('#loginforminfo').show();
				$('#loginforminfo').html("<b>" + queue.length() + "</b> requests remaining after this one.");
			}
			else {
				$('#loginforminfo').hide();
			}
		};


		// ------- private methods	

		var onLoginFormSubmit = function(event) {
			var cryptoObject = event.data;

			//$('#loginform')[0].reset();
            $('#loginserver').val(Config.server);

			var username = $("#loginusername").val();
			var password = $("#loginpassword").val();

			Protocol.setUserPasswortAuth(cryptoObject, username, password);

			console.log("[iframe] cryptoObject after auth");
			console.log(cryptoObject);

			$('#loginform').off('submit');

			console.log("hide");
   			element.parentAuthHandler.hide();

	        self.send('communication', cryptoObject);

			if(queue.length() > 0) {
	   			showAuthFormForNextQueueObject();
	   		}
	   		else {
	   			formInUse = false;
	   		}
		};


		// ------- public methods

		this.onReceive = function(cryptoObject) {
			console.log("[iframe] received at authentication component");

			queue.enqueue(cryptoObject);
			updateQueueDiv();
			
			console.log("[iframe] queue length: " + queue.length());

			if(formInUse === false) {
				showAuthFormForNextQueueObject();
			}
		};


		// ------- C'tor

		if(!(this instanceof Authentication)) {
			throw Error('Authentication called statically'); // define exception
		}

		queue = new RequestQueue();

	};

	Authentication.prototype = Object.create(Component);

	// ------- export	

	return Authentication;
});