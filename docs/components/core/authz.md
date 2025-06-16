---
title: Authorization Configuration
description: Learn about the standard authorization (AuthZ) configuration and role-based access control in the OpenTDF platform
sidebar_position: 2
---

# Standard Authorization (AuthZ) Configuration for opentdf Platform

The opentdf platform uses **Casbin** to manage authorization (AuthZ) for its routes, which are defined using **ConnectRPC**. This document outlines the standard AuthZ configuration, role mappings, and administrative responsibilities for managing and customizing the platform to meet specific security requirements.

## Default Authorization Roles and Policies

By default, the platform provides three role mappings (`admin`, `standard`, and `unknown`) and a concept of **public endpoints**. These roles are tied to the `realmsRole` claim of the OIDC token issued by the Keycloak Identity Provider.

### Role Mappings and Their Permissions

1. **`admin`**
   - **Description**: Administrators of the platform.
   - **Permissions**:
     - Perform all actions.
     - Modify and mutate policy data.
     - Access private and public endpoints.
   - **Requirements**: Must have a valid OIDC token with a claim mapping to the `admin` role.

2. **`standard`**
   - **Description**: Standard users of the platform.
   - **Permissions**:
     - Perform basic actions.
     - Cannot modify policy data.
     - Access private and public endpoints.
   - **Requirements**: Must have a valid OIDC token with a claim mapping to the `standard` role.

3. **`unknown`**
   - **Description**: Users with valid OIDC tokens who are not mappable into the platform's predefined roles.
   - **Permissions**:
     - Can only perform public functions.
     - Cannot access private endpoints.
   - **Requirements**: Must have a valid OIDC token, but no mapping exists for the `realmsRole` claim.

### Public Endpoints

- **Description**: Certain routes are designated as public endpoints and **bypass AuthZ entirely**.
- **Use Case**: These routes are accessible to all users, regardless of their role or token validity.

## Responsibilities of Administrators

It is critical to note that the opentdf platform provides a **basic configuration** for authorization. Administrators are fully responsible for customizing and managing authorization policies to align with their organization's security posture. This includes:

1. **Configuring the Platform for Security Posture**:
   - Review and customize the default Casbin policy to meet organizational needs.
   - Ensure that sensitive routes are properly protected.

2. **Managing Role Mappings**:
   - Update and maintain the mappings for the `realmsRole` claim in Keycloak to ensure accurate role assignment.
   - Ensure that users are correctly categorized into `admin`, `standard`, or custom roles as required.

3. **Monitoring and Updating Policies**:
   - Regularly review policy files to ensure compliance with evolving security requirements.
   - Keep track of updates and changes in the Casbin model and policy files.

## Default Casbin Policy

The platform leverages Casbin to enforce role-based access control (RBAC). Below is an outline of the default policy:

### Default Role Mapping

- `admin` → Full permissions to all resources and actions.
- `standard` → Limited permissions to basic resources and actions.
- `unknown` → Only permitted to access public functions.

### Casbin Access Control Model

The Casbin model supports **extensibility** so that administrators can define custom access control logic to meet their specific needs. For example, administrators can override the default policy using custom mapping logic or additional claims.

## Example Configuration

Here is an example of how the `realmsRole` claim in Keycloak maps to Casbin roles:

```yaml
server:
  auth:
    policy:
      csv: |
        p, role:admin, *, *, allow
        p, role:standard, /basic/*, GET|POST, allow
        p, role:unknown, /public/*, GET, allow
        g, opentdf-admin, role:admin
        g, opentdf-standard, role:standard
```

## Key Takeaways

- The opentdf platform provides a basic AuthZ configuration as a starting point.
- Administrators are responsible for ensuring the platform's configuration aligns with their security policies.
- It is the organization's responsibility to manage role mappings and to ensure that the `realmsRole` claim in Keycloak is configured correctly.
- By default, `admin`, `standard`, and `unknown` roles are provided, with respective permissions. Public endpoints bypass AuthZ entirely.

For more advanced configurations, refer to the [Casbin documentation](https://casbin.org/docs/syntax-for-models) for guidance on customizing policies and models.
