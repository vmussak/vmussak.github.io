// As referências usam a página física do arquivo PDF (incluindo capa e sumário).
// Exemplos adaptados para a execução didática local; os PDFs permanecem como leitura integral.
export const lessons = [
  {
    id: 'primeiros-fatos', number: '01', title: 'Um mundo feito de fatos', shortTitle: 'Fatos e consultas',
    kicker: 'COMECE PEQUENO',
    description: 'Três fatos, uma pergunta. Descubra como descrever o que sabemos e pedir ao Prolog que encontre uma resposta.',
    concepts: [
      { title: 'Descreva o problema', text: 'No paradigma lógico, você declara relações e condições. Uma consulta pergunta se algo pode ser provado a partir dessas declarações. Prolog organiza a busca por uma prova; a ordem das cláusulas também influencia essa busca.' },
      { title: 'Leia um fato', text: 'gosta(ana, musica). significa “Ana gosta de música”. gosta é o nome do predicado, ana e musica são argumentos. gosta/2 indica aridade 2: dois argumentos. A ordem importa: gostar não é necessariamente uma relação simétrica.', code: 'gosta(ana, musica).' },
      { title: 'Pergunte com uma variável', text: 'Átomos como ana começam com minúscula. Uma variável como Oque começa com maiúscula e representa um termo a descobrir. A consulta gosta(ana, Oque). pede valores de Oque que tornem a relação verdadeira.', code: 'gosta(ana, Oque).' },
      { title: 'true, false e o conhecimento disponível', text: 'Uma pergunta sem variáveis responde true quando há uma prova. false significa que não foi encontrada prova nesta base, não que a afirmação foi refutada no mundo real. O ponto final encerra cada fato e cada consulta. O símbolo ?- é o prompt, não parte do programa.' }
    ],
    program: `% Nossa primeira base de conhecimento\ngosta(ana, musica).\ngosta(ana, livros).\ngosta(bruno, livros).`,
    query: 'gosta(ana, Oque).',
    presets: [
      { label: 'Do que Ana gosta?', query: 'gosta(ana, Oque).' },
      { label: 'Existe esse fato?', query: 'gosta(ana, musica).' },
      { label: 'Quem gosta de livros?', query: 'gosta(Quem, livros).' },
      { label: 'E a relação inversa?', query: 'gosta(musica, ana).' }
    ],
    challenge: { question: 'O que a consulta gosta(Quem, livros). procura?', options: ['Todas as coisas de que livros gosta.', 'Pessoas para as quais a base prova que gostam de livros.', 'Somente a primeira linha do programa.'], answer: 1, explanation: 'Quem ocupa a primeira posição. As soluções são Quem = ana e Quem = bruno, na ordem dos fatos. A posição dos argumentos define a leitura da relação.' },
    source: 'Tutorial, PDF pp. 1–4 (slides 2–23); Apostila, PDF pp. 5–6 e 11–12.'
  },
  {
    id: 'termos-unificacao', number: '02', title: 'Encaixando termos e variáveis', shortTitle: 'Termos e unificação',
    kicker: 'ENTENDA A ESTRUTURA',
    description: 'Veja como duas estruturas se encaixam e como cada variável recebe um valor durante uma tentativa de prova.',
    concepts: [
      { title: 'Os blocos da linguagem', text: 'Um termo pode ser um átomo (azul), um número (7), uma variável (Cor) ou uma estrutura composta, como ponto(2, 3). ponto é o functor; ponto/2 tem dois argumentos. Átomos com espaços ou inicial maiúscula usam aspas simples.', code: "objeto('Meu ponto', ponto(2, 3))." },
      { title: 'Unificar é tornar compatível', text: 'O operador = tenta unificar dois termos, encontrando substituições para suas variáveis. Não é uma atribuição destrutiva. ponto(X, 3) = ponto(2, Y) produz X = 2 e Y = 3 porque os nomes, aridades e posições combinam.', code: 'ponto(X, 3) = ponto(2, Y).' },
      { title: 'A mesma variável, o mesmo termo', text: 'Dentro de uma cláusula ou consulta, todas as ocorrências de X compartilham o mesmo valor. par(X, X) exige dois argumentos iguais. Em tentativas alternativas, as ligações da tentativa anterior são desfeitas. Variáveis de cláusulas diferentes são independentes.' },
      { title: 'Quando o nome não interessa', text: 'Cada ocorrência de _ é uma variável anônima nova. ponto(_, _) aceita duas coordenadas quaisquer; ponto(X, X) exige coordenadas iguais. _Nome é uma variável normal e compartilha valor se for repetida. \\= testa se os termos não podem ser unificados neste momento; não guarda uma restrição para o futuro.', code: 'local(Quem, ponto(_, 3)).' }
    ],
    program: `% O segundo argumento tem estrutura interna\nlocal(ana, ponto(2, 3)).\nlocal(bruno, ponto(4, 3)).\nlocal(clara, ponto(2, 5)).\npar(a, a).\npar(a, b).`,
    query: 'local(Quem, ponto(X, 3)).',
    presets: [
      { label: 'Pontos na linha 3', query: 'local(Quem, ponto(X, 3)).' },
      { label: 'Unificar estruturas', query: 'ponto(X, 3) = ponto(2, Y).' },
      { label: 'Variável repetida', query: 'par(X, X).' },
      { label: 'Ignorar coordenada', query: 'local(Quem, ponto(_, 3)).' },
      { label: 'Estruturas incompatíveis', query: 'ponto(2, 3) = ponto(2, 5).' }
    ],
    challenge: { question: 'Qual é o resultado de par(X, X). nesta base?', options: ['X = a e X = b.', 'X = a, usando somente par(a, a).', 'Qualquer par serve, porque X é uma variável.'], answer: 1, explanation: 'A mesma variável aparece nas duas posições. par(a, b) exigiria que X fosse a e b ao mesmo tempo, o que não pode ser unificado.' },
    source: 'Tutorial, PDF pp. 4 e 6 (slides 19, 31–32); Apostila, PDF pp. 6, 8 e 17. Estruturas compostas são um complemento didático à sintaxe dos materiais.'
  },
  {
    id: 'regras-conectivos', number: '03', title: 'Dos fatos às conclusões', shortTitle: 'Regras e conectivos',
    kicker: 'CONECTE CONDIÇÕES',
    description: 'Transforme pequenas observações em regras. Combine condições com “e” e alternativas com “ou”.',
    concepts: [
      { title: 'Cabeça, “se”, corpo', text: 'A cabeça é a conclusão que queremos provar; o corpo contém as condições. Leia gosta_de_passear(X) :- gosta(X, parque). como “X gosta de passear se X gosta de parque”. Uma regra não fabrica provas: suas condições também precisam ser satisfeitas.', code: 'gosta_de_passear(X) :- gosta(X, parque).' },
      { title: 'Vírgula significa “e”', text: 'companhia(X) exige que X goste de parque e de livros. A mesma variável liga as duas condições. O mecanismo tenta as metas do corpo da esquerda para a direita, propagando as ligações já encontradas.', code: 'companhia(X) :- gosta(X, parque), gosta(X, livros).' },
      { title: 'Alternativas significam “ou”', text: 'Duas cláusulas para lazer/1 oferecem duas maneiras de provar a mesma relação. Também podemos escrever uma disjunção com ;. Uma pessoa que satisfaça os dois caminhos pode aparecer duas vezes: são duas provas, não uma lista automaticamente sem repetições.', code: 'lazer(X) :- gosta(X, parque).\nlazer(X) :- gosta(X, musica).' },
      { title: 'Troque uma peça e observe', text: 'Antes de executar companhia(Quem)., preveja a resposta. Depois acrescente gosta(bruno, livros). e execute novamente. Você mudou a base; a regra continua a mesma e passa a provar mais uma solução.' }
    ],
    program: `gosta(ana, parque).\ngosta(ana, livros).\ngosta(bruno, parque).\ngosta(clara, musica).\n\ncompanhia(X) :-\n    gosta(X, parque),\n    gosta(X, livros).\n\nlazer(X) :- gosta(X, parque).\nlazer(X) :- gosta(X, musica).`,
    query: 'companhia(Quem).',
    presets: [
      { label: 'As duas condições', query: 'companhia(Quem).' },
      { label: 'Uma alternativa basta', query: 'lazer(Quem).' },
      { label: '“Ou” na consulta', query: 'gosta(Quem, livros); gosta(Quem, musica).' },
      { label: '“E” na consulta', query: 'gosta(Quem, parque), gosta(Quem, livros).' }
    ],
    challenge: { question: 'Por que Bruno ainda não é uma solução de companhia(Quem).?', options: ['Porque as regras só funcionam para Ana.', 'Porque ; exige as duas condições.', 'Porque falta uma prova de gosta(bruno, livros).'], answer: 2, explanation: 'O corpo usa uma conjunção. Encontrar gosta(bruno, parque). resolve apenas uma das duas metas; a outra precisa de sua própria prova.' },
    source: 'Tutorial, PDF pp. 3 e 5–7 (slides 15–17, 27–36); Apostila, PDF pp. 12–14.'
  },
  {
    id: 'familia-grafos', number: '04', title: 'Uma família vira um grafo', shortTitle: 'Relações e grafos',
    kicker: 'VEJA AS CONEXÕES',
    description: 'Cada pessoa é um nó. Cada fato liga duas pessoas. Uma regra encontra caminhos e revela relações que não foram escritas como fatos.',
    concepts: [
      { title: 'Nós e setas', text: 'Em progenitor(A, B), a seta vai de A para B: A é progenitor de B. O grafo representa os fatos binários da base. Uma relação unária, como mulher(sara), descreve uma propriedade de um nó. Nem todo predicado é uma aresta entre duas pessoas.' },
      { title: 'Uma relação derivada percorre dois arcos', text: 'avos(X, Z) encontra alguém Y que liga X a Z em duas etapas. Y precisa ser a mesma pessoa nas duas metas. A relação derivada não precisa existir como um fato explícito: ela é demonstrada pelo caminho.', code: 'avos(X, Z) :- progenitor(X, Y), progenitor(Y, Z).' },
      { title: 'Relação inversa', text: 'filho(Y, X) inverte os argumentos de progenitor(X, Y). Não altera as setas armazenadas; oferece outra forma de consultar o mesmo conhecimento. avos/2 aqui significa avós em geral, sem restringir gênero.', code: 'filho(Y, X) :- progenitor(X, Y).' },
      { title: 'Modelar também é dizer o que não vale', text: 'Duas pessoas com um progenitor em comum poderiam ser a mesma pessoa. A condição X \\= Y, colocada depois de gerar X e Y, exclui esse caso na regra irmaos/2. Aqui “irmãos” inclui quem compartilha pelo menos um progenitor.', code: 'irmaos(X, Y) :-\n    progenitor(P, X), progenitor(P, Y), X \\= Y.' }
    ],
    program: `progenitor(sara, isaque).\nprogenitor(abraao, isaque).\nprogenitor(abraao, ismael).\nprogenitor(isaque, esau).\nprogenitor(isaque, jaco).\nprogenitor(jaco, jose).\nmulher(sara).\n\nfilho(Y, X) :- progenitor(X, Y).\nmae(X, Y) :- progenitor(X, Y), mulher(X).\navos(X, Z) :- progenitor(X, Y), progenitor(Y, Z).\nirmaos(X, Y) :-\n    progenitor(P, X), progenitor(P, Y), X \\= Y.`,
    query: 'avos(Quem, jose).',
    presets: [
      { label: 'Avós de José', query: 'avos(Quem, jose).' },
      { label: 'Mostrar o intermediário', query: 'progenitor(X, Y), progenitor(Y, jose).' },
      { label: 'Filhos de Abraão', query: 'filho(Quem, abraao).' },
      { label: 'Irmãos de Jacó', query: 'irmaos(Quem, jaco).' },
      { label: 'Ninguém é irmão de si', query: 'irmaos(jaco, jaco).' }
    ],
    challenge: { question: 'Qual caminho prova avos(isaque, jose).?', options: ['isaque → jaco → jose', 'isaque → esau → jose', 'jose → jaco → isaque'], answer: 0, explanation: 'A base contém progenitor(isaque, jaco). e progenitor(jaco, jose). O nó intermediário Y é jaco; a direção dos argumentos importa.' },
    source: 'Tutorial, PDF pp. 1–3 e 7–8 (slides 5–17, 38–44); Apostila, PDF pp. 11–14.'
  },
  {
    id: 'busca-backtracking', number: '05', title: 'Tentar, falhar, voltar e tentar', shortTitle: 'Busca e backtracking',
    kicker: 'ACOMPANHE A PROVA',
    description: 'Uma tentativa que falha não encerra toda a busca. Veja as variáveis sendo desfeitas e uma alternativa produzindo a resposta.',
    concepts: [
      { title: 'Uma meta de cada vez', text: 'Para resolver dupla(Quem, Destino), o Prolog troca essa meta pelas condições da regra. Ele busca cláusulas de cima para baixo e resolve as condições da esquerda para a direita, aprofundando uma tentativa antes de explorar a próxima.' },
      { title: 'Escolha não é compromisso definitivo', text: 'A primeira opção é ana. Seu destino é museu, mas não existe aberto(museu). A tentativa falha. O mecanismo volta ao ponto onde havia uma alternativa, desfaz Quem = ana e testa bruno.' },
      { title: 'Backtracking e encadeamento para trás', text: 'O raciocínio parte da consulta e a reduz a submetas: isso é encadeamento para trás. Backtracking é o retorno a pontos de escolha quando uma tentativa falha ou quando pedimos outra solução. São ideias relacionadas, mas diferentes.' },
      { title: 'Mais de uma prova', text: 'bruno e clara alcançam parque, que está aberto. Ambas são respostas. No terminal Prolog, ; pede a próxima solução. Neste laboratório, a lista mostra as soluções coletadas e o percurso permite inspecionar como foram encontradas.' }
    ],
    program: `pessoa(ana).\npessoa(bruno).\npessoa(clara).\nvai(ana, museu).\nvai(bruno, parque).\nvai(clara, parque).\naberto(parque).\n\ndupla(Quem, Destino) :-\n    pessoa(Quem),\n    vai(Quem, Destino),\n    aberto(Destino).`,
    query: 'dupla(Quem, Destino).',
    presets: [
      { label: 'Buscar todas as duplas', query: 'dupla(Quem, Destino).' },
      { label: 'Observar a falha de Ana', query: 'dupla(ana, Destino).' },
      { label: 'Uma prova de sucesso', query: 'dupla(bruno, Destino).' },
      { label: 'As metas explícitas', query: 'pessoa(Quem), vai(Quem, Destino), aberto(Destino).' }
    ],
    challenge: { question: 'Depois de falhar aberto(museu), o que acontece na busca por todas as soluções?', options: ['Quem continua preso a ana e a busca termina.', 'Prolog inventa aberto(museu).', 'A tentativa é desfeita e a alternativa bruno pode ser testada.'], answer: 2, explanation: 'Backtracking restaura o estado do ponto de escolha. Uma ligação só vale na tentativa atual; ela não impede o teste de outras provas.' },
    source: 'Tutorial, PDF pp. 3 e 6 (slides 13–14, 31–32); Apostila, PDF pp. 16–17, seção 5.3.'
  },
  {
    id: 'recursao', number: '06', title: 'Caminhos de qualquer tamanho', shortTitle: 'Recursão',
    kicker: 'APROFUNDE A BUSCA',
    description: 'Substitua regras para duas, três ou quatro gerações por uma definição que se repete sobre um problema menor.',
    concepts: [
      { title: 'O caso base', text: 'X é ancestral de Z quando X é progenitor direto de Z. Esse caso pode ser provado usando somente um fato e encerra essa ramificação recursiva.', code: 'ancestral(X, Z) :- progenitor(X, Z).' },
      { title: 'O passo recursivo', text: 'Também vale: X é ancestral de Z se existe Y tal que X é progenitor de Y e Y é ancestral de Z. A chamada avança uma geração; não reaplica o mesmo problema com os mesmos argumentos.', code: 'ancestral(X, Z) :-\n    progenitor(X, Y),\n    ancestral(Y, Z).' },
      { title: 'A mesma regra, novas variáveis', text: 'Cada chamada da regra ganha variáveis próprias. O X de uma chamada não é automaticamente o X de outra. A unificação passa o valor necessário entre as chamadas, como uma sequência de perguntas menores.' },
      { title: 'Terminação depende da busca', text: 'Nesta base a família é finita e não tem ciclos. Se você acrescentar um ciclo ou chamar a recursão antes de avançar, a busca pode não terminar. Ter caso base é necessário para estes exemplos, mas sozinho não garante terminação. O laboratório interrompe buscas que excedem seus limites.' },
      { title: 'Preveja antes de executar', text: 'ancestral(sara, Quem). encontra isaque diretamente; depois encontra esau, jaco e jose por caminhos mais longos. Experimente acrescentar progenitor(jose, bia). e veja a mesma regra alcançar uma nova geração.' }
    ],
    program: `progenitor(sara, isaque).\nprogenitor(abraao, isaque).\nprogenitor(abraao, ismael).\nprogenitor(isaque, esau).\nprogenitor(isaque, jaco).\nprogenitor(jaco, jose).\n\n% Caso base: um arco\nancestral(X, Z) :- progenitor(X, Z).\n\n% Passo recursivo: um arco e um problema menor\nancestral(X, Z) :-\n    progenitor(X, Y),\n    ancestral(Y, Z).`,
    query: 'ancestral(sara, Quem).',
    presets: [
      { label: 'Descendentes de Sara', query: 'ancestral(sara, Quem).' },
      { label: 'Ancestrais de José', query: 'ancestral(Quem, jose).' },
      { label: 'Um caminho de 3 gerações', query: 'ancestral(sara, jose).' },
      { label: 'A direção inversa falha', query: 'ancestral(jose, sara).' }
    ],
    challenge: { question: 'Por que a regra recursiva usa ancestral(Y, Z), depois de progenitor(X, Y)?', options: ['Porque Y já avançou uma geração no caminho até Z.', 'Porque toda variável deve mudar de nome.', 'Porque Z precisa ser sempre um fato novo.'], answer: 0, explanation: 'O primeiro arco leva de X para Y. A chamada recursiva resolve o restante do caminho, de Y para Z, até encontrar um caso base.' },
    source: 'Tutorial, PDF pp. 8–9 (slides 48–53); Apostila, PDF pp. 14–17.'
  },
  {
    id: 'listas', number: '07', title: 'Uma lista se desmonta pela cabeça', shortTitle: 'Listas',
    kicker: 'DIVIDA PARA RESOLVER',
    description: 'Separe cabeça e cauda, procure elementos e descubra como a mesma relação pode juntar ou dividir listas.',
    concepts: [
      { title: 'Cabeça e cauda', text: '[a, b, c] pode ser escrito [a | [b, c]]. A cabeça é a, a cauda é a lista [b, c]. A lista vazia é []. Uma lista com um elemento tem cauda []. O formato correto é [H | T], com uma única expressão depois da barra.', code: '[a, b, c] = [H | T].' },
      { title: 'Pertencer é estar aqui ou adiante', text: 'Um elemento pertence à lista se é sua cabeça ou pertence à cauda. O _ da segunda regra descarta uma cabeça que não precisamos nomear. Repetir um elemento na lista pode produzir mais de uma prova de pertinência.', code: 'pertence(X, [X | _]).\npertence(X, [_ | T]) :- pertence(X, T).' },
      { title: 'Concatenar é uma relação', text: 'concatena(A, B, C) diz que C é A seguida de B. Com A e B conhecidos, encontra C. Com C conhecida, pode descobrir todas as separações em A e B. Esse uso em diferentes direções é uma força da programação por relações.', code: 'concatena([], L, L).\nconcatena([H | T], L, [H | R]) :- concatena(T, L, R).' },
      { title: 'Inserir e remover uma ocorrência', text: 'insere/3 liga um novo elemento ao início. remove/3 escolhe uma ocorrência para remover; com valores repetidos, pode gerar resultados diferentes. O programa define essas operações explicitamente para você enxergar cada passo.', code: 'insere(X, L, [X | L]).' },
      { title: 'Lista dentro de lista', text: 'Em [[a, b], c], os elementos do nível externo são [a, b] e c. O átomo a não pertence diretamente a esse nível. Compare pertence(a, [[a, b], c]). com pertence([a, b], [[a, b], c]).' }
    ],
    program: `pertence(X, [X | _]).\npertence(X, [_ | T]) :- pertence(X, T).\n\nconcatena([], L, L).\nconcatena([H | T], L, [H | R]) :-\n    concatena(T, L, R).\n\ninsere(X, L, [X | L]).\n\nremove(X, [X | T], T).\nremove(X, [H | T], [H | R]) :-\n    remove(X, T, R).`,
    query: 'pertence(X, [ana, bruno, clara]).',
    presets: [
      { label: 'Percorrer uma lista', query: 'pertence(X, [ana, bruno, clara]).' },
      { label: 'Separar cabeça e cauda', query: '[ana, bruno, clara] = [H | T].' },
      { label: 'Juntar listas', query: 'concatena([a, b], [c], Resultado).' },
      { label: 'Todas as divisões', query: 'concatena(A, B, [a, b, c]).' },
      { label: 'Remover uma ocorrência', query: 'remove(c, [a, c, b, c], L).' },
      { label: 'Inserir no início', query: 'insere(a, [b, c], L).' }
    ],
    challenge: { question: 'Em [ana, bruno, clara] = [H | T], qual é o valor de T?', options: ['bruno', '[bruno, clara]', '[ana, bruno, clara]'], answer: 1, explanation: 'A cauda contém todos os elementos depois da cabeça e continua sendo uma lista. Ao desmontar [clara], a cabeça seria clara e a cauda seria [].' },
    source: 'Apostila, PDF pp. 17–20, seção 6. A notação de cabeça e cauda foi ajustada para sintaxe válida.'
  },
  {
    id: 'aritmetica', number: '08', title: 'Calcular também tem uma ordem', shortTitle: 'Aritmética',
    kicker: 'ESTRUTURA OU VALOR?',
    description: 'Diferencie unificar uma expressão, calcular seu resultado e comparar números. Depois acompanhe o retorno de um fatorial.',
    concepts: [
      { title: '= preserva a estrutura', text: 'X = 2 + 3 unifica X com o termo que representa a soma; não pede seu cálculo. Essa expressão tem estrutura, com operador + e argumentos 2 e 3. Por isso 1 + 2 = 2 + 1 falha: as estruturas diferem nas posições.', code: 'X = 2 + 3.' },
      { title: 'is avalia o lado direito', text: 'X is 2 + 3 calcula a expressão e unifica X com 5. As variáveis do lado direito precisam ter valores numéricos. is não resolve equações ao contrário: 5 is X + 2 não descobre X.', code: 'X is 2 + 3.' },
      { title: 'Comparação numérica', text: '=:= compara resultados aritméticos; =\\= verifica diferença numérica. <, >, =< e >= também avaliam expressões, com valores numéricos conhecidos. A condição N > 0 é testada antes de diminuir N e chamar o fatorial novamente.', code: '1 + 2 =:= 2 + 1.' },
      { title: 'Descer e depois voltar', text: 'fatorial(4, F) reduz 4 para 3, 2, 1 e 0. O caso base retorna 1. As multiplicações são feitas na volta: 1 × 1, 2 × 1, 3 × 2 e 4 × 6. O domínio pretendido aqui é o dos inteiros não negativos, com N conhecido.' },
      { title: 'Uma pequena alteração', text: 'Troque a consulta por fatorial(5, F). e acompanhe a nova camada. Depois teste X = 2 + 3. e X is 2 + 3. para ver a diferença entre representar uma expressão e avaliá-la.' }
    ],
    program: `% Relação aritmética: N deve ser inteiro não negativo\nfatorial(0, 1).\nfatorial(N, F) :-\n    N > 0,\n    N1 is N - 1,\n    fatorial(N1, F1),\n    F is N * F1.\n\ndobro(N, D) :- D is N * 2.`,
    query: 'fatorial(4, F).',
    presets: [
      { label: 'Fatorial passo a passo', query: 'fatorial(4, F).' },
      { label: 'Somente unificar', query: 'X = 2 + 3.' },
      { label: 'Calcular com is', query: 'X is 2 + 3.' },
      { label: 'Igualdade numérica', query: '1 + 2 =:= 2 + 1.' },
      { label: 'Estruturas diferentes', query: '1 + 2 = 2 + 1.' },
      { label: 'Variável não instanciada', query: '5 is X + 2.' }
    ],
    challenge: { question: 'Qual consulta calcula 2 + 3 e liga o resultado a X?', options: ['X = 2 + 3.', 'X is 2 + 3.', '5 is X + 2.'], answer: 1, explanation: 'is avalia a expressão à direita. = apenas unifica os termos. A terceira consulta exige que X já tenha valor e gera um erro de instanciação neste contexto.' },
    source: 'Apostila, PDF pp. 20–22 (seção 7) e 27–28 (fatorial). O nome do predicado recursivo foi uniformizado no exemplo adaptado.'
  },
  {
    id: 'negacao', number: '09', title: 'Quando não encontrar uma prova conta', shortTitle: 'Negação por falha',
    kicker: 'RACIOCINE COM CUIDADO',
    description: 'Descubra por que “não consegui provar” exige atenção e por que a ordem das metas pode mudar uma consulta com negação.',
    concepts: [
      { title: 'Negação por falha', text: '\\+ Meta tem sucesso quando a tentativa de provar Meta termina sem sucesso. Não é uma prova clássica da falsidade de Meta. Se a busca interna não terminar, não podemos concluir sua negação por esse mecanismo.', code: '\\+ come(raposa, grama).' },
      { title: 'Primeiro gere, depois teste', text: 'herbivoro(X) primeiro escolhe um animal X, depois encontra algo P que X come e verifica se P é uma planta. nao_herbivoro(X) primeiro escolhe X e só então testa a ausência de prova de herbivoro(X).', code: 'nao_herbivoro(X) :- animal(X), \\+ herbivoro(X).' },
      { title: 'A ordem altera o sentido operacional', text: '\\+ herbivoro(X), animal(X) falha logo no primeiro objetivo, pois existe algum X que satisfaz herbivoro(X). A negação não enumera os X restantes. Compare com animal(X), \\+ herbivoro(X), que testa um animal por vez.' },
      { title: 'O limite está na base', text: '“Não herbívoro” aqui significa apenas “animal para o qual esta base não prova consumo de uma planta”. Não use a ausência de informação como uma conclusão biológica geral. Acrescentar um fato pode invalidar uma conclusão anterior baseada em negação.' },
      { title: 'Diferença não é uma restrição persistente', text: 'X \\= Y também testa algo agora: falha se X e Y ainda podem ser unificados. Nas regras de família, nós geramos valores concretos antes do teste. Adiar restrições exige recursos além deste laboratório, como dif/2 em ambientes completos.' }
    ],
    program: `animal(coelho).\nanimal(raposa).\nanimal(veado).\nplanta(grama).\ncome(coelho, grama).\ncome(raposa, coelho).\ncome(veado, grama).\n\nherbivoro(X) :- animal(X), come(X, P), planta(P).\nnao_herbivoro(X) :- animal(X), \\+ herbivoro(X).`,
    query: 'nao_herbivoro(Quem).',
    presets: [
      { label: 'Gerar antes de negar', query: 'nao_herbivoro(Quem).' },
      { label: 'Veja a ordem invertida', query: '\\+ herbivoro(Quem), animal(Quem).' },
      { label: 'Negar uma meta concreta', query: '\\+ come(raposa, grama).' },
      { label: 'Uma prova impede a negação', query: '\\+ come(coelho, grama).' }
    ],
    challenge: { question: 'Por que \\+ herbivoro(Quem), animal(Quem). falha nesta base?', options: ['Porque não existe nenhum animal.', 'Porque existe uma prova de herbivoro(Quem), então sua negação falha.', 'Porque negação sempre precisa de corte.'], answer: 1, explanation: 'Antes de gerar Quem, a meta herbivoro(Quem) já encontra coelho. A negação dessa existência falha. Para filtrar animais individualmente, gere o valor antes de negá-lo.' },
    source: 'Apostila, PDF pp. 13–14 e 31 (negação e exercícios da cadeia alimentar). As limitações da negação por falha são explicitadas como complemento didático.'
  },
  {
    id: 'corte', number: '10', title: 'O corte fecha portas da busca', shortTitle: 'Controle com corte',
    kicker: 'CONTROLE AS ALTERNATIVAS',
    description: 'Compare duas versões da mesma escolha e veja como ! descarta alternativas que o backtracking poderia explorar.',
    concepts: [
      { title: 'O que ! faz', text: 'O corte tem sucesso e descarta pontos de escolha criados desde a entrada na chamada atual do predicado, à esquerda do corte, incluindo outras cláusulas desse predicado. Ele não encerra todo o programa e não afeta indiscriminadamente todas as escolhas.' },
      { title: 'Primeira opção vira compromisso', text: 'primeiro(X) encontra a primeira opcao(X) e executa !. Quando pedimos mais soluções, b e c já foram podadas para essa chamada. todos(X) mantém as três alternativas. Compare os percursos.', code: 'primeiro(X) :- opcao(X), !.' },
      { title: 'Corte e condições mutuamente exclusivas', text: 'maximo/3 decide qual número é maior. Com A e B numéricos conhecidos, a versão apresentada conserva as respostas e evita tentar a segunda cláusula depois do sucesso da primeira. O comportamento deve ser analisado para o modo de uso pretendido.', code: 'maximo(A, B, A) :- A >= B, !.\nmaximo(A, B, B) :- A < B.' },
      { title: 'Corte pode mudar respostas', text: 'Em primeiro/1, podar as alternativas é a intenção. Em outras regras, um corte mal colocado pode remover respostas válidas ou impedir uma alternativa depois de uma falha posterior. A ordem das cláusulas passa a ser parte essencial do significado operacional.' },
      { title: 'Experimente sem o corte', text: 'Apague ! da regra primeiro/1, ajustando a vírgula para terminar a regra com ponto, e execute novamente. Conte as respostas e compare os eventos. Depois restaure o exemplo para continuar.' }
    ],
    program: `opcao(a).\nopcao(b).\nopcao(c).\n\ntodos(X) :- opcao(X).\nprimeiro(X) :- opcao(X), !.\n\n% Use com os dois números já conhecidos\nmaximo(A, B, A) :- A >= B, !.\nmaximo(A, B, B) :- A < B.`,
    query: 'primeiro(X).',
    presets: [
      { label: 'Com corte: uma opção', query: 'primeiro(X).' },
      { label: 'Sem corte: todas', query: 'todos(X).' },
      { label: 'Máximo: primeira cláusula', query: 'maximo(8, 3, M).' },
      { label: 'Máximo: segunda cláusula', query: 'maximo(3, 8, M).' }
    ],
    challenge: { question: 'Por que primeiro(X). só encontra X = a?', options: ['Porque opcao/1 tem somente um fato.', 'Porque ! descarta as alternativas dessa chamada depois da primeira opção.', 'Porque toda consulta só pode retornar uma solução.'], answer: 1, explanation: 'opcao(a) é a primeira prova. O corte impede retornar a opcao/1 para obter b e c nessa execução de primeiro/1. Sem corte, todos/1 encontra as três.' },
    source: 'Apostila, PDF pp. 22–23, seção 8 (corte de fluxo).'
  },
  {
    id: 'laboratorio-final', number: '11', title: 'Investigue uma cadeia alimentar', shortTitle: 'Laboratório final',
    kicker: 'JUNTE AS PEÇAS',
    description: 'Use fatos, regras, grafos, recursão, listas e negação para investigar uma pequena teia alimentar e os caminhos de uma prova.',
    concepts: [
      { title: 'Do direto ao indireto', text: 'come/2 descreve uma relação direta. cadeia/2 estende a relação para o que está abaixo na cadeia alimentar: um animal come outro que, por sua vez, se alimenta de mais organismos. cadeia(urso, alga) não afirma que o urso come algas diretamente.' },
      { title: 'Guardar o caminho em uma lista', text: 'rota(A, B, Caminho) inclui os nós percorridos na própria resposta. O caso base produz [A, B]. O passo recursivo coloca A na frente do caminho obtido a partir de um intermediário. Esta base é acíclica; em grafos com ciclos, seria necessário controlar os nós já visitados.', code: 'rota(A, B, [A, B]) :- come(A, B).\nrota(A, B, [A | R]) :- come(A, C), rota(C, B, R).' },
      { title: 'Respostas repetidas podem contar histórias diferentes', text: 'O urso alcança peixe diretamente e também por guaxinim. Duas provas podem retornar o mesmo organismo. Consulte rota/3 para distinguir os caminhos em vez de apagar a repetição sem entendê-la.' },
      { title: 'Seu desafio de programação', text: 'Adicione planta(grama)., animal(veado)., come(veado, grama). e come(urso, veado). Quantos caminhos até plantas surgem? Depois defina herbivoro(X) :- animal(X), come(X, P), planta(P). e consulte herbivoro(Quem). Compare previsão, resultado e percurso.' },
      { title: 'Continue nos materiais', text: 'Na apostila, avance para palíndromos, MDC, Torre de Hanói, ordenação e os exercícios finais. O laboratório executa um subconjunto didático local. Recursos de entrada/saída, módulos e bibliotecas dos exemplos completos exigem um ambiente Prolog completo.' }
    ],
    program: `animal(urso).\nanimal(guaxinim).\nanimal(peixe).\nanimal(peixinho).\nplanta(alga).\ncome(urso, peixe).\ncome(urso, guaxinim).\ncome(guaxinim, peixe).\ncome(peixe, peixinho).\ncome(peixinho, alga).\n\ncadeia(A, B) :- come(A, B).\ncadeia(A, B) :- come(A, C), cadeia(C, B).\n\nrota(A, B, [A, B]) :- come(A, B).\nrota(A, B, [A | R]) :- come(A, C), rota(C, B, R).\n\npresa(X) :- come(_, X), animal(X).\nnao_presa(X) :- animal(X), \\+ presa(X).`,
    query: 'rota(urso, alga, Caminho).',
    presets: [
      { label: 'Caminhos até a alga', query: 'rota(urso, alga, Caminho).' },
      { label: 'Tudo abaixo do urso', query: 'cadeia(urso, Quem).' },
      { label: 'Relação direta', query: 'come(urso, alga).' },
      { label: 'Relação indireta', query: 'cadeia(urso, alga).' },
      { label: 'Quem não é presa na base?', query: 'nao_presa(Quem).' }
    ],
    challenge: { question: 'Por que rota(urso, alga, Caminho). encontra duas soluções?', options: ['Porque há dois caminhos: um passa por peixe; outro passa por guaxinim e peixe.', 'Porque a alga foi declarada duas vezes.', 'Porque toda regra recursiva duplica automaticamente as respostas.'], answer: 0, explanation: 'As rotas são [urso, peixe, peixinho, alga] e [urso, guaxinim, peixe, peixinho, alga]. A repetição do destino corresponde a provas diferentes no grafo.' },
    source: 'Apostila, PDF pp. 24–25 (cadeia alimentar), 26–28 (exemplos) e 29–33 (exercícios). rota/3 é uma extensão didática que reúne recursão e listas.'
  }
];
