---
sidebar_position: 1
slug: /components/policy/keymanagement/base_key
---

# Base Key

A base key, or default key, is a key that will be used when no grants or key mappings are found from the attributes passed in. Base keys are set by an admin for the purpose of ensuring that insecure keys are not used by default when no mappings/grants are found.

## How to get/set a base key

>[!IMPORTANT]
>You must have admin permission to use any key operations.

When using the [kas-registry proto](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L659-L662) and an active connection to the platform you can use the above base key rpcs to set and retrieve the base key.

[opencli base key](https://github.com/opentdf/otdfctl/tree/main/docs/man/policy/kas-registry/key/base) provides documentation on how to set / get base keys with opentdf's cli.

## Effects of using base key

1. When a base key is specified the SDK will prefer to use it over passed the passed in kas info list. The SDK will **overwrite** the following information if a base key is registered with the platform:
   1. The passed in kas information list
   2. The key algorithm
2. If a base key is not present, the SDK will fallback to using the passed in kas information list and key algorithm.
3. If the base key is not of type ECC, it **cannot** be used with nano tdf.
