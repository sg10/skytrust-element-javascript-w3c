define(function(require) {

    /**
     * Converts an ArrayBuffer to a base64 encoded string.
     * @method arrayBufferToBase64
     * @param {} buffer
     * @return CallExpression
     */
    var arrayBufferToBase64 = function(buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * Converts a base64 encoded String to a Uint8Array.
     * @method base64ToArrayBuffer
     * @param {} base64 encoded String
     * @return bytes
     */
    var base64ToArrayBuffer = function(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++){
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }



    return {
        "arrayBufferToBase64" : arrayBufferToBase64,
        "base64ToArrayBuffer" : base64ToArrayBuffer

    }

});