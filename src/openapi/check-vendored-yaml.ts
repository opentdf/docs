/*
When making changes to this file, consider: https://virtru.atlassian.net/browse/DSPX-1577
*/
import * as fs from 'fs';
import * as crypto from 'crypto';
import { openApiSpecsArray } from './preprocessing';

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
    // absPaths is the absolute path to the spec file
    const absPath = spec.specPath;
    const tmpPath = absPath + '.tmp';
    // Download to tmpPath
    await downloadFile(spec.url, tmpPath);
    // Compare hashes
    const oldHash = fileHash(absPath);
    const newHash = fileHash(tmpPath);
    if (oldHash !== newHash) {
      hasDiff = true;
      console.error(`❌ Vendored file out of date: ${spec.specPath}\nPlease run 'npm run update-vendored-yaml' to update.`);
    } else {
      console.log(`✅ Vendored file is up to date: ${spec.specPath}`);
    }
    fs.unlinkSync(tmpPath);
  }
  process.exit(hasDiff ? 1 : 0);
}

main();
