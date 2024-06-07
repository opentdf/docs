# Authorization Service

## Overview

The OpenTDF Platform is a comprehensive framework designed to provide secure data sharing and management solutions. At
the core of its functionality is the Authorization Service, which ensures that only authorized users can access and
interact with sensitive data. This document provides a detailed explanation of the Authorization Service, its
components, and how it integrates with the overall OpenTDF platform, with a focus on gRPC-based API endpoints.

## Table of Contents

1. [Introduction](#introduction)
2. [Key Components](#key-components)
3. [Authentication vs. Authorization](#authentication-vs-authorization)
4. [How Authorization Service Works](#how-authorization-service-works)
5. [Integration with OpenTDF](#integration-with-opentdf)
6. [gRPC API Endpoints](#grpc-api-endpoints)
7. [Configuration](#configuration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Conclusion](#conclusion)

## Introduction

The Authorization Service in the OpenTDF Platform is responsible for managing and enforcing access controls. It
determines whether a user has the necessary permissions to perform specific actions on data resources. This service
plays a crucial role in maintaining data security and ensuring compliance with access policies.

## Key Components

### Policy Decision Point (PDP)

The PDP evaluates access requests against defined policies, determining if access should be granted or denied based on
the rules set by the organization.

### Policy Enforcement Point (PEP)

The PEP intercepts user requests and forwards them to the PDP for evaluation, enforcing the decision made by the PDP.

### Policy Administration Point (PAP)

The PAP is used to create, manage, and update access control policies, providing an interface for administrators to
define access rules.

### Policy Information Point (PIP)

The PIP supplies the PDP with additional context or attributes needed for policy evaluation, such as user roles and
environmental conditions.

## Authentication vs. Authorization

- **Authentication** verifies the identity of a user, typically handled through usernames, passwords, tokens, or other
  methods.
- **Authorization** determines what an authenticated user is allowed to do, handled by the Authorization Service.

## How Authorization Service Works

1. **User Request**: A user attempts to access a resource.
2. **PEP Interception**: The PEP intercepts the request and forwards it to the PDP.
3. **PDP Evaluation**: The PDP evaluates the request against the access control policies.
4. **Decision Making**: The PDP makes a decision (grant or deny access) and sends it back to the PEP.
5. **Enforcement**: The PEP enforces the decision by either allowing or denying the user's request.

Recent updates to the Authorization Service include enhanced logging for decision tracking, streamlined policy
evaluation mechanisms, and improved support for complex entity chains and resource attributes. These changes ensure that
authorization decisions are made efficiently and transparently, with detailed logs available for auditing and
troubleshooting.

## Integration with OpenTDF

The Authorization Service is integrated with other components of the OpenTDF Platform, ensuring consistent access
control across services and endpoints. This integration involves:

- **Secure APIs**: All API calls are routed through the Authorization Service to ensure compliance with access policies.
- **Data Encryption**: Access control is enforced even at the data encryption level, ensuring that only authorized users
  can decrypt and access sensitive information.
- **Audit Logging**: All access requests and decisions are logged for auditing and compliance purposes.

## gRPC API Endpoints

The Authorization Service exposes several gRPC API endpoints for managing access control. These include:

### GetDecisions

Evaluates access requests based on user attributes and resource attributes.

### GetDecisionsByToken

Evaluates access requests based on JWT tokens.

### GetEntitlements

Retrieves entitlements for a user or entity.

### Example Request and Response

#### GetDecisions Request

Example request JSON for the GetDecisions endpoint:

- Actions: [{"standard": "STANDARD_ACTION_TRANSMIT"}]
- Entity Chains: [{"id": "ec1", "entities": [{"emailAddress": "bob@example.org"}]}, {"id": "ec2", "
  entities": [{"userName": "alice@example.org"}]}]
- Resource Attributes: [{"resourceAttributeId": "attr-set-1", "
  attributeFqns": ["https://www.example.org/attr/foo/value/value1"]}, {"resourceAttributeId": "attr-set-2", "
  attributeFqns": ["https://example.net/attr/attr1/value/value1", "https://example.net/attr/attr1/value/value2"]}]

#### GetDecisions Response

Example response JSON for the GetDecisions endpoint:

- Decision Responses: [{"decision": "ALLOW"}, {"decision": "DENY"}]

## Configuration

Configuring the Authorization Service involves setting up policies, roles, and integrating with identity providers. Key
configuration steps include:

- **Defining Policies**: Create access control policies using the PAP interface.
- **Role Management**: Define user roles and assign permissions using the roles API.
- **Integration**: Integrate with existing identity providers for authentication.

## Best Practices

- **Least Privilege**: Ensure users have the minimum access necessary to perform their tasks.
- **Regular Audits**: Perform regular audits of access logs and policies to ensure compliance.
- **Policy Updates**: Keep access control policies up to date with organizational changes.

## Troubleshooting

Common issues and their resolutions:

- **Access Denied**: Verify that the user's role has the necessary permissions.
- **Policy Conflicts**: Check for conflicting policies that might cause unintended denials.
- **Integration Issues**: Ensure the Authorization Service is properly integrated with identity providers.

## Conclusion

The Authorization Service is a critical component of the OpenTDF Platform, ensuring that access to data is securely
managed and controlled. By understanding its components and how it operates, you can effectively implement and manage
access control within your organization.

For more information, visit the [OpenTDF GitHub repository](https://github.com/opentdf/platform).
