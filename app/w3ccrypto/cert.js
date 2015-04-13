define(function() {

		function getCertificateData(CertPEM)
        {
            // function to convert string to ArrayBuffer
            function str2ab(str)
            {
                var buf = new ArrayBuffer(str.length);
                var bufView = new Uint8Array(buf);

                for(var i = 0, strLen = str.length; i < strLen; i++)
                    bufView[i] = str.charCodeAt(i);

                return buf;
            };

            // strip certificate header/footer from PEM
            var CertBuf = str2ab(window.atob(CertPEM));     // convert stripped PEM to ArrayBuffer

            // calls to convert b64 PEM cert to an array in the variable 'cert_simpl'
            var asn1 = org.pkijs.fromBER(CertBuf);
            var cert_simpl = new org.pkijs.simpl.CERT({ schema: asn1.result });

            var certSubjectString = "";
            var delimiter = "";

            // loop to get the subject key and values
            for(var i = 0; i < cert_simpl.subject.types_and_values.length; i++)
            {
                // OID map
                var typemap = {
                        "2.5.4.6": "C",
                        "2.5.4.10": "OU",
                        "2.5.4.11": "O",
                        "2.5.4.3": "CN",
                        "2.5.4.7": "L",
                        "2.5.4.8": "ST",
                        "2.5.4.12": "T",
                        "2.5.4.42": "GN",
                        "2.5.4.43": "I",
                        "2.5.4.4": "SN"
                    },
                    typeval = typemap[cert_simpl.subject.types_and_values[i].type],
                    subjval = cert_simpl.subject.types_and_values[i].value.value_block.value,
                    certSubjectString = certSubjectString + delimiter + typeval+"="+subjval;

                    delimiter = ", "

                
            };

            return certSubjectString;
            
        }

        return {
        	getCertificateData : getCertificateData
        }

});