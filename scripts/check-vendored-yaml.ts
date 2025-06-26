import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { openApiSpecsArray } from '../preprocessing';

function fileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    import('https').then(https => {
      const file = fs.createWriteStream(dest);
      https.get(url, (response: any) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err: any) => {
        fs.unlink(dest, () => reject(err));
      });
    }).catch(reject);
  });
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
    await downloadFile(spec.url, tmpPath);
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
