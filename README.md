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

## Documentation Structure

Our documentation follows a user-needs approach with four main categories:

- **🚀 Tutorials**: Step-by-step learning experiences for hands-on practice
- **📖 How-To Guides**: Problem-solving recipes for specific tasks and integrations
- **💡 Explanations**: Conceptual guides covering the "why" behind OpenTDF's design
- **📚 Reference**: Technical specifications, API docs, and lookup information

## Contributing

We welcome contributions to improve our documentation! Please see our [Contributing Guide](CONTRIBUTING.md) for guidelines on:

- Writing and editing documentation
- Style and formatting standards
- Review and approval process
- Technical setup for contributors

For style guidelines, please refer to our [Style Guide](STYLE_GUIDE.md).

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
