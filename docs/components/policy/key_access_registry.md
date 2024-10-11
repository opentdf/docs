# Key Access Registry

The Key Access Server (KAS) Registry within the platform policy is a store of known Key Access Servers.

Within platform policy, a registered KAS instance has the following key attributes:

1. **URI**: The location where the KAS is accessible. This must be unique among all KAS instances registered in the platform.
2. **Public Key Location**:
   1. **Remote**: A public key available at an endpoint, such as `https://kas-one.com/public_key`.
   2. **Cached**: One or more public keys stored within the platform policy database (see the example below).

These traits are essential for managing KAS Grants to attributes and their associated key splits in encryption and decryption processes.

#### Cached Key Example

```json5
{
  "cached": {
    // One or more known public keys for the KAS
    "keys": [
      {
        // x509 ASN.1 content in PEM format
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

1. The `"pem"` field should contain the full certificate, for example:
   `-----BEGIN CERTIFICATE-----
MIIB...5Q=
-----END CERTIFICATE-----
`.

2. The `"kid"` field represents the key identifier, which is primarily used for key rotation.

3. The `"alg"` field specifies the key algorithm used:

| Key Algorithm     | `alg` Value |
| ----------------- | ----------- |
| `rsa:2048`        | 1           |
| `ec:secp256r1`    | 5           |
