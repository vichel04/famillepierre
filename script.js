// ══════════════════════════════════
// ⚠️ REMPLACEZ PAR VOTRE URL APPS SCRIPT
// ══════════════════════════════════
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_rRFdl6qZVHWjIZY5VpxQHMyx-N7HLVboBPgRcb0iBEEUAxc5zWuwpRIKVp8qIunZ/exec";

// Nav scroll
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40);
});

// ── Multi-étapes ──
let cur=1;
const TOTAL=7;

function updateProgress(){
  const steps=document.querySelectorAll('.prog-step');
  steps.forEach((s,i)=>{
    s.classList.remove('active','done');
    if(i+1===cur) s.classList.add('active');
    else if(i+1<cur) s.classList.add('done');
  });
  const pct=((cur-1)/(TOTAL-1))*100;
  document.getElementById('progTrack').style.width=pct+'%';
}

function showStep(n){
  document.querySelectorAll('.f-step').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('fs-'+n);
  if(el) el.classList.add('active');
  updateProgress();
  document.getElementById('adhesion').scrollIntoView({behavior:'smooth',block:'start'});
}

function validateStep(n){
  if(n===1){
    const nom=document.getElementById('f_nom').value.trim();
    const prenom=document.getElementById('f_prenom').value.trim();
    const sexe=document.getElementById('f_sexe').value;
    const tel=document.getElementById('f_tel').value.trim();
    if(!nom||!prenom||!sexe||!tel){
      alert('Veuillez remplir les champs obligatoires : Nom, Prénom, Sexe et Téléphone principal.');
      return false;
    }
  }
  if(n===2){
    if(!document.getElementById('f_pays').value||!document.getElementById('f_ville').value.trim()){
      alert('Veuillez indiquer votre pays et votre ville.');
      return false;
    }
  }
  return true;
}

function nextStep(n){if(validateStep(n)&&cur<TOTAL){cur=n+1;showStep(cur);}}
function prevStep(n){if(cur>1){cur=n-1;showStep(cur);}}
function gotoStep(n){if(n<=cur){cur=n;showStep(cur);}}

function toggleMaried(r){
  document.getElementById('mariedFields').style.display=(r.value==='Marié(e)')?'block':'none';
}

function renderEnfants(n){
  const c=document.getElementById('enfantsContainer');
  c.innerHTML='';n=parseInt(n)||0;
  for(let i=0;i<n;i++){
    c.innerHTML+=`<div class="child-block">
      <div class="child-ttl">Enfant ${i+1}</div>
      <div class="fgap-row">
        <div class="fg"><label>Nom</label><input type="text" id="e_nom_${i}" placeholder="Nom"></div>
        <div class="fg"><label>Prénom</label><input type="text" id="e_prenom_${i}" placeholder="Prénom"></div>
        <div class="fg"><label>Date de naissance</label><input type="date" id="e_dob_${i}"></div>
        <div class="fg"><label>Sexe</label><select id="e_sexe_${i}"><option value="">...</option><option>Masculin</option><option>Féminin</option></select></div>
      </div></div>`;
  }
}

// Collecte données
function g(id){const el=document.getElementById(id);return el?el.value:'';}
function gr(name){const r=document.querySelector(`input[name="${name}"]:checked`);return r?r.value:'';}

function collectData(){
  const nb=parseInt(g('f_nb_enfants'))||0;
  const enfants=[];
  for(let i=0;i<nb;i++) enfants.push({nom:g('e_nom_'+i),prenom:g('e_prenom_'+i),dob:g('e_dob_'+i),sexe:g('e_sexe_'+i)});
  const acc=[];
  if(document.getElementById('acc_spi').checked) acc.push('Spirituel');
  if(document.getElementById('acc_fam').checked) acc.push('Familial');
  if(document.getElementById('acc_pro').checked) acc.push('Professionnel');
  if(document.getElementById('acc_soc').checked) acc.push('Social');
  return{
    timestamp:new Date().toLocaleString('fr-FR'),
    nom:g('f_nom'),postnom:g('f_postnom'),prenom:g('f_prenom'),sexe:g('f_sexe'),
    date_naissance:g('f_dob'),lieu_naissance:g('f_lieu_nais'),nationalite:g('f_nat'),
    telephone:g('f_tel'),telephone2:g('f_tel2'),email:g('f_email'),
    pays:g('f_pays'),ville:g('f_ville'),commune:g('f_commune'),quartier:g('f_quartier'),adresse:g('f_adresse'),
    situation_matrimoniale:gr('matr'),
    conjoint_nom:g('f_conjoint_nom'),conjoint_tel:g('f_conjoint_tel'),date_mariage:g('f_date_mariage'),
    nb_enfants:nb,enfants:JSON.stringify(enfants),
    profession:g('f_prof'),employeur:g('f_employ'),statut_pro:gr('statut_pro'),
    ne_de_nouveau:gr('nv'),date_conversion:g('f_conv'),
    baptise:gr('bap'),date_bapteme:g('f_bap_date'),saint_esprit:gr('esprit'),
    date_icc:g('f_icc_date'),campus:g('f_campus'),departement:g('f_dept'),
    cellule:g('f_cellule'),resp_cellule:g('f_resp_cell'),frequence:g('f_freq'),
    sujets_priere:g('f_priere'),accompagnement:acc.join(', '),commentaires:g('f_comment')
  };
}

async function submitForm(){
  const btn=document.getElementById('submitBtn');
  const msg=document.getElementById('sendingMsg');
  const err=document.getElementById('errorMsg');
  btn.disabled=true;btn.style.opacity='.5';
  msg.style.display='block';err.style.display='none';

  if(SHEET_URL==='VOTRE_URL_APPS_SCRIPT_ICI'){
    setTimeout(showSuccess,900);return;
  }
  try{
    await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(collectData())});
    showSuccess();
  }catch(e){
    msg.style.display='none';btn.disabled=false;btn.style.opacity='1';
    err.textContent='Erreur de connexion. Vérifiez votre connexion et réessayez.';
    err.style.display='block';
  }
}

function showSuccess(){
  document.querySelectorAll('.f-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('progBar').style.display='none';
  document.getElementById('successBox').style.display='block';
  document.getElementById('successBox').scrollIntoView({behavior:'smooth',block:'center'});
}

// Admin
function aTab(name,tab){
  document.querySelectorAll('.a-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.a-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('ap-'+name).classList.add('active');
  tab.classList.add('active');
}
function filterTable(q){
  document.querySelectorAll('#membersTable tbody tr').forEach(r=>{
    r.style.display=r.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';
  });
}
function exportSheet(){
  if(SHEET_URL==='VOTRE_URL_APPS_SCRIPT_ICI'){
    alert('Configurez d\'abord l\'URL Google Apps Script dans script.js (variable SHEET_URL).');
  } else {
    window.open('https://docs.google.com/spreadsheets','_blank');
  }
}
