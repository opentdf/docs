---
sidebar_position: 4
slug: /components/policy/keymanagement/base_key
---

# Base Keys

Base Keys provide a system-wide default encryption key that serves as a fallback when no specific key mappings are found for the requested attributes. This ensures consistent encryption behavior and prevents the use of potentially insecure default keys.

## Base Key Management

Base keys are managed through the OpenTDF platform's key management system. The platform ensures that:

- **Only one base key exists at any time** - Setting a new base key automatically replaces the previous one
- **No manual cleanup required** - The system handles base key replacement automatically
- **Seamless transitions** - Applications continue working during base key updates
- **Active key enforcement** - Only active keys can be designated as base keys

### Automatic Replacement Behavior

When you set a new base key using `otdfctl`, the platform:

1. **Validates** the new key is active and accessible
2. **Replaces** the existing base key reference automatically  
3. **Updates** all internal references immediately
4. **Confirms** the change through the API response

No additional cleanup or management steps are required.

## Managing Base Keys

### Set a Base Key

**Using Key ID:**

```bash
# Set base key by key UUID
otdfctl policy kas-registry key base set --id "550e8400-e29b-41d4-a716-446655440000"
```

**Using KAS and Key ID:**

```bash
# Set base key by KAS name and key ID
otdfctl policy kas-registry key base set \
  --kas-name "production-kas" \
  --key-id "prod-rsa-2024"

# Set base key by KAS URI and key ID
otdfctl policy kas-registry key base set \
  --kas-uri "https://kas.example.com" \
  --key-id "prod-rsa-2024"
```

### Get Current Base Key

```bash
# Get the current base key information
otdfctl policy kas-registry key base get
```

**Example Response:**

```json
{
  "base_key": {
    "kas_uri": "https://kas.example.com",
    "public_key": {
      "algorithm": "ALGORITHM_RSA_2048",
      "kid": "prod-rsa-2024",
      "pem": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
    },
    "kas_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

## Base Key Requirements

### Key Status Requirement

:::important Active Keys Only
Only keys with `KEY_STATUS_ACTIVE` status can be set as base keys. The system will reject attempts to set rotated or inactive keys as the base key.
:::

### Automatic Rotation Updates

When a base key is rotated:

1. The old key status changes to `KEY_STATUS_ROTATED`
2. The new key becomes `KEY_STATUS_ACTIVE`
3. **The base key reference is automatically updated** to point to the new active key
4. Applications continue using the rotated key seamlessly

```bash
# After rotation, the base key automatically points to the new key
# No manual base key update required
otdfctl policy kas-registry key rotate --id "current-base-key-uuid" ...
```

## SDK Behavior with Base Keys

### Key Resolution Priority

The SDK follows this precedence when resolving keys for TDF operations:

1. **Attribute Value** key mappings (most specific)
2. **Attribute Definition** key mappings  
3. **Namespace** key mappings
4. **Base Key** (system fallback)
5. ~~Passed-in KAS info~~ (deprecated behavior)

### Information Override

When a base key is configured, the SDK will:

✅ **Override client-provided KAS information** with base key's KAS details
✅ **Override client-provided key algorithm** with base key's algorithm
✅ **Use base key for all encryption operations** when no specific mappings exist

### NanoTDF Compatibility

:::warning ECC Requirement for NanoTDF
**NanoTDF requires Elliptic Curve keys** for optimal performance and compatibility.

- ✅ If base key is ECC (`ALGORITHM_EC_P256`, `ALGORITHM_EC_P384`, `ALGORITHM_EC_P521`) → NanoTDF works
- ❌ If base key is RSA (`ALGORITHM_RSA_2048`, `ALGORITHM_RSA_4096`) → SDK falls back to client-provided key or errors

**Recommendation:** Use ECC keys as base keys to ensure full NanoTDF compatibility.
:::

### Future Strict Mode

:::note Upcoming Changes
In future SDK versions (post v0.5.0), the platform will enforce **strict mode**:

- SDKs will **require** a base key to be set
- No fallback to client-provided KAS information
- Encryption will **fail** if no base key or key mappings are found

This ensures consistent security policy enforcement across all TDF operations.
:::

## Operational Examples

### Complete Base Key Setup

```bash
# 1. Register KAS
KAS_ID=$(otdfctl policy kas-registry create \
  --uri "https://kas.example.com" \
  --name "production-kas" \
  --output json | jq -r '.key_access_server.id')

# 2. Create an ECC key for broad compatibility
KEY_ID=$(otdfctl policy kas-registry key create \
  --kas-id "$KAS_ID" \
  --key-id "base-ec-2024" \
  --algorithm "ALGORITHM_EC_P256" \
  --key-mode "KEY_MODE_CONFIG_ROOT_KEY" \
  --public-key-pem "$(cat ec_public_key.pem)" \
  --wrapping-key-id "root-kek" \
  --wrapped-key "$(base64 < wrapped_ec_key.bin)" \
  --output json | jq -r '.kas_key.key.id')

# 3. Set as base key
otdfctl policy kas-registry key base set --id "$KEY_ID"

# 4. Verify configuration
otdfctl policy kas-registry key base get
```

### Base Key Rotation

```bash
# Get current base key ID
CURRENT_BASE_KEY=$(otdfctl policy kas-registry key base get --output json | jq -r '.base_key.kas_id')

# Rotate the base key (automatically updates base key reference)
otdfctl policy kas-registry key rotate \
  --id "$CURRENT_BASE_KEY" \
  --new-key-id "base-ec-2025" \
  --algorithm "ALGORITHM_EC_P384" \
  --key-mode "KEY_MODE_CONFIG_ROOT_KEY" \
  --wrapping-key-id "root-kek" \
  --wrapping-key "$(base64 < new_wrapped_key.bin)"

# Verify base key now points to new key
otdfctl policy kas-registry key base get
```

## Monitoring and Troubleshooting

### Check Base Key Status

```bash
# Get current base key details
BASE_KEY_INFO=$(otdfctl policy kas-registry key base get --output json)
echo "$BASE_KEY_INFO" | jq '.base_key'

# Check if base key is active
KEY_STATUS=$(otdfctl policy kas-registry key get \
  --id "$(echo "$BASE_KEY_INFO" | jq -r '.base_key.kas_id')" \
  --output json | jq -r '.kas_key.key.key_status')

if [ "$KEY_STATUS" != "KEY_STATUS_ACTIVE" ]; then
  echo "⚠️  Base key is not active: $KEY_STATUS"
else
  echo "✅ Base key is active and ready"
fi
```

### Common Issues

**Base Key Not Found:**

- Verify a base key has been set: `otdfctl policy kas-registry key base get`
- Ensure the referenced key still exists and is active

**NanoTDF Failures:**

- Check if base key uses an ECC algorithm
- Consider setting an ECC base key for NanoTDF compatibility

**SDK Fallback Behavior:**

- Review SDK logs for base key resolution attempts
- Verify platform connectivity and authentication
- Check if key mappings exist for specific attributes

## API Reference

The base key functionality is provided through these RPC endpoints:

- **`SetBaseKey`** - Set a new base key (upserts automatically)
- **`GetBaseKey`** - Retrieve current base key information

Both endpoints are defined in the [KAS Registry service](https://github.com/opentdf/platform/blob/main/service/policy/kasregistry/key_access_server_registry.proto#L693-L696).
