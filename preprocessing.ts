import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

// Boolean to control whether we add '[Preprocessed on' timestamp ']' to the description
const ADD_TIMESTAMP_TO_DESCRIPTION = false;

// The location prefix of built OpenAPI documentation
const OUTPUT_PREFIX = 'docs/OpenAPI-clients';

// Read BUILD_OPENAPI_SAMPLES once
const BUILD_OPENAPI_SAMPLES = process.env.BUILD_OPENAPI_SAMPLES === '1';

// Initialize empty samples configuration - will be populated conditionally
let samplesConfiguration = {};

interface ApiSpecDefinition {
    id: string; // Unique key for the API spec, e.g., "authorization"
    specPath: string;
    specPathModified?: string; // New field for the preprocessed spec location
    outputDir: string;
    sidebarOptions?: {
        groupPathsBy: string,
        categoryLinkSource: string
    }; 
}; 

// Define our OpenAPI specifications here
let openApiSpecsArray: ApiSpecDefinition[] = [
    {
        id: "Well-Known Configuration",
        specPath: "./specs/wellknownconfiguration/wellknown_configuration.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/wellknownconfiguration`,
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V1 Authorization",
        specPath: "./specs/authorization/authorization.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/authorization/v1`,
        // specPathModified is auto-generated if not specified
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V2 Authorization",
        specPath: "./specs/authorization/v2/authorization.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/authorization/v2`,
        // Example of custom modified path:
        specPathModified: "./specs-processed/authorization/v2/authorization.openapi.yaml",
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V1 Entity Resolution",
        specPath: "./specs/entityresolution/entity_resolution.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/entityresolution/v1`,
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "V2 Entity Resolution",
        specPath: "./specs/entityresolution/v2/entity_resolution.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/entityresolution/v2`,
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    {
        id: "kas",
        specPath: "./specs/kas/kas.openapi.yaml",
        outputDir: `${OUTPUT_PREFIX}/kas`,
        sidebarOptions: {
            groupPathsBy: "tag",
            categoryLinkSource: "info",
        },
    },
    // Add more entries here for other OpenAPI specs
];

// Convert array to object keyed by id
let openApiSpecs: Record<string, Omit<ApiSpecDefinition, 'id'>> = {};
openApiSpecsArray.forEach((spec) => {
    const { id, ...specDetails } = spec;
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
  
  const processedDir = path.resolve(__dirname, 'specs-processed');
  fs.mkdirSync(processedDir, { recursive: true });
  
  // Handle petstore specifically - it has a downloadUrl
  const petstorePath = path.resolve(__dirname, 'specs-processed/petstore.yaml');
  const petstoreSourcePath = path.resolve(__dirname, 'specs/petstore.yaml');
  
  // Always copy from source directory, overwriting if it exists
  console.log(`Copying petstore spec from ${petstoreSourcePath}`);
  fs.copyFileSync(petstoreSourcePath, petstorePath);
  
  // Handle bookstore specifically
  const bookstorePath = path.resolve(__dirname, 'specs-processed/bookstore.yaml');
  const bookstoreSourcePath = path.resolve(__dirname, 'specs/bookstore.yaml');
  
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
            // Store processed files in a 'specs-processed' directory by default
            spec.specPathModified = path.join(
                parsedPath.dir.replace(/^\.\/specs/, './specs-processed'),
                parsedPath.base
            );
        }

        const targetPath = path.resolve(__dirname, spec.specPathModified);

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

    console.log('✨ OpenAPI preprocessing complete');
};

// Execute the preprocessing function
preprocessOpenApiSpecs().catch(error => {
    console.error('Failed to preprocess OpenAPI specs:', error);
    process.exit(1);
});

export { openApiSpecs };