define(function(require) {

    // ------- imports 
    
    var $ = require("jQuery");


    var ComObject = function() {

        this.requestID = -1;
        this.type = null;
        this.data = {};
        
    };


    // ------- export  

    return ComObject;


});