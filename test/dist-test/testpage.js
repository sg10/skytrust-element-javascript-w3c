var cryptoKeysList = [];

var initTestpage = function() {
    console.log("init testpage");

    console.log(requirejs);
    var provider = window.getCryptoProviderByName("SkyTrust");

    var algoSimple = "RSAES-PKCS1-v1_5";
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
        var values = [stringToArrayBuffer($('#fieldPlain').val()), 
                        stringToArrayBuffer($('#fieldPlain2').val())];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

        provider.extended.encryptCMS(algoCMS, [cryptoKey], values)
         .then(function(result) { 
            $('#fieldEncrypted').val(arrayBufferToString(result[0])); 
            $('#fieldEncrypted2').val(arrayBufferToString(result[1]));
         }).catch(displayError);
    });

    $('#btnDecryptCMS').on('click', function() {
        var cryptoKey = cryptoKeysList[fieldKeys.val()];
        var values = [stringToArrayBuffer($('#fieldEncrypted').val()), 
                        stringToArrayBuffer($('#fieldEncrypted2').val())];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + algoCMS);

        provider.extended.decryptCMS(algoCMS, cryptoKey, values)
         .then(function(result) { 
            $('#fieldDecrypted').val(arrayBufferToString(result[0])); 
            $('#fieldDecrypted2').val(arrayBufferToString(result[1]));
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

        provider.subtle.exportKey("wrapped", cryptoKey)
         .then(function(result) {
            $("#fieldExportedKey").val(result.encodedWrappedKey);
            $("#fieldExportedCertificate").val(result.encodedX509Certificate);
         })
         .catch(displayError);
    });

    $('#btnImport').on('click', function() {
        var keyData = {
            encodedWrappedKey: $("#fieldExportedKey").val(),
            encodedX509Certificate: $("#fieldExportedCertificate").val() };

        provider.subtle.importKey("wrapped", keyData)
         .then(function(resultKey) {
            cryptoKeysList.push(resultKey);
            updateCryptoKeysList(cryptoKeysList);
            $('#fieldKeys').val(cryptoKeysList.length - 1);
         })
         .catch(displayError);
    });

    window.setTimeout(function() {
        provider.extended.listKeys().then(updateCryptoKeysList).catch(displayError);
    }, 1000);
};

var initTestButtonEventHandlerSimple = function(options) {
    $(options.button).on('click', function() {
        var fieldKeys = $("#fieldKeys");        
        var cryptoKey = cryptoKeysList[fieldKeys.val()];

        if(!cryptoKey) return;

        console.log("[w3c   ] using CryptoKey " + cryptoKey + ", algorithm " + options.algo);

        var value = $(options.source).val();
        value = stringToArrayBuffer(value);

        options.func(options.algo, cryptoKey, value)
         .then(function(result) { 
            $(options.target).val(arrayBufferToString(result)); 
         })
         .catch(displayError);
    });
}

var timeoutHideError = null;
function displayError(e) {
    window.clearTimeout(timeoutHideError);
    $('#errorField').show();
    $('#errorField').html(e.toString());
    window.setTimeout(function() {$('#errorField').hide();}, 5000);
};

function updateCryptoKeysList(cryptoKeys) {
    var fieldKeys = $("#fieldKeys");

    fieldKeys.html("");
    cryptoKeysList = (cryptoKeys !== null) ? cryptoKeys : cryptoKeysList;
    for(var i=0; i<cryptoKeysList.length; i++) {
        fieldKeys.append($("<option />").val(i).text(cryptoKeysList[i]));
    }
};

function arrayBufferToString(buffer) {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

function stringToArrayBuffer(str) {
    var buffer = new ArrayBuffer(2*str.length); // 2 bytes per character
    var bufferView = new Uint16Array(buffer);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
}