---
sidebar_position: 3
slug: /components/policy/keymanagement/key_mappings
---

# Key Mappings

:::important Grants Deprecated
**KAS Grants have been deprecated** as of platform v0.7.0 and replaced by direct key mappings.

Key mappings provide a more flexible and direct way to associate encryption keys with policy objects (namespaces, attributes, and attribute values) without the intermediate KeyAccessServer layer.
:::

Key mappings establish direct relationships between individual keys and policy objects. This replaces the legacy grant system that required intermediate KeyAccessServer associations.

## Mapping Structures

The system supports three types of key mappings:

### NamespaceKey

```protobuf
message NamespaceKey {
  string namespace_id = 1;  // UUID of the namespace
  string key_id = 2;        // UUID of the asymmetric key
}
```

### AttributeKey

```protobuf
message AttributeKey {
  string attribute_id = 1;  // UUID of the attribute definition
  string key_id = 2;        // UUID of the asymmetric key  
}
```

### ValueKey

```protobuf
message ValueKey {
  string value_id = 1;      // UUID of the attribute value
  string key_id = 2;        // UUID of the asymmetric key
}
```

## Key Mapping Storage

Key mappings are managed internally by the OpenTDF platform and accessible through the API:

- **Namespace Mappings** - Keys associated with entire namespaces
- **Attribute Mappings** - Keys associated with specific attribute definitions
- **Value Mappings** - Keys associated with specific attribute values

The platform automatically manages the relationships and provides efficient lookup mechanisms for key resolution during TDF operations.

## Managing Key Mappings

### Assign Keys to Policy Objects

**Namespace Assignment:**

```bash
# Assign key to namespace
otdfctl policy namespaces key assign \
  --namespace-id "550e8400-e29b-41d4-a716-446655440001" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"
```

**Attribute Assignment:**

```bash
# Assign key to attribute definition
otdfctl policy attributes key assign \
  --attribute-id "550e8400-e29b-41d4-a716-446655440003" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"
```

**Value Assignment:**

```bash
# Assign key to attribute value
otdfctl policy attributes value key assign \
  --value-id "550e8400-e29b-41d4-a716-446655440004" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"
```

### Remove Key Mappings

```bash
# Remove key from namespace
otdfctl policy namespaces key remove \
  --namespace-id "550e8400-e29b-41d4-a716-446655440001" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"

# Remove key from attribute
otdfctl policy attributes key remove \
  --attribute-id "550e8400-e29b-41d4-a716-446655440003" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"

# Remove key from value
otdfctl policy attributes value key remove \
  --value-id "550e8400-e29b-41d4-a716-446655440004" \
  --key-id "550e8400-e29b-41d4-a716-446655440002"
```

### List Key Mappings

```bash
# List all key mappings
otdfctl policy kas-registry key mappings list

# List mappings for a specific key
otdfctl policy kas-registry key mappings list --key-id "550e8400-e29b-41d4-a716-446655440002"

# List mappings by KAS name
otdfctl policy kas-registry key mappings list --kas-name "production-kas"
```

## Complete Workflow Example

Here's a complete example of setting up key mappings:

### 1. Register a Key Access Server

```bash
# Create the KAS registration
otdfctl policy kas-registry create \
  --uri "https://kas.example.com" \
  --name "production-kas"
```

### 2. Create an Asymmetric Key

**Local Key (CONFIG_ROOT_KEY mode):**

```bash
otdfctl policy kas-registry key create \
  --kas-id "a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  --key-id "prod-rsa-2024" \
  --algorithm "ALGORITHM_RSA_2048" \
  --key-mode "KEY_MODE_CONFIG_ROOT_KEY" \
  --public-key-pem "$(cat public_key.pem)" \
  --wrapping-key-id "root-kek-001" \
  --wrapped-key "$(base64 < wrapped_private_key.bin)"
```

**External Provider Key (PROVIDER_ROOT_KEY mode):**

```bash
# First create a provider configuration
otdfctl policy keymanagement provider-config create \
  --name "aws-kms-prod" \
  --config-json '{"region":"us-east-1","kms_key_id":"arn:aws:kms:..."}

# Then create key that references the provider
otdfctl policy kas-registry key create \
  --kas-id "a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  --key-id "prod-aws-kms-2024" \
  --algorithm "ALGORITHM_EC_P256" \
  --key-mode "KEY_MODE_PROVIDER_ROOT_KEY" \
  --public-key-pem "$(cat ec_public_key.pem)" \
  --provider-config-id "b2c3d4e5-f6a7-8901-bcde-f23456789012" \
  --wrapped-key "$(base64 < kms_wrapped_key.bin)"
```

### 3. Create Policy Objects

```bash
# Create namespace
NAMESPACE_ID=$(otdfctl policy namespaces create --name "example.com" --output json | jq -r '.namespace.id')

# Create attribute definition
ATTRIBUTE_ID=$(otdfctl policy attributes create \
  --namespace "$NAMESPACE_ID" \
  --name "classification" \
  --rule "ATTRIBUTE_RULE_TYPE_ENUM_ANY_OF" \
  --output json | jq -r '.attribute.id')

# Create attribute value
VALUE_ID=$(otdfctl policy attributes values create \
  --attribute "$ATTRIBUTE_ID" \
  --value "confidential" \
  --output json | jq -r '.value.id')
```

### 4. Assign Key to Policy Objects

```bash
# Get the key ID from creation response or list command
KEY_ID="c3d4e5f6-a7b8-9012-cdef-456789012345"

# Assign key to namespace (affects all attributes in namespace)
otdfctl policy namespaces key assign \
  --namespace-id "$NAMESPACE_ID" \
  --key-id "$KEY_ID"

# Assign key to specific attribute (overrides namespace mapping)
otdfctl policy attributes key assign \
  --attribute-id "$ATTRIBUTE_ID" \
  --key-id "$KEY_ID"

# Assign key to specific value (most specific, overrides attribute mapping)
otdfctl policy attributes value key assign \
  --value-id "$VALUE_ID" \
  --key-id "$KEY_ID"
```

## Key Mapping Behavior

### Precedence Order

When the SDK looks up keys for attributes, it follows this precedence:

1. **Attribute Value** mappings (most specific)
2. **Attribute Definition** mappings
3. **Namespace** mappings (least specific)
4. **Base Key** (fallback)

### Multiple Keys per Policy Object

- Policy objects can have multiple keys mapped to them
- The SDK will use the first active key found
- Key rotation automatically updates mappings to maintain continuity

### Automatic Mapping Management

**Key Status Tracking:**

- The `was_mapped` flag tracks whether a key has ever been assigned to a policy object
- This flag is set automatically when the first mapping is created
- Used for lifecycle management and cleanup

**Rotation Mapping Copy:**

- When keys are rotated, all mappings are automatically copied to the new key
- The old key status changes to `KEY_STATUS_ROTATED`
- The new key becomes `KEY_STATUS_ACTIVE` and inherits all mappings

## Migration from Grants

:::warning Legacy Migration Required
**KAS Grants are no longer supported** in platform v0.7.0+. Existing grants must be migrated to key mappings.

**Legacy Grant Structure (Deprecated):**

```text
Namespace → KeyAccessServer → [remote|cached] key
Attribute → KeyAccessServer → [remote|cached] key  
Value     → KeyAccessServer → [remote|cached] key
```

**New Mapping Structure:**

```text
Namespace → AsymmetricKey (with KAS association)
Attribute → AsymmetricKey (with KAS association)
Value     → AsymmetricKey (with KAS association)
```

:::

### Migration Steps

1. **Audit existing grants** using deprecated `ListKeyAccessServerGrants` API
2. **Create keys** for each unique key material in your grants
3. **Create mappings** using the new `AssignPublicKeyTo*` RPCs
4. **Test functionality** with SDKs to ensure proper key resolution
5. **Remove legacy** grant configurations

### Migration CLI Commands

```bash
# List existing grants (deprecated API)
otdfctl policy kas-registry grants list --output json

# For each grant, create corresponding key and mapping
# (Repeat for each grant found)
otdfctl policy kas-registry key create ...
otdfctl policy attributes key assign ...
```

## Troubleshooting

### Common Issues

**Key Not Found During TDF Operations:**

- Verify key is in `KEY_STATUS_ACTIVE` state
- Check that mappings exist for the target policy objects
- Ensure the key's KAS is accessible from the requesting client

**Multiple Keys Mapped:**

- Review mapping precedence order
- Use `list key mappings` to see all associations
- Consider consolidating to a single key per policy object

**Provider Configuration Errors:**

- Validate provider config JSON syntax and values
- Ensure external KMS/HSM is accessible from KAS
- Check key manager plugin is loaded and registered

### Debugging Commands

```bash
# Check key status and details
otdfctl policy kas-registry key get --id "key-uuid"

# View all mappings for troubleshooting
otdfctl policy kas-registry key mappings list

# View mappings for a specific namespace
otdfctl policy namespaces get --namespace-id "namespace-uuid" --output json | jq '.namespace.kas_keys'

# View mappings for a specific attribute
otdfctl policy attributes get --attribute-id "attribute-uuid" --output json | jq '.attribute.kas_keys'

# View mappings for a specific value
otdfctl policy attributes values get --value-id "value-uuid" --output json | jq '.value.kas_keys'
```
