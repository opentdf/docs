---
sidebar_position: 2
title: Official SDK Guidelines
description: Official guidelines and standards for implementing OpenTDF SDKs
---

# Official SDK Guidelines

This document provides the official guidelines and standards for:
- OpenTDF contributors implementing new language SDKs
- Developers who want to understand the official SDK architecture and implementation details

If you're looking to *use* an existing OpenTDF SDK, please see the [SDK Overview](/sdks/overview) instead.

## Core Principles for Official OpenTDF SDKs

All official OpenTDF SDKs must adhere to these core principles to ensure functional parity and consistent developer experience across languages:

### 1. Platform-First Initialization

Every SDK requires a platform base URL (endpoint) at initialization, along with necessary credentials. This endpoint is the entry point to OpenTDF platform services. The SDK will automatically:

- Discover service endpoints (KAS, Policy, etc.)
- Configure network clients
- Retrieve well-known configuration

### 2. Service Communication via Generated Clients 

SDKs use auto-generated API clients (using Protocol Buffers/Connect RPC) for communicating with OpenTDF services. This ensures:

- Consistent interfaces across languages
- Type-safe API calls
- Reduced boilerplate code
- Up-to-date API definitions

### 3. Format Support and Cryptography

Every SDK must support:

- Standard TDF (ZIP/JSON format) with manifest
- NanoTDF (compact binary format)
- Attribute-Based Access Control (ABAC)
- Signed assertions and policy binding

### 4. Language-Idiomatic Design

While maintaining functional parity, each SDK should follow patterns natural to its language:

#### Go SDK (Reference Implementation)
```go
// Functional options pattern
client := tdf.NewClient(
    WithPlatformURL("https://platform.example.com"),
    WithClientCredentials("id", "secret"),
)
```

#### Java SDK
```java
// Builder pattern
TdfClient client = TdfClient.builder()
    .platformUrl("https://platform.example.com")
    .clientCredentials("id", "secret")
    .build();
```

#### JavaScript/TypeScript SDK  
```typescript
// Options object pattern
const client = new TdfClient({
    platformUrl: "https://platform.example.com",
    credentials: {
        clientId: "id",
        clientSecret: "secret"
    }
});
```

## Unified Interface Strategy

### Java SDK Implementation

The Java SDK should provide a clean, unified interface through the new `TdfClient` class:

```java
// Future unified API
TdfClient client = TdfClient.builder()
    .platformUrl("https://platform.example.com")
    .clientCredentials("id", "secret")
    .build();

// Encrypt with data attributes
client.setDataAttributes(List.of("attr1", "attr2"));
client.addAssertion("classification", "SECRET", signingKey);

// Encrypt/decrypt methods support both formats
try (InputStream in = new FileInputStream("plain.txt");
     OutputStream out = new FileOutputStream("encrypted.tdf")) {
    client.encrypt(in, out, TdfClient.Format.TDF); // or Format.NANO
}
```

### Web SDK Implementation

The Web SDK should provide a similar unified interface through TypeScript:

```typescript
const client = new TdfClient({
    platformUrl: "https://platform.example.com",
    oidcOrigin: "https://idp.example.com",
    credentials: {
        clientId: "myClientId",
        clientSecret: "secretToken"
    }
});

// Set policy and assertions
await client.setDataAttributes(["https://opentdf.io/attr/class/value/secret"]);
await client.addAssertion("clearance", "SECRET", signingKey);

// Encrypt data (automatically selects format based on size/config)
const ciphertext = await client.encrypt(plaintext, { format: "nano" });
const decrypted = await client.decrypt(ciphertext);  // auto-detects format
```

## Migration Strategy

Here's how to migrate existing code to the new unified interface:

### 1. Client Initialization Migration

**Old approach (pre-4.0):**
```typescript
// JavaScript/TypeScript
const client = await NanoTDFClient.fromConfig({
    kasUrl: "https://kas.example.com",
    authProvider: new OIDCCredentials(/*...*/)
});

// Java
NanoTDFClient client = new NanoTDFClient();
client.setKasUrl("https://kas.example.com");
client.setAuthProvider(new OIDCCredentials());
```

**New unified approach (4.0+):**
```typescript
// JavaScript/TypeScript
const client = new TdfClient({
    platformUrl: "https://platform.example.com",  // Single endpoint
    credentials: {
        clientId: "id",
        clientSecret: "secret"
    }
});

// Java
TdfClient client = TdfClient.builder()
    .platformUrl("https://platform.example.com")
    .clientCredentials("id", "secret")
    .build();
```

### 2. Encryption/Decryption Migration

**Old approach:**

```typescript
// JavaScript/TypeScript - separate clients for different formats
const nanoClient = new NanoTDFClient(config);
const tdfClient = new TDFClient(config);

const nanoEncrypted = await nanoClient.encrypt(data);
const tdfEncrypted = await tdfClient.encrypt(data);

// Java
NanoTDFClient nanoClient = new NanoTDFClient();
TDFClient tdfClient = new TDFClient();

byte[] nanoEncrypted = nanoClient.encrypt(data);
byte[] tdfEncrypted = tdfClient.encrypt(data);
```

**New unified approach:**
```typescript
// JavaScript/TypeScript - single client handles both formats
const client = new TdfClient(config);

// Format is auto-selected or explicitly specified
const encrypted = await client.encrypt(data, { format: "nano" });
const decrypted = await client.decrypt(encrypted); // Format auto-detected

// Java
TdfClient client = TdfClient.builder().build();

// Streaming API with format selection
try (InputStream in = new FileInputStream("plain.txt");
     OutputStream out = new FileOutputStream("encrypted.tdf")) {
    client.encrypt(in, out, TdfClient.Format.NANO);
}
```

### 3. Testing Migration

Replace abstract test suites with concrete integration tests:

```typescript
describe('TDF Client Migration', () => {
    // Test unified client with legacy format
    it('should decrypt legacy NanoTDF format', async () => {
        const unified = new TdfClient(config);
        const legacyEncrypted = await getLegacyEncryptedData();
        const decrypted = await unified.decrypt(legacyEncrypted);
        expect(decrypted).toEqual(originalData);
    });

    // Test format interoperability
    it('should support cross-format operations', async () => {
        const client = new TdfClient(config);
        
        // Encrypt as NanoTDF
        const nano = await client.encrypt(data, { format: 'nano' });
        
        // Decrypt with format auto-detection
        const decrypted1 = await client.decrypt(nano);
        expect(decrypted1).toEqual(data);
        
        // Encrypt as standard TDF
        const tdf = await client.encrypt(data, { format: 'tdf' });
        
        // Decrypt with format auto-detection
        const decrypted2 = await client.decrypt(tdf);
        expect(decrypted2).toEqual(data);
    });
});
```

### Migration Gotchas

1. **Attribute Format Changes**
   - Legacy: Simple strings (`"SECRET"`)
   - New: Full URIs (`"https://opentdf.io/attr/classification/value/secret"`)
   - Migration helper: `client.normalizeAttribute(legacyAttr)`

2. **Error Handling Changes**
   - Legacy: Multiple error types (`NanoTDFError`, `TDFError`)
   - New: Unified `TdfError` with error codes
   - Example: `TdfError.FORMAT_INVALID` instead of `InvalidNanoTDFError`

3. **Configuration Changes**
   - Legacy configs won't work with unified client
   - Use `ConfigMigrationTool` (included) to convert:
   ```typescript
   const unifiedConfig = ConfigMigrationTool.migrate(legacyConfig);
   const client = new TdfClient(unifiedConfig);
   ```

## Implementing a New SDK

### Prerequisites

1. Familiarize yourself with:
   - [OpenTDF Architecture](/architecture)
   - [TDF Specification](https://github.com/opentdf/spec)
   - [Go SDK](https://github.com/opentdf/platform) (reference implementation)

2. Required capabilities:
   - Protocol Buffers / Connect RPC support
   - Modern cryptography library support
   - ZIP handling (for standard TDF)
   - JSON parsing

### Implementation Steps

1. **Service Client Generation**
   - Generate API clients from Protocol Buffer definitions
   - Implement authentication flow
   - Configure service discovery

2. **Core Cryptographic Operations**
   - Implement key derivation
   - Support ECC for NanoTDF
   - Implement signature verification

3. **Format Support**
   - Implement TDF manifest creation/parsing
   - Implement NanoTDF binary format
   - Support streaming for large files

4. **Policy and Assertions**
   - Implement ABAC policy binding
   - Support signed assertions
   - Validate integrity during decryption

## Implementation Checklist

For each new SDK implementation:

- [ ] Service Integration
  - [ ] Platform URL configuration
  - [ ] Well-known endpoint discovery
  - [ ] Authentication flow
  - [ ] Generated service clients

- [ ] TDF Support
  - [ ] Manifest creation/parsing
  - [ ] ZIP packaging
  - [ ] Streaming support
  - [ ] Policy binding

- [ ] NanoTDF Support
  - [ ] Binary format handling 
  - [ ] ECC cryptography
  - [ ] Performance optimization

- [ ] Policy & Security
  - [ ] ABAC implementation
  - [ ] Assertion signing/verification
  - [ ] Key derivation
  - [ ] Integrity validation

For detailed technical specifications and implementation guidance, see:
- [TDF Format Specification](/spec/schema/opentdf)
- [NanoTDF Specification](/spec/schema/nanotdf)
- [Protocol Documentation](/spec/protocol)
