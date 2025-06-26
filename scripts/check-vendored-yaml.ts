import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { openApiSpecsArray } from '../preprocessing';

function fileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
  let hasDiff = false;
  for (const spec of openApiSpecsArray) {
    if (!spec.url) continue; // Only process specs with a URL
    // Remove leading './' for specPath if present, and resolve relative to this script
    const specPath = spec.specPath.replace(/^\.\//, '../');
    const absPath = path.resolve(__dirname, specPath);
    const tmpPath = absPath + '.tmp';
    // Download to tmpPath
    const https = await import('https');
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(tmpPath);
      https.get(spec.url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${spec.url}: Status ${response.statusCode}`));
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
      console.error(`❌ Vendored file out of date: ${spec.specPath}\nPlease run 'npm run update-vendored-yaml' to update.`);
    }
    fs.unlinkSync(tmpPath);
  }
  process.exit(hasDiff ? 1 : 0);
}

main();
