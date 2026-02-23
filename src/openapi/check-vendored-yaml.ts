/*
When making changes to this file, consider: https://virtru.atlassian.net/browse/DSPX-1577
*/
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as yaml from 'js-yaml';
import { openApiSpecsArray } from './preprocessing';

const PLATFORM_API_BASE = 'https://api.github.com/repos/opentdf/platform';
const PLATFORM_RAW_BASE = 'https://raw.githubusercontent.com/opentdf/platform/refs/heads/main';

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

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    import('https').then(https => {
      https.get(url, { headers: { 'User-Agent': 'opentdf-docs-check-vendored-yaml' } } as any, (response: any) => {
        let data = '';
        response.on('data', (chunk: string) => { data += chunk; });
        response.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Failed to parse JSON from ${url}: ${e}`)); }
        });
      }).on('error', reject);
    }).catch(reject);
  });
}

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    import('https').then(https => {
      https.get(url, { headers: { 'User-Agent': 'opentdf-docs-check-vendored-yaml' } } as any, (response: any) => {
        let data = '';
        response.on('data', (chunk: string) => { data += chunk; });
        response.on('end', () => resolve(data));
      }).on('error', reject);
    }).catch(reject);
  });
}

/**
 * Recursively fetches all .yaml file paths under docs/openapi/ in the platform repo.
 */
async function fetchRemoteSpecPaths(dirPath = 'docs/openapi'): Promise<string[]> {
  const specPaths: string[] = [];
  const contents = await fetchJson(`${PLATFORM_API_BASE}/contents/${dirPath}`);

  for (const item of contents) {
    if (item.type === 'file' && item.name.endsWith('.yaml')) {
      specPaths.push(item.path);
    } else if (item.type === 'dir') {
      specPaths.push(...await fetchRemoteSpecPaths(item.path));
    }
  }

  return specPaths;
}

/**
 * Returns true if the spec at the given raw URL has actual API paths defined
 * (i.e. it is a real API spec, not a shared schema-only file like common or entity).
 */
async function hasApiPaths(rawUrl: string): Promise<boolean> {
  const content = await fetchText(rawUrl);
  const spec = yaml.load(content) as any;
  return spec?.paths != null && Object.keys(spec.paths).length > 0;
}

async function main() {
  let hasDiff = false;

  // --- Check 1: vendored files are up to date ---
  for (const spec of openApiSpecsArray) {
    if (!spec.url) continue;
    const absPath = spec.specPath;
    const tmpPath = absPath + '.tmp';
    await downloadFile(spec.url, tmpPath);
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

  // --- Check 2: no unregistered spec files in the platform repo ---
  console.log('\n🔍 Checking for unregistered spec files in opentdf/platform...');
  const registeredUrls = new Set(
    openApiSpecsArray.flatMap(spec => spec.url ? [spec.url] : [])
  );

  const remoteSpecPaths = await fetchRemoteSpecPaths();

  for (const remotePath of remoteSpecPaths) {
    const expectedUrl = `${PLATFORM_RAW_BASE}/${remotePath}`;
    if (registeredUrls.has(expectedUrl)) continue;

    // Not registered — check if it actually has API paths (vs shared schema file)
    if (await hasApiPaths(expectedUrl)) {
      hasDiff = true;
      console.error(
        `❌ Unregistered spec found in platform repo: ${remotePath}\n` +
        `   Add an entry to openApiSpecsArray in src/openapi/preprocessing.ts with:\n` +
        `   url: '${expectedUrl}'`
      );
    } else {
      console.log(`ℹ️  Skipping schema-only file (no paths): ${remotePath}`);
    }
  }

  process.exit(hasDiff ? 1 : 0);
}

main();
