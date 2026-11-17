import { lessons, sources } from './lessons.js';
import { mountLab } from './labs.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const rich = text => escape(text).replace(/`([^`]+)`/g, '<code>$1</code>');
const key = 'indices-por-dentro-v1';
const groups = [
  { label: '01 · O livro e as estruturas', start: 0, end: 4 },
  { label: '02 · Do acesso à cobertura', start: 4, end: 8 },
  { label: '03 · Consultas e decisões', start: 8, end: 14 },
  { label: '04 · Além da busca', start: 14, end: 20 }
];
let completed = new Set();
let answers = {};
let cleanup;
let current;
let toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  if (Array.isArray(saved.completed)) completed = new Set(saved.completed.filter(id => lessons.some(l => l.id === id)));
  if (saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers)) answers = saved.answers;
} catch { /* A aula funciona também sem armazenamento local. */ }

function save() {
  try { localStorage.setItem(key, JSON.stringify({ completed: [...completed], answers })); } catch { /* Progresso apenas nesta sessão. */ }
}
function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2500);
}
function navigation() {
  $('#lesson-nav').innerHTML = groups.map(group => `<div class="nav-group"><div class="nav-group-label">${escape(group.label)}</div>${lessons.slice(group.start, group.end).map((lesson, i) => `<a href="#${lesson.id}" ${current === lesson.id ? 'aria-current="page"' : ''}><span class="nav-number">${String(group.start + i + 1).padStart(2, '0')}</span><span>${escape(lesson.shortTitle)}</span><span class="nav-check" aria-label="${completed.has(lesson.id) ? 'Estudado' : 'Ainda não marcado'}">${completed.has(lesson.id) ? '✓' : ''}</span></a>`).join('')}</div>`).join('');
  $('#progress-label').textContent = `${completed.size} / ${lessons.length}`;
  $('#progress-fill').style.width = `${completed.size / lessons.length * 100}%`;
  document.querySelectorAll('.overview-nav a').forEach(a => {
    if (a.hash === `#${current}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
function snippet(code) {
  return `<div class="code-block"><button type="button" class="copy-code" aria-label="Copiar código SQL">Copiar</button><pre><code>${escape(code)}</code></pre></div>`;
}
function sourceLinks(ids = []) {
  return ids.map(id => sources.find(source => source.id === id)).filter(Boolean).map(source => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a>`).join('');
}
function overview() {
  document.title = 'Índices por dentro — SQL Server';
  $('#main').innerHTML = `<div class="page-enter">
    <section class="hero"><div class="hero-copy"><div class="eyebrow">SQL SERVER · AULA INTERATIVA</div><h1>O caminho até<br><em>o dado certo.</em></h1><p>Um índice é uma forma de encontrar. Vamos abrir esse livro, separar suas páginas e ver o que o SQL Server faz para responder a uma consulta.</p><div class="hero-actions"><a class="button" href="#livro">Começar pelo livro <span>→</span></a><a class="text-link" href="#trilha" data-scroll="trilha">Explorar os capítulos ↓</a></div><div class="hero-meta"><span>20 capítulos</span><span>20 experimentos</span><span>SQL para praticar</span></div></div>
    <div class="cover-diagram" aria-label="O índice contém valores ordenados e localizadores que levam aos dados"><div class="diagram-caption"><span>UMA CONSULTA. UM CAMINHO.</span><span class="live-dot">VISUALIZAR</span></div><div class="cover-query"><span>SELECT Nome FROM Cliente</span><strong>WHERE UF = 'SP'</strong></div><div class="cover-flow"><div class="mini-index"><div class="box-heading">ÍNDICE · UF</div><div><span>MG</span><code>02</code></div><div><span>RJ</span><code>03</code></div><div class="selected"><span>SP</span><code>01</code></div><div class="selected"><span>SP</span><code>04</code></div><small>Chave + localizador</small></div><span class="connector-arrow" aria-hidden="true">→</span><div class="mini-base"><div class="box-heading">TABELA · CLIENTE</div><div class="selected"><code>01</code><span>Vinicius</span><b>SP</b></div><div><code>02</code><span>Maria</span><b>MG</b></div><div><code>03</code><span>Ana</span><b>RJ</b></div><div class="selected"><code>04</code><span>Claudio</span><b>SP</b></div><small>Dados nas folhas do clustered</small></div></div><div class="diagram-foot">O índice aponta. O dado conta a história.</div></div></section>
    <section class="learning-promises" aria-label="O que vamos investigar"><article><span>01 / ENCONTRAR</span><h2>Do livro à B+ tree.</h2><p>Abra as páginas, siga as chaves e diferencie a tabela base das cópias nos índices.</p></article><article><span>02 / ENTENDER</span><h2>Por que esse plano?</h2><p>Veja seeks, scans, lookups e os efeitos de funções, chaves compostas e INCLUDE.</p></article><article><span>03 / MEDIR</span><h2>Menos adivinhação.</h2><p>Compare leituras, estatísticas e custos de escrita. Valide tudo no SQL Server.</p></article></section>
    <section class="opening-lab"><div class="section-heading"><div><div class="eyebrow">UMA PRIMEIRA EXPERIÊNCIA</div><h2>Se fosse um livro, onde você procuraria?</h2><p>Alterne entre percorrer páginas e consultar o índice remissivo.</p></div><a class="text-link" href="#livro">Entender a analogia →</a></div><div id="overview-lab"></div></section>
    <section id="trilha" class="trail-section"><div class="section-heading"><div><div class="eyebrow">DA PRIMEIRA PÁGINA AO PLANO REAL</div><h2>Uma trilha para abrir cada caixinha.</h2><p>Leia o conceito, experimente, formule uma hipótese e teste sua resposta.</p></div><span class="section-tag">ESTUDE NO SEU RITMO</span></div>${groups.map(group => `<div class="trail-group"><h3>${escape(group.label)}</h3><div class="trail-grid">${lessons.slice(group.start, group.end).map((lesson, i) => `<a class="trail-card" href="#${lesson.id}"><span class="trail-number">${String(group.start + i + 1).padStart(2, '0')}</span><div><h4>${escape(lesson.shortTitle)}</h4><p>${escape(lesson.description)}</p><small>${escape(lesson.duration)} · experimento + desafio</small></div><span class="trail-arrow" aria-hidden="true">${completed.has(lesson.id) ? '✓' : '↗'}</span></a>`).join('')}</div></div>`).join('')}</section>
    <aside class="resource-banner"><div><div class="eyebrow">DO MODELO AO BANCO REAL</div><h2>Leve a investigação para o SSMS.</h2><p>Dados de treino, consultas comparáveis e um roteiro para observar planos reais.</p></div><a class="button" href="./laboratorio.sql" download>Baixar laboratório .sql ↓</a></aside>
    <div class="lesson-pagination"><a class="text-link" href="#referencias">Documentação oficial e guia da aula ↗</a><a class="text-link" href="#revisao">Revisão e desafios →</a></div>
  </div>`;
  cleanup = mountLab($('#overview-lab'), 'book');
}

function lessonPage(lesson) {
  const index = lessons.indexOf(lesson);
  document.title = `${lesson.shortTitle} — Índices por dentro`;
  $('#main').innerHTML = `<article class="page-enter lesson-page">
    <header class="lesson-header"><div><div class="eyebrow">CAPÍTULO ${String(index + 1).padStart(2, '0')} · ${escape(lesson.kicker)}</div><h1>${escape(lesson.title)}</h1><p>${escape(lesson.description)}</p><div class="lesson-meta"><span>${escape(lesson.duration)}</span><span>Conceito + experimento + desafio</span></div></div><span class="chapter-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></header>
    <nav class="page-tabs" aria-label="Seções do capítulo"><a href="#entenda" data-scroll="entenda">01 · Entenda</a><a href="#experimente" data-scroll="experimente">02 · Experimente</a><a href="#pratique" data-scroll="pratique">03 · Pratique</a></nav>
    <section id="entenda" class="concept-grid" aria-label="Conceitos do capítulo">${lesson.concepts.map((concept, i) => `<article class="concept"><span class="concept-number">IDEIA ${String(i + 1).padStart(2, '0')}</span><h2>${escape(concept.title)}</h2><p>${rich(concept.text)}</p>${concept.code ? snippet(concept.code) : ''}</article>`).join('')}</section>
    <section id="experimente" class="experiment"><div class="section-heading"><div><div class="eyebrow">ABRA A CAIXINHA</div><h2>Agora, veja o caminho acontecer.</h2><p>${rich(lesson.experiment)}</p></div><span class="section-tag">LABORATÓRIO VISUAL</span></div><div id="lesson-lab"></div></section>
    ${lesson.pitfalls?.length ? `<aside class="pitfalls"><span class="callout-icon" aria-hidden="true">!</span><div><h3>Cuidado com a conclusão.</h3><ul>${lesson.pitfalls.map(pitfall => `<li>${rich(pitfall)}</li>`).join('')}</ul></div></aside>` : ''}
    <section id="pratique" class="challenge" aria-labelledby="quiz-title"><div class="eyebrow">PAUSA PARA INVESTIGAR</div><h2 id="quiz-title">Antes de seguir, teste sua hipótese.</h2>${quizHTML(lesson, false)}<div class="completion-row"><span>Concluir é uma escolha sua. Você pode voltar e explorar de novo.</span><button class="button" id="complete-lesson">${completed.has(lesson.id) ? '✓ Capítulo estudado' : 'Marcar como estudado'}</button></div></section>
    <aside class="source-note"><strong>Continue na documentação oficial</strong><div>${sourceLinks(lesson.sourceIds)}</div></aside>
    <nav class="lesson-pagination" aria-label="Navegar entre capítulos"><a href="#${index > 0 ? lessons[index - 1].id : 'inicio'}"><small>← ${index > 0 ? 'CAPÍTULO ANTERIOR' : 'VISÃO GERAL'}</small><strong>${escape(index > 0 ? lessons[index - 1].shortTitle : 'Voltar para a trilha')}</strong></a><a href="#${index < lessons.length - 1 ? lessons[index + 1].id : 'revisao'}"><small>${index < lessons.length - 1 ? 'PRÓXIMO CAPÍTULO' : 'REVISÃO DA AULA'} →</small><strong>${escape(index < lessons.length - 1 ? lessons[index + 1].shortTitle : 'Conectar as descobertas')}</strong></a></nav>
  </article>`;
  cleanup = mountLab($('#lesson-lab'), lesson.kind);
  $('#complete-lesson').addEventListener('click', () => {
    if (completed.has(lesson.id)) { completed.delete(lesson.id); notify('Capítulo desmarcado.'); } else { completed.add(lesson.id); notify('Progresso salvo. Próxima descoberta!'); }
    save(); navigation();
    $('#complete-lesson').textContent = completed.has(lesson.id) ? '✓ Capítulo estudado' : 'Marcar como estudado';
  });
  bindQuizzes();
}
function quizHTML(lesson, revision) {
  const quiz = lesson.quiz;
  const choice = Number.isInteger(answers[lesson.id]) && answers[lesson.id] >= 0 && answers[lesson.id] < quiz.options.length ? answers[lesson.id] : null;
  return `<div class="quiz" data-quiz="${lesson.id}"><p class="quiz-question">${revision ? `<span class="quiz-chapter">${escape(lesson.shortTitle)}</span>` : ''}${rich(quiz.question)}</p><div class="quiz-options">${quiz.options.map((option, i) => `<button class="quiz-option${choice === i ? i === quiz.answer ? ' correct' : ' incorrect' : ''}" data-answer="${i}" aria-pressed="${choice === i}"><span>${String.fromCharCode(65 + i)}</span>${rich(option)}</button>`).join('')}</div><div class="quiz-feedback${choice !== null ? choice === quiz.answer ? ' correct' : ' incorrect' : ''}" role="status">${choice !== null ? `<strong>${choice === quiz.answer ? 'Isso mesmo.' : 'Vamos rever essa hipótese.'}</strong> ${rich(quiz.explanation)}` : ''}</div></div>`;
}
function bindQuizzes() {
  document.querySelectorAll('[data-quiz]').forEach(element => {
    element.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      const lesson = lessons.find(l => l.id === element.dataset.quiz);
      const answer = Number(button.dataset.answer);
      answers[lesson.id] = answer;
      save();
      element.querySelectorAll('[data-answer]').forEach(b => {
        const selected = b === button;
        b.setAttribute('aria-pressed', String(selected));
        b.classList.toggle('correct', selected && answer === lesson.quiz.answer);
        b.classList.toggle('incorrect', selected && answer !== lesson.quiz.answer);
      });
      const feedback = $('.quiz-feedback', element);
      feedback.className = `quiz-feedback ${answer === lesson.quiz.answer ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = `<strong>${answer === lesson.quiz.answer ? 'Isso mesmo.' : 'Vamos rever essa hipótese.'}</strong> ${rich(lesson.quiz.explanation)}`;
      updateScore();
    }));
  });
}
function updateScore() {
  const score = $('#revision-score');
  if (score) {
    const tried = lessons.filter(l => Number.isInteger(answers[l.id]) && answers[l.id] >= 0 && answers[l.id] < l.quiz.options.length).length;
    const correct = lessons.filter(l => answers[l.id] === l.quiz.answer).length;
    score.textContent = `${correct} corretas · ${tried} respondidas · ${lessons.length} questões`;
  }
}
function revision() {
  document.title = 'Revisão e desafios — Índices por dentro';
  $('#main').innerHTML = `<article class="page-enter"><header class="lesson-header"><div><div class="eyebrow">CONECTE AS DESCOBERTAS</div><h1>Qual caminho<br>você escolheria?</h1><p>Vinte perguntas para discutir em sala. Cada resposta abre uma explicação. As mesmas questões também aparecem nos capítulos.</p></div></header><div class="revision-toolbar"><strong id="revision-score" role="status"></strong><button id="reset-answers" class="quiet-button">Limpar respostas</button></div><div class="revision-grid">${lessons.map((lesson, i) => `<section class="challenge revision-card"><span class="concept-number">QUESTÃO ${String(i + 1).padStart(2, '0')}</span>${quizHTML(lesson, true)}<a class="text-link" href="#${lesson.id}">Revisitar este capítulo →</a></section>`).join('')}</div><aside class="resource-banner"><div><h2>O desafio final é no banco.</h2><p>Desenhe um índice, compare resultados e leituras, e explique o custo que aceitou para as escritas.</p></div><a class="button" href="#desafio">Abrir desafio final →</a></aside></article>`;
  bindQuizzes(); updateScore();
  $('#reset-answers').addEventListener('click', () => { answers = {}; save(); revision(); notify('Respostas limpas. Uma nova rodada de hipóteses.'); });
}
function references() {
  document.title = 'Laboratório e fontes — Índices por dentro';
  $('#main').innerHTML = `<article class="page-enter"><header class="lesson-header"><div><div class="eyebrow">DA ILUSTRAÇÃO À EVIDÊNCIA</div><h1>Continue a<br>investigação.</h1><p>A aula usa documentação oficial da Microsoft e os slides do professor como ponto de partida. Aqui estão os caminhos para aprofundar e praticar.</p></div></header>
    <section class="download-grid"><article class="download-card"><span class="file-symbol">.sql</span><h2>Laboratório SQL Server</h2><p>Crie um ambiente dedicado, gere dados e compare consultas com planos de execução reais no SSMS. Leia as instruções no início do arquivo antes de executar.</p><a class="button" href="./laboratorio.sql" download>Baixar roteiro SQL ↓</a></article><article class="download-card"><span class="file-symbol">.md</span><h2>Guia para o professor</h2><p>Sequência sugerida de 3 horas, perguntas para a turma, passos de demonstração e pontos para discussão.</p><a class="button secondary" href="./guia-professor.md" download>Baixar guia da aula ↓</a></article></section>
    <aside class="pitfalls"><span class="callout-icon" aria-hidden="true">i</span><div><h3>Como ler os experimentos.</h3><p>As caixinhas e os planos no navegador são modelos didáticos. As métricas locais descrevem a simulação; não são medições de um SQL Server. O otimizador real decide conforme versão, dados, estatísticas, índices e parâmetros. Use o roteiro SQL para observar a sua execução.</p></div></aside>
    <section class="references"><div class="section-heading"><div><div class="eyebrow">BIBLIOTECA DE APOIO</div><h2>Direto da fonte.</h2><p>Documentação consultada em 17 de novembro de 2026. O laboratório tem como base SQL Server 2019 ou posterior; recursos mais recentes são identificados no conteúdo.</p></div></div><ol class="reference-list">${sources.map((source, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer"><strong>${escape(source.title)}</strong><small>${escape(new URL(source.url).hostname)}</small></a><span aria-hidden="true">↗</span></li>`).join('')}</ol>
    <a class="slide-reference" href="https://docs.google.com/presentation/d/1npTdQe8v33cXhAo6u5plbDIRBzsdZgqfjWSZ4A5v0OA/edit#slide=id.h5d1072485cbf306e_0_46" target="_blank" rel="noopener noreferrer"><span class="file-symbol">↗</span><div><strong>Slides de referência · Aula 10min SQL Indexes</strong><p>Exemplo de Cliente, filtro por UF e a cópia de Nome com INCLUDE. Expandido aqui em experimentos e novos capítulos.</p></div></a></section>
    <nav class="lesson-pagination"><a href="#inicio"><small>← VISÃO GERAL</small><strong>Voltar para a trilha</strong></a><a href="#livro"><small>PRIMEIRA DESCOBERTA →</small><strong>Começar pelo livro</strong></a></nav></article>`;
}
function route() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = undefined;
  const hash = location.hash.slice(1);
  const lesson = lessons.find(l => l.id === hash);
  current = lesson ? lesson.id : ['revisao', 'referencias'].includes(hash) ? hash : 'inicio';
  if (lesson) lessonPage(lesson); else if (current === 'revisao') revision(); else if (current === 'referencias') references(); else overview();
  $('#breadcrumb').textContent = lesson ? lesson.shortTitle : current === 'referencias' ? 'Laboratório e fontes' : current === 'revisao' ? 'Revisão e desafios' : 'Índices no SQL Server';
  navigation();
  $('#sidebar').classList.remove('open');
  $('#menu-button').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' });
}
$('#menu-button').addEventListener('click', () => {
  const open = $('#sidebar').classList.toggle('open');
  $('#menu-button').setAttribute('aria-expanded', String(open));
});
$('#presentation-button').addEventListener('click', () => {
  const active = document.body.classList.toggle('presenting');
  $('#presentation-button').setAttribute('aria-pressed', String(active));
  $('#presentation-button').textContent = active ? 'Sair do modo aula' : 'Modo aula';
  if (active) $('#main').focus({ preventScroll: true });
  if (active) notify('Modo aula: use ← e → para trocar de capítulo. Esc para sair.');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    $('#sidebar').classList.remove('open'); $('#menu-button').setAttribute('aria-expanded', 'false');
    if (document.body.classList.contains('presenting')) $('#presentation-button').click();
  }
  if (!document.body.classList.contains('presenting') || event.ctrlKey || event.altKey || event.metaKey || event.target.closest('input,textarea,select,button,[contenteditable="true"]')) return;
  const index = lessons.findIndex(l => l.id === current);
  if (event.key === 'ArrowRight' && index < lessons.length - 1) { event.preventDefault(); location.hash = lessons[index + 1].id; }
  if (event.key === 'ArrowLeft' && index >= 0) { event.preventDefault(); location.hash = index > 0 ? lessons[index - 1].id : 'inicio'; }
});
document.addEventListener('click', async event => {
  const scroll = event.target.closest('[data-scroll]');
  if (scroll) {
    event.preventDefault();
    const target = document.getElementById(scroll.dataset.scroll);
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    if (target?.id === 'main') target.focus({ preventScroll: true });
  }
  const copy = event.target.closest('.copy-code');
  if (copy) {
    const code = copy.parentElement.querySelector('code').textContent;
    try { await navigator.clipboard.writeText(code); copy.textContent = 'Copiado ✓'; setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copiar'; }, 1800); }
    catch { const range = document.createRange(); range.selectNodeContents(copy.parentElement.querySelector('code')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); notify('Código selecionado. Use Ctrl+C para copiar.'); }
  }
});
window.addEventListener('hashchange', route);
route();
