import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// List of vendored spec files and their upstream URLs (must match preprocessing.ts)
const vendoredSpecs = [
  {
    specPath: './specs/authorization/authorization.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/authorization.openapi.yaml',
  },
  {
    specPath: './specs/authorization/v2/authorization.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/authorization/v2/authorization.openapi.yaml',
  },
  {
    specPath: './specs/entityresolution/entity_resolution.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/entity_resolution.openapi.yaml',
  },
  {
    specPath: './specs/entityresolution/v2/entity_resolution.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/entityresolution/v2/entity_resolution.openapi.yaml',
  },
  {
    specPath: './specs/kas/kas.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/kas/kas.openapi.yaml',
  },
  {
    specPath: './specs/wellknownconfiguration/wellknown_configuration.openapi.yaml',
    url: 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main/docs/openapi/wellknownconfiguration/wellknown_configuration.openapi.yaml',
  },
];

function fileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
  let hasDiff = false;
  for (const { specPath, url } of vendoredSpecs) {
    const absPath = path.resolve(__dirname, '..', specPath);
    const tmpPath = absPath + '.tmp';
    // Download to tmpPath
    const https = await import('https');
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(tmpPath);
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
        fs.unlink(tmpPath, () => reject(err));
      });
    });
    // Compare hashes
    const oldHash = fileHash(absPath);
    const newHash = fileHash(tmpPath);
    if (oldHash !== newHash) {
      hasDiff = true;
      console.error(`❌ Vendored file out of date: ${specPath}\nPlease run 'npm run update-vendored-yaml' to update.`);
    }
    fs.unlinkSync(tmpPath);
  }
  process.exit(hasDiff ? 1 : 0);
}

main();
