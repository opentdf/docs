# Subject Mappings

As data is bound to fully qualified Attribute Values when encrypted within a TDF, entities are associated with Attribute values through a mechanism called Subject Mappings.

Entities (subjects, users, machines, etc.) are represented by their identity as determined from an identity provider (IdP). After an entity has securely authenticated with the IdP, the client's token (OIDC/OAUTH2) will include claims or attributes that describe that identity. Subject Mappings define how to map these identity attributes to actions on attribute values defined in the OpenTDF platform Policy. For more details on how the platform integrates with the IdP and how entities are resolved, refer to the [Authorization documentation](../authorization).

```mermaid
graph LR;
Entity-->a(idP / ERS);
a(idP / ERS)-->b(Entity Representation);
b-- matching logic -->c(Subject Condition Set);
c-->d(Subject Mapping);
d-->e(Actions);
e-->f(Attribute Value);
```

## Composition

A Subject Mapping consists of:

1. A mapped [Attribute Value](./attributes)
2. A mapped Subject Condition Set
3. One or more policy [Actions](./actions)

```mermaid
graph LR;
A(Attribute Value)<--> B(Subject Mapping);
B(Subject Mapping)<--> D(Action);
B(Subject Mapping)<--> C(Subject Condition Set);
```

## Actions on Attribute Value

Subject Mappings link entities to one or more Actions they are allowed to take on Attribute Values, known as entitlements. 

For more information, see the [Attribute Value](./attributes) and the [Actions](./actions.md) documentation.

## Subject Condition Set

A Subject Condition Set is a logical structure to resolve a representation of the entity (an Access Token, EntityResolutionService response) to a boolean true or false. It contains multiple Subject Sets, each with Condition Groups, and each Condition Group contains Conditions. Each Subject Mapping links to one Attribute Value, but a Subject Condition Set can be reused across multiple Subject Mappings and Attribute Values.

### Examples

#### Subject Mapping for Executives:

Consider a flow where users with the idP role `vice_president` should be allowed to `read` data tagged `https://example.org/attr/role_level/value/vice_president`. 

The Subject Mapping would contain:
1. Action: `read`
2. Attribute Value: `https://example.org/attr/role_level/value/vice_president`
3. A Subject Condition Set with this matching logic:

<!-- TODO: this should be JSON, not YAML -->
```yaml
subject_sets:
  - condition_groups:
      - boolean_operator: OR
        conditions:
          - subject_external_selector_value: '.role'
            operator: IN
            subject_external_values:
              - vice_president
```

If the entity representation contains a field `role: vice_president`, the Subject Condition Set resolves `true`, so the Subject Mapping applies.

The inverse also applies, where an entity representation containing `role: <anything else>`, or lacking the `role` field completely will resolve `false`, and the Subject Mapping would not apply (no entitlement).

#### Subject Mapping for Contributors:

Consider a flow where engineers with titles like `staff`, `senior`, `junior`, or `intern` should be able to `create` data tagged as `https://example.org/attr/department_level/value/contributor`.

The Subject Mapping would contain:
1. Action: `create`
2. Attribute Value: `https://example.org/attr/department_level/value/contributor`
3. A Subject Condition Set with this matching logic:

<!-- TODO: this should be JSON, not YAML -->
```yaml
subject_sets:
  - condition_groups:
      - boolean_operator: AND
        conditions:
          - subject_external_selector_value: '.title'
            operator: IN
            subject_external_values:
              - staff
              - senior
              - junior
              - intern
          - subject_external_selector_value: '.department'
            operator: IN
            subject_external_values:
              - engineering
```

In plain language: If an entity's access token from the IdP or Entity Resolution Service (ERS) includes a `title` field with a value `staff`, `senior`, `junior`, or `intern` AND a `department` field with value `engineering`, then the Subject Mapping will apply to them, granting entitlement for the contained Action `create` on the Attribute Value of `contributor`.

