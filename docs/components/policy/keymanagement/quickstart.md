---
sidebar_position: 1
slug: /components/policy/keymanagement/quickstart
---

# Quickstart for using the new key management architecture

>[!IMPORTANT]
>This quickstart is meant to aid users trying to test the new key management
>features, by standing up a new platform. This quickstart is not meant as a
>migration guide.

Below is a guide to setting up platform to use the new key management features.

Checklist:

>[!IMPORTANT]
>You can spin KAS up without activating the key management features.
>This gives you time to create or migrate keys to the platform
>before KAS expects keys to come from the platform, which would
>be helpful for migrations.

1. Key management is activated for KAS.
2. A key has been created.
3. Assign key mappings. (optional, but recommended)
4. Base Key is set (optional, but recommended)

## Key management is activated for KAS

- To activate key management for KAS you will need to modify the **key_management** field within the opentdf.yaml file to be true. [opentdf-dev.yaml](https://github.com/opentdf/platform/blob/main/opentdf-dev.yaml#L24).
- You will also need to set a root key to be used with the basic manager. The root key should be 32 bytes long.
  - In addition, the root key should be hex encoded.

## Creating a key

>[!NOTE]
>You can also perform all key commands with the [OpenTDF CLI](https://github.com/opentdf/otdfctl)

1. You will want to have already created and registered a **Key Access Server** with the platform via the [Create Key Access Server Endpoint](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L630).
2. Once you have a **Key Access Server** registered you will then want to create a key for that registered KAS.

The definition for creating a key can be found in the key_access_registry [proto](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L399-L421).

Let's look at a valid request and dissect it:

>[!NOTE]
>These keys can be found within the [policy_fixtures.yaml](https://github.com/opentdf/platform/blob/main/service/internal/fixtures/policy_fixtures.yaml#L541) file located
>in opentdf.

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
    "wrapped_key": "eyAid3JhcHBlZEtleSI6ICJsY2JxNjgyR3NpaStqRWtRNjJzV0lYa1dXVkpqZ1dQdXZobUJ0OUtpWUZKL28zWENseVJkNGMwS0RGdHVvaGRCdzJqdlZHd2VGZnNwaTllV0dNSXpFbDZiY0VSYzUycTVIdmlINWtjVDlSY25KaFV2M2lONjM1UndIek52akdFVktLVU5CdjRwZkVOMzB3N29wSFBpZ3owS1ExVkJNSk5PM1lEOUZWQTdVb0h4MGVKY0Y3WlFKSkdYeHdwUVYwTXR3bHFtUnBxNFEyVTl2cFlyajY3ODdRSEdmOWhlZ0lYTkErcjByM1RDTHB3YzVZM0E5aEhreWp3N1FnWEU4dWVKSUx1TW04N0NlckpweVpPQ3NySDN2QWppWUFWdjcvZEVKcWpYMUFnYUI4NFQ3aHhERmVqOUpLaEl5OWVLWk5yTndNWW1Bc0hwYkEzamc1R0VIQjdFM2ZYRXFoaTFTTllhR1ZpZHRvSnVTLzNrVm5JTEtOWTZpZnRvNllMTEJBdWlQQVJjNTZVblVTS0hZQ1dtTko3QkM4Y0hhN2FIdDllUW1lVVRicVZmMGg3aDQ2M3FZQ2F6RDhYT0FMUTBuQ3lPQ3I5dUxkV1o1QThLbHFmMytqKzcyOGtaYUJFN2tKZ1I1UFh0dDFMTHlYcThmSEhPRXNOWXMzT3RSOGN3akV1ZGpvVVRJMTd1YkJOYjhYZU01emFaL1dmdWZDcWp2UGVjREt6cHJVbzdlanBrZjZKOEJ0RStZSFZRSjdNMWJWb1ZlQ0tFTWUvK3p5Y2Zpc3BzbmZsQ1ZtNkJNdFlMdmtVLzIzRWRiOWNNN1BRR3lFTEZOeDMyQXRwUXpMRUUrNWVaWWFhUU5Za3hEaWF0c3ZkMkQyNEVSTVhmWGp1YWg4MTBOSVpUZTE4cStGMitZMEtuTU9LZHpqV3AyUXdvNHVIb3JidndRRkwzOXZrVHJmZTIzelhVY2Q2N1pCTmpJUUNGc0prOW5sRk9ORjhrc25XVzQ5aHdxSjk1dXJtaG5zSGRSZlBrbVc2SHZ0UnVTclN3L2VmOGZ0MUZmMlZGMUNKUXArSnc2YnpKWmRQSzdsTmxmN1F3N2trREtqSGxnTTVnanZlZVJXZjE5Q3FqaTdHM1FhSS9Oa3FDdEplWllLZmZGU1RtbStIY3o0bXpMQkpzc3hNdGgvUkRaQzVTaVVJODJhZ0h0QkJ5VC9DK3A2NEE3cjZGeFNvdmRNTi9mTU5ZSUx3NGRQV3VxdDZwNmVnTUlyMFNVYXBpUHJpTjBiRjNaN2d5R1QxQXZyMHVnaU9qQUI3L3pybDJHaWFlajFUV01YS08zd2J4L0VzUVdpMDNWcmxWanBIdjl2Y2hlWjdGTzliREJUUkxKZHI0QkU4RWs0YkZCaytxRkZOQXZXcC9GZDFiNnFiKytEdU5Iajg1V2R3WE1PaW9nNUlSSzdjZUlNT0xQY214TnE3YXh5WnkrTm0yQ2VocjN5Qk9OQzFQRml4U2NMSGJZUEJlTU9EaGJHWXo5NEVaYkxHOWJpL1B5RkJiNERYSGlLemxrNEtTZ3BYZ1FLUHBSRWx6aUNiYVB3WlowZVljUEhoaktVNHQ3a2k3TlR2MlFYVU1nK3V2dVZWajJtcGpSMTJ5bmJiS2xJNDJoUEcxYW1FV0JlM1JjNmZ4cW5uQnVScnlMWjdEYW5wa252V0t5UXE3S1pHSHJGemlaMEE3Q1VSejFnT2R4d2xDQXEvRnAxZ2oxMGpNMFpJK3lod1RGcnhCUDJXdHF1S1dBREhGMHBGblNWdUpKUnlzUFR2aXNSYVM1N3d2aVZZQnRCcnRGYmZhTHBGcytwQ2ViYk81K0dRZ29wWlZaSDM5c0lnY0dIY3B4RU1zdDBCd3JuUGZIM0RRbGJqVmdrWlFmNkJiZUpDNWFBL2tEVTVSZFNiUTI1NjNCcGRMRUREQ3dvaVU5NW5LcE1tOE8zVTIxMEdRMHgveFdFYUMxdDJkOVM2RlVFbFRVSlJYWVZNZVB2Z3JaMnZGajl5YTZvNm5LVWt4RXAyaUlkS2d1ckR4MEVNSHZ2NU90TEZYTnVXWVdIU0o3czNET3JWNjZxUXRYaHF6VUlsRjRHWERVYUpmZ3NtUTk0MU03eUFqL3RibjBHUGFkMENsRXZWd25ucGpnNEpoZ2Y1dlpCaC9TcG5Na2hia1RIQis0ajhrT1dFTHdWc2ZDU3RTa0ZGdHAxY1VtRVI5RWhqSzhjSmJ3L2FKVTU5ZkZmZDJXR0N6VUxIZkEyMURLcld6SWwzODhray94cXdUN1E5aU92Y1NSN1pzdE10R1RRWG54Q1gvV3A4VG9qNjRIM2RsR2p6TGhGeDZ1Qk53WFQxMTRSeGw4ZWZLdW9VZzd0ZHcxcVdtOUplUC92TVF6VTlLd2Z5SExLNmdDQUlmWkpneVkrcnVyN0YrZVNPRUlEeWlkRnJLM1NWTFE3T1lHRmVXaFRNS01HdzdaV2VuTC9xWDdBUFErdkdoMmpQNTJVN2VsT0t4L1RsTkZ5UHJHL2FZUDN0MDRTdWVZUkd2RXAremZkVU0xbmYvN3YvRHhzc1VSS29zQUdHa1JwbzBLQ3NUU0I4UzhxdTlNKzA3YjBSREVXai9QdHVrZWdvRUR1KzZ4azN0WmRqclpWTTIxZURDaDhxME9HbS9KeDBITWVlUHFIY28zeEdTMUpYMW90QVp3UEhaaUkyaWNjWksrV21KTExaSXJYSzRsSG8vd1lpQitOeUlwZDJWd2dTdXZua3hhTlF5dmxtdWtSaTJCTzM1ZEdDNVFaY1V5d2lCZlRoSzdzRC9CMjJHNDZlUVNHeTdqeTlJSmJaMXhNKzVHcXVxOTdPOCtWOVIreEcydW1ZN0grWG90NlBaRjVPT0hERmI2cEVUSThsNDJDdDV2bElJMmRmWXFqZWR6WHAvb1drdXFub2FQejNnUU4wS2JGaDlsazZvVXVJMWlMaHBDMWxIR283em8xV3E0NDFlUW9nS3dhWFNDcGxQNDE0UW44dFE0elcvRTdjZ2hLbnpWMTg1K2lHdXBxTnNoWTBlS1VtSzB2Rkx3dkcrdnc9PSIsICJrZXlfaWQiOiAiY29uZmlnIiB9"
  },
}
```

- The **kas_id** should match the uuid generated by the database when the key access server was registered via the **CreateKeyAccessServer** request performed in step 1. (Required)
- The **key_id** can be any name you wish to associate with the key to be created, which will show up in the manifest of the TDF. (Required)
- The **key_algorithm** is the specific cipher bit/shape of the key and can be one of the following: (Required)

| Key Algorithm     | `alg` Value |
| ----------------- | ----------- |
| `rsa:2048`        | 1           |
| `rsa:4096`        | 2           |
| `ec:secp256r1`    | 3           |
| `ec:secp384r1`    | 4           |
| `ec:secp521r1`    | 5           |

- The **key_mode** basically tells the KAS during a rewrap where to expect the key so that it can perform a decryption. Available modes are: (Required)
  
| Key Mode                          | `mode` Value | Description |
| --------------------------------- | ------------ | ----------- |
| `KEY_MODE_CONFIG_ROOT_KEY`        | 1            | Root Key is stored within the platform's database and the symmetric wrapping key is stored in KAS |
| `KEY_MODE_PROVIDER_ROOT_KEY`      | 2            | Root Key is stored within the platform's database and the symmetric wrapping key is stored externally |
| `KEY_MODE_REMOTE`                 | 3            | Root Key and wrapping key are stored remotely |
| `KEY_MODE_PUBLIC_KEY_ONLY`        | 4            | Root Key and wrapping key are stored remotely. Use this when importing another org's policy information |

- The **public_key_ctx** holds the public key for the asymmetric key pair. (Required)
- The **private_key_ctx** holds the encrypted private key and a **key_id** specific to the symmetric key that is wrapping that key.

>[!IMPORTANT]
>Wrapped_Key is only required for KEY_MODE_CONFIG_ROOT_KEY and KEY_MODE_PROVIDER_ROOT_KEY.
>Key_Id is required for all key modes except KEY_MODE_PUBLIC_KEY_ONLY

>[!NOTE]
>You can also specify metadata for the key via a common metadata structure, but that is not covered here.

The above JSON request covers registering a key where the asymmetric key pair will be stored within the platform's database, and the expected symmetric key that decrypts the private key will be stored within KAS. What if you want to only store a reference to a key and have that reference point to a key elsewhere? Say for a KMS, for example. That's where the key mode **KEY_MODE_REMOTE** is handy.

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
    "key_id": "aws-wrapping-key-1",
  },
  "provider_config_id": "948e8167-6f32-4eee-89b7-f0cd42ce70ea"
}
```

The above is a valid request for registering a key with platform where the private key, and symmetric key that wraps the private key, is stored outside of the platform. The difference between the two requests is:

- The **wrapped_key** should not be within the **private_key_ctx**, in addition a provider configuration has been registered with the system. See details on [provider configuration](./key_managers.md#provider-configurations). In small detail, adding a provider configuration reference to a key tells KAS what [manager](./key_managers.md) should be used to complete a rewrap operation.

## Assigning Key Mappings (Optional, but recommended)

Follow the [key mapping](./key_mappings.md) guide for creating mappings.

## Setting base key (Optional, but recommended)

Follow the [base key setup](./base_key.md) guide for setting a base key.

## Important additional comments

1. As of version 0.7.0 of the OpenTDF platform, there is no way to delete a key. If you would like to deactivate a key, use the **RotateKey** rpc.
2. When creating a key of mode **KEY_MODE_CONFIG_ROOT_KE** the **wrapped_key** is expected to be base64 encoded.
