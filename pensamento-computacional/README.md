# PyLab — Pensamento Computacional

Trilha estática em português para estudar os fundamentos de Python. A entrada é `index.html`; cada laboratório também tem uma URL própria.

- `tipos.html`: entrada, tipos, conversão e concatenação.
- `decisoes.html`: if/elif/else, comparações e operadores lógicos.
- `for-range.html`: percurso, limites exclusivos, passo e acumulador.
- `while.html`: condição, atualização, break e investigação de laço infinito.
- `listas.html`: índices, soma, contagem, busca, substituição e append.
- `matrizes.html`: listas de listas, laços aninhados e diagonal.
- `memoria.html`: referências, objetos mutáveis, reatribuição e cópia.
- `funcoes.html`: parâmetros, chamada, escopo e return versus print.

## Usar

Compatível com GitHub Pages: não há instalação, compilação, dependência externa ou serviço de backend. Os arquivos também podem ser abertos diretamente no navegador. Para uma prévia com todas as funcionalidades do navegador (incluindo copiar código), sirva a raiz do repositório com `python -m http.server 4173` e acesse `http://localhost:4173/pensamento-computacional/`.

## Funcionamento

São simulações guiadas de exemplos Python, com entradas configuráveis, não um interpretador de código livre. Cada `build(values)` retorna o código e uma sequência de estados independentes. O destaque indica a linha associada ao estado após sua execução; chamadas de função também mostram a suspensão do chamador. Voltar um passo restaura a fotografia anterior. Laços infinitos têm uma pausa didática explícita, sem inventar uma saída do programa.

Os diagramas de memória são conceituais. Não representam endereços reais, tamanho em bytes ou armazenamento contíguo de listas. Os identificadores ilustram identidade e compartilhamento de objetos.

O progresso é salvo somente em `localStorage`, após acertar as três questões de cada laboratório. Não são coletados dados dos alunos. A interface continua funcionando se o armazenamento local estiver indisponível.

## Organização

`utils.js` fornece escape de HTML e células indexadas; os arquivos `labs-*.js` registram conteúdo e rastros em `window.PCLabs`; `app.js` monta navegação, controles, estado e quizzes; `styles.css` contém o visual responsivo e os ajustes de acessibilidade. A ordem dos scripts é a mesma em todas as páginas.

Para incluir outro experimento, defina campos, presets e `build` no laboratório correspondente. O metadado opcional `showWhen: {field, values}` exibe um campo apenas nos modos relevantes. Valide as entradas em `build`, mantenha a saída cumulativa e copie as variáveis em cada estado. Nunca injete entradas dos alunos no HTML sem `PCUtils.esc`.

## Referência pedagógica

Conteúdo original alinhado à [pasta da disciplina](https://drive.google.com/drive/u/0/folders/1lU_WOt8rbvVKMY42LTWUlwUIm6DDGVSr), especialmente às aulas 02–04 e à revisão até vetores: condições, percorrimento manual, índices, validação, acumuladores e a gincana de livros. Matrizes, memória e funções ampliam a trilha solicitada. Não foram incorporados enunciados de prova ou gabaritos do professor.

## Verificação

Conferidos: sintaxe JavaScript; saída de cenários comparada com Python 3.14; estados iniciais/finais; presets e entradas inválidas; navegação; próximo/anterior/reiniciar; reprodução e pausa; quizzes; persistência de progresso; apresentação em telas de computador e celular. O site é estático e não requer etapa de build.
