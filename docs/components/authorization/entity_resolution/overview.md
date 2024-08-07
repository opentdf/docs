# Overview
The entity resolution service is an IDP specific service that interacts with the IDP to get information about entities required by the authorization service. The service has two endpoints **CreateEntityChainFromJwt** and **ResolveEntities**. 
As the service may differ from IDP to IDP, the platform consumer is required to implement their own entity resolution service for the IDP they choose to use. The service must follow the provided [protos](https://github.com/opentdf/platform/blob/main/service/entityresolution/entity_resolution.proto).

## CreateEntityChainFromJwt
This endpoint takes JWTs (usually representing IDP access tokens) and converts them into [entity chains](../overview.md#entity-chains). As stated in the authorization docs, more than one entity can be involved in a particular request. We must parse these entities from the token, categorize the entities as either subject or environment, and form an entity chain to ensure the relevant entities have the required entitlements. This endpoint is primarily used by KAS to form an entity chain from the access token it recieves on a rewrap request.

### Request and Response
Below is an example request to CreateEntityChainFromJwt containing a list of tokens and IDs for each token:
```
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

Below is an example response to the above request:
```
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
    },
  ]
}
```
Each token resolved to a chain with multiple entities including a client and user. 

## ResolveEntities
This endpoint takes a list of entities and resolves them with the IDP to entity representations. As this service is implemented by the platform consumer, it is up to the implementer to build the entity representations. For example, in the Keycloak entity resolution service implementation we return the json client/user representations that the service retrieves from Keycloak.
These entity representations will be used in the subject mapping evaluation to determine whether to map certain entitlements to each entity. The evaluation will check to see if specified selector fields in the entity representation match expected values and will assign entitlements if so. See the [policy docs](../../policy/subject_mappings/overview.md#subject-mapping-for-contributors) for more information on subject mappings and subject external value selectors.

### Request and Response
Below is an example request to ResolveEntities including a list of entities to resolve:
```
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

An example response from the Keycloak specific entity resolution service includes the client and user representations returned by the Keycloak api:
```
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