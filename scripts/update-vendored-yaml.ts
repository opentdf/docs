import * as fs from 'fs';
import * as path from 'path';

/**
 * Downloads the latest vendored OpenAPI YAML files from the upstream GitHub repository
 * and overwrites the local files in the specs directory.
 * Only applies to specs that originate from the upstream repo.
 */
async function updateVendoredYaml() {
    // Map of specPath (relative to project root) to their upstream raw GitHub URLs
    const vendoredSpecs = [
        {
            specPath: '../specs/authorization/authorization.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/authorization.openapi.yaml',
        },
        {
            specPath: '../specs/authorization/v2/authorization.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/v2/authorization.openapi.yaml',
        },
        {
            specPath: '../specs/entityresolution/entity_resolution.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/entity_resolution.openapi.yaml',
        },
        {
            specPath: '../specs/entityresolution/v2/entity_resolution.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/v2/entity_resolution.openapi.yaml',
        },
        {
            specPath: '../specs/kas/kas.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/kas/kas.openapi.yaml',
        },
        {
            specPath: '../specs/wellknownconfiguration/wellknown_configuration.openapi.yaml',
            url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/wellknownconfiguration/wellknown_configuration.openapi.yaml',
        },
        // Add more entries here as needed
    ];

    const https = await import('https');

    function downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        });
    }

    for (const { specPath, url } of vendoredSpecs) {
        const absPath = path.resolve(__dirname, specPath);
        fs.mkdirSync(path.dirname(absPath), { recursive: true });
        console.log(`⬇️  Downloading ${url} → ${absPath}`);
        try {
            await downloadFile(url, absPath);
            console.log(`✅ Updated: ${absPath}`);
        } catch (err) {
            console.error(`❌ Failed to update ${absPath}:`, err);
        }
    }
    console.log('✨ Vendored OpenAPI YAML files updated');
}


updateVendoredYaml().catch((err) => {
  console.error('Failed to update vendored YAML files:', err);
  process.exit(1);
});
