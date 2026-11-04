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

  agences: [
    "Casablanca — Centre-ville",
    "Rabat — Agdal",
    "Marrakech — Guéliz",
  ],

  aeroports: [
    "Casablanca — Mohammed V",
    "Rabat — Salé",
    "Marrakech — Ménara",
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

const cars_div = document.getElementById("voiture_div");
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
        document.querySelectorAll(".card").forEach((c)=> c.classList.remove("!border-[#2852E3]"))
        if (radio.checked) {
            card.classList.add("!border-[#2852E3]");
            selectedConfig.voitureId = car.id;
            carObj = car;
        }
        if (radio.checked) {
            showCarDetails(car);
        }
        if(!(selectedConfig.dateDebut == "" || selectedConfig.dateFin == "")){
            showPrices();
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



const start = document.querySelector("#start");
const end = document.querySelector("#end");
const small = document.querySelector("#dateError");
const radios = document.querySelectorAll("input[type='radio']")
const voitureMarque = document.getElementById("VoitureMarque");
const voiturePrix = document.getElementById("voiturePrix");
const carPrice = document.getElementById("carPrice");
const totalCarPrice = document.getElementById("totalCarPrice");

