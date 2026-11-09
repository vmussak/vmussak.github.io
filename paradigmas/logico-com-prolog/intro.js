import { fruitPuzzle } from './lessons.js';
import { runProlog } from './engine.js';

export function firstChapterIntro() {
  return `<aside class="swish-start" aria-labelledby="swish-title">
    <div class="swish-start-heading"><span class="swish-logo" aria-hidden="true">?-</span><div><span class="intro-kicker">ANTES DE COMEÇAR · NOSSO AMBIENTE DE PROLOG</span><h2 id="swish-title">Vamos usar o SWISH.</h2><p>É nele que vamos escrever e executar Prolog na disciplina. Abra em outra aba e mantenha este material ao lado.</p></div><a class="button" href="https://swish.swi-prolog.org/" target="_blank" rel="noopener noreferrer">Abrir o SWISH <span aria-hidden="true">↗</span><span class="sr-only"> em nova aba</span></a></div>
    <ol class="swish-steps"><li><span>01</span><div><strong>Programa à esquerda</strong><p>Crie um programa e cole os fatos e as regras no editor.</p></div></li><li><span>02</span><div><strong>Pergunta embaixo, à direita</strong><p>Digite a consulta no campo próprio, separada do programa.</p></div></li><li><span>03</span><div><strong>Execute com Run!</strong><p>Observe as respostas. Você pode editar e executar novamente.</p></div></li></ol>
    <p class="swish-footnote">Os laboratórios desta trilha ajudam a visualizar a busca; o SWISH é o ambiente de prática da disciplina. <a href="https://swish.swi-prolog.org/help/help.html" target="_blank" rel="noopener noreferrer">Ajuda oficial do SWISH ↗<span class="sr-only"> em nova aba</span></a></p>
  </aside>
  <section class="fruit-intro" aria-labelledby="fruit-title">
    <div class="intro-kicker">VOCÊ JÁ RACIOCINOU ASSIM</div><h2 id="fruit-title">Do desafio do feed à lógica do programa.</h2><p class="fruit-lead">Sabe aqueles problemas de lógica que aparecem no Instagram? Você cruza algumas pistas, descarta possibilidades e encontra uma resposta. Vamos começar por um desses.</p>
    <div class="fruit-story-grid"><div class="fruit-clues"><span class="fruit-label">AS PISTAS</span><ol><li>João gosta de <strong>exatamente duas frutas</strong>: morango e uva.</li><li>Maria gosta de <strong>uma das frutas de que João gosta</strong>.</li><li>Maria <strong>não gosta de uva</strong>.</li></ol><p class="fruit-question">De qual fruta Maria gosta?</p><p class="fruit-invitation">Pense na resposta antes de avançar. Depois, acompanhe como cada pista reduz as possibilidades.</p></div>
    <div class="fruit-deduction"><div class="fruit-map" role="img" aria-label="João gosta de morango e de uva. Precisamos descobrir qual dessas frutas Maria gosta."><div class="fruit-person">João</div><div class="fruit-branches" aria-hidden="true"><span>gosta</span><span>gosta</span></div><div class="fruit-candidates"><div class="fruit-candidate" id="candidate-morango"><span class="fruit-emoji" aria-hidden="true">🍓</span><strong>morango</strong><small id="morango-state">Uma fruta de João</small></div><div class="fruit-candidate" id="candidate-uva"><span class="fruit-emoji" aria-hidden="true">🍇</span><strong>uva</strong><small id="uva-state">Uma fruta de João</small></div></div></div>
      <div class="fruit-reasoning" role="status" aria-live="polite" aria-atomic="true"><span id="fruit-step-label">1 DE 4 · O QUE SABEMOS</span><p id="fruit-step-text">A primeira pista nos dá duas frutas de João: morango e uva. São as únicas candidatas neste enigma.</p></div><div class="fruit-step-controls"><button id="fruit-prev" class="button ghost small" disabled aria-label="Voltar uma etapa do enigma">←</button><button id="fruit-next" class="button small">Cruzar as pistas →</button><button id="fruit-reset" class="fruit-reset">Recomeçar</button></div>
    </div></div>
    <div class="fruit-bridge"><h3>Esse raciocínio é a porta de entrada para Prolog.</h3><p>Você partiu de informações conhecidas, relacionou condições e eliminou uma opção. Na programação lógica, registramos o que sabemos como <strong>fatos</strong>, descrevemos relações como <strong>regras</strong> e fazemos uma <strong>consulta</strong>. Prolog procura valores que satisfaçam as condições.</p></div>
    <details class="fruit-code-details"><summary>Ver o enigma em Prolog e experimentar no SWISH</summary><p class="fruit-code-intro">Não precisa dominar os símbolos agora. Primeiro, reconheça as pistas no código; os próximos capítulos explicam unificação e regras com mais calma.</p><div class="fruit-code-grid"><div><div class="fruit-code-heading"><span>PROGRAMA · EDITOR À ESQUERDA</span><button id="fruit-copy-program" class="tool-button">Copiar programa</button></div><pre><code id="fruit-program"></code></pre></div><div><div class="fruit-code-heading"><span>CONSULTA · CAMPO À DIREITA</span><button id="fruit-copy-query" class="tool-button">Copiar consulta</button></div><pre><code id="fruit-query"></code></pre><div class="fruit-prolog-result"><span>AO EXECUTAR, ESPERAMOS</span><code id="fruit-answer">Fruta = morango.</code></div><p class="fruit-prompt-note">O símbolo <code>?-</code> indica uma pergunta no terminal. No SWISH, coloque só a consulta no campo próprio, sem copiar o prompt para o programa.</p></div></div><p class="fruit-operator-note"><code>gosta(joao, Fruta)</code> encontra uma candidata; só depois <code>Fruta \\= uva</code> testa se ela é diferente de <code>uva</code>. É um teste de diferença, não a negação por falha que estudaremos mais adiante.</p><p class="fruit-scope-note">Este modelo vale para as duas frutas do enigma. Acrescentar uma terceira fruta de João muda a pista “exatamente duas” e pode produzir outra resposta; não estamos descrevendo todos os gostos de Maria no mundo real.</p><p class="fruit-copy-status" id="fruit-copy-status" role="status"></p></details>
    <p class="fruit-transition">Agora que a ideia faz sentido, vamos construir os primeiros fatos e consultas, um passo de cada vez.</p>
  </section>`;
}

export function bindFirstChapterIntro() {
  const get = id => document.getElementById(id);
  if (!get('fruit-next')) return;
  get('fruit-program').textContent = fruitPuzzle.program;
  get('fruit-query').textContent = fruitPuzzle.query;
  const proof = runProlog(fruitPuzzle.program, fruitPuzzle.query);
  const fruit = proof.solutions?.[0]?.bindings.Fruta;
  const verified = !proof.error && !proof.truncated && proof.solutions?.length === 1 && fruit === 'morango';
  get('fruit-answer').textContent = verified ? `Fruta = ${fruit}.` : 'Execute a consulta no SWISH para conferir.';
  const steps = [
    ['O QUE SABEMOS', 'A primeira pista nos dá duas frutas de João: morango e uva. São as únicas candidatas neste enigma.', 'Cruzar as pistas →'],
    ['RELACIONAR AS INFORMAÇÕES', 'Maria gosta de uma fruta de que João gosta. Então a resposta precisa estar entre morango e uva.', 'Aplicar a última pista →'],
    ['ELIMINAR UMA POSSIBILIDADE', 'Maria não gosta de uva. Essa candidata é descartada; morango continua compatível com as pistas.', 'Conferir a conclusão →'],
    ['A CONCLUSÃO', verified ? 'Maria gosta de morango. Entre as duas candidatas, é a única que satisfaz todas as pistas. O programa Prolog abaixo encontra a mesma resposta: Fruta = morango.' : 'Entre as duas candidatas, morango é a única que satisfaz todas as pistas. Confira a consulta no SWISH.', 'Enigma resolvido ✓']
  ];
  let step = 0;
  function update() {
    get('fruit-step-label').textContent = `${step + 1} DE 4 · ${steps[step][0]}`;
    get('fruit-step-text').textContent = steps[step][1];
    get('fruit-next').textContent = steps[step][2];
    get('fruit-next').disabled = step === 3;
    get('fruit-prev').disabled = step === 0;
    get('candidate-morango').className = `fruit-candidate ${step >= 1 ? 'possible' : ''} ${step === 3 ? 'confirmed' : ''}`;
    get('candidate-uva').className = `fruit-candidate ${step === 1 ? 'possible' : ''} ${step >= 2 ? 'excluded' : ''}`;
    get('morango-state').textContent = step === 3 ? '✓ Resposta de Maria' : step >= 1 ? 'Candidata para Maria' : 'Uma fruta de João';
    get('uva-state').textContent = step >= 2 ? '✕ Descartada pela pista' : step === 1 ? 'Candidata para Maria' : 'Uma fruta de João';
    document.querySelector('.fruit-map').setAttribute('aria-label', step >= 2 ? `João gosta de morango e uva. Uva foi descartada para Maria.${step === 3 ? ' A resposta é morango.' : ''}` : step === 1 ? 'Morango e uva são candidatas para Maria, pois ambas são frutas de que João gosta.' : 'João gosta de morango e de uva. Precisamos descobrir qual dessas frutas Maria gosta.');
  }
  get('fruit-next').addEventListener('click', () => { step = Math.min(3, step + 1); update(); });
  get('fruit-prev').addEventListener('click', () => { step = Math.max(0, step - 1); update(); });
  get('fruit-reset').addEventListener('click', () => { step = 0; update(); });
  async function copy(text, kind) {
    const status = get('fruit-copy-status');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = `${kind} copiado. Cole no campo correspondente do SWISH.`;
    } catch {
      status.textContent = 'A cópia automática não está disponível. Selecione o código acima e copie manualmente.';
    }
  }
  get('fruit-copy-program').addEventListener('click', () => copy(fruitPuzzle.program, 'Programa'));
  get('fruit-copy-query').addEventListener('click', () => copy(fruitPuzzle.query, 'Consulta'));
}
