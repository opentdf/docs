# Resource Mappings

Resource Mappings are a mechanism to associate various terms with Attribute Values.

A Resource Mapping contains:

1. an associated `attribute value`
2. a set of `terms`

The primary consumer of a Resource Mapping is a PDP (Policy Decision Point) that digests data, does some kind of logic with the known terms,
and relies on them to associate the data with the mapped Attribute Values.

For example, consider the Namespaced Attribute Value `https://demo.com/attr/color/value/purple`.

A Resource Mapping would be useful for consumption of data that may relate to `indigo`, `lilac`, `plum`, and `lavender`.

The mapping of that set of terms to the given `https://demo.com/attr/color/value/purple` can provide a PEP (Police Enforcement Point) with
the context it needs to TDF the resource data with the appropriate attribute values.
