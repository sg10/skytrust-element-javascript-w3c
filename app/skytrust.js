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

requirejs([ 'jQuery', 'skytrust-config', 'w3ccrypto/providerDef', 'iframe/element' ], 

    function($, Config, providerDef, SkyTrustIFrameElement) {
        // -> IFrame Level Element 
        if (typeof ___skytrust_javascript_iframe___ !== 'undefined') {
            console.log("[iframe] initializing SkyTrust")
            new SkyTrustIFrameElement();
            $('#loginserver').val(Config.server); // TODO: remove (debug-only)
        }
        // -> W3C Crypto Level Element
        else {
            console.log("[w3c   ] initializing SkyTrust: window.getCryptoProviderByName()");
            // make SkyTrust Crypto Provider accessible via window object         
            window.getCryptoProviderByName = providerDef.getCryptoProviderByName;
        }
    }
);