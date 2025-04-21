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
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid", "docusaurus-theme-github-codeblock"],

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
          docId: "introduction",
          label: "Docs",
        },
        {
          href: "https://github.com/opentdf/docs",
          label: "GitHub",
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
              label: "Getting Started",
              to: "/getting-started/configuration",
            },
            {
              label: "Documentation",
              to: "/introduction",
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
    [
      "docusaurus-plugin-remote-content",
      {
        // options here
        name: "nanotdf", // used by CLI, must be path safe
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/schema/nanotdf/", // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: "docs/spec/schema/", // the base directory to output to.
        documents: ["README.md"], // the file names to download
        modifyContent: (filename, content) => {
          if (filename === "README.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../../static/img/"
            );
            updatedContent = updatedContent.replaceAll(
              "# nanotdf - a compact binary TDF format",
              "# nanoTDF - a compact binary TDF format"
            );
            return {
              content: `---
id: nanotdf
sidebar_position: 2
title: NanoTDF
---

${updatedContent}`,
              filename: "nanotdf.md",
            };
          }
          // If it's not a README.md or no changes are needed, return the content as is
          return { content: content };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        // options here
        name: "images-content", // used by CLI, must be path safe
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/diagrams/", // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: "static/img/", // the base directory to output to.
        documents: [
          "ecc_and_binding.svg",
          "nanotdf.svg",
          "symmetric_and_payload.svg",
          "filecontents.svg",
        ], // the file names to download
        requestConfig: { responseType: "arraybuffer" },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        // options here
        name: "tdf", // used by CLI, must be path safe
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/schema/OpenTDF/", // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: "docs/spec/schema/opentdf/", // the base directory to output to.
        documents: [
          "manifest.md",
          "key_access_object.md",
          "encryption_information.md",
          "integrity_information.md",
          "policy.md",
          "attributes.md",
          "assertion.md",
          "assertion_binding.md",
          "method.md",
          "payload.md",
          "assertion_statement.md",
        ], // the file names to download
        // Refactored: Use a configuration map for maintainability
        modifyContent: (filename, content) => {
          // Always apply the diagram path replacement first
          let updatedContent = content.replaceAll(
            "../../diagrams/",
            "../../../../static/img/"
          );

          // Configuration map for file-specific frontmatter and processing
          const fileConfig = {
            "manifest.md": {
              frontmatter: {
                id: "manifest",
                sidebar_position: 1,
                title: "Manifest",
              },
            },
            "payload.md": {
              frontmatter: {
                id: "payload",
                sidebar_position: 2,
                title: "Payload",
              },
            },
            "encryption_information.md": {
              frontmatter: {
                id: "encryption_information",
                sidebar_position: 3,
                title: "Encryption Information",
              },
            },
            "key_access_object.md": {
              frontmatter: {
                id: "key_access_object",
                sidebar_position: 4,
                title: "Key Access Object",
              },
              process: (content) => {
                let c = content
                  .replaceAll("<code>", "```")
                  .replaceAll("</code>", "```");
                c = c.replace(/<p>/gi, "");
                return c;
              },
            },
            "method.md": {
              frontmatter: {
                id: "method",
                sidebar_position: 5,
                title: "Method",
              },
            },
            "integrity_information.md": {
              frontmatter: {
                id: "integrity_information",
                sidebar_position: 6,
                title: "Integrity Information",
              },
            },
            "policy.md": {
              frontmatter: {
                id: "policy",
                sidebar_position: 7,
                title: "Policy",
              },
            },
            "attributes.md": {
              frontmatter: {
                id: "attributes",
                sidebar_position: 8,
                title: "Attribute Object",
              },
              process: (content) => {
                // Escape the problematic curly braces in the attribute URI example
                return content.replace(
                  "{Namespace}/attr/{Name}/value/{Value}",
                  "`{Namespace}/attr/{Name}/value/{Value}`"
                );
              },
            },
            "assertion.md": {
              frontmatter: {
                id: "assertion",
                sidebar_position: 9,
                title: "Assertion",
              },
            },
            "assertion_statement.md": {
              frontmatter: {
                id: "assertion_statement",
                sidebar_position: 10,
                title: "Assertion Statement",
              },
            },
            "assertion_binding.md": {
              frontmatter: {
                id: "assertion_binding",
                sidebar_position: 11,
                title: "Assertion Binding",
              },
            },
          };

          const config = fileConfig[filename];

          if (config) {
            // Apply any special processing after diagram path replacement
            let finalContent = updatedContent;
            if (typeof config.process === "function") {
              finalContent = config.process(updatedContent);
            }
            // Build frontmatter string
            const { id, sidebar_position, title } = config.frontmatter;
            const frontmatterStr = `---
id: ${id}
sidebar_position: ${sidebar_position}
title: ${title}
---

${finalContent ? finalContent : ""}`;
            return { content: frontmatterStr };
          }

          // If no config, return content with only the diagram path replacement
          return { content: updatedContent };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "opentdf-index",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/schema/OpenTDF/",
        outDir: "docs/spec/schema/opentdf/",
        documents: ["README.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "README.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../../../static/img/"
            );
            return {
              content: `---
sidebar_position: 1
title: OpenTDF
---
${updatedContent}`,
              filename: "index.md",
            };
          }
          return { content: content };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "spec-index",
        sourceBaseUrl: "https://raw.githubusercontent.com/opentdf/spec/main/",
        outDir: "docs/spec/",
        documents: ["README.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "README.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../static/img/"
            );
            return {
              content: `---
sidebar_position: 1
title: OpenTDF
---
${updatedContent}`,
              filename: "index.md",
            };
          }
          return { content: content };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "schema-index",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/schema/",
        outDir: "docs/spec/schema/",
        documents: ["README.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "README.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../static/img/"
            );
            // Replace all case-insensitive references to OpenTDF/README.md and nanotdf/README.md with ./opentdf and ./nanotdf
            updatedContent = updatedContent.replace(
              /opentdf\/README\.md/gi,
              "./schema/opentdf"
            );
            updatedContent = updatedContent.replace(
              /nanotdf\/README\.md/gi,
              "./schema/nanotdf"
            );
            return {
              content: `---
sidebar_position: 1
title: OpenTDF
---
${updatedContent}`,
              filename: "index.md",
            };
          }
          return { content: content };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "spec-concept",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/schema/",
        outDir: "docs/spec/schema/",
        documents: ["README.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "README.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../static/img/"
            );
            return {
              content: `---
sidebar_position: 1
title: Concept
---
${updatedContent}`,
              filename: "index.md",
            };
          }
          return { content: content };
        },
      },
    ],
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
  ],
};

export default config;
