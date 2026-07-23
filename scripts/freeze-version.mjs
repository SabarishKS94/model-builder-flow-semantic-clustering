#!/usr/bin/env node
/**
 * Freeze the current build as a versioned snapshot on the pages branch.
 *
 * Every version gets a stable URL — v1 stays viewable at .../versions/v1/
 * even after v2, v3, etc. ship to root.
 *
 * Usage:
 *   node scripts/freeze-version.mjs --version=v1 --target=gh
 *   node scripts/freeze-version.mjs --version=v2 --target=soma
 *
 * Or via package.json:
 *   npm run freeze:gh -- --version=v1
 *   npm run freeze:soma -- --version=v1
 *
 * Workflow (each time you promote new work to root):
 *   1. Freeze the CURRENT work at its version number:
 *        npm run freeze:soma -- --version=v2
 *   2. Deploy to root as usual:
 *        npm run deploy:soma
 *   3. In the-prototype-shelf, add the new version entry to flows.js with
 *      `entry` pointing at the frozen URL, and flip `current` on the new one.
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const args = Object.fromEntries(
    process.argv.slice(2).flatMap((a) => {
        const m = a.match(/^--([^=]+)=(.+)$/);
        return m ? [[m[1], m[2]]] : [];
    })
);

const version = args.version;
const target = args.target;

if (!version || !/^v\d+$/.test(version)) {
    console.error('Missing or invalid --version. Expected format: v1, v2, v10, ...');
    process.exit(1);
}
if (!target || !['gh', 'soma'].includes(target)) {
    console.error('Missing or invalid --target. Expected: gh | soma');
    process.exit(1);
}

const REPO_URLS = {
    gh: 'https://github.com/SabarishKS94/model-builder-flow-semantic-clustering.git',
    soma: 'git@git.soma.salesforce.com:sabarish-ks/model-builder-flow-semantic-clustering.git',
};

const destDir = `versions/${version}`;

function run(cmd, cmdArgs, env = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, cmdArgs, {
            cwd: ROOT,
            stdio: 'inherit',
            env: { ...process.env, ...env },
        });
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${cmd} ${cmdArgs.join(' ')} exited ${code}`));
        });
    });
}

console.log(`\n▸ Freezing ${version} for target=${target} → ${destDir}/\n`);

// Build with a relative base so the bundle works from any subpath.
await run('npx', ['vite', 'build', '--base=./']);

// Publish the built dist into the versioned subdirectory on the pages branch.
// --add keeps existing files (i.e. the current root deploy and other versions).
// --dest places our files under versions/<v>/.
// A stable message so repeated freezes don't spam the branch history.
await run(
    'npx',
    [
        'gh-pages',
        '-d', 'dist',
        '--dest', destDir,
        '--add',
        '--nojekyll',
        '--message', `Freeze ${version}`,
        '--repo', REPO_URLS[target],
    ]
);

const publicUrl =
    target === 'gh'
        ? `https://sabarishks94.github.io/model-builder-flow-semantic-clustering/${destDir}/`
        : `https://git.soma.salesforce.com/pages/sabarish-ks/model-builder-flow-semantic-clustering/${destDir}/`;

console.log(`\n✔ Frozen. This version now lives at:\n  ${publicUrl}\n`);
console.log('Next: add the entry to the-prototype-shelf/src/demos/flows.js under this project\'s `versions` block.\n');
