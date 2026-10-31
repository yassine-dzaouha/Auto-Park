let cars = JSON.parse(localStorage.getItem("cars")) || [];

const totalVoitures = document.getElementById("total-voitures");
const voituresDisponibles = document.getElementById("voitures-disponibles");
const voituresLouees = document.getElementById("voitures-louees");
const voituresMaintenance = document.getElementById("voitures-maintenance");

const carsList = document.getElementById("liste-voitures");

function displayStatistics() {

    let disponibles = cars.filter(car => car.statut === "Disponible");
    let louees = cars.filter(car => car.statut === "Louée");
    let maintenance = cars.filter(car => car.statut === "En maintenance");

    totalVoitures.textContent = cars.length;
    voituresDisponibles.textContent = disponibles.length;
    voituresLouees.textContent = louees.length;
    voituresMaintenance.textContent = maintenance.length;
}

function creatElem(tag, classname, content) {
    const element = document.createElement(tag);
    element.className = classname;
    element.textContent = content;
    return element;
}

function statusSwitch(status) {

    let className;

    switch(status) {

        case "Disponible":
            className = "badge badge-disponible";
            break;

        case "Louée":
            className = "badge badge-louee";
            break;

        case "En maintenance":
            className = "badge badge-maintenance";
            break;

    }

    return className;
}

function showCars() {

    carsList.textContent = "";

    let count = 0;
    
    while(count < 3){

        let index = cars.length - count - 1;
        count ++;
        let tr = creatElem("tr", "", "");

        let marqueTd = creatElem("td", "", "");
        let strong = creatElem("strong", "", cars[index].marque);
        marqueTd.append(strong);

        let modeleTd = creatElem("td", "", cars[index].modele);

        let immatriculationTd = creatElem("td", "", "");
        let immatriculationSpan = creatElem("span" ,"registration" ,cars[index].immatriculation);
        immatriculationTd.append(immatriculationSpan);

        let categorieTd = creatElem("td", "", cars[index].categorie);

        let statusTd = creatElem("td", "", "");
        let statusSpan = creatElem("span", statusSwitch(cars[index].statut), cars[index].statut);
        statusTd.append(statusSpan);

        let priceTd = creatElem("td", "price", cars[index].prixJour + "");
        let priceSpan = creatElem("span", "", "DH / jour");
        priceTd.append(priceSpan);

        let actionsTd = creatElem("td", "", "");

        let link = creatElem("a", "button button-edit", "Voir");
        link.href = "voitures.html";

        actionsTd.append(link);

        tr.append(
            marqueTd,
            modeleTd,
            immatriculationTd,
            categorieTd,
            statusTd,
            priceTd,
            actionsTd
        );
        carsList.append(tr);
    };
    
}

displayStatistics();
showCars();