import {voituresInitiales} from "./data.js";

let cars = null;

cars = voituresInitiales;

let carsId = 7;

let modifyId = 0;

if(!localStorage.length){
    localStorage.setItem("cars", JSON.stringify(cars));
}

console.log("initial: ",voituresInitiales);
console.log("new cars: ",cars)

const form = document.getElementById("formulaire-voiture");
const marque = document.getElementById("marque");
const modele = document.getElementById("modele");
const immatriculation = document.getElementById("immatriculation");
const categorie = document.getElementById("categorie");
const prixJour = document.getElementById("prix-jour");
const statut = document.getElementById("statut");
const carsList = document.getElementById("liste-voitures");
const btn = document.getElementById("bouton-enregistrer");

showCars()

btn.addEventListener("click", (e)=>{
    e.preventDefault();
    addCar();
    showCars()
})

function formValidation() {
    let valide = true;
    let errors = document.querySelectorAll(".field-error");
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
    const immatError = document.getElementById("erreur-immatriculation")

    if (immatriculation.value.trim() === "") {
        immatError.textContent = "Le matricule est obligatoire.";
        valide = false;
    } else if (!immatPatern.test(immatriculation.value.trim())) {
        immatError.textContent = "Format invalide. Exemple : AUTO-007";
        valide = false;
    } else {
        const car = cars.find(
            car => car.immatriculation === immatriculation.value.trim()
        );

        if (car) {
            immatError.textContent = "Le matricule existe déjà.";
            valide = false;
        }
    }

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
    
    if(!formValidation()){
        // alert("impossible")
        return;
    }
    
    const car = {};
    car.id = carsId++;
    car.marque = marque.value;
    car.modele = modele.value;
    car.immatriculation = immatriculation.value;
    car.categorie = categorie.value;
    car.prixJour = Number(prixJour.value);
    car.statut = statut.value;
    cars.push(car);

    localStorage.setItem("cars", JSON.stringify(cars))

    form.reset();
}

function showCars(){
    cars = JSON.parse(localStorage.getItem("cars"));
    console.log(cars)
    carsList.textContent = "";
    cars.forEach((car)=>{
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
        
        let deleteBtn = creatElem("button", "button button-delete", "Supprimer");
        deleteBtn.setAttribute("type","button");
        deleteBtn.setAttribute("data-action", "supprimer");
        deleteBtn.setAttribute("data-id", `${car.id}`);
        deleteBtn.setAttribute("aria-label", `supprimer ${car.marque} ${car.modele}, ${car.immatriculation}`);
        deleteBtn.addEventListener("click", () => {
            deleteCar(car.id);
            showCars();
        })
        
        actionsDiv.append(editBtn, deleteBtn);
        actionsTd.append(actionsDiv);
        tr.append(marqueTd, modeleTd, immatriculationTd, categorieTd, priceTd, statusTd, actionsTd);
        carsList.append(tr);
    });

}

function creatElem(tag, classname, content){
    const element = document.createElement(tag);
    element.className = classname;
    element.textContent = content;
    return element;
}

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
    }
    return className;
}

// function modifyForm(car){
//     marque.value = car.marque;
//     modele.value = car.modele;
//     immatriculation.value = car.immatriculation;
//     categorie.value = car.categorie;
//     prixJour.value = car.prixJour;
//     statut.value = car.statut;
// }

function deleteCar(id){
    cars = cars.filter((car) => car.id != id);
    localStorage.setItem("cars", JSON.stringify(cars));
}