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
        /** cette valeur recuperee du id m'aide a lancer une requete vers l'api
         de base, fetch est une operation asynchrone, avec le 'await', cela indique d'attendre 
        la fin de cette operation(i.e. recevoir la reponse de l'api) avant de poursuivre sur le rste du code
        aussi faut-il placer 'async' devant la fonction dans laquelle 'await' est utilise
        **/
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`)//ou await fetch(`http://localhost:8081/pieces/`+ id `/avis`);
        //console.log("Le script continue sans attendre la réponse");

        /**stocker la reponse du serveur avant de la tester: fait avec const reponse = 
        * ensuite désérialiser les donnees recues avec la fonction json()
        * mettre un await car cette operation est aussi asynchrone
        **/
        const avis = await reponse.json()
        //je recupere l'element parent de l'element cible surlequel je suis preentement
        const pieceElement = event.target.parentElement
        const avisElement = document.createElement("p")

        for(let i = 0; i < avis.length; i++){
            avisElement.innerHTML += `<br>${avis[i].utilisateur} :<br> ${avis[i].commentaire} <br>`
        }

        //je rajoute le p au parent pré-recupere
        pieceElement.appendChild(avisElement)
      });
    }
}