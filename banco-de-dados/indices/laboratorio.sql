/*
  ÍNDICES NO SQL SERVER — laboratório do professor Vinicius Mussak
  SQL Server 2019+ (Database Engine) + SSMS. Não é um script para produção.

  1. Crie MANUALMENTE um banco NOVO chamado IndicesLab em uma instância local/dev:
       CREATE DATABASE IndicesLab;
  2. Abra este arquivo no SSMS. Execute o SETUP uma única vez.
  3. Depois selecione e execute UMA seção por vez, na ordem.
  4. Ative o plano REAL: Query > Include Actual Execution Plan (Ctrl+M).
     Ctrl+L mostra o estimado e NÃO executa a consulta.
  5. Compare resultado, logical reads, CPU e plano. Números/operadores variam
     conforme versão, compatibilidade, hardware, estatísticas e outros índices.

  O arquivo NÃO cria nem apaga bancos automaticamente. O setup recusa objetos
  existentes; cada batch verifica nome e marcador antes de operar.
  GO é separador do SSMS/sqlcmd, não uma instrução Transact-SQL.
  Se o setup abortar com NOEXEC, execute SET NOEXEC OFF ou reconecte.
  Não use DBCC DROPCLEANBUFFERS/FREEPROCCACHE para comparar em servidor compartilhado.
*/

/* =================== 00. SETUP — executar UMA VEZ =================== */
USE master;
GO
IF DB_ID(N'IndicesLab') IS NULL
BEGIN
    RAISERROR(N'Crie primeiro um banco NOVO IndicesLab em ambiente local/dev. Nenhum dado será criado.', 16, 1);
    SET NOEXEC ON;
END;
GO
USE IndicesLab;
GO
IF DB_NAME() <> N'IndicesLab'
   OR OBJECT_ID(N'dbo.Cliente') IS NOT NULL
   OR OBJECT_ID(N'dbo.Pedido') IS NOT NULL
   OR EXISTS (SELECT 1 FROM sys.extended_properties WHERE class = 0 AND name = N'VmussakIndicesLab')
BEGIN
    RAISERROR(N'Setup cancelado: use IndicesLab vazio, sem tabelas ou marcador deste laboratório. Para continuar um lab existente, selecione apenas a seção desejada.', 16, 1);
    SET NOEXEC ON;
END;
GO
IF DB_NAME() <> N'IndicesLab'
    THROW 50000, N'Banco incorreto. Setup interrompido.', 1;

SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;

EXEC sys.sp_addextendedproperty
    @name = N'VmussakIndicesLab', @value = N'vmussak-indices-v1';

CREATE TABLE dbo.Cliente
(
    Id           int           NOT NULL,
    Nome         nvarchar(100) NOT NULL,
    UF           char(2)       NOT NULL,
    Email        varchar(180)  NOT NULL,
    DataCadastro datetime2(0)  NOT NULL,
    Observacao   varchar(800)  NOT NULL,
    CONSTRAINT PK_Cliente PRIMARY KEY CLUSTERED (Id)
);

CREATE TABLE dbo.Pedido
(
    Id         int            NOT NULL,
    ClienteId  int            NOT NULL,
    DataPedido datetime2(0)   NOT NULL,
    Status     varchar(12)    NOT NULL,
    Total      decimal(12, 2) NOT NULL,
    CONSTRAINT PK_Pedido PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_Pedido_Cliente FOREIGN KEY (ClienteId) REFERENCES dbo.Cliente(Id)
);

/* 100.000 clientes, geração determinística; datas de 2020 a 2026.
   ~70% SP; 0,1% AC.
   A coluna larga ajuda a visualizar a diferença entre base e índice estreito. */
;WITH D(v) AS
(
    SELECT v FROM (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) AS T(v)
), N AS
(
    SELECT 1 + A.v + 10*B.v + 100*C.v + 1000*E.v + 10000*F.v AS n
    FROM D AS A CROSS JOIN D AS B CROSS JOIN D AS C CROSS JOIN D AS E CROSS JOIN D AS F
)
INSERT dbo.Cliente (Id, Nome, UF, Email, DataCadastro, Observacao)
SELECT n,
       CONCAT(CASE n % 6 WHEN 0 THEN N'Ana' WHEN 1 THEN N'Bruno'
                   WHEN 2 THEN N'Carla' WHEN 3 THEN N'Daniel'
                   WHEN 4 THEN N'Elisa' ELSE N'Vinicius' END,
              RIGHT(CONCAT('000000', n), 6)),
       CASE WHEN n % 1000 = 0 THEN 'AC' WHEN n % 10 < 7 THEN 'SP'
            WHEN n % 10 = 7 THEN 'MG' WHEN n % 10 = 8 THEN 'RJ' ELSE 'PR' END,
       CONCAT('cliente', RIGHT(CONCAT('000000', n), 6), '@exemplo.com'),
       DATEADD(day, n % 2557, CONVERT(datetime2(0), '20200101', 112)),
       REPLICATE('x', 600)
FROM N;

/* 200.000 pedidos, dois por cliente; datas de 2023 a 2026.
   Aproximadamente 2% pendentes (3.999).
   Mistura modular determinística evita concentrar pendentes em Id múltiplo de 50,
   o que os concentraria também em SP/AC. Não simula independência estatística perfeita. */
INSERT dbo.Pedido (Id, ClienteId, DataPedido, Status, Total)
SELECT C.Id + V.deslocamento, C.Id,
       DATEADD(day, (C.Id * 19 + 925 + V.deslocamento / 100000) % 1461,
               CONVERT(datetime2(0), '20230101', 112)),
       CASE WHEN (C.Id * 7919 + (V.deslocamento / 100000) * 104729) % 100003 < 2000
            THEN 'Pendente' ELSE 'Concluido' END,
       CONVERT(decimal(12, 2), 10 + (C.Id % 10000) / 10.0)
FROM dbo.Cliente AS C
CROSS JOIN (VALUES (0), (100000)) AS V(deslocamento);

SELECT COUNT_BIG(*) AS Clientes FROM dbo.Cliente;
SELECT COUNT_BIG(*) AS Pedidos FROM dbo.Pedido;
SELECT UF, COUNT_BIG(*) AS Quantidade FROM dbo.Cliente GROUP BY UF ORDER BY Quantidade DESC;
GO

/* ============= 01. O LIVRO: a folha do clustered É a base ============= */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE Id = 75000;
SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE UF = 'AC';
/* Compare clustered seek por Id com leitura para filtrar UF sem NCI de UF.
   A primeira consulta não precisa voltar para outra tabela: a folha tem a linha.
   SELECT sem ORDER BY NÃO garante a ordem, mesmo com clustered index. */
SELECT TOP (10) Id, Nome FROM dbo.Cliente ORDER BY Id;
GO

/* ================ 02. UMA CAIXA NOVA: NCI + KEY LOOKUP ================ */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

CREATE NONCLUSTERED INDEX IX_Cliente_UF ON dbo.Cliente(UF);

/* Id já está disponível como localizador da linha (chave clustered).
   Nome e Email ainda não estão no NCI. Procure Nested Loops + Key Lookup.
   Não é promessa de operador: o otimizador compara custos. */
SELECT Id, UF FROM dbo.Cliente WHERE UF = 'AC';
SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE UF = 'AC';

/* Mesmo predicado, quantidade MUITO diferente de linhas: scan pode ser melhor
   que dezenas de milhares de lookups. NÃO há percentual universal de virada. */
SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE UF = 'SP';
GO

/* =============== 03. INCLUDE: a resposta dentro da caixa =============== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

CREATE NONCLUSTERED INDEX IX_Cliente_UF ON dbo.Cliente(UF)
    INCLUDE (Nome, Email) WITH (DROP_EXISTING = ON);

/* Mesmas consultas e mesmos resultados da seção 02. Compare logical reads.
   INCLUDE guarda as colunas não chave na folha; não ordena por Nome/Email. */
SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE UF = 'AC';
SELECT Id, Nome, UF, Email FROM dbo.Cliente WHERE UF = 'SP';

/* Cobertura depende da PROJEÇÃO e de todas as colunas necessárias.
   Pedir Observacao tira a cobertura desta consulta. */
SELECT Id, Nome, UF, Email, Observacao FROM dbo.Cliente WHERE UF = 'AC';
GO

/* ======== 04. ÍNDICE COMPOSTO: primeiro UF, depois Nome ======== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

/* Retira só o índice criado no lab anterior, para isolar esta experiência. */
DROP INDEX IF EXISTS IX_Cliente_UF ON dbo.Cliente;
CREATE INDEX IX_Cliente_UF_Nome ON dbo.Cliente(UF, Nome) INCLUDE (Email);

SELECT Id, Nome, Email FROM dbo.Cliente WHERE UF = 'SP' AND Nome = N'Ana000006';
SELECT Id, Nome FROM dbo.Cliente WHERE UF = 'SP' AND Nome LIKE N'Ana%' ORDER BY Nome;
SELECT Id, Nome, UF FROM dbo.Cliente WHERE Nome = N'Ana000006';

/* A 2ª chave isolada não oferece a mesma entrada direta do prefixo UF.
   O índice ainda pode ser lido por SCAN. Observe Seek Predicates e Predicate. */
CREATE INDEX IX_Cliente_Nome_UF ON dbo.Cliente(Nome, UF) INCLUDE (Email);
SELECT Id, Nome, UF FROM dbo.Cliente WHERE Nome = N'Ana000006';

/* Com igualdade em UF, o próximo nível está ordenado por Nome.
   Se apenas UF for intervalo, Nome não necessariamente forma uma única faixa. */
SELECT Id, Nome, UF FROM dbo.Cliente WHERE UF >= 'MG' AND Nome = N'Ana000006';
GO

/* ================ 05. FUNÇÕES E SARGABILIDADE ================ */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

CREATE INDEX IX_Cliente_DataCadastro ON dbo.Cliente(DataCadastro);

SELECT Id, DataCadastro FROM dbo.Cliente WHERE YEAR(DataCadastro) = 2026;
SELECT Id, DataCadastro FROM dbo.Cliente
WHERE DataCadastro >= CONVERT(datetime2(0), '20260101', 112)
  AND DataCadastro <  CONVERT(datetime2(0), '20270101', 112);

/* Observe: YEAR pode gerar INDEX SCAN no índice de datas. Isso é usar o índice,
   mas sem buscar diretamente o intervalo pelo valor original da chave.
   Não use BETWEEN com último milissegundo do ano; prefira intervalo semiaberto. */

/* Prefixo tem limite inicial útil; curinga inicial não tem a mesma faixa.
   Aqui ambas retornam o mesmo conjunto porque os nomes gerados contêm Ana
   apenas no início. Isso não as torna equivalentes para quaisquer dados. */
SELECT Id, Nome FROM dbo.Cliente WHERE Nome LIKE N'Ana%';
SELECT Id, Nome FROM dbo.Cliente WHERE Nome LIKE N'%Ana%';

/* Converta/prepare o VALOR quando preservar o significado. Nem toda função
   impede seek: há simplificações do otimizador e exceções CAST/CONVERT.
   UPPER pode ser desnecessário sob collation case-insensitive, mas removê-lo
   sem entender collation/requisitos pode alterar o resultado. */
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS CollationDoBanco;
GO

/* ============== 06. COLUNA CALCULADA INDEXADA ============== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;

/* YEAR(datetime2) é determinístico e preciso. PERSISTED é uma escolha didática;
   este exemplo também admite índice sem PERSISTED. O índice já armazena a chave.
   PERSISTED armazena também a coluna na base e tem custo de espaço/escrita. */
ALTER TABLE dbo.Cliente ADD AnoCadastro AS YEAR(DataCadastro) PERSISTED;
GO
/* Novo batch para o compilador enxergar a coluna recém-criada. */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

CREATE INDEX IX_Cliente_AnoCadastro ON dbo.Cliente(AnoCadastro) INCLUDE (DataCadastro);

SELECT COLUMNPROPERTY(OBJECT_ID(N'dbo.Cliente'), N'AnoCadastro', 'IsDeterministic') AS Deterministica,
       COLUMNPROPERTY(OBJECT_ID(N'dbo.Cliente'), N'AnoCadastro', 'IsPrecise') AS Precisa;

SELECT Id, DataCadastro FROM dbo.Cliente WHERE AnoCadastro = 2026;
/* O otimizador também pode reconhecer uma expressão equivalente. Confira. */
SELECT Id, DataCadastro FROM dbo.Cliente WHERE YEAR(DataCadastro) = 2026;
/* A consulta explícita por AnoCadastro comunica melhor a intenção.
   Não generalize para GETDATE(), qualquer UDF ou expressão imprecisa.
   Opções SET também importam nas conexões que modificam estes dados. */
GO

/* ========== 07. ONDE O ÍNDICE AJUDA: JOIN / ORDER / GROUP ========== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

/* FK NÃO criou um índice em Pedido.ClienteId. Verifique antes do CREATE. */
SELECT name, type_desc FROM sys.indexes WHERE object_id=OBJECT_ID(N'dbo.Pedido');
SELECT C.Nome, P.Id, P.DataPedido, P.Total
FROM dbo.Cliente AS C JOIN dbo.Pedido AS P ON P.ClienteId=C.Id
WHERE C.Id=75000;

CREATE INDEX IX_Pedido_Cliente_Data ON dbo.Pedido(ClienteId, DataPedido DESC) INCLUDE (Total, Status);

SELECT C.Nome, P.Id, P.DataPedido, P.Total
FROM dbo.Cliente AS C JOIN dbo.Pedido AS P ON P.ClienteId=C.Id
WHERE C.Id=75000;

SELECT TOP (5) Id, DataPedido, Total FROM dbo.Pedido
WHERE ClienteId=75000 ORDER BY DataPedido DESC;

SELECT ClienteId, SUM(Total) AS TotalComprado FROM dbo.Pedido
GROUP BY ClienteId;
/* Procure Seek no lado interno do join, ausência/presença de Sort e a escolha
   Stream Aggregate/Hash Match. Um scan estreito ordenado pode ser excelente.
   Plano paralelo pode usar outros operadores; nenhum deles é obrigatório. */
GO

/* ============== 08. ÍNDICE FILTRADO E PARAMETRIZAÇÃO ============== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;

CREATE INDEX IX_Pedido_Pendente_Data ON dbo.Pedido(DataPedido)
INCLUDE (ClienteId, Total) WHERE Status='Pendente';

SELECT Id, ClienteId, DataPedido, Total FROM dbo.Pedido
WHERE Status='Pendente' AND DataPedido >= CONVERT(datetime2(0), '20260101', 112);

/* O filtro deve ser compatível com os valores que a consulta pode retornar.
   Um plano reutilizável para @Status precisa servir também para 'Concluido'.
   Parametrização automática e versão influenciam a escolha. */
EXEC sys.sp_executesql
 N'SELECT Id, ClienteId, DataPedido, Total FROM dbo.Pedido
   WHERE Status=@Status AND DataPedido>=@Inicio;',
 N'@Status varchar(12), @Inicio datetime2(0)',
 @Status='Pendente', @Inicio='20260101';

/* EXPERIMENTO, não receita de produção: RECOMPILE permite considerar o valor
   desta execução, ao custo de compilar a cada execução. Compare o plano. */
EXEC sys.sp_executesql
 N'SELECT Id, ClienteId, DataPedido, Total FROM dbo.Pedido
   WHERE Status=@Status AND DataPedido>=@Inicio OPTION (RECOMPILE);',
 N'@Status varchar(12), @Inicio datetime2(0)',
 @Status='Pendente', @Inicio='20260101';
GO

/* =================== 09. UNIQUE E ESTATÍSTICAS =================== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

CREATE UNIQUE INDEX UX_Cliente_Email ON dbo.Cliente(Email);
SELECT Id, Email FROM dbo.Cliente WHERE Email='cliente075000@exemplo.com';

/* UNIQUE também é integridade. A regra de negócio precisa permitir isso;
   não crie UNIQUE apenas para tentar melhorar uma consulta. */
DBCC SHOW_STATISTICS (N'dbo.Cliente', N'IX_Cliente_UF_Nome') WITH HISTOGRAM;

SELECT S.name, P.last_updated, P.rows, P.rows_sampled, P.modification_counter
FROM sys.stats AS S
OUTER APPLY sys.dm_db_stats_properties(S.object_id, S.stats_id) AS P
WHERE S.object_id=OBJECT_ID(N'dbo.Cliente');

/* O histograma é da PRIMEIRA chave (UF), até 200 passos; densidades fornecem
   informação adicional dos prefixos de múltiplas colunas. Não é toda a tabela.
   Compare Estimated Number of Rows x Actual Number of Rows no plano real.
   Atualização específica é experiência opcional para dados alterados:
      UPDATE STATISTICS dbo.Cliente IX_Cliente_UF_Nome;
   Não há necessidade de FULLSCAN automático nem de atualizar tudo a cada aula. */
GO

/* ============= 10. ESCRITA: todas as caixas precisam acompanhar ============= */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    INSERT dbo.Cliente (Id, Nome, UF, Email, DataCadastro, Observacao)
    VALUES (100001, N'AnaNova', 'AC', 'nova@exemplo.com', '20261117', REPLICATE('y',600));

    UPDATE dbo.Cliente SET Nome=N'AnaAtualizada', UF='MG', DataCadastro='20250115'
    WHERE Id=100001;

    SELECT Id, Nome, UF, AnoCadastro FROM dbo.Cliente WHERE Id=100001;
    /* No plano de escrita, examine Object/Indexes e os operadores Update/Insert.
       O plano pode agregar manutenção de múltiplos índices em um operador.
       Mudou Nome/UF? Chaves/INCLUDE que guardam essas colunas são mantidos.
       Mudou DataCadastro? A coluna calculada e seu índice também acompanham. */
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;

/* Id 100001 não deve persistir. O rollback não desfaz custo já consumido. */
SELECT COUNT_BIG(*) AS LinhasAposRollback FROM dbo.Cliente WHERE Id=100001;
GO

/* ============== 11. COLUMNSTORE — extensão opcional ============== */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

/* Usa tabela separada, não troca a organização de Pedido nem suas constraints.
   Dataset pequeno para columnstore: a intenção é observar estrutura/operador,
   não prometer ganho. Rowgroups/versão/hardware afetam qualquer comparação. */
SELECT Id, ClienteId, DataPedido, Status, Total INTO dbo.PedidoAnalitico FROM dbo.Pedido;
CREATE CLUSTERED COLUMNSTORE INDEX CCI_PedidoAnalitico ON dbo.PedidoAnalitico;

SELECT Status, SUM(Total) AS Receita FROM dbo.Pedido GROUP BY Status;
SELECT Status, SUM(Total) AS Receita FROM dbo.PedidoAnalitico GROUP BY Status;

/* Rowstore lê registros; columnstore guarda segmentos por coluna, comprime e
   pode usar batch mode/eliminação de segmentos. Não é uma B+ tree por linha.
   Índice HASH SQL Server é específico de tabelas MEMORY_OPTIMIZED, tem buckets
   e serve igualdade na chave completa. Não execute CREATE HASH em dbo.Cliente. */
GO

/* ================ 12. INVENTÁRIO, USO E DENSIDADE ================ */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

SELECT I.name, I.type_desc, I.is_unique, I.has_filter, I.filter_definition,
       C.name AS Coluna, IC.key_ordinal, IC.is_descending_key, IC.is_included_column
FROM sys.indexes AS I
JOIN sys.index_columns AS IC ON IC.object_id=I.object_id AND IC.index_id=I.index_id
JOIN sys.columns AS C ON C.object_id=IC.object_id AND C.column_id=IC.column_id
WHERE I.object_id=OBJECT_ID(N'dbo.Cliente')
ORDER BY I.index_id, IC.is_included_column, IC.key_ordinal, IC.index_column_id;

/* Localizador clustered implícito nem sempre aparece nesta lista de colunas.
   user_updates conta operações, não linhas modificadas; não é custo em bytes.
   Contadores de uso são transitórios, reiniciam em eventos como restart;
   ausência de uso na sua janela NÃO autoriza apagar um índice. */
SELECT I.name, COALESCE(U.user_seeks,0) AS user_seeks,
       COALESCE(U.user_scans,0) AS user_scans, COALESCE(U.user_lookups,0) AS user_lookups,
       COALESCE(U.user_updates,0) AS user_updates, U.last_user_seek, U.last_user_scan
FROM sys.indexes AS I
LEFT JOIN sys.dm_db_index_usage_stats AS U
 ON U.database_id=DB_ID() AND U.object_id=I.object_id AND U.index_id=I.index_id
WHERE I.object_id=OBJECT_ID(N'dbo.Cliente');

/* LIMITED evita uma varredura detalhada de todas as folhas. Densidade pode vir
   NULL neste modo. Não conclua 'densidade zero'. Requer permissões de DMV que
   variam com versão (VIEW DATABASE STATE / VIEW DATABASE PERFORMANCE STATE). */
SELECT I.name, P.index_type_desc, P.page_count, P.avg_fragmentation_in_percent,
       P.avg_page_space_used_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID(N'dbo.Cliente'), NULL, NULL, 'LIMITED') AS P
JOIN sys.indexes AS I ON I.object_id=P.object_id AND I.index_id=P.index_id
WHERE P.index_level=0 AND P.alloc_unit_type_desc='IN_ROW_DATA';

/* Se houver evidência e permissão, use SAMPLED/DETAILED em UM índice para medir
   densidade de folhas. Não execute indiscriminadamente em produção/réplica.
   Não aplicar receita automática '5% reorganize / 30% rebuild'. Correlacione
   workload, page density, tamanho, IO, custos de log/bloqueio/espaço e medição.
   REORGANIZE não atualiza estatísticas. Rebuild do índice rowstore atualiza a
   estatística correspondente, com particularidades para índices particionados. */
GO

/* ================= 13. DESAFIO FINAL — medir antes/depois ================= */
IF DB_NAME() <> N'IndicesLab' OR NOT EXISTS
 (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'VmussakIndicesLab' AND CONVERT(nvarchar(100),value)=N'vmussak-indices-v1')
    THROW 50000, N'Abra o banco IndicesLab e execute primeiro o setup.', 1;

/* Proponha índice para histórico do cliente em um período, com ordenação.
   Já temos IX_Pedido_Cliente_Data: identifique reaproveitamento antes de criar
   outro! Examine igualdade, intervalo, ordem e colunas necessárias. */
SELECT TOP (10) Id, DataPedido, Total, Status FROM dbo.Pedido
WHERE ClienteId=75000 AND DataPedido>=CONVERT(datetime2(0),'20260101',112)
ORDER BY DataPedido DESC;

/* Perguntas:
   - Por que (ClienteId, DataPedido DESC) INCLUDE (Total,Status) é candidato?
   - Por que (DataPedido,ClienteId) não oferece a mesma faixa inicial?
   - INCLUDE(ClienteId) permitiria seek por ClienteId?
   - É preciso INCLUDE(Id), já sendo a chave clustered? Não neste exemplo.
   - O que observar se o app pede SELECT * em vez destas 4 colunas?
   - Uma sugestão de missing index justifica duplicar um índice existente?

   Query Store: se já habilitado, compare distribuições de duração/IO e planos
   no tempo. Este script NÃO habilita Query Store nem muda compatibilidade.
   SQL Server 2022+ pode usar Parameter Sensitive Plan (com requisitos); não
   prometa que um único plano em cache cobrirá sempre todas as distribuições.

   Extensão HEAP/RID: em um heap, NCI localiza por RID, e a busca complementar
   pode ser RID Lookup. Não chame todo lookup de Key Lookup.
   Extensão page split: não se mede split contando INSERTs; ocupação, tamanho,
   posição de inserção e mudanças em chaves/linhas importam. Chave sequencial
   reduz splits no meio, mas pode causar contenção na última página.
*/

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO
SET NOEXEC OFF;
GO

/* Referências oficiais (consultadas em 17/11/2026):
 https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide
 https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns
 https://learn.microsoft.com/en-us/sql/relational-databases/indexes/indexes-on-computed-columns
 https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-filtered-indexes
 https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan
 https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-io-transact-sql
 https://learn.microsoft.com/en-us/sql/relational-databases/statistics/statistics
 https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints
 https://learn.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes
 https://learn.microsoft.com/en-us/sql/relational-databases/indexes/tune-nonclustered-missing-index-suggestions
*/
