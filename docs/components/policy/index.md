---
sidebar_position: 1
slug: /components/policy
---
# Policy

Policy is the all-encompassing name for configuration of cryptographically-bound Attribute Based Access Control (ABAC) within the Platform.

```mermaid
graph TD;
  subgraph "Policy Framework"
    Data["Data/Resources"]
    Attributes["Attributes<br/>(Namespaces, Definitions, Values)"]
    Entities["Entities/Subjects"]
    Actions["Actions<br/>(decrypt, transmit, etc.)"]
  end
  
  Data -.->|Resource Mappings| Attributes
  Entities -.->|Subject Mappings| Attributes
  Actions -.->|Subject Mappings| Entities
  
  subgraph "Access Decision"
    Decision{"Access Control<br/>Decision"}
  end
  
  Attributes --> Decision
  Actions --> Decision
  Entities --> Decision
  Data --> Decision
```

TDF creation and decryption are driven by the Policy within a Platform instance and the TDF manifest. In other words, on a TDF decryption request, the platform services (KAS, Authorization) compare attributes on the TDF against the requester's entitlements to make a decision to release the key or not.

Components of Policy include:

- Attributes
  - Namespaces
  - Definitions
  - Values
- Actions
- Subject Mappings
  - Subject Condition Sets
- Registered Resources
- Resource Mappings
- Key Access Grants (KAS Grants)
