// Run: node banco-de-dados/indices/tests-labs.mjs
// Exercises the public mount API and checks rendered data/results. The small
// event stub is not a browser: responsive layout and focus need browser QA.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./labs.js', import.meta.url), 'utf8');
const { mountLab } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const kinds = ['book', 'tree', 'storage', 'copies', 'access', 'lookup', 'include', 'composite', 'sarg', 'computed', 'plan', 'clauses', 'selectivity', 'filtered', 'types', 'writes', 'stats', 'maintenance', 'tuning', 'challenge'];
const plain = text => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const tables = html => [...html.matchAll(/<table\b[\s\S]*?<\/table>/g)].map(([markup]) => ({
  headers: [...markup.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map(([, cell]) => plain(cell)),
  rows: [...markup.matchAll(/<tr class="([^"]*)">([\s\S]*?)<\/tr>/g)].map(([, className, row]) => ({
    active: className.split(' ').includes('sl-lit'),
    cells: [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(([, cell]) => plain(cell)),
  })),
}));
function harness(kind) {
  const handlers = new Map();
  const container = {
    innerHTML: '',
    addEventListener: (name, callback) => handlers.set(name, callback),
    removeEventListener: name => handlers.delete(name),
    contains: () => true,
    querySelector: () => ({ focus() {} }),
  };
  const cleanup = mountLab(container, kind);
  return {
    get html() { return container.innerHTML; },
    get text() { return plain(container.innerHTML); },
    get tables() { return tables(container.innerHTML); },
    metric(label) {
      const entries = [...container.innerHTML.matchAll(/<div class="sl-metric[^\"]*"><strong>([\s\S]*?)<\/strong><span>([\s\S]*?)<\/span>/g)];
      const entry = entries.find(([, , text]) => plain(text) === label);
      assert.ok(entry, `Missing metric: ${label}`);
      return plain(entry[1]);
    },
    click(action, value) { handlers.get('click')({ target: { closest: () => ({ dataset: { action, value } }) } }); },
    select(control, value) { handlers.get('change')({ target: { closest: () => ({ dataset: { control }, value: String(value) }) } }); },
    advance(count) { for (let i = 0; i < count; i++) this.click('step'); },
    cleanup() { cleanup(); assert.equal(handlers.size, 0, 'Cleanup must remove delegated handlers'); },
  };
}

let count = 0;
function test(label, run) { run(); count++; console.log(`PASS ${label}`); }
function withLab(kind, run) { const lab = harness(kind); try { run(lab); } finally { lab.cleanup(); } }

test('All 20 labs render and supported control/action variants remain valid', () => {
  let variants = 0;
  for (const kind of kinds) withLab(kind, lab => {
    assert.match(lab.text, /SIMULAÇÃO DIDÁTICA/);
    assert.match(lab.text, /não executa SQL Server/);
    const controls = [...lab.html.matchAll(/<select data-control="([^"]+)">([\s\S]*?)<\/select>/g)];
    for (const [, name, options] of controls) for (const [, value] of options.matchAll(/value="([^"]*)"/g)) {
      lab.select(name, value);
      assert.doesNotMatch(lab.html, /NaN|undefined/, `${kind}: ${name}=${value}`);
      variants++;
    }
    const buttons = [...lab.html.matchAll(/<button\b([^>]*)>/g)].map(([, attrs]) => ({
      action: attrs.match(/data-action="([^"]+)"/)?.[1],
      value: attrs.match(/data-value="([^"]*)"/)?.[1],
      disabled: /\bdisabled\b/.test(attrs),
    }));
    for (const button of buttons) if (button.action && button.action !== 'play' && !button.disabled) {
      lab.click(button.action, button.value);
      assert.doesNotMatch(lab.html, /NaN|undefined/, `${kind}: ${button.action}`);
      variants++;
    }
  });
  assert.ok(variants > 120);
  console.log(`  ${variants} supported variants exercised`);
});

test('Book index visits referenced pages; scan visits ten pages', () => withLab('book', lab => {
  lab.advance(3);
  assert.equal(lab.metric('páginas do livro visitadas'), '2');
  lab.select('mode', 'scan');
  lab.advance(10);
  assert.equal(lab.metric('páginas do livro visitadas'), '10');
}));

test('Heap localizers use matching RID addresses rather than Id keys', () => withLab('storage', lab => {
  lab.select('storage', 'heap');
  const [base, index] = lab.tables;
  assert.ok(base.headers.includes('RID'));
  const claudio = base.rows.find(row => row.cells[1] === '4');
  assert.equal(claudio.cells[0], '1:120:2');
  assert.ok(index.rows.some(row => row.cells[0] === 'SP' && row.cells[1] === 'RID 1:120:2'));
  assert.ok(index.rows.every(row => row.cells[1].startsWith('RID ')));
  lab.select('storage', 'cluster');
  assert.ok(lab.tables[1].rows.every(row => row.cells[1].startsWith('Id = ')));
}));

test('Every B+ tree point lookup finds exactly its requested row', () => withLab('tree', lab => {
  for (let id = 1; id <= 12; id++) {
    lab.select('target', id); lab.advance(3);
    const lit = lab.tables.flatMap(table => table.rows).filter(row => row.active);
    assert.deepEqual(lit.map(row => Number(row.cells[0])), [id]);
    assert.equal(lab.metric('linhas encontradas até este passo'), '1');
  }
}));

test('B+ tree ranges continue across leaves without duplicating rows', () => withLab('tree', lab => {
  lab.select('treeMode', 'range'); lab.select('target', 1); lab.select('rangeEnd', 12);
  lab.advance(3); assert.equal(lab.metric('linhas encontradas até este passo'), '4');
  lab.advance(1); assert.equal(lab.metric('linhas encontradas até este passo'), '8');
  lab.advance(1); assert.equal(lab.metric('linhas encontradas até este passo'), '12');
  lab.select('target', 8); lab.select('rangeEnd', 10); lab.advance(3);
  assert.equal(lab.metric('linhas encontradas até este passo'), '1');
  lab.advance(1);
  assert.deepEqual(lab.tables.flatMap(table => table.rows).filter(row => row.active).map(row => Number(row.cells[0])), [8, 9, 10]);
}));

test('Lookup produces four SP rows; coverage removes lookups; SELECT * needs them again', () => withLab('lookup', lab => {
  lab.advance(6);
  assert.equal(lab.metric('lookups no modelo'), '4');
  assert.deepEqual(lab.tables.at(-1).rows.map(row => row.cells[0]), ['1', '4', '7', '11']);
  lab.click('toggle-coverage'); lab.advance(2);
  assert.equal(lab.metric('lookups no modelo'), '0');
  assert.equal(lab.metric('linhas prontas para devolver'), '4');
  assert.deepEqual(lab.tables.at(-1).headers, ['Id', 'Nome', 'UF']);
  lab.click('toggle-all'); lab.advance(6);
  assert.equal(lab.metric('lookups no modelo'), '4');
  assert.deepEqual(lab.tables.at(-1).headers, ['Id', 'Nome', 'UF', 'Email', 'DataCadastro']);
}));

test('Seek and scan return the same SP rows with distinct candidate counts', () => withLab('access', lab => {
  lab.advance(5);
  const seekResult = lab.tables[1].rows.map(row => row.cells[0]);
  assert.equal(lab.metric('entradas folha visitadas no modelo'), '4');
  lab.select('mode', 'scan'); lab.advance(12);
  assert.equal(lab.metric('entradas folha visitadas no modelo'), '12');
  assert.deepEqual(lab.tables[1].rows.map(row => row.cells[0]), seekResult);
}));

test('Composite UF + Nome prefix narrows the seek to Claudio', () => withLab('composite', lab => {
  const active = () => lab.tables[0].rows.filter(row => row.active);
  assert.equal(active().length, 1);
  assert.deepEqual(active()[0].cells, ['SP', 'Claudio', '4']);
  lab.select('condition', 'uf'); assert.equal(active().length, 4);
  lab.select('order', 'name'); assert.equal(active().length, 12);
}));

test('SARG date rewrite preserves six results and Id rewrite displays an Id index', () => withLab('sarg', lab => {
  const original = lab.tables[1].rows.map(row => row.cells[0]);
  assert.equal(original.length, 6);
  lab.select('mode', 'range');
  assert.deepEqual(lab.tables[1].rows.map(row => row.cells[0]), original);
  assert.equal(lab.metric('entradas candidatas neste modelo'), '6');
  lab.select('mode', 'rewrite');
  assert.deepEqual(lab.tables[0].headers, ['Id']);
  assert.deepEqual(lab.tables[1].rows[0].cells.slice(0, 2), ['4', 'Claudio']);
}));

test('TOP (3) obeys descending date order and returns exactly three rows', () => withLab('clauses', lab => {
  lab.select('mode', 'top');
  assert.deepEqual(lab.tables[0].headers, ['Id', 'DataCadastro']);
  assert.deepEqual(lab.tables[0].rows.map(row => row.cells), [['11', '2026-08-30'], ['7', '2026-07-14'], ['6', '2026-05-23']]);
}));

test('Filtered pending index loses a paid order while the base keeps it', () => withLab('filtered', lab => {
  assert.equal(lab.metric('entradas no índice filtrado'), '4');
  assert.equal(lab.metric('linhas da consulta selecionada'), '4');
  lab.click('filtered-pay');
  assert.equal(lab.metric('entradas no índice filtrado'), '3');
  assert.equal(lab.tables[0].rows.find(row => row.cells[0] === '5').cells[2], 'Pago');
  assert.ok(lab.tables[1].rows.every(row => row.cells[2] !== '5'));
  lab.select('scope', 'paid');
  assert.equal(lab.metric('linhas da consulta selecionada'), '5');
  lab.click('filtered-restore');
  assert.equal(lab.metric('entradas no índice filtrado'), '4');
}));

test('Challenge uses Pedido TOP20, correct tie-breaking, coverage and status mutation', () => withLab('challenge', lab => {
  lab.select('pedidoKeys', 'order'); lab.select('pedidoInclude', 'total'); lab.select('pedidoFilter', 'pending'); lab.click('reveal');
  assert.match(lab.text, /TOP \(20\)/);
  assert.match(lab.text, /busca, ordenação e cobertura/);
  assert.equal(lab.metric('entradas no índice candidato'), '36');
  assert.equal(lab.metric('pendentes do cliente 9'), '26');
  assert.equal(lab.tables[2].rows.length, 20);
  assert.deepEqual(lab.tables[2].rows.slice(0, 4).map(row => row.cells[0]), ['2', '1', '4', '3']);
  assert.deepEqual(lab.tables[1].headers, ['ClienteId', 'DataPedido', 'Id', 'Total']);
  lab.click('pedido-pay', '2');
  assert.equal(lab.metric('entradas no índice candidato'), '35');
  assert.equal(lab.metric('pendentes do cliente 9'), '25');
  assert.equal(lab.tables[2].rows.length, 20);
  assert.equal(lab.tables[2].rows[0].cells[0], '1');
  lab.select('pedidoClient', 12); assert.equal(lab.tables[2].rows.length, 6);
  lab.select('pedidoClient', 99); assert.equal(lab.tables[2].rows.length, 0);
}));

test('Write maintenance counts only structures that carry changed data', () => withLab('writes', lab => {
  lab.select('count', 3); lab.click('write-insert');
  assert.equal(lab.metric('estruturas com valores alterados no cenário'), '4');
  lab.click('write-update');
  assert.equal(lab.metric('estruturas com valores alterados no cenário'), '2');
  lab.select('count', 0);
  assert.equal(lab.metric('estruturas com valores alterados no cenário'), '1');
}));

test('Statistics refresh changes the estimate after skewed growth', () => withLab('stats', lab => {
  lab.click('toggle-stats');
  assert.equal(lab.metric('linhas SP estimadas no modelo'), '4');
  assert.equal(lab.metric('linhas SP reais'), '40');
  lab.click('refresh-stats');
  assert.equal(lab.metric('linhas SP estimadas no modelo'), '40');
}));

const playback = harness('book');
playback.click('play');
await new Promise(resolve => setTimeout(resolve, 1200));
assert.equal(playback.metric('entrada do índice consultada'), '1');
playback.cleanup();
const stoppedMarkup = playback.html;
await new Promise(resolve => setTimeout(resolve, 1200));
assert.equal(playback.html, stoppedMarkup, 'Playback must stop when its chapter is unmounted');
count++;
console.log('PASS Playback advances and chapter cleanup stops its timer');
console.log(`\n${count} checks passed.`);
