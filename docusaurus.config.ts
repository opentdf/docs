// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import matter from "gray-matter";
import listRemote from "./docusaurus-lib-list-remote";
import { preprocessOpenApiSpecs, openApiSpecs } from './src/openapi/preprocessing';
import languageTabs from "./openapi-generated-clients";
import { getSpecDocumentationPlugins } from './src/utils/spec-documentation';

// Execute the preprocessing function for OpenAPI specs
preprocessOpenApiSpecs().catch(error => {
    console.error('Failed to preprocess OpenAPI specs:', error);
    process.exit(1);
});

const otdfctl = listRemote.createRepo("opentdf", "otdfctl", "main");

const config: Config = {
  title: "OpenTDF",
  tagline: "Enabling secure data sharing through open, data-centric security",
  favicon: "img/OpenTDF-Logo.png",

  // Set the production url of your site here
  url: "https://docs.opentdf.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "opentdf", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  headTags: [
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "OpenTDF",
        url: "https://opentdf.io",
        logo: "https://docs.opentdf.io/img/opentdf-social.png",
      }),
    },
  ],

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  onBrokenAnchors: "warn",
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid", "docusaurus-theme-github-codeblock", "docusaurus-theme-openapi-docs"],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //'https://github.com/opentdf/docs/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: "img/opentdf-social.png",
    navbar: {
      hideOnScroll: true,
      title: "OpenTDF",
      logo: {
        alt: "OpenTDF - Protect the Data, Build the Future",
        src: "img/OpenTDF-Logo.png",
        width: 32,
        height: 32,
      },
      items: [
        {
          type: "doc",
          position: "left",
          docId: "index",
          label: "Docs",
        },
        {
          href: "https://github.com/opentdf",
          label: "GitHub",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "OpenTDF Logo",
        src: "img/opentdf-logo-horizontal.png",
        href: "https://opentdf.io",
      },
      links: [
        {
          title: "Sponsors",
          items: [
            {
              label: "Virtru",
              href: "https://virtru.com",
            },
          ],
        },
        {
          title: "Support",
          items: [
            {
              label: "Tutorials",
              to: "/tutorials",
            },
            {
              label: "Documentation",
              to: "/",
            },
            {
              label: "GitHub Discussions",
              href: "https://github.com/orgs/opentdf/discussions",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Showcase",
              href: "https://github.com/orgs/opentdf/discussions/categories/show-and-tell",
            },
            {
              label: "Roadmap",
              href: "https://github.com/orgs/opentdf/discussions/1806",
            },
          ],
        },
      ],
      copyright: `
          <span>Copyright © ${new Date().getFullYear()} OpenTDF</span>
          <iconify-icon data-icon="mdi:shield-check" style="color: #00FF00;"></iconify-icon>
        `,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "protobuf", "json", "java"],
    },
    // github codeblock theme configuration
    codeblock: {
      showGithubLink: false,
      githubLinkLabel: "View on GitHub",
      showRunmeLink: false,
      runmeLinkLabel: "Checkout via Runme",
    },
    imageZoom: {
      // CSS selector to apply the plugin to, defaults to '.markdown img'
      selector: ".markdown img",
      // // Optional medium-zoom options
      // // see: https://www.npmjs.com/package/medium-zoom#options
      // options: {
      //   margin: 24,
      //   background: '#BADA55',
      //   scrollOffset: 0,
      //   container: '#zoom-container',
      //   template: '#zoom-template',
      // },
    },
    languageTabs: languageTabs,
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    "plugin-image-zoom",

    ...getSpecDocumentationPlugins(),
    [
      "docusaurus-plugin-remote-content",
      {
        name: "otdfctl",
        id: "otdfctl",
        outDir: "docs/components/cli",
        sourceBaseUrl: listRemote.buildRepoRawBaseUrl(otdfctl),
        documents: listRemote.listDocuments(otdfctl, ["docs/man/**/*.md"], []),
        modifyContent: (filename, content) => {
          const baseCommand = "otdfctl";
          let commandTitle, command, subcommand;
          // This will hold the new filename after processing.
          let nextFilename = filename
            .replace(/\.md$/, ".mdx")
            .replace(/\/_index.mdx$/, "/index.mdx")
            .replace(/^docs\/man\//, "");

          if (nextFilename === "index.mdx") {
            nextFilename = "index.mdx";
            command = baseCommand;
            commandTitle = `CLI - ${command}`;
          } else {
            // Extract command name
            const paths = nextFilename.replace(/\.mdx$/, "").split("/");
            if (paths.length >= 1) {
              subcommand = paths[paths.length - 1];
              if (subcommand === "index") {
                subcommand = paths[paths.length - 2];
                paths.pop();
              }
            }
            command = `${baseCommand} ${paths.join(" ")}`;
            commandTitle = command;
          }

          // Extract frontmatter from content
          const { data, content: rawContent } = matter(content);
          data.fullCommand = command;
          const dataJSON = JSON.stringify(data || {})
            .replace(/[\\"']/g, "\\$&")
            .replace(/\u0000/g, "\\0");

          // If hidden then hide
          if (data.command.hidden) {
            return { content: "", filename: "" };
          }

          // Wrap the content in CommandLineDocs component
          const nextContent = `---
title: ${commandTitle}
---

import React from 'react';
import CommandLineDocs from '@site/src/components/CommandLineDocs';

<CommandLineDocs {...JSON.parse("${dataJSON}")}>
${rawContent}
</CommandLineDocs>
          `;

          console.log(`[CLI] Converting ${filename} to ${nextFilename}`);

          // If it's not a README.md or no changes are needed, return the content as is
          return { content: nextContent, filename: nextFilename };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        // options here
        name: "platform-configuration", // used by CLI, must be path safe
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/platform/main/docs/", // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: "docs/getting-started", // the base directory to output to.
        documents: ["Configuring.md"], // the file names to download
        modifyContent: (filename, content) => {
          let updatedContent = content;
          return {
            content: `---
id: configuration
sidebar_position: 20
title: Configuration
---

${updatedContent}`,
            filename: "configuration.md",
          };
        },
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api", // plugin id
        docsPluginId: "classic", // configured for preset-classic
        config: openApiSpecs 
      },
    ],
    require.resolve("docusaurus-lunr-search"),
  ],
};

export default config;
