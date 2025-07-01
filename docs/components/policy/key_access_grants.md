# Key Access Grants

:::caution
In v0.7.0 of the platform creating grants is now deprecated in favor of
[key mappings](./keymanagement/key_mappings.md). Version 0.7.0 of the platform
will error when attempting to assign key access servers to attributes. 
:::
Key Access Grants (KAS Grants) are associations between a registered Key Access Server (KAS) and an Attribute. These grants can be applied at the namespace, definition, or value level of an attribute.

KAS Grants enable key split behaviors on TDFs with attributes, facilitating various collaboration scenarios around shared policies. Grants follow the specificity matrix below, which determines the KAS public keys used for encryption in various KAS grant scenarios:

| Namespace KAS Grant | Attribute Definition KAS Grant | Attribute Value KAS Grant | Granted Data Encryption Key Utilized in Split |
| ------------------- | ------------------------------ | ------------------------- | --------------------------------------------- |
| yes                 | no                             | no                        | namespace                                     |
| yes                 | yes                            | no                        | attribute definition                          |
| no                  | yes                            | no                        | attribute definition                          |
| yes                 | yes                            | yes                       | value                                         |
| no                  | yes                            | yes                       | value                                         |
| no                  | no                             | yes                       | value                                         |
| no                  | no                             | no                        | default KAS/platform key                      |

A KAS Grant in platform policy is straightforward, consisting of the attribute object ID (Namespace, Definition, Value) and the KAS Registry ID.

:::note
KAS Grants determine which keys are used during encryption and decryption based on the specific attributes of the TDF.
:::

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


| Attribute | Namespace          | Definition     | Value       |
| --------- | ------------------ | -------------- | ----------- |
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

:::note
Any KAS Grants on attributes of different definitions or namespaces will use `AND` splits.
:::
## Migration to Key Mappings

This section outlines the process for migrating from the legacy KAS grant system to the new key mapping system.

:::warning
**Important:** Once the first key mapping is created, all new encryption operations will start using key mappings instead of grants.
:::

### Step 1: Create New KAS Keys for Existing Grants

The first step is to create new keys for each existing KAS. Before the introduction of the new key management functionality, a KAS was associated with either a `Remote` or `Cached` public key.

-   **Remote Key Example:**
    ```json
    "public_key": {
      "PublicKey": {
        "Remote": "https://kas1.com:8080"
      }
    }
    ```
-   **Cached Key Example:**
    ```json
    "public_key": {
      "PublicKey": {
        "Cached": {
          "keys": [
            {
              "pem": "-----BEGIN CERTIFICATE-----\nMIIBzzCCAXWgAwIBAgIUORuV3avU9AE6zsB6ZxyllHpi5d4wCgYIKoZIzj0EAwIw\nPTELMAkGA1UEBhMCdXMxCzAJBgNVBAgMAmN0MSEwHwYDVQQKDBhJbnRlcm5ldCBX\naWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAyMTY1NjU2WhcNMjUwMTAxMTY1NjU2WjA9\nMQswCQYDVQQGEwJ1czELMAkGA1UECAwCY3QxITAfBgNVBAoMGEludGVybmV0IFdp\nZGdpdHMgUHR5IEx0ZDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABLV9fCJHD/kc\nrXrUHQwAZx0Mc0dPvLjsJ/ojEtMMn0ROdeOx8ygxgcQTFFAxyCtBuadhAdm/iVHt\n8g2EMz5dO3WjUzBRMB0GA1UdDgQWBBQYNkuk+JIuRWyn+bE8sBhRw27OVTAfBgNV\nHSMEGDAWgBQYNkuk+JIuRWyn+bE8sBhRw27OVTAPBgNVHRMBAf8EBTADAQH/MAoG\nCCqGSM49BAMCA0gAMEUCIQCAB2jiYe8AY6MJ4ADPSQGE47+a3kWFLcGsJhoZbxtg\nUwIgcfIIuPfh4fbcv8cTi2BlI3k7sWPuAmIFVriI2d3Ux5Q=\n-----END CERTIFICATE-----",
              "kid": "r1",
              "alg": 1
            }
          ]
        }
      }
    }
    ```

#### Algorithm Mapping

Use the following table to map the integer algorithm value from a cached key to the `--algorithm` flag in `otdfctl`.

| `alg` Value | `otdfctl` Flag              |
| :---------- | :------------------------- |
| 1           | `--algorithm rsa:2048`     |
| 2           | `--algorithm rsa:4096`     |
| 5           | `--algorithm ec:secp256r1` |
| 6           | `--algorithm ec:secp384r1` |
| 7           | `--algorithm ec:secp521r1` |

The `KasPublicKeyAlgEnum` proto definition:
```proto
enum KasPublicKeyAlgEnum {
  KAS_PUBLIC_KEY_ALG_ENUM_UNSPECIFIED = 0;
  KAS_PUBLIC_KEY_ALG_ENUM_RSA_2048 = 1;
  KAS_PUBLIC_KEY_ALG_ENUM_RSA_4096 = 2;
  KAS_PUBLIC_KEY_ALG_ENUM_EC_SECP256R1 = 5;
  KAS_PUBLIC_KEY_ALG_ENUM_EC_SECP384R1 = 6;
  KAS_PUBLIC_KEY_ALG_ENUM_EC_SECP521R1 = 7;
}
```

#### Key Creation Command

Create a new key for each existing KAS grant, using the public key from the grant.

```shell
./otdfctl policy kas-registry key create \
  --kas https://kas1.com:8080 \
  --algorithm rsa:2048 \
  --mode public_key \
  --public-key-pem <base64_encoded_pem>
```

### Step 2: Migrate Grants to Key Mappings

After creating the new keys, map them to the corresponding namespaces, attribute definitions, and attribute values.

1.  **List Current KAS Grants**
    To see all existing grants, run:
    ```shell
    ./otdfctl policy kas-grants list --json
    ```

2.  **Create Key Mappings**
    For each grant, create a new key mapping using the appropriate command from the Assigning Keys to Policy Resources section.

    -   **For a Namespace Grant:**
        ```shell
        ./otdfctl policy attributes namespaces key assign --namespace https://demo.com --key-id <newly_created_key_id>
        ```

    -   **For an Attribute Definition Grant:**
        ```shell
        ./otdfctl policy attributes key assign --attribute https://demo.com/attr/key --key-id <newly_created_key_id>
        ```

    -   **For an Attribute Value Grant:**
        ```shell
        ./otdfctl policy attributes value key assign --value https://demo.com/attr/key/value/1 --key-id <newly_created_key_id>
        ```

Once all grants have been migrated to key mappings, your system will have fine-grained control over which keys are used for policy resources.