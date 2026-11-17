# Índices por dentro

Aula interativa em português para SQL Server, com 20 capítulos, simulações, quizzes e referências oficiais Microsoft Learn. Segue a organização das trilhas de aula deste repositório.

## Abrir a aula

Abra `aula-offline.html` diretamente no navegador. Esse arquivo reúne os estilos, o conteúdo e os laboratórios e funciona sem instalar dependências ou iniciar um servidor. Os links para documentação precisam de conexão. Os downloads de SQL e guia ficam na mesma pasta.

Para publicar no GitHub Pages, a entrada modular é `banco-de-dados/indices/index.html`. A página inicial do repositório já inclui o cartão e o filtro Banco de dados.

O modo aula esconde a barra lateral e permite trocar de capítulo com as setas esquerda/direita. Escape encerra esse modo. Progresso e respostas são guardados no navegador quando há armazenamento local disponível.

## Conteúdo

Livro e índice remissivo; páginas e B+ tree; clustered, heap e nonclustered; seeks e scans; Key Lookup e RID Lookup; INCLUDE e cobertura; chaves compostas; predicados SARGáveis; funções e colunas calculadas; leitura de planos; WHERE, JOIN, ORDER BY e GROUP BY; seletividade; índices filtrados; UNIQUE, columnstore, hash e índices especializados; escritas; estatísticas; manutenção e diagnóstico; projeto final de índice para pedidos pendentes.

`guia-professor.md` propõe uma sequência de 3 horas. Os capítulos também permitem aprofundamento em mais de uma aula. `laboratorio.sql` cria dados e experiências em um banco dedicado que deve ser criado manualmente. Leia as instruções no início do script; a base não é criada nem excluída automaticamente.

## Alterar e verificar

Sem dependências externas:

```sh
node banco-de-dados/indices/gerar-offline.mjs
node banco-de-dados/indices/tests-course.mjs
node banco-de-dados/indices/tests-labs.mjs
```

Regere o HTML offline após mudar os módulos ou estilos. O teste de integração também detecta conteúdo desatualizado no HTML independente.

## Limites do modelo

O navegador não executa T-SQL e não contém o otimizador do SQL Server. As simulações usam coleções pequenas de dados e distinguem suas contagens de métricas ilustrativas. Os desenhos de planos não são arquivos Showplan reais. Use o laboratório no SSMS para medir leituras e observar os operadores escolhidos pela sua instância.

Os testes de código validam conteúdo, rotas, respostas, progresso e cenários locais. Não substituem inspeção visual nem a execução do roteiro em SQL Server.
