---
sidebar_position: 1
slug: /components/policy/keymanagement/key_mappings
---

# Key mappings

>[!IMPORTANT]
>v0.5.0 of the SDK will prefer key mappings over
>grants. Meaning if a key mapping shows up for an attribute
>the SDK will use the mapping and not the grant.
>You **should** migrate all grants over to mappings in one
>sitting

>[!IMPORTANT]
>As of v0.7.0 of the OpenTDF platform,
>grants can no longer be assigned.

Key mappings are now the replacement for key access server grants. The idea for mapping a key to an attribute definition/value/namespace is the same as grants, except now we separate the keys from key access servers. Previously an admin was expected to add a key directly to the KeyAccessServer object, as either **remote** or **cached**, and then assign a key access server to an attribute. That process is known as a grant. Now users should create a key, and assign that key to an attribute.

## How do I create a key mapping

>[!NOTE]
>The following example only shows how to create a mapping for
>attribute definitions, you can also create mappings for namespaces
>and attribute values.

1. First you will need to [create a key access server](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L630)

OpenTDF CLI

```bash
otdfctl policy kas-registry create --uri http://example.com/kas --name example-kas
```

2. Next, you will need to [create a key](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L644)

OpenTDF CLI

```bash
otdfctl key create --key-id "rsa-key-1" --algorithm "rsa:2048" --mode "local" --kas "891cfe85-b381-4f85-9699-5f7dbfe2a9ab" --wrapping-key-id "virtru-stored-key" --wrapping-key "a8c4824daafcfa38ed0d13002e92b08720e6c4fcee67d52e954c1a6e045907d1"
```

3. [create a namespace](https://github.com/opentdf/platform/blob/main/service/policy/namespaces/namespaces.proto#L180)

OpenTDF CLI

```bash
otdfctl policy attributes namespaces create --name opentdf.io
```

4. [create an attribute](https://github.com/opentdf/platform/blob/main/service/policy/attributes/attributes.proto#L415)

OpenTDF CLI

```bash
otdfctl policy attributes create --namespace 3d25d33e-2469-4990-a9ed-fdd13ce74436 --name myattribute --rule ANY_OF
```

5. [assign a key to an attribute](https://github.com/opentdf/platform/blob/main/service/policy/attributes/attributes.proto#L457)

OpenTDF CLI

```bash
otdfctl policy attributes key assign --attribute 3d25d33e-2469-4990-a9ed-fdd13ce74436 --key-id 8f7e6d5c-4b3a-2d1e-9f8d-7c6b5a432f1d
```

Now you have successfully created a key mapping.
