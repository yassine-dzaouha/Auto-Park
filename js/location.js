/*
 * AutoPark — Partie 2 : Composez votre location
 * Starter JavaScript — à compléter par les apprenants.
 * Charger ce fichier dans votre HTML avec l'attribut defer.
 *
 * Parcours : véhicule et dates → récupération → options → récapitulatif.
 * Les tarifs sont exprimés en MAD.
 */

// 1. CONFIGURATION : les données proposées par l'agence.
const config = {
  voitures: JSON.parse(localStorage.getItem("cars")),

  modesRecuperation: [
    { id: "agence", nom: "À l’agence", fraisFixes: 0 },
    { id: "aeroport", nom: "À l’aéroport", fraisFixes: 150 },
    { id: "adresse", nom: "À une adresse", fraisFixes: 100 },
  ],

  options: [
    {
      id: "siegeBebe",
      nom: "Siège bébé",
      prixParJour: 30,
    },
    {
      id: "conducteurSupplementaire",
      nom: "Conducteur supplémentaire",
      prixParJour: 200,
    },
  ],
};

// 2. SÉLECTION : les choix de l'utilisateur, à actualiser avec les formulaires.
// Les identifiants correspondent aux id définis dans config.
// Les dates seront des chaînes au format AAAA-MM-JJ (valeur d'un input date).
const selectedConfig = {
  etape: 1,
  voitureId: null,
  dateDebut: "",
  dateFin: "",
  modeRecuperation: "agence",

  recuperation: {
    // Mode agence uniquement.
    heureRecuperation: "",

    // Mode aéroport uniquement.
    aeroport: "",
    numeroVol: "",
    heureArrivee: "",

    // Mode adresse uniquement.
    ville: "",
    adresse: "",
    heureLivraison: "",
  },

  options: {
    siegeBebe: false,
    conducteurSupplementaire: false,
  },
};

let carObj = null;
/*
 * 3. À VOUS DE JOUER
 *
 * 1) Sélectionner vos éléments HTML et afficher les voitures depuis config.
 * 2) Écouter les événements et mettre à jour selectedConfig.
 *    Attention : la valeur d'un select est une chaîne ; voitureId est un nombre.
 *    Pour une case à cocher, utiliser checked pour récupérer true ou false.
 * 3) Gérer les boutons Précédent / Suivant et afficher une seule étape.
 * 4) Afficher les champs du mode de récupération sélectionné.
 *    Masquer et désactiver les autres ; adapter required.
 * 5) Valider l'étape courante avant de passer à la suivante.
 * 6) Calculer et actualiser le prix quand les choix changent.
 * 7) Afficher le récapitulatif des seuls champs concernés, puis confirmer.
 * 8) Permettre de recommencer avec les valeurs initiales.
 *
 * RÈGLES DU PRIX
 * - Les deux dates sont incluses : du 10 au 12 = 3 jours.
 * - Une location sur une même date = 1 jour.
 * - Le début ne peut pas être passé ; la fin ne peut pas précéder le début.
 * - Total = jours × (prixParJour de la voiture + options par jour)
 *           + fraisFixes du mode de récupération.
 * - Les frais de récupération sont ajoutés une seule fois.
 * - Aucun renseignement supplémentaire pour le conducteur.
 * - Ne pas afficher un total numérique tant que la voiture ou les dates
 *   sont manquantes ou invalides.
 *
 * Exemple de contrôle : Sandero, du 10 au 12, siège bébé, aéroport
 * → 3 × (250 + 30) + 150 = 990 MAD.
 */



// ------------------------ step 1 ----------------------
const cars_div = document.getElementById("voiture_div");
const start = document.querySelector("#start");
const end = document.querySelector("#end");
const small = document.querySelector("#dateError");
const radios = document.querySelectorAll("input[type='radio']")
const voitureMarque = document.getElementById("VoitureMarque");
const voiturePrix = document.getElementById("voiturePrix");
const carPrice = document.getElementById("carPrice");
const totalCarPrice = document.getElementById("totalCarPrice");
const total = document.getElementById("totalPrice");
const recommenceBtn = document.getElementById("recommencer");
const suivantbtns = document.querySelectorAll(".suivant");
const suivantbtn = document.getElementById("Suivant");
const etape1 = document.getElementById("etape1");
const etape2 = document.getElementById("etape2");


showCars();

function createElement(tag, className = "", text = "", attrs = {}) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
    });
    return el;
}

function showCars() {
    config.voitures.forEach((car) => {
    const label = createElement("label", "cursor-pointer", "", { for: car.id });
 
    const card = createElement(
      "div",
      "card p-3 border border-[#D8E1EF] rounded-xl bg-white"
    );
    const header = createElement("div", "flex items-center justify-between mb-2");
    const category = createElement( "span", "bg-[#EDF1FF] text-[#2852E3] text-[9px] font-semibold px-2 py-1.5 rounded", car.categorie);
    const radio = createElement("input", "!w-5", "", { type: "radio", name: "voiture", id: car.id});
    radio.addEventListener("change", () => {
        document.querySelectorAll(".card").forEach((c)=> c.classList.remove("!border-[#2852E3]"));
            if (radio.checked) {
                card.classList.add("!border-[#2852E3]");
                selectedConfig.voitureId = car.id;
                carObj = car;
            }
            if (radio.checked) {
                validation();
                showCarDetails();
                if(!(selectedConfig.dateDebut == "" || selectedConfig.dateFin == "")){
                    showPrices();
                }
            }
    });

    header.append(category, radio);

    const title = createElement("h3", "text-[#263A50] text-xs font-bold mb-2", `${car.marque} ${car.modele}`);
    const status = createElement("p", "text-[#00966E] text-[10px] mb-2", car.statut);
    const price = createElement("p" ,"text-[#2852E3] text-xs font-bold",`${car.prixJour} MAD / jour`);
 
    card.append(header, title, status, price);
    label.append(card);
    cars_div.append(label);
  });

}

start.addEventListener("change",()=>{
    showDates();
    showTotal();
});
end.addEventListener("change", ()=>{
    showDates();
    showTotal();
});



recommenceBtn.addEventListener("click", () => {

    selectedConfig.voitureId = null;
    selectedConfig.dateDebut = "";
    selectedConfig.dateFin = "";
    carObj = null;
 
    radios.forEach((r) => (r.checked = false));
    document.querySelectorAll(".card").forEach((c) => c.classList.remove("!border-[#2852E3]"));
    start.value = "";
    end.value = "";
 
    voitureMarque.textContent = "___";
    voiturePrix.textContent = "__ · __ MAD / jour";
    document.getElementById("dateDebutFin").textContent = "date";
    document.getElementById("nombreJour").textContent = "___ · dates incluses";
    carPrice.textContent = "Véhicule · ---";
    totalCarPrice.textContent = "__ MAD";
    total.textContent = "__ MAD";
});


let today = new Date();
let startMin = today.toISOString().split("T")[0];
console.log(today.toISOString())
start.min = startMin;

validation();
function validation(){
    let valid = true;
    radios.forEach(radio=>{
        if(radio.checked){
            valid = true;
        }
    })

    if(!valid) valid = false;
    if (!start.value) {
        valid = false;
        end.disabled = true;
    }else{
        end.disabled = false;
        let endMin = new Date(start.value);
        endMin.setDate(endMin.getDate() + 2);
        endMin = endMin.toISOString().split("T")[0];
        end.min = endMin;
    }

    selectedConfig.dateDebut = start.value;
    if(!end.value){
        valid = false;
    }
    selectedConfig.dateFin = end.value;
    
    
    if(!valid){
        suivantbtn.disabled = true;
        suivantbtn.classList.add("!bg-[#8fabff]")
    }else{
        suivantbtn.disabled = false;
        suivantbtn.classList.remove("!bg-[#8fabff]")
    }
    return valid;
}


function showCarDetails() {
    let car = config.voitures.find((voiture) => voiture.id == selectedConfig.voitureId);
    voitureMarque.textContent = `${car.marque} ${car.modele}`;
    voiturePrix.textContent = `${car.categorie} · ${car.prixJour} MAD / jour`;
}

function showDates() {
    if(!validation()){
        return;
    }
    const d1 = new Date(selectedConfig.dateDebut);
    const d2 = new Date(selectedConfig.dateFin);
    console.log(d1,d2)
    const opts = { day: "numeric", month: "long", year: "numeric" };
    document.getElementById("dateDebutFin").textContent = `${d1.getDate()} → ${d2.toLocaleDateString("fr-FR", opts)}`;
    if(carObj && selectedConfig.dateDebut != "" && selectedConfig.dateFin != ""){
        showPrices();
    }
}

function showPrices(){
    let debut = new Date(selectedConfig.dateDebut);
    let fin = new Date(selectedConfig.dateFin);
    let days = Math.round((fin - debut) / 86400000) + 1;
    console.log(days);
    let total = days * carObj.prixJour;
    document.getElementById("nombreJour").textContent = `${days} jour · dates incluses`;
    carPrice.textContent = `Véhicule · ${days} × ${carObj.prixJour} MAD`;
    totalCarPrice.textContent = `${total} MAD`;
}


// ------------------------ step 2 ----------------------

const recuperation_div = document.getElementById("recuperation_div");
const formAgence = document.getElementById("formAgence");
const formAeroport = document.getElementById("formAeroport");
const formAdresse = document.getElementById("formAdresse");

function showRecuperation() {
    recuperation_div.textContent = "";
 
    config.modesRecuperation.forEach((mode) => {
        const label = createElement("label", "cursor-pointer", "", { for: mode.id });
 
        const card = createElement(
            "div",
            "card-recup p-4 border border-[#D8E1EF] rounded-xl bg-white transition-all " +
            "has-[:checked]:border-2 has-[:checked]:border-[#2852E3] has-[:checked]:bg-[#F8FAFF]"
        );
 
        const radio = createElement("input", "!w-5 !h-5 !p-0 !m-0 mb-3 accent-[#2852E3] cursor-pointer", "", {
            type: "radio",
            name: "recuperation",
            id: mode.id,
            value: mode.id,
        });
        if(mode.id === selectedConfig.modeRecuperation){
            radio.checked = true;
            selectedConfig.modeRecuperation = mode.id;
        }
        

        radio.addEventListener("change", () => {
            if (radio.checked) {
                selectedConfig.modeRecuperation = mode.id;
                showRecuperationForm()
                showRecuperationForm()
                addRecuperation();
                showTotal();
            }
            
            
        });
        const nom = createElement("h3", "text-[#263A50] text-xs font-bold mb-2", mode.nom);
        const frais = createElement(
            "p",
            "text-[#2852E3] text-[10px] font-bold",
            mode.fraisFixes ? `+${mode.fraisFixes} MAD` : "Gratuit"
        );
 
        card.append(radio, nom, frais);
        label.append(card);
        recuperation_div.append(label);
    });
}
addRecuperation()

function showRecuperationForm(){
    formAgence.classList.add("hidden");
    formAeroport.classList.add("hidden");
    formAdresse.classList.add("hidden");
    if (selectedConfig.modeRecuperation === "agence") {
        formAgence.classList.remove("hidden");
    }
    if (selectedConfig.modeRecuperation === "aeroport") {
        formAeroport.classList.remove("hidden");
    }
    if (selectedConfig.modeRecuperation === "adresse") {
        formAdresse.classList.remove("hidden");
    }
} 

const recuperationError = document.getElementById("recuperationError");
const aeroportError = document.getElementById("aeroportError");
const adresseError = document.getElementById("adresseError");
const heureRecuperation = document.getElementById("heureRecuperation");
const aeroportSelect = document.getElementById("aeroport_select");
const numeroVol = document.getElementById("numeroVol");
const heureArrivee = document.getElementById("heureArrivee");
const ville = document.getElementById("ville");
const adresseInput = document.getElementById("adresse_input");
const heureLivraison = document.getElementById("heureLivraison");
const suivantbtn2 = document.getElementById("btnSuivant2");

validationRecuperation()
function validationRecuperation() {
    const mode = selectedConfig.modeRecuperation;
    const r = selectedConfig.recuperation;
    let valid = true
    if (mode === "agence") {
        r.heureRecuperation = heureRecuperation.value;
        if (!r.heureRecuperation) {
            valid = false;
        }
    } else if (mode === "aeroport") {
        r.aeroport = aeroportSelect.value;
        r.numeroVol = numeroVol.value.trim();
        r.heureArrivee = heureArrivee.value;
        if (!r.aeroport && !r.numeroVol && !r.heureArrivee) {
            valid = false;
        }

    } else if (mode === "adresse") {
        r.ville = ville.value.trim();
        r.adresse = adresseInput.value.trim();
        r.heureLivraison = heureLivraison.value;
        if (!r.ville && !r.adresse && !r.heureLivraison){
            valid = false;
        }
    }

    if(!valid){
        suivantbtn2.disabled = true;
        suivantbtn2.classList.add("!bg-[#8fabff]")
    }else{
        suivantbtn2.disabled = false;
        suivantbtn2.classList.remove("!bg-[#8fabff]")
    }
    return valid
}

etape2.querySelectorAll("input").forEach((input)=>{
    input.addEventListener("change", ()=>{
    validationRecuperation();
    })
})

// suivantbtn2.addEventListener("click" , ()=> {
//     if(!validationRecuperation()){
//         return
//     }
//     console.log("saf dazt");
// })


function addRecuperation(){
    let mode = config.modesRecuperation.find((mode)=>mode.id == selectedConfig.modeRecuperation);
    const row = document.getElementById("selectedVoiture");
    row.children[0].textContent = `Récupération · ${mode.nom}`;
    row.children[1].textContent = mode.fraisFixes ? `${mode.fraisFixes} MAD` : "Gratuit";
}

// ------------------------ step 3 ----------------------

const options_div = document.getElementById("options_div");
const bebeOption = document.getElementById("bebeOption");
const conducteurOption = document.getElementById("conducteurOption");

function showOptions() {
    options_div.textContent = "";

    const days = getDate();
    config.options.forEach((opt) => {
        const label = createElement("label", "cursor-pointer", "", { for: opt.id });
 
        const card = createElement(
            "div",
            "card-option flex items-start gap-3 p-4 border border-[#D8E1EF] rounded-xl bg-white transition-all " +
            "has-[:checked]:border-2 has-[:checked]:border-[#2852E3] has-[:checked]:bg-[#F8FAFF]"
        );
 
        const checkbox = createElement("input", "!w-5 !h-5 !p-0 !m-0 mt-0.5 accent-[#2852E3] cursor-pointer", "", {
            type: "checkbox",
            id: opt.id,
            value: opt.id,
        });
 
        checkbox.addEventListener("change", () => {
            selectedConfig.options[opt.id] = checkbox.checked;
            addOption();
            showTotal();
        });
 
        const info = createElement("div");
        const nom = createElement("h3", "text-[#263A50] text-xs font-bold mb-2", opt.nom);
        const detail = createElement(
            "p",
            "text-[#697C94] text-[11px]",
            `${opt.prixParJour} MAD / jour · soit ${opt.prixParJour * days} MAD pour ${days} jour`
        );
 
        info.append(nom, detail);
        card.append(checkbox, info);
        label.append(card);
        options_div.append(label);
    });
}

 
function addOption() {
    const days = getDate();
    const bebe = config.options[0];
    const conducteur = config.options[1];
    console.log(selectedConfig.options.siegeBebe)
    if (selectedConfig.options.siegeBebe) {
        bebeOption.children[0].textContent = `${bebe.nom} · ${days} × ${bebe.prixParJour} MAD`;
        bebeOption.children[1].textContent = `${days * bebe.prixParJour} MAD`;
        bebeOption.classList.remove("hidden");
    } else {
        bebeOption.classList.add("hidden");
    }

    if (selectedConfig.options.conducteurSupplementaire) {
        conducteurOption.children[0].textContent = `${conducteur.nom} · ${days}×${conducteur.prixParJour}MAD`;
        conducteurOption.children[1].textContent = `${days * conducteur.prixParJour} MAD`;
        conducteurOption.classList.remove("hidden");
    } else {
        conducteurOption.classList.add("hidden");
    }
}

// -------------------total------------------------

function showTotal() {
    let mode = config.modesRecuperation.find((mode)=>mode.id == selectedConfig.modeRecuperation);
    if (!carObj || !selectedConfig.dateDebut || !selectedConfig.dateFin) {
        total.textContent = "__ MAD";
        return;
    }
    let optionsParJour = 0;
    config.options.forEach((opt) => {
        if (selectedConfig.options[opt.id]) {
            optionsParJour += opt.prixParJour;
        }
    });
    const days = getDate()
    let prixTotal = days * (carObj.prixJour + optionsParJour) + mode.fraisFixes ;
    total.textContent = `${prixTotal} MAD`;
}

// -------------------step 4---------------------




// -------------------global-------------------

suivantbtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (validation()  || validationRecuperation()) {
            steper(selectedConfig.etape + 1);
        }
    });
});

document.querySelectorAll(".btn-precedent").forEach((btn) => {
    btn.addEventListener("click", () => {
        steper(selectedConfig.etape - 1);
    });
});

function steper(etap){
    selectedConfig.etape = etap;
    
    document.querySelectorAll(".etape").forEach((section,i)=>{
        if (i === etap - 1) {
            section.classList.remove("hidden");
        }else {
            section.classList.add("hidden");
        }
    });

    document.querySelectorAll(".steps").forEach((step, i) => {
        const active = i < selectedConfig.etape;
        const number = step.querySelector("p");
        if(i < selectedConfig.etape - 1){
            number.textContent = "✓";
        }else{
            number.textContent = i + 1;
        }
        if (active) {
            step.classList.add("text-[#2852E3]");
            number.classList.add("bg-[#2852E3]", "text-[#FFFFFF]");
            number.classList.remove("bg-[#F4F6FA]");
        }else {
            step.classList.remove("text-[#2852E3]");
            number.classList.remove("bg-[#2852E3]", "text-[#FFFFFF]");
            number.classList.add("bg-[#F4F6FA]");
        }
    });
    if (etap === 2) showRecuperation();
    if (etap === 3) showOptions();
}

function getDate(){
    return Math.round((new Date(selectedConfig.dateFin) - new Date(selectedConfig.dateDebut)) / 86400000) + 1;
};