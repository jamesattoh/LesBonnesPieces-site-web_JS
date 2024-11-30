//rendre disponible, dans ce fichier la fonction permettant de lancer la requete
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js";

//Recuperation eventuelle des pieces depuis le localStorage
let pieces = window.localStorage.getItem("pieces")

if(pieces === null){
    //Recuperation des pieces depuis l'API
    const reponse = await fetch("http://localhost:8081/pieces")
    pieces = await reponse.json()
    //transformation des pieces en json
    const valeurPieces = JSON.stringify(pieces)
    //pour finir, stocker les infos dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces)
}else{
    pieces = JSON.parse(pieces) //JSON.parse convertit la chaine JSON en objet Javascript
}

/**
 * Une autre facon de recuperer les pieces deouis le fichier JSON
 * const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json())
 */

//j'appelle la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis()


//comme son nom l'indique cette fonction s'occupe de l'affichage des pieces sur notre page web
function genererPieces(pieces){
    for (let i = 0; i < pieces.length; i++){
        //recuperation de l'element du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches")
    
        const article = pieces[i]
        //creation des elements
    
        //je cree d'abord une balise article  dediee a une piece 
        const pieceElement = document.createElement("article")
        /** fonctionnement de l'interface dataset
         * dataset : une propriété des éléments DOM qui permet de lire et écrire les attributs de données personnalisés (data-*) directement en JavaScript.
         * id : En ajoutant .id après dataset, on cree ou modifie un attribut de données appelé data-id.
        */
        pieceElement.dataset.id = pieces[i].id

        //je cree l'img
        const imageElement = document.createElement("img")
        //j'accede a l'element img pour configurer la source de l'image
        imageElement.src = article.image
    
        //je cree le h2 pour le nom et je donne sa config
        const nomElement = document.createElement("h2")
        nomElement.innerText = article.nom
        
        //je cree le p pour la description et je donne sa config
        const prixElement = document.createElement("p")
        prixElement.innerText = `Prix : ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})` //j'utilise l'expression ternaire pour catégoriser le prix de l'article cher, moins cher 
    
        //je cree le p pour la categorie et je donne sa config
        const categorieElement = document.createElement("p")
        categorieElement.innerText = article.categorie ?? ("aucune catégorie") //operateur nullish ?? : expression à tester ?? valeur de substitution
        
        //je cree le p pour la description et je donne sa config
        const descriptionElement = document.createElement("p")
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment"
    
        //je cree le p pour la disponibilite et je donne sa config
        const disponibiliteElement = document.createElement("p")
        disponibiliteElement.innerText = `${article.disponibilite ? "En stock" : "Rupture de stock"}`
    
        //creation du bouton afficher les avis
        const avisBouton = document.createElement("button")
        avisBouton.dataset.id = article.id //assigne la valeur de article.id à l'attribut data-id du bouton avisBouton; cela permettra entre autres de recuperer l'lement parent auquel ajouter les avis plus tard
        avisBouton.textContent = "Afficher les avis."

        //rattachement de la balise article a la section fiche
        sectionFiches.appendChild(pieceElement)
    
        //rattachement de chaque element a la balise article
        pieceElement.appendChild(imageElement)
        pieceElement.appendChild(nomElement)
        pieceElement.appendChild(prixElement)
        pieceElement.appendChild(categorieElement)
        pieceElement.appendChild(descriptionElement)
        pieceElement.appendChild(disponibiliteElement)
        pieceElement.appendChild(avisBouton)
    }
    // Ajout de la fonction ajoutListenersAvis a la suite de la generation de toutes les fiches produits ou articles
    ajoutListenersAvis();
}

//affichage par defaut
genererPieces(pieces)

//pour chaque piece on recuperera l'eventuelle valeur stockee dans le localStorage
for(let i = 0; i < pieces.length; i++){
    const id = pieces[i].id //il faut recuperer l'id de la piece
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`) //cet element sort tout frais du localStorage, donc sous format JSON a convertir
    const avis = JSON.parse(avisJSON)

    //si la valeu de avis est presente, recuperer l'element parent grace a data-id qu'on a ajoute precedemment et afficher les avis
    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}"]`)
        afficherAvis(pieceElement,avis)
    }
}


/**
 * je procede a la gestion des boutons
 */

//je recupere le bouton trier
const boutonTrier = document.querySelector(".btn-trier")
//j'ecoute l'evenement
boutonTrier.addEventListener("click", () => {
    //je cree d'abord une copie du tableau
    const piecesOrdonnees = Array.from(pieces)
    /**je trie : a par exemple = 60, b = 40; b-a sera egale à -10 < 0; 
     * alors a doit passer devant b (ou a sera ranger avant b) puisque c'est au plus grand d'être devant
     * si on veut l'ordre croissant 
     * 
     * fonctionnement de sort
     * on fait la difference B - A
     * on veut l'ordre croissant
     * si le nombre est positif, alors B sera rangé avant A ; 
     * si le nombre est négatif, alors A sera rangé avant B ;
     * si le nombre est zéro (0), alors l’ordre sera inchangé.
     **/
    piecesOrdonnees.sort(function(a,b){
        return a.prix - b.prix
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesOrdonnees)
})

//je filtre les pieces a afficher selon une condition
const boutonFiltrer = document.querySelector(".btn-filtrer")
boutonFiltrer.addEventListener("click", function () {
   const piecesFiltrees = pieces.filter(function (piece) {
       /**filter peut fonctionner avec une fonction anonyme et 
        cette fonction anonyme doit retourner un booleen**/ 
       return piece.prix <= 35
   })
   document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesFiltrees)

}) 


//je recupere le bouton pour filtrer par description et je l'eecoute
const boutonDescription = document.querySelector(".btn-description")
boutonDescription.addEventListener("click", () => {
    const piecesAdescription = pieces.filter(function (piece){
        //la fonction anonyme doit retourner un booleen
        return piece.description
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesAdescription)
})


//je recupere le bouton pour trier par prix decroissant
const boutonPrixDec = document.querySelector(".btn-decroissant")
//j'ecoute le bouton
boutonPrixDec.addEventListener("click", () => {
    //je cree une copie du tableau 
    const piecesOrdonneesDec = Array.from(pieces)
    //je trie le tableau
    piecesOrdonneesDec.sort(function(a,b){
        return b.prix - a.prix
    })
    document.querySelector(".fiches").innerHTML = ""
    genererPieces(piecesOrdonneesDec)
})

//je recupere les noms des pieces avec map et la syntaxe "lambda" des fonctions
const noms = pieces.map(piece => piece.nom); //piece => piece.nom signifie retourner la valeur de la propriété nom de l'objet piece
/**je supprimz ceux qui ne sont pas abordables
 * lorsqu'on veut supprimer des elements d'une liste 
 * il est conseille de commencer par le dernier element
 **/
for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].prix > 35){
       noms.splice(i,1)//splice permet de supprimer des elements indesirables : (l'indice à partir duquel supprimer, nbre à supprimer)
   }
}


const pElement = document.createElement("p")
pElement.innerText = "Pièces abordables"
//je cree une liste pour accueillir le reste des elements
const elementsAbordables = document.createElement("ul")
//ajouter chaque nom a la liste
for (let i = 0; i < noms.length; i++) { //puisque c'est dans noms que j'ai supprime des elements, sa length aurait changé
    const nomElement = document.createElement("li")
    nomElement.innerText = noms[i]
    elementsAbordables.appendChild(nomElement)
}
//ajouter la liste a la page html
document.querySelector(".abordables")
.appendChild(pElement)
.appendChild(elementsAbordables)


//je recupere les listes pour les noms et les prix disponibles
const nomsDisponibles = pieces.map(piece => piece.nom)
const prixDisponibles = pieces.map(piece => piece.prix)
//je suppirme le nom et les prix des pieces non disponibles avec splice appliquee aux listes creees ou recuperees
for(let i = pieces.length - 1; i >= 0; i--){
    if(!pieces[i].disponibilite){
        nomsDisponibles.splice(i,1)
        prixDisponibles.splice(i,1)
    }
}

//creer une liste pour accueillir les elements
const elementsDiqponibles = document.createElement("ul")

//ajouter chaque nom a la liste
for(let i = 0; i<nomsDisponibles.length; i++){
    const nomElement  = document.createElement('li')
    //je formate l'affichage cette fois avec les backticks
    nomElement.innerText = `${nomsDisponibles[i]} : ${prixDisponibles[i]} €`
    elementsDiqponibles.appendChild(nomElement)
}

//ajouter la liste a la page html
const pElementsDisponibles = document.createElement("p")
pElementsDisponibles.innerText = "Pièces disponibles"
document.querySelector(".disponibles").appendChild(pElementsDisponibles).appendChild(elementsDiqponibles)

//cette suite filtre les pieces grace a un input de type range min 0, max 60, step 5
const prixMaximum = document.querySelector("#prix-max")
prixMaximum.addEventListener("input", () => { //c'est la valeur de l'entree quon considere, donc on ecoutera "input"
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= prixMaximum.value
    })
    document.querySelector(".fiches").innerHTML = ""
    //on gere l'affichage
    genererPieces(piecesFiltrees)
})

/**
 * le listener qui permet de mettre a jour les pieces de la page web
 * lorsqu'on aurait fait des modifications sur les fichiers json en ligne, il faudra que le localStorage s'en enquiert
 * il faut donc supprimer son contenu et le mettre à jour en reprenant les valeurs contenu sur le service en ligne
**/
const boutonMettreAJour = document.querySelector(".btn-maj")
boutonMettreAJour.addEventListener("click", function() {
    window.localStorage.removeItem("pieces")
    console.log("toto")
})

await afficherGraphiqueAvis()