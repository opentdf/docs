# Registered Resources

`Registered Resources` are "non-data" resources (i.e. not a TDF data object) that are registered with the platform policy and may serve as the "Entity" or "Resource" in a decision request.

## Composition

A Registered Resource consists of:

1. A `Registered Resource`
2. A `Registered Resource Value`
3. One or more `Action Attribute Values`

A Registered Resource has a unique name and may contain multiple, unique Registered Resource Values. 

A Registered Resource Value is used to represent a specific instance of the Registered Resource and can be referenced by a FQN (Fully Qualified Name) in the form of `https://reg_res/<registered_resource.name>/value/<registered_resource_value.value>`.

Registered Resource Values may contain multiple Action Attribute Values, which are unique mappings of an action to an attribute value. These mappings are used in Policy Decision Points for access control decisions.

```mermaid
graph LR;

Registered_Resource-->Registered_Resource_Value_A;
Registered_Resource-->Registered_Resource_Value_B;

Registered_Resource_Value_A-->Action_Attribute_Value_A;
Registered_Resource_Value_A-->Action_Attribute_Value_B;

Action_Attribute_Value_A-->Action_A;
Action_Attribute_Value_A-->Attribute_Value_A;
Action_Attribute_Value_B-->Action_B;
Action_Attribute_Value_B-->Attribute_Value_B;

Registered_Resource_Value_B-->Action_Attribute_Value_C;
Registered_Resource_Value_B-->Action_Attribute_Value_D;
Action_Attribute_Value_C-->Action_C;
Action_Attribute_Value_C-->Attribute_Value_C;
Action_Attribute_Value_D-->Action_D;
Action_Attribute_Value_D-->Attribute_Value_D;

```

# Examples

## As a Resource

Alice is a cloud security architect. She needs to control user access to S3 buckets in her cloud environment. She defines a Registered Resource called `s3_bucket` with values like `bucket1`, `bucket2`, and `bucket3`. For the Registered Resource Value `https://reg_res/s3_bucket/value/bucket1`, she might define Action Attribute Values for actions such as `read`, `create`, and `delete` on attribute values such as `https://demo.com/attr/classification/value/topsecret`, `https://demo.com/attr/classification/value/secret`, and `https://demo.com/attr/classification/value/unclassified` to enforce the desired access control.

In this case, Policy Decision Points would evaluate a user's attributes and subject mappings (acting as the entity) against the Action Attribute Values of the `https://reg_res/s3_bucket/value/bucket1` Registered Resource Value (acting as the resource).

## As an Entity

Bob is a network security administrator in a large organization. He needs to manage data communications across various networks that have different classification-based access controls. He defines a Registered Resource called `network` with values like `private` and `public`. For the Registered Resource Value `https://reg_res/network/value/private`, he might define Action Attribute Values for actions such as `read` and `create` on attribute values such as `https://demo.com/attr/classification/value/topsecret` and `https://demo.com/attr/classification/value/secret`.

In this case, Policy Decision Points would evaluate the Action Attribute Values of the `https://reg_res/network/value/private` Registered Resource Value (acting as the entity) against either the Action Attribute Values of the `https://reg_res/network/value/public` Registered Resource Value or against a TDF's attributes (acting as the resource).
