// Verificação de integração sem navegador: rotas, progresso, quizzes e pacote offline.
// Não substitui uma conferência visual em navegador nem executa SQL Server.
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const lessonCode = await read('lessons.js');
const { lessons, sources } = await import(`data:text/javascript;base64,${Buffer.from(lessonCode).toString('base64')}`);
assert.equal(lessons.length, 20);
assert.equal(new Set(lessons.map(l => l.id)).size, 20);
assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
for (const source of sources) assert.equal(new URL(source.url).hostname, 'learn.microsoft.com');
for (const lesson of lessons) {
  assert.ok(lesson.title && lesson.shortTitle && lesson.kind && lesson.experiment);
  assert.ok(lesson.concepts.length >= 3);
  assert.ok(lesson.quiz.options[lesson.quiz.answer]);
  assert.ok(lesson.quiz.explanation);
  for (const id of lesson.sourceIds) assert.ok(sources.some(s => s.id === id), `Fonte ausente: ${id}`);
}

class Element {
  constructor(id) {
    this.id = id; this.html = ''; this.textContent = ''; this.attrs = {}; this.style = {}; this.events = {}; this.dataset = {};
    const names = new Set();
    this.classList = { add: n => names.add(n), remove: n => names.delete(n), contains: n => names.has(n), toggle: (n, force) => { const next = force ?? !names.has(n); next ? names.add(n) : names.delete(n); return next; } };
  }
  set innerHTML(value) { this.html = value; }
  get innerHTML() { return this.html; }
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener(name, fn) { (this.events[name] ??= []).push(fn); }
  click() { for (const fn of this.events.click ?? []) fn({ target: this }); }
  focus() { document.activeElement = this; }
  closest() { return null; }
}
const elements = new Map();
const get = id => { if (!elements.has(id)) elements.set(id, new Element(id)); return elements.get(id); };
const main = get('main');
let quizCache = [];
Object.defineProperty(main, 'innerHTML', { get() { return this.html; }, set(value) {
  this.html = value;
  for (const match of value.matchAll(/\bid="([^"]+)"/g)) elements.set(match[1], new Element(match[1]));
  quizCache = [...value.matchAll(/data-quiz="([^"]+)"/g)].map(match => {
    const lesson = lessons.find(l => l.id === match[1]);
    const quiz = new Element(); quiz.dataset.quiz = lesson.id;
    quiz.buttons = lesson.quiz.options.map((_, i) => { const b = new Element(); b.dataset.answer = String(i); return b; });
    quiz.feedback = new Element();
    quiz.querySelectorAll = selector => selector === '[data-answer]' ? quiz.buttons : [];
    quiz.querySelector = selector => selector === '.quiz-feedback' ? quiz.feedback : null;
    return quiz;
  });
} });
const documentEvents = {};
const windowEvents = {};
const store = new Map();
const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
const document = {
  title: '', body: new Element('body'), activeElement: null,
  querySelector: selector => selector.startsWith('#') ? get(selector.slice(1)) : null,
  querySelectorAll: selector => selector === '[data-quiz]' ? quizCache : [],
  addEventListener: (name, fn) => { documentEvents[name] = fn; }
};
const location = { hash: '' };
let mounted = [], disposed = 0;
const context = vm.createContext({
  lessons, sources, document, location, localStorage: storage,
  window: { addEventListener: (name, fn) => { windowEvents[name] = fn; }, scrollTo() {} },
  mountLab: (container, kind) => { assert.ok(container); mounted.push(kind); return () => disposed++; },
  setTimeout: () => 1, clearTimeout() {}, URL, console, matchMedia: () => ({matches:false})
});
const appCode = (await read('app.js')).replace(/^import\s+.*?;\s*$/gm, '');
vm.runInContext(appCode, context, { filename: 'app.js' });
assert.ok(main.innerHTML.includes('O caminho até'));
assert.equal(mounted.at(-1), 'book');

for (const lesson of lessons) {
  const previousMounts = mounted.length;
  location.hash = `#${lesson.id}`;
  windowEvents.hashchange();
  assert.ok(main.innerHTML.includes(lesson.title), `Rota não renderizada: ${lesson.id}`);
  assert.equal(mounted.at(-1), lesson.kind);
  assert.equal(mounted.length, previousMounts + 1);
  assert.equal(quizCache.length, 1);
  assert.ok(!/\b(?:undefined|NaN)\b/.test(main.innerHTML));
  quizCache[0].buttons[lesson.quiz.answer].click();
  assert.ok(quizCache[0].feedback.innerHTML.includes('Isso mesmo.'));
  get('complete-lesson').click();
}
const saved = JSON.parse(store.get('indices-por-dentro-v1'));
assert.equal(saved.completed.length, 20);
assert.equal(Object.keys(saved.answers).length, 20);
assert.equal(disposed, 20);
assert.equal((get('lesson-nav').innerHTML.match(/aria-current="page"/g) ?? []).length, 1);
location.hash = '#revisao'; windowEvents.hashchange();
assert.equal(quizCache.length, 20);
assert.equal(get('revision-score').textContent, '20 corretas · 20 respondidas · 20 questões');
get('reset-answers').click();
assert.equal(get('revision-score').textContent, '0 corretas · 0 respondidas · 20 questões');
location.hash = '#referencias'; windowEvents.hashchange();
assert.equal((main.innerHTML.match(/learn\.microsoft\.com/g) ?? []).length, sources.length * 2);
get('presentation-button').click();
assert.equal(document.activeElement, main, 'Modo aula deve mover foco para permitir navegação por setas.');
assert.equal(document.body.classList.contains('presenting'), true);
documentEvents.keydown({ key: 'Escape' });
assert.equal(document.body.classList.contains('presenting'), false);
location.hash = '#livro'; windowEvents.hashchange();
get('presentation-button').click();
documentEvents.keydown({ key: 'ArrowRight', target: main, preventDefault() {} });
assert.equal(location.hash, lessons[1].id);

const html = await read('index.html');
for (const match of html.matchAll(/(?:href|src)="\.\/([^"#]+)"/g)) await access(new URL(match[1], import.meta.url));
const home = await read('../../index.html');
assert.ok(home.includes('class="lab-card sql-indices"'));
assert.ok(home.includes('data-filter="banco-dados"'));
assert.ok(home.includes('data-subject="banco-dados"'));
const standalone = await read('aula-offline.html');
assert.ok(!standalone.includes('src="./app.js"'));
assert.ok(!standalone.includes('href="./styles.css"'));
const scripts = [...standalone.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1);
assert.ok(!/^import\s/m.test(scripts[0][1]));
new vm.Script(scripts[0][1], {filename:'aula-offline.html'});
assert.ok(standalone.includes(lessonCode.replace(/^export\s+/gm, '')), 'Regere o HTML offline após mudar as aulas.');
const labsCode = (await read('labs.js')).replace(/^export\s+/gm, '');
assert.ok(standalone.includes(labsCode), 'Regere o HTML offline após mudar os laboratórios.');
console.log(`OK: ${lessons.length} rotas, ${lessons.length} quizzes, progresso, modo aula, ${sources.length} fontes, links e HTML offline.`);
console.log(`Pasta: ${fileURLToPath(new URL('.', import.meta.url))}`);
