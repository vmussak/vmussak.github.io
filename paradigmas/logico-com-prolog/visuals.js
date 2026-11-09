const SVG_NS = 'http://www.w3.org/2000/svg';
let graphCounter = 0;

function el(tag, cls, text) {
  const item = document.createElement(tag);
  if (cls) item.className = cls;
  if (text != null) item.textContent = text;
  return item;
}

function svgEl(tag, attrs = {}, text) {
  const item = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) item.setAttribute(key, String(value));
  if (text != null) item.textContent = text;
  return item;
}

function installStyles() {
  if (document.getElementById('prolog-visual-styles')) return;
  const style = el('style');
  style.id = 'prolog-visual-styles';
  style.textContent = `
    .pv-graph-wrap { overflow:auto; border-radius:16px; background:radial-gradient(circle,#d9d4e7 1px,transparent 1px) 0 0/20px 20px; padding:12px 0; }
    .pv-graph { display:block; width:100%; min-width:420px; max-height:440px; }
    .pv-edge { fill:none; stroke:#bbb0db; stroke-width:1.8; transition:stroke .2s; }
    .pv-edge-active { stroke:#16806a; stroke-width:2.8; }
    .pv-node { cursor:pointer; outline:none; }
    .pv-node rect { fill:#fff; stroke:#ded8ed; stroke-width:1.6; transition:fill .2s,stroke .2s; }
    .pv-node:hover rect,.pv-node:focus rect { stroke:#7054d4; fill:#f2edff; }
    .pv-node-active rect { fill:#e7f5ef; stroke:#16806a; stroke-width:2; }
    .pv-node text { font:600 13px system-ui,sans-serif; fill:#392e53; pointer-events:none; }
    .pv-edge-label { font:11px system-ui,sans-serif; fill:#74618e; }
    .pv-edge-label-active { fill:#16806a; font-weight:600; }
    .pv-legend { display:flex; flex-wrap:wrap; align-items:center; gap:8px 16px; font-size:12px; color:#746b84; margin:14px 0 8px; line-height:1.5; }
    .pv-legend span { display:inline-flex; align-items:center; gap:6px; }
    .pv-dot { width:8px; height:8px; border:2px solid #a996d2; border-radius:50%; display:inline-block; }
    .pv-dot-green { border-color:#16806a; background:#ddf1e8; }
    .pv-graph-note { min-height:2.8em; margin:0; padding:12px 14px; background:#f5f2fb; border-radius:10px; color:#605475; font-size:12px; line-height:1.6; }
    .pv-graph-note code { color:#6042a7; font-size:12px; overflow-wrap:anywhere; }
    .pv-unary-facts { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0; }
    .pv-fact { padding:8px 12px; border:1px solid #e5dff0; background:#fff; border-radius:10px; font:12px ui-monospace,monospace; color:#7054a4; }
    .pv-caption { margin:0 0 12px; font:600 12px system-ui,sans-serif; color:#887a9d; text-transform:uppercase; letter-spacing:.09em; }
    .pv-term { padding:24px 16px; display:flex; flex-direction:column; align-items:center; background:#faf8fd; border-radius:14px; gap:0; }
    .pv-term-root { color:#fff; background:#7054d4; border-radius:10px; padding:10px 18px; max-width:100%; overflow-wrap:anywhere; font:600 14px ui-monospace,monospace; }
    .pv-term-stem { height:27px; border-left:2px solid #cdc2e6; }
    .pv-term-args { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; border-top:2px solid #cdc2e6; padding-top:15px; max-width:100%; }
    .pv-term-arg { padding:10px 12px; border:1px solid #ded7ed; background:#fff; border-radius:8px; color:#655077; font:13px ui-monospace,monospace; overflow-wrap:anywhere; max-width:100%; }
    .pv-term-arg small { display:block; color:#9a8aa8; font:10px system-ui,sans-serif; margin-top:5px; }
    .pv-list { display:flex; align-items:center; gap:0; max-width:100%; overflow:auto; padding:12px 0; }
    .pv-list-cell { border:1px solid #cfc4e8; background:white; color:#7054a4; padding:12px; font:13px ui-monospace,monospace; border-radius:8px; }
    .pv-list-arrow { padding:0 6px; color:#b3a5cd; }
    .pv-search-empty { text-align:center; padding:40px 20px; background:#faf8fd; border:1px dashed #ded7ed; border-radius:14px; color:#8b7b9c; font-size:13px; line-height:1.7; }
    .pv-search { margin:0; padding:4px 0; list-style:none; max-height:380px; overflow:auto; }
    .pv-search-row { --pv-depth:0; position:relative; display:flex; gap:9px; align-items:flex-start; margin:0 0 4px min(calc(var(--pv-depth) * 18px),100px); padding:9px 10px; border-left:2px solid #e4ddef; border-radius:0 7px 7px 0; font-size:12px; background:#faf9fc; }
    .pv-search-row.pv-current { background:#f0ebff; border-left-color:#7054d4; box-shadow:inset 0 0 0 1px #e1d6fc; }
    .pv-search-row.pv-fail { border-left-color:#dd9c9c; }
    .pv-search-row.pv-exit { border-left-color:#76b5a3; }
    .pv-port { font:600 10px system-ui,sans-serif; text-transform:uppercase; letter-spacing:.02em; padding:3px 5px; border-radius:4px; color:#7054b0; background:#eae3fa; white-space:nowrap; min-width:38px; text-align:center; }
    .pv-fail .pv-port { color:#aa5656; background:#f9e5e5; }
    .pv-exit .pv-port,.pv-solution .pv-port { color:#16806a; background:#e0f2eb; }
    .pv-redo .pv-port { color:#a27124; background:#f9efd8; }
    .pv-search-goal { font:12px/1.7 ui-monospace,monospace; color:#5b4a73; overflow-wrap:anywhere; }
    .pv-search-depth { margin-left:auto; flex-shrink:0; color:#a194af; font-size:10px; padding-top:3px; }
    .pv-search-note { color:#8b7b9c; font-size:11px; line-height:1.6; margin:10px 0 0; }
    @media(max-width:600px) { .pv-graph { min-width:360px; } .pv-search-row { margin-left:min(calc(var(--pv-depth) * 11px),55px); gap:6px; padding:8px 6px; } .pv-search-depth { display:none; } }
    @media(prefers-reduced-motion:reduce) { .pv-node rect,.pv-edge { transition:none; } }
  `;
  document.head.append(style);
}

// Splits only at top level so commas inside nested terms/lists stay together.
function splitTopLevel(value, delimiter = ',') {
  const parts = [];
  let depth = 0, quote = null, start = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quote) { if (char === quote && value[i - 1] !== '\\') quote = null; continue; }
    if (char === "'" || char === '"') { quote = char; continue; }
    if ('(['.includes(char)) depth++;
    else if (')]'.includes(char)) depth--;
    else if (char === delimiter && depth === 0) { parts.push(value.slice(start, i).trim()); start = i + 1; }
  }
  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function statements(program) {
  let clean = '', quote = null, lineComment = false, blockComment = false;
  for (let index = 0; index < program.length; index++) {
    const char = program[index], next = program[index + 1];
    if (lineComment) { if (char === '\n') { lineComment = false; clean += '\n'; } continue; }
    if (blockComment) { if (char === '*' && next === '/') { blockComment = false; index++; clean += ' '; } continue; }
    if (quote) { clean += char; if (char === quote && program[index - 1] !== '\\') quote = null; continue; }
    if (char === "'" || char === '"') { quote = char; clean += char; }
    else if (char === '%') lineComment = true;
    else if (char === '/' && next === '*') { blockComment = true; index++; }
    else clean += char;
  }
  return splitTopLevel(clean, '.');
}

function simpleAtom(value) {
  return /^(?:[a-z][\w\u00c0-\u024f]*|'(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?)$/.test(value);
}

function parseFact(source) {
  if (source.includes(':-')) return null;
  const match = source.trim().match(/^([a-z][\w\u00c0-\u024f]*)\s*\(([\s\S]*)\)$/);
  if (!match) return null;
  const args = splitTopLevel(match[2]);
  if (!args.length || !args.every(simpleAtom)) return null;
  return { name: match[1], args, source: source.trim() + '.' };
}

function topLevelOperator(value, operators) {
  let depth = 0, quote = null;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (quote) { if (char === quote && value[index - 1] !== '\\') quote = null; continue; }
    if (char === "'" || char === '"') { quote = char; continue; }
    if ('(['.includes(char)) { depth++; continue; }
    if (')]'.includes(char)) { depth--; continue; }
    if (depth === 0) {
      const operator = operators.find(candidate => value.startsWith(candidate, index));
      if (operator) return { operator, index };
    }
  }
  return null;
}

function termStructure(raw) {
  const rule = topLevelOperator(raw, [':-']);
  if (rule) return { root: 'Regra (:-)', args: [raw.slice(0, rule.index).trim(), raw.slice(rule.index + 2).trim()], labels: ['cabeça', 'corpo'] };
  for (const [delimiter, root] of [[';', 'Disjunção (;)'], [',', 'Conjunção (,)']]) {
    const args = splitTopLevel(raw, delimiter);
    if (args.length > 1) return { root, args, labels: args.map((_, index) => `objetivo ${index + 1}`) };
  }
  if (raw.startsWith('\\+')) return { root: 'Negação por falha (\\+)', args: [raw.slice(2).trim()], labels: ['objetivo testado'] };
  const infix = topLevelOperator(raw, ['=:=', '=\\=', '\\=', '>=', '=<', '=', '>', '<', ' is ']);
  if (infix) return { root: infix.operator.trim() === '=' ? 'Unificação (=)' : infix.operator.trim() === 'is' ? 'Avaliação (is)' : `Operador ${infix.operator.trim()}`, args: [raw.slice(0, infix.index).trim(), raw.slice(infix.index + infix.operator.length).trim()], labels: ['termo à esquerda', 'termo à direita'] };
  const compound = raw.match(/^([a-z][\w\u00c0-\u024f]*)\s*\(([\s\S]*)\)$/);
  if (compound) {
    const args = splitTopLevel(compound[2]);
    return { root: `${compound[1]}/${args.length}`, args, labels: args.map((arg, index) => `argumento ${index + 1}${/^[A-Z_]/.test(arg) ? ' · variável' : arg.startsWith('[') ? ' · lista' : ''}`) };
  }
  return { root: raw === '!' ? 'Corte (!)' : raw, args: [], labels: [] };
}

function termFallback(container, program, activeGoal, facts) {
  const caption = el('p', 'pv-caption', 'Estrutura da meta ou do termo');
  const raw = (activeGoal || program.split('\n').find(line => line.trim() && !line.trim().startsWith('%')) || 'consulta').trim().replace(/^\?-\s*/, '').replace(/\.$/, '');
  const structure = termStructure(raw);
  const panel = el('div', 'pv-term');
  panel.append(el('div', 'pv-term-root', structure.root));
  if (structure.args.length) {
    panel.append(el('div', 'pv-term-stem'));
    const args = el('div', 'pv-term-args');
    structure.args.forEach((arg, index) => {
      const item = el('div', 'pv-term-arg', arg);
      item.append(el('small', '', structure.labels[index]));
      args.append(item);
    });
    panel.append(args);
    const listMatch = raw.match(/\[([^\[\]]*)\]/);
    if (listMatch) {
      const list = el('div', 'pv-list');
      const cells = splitTopLevel(listMatch[1].replace('|', ','));
      if (!cells.length) cells.push('[]');
      cells.forEach((cell, index) => { if (index) list.append(el('span', 'pv-list-arrow', '→')); list.append(el('span', 'pv-list-cell', cell)); });
      if (!listMatch[1].includes('|') && listMatch[1].trim()) { list.append(el('span', 'pv-list-arrow', '→'), el('span', 'pv-list-cell', '[]')); }
      panel.append(list);
      if (listMatch[1].includes('|')) panel.append(el('p', 'pv-search-note', 'Em [H|T], H é a cabeça e T a cauda. Em [A,B|T], A e B são os elementos iniciais e T é a lista restante.'));
    }
  }
  container.append(caption, panel);
  if (facts.length) {
    const tags = el('div', 'pv-unary-facts');
    facts.slice(0, 12).forEach(fact => tags.append(el('code', 'pv-fact', fact.source)));
    container.append(tags);
  }
  container.append(el('p', 'pv-search-note', 'Este diagrama mostra a estrutura dos termos. A execução e as tentativas de prova aparecem no percurso da busca.'));
}

/** Explicit term view, even when the program also contains binary facts. */
export function renderTermStructure(container, program, activeGoal = '') {
  installStyles();
  container.replaceChildren();
  termFallback(container, String(program), String(activeGoal), []);
}

/** Directed data graph of simple, ground binary facts (never a proof graph). */
export function renderKnowledgeGraph(container, program, activeGoal = '') {
  installStyles();
  container.replaceChildren();
  const facts = statements(String(program)).map(parseFact).filter(Boolean);
  const binary = facts.filter(fact => fact.args.length === 2);
  if (!binary.length) { termFallback(container, String(program), String(activeGoal), facts); return; }
  const allNames = [...new Set(binary.flatMap(fact => fact.args))];
  const names = allNames.slice(0, 20);
  const edges = binary.filter(fact => names.includes(fact.args[0]) && names.includes(fact.args[1])).slice(0, 36);
  const inbound = new Map(names.map(name => [name, 0]));
  edges.forEach(edge => inbound.set(edge.args[1], inbound.get(edge.args[1]) + 1));
  const roots = names.filter(name => !inbound.get(name));
  const depths = new Map();
  const queue = roots.map(name => [name, 0]);
  while (queue.length) {
    const [name, depth] = queue.shift();
    if (depths.has(name)) continue;
    depths.set(name, depth);
    edges.filter(edge => edge.args[0] === name).forEach(edge => { if (!depths.has(edge.args[1])) queue.push([edge.args[1], depth + 1]); });
  }
  const layered = roots.length > 0 && names.every(name => depths.has(name)) && Math.max(...depths.values()) <= 5;
  const largestRow = layered ? Math.max(...Array.from({ length: Math.max(...depths.values()) + 1 }, (_, depth) => names.filter(name => depths.get(name) === depth).length)) : 0;
  const width = layered ? Math.max(600, (largestRow + 1) * 112) : 600;
  const maxDepth = Math.max(0, ...depths.values());
  const height = layered ? Math.max(270, (maxDepth + 1) * 100) : Math.max(310, Math.ceil(names.length / 6) * 140);
  const points = new Map();
  if (layered) {
    for (let depth = 0; depth <= maxDepth; depth++) {
      const row = names.filter(name => depths.get(name) === depth);
      row.forEach((name, index) => points.set(name, { x: width * (index + 1) / (row.length + 1), y: 42 + (height - 84) * depth / Math.max(1, maxDepth) }));
    }
  } else {
    names.forEach((name, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / names.length;
      points.set(name, { x: width / 2 + Math.cos(angle) * 218, y: height / 2 + Math.sin(angle) * (height / 2 - 45) });
    });
  }
  const id = `pv-arrow-${++graphCounter}`;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, class: 'pv-graph', role: 'group', 'aria-label': 'Grafo dirigido dos fatos: as setas vão do primeiro para o segundo argumento.' });
  if (largestRow > 4) svg.style.minWidth = `${Math.min(width, 1200)}px`;
  svg.append(svgEl('title', {}, 'Relações declaradas nos fatos do programa'));
  const defs = svgEl('defs');
  for (const [suffix, color] of [['', '#bbb0db'], ['-active', '#16806a']]) {
    const marker = svgEl('marker', { id: id + suffix, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
    marker.append(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color }));
    defs.append(marker);
  }
  svg.append(defs);
  const edgeLayer = svgEl('g');
  const nodeLayer = svgEl('g');
  const edgeElements = [];
  const nodeElements = new Map();
  const goalText = String(activeGoal).trim().replace(/^\?-\s*/, '').replace(/\.$/, '');
  const goalFact = parseFact(goalText);
  const exactMatches = goalFact && goalFact.args.length === 2
    ? edges.filter(fact => fact.name === goalFact.name && fact.args.every((arg, index) => arg === goalFact.args[index]))
    : [];
  const note = el('p', 'pv-graph-note');
  function markEdges(predicate) {
    edgeElements.forEach(({ element, label, fact }) => {
      const active = predicate(fact);
      element.classList.toggle('pv-edge-active', active);
      label.classList.toggle('pv-edge-label-active', active);
      element.setAttribute('marker-end', `url(#${id}${active ? '-active' : ''})`);
    });
  }
  function select(name) {
    nodeElements.forEach((group, key) => group.classList.toggle('pv-node-active', key === name));
    markEdges(fact => fact.args.includes(name));
    const related = facts.filter(fact => fact.args.includes(name));
    note.replaceChildren(el('strong', '', name ? `${name}: ` : 'Explore: '));
    if (name) note.append(document.createTextNode('relações declaradas → '), el('code', '', related.map(fact => fact.source).join(' ')));
    else {
      if (goalText) note.append(document.createTextNode('meta atual '), el('code', '', goalText), document.createTextNode('. '));
      note.append(document.createTextNode('Selecione um nó para destacar suas relações. As setas representam somente fatos declarados; relações derivadas por regras não são adicionadas a este grafo.'));
    }
  }
  edges.forEach((fact, index) => {
    const from = points.get(fact.args[0]), to = points.get(fact.args[1]);
    let d, lx, ly;
    if (fact.args[0] === fact.args[1]) {
      d = `M ${from.x + 35} ${from.y - 12} C ${from.x + 95} ${from.y - 65},${from.x - 10} ${from.y - 70},${from.x + 10} ${from.y - 21}`;
      lx = from.x + 46; ly = from.y - 45;
    } else {
      const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy) || 1;
      const start = { x: from.x + dx / len * 29, y: from.y + dy / len * 24 };
      const end = { x: to.x - dx / len * 40, y: to.y - dy / len * 26 };
      const duplicates = edges.filter(other => other.args[0] === fact.args[0] && other.args[1] === fact.args[1]);
      const reciprocal = edges.some(other => other.args[0] === fact.args[1] && other.args[1] === fact.args[0]);
      // The perpendicular changes direction on the reverse edge, separating both arrows.
      const offset = reciprocal ? 36 + duplicates.indexOf(fact) * 26 : duplicates.length > 1 ? (duplicates.indexOf(fact) - (duplicates.length - 1) / 2) * 32 : 0;
      const cx = (start.x + end.x) / 2 - dy / len * offset;
      const cy = (start.y + end.y) / 2 + dx / len * offset;
      lx = (start.x + end.x) / 4 + cx / 2;
      ly = (start.y + end.y) / 4 + cy / 2;
      d = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
    }
    const path = svgEl('path', { d, class: 'pv-edge', 'marker-end': `url(#${id})` });
    path.append(svgEl('title', {}, fact.source));
    edgeLayer.append(path);
    const labelWidth = Math.max(36, fact.name.length * 6.6 + 12);
    edgeLayer.append(svgEl('rect', { x: lx - labelWidth / 2, y: ly - 10, width: labelWidth, height: 17, rx: 5, fill: '#faf8fd', opacity: .96 }));
    const label = svgEl('text', { x: lx, y: ly + 2, 'text-anchor': 'middle', class: 'pv-edge-label' }, fact.name);
    edgeLayer.append(label);
    edgeElements.push({ element: path, label, fact });
  });
  names.forEach(name => {
    const point = points.get(name);
    const nodeWidth = Math.max(72, Math.min(136, name.length * 8 + 28));
    const group = svgEl('g', { class: 'pv-node', tabindex: 0, role: 'button', 'aria-label': `Destacar relações de ${name}`, transform: `translate(${point.x},${point.y})` });
    group.append(svgEl('rect', { x: -nodeWidth / 2, y: -21, width: nodeWidth, height: 42, rx: 13 }));
    group.append(svgEl('text', { x: 0, y: 5, 'text-anchor': 'middle' }, name.length > 15 ? name.slice(0, 13) + '…' : name));
    group.append(svgEl('title', {}, name));
    group.addEventListener('click', () => select(name));
    group.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(name); } });
    nodeElements.set(name, group);
    nodeLayer.append(group);
  });
  svg.append(edgeLayer, nodeLayer);
  const wrap = el('div', 'pv-graph-wrap');
  wrap.append(svg);
  const legend = el('div', 'pv-legend');
  const dot = el('span'); dot.append(el('i', 'pv-dot'), document.createTextNode('Átomo'));
  const activeDot = el('span'); activeDot.append(el('i', 'pv-dot pv-dot-green'), document.createTextNode('Fato da meta atual ou relações selecionadas'));
  legend.append(dot, el('span', '', '→ Primeiro argumento → segundo'), activeDot);
  container.append(wrap, legend, note);
  if (allNames.length > names.length || binary.length > edges.length) container.append(el('p', 'pv-search-note', 'Visualização limitada a 20 nós e 36 relações. O programa completo continua sendo executado.'));
  if (exactMatches.length) {
    nodeElements.forEach((group, key) => group.classList.toggle('pv-node-active', goalFact.args.includes(key)));
    markEdges(fact => exactMatches.includes(fact));
    note.append(el('strong', '', 'Meta atual: '), el('code', '', goalText), document.createTextNode('. A seta verde corresponde exatamente a este fato declarado, com o mesmo predicado e os mesmos argumentos. Selecione um nó para explorar outras relações.'));
  } else select(null);
}

const portLabels = { call: 'Chama', match: 'Unifica', rule: 'Cláusula', exit: 'Prova', fail: 'Falha', redo: 'Retoma', solution: 'Solução', unify: 'Unifica', cut: 'Corta', error: 'Erro', limit: 'Limite' };

/** Chronological proof traversal. Indentation expresses call depth, not data relations. */
export function renderSearchTree(container, trace = [], activeIndex = 0) {
  installStyles();
  container.replaceChildren();
  if (!Array.isArray(trace) || !trace.length || activeIndex < 0) {
    container.append(el('div', 'pv-search-empty', 'Execute uma consulta para acompanhar as chamadas, as provas e o retorno às alternativas.'));
    return;
  }
  const end = Math.min(Math.max(0, activeIndex), trace.length - 1);
  const start = Math.max(0, end - 59);
  const list = el('ol', 'pv-search');
  list.setAttribute('aria-label', 'Percurso cronológico da busca, com profundidade das chamadas');
  if (start) container.append(el('p', 'pv-search-note', `Exibindo os 60 eventos mais recentes até o passo ${end + 1}. Volte os passos para ver os anteriores.`));
  for (let index = start; index <= end; index++) {
    const event = trace[index];
    const type = String(event.type || 'call').toLowerCase();
    const depth = Math.max(0, Number(event.depth) || 0);
    const row = el('li', `pv-search-row pv-${type}${index === end ? ' pv-current' : ''}`);
    row.style.setProperty('--pv-depth', String(Math.min(depth, 10)));
    if (index === end) row.setAttribute('aria-current', 'step');
    const port = el('span', 'pv-port', portLabels[type] || type);
    const goal = el('span', 'pv-search-goal', event.goal || event.detail || 'true');
    if (event.detail) row.title = String(event.detail);
    row.append(port, goal, el('span', 'pv-search-depth', `nível ${depth}`));
    list.append(row);
  }
  container.append(list, el('p', 'pv-search-note', 'Leia de cima para baixo. O recuo indica a profundidade; “retoma” volta a uma alternativa após o backtracking. Este percurso é diferente do grafo de fatos.'));
  list.scrollTop = list.scrollHeight;
}
