---
sidebar_position: 1
slug: /components/policy/keymanagement/quickstart
---

# Quickstart for using the new key management architecture

:::important
This quickstart is meant to aid users trying to test the new key management
features, by standing up a new platform. This quickstart is not meant as a
migration guide. Currently, while key management is experimental, we recommend to use key management with **ONLY** new deployments.
:::

Below is a guide to setting up platform to use the new key management features.

Checklist:

:::important
You can spin KAS up without activating the key management features.
This gives you time to create or migrate keys to the platform
before KAS expects keys to come from the platform, which would
be helpful for migrations.
:::

1. Key management is activated for KAS.
2. A key has been created.
3. Assign key mappings. (optional, but recommended)
4. Base Key is set (optional, but recommended)

## Key management is activated for KAS

- To activate key management for KAS you will need to modify the **key_management** field within the opentdf.yaml file to be true. [opentdf-dev.yaml](https://github.com/opentdf/platform/blob/main/opentdf-dev.yaml#L24).
- You will also need to set a root key to be used with the basic manager. The root key should be 32 bytes long.
  - In addition, the root key should be hex encoded.

## Creating a key

:::note
You can also perform all key commands with the [OpenTDF CLI](https://github.com/opentdf/otdfctl)
:::

1. You should already have created and registered a **Key Access Server** with the platform via the [Create Key Access Server Endpoint](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L59).
2. Once you have a **Key Access Server** registered you should then create a key for that registered KAS.

The definition for creating a key can be found in the key_access_registry [proto](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L399-L421).

Let's look at a valid request and dissect it:

:::note
These keys can be found within the [policy_fixtures.yaml](https://github.com/opentdf/platform/blob/main/service/internal/fixtures/policy_fixtures.yaml#L541) file located
in opentdf.
:::

```json5
{
  "kas_id": "db740f79-cf85-41b2-a27f-663b0e2b169b",
  "key_id": "kas-key-1",
  "key_algorithm": 1,
  "key_mode": 1,
  "public_key_ctx": {
    "pem": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvVENDQWVXZ0F3SUJBZ0lVRjA5QWpIallJOENSekVGSmpjVEREY2lkZEgwd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0RqRU1NQW9HQTFVRUF3d0RhMkZ6TUI0WERUSTBNRFV3TmpFeU1UQXhNbG9YRFRJMU1EVXdOakV5TVRBeApNbG93RGpFTU1Bb0dBMVVFQXd3RGEyRnpNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDCkFRRUFsVEI5eks3dzF1MG1mOWI5bmg4U3p0K0t5ZFdvbjUyUDVNY2k4Z1YremFQWjlmM0picllHVWZWWG16RmEKbVErTjBmTjZRaDhVOWlzbzFPZ3VHWDB1eTRwV1k3em1XTXFtRjVpSk9INENBdTVnV2Vuc3I5R2FXM1lmeEtWRgpWUnpKcUx0U3pBT3lvQ0lhNVErSTJUdmdNeEZjSFYwSGN4OXU5ekdYdDdKNUdlV1pTM3I2OUg4MGRGUjdGc0lRCk1hTDZRUHhmUWNWOVJidW9weUFwOE43TktiU3p4OEZUZEJYUWE4QnVxTXNvNlZyK0crZC9oeVp6YlpVc1pEUzQKZ3RtNnJCQlUraE8zMEN6WnBaZHBETVNPdjljNGNZUXlpdElwRjBrbVdQcE02YitKUzRyN2hGUU5kY1BWVXBWeAovVGowRUFNaWsrcHpZQUxyalRLZjlHcmJkd0lEQVFBQm8xTXdVVEFkQmdOVkhRNEVGZ1FVa2RTM0JuWHNnZUtSCnVNL0hCNW9sM3lacVRvMHdId1lEVlIwakJCZ3dGb0FVa2RTM0JuWHNnZUtSdU0vSEI1b2wzeVpxVG8wd0R3WUQKVlIwVEFRSC9CQVV3QXdFQi96QU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFTZXoxQVZhNVhHVXBrNUg4THpySQp4U0VzUnRHUitSV2NJdGxMZVVLc3NPTTNzY01mUEZ6SnQyTldwd0NwSTRiY2FGQVgzeFlLR1lxVnZzVmpxbTFVCnRKYmh6dzFhUVBUT2ZvNDZlOXNGK2lxZGJpbEplRUlQZllDb0w2VXR0Rm96TC9LZ2k1eWFlSXBScTFiaHFwVjcKTVRmSm1CbHVIckZhdWNFaEFMTDJoK0tsQ1R6amJsQnBZN1hpVFZHc3JZc0V2MmF3NEh2b1pZVkZVV3IxQ1JXYgppcDB4dFZ1SXE5RFhha0ZJYWVQWlZnMHRCczVBejBzUGlpNUdUVjUzVXdmcjY4VjhBYXFRSE9yVGRQL2ZadkN3CmRXTWdKSnltc21VUis1cTJCTnJvZHlTWDd4RzZxenE0Mm5BV1ZwSlNvb0g5ZWdSYXZuZ0Q5UXRreWU5KzBuRW0KVGc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
  },
  "private_key_ctx": {
    "key_id": "config",
    "wrapped_key": "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"
  },
}
```

- The **kas_id** should match the uuid generated by the database when the key access server was registered via the **CreateKeyAccessServer** request performed in step 1. (Required)
- The **key_id** can be any name you wish to associate with the key to be created, which will show up in the manifest of the TDF. (Required)
- The **key_algorithm** is the specific cipher bit/shape of the key and can be one of the following: (Required)

| Key Algorithm  | `alg` Value |
| -------------- | ----------- |
| `rsa:2048`     | 1           |
| `rsa:4096`     | 2           |
| `ec:secp256r1` | 3           |
| `ec:secp384r1` | 4           |
| `ec:secp521r1` | 5           |

- The **key_mode** basically tells the KAS during a rewrap where to expect the key so that it can perform a decryption. Available modes are: (Required)
  
| Key Mode                     | `mode` Value | Description                                                                                             |
| ---------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `KEY_MODE_CONFIG_ROOT_KEY`   | 1            | The symmetric wrapping (root) key is stored with the platform configuration and the wrapped KAS key is stored in the platform database.|
| `KEY_MODE_PROVIDER_ROOT_KEY` | 2            | The symmetric wrapping (root) key is stored external to the platform using a KMS or HSM interface. The wrapped KAS key is stored in the platform's database.|
| `KEY_MODE_REMOTE`            | 3            | The private portion of the asymmetric key is stored external to the platform using a KMS or HSM interface. This is also referred to as `STRICT_MODE`. No symmetric (root) key is required here. |
| `KEY_MODE_PUBLIC_KEY_ONLY`   | 4            | No private key information is stored. This is used when importing another org's policy information.|

- The **public_key_ctx** holds the public key for the asymmetric key pair. (Required)
- The **private_key_ctx** holds the encrypted private key and a **key_id** specific to the symmetric key that is wrapping the private key. For keys of mode **KEY_MODE_REMOTE**, the **key_id** within private_key_ctx is used for identifying the remote private key. Our [key managers](./key_managers.md) use the **key_id** field present within the private_key_ctx when making requests to your external KMS/HSM instead of the **key_id** field at the root of the object. We do this to allow for larger key identifiers, which might be necessary for external providers. (Ex: arns with AWS)

:::important
Wrapped_Key is only required for KEY_MODE_CONFIG_ROOT_KEY and KEY_MODE_PROVIDER_ROOT_KEY.
Key_Id is required for all key modes except KEY_MODE_PUBLIC_KEY_ONLY
:::

:::note
You can also specify metadata for the key via a common metadata structure, but that is not covered here.
:::

The above JSON request covers registering a key where the asymmetric key pair will be stored within the platform's database, and the expected symmetric key that decrypts the private key will be stored within KAS. What if you want to only store a reference to a key and have that reference point to a key elsewhere? Say for a KMS, for example. That's where **KEY_MODE_REMOTE** is handy.

```json5
{
  "kas_id": "db740f79-cf85-41b2-a27f-663b0e2b169b",
  "key_id": "aws-key-1",
  "key_algorithm": 1,
  "key_mode": 3,
  "public_key_ctx": {
    "pem": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvVENDQWVXZ0F3SUJBZ0lVRjA5QWpIallJOENSekVGSmpjVEREY2lkZEgwd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0RqRU1NQW9HQTFVRUF3d0RhMkZ6TUI0WERUSTBNRFV3TmpFeU1UQXhNbG9YRFRJMU1EVXdOakV5TVRBeApNbG93RGpFTU1Bb0dBMVVFQXd3RGEyRnpNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDCkFRRUFsVEI5eks3dzF1MG1mOWI5bmg4U3p0K0t5ZFdvbjUyUDVNY2k4Z1YremFQWjlmM0picllHVWZWWG16RmEKbVErTjBmTjZRaDhVOWlzbzFPZ3VHWDB1eTRwV1k3em1XTXFtRjVpSk9INENBdTVnV2Vuc3I5R2FXM1lmeEtWRgpWUnpKcUx0U3pBT3lvQ0lhNVErSTJUdmdNeEZjSFYwSGN4OXU5ekdYdDdKNUdlV1pTM3I2OUg4MGRGUjdGc0lRCk1hTDZRUHhmUWNWOVJidW9weUFwOE43TktiU3p4OEZUZEJYUWE4QnVxTXNvNlZyK0crZC9oeVp6YlpVc1pEUzQKZ3RtNnJCQlUraE8zMEN6WnBaZHBETVNPdjljNGNZUXlpdElwRjBrbVdQcE02YitKUzRyN2hGUU5kY1BWVXBWeAovVGowRUFNaWsrcHpZQUxyalRLZjlHcmJkd0lEQVFBQm8xTXdVVEFkQmdOVkhRNEVGZ1FVa2RTM0JuWHNnZUtSCnVNL0hCNW9sM3lacVRvMHdId1lEVlIwakJCZ3dGb0FVa2RTM0JuWHNnZUtSdU0vSEI1b2wzeVpxVG8wd0R3WUQKVlIwVEFRSC9CQVV3QXdFQi96QU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFTZXoxQVZhNVhHVXBrNUg4THpySQp4U0VzUnRHUitSV2NJdGxMZVVLc3NPTTNzY01mUEZ6SnQyTldwd0NwSTRiY2FGQVgzeFlLR1lxVnZzVmpxbTFVCnRKYmh6dzFhUVBUT2ZvNDZlOXNGK2lxZGJpbEplRUlQZllDb0w2VXR0Rm96TC9LZ2k1eWFlSXBScTFiaHFwVjcKTVRmSm1CbHVIckZhdWNFaEFMTDJoK0tsQ1R6amJsQnBZN1hpVFZHc3JZc0V2MmF3NEh2b1pZVkZVV3IxQ1JXYgppcDB4dFZ1SXE5RFhha0ZJYWVQWlZnMHRCczVBejBzUGlpNUdUVjUzVXdmcjY4VjhBYXFRSE9yVGRQL2ZadkN3CmRXTWdKSnltc21VUis1cTJCTnJvZHlTWDd4RzZxenE0Mm5BV1ZwSlNvb0g5ZWdSYXZuZ0Q5UXRreWU5KzBuRW0KVGc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
  },
  "private_key_ctx": {
    "key_id": "arn:aws:kms:REGION:ACCOUNT-ID:key/KEY-ID",
  },
  "provider_config_id": "948e8167-6f32-4eee-89b7-f0cd42ce70ea"
}
```

The above is a valid request for registering a key with the platform where the private key is stored externally from the platform. The difference between the two requests is:

- The **wrapped_key** should not be within the **private_key_ctx**, in addition a provider configuration has been registered with the system. See details on [provider configuration](./key_managers.md#provider-configurations). In small detail, adding a provider configuration reference to a key tells KAS what [key manager](./key_managers.md) should be used to complete a rewrap operation.

## Assigning Key Mappings (Optional, but recommended)

Follow the [key mapping](./key_mappings.md) guide for creating mappings.

## Setting base key (Optional, but recommended)

Follow the [base key setup](./base_key.md) guide for setting a base key.

## Important additional comments

1. As of version 0.7.0 of the OpenTDF platform, there is no way to delete a key. If you would like to deactivate a key, use the **RotateKey** rpc.
2. When creating a key of mode **KEY_MODE_CONFIG_ROOT_KEY** the **wrapped_key** is expected to be base64 encoded.
