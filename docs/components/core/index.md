---
title: Core Components
description: Learn about the core components and fundamental services of the OpenTDF platform
sidebar_position: 1
---

# Core Components

The core components of the OpenTDF platform provide the fundamental building blocks for secure data access and control. These components implement the essential services and configurations that enable the platform's data-centric security capabilities.

## Key Components

### Authorization (AuthZ)

The standard authorization configuration manages access control using Casbin and ConnectRPC. It provides role-based access control through predefined roles (admin, standard, unknown) and public endpoints, integrating with the platform's OIDC token system.

### Service Registration and Configuration

Core services in the platform are designed to work together through standardized registration and configuration patterns. This includes:

- Service discovery and communication
- Standard health checks and monitoring
- Configuration management and validation
- Security and authentication setup

### Platform Integration Points

The core components establish crucial integration points for:

- Identity Provider (IdP) integration
- Key management and access control
- Policy enforcement points
- Service-to-service communication

## Purpose

The core components documentation provides essential information about:

- Standard configuration patterns
- Service initialization and bootstrap processes
- Security configurations and best practices
- Integration guidelines for platform services

These components form the foundation of the OpenTDF platform, ensuring consistent behavior, security, and interoperability across all platform services.
