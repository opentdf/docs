---
sidebar_position: 1
slug: /explanation/platform-architecture/components/policy
---
# Policy

Policy is the all-encompassing name for configuration of cryptographically-bound Attribute Based Access Control (ABAC) within the Platform.

```mermaid
graph TD
    subgraph "External Concepts"
        ENTITIES[Entities]
        DATA[Data]
    end

    subgraph "Policy Components"
        SM[Subject Mappings]
        RM[Resource Mappings]
        ATTR[Attributes]
        ACTIONS[Actions]
        KM[Key Mappings]
    end

    ENTITIES --> SM --> ATTR
    DATA --> RM
    ACTIONS --> RM
    RM --> ATTR
    ATTR --> KM
```

TDF creation and decryption are driven by the Policy within a Platform instance and the TDF manifest. In other words, on a TDF decryption request, the platform services (KAS, Authorization) compare attributes on the TDF against the requester's entitlements to make a decision to release the key or not.

Components of Policy include:

- [Attributes](./attributes.md)
  - Namespaces
  - Definitions
  - Values
- [Actions](./actions.md)
- [Subject Mappings](./subject_mappings.md)
  - Subject Condition Sets
- [Registered Resources](./registered_resources.md)
- [Resource Mappings](./resource_mappings.md)
- [Key Mappings](./keymanagement/key_mappings.md)