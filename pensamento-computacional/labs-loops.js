(function () {
  'use strict';

  window.PCLabs = window.PCLabs || {};
  const U = () => window.PCUtils;
  const integer = (values, name, label, min, max) => {
    const raw = String(values[name] ?? '').trim();
    const value = Number(raw);
    if (!raw || !Number.isInteger(value) || value < min || value > max) {
      throw new Error(`${label}: informe um inteiro entre ${min} e ${max}.`);
    }
    return value;
  };
  const metrics = (entries) => `<div class="metrics">${entries.map(([label, value]) => `<div class="metric"><span class="metric-value">${U().esc(value)}</span><span class="metric-label">${U().esc(label)}</span></div>`).join('')}</div>`;

  window.PCLabs['for-range'] = {
    title: 'For e range',
    eyebrow: 'REPETIÇÃO COM PERCURSO',
    description: 'Descubra quais números o range produz e acompanhe o for usando cada um deles, na ordem.',
    learn: ['Ler range(n) e range(início, fim, passo).', 'Entender por que o limite final fica de fora.', 'Distinguir variável de percurso e acumulador.'],
    explanation: `<p>O <code>for</code> percorre um iterável. Em cada repetição, um próximo valor é atribuído à variável de percurso e o bloco indentado é executado. Quando os valores acabam, o programa continua depois do laço.</p><p><code>range(5)</code> produz <code>0, 1, 2, 3, 4</code>: começa em zero, avança de um em um e <strong>não inclui 5</strong>. A forma completa é <code>range(início, fim, passo)</code>. Com passo positivo, os valores ficam abaixo de <code>fim</code>; com passo negativo, ficam acima dele.</p><p><code>range(6, 0, -2)</code> produz <code>6, 4, 2</code>. Já <code>range(0, 6, -1)</code> é vazio: o passo aponta na direção oposta. Passo zero gera <code>ValueError</code>.</p><p>O <code>range</code> é uma representação compacta de uma sequência: não cria uma lista com todos os números. As caixas desta simulação apenas tornam seus valores visíveis. No exemplo, <code>i</code> recebe o valor da vez, enquanto <code>total += i</code> acumula os valores já processados.</p>`,
    pitfalls: ['O argumento final é um limite exclusivo, não o último número que será usado.', 'range(5) começa em 0. Para contar de 1 a 5, use range(1, 6).', 'O for não precisa de i += 1: ele próprio atribui o próximo valor a i.', 'Depois de um for não vazio, i mantém seu último valor. Se o laço não executou, ele não foi criado neste exemplo.'],
    fields: [
      { name: 'mode', label: 'Forma do range', type: 'select', value: 'simple', options: [{ value: 'simple', label: 'range(n)' }, { value: 'full', label: 'range(início, fim, passo)' }] },
      { name: 'n', label: 'n · forma simples', type: 'number', value: 5, min: -30, max: 30, step: 1, showWhen: { field: 'mode', values: ['simple'] } },
      { name: 'start', label: 'Início · forma completa', type: 'number', value: 0, min: -30, max: 30, step: 1, showWhen: { field: 'mode', values: ['full'] } },
      { name: 'stop', label: 'Fim exclusivo · forma completa', type: 'number', value: 10, min: -30, max: 30, step: 1, showWhen: { field: 'mode', values: ['full'] } },
      { name: 'step', label: 'Passo · forma completa', type: 'number', value: 2, min: -30, max: 30, step: 1, showWhen: { field: 'mode', values: ['full'] } }
    ],
    presets: [
      { label: 'De 0 a 4', values: { mode: 'simple', n: '5' } },
      { label: 'De 2 em 2', values: { mode: 'full', start: '0', stop: '10', step: '2' } },
      { label: 'Contagem regressiva', values: { mode: 'full', start: '6', stop: '0', step: '-2' } },
      { label: 'Range vazio', values: { mode: 'simple', n: '0' } },
      { label: 'Direção incompatível', values: { mode: 'full', start: '0', stop: '6', step: '-1' } }
    ],
    build(values) {
      if (!['simple', 'full'].includes(values.mode)) throw new Error('Escolha uma forma válida do range.');
      const simple = values.mode === 'simple';
      const start = simple ? 0 : integer(values, 'start', 'Início', -30, 30);
      const stop = simple ? integer(values, 'n', 'n', -30, 30) : integer(values, 'stop', 'Fim', -30, 30);
      const step = simple ? 1 : integer(values, 'step', 'Passo', -30, 30);
      if (step === 0) throw new Error('ValueError: o passo do range não pode ser zero. Use um inteiro positivo ou negativo.');
      const sequence = [];
      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        sequence.push(i);
        if (sequence.length > 30) throw new Error('Use um range com até 30 valores para acompanhar cada passo com clareza.');
      }
      const expression = simple ? `range(${stop})` : `range(${start}, ${stop}, ${step})`;
      const code = ['total = 0', `for i in ${expression}:`, '    total += i', '    print(i, total)', 'print("Total:", total)'];
      const steps = [];
      let total = 0;
      let current;
      const output = [];
      const scene = (active, visited, phase) => `<p class="scene-caption">Valores que ${U().esc(expression)} produzirá · ilustração, não uma lista alocada</p>${sequence.length ? U().cells(sequence, active, visited) : '<div class="flow-node">Sequência vazia · nenhuma repetição</div>'}${metrics([['início', start], ['fim · excluído', stop], ['passo', step], ['acumulador total', steps.length ? total : '—']])}<div class="flow-node active">${U().esc(phase)}</div>`;
      const add = (line, note, active = -1, visited = [], phase = '') => {
        const vars = {};
        if (steps.length > 0) vars.total = String(total);
        if (current !== undefined) vars.i = String(current);
        steps.push({ line, note, vars, output: [...output], scene: scene(active, visited, phase) });
      };
      add(null, 'Antes de executar: preveja quantas repetições acontecerão e qual será o total.', -1, [], 'Pronto para começar');
      add(1, 'Inicializamos o acumulador total com zero. Ainda não usamos nenhum valor do range.', -1, [], 'total recebe 0');
      sequence.forEach((value, index) => {
        current = value;
        const visited = Array.from({ length: index }, (_, i) => i);
        add(2, `O for obtém o próximo valor do range e atribui ${value} a i. Esta é a repetição ${index + 1} de ${sequence.length}.`, index, visited, `i recebe ${value}`);
        const before = total;
        total += value;
        add(3, `total += i equivale a total = total + i: ${before} + (${value}) = ${total}. O acumulador guarda o resultado parcial.`, index, visited, `${before} + (${value}) → ${total}`);
        output.push(`${value} ${total}`);
        add(4, `print(i, total) mostra o valor atual (${value}) e o total parcial (${total}). Depois, o controle volta ao for.`, index, [...visited, index], 'Corpo executado · buscar próximo valor');
      });
      const all = sequence.map((_, i) => i);
      add(2, sequence.length ? 'Não há próximo valor no range. O for termina; seu corpo não é executado novamente.' : 'O range não produz valores. O for pula o bloco inteiro e total continua igual a 0.', -1, all, 'Percurso esgotado');
      output.push(`Total: ${total}`);
      add(5, `Fora da indentação do for, este print acontece uma única vez. Total final: ${total}.`, -1, all, `Total final: ${total}`);
      add(null, sequence.length ? `Programa concluído. Foram ${sequence.length} repetições. i mantém ${current}; total mantém ${total}.` : 'Programa concluído sem repetições. total vale 0 e i não foi definido neste programa.', -1, all, 'Programa concluído');
      return { code, steps };
    },
    quiz: [
      { question: 'Quais valores são produzidos por range(4)?', options: ['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4'], answer: 1, explanation: 'A forma range(n) começa em 0 e exclui n. Assim, range(4) tem quatro valores: 0, 1, 2 e 3.' },
      { question: 'Qual é a sequência de range(5, 0, -2)?', options: ['5, 3, 1', '5, 3, 1, 0', '0, 2, 4'], answer: 0, explanation: 'Começamos em 5 e subtraímos 2: 5, 3 e 1. O próximo seria -1, que já ultrapassou o limite exclusivo 0.' },
      { question: 'Após total = 0 e um for que faz total += i para i em range(4), quanto vale total?', options: ['4', '10', '6'], answer: 2, explanation: 'O acumulador soma os valores 0 + 1 + 2 + 3, resultando em 6. Contar repetições e somar valores são operações diferentes.' }
    ],
    challenge: 'Configure um range que produza 2, 4, 6, 8. Antes de avançar, preveja o total e explique por que o limite final pode ser 9 ou 10.'
  };

  window.PCLabs['while'] = {
    title: 'While',
    eyebrow: 'REPETIÇÃO COM CONDIÇÃO',
    description: 'Veja a condição ser testada a cada volta. Descubra o que faz um laço continuar, terminar ou ficar infinito.',
    learn: ['Rastrear teste, corpo e atualização do contador.', 'Perceber que o while pode executar zero vezes.', 'Identificar laço infinito e saída com break.'],
    explanation: `<p>O <code>while</code> repete um bloco <strong>enquanto sua condição for verdadeira</strong>. O teste acontece antes de cada repetição. Se ele já for falso no primeiro teste, o corpo não executa nenhuma vez.</p><p>Pense em três partes: <strong>inicialização → teste → atualização</strong>. Neste exemplo, <code>contador</code> muda a cada volta. Quando ele deixa de ser menor que o limite, a condição produz <code>False</code> e o programa segue depois do laço.</p><p><code>soma += contador</code> acumula valores. Já <code>contador += passo</code> faz o percurso avançar. Esquecer a atualização pode deixar a condição sempre verdadeira: é um laço infinito. A opção “Sem atualização” pausa a demonstração após quatro voltas, mas o Python real continuaria repetindo.</p><p><code>break</code> encerra imediatamente o laço mais interno, sem esperar que sua condição fique falsa. Fora do laço, o restante do programa continua. Use o modo com <code>break</code> para comparar os dois tipos de saída.</p>`,
    pitfalls: ['A condição do while é testada antes do corpo. Não existe garantia de uma primeira repetição.', 'Trocar < por <= muda quais valores entram no laço.', 'Sem atualização, um contador pode manter a condição verdadeira para sempre.', 'break encerra o laço; continue pula o restante da volta atual e inicia a próxima. Em um while, continue também pode pular a atualização.'],
    fields: [
      { name: 'mode', label: 'Modo do laço', type: 'select', value: 'normal', options: [{ value: 'normal', label: 'Com atualização' }, { value: 'stuck', label: 'Sem atualização · investigar erro' }, { value: 'break', label: 'Saída antecipada com break' }] },
      { name: 'start', label: 'Contador inicial', type: 'number', value: 0, min: -5, max: 12, step: 1 },
      { name: 'limit', label: 'Limite exclusivo', type: 'number', value: 5, min: -5, max: 12, step: 1 },
      { name: 'increment', label: 'Passo da atualização', type: 'number', value: 1, min: 1, max: 5, step: 1, showWhen: { field: 'mode', values: ['normal', 'break'] } },
      { name: 'breakAt', label: 'Parar quando contador == · modo break', type: 'number', value: 3, min: -5, max: 12, step: 1, showWhen: { field: 'mode', values: ['break'] } }
    ],
    presets: [
      { label: 'Cinco repetições', values: { mode: 'normal', start: '0', limit: '5', increment: '1' } },
      { label: 'Nenhuma repetição', values: { mode: 'normal', start: '5', limit: '5', increment: '1' } },
      { label: 'E se não atualizar?', values: { mode: 'stuck', start: '0', limit: '5', increment: '1' } },
      { label: 'Parar no 3', values: { mode: 'break', start: '0', limit: '8', increment: '1', breakAt: '3' } }
    ],
    build(values) {
      if (!['normal', 'stuck', 'break'].includes(values.mode)) throw new Error('Escolha um modo válido do while.');
      const start = integer(values, 'start', 'Contador inicial', -5, 12);
      const limit = integer(values, 'limit', 'Limite', -5, 12);
      const stuck = values.mode === 'stuck';
      const hasBreak = values.mode === 'break';
      const increment = stuck ? 1 : integer(values, 'increment', 'Passo', 1, 5);
      const breakAt = hasBreak ? integer(values, 'breakAt', 'Valor de parada', -5, 12) : 0;
      const code = [`contador = ${start}`, 'soma = 0', `while contador < ${limit}:`];
      let breakTestLine = null;
      let breakLine = null;
      if (hasBreak) {
        code.push(`    if contador == ${breakAt}:`, '        break');
        breakTestLine = 4;
        breakLine = 5;
      }
      code.push('    soma += contador');
      const sumLine = code.length;
      code.push('    print(contador, soma)');
      const printLine = code.length;
      let incrementLine = null;
      if (!stuck) {
        code.push(`    contador += ${increment}`);
        incrementLine = code.length;
      }
      code.push('print("Soma:", soma)');
      const finalLine = code.length;
      const steps = [];
      const output = [];
      let counter = start;
      let sum = 0;
      let initialized = 0;
      let rounds = 0;
      let stoppedByBreak = false;
      const scene = (phase, result) => `${metrics([['contador', initialized ? counter : '—'], ['limite exclusivo', limit], ['soma', initialized > 1 ? sum : '—'], ['voltas concluídas', rounds]])}<div class="flow-node ${phase === 'test' ? 'active' : ''}"><code>contador &lt; ${limit}</code>${result === undefined ? '' : ` <strong>→ ${result ? 'True' : 'False'}</strong>`}</div><div class="flow-arrow">↓ ${result === false ? 'sair do laço' : 'se True, executar o corpo'}</div><div class="flow-node ${phase === 'body' ? 'active' : ''}">Acumular e mostrar</div><div class="flow-arrow">↓</div><div class="flow-node ${phase === 'update' ? 'active' : ''}">${stuck ? 'Atualização ausente: contador não muda' : `Atualizar contador em +${increment}`}</div><p class="scene-caption">${stuck ? 'O teste se repete com o mesmo contador. A pausa de segurança é apenas da simulação.' : 'Após a atualização, o controle volta ao teste antes de executar outra volta.'}</p>`;
      const add = (line, note, phase, result) => {
        const vars = {};
        if (initialized > 0) vars.contador = String(counter);
        if (initialized > 1) vars.soma = String(sum);
        steps.push({ line, note, vars, output: [...output], scene: scene(phase, result) });
      };
      add(null, 'Antes de começar: compare o contador inicial com o limite. Você espera zero, algumas ou infinitas repetições?', 'ready');
      initialized = 1;
      add(1, `contador recebe ${start}. Esse é o valor usado no primeiro teste.`, 'ready');
      initialized = 2;
      add(2, 'soma recebe 0. Esse acumulador guarda a soma dos valores já processados.', 'ready');
      while (counter < limit) {
        add(3, `${counter} < ${limit} é True. O while permite entrar no corpo da repetição ${rounds + 1}.`, 'test', true);
        if (hasBreak) {
          const match = counter === breakAt;
          add(breakTestLine, `${counter} == ${breakAt} é ${match ? 'True: entraremos no bloco do if.' : 'False: o break é ignorado nesta volta.'}`, 'body', true);
          if (match) {
            add(breakLine, 'break encerra este while imediatamente. A soma, o print e a atualização desta volta não executam. Não haverá novo teste do while.', 'exit', true);
            stoppedByBreak = true;
            break;
          }
        }
        const before = sum;
        sum += counter;
        add(sumLine, `soma += contador: ${before} + (${counter}) = ${sum}. Somamos o valor, não apenas 1.`, 'body', true);
        output.push(`${counter} ${sum}`);
        add(printLine, `Exibimos contador e soma parcial: ${counter} ${sum}.`, 'body', true);
        rounds += 1;
        if (!stuck) {
          const previous = counter;
          counter += increment;
          add(incrementLine, `contador += ${increment}: ${previous} passa a ${counter}. Agora voltamos ao teste do while.`, 'update');
        } else if (rounds === 4) {
          add(null, `Simulação pausada após 4 voltas: contador continua ${counter} e ${counter} < ${limit} continua True. Este programa Python não terminaria sozinho; o print depois do while não é alcançado. Acrescente a atualização para corrigir.`, 'update', true);
          return { code, steps };
        }
      }
      if (!stoppedByBreak) add(3, `${counter} < ${limit} é False. ${rounds === 0 ? 'O corpo não executou nenhuma vez.' : 'O corpo não executa novamente.'} O programa continua fora do while.`, 'test', false);
      output.push(`Soma: ${sum}`);
      add(finalLine, `Este print está fora do while e é executado uma única vez. Soma final: ${sum}.`, 'exit', stoppedByBreak ? undefined : false);
      add(null, `Programa concluído. ${rounds} ${rounds === 1 ? 'volta completa' : 'voltas completas'}; saída ${stoppedByBreak ? 'antecipada por break, antes do processamento da volta atual' : 'porque a condição ficou False'}.`, 'exit');
      return { code, steps };
    },
    quiz: [
      { question: 'Se contador = 5, quantas vezes while contador < 5 executa o corpo?', options: ['Uma vez', 'Cinco vezes', 'Nenhuma vez'], answer: 2, explanation: 'O teste acontece antes do corpo. Como 5 < 5 é False logo no início, o bloco é pulado.' },
      { question: 'Qual linha faz o contador avançar em um while?', options: ['soma += contador', 'contador += 1', 'print(contador)'], answer: 1, explanation: 'contador += 1 atualiza a variável usada na condição. Somar ao acumulador ou imprimir não altera o contador.' },
      { question: 'O que acontece quando break é executado dentro do while?', options: ['O programa inteiro é fechado.', 'O laço termina e a execução continua depois dele.', 'A condição do while se torna False automaticamente.'], answer: 1, explanation: 'break sai imediatamente do laço mais interno. Ele não muda o valor da condição e não encerra todo o programa.' }
    ],
    challenge: 'Comece em 0, use limite 6 e passo 2. Preveja os valores exibidos e o valor final do contador. Depois teste início 6 e limite 6: por que a soma fica em zero?'
  };
}());
