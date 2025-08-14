/*
When making changes to this file, consider: https://virtru.atlassian.net/browse/DSPX-1577
*/
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

// Utility to find the repo root (directory containing package.json)
function findRepoRoot(startDir = __dirname): string {
  let dir = startDir;
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('Could not find package.json in parent directories');
    dir = parent;
  }
  return dir;
}

const repoRoot = findRepoRoot();
const specsDir = path.join(repoRoot, 'specs');
const specsProcessedDir = path.join(repoRoot, 'specs-processed');

// Boolean to control whether we add '[Preprocessed on' timestamp ']' to the description
const ADD_TIMESTAMP_TO_DESCRIPTION = false;

// The location prefix of built OpenAPI documentation
const OUTPUT_PREFIX = path.join(repoRoot, 'docs', 'OpenAPI-clients');

// The index page for OpenAPI documentation, to support bookmarking & sharing the URL
const OPENAPI_INDEX_PAGE = `${OUTPUT_PREFIX}/index.md`;

// Read BUILD_OPENAPI_SAMPLES once
const BUILD_OPENAPI_SAMPLES = process.env.BUILD_OPENAPI_SAMPLES === '1';

// Initialize empty samples configuration - will be populated conditionally
let samplesConfiguration = {};

interface ApiSpecDefinition {
    id: string; // Unique key for the API spec, e.g., "authorization"
    specPath: string;
    specPathModified?: string; // New field for the preprocessed spec location
    outputDir: string;
    url?: string; // Upstream raw GitHub URL for vendored spec
    sidebarOptions?: {
        groupPathsBy: string,
        categoryLinkSource: string
    }; 
}; 

// Define our OpenAPI specifications here
let openApiSpecsArray: ApiSpecDefinition[] = [
    {
        id: "Well-Known Configuration",
        specPath: path.join(specsDir, 'wellknownconfiguration/wellknown_configuration.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/wellknownconfiguration`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/wellknownconfiguration/wellknown_configuration.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V1 Authorization",
        specPath: path.join(specsDir, 'authorization/authorization.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/authorization/v1`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/authorization.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V2 Authorization",
        specPath: path.join(specsDir, 'authorization/v2/authorization.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/authorization/v2`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/v2/authorization.openapi.yaml',
        // specPathModified: path.join(specsProcessedDir, 'authorization/v2/authorization.openapi.yaml'),
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V1 Entity Resolution",
        specPath: path.join(specsDir, 'entityresolution/entity_resolution.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/entityresolution/v1`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/entity_resolution.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V2 Entity Resolution",
        specPath: path.join(specsDir, 'entityresolution/v2/entity_resolution.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/entityresolution/v2`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/v2/entity_resolution.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "kas",
        specPath: path.join(specsDir, 'kas/kas.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/kas`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/kas/kas.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Objects",
        specPath: path.join(specsDir, 'policy/objects.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/objects.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Key Management",
        specPath: path.join(specsDir, 'policy/keymanagement/key_management.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/keymanagement`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/keymanagement/key_management.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Resource Mapping",
        specPath: path.join(specsDir, 'policy/resourcemapping/resource_mapping.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/resourcemapping`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/resourcemapping/resource_mapping.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Namespaces",
        specPath: path.join(specsDir, 'policy/namespaces/namespaces.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/namespaces`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/namespaces/namespaces.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Attributes",
        specPath: path.join(specsDir, 'policy/attributes/attributes.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/attributes`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/attributes/attributes.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Unsafe Service",
        specPath: path.join(specsDir, 'policy/unsafe/unsafe.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/unsafe`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/unsafe/unsafe.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Actions",
        specPath: path.join(specsDir, 'policy/actions/actions.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/actions`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/actions/actions.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Registered Resources",
        specPath: path.join(specsDir, 'policy/registeredresources/registered_resources.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/registeredresources`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/registeredresources/registered_resources.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Subject Mapping",
        specPath: path.join(specsDir, 'policy/subjectmapping/subject_mapping.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/subjectmapping`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/subjectmapping/subject_mapping.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy KAS Registry",
        specPath: path.join(specsDir, 'policy/kasregistry/key_access_server_registry.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/kasregistry`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/kasregistry/key_access_server_registry.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Obligations",
        specPath: path.join(specsDir, 'policy/obligations/obligations.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy/obligations`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/obligations/obligations.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "Policy Selectors",
        specPath: path.join(specsDir, 'policy/selectors.openapi.yaml'),
        outputDir: `${OUTPUT_PREFIX}/policy`,
        url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/policy/selectors.openapi.yaml',
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    }
];

// Convert array to object keyed by id, omitting 'url' for Docusaurus config
let openApiSpecs: Record<string, Omit<ApiSpecDefinition, 'id' | 'url'>> = {};
openApiSpecsArray.forEach((spec) => {
    const { id, url, ...specDetails } = spec;
    openApiSpecs[id] = specDetails;
});

/**
 * Ensures that required spec files exist in specs-processed directory
 * by copying from specs directory or downloading from URLs.
 * Also populates samplesConfiguration if BUILD_OPENAPI_SAMPLES is enabled.
 */
async function copySamplesToProcessedSpecs() {
  // Only process samples if BUILD_OPENAPI_SAMPLES is enabled
  if (!BUILD_OPENAPI_SAMPLES) {
    console.log('🔍 Skipping sample OpenAPI specs (BUILD_OPENAPI_SAMPLES is not set to 1)');
    return;
  }
  
  console.log('🔍 Including sample OpenAPI specs (petstore, bookstore) based on BUILD_OPENAPI_SAMPLES=1');
  
  // Populate samples configuration when enabled
  samplesConfiguration = {
    petstore: {
      specPath: "specs-processed/petstore.yaml",
      outputDir: "docs/SDK-Samples/petstore",
      downloadUrl:
        "https://raw.githubusercontent.com/PaloAltoNetworks/docusaurus-template-openapi-docs/main/examples/petstore.yaml",
      sidebarOptions: {
        groupPathsBy: "tag",
        categoryLinkSource: "tag",
      },
    } satisfies OpenApiPlugin.Options,
    bookstore: {
      specPath: "specs-processed/bookstore.yaml",
      outputDir: "docs/SDK-Samples/bookstore",
      // downloadUrl:
      //   "https://raw.githubusercontent.com/PaloAltoNetworks/docusaurus-template-openapi-docs/main/examples/bookstore.yaml",
      sidebarOptions: {
        groupPathsBy: "tag",
        categoryLinkSource: "tag",
      },
    } satisfies OpenApiPlugin.Options,
  };
  
  console.log('🔄 Ensuring sample files exist in "specs-processed" directory...');
  
  // Use canonical processed and source directories
  fs.mkdirSync(specsProcessedDir, { recursive: true });

  // Handle petstore specifically - it has a downloadUrl
  const petstorePath = path.join(specsProcessedDir, 'petstore.yaml');
  const petstoreSourcePath = path.join(specsDir, 'petstore.yaml');

  // Always copy from source directory, overwriting if it exists
  console.log(`Copying petstore spec from ${petstoreSourcePath}`);
  fs.copyFileSync(petstoreSourcePath, petstorePath);

  // Handle bookstore specifically
  const bookstorePath = path.join(specsProcessedDir, 'bookstore.yaml');
  const bookstoreSourcePath = path.join(specsDir, 'bookstore.yaml');

  // Always copy from source directory, overwriting if it exists
  console.log(`Copying bookstore spec from ${bookstoreSourcePath}`);
  fs.copyFileSync(bookstoreSourcePath, bookstorePath);
  
  // Add the samples to the main openApiSpecs object
  Object.entries(samplesConfiguration).forEach(([id, specDetails]) => {
    if (typeof specDetails === 'object' && specDetails !== null) {
      openApiSpecs[id] = {
        specPath: (specDetails as any).specPath,
        outputDir: (specDetails as any).outputDir,
        specPathModified: (specDetails as any).specPathModified,
        sidebarOptions: (specDetails as any).sidebarOptions,
      };
    }
  });
};

/**
 * Preprocesses OpenAPI YAML files before they're consumed by docusaurus-plugin-openapi-docs
 */
async function preprocessOpenApiSpecs() {
    console.log('🔄 Preprocessing OpenAPI specification files...');
    
    // Copy sample files to "specs-processed" directory and populate samples config if enabled
    await copySamplesToProcessedSpecs();

    // Process each spec
    for (const [id, spec] of Object.entries(openApiSpecs)) {
        const sourcePath = path.resolve(__dirname, spec.specPath);
        const parsedPath = path.parse(spec.specPath);

        // Generate modified path if not specified
        if (!spec.specPathModified) {
            // Extract the relative path from specsDir
            const relativePath = path.relative(specsDir, spec.specPath);
            
            // Store processed files in 'specs-processed' directory while preserving the original directory structure
            spec.specPathModified = path.join(specsProcessedDir, relativePath);
        }

        const targetPath = path.resolve(spec.specPathModified);

        console.log(`Processing: ${sourcePath} → ${targetPath}`);

        try {
            // Ensure target directory exists
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });

            // Read the YAML file
            const fileContents = fs.readFileSync(sourcePath, 'utf8');

            // Parse YAML to object
            const apiSpec = yaml.load(fileContents);

            // Apply preprocessing modifications: ensure '.info' exists
            apiSpec.info ??= {};

            // Apply preprocessing modifications: ensure '.info.description' exists
            if (apiSpec.info) {
                apiSpec.info.description = apiSpec.info.description ?? '';
                if (ADD_TIMESTAMP_TO_DESCRIPTION) {
                    // Add a timestamp to the description if the flag is set
                    apiSpec.info.description = `[Preprocessed on ${new Date().toISOString()}] ${apiSpec.info.description}`;
                }
            }

            // Apply preprocessing modifications: ensure '.info.version' exists
            if (!apiSpec.info?.version) {
                apiSpec.info = apiSpec.info ?? {};
                apiSpec.info.version = 'v1'; // Default version
            }

            // Apply preprocessing modifications: ensure '.apiSpec.servers' exists
            apiSpec.servers ??= [];

            // Apply preprocessing modifications: ensure '.apiSpec.servers.url' exists and set a default if missing
            if (apiSpec.servers.length === 0 || !apiSpec.servers.some(server => server.url)) {
                apiSpec.servers.push({
                    url: '{platformEndpoint}', // A server URL variable, which users can edit in the web UI
                    description: 'Example OpenTDF platform URL, such as https://platform.localhost',
                    variables: {
                        platformEndpoint: {
                            default: 'platformEndpoint'
                        }
                    }
                });
            }

            // Ensure all paths have proper tags for grouping
            if (apiSpec.paths) {
                Object.keys(apiSpec.paths).forEach(path => {
                    const pathItem = apiSpec.paths[path];

                    // Process each operation in the path
                    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
                        if (pathItem[method]) {
                            const operation = pathItem[method];

                            // Replace any existing tags with just the spec id
                            // This ensures operations only appear under their parent
                            operation.tags = [id]; // Use id instead of spec.id
                        }
                    });
                });
            }

            // Write the modified YAML to the target file
            fs.writeFileSync(targetPath, yaml.dump(apiSpec), 'utf8');
            console.log(`✅ Updated: ${targetPath}`);
        } catch (error) {
            console.error(`❌ Error processing ${sourcePath}:`, error);
        }

        spec.specPath = spec.specPathModified; // Update the original specPath to the modified one

        // Delete the specPathModified property to avoid confusion
        delete spec.specPathModified;
    }

    // Create the index page for OpenAPI documentation
    const indexContent = `---
title: OpenAPI Clients
sidebar_position: 7
---
# OpenAPI Clients

OpenAPI client examples are available for platform endpoints.  

Expand each section in the navigation panel to access the OpenAPI documentation for each service.
`

    // Ensure the file 'OPENAPI_INDEX_PAGE' exists
    fs.mkdirSync(path.dirname(OPENAPI_INDEX_PAGE), { recursive: true });

    fs.writeFileSync(OPENAPI_INDEX_PAGE, indexContent, 'utf8');
    console.log(`✅ Created OpenAPI index page at ${OPENAPI_INDEX_PAGE}`);

    console.log('✨ OpenAPI preprocessing complete');
};


// Export the function and data without automatically executing it
export { openApiSpecs, openApiSpecsArray, preprocessOpenApiSpecs };