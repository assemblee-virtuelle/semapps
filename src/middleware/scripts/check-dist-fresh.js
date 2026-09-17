/**
 * Refuse to publish a package whose `dist/` is stale.
 *
 * `tsc --build` may silently skip emitting a package (e.g. when a referenced project has type
 * errors, or when an incremental build wrongly considers it up to date), and `lerna publish`
 * would then ship the previous compiled output next to the current TypeScript sources -- which
 * is exactly what happened with @semapps/sync 1.2.2. For every `.ts` source of every package,
 * check that its emitted counterpart (`dist/<same path>.js`) exists and is at least as recent.
 *
 * Exit code 1 (with the list of offending files) if anything is missing or stale.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const IGNORED_DIRS = new Set(['node_modules', 'dist', '__tests__', 'tests']);

/** All `.ts` sources (not `.d.ts`) below `dir`, as paths relative to the package root. */
function listSources(dir, pkgDir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) listSources(full, pkgDir, out);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      out.push(path.relative(pkgDir, full));
    }
  }
  return out;
}

let problems = [];

for (const pkgName of fs.readdirSync(PACKAGES_DIR)) {
  const pkgDir = path.join(PACKAGES_DIR, pkgName);
  if (!fs.existsSync(path.join(pkgDir, 'package.json'))) continue;
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  if (pkg.private) continue;

  for (const source of listSources(pkgDir, pkgDir)) {
    const emitted = path.join(pkgDir, 'dist', source.replace(/\.ts$/, '.js'));
    if (!fs.existsSync(emitted)) {
      problems.push(`${pkgName}: ${source} has no emitted dist/${source.replace(/\.ts$/, '.js')}`);
    } else if (fs.statSync(emitted).mtimeMs < fs.statSync(path.join(pkgDir, source)).mtimeMs) {
      problems.push(`${pkgName}: dist/${source.replace(/\.ts$/, '.js')} is older than ${source}`);
    }
  }
}

if (problems.length > 0) {
  console.error('Stale or missing compiled output, refusing to publish:\n  ' + problems.join('\n  '));
  console.error('\nRun `yarn build --force` (or `tsc --build --force` in the package) and check its errors.');
  process.exit(1);
}

console.log('All packages have an up-to-date dist/.');
