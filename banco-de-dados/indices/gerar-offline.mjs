// Gera uma cópia independente para abrir em file://, sem servidor ou conexão.
// Execute: node banco-de-dados/indices/gerar-offline.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, css, labCSS, lessons, labs, app] = await Promise.all([
  'index.html', 'styles.css', 'labs.css', 'lessons.js', 'labs.js', 'app.js'
].map(read));
const inlineScript = value => value.replace(/<\/script/gi, '<\\/script');
const lessonModule = lessons.replace(/^export\s+/gm, '');
const labModule = labs.replace(/^export\s+/gm, '');
const appModule = app.replace(/^import\s+.*?;\s*$/gm, '');
const script = `const {lessons, sources} = (() => {\n${lessonModule}\nreturn {lessons, sources};\n})();\nconst {mountLab} = (() => {\n${labModule}\nreturn {mountLab};\n})();\n${appModule}`;
const result = html
  .replace('  <link rel="stylesheet" href="./styles.css">', `<style>\n${css}\n${labCSS}\n</style>`)
  .replace('  <link rel="stylesheet" href="./labs.css">', '')
  .replace('  <script type="module" src="./app.js"></script>', '')
  .replace('</body>', `<script type="module">\n${inlineScript(script)}\n</script>\n</body>`);
const output = new URL('aula-offline.html', import.meta.url);
await writeFile(output, result);
console.log(`Aula independente gerada: ${fileURLToPath(output)}`);
