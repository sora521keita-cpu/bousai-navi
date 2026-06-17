import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const emittedRoot = resolve(dist, 'assets/src');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : fullPath;
  }));
  return files.flat();
}

function appendJsExtension(specifier) {
  if (!specifier.startsWith('.')) return specifier;
  if (extname(specifier)) return specifier;
  return `${specifier}.js`;
}


async function copyDirectory(sourceDirectory, targetDirectory) {
  try {
    const entries = await readdir(sourceDirectory, { withFileTypes: true });
    await mkdir(targetDirectory, { recursive: true });
    await Promise.all(entries.map((entry) => {
      const sourcePath = join(sourceDirectory, entry.name);
      const targetPath = join(targetDirectory, entry.name);
      return entry.isDirectory() ? copyDirectory(sourcePath, targetPath) : copyFile(sourcePath, targetPath);
    }));
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }
}

function rewriteImports(source) {
  return source
    .replace(/import\s+['"]\.\/styles\.css['"];?\n?/g, '')
    .replace(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g, (_match, specifier) => `from '${appendJsExtension(specifier)}'`)
    .replace(/import\s+['"](\.{1,2}\/[^'"]+)['"];?/g, (_match, specifier) => `import '${appendJsExtension(specifier)}';`);
}

await mkdir(resolve(dist, 'assets'), { recursive: true });
await copyDirectory(resolve(root, 'public'), dist);
await copyFile(resolve(root, 'src/styles.css'), resolve(dist, 'assets/styles.css'));

const jsFiles = (await walk(emittedRoot)).filter((file) => file.endsWith('.js'));
await Promise.all(jsFiles.map(async (file) => {
  const source = await readFile(file, 'utf8');
  await writeFile(file, rewriteImports(source));
}));

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="自治体別の防災情報と緊急時の行動を確認するためのナビゲーションアプリ" />
    <title>わが家の防災ナビ</title>
    <link rel="stylesheet" href="/assets/styles.css" />
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@19",
          "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",
          "react-dom/client": "https://esm.sh/react-dom@19/client"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/src/main.js"></script>
  </body>
</html>
`;

await writeFile(resolve(dist, 'index.html'), html);
console.log('dist app assets generated');
