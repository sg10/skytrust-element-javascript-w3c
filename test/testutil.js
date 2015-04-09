define(function(require) {
	return {
		ab2str : function(buf) {
	        var ui16 = new Uint16Array(buf);
	        return String.fromCharCode.apply(null, ui16);
	    },
	    str2ab : function(str, l) {
	        var length = (l == null) ? str.length*2 : l;
	        var buf = new ArrayBuffer(length); // 2 bytes for each char
	        var bufView = new Uint16Array(buf);
	        for (var i=0, strLen=str.length; i<strLen; i++) {
	            bufView[i] = str.charCodeAt(i);
	        }
	        return buf;
	    }
	};
});