(() => {
  'use strict';
  const controls = document.querySelector('#library-controls');
  const search = document.querySelector('#resource-search');
  const resources = [...document.querySelectorAll('.resource')];
  const groups = [...document.querySelectorAll('.subject-group')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#search-count');
  let discipline = 'all';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const searchable = new Map(resources.map(link => [link, normalize(`${link.textContent} ${link.dataset.keywords || ''}`)]));

  function update() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    resources.forEach(link => {
      const matchesDiscipline = discipline === 'all' || link.closest('.subject-group').dataset.subject === discipline;
      const matchesSearch = terms.every(term => searchable.get(link).includes(term));
      link.hidden = !(matchesDiscipline && matchesSearch);
      if (!link.hidden) visible++;
    });
    groups.forEach(group => {
      const shown = [...group.querySelectorAll('.resource')].filter(link => !link.hidden).length;
      group.hidden = shown === 0;
      group.querySelector('.group-count').textContent = `${shown} ${shown === 1 ? 'material' : 'materiais'}`;
    });
    count.textContent = `${visible} ${visible === 1 ? 'material encontrado' : 'materiais encontrados'}`;
    document.querySelector('#empty-state').hidden = visible !== 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === discipline)));
  }

  controls.hidden = false;
  search.addEventListener('input', update);
  filters.forEach(button => button.addEventListener('click', () => { discipline = button.dataset.filter; update(); }));
  document.querySelector('#clear-filters').addEventListener('click', () => { discipline = 'all'; search.value = ''; update(); search.focus(); });
  document.querySelector('#search-form').addEventListener('submit', event => event.preventDefault());
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey && !event.target.matches('input, textarea, select, [contenteditable="true"]')) {
      event.preventDefault(); search.focus();
    }
    if (event.key === 'Escape' && event.target === search) { search.value = ''; update(); }
  });
  update();
})();
