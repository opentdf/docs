# Actions

Actions are a set of `standard` and `custom` verbs at the core of an Access Decision.

In the context of an entitlement decision, the Actions within Subject Mappings answer
"what can an Entity _do_ to a Resource?" 

Together with attribute definition rules, they drive the ABAC policy and decisioning of the
platform.

## Standard Actions

Standard Actions in Policy are comprised of the below, which come out of the box in the platform:
- create
- read (considered within all TDF `decrypt` flows)
- update
- delete

Standard Actions may not be deleted, and only their metadata labels are mutable.

When `NamespacedPolicy` is enabled, standard actions are automatically seeded for each namespace.

## Custom Actions

Custom Actions known to Policy are admin-defined and will be lower cased when stored. They may contain underscores (`_`) or hyphens (`-`) if preceded or followed by an alphanumeric character.

:::warning Deprecation
Non-namespaced custom actions are deprecated. A future version will require all custom actions to be associated with a namespace.
:::

When `NamespacedPolicy` is enabled, custom actions are scoped to a namespace and unique within that namespace. When the flag is disabled (the default), custom actions are globally unique and not associated with any namespace (legacy behavior).

Examples:
- download
- queue-to-print
- send_email

## Namespacing

Actions can optionally be associated with a namespace by providing a `namespace_id` or `namespace_fqn` when creating the action. Non-namespaced actions are deprecated and a future version will require all custom actions to have a namespace.

### Uniqueness

Namespaced action names are unique within their namespace. Non-namespaced action names are globally unique. The same name can exist as both a namespaced and a non-namespaced action.

### Name Lookup

When getting an action by name without specifying a namespace, the search is limited to legacy (non-namespaced) actions. To retrieve a namespaced action by name, provide the `namespace_id` or `namespace_fqn` in the request.

### Namespace Deletion Cascade

Deactivating a namespace (the default operation exposed via the SDK and CLI) soft-deletes the namespace but does not affect its child actions. However, an unsafe hard-delete of a namespace cascades to permanently delete all actions within that namespace.

### `NamespacedPolicy` Enforcement

The platform supports a `NamespacedPolicy` server configuration flag. When enabled, all new custom actions are required to have a namespace. This flag will become the default in a future version.

### Namespace Consistency

When actions are referenced by other namespaced policy objects, they must be in the same namespace:

- **Subject Mappings**: When a subject mapping is namespaced, all of its actions must be in the same namespace.
- **Obligation Triggers**: When `NamespacedPolicy` is enabled, an obligation trigger's action must be in the same namespace as the obligation definition.
- **Registered Resource Action Attribute Values**: When a registered resource is namespaced, all actions in its action-attribute-value mappings must be in the same namespace as the registered resource.
