# Attribute-Based Access Control (ABAC) in OpenTDF

## What is ABAC?

Attribute-Based Access Control (ABAC) is a flexible authorization model that makes access decisions based on attributes of subjects (users), resources (data), actions, and environmental context. Unlike simpler models like Role-Based Access Control (RBAC), ABAC enables fine-grained, dynamic policies that can express complex authorization requirements.

### Core Principles

**Attributes are Key-Value Pairs**: Access decisions are based on attributes like `department=engineering`, `subscription=premium`, or `location=US`.

**Policy-Based Decisions**: Policies define which combinations of attributes grant access to which resources.

**Dynamic Evaluation**: Access is evaluated at request time based on current attribute values, enabling real-time enforcement of changing policies.

**Fine-Grained Control**: Policies can express nuanced requirements like "users with subscription tier 'premium' AND department 'sales' can access this document."

### Why ABAC for Data-Centric Security?

Traditional access control models protect resources at the perimeter (firewalls, API gateways). Once data leaves the perimeter, protection is lost. ABAC in OpenTDF binds policies directly to data through cryptographic enforcement, ensuring:

- **Persistent Protection**: Policies travel with encrypted data
- **Anywhere Enforcement**: Data remains protected regardless of location
- **Dynamic Policies**: Access rules can change without re-encrypting data
- **Zero Trust Architecture**: Never trust, always verify at access time

### Comparison with Other Models

| Model | Decision Based On | Granularity | Flexibility |
|-------|------------------|-------------|-------------|
| **DAC** (Discretionary) | Resource owner grants | Per-resource | Low |
| **MAC** (Mandatory) | Security labels | Per-classification | Low |
| **RBAC** (Role-Based) | User roles | Per-role | Medium |
| **ABAC** (Attribute-Based) | Multiple attributes | Per-attribute combination | High |
| **PBAC** (Policy-Based) | Centralized policies | Per-policy | High |

OpenTDF combines ABAC with PBAC principles: attribute-based decisions enforced through centralized policies.

### NIST ABAC Model Alignment

OpenTDF aligns with the [NIST SP 800-162](https://csrc.nist.gov/publications/detail/sp/800-162/final) ABAC model, implementing all core components:

- **Policy Enforcement Point (PEP)**: Key Access Server
- **Policy Decision Point (PDP)**: Authorization Service
- **Policy Administration Point (PAP)**: Policy Service
- **Policy Information Point (PIP)**: Entity Resolution Service

---

## ABAC Components in OpenTDF

OpenTDF's ABAC model has four primary components that interact to make access decisions:

```mermaid
graph TD
    Subject[Subject Who]
    Resource[Resource What]
    Action[Action How]
    Environment[Environment When/Where]
    Policy[Policy Evaluation]

    Subject -->|Has attributes| Policy
    Resource -->|Requires attributes| Policy
    Action -->|Specifies operation| Policy
    Environment -->|Provides context| Policy

    Policy -->|PERMIT or DENY| Decision[Access Decision]

    style Subject fill:#e1f5ff
    style Resource fill:#fff4e1
    style Action fill:#f0ffe1
    style Environment fill:#ffe1f5
    style Policy fill:#e8e8e8
    style Decision fill:#d4edda
```

### Subjects (Who)

Subjects represent entities requesting access to data—typically users, but also services, applications, or devices.

#### Subject Identity

Subjects are identified through authentication tokens (JWT, OIDC, SAML) containing identity claims:

```json
{
  "sub": "user@example.com",
  "email": "user@example.com",
  "name": "Alice Smith",
  "groups": ["engineering", "managers"]
}
```

#### Subject Attributes

Subjects have attributes describing their properties and context:

- **Identity attributes**: `email`, `username`, `employee_id`
- **Organizational attributes**: `department`, `role`, `title`, `cost_center`
- **Subscription attributes**: `tier`, `plan_type`, `feature_access`
- **Contextual attributes**: `ip_address`, `device_type`, `authentication_method`

#### Subject Mappings

Subject Mappings link external identity claims to OpenTDF attributes. They define which subjects possess which attributes.

Example mapping: "Users in the 'engineering' group get the `department=engineering` attribute."

#### Condition Sets

Condition Sets allow complex boolean logic for subject mappings:

- **ALL_OF**: Subject must match all conditions
- **ANY_OF**: Subject must match at least one condition
- **NOT**: Subject must not match condition

---

### Resources (What)

Resources are the data objects being protected—files, database records, API responses, etc.

#### Resource Attributes

When data is encrypted with OpenTDF, it is tagged with attribute values that express access requirements:

```
Data Encrypted With: [
  "example.com/attr/department/value/engineering",
  "example.com/attr/sensitivity/value/restricted"
]
```

These attributes define "who can access this data."

#### Content Access Schemes

Organizations can define hierarchical content access schemes:

```mermaid
graph LR
    Public[public<br/>order: 1]
    Internal[internal<br/>order: 2]
    Restricted[restricted<br/>order: 3]
    Private[private<br/>order: 4]
    Executive[executive<br/>order: 5]

    Public --> Internal --> Restricted --> Private --> Executive

    style Public fill:#90EE90
    style Internal fill:#FFD700
    style Restricted fill:#FFA500
    style Private fill:#FF6347
    style Executive fill:#DC143C
```

With hierarchy rules, a user with `access-level=private` (order 4) can also access `restricted` (order 3), `internal` (order 2), and `public` (order 1) content.

---

### Actions (How)

Actions represent what the subject wants to do with the resource. In OpenTDF, the primary actions are:

- **DECRYPT**: Unwrap the data encryption key to access plaintext
- **ENCRYPT**: Create a new TDF with specific attributes
- **REWRAP**: Request key access for an encrypted TDF

Action-based policies can enable scenarios like "users can encrypt with 'restricted' but only decrypt 'internal' or lower."

---

### Environment (When/Where)

Environmental attributes capture the context of an access request:

- **Time**: `request_time`, `day_of_week`, `business_hours`
- **Location**: `ip_address`, `country`, `region`
- **Device**: `device_type`, `os_version`, `security_posture`
- **Network**: `network_zone`, `vpn_status`

Policies can incorporate environmental conditions: "Access granted only during business hours from corporate network."

---

## How OpenTDF Services Implement ABAC

OpenTDF's architecture distributes ABAC functions across specialized services:

```mermaid
graph LR
    Client[Client Application]
    KAS[Key Access Server<br/>PEP]
    AuthZ[Authorization Service<br/>PDP]
    Policy[Policy Service<br/>PAP]
    ER[Entity Resolution<br/>PIP]

    Client -->|1. Access Request| KAS
    KAS -->|2. Authorize?| AuthZ
    AuthZ -->|3. Get Subject Attrs| ER
    AuthZ -->|4. Get Policy| Policy
    AuthZ -->|5. Decision| KAS
    KAS -->|6. Grant/Deny| Client
```

### Policy Service (PAP - Policy Administration Point)

The Policy Service is the single source of truth for:

- **Attribute Definitions**: Namespaces, attributes, and values
- **Attribute Rules**: Hierarchies and ordering
- **Subject Mappings**: Which subjects get which attributes
- **Resource Mappings**: Applying attributes to resources

Administrators use the Policy Service to define the ABAC model.

### Entity Resolution Service (PIP - Policy Information Point)

The Entity Resolution Service resolves subject attributes at access time:

1. Receives subject identity (from JWT/OIDC token)
2. Queries external systems (LDAP, SCIM, databases)
3. Applies subject mappings and condition sets
4. Returns attribute list for the subject

Example: Given `user@example.com`, returns `[department=engineering, access-level=restricted]`.

### Authorization Service (PDP - Policy Decision Point)

The Authorization Service makes access decisions:

1. Receives authorization request (subject + resource attributes + action)
2. Resolves subject attributes via Entity Resolution
3. Evaluates policies (attribute matching, hierarchies, conditions)
4. Returns decision: PERMIT or DENY

The Authorization Service implements the core ABAC evaluation logic.

### Key Access Server (PEP - Policy Enforcement Point)

The Key Access Server enforces authorization decisions:

1. Receives key access requests from clients trying to decrypt TDFs
2. Extracts resource attributes from the TDF
3. Calls Authorization Service for decision
4. If PERMIT: rewraps and returns the key
5. If DENY: refuses key access

The KAS ensures only authorized subjects can decrypt protected data.

---

## Policy Structure Deep Dive

OpenTDF policies are composed of several interrelated primitives that work together to implement ABAC.

### Namespaces

Namespaces partition the attribute space by authority or context, enabling multiple divisions or organizations to apply their own attribute schemes to the same data without conflicts.

**Why Namespaces Matter**: The same data can have attributes from multiple namespaces simultaneously, each representing a different stakeholder's perspective or governance requirements.

**Real-World Example: Multi-Division Status Tracking**

A product development proposal might be encrypted with multiple "status" attributes from different divisions:
- `engineering.company.com/attr/status/value/in-development` - Engineering tracks technical development status
- `legal.company.com/attr/status/value/under-review` - Legal tracks compliance review status
- `finance.company.com/attr/status/value/budget-approved` - Finance tracks funding status

Without namespaces, you couldn't have three different "status" attributes—there would be a naming conflict. With namespaces, each division maintains its own independent "status" attribute with its own values and rules.

```mermaid
graph TD
    DATA[Encrypted Document:<br/>Product Development Proposal]

    DATA --> NS1[engineering.company.com/attr/status]
    DATA --> NS2[legal.company.com/attr/status]
    DATA --> NS3[finance.company.com/attr/status]

    NS1 --> V1[value: in-development]
    NS2 --> V2[value: under-review]
    NS3 --> V3[value: budget-approved]

    V1 --> P1[Engineering Policy:<br/>Requires project team membership]
    V2 --> P2[Legal Policy:<br/>Requires legal review completion]
    V3 --> P3[Finance Policy:<br/>Requires budget approval]

    P1 --> ACCESS{Access Granted<br/>if ALL policies pass}
    P2 --> ACCESS
    P3 --> ACCESS

    style DATA fill:#e1f5ff
    style NS1 fill:#fff4e1
    style NS2 fill:#fff4e1
    style NS3 fill:#fff4e1
    style V1 fill:#f0ffe1
    style V2 fill:#f0ffe1
    style V3 fill:#f0ffe1
    style ACCESS fill:#d4edda
```

When someone requests access:
- Engineering's policy checks: "Is the technical work complete enough for access?"
- Legal's policy checks: "Has the necessary legal review happened?"
- Finance's policy checks: "Is the funding status appropriate for this access?"

Each division maintains authority over their own namespace without interfering with others.

**Format**: `<authority>/<path>`

**Common Patterns**:
- `engineering.company.com/attr/status` - Engineering division's status tracking
- `legal.company.com/attr/status` - Legal division's status tracking (different rules, same attribute name)
- `finance.company.com/attr/status` - Finance division's status tracking
- `sales.company.com/attr/region` - Sales division's regional organization

**Key Properties**:
- **Independent Authority**: Each division controls their own namespace
- **No Naming Conflicts**: `engineering.company.com/attr/status` and `legal.company.com/attr/status` are completely separate attributes
- **Multi-Stakeholder Governance**: Data can satisfy multiple policies from different divisions simultaneously
- **Parallel Workflows**: Different divisions can track the same data through their own processes independently

**Naming Conventions**: Namespaces can follow hierarchical naming patterns for organizational clarity, though each namespace is independent:
- `example.com/attr/location/country`
- `example.com/attr/location/region`
- `example.com/attr/location/city`

These path-like names help humans understand relationships, but there's no parent-child functionality in the system—each namespace operates independently.

### Attributes

Attributes are properties defined within namespaces. Each attribute has:

- **Name**: Identifier (e.g., `department`, `access-level`)
- **Rule**: How values are evaluated (ANY_OF, ALL_OF, HIERARCHY)
- **Values**: Enumerated possible values
- **Metadata**: Description, tags, etc.

**Attribute Structure**:

```mermaid
graph TD
    NS[Namespace<br/>example.com/attr/department]

    NS --> ATTR[Attribute Definition<br/>name: department<br/>rule: ANY_OF]

    ATTR --> V1[Value: engineering]
    ATTR --> V2[Value: sales]
    ATTR --> V3[Value: hr]

    ATTR --> META[Metadata<br/>labels, description]

    style NS fill:#e1f5ff
    style ATTR fill:#fff4e1
    style V1 fill:#f0ffe1
    style V2 fill:#f0ffe1
    style V3 fill:#f0ffe1
    style META fill:#ffe1f5
```

**Creating Attributes**: Use the CLI to create attributes within a namespace:

```bash
# Create attribute with rule
otdfctl policy attributes create \
  --namespace <namespace-id> \
  --name department \
  --rule ANY_OF

# Add values to the attribute
otdfctl policy attributes values create \
  --attribute <attribute-id> \
  --value engineering
```

#### Attribute Rules

Attribute definitions include a **rule** that determines how the attribute's values are evaluated during authorization. The rule controls the entitlement logic: how a subject's attributes are matched against the attributes on encrypted TDF data to determine access.

##### ANY_OF

**Logic**: An entity who is mapped to **any** of the associated values of the attribute on TDF'd resource data will be entitled to take the actions in the mapping.

**Use Case**: When a subject needs only one of several possible attribute values to access data.

**Example**:
```
Attribute Definition:
- Name: team
- Rule: ANY_OF
- Values: [red-team, blue-team, green-team]

TDF Encrypted With: [team=blue-team]

Authorization Results:
✓ Subject with team=blue-team → Access GRANTED
✓ Subject with team=red-team AND team=blue-team → Access GRANTED
✗ Subject with team=red-team → Access DENIED
✗ Subject with no team attribute → Access DENIED
```

**When to Use**:
- Access based on membership in one of multiple groups
- "Either/or" access requirements
- Attribute represents independent, non-hierarchical categories

##### ALL_OF

**Logic**: An entity must be mapped to **all** of the associated values of the attribute on TDF'd resource data to be entitled to take the actions in the mapping.

**Use Case**: When data requires multiple attribute values simultaneously for access (intersection of requirements).

**Example**:
```
Attribute Definition:
- Name: certification
- Rule: ALL_OF
- Values: [safety-trained, equipment-certified, background-checked]

TDF Encrypted With: [certification=safety-trained, certification=equipment-certified]

Authorization Results:
✓ Subject with [safety-trained, equipment-certified] → Access GRANTED
✓ Subject with [safety-trained, equipment-certified, background-checked] → Access GRANTED
✗ Subject with [safety-trained] only → Access DENIED
✗ Subject with [equipment-certified] only → Access DENIED
✗ Subject with [background-checked] only → Access DENIED
```

**When to Use**:
- Access requires multiple qualifications simultaneously
- "And" logic for compound requirements
- Data needs approval from multiple domains
- Cross-functional access control

##### HIERARCHY

**Logic**: An entity must be mapped to the **same level value or a level above** in hierarchy compared to a given value on TDF'd resource data.

**Key Concepts**:
- Hierarchical values are ordered by index, with **index 0 being the highest** level and the last index being the lowest
- **Actions propagate down through the hierarchy**: A subject with a higher-level value can access data encrypted with any lower-level value
- Think of it like a membership tier: higher tiers grant access to all lower tier benefits

**Use Case**: When attributes represent hierarchical levels, organizational tiers, or graduated access.

**Example**:
```
Attribute Definition:
- Name: access-level
- Rule: HIERARCHY
- Values (ordered by index):
  - [0] platinum    (highest)
  - [1] gold
  - [2] silver
  - [3] bronze
  - [4] standard    (lowest)

TDF Encrypted With: [access-level=silver]  (index 2)

Authorization Results:
✓ Subject with access-level=platinum (index 0) → Access GRANTED (0 < 2)
✓ Subject with access-level=gold (index 1) → Access GRANTED (1 < 2)
✓ Subject with access-level=silver (index 2) → Access GRANTED (2 = 2)
✗ Subject with access-level=bronze (index 3) → Access DENIED (3 > 2)
✗ Subject with access-level=standard (index 4) → Access DENIED (4 > 2)
```

**Action Propagation**:
If you grant a `read` action at `access-level=platinum` (highest level), that permission propagates down to all lower levels. A user with `platinum` access can read:
- platinum content
- gold content
- silver content
- bronze content
- standard content

**When to Use**:
- Membership or subscription tiers
- Organizational hierarchy (executive → manager → employee)
- Content access levels (premium → pro → basic)
- Geographic scope (global → regional → local)
- Support tiers (priority → standard → community)

**Important**: The order of values in the attribute definition matters! Reordering values changes the hierarchy and can inadvertently grant or revoke access.

##### Choosing the Right Rule

| Scenario | Recommended Rule | Reason |
|----------|------------------|--------|
| User belongs to one of several teams | ANY_OF | Only one team membership needed |
| Document requires both legal AND finance approval | ALL_OF | Must have both attributes |
| Subscription tiers (premium, standard, basic) | HIERARCHY | Higher tier = access to lower tier content |
| Geographic regions (independent) | ANY_OF | Regions don't have inherent ordering |
| Job levels (manager → employee → intern) | HIERARCHY | Natural hierarchical progression |
| Multiple independent projects | ANY_OF | Project memberships are separate |

##### Related Documentation

For practical examples of creating attributes with rules:
- [CLI Reference: Creating Attributes](/explanation/platform-architecture/components/cli/policy/attributes/create) - Command-line examples
- [Tutorial: Your First TDF](/tutorials/your-first-tdf/) - Hands-on attribute creation walkthrough
- [Attributes Deep Dive](/explanation/platform-architecture/components/policy/attributes) - Technical architecture details

### Attribute Values

Each attribute has a set of defined values. Values have:

- **Value**: The actual value string
- **Index Position** (for HIERARCHY): Order in the list determines privilege level (index 0 = highest)
- **Metadata**: Display name, color, description

**Hierarchy Example**:

```mermaid
graph TD
    ATTR[Attribute: access-level<br/>Rule: HIERARCHY]

    ATTR --> V0["Value [0]: executive<br/>(highest privilege)"]
    ATTR --> V1["Value [1]: private"]
    ATTR --> V2["Value [2]: restricted"]
    ATTR --> V3["Value [3]: internal"]
    ATTR --> V4["Value [4]: public<br/>(lowest privilege)"]

    V0 -.-> |can access| V1
    V1 -.-> |can access| V2
    V2 -.-> |can access| V3
    V3 -.-> |can access| V4

    style ATTR fill:#fff4e1
    style V0 fill:#DC143C
    style V1 fill:#FF6347
    style V2 fill:#FFA500
    style V3 fill:#FFD700
    style V4 fill:#90EE90
```

**Creating Hierarchical Attributes**: The order you add values determines their hierarchy:

```bash
# Create attribute with HIERARCHY rule
otdfctl policy attributes create \
  --namespace <namespace-id> \
  --name access-level \
  --rule HIERARCHY

# Add values in order: first = highest privilege
otdfctl policy attributes values create --attribute <attr-id> --value executive
otdfctl policy attributes values create --attribute <attr-id> --value private
otdfctl policy attributes values create --attribute <attr-id> --value restricted
otdfctl policy attributes values create --attribute <attr-id> --value internal
otdfctl policy attributes values create --attribute <attr-id> --value public
```

A subject with `access-level=private` (index 1) can access data encrypted with `restricted` (index 2), `internal` (index 3), or `public` (index 4).

### Subject Mappings

Subject Mappings assign attributes to subjects based on their identity claims.

**Structure**:

- **Attribute Value**: Which attribute value to assign
- **Subject Condition Set**: Boolean logic defining which subjects match

**Example**:

Assign `department=engineering` to users whose JWT contains `"groups": ["engineering"]`.

```json
{
  "attributeValue": "example.com/attr/department/value/engineering",
  "subjectConditionSet": {
    "conditionGroups": [
      {
        "booleanOperator": "OR",
        "conditions": [
          {
            "subjectSets": [
              {"conditionOperator": "IN", "subjectClaim": "groups", "subjectValues": ["engineering"]}
            ]
          }
        ]
      }
    ]
  }
}
```

#### Subject Condition Sets

Subject Condition Sets use boolean operators to combine conditions:

- **Condition Groups**: Arrays of conditions combined with AND or OR
- **Conditions**: Individual matching rules
- **Subject Sets**: Match claims in the identity token

**Operators**:

- `IN`: Claim value is in the specified list
- `NOT_IN`: Claim value is not in the list
- `EQUALS`: Claim value exactly matches
- `NOT_EQUALS`: Claim value does not match

**Complex Example**:

Assign `access-level=executive` to users who:
- Are in the `executives` group, AND
- Have `employment_status=full-time`, AND
- Have `onboarding_complete=true`

```json
{
  "conditionGroups": [
    {
      "booleanOperator": "AND",
      "conditions": [
        {"subjectSets": [{"conditionOperator": "IN", "subjectClaim": "groups", "subjectValues": ["executives"]}]},
        {"subjectSets": [{"conditionOperator": "EQUALS", "subjectClaim": "employment_status", "subjectValues": ["full-time"]}]},
        {"subjectSets": [{"conditionOperator": "EQUALS", "subjectClaim": "onboarding_complete", "subjectValues": ["true"]}]}
      ]
    }
  ]
}
```

### Key Access Grants

Key Access Grants (currently under development) will enable fine-grained control over which subjects can grant access and under what conditions.

Future functionality:
- Delegate decryption rights
- Grant temporary access
- Conditional grants based on attributes

### Resource Mappings

Resource Mappings (currently under development) will automate applying attributes to resources based on resource properties.

Future functionality:
- Automatically tag files based on path, metadata, or content
- Sync resource attributes with external classification systems
- Dynamic attribute assignment based on resource context

---

## Policy Primitives Interoperation

Here's a step-by-step walkthrough of how ABAC policy primitives work together in OpenTDF:

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant Policy as Policy Service
    participant Client as Client App
    participant TDF as Encrypted TDF
    participant User as User/Subject
    participant KAS as Key Access Server
    participant AuthZ as Authorization Service
    participant ER as Entity Resolution

    Note over Admin,Policy: Setup Phase
    Admin->>Policy: 1. Create namespace & attributes
    Admin->>Policy: 2. Create subject mappings

    Note over Client,TDF: Encryption Phase
    Client->>Client: 3. Encrypt data with attributes
    Client->>TDF: Store encrypted TDF

    Note over User,KAS: Access Request Phase
    User->>KAS: 4. Request decrypt (JWT + TDF)
    KAS->>KAS: 5. Extract subject & resource attrs

    Note over KAS,ER: Authorization Phase
    KAS->>AuthZ: 6. Authorize request
    AuthZ->>ER: 6a. Resolve subject attributes
    ER->>ER: Apply subject mappings
    ER-->>AuthZ: Return user attributes
    AuthZ->>AuthZ: 6b. Evaluate attribute match
    AuthZ-->>KAS: PERMIT/DENY

    Note over KAS,User: Response Phase
    alt PERMIT
        KAS->>KAS: 7. Rewrap key for user
        KAS-->>User: Return key
        User->>User: 8. Decrypt TDF
    else DENY
        KAS-->>User: Access denied
    end
```

### 1. Administrator Defines Attributes

Administrator creates a namespace and defines attributes:

```bash
# Create namespace
otdfctl policy attributes namespaces create \
  --name example.com/attr/department

# Define attribute with values
otdfctl policy attributes create \
  --namespace example.com/attr/department \
  --name department \
  --rule ANY_OF \
  --values engineering,sales,hr
```

### 2. Administrator Creates Subject Mappings

Administrator maps external identity groups to attributes:

```bash
# Map "engineering" group to department=engineering attribute
otdfctl policy subject-mappings create \
  --attribute-value example.com/attr/department/value/engineering \
  --subject-condition '{"groups": ["engineering"]}'
```

### 3. Client Encrypts Data with Attributes

Application encrypts sensitive data and tags it with attribute requirements:

```python
# Encrypt data requiring department=engineering
tdf = TDF.create(
    data="Confidential engineering document",
    attributes=["example.com/attr/department/value/engineering"]
)
```

The TDF now cryptographically binds the policy to the data.

### 4. Subject Requests Access

User attempts to decrypt the TDF:

```python
# User authenticates and requests decrypt
client.decrypt(tdf)
```

Client presents authentication token (JWT):

```json
{
  "sub": "alice@example.com",
  "email": "alice@example.com",
  "groups": ["engineering", "managers"]
}
```

### 5. Key Access Server Receives Request

KAS receives the decrypt request and extracts:

- **Subject**: Identity claims from JWT
- **Resource Attributes**: `[department=engineering]` from the TDF
- **Action**: `DECRYPT`

### 6. Authorization Service Evaluates Policy

KAS calls Authorization Service, which:

1. **Resolves Subject Attributes**:
   - Calls Entity Resolution Service with subject identity
   - Entity Resolution applies subject mappings
   - Returns: `[department=engineering]` (Alice is in "engineering" group)

2. **Evaluates Attribute Match**:
   - Data requires: `[department=engineering]`
   - Subject has: `[department=engineering]`
   - Attribute rule: `ANY_OF`
   - **Result**: MATCH

3. **Returns Decision**: `PERMIT`

### 7. KAS Grants or Denies Access

- If `PERMIT`: KAS rewraps the data encryption key with the subject's public key and returns it
- If `DENY`: KAS refuses to provide the key; data remains encrypted

### 8. Client Decrypts Data

If granted, client receives the key and decrypts the TDF content.

---

## Policy Design Best Practices

### Granularity Considerations

**Too Coarse**: Large, monolithic attributes (e.g., `access=allowed`) provide little control.

**Too Fine**: Excessive attributes (e.g., per-document attributes) create management overhead.

**Balanced**: Use namespaces and hierarchies to organize attributes logically. Examples:
- Department-level: `department=engineering`
- Project-level: `project=alpha`
- Access-level: `access-level=restricted`

### Performance Implications

- **Minimize External Lookups**: Cache entity resolution results where possible
- **Optimize Attribute Count**: Encrypting with 50+ attributes may impact performance
- **Use Hierarchies**: Hierarchy rules reduce the number of attributes needed

### Security Best Practices

- **Least Privilege**: Grant minimum necessary attributes
- **Regular Audits**: Review subject mappings and attribute assignments
- **Separation of Duties**: Different admins for policy definition vs. subject assignment
- **Test Policies**: Validate policies in staging before production

### Testing Strategies

1. **Unit Test Policies**: Test individual attribute rules
2. **Integration Test Mappings**: Verify subject mappings resolve correctly
3. **End-to-End Test Scenarios**: Simulate realistic access patterns
4. **Negative Testing**: Ensure unauthorized subjects are denied
5. **Performance Testing**: Load test authorization service under realistic traffic

---

## Examples

### Example 1: Simple Policy (Single Namespace, Flat Attributes)

**Scenario**: Small company wants to protect documents by department.

**Namespace**:
- `company.com/attr/department`

**Attributes**:
- `department` with values: `engineering`, `sales`, `hr`
- Rule: `ANY_OF`

**Subject Mapping**:
- JWT contains `"department": "engineering"`
- Map to `department=engineering`

**Usage**:
- Encrypt document: `attributes=["company.com/attr/department/value/engineering"]`
- User with `department=engineering` can decrypt
- Users from `sales` or `hr` cannot decrypt

---

### Example 2: Intermediate Policy (Multiple Namespaces, Hierarchies)

**Scenario**: Multi-division company with content access levels and project-based access.

**Namespaces**:
- `company.com/attr/access-level`
- `company.com/attr/project`

**Attributes**:

1. `access-level` (HIERARCHY):
   - `public` (order: 1)
   - `internal` (order: 2)
   - `restricted` (order: 3)
   - `private` (order: 4)

2. `project` (ANY_OF):
   - `alpha`, `beta`, `gamma`

**Subject Mapping**:
- Role assignment results in `access-level=private`
- Project assignment adds `project=alpha`

**Usage**:
- Encrypt document: `attributes=["company.com/attr/access-level/value/restricted", "company.com/attr/project/value/alpha"]`
- User must have `access-level >= restricted` AND `project=alpha`

---

### Example 3: Complex Policy (Condition Sets, Resource Mappings)

**Scenario**: Healthcare provider with patient consent, provider credentials, and emergency access.

**Namespaces**:
- `healthcare.org/attr/consent`
- `healthcare.org/attr/credential`
- `healthcare.org/attr/emergency`

**Attributes**:

1. `consent` (ALL_OF):
   - `patient-12345-consent` (per-patient consent values)

2. `credential` (ANY_OF):
   - `physician`, `nurse`, `pharmacist`

3. `emergency` (ANY_OF):
   - `emergency-override`

**Subject Mapping with Condition Sets**:

- Physicians with active license → `credential=physician`
- Emergency situations → `emergency=emergency-override`

**Complex Subject Condition**:

Grant `emergency-override` to physicians who:
- Have `role=physician`, AND
- Are on-call (`on_call=true`), AND
- Request is during off-hours

**Usage**:
- Encrypt patient record: `attributes=["healthcare.org/attr/consent/value/patient-12345-consent", "healthcare.org/attr/credential/value/physician"]`
- Physician with patient consent can access
- OR emergency override can access regardless of consent

---

## Hands-On Tutorial

Ready to try ABAC policies yourself? The [Your First TDF Tutorial](../../tutorials/your-first-tdf/index.mdx) walks you through:

1. Setting up OpenTDF services
2. Creating your first namespace and attributes
3. Defining subject mappings
4. Encrypting data with attributes
5. Testing access control with different users

---

## Learn More

- **[Platform Architecture](../platform-architecture/index.md)**: How OpenTDF services work together
- **[Trusted Data Format](../trusted-data-format/index.md)**: How policies are cryptographically bound to data
- **[Policy Service API Reference](../../reference/OpenAPI-clients/policy/policy)**: Detailed API documentation
- **[How-To: Implementing a PEP](../../how-to/integration-patterns/implementing-a-pep.mdx)**: Build your own policy enforcement point
- **[Tutorial: Your First TDF](../../tutorials/your-first-tdf/index.mdx)**: Hands-on ABAC policy creation
