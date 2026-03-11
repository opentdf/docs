# Entity Resolution Service

The Entity Resolution Service (ERS) is a platform-internal service that produces **Entity Representations** — normalized views of an entity's identity attributes — for use by the Authorization Service when evaluating Subject Mappings.

ERS is bundled into the platform and runs automatically as part of the default deployment (`mode: all`). There is no separate ERS service to set up.

:::note Keycloak as IdP vs. Keycloak ERS
These are two different things:
- **Keycloak as IdP**: authenticates users and issues JWT tokens. This is always external to the platform.
- **Keycloak ERS mode**: after receiving a token, ERS calls the Keycloak **Admin API** to fetch additional user data (custom attributes, groups, roles) that may not be in the JWT. This is one of three available ERS modes.

You can use Keycloak as your IdP without using Keycloak ERS mode — configure `mode: claims` and ERS will use JWT claims directly without calling back to Keycloak.
:::

:::note Entity categories and Subject Mappings
ERS categorizes entities from a token as either:
- **`CATEGORY_SUBJECT`** (users): evaluated against Subject Mappings to determine entitlements
- **`CATEGORY_ENVIRONMENT`** (OIDC clients / service accounts): tracked in audit logs but **not** evaluated in access decisions

In a standard user-auth flow, the user is `CATEGORY_SUBJECT` and the OIDC client is `CATEGORY_ENVIRONMENT`. In a client credentials (service account) flow with no human user, the client itself becomes `CATEGORY_SUBJECT` and requires its own Subject Mappings.

Note: Claims ERS categorizes all entities as `CATEGORY_SUBJECT`. Keycloak ERS distinguishes between users and clients.
:::

## Built-In Entity Resolution Services

The platform ships with three ERS implementations. Choose based on your identity backend and deployment needs.

### Keycloak ERS (default)

The **Keycloak ERS** is tightly integrated with Keycloak. It retrieves entity information directly from Keycloak's Admin API and is ideal for environments where Keycloak is the primary IdP.

**Key features:**
- Direct integration with Keycloak's identity management system.
- Resolves entities using Keycloak-specific user properties and roles.
- Returns rich entity representations including roles, permissions, and metadata.

**How it works:**

For `CreateEntityChainsFromTokens` / `CreateEntityChainFromJwt`: the JWT is parsed to extract claims such as `client_id` and `username`. Entities are categorized as `CATEGORY_SUBJECT` (users) or `CATEGORY_ENVIRONMENT` (clients/service accounts), then formed into an entity chain.

For `ResolveEntities`: Keycloak's APIs are queried by the provided identifiers (`email`, `username`, or `client_id`) to return detailed entity representations.

### Claims ERS

The **Claims ERS** resolves entities directly from the claims embedded in tokens. It is designed for environments where tokens come from multiple IdPs or where Keycloak is not used.

**Key features:**
- Works with any token format containing standard claims.
- Does not require Keycloak or any external identity system.
- Highly customizable for different token structures.

**How it works:**

For `CreateEntityChainsFromTokens` / `CreateEntityChainFromJwt`: claims are extracted directly from the JWT without an external lookup. All produced entities are categorized as `CATEGORY_SUBJECT`.

For `ResolveEntities`: claims from the entity's `claims` field are extracted and returned as additional properties on the entity representation.

### Comparison

| Feature              | Keycloak ERS                              | Claims ERS                              | Multi-Strategy ERS (Preview)                        |
|----------------------|-------------------------------------------|-----------------------------------------|-----------------------------------------------------|
| **Best for**         | Keycloak-based deployments                | Multi-IdP or non-Keycloak environments  | Heterogeneous identity systems (SQL, LDAP, JWT)     |
| **Entity data**      | Full Keycloak user/client objects         | JWT claims as-is                        | Normalized claims from any backend                  |
| **External calls**   | Yes — Keycloak Admin API                  | No                                      | Yes — SQL / LDAP (configurable)                     |
| **Customization**    | Limited to Keycloak's identity model      | Highly flexible                         | Highly flexible, with 16 built-in transformations   |
| **Status**           | Stable                                    | Stable                                  | Preview (v2 only)                                   |

### Multi-Strategy ERS (Preview)

:::caution Preview
The Multi-Strategy ERS is available on the v2 API only and is under active development. APIs and configuration options may change before it reaches stable status.
:::

The **Multi-Strategy ERS** consolidates SQL, LDAP, and JWT Claims backends into a single service with intelligent routing. It is designed for organizations with heterogeneous identity systems — for example, a primary SQL user store combined with an LDAP directory for group membership.

**Key features:**
- Routes entity resolution dynamically based on JWT context (e.g., which claims are present).
- Supports SQL databases (PostgreSQL, SQLite), LDAP/Active Directory, and JWT claims as backends.
- Cross-backend failover: if one backend fails, another can continue (`failure_strategy: continue`).
- Built-in data transformations to normalize values across sources (e.g., `csv_to_array`, `ldap_dn_to_cn_array`, `postgres_array`).

**Configuration:**

```yaml
services:
  entityresolution:
    mode: "multi-strategy"
    failure_strategy: "continue"  # "fail-fast" (default) or "continue"
    providers:
      jwt_claims:
        type: claims
      primary_db:
        type: sql
        connection:
          driver: postgres
          host: localhost
          port: 5432
          database: identity_db
          username: ers_user
          password: ers_password
      corporate_ldap:
        type: ldap
        connection:
          host: ldap.company.com
          port: 636
          use_tls: true
          bind_dn: "cn=service,ou=apps,dc=company,dc=com"
          bind_password: "secret"
    mapping_strategies:
      # Strategies are evaluated in order; the first matching strategy is used (or all, with continue)
      - name: jwt_fast_path
        provider: jwt_claims
        entity_type: subject
        # ... conditions and output_mapping
```

For full configuration details, see the [multi-strategy ERS README](https://github.com/opentdf/platform/blob/main/service/entityresolution/multi-strategy/README.md) in the platform repository.

### Configuration

Set the ERS mode in your platform configuration file:

```yaml
services:
  entityresolution:
    mode: "claims" # Options: "keycloak" (default), "claims", "multi-strategy" (preview)
```

If no mode is specified, the platform defaults to the Keycloak ERS.

---

## API Reference

Two versions of the ERS API are currently served simultaneously. **v2 is recommended** — v1 is deprecated and will be removed in a future release.

## v2 (latest)

v2 improves on v1 by using `ephemeral_id` instead of `id` for tokens and entities, making it explicit that these identifiers are request-scoped and not persistent. It also renames the token endpoint to `CreateEntityChainsFromTokens` (plural) to better reflect that multiple chains are returned.

### CreateEntityChainsFromTokens

This endpoint takes JWT tokens (usually IdP access tokens) and converts them into entity chains.

Steps:

1. parse provided token
2. categorize entities found within the token as either `subject` or `environment`
3. construct an entity chain for use within entitlement decisioning

If Authorization Service (v2) requests are made with tokens representing the entities, this endpoint is utilized to
break out subject and environment entities for decisioning.

Below is an example request to `CreateEntityChainsFromTokens`, containing a list of tokens and their IDs:

```json
{
  "tokens": [
    {
      "ephemeral_id": "tok1",
      "jwt": "xxxxxxx...."
    },
    {
      "ephemeral_id": "tok2",
      "jwt": "yyyyyy....."
    }
  ]
}
```

An example response to this `CreateEntityChainsFromTokens` request:

```json
{
  "entity_chains": [
    {
      "ephemeral_id": "tok1",
      "entities": [
        {
          "ephemeral_id": "jwtentity-0",
          "client_id": "client1",
          "category": "CATEGORY_ENVIRONMENT"
        },
        {
          "ephemeral_id": "jwtentity-1",
          "user_name": "alice",
          "category": "CATEGORY_SUBJECT"
        }
      ]
    },
    {
      "ephemeral_id": "tok2",
      "entities": [
        {
          "ephemeral_id": "jwtentity-0",
          "client_id": "client2",
          "category": "CATEGORY_ENVIRONMENT"
        },
        {
          "ephemeral_id": "jwtentity-1",
          "user_name": "bob",
          "category": "CATEGORY_SUBJECT"
        }
      ]
    }
  ]
}
```

### ResolveEntities

The `ResolveEntities` endpoint resolves a list of entities, using the IDs from a request to get further information about each entity from the IdP.

An example request to `ResolveEntities`:

```json
{
  "entities": [
    {
      "ephemeral_id": "e1",
      "user_name": "alice",
      "category": "CATEGORY_SUBJECT"
    },
    {
      "ephemeral_id": "e2",
      "client_id": "client1",
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

## v1 (deprecated)

:::warning
v1 is deprecated and will be removed in a future release. Migrate to [v2](#v2-latest).
:::

The primary differences from v2:
- Token and entity identifiers use `id` instead of `ephemeral_id`.
- The token endpoint is named `CreateEntityChainFromJwt` (singular) rather than `CreateEntityChainsFromTokens`.

### CreateEntityChainFromJwtRequest

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

### ResolveEntities

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

## Examples

### Claims ERS with Token and Subject Mapping

This example demonstrates how the **Claims ERS** processes a token to resolve claims into entities and maps a specific claim value to an attribute using a subject mapping.

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
The **Claims ERS** processes the token to extract claims and resolve them into entities.

##### Resolved entity:
```json
{
  "id": "jwtentity-claims",
  "category": "CATEGORY_SUBJECT",
  "additional_props": [
    {
      "sub": "user123",
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
      subject_sets:
        - condition_groups:
            - boolean_operator: AND
              conditions:
                - subject_external_selector_value: ".department"
                  operator: IN
                  subject_external_values:
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
