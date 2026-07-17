// ══════════════════════════════════
// CONFIGURATION SUPABASE
// Remplacez par vos identifiants (Project Settings → API)
// ══════════════════════════════════
const SUPABASE_URL = "https://ajwiojulraahleypksyk.supabase.co";       // ex: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_GIEx8wKmMOBB6_LD4BA8oQ_SZW8S3Az";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    const prenom=document.getElementById('f_postnom').value.trim();
    const sexe=document.getElementById('f_sexe').value;
    const tel=document.getElementById('f_tel').value.trim();
    if(!nom||!prenom||!sexe||!tel){
      alert('Veuillez remplir les champs obligatoires : Nom, Prénom, Sexe et Téléphone.');
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

// Collecte données
function g(id){const el=document.getElementById(id);return el?el.value:'';}
function gr(name){const r=document.querySelector(`input[name="${name}"]:checked`);return r?r.value:'';}

function collectData(){
  return{
    nom:g('f_nom'),
    prenom:g('f_postnom'),
    lieu_naissance:g('f_prenom'),
    sexe:g('f_sexe'),
    date_anniversaire:g('f_dob'),
    nationalite:g('f_lieu_nais'),
    telephone:g('f_tel'),
    pays:g('f_pays'),ville:g('f_ville'),commune:g('f_commune'),quartier:g('f_quartier'),adresse:g('f_adresse'),
    situation_matrimoniale:gr('matr'),
    profession:g('f_prof'),statut_pro:gr('statut_pro'),
    ne_de_nouveau:gr('nv'),date_conversion:g('f_conv'),
    baptise:gr('bap'),date_bapteme:g('f_bap_date'),saint_esprit:gr('esprit'),
    date_icc:g('f_icc_date'),campus:g('f_campus'),ministere:g('f_dept'),departement:g('f_cellule'),
    sujets_priere:g('f_priere'),entretien_berger:gr('berger'),commentaires:g('f_comment')
  };
}

async function submitForm(){
  const btn=document.getElementById('submitBtn');
  const msg=document.getElementById('sendingMsg');
  const err=document.getElementById('errorMsg');
  btn.disabled=true;btn.style.opacity='.5';
  msg.style.display='block';err.style.display='none';

  const { error } = await supabaseClient
    .from('membres_famille_pierre')
    .insert([collectData()]);

  if(error){
    msg.style.display='none';btn.disabled=false;btn.style.opacity='1';
    err.textContent='Erreur : '+error.message;
    err.style.display='block';
    console.error(error);
  } else {
    showSuccess();
  }
}

function showSuccess(){
  document.querySelectorAll('.f-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('progBar').style.display='none';
  document.getElementById('successBox').style.display='block';
  document.getElementById('successBox').scrollIntoView({behavior:'smooth',block:'center'});
}