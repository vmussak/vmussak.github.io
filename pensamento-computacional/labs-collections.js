(function () {
  'use strict';
  window.PCLabs = window.PCLabs || {};
  const esc = value => window.PCUtils.esc(value);
  const pyList = values => '[' + values.join(', ') + ']';
  const numericList = (text, limit = 12) => {
    if (!String(text).trim()) return [];
    const parts = String(text).split(',').map(part => part.trim());
    if (parts.length > limit) throw new Error(`Use no máximo ${limit} números para conseguir acompanhar o percurso.`);
    if (parts.some(part => !/^[+-]?\d+$/.test(part))) throw new Error('Separe os números inteiros por vírgulas. Exemplo: 3, -2, 8.');
    const values = parts.map(Number);
    if (values.some(value => !Number.isSafeInteger(value) || Math.abs(value) > 10000)) throw new Error('Use inteiros entre -10000 e 10000.');
    return values;
  };
  const integer = (value, label) => {
    if (!/^[+-]?\d+$/.test(String(value).trim()) || !Number.isSafeInteger(Number(value)) || Math.abs(Number(value)) > 10000) throw new Error(`${label}: use um inteiro entre -10000 e 10000.`);
    return Number(value);
  };
  const metric = (label, value) => `<div class="metric"><span class="metric-value">${esc(value)}</span><span class="metric-label">${esc(label)}</span></div>`;
  const listScene = (values, active, visited, caption, metrics = '') => `<div class="scene-caption">${esc(caption)}</div>${values.length ? window.PCUtils.cells(values, active, visited) : '<div class="flow-node">[] · lista vazia</div>'}${metrics ? `<div class="metrics">${metrics}</div>` : ''}<p class="scene-caption">${values.length ? `len(valores) = ${values.length} · índices de 0 a ${values.length - 1}` : 'len(valores) = 0 · não existe índice válido'}</p>`;

  window.PCLabs.listas = {
    title: 'Listas e arrays',
    eyebrow: '05 · GUARDAR E PERCORRER',
    description: 'Cada posição tem um endereço lógico: o índice. Visite os elementos, acumule resultados e descubra a diferença entre alterar e adicionar.',
    learn: ['Distinguir índice, valor e tamanho da lista.', 'Percorrer uma lista e fazer uma busca sequencial.', 'Entender substituição, append e índices inválidos.'],
    explanation: `<h3>Um nome, vários valores</h3><p>Nas aulas, chamamos essa organização de vetor ou array unidimensional. Aqui usamos a <strong>lista do Python (<code>list</code>)</strong>: uma coleção ordenada, mutável e que pode crescer. Ela não é um array de tamanho fixo.</p><p>Em <code>valores = [10, 25, 7]</code>, <code>valores[1]</code> vale <strong>25</strong>. O índice começa em zero; por isso o último índice positivo é <code>len(valores) - 1</code>. O índice e o conteúdo têm papéis diferentes.</p><h3>O percurso precisa avançar</h3><p><code>for i in range(len(valores))</code> produz os índices válidos. Depois, <code>valores[i]</code> lê o conteúdo da posição atual. Você também pode usar <code>for valor in valores</code> quando não precisa do índice.</p><h3>Somar não é contar</h3><p>Um <strong>acumulador</strong> recebe o valor: <code>soma += valor</code>. Um <strong>contador</strong> recebe uma unidade: <code>pares_positivos += 1</code>. No primeiro experimento, zero é par, mas não é positivo.</p><h3>Mesma posição, dados relacionados</h3><p>Na gincana das aulas, <code>nomes[i]</code> e <code>quantidades[i]</code> pertencem à mesma equipe. Mantenha as duas listas com o mesmo tamanho e a mesma ordem.</p>`,
    pitfalls: ['lista[len(lista)] fica fora dos limites. Para a última posição, use len(lista) - 1 ou -1.', 'lista[i] = novo substitui um valor; append(novo) aumenta o tamanho em uma posição.', 'append modifica a lista e retorna None. Não escreva lista = lista.append(novo).', 'Uma lista Python guarda referências a objetos. As caixas desta simulação representam posições lógicas, não endereços físicos contíguos.'],
    fields: [
      { name: 'valores', label: 'Valores da lista (separados por vírgula)', type: 'text', value: '0, 21, 20, 50, 50' },
      { name: 'modo', label: 'O que vamos fazer?', type: 'select', value: 'soma', options: [{ value: 'soma', label: 'Percorrer, somar e contar' }, { value: 'busca', label: 'Buscar a primeira ocorrência' }, { value: 'alterar', label: 'Substituir por índice' }, { value: 'append', label: 'Adicionar ao final' }] },
      { name: 'alvo', label: 'Valor para buscar ou adicionar', type: 'number', value: 50, min: -10000, max: 10000, step: 1, showWhen: { field: 'modo', values: ['busca', 'append'] } },
      { name: 'indice', label: 'Índice para substituir', type: 'number', value: 1, min: -10000, max: 10000, step: 1, showWhen: { field: 'modo', values: ['alterar'] } },
      { name: 'novo', label: 'Novo valor na substituição', type: 'number', value: 30, min: -10000, max: 10000, step: 1, showWhen: { field: 'modo', values: ['alterar'] } }
    ],
    presets: [
      { label: 'Gincana de livros', values: { valores: '0, 21, 20, 50, 50', modo: 'soma' } },
      { label: 'Encontrar o primeiro 50', values: { valores: '0, 21, 20, 50, 50', modo: 'busca', alvo: 50 } },
      { label: 'Busca sem resultado', values: { valores: '3, 6, 9', modo: 'busca', alvo: 5 } },
      { label: 'Erro de índice', values: { valores: '10, 20, 30', modo: 'alterar', indice: 3, novo: 99 } },
      { label: 'Lista vazia', values: { valores: '', modo: 'soma' } }
    ],
    build(values) {
      let list = numericList(values.valores);
      const mode = values.modo;
      const steps = [];
      let vars = {}, output = [], active = -1, visited = [], sum = 0, count = 0;
      const push = (line, note, caption = note) => steps.push({ line, note, vars: { ...vars }, output: [...output], scene: listScene(list, active, visited, caption, mode === 'soma' ? metric('acumulador · soma', sum) + metric('contador · pares positivos', count) : '') });
      push(null, 'Antes de começar: preveja o resultado. As posições começam em zero.');
      let code;
      if (mode === 'soma') {
        code = [`valores = ${pyList(list)}`, 'soma = 0', 'pares_positivos = 0', 'for i in range(len(valores)):', '    valor = valores[i]', '    soma += valor', '    if valor > 0 and valor % 2 == 0:', '        pares_positivos += 1', 'print(soma, pares_positivos)'];
        vars.valores = pyList(list); push(1, 'A lista é criada. O tamanho é a quantidade de elementos, não o último índice.');
        vars.soma = 0; push(2, 'O acumulador começa em zero: ainda não somamos nenhum elemento.');
        vars.pares_positivos = 0; push(3, 'O contador também começa em zero, mas conta ocorrências.');
        for (let i = 0; i < list.length; i++) {
          active = i; vars.i = i; push(4, `O for entrega o índice ${i}. A posição destacada será lida agora.`);
          vars.valor = list[i]; push(5, `valores[${i}] é ${list[i]}. i é o índice; valor é o conteúdo.`);
          const before = sum; sum += list[i]; vars.soma = sum; push(6, `O acumulador recebe o conteúdo: ${before} + (${list[i]}) = ${sum}.`);
          const matches = list[i] > 0 && list[i] % 2 === 0;
          push(7, `${list[i]} > 0 and ${list[i]} % 2 == 0 → ${matches ? 'True: vamos contar.' : 'False: não contamos este elemento.'}`);
          if (matches) { count++; vars.pares_positivos = count; push(8, `Uma ocorrência a mais. O contador agora vale ${count}.`); }
          visited.push(i);
        }
        active = -1; push(4, 'O range se esgotou. O corpo do for não executa novamente.');
        output.push(`${sum} ${count}`); push(9, `Saída: soma ${sum}, quantidade de pares positivos ${count}.`);
      } else if (mode === 'busca') {
        const target = integer(values.alvo, 'Valor da busca');
        code = [`valores = ${pyList(list)}`, `alvo = ${target}`, 'encontrado = False', 'for i in range(len(valores)):', '    if valores[i] == alvo:', '        print(i)', '        encontrado = True', '        break', 'if not encontrado:', '    print("Não encontrado")'];
        vars.valores = pyList(list); push(1, 'Criamos a lista na ordem original.');
        vars.alvo = target; push(2, `Vamos buscar ${target}, comparando uma posição por vez.`);
        vars.encontrado = 'False'; push(3, 'A variável booleana registra que ainda não encontramos o alvo.');
        let found = false;
        for (let i = 0; i < list.length; i++) {
          active = i; vars.i = i; push(4, `O índice atual é ${i}.`);
          push(5, `valores[${i}] == alvo → ${list[i]} == ${target} → ${list[i] === target ? 'True' : 'False'}.`);
          visited.push(i);
          if (list[i] === target) {
            output.push(String(i)); push(6, `Encontramos o alvo no índice ${i}. print mostra o índice, não o valor.`);
            found = true; vars.encontrado = 'True'; push(7, 'Registramos o sucesso da busca.');
            push(8, 'break encerra este for imediatamente. Posições seguintes não são visitadas.'); break;
          }
        }
        if (!found) { active = -1; push(4, 'O percurso terminou sem encontrar o alvo.'); }
        push(9, `not encontrado → ${found ? 'False. A mensagem de ausência é ignorada.' : 'True. Vamos informar a ausência.'}`);
        if (!found) { output.push('Não encontrado'); push(10, 'A saída avisa que nenhum elemento é igual ao alvo.'); }
      } else if (mode === 'alterar') {
        const index = integer(values.indice, 'Índice'), next = integer(values.novo, 'Novo valor');
        code = [`valores = ${pyList(list)}`, `valores[${index}] = ${next}`, 'print(valores)'];
        vars.valores = pyList(list); push(1, 'A lista foi criada. Substituir exige que a posição já exista.');
        const resolved = index < 0 ? list.length + index : index;
        if (resolved < 0 || resolved >= list.length) {
          output.push('IndexError: list assignment index out of range');
          push(2, `O índice ${index} não existe nesta lista. O Python gera IndexError e não chega ao print.`, 'Erro de índice · a lista permanece igual');
          push(null, 'Execução interrompida pelo erro. Teste um índice válido ou use append para adicionar.');
          return { code, steps };
        }
        active = resolved; const old = list[resolved]; list = [...list]; list[resolved] = next; vars.valores = pyList(list);
        push(2, `A posição ${index}${index < 0 ? ` (índice positivo ${resolved})` : ''} passa de ${old} para ${next}. O tamanho continua ${list.length}.`);
        output.push(pyList(list)); push(3, 'print mostra a lista após a substituição.');
      } else if (mode === 'append') {
        if (list.length >= 12) throw new Error('Para testar append, comece com no máximo 11 elementos.');
        const next = integer(values.alvo, 'Valor a adicionar');
        code = [`valores = ${pyList(list)}`, `valores.append(${next})`, 'print(valores)'];
        vars.valores = pyList(list); push(1, `A lista começa com ${list.length} elementos.`);
        list = [...list, next]; active = list.length - 1; vars.valores = pyList(list);
        push(2, `append adiciona ${next} ao final, no índice ${active}. O tamanho cresce para ${list.length}.`);
        output.push(pyList(list)); push(3, 'A lista foi modificada. append não precisa ser atribuído de volta à variável.');
      } else throw new Error('Escolha uma operação válida para a lista.');
      push(null, 'Execução concluída. Troque a operação ou os dados e compare o percurso.');
      return { code, steps };
    },
    quiz: [
      { question: 'Se valores = [3, 8, 5], o que é valores[1]?', options: ['3', '8', '1', 'Um erro'], answer: 1, explanation: 'O índice 1 corresponde à segunda posição. O conteúdo dessa posição é 8.' },
      { question: 'Qual operação mantém o tamanho da lista [4, 7]?', options: ['lista.append(9)', 'lista[0] = 9', 'lista.append(0)'], answer: 1, explanation: 'A atribuição por um índice existente substitui um elemento. append cria uma posição ao final.' },
      { question: 'Ao buscar 5 em [5, 2, 5] com break na primeira ocorrência, quais índices são visitados?', options: ['0, 1 e 2', '0 e 2', 'Somente 0'], answer: 2, explanation: 'A comparação já é verdadeira no índice 0. break encerra o laço antes de visitar os demais.' }
    ],
    challenge: 'Use [3, 6, 9, 12]. Substitua o índice 1 por 8 e depois simule a soma: preveja o total e a quantidade de pares positivos. Explique por que o tamanho continua 4.'
  };

  window.PCLabs.matrizes = {
    title: 'Matrizes',
    eyebrow: '06 · LINHAS E COLUNAS',
    description: 'Duas coordenadas localizam um elemento. Acompanhe dois laços trabalhando juntos e veja por que o laço interno recomeça a cada linha.',
    learn: ['Localizar um elemento com matriz[i][j].', 'Acompanhar um for dentro de outro for.', 'Percorrer todos os elementos ou selecionar a diagonal.'],
    explanation: `<h3>Uma lista de linhas</h3><p>Em Python, podemos representar uma matriz como uma <strong>lista de listas</strong>. Em <code>matriz = [[2, 4, 1], [3, 5, 2]]</code>, temos 2 linhas e 3 colunas. <code>matriz[1][0]</code> vale 3: primeiro selecionamos a linha 1; depois, a coluna 0 dessa linha.</p><h3>Um laço cuida das linhas; outro, das colunas</h3><p>O <code>for i</code> escolhe uma linha. Para cada <code>i</code>, um novo <code>for j</code> percorre todas as colunas dessa linha, começando em zero novamente. O laço externo só avança depois que o interno termina.</p><p>Uma matriz retangular de 3 linhas por 4 colunas tem <strong>3 × 4 = 12 elementos</strong>. Não são 3 + 4. Neste laboratório, os dados precisam ter o mesmo número de colunas em todas as linhas.</p><h3>A representação da memória é uma relação</h3><p>A lista externa guarda referências às listas que representam as linhas. Cada linha guarda referências a seus elementos. A grade é uma visualização lógica: não significa que os números estejam organizados como um retângulo físico na memória.</p><h3>Cuidado ao criar linhas</h3><p><code>[[0] * 3] * 2</code> repete a referência à <strong>mesma linha</strong>. Alterar uma célula pode parecer alterar duas linhas. Para linhas independentes, use <code>[[0] * 3 for _ in range(2)]</code>. Na diagonal principal, a condição é <code>i == j</code>.</p>`,
    pitfalls: ['matriz[i][j]: i seleciona a linha; j seleciona a coluna. Ambos começam em zero.', 'O j retorna a zero a cada nova linha porque um novo range é percorrido pelo laço interno.', 'len(matriz) conta linhas. len(matriz[i]) conta os elementos da linha i.', 'Duas linhas podem ter valores iguais sem serem a mesma lista. Evite multiplicar uma lista externa para criar linhas mutáveis independentes.'],
    fields: [
      { name: 'matriz', label: 'Matriz (vírgula entre colunas; ponto e vírgula entre linhas)', type: 'text', value: '2, 4, 1; 3, 5, 2' },
      { name: 'modo', label: 'Percurso', type: 'select', value: 'todos', options: [{ value: 'todos', label: 'Somar todos os elementos' }, { value: 'diagonal', label: 'Somar somente a diagonal principal' }] }
    ],
    presets: [
      { label: '2 linhas × 3 colunas', values: { matriz: '2, 4, 1; 3, 5, 2', modo: 'todos' } },
      { label: 'Diagonal 3 × 3', values: { matriz: '1, 2, 3; 4, 5, 6; 7, 8, 9', modo: 'diagonal' } },
      { label: 'Valores negativos', values: { matriz: '-2, 4; 3, -5', modo: 'todos' } },
      { label: 'Quatro linhas', values: { matriz: '1, 2; 3, 4; 5, 6; 7, 8', modo: 'todos' } }
    ],
    build(values) {
      if (!String(values.matriz).trim()) throw new Error('Informe ao menos uma linha com um número. Exemplo: 1, 2; 3, 4.');
      const rawRows = String(values.matriz).split(';');
      if (rawRows.length > 4) throw new Error('Use no máximo 4 linhas para visualizar cada posição.');
      const matrix = rawRows.map(row => numericList(row, 4));
      if (!matrix[0].length || matrix.some(row => row.length !== matrix[0].length)) throw new Error('Todas as linhas precisam ter a mesma quantidade de colunas (de 1 a 4). Exemplo: 1, 2; 3, 4.');
      const diagonal = values.modo === 'diagonal';
      if (!diagonal && values.modo !== 'todos') throw new Error('Escolha um percurso válido.');
      const code = [`matriz = [${matrix.map(pyList).join(', ')}]`, 'soma = 0', 'for i in range(len(matriz)):', '    for j in range(len(matriz[i])):'];
      if (diagonal) code.push('        if i == j:', '            soma += matriz[i][j]', 'print(soma)');
      else code.push('        soma += matriz[i][j]', 'print(soma)');
      let vars = {}, sum = 0, currentRow = -1, currentCol = -1, visited = [], selected = [];
      const steps = [], output = [];
      const scene = caption => {
        let grid = '<span class="scene-caption">i ↓ / j →</span>' + matrix[0].map((_, j) => `<span class="cell-index" style="text-align:center">j = ${j}</span>`).join('');
        matrix.forEach((row, i) => {
          grid += `<span class="pill${i === currentRow ? ' active' : ''}" style="align-self:center">i = ${i}</span>`;
          row.forEach((value, j) => {
            const id = `${i},${j}`, active = i === currentRow && j === currentCol;
            grid += `<div class="array-cell${active ? ' active' : visited.includes(id) ? ' done' : ''}" title="matriz[${i}][${j}] = ${value}"><span class="cell-index">[${i}][${j}]</span><span class="cell-value">${value}</span>${diagonal && i === j ? '<span class="cell-index">diagonal</span>' : ''}</div>`;
          });
        });
        return `<p class="scene-caption">${esc(caption)}</p><div class="matrix-grid" style="display:grid;grid-template-columns:auto repeat(${matrix[0].length},minmax(48px,1fr));gap:8px;max-width:540px;margin:20px auto">${grid}</div><div class="metrics">${metric('acumulador · soma', sum)}${metric('posições visitadas', visited.length)}${metric('posições somadas', selected.length)}</div><p class="scene-caption">${matrix.length} linhas × ${matrix[0].length} colunas = ${matrix.length * matrix[0].length} elementos · cada linha é uma lista independente</p>`;
      };
      const push = (line, note) => steps.push({ line, note, vars: { ...vars }, output: [...output], scene: scene(note) });
      push(null, 'Antes de executar: preveja em que ordem as células serão visitadas.');
      vars.matriz = `[${matrix.map(pyList).join(', ')}]`; push(1, 'Criamos a lista externa e as listas das linhas. Os índices começam em zero.');
      vars.soma = 0; push(2, 'O acumulador começa em zero, fora dos dois laços.');
      matrix.forEach((row, i) => {
        currentRow = i; currentCol = -1; vars.i = i; push(3, `O laço externo seleciona a linha ${i}.${i ? ' O valor anterior de j ainda existe; o laço interno vai substituí-lo.' : ''}`);
        row.forEach((value, j) => {
          currentCol = j; vars.j = j; push(4, `O laço interno seleciona j = ${j}${j === 0 ? ': um novo percurso da linha começa em zero' : ''}. A célula atual é matriz[${i}][${j}] = ${value}.`);
          visited.push(`${i},${j}`);
          if (diagonal) push(5, `i == j → ${i} == ${j} → ${i === j ? 'True. Esta posição está na diagonal.' : 'False. Visitamos a célula, mas não a somamos.'}`);
          if (!diagonal || i === j) {
            const before = sum; sum += value; selected.push(`${i},${j}`); vars.soma = sum;
            push(diagonal ? 6 : 5, `soma recebe ${before} + (${value}) = ${sum}. O elemento veio da linha ${i}, coluna ${j}.`);
          }
        });
        currentCol = -1; push(4, `As colunas da linha ${i} terminaram. O controle volta ao laço externo.`);
      });
      currentRow = -1; push(3, 'O laço externo também se esgotou: todas as linhas foram visitadas.');
      output.push(String(sum)); push(diagonal ? 7 : 6, `print está fora dos dois laços: mostra a soma final ${sum} uma única vez.`);
      push(null, 'Execução concluída. Compare a ordem do percurso e as posições que contribuíram para a soma.');
      return { code, steps };
    },
    quiz: [
      { question: 'Em matriz = [[2, 4, 1], [3, 5, 2]], quanto vale matriz[1][0]?', options: ['4', '3', '2'], answer: 1, explanation: 'A linha 1 é [3, 5, 2]. Nessa linha, a coluna 0 contém 3.' },
      { question: 'Quantas vezes o corpo do laço interno executa ao percorrer 3 linhas e 4 colunas?', options: ['7 vezes', '4 vezes', '12 vezes'], answer: 2, explanation: 'São 4 execuções para cada uma das 3 linhas: 3 × 4 = 12.' },
      { question: 'Por que [[0, 0]] * 3 exige cuidado?', options: ['Cria três referências à mesma lista interna.', 'Cria três números em vez de listas.', 'Python não permite multiplicar listas.'], answer: 0, explanation: 'As três posições externas apontam para a mesma linha. Uma alteração nessa linha aparece por todos esses caminhos.' }
    ],
    challenge: 'Simule a matriz 1, 2, 3; 4, 5, 6; 7, 8, 9. Antes de executar, escreva a ordem das nove coordenadas. Compare a soma de todos os elementos com a soma da diagonal. Depois explique como selecionar i + j == 2 para somar a diagonal secundária.'
  };
})();
