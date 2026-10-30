/* Exemplos guiados: o rastreamento representa as linhas do Python exibido. */
window.PCLabs = window.PCLabs || {};
window.PCLabs.decisoes = {
  title: 'Decisões e condições', eyebrow: '02 / ESCOLHER UM CAMINHO',
  description: 'Uma pergunta, diferentes caminhos. Descubra como if, elif e else escolhem o que o programa vai fazer.',
  learn: ['Comparar valores e combinar condições.', 'Seguir apenas o primeiro ramo verdadeiro.', 'Testar os valores que ficam no limite.'],
  explanation: `<h3>O programa faz uma pergunta</h3><p>Uma comparação como <code>nota >= 7</code> produz <code>True</code> ou <code>False</code>. O <code>if</code> executa seu bloco quando a condição é verdadeira. Se for falsa, o Python tenta o próximo <code>elif</code>. O <code>else</code> cobre o que sobrou, sem precisar de outra condição.</p><h3>A ordem e os espaços contam</h3><p>Em uma mesma cadeia, apenas o primeiro bloco verdadeiro é escolhido. Para classificar notas, teste <code>>= 7</code> antes de <code>>= 5</code>: uma nota 8 satisfaz as duas comparações, mas deve ser aprovada. Os quatro espaços de indentação indicam quais linhas pertencem a cada bloco.</p><div class="concept-grid"><div><h4>and</h4><p>Todas as condições devem ser verdadeiras: <code>idade >= 18 and tem_carteira</code>.</p></div><div><h4>or</h4><p>Basta uma condição verdadeira: <code>idade <= 12 or idade >= 60</code>.</p></div><div><h4>not</h4><p>Inverte o valor lógico: <code>not False</code> resulta em <code>True</code>.</p></div></div><p><code>=</code> faz uma atribuição; <code>==</code> compara. Uma condição pode usar <code>!=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> ou <code>&gt;=</code>. Testar 6.9, 7 e 7.1 revela a diferença entre <code>&gt;</code> e <code>&gt;=</code>.</p>`,
  pitfalls: ['else não recebe uma condição.', 'Vários if independentes podem executar vários blocos. Uma cadeia if/elif/else escolhe apenas um.', 'Em Python, True e False começam com letra maiúscula.'],
  fields: [
    {name:'mode',label:'Exemplo',type:'select',value:'nota',options:[{value:'nota',label:'Classificação da nota'},{value:'desconto',label:'Desconto: and / or / not'}]},
    {name:'nota',label:'Nota (0 a 10)',type:'number',value:6,min:0,max:10,step:0.1,showWhen:{field:'mode',values:['nota']}},
    {name:'idade',label:'Idade (desconto)',type:'number',value:20,min:0,max:120,step:1,showWhen:{field:'mode',values:['desconto']}},
    {name:'estudante',label:'É estudante?',type:'select',value:'True',options:[{value:'True',label:'True — sim'},{value:'False',label:'False — não'}],showWhen:{field:'mode',values:['desconto']}},
    {name:'bloqueado',label:'Cadastro bloqueado?',type:'select',value:'False',options:[{value:'False',label:'False — não'},{value:'True',label:'True — sim'}],showWhen:{field:'mode',values:['desconto']}}
  ],
  presets: [{label:'No limite: 7',values:{mode:'nota',nota:7}},{label:'Recuperação: 5',values:{mode:'nota',nota:5}},{label:'Reprovação: 4.9',values:{mode:'nota',nota:4.9}},{label:'Desconto bloqueado',values:{mode:'desconto',idade:65,estudante:'False',bloqueado:'True'}}],
  build(v) {
    const e = window.PCUtils.esc;
    const bool = x => x ? 'True' : 'False';
    const scene = (nodes,active=-1) => `<div class="decision-flow">${nodes.map((n,i)=>`<div class="flow-node ${i===active?'active':''}">${e(n)}</div>${i<nodes.length-1?'<div class="flow-arrow" aria-hidden="true">↓</div>':''}`).join('')}</div>`;
    if(v.mode==='nota') {
      const n=Number(v.nota);
      if(v.nota.trim()==='' || !Number.isFinite(n)||n<0||n>10) throw Error('Informe uma nota entre 0 e 10.');
      const code=[`nota = ${Number.isInteger(n)?n+'.0':n}`,'if nota >= 7:','    print("Aprovado")','elif nota >= 5:','    print("Recuperação")','else:','    print("Reprovado")','print("Fim")'];
      const path=[`nota = ${n}`,'nota >= 7?','nota >= 5?','Resultado'];
      const steps=[{line:null,note:'Antes de executar, preveja a classificação para esta nota.',vars:{},output:[],scene:scene(path)}, {line:1,note:'A atribuição associa o nome nota a um valor float.',vars:{nota:code[0].slice(7)},output:[],scene:scene(path,0)}, {line:2,note:`${n} >= 7 → ${bool(n>=7)}. ${n>=7?'O bloco do if será executado.':'Vamos testar o elif.'}`,vars:{nota:code[0].slice(7)},output:[],scene:scene(path,1)}];
      let chosen=3,msg='Aprovado';
      if(n<7) {steps.push({line:4,note:`${n} >= 5 → ${bool(n>=5)}. ${n>=5?'Escolhemos o elif.':'Nenhuma condição foi verdadeira: escolhemos o else.'}`,vars:{nota:code[0].slice(7)},output:[],scene:scene(path,2)});chosen=n>=5?5:7;msg=n>=5?'Recuperação':'Reprovado';}
      steps.push({line:chosen,note:`Somente este bloco imprime a classificação: ${msg}. Os demais ramos são ignorados.`,vars:{nota:code[0].slice(7)},output:[msg],scene:scene([`nota = ${n}`,n>=7?'if → True':n>=5?'if → False; elif → True':'if → False; elif → False',msg],2)}, {line:8,note:'Sem indentação, este print está fora da cadeia e executa em todos os caminhos.',vars:{nota:code[0].slice(7)},output:[msg,'Fim'],scene:scene([msg,'Fim'],1)}, {line:null,note:'Execução concluída. Troque a nota por um valor de outra faixa e compare o caminho.',vars:{nota:code[0].slice(7)},output:[msg,'Fim'],scene:scene([msg,'Fim'],1)});
      return {code,steps};
    }
    const age=Number(v.idade),student=v.estudante==='True',blocked=v.bloqueado==='True';
    if(v.idade.trim()===''||!Number.isInteger(age)||age<0||age>120)throw Error('Informe uma idade inteira de 0 a 120.');
    const eligible=age<=12||age>=60||student,allowed=eligible&&!blocked;
    const code=[`idade = ${age}`,`estudante = ${bool(student)}`,`bloqueado = ${bool(blocked)}`,'faixa = idade <= 12 or idade >= 60','elegivel = faixa or estudante','liberado = elegivel and not bloqueado','if liberado:','    print("Meia-entrada")','else:','    print("Inteira")'];
    const vars={},steps=[{line:null,note:'O desconto depende da faixa etária ou do vínculo estudantil, e de um cadastro não bloqueado.',vars:{},output:[],scene:scene(['Faixa etária OU estudante','E cadastro não bloqueado','Desconto?'])}];
    const add=(line,note,nodes,active=0,output=[])=>steps.push({line,note,vars:{...vars},output,scene:scene(nodes,active)});
    vars.idade=age;add(1,'Primeiro guardamos a idade.',[`idade → ${age}`]);
    vars.estudante=bool(student);add(2,'O vínculo é um valor booleano.',[`estudante → ${bool(student)}`]);
    vars.bloqueado=bool(blocked);add(3,'O bloqueio também é um booleano.',[`bloqueado → ${bool(blocked)}`]);
    vars.faixa=bool(age<=12||age>=60);add(4,'or produz True se pelo menos uma das comparações for verdadeira. Quando a primeira já é True, Python não avalia a segunda (curto-circuito).',[`${age} <= 12 → ${bool(age<=12)}`,age<=12?'idade >= 60 → não avaliada':`${age} >= 60 → ${bool(age>=60)}`,`faixa → ${vars.faixa}`],2);
    vars.elegivel=bool(eligible);add(5,'Estar em uma faixa com desconto OU ser estudante é suficiente para ser elegível.',[`faixa → ${vars.faixa}`,`estudante → ${bool(student)}`,`elegivel → ${bool(eligible)}`],2);
    vars.liberado=bool(allowed);add(6,'not inverte o bloqueio. and exige elegibilidade e ausência de bloqueio.',[`elegivel → ${bool(eligible)}`,`not bloqueado → ${bool(!blocked)}`,`liberado → ${bool(allowed)}`],2);
    add(7,`if recebe ${bool(allowed)}.`,[`liberado → ${bool(allowed)}`]);
    const result=allowed?'Meia-entrada':'Inteira';add(allowed?8:10,'O caminho escolhido imprime uma única mensagem.',[result],0,[result]);add(null,'Execução concluída. Experimente idade 12, 13, 59 e 60.',[result],0,[result]);
    return {code,steps};
  },
  quiz:[{question:'Com nota = 7 e if nota >= 7, qual é a classificação?',options:['Aprovado','Recuperação','Reprovado'],answer:0,explanation:'>= inclui o limite 7. O primeiro bloco é executado e os demais ramos são ignorados.'},{question:'True and not True produz…',options:['True','False','Um erro'],answer:1,explanation:'not True é False. True and False resulta em False.'},{question:'Se if e elif forem verdadeiros na mesma cadeia, o que acontece?',options:['Os dois blocos executam','Só o bloco do elif executa','Só o primeiro bloco verdadeiro executa'],answer:2,explanation:'O Python escolhe o primeiro ramo verdadeiro de uma cadeia if/elif/else.'}],
  challenge:'Classifique uma temperatura: até 15 é Frio, até 25 é Agradável, acima disso é Quente. Escreva as condições e teste 15, 16, 25 e 26.'
};
