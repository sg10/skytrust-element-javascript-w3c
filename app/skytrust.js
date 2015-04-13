requirejs.config({
    paths: {
        'jQuery': 'https://code.jquery.com/jquery-1.11.2.min',
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

requirejs([ 'jQuery', 'skytrust-config', 'w3ccrypto/providerDef', 
    'iframe/element', 'w3ccrypto/provider', 'external/x509-engelke' ], 

    function($, Config, providerDef, 
        SkyTrustIFrameElement, provider, x509) {

        window.x509 = x509;
        cert = "MIIDrjCCApagAwIBAgIDC9LlMA0GCSqGSIb3DQEBCwUAMGwxJDAiBgNVBAsTG0RlbW8gQ2VydGlmaWNhdGUgVUlEIDMzQjI3NTELMAkGA1UEBhMCQVQxETAPBgNVBAoTCFNreVRydXN0MSQwIgYDVQQDExtJbnRlcm1lZGlhdGUvMTIgQ2VydGlmaWNhdGUwHhcNMTUwMTI2MTE1NzIwWhcNMjAxMjI2MTE1NzIwWjBlMSQwIgYDVQQLExtEZW1vIENlcnRpZmljYXRlIFVJRCAzM0IyNzUxCzAJBgNVBAYTAkFUMREwDwYDVQQKEwhTa3lUcnVzdDEdMBsGA1UEAxMUTGVhZi8xMjIgQ2VydGlmaWNhdGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCFQshAg5KuuXzatFZPa2mo75/PLK70xS9ojo6FZdoX9WLe36nxNIhrDng/o5kIrwJDUJvN1N3+1le5U/WOgdHmxLHVJPDyJg3Ip2RhOb9LTCAa4gKNHTmW/sQI1k3QeDf1NzTcE2upT+ev+RyhnhmXBQWnUpD70c8pUy1TeZfoozVs6wBMsWW68CLxNwbwnand8EwmXE2icJGc7AM3y3xX4O5QRRayx+D4joMryRcdmliC4xHrn0YU0FKgQH/23WEsrzJsEBYXDhVrmPglIs2C6yxa5cFT/EJ8iAJ8/FeaHBzr2dP+eNLi8NbYX5ToZCXV0LalJpNLCzFMoK4EvufNAgMBAAGjYDBeMA4GA1UdDwEB/wQEAwIE8DAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFJQsTxmxLUqoPloohBwfW0mD1NAeMB0GA1UdDgQWBBRJ8LERKtqZlTWAC/JLfBf6BxcqKDANBgkqhkiG9w0BAQsFAAOCAQEAg9GP7RqL2j/11vNhn7dhhCfkJPSy/IWp6RZUkzQsMDwhwruFsCtuYRBabQqDumioHidFwvsRLcK+nxHkmiNMQq2dzWnxeMYXlXFwRDw4BHT8MPksNxypfjVB5WSKU0hRXiNIad8SxPBhlpMddjV4Q5TVGqqZ+2577UlAaruemiP6ELqJK9OQXjHcwrO4O7XXsGW6YCbu9IEJFCc4b/SDMTlDusw6cPB7jbHfVv5hkJL5FPV0aNqX81g81bUFhBSnhwgZMz/kwFjG/HSx/U3v5qIoh3i4bJnF7mImN60o+gZvQOKadUCOHme+q61T3sbOs5tHhRctJ+yL4kW+aTtz2w==";
        
        // -> IFrame Level Element 
        if (typeof ___skytrust_javascript_iframe___ !== 'undefined') {
            console.log("[iframe] initializing SkyTrust")
            new SkyTrustIFrameElement();
        }
        // -> W3C Crypto Level Element
        else {
            console.log("[w3c   ] initializing SkyTrust: window.getCryptoProviderByName()");
            // make SkyTrust Crypto Provider accessible via window object         
            window.getCryptoProviderByName = providerDef.getCryptoProviderByName;

            // run and remove registered onLoad callbacks
            console.log("[w3c   ] onCryptoProviderLoad() callbacks")
            if($.isArray(window._cryptoProviderListenerFunctions)) {
                $.each(window._cryptoProviderListenerFunctions, function(k, func) {
                    func();
                });
            }
            delete window._cryptoProviderListenerFunctions;
       }
    }
);