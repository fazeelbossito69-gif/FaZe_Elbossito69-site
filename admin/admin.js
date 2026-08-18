const $ = s => document.querySelector(s);
const loginView = $('#loginView'), adminView = $('#adminView');
const form = $('#contentForm');

async function api(url, options={}) {
  const r = await fetch(url, { ...options, headers: {'Content-Type':'application/json', ...(options.headers||{})} });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.error || 'Erreur');
  return data;
}
function fill(data){ for(const [key,value] of Object.entries(data)){ const el=form.elements.namedItem(key); if(el) el.value=value; } }
async function load(){
  try { const data=await api('/api/admin/content'); fill(data); loginView.hidden=true; adminView.hidden=false; }
  catch { loginView.hidden=false; adminView.hidden=true; }
}
$('#loginForm').addEventListener('submit', async e=>{
  e.preventDefault(); $('#loginError').textContent='';
  try { await api('/api/login',{method:'POST',body:JSON.stringify({password:$('#password').value})}); await load(); $('#password').value=''; }
  catch(err){ $('#loginError').textContent=err.message; }
});
form.addEventListener('submit', async e=>{
  e.preventDefault(); $('#status').textContent='Enregistrement…';
  const data={}; for(const el of form.elements) if(el.name) data[el.name]=el.value;
  try { await api('/api/admin/content',{method:'PUT',body:JSON.stringify(data)}); $('#status').textContent='✓ Modifications enregistrées'; setTimeout(()=>$('#status').textContent='',2500); }
  catch(err){ $('#status').textContent='Erreur : '+err.message; }
});
$('#logout').addEventListener('click', async()=>{try{await api('/api/logout',{method:'POST'})}finally{location.reload()}});
load();
