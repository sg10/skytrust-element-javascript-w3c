define({
	
    "server":                "http://skytrust-dev.iaik.tugraz.at/skytrust-server-no-auth-2.0/rest/json",

    "supportedAlgorithms":  {
            // encrypt+decrypt
            "encrypt":    [  "RSA-OAEP", "RSAES-PKCS1-v1_5", "RSAES-RAW"  ],
            "sign":       [  "RSASSA-PKCS1-v1_5-SHA-1", "RSASSA-PKCS1-v1_5-SHA-224", 
                             "RSASSA-PKCS1-v1_5-SHA-256", "RSASSA-PKCS1-v1_5-SHA-512"  ],
            // encrypt+decrypt CMS
            "cms":        [  "CMS-AES-128-CBC", "CMS-AES-192-CBC", "CMS-AES-256-CBC", 
                             "CMS-AES-128-GCM", "CMS-AES-192-GCM", "CMS-AES-256-GCM", 
                             "CMS-AES-128-CCM", "CMS-AES-192-CCM", "CMS-AES-256-CCM"  ],
            "wrapped":    [  "RSA-2048", "RSA-4096" ]
    }
});