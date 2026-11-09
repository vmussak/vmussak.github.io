import { lessons } from './lessons.js';
import { runProlog, PROLOG_SUPPORT } from './engine.js';
import { renderKnowledgeGraph, renderSearchTree, renderTermStructure } from './visuals.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const rich = value => escape(value).replace(/`([^`]+)`/g, '<code>$1</code>');
const storageKey = 'logica-viva-progresso-v1';
let completed = new Set();
try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) completed = new Set(saved.filter(id => lessons.some(l => l.id === id))); } catch { /* Storage is optional. */ }
const drafts = new Map();
let currentLesson = null, result = null, traceIndex = 0, visualMode = 'knowledge', playback = null, worker = null, runTimer = null;
let dirty = false, running = false;

function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => $('#toast').classList.remove('visible'), 2800);
}

function navigation() {
  const route = location.hash.slice(1) || 'inicio';
  $('#lesson-nav').innerHTML = lessons.map((lesson, index) => `${index === 4 ? '<div class="nav-divider">APROFUNDE SEU RACIOCÍNIO</div>' : ''}<a class="nav-link ${route === lesson.id ? 'active' : ''} ${completed.has(lesson.id) ? 'complete' : ''}" href="#${lesson.id}" ${route === lesson.id ? 'aria-current="page"' : ''}><span class="nav-number">${completed.has(lesson.id) ? '✓' : escape(lesson.number)}</span><span>${escape(lesson.shortTitle)}</span></a>`).join('');
  $('.overview-link').classList.toggle('active', route === 'inicio');
  if (route === 'inicio') $('.overview-link').setAttribute('aria-current', 'page'); else $('.overview-link').removeAttribute('aria-current');
  $('#progress-label').textContent = `${completed.size} / ${lessons.length}`;
  $('#progress-fill').style.width = `${completed.size / lessons.length * 100}%`;
}

const demoProgram = 'gosta(ana, musica).\ngosta(ana, livros).\ngosta(bruno, livros).';

function home() {
  document.title = 'Lógica viva · Programação lógica com Prolog';
  $('#main').innerHTML = `<div class="page-enter">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><div class="eyebrow">PROGRAMAÇÃO LÓGICA, NA PRÁTICA</div>
        <h1 id="hero-title">Pensar em relações.<br><em>Descobrir com Prolog.</em></h1>
        <p class="hero-description">E se, em vez de escrever cada passo, você descrevesse o que sabe? Conecte fatos, faça perguntas e veja a lógica encontrar um caminho.</p>
        <div class="hero-actions"><a class="button" href="#${lessons[0].id}">Começar a explorar <span aria-hidden="true">→</span></a><a class="text-link" href="#trilha" id="explore-trail">Conhecer a trilha ↓</a></div>
        <div class="hero-meta"><span>Do zero à recursão</span><span>Código no navegador</span><span>No seu ritmo</span></div>
      </div>
      <div class="demo-card"><div class="demo-label">UMA PERGUNTA. DUAS DESCOBERTAS. <span class="live-tag">INTERATIVO</span></div><h3>Do que Ana gosta?</h3>
        <svg class="hero-graph" viewBox="0 0 340 180" role="img" aria-label="Ana gosta de música e de livros. Bruno gosta de livros.">
          <defs><marker id="hero-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#ac98cf"/></marker></defs>
          <path class="edge ana-edge" d="M99 58 Q166 15 224 44" marker-end="url(#hero-arrow)"/><path class="edge ana-edge" d="M101 69 Q168 95 224 121" marker-end="url(#hero-arrow)"/><path class="edge" d="M104 139 Q167 156 224 133" marker-end="url(#hero-arrow)"/>
          <text class="edge-label" x="150" y="32">gosta</text><text class="edge-label" x="158" y="89">gosta</text><text class="edge-label" x="153" y="161">gosta</text>
          <rect class="node demo-ana" x="33" y="41" width="71" height="40" rx="12"/><text class="node-label" x="68" y="66" text-anchor="middle">ana</text>
          <rect class="node" x="29" y="116" width="79" height="40" rx="12"/><text class="node-label" x="68" y="141" text-anchor="middle">bruno</text>
          <rect class="node demo-target" x="227" y="27" width="85" height="40" rx="12"/><text class="node-label" x="269" y="52" text-anchor="middle">musica</text>
          <rect class="node demo-target" x="227" y="111" width="85" height="40" rx="12"/><text class="node-label" x="269" y="136" text-anchor="middle">livros</text>
        </svg>
        <div class="demo-query"><span class="prompt">?-</span><code>gosta(ana, Oque).</code><button id="demo-run" aria-label="Executar a consulta sobre Ana" title="Executar consulta">▶</button></div>
        <div id="demo-result" class="demo-result" role="status">Clique em ▶ e veja as conexões aparecerem.</div>
      </div>
    </section>
    <section class="learning-loop" aria-label="Como estudar"><div class="loop-item"><span class="loop-icon" aria-hidden="true">▤</span><div><h3>Entenda a ideia</h3><p>Teoria em pequenas doses.<br>Um exemplo de cada vez.</p></div></div><div class="loop-item"><span class="loop-icon" aria-hidden="true">⌘</span><div><h3>Experimente o código</h3><p>Mude os fatos. Faça uma pergunta.<br>Compare as respostas.</p></div></div><div class="loop-item"><span class="loop-icon" aria-hidden="true">⌁</span><div><h3>Enxergue o raciocínio</h3><p>Explore as relações e acompanhe<br>cada tentativa de prova.</p></div></div></section>
    <section id="trilha" aria-labelledby="trail-title"><div class="section-line"><div><h2 id="trail-title">Pequenos passos. Novas conexões.</h2><p>Uma trilha para construir seu raciocínio, do primeiro fato aos problemas maiores.</p></div><span class="section-caption">${lessons.length} CAPÍTULOS · TEORIA + LABORATÓRIO</span></div>
      <div class="course-grid">${lessons.map((lesson, index) => `<a class="lesson-card" href="#${lesson.id}"><div class="card-top"><span class="card-number">${completed.has(lesson.id) ? '✓' : escape(lesson.number)}</span><span class="card-level">${index < 4 ? 'FUNDAMENTOS' : index < 8 ? 'APROFUNDAMENTO' : 'APLICAÇÃO'}</span></div><h3>${escape(lesson.shortTitle)}</h3><p>${escape(lesson.description)}</p><div class="card-bottom"><span>${completed.has(lesson.id) ? 'CAPÍTULO CONCLUÍDO' : 'EXPLORAR CAPÍTULO'}</span><span aria-hidden="true">↗</span></div></a>`).join('')}</div>
    </section>
    <aside class="reference-banner"><div><h3>O conhecimento continua fora do laboratório.</h3><p>Consulte os slides e a apostila que acompanham esta trilha.</p></div><a class="button secondary small" href="#referencias">Abrir biblioteca <span aria-hidden="true">↗</span></a></aside>
  </div>`;
  $('#explore-trail').addEventListener('click', event => { event.preventDefault(); $('#trilha').scrollIntoView({ behavior: 'smooth' }); });
  $('#demo-run').addEventListener('click', () => {
    const answer = runProlog(demoProgram, 'gosta(ana, Oque).');
    document.querySelectorAll('.ana-edge').forEach(edge => edge.classList.add('lit'));
    document.querySelectorAll('.demo-ana,.demo-target').forEach(node => node.classList.add('lit-node'));
    $('#demo-result').classList.add('success');
    $('#demo-result').innerHTML = `✓ ${answer.solutions.map(solution => `<span class="result-token">Oque = ${escape(solution.bindings.Oque)}</span>`).join('')}`;
    $('#demo-run').textContent = '↻';
  });
}

function supportDetails() {
  return `<details class="reference-notes"><summary>O que este laboratório executa?</summary><p>${escape(PROLOG_SUPPORT.limits)}</p><p>Suporta ${PROLOG_SUPPORT.supported.map(escape).join(', ')}. As soluções são coletadas automaticamente em ordem de busca; resultados repetidos podem representar provas diferentes.</p><p>Por execução: até 4.000 passos, profundidade 65, 30 soluções e 800 eventos visuais. Consultas demoradas são interrompidas após 4 segundos. Um aviso indica resultados parciais. A unificação usa <em>occurs check</em>: termos cíclicos, como X = f(X), falham; outros ambientes Prolog podem se comportar de forma diferente.</p><p>O código roda localmente no navegador. Não há instalação, envio do programa ou avaliação de nota. Edite e baixe seus exemplos para continuar em um ambiente Prolog completo.</p></details>`;
}

function lessonPage(lesson) {
  currentLesson = lesson;
  const draft = drafts.get(lesson.id);
  const index = lessons.indexOf(lesson);
  document.title = `${lesson.shortTitle} · Lógica viva`;
  $('#main').innerHTML = `<article class="page-enter">
    <header class="lesson-header"><div><div class="eyebrow">CAPÍTULO ${escape(lesson.number)} · ${escape(lesson.kicker)}</div><h1>${escape(lesson.title)}</h1><p class="lesson-description">${escape(lesson.description)}</p></div><div class="chapter-badge" aria-hidden="true"><span>CAPÍTULO</span><strong>${escape(lesson.number)}</strong></div></header>
    <nav class="page-tabs" aria-label="Seções do capítulo"><a href="#conceitos" data-scroll="conceitos">01 · Entenda</a><a href="#laboratorio" data-scroll="laboratorio">02 · Experimente</a><a href="#desafio" data-scroll="desafio">03 · Pratique</a></nav>
    <section id="conceitos" class="concept-grid" aria-label="Conceitos">${lesson.concepts.map((concept, i) => `<div class="concept"><span class="concept-index">IDEIA ${String(i + 1).padStart(2, '0')}</span><h3>${escape(concept.title)}</h3><p>${rich(concept.text)}</p>${concept.code ? `<pre><code>${escape(concept.code)}</code></pre>` : ''}</div>`).join('')}</section>
    <section id="laboratorio" aria-labelledby="lab-title"><div class="lab-heading"><div><h2 id="lab-title">Agora, faça a lógica acontecer.</h2><p>Edite o programa, escolha uma pergunta e investigue o resultado.</p></div><span class="lab-label">EXECUÇÃO LOCAL</span></div>
      <div class="lab-grid">
        <div class="editor-panel"><div class="panel-bar"><span class="panel-title">● &nbsp; conhecimento.pl</span><div class="panel-tools"><button class="tool-button" id="reset-code" title="Restaurar código e consulta deste capítulo">Restaurar</button><button class="tool-button" id="download-code" title="Baixar o programa como arquivo .pl">Baixar .pl ↧</button></div></div>
          <p class="editor-caption">BASE DE CONHECIMENTO · fatos e regras editáveis</p>
          <div class="code-editor"><div class="line-numbers" id="line-numbers" aria-hidden="true"></div><textarea id="program" aria-label="Programa Prolog editável" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="16000">${escape(draft?.program ?? lesson.program)}</textarea></div>
          <form class="query-area" id="query-form"><label for="query">SUA CONSULTA</label><div class="query-input-wrap"><span class="prompt" aria-hidden="true">?-</span><input id="query" aria-label="Consulta Prolog" spellcheck="false" autocapitalize="off" autocomplete="off" maxlength="2000" value="${escape(draft?.query ?? lesson.query)}" required></div><div class="query-actions"><span class="shortcut">Ctrl + Enter para executar</span><button class="button small" type="submit" id="run-query"><span aria-hidden="true">▶</span> Executar consulta</button></div></form>
          <div class="presets" aria-label="Consultas sugeridas">${lesson.presets.map((preset, i) => `<button class="preset" data-preset="${i}" title="${escape(preset.query)}">${escape(preset.label)}</button>`).join('')}</div>
        </div>
        <div class="visual-panel"><div class="panel-bar"><div class="visual-tabs" role="group" aria-label="Tipo de visualização"><button class="active" id="knowledge-tab" aria-pressed="true">Grafo de fatos</button><button id="structure-tab" aria-pressed="false">Estrutura do termo</button><button id="search-tab" aria-pressed="false">Percurso da busca</button></div><span aria-hidden="true">⌁</span></div>
          <p class="visual-hint" id="visual-hint">Os fatos viram relações. Selecione os nós para explorar as conexões.</p><div class="visual-canvas" id="visual-canvas"></div>
          <div class="answer-area"><div class="answer-title"><span>RESPOSTAS DA CONSULTA</span><span id="answer-count">AGUARDANDO</span></div><div class="answer-content" id="answer-content" aria-live="polite"><span class="neutral-note">Execute para descobrir as soluções.</span></div></div>
        </div>
      </div>
      <div class="trace-panel"><div class="trace-controls"><strong>↳ &nbsp; O raciocínio, passo a passo</strong><button class="step-button" id="trace-start" aria-label="Voltar ao primeiro passo" disabled>↤</button><button class="step-button" id="trace-prev" aria-label="Passo anterior" disabled>‹</button><button class="step-button" id="trace-play" aria-label="Reproduzir passos automaticamente" disabled>▶</button><button class="step-button" id="trace-next" aria-label="Próximo passo" disabled>›</button><span class="step-position" id="step-position">0 / 0</span><select class="speed-select" id="trace-speed" aria-label="Velocidade da reprodução"><option value="1400">Devagar</option><option value="800" selected>Normal</option><option value="300">Rápido</option></select></div>
        <div class="trace-details" aria-live="polite" aria-atomic="true"><span class="trace-status" id="trace-status">PRONTO</span><div class="trace-text"><code id="trace-goal">Uma pergunta dá início à busca.</code><p id="trace-detail">Execute uma consulta. Depois use as setas ou a reprodução para acompanhar cada chamada e cada retorno.</p></div></div><input class="step-range" id="trace-range" type="range" min="0" max="0" value="0" aria-label="Escolher passo da execução" disabled>
      </div>
      <p class="lab-tip"><strong>Experimente:</strong> execute a consulta sugerida, observe os passos e altere um fato. Uma resposta diferente começa com uma nova relação. O grafo mostra fatos declarados; o percurso mostra como a consulta é provada.</p>
      ${supportDetails()}
    </section>
    <section class="challenge" id="desafio" aria-labelledby="challenge-title"><div class="challenge-heading">✧ &nbsp; PAUSA PARA PENSAR</div><h2 id="challenge-title">Antes de executar, o que você espera?</h2><p class="challenge-question">${rich(lesson.challenge.question)}</p><div class="quiz-options">${lesson.challenge.options.map((option, i) => `<button class="quiz-option" data-answer="${i}"><span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${rich(option)}</span></button>`).join('')}</div><div class="quiz-feedback" id="quiz-feedback" role="status"></div><div class="completion-row"><span class="completion-note">Reflita, teste sua hipótese e siga no seu ritmo.</span><button class="button small complete-button" id="complete-lesson">${completed.has(lesson.id) ? '✓ Capítulo concluído' : 'Marcar como estudado ✓'}</button></div></section>
    <div class="source-note">Base de leitura: ${escape(lesson.source)} <a href="#referencias">Consultar materiais ↗</a><br>As páginas indicadas são as páginas físicas dos arquivos PDF. Exemplos adaptados para estudo interativo.</div>
    <nav class="lesson-pagination" aria-label="Navegar entre capítulos"><a class="pagination-link" href="#${index > 0 ? lessons[index - 1].id : 'inicio'}"><small>← ${index > 0 ? 'CAPÍTULO ANTERIOR' : 'VISÃO GERAL'}</small>${index > 0 ? escape(lessons[index - 1].shortTitle) : 'Voltar para a trilha'}</a><a class="pagination-link" href="#${index < lessons.length - 1 ? lessons[index + 1].id : 'referencias'}"><small>${index < lessons.length - 1 ? 'PRÓXIMA DESCOBERTA' : 'CONTINUE ESTUDANDO'} →</small>${index < lessons.length - 1 ? escape(lessons[index + 1].shortTitle) : 'Biblioteca de apoio'}</a></nav>
  </article>`;
  bindLab(lesson);
}

function updateLines() {
  const editor = $('#program');
  $('#line-numbers').textContent = Array.from({ length: editor.value.split('\n').length }, (_, i) => i + 1).join('\n');
  $('#line-numbers').style.height = `${editor.clientHeight}px`;
  $('#line-numbers').scrollTop = editor.scrollTop;
}

function stopPlayback() {
  clearInterval(playback); playback = null;
  if ($('#trace-play')) { $('#trace-play').textContent = '▶'; $('#trace-play').setAttribute('aria-label', 'Reproduzir passos automaticamente'); }
}

function cancelRun() {
  worker?.terminate(); worker = null; clearTimeout(runTimer); running = false;
}

function invalidate() {
  stopPlayback(); cancelRun(); dirty = true; result = null; traceIndex = 0;
  $('#run-query').disabled = false; $('#run-query').innerHTML = '<span aria-hidden="true">▶</span> Executar consulta';
  $('#answer-count').textContent = 'CÓDIGO ALTERADO';
  $('#answer-content').innerHTML = '<span class="neutral-note">Execute novamente para atualizar as respostas e o percurso.</span>';
  updateTrace();
}

function renderVisual() {
  if (!$('#visual-canvas')) return;
  const query = $('#query').value;
  if (visualMode === 'knowledge') {
    renderKnowledgeGraph($('#visual-canvas'), $('#program').value, result?.trace?.[traceIndex]?.goal || query);
    $('#visual-hint').textContent = 'Relações declaradas ou estrutura do termo. As setas seguem a ordem dos argumentos.';
  } else if (visualMode === 'structure') {
    renderTermStructure($('#visual-canvas'), $('#program').value, result?.trace?.[traceIndex]?.goal || query);
    $('#visual-hint').textContent = 'O termo em partes: functor, argumentos, variáveis e listas. A estrutura acompanha a meta do passo atual.';
  } else {
    renderSearchTree($('#visual-canvas'), result?.trace || [], traceIndex);
    $('#visual-hint').textContent = 'A busca em ordem de execução. O recuo mostra a profundidade das chamadas.';
  }
}

const portNames = { call: 'CHAMADA', rule: 'CLÁUSULA', match: 'UNIFICA', redo: 'RETORNO', exit: 'PROVADO', fail: 'FALHA', solution: 'SOLUÇÃO' };
function updateTrace() {
  const trace = result?.trace || [], event = trace[traceIndex];
  $('#step-position').textContent = `${trace.length ? traceIndex + 1 : 0} / ${trace.length}`;
  $('#trace-range').max = Math.max(0, trace.length - 1); $('#trace-range').value = traceIndex; $('#trace-range').disabled = !trace.length;
  $('#trace-start').disabled = !trace.length || traceIndex === 0;
  $('#trace-prev').disabled = !trace.length || traceIndex === 0;
  $('#trace-next').disabled = !trace.length || traceIndex >= trace.length - 1;
  $('#trace-play').disabled = trace.length < 2;
  $('#trace-status').textContent = event ? (portNames[event.type] || event.type.toUpperCase()) : (dirty ? 'ALTERADO' : 'PRONTO');
  $('#trace-status').className = `trace-status ${event?.type || ''}`;
  $('#trace-goal').textContent = event?.goal || 'Uma pergunta dá início à busca.';
  const details = event ? [event.detail, event.clause ? `Cláusula: ${event.clause}` : '', event.bindings && Object.keys(event.bindings).length ? `Ligações: ${Object.entries(event.bindings).map(([key, val]) => `${key} = ${val}`).join(', ')}` : ''].filter(Boolean).join(' ') : 'Execute a consulta e use os controles para acompanhar a busca.';
  $('#trace-detail').textContent = details;
  renderVisual();
}

function showResult(value) {
  result = value; dirty = false; traceIndex = 0; running = false;
  $('#run-query').disabled = false; $('#run-query').innerHTML = '<span aria-hidden="true">▶</span> Executar consulta';
  const solutions = value.solutions || [];
  $('#answer-count').textContent = `${solutions.length} ${solutions.length === 1 ? 'SOLUÇÃO' : 'SOLUÇÕES'}${value.truncated || value.error ? ' · PARCIAL' : ''}`;
  const variables = [...new Set(solutions.flatMap(solution => Object.keys(solution.bindings)))];
  let html = '';
  if (solutions.length && variables.length) html += `<table><caption class="sr-only">Valores das variáveis em cada solução</caption><thead><tr><th scope="col">#</th>${variables.map(v => `<th scope="col">${escape(v)}</th>`).join('')}</tr></thead><tbody>${solutions.map((solution, i) => `<tr><td>${i + 1}</td>${variables.map(v => `<td>${escape(solution.bindings[v] ?? '—')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  else if (solutions.length) html += `<code>true${solutions.length > 1 ? ` · ${solutions.length} provas` : ''}</code>`;
  else if (!value.error && !value.truncated) html += '<code>false.</code> <span class="neutral-note">Não foi encontrada prova nesta base.</span>';
  if (value.error) html += `<p class="error-message">${escape(value.error)}</p>`;
  if (value.truncated) html += '<p class="answer-warning">Busca interrompida pelo limite do laboratório. Estas respostas são parciais; ainda pode haver outras.</p>';
  if (value.traceTruncated) html += '<p class="answer-warning">O percurso visual foi limitado a 800 eventos. As respostas foram calculadas separadamente.</p>';
  $('#answer-content').innerHTML = html;
  if (!value.error && !value.truncated) $('#answer-count').textContent += ' · BUSCA ENCERRADA';
  updateTrace();
}

function execute() {
  if (running) return;
  const program = $('#program').value, query = $('#query').value.trim();
  if (!query) { $('#query').reportValidity(); return; }
  stopPlayback(); cancelRun(); running = true;
  $('#run-query').disabled = true; $('#run-query').textContent = 'Buscando respostas…';
  $('#answer-count').textContent = 'EXECUTANDO';
  $('#answer-content').innerHTML = '<span class="neutral-note">Explorando os caminhos da consulta…</span>';
  try {
    worker = new Worker(new URL('./runner.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => { cancelRun(); showResult(data); };
    worker.onerror = () => { cancelRun(); showResult({ solutions: [], trace: [], error: 'Não foi possível iniciar a execução local. Abra a página por HTTP (site ou servidor local) e tente novamente.' }); };
    worker.postMessage({ program, query });
    runTimer = setTimeout(() => { cancelRun(); showResult({ solutions: [], trace: [], truncated: true, error: 'Tempo de execução excedido. Verifique a condição de parada e a ordem das metas recursivas.' }); }, 4000);
  } catch (error) { cancelRun(); showResult({ solutions: [], trace: [], error: `Não foi possível iniciar o laboratório: ${error.message}` }); }
}

function bindLab(lesson) {
  visualMode = 'knowledge'; result = null; dirty = false;
  document.querySelectorAll('[data-scroll]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); $(`#${link.dataset.scroll}`).scrollIntoView({ behavior: 'smooth' }); }));
  $('#program').addEventListener('scroll', () => { $('#line-numbers').scrollTop = $('#program').scrollTop; });
  let visualDebounce;
  $('#program').addEventListener('input', () => { invalidate(); updateLines(); clearTimeout(visualDebounce); visualDebounce = setTimeout(renderVisual, 250); });
  $('#query').addEventListener('input', invalidate);
  $('#query-form').addEventListener('submit', event => { event.preventDefault(); execute(); });
  const shortcut = event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); execute(); } };
  $('#program').addEventListener('keydown', shortcut);
  $('#query').addEventListener('keydown', shortcut);
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => { $('#query').value = lesson.presets[Number(button.dataset.preset)].query; invalidate(); execute(); }));
  $('#reset-code').addEventListener('click', () => { $('#program').value = lesson.program; $('#query').value = lesson.query; drafts.delete(lesson.id); invalidate(); updateLines(); renderVisual(); notify('Exemplo original restaurado.'); });
  $('#download-code').addEventListener('click', () => {
    const blob = new Blob([`% Lógica viva · ${lesson.title}\n% Consulta sugerida: ?- ${$('#query').value}\n\n${$('#program').value}\n`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = `${lesson.id}.pl`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Programa .pl preparado para download.');
  });
  function setVisual(mode) {
    visualMode = mode;
    $('#knowledge-tab').classList.toggle('active', mode === 'knowledge'); $('#knowledge-tab').setAttribute('aria-pressed', mode === 'knowledge');
    $('#structure-tab').classList.toggle('active', mode === 'structure'); $('#structure-tab').setAttribute('aria-pressed', mode === 'structure');
    $('#search-tab').classList.toggle('active', mode === 'search'); $('#search-tab').setAttribute('aria-pressed', mode === 'search');
    renderVisual();
  }
  $('#knowledge-tab').addEventListener('click', () => setVisual('knowledge'));
  $('#structure-tab').addEventListener('click', () => setVisual('structure'));
  $('#search-tab').addEventListener('click', () => setVisual('search'));
  $('#trace-start').addEventListener('click', () => { stopPlayback(); traceIndex = 0; updateTrace(); });
  $('#trace-prev').addEventListener('click', () => { stopPlayback(); traceIndex = Math.max(0, traceIndex - 1); updateTrace(); });
  $('#trace-next').addEventListener('click', () => { stopPlayback(); traceIndex = Math.min(result.trace.length - 1, traceIndex + 1); updateTrace(); });
  $('#trace-range').addEventListener('input', event => { stopPlayback(); traceIndex = Number(event.target.value); updateTrace(); });
  $('#trace-play').addEventListener('click', () => {
    if (playback) { stopPlayback(); return; }
    if (!result?.trace?.length) return;
    if (traceIndex >= result.trace.length - 1) traceIndex = 0;
    setVisual('search');
    $('#trace-play').textContent = 'Ⅱ'; $('#trace-play').setAttribute('aria-label', 'Pausar reprodução');
    playback = setInterval(() => { if (traceIndex >= result.trace.length - 1) { stopPlayback(); return; } traceIndex++; updateTrace(); }, Number($('#trace-speed').value));
    updateTrace();
  });
  $('#trace-speed').addEventListener('change', () => { if (playback) { stopPlayback(); $('#trace-play').click(); } });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    const choice = Number(button.dataset.answer), correct = choice === lesson.challenge.answer;
    document.querySelectorAll('[data-answer]').forEach(option => { option.classList.remove('correct', 'incorrect'); option.setAttribute('aria-pressed', option === button ? 'true' : 'false'); });
    button.classList.add(correct ? 'correct' : 'incorrect');
    $('#quiz-feedback').textContent = correct ? `Isso mesmo! ${lesson.challenge.explanation}` : 'Releia as condições e teste sua hipótese no laboratório. Você pode tentar outra resposta.';
  }));
  $('#complete-lesson').addEventListener('click', () => {
    const wasCompleted = completed.has(lesson.id);
    if (wasCompleted) completed.delete(lesson.id); else completed.add(lesson.id);
    let saved = true;
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { saved = false; }
    $('#complete-lesson').textContent = completed.has(lesson.id) ? '✓ Capítulo concluído' : 'Marcar como estudado ✓';
    navigation(); notify(saved ? (wasCompleted ? 'Capítulo marcado para revisão.' : 'Progresso salvo neste navegador. Boa descoberta!') : 'Progresso atualizado nesta visita. O navegador não permitiu salvá-lo.');
  });
  updateLines(); setVisual(['termos-unificacao', 'listas', 'aritmetica'].includes(lesson.id) ? 'structure' : 'knowledge');
}

function references() {
  document.title = 'Biblioteca de apoio · Lógica viva';
  $('#main').innerHTML = `<section class="reference-page page-enter"><div class="eyebrow">PARA IR ALÉM DO LABORATÓRIO</div><h1>Uma biblioteca.<br><em>Mais conexões.</em></h1><p class="reference-intro">Os dois materiais de referência da trilha estão disponíveis na íntegra. Use os slides para revisar visualmente e a apostila para aprofundar os conceitos e praticar novos problemas.</p><div class="pdf-grid">
    <article class="pdf-card"><div class="pdf-icon" aria-hidden="true">PDF</div><div class="eyebrow">INTRODUÇÃO VISUAL</div><h2>Introdução ao Prolog</h2><p>O paradigma lógico a partir de relações familiares: fatos, perguntas, variáveis, regras, grafos e recursão.</p><div class="pdf-meta">9 páginas · 54 slides · Material original</div><div class="pdf-actions"><a class="button small" href="./referencias/IA-Prolog-Introducao-Tutorial.pdf" target="_blank" rel="noopener">Ler o tutorial ↗</a><a class="text-link" href="./referencias/IA-Prolog-Introducao-Tutorial.pdf" download>Baixar PDF ↓</a></div></article>
    <article class="pdf-card"><div class="pdf-icon" aria-hidden="true">PDF</div><div class="eyebrow">CONSULTA E APROFUNDAMENTO</div><h2>Apostila de Prolog</h2><p>Fundamentos, sintaxe, listas, aritmética, corte e aplicações. Inclui exemplos e exercícios para continuar a exploração.</p><div class="pdf-meta">34 páginas · Apostila de apoio · Material original</div><div class="pdf-actions"><a class="button small" href="./referencias/apostila-prolog.pdf" target="_blank" rel="noopener">Ler a apostila ↗</a><a class="text-link" href="./referencias/apostila-prolog.pdf" download>Baixar PDF ↓</a></div></article>
  </div><div class="reference-notes"><h2>Como usar os materiais</h2><p>Em cada capítulo, o rodapé indica as páginas físicas dos PDFs que apoiam o tema. Os exemplos da trilha foram adaptados e a sintaxe revisada para a execução interativa; os documentos acima preservam os arquivos originais.</p><p>Na apostila, continue com problemas como cadeia alimentar, palíndromos, ordenação e Torre de Hanoi. Exemplos que usam entrada/saída ou bibliotecas devem ser executados em um ambiente Prolog completo.</p></div>${supportDetails()}<div class="reference-banner"><div><h3>Aprender é fazer uma nova pergunta.</h3><p>Volte ao laboratório e teste uma ideia dos materiais.</p></div><a class="button small" href="#inicio">Explorar a trilha →</a></div></section>`;
}

function route() {
  if (currentLesson && $('#program')) drafts.set(currentLesson.id, { program: $('#program').value, query: $('#query').value });
  stopPlayback(); cancelRun(); currentLesson = null; result = null;
  toggleMenu(false);
  const id = location.hash.slice(1) || 'inicio', lesson = lessons.find(item => item.id === id);
  if (lesson) lessonPage(lesson);
  else if (id === 'referencias') references();
  else home();
  navigation(); window.scrollTo(0, 0);
  if (document.readyState === 'complete') $('#main').focus({ preventScroll: true });
}

function toggleMenu(opened) {
  $('#sidebar').classList.toggle('open', opened);
  $('#sidebar').inert = matchMedia('(max-width: 700px)').matches && !opened;
  $('#menu-button').setAttribute('aria-expanded', String(opened));
  $('#menu-button').setAttribute('aria-label', opened ? 'Fechar trilha de estudo' : 'Abrir trilha de estudo');
}
$('#menu-button').addEventListener('click', () => toggleMenu(!$('#sidebar').classList.contains('open')));
matchMedia('(max-width: 700px)').addEventListener('change', () => toggleMenu(false));
$('.skip-link').addEventListener('click', event => { event.preventDefault(); $('#main').focus(); $('#main').scrollIntoView(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { const hadFocus = $('#sidebar').contains(document.activeElement); toggleMenu(false); if (hadFocus) $('#menu-button').focus(); } });
window.addEventListener('hashchange', route);
route();
