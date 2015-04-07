var cryptoKeysList = [];

var initTestpage = function() {
    console.log("init testpage");

    var provider = window.getCryptoProviderByName("SkyTrust");

    var algoSimple = "RSA-OAEP";
    var algoCMS = "CMS-AES-192-GCM";
    var algoSign = "RSASSA-PKCS1-v1_5-SHA-256";

    // buttons
    $('#btnDiscoverKeys').on('click', function() {
        provider.extended.listKeys().then(updateCryptoKeysList);
    });

    initTestButtonEventHandlerSimple({
        button: '#btnEncrypt',
        func: provider.subtle.encrypt,
        algo: algoSimple,
        source: '#fieldPlain',
        target: '#fieldEncrypted'});

    initTestButtonEventHandlerSimple({
        button: '#btnDecrypt',
        func: provider.subtle.decrypt,
        algo: algoSimple,
        source: '#fieldEncrypted',
        target: '#fieldDecrypted'});

    initTestButtonEventHandlerSimple({
        button: '#btnSign',
        func: provider.subtle.sign,
        algo: algoSign,
        source: '#fieldPlain',
        target: '#fieldEncrypted'});


    var fieldKeys = $("#fieldKeys");        

    $('#btnEncryptCMS').on('click', function() {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];
        var values = [$('#fieldPlain').val(), $('#fieldPlain2').val()];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

        provider.extended.encryptCMS(algoCMS, cryptoKey, values)
         .then(function(result) { 
            $('#fieldEncrypted').val(result[0]); 
            $('#fieldEncrypted2').val(result[1]);
         }).catch(displayError);
    });

    $('#btnDecryptCMS').on('click', function() {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];
        var values = [$('#fieldEncrypted').val(), $('#fieldEncrypted2').val()];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

        provider.extended.decryptCMS(algoCMS, cryptoKey, values)
         .then(function(result) { 
            $('#fieldDecrypted').val(result[0]); 
            $('#fieldDecrypted2').val(result[1]);
         }).catch(displayError);
    });

    $('#btnGenWrappedKey2048').on('click', function() { genWrappedKey("RSA-2048") });
    $('#btnGenWrappedKey4096').on('click', function() { genWrappedKey("RSA-4096") });

    var genWrappedKey = function(algoWrappedKey) {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];
        
        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + algoWrappedKey);

        provider.subtle.generateKey(algoWrappedKey, true, null, [cryptoKey], null, "CN=Wonderful")
         .then(function(result) { 
            var i = cryptoKeysList.length;
            cryptoKeysList[i] = result;
            fieldKeys.append($("<option />").val(i).text(cryptoKeysList[i]));
            fieldKeys.val(i);
            console.log(i + ": " + cryptoKeysList[i]);
         })
         .catch(displayError);
    };

    $('#btnExport').on('click', function() {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey);

        provider.subtle.exportKey("x509", cryptoKey)
         .then(function(result) {
            $("#fieldExportedKey").val(result.key);
            $("#fieldExportedCertificate").val(result.certificate);
         })
         .catch(displayError);
    });

    window.setTimeout(function() {
        provider.extended.listKeys().then(updateCryptoKeysList);
    }, 2000);
};

var initTestButtonEventHandlerSimple = function(options) {
    $(options.button).on('click', function() {
        var fieldKeys = $("#fieldKeys");        
        var cryptoKey = cryptoKeysList[fieldKeys.val()];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + options.algo);

        options.func(options.algo, cryptoKey, $(options.source).val())
         .then(function(result) { $(options.target).val(result) })
         .catch(displayError);
    });
}

var timeoutHideError = null;
var displayError = function(e) {
    window.clearTimeout(timeoutHideError);
    $('#errorField').show();
    $('#errorField').html(e.toString());
    window.setTimeout(function() {$('#errorField').hide();}, 5000);
};

var updateCryptoKeysList = function(cryptoKeys) {
    var fieldKeys = $("#fieldKeys");

    cryptoKeysList = cryptoKeys;
    fieldKeys.html("");
    for(var i=0; i<cryptoKeys.length; i++) {
        fieldKeys.append($("<option />").val(i).text(cryptoKeys[i]));
    }
};
