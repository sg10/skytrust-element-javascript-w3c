requirejs.config({
	baseUrl: 'js/skytrust/',
    paths: {
        'jQuery': '../lib/jquery-2.1.3.min',
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

requirejs([ 'providerDef' ], 

	function(providerDef) {
		// make SkyTrust Crypto Provider accessible via window object 		
		window.getCryptoProviderByName = providerDef.getCryptoProviderByName;

		// init test fields
		initTestPage();
	});




function initTestPage() {

	var Config = require('./config');
	var $ = require('jQuery');

	var provider = window.getCryptoProviderByName("SkyTrust");

    var algo = "RSA-OAEP";

/*    var cryptoKey1 = new provider.subtle.CryptoKey(algo, ["encrypt", "decrypt"], "leaf", "122");
    console.log("CryptoKey: [" + cryptoKey1.id + ", " + cryptoKey1.subId + "]");
*/
	var cryptoKeysList = [];
	var fieldKeys = $("#fieldKeys");

    // buttons
	$('#btnDiscoverKeys').on('click', function() {
		provider.listKeys().then(function(cryptoKeys) {
		    cryptoKeysList = cryptoKeys;
		    fieldKeys.html("");
		    for(var i=0; i<cryptoKeys.length; i++) {
		        fieldKeys.append($("<option />").val(i).text("id: " + cryptoKeys[i].id + ", subId: " + cryptoKeys[i].subId));
		    }
		});
	});

	$('#btnEncrypt').on('click', function() {
		var cryptoKey = cryptoKeysList[fieldKeys.val()];
		if(!cryptoKey) return;

		console.log("[w3c] using CryptoKey " + cryptoKey);

		provider.subtle.sign("RSASSA-PKCS1-v1_5-SHA-256", cryptoKey, $('#fieldPlain').val())
	      .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) });



		// provider.subtle.encrypt(algo, cryptoKey, $('#fieldPlain').val())
  //        .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) });
	});

	$('#btnDecrypt').on('click', function() {
		var cryptoKey = cryptoKeysList[fieldKeys.val()];
		if(!cryptoKey) return;

		console.log("[w3c] using CryptoKey " + cryptoKey);

		provider.subtle.decrypt(algo, cryptoKey, $('#fieldEncrypted').val())
         .then(function(decrypted) { $('#fieldDecrypted').val(decrypted) });
	});

}