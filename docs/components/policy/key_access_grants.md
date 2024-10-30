# Key Access Grants

Key Access Grants (KAS Grants) are associations between a registered Key Access Server (KAS) and an Attribute. These grants can be applied at the namespace, definition, or value level of an attribute.

KAS Grants enable key split behaviors on TDFs with attributes, facilitating various collaboration scenarios around shared policies. Grants follow the specificity matrix below, which determines the KAS public keys used for encryption in various KAS grant scenarios:

| Namespace KAS Grant | Attribute Definition KAS Grant | Attribute Value KAS Grant | Granted Data Encryption Key Utilized in Split |
| ------------------- | ------------------------- | -------------------- | --------------------------------------------- |
| yes                 | no                        | no                   | namespace                                     |
| yes                 | yes                       | no                   | attribute definition                          |
| no                  | yes                       | no                   | attribute definition                          |
| yes                 | yes                       | yes                  | value                                         |
| no                  | yes                       | yes                  | value                                         |
| no                  | no                        | yes                  | value                                         |
| no                  | no                        | no                   | default KAS/platform key                      |

A KAS Grant in platform policy is straightforward, consisting of the attribute object ID (Namespace, Definition, Value) and the KAS Registry ID.

> [!NOTE]
> KAS Grants determine which keys are used during encryption and decryption based on the specific attributes of the TDF.

## Collaboration Scenarios

### AnyOf Split

In an `AnyOf` split, multiple KAS Grants allow access if any one of the grants matches the attributes assigned. For example, if Bob and Alice want access to data encrypted with their respective public keys, either Bob's or Alice's key can be used to unlock the shared data.

| Definition: A | Value: A | Definition: B | Value: B | Split |
| ------------- | -------- | ------------- | -------- | ----- |
| Bob, Alice    | -        | -             | -        | OR    |
| Bob, Alice    | -        | Bob, Alice    | -        | OR    |
| -             | Bob      | Alice         | -        | OR    |
| -             | -        | Bob, Alice    | OR       |

### AllOf Split

In contrast to the `AnyOf` split, the `AllOf` split requires that _both_ keys be present to decrypt the data. Bob and Alice can define KAS Grants such that data is encrypted with both of their public keys, ensuring that neither can decrypt the data independently.

In this scenario, both Bob's and Alice's KAS must release the payload keys for the TDF, as the data is encrypted with attributes assigned KAS Grants to both KAS instances.

Example attributes:

- Attribute A: `https://conglomerate.com/attr/organization/value/acmeco`
- Attribute B: `https://conglomerate.com/attr/department/value/marketing`


| Attribute | Namespace          | Definition     | Value     |
| --------- | ----------------   | ------------   | --------- |
| A         | `conglomerate.com` | `organization` | `acmeco`    |
| B         | `conglomerate.com` | `department`   | `marketing` |

**Attribute KAS Grant Scenarios:**

1. Bob and Alice represent individual KAS Grants on data protected with TDF.
2. Attributes A and B are in the same namespace but have different definitions.

| Definition: A | Value: A | Definition: B | Value: B | Split |
| ------------- | -------- | ------------- | -------- | ----- |
| Bob           | -        | Alice         | -        | AND   |
| Bob           | -        | -             | Alice    | AND   |
| -             | Bob      | -             | Alice    | AND   |

> [!NOTE]
> Any KAS Grants on attributes of different definitions or namespaces will use `AND` splits.
