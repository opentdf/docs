# Key Access Service

The Key Access Server (KAS) manages the lifecycle of cryptographic keys and provides access to these keys for the encryption and decryption of TDFs. KAS serves as an out-of-the-box **Policy Enforcement Point (PEP)** for the OpenTDF platform.

## RPC Methods

KAS offers the following RPC methods:

- `PublicKey` - Retrieves a public key from KAS. It defaults to `rsa:2048` and uses the currently active default key. The key is returned in PEM format by default.

  ```protobuf reference
  https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L69-L75
  ```

  ```protobuf reference
  https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L34-L43
  ```

- `Rewrap` - This method takes a key wrapped using a key retrieved from the `PublicKey` endpoint and rewraps it with a client key. The process succeeds only if the following conditions are met:
  - The policy binding is validated.
  - The authorization service confirms that the entity is allowed access to the TDF.

  ```protobuf reference
  https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L86-L95
  ```

  ```protobuf reference
  https://github.com/opentdf/platform/blob/7dea6407322b5e625ee2810dfcf407c010d9996f/service/kas/kas.proto#L45-L56
  ```

## How Rewrap Works

### TDF

<img src="/img/kas_tdf_flow.svg" alt="KAS TDF Rewrap"/>

1. The client extracts two pieces of information from the TDF:
   1. [Key Access Object (KAO)](/spec/schema/opentdf/key_access_object): This contains the wrapped key and the policy binding.
   2. The [Policy](/spec/schema/opentdf/policy) from the manifest.

2. The client generates an ephemeral asymmetric key pair, used to wrap the KAO content (such as an AES encryption key that can access the TDF payload) from KAS.

3. The client builds a `RequestBody`:

    ```json
    {
      "keyAccess": "<The Key Access Object>",
      "policy": "<The Policy from the Manifest>",
      "clientPublicKey": "<The public key created in step 2>"
    }
    ```

4. With this `RequestBody`, the client creates a Signed Request Token, which is a JWT signed with the client's DPoP public key or Ephemeral Key Pair.

    :::note
    "Demonstration of Proof of Possession" is currently optional due to inconsistencies across identity providers.
    :::

    ```json title="Body of JWT"
    {
      "requestBody": "<RequestBody>"
    }
    ```

At this point, the client is ready to make the rewrap request. The following is an example request body. 

```json title="Signed Request Token"
{
  "signedRequestToken": "<The JWT>"
}
```

5. KAS first verifies the policy binding against the policy passed in the `RequestBody`. To do this, KAS unwraps the key to retrieve the symmetric key used to sign the original policy. It then generates the HMAC of the policy and compares it to the policy binding in the KAO. If they match, the policy is valid.

    ```text
    HMAC-SHA256(B64(POLICY), KEY)
    ```

6. If the policy is valid and untampered, KAS calls the [Authorization Service](./authorization) to confirm whether the entity is allowed access to the TDF. If authorized, KAS rewraps the symmetric key with the client's public key and returns the newly wrapped key for the client to use in decrypting the TDF.
