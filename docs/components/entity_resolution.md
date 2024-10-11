# Entity Resolution Service

The entity resolution service is an IDP-specific service that interacts with the Identity Provider (IDP) to retrieve information about entities required by the Authorization service. The service provides two endpoints: **CreateEntityChainFromJwt** and **ResolveEntities**.

As this service may vary between IDPs, platform consumers must implement their own entity resolution service for the IDP they choose. It should follow the provided [protos](https://github.com/opentdf/platform/blob/main/service/entityresolution/entity_resolution.proto).

## Create Entity Chain from JWT

This endpoint takes JWTs (usually IDP access tokens) and converts them into [entity chains](../overview.md#entity-chains). As stated in the authorization documentation, multiple entities can be involved in a request. The token is parsed, the entities are categorized as either subjects or environments, and an entity chain is formed to ensure the relevant entities have the necessary entitlements. This endpoint is primarily used by the Key Access Server (KAS) to create an entity chain from the access token received during a rewrap request.

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

The `ResolveEntities` endpoint resolves a list of entities, using the IDs from a request to get further information about each entity from the IDP.

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
