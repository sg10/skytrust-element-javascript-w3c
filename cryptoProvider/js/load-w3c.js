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

    var algo = "RSA-OAEP", algoCMS = "CMS-AES-192-GCM";

    var cryptoKeysList = [];
    var fieldKeys = $("#fieldKeys");

        // buttons
    $('#btnDiscoverKeys').on('click', function() {
        provider.listKeys().then(updateCryptoKeysList);
    });

        $('#btnEncrypt').on('click', function() {
                var cryptoKey = cryptoKeysList[fieldKeys.val()];
                if(!cryptoKey) return;

                console.log("[w3c] using CryptoKey " + cryptoKey + ", algorithm " + algo);

                provider.subtle.encrypt(algo, cryptoKey, $('#fieldPlain').val())
                    .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) })
                    .catch(displayError);
        });

        $('#btnSign').on('click', function() {
                var cryptoKey = cryptoKeysList[fieldKeys.val()];
                if(!cryptoKey) return;

                var algo = "RSASSA-PKCS1-v1_5-SHA-256";
                console.log("[w3c] using CryptoKey " + cryptoKey + ", algorithm " + algo);

                provider.subtle.sign(algo, cryptoKey, $('#fieldPlain').val())
                    .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) })
                    .catch(displayError);
        });


    $('#btnDecrypt').on('click', function() {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];
        if(!cryptoKey) return;

        console.log("[w3c] using CryptoKey " + cryptoKey + ", algorithm " + algo);

        provider.subtle.decrypt(algo, cryptoKey, $('#fieldEncrypted').val())
                 .then(function(decrypted) { $('#fieldDecrypted').val(decrypted) })
                 .catch(displayError);
    });

        $('#btnEncryptCMS').on('click', function() {
                var cryptoKey = cryptoKeysList[fieldKeys.val()];
                if(!cryptoKey) return;

                console.log("[w3c] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

                provider.subtle.encryptCMS(algoCMS, cryptoKey, $('#fieldPlain').val())
                 .then(function(encrypted) { $('#fieldEncrypted').val(encrypted) })
                 .catch(displayError);
        });

        $('#btnDecryptCMS').on('click', function() {
                var cryptoKey = cryptoKeysList[fieldKeys.val()];
                if(!cryptoKey) return;

                console.log("[w3c] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

                provider.subtle.decryptCMS(algoCMS, cryptoKey, $('#fieldEncrypted').val())
                 .then(function(decrypted) { $('#fieldDecrypted').val(decrypted) })
                 .catch(displayError);
        });

        window.setTimeout(function() {
            provider.listKeys().then(updateCryptoKeysList);
        }, 2000);


        function updateCryptoKeysList(cryptoKeys) {
            cryptoKeysList = cryptoKeys;
            fieldKeys.html("");
            for(var i=0; i<cryptoKeys.length; i++) {
                    fieldKeys.append($("<option />").val(i).text("id: " + cryptoKeys[i].id + ", subId: " + cryptoKeys[i].subId));
            }
        }
}

function displayError(e) {
        $('#errorField').html(e.toString());
}

