// Material autoral de apoio. Exemplos de planos e métricas dos laboratórios são didáticos.
// Fontes oficiais consultadas em 17/11/2026; recursos dependentes de versão são sinalizados.
export const sources = [
  { id: 'design', title: 'Arquitetura e projeto de índices', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver17' },
  { id: 'cluster', title: 'Índices clusterizados e não clusterizados', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described?view=sql-server-ver17' },
  { id: 'heap', title: 'Heaps: tabelas sem índice clusterizado', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/heaps-tables-without-clustered-indexes?view=sql-server-ver17' },
  { id: 'create', title: 'CREATE INDEX — sintaxe e opções', url: 'https://learn.microsoft.com/pt-br/sql/t-sql/statements/create-index-transact-sql?view=sql-server-ver17' },
  { id: 'include', title: 'Criar índices com colunas incluídas', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/create-indexes-with-included-columns?view=sql-server-ver17' },
  { id: 'computed', title: 'Índices em colunas calculadas', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/indexes-on-computed-columns?view=sql-server-ver17' },
  { id: 'operators', title: 'Referência dos operadores de Showplan', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/showplan-logical-and-physical-operators-reference?view=sql-server-ver17' },
  { id: 'plans', title: 'Planos estimados, reais e estatísticas ao vivo', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/performance/display-and-save-execution-plans?view=sql-server-ver17' },
  { id: 'actual', title: 'Exibir o plano de execução real no SSMS', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/performance/display-an-actual-execution-plan?view=sql-server-ver17' },
  { id: 'processing', title: 'Arquitetura de processamento de consultas', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/query-processing-architecture-guide?view=sql-server-ver17' },
  { id: 'joins', title: 'Junções e algoritmos de JOIN', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/performance/joins?view=sql-server-ver17' },
  { id: 'pkfk', title: 'Restrições PRIMARY KEY e FOREIGN KEY', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver17' },
  { id: 'filtered', title: 'Criar índices filtrados', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/create-filtered-indexes?view=sql-server-ver17' },
  { id: 'unique', title: 'Criar índices exclusivos (UNIQUE)', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/create-unique-indexes?view=sql-server-ver17' },
  { id: 'types', title: 'Catálogo de tipos de índices', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/indexes?view=sql-server-ver17' },
  { id: 'columnstore', title: 'Visão geral dos índices columnstore', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/columnstore-indexes-overview?view=sql-server-ver17' },
  { id: 'memory', title: 'Índices de tabelas com otimização de memória', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/in-memory-oltp/indexes-for-memory-optimized-tables?view=sql-server-ver17' },
  { id: 'hash', title: 'Diagnóstico de índices hash em tabelas em memória', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/in-memory-oltp/hash-indexes-for-memory-optimized-tables?view=sql-server-ver17' },
  { id: 'fill', title: 'Fill factor e divisões de páginas', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/specify-fill-factor-for-an-index?view=sql-server-ver17' },
  { id: 'stats', title: 'Estatísticas, densidade e histogramas', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/statistics/statistics?view=sql-server-ver17' },
  { id: 'psp', title: 'Otimização de planos sensíveis a parâmetros', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/performance/parameter-sensitive-plan-optimization?view=sql-server-ver17' },
  { id: 'maintenance', title: 'Manutenção de índices orientada ao desempenho', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/reorganize-and-rebuild-indexes?view=sql-server-ver17' },
  { id: 'io', title: 'SET STATISTICS IO — leituras de páginas', url: 'https://learn.microsoft.com/pt-br/sql/t-sql/statements/set-statistics-io-transact-sql?view=sql-server-ver17' },
  { id: 'slow', title: 'Investigar consultas lentas no SQL Server', url: 'https://learn.microsoft.com/pt-br/troubleshoot/sql/database-engine/performance/troubleshoot-slow-running-queries' },
  { id: 'missing', title: 'Avaliar sugestões de índices ausentes', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/indexes/tune-nonclustered-missing-index-suggestions?view=sql-server-ver17' },
  { id: 'query-store', title: 'Monitorar desempenho com Query Store', url: 'https://learn.microsoft.com/pt-br/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store?view=sql-server-ver17' }
];

export const lessons = [
  {
    id: 'livro', kind: 'book', title: 'Encontre a página certa', shortTitle: 'O índice de um livro', kicker: 'UMA IDEIA FAMILIAR', duration: '8 min',
    description: 'Antes de pensar em SQL, pense em um livro de mil páginas. Como você encontraria todas as referências a uma palavra?',
    concepts: [
      { title: 'Ler tudo ou consultar um catálogo?', text: 'Sem um índice remissivo, você pode abrir cada página e procurar a palavra. Com ele, encontra uma entrada ordenada e segue os números das páginas. O ganho depende de quantas páginas precisa visitar: uma referência rara favorece o catálogo; ler quase o livro inteiro pode favorecer a leitura contínua.' },
      { title: 'O índice guarda informação de verdade', text: 'A entrada do livro contém uma cópia da palavra e as referências às páginas. Um índice não clusterizado também guarda valores de suas colunas e um localizador da linha. Ele ocupa espaço e precisa acompanhar mudanças nos dados; não é apenas um atalho gratuito.' },
      { title: 'Do livro para a tabela', text: 'Imagine um cadastro com Id, Nome, UF, Email e DataCadastro. Um catálogo por UF pode localizar clientes de SP sem procurar esse valor em todas as linhas. Se o catálogo não tiver Nome, ainda será necessário visitar a linha original para ler esse dado.', code: "SELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'SP';" },
      { title: 'Onde a analogia termina', text: 'Uma página de banco comporta várias linhas. O catálogo do SQL Server pode ter vários níveis, ficar em memória e ser percorrido parcialmente. O otimizador escolhe entre caminhos disponíveis. Nos simuladores, caixas e contadores simplificam esse processo; eles não reproduzem o mecanismo de armazenamento.' }
    ],
    experiment: 'Escolha um assunto e percorra as páginas passo a passo. Depois selecione o índice remissivo e compare quantas páginas do livro foram visitadas nos dois caminhos.',
    quiz: { question: 'O que mais se parece com um índice não clusterizado?', options: ['O texto completo do livro reimpresso em cada entrada.', 'Um catálogo ordenado de termos com referências às páginas.', 'Uma regra que impede qualquer leitura de página.'], answer: 1, explanation: 'Ele mantém valores organizados e uma forma de chegar à linha base. Algumas colunas adicionais podem estar copiadas no próprio índice.' },
    sourceIds: ['design', 'cluster']
  },
  {
    id: 'arvore', kind: 'tree', title: 'Uma árvore de caixinhas', shortTitle: 'B-tree e B+ tree', kicker: 'POR DENTRO DA ESTRUTURA', duration: '12 min',
    description: 'Desça da raiz até uma folha e descubra por que o índice consegue descartar tantos caminhos de uma vez.',
    concepts: [
      { title: 'Uma árvore com muitos caminhos', text: 'Os índices rowstore em disco do SQL Server usam B+ trees, frequentemente chamadas de B-trees em conversas sobre planos. Uma raiz e níveis intermediários direcionam a busca por valores ordenados. As folhas contêm os dados correspondentes ao tipo do índice. Não é uma árvore binária: uma página pode apontar para muitas outras.' },
      { title: 'Níveis pequenos, folhas numerosas', text: 'A árvore balanceada mantém as folhas à mesma profundidade. Para procurar Id = 9, as faixas de chave permitem escolher um filho em cada nível. Essa descida custa visitas às páginas do caminho; depois ainda pode ser necessário ler várias páginas de folhas para retornar um intervalo.' },
      { title: 'Igualdade e intervalo', text: 'Um seek pode encontrar a primeira chave de uma faixa e então avançar pelas folhas encadeadas. Buscar de 5 até 12 não significa fazer uma descida completa para cada número. Ordenação e ligações entre folhas ajudam na leitura contínua da faixa.', code: 'SELECT Id, Nome\nFROM dbo.Cliente\nWHERE Id >= 5 AND Id < 13\nORDER BY Id;' },
      { title: 'Página não é linha', text: 'No armazenamento tradicional, uma página tem 8 KiB e pode comportar várias linhas, dependendo da largura. Altura da árvore, densidade e quantidade de páginas alcançadas afetam o trabalho. Por isso, contar somente linhas ou afirmar que todo seek custa uma leitura leva a conclusões erradas.' }
    ],
    experiment: 'Escolha um Id e avance um nível por vez. Observe a faixa selecionada na raiz, o ponteiro intermediário e a linha encontrada na folha. Recomece com um Id de outra página.',
    quiz: { question: 'Um Index Seek por intervalo sempre lê apenas uma linha?', options: ['Sim, seek significa exatamente uma linha.', 'Não. Ele pode localizar o início e ler muitas linhas ou páginas da faixa.', 'Não, porque B+ trees só permitem varreduras completas.'], answer: 1, explanation: 'Seek descreve a forma de encontrar uma região do índice. A região pode conter de zero a milhões de linhas.' },
    sourceIds: ['design', 'operators']
  },
  {
    id: 'clusterizado', kind: 'storage', title: 'Quando a folha é a própria tabela', shortTitle: 'Índice clusterizado', kicker: 'UMA ORGANIZAÇÃO PARA OS DADOS', duration: '12 min',
    description: 'Organize o livro principal e diferencie o armazenamento da tabela das regras de identidade de uma linha.',
    concepts: [
      { title: 'A folha contém a linha base', text: 'No índice clusterizado rowstore, as folhas são as páginas de dados da tabela. Nesse modelo não há uma segunda cópia completa da tabela atrás delas. Existe apenas um índice clusterizado por tabela, pois as linhas base têm uma organização lógica por chave.' },
      { title: 'PRIMARY KEY é uma restrição', text: 'PRIMARY KEY garante identidade e unicidade, além de exigir valores não nulos. Ela é apoiada por um índice único, que pode ser NONCLUSTERED. É possível escolher outra chave para o índice clusterizado. No cadastro desta aula, usamos Id como PRIMARY KEY CLUSTERED por simplicidade.', code: 'CREATE TABLE dbo.Cliente (\n    Id int NOT NULL,\n    Nome nvarchar(100) NOT NULL,\n    UF char(2) NOT NULL,\n    Email varchar(180) NOT NULL,\n    DataCadastro datetime2(0) NOT NULL,\n    Observacao varchar(800) NOT NULL,\n    CONSTRAINT PK_Cliente PRIMARY KEY CLUSTERED (Id)\n);' },
      { title: 'Sem clustered: um heap', text: 'Uma tabela rowstore sem índice clusterizado é um heap, mesmo que possua índices não clusterizados. Linhas do heap podem ser localizadas por RID: arquivo, página e posição. Heaps podem ser úteis em cargas de staging; alterações que movem linhas podem deixar encaminhamentos e aumentar leituras.' },
      { title: 'Escolher a chave tem consequências', text: 'Uma chave curta, estável e única costuma ser uma boa candidata. Ela também participa dos localizadores dos índices não clusterizados. A ordem do índice é lógica: não significa páginas fisicamente consecutivas nem garante a ordem de um SELECT. Para pedir uma ordem no resultado, use ORDER BY.' }
    ],
    pitfalls: ['Um UNIQUEIDENTIFIER aleatório não é automaticamente proibido; avalie largura, padrão de inserção e necessidade do negócio.', 'Uma chave crescente reduz inserções no meio da árvore, mas concorrência intensa na última página pode exigir investigação específica.'],
    experiment: 'Alterne heap e clustered. Observe onde fica a linha completa e o que muda no localizador usado pelo índice auxiliar.',
    quiz: { question: 'Toda PRIMARY KEY precisa ser o índice clusterizado?', options: ['Sim, são dois nomes para a mesma coisa.', 'Não. A PRIMARY KEY pode ser apoiada por um índice único não clusterizado.', 'Não, porque PRIMARY KEY não usa índice.'], answer: 1, explanation: 'Restrição lógica e organização física são decisões relacionadas, mas diferentes. É possível declarar PRIMARY KEY NONCLUSTERED e escolher outra chave clustered.' },
    sourceIds: ['cluster', 'heap', 'pkfk', 'unique']
  },
  {
    id: 'nao-clusterizado', kind: 'copies', title: 'Vários catálogos, uma tabela base', shortTitle: 'Índice não clusterizado', kicker: 'CÓPIAS PEQUENAS E SEPARADAS', duration: '10 min',
    description: 'Veja UF e Nome virarem caixas independentes, cada uma organizada de um jeito e ligada à mesma linha original.',
    concepts: [
      { title: 'Uma árvore por caminho de acesso', text: 'Um índice não clusterizado rowstore é uma estrutura separada. Seu nível folha guarda valores das chaves, o localizador e eventuais colunas incluídas. Um índice por UF e outro por Nome são dois catálogos independentes; criar um não reorganiza o outro.' },
      { title: 'A referência muda com a base', text: 'Se a tabela tem clustered, o localizador usa a chave clustered. Se a tabela é heap, usa RID. Com Id como chave clustered, o catálogo por UF já consegue identificar Id sem precisar escrever INCLUDE (Id). Detalhes internos dependem também de a chave ser única.' },
      { title: 'Uma cópia parcial', text: 'IX_Cliente_UF não contém automaticamente Nome, Email e DataCadastro. Ele guarda o necessário para sua definição e localização. Uma consulta que pede somente Id e UF pode ser coberta. Ao pedir Email, talvez seja preciso visitar a base ou escolher outro caminho.', code: "CREATE INDEX IX_Cliente_UF\nON dbo.Cliente (UF);\n\nSELECT Id, UF\nFROM dbo.Cliente\nWHERE UF = 'SP';" },
      { title: 'Unicidade não vem do nome do índice', text: 'CREATE INDEX não implica UNIQUE. Se vários clientes são de SP, haverá várias entradas correspondentes. Um índice único em Email tem outra função: rejeitar duplicidades segundo as regras de comparação. Se o requisito permite vários valores nulos, um UNIQUE filtrado por Email IS NOT NULL pode expressar essa intenção.' }
    ],
    experiment: 'Escolha uma linha no seletor e encontre seu destaque nos três catálogos. Compare as colunas de cada caixa e ative INCLUDE (Nome) para observar a nova cópia na folha.',
    quiz: { question: 'Com clustered em Id, o que o índice não clusterizado em UF precisa para chegar à linha?', options: ['Uma cópia obrigatória de todas as colunas.', 'Um localizador baseado na chave clustered Id.', 'O número da linha mostrado pelo SSMS.'], answer: 1, explanation: 'O localizador faz a ligação com a base. Id já está disponível como chave clustered; ele não é um número de posição no resultado.' },
    sourceIds: ['cluster', 'create', 'unique']
  },
  {
    id: 'seek-scan', kind: 'access', title: 'Procurar uma faixa ou percorrer páginas', shortTitle: 'Seek e scan', kicker: 'LEIA O CAMINHO, NÃO O RÓTULO', duration: '12 min',
    description: 'Compare a navegação por chave com uma varredura e entenda por que um scan pode ser a melhor escolha.',
    concepts: [
      { title: 'Seek localiza uma região', text: 'Index Seek navega em um índice não clusterizado; Clustered Index Seek navega no clustered. Ele usa condições de busca compatíveis com a chave. Encontrar uma região pequena pode economizar muito trabalho, mas a faixa localizada ainda pode ser enorme.' },
      { title: 'Scan também pode usar índice', text: 'Index Scan percorre entradas de um índice não clusterizado. Clustered Index Scan percorre a base organizada como clustered. Table Scan aparece em heaps. Portanto, ver scan no plano não permite concluir que o índice foi ignorado.' },
      { title: 'Ler menos colunas também ajuda', text: 'Para COUNT(*) sem filtro, um índice estreito pode oferecer menos páginas que a tabela inteira. O plano pode escolher percorrê-lo, pois precisa contar muitas entradas. Um scan estreito e sequencial pode ser mais barato que procurar e fazer milhares de acessos à base.', code: 'SELECT COUNT(*) AS Quantidade\nFROM dbo.Cliente;\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE Id = 9;' },
      { title: 'Busca e filtro residual', text: 'Seek Predicates delimitam a região percorrida. Predicate pode testar uma condição residual sobre as linhas encontradas. Se o operador lê 20 mil linhas e devolve 20, o seek pode estar pouco seletivo ou filtrar muito depois da navegação. Compare linhas lidas, retornadas e número de execuções.' }
    ],
    experiment: 'Escolha uma UF e avance pelas leituras em Index Seek. Recomece com Clustered Index Scan e compare as entradas visitadas com as linhas encontradas. Repita com uma UF que tenha menos correspondências.',
    quiz: { question: 'Qual evidência é melhor que simplesmente procurar a palavra Seek?', options: ['O ícone do operador estar verde.', 'Leituras, linhas lidas e retornadas, estimativas e custo total da consulta.', 'O nome do índice conter a palavra rápido.'], answer: 1, explanation: 'O desempenho depende do trabalho realizado por todo o plano. Tanto seeks quanto scans podem ser adequados ou custosos.' },
    sourceIds: ['operators', 'io', 'slow']
  },
  {
    id: 'key-lookup', kind: 'lookup', title: 'Achei a referência. Falta buscar o dado.', shortTitle: 'O Key Lookup', kicker: 'O SEGUNDO PASSEIO', duration: '12 min',
    description: 'Siga a entrada de UF até a linha completa e veja quando repetir esse percurso se torna caro.',
    concepts: [
      { title: 'UF está aqui; Nome ficou na base', text: 'Com IX_Cliente_UF, o mecanismo pode encontrar os Ids dos clientes de SP. Se o índice não tem Nome, uma opção é consultar a linha clustered para cada localizador. Esse acesso aparece como Key Lookup. Em heap, o operador equivalente de localização é RID Lookup.', code: "-- Supondo IX_Cliente_UF em (UF)\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'SP';" },
      { title: 'Por que aparece Nested Loops?', text: 'No plano típico, o acesso ao índice fornece localizadores ao Nested Loops, que aciona os lookups na base. Observe a quantidade de execuções do lookup: poucas linhas podem tornar essa estratégia econômica; milhares podem multiplicar leituras, CPU e acessos às páginas.' },
      { title: 'Não é um erro por definição', text: 'Para uma busca rara, manter o índice pequeno e fazer poucos lookups pode ser uma boa troca. O problema é um trabalho repetido que pesa no contexto real. Se muitas linhas precisam de muitas colunas da base, o otimizador pode preferir um scan do clustered.' },
      { title: 'O SELECT participa da decisão', text: 'Trocar SELECT Id, UF por SELECT * aumenta as informações necessárias. Uma consulta antes coberta pode passar a exigir lookup ou outro acesso. Também pode haver condições residuais avaliadas durante o lookup, fazendo chegar menos linhas ao resultado do que foram procuradas.' }
    ],
    experiment: 'A consulta já pede Nome, ausente no índice inicial. Avance pelos localizadores e conte as visitas à base. Troque a UF para variar o número de correspondências e compare o percurso com INCLUDE (Nome).',
    quiz: { question: 'Quando um Key Lookup merece atenção?', options: ['Sempre: um lookup comprova um índice incorreto.', 'Quando muitas execuções e leituras tornam esse caminho caro para a carga real.', 'Somente quando a tabela é um heap.'], answer: 1, explanation: 'O lookup pode ser barato para poucas linhas. O diagnóstico deve considerar repetições, leituras e alternativas. Em heap, procure RID Lookup.' },
    sourceIds: ['operators', 'heap', 'slow']
  },
  {
    id: 'include', kind: 'include', title: 'Leve a resposta para dentro do catálogo', shortTitle: 'INCLUDE e cobertura', kicker: 'MENOS IDAS À BASE', duration: '14 min',
    description: 'Copie Nome para a folha do índice e acompanhe a remoção do segundo percurso nesta consulta.',
    concepts: [
      { title: 'Chave guia; INCLUDE carrega', text: 'A chave do índice define sua organização e os caminhos de navegação. INCLUDE acrescenta valores às folhas sem transformá-los em chaves de ordenação. UF continua guiando a busca; Nome acompanha a entrada para ser retornado.', code: "CREATE INDEX IX_Cliente_UF_Coberto\nON dbo.Cliente (UF)\nINCLUDE (Nome);\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'SP';" },
      { title: 'Cobertura é uma relação com a consulta', text: 'Um índice cobre uma consulta quando contém os valores necessários para executá-la sem visitar a base. Aqui, UF é chave, Nome é incluído e Id é o localizador clustered. Se a consulta também pedir Email, essa mesma definição deixa de ser suficiente.' },
      { title: 'Incluir não ordena', text: 'INCLUDE (Nome) não equivale à chave (UF, Nome). Para WHERE UF = SP ORDER BY Nome, uma chave composta pode oferecer uma ordem útil; incluir Nome por si só não fornece essa ordem. Uma coluna incluída pode ser avaliada como filtro, mas não cria uma navegação ordenada por ela.' },
      { title: 'Cobrir tudo tem preço', text: 'Cada valor incluído aumenta a folha, podendo gerar mais páginas e trabalho de escrita. Se Nome muda, sua cópia precisa mudar. Escolha a menor cobertura útil ao conjunto de consultas e compare o ganho com espaço, memória e manutenção. A ordem dos nomes dentro de INCLUDE não muda a ordenação do índice.' }
    ],
    experiment: 'Compare o percurso com e sem INCLUDE (Nome). Depois ative SELECT *: Email e DataCadastro passam a ser necessários, e a consulta volta a exigir valores da base.',
    quiz: { question: 'O que INCLUDE (Nome) acrescenta a um índice cuja chave é UF?', options: ['Uma nova ordenação global por Nome.', 'Nome nas folhas, ajudando a cobrir consultas que precisam desse valor.', 'Um segundo índice clusterizado na tabela.'], answer: 1, explanation: 'Nome fica disponível na folha, mas não vira uma chave para navegar ou garantir ordenação por Nome.' },
    sourceIds: ['include', 'create']
  },
  {
    id: 'compostos', kind: 'composite', title: 'Primeiro o estado. Depois o nome.', shortTitle: 'Índices compostos', kicker: 'A ORDEM DAS CHAVES IMPORTA', duration: '14 min',
    description: 'Organize as mesmas fichas por UF e Nome e troque a ordem para descobrir quais buscas ficam fáceis.',
    concepts: [
      { title: 'Como uma lista telefônica com grupos', text: 'Em (UF, Nome), a ordem é primeiro por UF e, dentro de cada UF, por Nome. Em (Nome, UF), a prioridade se inverte. As definições contêm as mesmas colunas, mas oferecem caminhos diferentes. A ordem escrita das condições no WHERE não altera a ordem das chaves do índice.' },
      { title: 'Igualdade abre caminho para a próxima chave', text: 'Com UF fixa, a região de SP fica contígua e Nome pode delimitar uma faixa dentro dela. Consultar somente Nome geralmente não permite um seek direto pelo prefixo ausente de UF; o índice ainda pode ser útil para um scan ou como cobertura.', code: "CREATE INDEX IX_Cliente_UF_Nome\nON dbo.Cliente (UF, Nome)\nINCLUDE (Email);\n\nSELECT Nome, Email\nFROM dbo.Cliente\nWHERE UF = 'SP' AND Nome LIKE N'Ana%'\nORDER BY Nome;" },
      { title: 'Faixa pode limitar o uso das próximas chaves', text: 'Depois de uma condição de intervalo, as colunas seguintes frequentemente ajudam menos a estreitar a navegação e podem virar filtros residuais. Isso depende das condições e do plano. A ideia igualdade, depois intervalo e ordenação é um ponto de partida para testar, não uma regra universal de projeto.' },
      { title: 'ORDER BY também entra no desenho', text: 'A direção ASC ou DESC das chaves pode ser relevante, especialmente com ordens mistas. O SQL Server também pode percorrer um índice para trás. Escolha a definição olhando filtros, joins, ordem, projeção e distribuição juntos; colocar sempre a coluna mais seletiva primeiro pode prejudicar outros requisitos.' }
    ],
    experiment: 'Troque (UF, Nome) por (Nome, UF). Teste uma condição em UF, outra somente em Nome e uma combinação de igualdade com prefixo.',
    quiz: { question: 'Por que (UF, Nome) difere de (Nome, UF)?', options: ['Porque o primeiro aceita somente valores únicos.', 'Porque o agrupamento e a ordem de navegação começam por chaves diferentes.', 'Porque INCLUDE deixa de funcionar no segundo.'], answer: 1, explanation: 'A primeira chave define os grupos principais. Sem restringi-la, uma condição na segunda pode não delimitar uma única região navegável.' },
    sourceIds: ['design', 'create', 'processing']
  },
  {
    id: 'sargabilidade', kind: 'sarg', title: 'Deixe o índice reconhecer a pergunta', shortTitle: 'Funções e SARGabilidade', kicker: 'A FORMA DO PREDICADO', duration: '16 min',
    description: 'Compare expressões aplicadas à coluna com condições que descrevem diretamente uma região ordenada.',
    concepts: [
      { title: 'A árvore está ordenada pelo valor original', text: 'Um índice em DataCadastro conhece datas, não uma árvore independente de resultados de YEAR. WHERE YEAR(DataCadastro) = 2026 costuma impedir uma busca direta por essa chave. O SQL Server pode percorrer o próprio índice e calcular a função; usar scan ainda é usar um índice.', code: "-- Compare os planos sobre um índice em DataCadastro\nSELECT Id FROM dbo.Cliente\nWHERE YEAR(DataCadastro) = 2026;\n\nSELECT Id FROM dbo.Cliente\nWHERE DataCadastro >= '20260101'\n  AND DataCadastro <  '20270101';" },
      { title: 'Intervalo semiaberto evita armadilhas de horário', text: 'O limite inicial inclusivo e o final exclusivo representam todo o ano sem adivinhar o último horário possível. BETWEEN inclui os dois limites: usar o último dia à meia-noite deixaria de fora os horários posteriores desse dia. Prefira parâmetros com tipos compatíveis com a coluna.' },
      { title: 'Prefixo e trecho interno são perguntas diferentes', text: 'Nome LIKE N\'Ana%\' pode delimitar uma faixa no índice por Nome, conforme a comparação. Nome LIKE N\'%ana\' geralmente exige examinar valores, pois não informa o início. UPPER(Nome), contas, ISNULL e conversões na coluna também merecem inspeção; simplificações e exceções do otimizador impedem afirmar que toda função sempre bloqueia seeks.' },
      { title: 'Tipo e collation importam', text: 'Uma conversão implícita aplicada à coluna pode prejudicar a busca, dependendo dos tipos e da collation. Procure CONVERT_IMPLICIT e avisos no plano. Não remova UPPER automaticamente: em collation sensível a maiúsculas isso pode mudar a resposta. Preserve a semântica antes de otimizar.' }
    ],
    pitfalls: ['Predicado SARGable torna um caminho possível; não obriga o otimizador a escolhê-lo.', 'Adicionar uma função ao SELECT é diferente de aplicá-la à chave usada no WHERE.'],
    experiment: 'Alterne YEAR, intervalo e LIKE com diferentes posições de %. Compare a região que cada condição consegue delimitar e as linhas que precisam ser examinadas.',
    quiz: { question: 'Qual reescrita representa corretamente o ano de 2026 em datetime2?', options: ["DataCadastro BETWEEN '20260101' AND '20261231'", "DataCadastro >= '20260101' AND DataCadastro < '20270101'", 'YEAR(DataCadastro) > 2026'], answer: 1, explanation: 'O intervalo semiaberto inclui todos os horários de 2026 e exclui o início de 2027, sem depender da precisão temporal.' },
    sourceIds: ['processing', 'operators', 'slow', 'computed']
  },
  {
    id: 'calculadas', kind: 'computed', title: 'Crie um catálogo para o resultado da expressão', shortTitle: 'Coluna calculada indexada', kicker: 'QUANDO REESCREVER NÃO BASTA', duration: '15 min',
    description: 'Materialize uma ideia de busca, como o ano do cadastro, e veja o valor calculado entrar em uma nova árvore.',
    concepts: [
      { title: 'Um valor derivado pode virar chave', text: 'Se o sistema pesquisa repetidamente por uma expressão, uma coluna calculada indexável permite organizar o resultado. AnoCadastro é derivado de DataCadastro. Para buscar um ano inteiro, o intervalo na data continua sendo uma alternativa simples; a coluna calculada é uma opção a comparar. No SSMS, GO separa os batches para compilar as referências à coluna depois de sua criação; GO não é uma instrução Transact-SQL.', code: 'ALTER TABLE dbo.Cliente\nADD AnoCadastro AS YEAR(DataCadastro) PERSISTED;\nGO\n\nCREATE INDEX IX_Cliente_AnoCadastro\nON dbo.Cliente (AnoCadastro)\nINCLUDE (Nome);\nGO\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE AnoCadastro = 2026;' },
      { title: 'PERSISTED e índice são coisas diferentes', text: 'PERSISTED armazena o resultado na linha base. Um índice em coluna calculada armazena sua chave no próprio índice. PERSISTED não é obrigatório para toda expressão indexável; foi usado aqui para tornar a cópia visível na explicação. Há requisitos e casos especiais, incluindo expressões CLR.' },
      { title: 'A expressão precisa ser elegível', text: 'Verifique determinismo, precisão, tipo resultante e propriedade das funções. A expressão depende de colunas da própria linha; não pode consultar outras linhas para formar uma chave calculada comum. GETDATE() não produz um resultado estável. Expressões com float/real e conversões de datas exigem cuidados específicos.' },
      { title: 'SET também faz parte do contrato', text: 'As conexões envolvidas precisam das opções exigidas. Use ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL e QUOTED_IDENTIFIER em ON; NUMERIC_ROUNDABORT em OFF. Opções incompatíveis podem fazer o SELECT ignorar esse índice ou impedir alterações dos dados.', code: 'SET ANSI_NULLS ON;\nSET ANSI_PADDING ON;\nSET ANSI_WARNINGS ON;\nSET ARITHABORT ON;\nSET CONCAT_NULL_YIELDS_NULL ON;\nSET QUOTED_IDENTIFIER ON;\nSET NUMERIC_ROUNDABORT OFF;' }
    ],
    pitfalls: ['O otimizador pode reconhecer uma expressão equivalente e usar o índice calculado; confirme no plano, em vez de prometer esse reconhecimento.', 'Cada INSERT e alteração das colunas dependentes também mantém o valor indexado.'],
    experiment: 'Alterne entre a função na coluna original, o intervalo de datas e a coluna calculada indexada. Escolha anos diferentes e compare a chave de cada caixa, as entradas candidatas e as linhas encontradas.',
    quiz: { question: 'PERSISTED é obrigatório em todo índice sobre coluna calculada?', options: ['Sim, sem exceção.', 'Não. A elegibilidade depende da expressão e dos requisitos documentados.', 'Não, porque qualquer expressão, incluindo GETDATE(), pode ser indexada.'], answer: 1, explanation: 'Muitas expressões determinísticas e precisas podem ser indexadas sem PERSISTED. Há outras restrições e casos especiais que precisam ser verificados.' },
    sourceIds: ['computed', 'create']
  },
  {
    id: 'planos', kind: 'plan', title: 'Leia a história que o plano conta', shortTitle: 'Planos de execução', kicker: 'EVIDÊNCIAS EM CADA OPERADOR', duration: '16 min',
    description: 'Abra as propriedades dos operadores e conecte o caminho das linhas às escolhas do otimizador.',
    concepts: [
      { title: 'Compilar não é executar', text: 'O plano estimado mostra a estratégia compilada, sem executar a consulta. O plano real acrescenta informações da execução ao plano compilado, como contagens de linhas e avisos. Real não significa que todos os números viraram medições: percentuais de custo continuam sendo estimativas.' },
      { title: 'Acompanhe as linhas e a solicitação', text: 'No plano gráfico comum do SSMS, as linhas fluem da direita para a esquerda, dos acessos em direção ao SELECT. A solicitação de trabalho dos iteradores parte do consumidor para os filhos. Ramos de JOIN, paralelismo e operadores bloqueantes tornam a leitura mais rica que uma sequência linear.' },
      { title: 'O nome não conta a história inteira', text: 'Clique no acesso e veja Object, Output List, Seek Predicates e Predicate. Compare Estimated Number of Rows com Actual Number of Rows e Number of Rows Read, quando disponíveis. Confira Number of Executions em lookups. Um Sort, um spill ou um desvio grande de cardinalidade pode pesar mais que o acesso inicial.' },
      { title: 'Colete o plano junto das leituras', text: 'No SSMS, habilite Incluir Plano de Execução Real e execute a consulta. STATISTICS IO mede leituras de páginas; TIME ajuda a comparar CPU e tempo decorrido. Salve o plano .sqlplan para análise. Os diagramas desta aula são modelos explicativos e não foram capturados de uma instância real.', code: "SET STATISTICS IO ON;\nSET STATISTICS TIME ON;\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'SP';\n\nSET STATISTICS IO OFF;\nSET STATISTICS TIME OFF;" }
    ],
    experiment: 'Clique em cada operador do plano. Compare estimado e real e identifique quais condições guiam a busca, quais filtram depois e onde acontece o lookup.',
    quiz: { question: 'Um operador aparece com 80% do custo no plano real. Isso significa que mediu 80% do tempo?', options: ['Sim, o plano real substitui todos os custos por cronômetros.', 'Não. Esse percentual continua baseado no modelo estimado de custo.', 'Sim, desde que o operador seja um seek.'], answer: 1, explanation: 'Use informações reais de execução, leituras e tempos junto do plano. Percentuais de custo ajudam a investigar, mas não são participação medida no tempo.' },
    sourceIds: ['plans', 'actual', 'operators', 'io']
  },
  {
    id: 'clausulas', kind: 'clauses', title: 'O índice participa além do WHERE', shortTitle: 'JOIN, ORDER BY e GROUP BY', kicker: 'CADA PARTE DA CONSULTA CONTA', duration: '16 min',
    description: 'Conecte filtros, junções, ordenação, agregações e projeção ao desenho do índice.',
    concepts: [
      { title: 'WHERE reduz; SELECT pede valores', text: 'Condições de busca delimitam regiões e filtros descartam linhas. A projeção determina quais valores precisam estar disponíveis. Se a chave não carrega todas as colunas necessárias, INCLUDE ou acessos à base entram na comparação. Um índice precisa servir à consulta completa.' },
      { title: 'JOIN pode procurar muitas vezes', text: 'Para poucos clientes, Nested Loops pode buscar seus pedidos repetidamente em um índice por ClienteId. Merge Join pode aproveitar entradas ordenadas; Hash Join pode ser adequado para grandes conjuntos. Criar índice não obriga um algoritmo específico. A FOREIGN KEY em Pedido.ClienteId não cria esse índice automaticamente no SQL Server.', code: "CREATE INDEX IX_Pedido_Cliente_Data\nON dbo.Pedido (ClienteId, DataPedido)\nINCLUDE (Total);\n\nSELECT c.Nome, p.DataPedido, p.Total\nFROM dbo.Cliente AS c\nJOIN dbo.Pedido AS p ON p.ClienteId = c.Id\nWHERE c.Id = 9\n  AND p.DataPedido >= '20260101'\nORDER BY p.DataPedido;" },
      { title: 'ORDER BY e TOP podem economizar trabalho', text: 'Um índice alinhado com filtros e ordem pode evitar Sort e permitir encontrar os primeiros resultados cedo. Isso precisa ser confirmado no plano: joins e paralelismo podem alterar propriedades de ordem. Para resultados estáveis em empates, inclua um desempate no ORDER BY.' },
      { title: 'GROUP BY e agregações também aproveitam ordem', text: 'Entradas ordenadas por ClienteId podem favorecer Stream Aggregate; outras condições podem levar a Hash Aggregate. SUM precisa de Total, que pode estar incluído. COUNT(*) pode percorrer uma estrutura estreita. A ordem das linhas agrupadas no resultado continua exigindo ORDER BY.', code: 'SELECT ClienteId, SUM(Total) AS TotalComprado\nFROM dbo.Pedido\nGROUP BY ClienteId\nORDER BY ClienteId;' }
    ],
    experiment: 'Alterne entre filtro, ordenação, junção e agrupamento. Identifique qual coluna localiza, qual fornece ordem e qual só carrega o valor necessário.',
    quiz: { question: 'Criar uma FOREIGN KEY em Pedido.ClienteId cria automaticamente um índice nessa coluna?', options: ['Sim, sempre.', 'Não. Um índice útil para joins e verificações deve ser avaliado e criado separadamente.', 'Somente quando o nome termina em Id.'], answer: 1, explanation: 'O SQL Server não cria automaticamente um índice para a FOREIGN KEY. A restrição garante integridade; o índice é uma decisão de acesso.' },
    sourceIds: ['joins', 'pkfk', 'processing', 'operators']
  },
  {
    id: 'seletividade', kind: 'selectivity', title: 'Quantas referências esse termo tem?', shortTitle: 'Seletividade e custo', kicker: 'A DISTRIBUIÇÃO MUDA A ESCOLHA', duration: '12 min',
    description: 'Compare uma UF rara com uma muito frequente e descubra por que o mesmo índice não ganha em todas as situações.',
    concepts: [
      { title: 'Não basta contar valores distintos', text: 'Uma coluna pode ter 27 UFs e ainda ser útil se a consulta retorna uma pequena parte da tabela. Também pode ser pouco útil para uma UF dominante. Seletividade deve ser entendida no contexto do predicado e da distribuição, não como uma etiqueta permanente de uma coluna.' },
      { title: 'O ponto de troca não é uma porcentagem fixa', text: 'O custo de seek com lookups cresce com as linhas estimadas e as páginas acessadas. Um scan da base pode ganhar quando muitas referências exigem muitos dados. Largura da linha, cobertura, cache e concorrência influenciam a comparação. Não existe regra universal do tipo acima de 20% sempre scan.' },
      { title: 'Cobertura altera a comparação', text: 'Se o índice já contém Nome, o custo de buscar esse valor na base desaparece nesta consulta. Uma busca menos seletiva pode continuar vantajosa em uma estrutura menor. Acrescentar cobertura também torna o índice mais largo: compare ambos os efeitos.', code: "SELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'AC';\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = 'SP';" },
      { title: 'Valor de parâmetro também importa', text: 'Uma consulta parametrizada pode reutilizar um plano compilado para outra distribuição. O mesmo caminho pode ser ótimo para AC e ruim para SP. Isso é uma possível sensibilidade a parâmetros, não prova de que o SQL Server esqueceu o índice. Observe estimativas e histórico antes de aplicar hints.' }
    ],
    experiment: 'Varie o percentual de linhas solicitado e a largura ilustrativa da tabela. Observe quando o modelo atribui menor pontuação ao seek com lookups ou ao scan. As unidades são inventadas para comparar tendências, não custos reais do SQL Server.',
    quiz: { question: 'Uma coluna com poucos valores distintos nunca deve ser indexada?', options: ['Correto: índice exige valores únicos.', 'Incorreto: distribuição, filtros, cobertura e carga podem justificar o índice.', 'Correto, a menos que ela seja int.'], answer: 1, explanation: 'Uma condição rara sobre uma coluna de baixa cardinalidade pode ser seletiva. Índices filtrados e cobertura também podem mudar o benefício.' },
    sourceIds: ['stats', 'psp', 'processing', 'include']
  },
  {
    id: 'filtrados', kind: 'filtered', title: 'Um catálogo só para o que interessa', shortTitle: 'Índices filtrados e únicos', kicker: 'MENOS LINHAS NA CAIXA', duration: '12 min',
    description: 'Separe apenas pedidos pendentes e compare essa caixa menor com um índice sobre todos os pedidos.',
    concepts: [
      { title: 'Apenas um subconjunto', text: 'O índice filtrado é um índice não clusterizado com predicado que limita as linhas presentes. Se poucos pedidos estão pendentes, manter um catálogo apenas deles pode reduzir espaço e manutenção desse caminho. Ele também tem estatísticas voltadas ao subconjunto.', code: "CREATE INDEX IX_Pedido_Pendente\nON dbo.Pedido (ClienteId, DataPedido)\nINCLUDE (Total)\nWHERE Status = 'Pendente';\n\nSELECT DataPedido, Total\nFROM dbo.Pedido\nWHERE ClienteId = 9 AND Status = 'Pendente'\nORDER BY DataPedido;" },
      { title: 'A consulta precisa caber no filtro', text: 'O otimizador precisa demonstrar que as linhas necessárias estão no subconjunto indexado. Uma consulta por todos os status não é atendida integralmente por esse catálogo. Com parâmetros, nem sempre o plano reutilizável consegue provar a condição; isso exige análise própria, sem tornar RECOMPILE uma receita universal.' },
      { title: 'UNIQUE expressa uma regra', text: 'UNIQUE impede repetir a chave indexada; pode ser clustered ou não clustered. Em um modelo que permita Email nulo, um índice UNIQUE filtrado por Email IS NOT NULL impõe unicidade apenas aos valores informados. No laboratório baixável, Email é NOT NULL: ali usamos um índice UNIQUE sem filtro.', code: '-- Variação para um modelo em que Email permita NULL:\nCREATE UNIQUE INDEX UX_Cliente_EmailInformado\nON dbo.Cliente (Email)\nWHERE Email IS NOT NULL;' },
      { title: 'Não é um WHERE arbitrário', text: 'Predicados de índices filtrados têm restrições e usam lógica de comparação simples. Não admitem qualquer função ou consulta; a expressão do filtro não pode referenciar coluna calculada. Verifique tipos, opções SET e compatibilidade antes de criar. Um índice filtrado não deve excluir linhas que a consulta precisa.' }
    ],
    experiment: 'Compare consultas por pedidos pendentes, por outros status e sem restringir o status. Observe quais linhas estão copiadas no índice filtrado e quando esse subconjunto é suficiente para a consulta.',
    quiz: { question: 'Um índice WHERE Status = Pendente contém pedidos pagos?', options: ['Sim, só muda a ordem.', 'Não. Ele mantém apenas as linhas que atendem ao filtro.', 'Sim, mas sem as colunas incluídas.'], answer: 1, explanation: 'O filtro determina as linhas presentes. Uma consulta que precisa de pedidos pagos necessita de outro caminho para essas linhas.' },
    sourceIds: ['filtered', 'unique', 'create']
  },
  {
    id: 'tipos', kind: 'types', title: 'Nem todo índice é uma árvore de linhas', shortTitle: 'B+ tree, columnstore e hash', kicker: 'ESCOLHA A FERRAMENTA PELA PERGUNTA', duration: '16 min',
    description: 'Compare estruturas para localizar uma pessoa, agregar milhões de pedidos e pesquisar um texto.',
    concepts: [
      { title: 'Rowstore B+ tree', text: 'Clustered e não clustered rowstore em disco são bons candidatos para buscas pontuais, intervalos e ordens compatíveis. UNIQUE, composto, filtrado e com INCLUDE descrevem propriedades e desenhos; não são todos estruturas físicas concorrentes com B+ tree.' },
      { title: 'Columnstore muda a disposição', text: 'Columnstore agrupa dados por coluna e por rowgroups, com compressão e recursos voltados a grandes leituras e agregações. Pode eliminar segmentos que não interessam. Clustered columnstore é armazenamento principal; nonclustered columnstore é uma estrutura adicional. Não procure a mesma navegação raiz–folha por Id do exemplo rowstore.', code: '-- Exemplo analítico: avalie o impacto na carga de escrita\nCREATE NONCLUSTERED COLUMNSTORE INDEX NCCI_Pedido_Analitico\nON dbo.Pedido (ClienteId, DataPedido, Status, Total);\n\nSELECT Status, SUM(Total) AS Total\nFROM dbo.Pedido\nGROUP BY Status;' },
      { title: 'Hash no SQL Server tem um contexto específico', text: 'Índices hash pertencem a tabelas com otimização de memória. Eles usam buckets para igualdade com a chave completa. Faixas e ordenação não são sua especialidade; colisões e valores repetidos podem formar cadeias. BUCKET_COUNT precisa ser planejado. Um Hash Match no plano é um operador e não comprova a existência de um índice hash.' },
      { title: 'Outras perguntas, outras estruturas', text: 'Full-text index atende pesquisa linguística por termos; não equivale a um índice comum que acelera qualquer LIKE. Índices XML e espaciais atendem seus respectivos tipos e métodos de consulta. Recursos dependem da versão, edição e configuração. Primeiro formule a necessidade; depois escolha uma estrutura suportada.' }
    ],
    experiment: 'Alterne rowstore, columnstore e hash. Compare como cada estrutura organiza os mesmos valores e qual pergunta ela consegue responder naturalmente.',
    quiz: { question: 'Um operador Hash Match no plano significa que a tabela tem índice hash?', options: ['Sim.', 'Não. O operador pode construir sua própria estrutura de trabalho durante a execução.', 'Sim, se houver GROUP BY.'], answer: 1, explanation: 'Operadores de junção ou agregação e índices persistidos são conceitos diferentes. Índices hash do SQL Server são específicos das tabelas em memória.' },
    sourceIds: ['types', 'columnstore', 'memory', 'hash', 'operators']
  },
  {
    id: 'escritas', kind: 'writes', title: 'Cada cópia também recebe a mudança', shortTitle: 'Escritas, splits e fill factor', kicker: 'O PREÇO DA LEITURA RÁPIDA', duration: '14 min',
    description: 'Insira e altere um cliente e veja quais caixas precisam ser mantidas na mesma operação.',
    concepts: [
      { title: 'INSERT encontra lugares em várias estruturas', text: 'Ao inserir uma linha, o SQL Server mantém a base e seus índices aplicáveis. Alterar uma coluna afeta os índices que guardam ou dependem desse valor; não é necessário mudar igualmente todo índice em todo UPDATE. DELETE remove entradas correspondentes. Há custo de CPU, log, memória e concorrência.' },
      { title: 'Mudar chave difere de mudar um dado incluído', text: 'Alterar UF pode exigir reposicionar a entrada em um índice por UF. Alterar Nome, se apenas incluído, atualiza a cópia na folha. Alterar a chave clustered pode afetar localizadores de índices não clusterizados. Isso reforça a preferência por chaves estáveis.', code: "UPDATE dbo.Cliente\nSET UF = 'MG'\nWHERE Id = 9;\n\nUPDATE dbo.Cliente\nSET Nome = N'Ana Silva'\nWHERE Id = 9;" },
      { title: 'Uma caixa cheia precisa abrir espaço', text: 'Uma inserção ou crescimento de linha em página cheia pode causar divisão de página: parte dos dados se move para outra página e as ligações são ajustadas. Isso consome recursos e pode reduzir densidade. A simulação usa poucas fichas por caixa para tornar o evento visível; páginas reais têm outra capacidade.' },
      { title: 'Fill factor não é um limite permanente', text: 'Na criação ou reconstrução, fill factor reserva espaço nas folhas. Depois as páginas podem preencher novamente. Valores menores podem aliviar certos padrões de inserção, mas aumentam páginas, leituras e memória. 0 e 100 têm o mesmo significado de ocupação máxima. Não diminua globalmente sem medir o problema.' }
    ],
    experiment: 'Escolha quantos índices auxiliares existem. Insira Karen e compare quantas estruturas ganham uma entrada. Depois restaure os dados e altere a UF de Claudio: observe quais caixas precisam mudar. A divisão de páginas pode ser explorada no capítulo de manutenção.',
    quiz: { question: 'Qual é o efeito garantido de reduzir o fill factor na reconstrução?', options: ['Eliminar permanentemente page splits.', 'Reservar espaço nas páginas folha naquele momento, com possível aumento do número de páginas.', 'Acelerar toda consulta e todo UPDATE.'], answer: 1, explanation: 'O espaço livre pode ajudar certos padrões de escrita, mas custa densidade. Ele pode ser consumido com o uso e não elimina todas as divisões.' },
    sourceIds: ['fill', 'create', 'maintenance']
  },
  {
    id: 'estatisticas', kind: 'stats', title: 'O otimizador precisa prever a quantidade', shortTitle: 'Estatísticas e parâmetros', kicker: 'O MAPA DA DISTRIBUIÇÃO', duration: '14 min',
    description: 'Compare o que o otimizador esperava com o que a execução encontrou e investigue por que os caminhos mudam.',
    concepts: [
      { title: 'Índice oferece caminho; estatística estima volume', text: 'Estatísticas descrevem a distribuição dos valores para ajudar a estimar cardinalidade. Um índice pode existir e ainda assim um scan ser escolhido. Estatísticas também podem existir sem índice. A escolha compara caminhos com base em estimativas e no modelo de custo, não em uma promessa de tempo exato.' },
      { title: 'O histograma tem uma primeira coluna', text: 'No SQL Server, o histograma é formado para a primeira coluna do objeto de estatísticas, com até 200 etapas. Estatísticas multicoluna também contêm informações de densidade sobre combinações de prefixos. A ordem de (UF, Nome) afeta o que o histograma descreve.', code: "DBCC SHOW_STATISTICS ('dbo.Cliente', 'IX_Cliente_UF_Nome');\n\n-- Faça a atualização apenas quando houver motivo observado\nUPDATE STATISTICS dbo.Cliente IX_Cliente_UF_Nome;" },
      { title: 'Estimativas erradas se propagam', text: 'Crescimento recente, distribuição irregular, correlação entre colunas e expressões podem prejudicar estimativas. Esperar 5 linhas e receber 50 mil pode tornar lookups, memória concedida e algoritmo de JOIN inadequados. Atualizar estatísticas pode ajudar, mas não corrige automaticamente toda diferença.' },
      { title: 'Um parâmetro, vários tamanhos de resposta', text: 'Planos em cache podem ser sensíveis ao valor usado na compilação. SQL Server 2022 e posteriores oferecem Parameter Sensitive Plan optimization para consultas elegíveis e configurações compatíveis, permitindo variantes de plano. Isso não elimina todo problema de parâmetros. Confirme versão, nível de compatibilidade e comportamento real.' }
    ],
    experiment: 'Simule uma carga concentrada em SP e compare a quantidade real com a estimativa que ainda usa a distribuição anterior. Atualize a estatística do modelo e observe a aproximação dos números.',
    quiz: { question: 'No objeto de estatísticas para (UF, Nome), qual coluna recebe o histograma?', options: ['Todas recebem histogramas independentes no mesmo objeto.', 'A primeira: UF.', 'A última: Nome.'], answer: 1, explanation: 'O histograma descreve a primeira coluna. Informações de densidade complementam estatísticas multicoluna, mas não são histogramas independentes para cada coluna.' },
    sourceIds: ['stats', 'psp', 'processing']
  },
  {
    id: 'manutencao', kind: 'maintenance', title: 'Mantenha o que melhora a carga real', shortTitle: 'Manutenção com evidências', kicker: 'SEM RECEITA DE PORCENTAGEM', duration: '14 min',
    description: 'Diferencie fragmentação, densidade e estatísticas e escolha intervenções pelo impacto observado.',
    concepts: [
      { title: 'Dois problemas que parecem iguais', text: 'Fragmentação lógica envolve a relação entre ordem lógica e disposição das páginas. Baixa densidade significa que os dados ocupam mais páginas do que poderiam. Elas têm efeitos diferentes. O impacto depende de como as consultas leem, do armazenamento, da memória e da carga concorrente.' },
      { title: 'Reorganizar e reconstruir têm custos', text: 'REORGANIZE atua no nível folha dos índices rowstore e é uma operação online. REBUILD recria a estrutura e pode consumir bastante CPU, log, espaço e tempo. ONLINE e RESUMABLE têm disponibilidade e restrições conforme versão, edição e operação; online não significa ausência de bloqueios em qualquer etapa.' },
      { title: 'Talvez a melhora tenha vindo da estatística', text: 'Uma reconstrução rowstore também atualiza as estatísticas de seu índice. Se o ganho veio de estimativas melhores, atualizar estatísticas pode resolver com menor custo. REORGANIZE não atualiza estatísticas automaticamente. Não atribua toda melhora depois de REBUILD à fragmentação.' },
      { title: 'Observe tamanho, uso e impacto', text: 'Use sys.dm_db_index_physical_stats com escopo e modo apropriados para investigar; varreduras detalhadas também custam recursos. Combine isso com consultas afetadas, page_count, densidade e medições antes/depois. Contadores de uso podem reiniciar com a instância: zero buscas sozinho não prova inutilidade.', code: "SELECT name, type_desc, is_unique, has_filter\nFROM sys.indexes\nWHERE object_id = OBJECT_ID(N'dbo.Cliente');\n\n-- Compare índices existentes antes de criar outro parecido.\n-- Avalie manutenção específica somente após medir o impacto." }
    ],
    pitfalls: ['Não aplique uma agenda universal baseada apenas em 5% ou 30% de fragmentação.', 'Índice sem buscas observadas pode apoiar restrições, ser sazonal ou ter janela curta de observação.'],
    experiment: 'Altere a densidade ilustrativa para visualizar o espaço livre. Depois insira a chave 15 na página cheia e observe sua divisão em duas caixas. Repare que os números das páginas não precisam ser consecutivos para manter a ordem lógica.',
    quiz: { question: 'Uma fragmentação de 35% basta para decidir um REBUILD?', options: ['Sim, sempre.', 'Não. É preciso avaliar tamanho, densidade, consultas afetadas, ganho e custo da manutenção.', 'Sim, desde que seja diariamente.'], answer: 1, explanation: 'A recomendação atual da Microsoft é orientar a manutenção por evidência de benefício para a carga, considerando vários fatores e o custo da intervenção.' },
    sourceIds: ['maintenance', 'fill', 'stats']
  },
  {
    id: 'diagnostico', kind: 'tuning', title: 'Transforme uma suspeita em comparação', shortTitle: 'Diagnóstico e medição', kicker: 'UMA HIPÓTESE POR VEZ', duration: '16 min',
    description: 'Investigue uma consulta lenta sem aceitar sugestões automáticas como ordens e sem confundir linhas com páginas.',
    concepts: [
      { title: 'Comece pela consulta e pelo problema', text: 'Registre SQL, parâmetros representativos, frequência, tempo esperado e observado. Colete plano real, leituras lógicas, CPU e tempo decorrido. Bloqueios, espera por recursos e transmissão de resultados também podem dominar; nem toda lentidão se resolve criando índice.' },
      { title: 'Leia a unidade certa', text: 'STATISTICS IO mostra leituras lógicas de páginas no cache e leituras físicas do armazenamento. Uma página pode ser visitada mais de uma vez. O campo Scan count não é simplesmente a quantidade de Table Scans do desenho. Tempo varia com cache e concorrência; compare repetições e condições equivalentes.', code: "SET STATISTICS IO ON;\nSET STATISTICS TIME ON;\n\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE DataCadastro >= '20260101'\n  AND DataCadastro < '20270101';\n\nSET STATISTICS IO OFF;\nSET STATISTICS TIME OFF;" },
      { title: 'Missing index é uma pista', text: 'Sugestões são baseadas em estimativas da otimização de uma consulta. Não definem a melhor ordem das chaves nem fazem toda a análise de custo das colunas incluídas. Podem se sobrepor e não sugerem índices filtrados ou únicos. Verifique índices existentes e consolide hipóteses antes de criar.' },
      { title: 'Valide o conjunto, não um único caso', text: 'Teste diferentes parâmetros, quantidade de linhas, leituras e escritas. Query Store mantém histórico de consultas, planos e métricas por intervalos e ajuda a enxergar regressões. Uma alteração deve preservar a resposta e melhorar a carga relevante. Não limpe caches globais nem force índices como rotina em ambientes compartilhados.' }
    ],
    experiment: 'Compare os candidatos de índice para a consulta proposta e clique em Analisar candidato. Justifique uma hipótese usando cobertura, largura da chave, custo de lookup e as medições que precisaria coletar no SQL Server.',
    quiz: { question: 'Uma sugestão de Missing Index informa ganho de 95%. O que fazer?', options: ['Criar imediatamente, pois o ganho foi medido em produção.', 'Tratar como hipótese, comparar índices existentes e validar com a carga real.', 'Ignorar toda sugestão automática.'], answer: 1, explanation: 'O ganho sugerido deriva de estimativas, não de um teste A/B da execução real. A sugestão é útil como ponto de investigação.' },
    sourceIds: ['slow', 'io', 'missing', 'query-store']
  },
  {
    id: 'desafio', kind: 'challenge', title: 'Você é quem desenha o próximo caminho', shortTitle: 'Desafio de projeto', kicker: 'JUNTE AS PEÇAS', duration: '20 min',
    description: 'Planeje um índice para uma tela real, explique o plano esperado e descreva como comprovar sua escolha.',
    concepts: [
      { title: 'O pedido do produto', text: 'Uma tela lista os 20 pedidos pendentes mais recentes de um cliente, mostrando Id, DataPedido e Total. A tabela tem milhões de pedidos e poucos estão pendentes. Há muitas inserções e alterações de status. A proposta precisa atender a leitura e considerar a frequência de escrita.', code: "DECLARE @ClienteId int = 9;\n\nSELECT TOP (20) Id, DataPedido, Total\nFROM dbo.Pedido\nWHERE ClienteId = @ClienteId\n  AND Status = 'Pendente'\nORDER BY DataPedido DESC, Id DESC;" },
      { title: 'Uma hipótese para discutir', text: 'Um índice filtrado pode manter somente os pendentes, procurar ClienteId e oferecer a ordem DataPedido, Id. Total pode ser incluído. Essa é uma candidata, não uma garantia de escolha. Para outras telas e parâmetros, um índice não filtrado pode servir melhor ao conjunto.', code: "CREATE INDEX IX_Pedido_TelaPendentes\nON dbo.Pedido (ClienteId, DataPedido DESC, Id DESC)\nINCLUDE (Total)\nWHERE Status = 'Pendente';" },
      { title: 'Desenhe as caixas antes de executar', text: 'Desenhe a base clustered por Id e a folha do novo índice: ClienteId, DataPedido, Id e Total, apenas para pendentes. Diga quais valores guiam a navegação, fornecem ordem, localizam a linha e cobrem a projeção. Ao mudar Status para Pago, a entrada deixa esse índice.' },
      { title: 'Escreva um critério de aceitação', text: 'Compare plano real, ordem, ausência ou necessidade de lookup, leituras, CPU, tempo e custo de alterar status. Teste clientes com poucos e muitos pedidos, inclusive sem resultados. Confira se os 20 registros e o desempate são corretos. Registre a evidência e reavalie índices semelhantes antes de manter mais uma cópia.' }
    ],
    experiment: 'Construa uma justificativa de índice, compare os desenhos disponíveis e defenda a solução usando filtro, ordem, cobertura e custo de manutenção.',
    quiz: { question: 'Qual justificativa melhor sustenta a hipótese proposta?', options: ['Ele inclui todas as colunas da tabela e por isso sempre será o mais rápido.', 'ClienteId localiza; DataPedido e Id oferecem a ordem; Total cobre a projeção; o filtro limita o catálogo.', 'Todo TOP exige obrigatoriamente um índice filtrado.'], answer: 1, explanation: 'A proposta conecta cada parte da definição à necessidade concreta. Ainda precisa ser validada com plano, métricas e custo de escrita no ambiente real.' },
    sourceIds: ['filtered', 'include', 'create', 'actual', 'query-store']
  }
];
