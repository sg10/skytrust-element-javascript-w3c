
requirejs.config({
	baseUrl: 'skytrust/',
    paths: {
        'jQuery': '../lib/jquery-2.1.3.min',
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});


requirejs(['config', 'jQuery', 'skytrust-element-iframe/element'], 
    function (config, $, Element) {
	init(config, $, Element);
});




function init(config, $, Element) {

	var element = new Element();

	$('#loginserver').val(config.server);

}