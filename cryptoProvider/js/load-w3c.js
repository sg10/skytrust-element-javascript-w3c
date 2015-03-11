
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

    var cryptoKey1 = new provider.subtle.CryptoKey("leaf", "122", algo, ["encrypt", "decrypt"]);
    console.log("CryptoKey: [" + cryptoKey1.id + ", " + cryptoKey1.subId + "]");

    // buttons
	$('#btnEncrypt').on('click', function() {
		provider.subtle.encrypt(algo, cryptoKey1, $('#fieldPlain').val())
         .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) });
	});

	$('#btnDecrypt').on('click', function() {
		provider.subtle.decrypt(algo, cryptoKey1, $('#fieldEncrypted').val())
         .then(function(decrypted) { $('#fieldDecrypted').val(decrypted) });
	});

}