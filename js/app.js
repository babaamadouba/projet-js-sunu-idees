// ===============================
// SUNU-IDÉES
// Application SPA CRUD
// ===============================

let idees = JSON.parse(localStorage.getItem("sunuIdees")) || [];

const formulaireIdee = document.getElementById("formulaire-idee");
const champId = document.getElementById("identifiant-idee");
const champTitre = document.getElementById("titre");
const champCategorie = document.getElementById("categorie");
const champDescription = document.getElementById("description");

const boutonEnregistrer = document.getElementById("bouton-enregistrer");
const boutonAnnuler = document.getElementById("bouton-annuler");

const listeIdees = document.getElementById("liste-idees");

const champRecherche = document.getElementById("champ-recherche");
const filtreCategorie = document.getElementById("filtre-categorie");
const selectTri = document.getElementById("tri");

const compteurIdees = document.getElementById("nombre-idees");

// ===============================
// INITIALISATION
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    afficherIdees();
});

// ===============================
// SAUVEGARDE LOCALSTORAGE
// ===============================

function sauvegarderIdees() {
    localStorage.setItem(
        "sunuIdees",
        JSON.stringify(idees)
    );
}

// ===============================
// NOTIFICATION
// ===============================

function afficherNotification(message) {

    const toastElement = document.getElementById("notification");

    toastElement.querySelector(".toast-body").textContent = message;

    const toast = new bootstrap.Toast(toastElement);

    toast.show();
}

// ===============================
// COMPTEUR
// ===============================

function mettreAJourCompteur() {
    compteurIdees.textContent = idees.length;
}

// ===============================
// FORMATER DATE
// ===============================

function obtenirDateActuelle() {

    const date = new Date();

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}

// ===============================
// AJOUT / MODIFICATION
// ===============================

formulaireIdee.addEventListener("submit", (event) => {

    event.preventDefault();

    const titre = champTitre.value.trim();
    const categorie = champCategorie.value;
    const description = champDescription.value.trim();

    if (!titre || !categorie || !description) {
        return;
    }

    const idEdition = champId.value;

    // MODIFICATION

    if (idEdition) {

        const index = idees.findIndex(
            idee => idee.id == idEdition
        );

        if (index !== -1) {

            idees[index].titre = titre;
            idees[index].categorie = categorie;
            idees[index].description = description;

            afficherNotification(
                "Idée modifiée avec succès."
            );
        }

        reinitialiserFormulaire();

    } else {

        // AJOUT

        const nouvelleIdee = {

            id: Date.now(),

            titre,

            categorie,

            description,

            dateCreation: obtenirDateActuelle()

        };

        idees.unshift(nouvelleIdee);

        afficherNotification(
            "Nouvelle idée ajoutée."
        );
    }

    sauvegarderIdees();

    afficherIdees();

    formulaireIdee.reset();

});

// ===============================
// AFFICHAGE DES IDEES
// ===============================

function afficherIdees() {

    listeIdees.innerHTML = "";

    let resultat = [...idees];

    // RECHERCHE

    const recherche =
        champRecherche.value.toLowerCase();

    if (recherche) {

        resultat = resultat.filter(idee =>
            idee.titre.toLowerCase().includes(recherche) ||
            idee.description.toLowerCase().includes(recherche)
        );
    }

    // FILTRE

    const categorieChoisie =
        filtreCategorie.value;

    if (categorieChoisie !== "toutes") {

        resultat = resultat.filter(
            idee =>
                idee.categorie === categorieChoisie
        );

    }

    // TRI

    const modeTri = selectTri.value;

    switch (modeTri) {

        case "alphabetique":

            resultat.sort((a, b) =>
                a.titre.localeCompare(b.titre)
            );

            break;

        case "ancien":

            resultat.sort((a, b) =>
                a.id - b.id
            );

            break;

        default:

            resultat.sort((a, b) =>
                b.id - a.id
            );

    }

    // ETAT VIDE

    if (resultat.length === 0) {

        listeIdees.innerHTML = `
        
        <div class="col-12">

            <div class="vide">

                <i class="bi bi-lightbulb"></i>

                <h3>
                    Aucune idée trouvée
                </h3>

                <p>
                    Ajoutez une nouvelle idée.
                </p>

            </div>

        </div>

        `;

        mettreAJourCompteur();

        return;
    }

    resultat.forEach(idee => {

        listeIdees.innerHTML += creerCarteIdee(idee);

    });

    mettreAJourCompteur();
}

// ===============================
// CARTE IDEE
// ===============================

function creerCarteIdee(idee) {

    const nomsCategorie = {

        pedagogie: "Pédagogie",
        evenement: "Événement",
        campus: "Vie de campus",
        technique: "Technique"

    };

    return `

    <div class="col-lg-4 col-md-6 animation-apparition">

        <div class="carte-idee ${idee.categorie}">

            <div class="contenu-idee">

                <span
                class="badge-categorie badge-${idee.categorie}">
                    ${nomsCategorie[idee.categorie]}
                </span>

                <div class="titre-idee">
                    ${idee.titre}
                </div>

                <div class="description-idee">
                    ${idee.description}
                </div>

                <div class="date-idee mt-3">
                    <i class="bi bi-calendar-event"></i>
                    ${idee.dateCreation}
                </div>

                <div class="actions-idee">

                    <button
                    class="btn btn-warning"
                    onclick="modifierIdee(${idee.id})">

                        <i class="bi bi-pencil-square"></i>
                        Modifier

                    </button>

                    <button
                    class="btn btn-danger"
                    onclick="supprimerIdee(${idee.id})">

                        <i class="bi bi-trash"></i>
                        Supprimer

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;
}

// ===============================
// MODIFIER
// ===============================

function modifierIdee(id) {

    const idee = idees.find(
        element => element.id === id
    );

    if (!idee) return;

    champId.value = idee.id;

    champTitre.value = idee.titre;

    champCategorie.value =
        idee.categorie;

    champDescription.value =
        idee.description;

    boutonEnregistrer.innerHTML = `
        <i class="bi bi-check-circle"></i>
        Mettre à jour
    `;

    boutonEnregistrer.classList.remove(
        "btn-primary"
    );

    boutonEnregistrer.classList.add(
        "btn-success"
    );

    boutonAnnuler.classList.remove(
        "d-none"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ===============================
// ANNULER
// ===============================

boutonAnnuler.addEventListener(
    "click",
    reinitialiserFormulaire
);

function reinitialiserFormulaire() {

    formulaireIdee.reset();

    champId.value = "";

    boutonAnnuler.classList.add(
        "d-none"
    );

    boutonEnregistrer.innerHTML = `
        <i class="bi bi-save"></i>
        Ajouter l'idée
    `;

    boutonEnregistrer.classList.remove(
        "btn-success"
    );

    boutonEnregistrer.classList.add(
        "btn-primary"
    );

}

// ===============================
// SUPPRIMER
// ===============================

function supprimerIdee(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer cette idée ?"
    );

    if (!confirmation) return;

    idees = idees.filter(
        idee => idee.id !== id
    );

    sauvegarderIdees();

    afficherIdees();

    afficherNotification(
        "Idée supprimée."
    );

}

// ===============================
// RECHERCHE
// ===============================

champRecherche.addEventListener(
    "input",
    afficherIdees
);

// ===============================
// FILTRE
// ===============================

filtreCategorie.addEventListener(
    "change",
    afficherIdees
);

// ===============================
// TRI
// ===============================

selectTri.addEventListener(
    "change",
    afficherIdees
);

// ===============================
// EXPORT GLOBAL
// ===============================

window.modifierIdee = modifierIdee;
window.supprimerIdee = supprimerIdee;
