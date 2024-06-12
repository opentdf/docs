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
  tagline: 'Dinosaurs are cool',
  favicon: 'img/OpenTDF-Logo.png',

  // Set the production url of your site here
  url: 'https://special-bassoon-22149qr.pages.github.io',
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
  themes: ['@docusaurus/theme-mermaid'],

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
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
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
        title: 'OpenTDF',
        logo: {
          alt: 'OpenTDF Logo',
          src: 'img/OpenTDF-Logo.png',
        },
        items: [
          // {
          //   to: '/about',
          //   label: 'About',
          //   position: 'left',
          // },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/opentdf/docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/docs/overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/opentdf',
              },
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/opentdf/shared_invite/zt-2h6j6n5ly-BVUq~bIPoMeSu~20XQswFw',
              },
              {
                label: 'X',
                href: 'https://twitter.com/openTDF',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/opentdf/docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
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
          'manifest-json.md',
          'KeyAccessObject.md',
          'PolicyObject.md',
          'AttributeObject.md',
        ], // the file names to download
        modifyContent: (filename, content) => {
          let updatedContent = content.replaceAll('../../diagrams/', '../../../static/img/');
          if (filename === 'manifest-json.md') {
            updatedContent = updatedContent.replaceAll('# manifest.json', '# Manifest');
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
            updatedContent = updatedContent
              .replaceAll('ClaimsObject.md', 'https://opentdf.io')
              .replaceAll('EntitlementsObject.md', 'https://opentdf.io');
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
            updatedContent = updatedContent
              .replaceAll('ClaimsObject.md', 'https://opentdf.io')
              .replaceAll('EntitlementObject.md', 'https://opentdf.io');
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
        outDir: 'docs/cli',
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
  ],
};

export default config;
