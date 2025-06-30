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

## Custom Actions

Custom Actions known to Policy are admin-defined, globally unique (not namespaced), and will be lower
cased when stored. They may contain underscores (`_`) or hyphens (`-`) if preceded or followed
by an alphanumeric character.

Examples:
- download
- queue-to-print
- send_email