# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ nvm use
$ npm ci
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Building API docs

```
# Based on:
# https://docusaurus-openapi.tryingpan.dev/#generating-openapi-docs

# Generation
$ npm run gen-api-docs-all

# Cleanup
$ npm run gen-api-docs-clean
```