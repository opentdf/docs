# Obligations

Obligations are policy constructs defined in the NIST ABAC model that enable the Policy Decision Point (PDP) to communicate additional enforcement directives to the Policy Enforcement Point (PEP) alongside an access decision. While attributes determine *whether* access should be granted (PERMIT or DENY), obligations specify *how* the PEP must enforce that access if permitted.

**Current Implementation Status**: OpenTDF defines the obligation framework and data structures as part of its policy model. However, the Key Access Server (the PEP in OpenTDF) does not currently use obligations in authorization decisions. The obligation model described here represents the conceptual framework available for future enhancements or for organizations building custom PEPs that integrate with OpenTDF's authorization service.

---

## The Role of Obligations in ABAC

In the NIST ABAC model, authorization decisions can be more than binary PERMIT or DENY. Obligations extend this by allowing the PDP to communicate **"permit, provided these controls are enforced."** This enables fine-grained enforcement policies that go beyond simple access control.

### Key Characteristics

- **PDP-to-PEP Directives**: Obligations are instructions from the authorization decision point to the enforcement point
- **Conditional Access**: Access is granted only if the PEP can and will enforce the specified obligations
- **Trust-Based Model**: The PDP cannot compel or verify enforcement; it relies on the PEP to honor obligations faithfully
- **Enforcement Responsibility**: If the PEP cannot enforce an obligation, it should decline to grant access

---

## Obligations vs. Attributes

Understanding the distinction between obligations and attributes is essential for policy design:

| Aspect | Attributes | Obligations |
|--------|-----------|-------------|
| **Purpose** | Define authorization criteria | Define enforcement controls |
| **Evaluated By** | PDP during authorization | PEP during access/usage |
| **Decision Role** | Determine PERMIT/DENY | Specify conditions of PERMIT |
| **Example** | `clearance=confidential` | `apply-watermark=true` |
| **Scope** | Subject, resource, environment | Access enforcement, usage controls |

### Conceptual Example

Consider a document marked with `classification=sensitive`:
- **Attribute-Based Decision**: "Does the subject have `clearance=sensitive` or higher?" → PERMIT/DENY
- **Obligation-Based Control**: "If permitted, apply watermark and prevent download" → Enforcement directives

---

## Common Obligation Use Cases

Obligations enable a wide range of data governance and security controls:

### Digital Rights Management (DRM)

- Apply visible or invisible watermarks to identify document viewers
- Prevent printing or downloading of sensitive content
- Restrict copy-paste operations
- Expire access after a specified time period

### Audit and Compliance

- Log all access events with subject identity and timestamp
- Require multi-factor authentication before granting access
- Trigger notifications when sensitive data is accessed

### Data Transformation

- Redact sensitive fields based on subject clearance
- Apply encryption to data at rest after access
- Downsample or compress media based on subject tier

### Contextual Controls

- Restrict access to specific device types
- Require network location verification
- Enforce time-of-day access windows

---

## Obligation Structure

Obligations follow a hierarchical structure similar to attributes:

- **Namespace**: Organizes obligations by authority (e.g., `example.com/obl/drm`)
- **Definition**: The obligation type (e.g., `watermarking`, `no-download`)
- **Values**: Specific obligation instances that can be applied
- **Triggers**: Conditions under which obligations activate (action, attribute value, PEP identifier)

### Naming Convention

Obligations use a distinct naming convention to differentiate them from attributes:
- Obligation definitions: `<namespace>/obl/<name>`
- Obligation values: `<namespace>/obl/<name>/value/<value>`

**Example**:
- `https://example.com/obl/drm` (definition)
- `https://example.com/obl/drm/value/watermarking` (value)

---

## When to Use Obligations

Use obligations when you need to:

1. **Enforce usage controls** beyond simple access decisions (watermarking, expiration)
2. **Apply conditional policies** that depend on runtime context (device type, network location)
3. **Implement DRM controls** that restrict how data can be used after decryption
4. **Separate concerns** between authorization decisions (PDP) and enforcement mechanisms (PEP)
5. **Maintain flexibility** in enforcement implementation while centralizing policy

---

## Design Considerations

### Trust Model

Obligations require trust in the PEP. If you cannot trust the PEP to honor obligations, consider whether the access should be granted at all. This trust model is fundamental to how obligations extend ABAC authorization.

### PEP Capabilities

When designing policies with obligations, ensure your PEP can actually enforce the specified obligations. An obligation the PEP cannot fulfill should result in denied access.

### Policy Complexity

While obligations enable sophisticated controls, they add complexity to policy evaluation and enforcement. Start with simple attribute-based policies and introduce obligations only when simpler approaches are insufficient.

### Audit and Verification

Since the PDP cannot verify obligation enforcement, consider implementing logging and audit mechanisms in your PEP to demonstrate compliance with obligation requirements.

---

## Related Documentation

For implementation details on obligation composition, triggers, and configuration, see:
- **[Policy: Obligations](/explanation/platform-architecture/components/policy/obligations)**: Technical implementation details
- **[Authorization Service](/explanation/platform-architecture/components/authorization)**: How obligations fit into authorization decisions
- **[Policy Workflows](./policy-workflows)**: See how obligations would integrate into complete authorization flows

---

## Next Steps

- **[Policy Workflows](./policy-workflows)**: Understand how all ABAC primitives work together
- **[Subject & Resource Mappings](./subject-and-resource-mappings)**: Learn about mapping identities to attributes
- **[Attributes & Namespaces](./attributes-and-namespaces)**: Understand attribute definitions and rules
- **[ABAC Overview](./overview)**: Return to ABAC fundamentals
