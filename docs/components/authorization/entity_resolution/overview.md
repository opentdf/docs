
# Overview
The entity resolution service is an IDP-specific service that interacts with the Identity Provider (IDP) to retrieve information about entities required by the Authorization service. The service provides two endpoints: **CreateEntityChainFromJwt** and **ResolveEntities**.

As this service may vary between IDPs, platform consumers must implement their own entity resolution service for the IDP they choose. It should follow the provided [protos](https://github.com/opentdf/platform/blob/main/service/entityresolution/entity_resolution.proto).

## CreateEntityChainFromJwt
This endpoint takes JWTs (usually IDP access tokens) and converts them into [entity chains](../overview.md#entity-chains). As stated in the authorization documentation, multiple entities can be involved in a request. The token is parsed, the entities are categorized as either subjects or environments, and an entity chain is formed to ensure the relevant entities have the necessary entitlements. This endpoint is primarily used by the Key Access Server (KAS) to create an entity chain from the access token received during a rewrap request.

### Request and Response
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

An example response to this request:

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

### Request and Response
An example request to `ResolveEntities`:

```json
{
  "entities": [
    { "id": "e1" },
    { "id": "e2" }
  ]
}
```

An example response to this request:

```json
{
  "resolved_entities": [
    {
      "id": "e1",
      "data": {
        "clientId": "client1",
        "user_name": "alice",
        "category": "CATEGORY_SUBJECT"
      }
    },
    {
      "id": "e2",
      "data": {
        "clientId": "client2",
        "user_name": "bob",
        "category": "CATEGORY_SUBJECT"
      }
    }
  ]
}
```

In the above example, each entity in the request is resolved into its corresponding entity data.
