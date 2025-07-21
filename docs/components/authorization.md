---
sidebar_position: 1
---

# Authorization Service

The Authorization service makes access decisions based on Attribute-Based Access Control (ABAC) policies and evaluates subject mappings and attribute definition rules to determine allowed actions on attribute values for specified entities.

An entity is any being or principal interacting with the platform. A **person entity (PE)** represents an actual user, while a **non-person entity (NPE)** represents a system or program interacting on behalf of a user/organization or via automation.

Entities are categorized into two types:

- **Subject entities**: These include PEs or NPEs and are evaluated in access decisions.
- **Environment entities**: These are excluded from access decisions.

Two versions of Authorization Service are currently served simultaneously by the platform, with v1 being deprecated soon:
- [v2](#v2-latest)
- [v1](#v1-soon-to-be-deprecated)

## v2 (latest)

### Changes

Version 2 of Authorization Service introduced the following changes:
- Consideration of policy [actions](./policy/actions.md) from [subject mappings](./policy/subject_mappings.md) in entitlement decisions
- API structure and clarity improvements
  - [entity identifier](#entity-identifier)
  - multiplexing design within decisioning
  - removal of scopes when retrieving entitlements, in deference to decision APIs
- Removal of configurable custom `rego` support

#### Entity Identifier

The entity identifier is a request proto object allowing multiple structures representing an entity to stand in as the entity in an Auth Service request:
- an Entity Chain (the response from an `entityresolutionservice.v2.CreateEntityChainsFromTokens` call)
- a Token (access token JWT)
- the FQN of a Registered Resource Value (_EXPERIMENTAL_)

#### Resource

The resource is a request proto object allowing multiple structures representing a resource to stand in as the resource in an Auth Service Decision request:
- a list of Attribute Values FQNs
- the FQN of a Registered Resource Value (_EXPERIMENTAL_)

### GetEntitlements

The `GetEntitlements` endpoint takes an Entity Identifier and returns the entitled actions per attribute value back (entitlements).

Entitlements are driven by subject mappings, as described in the [policy documentation](./policy/subject_mappings), and the entity data returned by the [entity resolution service](./entity_resolution).

The request flag `with_comprehensive_hierarchy` will drive response behavior for attribute values on definitions with a `hierarchy` rule. If the flag
is omitted or passed with value `false`, the response will contain strictly the resolved subject mappings' entitled actions for each attribute value.
However, if it is set to `true` in a request, actions will propagate down hierarchically to each lower-hierarchy attribute value within the response. This propagation behavior is the same utilized during `GetDecision` flows to drive ABAC entitlement between entities and resources.

Say there are three subject mappings for a single entity as the EntityIdentifier ephemeral ID `entity_xyz`:
1. contains actions `read, update` and a mapped attribute value `https://example.com/attr/department/value/engineering` on an ANY_OF definition
2. contains action `read` and a mapped attribute value `https://example.com/attr/level/value/higher` on a HIERARCHY definition containing values `higher, medium, lower`, which therefore gets propagated down comprehensively
3. contains action `delete` and a mapped attribute value `https://example.com/attr/level/value/lower` on a HIERARCHY definition containing values `higher, medium, lower`

The `GetEntitlements` response would look like the below if `with_comprehensive_hierarchy` is set to `true`:

```json
{
  "entitlements":[
    {
      "ephemeral_id":"entity_xyz",
      "actions_per_attribute_value_fqn":{
        "https://example.com/attr/level/value/higher":{
          "actions":[
            {
              "id":"<action policy object UUID>",
              "name":"read"
            }
          ]
        },
        "https://example.com/attr/level/value/medium":{
          "actions":[
            {
              "id":"<action policy object UUID>",
              "name":"read"
            }
          ]
        },
        "https://example.com/attr/level/value/lower":{
          "actions":[
            {
              "id":"<action policy object UUID>",
              "name":"delete"
            },
            {
              "id":"<action policy object UUID>",
              "name":"read"
            }
          ]
        },
        "https://example.com/attr/department/value/engineering":{
          "actions":[
            {
              "id":"<action policy object UUID>",
              "name":"read"
            },
            {
              "id":"<action policy object UUID>",
              "name":"update"
            }
          ]
        },
      }
    }
  ]
}
```

### GetDecision, GetDecisionMultiResource, GetDecisionBulk

The `GetDecision` endpoints evaluate access control permissions over entities, actions, and resources.

The [request/response protos](https://github.com/opentdf/platform/blob/main/service/authorization/v2/authorization.proto) define
structures for more specific decisioning flows than the v1 catch-all `GetDecisions` endpoint.

In all decision flows, the access logic is as follows:
1. given the Entity Identifier, which Subject Mappings in Policy are relevant and resolve to true?
2. given the Subject Mappings, which contained Actions are entitled on which Attribute Values?
3. given the entitled Actions per each Attribute Value, which Attribute Definitions are relevant to the Resource attributes?
4. given the relevant entitlements and resource attributes, are the attribute definition rules satisfied by the entity's entitlements
for the requested action name?

In other words, a Decision will be to _deny_ if:
1. no subject mappings apply to an entity
2. some subject mappings apply to an entity, but none containing the specific requested action
3. some subject mappings apply to an entity, but they only entitle the specific requested action on attribute values other than
those of the requested resource
4. the subject mappings entitle some of the resource's attribute values for the requested action, but not enough to satisfy the attribute definition rule (ANY_OF, ALL_OF, HIERARCHY) given the requested resource's attribute values

Endpoints:
1. `GetDecision`: can this entity take this action on this resource?
  - one Entity Identifier
  - one Action (`name` is required)
  - one Resource
2. `GetDecisionMultiResource`: can this entity take this action on these resources?
  - one Entity Identifier
  - one Action (`name` is required)
  - multiple Resources
3. `GetDecisionBulk`: more performant batch processing of multiple `GetDecisionMultiResource` requests
  - useful for multiple entities
  - useful for multiple actions

## v1 (soon to be deprecated)

### GetEntitlements

The `GetEntitlements` endpoint takes a list of entities and returns the attributes to which each entity is entitled. Entitlements are based on subject mappings, as described in the [policy documentation](./policy/subject_mappings), and the entity data returned by the [entity resolution service](./entity_resolution).

#### Entities

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

The first input is a list of entities as defined above. The second is an optional attribute scope; if provided, the service will only return the entitlements contained within the specified scope. The attributes provided in the scope must be formatted as [FQNs](./policy/attributes).

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

### GetDecisions

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
