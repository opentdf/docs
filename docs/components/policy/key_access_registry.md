# Key Access Registry

The KAS (Key Access Server) Registry within platform policy is a store of known Key Access Servers. To learn more about a Key Access Server
in general, please see its separate documentation.

Within platform policy, a registered KAS has a few known traits:

1. a `uri`, which is assumed to be the location the KAS is accessible, and must be unique among KASs registered in the platform
2. a public key location
   1. a `remote` public key is one that is available at an endpoint, such as `https://kas-one.com/public_key`
   2. `cached` public keys are one or more keys stored within the platform policy database (see [cached key example](#cached))

These traits will be relied upon within KAS Grants to attributes and their various key splits on encrypt/decrypt, which are separately documented.

#### Cached Key Example

```json5
{
  "cached": {
    // One or more known public keys for the KAS
    "keys":[
      {
        // x509 ASN.1 content in PEM envelope, usually
        "pem": "<your PEM certificate>",
        // key identifier 
        "kid": "<your key id>",
        // key algorithm (see below)
        "alg": 1
      }
    ]
  }
}
```

1. The `"pem"` value should contain everything `-----BEGIN CERTIFICATE-----\nMIIB...5Q=\n-----END CERTIFICATE-----\n`.

2. The `"kid"` value is a named key identifier, which is useful for key rotations.

3. The `"alg"` specifies the key algorithm:

| Key Algorithm  | `alg` Value |
| -------------- | ----------- |
| `rsa:2048`     | 1           |
| `ec:secp256r1` | 5           |
