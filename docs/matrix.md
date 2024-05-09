---
sidebar_position: 50
---
# Feature Matrix

The following table shows the features of the different versions of the library.

> [!NOTE]
> Questions regarding specific features should be raised in the [GitHub Discussions](https://github.com/orgs/opentdf/discussions).

The following tables utilize the following terms:

- **Lifecycle**
  - **Alpha**: The feature is in the early stages of development.
  - **Beta**: The feature is in the later stages of development.
  - **GA**: The feature is ready for production use.
- **State**
  - **Planned**: The feature is planned but not yet started.
  - **Unstable**: The feature is in development and may change.
  - **Stable**: The feature is ready for production use.
- **Support**
  - **Official**: The service, feature, or library is officially supported by the maintainers.
  - **Community**: The service, feature, or library is supported by the community. Community supported features will
    have a link to the community repository and not be included in the OpenTDF organization.

## Platform

The platform is made of different services. This matrix captures the high-level state of the various service features.

| Service           | Feature                      | State        |
| ----------------- | ---------------------------- | ------------ |
| **Authorization** | Access                       | Stable       |
| **Key Access**    | Rewrap                       | Stable       |
| **Key Access**    | Public Key                   | Stable       |
| **Key Access**    | Rotate                       | Planned      |
| **Policy**        | Manage Attribute Namespaces  | Stable       |
| **Policy**        | Manage Attribute Definitions | Stable       |
| **Policy**        | Manage Attribute Values      | Stable       |
| **Policy**        | Manage Key Access Grants     | Unstable[^1] |
| **Policy**        | Manage Subject Mappings      | Stable       |
| **Policy**        | Manage Subject Mapping Sets  | Stable       |
| **Policy**        | Manage Resource Mappings     | Stable       |
| **Policy**        | Manage Resource Mapping Sets | Planned      |
| **Policy**        | Unsafe Mutations[^2]         | Planned      |

[^1]: Management of Key Access Grants is available, but isn't fully functional within Key Access.
[^2]:
    Unsafe Mutations are operations that can cause unintended consequences to data security. This feature will enable
    these operations (which are prevented in the management APIs) and bind their execution to audit events. The current
    workaround is to manually update the database.

## SDK

Feature matrix for the different SDK versions.

|                            | Go       | Java     | C++      | Javascript |
| :------------------------- | -------- | -------- | -------- | ---------- |
| **Lifecycle**              | Beta     | Alpha    | Alpha    | Alpha      |
| **Support**[^101]          | Official | Official | Official | Official   |
|                            |          |          |          |            |
| **Encrypt/Decrypt**[^103]  | Stable   | Unstable | Planned  | Unstable   |
| - ZTDF[^110]               | Stable   | Unstable | Planned  | Unstable   |
| - NanoTDF[^111]            | Stable   | Planned  | Planned  | Unstable   |
| - ABAC[^112]               | Stable   | Unstable | Planned  | Unstable   |
| - Dissem[^113]             | Stable   | Unstable | Planned  | Unstable   |
|                            |          |          |          |            |
| **Service APIs**[^105]     | Stable   | Stable   | Planned  | Planned    |
| - Authorization [^120]     |          |          |          |            |
| - Key Access Server [^121] |          |          |          |            |
| - Policy: Attributes[^130] |          |          |          |            |

[^101]: Support is the level of support for the SDK (Official, Community).
[^103]: Encrypt is the ability to encrypt data.
[^105]: Service APIs are APIs that are provided by the library to interact with the service.

<!-- SDK Footnotes -->

[^110]: Support for the [Zero Trust Data Format](https://github.com/opentdf/spec/tree/main/schema/tdf) utilizing JSON manifests.
[^111]: Support for the [Nano Trusted Data Format](https://github.com/opentdf/spec/tree/main/schema/nanotdf).
[^112]: ABAC is Attribute Based Access Control.
[^113]: Dissem is Dissemination List (i.e. email lists).

<!-- Service Footnotes -->

[^120]: Authorization APIs for managing authorization policies.
[^121]: Key Access Server (KAS) APIs for accessing key management.
[^130]: APIs for managing policy attributes [proto](https://github.com/opentdf/platform/blob/main/service/policy/attributes/attributes.proto).

## FAQ

<details>

<summary>Why isn't _language_ not supported as an SDK?</summary>

To ensure we can provide the best support for the SDKs, we have decided to focus on a limited scope of languages which
meet our criteria such as performance and environment.

Python and C# was supported in the first version of the platform, but as we assessed our ability to maintain the SDKs, we decided to focus on the most popular and performant languages. We are open to community contributions to support these languages.

</details>

<details>

<summary>Where can I get updates on the state of services and SDKs?</summary>

The best place to get updates on the state of the services and SDKs is the
[OpenTDF GitHub Discussions](https://github.com/orgs/opentdf/discussions).

</details>
