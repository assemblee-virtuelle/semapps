/**
 * Revert each package's root `main` from the temporary `xDevMain` field if present.
 * If `xDevMain` is null, delete the `main` field.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function writeJson(filePath, data) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function processPackageJson(pkgJsonPath) {
  const pkg = readJson(pkgJsonPath);

  if (!Object.prototype.hasOwnProperty.call(pkg, 'xDevMain')) {
    return { skipped: true, reason: 'no xDevMain marker' };
  }

  const devMain = pkg.xDevMain;
  if (devMain === null || devMain === undefined || devMain === '') {
    // If original main was missing, remove main
    delete pkg.main;
  } else {
    pkg.main = devMain;
  }

  // Clean up the marker
  delete pkg.xDevMain;

  writeJson(pkgJsonPath, pkg);
  return { updated: true };
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (_) {
    return false;
  }
}

function run() {
  if (!isDirectory(PACKAGES_DIR)) {
    throw new Error(`[revert-main-from-publish] packages directory not found: ${PACKAGES_DIR}`);
  }

  const entries = fs.readdirSync(PACKAGES_DIR, { withFileTypes: true });
  const results = [];

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const pkgJsonPath = path.join(PACKAGES_DIR, ent.name, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) continue;

    try {
      const res = processPackageJson(pkgJsonPath);
      results.push({ name: ent.name, ...res });
    } catch (e) {
      process.stderr.write(`[revert-main-from-publish] Error processing ${ent.name}: ${e?.message || e}\n`);
      process.exitCode = 1;
    }
  }

  const updated = results.filter(r => r.updated);
  const skipped = results.filter(r => r.skipped);
  process.stdout.write(`[revert-main-from-publish] Reverted ${updated.length} packages, skipped ${skipped.length}.\n`);
}

run();
