import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';


interface ApiSpecDefinition {
    id: string; // Unique key for the API spec, e.g., "authorization"
    specPath: string;
    specPathModified?: string; // New field for the preprocessed spec location
    outputDir?: string; // Optional: overrides DEFAULT_OPENAPI_OUTPUT_DIR
    sidebarOptions?: { groupPathsBy: string }; // Optional: overrides DEFAULT_OPENAPI_SIDEBAR_OPTIONS
}

// Define all your OpenAPI specifications here
const openApiSpecs: ApiSpecDefinition[] = [
    {
        id: "authorization",
        specPath: "./specs/authorization/authorization.openapi.yaml",
        // specPathModified is auto-generated if not specified
    },
    {
        id: "authorization_v2",
        specPath: "./specs/authorization/v2/authorization.openapi.yaml",
        // Example of custom modified path:
        specPathModified: "./specs-processed/authorization/v2/authorization.openapi.yaml",
    },
    {
        id: "common",
        specPath: "./specs/common/common.openapi.yaml",
    },
    {
        id: "entity",
        specPath: "./specs/entity/entity.openapi.yaml",
    },
    {
        id: "entityresolution",
        specPath: "./specs/entityresolution/entity_resolution.openapi.yaml",
    },
    {
        id: "kas",
        specPath: "./specs/kas/kas.openapi.yaml",
    },
    {
        id: "wellknownconfiguration",
        specPath: "./specs/wellknownconfiguration/wellknown_configuration.openapi.yaml",
    },
    // Add more entries here for other OpenAPI specs
];


/**
 * Preprocesses OpenAPI YAML files before they're consumed by docusaurus-plugin-openapi-docs
 */
async function preprocessOpenApiSpecs() {
    console.log('🔄 Preprocessing OpenAPI specification files...');

    // Process each spec
    for (const spec of openApiSpecs) {
        const sourcePath = path.resolve(__dirname, spec.specPath);

        // Generate modified path if not specified
        if (!spec.specPathModified) {
            const parsedPath = path.parse(spec.specPath);
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

            // Apply your preprocessing modifications here
            if (apiSpec.info) {
                apiSpec.info.description = apiSpec.info.description || '';
                apiSpec.info.description = `[Preprocessed on ${new Date().toISOString()}] ${apiSpec.info.description}`;
            }

            // First check if apiSpec.info exists, else initialize it
            apiSpec.info ??= {};

            // Check for 'info.version' and set a default if missing
            if (!apiSpec.info?.version) {
                apiSpec.info = apiSpec.info ?? {};
                apiSpec.info.version = 'v1'; // Default version
            }

            // First check if apiSpec.servers exists, else initialize it
            apiSpec.servers ??= [];

            // Check for 'servers.url' and set a default if missing
            if (apiSpec.servers.length === 0 || !apiSpec.servers.some(server => server.url)) {
                apiSpec.servers.push({
                    url: 'https://example.com', // Default server URL
                    description: 'Example OpenTDF platform URL'
                });
            }

            // Write the modified YAML to the target file
            fs.writeFileSync(targetPath, yaml.dump(apiSpec), 'utf8');
            console.log(`✅ Updated: ${targetPath}`);
        } catch (error) {
            console.error(`❌ Error processing ${sourcePath}:`, error);
        }
    }

    console.log('✨ OpenAPI preprocessing complete');
}

// Execute the preprocessing function
preprocessOpenApiSpecs().catch(error => {
    console.error('Failed to preprocess OpenAPI specs:', error);
    process.exit(1);
});

export { openApiSpecs, preprocessOpenApiSpecs, ApiSpecDefinition };