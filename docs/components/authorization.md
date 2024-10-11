---
sidebar_position: 1
---

# Authorization Service

The Authorization service makes access decisions based on Attribute-Based Access Control (ABAC) policies and evaluates subject mappings to assign attributes to specific entities. The service provides two endpoints: **GetEntitlements** and **GetDecisions**.

## GetEntitlements

The `GetEntitlements` endpoint takes a list of entities and returns the attributes to which each entity is entitled. Entitlements are based on subject mappings, as described in the [policy documentation](./policy/subject_mappings), and the entity data returned by the [entity resolution service](./entity_resolution).

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

An example GetEntitlements request:

```
{
  "entities": [
    {
      "id": "e1",
      "emailAddress": "alice@example.com",
      "category": "CATEGORY_SUBJECT"
    },
    {
      "id": "e2",
      "userName": "bob",
      "category": "CATEGORY_SUBJECT"
    }
  ],
  "scope": {
    "attributeValueFqns": [
      "https://example.com/attr/attr1/value/value1",
      "https://example.com/attr/attr1/value/value2"
    ]
  }
}
```

The first input is a list of entities as defined above. The second is an optional attribute scope; if provided, the service will only return the entitlements contained within the specified scope. The attributes provided in the scope must be formatted as [FQNs](./policy/attributes#fully-qualified-names).

Below is an example response to the above GetEntitlements request:

```
{
  "entitlements": [
    {
      "entity_id": "e1",
      "attribute_value_fqns": [
        "https://example.com/attr/attr1/value/value1"
      ]
    },
    {
      "entity_id": "e2",
      "attribute_value_fqns": [
        "https://example.com/attr/attr1/value/value1",
        "https://example.com/attr/attr1/value/value2"
      ]
    }
  ]
}
```

The entities in the response can be mapped back to the original input using the entity ID. The "attribute_value_fqns" field includes a list of attribute FQNs to which that particular entity has been entitled. If no scope was provided, this field will include **ALL** of the attribute entitlements for that entity.

## GetDecisions

The `GetDecisions` endpoint evaluates access control rules for one or more entity chains and resources. It checks whether entities have permission to perform specified actions on resources, based on provided attributes.

An example `GetDecisions` request looks like this:

```json
{
  "decisionRequests": [
    {
      "actions": [
        {
          "standard": "STANDARD_ACTION_DECRYPT"
        }
      ],
      "entityChains": [
        {
          "entities": [
            {
              "id": "e1",
              "emailAddress": "bob@example.com",
              "category": "CATEGORY_SUBJECT"
            },
            {
              "id": "e2",
              "userName": "alice",
              "category": "CATEGORY_SUBJECT"
            }
          ],
          "id": "ec1"
        },
        {
          "entities": [
            {
              "id": "e1",
              "clientId": "client1",
              "category": "CATEGORY_ENVIRONMENT"
            }
          ],
          "id": "ec2"
        }
      ],
      "resourceAttributes": [
        {
          "attributeValueFqns": [
            "https://example.com/attr/attr1/value/value1"
          ],
          "resourceAttributesId": "ra-set-1"
        },
        {
          "attributeValueFqns": [
            "https://example.com/attr/attr1/value/value2",
            "https://example.com/attr/attr1/value/value3"
          ],
          "resourceAttributesId": "ra-set-2"
        }
      ]
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
      "action": {
        "standard": "STANDARD_ACTION_DECRYPT"
      },
      "decision": "DECISION_DENY",
      "obligations": []
    },
    {
      "entity_chain_id": "ec2",
      "resource_attributes_id": "ra-set-1",
      "action": {
        "standard": "STANDARD_ACTION_DECRYPT"
      },
      "decision": "DECISION_PERMIT",
      "obligations": []
    },
    {
      "entity_chain_id": "ec1",
      "resource_attributes_id": "ra-set-2",
      "action": {
        "standard": "STANDARD_ACTION_DECRYPT"
      },
      "decision": "DECISION_PERMIT",
      "obligations": []
    },
    {
      "entity_chain_id": "ec2",
      "resource_attributes_id": "ra-set-2",
      "action": {
        "standard": "STANDARD_ACTION_DECRYPT"
      },
      "decision": "DECISION_PERMIT",
      "obligations": []
    }
  ]
}
```

In this response, there are four entries — one for each combination of entity chain and resource attribute set. The decision determines whether an entity chain is permitted to access resources with a given attribute set. For example, Bob and Alice do not have access to "ra-set-1", but Client1, being an environment entity, is automatically granted **DECISION_PERMIT** because environment entities are excluded from attribute-based decisions.
