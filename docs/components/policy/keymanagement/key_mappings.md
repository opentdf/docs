---
sidebar_position: 1
slug: /components/policy/keymanagement/key_mappings
---

# Key mappings

>[!IMPORTANT]
>As of v0.5.0 of the SDK it will prefer key mappings over
>grants. Meaning if a key mapping shows up for an attribute
>We will use the mapping and not the grant.
>You **should** migrate all grants over to mappings in one
>sitting

>[!IMPORTANT]
>As of v0.7.0 of the Opentdf platform, you can no longer
>assign grants.

Key mappings are now the replacement for key access server grants. The idea for mapping a key to an attribute definition/value/namespace is the same as grants, except now we separate the keys from key access servers. Previously an admin was expected to add a key directly to the KeyAccessServer object, as either **remote** or **cached**, and then assign a key access server to an attribute. That process is known as a grant. Now users should create a key, and assign that key to an attribute.

## How do I create a key mapping

>[!NOTE]
>The following example only shows how to create a mapping for
>attribute definitions, you can also create mappings for namespaces
>and attribute values.

1. First you will need to [create a key access server](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L630)
2. Next, you will need to [create a key](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L644)
3. [create an attribute](https://github.com/opentdf/platform/blob/main/service/policy/attributes/attributes.proto#L415)
4. [assign a key to an attribute](https://github.com/opentdf/platform/blob/main/service/policy/attributes/attributes.proto#L457)

Now you have successfully created key mapping.
