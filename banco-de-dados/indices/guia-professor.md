# Índices no SQL Server — roteiro do professor

**Professor Vinicius Mussak · 3 horas · SQL Server 2019 ou superior**

Objetivo: o aluno deve conseguir desenhar o que existe na folha de um índice, prever quais dados precisam ser buscados fora dela e justificar uma alteração com resultado, plano e leituras lógicas. O site oferece modelos visuais; o arquivo `laboratorio.sql` oferece experimentos no mecanismo real. Nenhum plano desenhado no navegador é uma captura do SQL Server.

Pré-requisitos: `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `GROUP BY`, chave primária e tipos básicos. Para iniciantes, divida este material em duas aulas e reserve a segunda para o laboratório.

## Preparação

1. Use uma instância local ou de desenvolvimento do SQL Server 2019+, espaço livre e acesso pelo SSMS. O setup gera 100 mil clientes e 200 mil pedidos; colunas largas e índices consomem algumas centenas de MB conforme a instalação.
2. Crie manualmente um banco **novo** chamado `IndicesLab`. O script não cria nem apaga bancos; o setup recusa tabelas e marcador preexistentes.
3. Execute somente a seção 00 uma vez. Depois execute cada seção separadamente e na sequência. `GO` separa batches. Cada batch do laboratório valida banco e marcador antes das operações. Não remova essas verificações.
4. Habilite **Query → Include Actual Execution Plan**, normalmente `Ctrl+M`. `Ctrl+L` exibe o plano estimado; não executa a consulta. O plano real precisa de permissão para executar e `SHOWPLAN` nos bancos envolvidos.
5. Confira a aba **Messages**: `STATISTICS IO` apresenta leituras lógicas; `STATISTICS TIME` apresenta CPU e tempo. O setup deixa os dados recentes no cache: isso não invalida a comparação de leituras lógicas.
6. Não limpe cache/buffer pool em servidor compartilhado. Não compare só o tempo de uma execução ou o percentual de custo do desenho. Envio de milhares de linhas ao SSMS também custa tempo.

O setup usa `SET NOEXEC ON` quando encontra um impedimento, para evitar que batches seguintes sejam executados. Nesse caso, corrija a condição e execute `SET NOEXEC OFF` ou reconecte. Um `THROW` antes de `GO`, isoladamente, não garante que o SSMS abandonará todos os próximos batches.

Para repetir uma demonstração, use a seção correspondente e considere os índices que já foram criados. Alguns `CREATE` só devem rodar uma vez. Para recomeçar do zero, prepare outro ambiente descartável com um banco novo; não há limpeza destrutiva automática no arquivo.

## Roteiro de 180 minutos

| Tempo | Capítulos da trilha | Condução e participação |
|---|---|---|
| 0–10 min | O índice de um livro | Peça um termo e uma página. Compare procurar página por página com consultar o índice remissivo. Pergunte: o índice contém o capítulo inteiro? |
| 10–25 min | Árvore e páginas | Monte uma raiz, páginas intermediárias e folhas. O aluno escolhe a faixa e acompanha a descida. Depois encontra um intervalo navegando entre folhas. |
| 25–40 min | Clusterizado e não clusterizado | Desenhe a base como uma caixa e dois índices como caixas menores. Revele a chave clustered nos NCI. Compare folha com linha completa e folha com projeção. |
| 40–55 min | Seek, scan e lookup | Alterne consulta coberta e consulta que pede uma coluna ausente. Marque cada ida à base. Pergunte se 1 lookup tem o mesmo peso de 50 mil. |
| 55–70 min | INCLUDE e compostos | Inclua Nome e Email, execute de novo e compare. Depois troque `(UF, Nome)` por `(Nome, UF)` e peça previsões antes de executar. |
| 70–85 min | Funções e coluna calculada | Compare `YEAR(DataCadastro)` com intervalo semiaberto e com índice em `AnoCadastro`. Diferencie ausência de seek de ausência de uso de índice. |
| 85–95 min | Intervalo | Pausa. Deixe na tela a pergunta: “Que informação falta na caixa para responder minha consulta?” |
| 95–115 min | Planos reais e cláusulas | Seções 01–07 do SQL. Observe propriedades dos operadores, linha por linha: seek predicate, residual, linhas lidas, retornadas, estimadas e reais. Mostre JOIN, ORDER e GROUP. |
| 115–130 min | Seletividade, filtros e estatísticas | Compare AC e SP. Mostre pendentes, parâmetros e histograma. Faça os alunos explicarem a escolha em termos de quantidade e custo. |
| 130–145 min | Famílias de índices e escrita | Rowstore, columnstore e hash com escopos. Atualize uma linha nas caixas e no SQL. Mostre que uma única escrita pode manter vários índices. |
| 145–160 min | Diagnóstico e manutenção | Inventário e DMVs. Discuta índices repetidos, janela de observação, page density e custo de rebuild. Os alunos rejeitam uma sugestão automática sem evidência. |
| 160–180 min | Desafio em duplas | Cada dupla entrega query, índice candidato, desenho das folhas, hipótese, plano e leitura antes/depois. Compartilhe duas soluções diferentes e seus custos. |

Os 20 capítulos são unidades de consulta e exploração; seus tempos individuais não precisam somar uma sessão. O roteiro seleciona os pontos centrais e deixa as extensões para estudo posterior.

## A analogia que conduz a aula

Um índice remissivo de livro lista **termo → página**: “Bancos de dados → 42, 77”. O SQL Server mantém estruturas de acesso com chaves e localizadores. Na folha do não clusterizado, visualizamos uma cópia das colunas necessárias àquela estrutura, não uma duplicação indiscriminada de toda a tabela.

Para o clusterizado, adapte a analogia: pense no próprio conteúdo do livro organizado por uma chave. A folha do clustered é o armazenamento da base rowstore. Não desenhe uma “tabela original completa” separada mais uma “cópia clustered completa”: isso ensina duplicação inexistente.

No exemplo, a base tem `Id, Nome, UF, Email, DataCadastro, Observacao`. A caixa `IX_Cliente_UF` tem `UF` e o localizador `Id`. Se pedimos Nome, temos de chegar à base. Com `INCLUDE (Nome, Email)`, a resposta dessas consultas cabe na folha do NCI. Peça Observacao para mostrar que cobertura é propriedade da consulta em relação ao índice.

O localizador é a chave clustered nesta tabela. Em um heap, é RID e pode haver **RID Lookup**. `PRIMARY KEY` define integridade; pode ser `NONCLUSTERED`. Só existe uma organização clustered da tabela; podem existir vários NCI. Páginas mantêm ordem lógica por chave, e `ORDER BY` continua necessário para garantir a ordem do resultado.

## O que observar no plano

| Evidência | Leitura em voz alta |
|---|---|
| Object / Index | “Qual caixa o operador abriu?” |
| Seek Predicates | “Qual valor ou intervalo permitiu entrar na árvore?” |
| Predicate | “O que ainda precisou ser testado depois de ler?” |
| Actual Number of Rows Read | “Quantas linhas passaram pela leitura?” |
| Actual Number of Rows | “Quantas foram entregues por este operador?” |
| Estimated Number of Rows | “Quantas o otimizador esperava?” |
| Number of Executions | “Quantas vezes esta operação se repetiu?” |
| Output List | “Que colunas saíram desta caixa?” |
| Warnings | “Houve conversão que afeta o plano, spill ou outro aviso?” |

No desenho usual do SSMS, acompanhe o fluxo de dados das folhas à direita para o resultado à esquerda. Em joins há ramos; não transforme todo plano em uma sequência linear. Nested Loops pede trabalho ao lado interno para linhas do externo. Agregações, sorts e paralelismo também alteram a forma do desenho.

Os custos percentuais do plano são **estimativas relativas**, inclusive quando o plano traz contadores reais. Não equivalem a porcentagem medida do tempo. Para operadores executados várias vezes e planos paralelos, confira se a propriedade apresentada é total ou por execução/thread antes de comparar números.

## Sequência do laboratório real

| Seção SQL | Hipótese antes da execução | Evidência a registrar |
|---|---|---|
| 00 — Setup | SP retorna muito mais linhas que AC. | 100.000 clientes (datas de 2020 a 2026), 200.000 pedidos (2023 a 2026); AC 100 e SP 69.900 no dataset gerado. |
| 01 — Base | Id permite navegação no clustered; UF precisa outra estratégia. | Índice aberto, logical reads e resultado. |
| 02 — NCI | Id e UF estão na caixa; Nome e Email exigem acesso complementar. | Lookup ou alternativa de scan; execuções do lookup. |
| 03 — INCLUDE | A mesma projeção pode ser respondida na folha. | Resultados iguais; lookup ausente ou plano alternativo escolhido; diferença de IO. |
| 04 — Composto | O prefixo das chaves muda a entrada na árvore. | Seek Predicates versus Predicate; Sort e ordem. |
| 05 — Funções | YEAR não é uma faixa direta na chave DataCadastro. | Scan de índice pode existir; intervalo tem limite inicial e final úteis. |
| 06 — Calculada | A árvore em AnoCadastro organiza o valor transformado. | Índice escolhido; IsDeterministic/IsPrecise; custo de persistência. |
| 07 — Cláusulas | Uma chave de junção indexada pode reduzir a busca de pedidos. | Estratégia de JOIN, Sort, Stream/Hash Aggregate, leituras. |
| 08 — Filtrado | A caixa só guarda pendentes; o plano precisa preservar a correção. | Escolha com literal e parâmetro; custo de recompilar no experimento opcional. |
| 09 — Estatísticas | O otimizador estima distribuições sem ler tudo a cada compilação. | Histograma da primeira chave, linhas amostradas e estimativas. |
| 10 — Escrita | Alterar uma coluna afeta estruturas que a guardam. | Objetos mantidos no plano e ausência da linha após rollback. |
| 11 — Columnstore | Agregações grandes podem aproveitar segmentos por coluna. | Columnstore Scan, modo de execução e IO; ganho não é garantido neste volume. |
| 12 — Diagnóstico | Uso recente sozinho não descreve toda a necessidade. | Janela de observação, índices redundantes, tamanho e densidade disponível. |
| 13 — Desafio | Um índice existente pode atender sem criar outro. | Candidato justificado e comparação mensurada. |

Os resultados esperados acima são hipóteses estruturais, não planos obrigatórios. Não force o operador só para fazer a aula “bater”. Se o SQL Server escolher outro caminho, investigue a razão com a turma. Evite misturar índices de etapas posteriores ao repetir uma comparação inicial.

`AnoCadastro` é acrescentada em batch separado antes das consultas que a referenciam: o compilador precisa enxergar a coluna. As seis opções SET ligadas e `NUMERIC_ROUNDABORT OFF` devem ser preservadas para índices de colunas calculadas; conexões de escrita também precisam respeitar os requisitos.

## Perguntas e gabarito comentado

1. **Criar índice em UF copia a tabela inteira?** Não. O NCI guarda sua chave, localizador e eventuais colunas incluídas; níveis superiores e folhas têm funções distintas.
2. **A folha do clustered aponta para a tabela em outra caixa?** Na organização rowstore clustered, ela já contém as páginas de dados da base, com detalhes de armazenamento fora da linha para alguns tipos/tamanhos.
3. **Uma PRIMARY KEY é sempre clustered?** Não. Podemos declarar `PRIMARY KEY NONCLUSTERED` e escolher outra chave clustered.
4. **Se o plano mostra Index Scan, o índice foi ignorado?** Não. Ele está sendo usado para leitura. O que não houve foi entrada seletiva por seek naquele acesso.
5. **Key Lookup é sempre um defeito?** Não. Buscar poucas linhas pode custar menos que manter um índice mais largo. A multiplicação de acessos é que precisa ser medida.
6. **INCLUDE torna Nome ordenado dentro de UF?** Não. Para essa ordenação, Nome deve fazer parte da chave pertinente; INCLUDE guarda dados na folha.
7. **É preciso incluir Id neste exemplo?** Id já é o localizador clustered do NCI. Não acrescente mecanicamente uma coluna que já está disponível.
8. **Um índice `(UF, Nome)` nunca ajuda `WHERE Nome=...`?** Pode ajudar por scan, cobertura e outras escolhas; não oferece a mesma entrada direta por prefixo de `(Nome, UF)`.
9. **Qual reescrita para `YEAR(DataCadastro)=2026`?** `DataCadastro >= '20260101' AND DataCadastro < '20270101'`, com valores/tipos coerentes. O intervalo preserva o ano inteiro, inclusive horários.
10. **Toda função na coluna impede todo uso de índice?** Não. Pode haver scan, simplificações, expressões reconhecidas e casos especiais. Faça a afirmação sobre o predicado, a estrutura e o plano observados.
11. **PERSISTED é sempre exigido para indexar calculadas?** Não. Há requisitos de determinismo, precisão, tipos, propriedade e opções SET. YEAR sobre datetime2 é um caso simples que não exige persistir a base para permitir o índice.
12. **Por que SP e AC podem ter planos diferentes?** A distribuição muda a quantidade estimada e o custo relativo de lookups, seeks e scans; parâmetros e reutilização de planos também importam.
13. **Uma FK gera índice em ClienteId?** Não no SQL Server. Avalie manualmente o índice pelo workload e pelas verificações de integridade.
14. **Um índice hash substitui a B+ tree de Cliente?** Não neste cenário: hash pertence a índices memory-optimized do SQL Server e favorece igualdade sobre a chave completa; não oferece a mesma ordenação/faixa.
15. **Sem uso na DMV significa que posso apagar?** Não. A janela pode ter começado após restart; tarefas periódicas, integridade, outros workloads e custo de escrita precisam ser considerados.
16. **Rebuild resolve qualquer query lenta?** Não. Pode atualizar estatística do índice rowstore e reorganizar páginas, mas não corrige projeção inadequada, predicado ruim ou desenho de índice por si só. Meça causa e efeito.

## Desafio em duplas

Entregue esta necessidade: “Buscar os últimos dez pedidos de um cliente desde uma data, exibindo Id, data, total e status.”

```sql
SELECT TOP (10) Id, DataPedido, Total, Status
FROM dbo.Pedido
WHERE ClienteId = 75000
  AND DataPedido >= CONVERT(datetime2(0), '20260101', 112)
ORDER BY DataPedido DESC;
```

A dupla deve desenhar a folha, apontar as chaves e INCLUDE e comparar com o inventário antes de propor um `CREATE`. O índice `(ClienteId, DataPedido DESC) INCLUDE (Total, Status)` já existe na seção 07; reconhecer reaproveitamento faz parte da solução. Id é a chave clustered e já serve de localizador.

Avalie com quatro critérios: preservou o resultado; explicou prefixo/intervalo/ordem; identificou cobertura e escrita; mostrou plano/IO antes e depois ou justificou por que não é necessário outro índice. Acrescente uma variante com `SELECT *` e outra com filtro por Status para discutir o custo de atender novas consultas.

Para turmas avançadas, peça dois clientes com distribuições diferentes, avaliação do plano em cache e uma comparação no Query Store **quando já habilitado**. O script não muda compatibilidade nem habilita recursos da instância.

## Extensões e cuidados de versão

- B+ tree é o modelo dos índices rowstore em disco. Clustered e nonclustered descrevem organizações; unique, composto, filtrado e cobertura são outras propriedades e podem se combinar.
- Columnstore atende especialmente agregações e análises; nem todo caso de OLAP melhora, nem toda consulta pontual piora. Rowgroups, compressão, eliminação e atualização importam.
- Hash exige tabela memory-optimized, memória e desenho de buckets apropriados. Índices memory-optimized nonclustered usam outra implementação, não a mesma árvore de páginas em disco.
- Full-text atende busca linguística/tokenizada, não substitui mecanicamente qualquer `LIKE '%texto%'`. Spatial atende operações espaciais; XML atende acesso a documentos XML. Instalação, edição e recursos habilitados precisam ser considerados.
- Recursos de JSON e índices JSON dependem da versão; não ensine sintaxe do SQL Server 2025 como se existisse em 2019. Colunas calculadas indexadas são uma abordagem disponível em versões anteriores, respeitados os requisitos.
- Parameter Sensitive Plan é recurso do SQL Server 2022+ com requisitos de compatibilidade e elegibilidade; não é solução universal para todo padrão de parâmetros.
- `ONLINE`, operações resumíveis e permissões de DMVs variam conforme versão/edição/operação. Não prometa ausência de bloqueios só por haver ONLINE.
- Fragmentação e densidade são medidas diferentes. `LIMITED` pode não trazer densidade da folha. Evite regras fixas de percentual, fillfactor baixo por padrão e manutenção que custa mais que o problema observado.

## Referências oficiais

Consulta realizada em 17/11/2026. Use a seleção de versão do Microsoft Learn para o ambiente da turma.

| Assunto | Documentação |
|---|---|
| Arquitetura e desenho | [Index architecture and design guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide) |
| INCLUDE | [Create indexes with included columns](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns) |
| Calculadas | [Indexes on computed columns](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/indexes-on-computed-columns) |
| Filtrados | [Create filtered indexes](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-filtered-indexes) |
| Planos reais | [Display an actual execution plan](https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan) |
| IO | [SET STATISTICS IO](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-io-transact-sql) |
| Estatísticas | [Statistics](https://learn.microsoft.com/en-us/sql/relational-databases/statistics/statistics) |
| Chaves | [Primary and foreign key constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints) |
| Manutenção | [Maintain indexes optimally](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes) |
| Sugestões do otimizador | [Tune nonclustered indexes with missing index suggestions](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/tune-nonclustered-missing-index-suggestions) |
| Uso | [sys.dm_db_index_usage_stats](https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-usage-stats-transact-sql) |
| Estrutura física | [sys.dm_db_index_physical_stats](https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-physical-stats-transact-sql) |

## Validação do material

O conteúdo e o SQL foram revisados contra a documentação oficial e a estrutura do script foi conferida estaticamente. Este arquivo não contém medições de uma instância executada: os alunos/professor devem registrar seus próprios planos e números no ambiente da aula. As simulações visuais explicam mecanismos e não implementam o otimizador do SQL Server.
