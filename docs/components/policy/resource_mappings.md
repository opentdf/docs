# Resource Mappings

Resource Mappings associate various terms found within data to Attribute Values, serving as a mechanism for matching data tags to Attributes.

A Resource Mapping contains:

1. An associated `attribute value`.
2. A set of related `terms`.
3. An optional `group` (see [Resource Mapping Groups](#resource-mapping-groups) below).

The primary consumer of a Resource Mapping is a Policy Decision Point (PDP), which processes data, applies logic using the known terms, and relies on them to map the data to Attribute Values. By mapping a set of terms to a given attribute value, a Policy Enforcement Point (PEP) can properly apply the TDF to the resource data using the appropriate attribute values.

## Examples

Alice is a system administrator. She defines an Attribute definition called color with values like red, green, blue, purple, etc. For the Attribute Value `https://demo.com/attr/color/value/purple`, she would define a Resource Mapping for processing data that may involve terms like `indigo`, `lilac`, `plum`, or `lavender`.

Bob is a system administrator in the US Department of Defense (DoD). Bob defines a hierarchical attribute called classification with values of `topsecret`, `secret`, `confidential`, and `unclassified`. He needs to create a resource mapping that defines a normalization of the various short forms and acronyms that map to each of these classification levels. For the `topsecret` attribute value, he might include terms like `ts`, `top secret`, and `top-secret`. Whereas for unclassified he might include `u`, `uc`, or other variations.

## Resource Mapping Groups

Resource Mapping Groups organize multiple Resource Mappings into logical collections under a [Namespace](./attributes.md#namespaces). Groups allow you to manage sets of related mappings together, which is useful when resources share common access controls or need to be managed as a unit.

A Resource Mapping Group contains:

1. A **name** identifying the group.
2. A **namespace** that the group belongs to.
3. A **Fully Qualified Name (FQN)** derived from the namespace and group name.

### FQN Format

Each Resource Mapping Group has a unique FQN following this pattern:

```text
https://<namespace>/resm/<group-name>
```

For example, a group named `ntk` under the namespace `example.org` would have the FQN:

```text
https://example.org/resm/ntk
```

Like other FQN'd objects in the platform, Resource Mapping Group FQNs are normalized to lower case.

:::note FQN visibility in the CLI
The `otdfctl` CLI does not currently display the FQN when listing or getting Resource Mapping Groups. To determine a group's FQN, construct it from the namespace and group name using the format above.
:::

### Creating a Group and Assigning Mappings

Groups are created under a namespace, and individual Resource Mappings can be assigned to a group at creation or update time:

```bash
# Create a resource mapping group
otdfctl policy resource-mapping-groups create \
  --namespace-id <namespace-id> \
  --name my-group

# Create a resource mapping assigned to the group
otdfctl policy resource-mappings create \
  --attribute-value-id <value-id> \
  --terms "term1,term2,term3" \
  --group-id <group-id>
```

### Using Groups as Synonym Dictionaries

A Resource Mapping Group's FQN can be used as a synonym dictionary identifier in systems that resolve term-to-attribute-value mappings. When referenced by FQN, the system retrieves all Resource Mappings within that group from the policy database, enabling database-backed synonym resolution rather than inline configuration.
