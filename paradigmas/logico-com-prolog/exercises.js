import { exercises } from './exercises-data.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const rich = value => escape(value).replace(/`([^`]+)`/g, '<code>$1</code>');
const blocks = [
  { id: 1, title: 'Comece pequeno.', description: 'Fatos, consultas e variáveis: encontre as primeiras respostas.' },
  { id: 2, title: 'Conecte as ideias.', description: 'Regras e condições: transforme informação em novas relações.' },
  { id: 3, title: 'Vá um pouco além.', description: 'Combine os conceitos e pratique listas e recursão.' }
];
const progressKey = 'logica-viva-exercicios-v1';
let completed = new Set(), activeBlock = 0;
try {
  const saved = JSON.parse(localStorage.getItem(progressKey) || '[]');
  if (Array.isArray(saved)) completed = new Set(saved.filter(id => exercises.some(exercise => exercise.id === id)));
} catch { /* Progress is optional; the full worksheet remains usable. */ }

function toast(message) {
  $('#toast').textContent = message; $('#toast').classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}

function renderCard(exercise) {
  const levelClass = exercise.block === 3 ? 'medium' : exercise.block === 2 ? 'transition' : '';
  return `<article class="exercise-card" id="${escape(exercise.id)}" aria-labelledby="title-${escape(exercise.id)}">
    <header class="exercise-card-header"><span class="exercise-number" aria-hidden="true">${escape(exercise.number)}</span><div class="exercise-heading-text"><p class="exercise-topic">${escape(exercise.topic)}</p><h3 id="title-${escape(exercise.id)}"><span class="sr-only">Exercício ${escape(exercise.number)}: </span>${escape(exercise.title)}</h3></div><span class="exercise-level ${levelClass}">${escape(exercise.level)}</span></header>
    <p class="exercise-intro">${rich(exercise.intro)}</p>
    <div class="exercise-grid"><div class="exercise-mission"><h4>Sua missão</h4><ol>${exercise.tasks.map(task => `<li>${rich(task)}</li>`).join('')}</ol></div><div class="exercise-base"><div class="base-heading"><span>PONTO DE PARTIDA · EXERCÍCIO ${escape(exercise.number)}</span><button class="copy-base" data-copy="${escape(exercise.id)}" aria-label="Copiar base do exercício ${escape(exercise.number)}">Copiar base</button></div><pre><code>${escape(exercise.starter)}</code></pre></div></div>
    <div class="exercise-help-row"><details class="exercise-help"><summary>Preciso de uma dica <span class="sr-only">para o exercício ${escape(exercise.number)}</span></summary><p>${rich(exercise.hint)}</p></details><details class="exercise-help"><summary>Como conferir <span class="sr-only">o exercício ${escape(exercise.number)}</span></summary><ul class="exercise-checks">${exercise.checks.map(check => `<li>${check.query ? `<code>${escape(check.query)}</code>` : ''}<p>${rich(check.expectation)}</p></li>`).join('')}</ul></details></div>
    <footer class="exercise-card-footer"><a class="exercise-review" href="${escape(exercise.review.href)}">${escape(exercise.review.label)} ↗</a><label class="exercise-done"><input type="checkbox" data-complete="${escape(exercise.id)}" aria-label="Marcar exercício ${escape(exercise.number)} como resolvido"><span>Marcar como resolvido</span></label></footer>
  </article>`;
}

$('#exercise-list').innerHTML = blocks.map(block => `<section class="exercise-block" data-exercise-block="${block.id}" aria-labelledby="block-${block.id}"><header class="exercise-block-heading"><span class="block-index" aria-hidden="true">0${block.id}</span><div><h2 id="block-${block.id}">${block.title}</h2><p>${block.description}</p></div><span class="block-line" aria-hidden="true"></span></header>${exercises.filter(exercise => exercise.block === block.id).map(renderCard).join('')}</section>`).join('');
$('#exercise-nav').innerHTML = blocks.map(block => `<div class="exercise-nav-group">0${block.id} · ${escape(block.title.replace('.', ''))}</div>${exercises.filter(exercise => exercise.block === block.id).map(exercise => `<a class="nav-link" href="#${escape(exercise.id)}"><span class="nav-number">${escape(exercise.number)}</span><span>${escape(exercise.title)}</span></a>`).join('')}`).join('');

function syncProgress() {
  $('#progress-label').textContent = `${completed.size} / ${exercises.length}`;
  $('#progress-fill').style.width = `${completed.size / exercises.length * 100}%`;
  exercises.forEach(exercise => {
    const done = completed.has(exercise.id), card = document.getElementById(exercise.id);
    card.classList.toggle('is-complete', done);
    card.querySelector('[data-complete]').checked = done;
    const nav = $(`#exercise-nav a[href="#${exercise.id}"]`);
    nav.classList.toggle('complete', done);
    nav.querySelector('.nav-number').textContent = done ? '✓' : exercise.number;
  });
}

function updateActiveLink() {
  const id = location.hash.slice(1);
  document.querySelectorAll('#exercise-nav a').forEach(link => {
    const current = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}

function filterBlocks(value) {
  activeBlock = Number(value);
  document.querySelectorAll('[data-exercise-block]').forEach(section => { section.hidden = activeBlock !== 0 && Number(section.dataset.exerciseBlock) !== activeBlock; });
  document.querySelectorAll('[data-block]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.block) === activeBlock)));
  const count = activeBlock ? exercises.filter(exercise => exercise.block === activeBlock).length : exercises.length;
  $('#exercise-count').textContent = `${count} ${count === 1 ? 'exercício' : 'exercícios'} ${activeBlock ? 'nesta etapa' : 'no roteiro'}`;
}

function toggleMenu(open) {
  $('#sidebar').classList.toggle('open', open);
  $('#sidebar').inert = matchMedia('(max-width: 700px)').matches && !open;
  $('#menu-button').setAttribute('aria-expanded', String(open));
  $('#menu-button').setAttribute('aria-label', open ? 'Fechar lista de exercícios' : 'Abrir lista de exercícios');
}

document.querySelectorAll('[data-block]').forEach(button => button.addEventListener('click', () => filterBlocks(button.dataset.block)));
document.querySelectorAll('#exercise-nav a').forEach(link => link.addEventListener('click', () => { filterBlocks(0); toggleMenu(false); }));
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const exercise = exercises.find(item => item.id === button.dataset.copy);
  try {
    await navigator.clipboard.writeText(exercise.starter);
    toast(`Base do exercício ${exercise.number} copiada. Cole em um programa novo no SWISH.`);
  } catch {
    toast('Selecione e copie o código de partida manualmente.');
  }
}));
document.querySelectorAll('[data-complete]').forEach(input => input.addEventListener('change', () => {
  if (input.checked) completed.add(input.dataset.complete); else completed.delete(input.dataset.complete);
  try { localStorage.setItem(progressKey, JSON.stringify([...completed])); }
  catch { $('#progress-description').textContent = 'O progresso fica disponível apenas nesta visita.'; }
  syncProgress();
}));
$('#print-exercises').hidden = false;
$('#print-exercises').addEventListener('click', () => window.print());
$('#practice-toolbar').hidden = false;
$('#menu-button').addEventListener('click', () => toggleMenu(!$('#sidebar').classList.contains('open')));
matchMedia('(max-width: 700px)').addEventListener('change', () => toggleMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const hadFocus = $('#sidebar').contains(document.activeElement);
    toggleMenu(false); if (hadFocus) $('#menu-button').focus();
  }
});
window.addEventListener('hashchange', () => {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.classList.contains('exercise-card')) { filterBlocks(0); target.scrollIntoView(); }
  updateActiveLink();
});
syncProgress(); filterBlocks(0); toggleMenu(false); updateActiveLink();
const initialTarget = document.getElementById(location.hash.slice(1));
if (initialTarget?.classList.contains('exercise-card')) requestAnimationFrame(() => initialTarget.scrollIntoView());
