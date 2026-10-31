import {voituresInitiales} from "./data.js";

if(!localStorage.getItem('id')){
    localStorage.setItem("id", 7);
}

let carsId = Number(localStorage.getItem("id"))

let modifyId = {};

if(!localStorage.getItem('cars')){
    localStorage.setItem("cars", JSON.stringify(voituresInitiales));
}

let cars = JSON.parse(localStorage.getItem("cars"));

console.log(localStorage.getItem('cars'));

const form = document.getElementById("formulaire-voiture");
const marque = document.getElementById("marque");
const modele = document.getElementById("modele");
const immatriculation = document.getElementById("immatriculation");
const categorie = document.getElementById("categorie");
const prixJour = document.getElementById("prix-jour");
const statut = document.getElementById("statut");
const carsList = document.getElementById("liste-voitures");
const cancelModifyBtn = document.getElementById("annuler-modification")
const btn = document.getElementById("bouton-enregistrer");
const formTitle = document.getElementById("titre-formulaire");
const recherche = document.getElementById("recherche");
const filtreStatut = document.getElementById("filtre-statut");
const filtreCategorie = document.getElementById("filtre-categorie");
const tri = document.getElementById("tri-prix");
const boutonReset = document.getElementById("reinitialiser-filtres");
const errors = document.querySelectorAll(".field-error");

showCars(cars);

btn.addEventListener("click", (e)=>{
    e.preventDefault();
    sumbitCar();
    showCars(cars);
});

cancelModifyBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    cancelModify();
    showCars(cars);
});

function sumbitCar(){
    
    if(!formValidation()){
        return;
    }
    
    if(modifyId.id){
        editCar(modifyId);
    }
    else {
         addCar();
    }
    
}

function formValidation() {
    let valide = true;
    marque.addEventListener("input", function() {
    marque.nextElementSibling.textContent = "";
    });

    modele.addEventListener("input", function() {
        modele.nextElementSibling.textContent = "";
    });

    immatriculation.addEventListener("input", function() {
        document.getElementById("erreur-immatriculation").textContent = "";
    });

    categorie.addEventListener("change", function() {
        categorie.nextElementSibling.textContent = "";
    });

    prixJour.addEventListener("input", function() {
        prixJour.nextElementSibling.textContent = "";
    });

    statut.addEventListener("change", function() {
        statut.nextElementSibling.textContent = "";
    });

    errors.forEach((error) => error.textContent = "");

    
    if (marque.value.trim() === "") {
        marque.nextElementSibling.textContent = "La marque est obligatoire.";
        
        valide = false;
    }

    if (modele.value.trim() === "") {
        modele.nextElementSibling.textContent = "Le modèle est obligatoire.";
        valide = false;
    }

    const immatPatern = /^[A-Za-z]{4}-\d{3}$/;
    const immatError = document.getElementById("erreur-immatriculation");

    if (immatriculation.value.trim() === "") {
        immatError.textContent = "Le matricule est obligatoire.";
        valide = false;
    }
    else if (!immatPatern.test(immatriculation.value.trim())) {
        immatError.textContent = "Format invalide. Exemple : AUTO-007";
        valide = false;
    }
    else {
        cars.forEach( car => {
           if ( car.immatriculation == immatriculation.value.trim() && modifyId.id != car.id){
            immatError.textContent = "Le matricule existe déjà.";
            valide = false;
            return;
            }
        })
    }
    console.log(valide);
    if (categorie.value.trim() === "") {
        categorie.nextElementSibling.textContent = "La catégorie est obligatoire.";
        valide = false;
    }

    if (prixJour.value === "" || Number(prixJour.value) <= 0) {
        prixJour.nextElementSibling.textContent = "Le prix doit être supérieur à 0.";
        valide = false;
    }

    if (statut.value.trim() === "") {
        statut.nextElementSibling.textContent = "Le statut est obligatoire.";
        valide = false;
    }
    
    return valide;
    
}

function addCar(){
    const car = {};
    car.id = carsId++;
    car.marque = marque.value.trim();
    car.modele = modele.value.trim();
    car.immatriculation = immatriculation.value.trim();
    car.categorie = categorie.value;
    car.prixJour = Number(prixJour.value);
    car.statut = statut.value;
    cars.push(car);

    localStorage.setItem("cars", JSON.stringify(cars));
    localStorage.setItem("id", carsId);
    form.reset();
}

function showCars(carsTable){
    console.log(carsTable);
    carsList.textContent = "";
    if(!carsTable.length){
        document.getElementById("etat-vide").hidden = false;
        return;
    }
    document.getElementById("etat-vide").hidden = true;
    carsTable.forEach((car)=>{
        let tr = creatElem("tr","","");
        
        let marqueTd = creatElem("td","","");
        let strong = creatElem("strong","",car.marque);
        marqueTd.append(strong);
        
        let modeleTd = creatElem("td","",car.modele);
        let immatriculationTd = creatElem("td","","");
        let immatriculationSpan = creatElem("span","registration", car.immatriculation);
        immatriculationTd.append(immatriculationSpan);
        
        let categorieTd = creatElem("td","",car.categorie);
        let priceTd = creatElem("td","price",car.prixJour + " ");
        let priceSpan = creatElem("span","","DH / jour");
        priceTd.append(priceSpan);
        
        let statusTd = creatElem("td","","");
        let statusSpan = creatElem("td", statusSwitch(car.statut), car.statut);
        statusTd.append(statusSpan);
        
        let actionsTd = creatElem("td","","");
        let actionsDiv = creatElem("div", "row-actions", "");
        let editBtn = creatElem("button", "button button-edit", "Modifier");
        editBtn.setAttribute("type","button");
        editBtn.setAttribute("data-action","modifier");
        editBtn.setAttribute("data-id", `${car.id}`);
        editBtn.setAttribute("aria-label", `Modifier ${car.marque} ${car.modele}, ${car.immatriculation}`);
        editBtn.addEventListener("click", () => {
            modifyForm(car);
            errors.forEach((error) => error.textContent = "");
        });

        let deleteBtn = creatElem("button", "button button-delete", "Supprimer");
        deleteBtn.setAttribute("type","button");
        deleteBtn.setAttribute("data-action", "supprimer");
        deleteBtn.setAttribute("data-id", `${car.id}`);
        deleteBtn.setAttribute("aria-label", `supprimer ${car.marque} ${car.modele}, ${car.immatriculation}`);
        deleteBtn.addEventListener("click", () => {
            deleteCar(car.id);
            showCars(cars);
        });
        
        actionsDiv.append(editBtn, deleteBtn);
        actionsTd.append(actionsDiv);
        tr.append(marqueTd, modeleTd, immatriculationTd, categorieTd, priceTd, statusTd, actionsTd);
        carsList.append(tr);
    });

};

function creatElem(tag, classname, content){
    const element = document.createElement(tag);
    element.className = classname;
    element.textContent = content;
    return element;
};

function statusSwitch(status){
    let className ;
    switch(status){
        case "Disponible":
            className = "badge badge-disponible";
            break;
        case "Louée" :
            className = "badge badge-louee";
            break;
        case "En maintenance" :
            className = "badge badge-maintenance";
            break;
    };
    return className;
};

function modifyForm(car){
    marque.value = car.marque;
    modele.value = car.modele;
    immatriculation.value = car.immatriculation;
    categorie.value = car.categorie;
    prixJour.value = car.prixJour;
    statut.value = car.statut;

    cancelModifyBtn.hidden = false;
    btn.textContent = "Modifier la voiture";
    formTitle.textContent = "Modifier une voiture";
    modifyId = car;
};

function cancelModify(){
    form.reset();
    cancelModifyBtn.hidden = true;
    btn.textContent = "Ajouter la voiture";
    formTitle.textContent = "Ajouter une voiture";
    modifyId = 0;
};

function editCar(car){
    if(!confirm("are you sure ?")){
        return;
    }
    car.marque = marque.value.trim();
    car.modele = modele.value.trim();
    car.immatriculation = immatriculation.value.trim();
    car.categorie = categorie.value;
    car.prixJour = Number(prixJour.value);
    car.statut = statut.value;
    console.log(car);
    cancelModify();
    localStorage.setItem("cars", JSON.stringify(cars));
};

function deleteCar(id){
    if(!confirm("are you sure ?")){
        return;
    }
    cars = cars.filter((car) => car.id != id);
    localStorage.setItem("cars", JSON.stringify(cars));
    cancelModify();
};

function rechercheCars(){
    if(!recherche.value.trim()){
        return cars;
    }
    let newCars = cars.filter(car => car.marque.toLowerCase().startsWith(recherche.value.trim())  
                                || car.modele.toLowerCase().startsWith(recherche.value.trim())
                                || car.immatriculation.toLowerCase().startsWith(recherche.value.trim()));
    console.log(newCars)
    return newCars;
}

function filtreStatusCars(filtredCars){
    if(!filtreStatut.value){
        return filtredCars;
    }
    let newCars = filtredCars.filter(car => car.statut == filtreStatut.value);
    return newCars;
};

function filtreCategoryCars(filtredCars){
    if(!filtreCategorie.value){
        return filtredCars;
    }
    let newCars = filtredCars.filter(car => car.categorie == filtreCategorie.value);
    return newCars;
};

function sortCars(filtredCars){
    let sortedCars = [...filtredCars];
    if(!tri.value){
        return filtredCars;
    }
    if(tri.value == "croissant"){
        sortedCars.sort( (a,b) => a.prixJour - b.prixJour);
        console.log(sortedCars)
        return sortedCars;
    }
    if(tri.value == "decroissant"){
        sortedCars.sort( (a,b) => b.prixJour - a.prixJour);
        return sortedCars;
    }
}

function filtrage(){
    let filtredCars = rechercheCars();
    filtredCars = filtreStatusCars(filtredCars);
    filtredCars = filtreCategoryCars(filtredCars);
    filtredCars = sortCars(filtredCars);
    showCars(filtredCars);
}

recherche.addEventListener("input", ()=>{
   filtrage();
});

filtreStatut.addEventListener("change", ()=>{
    filtrage();
});

filtreCategorie.addEventListener("change", ()=>{
    filtrage();
});

tri.addEventListener("change", ()=>{
    filtrage();
});

boutonReset.addEventListener("click" ,() => {
    recherche.value = "";
    filtreStatut.value = "";
    filtreCategorie.value = "";
    tri.value = "";
    showCars(cars);
})