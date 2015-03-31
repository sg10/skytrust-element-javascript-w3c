define(function(require) {

    var atob = function(base64Data) {

        if( Object.prototype.toString.call( base64Data ) === '[object Array]' ) {
            var plainTextArray = [];
            for(var i=0; i<base64Data.length; i++) {
                plainTextArray.push(window.atob(base64Data[i]));
            }

            return plainTextArray;
        }
        else {
            return window.atob(base64Data);
        }

    };

    var btoa = function(plainTextData) {

        if( Object.prototype.toString.call( plainTextData ) === '[object Array]' ) {
            var base64Array = [];
            for(var i=0; i<plainTextData.length; i++) {
                base64Array.push(window.btoa(plainTextData[i]));
            }

            return base64Array;
        }
        else {
            return window.btoa(plainTextData);
        }

    }

    return {
        atob : atob,
        btoa : btoa
    }

});