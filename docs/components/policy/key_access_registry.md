# Key Access Registry

The Key Access Server (KAS) Registry within the platform policy is a store of known Key Access Servers.

Within platform policy, a registered KAS instance has the following key attributes:

1. **URI**: The location where the KAS is accessible. This must be unique among all KAS instances registered in the platform.
2. **Source Type**: Indicates whether the KAS is managed by the organization or imported from an external party. (Defaults to unspecified)
3. **Name**: A friendly name for the registered KAS. (Optional)

:::important
**PublicKey** is deprecated and no longer used as of `v0.7.0` of service. Instead, import public keys with [key management](./keymanagement/quickstart.md).
The ability to assign grants was deprecated in [v0.7.0 of service](https://github.com/opentdf/platform/releases/tag/service%2Fv0.7.0),
in favor of [key mappings](./keymanagement/key_mappings.md).
:::
