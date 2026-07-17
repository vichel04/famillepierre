//========================================
// CONFIGURATION SUPABASE
//========================================
const SUPABASE_URL = "https://ajwiojulraahleypksyk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GIEx8wKmMOBB6_LD4BA8oQ_SZW8S3Az";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

//========================================
// NAVIGATION
//========================================

window.addEventListener("scroll", () => {

    document
        .getElementById("nav")
        .classList.toggle("scrolled", window.scrollY > 40);

});

//========================================
// FORMULAIRE
//========================================

let cur = 1;
const TOTAL = 7;

//========================================

function updateProgress() {

    document.querySelectorAll(".prog-step").forEach((step, index) => {

        step.classList.remove("active", "done");

        if (index + 1 === cur)
            step.classList.add("active");

        if (index + 1 < cur)
            step.classList.add("done");

    });

    document.getElementById("progTrack").style.width =
        ((cur - 1) / (TOTAL - 1)) * 100 + "%";

}

//========================================

function showStep(step) {

    document
        .querySelectorAll(".f-step")
        .forEach(el => el.classList.remove("active"));

    document
        .getElementById("fs-" + step)
        .classList.add("active");

    updateProgress();

    document
        .getElementById("adhesion")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}

//========================================

function validateStep(step) {

    if (step === 1) {

        if (
            !g("f_nom") ||
            !g("f_prenom") ||
            !g("f_lieu_nais") ||
            !g("f_sexe") ||
            !g("f_dob") ||
            !g("f_nationalite") ||
            !g("f_tel")
        ) {

            alert("Veuillez remplir tous les champs obligatoires.");

            return false;

        }

    }

    if (step === 2) {

        if (!g("f_pays") || !g("f_ville")) {

            alert("Veuillez compléter votre adresse.");

            return false;

        }

    }

    return true;

}

//========================================

function nextStep(step) {

    if (!validateStep(step))
        return;

    if (step >= TOTAL)
        return;

    cur++;

    showStep(cur);

}

//========================================

function prevStep(step) {

    if (step <= 1)
        return;

    cur--;

    showStep(cur);

}

//========================================

function gotoStep(step) {

    if (step > cur)
        return;

    cur = step;

    showStep(cur);

}

//========================================

function g(id) {

    const el = document.getElementById(id);

    return el ? el.value.trim() : "";

}

//========================================

function gr(name) {

    const radio = document.querySelector(
        `input[name="${name}"]:checked`
    );

    return radio ? radio.value : "";

}

//========================================

function collectData() {

    return {

        nom: g("f_nom"),

        prenom: g("f_prenom"),

        lieu_naissance: g("f_lieu_nais"),

        sexe: g("f_sexe"),

        date_anniversaire: g("f_dob"),

        nationalite: g("f_nationalite"),

        telephone: g("f_tel"),

        pays: g("f_pays"),

        ville: g("f_ville"),

        commune: g("f_commune"),

        quartier: g("f_quartier"),

        adresse: g("f_adresse"),

        situation_matrimoniale: gr("matr"),

        profession: g("f_prof"),

        statut_pro: gr("statut_pro"),

        ne_de_nouveau: gr("nv"),

        date_conversion: g("f_conv"),

        baptise: gr("bap"),

        date_bapteme: g("f_bap_date"),

        saint_esprit: gr("esprit"),

        date_icc: g("f_icc_date"),

        campus: g("f_campus"),

        ministere: g("f_dept"),

        departement: g("f_cellule"),

        sujets_priere: g("f_priere"),

        entretien_berger: gr("berger"),

        commentaires: g("f_comment")

    };

}

//========================================

async function submitForm() {

    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("sendingMsg");
    const err = document.getElementById("errorMsg");

    btn.disabled = true;

    msg.style.display = "block";

    err.style.display = "none";

    const { error } = await supabaseClient
        .from("membres_famille_pierre")
        .insert([collectData()]);

    if (error) {

        btn.disabled = false;

        msg.style.display = "none";

        err.style.display = "block";

        err.innerHTML = error.message;

        console.error(error);

        return;

    }

    showSuccess();

}

//========================================

function showSuccess(){
  const sexe = g('f_sexe');
  const prenom = g('f_prenom');
  const titre = sexe === 'Masculin' ? 'Tonton' : (sexe === 'Féminin' ? 'Tantine' : '');
  document.getElementById('successName').textContent = (titre ? titre + ' ' : '') + prenom;

  document.querySelectorAll('.f-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('progBar').style.display='none';
  document.getElementById('successBox').style.display='block';
  document.getElementById('successBox').scrollIntoView({behavior:'smooth',block:'center'});
}