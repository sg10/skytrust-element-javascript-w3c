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

requirejs([ 'providerDef', '../test/testpage' ], 

    function(providerDef, testpage) {
        // make SkyTrust Crypto Provider accessible via window object         
        window.getCryptoProviderByName = providerDef.getCryptoProviderByName;

        testpage();

    });