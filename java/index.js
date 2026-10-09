const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};

/* visitas: o arquivo lembra */
const visits = (parseInt(store.get('adachi_visits'),10) || 0) + 1;
store.set('adachi_visits', visits);

/* boot */
const bootLines = [
  "> iniciando acesso ao arquivo A.D.A.C.H.I...",
  "> verificando integridade dos registros... FALHA PARCIAL",
  "> nível de acesso: PÚBLICO (observado)",
  "> carregando dossiê de entradas recuperadas...",
  "> não confie na ordem.",
  visits > 1 ? "> você voltou. nós sabíamos." : "> bem-vindo(a). ou bem-vindo(a) de volta."
];
const boot = $('boot'), bootEl = $('bootText');
let li = 0, ci = 0, bootDone = false, bootTimer;
function endBoot(){
  if(bootDone) return; bootDone = true; clearTimeout(bootTimer);
  boot.classList.add('hide');
  setTimeout(()=>boot.classList.add('gone'), reduced ? 0 : 1300);
}
function typeBoot(){
  if(bootDone) return;
  if(li >= bootLines.length){ bootTimer = setTimeout(endBoot, 700); return; }
  const line = bootLines[li];
  bootEl.textContent = bootLines.slice(0,li).join('\n') + (li>0?'\n':'') + line.slice(0,ci);
  const cur = document.createElement('span'); cur.className = 'cursor'; cur.innerHTML = '&nbsp;';
  bootEl.appendChild(cur);
  if(ci < line.length){ ci++; bootTimer = setTimeout(typeBoot, 18); }
  else { li++; ci = 0; bootTimer = setTimeout(typeBoot, 380); }
}
boot.addEventListener('click', endBoot);
window.addEventListener('keydown', endBoot);
reduced ? endBoot() : typeBoot();

/* glitch e flash (raros, nunca em sequência rápida) */
const titleEl = $('mainTitle');
(function glitchLoop(){
  setTimeout(()=>{
    titleEl.classList.add('glitch');
    setTimeout(()=>titleEl.classList.remove('glitch'), 260);
    glitchLoop();
  }, 4000 + Math.random()*9000);
})();
(function flashLoop(){
  setTimeout(()=>{
    const f = $('staticFlash'); f.classList.add('flash');
    setTimeout(()=>f.classList.remove('flash'), 90);
    flashLoop();
  }, 14000 + Math.random()*20000);
})();

/* escuridão que segue o cursor / dedo */
const root = document.documentElement;
function moveLight(x,y){ root.style.setProperty('--mx', x+'px'); root.style.setProperty('--my', y+'px'); }
window.addEventListener('pointermove', e=>moveLight(e.clientX, e.clientY), {passive:true});
window.addEventListener('touchmove', e=>{ const t=e.touches[0]; if(t) moveLight(t.clientX,t.clientY); }, {passive:true});

/* a aba também é observada */
const baseTitle = document.title;
document.addEventListener('visibilitychange', ()=>{
  document.title = document.hidden ? 'volte.' : baseTitle;
});

/* entradas */
const entries = [
  { n:"001", date:"—.03", tag:"água", title:"A cisterna lembra de você",
    excerpt:"Um registro sonoro achado perto da página Água. Quem gravou não queria ser ouvido — ou queria muito.",
    full:"<p>O áudio tem 47 segundos. Nos primeiros doze, só o gotejar. Depois, uma voz repete três vezes a mesma frase, num idioma que não catalogamos por completo.</p><p>Quando isolamos o ruído de fundo, havia uma segunda respiração. Não era a de quem gravava.</p>",
    whisper:"ela ainda está no arquivo de áudio" },
  { n:"002", date:"—.07", tag:"enigma", title:"O atalho que deixamos de propósito",
    excerpt:"Sobre por que existe uma saída fácil escondida no código — e por que ela custa mais do que parece.",
    full:"<p>Todo enigma tem um atalho porque toda pessoa cansa. Deixamos o nosso no próprio código, à vista de quem souber procurar.</p><p>Mas o atalho não pula o enigma. Ele só troca o que você vai perder por não resolvê-lo sozinho — e isso, você só percebe depois.</p>",
    whisper:"não conte com ele para sempre" },
  { n:"003", date:"—.09", tag:"catálogo", title:"O irrelevante é a chave",
    excerpt:"Por que arquivamos linhas de código, comentários e ruídos que parecem não significar nada.",
    full:"<p>Você vai procurar o sentido no lugar errado se procurar onde ele deveria estar. A ordem é uma armadilha; o começo pode ser o fim.</p><p>Guardamos o que sobra porque, às vezes, o que sobra é tudo que resta de quem esteve aqui antes de você.</p>",
    whisper:"observe. pense. questione." },
  { n:"004", date:"—.12", tag:"visitante", title:"Alguém mais leu isto",
    excerpt:"Um registro sobre os visitantes que voltam ao arquivo sem saber por quê — e o que o arquivo lembra deles.",
    full:"<p>O arquivo não guarda nomes. Guarda padrões: quanto tempo você ficou, onde parou de rolar, o que você abriu e fechou sem terminar de ler.</p><p>Se esta é sua segunda visita, alguma coisa aqui já vai parecer familiar antes de você chegar nela.</p>",
    whisper: visits > 1 ? `visita nº ${visits}. você já esteve aqui antes` : "você já esteve aqui antes" },
  { n:"005", date:"—.15", tag:"nota", title:"Isto está sendo escrito enquanto você lê",
    excerpt:"Uma nota sobre o ato de manter este diário — e sobre o que significa registrar algo que ainda está acontecendo.",
    full:"<p>Este blog não é um anexo do arquivo. É parte dele. Cada entrada nova é outra camada sobre as anteriores — como sedimento, ou como algo enterrado de propósito.</p><p>Encontrar o fim é apenas retornar ao ponto de partida. Volte quando houver algo novo para registrar. Alguma coisa sempre vai ter mudado.</p>",
    whisper:"a luz não revela o que a mente se recusa a ver" }
];
if(visits > 1){
  entries.push({ n:"006", date:"—.??", tag:"perdido", lost:true, title:"Você voltou",
    excerpt:"Esta entrada só existe para quem retorna. Ela não estava aqui na primeira vez.",
    full:"<p>Registramos que você saiu. Registramos que você voltou. Entre os dois momentos, alguma coisa neste arquivo se moveu — e não fomos nós.</p><p>Olhe para trás. Algum registro está diferente do que você lembra?</p>",
    whisper:"ele também voltou" });
}

const container = $('entries');
entries.forEach(e=>{
  const el = document.createElement('article');
  el.className = 'entry' + (e.lost ? ' lost' : '');
  const id = 'reg-' + e.n;
  el.innerHTML = `
    <div class="meta"><span>ENTRADA Nº ${e.n}</span><span>${e.date}</span><span class="tag">#${e.tag}</span></div>
    <h2><button type="button" aria-expanded="false" aria-controls="${id}">${e.title}</button></h2>
    <div class="excerpt">${e.excerpt}</div>
    <div class="full" id="${id}"><div>${e.full}<div class="whisper">${e.whisper}</div></div></div>
    <button type="button" class="toggle" aria-controls="${id}">abrir registro</button>`;
  const btns = el.querySelectorAll('h2 button, .toggle');
  const tgl = el.querySelector('.toggle'), hb = el.querySelector('h2 button');
  const flip = ()=>{
    const open = el.classList.toggle('open');
    tgl.textContent = open ? 'fechar registro' : 'abrir registro';
    hb.setAttribute('aria-expanded', open);
  };
  btns.forEach(b=>b.addEventListener('click', flip));
  container.appendChild(el);
});

/* ondas */
const canvas = $('waves'), ctx = canvas.getContext('2d');
let t = 0, rafId;
function resize(){
  const d = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * d; canvas.height = canvas.offsetHeight * d;
  ctx.setTransform(d,0,0,d,0,0);
}
window.addEventListener('resize', resize); resize();
function drawWaves(){
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  ctx.clearRect(0,0,w,h);
  for(let r=0;r<5;r++){
    ctx.beginPath();
    const baseY = h*0.55 + r*26;
    for(let x=0;x<=w;x+=12){
      const y = baseY + Math.sin(x*0.012 + t + r*0.6)*10;
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.strokeStyle = `rgba(95,147,153,${0.08 - r*0.012})`;
    ctx.lineWidth = 1; ctx.stroke();
  }
  t += 0.005;
  rafId = requestAnimationFrame(drawWaves);
}
if(reduced){ drawWaves(); cancelAnimationFrame(rafId); } else { drawWaves(); }
document.addEventListener('visibilitychange', ()=>{
  if(reduced) return;
  document.hidden ? cancelAnimationFrame(rafId) : drawWaves();
});

$('clock').textContent = 'CONEXÃO INSTÁVEL · ' + new Date().getFullYear() + (visits > 1 ? ' · RETORNO REGISTRADO' : '');

/* ambiente sonoro procedural: drone grave + ruído + batida distante */
let audioCtx = null, masterGain, running = false, busy = false, beatTimer;
function beat(){
  if(!audioCtx) return;
  if(audioCtx.state !== 'running'){ beatTimer = setTimeout(beat, 1500); return; }
  const now = audioCtx.currentTime;
  [0, 0.26].forEach((off,i)=>{
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(i?48:58, now+off);
    o.frequency.exponentialRampToValueAtTime(30, now+off+0.25);
    g.gain.setValueAtTime(0, now+off);
    g.gain.linearRampToValueAtTime(i?0.5:0.8, now+off+0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now+off+0.3);
    o.connect(g); g.connect(masterGain); o.start(now+off); o.stop(now+off+0.35);
  });
  beatTimer = setTimeout(beat, 6000 + Math.random()*7000);
}
function startAmbient(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);
  masterGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2.5);
  [55, 55.6, 110].forEach((f,i)=>{
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = f; g.gain.value = i===2 ? 0.15 : 0.4;
    o.connect(g); g.connect(masterGain); o.start();
  });
  const size = 2*audioCtx.sampleRate, buf = audioCtx.createBuffer(1,size,audioCtx.sampleRate);
  const d = buf.getChannelData(0); for(let i=0;i<size;i++) d[i] = Math.random()*2-1;
  const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const nf = audioCtx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 260;
  const ng = audioCtx.createGain(); ng.gain.value = 0.5;
  noise.connect(nf); nf.connect(ng); ng.connect(masterGain); noise.start();
  const lfo = audioCtx.createOscillator(), lg = audioCtx.createGain();
  lfo.frequency.value = 0.07; lg.gain.value = 0.012;
  lfo.connect(lg); lg.connect(masterGain.gain); lfo.start();
  running = true;
  beatTimer = setTimeout(beat, 4000);
}
function stopAmbient(){
  clearTimeout(beatTimer);
  const c = audioCtx; audioCtx = null; running = false; busy = true;
  masterGain.gain.cancelScheduledValues(c.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, c.currentTime + 1.2);
  setTimeout(()=>{ c.close(); busy = false; }, 1300);
}
/* o som já começa. navegadores só liberam áudio depois de um gesto — o primeiro toque, tecla ou clique acorda o arquivo */
const soundBtn = $('soundBtn');
let userMuted = false;
function paintBtn(){
  soundBtn.textContent = running ? '🔇 silenciar' : '🔈 ativar som ambiente';
  soundBtn.classList.toggle('on', running);
  soundBtn.setAttribute('aria-pressed', running);
}
function wake(){
  if(userMuted) return;
  if(!running && !busy){ startAmbient(); paintBtn(); }
  else if(audioCtx && audioCtx.state === 'suspended'){ audioCtx.resume(); }
  if(audioCtx && audioCtx.state === 'running'){
    ['pointerdown','keydown','touchstart','click'].forEach(ev=>window.removeEventListener(ev, wake));
  }
}
['pointerdown','keydown','touchstart','click'].forEach(ev=>window.addEventListener(ev, wake));
try{ startAmbient(); }catch(e){}   // tenta já na abertura
paintBtn();
soundBtn.addEventListener('click', e=>{
  e.stopPropagation();
  if(busy) return;
  if(running){ userMuted = true; stopAmbient(); }
  else { userMuted = false; startAmbient(); }
  paintBtn();
});

console.log('%cnão confie na ordem.', 'color:#a82d2d;font-size:14px');