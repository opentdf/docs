# Entity Resolution Service

The entity resolution service is an IdP-specific service that interacts with the Identity Provider (IdP) to retrieve information about entities required by the Authorization service. The service provides two endpoints: **CreateEntityChainFromJwt** and **ResolveEntities**.

As this service may vary between IdP, platform consumers must implement their own entity resolution service for the IdP they choose. It should follow the provided [protos](https://github.com/opentdf/platform/blob/main/service/entityresolution/entity_resolution.proto).

## Create Entity Chain from JWT

This endpoint takes JWTs (usually IdP access tokens) and converts them into entity chains. As stated in the authorization documentation, multiple entities can be involved in a request. The token is parsed, the entities are categorized as either subjects or environments, and an entity chain is formed to ensure the relevant entities have the necessary entitlements. This endpoint is primarily used by the Key Access Server (KAS) to create an entity chain from the access token received during a rewrap request.

Below is an example request to `CreateEntityChainFromJwt`, containing a list of tokens and their IDs:

```json
{
  "tokens": [
    {
      "id": "tok1",
      "jwt": "xxxxxxx...."
    },
    {
      "id": "tok2",
      "jwt": "yyyyyy....."
    }
  ]
}
```

An example response to this `CreateEntityChainFromJwt` request:

```json
{
  "entity_chains": [
    {
      "id": "tok1",
      "entities": [
        {
          "id": "jwtentity-0",
          "client_id": "client1",
          "category": "CATEGORY_ENVIRONMENT"
        },
        {
          "id": "jwtentity-1",
          "user_name": "alice",
          "category": "CATEGORY_SUBJECT"
        }
      ]
    },
    {
      "id": "tok2",
      "entities": [
        {
          "id": "jwtentity-0",
          "client_id": "client2",
          "category": "CATEGORY_ENVIRONMENT"
        },
        {
          "id": "jwtentity-1",
          "user_name": "bob",
          "category": "CATEGORY_SUBJECT"
        }
      ]
    }
  ]
}
```

## ResolveEntities

The `ResolveEntities` endpoint resolves a list of entities, using the IDs from a request to get further information about each entity from the IdP.

An example request to `ResolveEntities`:

```json
{
  "entities": [
    {
      "id": "e1",
      "userName": "alice",
      "category": "CATEGORY_SUBJECT"
    },
    {
      "id": "e2",
      "clientId": "client1",
      "category": "CATEGORY_ENVIRONMENT"
    }
  ]
}
```

An example response to this `ResolveEntities` request:

```json
{
  "entity_representations": [
    {
      "additional_props": [
        {
          "access": {
            "impersonate": false,
            "manage": false,
            "manageGroupMembership": false,
            "mapRoles": false,
            "view": true
          },
          "createdTimestamp": 1716485083260,
          "disableableCredentialTypes": [],
          "emailVerified": false,
          "enabled": true,
          "id": "09fb4171-9234-4707-ae57-d0088e0bc553",
          "requiredActions": [],
          "totp": false,
          "username": "alice"
        }
      ],
      "original_id": "e1"
    },
    {
      "additional_props": [
        {
          "access": {
            "configure": false,
            "manage": false,
            "view": true
          },
          "adminUrl": "",
          "attributes": {
            "backchannel.logout.revoke.offline.tokens": "false",
            "backchannel.logout.session.required": "true",
            "display.on.consent.screen": "false",
            "oauth2.device.authorization.grant.enabled": "false",
            "oidc.ciba.grant.enabled": "false"
          },
          "authenticationFlowBindingOverrides": {},
          "baseUrl": "",
          "bearerOnly": false,
          "clientAuthenticatorType": "client-secret",
          "clientId": "client1",
          "consentRequired": false,
          "defaultClientScopes": [
            "web-origins",
            "acr",
            "profile",
            "roles",
            "email"
          ],
          "description": "",
          "directAccessGrantsEnabled": true,
          "enabled": true,
          "frontchannelLogout": false,
          "fullScopeAllowed": true,
          "id": "dea60e4e-05df-418e-a4a8-c5ae0b38855b",
          "implicitFlowEnabled": false,
          "name": "client1",
          "nodeReRegistrationTimeout": -1,
          "notBefore": 0,
          "optionalClientScopes": [
            "address",
            "phone",
            "offline_access",
            "microprofile-jwt"
          ],
          "protocol": "openid-connect",
          "protocolMappers": [
            {
              "config": {
                "access.token.claim": "true",
                "id.token.claim": "true",
                "included.custom.audience": "http://localhost:8080",
                "userinfo.token.claim": "true"
              },
              "consentRequired": false,
              "id": "4b44a437-ea88-4994-8533-af683cde90c5",
              "name": "audience-mapper",
              "protocol": "openid-connect",
              "protocolMapper": "oidc-audience-mapper"
            },
          ],
          "publicClient": false,
          "redirectUris": [],
          "rootUrl": "",
          "secret": "secret",
          "serviceAccountsEnabled": true,
          "standardFlowEnabled": true,
          "surrogateAuthRequired": false,
          "webOrigins": []
        }
      ],
      "original_id": "e2"
    }
  ]
}
```

In the above example, each entity in the request is resolved into its corresponding entity data.

## Built-In Entity Resolution Services

The platform includes two built-in Entity Resolution Services (ERS): **Keycloak ERS** and **Claims ERS**. These services provide flexibility for different use cases and IdP configurations.

### Keycloak Entity Resolution Service
The **Keycloak ERS** is tightly integrated with Keycloak, a popular open-source identity and access management solution. It retrieves entity information directly from Keycloak's APIs and is ideal for environments where Keycloak is the primary IdP.

#### Key Features:
- Direct integration with Keycloak's identity management system.
- Supports resolving entities using Keycloak-specific attributes and roles.
- Leverages Keycloak's APIs for detailed entity information.

#### Behavior of `CreateEntityChainFromJwt`
The **Keycloak ERS** processes each JWT by interacting with Keycloak's APIs to extract entity information. The behavior includes:
- Parsing the JWT to extract claims such as `client_id` and `username`.
- Categorizing entities as either `CATEGORY_SUBJECT` (e.g., users) or `CATEGORY_ENVIRONMENT` (e.g., clients or service accounts).
- Constructing an entity chain for each token, where each chain contains the extracted entities and their associated metadata.

For example:
- A token with a `client_id` claim is resolved into a chain with the client as the environment entity and the client service account as the subject entity.
- A token with a `username` claim is resolved into a chain with the user as the subject entity and the client as the environment entity.

#### Behavior of `ResolveEntities`
The **Keycloak ERS** resolves entities by querying Keycloak's APIs based on the provided entity identifiers (e.g., `email`, `username`, or `client_id`). The behavior includes:
- Looking up users or clients in Keycloak using the provided identifiers.
- Returning detailed entity representations, including attributes such as roles, permissions, and metadata.

For example:
- An entity with an `email` identifier is resolved into a user entity with detailed attributes.
- An entity with a `client_id` identifier is resolved into a client entity with its associated permissions.

### Claims Entity Resolution Service
The **Claims ERS** is a more flexible service that resolves entities based on claims embedded in tokens (e.g., JWTs). It is designed for environments where tokens come from multiple sources or where Keycloak is not used.

#### Key Features:
- Processes claims-based tokens to extract and resolve entities.
- Supports custom token formats and claims structures.
- Does not require Keycloak as a dependency.

#### Behavior of `CreateEntityChainFromJwt`
The **Claims ERS** processes each JWT by extracting claims directly from the token without relying on an external IdP. The behavior includes:
- Parsing the JWT to extract claims.
- Wrapping the claims in a structured format (e.g., `structpb.Struct`) for further processing.
- Categorizing all produced entities as `CATEGORY_SUBJECT`.
- Constructing an entity chain for each token, where each chain contains a single entity of type `claims` with the claims of that token.


#### Behavior of `ResolveEntities`
The **Claims ERS** resolves entities by processing the claims embedded in the provided entities. The behavior includes:
- Extracting claims from the entity's `claims` field.
- Converting the claims into a structured format for further processing.
- Returning detailed entity representations, including the extracted claims as additional properties.

For example:
- An entity with a `claims` field containing `roles` and `department` is resolved into a subject entity with those attributes.
- An entity with a `claims` field containing custom attributes is resolved into a subject entity with those custom attributes.

### Comparison: Keycloak ERS vs. Claims ERS

| Feature                        | Keycloak ERS                                   | Claims ERS                                   |
|--------------------------------|-----------------------------------------------|---------------------------------------------|
| **Primary Use Case**           | Keycloak-based identity resolution.           | Claims-based token resolution.              |
| **Integration**                | Tightly coupled with Keycloak.                | Works with any token format containing claims. |
| **Customization**              | Limited to Keycloak's identity model.         | Highly customizable for different token formats. |
| **Dependency**                 | Requires Keycloak as the IdP.                 | No external dependency on Keycloak.         |

---

## Selecting an Entity Resolution Service

You can configure which ERS to use by updating the platform's configuration file (e.g., `config.yaml`).
```yaml
services:
  entityresolution:
    mode: "claims" # Options: "keycloak", "claims"
```

### Default Behavior:
If no ERS is specified, the platform defaults to the Keycloak ERS.

By configuring the appropriate ERS, you can tailor the platform to your specific IdP and token requirements.

## Examples

### Claims Entity Resolution Service with Token and Subject Mapping

This example demonstrates how the **Claims Entity Resolution Service (ERS)** processes a token to resolve claims into entities and maps a specific claim value to an attribute using a subject mapping.

#### Scenario

A user has a token with the following claims:
```json
{
  "sub": "user123",
  "roles": ["developer", "admin"],
  "department": "engineering"
}
```
We want to map the `department` claim `"engineering"` to an attribute that grants access to a specific resource.

#### Step 1: Token Processing by Claims ERS
The **Claims ERS** processes the token to extract claims and resolve them into entities. The getEntitiesFromToken function in the Claims ERS converts the token into an entity representation.

##### Resolved entity:
```json
{
  "id": "jwtentity-claims",
  "category": "CATEGORY_SUBJECT",
  "additional_props": [
    {
      "department": "engineering",
      "roles": ["developer", "admin"]
    }
  ]
}
```

#### Step 2: Subject Mapping Configuration
The subject mapping defines how the `department` claim is mapped to an attribute. For example:
```yaml
subject_mappings:
  - attribute_value_id: "74babca6-016f-4f3e-a99b-4e46ea8d0fd8" # ID of the attribute value
    subject_condition_set:
      conditions:
        - key: "department"
          operator: "SUBJECT_MAPPING_OPERATOR_ENUM_IN"
          values:
            - "engineering"
```
This configuration specifies:

- The `department` claim must have the value `"engineering"`.
- If the condition is met, the user is granted the attribute with ID `74babca6-016f-4f3e-a99b-4e46ea8d0fd8`.

#### Step 3: Subject Mapping Evaluation
The resolved entity is evaluated against the subject mapping. The `department` claim matches the condition `"engineering"`, so the mapping is applied.

Evaluation Logic:

1. The `department` claim is extracted from the resolved entity.
2. The value `"engineering"` is checked against the subject mapping condition.
3. Since the condition is satisfied, the attribute value (`74babca6-016f-4f3e-a99b-4e46ea8d0fd8`) is granted.

#### Step 4: Result
The user is granted an entitlement to the attribute value corresponding to `74babca6-016f-4f3e-a99b-4e46ea8d0fd8`. Ex: `https://example.com/attr/department/value/engineering`


#### Summary
This example illustrates how the **Claims ERS** processes a token, resolves claims into entities, and evaluates subject mappings to grant entitlements. By defining subject mappings, administrators can enforce fine-grained access control based on token claims.
