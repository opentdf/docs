// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

import listRemote from './docusaurus-lib-list-remote';

const otdfctl = listRemote.createRepo('opentdf', 'otdfctl', 'main');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenTDF',
  tagline: 'Protect the Data, Build the Future.',
  favicon: 'img/OpenTDF-Logo.png',

  // Set the production url of your site here
  url: 'https://docs.opentdf.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'opentdf', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-github-codeblock'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/opentdf/docs/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/OpenTDF-Logo.png',
      navbar: {
        hideOnScroll: true,
        title: 'OpenTDF',
        logo: {
          alt: 'OpenTDF Logo',
          src: 'img/OpenTDF-Logo.png',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'introduction',
            label: 'Docs',
          },
          {
            href: 'https://github.com/opentdf/docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/orgs/opentdf/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Slack',
              //   href: 'https://join.slack.com/t/opentdf/shared_invite/zt-2h6j6n5ly-BVUq~bIPoMeSu~20XQswFw',
              // },
              {
                label: 'X',
                href: 'https://twitter.com/openTDF',
              },
            ],
          },
        ],
        copyright: `<span>Copyright © ${new Date().getFullYear()} OpenTDF</span><span>Sponsored by <a href="https://virtru.com" target="_blank" rel="noopener noreferrer">Virtru</a></span>`,
      },
      prism: {
        theme: prismThemes.vsLight,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'protobuf', "json"],
      },
      // github codeblock theme configuration
      codeblock: {
        showGithubLink: false,
        githubLinkLabel: 'View on GitHub',
        showRunmeLink: false,
        runmeLinkLabel: 'Checkout via Runme'
      },
    }),
  plugins: [
    [
      'docusaurus-plugin-remote-content',
      {
        // options here
        name: 'nanotdf', // used by CLI, must be path safe
        sourceBaseUrl: 'https://raw.githubusercontent.com/opentdf/spec/main/schema/nanotdf/', // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: 'docs/spec/nanotdf', // the base directory to output to.
        documents: ['README.md'], // the file names to download
        modifyContent: (filename, content) => {
          if (filename === 'README.md') {
            let updatedContent = content.replaceAll('../../diagrams/', '../../../static/img/');
            updatedContent = updatedContent.replaceAll(
              '# nanotdf - a compact binary TDF format',
              '# nanoTDF - a compact binary TDF format',
            );
            return {
              content: `---
id: manifest
sidebar_position: 1
title: Schema
---

${updatedContent}`,
              filename: 'manifest.md',
            };
          }
          // If it's not a README.md or no changes are needed, return the content as is
          return { content: content };
        },
      },
    ],
    [
      'docusaurus-plugin-remote-content',
      {
        // options here
        name: 'images-content', // used by CLI, must be path safe
        sourceBaseUrl: 'https://raw.githubusercontent.com/opentdf/spec/main/diagrams/', // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: 'static/img/', // the base directory to output to.
        documents: ['ecc_and_binding.svg', 'nanotdf.svg', 'symmetric_and_payload.svg'], // the file names to download
        requestConfig: { responseType: 'arraybuffer' },
      },
    ],
    [
      'docusaurus-plugin-remote-content',
      {
        // options here
        name: 'ztdf', // used by CLI, must be path safe
        sourceBaseUrl: 'https://raw.githubusercontent.com/opentdf/spec/main/schema/tdf/', // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: 'docs/spec/ztdf/', // the base directory to output to.
        documents: [
          'Manifest.md',
          'KeyAccessObject.md',
          'PolicyObject.md',
          'AttributeObject.md',
        ], // the file names to download
        modifyContent: (filename, content) => {
          let updatedContent = content.replaceAll('../../diagrams/', '../../../static/img/');
          if (filename === 'Manifest.md') {
            return {
              content: `---
id: manifest
sidebar_position: 1
title: Manifest
---

${updatedContent}`,
            };
          }
          if (filename === 'KeyAccessObject.md') {
            let updatedContent = content.replaceAll('<code>', '```').replaceAll('</code>', '```');
            updatedContent = updatedContent.replace(/<p>/gi, '');
            return {
              content: `---
id: kao
sidebar_position: 3
title: Key Access Object
---

${updatedContent}`,
            };
          }
          if (filename === 'PolicyObject.md') {
            return {
              content: `---
id: policy
sidebar_position: 2
title: Policy Object
---

${updatedContent}`,
            };
          }
          if (filename === 'AttributeObject.md') {
            return {
              content: `---
id: attributes
sidebar_position: 4
title: Attribute Object
---

${updatedContent}`,
            };
          }
          // If it's not a README.md or no changes are needed, return the content as is
          return { content: content };
        },
      },
    ],
    [
      'docusaurus-plugin-remote-content',
      {
        name: 'otdfctl',
        id: 'otdfctl',
        outDir: 'docs/components/cli',
        sourceBaseUrl: listRemote.buildRepoRawBaseUrl(otdfctl),
        documents: listRemote.listDocuments(otdfctl, ['docs/man/**/*.md'], []),
        modifyContent: (filename, content) => {
          // This will hold the new filename after processing.
          let newFilename = filename;

          // Check if the file is named '_index.md' and change it to 'index.md'
          if (newFilename.endsWith('/_index.md')) {
            newFilename = newFilename.replace('/_index.md', '/index.md');
          }

          // Strip the 'docs/' prefix from the path if it exists
          if (newFilename.startsWith('docs/man/')) {
            newFilename = newFilename.substring(9); // Remove the first 5 characters 'docs/'
          }
          // If it's not a README.md or no changes are needed, return the content as is
          return { content: content, filename: newFilename };
        },
      },
    ],
    [
      'docusaurus-plugin-remote-content',
      {
        // options here
        name: 'platform-configuration', // used by CLI, must be path safe
        sourceBaseUrl: 'https://raw.githubusercontent.com/opentdf/platform/main/docs/', // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: 'docs/getting-started', // the base directory to output to.
        documents: ['configuration.md'], // the file names to download
        modifyContent: (filename, content) => {
            let updatedContent = content;
            return {
              content: `---
id: configuration
sidebar_position: 20
title: Configuration
---

${updatedContent}`,
              filename: 'configuration.md',
            };
        },
      },
    ],
  ],
};

export default config;
