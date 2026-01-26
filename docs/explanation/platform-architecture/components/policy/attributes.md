# Attributes

Attributes are the logical structure used to control access to TDF data. Entities (people, machines, users) are "entitled" to attributes. Resource data is encrypted within a TDF that contains attributes, binding ABAC policy at the cryptographic level.

## Composition

An attribute consists of three parts:

1. A Namespace
2. A Definition
3. A Value

Platform Policy Attributes can contain multiple Namespaces, each with multiple Definitions, and each Definition can have multiple Values.

```mermaid
graph LR;
Namespace_A-->Definition_A;
Definition_A-->Value_A;
Definition_A-->Value_B;

Namespace_A-->Definition_B;
Definition_B-->Value_C;
Definition_B-->Value_D;
```

## Namespaces

A Namespace is the parent container for a set of attributes. Consider the following example:

Alice wants to control access in a platform instance based on Attribute Values of the Definitions `color` and `order`. She creates attribute definitions for each and assigns values to them.

```mermaid
graph LR;

X(Color)-->Blue;
X(Color)-->Red;
style X fill:#fff,stroke:#333,stroke-width:1px,color:black
style Red fill:red,color:white
style Blue fill:blue,color:white

Y(Order)-->First;
Y(Order)-->Second;
Y(Order)-->Third;
style Y fill:#fff,stroke:#333,stroke-width:1px,color:black
style First fill:#06e4a44d,stroke:#333,stroke-width:1px,color:black
style Second fill:#06c9e4a8,stroke:#333,stroke-width:1px,color:black
style Third fill:#0697e4f5,stroke:#333,stroke-width:1px,color:black
```

Bob agrees with this concept but wants to use different colors and drive order based on alphabetical indexes rather than word strings.

```mermaid
graph LR;

X(Color)-->Orange;
X(Color)-->Green;
style X fill:#fff,stroke:#333,stroke-width:1px,color:black
style Orange fill:#ff5800,color:white
style Green fill:green,color:white

Y(Order)-->A;
Y(Order)-->B;
Y(Order)-->C;
style Y fill:#fff,stroke:#333,stroke-width:1px,color:black
style A fill:#06e4a44d,stroke:#333,stroke-width:1px,color:black
style B fill:#06c9e4a8,stroke:#333,stroke-width:1px,color:black
style C fill:#0697e4f5,stroke:#333,stroke-width:1px,color:black
```

These attributes will now be used to drive access decisions based on policies in the platform.

## Attribute Rules

Attribute definitions include a **rule** that determines how the attribute's values are evaluated during authorization decisions. The rule controls the entitlement logic when matching subject attributes against TDF data attributes.

### Available Rules

- **ANY_OF**: Subject needs at least one matching attribute value to access data
  - Use for: Independent categories, "either/or" requirements
  - Example: Team membership, color preferences

- **ALL_OF**: Subject must have all attribute values required by the data
  - Use for: Compound requirements, "and" logic
  - Example: Multi-certification requirements, cross-functional access

- **HIERARCHY**: Subject needs the same level or higher in an ordered hierarchy
  - Use for: Membership tiers, organizational levels, graduated access
  - Index 0 = highest level; actions propagate down the hierarchy
  - Example: Subscription tiers, job levels, access tiers

### Detailed Explanation

For comprehensive explanations with examples and use-case guidance, see:
- **[ABAC & Policy: Attribute Rules](/explanation/abac-and-policy/#attribute-rules)** - Conceptual deep dive with detailed examples
- **[CLI Reference: Creating Attributes](/explanation/platform-architecture/components/cli/policy/attributes/create)** - Command-line usage and syntax

### Rule Selection Impact

Choosing the wrong rule can have security implications:
- Changing from `ANY_OF` to `ALL_OF` may inadvertently deny access to legitimate users
- Changing from `HIERARCHY` to `ANY_OF` may grant unintended access across organizational levels
- Reordering hierarchical values changes the access ladder

See [Unsafe Actions](#unsafe-actions) below for more on modifying rules.

## Key Association

Keys can be associated with attributes and values. This allows for more granular access control. For example, you can require that an entity has a specific key in addition to the required attributes.

## Unsafe Actions

Certain actions on policy attributes are considered "unsafe" because they may inadvertently affect access control, potentially granting or removing access unintentionally. Deactivating a Namespace, for example, cascades to deactivate its Definitions and their Values. Similarly, deactivating a Definition deactivates its Values.

Unsafe actions on policy attributes include:

- **Namespaces**:
  - Updating the namespace name (e.g., `demo.com` to `example.org`).
  - Reactivation (does not cascade to reactivate attributes and their values).
  - Deletion (permanently removes the namespace and all associated attributes and values).
- **Attribute Definitions**:
  - Updating the attribute definition name.
  - Changing the order of attribute values.
  - Modifying the rule on a definition (e.g., from `hierarchy` to `anyOf`).
  - Reactivation (does not cascade to values or bubble up to reactivate the namespace).
  - Deletion (permanently removes the definition and its values).
- **Attribute Values**:
  - Updating the value.
  - Reactivation (does not bubble up to reactivate the definition or namespace).
  - Deletion (permanently removes the value without affecting the parent definition or namespace).

These mutations can retroactively change access to existing and new TDFs, making it crucial to handle them with caution.
