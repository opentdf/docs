---
sidebar_position: 5
slug: /components/policy/keymanagement/quickstart
---

# Key Management Quickstart

This quickstart guide demonstrates the complete workflow for setting up OpenTDF's modern key management system with direct key mappings. You'll create a KAS, generate keys, set up policy objects, and establish key mappings.

:::tip Migration Users
If you're migrating from the legacy grant system, see our [Migration Guide](./migration_from_grants.md) for detailed transition instructions.
:::

## Prerequisites

- OpenTDF platform v0.7.0+ running
- `otdfctl` CLI tool installed and configured
- Admin permissions for key management operations

## Step 1: Register a Key Access Server

First, register your KAS with the platform:

```bash
# Register KAS with platform
KAS_ID=$(otdfctl policy kas-registry create \
  --uri "https://kas.example.com" \
  --name "quickstart-kas" \
  --output json | jq -r '.key_access_server.id')

echo "Created KAS with ID: $KAS_ID"
```

## Step 2: Create Encryption Keys

Create keys for different use cases:

### Local Key (Recommended for Getting Started)

```bash
# Create RSA key for general use
RSA_KEY_ID=$(otdfctl policy kas-registry key create \
  --kas-id "$KAS_ID" \
  --key-id "quickstart-rsa-2024" \
  --algorithm "ALGORITHM_RSA_2048" \
  --key-mode "KEY_MODE_CONFIG_ROOT_KEY" \
  --public-key-pem "-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1234567890ABCDEF...
-----END PUBLIC KEY-----" \
  --wrapping-key-id "quickstart-kek" \
  --wrapped-key "$(echo 'base64-encoded-wrapped-private-key' | base64)" \
  --output json | jq -r '.kas_key.key.id')

echo "Created RSA key with ID: $RSA_KEY_ID"
```

### ECC Key (For NanoTDF Support)

```bash
# Create ECC key for NanoTDF compatibility
ECC_KEY_ID=$(otdfctl policy kas-registry key create \
  --kas-id "$KAS_ID" \
  --key-id "quickstart-ecc-2024" \
  --algorithm "ALGORITHM_EC_P256" \
  --key-mode "KEY_MODE_CONFIG_ROOT_KEY" \
  --public-key-pem "-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1234567890ABCDEF...
-----END PUBLIC KEY-----" \
  --wrapping-key-id "quickstart-kek" \
  --wrapped-key "$(echo 'base64-encoded-wrapped-ecc-key' | base64)" \
  --output json | jq -r '.kas_key.key.id')

echo "Created ECC key with ID: $ECC_KEY_ID"
```

:::note Key Material
In production, replace the example key material with your actual:

- Public key PEM from your key generation process
- Base64-encoded wrapped private key
- Appropriate wrapping key ID from your KAS configuration
:::

## Step 3: Set Base Key (System Default)

```bash
# Set ECC key as base key for broad compatibility
otdfctl policy kas-registry key base set --id "$ECC_KEY_ID"

echo "Set base key to ECC key for NanoTDF support"
```

## Step 4: Create Policy Structure

Set up your attribute-based access control hierarchy:

```bash
# Create namespace
NAMESPACE_ID=$(otdfctl policy namespaces create \
  --name "quickstart.example.com" \
  --output json | jq -r '.namespace.id')

echo "Created namespace with ID: $NAMESPACE_ID"

# Create attribute definition
ATTRIBUTE_ID=$(otdfctl policy attributes create \
  --namespace "$NAMESPACE_ID" \
  --name "classification" \
  --rule "ATTRIBUTE_RULE_TYPE_ENUM_ANY_OF" \
  --output json | jq -r '.attribute.id')

echo "Created attribute with ID: $ATTRIBUTE_ID"

# Create attribute values
SECRET_VALUE_ID=$(otdfctl policy attributes values create \
  --attribute "$ATTRIBUTE_ID" \
  --value "secret" \
  --output json | jq -r '.value.id')

CONFIDENTIAL_VALUE_ID=$(otdfctl policy attributes values create \
  --attribute "$ATTRIBUTE_ID" \
  --value "confidential" \
  --output json | jq -r '.value.id')

echo "Created values: secret=$SECRET_VALUE_ID, confidential=$CONFIDENTIAL_VALUE_ID"
```

## Step 5: Create Key Mappings

Map keys to policy objects at different specificity levels:

```bash
# Namespace-level mapping (affects all attributes in namespace)
otdfctl policy namespaces key assign \
  --namespace-id "$NAMESPACE_ID" \
  --key-id "$RSA_KEY_ID"

echo "Assigned RSA key to namespace (default for all attributes)"

# Attribute-level mapping (overrides namespace mapping)
otdfctl policy attributes key assign \
  --attribute-id "$ATTRIBUTE_ID" \
  --key-id "$ECC_KEY_ID"

echo "Assigned ECC key to classification attribute (overrides namespace)"

# Value-level mapping (most specific, overrides attribute mapping)
otdfctl policy attributes value key assign \
  --value-id "$SECRET_VALUE_ID" \
  --key-id "$RSA_KEY_ID"

echo "Assigned RSA key to 'secret' value (highest priority)"
```

## Step 6: Verify Configuration

```bash
# List all key mappings
echo "=== Key Mappings ==="
otdfctl policy kas-registry key mappings list

# Check base key
echo "=== Base Key ==="
otdfctl policy kas-registry key base get

# List all keys
echo "=== All Keys ==="
otdfctl policy kas-registry key list
```

## Step 7: Test with SDK

Now test the key resolution with TDF operations:

### Python SDK Example

```python
from opentdf import TDFClient, NanoTDFClient, LogLevel, OIDCCredentials

# Configure client
creds = OIDCCredentials()
creds.set_client_credentials_client_secret(
    client_id="your-client-id",
    client_secret="your-client-secret",
    organization_name="your-org",  
    oidc_endpoint="https://auth.example.com"
)

client = TDFClient(
    oidc_credentials=creds,
    kas_url="https://kas.example.com",
    platform_url="https://platform.example.com"
)

# Test different attribute scenarios
test_cases = [
    # Uses secret value mapping → RSA key
    {"attrs": ["https://quickstart.example.com/attr/classification/value/secret"],
     "file": "secret_test.txt", "expected_key": "RSA"},
    
    # Uses confidential value → falls back to attribute mapping → ECC key
    {"attrs": ["https://quickstart.example.com/attr/classification/value/confidential"],
     "file": "confidential_test.txt", "expected_key": "ECC"},
    
    # No attributes → uses base key → ECC key
    {"attrs": [], "file": "base_key_test.txt", "expected_key": "ECC (base)"}
]

for test in test_cases:
    print(f"Testing {test['expected_key']}: {test['attrs']}")
    
    # Create TDF
    with open(test['file'], 'w') as f:
        f.write(f"Test content for {test['expected_key']}")
    
    tdf_file = f"{test['file']}.tdf"
    client.encrypt_file(
        file_path=test['file'],
        tdf_path=tdf_file,
        attributes=test['attrs']
    )
    
    # Decrypt to verify
    decrypted_file = f"{test['file']}.decrypted"
    client.decrypt_file(tdf_file, decrypted_file)
    
    print(f"✅ {test['expected_key']} encryption/decryption successful")
```

## Understanding Key Resolution

The system resolves keys in this priority order:

1. **🎯 Value-level mapping** (most specific)
   - `quickstart.example.com/attr/classification/value/secret` → RSA Key

2. **📝 Attribute-level mapping**
   - `quickstart.example.com/attr/classification/value/confidential` → ECC Key

3. **📁 Namespace-level mapping**
   - Other attributes in `quickstart.example.com` → RSA Key

4. **🔑 Base Key** (fallback)
   - No attribute mappings found → ECC Key

## Advanced: External Provider Integration

For production deployments using external KMS:

```bash
# 1. Create provider configuration
PROVIDER_ID=$(otdfctl policy keymanagement provider-config create \
  --name "aws-kms-prod" \
  --config-json '{
    "region": "us-east-1",
    "access_key_id": "AKIA...",
    "secret_access_key": "...",
    "kms_key_id": "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
  }' \
  --output json | jq -r '.provider_config.id')

# 2. Create key that uses external provider
EXTERNAL_KEY_ID=$(otdfctl policy kas-registry key create \
  --kas-id "$KAS_ID" \
  --key-id "aws-kms-key-2024" \
  --algorithm "ALGORITHM_RSA_2048" \
  --key-mode "KEY_MODE_PROVIDER_ROOT_KEY" \
  --public-key-pem "$(cat kms_public_key.pem)" \
  --provider-config-id "$PROVIDER_ID" \
  --wrapped-key "$(base64 < kms_wrapped_key.bin)" \
  --output json | jq -r '.kas_key.key.id')

echo "Created external provider key with ID: $EXTERNAL_KEY_ID"
```

## Next Steps

🎯 **You now have a fully functional key management system!**

**Continue with:**

- [Key Rotation](./index.md#key-rotation-and-lifecycle) - Learn automated key rotation
- [Provider Integration](./key_managers.md) - Connect external KMS/HSM systems
- [Advanced Mappings](./key_mappings.md) - Complex attribute hierarchies
- [Base Key Management](./base_key.md) - System-wide defaults

**For production:**

- Set up proper key material generation and storage
- Configure external provider integrations
- Implement key rotation policies
- Monitor key mapping effectiveness
