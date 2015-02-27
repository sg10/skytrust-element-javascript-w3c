// For any third party dependencies, like jQuery, place them in the lib folder.
// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
	baseUrl: 'js/CrySIL/',
    paths: {
        'jQuery': '../lib/jquery-2.1.3.min',
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs([ 'providerDef', 'jQuery', 'config' ], 
	function(providerDef, $, config) {
		// make CrySIL Crypto Provider accessible via window object 		
		window.getCryptoProviderByName = providerDef.getCryptoProviderByName;

		// init test fields
		initTestPage();
	});


function initTestPage() {

	var config = require('config');

	var provider = window.getCryptoProviderByName("CrySIL");
    console.log(" - provider - ");
    console.log(provider);

    var algo = "RSA-OAEP";

    var cryptoKey1 = new provider.subtle.CryptoKey("leaf", "122", algo, ["encrypt", "decrypt"]);
    console.log(" - key - ");
    console.log(cryptoKey1);

    // buttons
	$('#btnEncrypt').on('click', function() {
		provider.subtle.encrypt(algo, cryptoKey1, $('#fieldPlain').val)
         .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) });
	});

	$('#btnDecrypt').on('click', function() {
		provider.subtle.decrypt(algo, cryptoKey1, $('#fieldEncrypted').val)
         .then(function(decrypted) { $('#fieldDecrypted').val(decrypted) });
	});

	// server config
	$('#serverURL').html(config.server);

}