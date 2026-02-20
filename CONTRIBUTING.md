# Contributing to opentdf/docs

Thank you for contributing to OpenTDF documentation! For general contribution
guidelines, community feedback channels, and branch/commit conventions, see
[platform/CONTRIBUTING.md](https://github.com/opentdf/platform/blob/main/CONTRIBUTING.md).

The information below is specific to documentation contributions.


## Prerequisites

- [Vale](https://vale.sh/docs/vale-cli/installation/)


## Check spelling and grammar for your changes

Install the required vale packages:
```shell
vale sync
```

Run vale on changed files:
```shell
git diff --name-only | xargs vale --glob='!blog/*'
```

## Verify changes on the Docusaurus server

To verify the placement and style of your changes as well as ensure there are no breaking changes, follow the [instructions in the README](./README.md#local-development) for running the Docusaurus server locally.