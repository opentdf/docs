# OpenTDF Documentation

> The official documentation website for OpenTDF - an open source toolkit for zero trust, data-centric security.

## About This Repository

This repository contains the source code for the [OpenTDF documentation website](https://docs.opentdf.io), built using [Docusaurus](https://docusaurus.io/). The documentation provides comprehensive guides, tutorials, and reference materials for developers and organizations implementing data-centric security with OpenTDF.

## What is OpenTDF?

OpenTDF is an open source system for implementing data-centric security that enables:

- **Zero Trust Data Protection**: Cryptographically bind access control policies to data objects
- **Attribute-Based Access Control (ABAC)**: Fine-grained access decisions based on attributes and context
- **Policy Travels with Data**: Security controls remain attached wherever data goes
- **Trust Data Format (TDF)**: Open standard for self-protecting data

## Contributing

We welcome contributions to improve our documentation! Please see our [Contributing Guide](CONTRIBUTING.md) for guidelines on:

- Writing and editing documentation
- Style and formatting standards
- Review and approval process
- Technical setup for contributors

## Quick Links

- **Live Documentation**: [docs.opentdf.io](https://docs.opentdf.io)
- **OpenTDF Platform**: [github.com/opentdf/platform](https://github.com/opentdf/platform)
- **TDF Format Spec**: [github.com/opentdf/spec](https://github.com/opentdf/spec)
- **OpenTDF Organization**: [github.com/opentdf](https://github.com/opentdf)
- **Community Discussions**: [GitHub Discussions](https://github.com/opentdf/platform/discussions)

---

## Local Development

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Prerequisites

Before you can run the documentation locally, you'll need Node.js and npm. We recommend using nvm (Node Version Manager) to manage Node.js versions.

#### Option 1: Using nvm (Recommended)

nvm allows you to install and switch between different Node.js versions easily.

**Installation:**

- **macOS/Linux**: Follow the installation instructions at [nvm GitHub repository](https://github.com/nvm-sh/nvm#installation-and-update)
- **Windows**: Install nvm-windows from [nvm-windows releases](https://github.com/coreybutler/nvm-windows#installation--upgrades)

**Verify installation:**

```bash
nvm --version  # macOS/Linux
nvm version    # Windows
```

#### Option 2: Direct Node.js Installation

If you prefer not to use nvm:

1. **Visit [nodejs.org](https://nodejs.org/)** and download **Node.js version 22** (the version specified in our `.nvmrc` file)
2. **Follow the installation instructions** for your operating system
3. **Verify installation:**

   ```bash
   node --version  # Should show v22.x.x
   npm --version   # Should show npm version
   ```

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/opentdf/docs.git
   cd docs
   ```

2. **Use the correct Node.js version** (if using nvm):

   ```bash
   nvm use  # This reads the .nvmrc file and switches to Node.js v22
   ```

   If you don't have Node.js v22 installed via nvm:

   ```bash
   nvm install 22
   nvm use 22
   ```

3. **Install dependencies:**

   ```bash
   npm ci  # Installs exact versions from package-lock.json
   ```

### Local Development

   ```bash
   npm run start
   ```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

   ```bash
   npm run build
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

---

## License

This documentation is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

### License Change Notice

**Effective Date: February 13, 2026**

This project's documentation license has changed from:

- **Previous:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **New:** Creative Commons Attribution 4.0 International (CC BY 4.0)

**What this means:**

- ✅ You can use, adapt, and share this documentation under any terms
- ✅ You only need to provide attribution to the original work
- ✅ No longer required to share derivative works under the same license (ShareAlike requirement removed)

**Rationale:** To make the documentation more accessible and easier to integrate into various projects and contexts while maintaining proper attribution.

All content committed after February 13, 2026 is licensed under CC BY 4.0. Content created before this date was released under CC BY-SA 4.0.

See the [LICENSE](LICENSE) file for the full legal text.
