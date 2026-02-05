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

### Preview Deployment

Deploy to a Surge preview domain for testing changes before merging to production. **A free Surge account is required** - you'll be prompted to sign up the first time you deploy.

**Important:** Each developer should use a unique preview domain name to avoid conflicts. Use a descriptive name based on your ticket number or feature:

```bash
# Build the site
npm run build

# Deploy to your unique preview URL
# Replace <your-identifier> with your ticket number or feature name
npx surge build opentdf-docs-preview-<your-identifier>.surge.sh
```

**Examples:**
```bash
# Using ticket number
npx surge build opentdf-docs-preview-dspx-2345.surge.sh

# Using feature description
npx surge build opentdf-docs-preview-troubleshooting-updates.surge.sh
```

Your preview will be available at `https://opentdf-docs-preview-<your-identifier>.surge.sh/`

**Note:** The first time you deploy, Surge will prompt you to create a free account or login.
