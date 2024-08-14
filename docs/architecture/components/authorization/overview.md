---
sidebar_position: 1
---
# Overview

The authorization service is responsible for making access decisions based on attribute based access control(ABAC) policy as well as evaluating subject mappings to determine which attributes have been assigned to specific entities. The service provides two endpoints: **GetEntitlements** and **GetDecisions**.

## GetEntitlements

The GetEntitlements endpoint takes a list of entities and returns the attributes each entity is entitled. This entitlements is based off of the evaluation of the subject mappings described under the [policy documentation](../policy/subject_mappings/overview.md), and the entity representations returned from the [entity resolution service](entity_resolution/overview.md).

### Entites

An entity is any being or structure interacting with the platform. A person-entity (PE) represents an actual user/person while a non-person entity (NPE) can represent a system or program interacting with the platform on behalf of a user or via an automated process.
The authorization service accepts a variety of methods to identify an entity all listed in the defined proto below.

```
message Entity {
  string id = 1; // ephemeral id for tracking between request and response
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
}
```

This entity will be passed to the entity resolution service's Resolve endpoint which will get an entity respresentation from the IDP using the provided identifier.

### Request and Response

Below is an example GetEntitlements request:

```
{
  "entities": [
    {
      "id": "e1",
      "emailAddress": "alice@example.com"
    },
    {
      "id": "e2",
      "userName": "bob"
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

The first input is a list of entitites as defined above. The second is an optional attribute scope. If provided, the service will only return the entitlements contained within the scope. The attributes provided in the scope must be formatted as [FQNs](../policy/attributes/overview.md#fully-qualified-names).

Below is an example response to the above request:

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

The entities in the response can be mapped back to the original input using the entity ID. The "attribute_value_fqns" field includes a list of attribute FQNs that that particular entity has been entitled to. If no scope is provided, this field will include **ALL** the attributes a particular entity has been entitled to.

## GetDecisions

> **WARNING**: Actions are currently experimental

The GetDecisions endpoint takes a set of entity chains, sets of resource attributes, and a set of actions and returns a PERMIT or DENY decision for each combination of entity chain and resource attribute set for the given actions.
This endpoint is called from KAS to determine if a particular set of entities should have access to a piece of data during its rewrap operation.

### Entity Chains

Entity chains represent a group of entities. For example, a client may act on behalf of a user, and in that case both entities would be included in the chain as both are participating/interacting with the platform.
For a specific entity chain to be given a PERMIT decision, ALL entities in the chain must have the required entitlements.

### Resource Attribute Sets

Resource attribute sets are, as they sound, a set of attributes assigned to a particular resource. The attributes are identified in these sets via their FQNs.

### Request and Response

Below is an example GetDecisions request:

```
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
              "emailAddress": "bob@example.com"
            },
            {
              "id": "e2",
              "userName": "alice"
            }
          ],
          "id": "ec1"
        },
        {
          "entities": [
            {
              "id": "e1",
              "clientId": "client1"
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

In this example, there are two entity chains, one comprised of users bob and alice, and the other comprised of client1. This request seeks to evaluate whether these entity chains have permission to DECRYPT two resources with the provided attribute sets.

Below is an example GetDecisions response:

```
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
      "decision": "DECISION_DENY",
      "obligations": []
    }
  ]
}
```

In the response there are four entries, one for each combination of entity chain and resource attribute set, indicating whether that entity chain has permission access to data with that attribute set based on the attribute rules defined [here](../policy/attributes/overview.md#definitions). For example, we can see that client1 does not have access to the attribute set
"ra-set-2" while both alice and bob do have access to that set.
