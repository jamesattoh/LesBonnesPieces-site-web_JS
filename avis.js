/* 
    export permettra de rendre disponible cette fonction en dehors du fichier
*/

export function ajoutListenersAvis() {

    //recuperer tous les button créés dans la liste piecesElements
    const piecesElements = document.querySelectorAll(".fiches article button");

    //parcourir chaque button et lui ajouter un addEventListener (click)
    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
           /* recuperation de la valeur de l'attibut data-id grace a la propriete dataset */
           const id = event.target.dataset.id;
           //cette valeur recuperee du id m'aide a lancer une requete vers l'api
           fetch(`http://localhost:8081/pieces/${id}/avis`);
      });
    }
}