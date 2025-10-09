# Key Access Registry

The Key Access Server (KAS) Registry within the platform policy is a store of known Key Access Servers.

Within platform policy, a registered KAS instance has the following key attributes:

1. **URI**: The location where the KAS is accessible. This must be unique among all KAS instances registered in the platform.
2. **Keys**: Each KAS can have multiple keys associated with it. These keys are used to encrypt and decrypt TDFs.

## Base Key

A KAS can have a base key, which is the default key that is used for encryption. If no other key is specified, the base key will be used.

## Key Mappings

Keys can be mapped to namespaces, attribute definitions, and attribute values. When an SDK client creates a TDF with an attribute that has a mapped key, the client will use the mapped key to encrypt the payload.