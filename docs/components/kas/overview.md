# Overview

The Key Access Server (KAS) is responsible for managing the lifecycle of cryptographic keys and providing access to those keys for encryption and decryption of a TDF. KAS can be thought of as an out-of-the-box **Policy Enforcement Point** (PEP) for the OpenTDF platform.

## RPC Methods

KAS provides the following RPC methods:

- `PublicKey` - Retrieve a public key from KAS. It defaults to `rsa:2048` and the currently active default key. The key is returned in PEM format by default.

```protobuf reference
https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L69-L75
```

```protobuf reference
https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L34-L43
```

- `Rewrap` - Rewrap takes a key wrapped using a key retrieved from the `PublicKey` endpoint and returns the value wrapped with a client key. It returns if and only if the following conditions are true:
  - The policy binding validates to true
  - The authorization service confirms the entity is allowed access to that `TDF`.

```protobuf reference
https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L86-L95
```

```protobuf reference
https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L45-L56
```

## How Does Rewrap Work

### ZTDF


1. The client extracts two pieces of information from the `TDF`:
   1. [Key Access Object](/spec/ztdf/kao) - This object contains the wrapped key and the policy binding.
   2. The [Policy](/spec/ztdf/policy) from the manifest.

2. The client needs to generate an RSA key pair so that the public key can be sent to KAS for rewrapping the symmetric key.
3. The client builds an object called a `RequestBody`

    ```json
      {
        "keyAccess": "<The Key Access Object>",
        "policy": "<The Policy from the Manifest>",
        "clientPublicKey": "<The public key of the client>"
      }
    ```

4. With this `RequestBody`, the client can now build the Signed Request Token. This token is a JWT that is signed with the client's DPoP public key.
    :::note
    "Demonstration proof of possession" is not required at this time due to the lack of inconsistency between identity providers.
    :::

    ```json title="Body of JWT"
    {
      "requestBody": "<Request Body Object>"
    }
    ```

Now that we have everything needed to make the rewrap request, we can dive into what happens within KAS.

```json
{
  "signedRequestToken": "<The JWT>"
}
```

5. The first thing KAS does is verify the policy binding against the policy that was passed in the `RequestBody`. To do this, KAS must unwrap the wrapped key to get the symmetric key that was used to sign the policy originally. It generates the HMAC of the passed policy against the policy binding in the Key Access Object. If the HMAC matches the policy binding, then the policy is valid.

  ```

  HMAC-SHA256(B64(POLICY),KEY)

  ```

6. If the policy is valid and has not been tampered with, KAS will now make a GetDecision call against the [Authorization Service](../authorization/overview.md) to see if the entity is allowed access to the TDF. If this is true, KAS will take the client's public key, wrap the symmetric key, and return the newly wrapped key to the client to unwrap and decrypt the TDF.

### NanoTDF
