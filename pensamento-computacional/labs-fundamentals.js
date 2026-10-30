/* Laboratórios de fundamentos. As execuções abaixo são simulações guiadas de Python. */
(function () {
  'use strict';
  window.PCLabs = window.PCLabs || {};
  const esc = value => window.PCUtils.esc(value);
  const pyString = value => JSON.stringify(String(value)).replace(/\u2028/g, '\\u2028');
  // Python's numeric constructors accept Unicode decimal digits and their own
  // whitespace set; JavaScript trim()/Number() do not use the same grammar.
  const numericText = value => String(value)
    .replace(/^[\x09-\x0d\x20\x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09-\x0d\x20\x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/g, '')
    .replace(/\p{Decimal_Number}/gu, digit => {
      const point = digit.codePointAt(0);
      let first = point;
      while (first > 0 && /\p{Decimal_Number}/u.test(String.fromCodePoint(first - 1))) first--;
      return String((point - first) % 10);
    });
  const numberText = value => {
    if (Number.isNaN(value)) return 'nan';
    if (value === Infinity) return 'inf';
    if (value === -Infinity) return '-inf';
    if (Object.is(value, -0)) return '-0.0';
    if (value !== 0 && (Math.abs(value) >= 1e16 || Math.abs(value) < 1e-4)) {
      return value.toExponential().replace(/e([+-])(\d+)$/, (_, sign, digits) => `e${sign}${digits.padStart(2, '0')}`);
    }
    return Number.isInteger(value) ? `${value}.0` : String(value);
  };
  const whole = (value, label) => {
    if (String(value).trim() === '' || !Number.isInteger(Number(value)) || Math.abs(Number(value)) > 1000) {
      throw new Error(`${label}: informe um inteiro de -1000 a 1000.`);
    }
    return Number(value);
  };
  const metric = (label, value) => `<div class="metric"><span class="metric-label">${esc(label)}</span><strong class="metric-value">${esc(value)}</strong></div>`;
  const caption = text => `<p class="scene-caption">${esc(text)}</p>`;
  const conversionScene = (text, target, converted, error, doubled) => `<div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap"><div class="flow-node"><span class="pill">str · entrada</span><p><strong>${esc(pyString(text))}</strong></p></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-node ${converted !== undefined || error ? 'active' : ''}"><code>${esc(target)}(texto)</code></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-node"><span class="pill">${error ? 'ValueError' : converted === undefined ? 'aguardando' : esc(target)}</span><p><strong>${error ? 'Conversão interrompida' : converted === undefined ? '?' : esc(converted)}</strong></p></div></div>${doubled === undefined ? '' : `<div class="metrics" style="margin-top:24px">${metric('valor + valor', doubled)}</div>`}${caption(error ? 'O programa para nesta linha. Os prints seguintes não são executados.' : 'As aspas indicam texto. A conversão cria um resultado; texto continua sendo uma str.')}`;

  window.PCLabs.tipos = {
    title: 'Tipos e conversões',
    eyebrow: '01 · FUNDAMENTOS',
    description: 'O mesmo 7 pode ser texto ou número. Descubra como o tipo muda o que o programa consegue fazer.',
    learn: ['Entender por que input() entrega texto.', 'Converter com int(), float(), str() e bool().', 'Distinguir soma, concatenação e erro de conversão.'],
    explanation: `<h3>O valor tem um tipo</h3><p><code>"7"</code> é uma <code>str</code>; <code>7</code> é um <code>int</code>; <code>7.0</code> é um <code>float</code>. <code>True</code> e <code>False</code> são <code>bool</code>. O tipo participa da regra da operação: <code>7 + 7</code> produz <code>14</code>, mas <code>"7" + "7"</code> produz <code>"77"</code>.</p><h3>Entrada → conversão → processamento → saída</h3><p><code>input()</code> sempre retorna uma string, mesmo que você digite somente números. <code>int(texto)</code> tenta interpretar um inteiro; <code>float(texto)</code> tenta interpretar um número com parte decimal. No código Python, use ponto: <code>"7.5"</code>. A vírgula de <code>"7,5"</code> não é aceita por <code>float()</code>.</p><p><code>int("7.5")</code> gera <code>ValueError</code>: o texto não representa um inteiro. Isso é diferente de <code>int(7.5)</code>, que recebe um número e trunca em direção a zero, produzindo <code>7</code>. Converter não altera a variável original: é preciso guardar o resultado.</p><p><code>bool(texto)</code> pergunta se a string está vazia: <code>bool("")</code> é <code>False</code>; <code>bool("False")</code> e <code>bool("0")</code> são <code>True</code>. Não é um interpretador de respostas “sim/não”. <code>str()</code> representa valores como texto; aqui, a entrada já é texto.</p>`,
    pitfalls: ['Não use int("3.5"): converta com float() se o dado aceita decimais.', 'Uma string com um espaço ainda não está vazia: bool(" ") é True.', 'O operador + exige tipos compatíveis: "Idade: " + 18 falha; use uma f-string ou str(18).', 'bool é um subtipo de int em Python: True + True resulta em 2.'],
    fields: [
      { name: 'entrada', label: 'O que será digitado no input()', type: 'text', value: '7' },
      { name: 'destino', label: 'Conversão', type: 'select', value: 'int', options: [{ value: 'int', label: 'int · número inteiro' }, { value: 'float', label: 'float · número decimal' }, { value: 'str', label: 'str · texto' }, { value: 'bool', label: 'bool · vazio ou não vazio' }] },
      { name: 'operacao', label: 'Depois da conversão', type: 'select', value: 'duplicar', options: [{ value: 'duplicar', label: 'Calcular valor + valor' }, { value: 'tipo', label: 'Mostrar somente valor e tipo' }] }
    ],
    presets: [
      { label: '7 + 7', values: { entrada: '7', destino: 'int', operacao: 'duplicar' } },
      { label: '"7" + "7"', values: { entrada: '7', destino: 'str', operacao: 'duplicar' } },
      { label: 'Uma conversão inválida', values: { entrada: '7.5', destino: 'int', operacao: 'tipo' } },
      { label: '"False" não é vazio', values: { entrada: 'False', destino: 'bool', operacao: 'tipo' } },
      { label: 'Texto vazio', values: { entrada: '', destino: 'bool', operacao: 'tipo' } }
    ],
    build(values) {
      const text = String(values.entrada ?? '');
      if (text.length > 60) throw new Error('Use uma entrada com até 60 caracteres para acompanhar a visualização.');
      const target = String(values.destino);
      if (!['int', 'float', 'str', 'bool'].includes(target)) throw new Error('Escolha uma conversão disponível.');
      const duplicate = values.operacao === 'duplicar';
      const code = ['texto = input("Digite um valor: ")', `valor = ${target}(texto)`, 'print(valor)', 'print(type(valor).__name__)'];
      if (duplicate) code.push('print(valor + valor)');
      const steps = [{ line: null, note: 'Antes de começar, preveja o valor, o tipo e o resultado do +. A entrada ainda não foi lida.', vars: {}, output: [], scene: conversionScene(text, target) }];
      const vars = { texto: pyString(text) };
      steps.push({ line: 1, note: `input() retornou ${pyString(text)}. O tipo de texto é str, inclusive quando a entrada parece um número.`, vars: { ...vars }, output: [], scene: conversionScene(text, target) });
      let result, display, printed, error = false;
      const stripped = numericText(text);
      if (target === 'str') { result = text; display = pyString(text); printed = text; }
      if (target === 'bool') { result = text.length > 0; display = result ? 'True' : 'False'; printed = display; }
      if (target === 'int') {
        if (!/^[+-]?\d(?:_?\d)*$/.test(stripped)) error = true;
        else { result = BigInt(stripped.replaceAll('_', '')); display = result.toString(); printed = display; }
      }
      if (target === 'float') {
        const numeric = /^[+-]?(?:(?:\d(?:_?\d)*(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|inf(?:inity)?|nan)$/i;
        if (!numeric.test(stripped)) error = true;
        else {
          const clean = stripped.replaceAll('_', '').toLowerCase();
          result = /nan/.test(clean) ? NaN : /inf/.test(clean) ? (clean.startsWith('-') ? -Infinity : Infinity) : Number(clean);
          display = numberText(result); printed = display;
        }
      }
      if (error) {
        const message = target === 'int' ? `ValueError: invalid literal for int() with base 10: ${pyString(text)}` : `ValueError: could not convert string to float: ${pyString(text)}`;
        steps.push({ line: 2, note: `${target}() não conseguiu interpretar esta entrada. A atribuição a valor não aconteceu.`, vars: { ...vars }, output: [message], scene: conversionScene(text, target, undefined, true) });
        steps.push({ line: null, note: 'Execução interrompida por ValueError. Altere a entrada ou a conversão e tente novamente.', vars: { ...vars }, output: [message], scene: conversionScene(text, target, undefined, true) });
        return { code, steps };
      }
      vars.valor = display;
      steps.push({ line: 2, note: `A conversão retornou ${display}, do tipo ${target}. Guardamos esse resultado em valor; texto mantém o conteúdo original.`, vars: { ...vars }, output: [], scene: conversionScene(text, target, display) });
      const output = [printed];
      steps.push({ line: 3, note: 'print(valor) escreve o conteúdo no console. Strings são impressas sem as aspas delimitadoras.', vars: { ...vars }, output: [...output], scene: conversionScene(text, target, display) });
      output.push(target);
      steps.push({ line: 4, note: `type(valor).__name__ revela o nome do tipo: ${target}.`, vars: { ...vars }, output: [...output], scene: conversionScene(text, target, display) });
      let doubled;
      if (duplicate) {
        doubled = target === 'str' ? text + text : target === 'int' ? (result + result).toString() : target === 'bool' ? String(Number(result) * 2) : numberText(result + result);
        output.push(doubled);
        steps.push({ line: 5, note: target === 'str' ? '+ concatena duas strings: junta os conteúdos, sem somar números.' : target === 'bool' ? 'Na soma, True participa como 1 e False como 0. O resultado desta operação é int.' : '+ soma dois valores numéricos. A variável valor não muda porque não há uma nova atribuição.', vars: { ...vars }, output: [...output], scene: conversionScene(text, target, display, false, target === 'str' ? pyString(doubled) : doubled) });
      }
      steps.push({ line: null, note: 'Fim. Compare com sua previsão. Agora troque só a conversão e observe o que muda.', vars: { ...vars }, output: [...output], scene: conversionScene(text, target, display, false, doubled === undefined ? undefined : target === 'str' ? pyString(doubled) : doubled) });
      return { code, steps };
    },
    quiz: [
      { question: 'O aluno digita 12 em input(). Qual é o tipo retornado?', options: ['int', 'str', 'float'], answer: 1, explanation: 'input() retorna uma string. Para fazer contas com esse dado, converta quando necessário.' },
      { question: 'Qual é o resultado de "3" + "4"?', options: ['7', '"34"', 'ValueError'], answer: 1, explanation: 'Os dois operandos são strings, então + concatena os textos.' },
      { question: 'Qual é o resultado de bool("False")?', options: ['False', 'True', 'TypeError'], answer: 1, explanation: 'A string contém caracteres. bool() avalia se ela está vazia, e não o significado da palavra.' }
    ],
    challenge: 'Preveja e compare as entradas "0", "", " " e "7.5" nas quatro conversões. Explique por que int("7.5") falha, mas float("7.5") funciona.'
  };

  const memoryScene = (names, objects, focus, message) => `<div class="memory-grid" style="display:grid;grid-template-columns:minmax(100px,1fr) minmax(130px,1.4fr);gap:20px"><div><span class="pill">Nomes</span>${Object.entries(names).map(([name, id]) => `<div class="memory-name" style="margin-top:12px;padding:12px"><code>${esc(name)}</code> <span class="memory-arrow" aria-label="referencia">→</span> <strong>${esc(id)}</strong></div>`).join('') || '<p>Nenhum nome criado.</p>'}</div><div><span class="pill">Objetos</span>${Object.entries(objects).map(([id, obj]) => `<div class="memory-object ${id === focus ? 'active' : ''}" style="margin-top:12px;padding:16px;border:1px solid currentColor;border-radius:12px"><span class="pill">${esc(id)} · ${esc(obj.type)}</span><p><strong>${esc(obj.value)}</strong></p></div>`).join('') || '<p>Aguardando a primeira atribuição.</p>'}</div></div>${caption(message)}${caption('Modelo conceitual: A e B são identificadores ilustrativos, não endereços reais nem uma medida de bytes. A implementação de Python gerencia a alocação.')}`;
  window.PCLabs.memoria = {
    title: 'Variáveis e memória',
    eyebrow: '02 · POR DENTRO DO PROGRAMA',
    description: 'Siga as referências e descubra a diferença entre mudar um nome e modificar uma lista compartilhada.',
    learn: ['Visualizar nomes apontando para objetos.', 'Distinguir reatribuição e mutação.', 'Comparar b = a com b = a.copy().'],
    explanation: `<h3>Um nome referencia um objeto</h3><p>Em Python, <code>a = 10</code> associa o nome <code>a</code> a um objeto inteiro. A atribuição <code>b = a</code> associa outro nome ao mesmo objeto; não significa “copie tudo”. O tipo pertence ao objeto, e um nome pode passar a referenciar um objeto de outro tipo.</p><h3>Reatribuir não é modificar</h3><p>Inteiros e strings são imutáveis. <code>a = 99</code> muda a referência de <code>a</code>; <code>b</code> continua associado ao objeto anterior. Listas são mutáveis: <code>b[0] = 99</code> modifica o objeto. Se <code>a</code> e <code>b</code> referenciam essa mesma lista, ambos passam a observar a mudança.</p><h3>Cópia e alocação</h3><p><code>b = a.copy()</code> cria outra lista. Neste exemplo, que contém apenas inteiros, alterar uma posição de <code>b</code> não altera <code>a</code>. É uma cópia rasa: se os elementos fossem outras listas, essas listas internas continuariam compartilhadas.</p><p>O interpretador reserva memória para representar os objetos e administra seu ciclo de vida. Um objeto que deixa de ser alcançável pode ter sua memória recuperada. Detalhes de armazenamento, reutilização de inteiros e momento de coleta variam conforme a implementação. Este desenho representa relações, sem simular endereços físicos ou tamanhos reais.</p>`,
    pitfalls: ['b = a não cria uma segunda lista.', 'b[0] = x modifica a lista; b = [x] associa b a outra lista.', 'Uma cópia rasa não duplica recursivamente as listas internas.', 'del a remove uma associação de nome; o objeto pode continuar acessível por b.'],
    fields: [
      { name: 'modo', label: 'Experimento', type: 'select', value: 'alias', options: [{ value: 'imutavel', label: 'Inteiro · reatribuição' }, { value: 'alias', label: 'Lista · b = a' }, { value: 'copia', label: 'Lista · b = a.copy()' }] },
      { name: 'inicial', label: 'Valor inicial', type: 'number', value: 10, min: -1000, max: 1000, step: 1 },
      { name: 'novo', label: 'Novo valor', type: 'number', value: 99, min: -1000, max: 1000, step: 1 }
    ],
    presets: [
      { label: 'Dois nomes, uma lista', values: { modo: 'alias', inicial: 10, novo: 99 } },
      { label: 'Duas listas independentes', values: { modo: 'copia', inicial: 10, novo: 99 } },
      { label: 'Inteiros são imutáveis', values: { modo: 'imutavel', inicial: 10, novo: 99 } }
    ],
    build(values) {
      const start = whole(values.inicial, 'Valor inicial'), next = whole(values.novo, 'Novo valor'), mode = values.modo;
      if (!['imutavel', 'alias', 'copia'].includes(mode)) throw new Error('Escolha um experimento disponível.');
      const scalar = mode === 'imutavel', copy = mode === 'copia';
      const original = `[${start}, ${start + 1}]`, changed = `[${next}, ${start + 1}]`;
      const code = scalar ? [`a = ${start}`, 'b = a', `a = ${next}`, 'print(a, b)'] : [`a = ${original}`, copy ? 'b = a.copy()' : 'b = a', `b[0] = ${next}`, 'print(a)', 'print(b)'];
      const names = {}, objects = {}, steps = [];
      const add = (line, note, output = [], focus = null) => steps.push({ line, note, vars: Object.fromEntries(Object.entries(names).map(([name, id]) => [name, `${id} → ${objects[id].value}`])), output: [...output], scene: memoryScene(names, objects, focus, note) });
      add(null, 'Primeiro, preveja: alterar um dos nomes vai mudar o que o outro observa?');
      names.a = 'A'; objects.A = { type: scalar ? 'int' : 'list', value: scalar ? String(start) : original };
      add(1, scalar ? 'a passa a referenciar um inteiro. Objetos int não podem ser modificados por dentro.' : 'a passa a referenciar uma lista com duas posições. Uma lista é mutável.', [], 'A');
      if (copy) { names.b = 'B'; objects.B = { type: 'list', value: original }; }
      else names.b = 'A';
      add(2, copy ? 'copy() cria uma nova lista B. Os dois objetos começam com os mesmos valores, mas são listas diferentes.' : 'b = a copia a referência. Os dois nomes apontam para o mesmo objeto A.', [], copy ? 'B' : 'A');
      if (scalar) {
        if (next !== start) { names.a = 'B'; objects.B = { type: 'int', value: String(next) }; }
        add(3, next === start ? 'Atribuir o mesmo valor não muda os resultados observáveis. Este modelo não promete detalhes de reutilização de objetos.' : 'Reatribuir a muda sua referência. O inteiro A não foi modificado; b continua apontando para ele.', [], names.a);
        add(4, 'O print consulta os objetos referenciados por a e b neste momento.', [`${next} ${start}`]);
        add(null, 'Fim. Reatribuir um nome não reatribui automaticamente os outros nomes.', [`${next} ${start}`]);
      } else {
        objects[names.b].value = changed;
        add(3, copy ? 'b[0] modifica apenas B. A lista A mantém seu valor original.' : 'b[0] modifica A. Como a e b observam a mesma lista, ambos veem o novo valor.', [], names.b);
        const out = [objects[names.a].value];
        add(4, 'print(a) consulta a lista alcançada pelo nome a.', out);
        out.push(objects[names.b].value);
        add(5, copy ? 'print(b) revela a alteração feita na cópia.' : 'print(b) mostra o mesmo objeto visto por a.', out);
        add(null, copy ? 'Fim. Neste exemplo de lista de inteiros, a cópia permite substituir posições de forma independente.' : 'Fim. Uma lista, dois nomes: a mudança ocorreu no objeto compartilhado.', out);
      }
      return { code, steps };
    },
    quiz: [
      { question: 'Depois de a = [1, 2]; b = a; b[0] = 9, qual é a?', options: ['[1, 2]', '[9, 2]', '[9]'], answer: 1, explanation: 'a e b referenciam a mesma lista; b[0] modifica esse objeto compartilhado.' },
      { question: 'Depois de a = 10; b = a; a = 20, quanto vale b?', options: ['10', '20', 'None'], answer: 0, explanation: 'A reatribuição de a não muda a referência guardada por b. Inteiros são imutáveis.' },
      { question: 'Em uma lista de inteiros, o que b = a.copy() cria?', options: ['Um novo nome para a mesma lista', 'Uma nova lista', 'Uma cópia profunda de qualquer estrutura'], answer: 1, explanation: 'copy() cria uma lista diferente, mas é uma cópia rasa: objetos mutáveis internos poderiam continuar compartilhados.' }
    ],
    challenge: 'Execute os três experimentos com os mesmos valores. Desenhe as setas antes da linha 3 e explique quando muda uma referência e quando muda o conteúdo de um objeto.'
  };

  const functionScene = (globalValues, localValues, status, returned) => `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:20px"><div class="flow-node"><span class="pill">Quadro global</span>${Object.entries(globalValues).map(([key, value]) => `<p><code>${esc(key)}</code> <strong>${esc(value)}</strong></p>`).join('') || '<p>Aguardando execução.</p>'}</div><div class="flow-node ${localValues ? 'active' : ''}"><span class="pill">Pilha de chamadas · somar</span>${localValues ? Object.entries(localValues).map(([key, value]) => `<p><code>${esc(key)}</code> <strong>${esc(value)}</strong></p>`).join('') : `<p>${esc(status)}</p>`}</div></div>${returned !== undefined ? `<div class="metrics" style="margin-top:20px">${metric('Valor devolvido ao chamador', returned)}</div>` : ''}${caption(localValues ? 'somar está em execução. Os nomes a, b e total pertencem a este quadro local.' : status)}`;
  window.PCLabs.funcoes = {
    title: 'Funções',
    eyebrow: '08 · ORGANIZAR E REUTILIZAR',
    description: 'Entre em uma chamada, acompanhe os parâmetros e veja como um resultado volta ao programa.',
    learn: ['Relacionar argumentos e parâmetros.', 'Visualizar chamada, escopo local e retorno.', 'Entender por que print() e return não são equivalentes.'],
    explanation: `<h3>Definir é preparar; chamar é executar</h3><p><code>def somar(a, b):</code> define uma função. O corpo indentado só executa quando há uma chamada, como <code>somar(4, 6)</code>. <code>a</code> e <code>b</code> são parâmetros; <code>4</code> e <code>6</code> são os argumentos dessa chamada.</p><h3>Cada chamada cria um contexto</h3><p>A chamada associa os parâmetros aos argumentos e cria um quadro de execução local. A pilha de chamadas registra onde o programa precisa continuar quando a função terminar. Uma função pode ter um nome local igual a um nome global sem alterar a associação global. No exemplo, <code>total</code> dentro de <code>somar</code> é local; o <code>total</code> global permanece <code>100</code>.</p><h3>return devolve; print mostra</h3><p><code>return total</code> encerra a função e devolve o valor para quem chamou. Assim, <code>resultado = somar(x, y)</code> pode guardar o número. <code>print(total)</code> apenas escreve no console. Uma função que chega ao final sem <code>return</code> explícito devolve <code>None</code>.</p><p>Uma boa função tem uma responsabilidade clara, recebe o que precisa por parâmetros e devolve o que calculou. Isso permite reutilizar a lógica sem copiar o mesmo bloco de código.</p>`,
    pitfalls: ['Definir a função não executa seu corpo.', 'Os argumentos são associados aos parâmetros na chamada; os nomes não precisam ser iguais.', 'Código depois de um return executado não é alcançado naquela chamada.', 'Uma função que só imprime não devolve o número mostrado: seu retorno implícito é None.'],
    fields: [
      { name: 'x', label: 'Primeiro argumento · x', type: 'number', value: 4, min: -1000, max: 1000, step: 1 },
      { name: 'y', label: 'Segundo argumento · y', type: 'number', value: 6, min: -1000, max: 1000, step: 1 },
      { name: 'modo', label: 'Corpo da função', type: 'select', value: 'return', options: [{ value: 'return', label: 'return total · devolver o valor' }, { value: 'print', label: 'print(total) · apenas mostrar' }] }
    ],
    presets: [
      { label: 'Devolver 4 + 6', values: { x: 4, y: 6, modo: 'return' } },
      { label: 'Mostrar não é devolver', values: { x: 4, y: 6, modo: 'print' } },
      { label: 'Argumentos negativos', values: { x: -8, y: 3, modo: 'return' } }
    ],
    build(values) {
      const x = whole(values.x, 'Primeiro argumento'), y = whole(values.y, 'Segundo argumento'), mode = values.modo;
      if (!['return', 'print'].includes(mode)) throw new Error('Escolha return ou print.');
      const sum = x + y, returns = mode === 'return', result = returns ? String(sum) : 'None';
      const code = [`x = ${x}`, `y = ${y}`, 'total = 100', 'def somar(a, b):', '    total = a + b', returns ? '    return total' : '    print(total)', 'resultado = somar(x, y)', 'print(resultado)', 'print(total)'];
      const globals = {}, output = [], steps = [];
      const add = (line, note, locals = null, status = 'A função ainda não foi chamada.', returned) => steps.push({ line, note, vars: { ...Object.fromEntries(Object.entries(globals).map(([key, value]) => [`global.${key}`, String(value)])), ...(locals ? Object.fromEntries(Object.entries(locals).map(([key, value]) => [`local.${key}`, String(value)])) : {}) }, output: [...output], scene: functionScene(globals, locals, status, returned) });
      add(null, 'Preveja as duas últimas saídas. O total local e o total global terão o mesmo valor?');
      globals.x = String(x); add(1, 'O primeiro argumento fica guardado em x, no quadro global.');
      globals.y = String(y); add(2, 'O segundo argumento fica guardado em y, no quadro global.');
      globals.total = '100'; add(3, 'Criamos total no quadro global. Esse nome continuará valendo 100.');
      globals.somar = '<função>'; add(4, 'def associa o nome somar a uma função. O corpo é preparado, mas ainda não foi executado.');
      const locals = { a: String(x), b: String(y) };
      add(7, `A chamada somar(x, y) associa a = ${x} e b = ${y}. O programa aguarda a função terminar antes de atribuir resultado.`, locals, 'Chamada em execução.');
      locals.total = String(sum); add(5, `A soma cria total local = ${sum}. O total global continua sendo 100.`, locals, 'Chamada em execução.');
      if (returns) add(6, `return encerra a chamada e devolve ${sum}. O quadro local deixa de estar ativo; o programa vai continuar na atribuição da linha 7.`, null, 'A chamada terminou; retornando ao chamador.', result);
      else {
        output.push(String(sum)); add(6, `print(total) escreve ${sum}, mas não devolve esse número ao chamador.`, locals, 'Chamada em execução.');
        add(null, 'O corpo chegou ao final sem return explícito. Python devolve None; o quadro local deixa de estar ativo.', null, 'A chamada terminou.', result);
      }
      globals.resultado = result; add(7, `A chamada terminou. resultado recebe ${result}; o quadro local não está mais ativo.`, null, 'Retorno concluído; execução no quadro global.', result);
      output.push(result); add(8, `print(resultado) mostra ${result}.${returns ? '' : ' O número anterior veio do print de dentro da função, não de um retorno numérico.'}`, null, 'Execução no quadro global.', result);
      output.push('100'); add(9, 'O total global permanece 100. A atribuição dentro da função criou um nome local.', null, 'Execução no quadro global.', result);
      add(null, 'Fim. Troque return por print e compare o console e a variável resultado.', null, 'Nenhuma chamada de somar está ativa.', result);
      return { code, steps };
    },
    quiz: [
      { question: 'Em def somar(a, b), o que são a e b?', options: ['Os argumentos já calculados', 'Parâmetros que recebem os argumentos da chamada', 'Variáveis obrigatoriamente globais'], answer: 1, explanation: 'A definição dá nomes aos parâmetros. A chamada fornece os argumentos e os associa a esses nomes.' },
      { question: 'Uma função chega ao final sem return. O que ela devolve?', options: ['O último valor impresso', '0', 'None'], answer: 2, explanation: 'O retorno implícito de uma função é None. Imprimir um valor não o transforma em retorno.' },
      { question: 'total = 100 é global. Dentro de somar, total = a + b. O que acontece com o total global?', options: ['Muda para a + b', 'Continua 100', 'É apagado'], answer: 1, explanation: 'Neste exemplo, a atribuição dentro da função cria um nome local. Ela não reatribui o nome do quadro global.' }
    ],
    challenge: 'Com x = -3 e y = 8, preveja a saída usando return e usando print. Depois descreva o caminho de 5: argumentos → parâmetros → cálculo local → retorno → resultado.'
  };
}());
