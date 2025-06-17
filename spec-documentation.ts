import type { PluginConfig } from '@docusaurus/types';

/**
 * Returns an array of plugin configurations that fetch and process OpenTDF specification
 * documentation from GitHub repositories and organize them into the docs/spec directory.
 * 
 * This function contains several steps, which create the 'docs/spec' directory structure,
 * including:
 * - docs/spec/concepts
 * - docs/spec/protocol
 * - docs/spec/schema
 * - docs/spec/index.md
 */
export function getSpecDocumentationPlugins(): PluginConfig[] {
  return [
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
            // Fix segment link to point to integrity_information.md
            updatedContent = updatedContent.replaceAll(
              "./segment.md",
              "./integrity_information.md"
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
            updatedContent = updatedContent.replaceAll(
              "protocol/protocol.md",
              "spec/protocol"
            );
            updatedContent = updatedContent.replaceAll(
              "(schema/)",
              "(spec/schema/)"
            );
            updatedContent = updatedContent.replaceAll(
              "(concepts/)",
              "(category/concepts)"
            );
            updatedContent = updatedContent.replaceAll(
              "(protocol/)",
              "(spec/protocol)"
            );
            updatedContent = updatedContent.replaceAll(
              "schema/nanotdf/README.md",
              "schema/nanotdf.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/nanotdf.md",
              "schema/nanotdf.md"
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
          "https://raw.githubusercontent.com/opentdf/spec/main/concepts/",
        outDir: "docs/spec/concepts/",
        documents: ["access_control.md", "security.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "access_control.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../static/img/"
            );
            // Fix broken markdown links as specified
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/policy.md",
              "../../spec/schema/opentdf/policy.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/key_access_object.md",
              "../../spec/schema/opentdf/key_access_object.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/opentdf/policy.md",
              "../../spec/schema/opentdf/policy.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/opentdf/key_access_object.md",
              "../../spec/schema/opentdf/key_access_object.md"
            );
            return {
              content: `---
sidebar_position: 1
title: Access Control
---
${updatedContent}`,
              filename: "access_control.md",
            };
          }
          if (filename === "security.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../static/img/"
            );
            // Fix broken markdown links as specified
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/integrity_information.md",
              "../../spec/schema/opentdf/integrity_information.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/key_access_object.md",
              "../../spec/schema/opentdf/key_access_object.md"
            );
            return {
              content: `---
sidebar_position: 2
title: Security
---
${updatedContent}`,
              filename: "security.md",
            };
          }
          return { content: content };
        },
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        name: "spec-protocol",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/opentdf/spec/main/protocol/",
        outDir: "docs/spec/protocol/",
        documents: ["protocol.md"],
        modifyContent: (filename: string, content: string) => {
          if (filename === "protocol.md") {
            let updatedContent = content.replaceAll(
              "../../diagrams/",
              "../../static/img/"
            );
            // Fix broken markdown links as specified
            updatedContent = updatedContent.replaceAll(
              "./opentdf/key_access.md",
              "../schema/opentdf/key_access_object.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/opentdf/key_access.md",
              "../schema/opentdf/key_access_object.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/key_access_object.md",
              "../schema/opentdf/key_access_object.md"
            );
            updatedContent = updatedContent.replaceAll(
              "../schema/OpenTDF/policy.md",
              "../schema/opentdf/policy.md"
            );
            updatedContent = updatedContent.replaceAll(
              "./opentdf/segment.md",
              "../schema/opentdf/integrity_information.md"
            );
            updatedContent = updatedContent.replaceAll(
              "./opentdf/integrity_information.md",
              "../schema/opentdf/integrity_information.md"
            );
            return {
              content: `---
sidebar_position: 1
title: Protocol
---
${updatedContent}`,
              filename: "index.md",
            };
          }
          return { content: content };
        },
      },
    ],
  ];
}