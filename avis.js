/* 
    export permettra de rendre disponible cette fonction en dehors du fichier
*/

export function ajoutListenersAvis() {

    //recuperer tous les button créés dans la liste piecesElements
    const piecesElements = document.querySelectorAll(".fiches article button");

    //parcourir chaque button et lui ajouter un addEventListener (click)
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
        /** recuperation de la valeur de l'attibut data-id grace a la propriete dataset 
         *  cette valeur recuperee du id m'aide a lancer une requete vers l'api
        de base, fetch est une operation asynchrone, avec le 'await', cela indique d'attendre 
        la fin de cette operation(i.e. recevoir la reponse de l'api) avant de poursuivre sur le rste du code
        aussi faut-il placer 'async' devant la fonction dans laquelle 'await' est utilise
        *   event.target cible ou precisse l'element qui a declenche l'evenenment
         */
        const id = event.target.dataset.id;
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`)//ou await fetch(`http://localhost:8081/pieces/`+ id `/avis`);
        //console.log("Le script continue sans attendre la réponse");

        /**stocker la reponse du serveur avant de la tester: fait avec const reponse = 
        * ensuite désérialiser les donnees recues avec la fonction json()
        * mettre un await car cette operation est aussi asynchrone
        **/
        const avis = await reponse.json()

        /** objectif: stocker les avis utilisateurs dans le localStorage
         * cette ligne appelle la fonction setItem, la clé est calculée avec le id de l'avis, et la valeur est la conversion de l'avis en JSON
         * on sauvegarde l'avis donc dans le localStorage
        */
        window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))
        
        //je recupere l'element parent de l'element cible surlequel je suis preentement : grace a la propriete parentElement
        const pieceElement = event.target.parentElement

        //j'affiche les avis propre au id correspondant grace a la fonction afficherAvis
        afficherAvis(pieceElement,avis)

      });
    }
}

/** refactorisation du code de generation du dom des avis
 * 
 *  pieceElement : c'est l'element du dom auquel rattacher l'element p
 *  avis : c'est la liste des avis a ajouter
 */
export function afficherAvis(pieceElement, avis){
    const avisElement = document.createElement("p")
    for(let i = 0; i < avis.length; i++){
        avisElement.innerHTML += `<br>${avis[i].utilisateur} :<br> ${avis[i].commentaire} <br> Nombre d'étoiles : ${avis[i].nbEtoiles ??("Aucune") }<br>`
    }
    //je rajoute le p au parent pré-recupere
    pieceElement.appendChild(avisElement)
}

//la soumission d'un formulaire est validee lorsque l'on appuie sur enter dans un champ, ou sur le bouton d'envoi
export function ajoutListenerEnvoyerAvis(){
    const formulaireAvis = document.querySelector(".formulaire-avis")
    formulaireAvis.addEventListener("submit", function(event){
    // Désactivation du comportement par défaut du navigateur pour la gestion du formulaire
    event.preventDefault();

    /** Création de l’objet du nouvel avis ou construction de la charge utile
     * pour recuperer les elements a envoyer, j'utilise querySelector pour cibler les donnees du champ du formulaire
     * j'utilise event.target comme point de dpart pour querySelector au lieu de de document
     * enfin avec value je recupere la valeur saisie par l'utilisateur sur la page web
     **/
    const avis = {
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: parseInt(event.target.querySelector("[name=nb-etoiles]").value),
    };
    
    // Création de la charge utile au format JSON: la conversion de la charge utile est faite grace à stringify
    const chargeUtile = JSON.stringify(avis);

    // il ne reste plus qu'à appeler la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    })
}