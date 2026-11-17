// Modelos didáticos locais. Nenhum SQL é enviado a um servidor ou otimizado aqui.
const CLIENTS = [
  [1, 'Vinicius', 'SP', 'vinicius@exemplo.com', '2026-01-10'],
  [2, 'Maria', 'MG', 'maria@exemplo.com', '2025-03-18'],
  [3, 'Ana', 'RJ', 'ana@exemplo.com', '2026-04-05'],
  [4, 'Claudio', 'SP', 'claudio@exemplo.com', '2025-09-12'],
  [5, 'Beatriz', 'BA', 'beatriz@exemplo.com', '2024-06-02'],
  [6, 'Diego', 'MG', 'diego@exemplo.com', '2026-05-23'],
  [7, 'Elisa', 'SP', 'elisa@exemplo.com', '2026-07-14'],
  [8, 'Fabio', 'PR', 'fabio@exemplo.com', '2025-11-20'],
  [9, 'Gabriela', 'RJ', 'gabriela@exemplo.com', '2026-02-08'],
  [10, 'Helena', 'SC', 'helena@exemplo.com', '2024-12-19'],
  [11, 'Igor', 'SP', 'igor@exemplo.com', '2026-08-30'],
  [12, 'Joana', 'MG', 'joana@exemplo.com', '2025-10-09'],
].map(([Id, Nome, UF, Email, DataCadastro]) => ({Id, Nome, UF, Email, DataCadastro}));
const FIELDS = ['Id', 'Nome', 'UF', 'Email', 'DataCadastro'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const by = (...keys) => (a, b) => { for (const k of keys) { const c = String(a[k]).localeCompare(String(b[k]), 'pt-BR', {numeric:true}); if (c) return c; } return 0; };
const btn = (action, text, options = '') => `<button type="button" data-action="${action}" ${options}>${text}</button>`;
const code = text => `<pre class="sl-code"><code>${esc(text)}</code></pre>`;
const note = (text, tone = '') => `<div class="sl-note ${tone}" role="status">${text}</div>`;
const metric = (value, text, extra = '') => `<div class="sl-metric ${extra}"><strong>${esc(value)}</strong><span>${text}</span></div>`;
const metrics = (...items) => `<div class="sl-metrics">${items.join('')}</div>`;
const box = (title, subtitle, body, kind = '') => `<section class="sl-box ${kind}"><header><span>${title}</span><small>${subtitle}</small></header>${body}</section>`;
function table(rows, columns, options = {}) {
  const {active = [], dim = false, empty = 'Nenhuma linha neste conjunto.', label = 'Dados do modelo'} = options;
  return `<div class="sl-table-scroll"><table aria-label="${esc(label)}"><thead><tr>${columns.map(c => `<th scope="col">${esc(c === 'Locator' ? 'Localizador' : c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr class="${active.includes(r.Id) ? 'sl-lit' : dim ? 'sl-dim' : ''}">${columns.map(c => `<td>${c === 'Locator' ? `<span class="sl-locator">${esc(r.Locator ?? `Id = ${r.Id}`)}</span>` : esc(r[c])}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${columns.length}">${empty}</td></tr>`}</tbody></table></div>`;
}
const select = (name, label, options, value) => `<label class="sl-field"><span>${label}</span><select data-control="${name}">${options.map(o => {const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(value) === String(v) ? 'selected' : ''}>${esc(t)}</option>`;}).join('')}</select></label>`;
const range = (name, label, min, max, value, unit = '') => `<label class="sl-field sl-range"><span>${label}: <b>${value}${unit}</b></span><input data-control="${name}" type="range" min="${min}" max="${max}" value="${value}"></label>`;
const toolbar = (...parts) => `<div class="sl-toolbar">${parts.join('')}</div>`;
const flow = steps => `<div class="sl-flow">${steps.map((s, i) => `${i ? '<span class="sl-flow-arrow" aria-hidden="true">→</span>' : ''}<div>${s}</div>`).join('')}</div>`;
const query = (columns = 'Id, Nome', filter = "UF = 'SP'") => `SELECT ${columns}\nFROM dbo.Cliente\nWHERE ${filter};`;
const clientCopy = () => CLIENTS.map(c => ({...c}));

function bookLab(state) {
  const terms = [{term:'Índices', pages:[2,7]}, {term:'JOIN', pages:[4,9]}, {term:'SQL Server', pages:[1,6]}, {term:'Transações', pages:[5,10]}];
  const current = terms[Number(state.term ?? 0)];
  const mode = state.mode ?? 'index';
  const step = Number(state.step ?? 0);
  const finished = step >= (mode === 'scan' ? 10 : 3);
  const pages = mode === 'scan' ? Array.from({length:Math.min(step,10)}, (_,i)=>i+1) : step === 0 ? [] : step === 1 ? [] : current.pages.slice(0, step-1);
  return toolbar(select('term','Assunto',terms.map((t,i)=>[i,t.term]), state.term??0), select('mode','Caminho', [['index','Consultar índice remissivo'],['scan','Ler página por página']], mode), btn('step',finished?'Percurso concluído':'Próximo passo →',finished?'disabled':''), btn('reset','Recomeçar')) +
  `<div class="sl-book-layout">${box('ÍNDICE REMISSIVO','Uma estrutura separada, em ordem alfabética', `<div class="sl-book-index">${terms.map((t,i)=>`<div class="${mode==='index' && step>0 && Number(state.term??0)===i?'sl-chosen':''}"><b>${t.term}</b><span class="sl-dots"></span><span>${t.pages.join(', ')}</span></div>`).join('')}</div>`, 'sl-secondary')}
  ${box('O LIVRO','As páginas continuam sendo o conteúdo original', `<div class="sl-pages">${Array.from({length:10},(_,i)=>`<div class="sl-page ${pages.includes(i+1)?'sl-page-read':''} ${pages.includes(i+1)&&current.pages.includes(i+1)?'sl-page-match':''}"><small>PÁGINA ${i+1}</small><span class="sl-page-lines" aria-hidden="true"></span>${pages.includes(i+1) && current.pages.includes(i+1)?`<b>${current.term}</b>`:'<span class="sl-page-lines short" aria-hidden="true"></span>'}</div>`).join('')}</div>`)}</div>`+
  metrics(metric(pages.length,'páginas do livro visitadas'),metric(mode==='index' && step>0 ? 1:0,'entrada do índice consultada'))+
  note(step===0?'Procure um assunto. Primeiro escolha como chegar até ele.':mode==='index'?(step===1?`Encontramos “${current.term}” no índice. Agora seguimos os números das páginas.`:`As referências apontam para ${current.pages.join(' e ')}. O índice não contém o capítulo inteiro.`):'Sem consultar o índice, visitamos páginas até encontrar o assunto. Avance para continuar a leitura.')+
  `<p class="sl-caption">Analogia: um índice não clusterizado lembra o índice remissivo; a chave clusterizada funciona como o endereço da linha, e não como um número de página permanente.</p>`;
}

function treeLab(state) {
  const target = Number(state.target ?? 8), isRange=state.treeMode==='range';
  const end=isRange?Math.max(target,Number(state.rangeEnd??10)):target;
  const group = Math.floor((target-1)/4), lastGroup=Math.floor((end-1)/4);
  const limit=3+lastGroup-group, stage = Math.min(Number(state.step??0),limit);
  const visitedThrough=stage<3?-1:Math.min(lastGroup,group+stage-3);
  const found=stage<3?[]:CLIENTS.filter(c=>c.Id>=target&&c.Id<=end&&Math.floor((c.Id-1)/4)<=visitedThrough);
  const titles = ['Raiz → escolha uma faixa', 'Nível intermediário → escolha a página', 'Folha → dados completos da tabela'];
  return toolbar(select('treeMode','Operação',[['equality','Igualdade · uma chave'],['range','Intervalo · seguir pelas folhas']],isRange?'range':'equality'),select('target',isRange?'Id inicial':'Buscar Id',CLIENTS.map(c=>[c.Id, `${c.Id} · ${c.Nome}`]),target),isRange?select('rangeEnd','Id final',CLIENTS.filter(c=>c.Id>=target).map(c=>c.Id),end):'',btn('step',stage>=limit?'Percurso concluído':stage>=3?'Seguir à próxima folha →':'Próximo passo →',stage>=limit?'disabled':''),btn('reset','Recomeçar'))+
  code(query('Id, Nome, UF',isRange?`Id >= ${target} AND Id <= ${end}`:`Id = ${target}`))+
  `<div class="sl-tree" aria-label="Árvore B+ simplificada"><div class="sl-level-label">${titles[0]}</div><div class="sl-tree-root ${stage>=1?'sl-tree-active':''}"><span>1–12</span><small>RAIZ · separadores e ponteiros</small></div><div class="sl-tree-stem" aria-hidden="true"></div>
  <div class="sl-level-label">${titles[1]}</div><div class="sl-tree-branches">${[0,1,2].map(g=>`<div class="sl-tree-node ${stage>=2 && group===g?'sl-tree-active':''}"><b>${g*4+1} – ${g*4+4}</b><small>ponteiro para a folha</small></div>`).join('')}</div>
  <div class="sl-level-label">${titles[2]}</div><div class="sl-tree-leaves">${[0,1,2].map(g=>box(`PÁGINA ${g+1}`,`Id ${g*4+1} a ${g*4+4}`,table(CLIENTS.slice(g*4,g*4+4),['Id','Nome','UF'],{active:found.map(c=>c.Id),dim:stage>=3}),g>=group&&g<=visitedThrough?'sl-tree-active':'')).join('')}</div><div class="sl-leaf-link">← folhas encadeadas: uma faixa continua na próxima folha →</div></div>`+
  metrics(metric(stage,'etapas do percurso'),metric(3,'níveis neste desenho'),metric(found.length,'linhas encontradas até este passo'))+
  note(stage===0?'Escolha uma chave ou intervalo. Não precisamos visitar todos os ramos.':stage===1?'A raiz delimita a região em que a primeira chave pode estar.':stage===2?'O intermediário indica a primeira página folha que precisamos visitar.':isRange?`Já encontramos ${found.length} linha(s). ${stage<limit?'A faixa continua: siga a ligação para a próxima folha sem reiniciar pela raiz.':'Chegamos ao fim da faixa solicitada; não precisamos visitar outras folhas.'}`:`Na folha encontramos Id ${target}: ${CLIENTS[target-1].Nome}. Em índice clusterizado, a folha é o dado da tabela.`)+
  `<p class="sl-caption">Árvore propositalmente pequena e com um nível intermediário para ensinar a navegação. Páginas reais têm 8 KiB e comportam muitas entradas; com poucos dados, um índice real pode ter só uma página. A ordenação é lógica, sem garantia de contiguidade física.</p>`;
}

function storageLab(state) {
  const heap=state.storage==='heap';
  const items=(heap?[CLIENTS[5],CLIENTS[1],CLIENTS[3],CLIENTS[0],CLIENTS[2],CLIENTS[4]]:CLIENTS.slice(0,6)).map((c,i)=>({...c,RID:`1:${120+Math.floor(i/3)}:${i%3}`}));
  const chosen=Number(state.target??4);
  return toolbar(select('storage','Organização', [['cluster','Clustered rowstore por Id'],['heap','Heap, sem índice clusterizado']],heap?'heap':'cluster'),select('target','Linha em destaque',CLIENTS.slice(0,6).map(c=>[c.Id,c.Nome]),chosen))+
  `<div class="sl-split">${box(heap?'HEAP':'ÍNDICE CLUSTERIZADO',heap?'Páginas sem ordenação lógica pela chave':'As páginas folha são os dados da tabela',table(items,heap?['RID','Id','Nome','UF','DataCadastro']:FIELDS.filter(c=>c!=='Email'),{active:[chosen]}),'sl-primary')}${box('O QUE UM NONCLUSTERED GUARDA?','Chave de busca + localizador',table([...items].sort(by('UF','Id')).map(c=>({...c,Locator:heap?`RID ${c.RID}`:`Id = ${c.Id}`})),['UF','Locator'],{active:[chosen]}),'sl-secondary')}</div>`+
  flow([heap?'UF → RID (arquivo:página:slot)':'UF → chave clusterizada Id',heap?'RID Lookup → linha no heap':'Key Lookup → linha na árvore clusterizada'])+
  note(heap?'Um heap pode ter índices não clusterizados. O localizador é um RID; alterações em linhas de tamanho variável podem gerar forwarded records.':'Só pode existir uma organização clusterizada por tabela. A chave primária é uma restrição; pode usar um índice NONCLUSTERED.')+
  `<p class="sl-caption">As caixinhas mostram amostras, não todas as páginas. RIDs como 1:120:0 são endereços fictícios no formato arquivo:página:slot; a mesma referência aparece no heap e no índice. O Id continua sendo um dado da linha e não é o localizador do heap.</p>`;
}

function copiesLab(state) {
  const selected=Number(state.target??4);
  const rows=CLIENTS.slice(0,8);
  const named=!!state.named;
  return toolbar(select('target','Encontre a mesma linha nas estruturas',rows.map(c=>[c.Id,`${c.Id} · ${c.Nome}`]),selected),btn('toggle-named',named?'Remover INCLUDE (Nome)':'Adicionar INCLUDE (Nome)',`aria-pressed="${named}"`))+
  `<div class="sl-copy-grid">${box('TABELA · CLUSTERED (Id)','Folhas com a linha completa',table(rows,['Id','Nome','UF','Email'],{active:[selected]}),'sl-primary')}${box('IX_Cliente_UF','Cópia parcial · ordenada por UF',table([...rows].sort(by('UF','Id')),named?['UF','Id','Nome']:['UF','Id'],{active:[selected]}),'sl-secondary')}${box('IX_Cliente_Nome','Outra cópia parcial · ordenada por Nome',table([...rows].sort(by('Nome','Id')),['Nome','Id'],{active:[selected]}),'sl-tertiary')}</div>`+
  code(`CREATE INDEX IX_Cliente_UF ON dbo.Cliente (UF)${named?'\nINCLUDE (Nome)':''};\nCREATE INDEX IX_Cliente_Nome ON dbo.Cliente (Nome);`)+
  note(`A linha Id ${selected} aparece em três estruturas, mas cada uma armazena colunas diferentes. Id está nos índices não clusterizados como localizador porque é a chave clusterizada deste exemplo.`)+
  `<p class="sl-caption">“Cópia” é um modelo mental: índices armazenam suas próprias entradas e são mantidos pelo SQL Server na mesma transação. INCLUDE adiciona valores nas folhas; não cria uma nova ordenação.</p>`;
}

function accessLab(state) {
  const mode=state.mode??'seek', uf=state.uf??'SP', step=Math.min(Number(state.step??0),CLIENTS.length);
  const sorted=[...CLIENTS].sort(by('UF','Id'));
  const matches=sorted.filter(c=>c.UF===uf);
  const visited=mode==='scan'?CLIENTS.slice(0,step):step===0?[]:step===1?[]:matches.slice(0,step-1);
  const found=visited.filter(c=>c.UF===uf);
  const finished=step >= (mode==='scan'?CLIENTS.length:matches.length+1);
  return toolbar(select('mode','Acesso',[['seek','Index Seek em UF'],['scan','Clustered Index Scan']],mode),select('uf','UF procurada',['SP','MG','RJ','BA','PR','SC'],uf),btn('step',finished?'Leitura concluída':'Avançar leitura →',finished?'disabled':''),btn('reset','Recomeçar'))+
  code(query('Id, UF',`UF = '${uf}'`))+
  `<div class="sl-split">${box(mode==='scan'?'PÁGINAS DO CLUSTERED':'FOLHAS DO NONCLUSTERED',mode==='scan'?'Visita linhas e testa o predicado':'Desce pela chave e percorre a faixa correspondente',table(mode==='scan'?CLIENTS:sorted,mode==='scan'?['Id','Nome','UF']:['UF','Id'],{active:visited.map(c=>c.Id),dim:true}),'sl-primary')}${box('RESULTADO','Somente as linhas aprovadas no predicado',table(found,['Id','UF']))}</div>`+
  metrics(metric(visited.length,'entradas folha visitadas no modelo'),metric(found.length,'linhas encontradas'),metric(mode==='seek'&&step>0?'sim':'—','navegação pela árvore'))+
  note(mode==='seek'?(step===1?'A árvore localiza o início da faixa. Próximo passo: ler a primeira entrada correspondente.':'Um seek localiza uma chave ou faixa, mas ainda pode percorrer muitas entradas.'): 'Um scan também usa uma estrutura de índice neste caso. Scan não significa necessariamente “sem índice”, nem é sempre ruim.')+
  `<p class="sl-caption">Contamos entradas do desenho, não leituras lógicas de páginas. Navegação e detecção do fim da faixa foram simplificadas; o plano real depende do custo estimado.</p>`;
}

function lookupLab(state, includeByDefault=false) {
  const covered=state.covered??includeByDefault, all=!!state.all;
  const uf=state.uf??'SP';
  const matches=CLIENTS.filter(c=>c.UF===uf);
  const step=Math.min(Number(state.step??0),matches.length+2);
  const selected=all?FIELDS:['Id','Nome','UF'];
  const needsLookup=!covered||all;
  const finished=step >= (needsLookup?matches.length+2:2);
  const ids=step>=2?matches.map(c=>c.Id):[];
  const lookups=step<3?[]:matches.slice(0,step-2);
  const done=needsLookup?lookups:step>=2?matches:[];
  return toolbar(select('uf','Filtro UF',['SP','MG','RJ','BA'],uf),btn('toggle-coverage',covered?'INCLUDE (Nome) ativo':'Adicionar INCLUDE (Nome)',`aria-pressed="${covered}"`),btn('toggle-all',all?'SELECT * ativo':'Experimentar SELECT *',`aria-pressed="${all}"`),btn('step',finished?'Resultado completo':'Próximo passo →',finished?'disabled':''),btn('reset','Recomeçar'))+
  code(`CREATE INDEX IX_Cliente_UF ON dbo.Cliente (UF)${covered?'\nINCLUDE (Nome)':''};\n\n${query(all?'*':'Id, Nome, UF',`UF = '${uf}'`)}`)+
  `<div class="sl-split">${box('IX_Cliente_UF',covered?'Chave UF + localizador Id + Nome na folha':'Chave UF + localizador Id na folha',table([...CLIENTS].sort(by('UF','Id')),covered?['UF','Id','Nome']:['UF','Id'],{active:ids,dim:step>=2}),'sl-secondary')}${box('CLUSTERED (Id) · TABELA',needsLookup?'Acesse a linha base para buscar as colunas que faltam':'Consulta coberta: esta estrutura não precisa ser acessada',table(CLIENTS,['Id','Nome','UF','Email','DataCadastro'],{active:lookups.map(c=>c.Id),dim:true}),needsLookup?'sl-primary':'sl-muted')}</div>`+
  flow(needsLookup?['Index Seek (UF)',`Nested Loops · ${lookups.length} de ${matches.length}`, 'Key Lookup (Id) → colunas ausentes']:['Index Seek (UF)','Nome já está na folha','Resultado sem Key Lookup'])+
  metrics(metric(step>=2?matches.length:0,'localizadores encontrados'),metric(needsLookup?lookups.length:0,'lookups no modelo'),metric(done.length,'linhas prontas para devolver'))+
  note(!needsLookup?'Todas as colunas da consulta estão na folha. Avance até a leitura da faixa: nenhuma volta à tabela base é necessária.':all&&covered?'INCLUDE (Nome) cobre Nome, mas SELECT * ainda solicita Email e DataCadastro. A consulta volta a precisar da tabela base.':step<2?'Primeiro localizamos a faixa de UF no índice. Depois buscamos Nome na linha base.':'Cada resultado do seek alimenta um lookup pela chave Id. Poucos lookups podem ser baratos; muitos podem levar o otimizador a preferir um scan.')+
  (done.length?box('RESULTADO PARCIAL','Linhas já materializadas',table(done,selected)):'')+
  `<p class="sl-caption">Plano e contadores são didáticos; um plano real pode escolher scan ou outro acesso. Lookup não é erro por si só. Cada avanço após localizar a faixa completa uma busca na tabela base.</p>`;
}

function compositeLab(state) {
  const order=state.order??'uf', condition=state.condition??'both';
  const keys=order==='uf'?['UF','Nome']:['Nome','UF'];
  const filter=condition==='both'?"UF = 'SP' AND Nome LIKE 'C%'":condition==='uf'?"UF = 'SP'":"Nome LIKE 'C%'";
  const matches=CLIENTS.filter(c=>(condition==='name'||c.UF==='SP')&&(condition==='uf'||c.Nome.startsWith('C')));
  const canSeek=order==='uf'?condition!=='name':condition!=='uf';
  const residual=order==='name'&&condition==='both';
  const candidates=!canSeek?CLIENTS:order==='uf'?(condition==='both'?matches:CLIENTS.filter(c=>c.UF==='SP')):CLIENTS.filter(c=>c.Nome.startsWith('C'));
  return toolbar(select('order','Ordem das chaves',[['uf','(UF, Nome)'],['name','(Nome, UF)']],order),select('condition','Predicado',[['both',"UF = 'SP' e Nome começa com C"],['uf',"Somente UF = 'SP'"],['name','Somente Nome começa com C']],condition))+
  code(`CREATE INDEX IX_Cliente_Composto ON dbo.Cliente (${keys.join(', ')});\n\n${query('Id, Nome, UF',filter)}`)+
  `<div class="sl-split">${box('ORDEM LEXICOGRÁFICA',`Primeiro ${keys[0]}; dentro de cada valor, ${keys[1]}`,table([...CLIENTS].sort(by(...keys,'Id')),[...keys,'Id'],{active:candidates.map(c=>c.Id),dim:true}),'sl-secondary')}${box('RESULTADO',`${matches.length} linha(s) atende(m) ao predicado`,table(matches,['Id','Nome','UF']))}</div>`+
  flow([canSeek?'Prefixo utilizável para seek':'Sem prefixo de busca nesta simulação',residual?'Faixa em Nome → UF como residual':canSeek?'Faixa contígua nas chaves':'Scan de entradas', 'Aplicar todos os predicados'])+
  note(!canSeek?'Buscar só pela segunda chave não oferece, em geral, uma faixa única pela primeira. SQL Server ainda pode escolher um scan deste índice, que pode ser mais estreito que a tabela.':residual?'A faixa LIKE em Nome delimita o seek; UF pode ser avaliada como predicado residual dentro dessa faixa. Igualdades antes da faixa costumam permitir limites mais úteis.':'A ordem das chaves permite agrupar valores iguais e navegar dentro do grupo. INCLUDE (Nome) não substituiria Nome como segunda chave de busca.')+
  `<p class="sl-caption">A amostra é pequena. A escolha real considera distribuição, estatísticas e custo; igualdade → faixa é uma orientação de projeto, não uma regra universal de ordenação.</p>`;
}

function sargLab(state, computed=false) {
  const mode=state.mode??(computed?'computed':'function');
  const year=Number(state.year??2026);
  const descriptions={function:`YEAR(DataCadastro) = ${year}`,range:`DataCadastro >= '${year}0101'\n  AND DataCadastro < '${year+1}0101'`,computed:`AnoCadastro = ${year}`,prefix:"Nome LIKE 'M%'",suffix:"Nome LIKE '%a'",arithmetic:'Id + 1 = 5',rewrite:'Id = 4'};
  const filter=descriptions[mode];
  const isDate=['function','range','computed'].includes(mode);
  const rows=CLIENTS.map(c=>({...c,AnoCadastro:Number(c.DataCadastro.slice(0,4)),Expressao:mode==='function'?Number(c.DataCadastro.slice(0,4)):mode==='arithmetic'?c.Id+1:undefined}));
  const result=rows.filter(c=>isDate?c.AnoCadastro===year:mode==='prefix'?c.Nome.startsWith('M'):mode==='suffix'?c.Nome.endsWith('a'):c.Id===4);
  const seek=['range','computed','prefix','rewrite'].includes(mode);
  const index=mode==='computed'?'(AnoCadastro)':isDate?'(DataCadastro)':mode==='arithmetic'||mode==='rewrite'?'(Id)':'(Nome)';
  return toolbar(select('mode','Forma do predicado',computed?[['function','Função na coluna original'],['range','Intervalo na data original'],['computed','Coluna calculada indexada']]:[['function','YEAR(DataCadastro)'],['range','Intervalo de datas'],['prefix',"LIKE 'M%'"],['suffix',"LIKE '%a'"],['arithmetic','Id + 1 = 5'],['rewrite','Id = 4']],mode),isDate?select('year','Ano',[2024,2025,2026],year):'')+
  code((mode==='computed'?`ALTER TABLE dbo.Cliente\nADD AnoCadastro AS YEAR(DataCadastro) PERSISTED;\nCREATE INDEX IX_Cliente_Ano ON dbo.Cliente (AnoCadastro);\n\n`:`-- Índice disponível em ${index}\n`)+query('Id, Nome, DataCadastro',filter))+
  `<div class="sl-split">${box(`ÍNDICE ${index}`,seek?'A chave permite delimitar uma faixa neste exemplo':'O predicado não oferece um limite direto para esta chave',table([...rows].sort(by(mode==='computed'?'AnoCadastro':isDate?'DataCadastro':mode==='arithmetic'||mode==='rewrite'?'Id':'Nome')),mode==='computed'?['AnoCadastro','Id']:isDate?['DataCadastro','Id']:mode==='arithmetic'||mode==='rewrite'?['Id']:['Nome','Id'],{active:(seek?result:rows).map(c=>c.Id),dim:true}),'sl-secondary')}${box('LINHAS ENCONTRADAS','Mesma intenção; compare a forma de buscar',table(result,['Id','Nome',isDate?'DataCadastro':'UF']))}</div>`+
  metrics(metric(seek?'Faixa buscável':'Avaliação por entrada','caminho ilustrativo'),metric(seek?result.length:rows.length,'entradas candidatas neste modelo'),metric(result.length,'linhas do resultado'))+
  note(mode==='computed'?'O resultado de YEAR passa a ser a própria chave do índice. PERSISTED armazena a coluna na tabela; não é obrigatório para toda coluna calculada indexável. Exige determinismo, precisão, tipo e opções SET compatíveis.':mode==='range'?'Um intervalo semiaberto inclui o ano inteiro, inclusive horários, sem aplicar YEAR à coluna. Evite BETWEEN com um horário final incompleto.':mode==='prefix'?'Um prefixo fixo pode delimitar uma faixa pela ordenação do texto. Collation, tipo e outros fatores influenciam o plano.':mode==='suffix'?'O início do texto é desconhecido: um B+ tree comum por Nome não delimita diretamente a faixa. Pode existir Index Scan; “não fazer seek” não significa “não usar índice”.':mode==='function'?'YEAR na coluna não fornece, em geral, um seek por DataCadastro. Nem toda função impede seek: existem transformações do otimizador e casos especiais. Inspecione Seek Predicates e Predicate.':mode==='arithmetic'?'A expressão modifica a chave na comparação. Reescrever o predicado para comparar Id diretamente torna a intenção buscável; o otimizador pode fazer algumas simplificações.':'A chave é comparada diretamente a uma constante. O otimizador ainda pode optar por outro acesso se seu custo for menor.')+
  `<p class="sl-caption">Resultados são calculados dos 12 clientes. Caminhos e contagens de candidatos ilustram o conceito; não reproduzem o otimizador. Um índice não coberto pode exigir lookups para as demais colunas selecionadas.</p>`;
}

function planLab(state) {
  const covered=!!state.covered;
  const node=state.node??'seek';
  const real=Number(state.real??4), estimate=Number(state.estimate??2);
  const nodes={
    seek:{title:'Index Seek',sub:'IX_Cliente_UF',props:[['Seek Predicates',"UF = 'SP'"],['Predicate residual','nenhum no modelo'],['Estimated rows',estimate],['Actual rows',real],['Actual rows read',real],['Output List',covered?'Id, UF, Nome':'Id, UF']]},
    lookup:{title:'Key Lookup',sub:'PK_Cliente (CLUSTERED)',props:[['Seek Predicates','Id = OuterReference(Id)'],['Coluna obtida','Nome'],['Actual executions',real],['Actual rows / execução',1],['Localizador','chave clusterizada Id']]},
    loops:{title:'Nested Loops',sub:'Inner Join',props:[['Entrada externa','linhas do Index Seek'],['Entrada interna','Key Lookup por Id'],['Actual rows',real],['Propósito','juntar chave e coluna buscada']]},
    select:{title:'SELECT',sub:'Resultado da consulta',props:[['Actual rows',real],['Colunas','Id, Nome, UF'],['Custo percentual','estimativa relativa, não cronômetro'],['Atenção','essas métricas são ilustrativas']]}
  };
  const active=nodes[!covered||!['lookup','loops'].includes(node)?node:'seek'];
  const op=(key)=>`<button type="button" class="sl-operator ${key===node?'sl-selected':''}" data-action="node" data-value="${key}" aria-pressed="${key===node}"><span class="sl-op-icon" aria-hidden="true">${key==='seek'?'⌕':key==='lookup'?'↪':key==='loops'?'⋈':'▤'}</span><strong>${nodes[key].title}</strong><small>${nodes[key].sub}</small></button>`;
  return toolbar(btn('toggle-coverage',covered?'Plano com cobertura':'Adicionar INCLUDE (Nome)',`aria-pressed="${covered}"`),select('estimate','Linhas estimadas',[1,2,4,10,100],estimate),select('real','Linhas reais ilustrativas',[1,4,10,100],real))+
  code(query('Id, Nome, UF'))+
  `<div class="sl-plan-caption"><b>Fluxo de dados: da direita para a esquerda</b><span>Clique nos operadores para inspecionar as propriedades.</span></div><div class="sl-plan ${covered?'sl-plan-covered':''}"><div>${op('select')}</div><span class="sl-plan-arrow" aria-hidden="true">←<small>${real} linhas</small></span>${covered?`<div>${op('seek')}</div>`:`<div>${op('loops')}</div><span class="sl-plan-arrow" aria-hidden="true">←</span><div class="sl-plan-children">${op('seek')}<span class="sl-plan-branch" aria-hidden="true">↓ Id alimenta a busca</span>${op('lookup')}</div>`}</div>`+
  box(active.title,active.sub,`<dl class="sl-properties">${active.props.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`)+
  note(estimate!==real?`Estimativa de ${estimate}, realidade de ${real}. Diferenças podem alterar a qualidade de joins, memória e escolha entre scan e seek. Não identificam, sozinhas, a causa. A amostra abaixo não mudou: alteramos métricas hipotéticas.`:'Estimativa e realidade coincidem no cenário escolhido. Ainda precisamos avaliar leituras, CPU, tempo e comportamento em outras execuções.')+
  `<p class="sl-caption">Plano desenhado para estudo, não capturado do SQL Server. O plano estimado não executa a consulta; o real inclui métricas da execução. O mecanismo solicita linhas dos filhos (pull); as setas representam o fluxo dos dados.</p>`;
}

function clausesLab(state) {
  const mode=state.mode??'where';
  const scenarios={
    where:{sql:query('Id, Nome',"UF = 'SP'"),index:'(UF) INCLUDE (Nome)',nodes:['Index Seek em UF','Colunas cobertas','SELECT'],explain:'WHERE pode delimitar chaves e faixas. Predicados adicionais podem ser residuais; confirme nas propriedades do operador.'},
    order:{sql:"SELECT Id, Nome FROM dbo.Cliente\nWHERE UF = 'SP'\nORDER BY Nome;",index:'(UF, Nome)',nodes:['Seek no grupo SP','Folhas já em Nome','SELECT sem Sort, se o plano preservar a ordem'],explain:'Igualdade em UF libera a ordenação pela próxima chave. Um plano paralelo ou outro operador pode exigir Sort; só ORDER BY garante a ordem do resultado.'},
    join:{sql:"SELECT p.Id, c.Nome\nFROM dbo.Pedido AS p\nJOIN dbo.Cliente AS c ON c.Id = p.ClienteId\nWHERE c.Id = 4;",index:'Pedido (ClienteId) + Cliente (Id)',nodes:['Encontrar cliente','Seek dos pedidos por ClienteId','Nested Loops como uma opção'],explain:'Uma chave estrangeira não cria automaticamente um índice. Nested Loops pode aproveitar buscas; Hash Join e Merge Join podem ser melhores para outros volumes.'},
    group:{sql:"SELECT UF, COUNT(*) AS Quantidade\nFROM dbo.Cliente\nGROUP BY UF;",index:'(UF)',nodes:['Index Scan estreito','Stream Aggregate em entradas agrupadas','Uma linha por UF'],explain:'GROUP BY pode aproveitar ordenação para Stream Aggregate. Um Hash Aggregate não exige entrada ordenada. Contar todas as UFs ainda exige processar todas as entradas relevantes.'},
    top:{sql:"SELECT TOP (3) Id, DataCadastro\nFROM dbo.Cliente\nORDER BY DataCadastro DESC, Id DESC;",index:'(DataCadastro DESC, Id DESC)',nodes:['Acesso em ordem útil','Parar após 3 linhas','Sem ler todo o conjunto, neste cenário'],explain:'TOP com ORDER BY pode encerrar cedo quando o acesso entrega a ordem desejada. Inclua um desempate para uma escolha determinística; empates e filtros adicionais mudam o trabalho.'}
  };
  const s=scenarios[mode];
  const shown=mode==='top'?[...CLIENTS].sort((a,b)=>by('DataCadastro','Id')(b,a)).slice(0,3):[...CLIENTS].sort(by(mode==='order'?'UF':'Id','Nome')).slice(0,8);
  return toolbar(select('mode','Onde o índice participa',[['where','WHERE · localizar'],['order','ORDER BY · ordenar'],['join','JOIN · relacionar'],['group','GROUP BY · agrupar'],['top','TOP · parar cedo']],mode))+
  code(`-- Índice candidato: ${s.index}\n${s.sql}`)+flow(s.nodes)+
  (mode==='group'?box('A MESMA ORDEM AJUDA A AGRUPAR','Cada caixa é uma faixa de UF',`<div class="sl-grouped">${['BA','MG','PR','RJ','SC','SP'].map(uf=>`<div><b>${uf}</b><span>${CLIENTS.filter(c=>c.UF===uf).length} clientes</span></div>`).join('')}</div>`):box(mode==='top'?'RESULTADO · TOP (3)':'ESTRUTURA CANDIDATA',s.index,table(shown,mode==='top'?['Id','DataCadastro']:['Id','Nome','UF','DataCadastro'])))+
  note(s.explain)+`<p class="sl-caption">São caminhos possíveis, não planos garantidos. A existência de um índice não obriga seu uso.</p>`;
}

function selectivityLab(state) {
  const percent=Number(state.percent??5), width=Number(state.width??8);
  const matches=Math.round(10000*percent/100), lookup=matches*3, scan=width*100;
  const seekCost=3+Math.ceil(matches/100)+lookup;
  const prefer=seekCost<scan?'seek + lookups':'scan';
  return toolbar(range('percent','Percentual de linhas solicitado',1,100,percent,'%'),select('width','Largura ilustrativa da tabela',[['2','Estreita · 200 páginas'],['8','Média · 800 páginas'],['20','Larga · 2.000 páginas']],width))+
  `<div class="sl-compare"><div><h4>Seek + lookups</h4><div class="sl-cost-bar"><span style="width:${Math.min(100,seekCost/Math.max(seekCost,scan)*100)}%"></span></div><b>${seekCost.toLocaleString('pt-BR')} unidades</b><small>3 + entradas folha + 3 × linhas</small></div><div><h4>Scan da tabela</h4><div class="sl-cost-bar sl-cost-blue"><span style="width:${scan/Math.max(seekCost,scan)*100}%"></span></div><b>${scan.toLocaleString('pt-BR')} unidades</b><small>páginas percorridas uma vez</small></div></div>`+
  metrics(metric('10.000','linhas da tabela hipotética'),metric(matches.toLocaleString('pt-BR'),'linhas solicitadas'),metric(prefer,'menor pontuação deste modelo'))+
  note(`Ao variar o percentual e a largura, o custo relativo se inverte. ${percent}% das linhas não determina sozinho o melhor acesso: cobertura, distribuição e páginas em cache também importam.`)+
  `<p class="sl-caption"><b>Modelo inventado para comparar tendências.</b> “Unidades” não são o custo do SQL Server, leituras reais nem milissegundos. Não existe um percentual universal de tipping point. Uma consulta coberta mudaria totalmente esta comparação.</p>`;
}

function filteredLab(state) {
  const scope=state.scope??'pending';
  const items=Array.from({length:12},(_,i)=>({Id:i+1,ClienteId:(i+1)%3===0?12:9,Status:[2,5,8,11].includes(i+1)&&!(state.filteredPaid&&i+1===5)?'Pendente':'Pago',DataPedido:`2026-11-${String(i+1).padStart(2,'0')}`,Total:(150+(i+1)*10).toFixed(2)}));
  const filtered=items.filter(c=>c.Status==='Pendente').sort(by('ClienteId','DataPedido','Id'));
  const results=scope==='parameter'?[]:items.filter(c=>c.ClienteId===9&&(scope==='all'||c.Status===(scope==='paid'?'Pago':'Pendente'))).sort(by('DataPedido','Id'));
  return toolbar(select('scope','Consulta do cliente 9',[['pending',"Status = 'Pendente'"],['paid',"Status = 'Pago'"],['all','Todos os status'],['parameter','Status = @status']],scope),btn('filtered-pay',state.filteredPaid?'Pedido 5 agora é Pago':'Mudar pedido 5: Pendente → Pago',state.filteredPaid?'disabled':''),btn('filtered-restore','Restaurar pedido 5'))+
  code("CREATE INDEX IX_Pedido_Pendente\nON dbo.Pedido (ClienteId, DataPedido)\nINCLUDE (Total)\nWHERE Status = 'Pendente';\n\nSELECT DataPedido, Total\nFROM dbo.Pedido\nWHERE ClienteId = 9"+(scope==='all'?'':scope==='parameter'?' AND Status = @status':` AND Status = '${scope==='paid'?'Pago':'Pendente'}'`)+"\nORDER BY DataPedido;")+
  `<div class="sl-split">${box('TABELA PEDIDO · CLUSTERED (Id)',`${items.length} linhas no modelo · todos os status`,table(items,['Id','ClienteId','Status','DataPedido','Total'],{active:results.map(c=>c.Id)}),'sl-primary')}${box('IX_Pedido_Pendente',`${filtered.length} entradas · só Status = Pendente`,table(filtered,['ClienteId','DataPedido','Id','Total'],{active:scope==='pending'?results.map(c=>c.Id):[]}),'sl-secondary')}</div>`+
  metrics(metric(items.length,'pedidos na tabela'),metric(filtered.length,'entradas no índice filtrado'),metric(scope==='parameter'?'—':results.length,'linhas da consulta selecionada'))+
  note(scope==='parameter'?'Um plano reutilizável precisa ser correto para todos os valores possíveis de @status. O otimizador pode não provar que o filtro se aplica. Um literal conhecido ou recompilação em um contexto apropriado pode mudar isso.':scope==='pending'?'A consulta implica o filtro. As linhas necessárias estão neste subconjunto; as estatísticas do índice também descrevem somente os pendentes.':'Este índice não contém todas as linhas exigidas pela consulta. O otimizador precisa de outro caminho para obter um resultado completo.')+
  (state.filteredPaid?note('O pedido 5 continua na tabela base com Status = Pago. Sua entrada foi removida do índice filtrado na mesma transação. A chave Status não precisa estar copiada na folha para o filtro definir a participação da linha.'):'')+
  (scope==='parameter'?'':box('RESULTADO DA CONSULTA','Em ordem de DataPedido',table(results,['DataPedido','Total'])))+
  `<p class="sl-caption">Conjunto didático próprio de 12 pedidos. Id é o localizador clusterizado. O desenho não executa parâmetros nem gera um plano real. Filtros têm restrições de expressão; não são condições arbitrárias.</p>`;
}

function typesLab(state) {
  const type=state.type??'rowstore';
  const items=CLIENTS.slice(0,6);
  const hash=items.reduce((acc,c)=>{(acc[c.Id%4]??=[]).push(c);return acc;},{});
  const view=type==='rowstore'?`<div class="sl-records">${items.map(c=>`<div><b>${c.Id}</b><span>${c.Nome}</span><span>${c.UF}</span><small>${c.DataCadastro}</small></div>`).join('')}</div>`:type==='columnstore'?`<div class="sl-columnstore">${['Id','Nome','UF'].map(field=>`<div><b>${field}</b>${items.map(c=>`<span>${esc(c[field])}</span>`).join('')}</div>`).join('')}</div>`:type==='hash'?`<div class="sl-buckets">${[0,1,2,3].map(b=>`<div><b>Bucket ${b}</b><span>hash(Id) mod 4</span>${(hash[b]??[]).map(c=>`<code>${c.Id} · ${c.Nome}</code>`).join('')}</div>`).join('')}</div>`:`<div class="sl-special"><span aria-hidden="true">${type==='spatial'?'◎':type==='fulltext'?'Aa':'&lt;/&gt;'}</span><h4>${type==='spatial'?'Células e objetos no espaço':type==='fulltext'?'Termos, linguagem e texto':'Caminhos e valores XML'}</h4><p>${type==='spatial'?'Aproximações espaciais ajudam a selecionar candidatos; testes exatos podem ser aplicados depois.':type==='fulltext'?'Consultas CONTAINS e FREETEXT usam o mecanismo de texto completo. Isso não transforma qualquer LIKE em uma busca linguística.':'Índices XML atendem consultas específicas sobre documentos XML; existem índices primário e secundários.'}</p></div>`;
  const details={rowstore:['ROWSTORE · B+ TREE','Boa opção geral para buscas por igualdade e faixa em cargas transacionais. Pode ser clustered ou nonclustered.'],columnstore:['COLUMNSTORE','Armazena colunas em segmentos e grupos de linhas, com compressão. Favorece varreduras e agregações analíticas. Segment elimination e batch mode podem reduzir trabalho.'],hash:['HASH · TABELAS MEMORY-OPTIMIZED','Destina-se a tabelas otimizadas em memória. Excelente candidato para igualdade pela chave completa; não oferece ordenação ou buscas por intervalo. Colisões e bucket_count importam.'],spatial:['SPATIAL','Estrutura especializada para geometry/geography e consultas espaciais elegíveis. Não é um B+ tree convencional de latitude e longitude.'],fulltext:['FULL-TEXT','Busca linguística de palavras e frases. Tem criação, manutenção e semântica próprias; não é uma variação de INCLUDE.'],xml:['XML','Estruturas para caminhos, propriedades e valores de dados XML; escolha depende das consultas e do custo de manutenção.']};
  return toolbar(select('type','Família de índice',[['rowstore','Rowstore · B+ tree'],['columnstore','Columnstore'],['hash','Hash em memória'],['spatial','Espacial'],['fulltext','Texto completo'],['xml','XML']],type))+
  box(details[type][0],'O desenho é um modelo de organização, não um mapa físico',view)+note(details[type][1])+
  `<div class="sl-type-tags"><span>Clustered / nonclustered: organização</span><span>Unique / filtered: propriedades</span><span>B+ tree / columnstore / hash: famílias</span></div>`+
  `<p class="sl-caption">Tipos e opções disponíveis variam por versão, edição e armazenamento. “B-tree” é um nome comum; os índices rowstore do SQL Server usam B+ trees.</p>`;
}

function writesLab(state) {
  const insert=state.action==='insert', change=state.action==='update';
  const count=Number(state.count??2);
  const records=clientCopy().slice(0,5);
  if(insert)records.push({Id:13,Nome:'Karen',UF:'SP',Email:'karen@exemplo.com',DataCadastro:'2026-11-17'});
  if(change)records.find(c=>c.Id===4).UF='RJ';
  const indexes=[['IX_UF',['UF','Id']],['IX_Nome',['Nome','Id']],['IX_Email',['Email','Id']]].slice(0,count);
  const touched=insert?1+count:change?1+(count>=1?1:0):0;
  return toolbar(select('count','Índices não clusterizados',[0,1,2,3],count),btn('write-insert','Inserir Karen (Id 13)',`aria-pressed="${insert}"`),btn('write-update','Alterar UF de Claudio para RJ',`aria-pressed="${change}"`),btn('reset-all','Restaurar dados'))+
  `<div class="sl-copy-grid">${box('CLUSTERED (Id)','Dados da tabela',table(records,['Id','Nome','UF'],{active:insert?[13]:change?[4]:[]}),'sl-primary')}${indexes.map(([name,fields])=>box(name,`Chave ${fields[0]} + localizador Id`,table([...records].sort(by(fields[0],'Id')),fields,{active:insert?[13]:change&&name==='IX_UF'?[4]:[]}),'sl-secondary')).join('')}</div>`+
  metrics(metric(touched,'estruturas com valores alterados no cenário'),metric(insert?count:change&&count?1:0,'índices secundários com entradas alteradas'))+
  note(insert?'INSERT inclui uma entrada na tabela e em cada índice aplicável. Isso consome espaço, CPU, log e escrita; o benefício de leitura precisa justificar esse custo.':change?'Atualizar UF afeta a linha base e o índice que armazena UF. O cenário considera apenas estas colunas de chave; índices que incluíssem UF também exigiriam manutenção.':'Escolha uma alteração e veja quais caixinhas precisam mudar. As estruturas permanecem consistentes na mesma transação.')+
  `<p class="sl-caption">Contamos estruturas cujos valores mudam, não páginas, operações de log ou verificações internas. Alterar a própria chave clusterizada pode afetar os localizadores de todos os índices não clusterizados.</p>`;
}

function statsLab(state) {
  const stale=state.stale??true;
  const distribution=[['BA',1],['MG',3],['PR',1],['RJ',2],['SC',1],['SP',stale?4:40]];
  const total=distribution.reduce((a,[,n])=>a+n,0);
  return toolbar(btn('toggle-stats',stale?'Simular carga concentrada em SP':'Restaurar distribuição inicial'),btn('refresh-stats','Atualizar estatística do modelo'))+
  `<div class="sl-stats-chart" aria-label="Distribuição por UF">${distribution.map(([uf,n])=>`<div><b>${uf}</b><span><i style="width:${Math.max(2,n/40*100)}%"></i></span><strong>${n}</strong></div>`).join('')}</div>`+
  metrics(metric(total,'linhas reais na distribuição'),metric(state.refreshed?distribution.find(([uf])=>uf==='SP')[1]:4,'linhas SP estimadas no modelo'),metric(distribution.find(([uf])=>uf==='SP')[1],'linhas SP reais'))+
  note('Estatísticas descrevem distribuição e ajudam a estimar cardinalidade. O histograma tem até 200 passos e é da primeira coluna de chave da estatística; o vetor de densidade acrescenta informações sobre prefixos de colunas.')+
  code("DBCC SHOW_STATISTICS ('dbo.Cliente', 'IX_Cliente_UF');\n-- Após medir a necessidade no seu ambiente:\nUPDATE STATISTICS dbo.Cliente IX_Cliente_UF;")+
  `<p class="sl-caption">Este gráfico de frequências não reproduz as colunas de um histograma real. Após uma carga, estatísticas podem estar desatualizadas; atualização automática e amostragem dependem do ambiente. Correlação e parâmetros também afetam estimativas.</p>`;
}

function maintenanceLab(state) {
  const split=!!state.split;
  const density=Number(state.density??100);
  const values=split?[['10','15'],['20','30'],['40','50']]:[['10','20','30'],['40','50']];
  return toolbar(btn('toggle-split',split?'Restaurar páginas':'Inserir chave 15 na página cheia',`aria-pressed="${split}"`),select('density','Densidade ilustrativa',[['100','100% · páginas cheias'],['70','70% · espaço livre'],['40','40% · muito espaço livre']],density))+
  `<div class="sl-physical-pages">${values.map((p,i)=>`<div class="sl-physical-page"><small>PÁGINA ${[21,84,32][i]}</small><div>${p.map(v=>`<span class="${v==='15'?'sl-new-key':''}">${v}</span>`).join('')}${Array.from({length:Math.max(0,Math.round((100-density)/25))},()=>'<span class="sl-free">livre</span>').join('')}</div><b>chaves em ordem lógica</b></div>`).join('<span class="sl-page-next" aria-hidden="true">→</span>')}</div>`+
  flow(['Ordem lógica das chaves','Páginas não precisam ser contíguas','Ocupação afeta o número de páginas'])+
  note(split?'A inserção no meio pode exigir divisão da página quando não há espaço suficiente. O desenho redistribui chaves para explicar o split; alocação e distribuição reais são mais complexas.':'Fragmentação lógica e baixa densidade são problemas diferentes. Espaço livre pode acomodar escrita, mas aumenta o número de páginas a ler. Não reduza FILLFACTOR automaticamente.')+
  code("SELECT index_id, page_count,\n       avg_fragmentation_in_percent,\n       avg_page_space_used_in_percent\nFROM sys.dm_db_index_physical_stats(\n  DB_ID(), OBJECT_ID('dbo.Cliente'), NULL, NULL, 'SAMPLED');")+
  `<p class="sl-caption">Tamanho e capacidade das páginas são fictícios neste desenho. REORGANIZE e REBUILD têm custos de log, CPU e concorrência; a decisão deve usar tamanho, densidade, carga e medições. Evite regras fixas de percentual sem contexto.</p>`;
}

function tuningLab(state, challenge=false) {
  const choice=state.choice??'none', revealed=!!state.revealed;
  const options={none:['Nenhum índice candidato','Clustered scan possível','Sem nova estrutura'],uf:['(UF)','Seek + lookups possíveis','Uma chave estreita'],include:['(UF) INCLUDE (Nome)','Seek coberto possível','Nome copiado apenas nas folhas'],wide:['(UF, Nome, Email, DataCadastro)','Pode cobrir, mas chave maior','Mais dados nos níveis da árvore']};
  const s=options[choice];
  return code("-- Consulta frequente: procurar poucos clientes de uma UF\nSELECT Id, Nome\nFROM dbo.Cliente\nWHERE UF = @uf;\n-- Id é a chave clusterizada; outras consultas também existem.")+
  toolbar(select('choice','Projete um índice',[['none','Sem novo índice'],['uf','Chave: UF'],['include','Chave: UF · INCLUDE: Nome'],['wide','Chave: UF, Nome, Email, DataCadastro']],choice),btn('reveal',challenge?'Conferir meu raciocínio':'Analisar candidato'))+
  `<div class="sl-design-grid"><div><small>CANDIDATO</small><h4>${s[0]}</h4></div><div><small>ACESSO POSSÍVEL</small><h4>${s[1]}</h4></div><div><small>CUSTO DE ARMAZENAMENTO</small><h4>${s[2]}</h4></div></div>`+
  (revealed?note(choice==='include'?'Boa hipótese para essa consulta: UF delimita a busca, Nome fica na folha e Id já é o localizador. Valide o plano real, leituras e custo das escritas; UFs muito frequentes podem favorecer outro acesso.':choice==='uf'?'A chave UF ajuda a localizar linhas, mas Nome falta na folha: lookups podem aparecer. Isso pode ser perfeitamente aceitável para poucas linhas. Compare com a alternativa coberta.':choice==='wide'?'O candidato inclui mais colunas do que a consulta exige e alarga a chave. Pergunte quais delas precisam realmente ordenar a árvore; para projeção, INCLUDE costuma ser uma opção mais econômica.':'Sem novo índice, a consulta pode percorrer o clustered. Se a tabela é pequena ou o filtro retorna grande parte das linhas, isso pode ser adequado. Meça antes de criar estruturas.'):note('Faça uma hipótese e analise. A atividade avalia o raciocínio; o navegador não calcula um plano real.'))+
  `<div class="sl-checklist"><b>Roteiro de investigação</b><ol><li>Defina a consulta e parâmetros representativos.</li><li>Confira índices existentes e distribuição dos dados.</li><li>Compare plano real, leituras lógicas, CPU e tempo.</li><li>Observe escrita, espaço, regressões e frequência da consulta.</li></ol></div>`+
  `<p class="sl-caption">Nunca trate a sugestão de missing index como um comando para execução automática. O conjunto da carga importa mais que uma consulta isolada.</p>`;
}

function pedidoChallengeLab(state) {
  const client=Number(state.pedidoClient??9), keys=state.pedidoKeys??'client', included=state.pedidoInclude??'none', filtered=(state.pedidoFilter??'all')==='pending';
  const orders=Array.from({length:44},(_,index)=>{
    const Id=index+1;
    return {Id,ClienteId:Id<=32?9:Id<=40?12:3,Status:Id===state.paidId||Id%5===0?'Pago':'Pendente',DataPedido:new Date(Date.UTC(2026,10,17)-Math.floor(index/2)*86400000).toISOString().slice(0,10),Total:(100+Id*17.5).toFixed(2)};
  });
  const dateOrder=(a,b)=>by('DataPedido','Id')(b,a);
  const keyDefinitions={client:['ClienteId'],status:['ClienteId','Status','DataPedido DESC','Id DESC'],order:['ClienteId','DataPedido DESC','Id DESC'],date:['DataPedido DESC','Id DESC']};
  const keySql=keyDefinitions[keys], keyColumns=keySql.map(c=>c.split(' ')[0]);
  const includeColumns=included==='none'?[]:included==='total'?['Total']:['Total',...(keyColumns.includes('ClienteId')?[]:['ClienteId'])];
  const leafColumns=[...new Set([...keyColumns,...(keyColumns.includes('Id')?[]:['Id']),...includeColumns])];
  const comparator=keys==='client'?by('ClienteId','Id'):keys==='status'?(a,b)=>by('ClienteId','Status')(a,b)||dateOrder(a,b):keys==='order'?(a,b)=>by('ClienteId')(a,b)||dateOrder(a,b):dateOrder;
  const indexed=orders.filter(o=>!filtered||o.Status==='Pendente').sort(comparator);
  const matching=orders.filter(o=>o.ClienteId===client&&o.Status==='Pendente').sort(dateOrder);
  const result=matching.slice(0,20), resultIds=result.map(o=>o.Id);
  const ordered=keys!=='client', seeksClient=keys!=='date';
  const covered=['ClienteId','DataPedido','Id','Total'].every(c=>leafColumns.includes(c))&&(filtered||leafColumns.includes('Status'));
  const sampleIds=new Set([...indexed.slice(0,6),...indexed.filter(o=>o.ClienteId===client).slice(0,8)].map(o=>o.Id));
  const sample=indexed.filter(o=>sampleIds.has(o.Id));
  const good=seeksClient&&ordered&&covered;
  const ddl=`CREATE INDEX IX_Pedido_Candidato\nON dbo.Pedido (${keySql.join(', ')})${includeColumns.length?`\nINCLUDE (${includeColumns.join(', ')})`:''}${filtered?"\nWHERE Status = 'Pendente'":''};`;
  const sql=`DECLARE @ClienteId int = ${client};\n\nSELECT TOP (20) Id, DataPedido, Total\nFROM dbo.Pedido\nWHERE ClienteId = @ClienteId\n  AND Status = 'Pendente'\nORDER BY DataPedido DESC, Id DESC;`;
  const assessment=good?'A candidata conecta busca, ordenação e cobertura. Compare seu custo de escrita e seu alcance na carga antes de mantê-la.':!seeksClient?'A ordem por data ajuda TOP, mas ClienteId não é o prefixo da chave: podem ser visitados pedidos de outros clientes antes de encontrar os 20 desejados.':!ordered?'ClienteId agrupa os pedidos do cliente, mas a chave não fornece a ordem DataPedido DESC, Id DESC. Um Sort pode ser necessário antes de TOP.':!covered?'O caminho tem uma ordem útil, mas faltam colunas para cobrir filtros ou projeção. Lookups podem buscar Total e/ou testar Status.':'Valide a candidata com a carga real.';
  return toolbar(select('pedidoClient','Cliente da tela',[[9,'9 · muitos pedidos'],[12,'12 · poucos pedidos'],[99,'99 · sem pedidos']],client),select('pedidoKeys','Colunas de chave',[['client','ClienteId'],['status','ClienteId, Status, DataPedido DESC, Id DESC'],['order','ClienteId, DataPedido DESC, Id DESC'],['date','DataPedido DESC, Id DESC']],keys),select('pedidoInclude','Colunas incluídas',[['none','Nenhuma'],['total','Total'],['total-client','Total e ClienteId, se não for chave']],included),select('pedidoFilter','Catálogo',[['all','Todos os status'],['pending','Filtrado: só Pendente']],filtered?'pending':'all'),btn('reveal','Avaliar meu projeto'))+
  code(sql)+code(ddl)+
  `<div class="sl-split">${box('TABELA PEDIDO · CLUSTERED (Id)',`Amostra do cliente ${client} · até 12 linhas`,table(orders.filter(o=>o.ClienteId===client).slice(0,12),['Id','ClienteId','Status','DataPedido','Total'],{active:resultIds}),'sl-primary')}${box('FOLHAS DO ÍNDICE CANDIDATO',`${indexed.length} entradas no modelo · amostra de ${sample.length}`,table(sample,leafColumns,{active:resultIds,dim:true}),'sl-secondary')}</div>`+
  flow([seeksClient?'ClienteId delimita a busca':'Ordem por data; ClienteId precisa ser testado',ordered?'Ordem útil para TOP':'Sort possível antes do TOP',covered?'Consulta coberta':'Lookup possível para colunas ausentes'])+
  metrics(metric(orders.length,'pedidos na tabela do modelo'),metric(indexed.length,'entradas no índice candidato'),metric(matching.length,`pendentes do cliente ${client}`),metric(result.length,'linhas devolvidas por TOP (20)'))+
  box('RESULTADO CORRETO DA CONSULTA','Mesma resposta para qualquer candidata · DataPedido DESC, Id DESC',table(result,['Id','DataPedido','Total']))+
  (state.revealed?note(assessment):note('Escolha chaves, cobertura e filtro; depois avalie o projeto. A resposta da consulta é calculada dos dados, mas o plano continua sendo uma hipótese.'))+
  toolbar(btn('pedido-pay',state.paidId?`Pedido ${state.paidId} alterado para Pago`:'Marcar o pedido mais recente como Pago',`${state.paidId||!result.length?'disabled':''} data-value="${result[0]?.Id??0}"`),btn('pedido-restore','Restaurar status'))+
  (state.paidId?note(filtered?`O pedido ${state.paidId} permanece na base, mas deixou o índice filtrado. O TOP (20) foi recalculado com os pendentes restantes.`:`O pedido ${state.paidId} permanece neste índice sem filtro. Se Status faz parte da chave, sua entrada muda de posição; a resposta da consulta deixa de incluí-lo.`):'')+
  `<p class="sl-caption">Modelo com 44 pedidos, incluindo datas empatadas para exercitar Id DESC como desempate. As caixas mostram amostras; os contadores e o resultado usam o conjunto completo. Não calculamos custo real, páginas lidas nem plano SQL Server. Id é a chave clusterizada usada como localizador.</p>`;
}

const RENDERERS={book:bookLab,tree:treeLab,storage:storageLab,copies:copiesLab,access:accessLab,lookup:s=>lookupLab(s),include:s=>lookupLab(s,true),composite:compositeLab,sarg:s=>sargLab(s),computed:s=>sargLab(s,true),plan:planLab,clauses:clausesLab,selectivity:selectivityLab,filtered:filteredLab,types:typesLab,writes:writesLab,stats:statsLab,maintenance:maintenanceLab,tuning:s=>tuningLab(s),challenge:pedidoChallengeLab};

export function mountLab(container, kind='book') {
  let state={}, disposed=false, playback=null;
  const animated=['book','tree','access','lookup','include'].includes(kind);
  const maxStep=()=>kind==='book'?(state.mode==='scan'?10:3):kind==='tree'?(state.treeMode==='range'?3+Math.floor((Math.max(Number(state.target??8),Number(state.rangeEnd??10))-1)/4)-Math.floor((Number(state.target??8)-1)/4):3):kind==='access'?(state.mode==='scan'?CLIENTS.length:CLIENTS.filter(c=>c.UF===(state.uf??'SP')).length+1):((state.covered??kind==='include')&&!state.all?2:CLIENTS.filter(c=>c.UF===(state.uf??'SP')).length+2);
  const stop=()=>{if(playback!==null)clearInterval(playback);playback=null;};
  const render=()=>{
    if(disposed)return;
    container.innerHTML=`<div class="sql-lab"><div class="sl-simulation-label"><span aria-hidden="true">◈</span> SIMULAÇÃO DIDÁTICA <small>Controles locais · não executa SQL Server</small></div>${animated?`<div class="sl-playback">${btn('play',playback?'❚❚ Pausar passos':'▷ Reproduzir passos',`aria-pressed="${playback!==null}"`)}<span>Ou avance manualmente pelos controles abaixo.</span></div>`:''}${(RENDERERS[kind]??RENDERERS.book)(state)}</div>`;
  };
  function onClick(event) {
    const el=event.target.closest('[data-action]');
    if(!el||!container.contains(el))return;
    const action=el.dataset.action;
    if(action==='play'){
      if(playback)stop();
      else {
        if(Number(state.step??0)>=maxStep())state.step=0;
        playback=setInterval(()=>{
          state.step=Math.min(Number(state.step??0)+1,maxStep());
          if(state.step>=maxStep())stop();
          render();
        },1100);
      }
    }else stop();
    if(action==='step')state.step=Math.min(Number(state.step??0)+1,maxStep());
    if(action==='reset')state.step=0;
    if(action==='reset-all')state={count:state.count};
    if(action==='toggle-named')state.named=!state.named;
    if(action==='toggle-coverage'){state.covered=!(state.covered??kind==='include');state.step=0;}
    if(action==='toggle-all'){state.all=!state.all;state.step=0;}
    if(action==='node')state.node=el.dataset.value;
    if(action==='write-insert')state.action='insert';
    if(action==='write-update')state.action='update';
    if(action==='toggle-stats'){state.stale=!(state.stale??true);state.refreshed=false;}
    if(action==='refresh-stats')state.refreshed=true;
    if(action==='toggle-split')state.split=!state.split;
    if(action==='reveal')state.revealed=true;
    if(action==='pedido-pay'&&Number(el.dataset.value)>0)state.paidId=Number(el.dataset.value);
    if(action==='pedido-restore')delete state.paidId;
    if(action==='filtered-pay')state.filteredPaid=true;
    if(action==='filtered-restore')state.filteredPaid=false;
    render();
    const replacement=container.querySelector(`[data-action="${action}"]${el.dataset.value?`[data-value="${el.dataset.value}"]`:''}`);
    replacement?.focus({preventScroll:true});
  }
  function onChange(event) {
    const el=event.target.closest('[data-control]');
    if(!el||!container.contains(el))return;
    stop();
    state[el.dataset.control]=el.value;
    state.step=0;
    if(el.dataset.control==='choice'||el.dataset.control.startsWith('pedido'))state.revealed=false;
    render();
    container.querySelector(`[data-control="${el.dataset.control}"]`)?.focus({preventScroll:true});
  }
  container.addEventListener('click',onClick);
  container.addEventListener('change',onChange);
  render();
  return()=>{disposed=true;stop();container.removeEventListener('click',onClick);container.removeEventListener('change',onChange);};
}
