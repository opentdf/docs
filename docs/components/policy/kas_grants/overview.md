# Overview

Key Access Grants are associations between a registered KAS (see KAS Registry docs) and an Attribute.

An attribute can be assigned a KAS Grant on its namespace, its definition, or any one of its values.

Grants enable varied key split behaviors on TDFs with attributes, which can be useful for collaboration with shared policy.

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
