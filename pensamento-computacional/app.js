(() => {
  'use strict';
  const e = PCUtils.esc;
  const lessons = [
    {id:'tipos',name:'Tipos e conversões',short:'Dados que se transformam',icon:'type',color:'peach',tags:'str · int · float · bool',time:'10–15 min'},
    {id:'decisoes',name:'Decisões e condições',short:'Cada condição, um caminho',icon:'branch',color:'lilac',tags:'if · elif · else',time:'10–15 min'},
    {id:'for-range',name:'for e range()',short:'Repetir com um percurso',icon:'repeat',color:'mint',tags:'for · range · acumulador',time:'15–20 min'},
    {id:'while',name:'Laços com while',short:'Enquanto fizer sentido',icon:'loop',color:'yellow',tags:'while · condição · atualização',time:'10–15 min'},
    {id:'listas',name:'Listas e vetores',short:'Um índice de cada vez',icon:'list',color:'blue',tags:'índices · busca · percurso',time:'15–20 min'},
    {id:'matrizes',name:'Matrizes',short:'Linhas encontram colunas',icon:'grid',color:'peach',tags:'listas de listas · laços aninhados',time:'15–20 min'},
    {id:'memoria',name:'Variáveis e memória',short:'O que um nome guarda?',icon:'memory',color:'lilac',tags:'referências · mutação · cópia',time:'10–15 min'},
    {id:'funcoes',name:'Funções',short:'Pequenas partes, boas soluções',icon:'function',color:'mint',tags:'def · parâmetros · return',time:'15–20 min'}
  ];
  const paths = {
    type:'M4 5h16M8 5v14m8-14v14M5 19h6m2 0h6',
    branch:'M7 3v12a4 4 0 0 0 4 4h6M7 9h7a4 4 0 0 0 4-4V3m-4 12 4 4-4 4',
    repeat:'M20 7H7a4 4 0 0 0-4 4m17-4-4-4m4 4-4 4M4 17h13a4 4 0 0 0 4-4M4 17l4 4m-4-4 4-4',
    loop:'M20 10a8 8 0 1 0 0 5M20 3v7h-7',
    list:'M3 6h5v12H3zM10 6h5v12h-5zM17 6h4v12h-4z',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    memory:'M6 6h12v12H6zM9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4',
    function:'M17 3h-3c-2 0-3 2-3 4l-2 10c0 2-1 4-3 4H4m2-11h11',
    arrow:'M5 12h14m-6-6 6 6-6 6',
    play:'m9 5 11 7-11 7z',
    pause:'M8 5v14M16 5v14',
    back:'m15 5-7 7 7 7',
    next:'m9 5 7 7-7 7',
    reset:'M3 10a9 9 0 1 1 1 8M3 3v7h7',
    check:'m5 12 4 4L19 6',
    home:'m3 10 9-7 9 7v10H3zM9 20v-7h6v7',
    menu:'M4 6h16M4 12h16M4 18h16',
    book:'M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15',
    bulb:'M9 18h6m-6 3h6M8 14a7 7 0 1 1 8 0l-1 3H9z'
  };
  function icon(name,extra='') {return `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(paths[name]||paths.book).split('ZZ').map(p=>`<path d="${p}"/>`).join('')}</svg>`;}
  let progress = {};
  try {progress=JSON.parse(localStorage.getItem('pc-progress-v1')||'{}');if(!progress||typeof progress!=='object')progress={};} catch {progress={};}
  const doneCount = ()=>lessons.filter(l=>progress[l.id]).length;
  const current = document.body.dataset.page || 'inicio';
  const idx = lessons.findIndex(l=>l.id===current);
  document.getElementById('app').innerHTML = `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="index.html" aria-label="PyLab — início"><span class="brand-mark">p<span>y</span><i></i></span><span>py<span class="brand-light">lab</span><small>PENSAMENTO COMPUTACIONAL</small></span></a>
      <div class="sidebar-caption">SEU ESPAÇO DE EXPLORAÇÃO</div>
      <nav aria-label="Laboratórios"><a class="nav-home ${idx<0?'selected':''}" href="index.html">${icon('home')}Visão geral</a><div class="nav-section">APRENDA EXPERIMENTANDO <span>08</span></div>${lessons.map((l,i)=>`<a class="nav-lesson ${l.id===current?'selected':''}" href="${l.id}.html" ${l.id===current?'aria-current="page"':''}><span class="nav-num">${String(i+1).padStart(2,'0')}</span><span>${l.name}</span><span class="nav-completed" data-completed="${l.id}">${progress[l.id]?icon('check'):''}</span></a>`).join('')}</nav>
      <div class="sidebar-bottom"><div class="progress-caption"><strong>Seu percurso</strong><span data-progress-count>${doneCount()}/8</span></div><div class="progress-track"><span data-progress-bar style="width:${doneCount()/8*100}%"></span></div><p>O progresso fica salvo apenas<br>neste navegador.</p><button type="button" class="reset-progress" id="reset-progress">Reiniciar progresso</button><a href="../index.html">← Materiais do professor</a></div>
    </aside>
    <div class="site-body"><header class="topbar"><div><button class="menu-toggle icon-button" aria-label="Abrir navegação" aria-expanded="false" aria-controls="sidebar">${icon('menu')}</button><span class="breadcrumb">Algoritmos <span>/</span> <strong>${idx<0?'Laboratório interativo':e(lessons[idx].name)}</strong></span></div><a class="python-badge" href="https://docs.python.org/pt-br/3/tutorial/" target="_blank" rel="noopener noreferrer"><span></span>Explorando Python ${icon('arrow')}</a></header>
    <main id="conteudo" tabindex="-1">${idx<0?home():labShell(lessons[idx])}</main><footer class="site-footer"><span><strong>py<span class="brand-light">lab</span></strong> · Aprenda a pensar. Depois, a programar.</span><span>Prof. Vinicius Mussak · Algoritmos e Pensamento Computacional</span></footer></div>`;
  const menu=document.querySelector('.menu-toggle');
  document.getElementById('reset-progress').addEventListener('click',()=>{
    progress={};try{localStorage.removeItem('pc-progress-v1');}catch{}
    document.querySelectorAll('[data-completed]').forEach(el=>{el.innerHTML='';});
    document.querySelector('[data-progress-count]').textContent='0/8';
    document.querySelector('[data-progress-bar]').style.width='0%';
    const completion=document.getElementById('completion');if(completion)completion.textContent='Progresso reiniciado. Acerte as três questões para concluir este laboratório novamente.';
    if(idx<0)document.querySelectorAll('.card-bottom>span:first-child').forEach((el,i)=>{el.textContent=lessons[i].time;});
  });
  menu.addEventListener('click',()=>{const open=document.body.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('nav-open')){document.body.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir navegação');menu.focus();}});
  if(idx<0) bindHome(); else bindLab();

  function home() {
    return `<section class="home-hero"><div class="hero-copy"><div class="eyebrow"><span class="tiny-spark">✳</span> MENOS DECORAR. MAIS ENTENDER.</div><h1>O código <br>ganha <span class="highlight">vida.</span></h1><p>Veja a lógica acontecer. Mude uma entrada, acompanhe cada passo e descubra o que o Python faz com as suas ideias.</p><a class="button primary" href="tipos.html">Começar a explorar ${icon('arrow')}</a><div class="hero-footnote"><span class="status-dot"></span>No seu ritmo. Sem instalar nada.</div></div>
    <div class="hero-demo"><div class="demo-top"><span class="window-dots"><i></i><i></i><i></i></span><span>primeiros_passos.py</span><span class="demo-live">AO VIVO</span></div><div class="hero-code"><div><span class="code-number">1</span><code>total <b>=</b> <em>0</em></code></div><div id="demo-loop"><span class="code-number">2</span><code><b>for</b> i <b>in</b> <mark>range</mark>(<em>5</em>):</code></div><div id="demo-sum"><span class="code-number">3</span><code>    total <b>+=</b> i</code></div><div><span class="code-number">4</span><code><mark>print</mark>(total)</code></div></div><div class="demo-visual"><div class="demo-visual-label">range(5) <span>o 5 fica de fora</span></div><div id="demo-cells">${PCUtils.cells([0,1,2,3,4])}</div><div class="demo-bottom"><span>total = <strong id="demo-total">0</strong></span><button class="demo-play" id="demo-play">${icon('play')} Ver acontecer</button></div><div id="demo-note" class="demo-note" aria-live="polite">A sequência começa no 0. Pronto para percorrer?</div></div><div class="demo-sticker">Mude. Execute.<br><strong>Entenda.</strong><svg viewBox="0 0 70 30" fill="none" aria-hidden="true"><path d="M2 10q25 30 62-4m-12 0h13l-4 13" stroke="currentColor" stroke-width="2"/></svg></div></div></section>
    <section class="intro-strip" aria-label="Como estudar"><div><span>01</span><p><strong>Explore</strong>Altere as entradas do exemplo.</p></div><div><span>02</span><p><strong>Acompanhe</strong>Veja cada linha em ação.</p></div><div><span>03</span><p><strong>Descubra</strong>Explique e teste o que aprendeu.</p></div></section>
    <section class="learning-path" id="laboratorios"><div class="section-heading"><div><div class="eyebrow">SUA TRILHA DE APRENDIZADO</div><h2>Uma ideia de cada vez.</h2></div><span class="section-note">8 laboratórios · do dado à solução</span></div><div class="lesson-grid">${lessons.map((l,i)=>`<a class="lesson-card ${l.color}" href="${l.id}.html"><div class="card-top"><span class="lesson-icon">${icon(l.icon)}</span><span class="card-number">${String(i+1).padStart(2,'0')}</span></div><h3>${l.name}</h3><p>${l.short}</p><div class="card-tags">${l.tags}</div><div class="card-bottom"><span>${progress[l.id]?'✓ Concluído':l.time}</span><span class="card-arrow">${icon('arrow')}</span></div></a>`).join('')}</div></section>
    <section class="study-note"><span class="note-icon">${icon('bulb')}</span><div><div class="eyebrow">DICA DE QUEM ESTÁ APRENDENDO</div><h2>Antes de executar, tente prever.</h2><p>Qual será o próximo valor? Qual caminho será escolhido? Faça uma hipótese e use os passos para conferir seu raciocínio. Errar também revela como o algoritmo funciona.</p></div><span class="note-decoration" aria-hidden="true">?</span></section>
    <section class="resources"><div>${icon('book')}<div><h3>Continue a conversa da sala de aula</h3><p>Os laboratórios retomam os conceitos das aulas e da revisão até vetores. Matrizes, memória e funções ampliam essa trilha.</p></div></div><a class="text-link" href="https://drive.google.com/drive/u/0/folders/1lU_WOt8rbvVKMY42LTWUlwUIm6DDGVSr" target="_blank" rel="noopener noreferrer">Materiais da disciplina ${icon('arrow')}</a></section>`;
  }
  function labShell(l) {
    const topic=PCLabs[l.id];
    if(!topic)return '<h1>Laboratório indisponível</h1><p>Recarregue a página para tentar novamente.</p>';
    return `<section class="lab-heading"><div class="eyebrow">${e(topic.eyebrow)}</div><h1>${e(l.name)}<span class="heading-dot ${l.color}">.</span></h1><p>${e(topic.description)}</p><div class="learning-objectives">${topic.learn.map(x=>`<span>${icon('check')}${e(x)}</span>`).join('')}</div></section>
    <section class="experiment" aria-labelledby="experiment-title"><div class="experiment-heading"><div><span class="lab-tag">LAB</span><h2 id="experiment-title">Experimente a lógica</h2></div><span>Altere os dados. Observe o efeito.</span></div><form id="lab-form"><div class="fields">${topic.fields.map(field=>`<label class="field">${e(field.label)}${field.type==='select'?`<select name="${e(field.name)}">${field.options.map(o=>`<option value="${e(o.value)}" ${String(o.value)===String(field.value)?'selected':''}>${e(o.label)}</option>`).join('')}</select>`:`<input name="${e(field.name)}" type="${e(field.type)}" value="${e(field.value)}" ${field.min!==undefined?`min="${e(field.min)}"`:''} ${field.max!==undefined?`max="${e(field.max)}"`:''} ${field.step!==undefined?`step="${e(field.step)}"`:''} ${field.type==='text'?'maxlength="200"':''} required>`}</label>`).join('')}<button type="submit" class="button apply">Aplicar entradas ${icon('arrow')}</button></div><div class="presets"><span>Experimente também:</span>${topic.presets.map((p,i)=>`<button type="button" data-preset="${i}">${e(p.label)}</button>`).join('')}</div><p class="form-error" id="form-error" role="alert" hidden></p><p class="input-status" id="input-status" role="status"></p></form>
    <div class="simulation"><section class="code-panel" aria-labelledby="code-title"><div class="panel-heading"><h3 id="code-title"><span class="status-dot"></span>exemplo.py</h3><button class="copy-button" id="copy-code" aria-label="Copiar exemplo Python">Copiar código</button></div><div id="code-lines" class="code-lines"></div></section><section class="visual-panel" aria-labelledby="visual-title"><div class="panel-heading"><h3 id="visual-title">${icon(l.icon)}A lógica em movimento</h3><span class="mini-label">VISUALIZAÇÃO</span></div><div class="scene" id="scene"></div><div class="scene-legend"><span><i class="legend-active"></i>Atual</span><span><i class="legend-done"></i>Visitado</span><span><i></i>Aguardando</span></div></section></div>
    <div class="playback"><div class="playback-buttons"><button class="icon-button" id="reset" aria-label="Reiniciar simulação" title="Reiniciar">${icon('reset')}</button><button class="icon-button" id="previous" aria-label="Passo anterior" title="Passo anterior">${icon('back')}</button><button class="button primary play-button" id="play">${icon('play')}<span>Executar</span></button><button class="icon-button" id="next" aria-label="Próximo passo" title="Próximo passo">${icon('next')}</button></div><label class="timeline"><span id="step-counter">Passo 0</span><input type="range" id="timeline" min="0" max="1" value="0" aria-label="Etapa da execução"></label><label class="speed-label">Velocidade<select id="speed"><option value="1800">0,5×</option><option value="900" selected>1×</option><option value="450">2×</option></select></label></div><div class="step-explanation" role="status" aria-live="polite" aria-atomic="true"><span class="step-badge" id="step-badge">INÍCIO</span><p id="step-note"></p></div>
    <div class="state-panels"><section class="variables-panel"><div class="panel-heading"><h3>Variáveis neste instante</h3><span class="mini-label">TESTE DE MESA</span></div><div id="variables"></div></section><section class="output-panel"><div class="panel-heading"><h3>Saída do programa</h3><span class="mini-label">CONSOLE</span></div><pre id="output"></pre></section></div><p class="simulation-disclaimer">Simulação guiada do exemplo exibido, com entradas configuráveis. Os estados são ilustrativos; este laboratório não executa código Python livre.</p></section>
    <section class="understand"><div class="section-heading"><div><div class="eyebrow">CONECTE OS PONTOS</div><h2>Por que funciona assim?</h2></div>${icon('bulb')}</div><div class="theory">${topic.explanation}</div><aside class="pitfalls"><strong>De olho nos detalhes</strong><ul>${topic.pitfalls.map(x=>`<li>${e(x)}</li>`).join('')}</ul></aside></section>
    <section class="quiz-section" aria-labelledby="quiz-title"><div class="section-heading"><div><div class="eyebrow">AGORA É COM VOCÊ</div><h2 id="quiz-title">Teste o seu raciocínio.</h2></div><span class="quiz-score" id="quiz-score">0/${topic.quiz.length} descobertas</span></div><p class="quiz-intro">Escolha uma resposta para receber uma explicação. Você pode tentar novamente.</p><div class="quiz-grid">${topic.quiz.map((q,i)=>`<fieldset class="quiz-card"><legend><span>${String(i+1).padStart(2,'0')}</span>${e(q.question)}</legend><div class="quiz-options">${q.options.map((opt,j)=>`<button type="button" data-question="${i}" data-answer="${j}" aria-pressed="false"><span>${String.fromCharCode(65+j)}</span>${e(opt)}</button>`).join('')}</div><p class="quiz-feedback" id="feedback-${i}" aria-live="polite"></p></fieldset>`).join('')}</div><div class="completion" id="completion" role="status"></div></section>
    <section class="challenge"><div class="challenge-icon">${icon('function')}</div><div><div class="eyebrow">LEVE PARA O SEU EDITOR</div><h2>Um passo além</h2><p>${e(topic.challenge)}</p><span>Escreva em Python e confira com pelo menos três entradas diferentes.</span></div></section>
    <nav class="lesson-pagination" aria-label="Continuar estudando"><a href="${idx===0?'index':lessons[idx-1].id}.html">← ${idx===0?'Visão geral':e(lessons[idx-1].name)}</a><a href="${idx===lessons.length-1?'index':lessons[idx+1].id}.html">${idx===lessons.length-1?'Voltar à trilha':e(lessons[idx+1].name)} ${icon('arrow')}</a></nav>`;
  }
  function highlight(line) {
    return line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#[^\n]*|\b(?:if|elif|else|for|while|in|def|return|break|continue|and|or|not|True|False|None)\b|\b(?:print|range|len|int|float|str|bool|input|type)\b|\b\d+(?:\.\d+)?\b)/g).map(part=>{
      const text=e(part);
      if(/^['"]/.test(part))return `<span class="syn-string">${text}</span>`;
      if(/^#/.test(part))return `<span class="syn-comment">${text}</span>`;
      if(/^(if|elif|else|for|while|in|def|return|break|continue|and|or|not|True|False|None)$/.test(part))return `<span class="syn-keyword">${text}</span>`;
      if(/^(print|range|len|int|float|str|bool|input|type)$/.test(part))return `<span class="syn-function">${text}</span>`;
      if(/^\d/.test(part))return `<span class="syn-number">${text}</span>`;
      return text;
    }).join('');
  }
  function bindLab() {
    const topic=PCLabs[current];if(!topic)return;
    const form=document.getElementById('lab-form'),scene=document.getElementById('scene'),timeline=document.getElementById('timeline'),play=document.getElementById('play'),next=document.getElementById('next'),prev=document.getElementById('previous');
    let model,position=0,timer=null,dirty=false;
    function stop(){if(timer)clearTimeout(timer);timer=null;play.innerHTML=icon('play')+'<span>Executar</span>';play.setAttribute('aria-label','Executar automaticamente');}
    function render(){
      const step=model.steps[position];
      document.querySelectorAll('.code-line').forEach((line,i)=>{line.classList.toggle('executing',i+1===step.line);if(i+1===step.line)line.setAttribute('aria-current','step');else line.removeAttribute('aria-current');});
      scene.innerHTML=step.scene;
      document.getElementById('step-note').textContent=step.note;
      document.getElementById('step-badge').textContent=step.line?'LINHA '+step.line:position===0?'INÍCIO':'ESTADO FINAL';
      document.getElementById('step-counter').textContent=`Passo ${position} de ${model.steps.length-1}`;
      timeline.value=position;timeline.setAttribute('aria-valuetext',`Passo ${position}: ${step.note}`);
      const entries=Object.entries(step.vars||{});
      document.getElementById('variables').innerHTML=entries.length?`<table><thead><tr><th scope="col">Nome</th><th scope="col">Valor / referência</th></tr></thead><tbody>${entries.map(([key,val])=>`<tr><th scope="row"><code>${e(key)}</code></th><td><code>${e(val)}</code></td></tr>`).join('')}</tbody></table>`:'<p class="empty-state">Nenhuma variável criada. Avance o primeiro passo.</p>';
      document.getElementById('output').textContent=(step.output||[]).length?step.output.join('\n')+'\n':'› Aguardando uma saída…';
      document.getElementById('output').classList.toggle('empty-output',!(step.output||[]).length);
      prev.disabled=dirty||position===0;next.disabled=dirty||position===model.steps.length-1;play.disabled=dirty;
    }
    function refreshFields(){
      topic.fields.forEach(field=>{if(field.showWhen){const control=form.elements[field.name];control.closest('label').hidden=!field.showWhen.values.includes(form.elements[field.showWhen.field].value);}});
    }
    function apply(){
      refreshFields();
      stop();const error=document.getElementById('form-error');error.hidden=true;
      try {const values=Object.fromEntries(new FormData(form));const candidate=topic.build(values);if(!candidate.steps.length)throw Error('Sem passos para este exemplo.');model=candidate;position=0;dirty=false;timeline.disabled=false;document.getElementById('input-status').textContent='Entradas aplicadas. Preveja a saída e avance o primeiro passo.';document.getElementById('code-lines').innerHTML=model.code.map((line,i)=>`<div class="code-line"><span class="code-number">${i+1}</span><code>${highlight(line)}</code></div>`).join('');timeline.max=model.steps.length-1;render();}
      catch(err){error.textContent=err.message;error.hidden=false;dirty=true;play.disabled=true;next.disabled=true;prev.disabled=true;timeline.disabled=true;document.getElementById('input-status').textContent='Corrija as entradas e aplique novamente.';}
    }
    form.noValidate=true;
    form.addEventListener('submit',event=>{event.preventDefault();apply();});
    form.addEventListener('input',()=>{refreshFields();stop();dirty=true;play.disabled=true;next.disabled=true;prev.disabled=true;timeline.disabled=true;document.getElementById('input-status').textContent='Entradas alteradas. Clique em “Aplicar entradas” para atualizar a simulação.';});
    topic.presets.forEach((preset,i)=>document.querySelector(`[data-preset="${i}"]`).addEventListener('click',()=>{for(const [key,val] of Object.entries(preset.values)){if(form.elements[key])form.elements[key].value=val;}apply();}));
    next.addEventListener('click',()=>{stop();position=Math.min(position+1,model.steps.length-1);render();});
    prev.addEventListener('click',()=>{stop();position=Math.max(position-1,0);render();});
    document.getElementById('reset').addEventListener('click',()=>{stop();position=0;if(model)render();});
    timeline.addEventListener('input',()=>{stop();position=Number(timeline.value);render();});
    function tick(){position++;render();if(position<model.steps.length-1)timer=setTimeout(tick,Number(document.getElementById('speed').value));else stop();}
    play.addEventListener('click',()=>{if(timer){stop();return;}if(position===model.steps.length-1)position=0;play.innerHTML=icon('pause')+'<span>Pausar</span>';play.setAttribute('aria-label','Pausar execução');timer=setTimeout(tick,Number(document.getElementById('speed').value));render();});
    document.getElementById('speed').addEventListener('change',()=>{if(timer){clearTimeout(timer);timer=setTimeout(tick,Number(document.getElementById('speed').value));}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    window.addEventListener('pagehide',stop);
    document.getElementById('copy-code').addEventListener('click',async event=>{const button=event.currentTarget;try{await navigator.clipboard.writeText(model.code.join('\n'));button.textContent='Copiado ✓';}catch{button.textContent='Selecione o código para copiar';}setTimeout(()=>{button.textContent='Copiar código';},2200);});
    const answers=new Set();
    document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{
      const question=Number(button.dataset.question),answer=Number(button.dataset.answer),q=topic.quiz[question],correct=answer===q.answer;
      document.querySelectorAll(`[data-question="${question}"]`).forEach(b=>{b.classList.remove('correct','incorrect');b.setAttribute('aria-pressed',String(b===button));});
      button.classList.add(correct?'correct':'incorrect');
      const feedback=document.getElementById('feedback-'+question);feedback.classList.toggle('success',correct);feedback.textContent=(correct?'Isso mesmo! ':'Vamos pensar de novo. ')+q.explanation;
      if(correct)answers.add(question);else answers.delete(question);
      document.getElementById('quiz-score').textContent=`${answers.size}/${topic.quiz.length} descobertas`;
      if(answers.size===topic.quiz.length){progress[current]=true;try{localStorage.setItem('pc-progress-v1',JSON.stringify(progress));}catch{}document.getElementById('completion').innerHTML=`${icon('check')} Laboratório concluído! Continue explorando ou siga para a próxima ideia.`;document.querySelector(`[data-completed="${current}"]`).innerHTML=icon('check');document.querySelector('[data-progress-count]').textContent=doneCount()+'/8';document.querySelector('[data-progress-bar]').style.width=(doneCount()/8*100)+'%';}
    }));
    if(progress[current])document.getElementById('completion').textContent='Você já concluiu este laboratório. Que tal revisar com outras entradas?';
    apply();
  }
  function bindHome(){
    const button=document.getElementById('demo-play');let running=false,timer;
    button.addEventListener('click',()=>{if(running)return;running=true;button.disabled=true;let i=0,total=0;const next=()=>{if(i<5){total+=i;document.getElementById('demo-cells').innerHTML=PCUtils.cells([0,1,2,3,4],i,Array.from({length:i},(_,j)=>j));document.getElementById('demo-total').textContent=total;document.getElementById('demo-note').textContent=`i = ${i} → somamos ${i} ao total. O próximo valor será ${i+1<5?i+1:'o fim do percurso'}.`;document.getElementById('demo-sum').classList.add('demo-executing');i++;timer=setTimeout(next,1000);}else{document.getElementById('demo-cells').innerHTML=PCUtils.cells([0,1,2,3,4],-1,[0,1,2,3,4]);document.getElementById('demo-note').textContent='Fim! 0 + 1 + 2 + 3 + 4 = 10. O valor 5 não faz parte do range(5).';document.getElementById('demo-sum').classList.remove('demo-executing');running=false;button.disabled=false;button.innerHTML=icon('reset')+' Ver de novo';}};next();});
    window.addEventListener('pagehide',()=>clearTimeout(timer));
  }
})();
