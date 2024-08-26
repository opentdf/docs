# Overview

Key Access Grants are associations between a registered KAS (see KAS Registry docs) and an Attribute.

An attribute can be assigned a KAS Grant on its namespace, its definition, or any one of its values.

Grants enable key split behaviors on TDFs with attributes, which can be useful for various collaboration scenarios around shared policy.

> [!WARNING]
> KAS Grants are considered experimental, as grants to namespaces are not fully utilized within encrypt/decrypt flows at present.

When fully implemented, KAS Grants will follow the specifity matrix below, which answers the question: "Which KAS public keys
should be utilized to encrypt in the following attribute KAS grant scenarios?"

| Namespace KAS Grant | Attr Definition KAS Grant | Attr Value KAS Grant | Granted Data Encryption Key Utilized in Split |
| ------------------- | ------------------------- | -------------------- | --------------------------------------------- |
| yes                 | no                        | no                   | namespace                                     |
| yes                 | yes                       | no                   | attr definition                               |
| no                  | yes                       | no                   | attr definition                               |
| yes                 | yes                       | yes                  | value                                         |
| no                  | yes                       | yes                  | value                                         |
| no                  | no                        | yes                  | value                                         |
| no                  | no                        | no                   | default KAS/platform key                      |

The Grant itself within platform policy is simple, comprised of just the attribute object ID (Namespace, Definition, Value) and the KAS Registry ID.

> [!NOTE]
> As KAS grants determine keys utilized on encrypt/decrypt, be careful around existing TDFs with attributes and new grants with different keys.

### Split Scenarios

#### AnyOf Split

`Bob` and `Alice` want to share data equally, but maintain their ability to decrypt the data without sharing each other’s private keys.

With KAS Grants, they can define a key split where the shared data is wrapped with both organization’s public keys with an AnyOf rule, meaning that each partner could decrypt the data with just one of those keys.

If `Bob` assigns a grant between Bob's running/registered KAS to a known attribute value, and `Alice` defines a grant of Alice's running/registered KAS to the same attribute value,
any data encrypted in a TDF will be decryptable with a key released by _either_ of their Key Access Servers.

#### AllOf Split

Unlike the `AnyOf` split above, this time `Bob` and `Alice` want to make sure _both_ of their keys must be granted for data in a TDF to be decrypted.

To accomplish this, they each define KAS Grants between their KASes and policy attributes, and TDF data with at least two attributes - one assigned a KAS Grant to Bob's KAS and
another assigned a KAS Grant to Alice's KAS.

Both KASes will need to permit access and release payload keys for the data TDFd with multiple attributes assigned KAS Grants to be accessible and decrypted.
