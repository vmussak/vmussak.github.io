// Cada exercício é independente: abra um programa novo no SWISH e copie somente sua base.
// As verificações são contratos de teste, não soluções. Consultas que o aluno deve formular
// ficam deliberadamente ausentes de checks.query para não entregar a própria resposta.
export const exercises = [
  {
    id: 'ex01', number: '01', block: 1, level: 'Fácil', topic: 'Fatos e predicados',
    title: 'Uma pequena frutaria',
    intro: 'Comece do zero. A frutaria vende banana, limao e uva. A banana é amarela, o limao é verde e a uva é roxa. Use esses nomes sem acentos no código.',
    tasks: [
      'Declare as três frutas com fruta/1. O único argumento é o nome da fruta.',
      'Declare as três cores com cor/2, na ordem cor(Fruta, Cor). Use os átomos amarela, verde e roxa.',
      'Confira se cada cláusula termina com ponto e explique por que fruta e cor têm aridades diferentes.'
    ],
    starter: `% TODO: declare fruta/1 e cor/2 conforme o enunciado.\n% cor/2 usa primeiro a fruta e depois a cor.\n% Escreva um fato por linha; termine cada fato com ponto.`,
    checks: [
      { query: 'fruta(Fruta).', expectation: 'Ao pedir todas as soluções, devem aparecer exatamente banana, limao e uva, uma vez cada; a ordem pode acompanhar a ordem dos seus fatos.' },
      { query: 'cor(Fruta, verde).', expectation: 'A única solução deve ser Fruta = limao.' },
      { query: 'cor(banana, roxa).', expectation: 'A consulta deve falhar: false.' }
    ],
    hint: 'Um fato registra uma informação concreta. Nomes de predicados e átomos começam com minúscula; variáveis começam com maiúscula.',
    review: { label: 'Capítulo 01 · Fatos e consultas', href: './#primeiros-fatos' }
  },
  {
    id: 'ex02', number: '02', block: 1, level: 'Fácil', topic: 'Consultas e ordem dos argumentos',
    title: 'Quem cuida de quem?',
    intro: 'Na relação tutor(Pessoa, Animal), o primeiro argumento é a pessoa e o segundo é o animal. A base já está pronta; seu trabalho é fazer perguntas, sem acrescentar regras.',
    tasks: [
      'Escreva uma consulta para confirmar se Ana é tutora de Luna.',
      'Escreva outra para perguntar se Luna é tutora de Ana. Compare o significado das duas perguntas.',
      'Pergunte se Clara é tutora de Bidu. Explique por que uma falha descreve o conhecimento desta base, sem afirmar o que acontece fora dela.'
    ],
    starter: `tutor(ana, luna).\ntutor(bruno, bidu).\ntutor(clara, nino).\n\n% TODO: escreva suas consultas no campo de consultas do SWISH.\n% Não coloque as consultas no lugar destes fatos.`,
    checks: [
      { query: '', expectation: 'A pergunta sobre Ana ser tutora de Luna deve ter sucesso; a pergunta com os argumentos invertidos deve falhar.' },
      { query: '', expectation: 'Não deve existir uma prova de que Clara é tutora de Bidu nesta base.' }
    ],
    hint: 'Leia cada relação em voz alta antes de executar. Trocar os argumentos muda a pergunta; não cria automaticamente uma relação inversa.',
    review: { label: 'Capítulo 01 · Fatos e consultas', href: './#primeiros-fatos' }
  },
  {
    id: 'ex03', number: '03', block: 1, level: 'Fácil', topic: 'Variáveis e enumeração de respostas',
    title: 'A turma e suas oficinas',
    intro: 'inscricao(Aluno, Oficina) registra uma inscrição. Um aluno pode participar de mais de uma oficina. Explore a base usando variáveis e peça todas as respostas no SWISH.',
    tasks: [
      'Formule uma consulta para descobrir todas as oficinas de Ana.',
      'Formule outra para descobrir todos os alunos inscritos em robotica.',
      'Formule uma consulta que mostre todos os pares aluno–oficina. Depois consulte se Ana está inscrita em alguma oficina usando _ na posição que você não deseja nomear.'
    ],
    starter: `inscricao(ana, robotica).\ninscricao(ana, fotografia).\ninscricao(bruno, robotica).\ninscricao(clara, teatro).\ninscricao(davi, fotografia).\n\n% TODO: formule as consultas no campo de consultas do SWISH.\n% Para ver a resposta completa, solicite todas as soluções.`,
    checks: [
      { query: '', expectation: 'As oficinas de Ana devem ser robotica e fotografia. Os alunos de robotica devem ser ana e bruno.' },
      { query: '', expectation: 'A consulta dos pares deve produzir exatamente cinco inscrições. Usar _ para a oficina de Ana não deve exibir uma variável com esse nome; pode haver mais de uma prova de sucesso.' }
    ],
    hint: 'Coloque a variável na posição que deseja descobrir. Cada ocorrência de _ é uma variável anônima nova; _Nome é uma variável nomeada normal.',
    review: { label: 'Capítulo 02 · Termos e unificação', href: './#termos-unificacao' }
  },
  {
    id: 'ex04', number: '04', block: 1, level: 'Fácil', topic: 'Unificação e variáveis repetidas',
    title: 'As duas peças precisam combinar',
    intro: 'par(PrimeiraCor, SegundaCor) descreve um par de peças. Você vai investigar a diferença entre pedir duas posições quaisquer e exigir que elas tenham o mesmo valor.',
    tasks: [
      'Escreva uma consulta que use a mesma variável nas duas posições de par/2 e obtenha apenas os pares de cores iguais.',
      'Escreva outra que use duas variáveis diferentes e enumere todos os pares da base.',
      'Sem acrescentar fatos, teste uma unificação entre caixa(X, azul) e caixa(vermelho, Y). Anote quais ligações tornam os termos compatíveis. Depois teste caixa(X, X) com caixa(vermelho, azul).'
    ],
    starter: `par(azul, azul).\npar(azul, verde).\npar(verde, verde).\n\n% TODO: faça as consultas e os testes com = no campo de consultas.\n% Não acrescente regras: observe como as variáveis são unificadas.`,
    checks: [
      { query: '', expectation: 'Com a mesma variável nas duas posições, devem aparecer duas soluções, correspondentes às cores azul e verde. Com duas variáveis diferentes, devem aparecer os três pares declarados.' },
      { query: '', expectation: 'As estruturas caixa(X, azul) e caixa(vermelho, Y) são compatíveis. Já o teste em que uma única variável precisa ser simultaneamente vermelho e azul deve falhar.' }
    ],
    hint: 'Repetir o nome de uma variável impõe o mesmo termo em todas as suas ocorrências dentro da consulta. = procura um encaixe; não calcula uma expressão.',
    review: { label: 'Capítulo 02 · Termos e unificação', href: './#termos-unificacao' }
  },
  {
    id: 'ex05', number: '05', block: 1, level: 'Fácil', topic: 'Termos compostos e padrões',
    title: 'Um mapa dentro de um termo',
    intro: 'local(Pessoa, ponto(Coluna, Linha)) guarda uma estrutura dentro da relação. Coluna e Linha são números; ponto/2 reúne as duas coordenadas.',
    tasks: [
      'Escreva uma consulta que descubra quem está na linha 3, deixando a coluna livre.',
      'Escreva outra que descubra a coluna e a linha de Clara.',
      'Pergunte quem ocupa uma posição em que coluna e linha têm o mesmo valor. Use uma variável repetida dentro de ponto/2.'
    ],
    starter: `local(ana, ponto(2, 3)).\nlocal(bruno, ponto(4, 3)).\nlocal(clara, ponto(2, 5)).\nlocal(davi, ponto(4, 4)).\n\n% TODO: consulte usando o padrão ponto(Coluna, Linha).\n% local/2 tem dois argumentos; seu segundo argumento é um termo composto.`,
    checks: [
      { query: '', expectation: 'Na linha 3, devem aparecer ana e bruno. Clara deve estar na coluna 2 e na linha 5.' },
      { query: '', expectation: 'A única pessoa com coluna e linha iguais deve ser davi, na posição de coordenadas 4 e 4.' }
    ],
    hint: 'Uma estrutura só unifica com outra se o nome, a aridade e os argumentos nas posições correspondentes forem compatíveis. Você também pode colocar variáveis dentro da estrutura.',
    review: { label: 'Capítulo 02 · Termos e unificação', href: './#termos-unificacao' }
  },
  {
    id: 'ex06', number: '06', block: 2, level: 'Em transição', topic: 'Regras e relação inversa',
    title: 'A mesma família, outra pergunta',
    intro: 'progenitor(Pessoa, Filho) está definido nos fatos. Queremos consultar a relação pelo outro sentido usando filho_de(Filho, Progenitor). O nome filho_de vale para filhos e filhas.',
    tasks: [
      'Defina filho_de/2 por uma regra baseada em progenitor/2, respeitando a ordem dos argumentos pedida.',
      'Não copie as relações como novos fatos. A regra deve continuar funcionando se uma nova relação de progenitor for acrescentada.',
      'Execute os testes e explique quais posições da regra correspondem às posições do fato utilizado.'
    ],
    starter: `progenitor(rita, leo).\nprogenitor(caio, leo).\nprogenitor(leo, bia).\n\n% TODO: defina filho_de(Filho, Progenitor) por uma regra.`,
    checks: [
      { query: 'filho_de(leo, Quem).', expectation: 'As soluções devem ser Quem = rita e Quem = caio, sem outras pessoas.' },
      { query: 'filho_de(Quem, leo).', expectation: 'A única solução deve ser Quem = bia.' },
      { query: 'filho_de(rita, leo).', expectation: 'A consulta deve falhar: a direção dessa relação está invertida em relação ao fato sobre Rita e Leo.' }
    ],
    hint: 'Leia a regra como “alguém é filho de uma pessoa se essa pessoa é seu progenitor”. A cabeça oferece a nova relação; o corpo consulta o conhecimento existente.',
    review: { label: 'Capítulo 03 · Regras e conectivos', href: './#regras-conectivos' }
  },
  {
    id: 'ex07', number: '07', block: 2, level: 'Em transição', topic: 'Conjunção de condições',
    title: 'Uma inscrição ainda não basta',
    intro: 'Uma pessoa pode participar de uma oficina quando está inscrita nela e seu pagamento está registrado. pagamento/1 é válido para todas as oficinas da pessoa neste pequeno modelo.',
    tasks: [
      'Defina pode_participar(Pessoa, Oficina) com as duas condições exigidas: inscrição e pagamento.',
      'Use a mesma variável para representar a pessoa em todas as condições. Não declare manualmente quem pode participar.',
      'Depois de conferir o resultado original, acrescente um fato de pagamento para Clara e execute os testes novamente. Explique qual nova participação passa a ser provada.'
    ],
    starter: `inscricao(ana, robotica).\ninscricao(ana, fotografia).\ninscricao(bruno, robotica).\ninscricao(clara, teatro).\npagamento(ana).\npagamento(bruno).\n\n% TODO: defina pode_participar(Pessoa, Oficina).\n% Primeiro confira a base original; só depois faça a alteração pedida.`,
    checks: [
      { query: 'pode_participar(Pessoa, Oficina).', expectation: 'Na base original, devem existir exatamente três pares: ana–robotica, ana–fotografia e bruno–robotica.' },
      { query: 'pode_participar(clara, teatro).', expectation: 'Deve falhar na base original. Depois de registrar o pagamento de Clara, deve ter sucesso.' },
      { query: 'pode_participar(bruno, teatro).', expectation: 'Deve falhar nas duas versões: Bruno não tem inscrição em teatro.' }
    ],
    hint: 'Uma vírgula no corpo da regra exige que todas as condições tenham sucesso com ligações compatíveis para as variáveis.',
    review: { label: 'Capítulo 03 · Regras e conectivos', href: './#regras-conectivos' }
  },
  {
    id: 'ex08', number: '08', block: 2, level: 'Em transição', topic: 'Disjunção e alternativas',
    title: 'Duas maneiras de chegar',
    intro: 'Uma pessoa usa transporte ativo se vai a pé ou de bicicleta. Basta satisfazer uma dessas alternativas. Os fatos descrevem apenas esta atividade de sala.',
    tasks: [
      'Defina transporte_ativo(Pessoa), usando duas cláusulas alternativas ou uma disjunção com ;.',
      'Confira a base original. Depois acrescente que Ana também vai de bicicleta e observe quantas provas a consulta pode produzir para ela.',
      'Explique a diferença entre o número de provas encontradas e o número de pessoas distintas.'
    ],
    starter: `a_pe(ana).\na_pe(clara).\nbicicleta(bruno).\nonibus(davi).\n\n% TODO: defina transporte_ativo(Pessoa).\n% A pé OU de bicicleta: não exija as duas condições ao mesmo tempo.`,
    checks: [
      { query: 'transporte_ativo(Pessoa).', expectation: 'Na base original, as soluções devem corresponder a ana, clara e bruno, uma prova para cada pessoa. A ordem pode depender da ordem das suas alternativas.' },
      { query: 'transporte_ativo(davi).', expectation: 'Deve falhar: a base registra somente o ônibus para Davi.' },
      { query: 'transporte_ativo(ana).', expectation: 'Na base original, uma prova. Depois de acrescentar o uso de bicicleta por Ana, duas provas se você solicitar todas as soluções; continua sendo uma única pessoa distinta.' }
    ],
    hint: 'Duas cláusulas com a mesma cabeça oferecem caminhos alternativos de prova. Prolog pode encontrar a mesma resposta por mais de um caminho.',
    review: { label: 'Capítulo 03 · Regras e conectivos', href: './#regras-conectivos' }
  },
  {
    id: 'ex09', number: '09', block: 2, level: 'Em transição', topic: 'Composição de relações',
    title: 'Descubra uma geração intermediária',
    intro: 'Cada fato progenitor(A, B) liga A ao seu filho ou filha B. Defina avos(Ancestral, Descendente) para pessoas separadas por exatamente duas dessas relações, sem distinguir avó e avô.',
    tasks: [
      'Defina avos/2 usando duas consultas a progenitor/2 e uma variável para a pessoa intermediária.',
      'Garanta que o filho da primeira relação seja a mesma pessoa que aparece como progenitor na segunda.',
      'Desenhe à mão os dois arcos que justificam cada resposta para os avós de Bia. Não use recursão neste exercício.'
    ],
    starter: `progenitor(rita, leo).\nprogenitor(caio, leo).\nprogenitor(leo, bia).\nprogenitor(leo, teo).\nprogenitor(bia, nina).\n\n% TODO: defina avos(Ancestral, Descendente) para exatamente duas gerações.`,
    checks: [
      { query: 'avos(Quem, bia).', expectation: 'As soluções devem ser Quem = rita e Quem = caio.' },
      { query: 'avos(rita, Quem).', expectation: 'As soluções devem ser Quem = bia e Quem = teo. Nina está a três gerações de Rita e não entra nesta relação.' },
      { query: 'avos(leo, nina).', expectation: 'A consulta deve ter sucesso.' },
      { query: 'avos(rita, leo).', expectation: 'Deve falhar: essa relação possui somente uma geração.' }
    ],
    hint: 'Pense em um caminho A → Intermediário → B. A variável que conecta as duas condições precisa ser compartilhada entre elas.',
    review: { label: 'Capítulo 04 · Relações e grafos', href: './#familia-grafos' }
  },
  {
    id: 'ex10', number: '10', block: 2, level: 'Em transição', topic: 'Aritmética com is',
    title: 'O total de uma compra',
    intro: 'preco(Produto, ValorUnitario) informa valores inteiros em reais. total(Produto, Quantidade, ValorTotal) deve calcular uma compra de um único produto. Neste exercício, Produto e Quantidade são fornecidos na consulta; a quantidade é um inteiro não negativo.',
    tasks: [
      'Defina total/3 consultando o preço do produto e calculando o preço multiplicado pela quantidade.',
      'Use is para obter o resultado numérico. Compare conceitualmente esse uso com apenas unificar ValorTotal a uma expressão com =.',
      'Confira a quantidade zero. Não tente descobrir a quantidade a partir de um total: esse uso inverso não faz parte do modo de chamada pedido.'
    ],
    starter: `preco(caderno, 12).\npreco(caneta, 3).\npreco(livro, 25).\n\n% TODO: defina total(Produto, Quantidade, ValorTotal).\n% Produto e Quantidade chegam conhecidos; ValorTotal é o resultado.`,
    checks: [
      { query: 'total(caderno, 2, Valor).', expectation: 'A única solução deve ser Valor = 24.' },
      { query: 'total(caneta, 0, Valor).', expectation: 'A única solução deve ser Valor = 0.' },
      { query: 'total(livro, 3, 75).', expectation: 'A consulta deve ter sucesso.' },
      { query: 'total(adesivo, 2, Valor).', expectation: 'Deve falhar, pois a base não tem preço para adesivo.' }
    ],
    hint: 'Antes de avaliar uma expressão com is, os valores usados à direita precisam estar conhecidos. A consulta ao preço fornece um desses valores.',
    review: { label: 'Capítulo 08 · Aritmética', href: './#aritmetica' }
  },
  {
    id: 'ex11', number: '11', block: 3, level: 'Médio', topic: 'Negação por falha com variável instanciada',
    title: 'A lista de entrada',
    intro: 'Neste modelo de exercício, pode entrar quem está inscrito e não tem um bloqueio registrado. A ausência de registro será tratada como ausência de bloqueio apenas dentro desta base fechada.',
    tasks: [
      'Defina pode_entrar(Pessoa). Primeiro gere uma pessoa inscrita; depois use \\+ para testar se existe bloqueio para essa pessoa já conhecida.',
      'Não use a negação para tentar enumerar nomes. Explique o problema de testar a ausência de bloqueio antes de escolher a pessoa.',
      'Depois da conferência original, acrescente um bloqueio para Ana e observe quais respostas deixam de ser provadas.'
    ],
    starter: `inscrito(ana).\ninscrito(bruno).\ninscrito(clara).\nbloqueado(bruno).\nbloqueado(davi).\n\n% TODO: defina pode_entrar(Pessoa).\n% Gere um inscrito antes de testar a negação com \\+.`,
    checks: [
      { query: 'pode_entrar(Quem).', expectation: 'Na base original, as únicas soluções devem ser Quem = ana e Quem = clara. Depois de bloquear Ana, somente clara.' },
      { query: 'pode_entrar(bruno).', expectation: 'Deve falhar porque há bloqueio para Bruno.' },
      { query: 'pode_entrar(davi).', expectation: 'Deve falhar: Davi não está inscrito; além disso, consta na lista de bloqueios.' },
      { query: 'pode_entrar(elisa).', expectation: 'Deve falhar: a ausência de bloqueio sozinha não é suficiente, pois Elisa não está inscrita.' }
    ],
    hint: '\\+ tenta provar a meta e tem sucesso quando essa tentativa termina sem prova. Isso testa a base atual; não demonstra uma verdade sobre todas as situações do mundo real.',
    review: { label: 'Capítulo 09 · Negação por falha', href: './#negacao' }
  },
  {
    id: 'ex12', number: '12', block: 3, level: 'Médio', topic: 'Recursão em um grafo acíclico',
    title: 'Um destino pode estar mais adiante',
    intro: 'ligacao(Origem, Destino) representa uma passagem de mão única entre pontos de um mapa. O grafo fornecido não tem ciclos. alcanca/2 deve considerar caminhos com uma ou mais ligações, respeitando as setas.',
    tasks: [
      'Desenhe o grafo e defina alcanca(Origem, Destino) com um caso base para a ligação direta.',
      'Acrescente um caso recursivo que percorra uma ligação e procure o restante do caminho a partir do novo ponto.',
      'Não considere um caminho de comprimento zero. Na base fornecida, um ponto não deve alcançar a si mesmo. Não acrescente ligações que criem ciclos.'
    ],
    starter: `ligacao(a, b).\nligacao(b, c).\nligacao(c, d).\nligacao(b, e).\n\n% TODO: defina alcanca(Origem, Destino).\n% Considere somente caminhos com pelo menos uma ligação.\n% O grafo desta atividade é finito e acíclico.`,
    checks: [
      { query: 'alcanca(a, Destino).', expectation: 'Os destinos devem ser os quatro átomos b, c, d, e; uma prova para cada um. A ordem pode depender da organização das suas cláusulas.' },
      { query: 'alcanca(a, d).', expectation: 'Deve ter sucesso, usando três ligações.' },
      { query: 'alcanca(d, a).', expectation: 'Deve falhar: as ligações não são bidirecionais.' },
      { query: 'alcanca(a, a).', expectation: 'Deve falhar, pois não há ciclo nem caminho de comprimento zero na relação pedida.' }
    ],
    hint: 'O caso recursivo precisa avançar no grafo antes de repetir a busca. Uma chamada recursiva com os mesmos argumentos, sem progresso, pode nunca terminar.',
    review: { label: 'Capítulo 06 · Recursão', href: './#recursao' }
  },
  {
    id: 'ex13', number: '13', block: 3, level: 'Médio', topic: 'Cabeça, cauda e pertinência em listas',
    title: 'Procure uma cor na lista',
    intro: 'Implemente pertence(Elemento, Lista) para dizer se um termo é um elemento do nível externo de uma lista finita, completamente fornecida na consulta e terminada em []. O elemento pode estar conhecido ou ser uma variável.',
    tasks: [
      'Defina um caso em que o elemento procurado é a cabeça da lista.',
      'Defina um caso recursivo que procure o elemento na cauda. Não use member/2 ou outro predicado pronto de pertinência.',
      'Teste uma lista vazia, uma lista com cores e uma lista cujo primeiro elemento é outra lista. A busca não deve entrar automaticamente em listas internas.'
    ],
    starter: `% TODO: defina pertence(Elemento, Lista).\n% Os dados das listas serão fornecidos nas consultas.\n% Use a decomposição em cabeça e cauda; não use member/2.`,
    checks: [
      { query: 'pertence(azul, [verde, azul, amarelo]).', expectation: 'Deve ter sucesso.' },
      { query: 'pertence(Cor, [verde, azul, amarelo]).', expectation: 'Devem aparecer exatamente verde, azul e amarelo, uma prova para cada elemento.' },
      { query: 'pertence(azul, []).', expectation: 'Deve falhar: uma lista vazia não tem elementos.' },
      { query: 'pertence(azul, [[azul, verde], amarelo]).', expectation: 'Deve falhar: azul está dentro de uma sublista, não no nível externo.' },
      { query: 'pertence([azul, verde], [[azul, verde], amarelo]).', expectation: 'Deve ter sucesso: a própria sublista é um elemento do nível externo.' }
    ],
    hint: 'Uma lista não vazia pode ser decomposta em [H | T]. Depois de | fica a cauda, que é uma lista. Pense no que acontece quando a busca chega a [].',
    review: { label: 'Capítulo 07 · Listas', href: './#listas' }
  },
  {
    id: 'ex14', number: '14', block: 3, level: 'Médio', topic: 'Recursão estrutural e aritmética',
    title: 'Conte sem usar length',
    intro: 'Defina tamanho(Lista, Quantidade) para contar os elementos do nível externo de uma lista finita e conhecida. Uma sublista conta como um único elemento. A quantidade será calculada, sem uso inverso para gerar listas.',
    tasks: [
      'Defina o tamanho da lista vazia como caso base.',
      'No caso recursivo, obtenha o tamanho da cauda e só então calcule o tamanho da lista inteira.',
      'Não use length/2, agregação ou um predicado pronto de contagem. Teste também uma lista contendo outra lista.'
    ],
    starter: `% TODO: defina tamanho(Lista, Quantidade).\n% A lista chega conhecida e é finita; calcule sua quantidade de elementos.\n% Use recursão e is, sem length/2.`,
    checks: [
      { query: 'tamanho([], N).', expectation: 'A única solução deve ser N = 0.' },
      { query: 'tamanho([ana, bruno, clara], N).', expectation: 'A única solução deve ser N = 3.' },
      { query: 'tamanho([[a, b], c], N).', expectation: 'A única solução deve ser N = 2: a sublista [a, b] conta como um elemento.' },
      { query: 'tamanho([a], 2).', expectation: 'Deve falhar: a lista tem um elemento, não dois.' }
    ],
    hint: 'O resultado da chamada sobre a cauda precisa estar conhecido quando você fizer a conta. Há um elemento a mais na lista inteira do que em sua cauda.',
    review: { label: 'Capítulo 07 · Listas', href: './#listas' }
  },
  {
    id: 'ex15', number: '15', block: 3, level: 'Médio', topic: 'Grafos, recursão e construção de listas',
    title: 'Mostre por onde o caminho passou',
    intro: 'Reúna as ideias anteriores. caminho(Origem, Destino, Nos) deve produzir uma lista com todos os pontos de uma rota orientada, incluindo as duas extremidades. Origem e Destino chegam conhecidos. O grafo é acíclico e cada caminho precisa percorrer ao menos uma ligação.',
    tasks: [
      'Desenhe o grafo e preveja quantas rotas diferentes ligam o ponto a ao ponto e.',
      'Defina um caso base para uma ligação direta, produzindo uma lista com origem e destino.',
      'Defina um caso recursivo que avance para um ponto intermediário e acrescente a origem à frente da rota restante. Não escreva rotas prontas como fatos, não use bibliotecas e não acrescente ciclos ao grafo.'
    ],
    starter: `ligacao(a, b).\nligacao(a, c).\nligacao(b, d).\nligacao(c, d).\nligacao(d, e).\n\n% TODO: defina caminho(Origem, Destino, Nos).\n% Origem e Destino são conhecidos; Nos deve ser a lista dos pontos percorridos.\n% Não inclua caminho de comprimento zero. O grafo não tem ciclos.`,
    checks: [
      { query: 'caminho(a, e, Nos).', expectation: 'Devem existir exatamente duas listas: [a, b, d, e] e [a, c, d, e]. A ordem das respostas não importa.' },
      { query: 'caminho(d, e, Nos).', expectation: 'A única solução deve ser Nos = [d, e].' },
      { query: 'caminho(e, a, Nos).', expectation: 'Deve falhar: não há rota no sentido inverso.' },
      { query: 'caminho(a, a, Nos).', expectation: 'Deve falhar: a relação pede uma ou mais ligações e não há ciclos.' }
    ],
    hint: 'O restante da rota é uma lista. Ao voltar da chamada recursiva, você pode colocar o ponto atual na frente dessa lista, preservando a ordem dos pontos.',
    review: { label: 'Capítulo 11 · Laboratório final', href: './#laboratorio-final' }
  }
];
