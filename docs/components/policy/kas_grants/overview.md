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
> KAS grants determine keys used during encrypt to decide how key content will be secured with KASes,
> so be aware that changes to attribute interpretation or changes to grants will result in different key wrap strategies.

### Split Scenarios

#### AnyOf Split

`Bob` and `Alice` want to share data equally, but maintain their ability to decrypt the data without sharing each other’s private keys.

With KAS Grants, they can define a key split where the shared data is wrapped with both of their public keys and AnyOf logic, meaning that each partner could decrypt the data with just one of those keys.

If `Bob` assigns a grant between Bob's running/registered KAS to a known attribute value, and `Alice` defines a grant of Alice's running/registered KAS to the same attribute value,
any data encrypted in a TDF will be decryptable with a key released by _either_ of their Key Access Servers.

Attribute A: `https://conglomerate.com/attr/organization/value/acmeco`

Attribute B: `https://conglomerate.com/attr/organization/value/example_inc`

| Attribute | Namespace        | Definition   | Value       |
| --------- | ---------------- | ------------ | ----------- |
| A         | conglomerate.com | organization | acmeco      |
| B         | conglomerate.com | organization | example_inc |

**Attribute KAS Grant Scenarios**

1. Bob & Alice represent individual KAS Grants to attributes on TDFd data
2. Note that the attributes A and B are of _the same definition and namespace_

| Definition: organization | Value: acmeco | Value: example_inc | Split |
| ------------------------ | ------------- | ------------------ | ----- |
| Bob, Alice               | -             | -                  | OR    |
| -                        | Bob, Alice    | -                  | OR    |
| -                        | -             | Bob, Alice         | OR    |
| -                        | Bob           | Alice              | OR    |

#### AllOf Split

Unlike the `AnyOf` split above, this time `Bob` and `Alice` want to make sure _both_ of their keys must be granted for data in a TDF
to be decrypted. With KAS Grants, they can define a key split where the shared data is wrapped with both of their public keys and
AllOf logic, meaning that neither partner can decrypt the data with just one of those keys.

To accomplish this, they each define KAS Grants between their KASes and policy attributes, and TDF data with at least two attributes -
one assigned a KAS Grant to Bob's KAS and another assigned a KAS Grant to Alice's KAS.

Both KASes will need to permit access and release payload keys for the data TDFd with multiple attributes assigned KAS Grants to be accessible and decrypted.

Attribute A: `https://conglomerate.com/attr/organization/value/acmeco`

Attribute B: `https://conglomerate.com/attr/department/value/sales`

| Attribute | Namespace        | Definition   | Value     |
| --------- | ---------------- | ------------ | --------- |
| A         | conglomerate.com | organization | acmeco    |
| A         | conglomerate.com | department   | marketing |

**Attribute KAS Grant Scenarios**

1. Bob & Alice represent individual KAS Grants to attributes on TDFd data
2. Note that the attributes A and B are of _the same namespace but different definitions_

| Definition: A | Value: A | Definition: B | Value: B | Split |
| ------------- | -------- | ------------- | -------- | ----- |
| Bob           | -        | Alice         | -        | AND   |
| Bob           | -        | -             | Alice    | AND   |
| -             | Bob      | -             | Alice    | AND   |

> [!NOTE]
> Any KAS Grants to attributes of different definitions or namespaces will be `AND` splits.
