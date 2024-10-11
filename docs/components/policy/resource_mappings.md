# Resource Mappings

Resource Mappings associate various terms found within data to Attribute Values, serving as a mechanism for matching data tags to Attributes.

A Resource Mapping contains:

1. An associated `attribute value`.
2. A set of related `terms`.

The primary consumer of a Resource Mapping is a Policy Decision Point (PDP), which processes data, applies logic using the known terms, and relies on them to map the data to Attribute Values. By mapping a set of terms to a given attribute value, a Policy Enforcement Point (PEP) can properly apply the TDF to the resource data using the appropriate attribute values.

# Examples

Alice is a system administrator. She defines an Attribute definition called color with values like red, green, blue, purple, etc. For the Attribute Value `https://demo.com/attr/color/value/purple'`, she would define a Resource Mapping for processing data that may involve terms like `indigo`, `lilac`, `plum`, or `lavender`.

Bob is a system administrator in the US Department of Defense (DoD). Bob defines a hierarchical attribute called classification with values of topsecret, secret, confidential, and unclassified. He needs to create a resource mapping that defines a normalization of the various short forms and acronyms that map to each of these classification levels. For the topsecret attribute value, he might include terms like ts, top secret, and top-secret. Whereas for unclassified he might include u, uc, or other variations.
