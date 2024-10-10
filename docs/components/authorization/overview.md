
---
sidebar_position: 1
---

# Overview

The Authorization service makes access decisions based on Attribute-Based Access Control (ABAC) policies and evaluates subject mappings to assign attributes to specific entities. The service provides two endpoints: **GetEntitlements** and **GetDecisions**.

## GetEntitlements

The `GetEntitlements` endpoint takes a list of entities and returns the attributes to which each entity is entitled. Entitlements are based on subject mappings, as described in the [policy documentation](../policy/subject_mappings/overview.md), and the entity data returned by the [entity resolution service](entity_resolution/overview.md).

### Entities

An entity is any being or structure interacting with the platform. A **person entity (PE)** represents an actual user, while a **non-person entity (NPE)** represents a system or program interacting on behalf of a user or via automation.

Entities are categorized into two types:

- **Subject entities**: These include PEs or NPEs and are evaluated in access decisions.
- **Environment entities**: These are excluded from access decisions.

Entities can be identified using various methods, as shown in the proto definition:

```protobuf
message Entity {
  string id = 1; // Ephemeral ID for tracking between request and response

  // Standard entity types supported by the platform
  oneof entity_type {
    string email_address = 2;
    string user_name = 3;
    string remote_claims_url = 4;
    string uuid = 5;
    google.protobuf.Any claims = 6;
    EntityCustom custom = 7;
    string client_id = 8;
  }

  // Categories for entity classification
  enum Category {
    CATEGORY_UNSPECIFIED = 0;
    CATEGORY_SUBJECT = 1;
    CATEGORY_ENVIRONMENT = 2;
  }
  Category category = 9;
}
```

Entities are passed to the entity resolution service's `Resolve` method to be processed.

## GetDecisions

The `GetDecisions` endpoint evaluates access control rules for one or more entity chains and resources. It checks whether entities have permission to perform specified actions on resources, based on provided attributes.

An example `GetDecisions` request looks like this:

```json
{
  "entity_chains": [
    {
      "id": "ec1",
      "entities": [
        {
          "id": "bob",
          "category": "CATEGORY_SUBJECT"
        },
        {
          "id": "alice",
          "category": "CATEGORY_SUBJECT"
        }
      ]
    },
    {
      "id": "ec2",
      "entities": [
        {
          "id": "client1",
          "category": "CATEGORY_ENVIRONMENT"
        }
      ]
    }
  ],
  "resource_sets": [
    {
      "attributes": [
        { "key": "resource-type", "value": "file" },
        { "key": "classification", "value": "confidential" }
      ],
      "resourceAttributesId": "ra-set-1"
    },
    {
      "attributes": [
        { "key": "resource-type", "value": "file" },
        { "key": "classification", "value": "internal" }
      ],
      "resourceAttributesId": "ra-set-2"
    }
  ]
}
```

In this example, there are two entity chains: one with users Bob and Alice (both categorized as subject entities) and the other with Client1 (categorized as an environment entity). The request evaluates whether these entity chains have permission to **DECRYPT** two resources with specific attributes.

An example `GetDecisions` response:

```json
{
  "decision_responses": [
    {
      "entity_chain_id": "ec1",
      "resource_attributes_id": "ra-set-1",
      "action": { "standard": "STANDARD_ACTION_DECRYPT" },
      "decision": "DECISION_DENY",
      "obligations": []
    },
    {
      "entity_chain_id": "ec2",
      "resource_attributes_id": "ra-set-1",
      "action": { "standard": "STANDARD_ACTION_DECRYPT" },
      "decision": "DECISION_PERMIT",
      "obligations": []
    },
    {
      "entity_chain_id": "ec1",
      "resource_attributes_id": "ra-set-2",
      "action": { "standard": "STANDARD_ACTION_DECRYPT" },
      "decision": "DECISION_PERMIT",
      "obligations": []
    },
    {
      "entity_chain_id": "ec2",
      "resource_attributes_id": "ra-set-2",
      "action": { "standard": "STANDARD_ACTION_DECRYPT" },
      "decision": "DECISION_PERMIT",
      "obligations": []
    }
  ]
}
```

In this response, there are four entries—one for each combination of entity chain and resource attribute set. The decision determines whether an entity chain is permitted to access resources with a given attribute set. For example, Bob and Alice do not have access to "ra-set-1", but Client1, being an environment entity, is automatically granted **DECISION_PERMIT** because environment entities are excluded from attribute-based decisions.
