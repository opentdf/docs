import * as fs from 'fs';
import * as path from 'path';
import { openApiSpecsArray } from './preprocessing';

/**
 * Downloads the latest vendored OpenAPI YAML files from the upstream GitHub repository
 * and overwrites the local files in the specs directory.
 * Only applies to specs that have a 'url' property.
 */
async function updateVendoredYaml() {
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

    for (const spec of openApiSpecsArray) {
        if (!spec.url) continue; // Only process specs with a URL
        // Remove leading './' for specPath if present, and resolve relative to this script
        const specPath = spec.specPath.replace(/^\.\//, '../../');
        const absPath = path.resolve(__dirname, specPath);
        fs.mkdirSync(path.dirname(absPath), { recursive: true });
        console.log(`⬇️  Downloading ${spec.url} → ${absPath}`);
        try {
            await downloadFile(spec.url, absPath);
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
