/**
 * Converts an ArrayBuffer to a base64 encoded string.
 * @method arrayBufferToBase64
 * @param {} buffer
 * @return CallExpression
 */
function arrayBufferToBase64(buffer) {
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
function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++){
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}



/* 
                --------------- UNUSED ----------------------
*/

/**
 * Loads a polyfill for promises if not available. Uses https://github.com/taylorhakes/promise-polyfill
 * @method loadPromisePolyfill
 * @param {} callback function that should be called after the polyfill has been loaded successfully
 */
function loadPromisePolyfill(callback){
    if(!window.Promise){
        console.log("This browser does not support Promises natively, loading polyfill for Promise...");
        var newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.setAttribute("async", "true");
        newScript.setAttribute("src", "plugins/Promise.min.js");
        document.documentElement.firstChild.appendChild(newScript);

        if(newScript.readyState) {
            /**
             * Description
             * @method onreadystatechange
             * @return 
             */
            newScript.onreadystatechange = function() {
                if(/loaded|complete/.test(newScript.readyState)) callback();
            }
        }else{
            newScript.addEventListener("load", callback, false);
        }
    }
}