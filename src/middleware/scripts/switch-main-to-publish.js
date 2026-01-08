/**
 * Switch each package's root `main` to the value in `publishConfig.main`.
 * Stores the original `main` into `xDevMain` for later restoration.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');

/**
 * Reads and parses JSON file.
 */
function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Safely writes JSON to file with 2-space indentation and trailing newline.
 */
function writeJson(filePath, data) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Process one package.json file.
 */
function processPackageJson(pkgJsonPath) {
  const pkgDir = path.dirname(pkgJsonPath);
  const pkg = readJson(pkgJsonPath);

  // Nothing to do if publishConfig.main is missing
  const publishMain = pkg?.publishConfig?.main;
  if (!publishMain) return { skipped: true, reason: 'no publishConfig.main' };

  // Only switch if it's different from current main (or main missing)
  const currentMain = pkg.main;
  if (currentMain === publishMain) return { skipped: true, reason: 'already aligned' };

  // Store original main (if any) in a temporary metadata field to allow reverting later
  if (typeof pkg.xDevMain === 'undefined') {
    pkg.xDevMain = typeof currentMain === 'string' ? currentMain : null;
  }

  // Overwrite root main with publishConfig.main
  pkg.main = publishMain;

  writeJson(pkgJsonPath, pkg);
  return { updated: true, pkgDir, from: currentMain, to: publishMain };
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
    throw new Error(`[switch-main-to-publish] packages directory not found: ${PACKAGES_DIR}`);
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
      process.stderr.write(`[switch-main-to-publish] Error processing ${ent.name}: ${e?.message || e}\n`);
      process.exitCode = 1;
    }
  }

  // Compact log summary
  const updated = results.filter(r => r.updated);
  const skipped = results.filter(r => r.skipped);
  process.stdout.write(`[switch-main-to-publish] Updated ${updated.length} packages, skipped ${skipped.length}.\n`);
}

run();
