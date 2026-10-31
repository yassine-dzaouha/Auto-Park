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

