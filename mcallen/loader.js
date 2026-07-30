(async()=>{
  const parts=['ui-hero.html','ui-home.html','ui-route.html','ui-content.html','ui-overlays.html'];
  try{
    const html=(await Promise.all(parts.map(async p=>{const r=await fetch('./'+p);if(!r.ok)throw new Error(p);return r.text()}))).join('');
    document.getElementById('app').outerHTML=html;
    for(const src of ['data.js','core.js','features.js','share.js']){
      await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./'+src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)});
    }
  }catch(error){
    document.getElementById('app').innerHTML='<div style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui;text-align:center"><div><div style="font-size:48px">🧭</div><h1>No pude cargar la guía</h1><p>Comprueba la conexión y vuelve a abrir el enlace.</p><button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 18px;background:#087e78;color:white;font-weight:800">Reintentar</button></div></div>';
  }
})();
