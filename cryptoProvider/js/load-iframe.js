
requirejs.config({
	baseUrl: 'crysil/',
    paths: {
        'jQuery': '../lib/jquery-2.1.3.min',
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});


requirejs(['config', 'jQuery', 'crysil-node-iframe/node'], function (config, $, Node) {
	init(config, $, Node);
});




function init(config, $, Node) {

	var node = new Node();

	$('#loginserver').val(config.server);

}