// Récupération des pièces depuis le fichier JSON

const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

for (let i = 0; i < pieces.length; i++){
    //recuperation de l'element du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches")

    const article = pieces[i]
    //creation des elements

    //je cree d'abord une balise article  dediee a une piece 
    const pieceElement = document.createElement("article")

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
    descriptionElement.innerText = article.description ?? ("Pas de description pour le moment") 

    //je cree le p pour la disponibilite et je donne sa config
    const disponibiliteElement = document.createElement("p")
    disponibiliteElement.innerText = `${article.disponibilite ? "En stock" : "Rupture de stock"}`

    //rattachement de la balise article a la section fiche
    sectionFiches.appendChild(pieceElement)

    //rattachement de chaque element a la balise article
    pieceElement.appendChild(imageElement)
    pieceElement.appendChild(nomElement)
    pieceElement.appendChild(prixElement)
    pieceElement.appendChild(categorieElement)
    pieceElement.appendChild(descriptionElement)
    pieceElement.appendChild(disponibiliteElement)
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

    console.log(piecesOrdonnees)
})

//je filtre les pieces a afficher selon une condition
const boutonFiltrer = document.querySelector(".btn-filtrer")

boutonFiltrer.addEventListener("click", function () {
   const piecesFiltrees = pieces.filter(function (piece) {
       /**filter peut fonctionner avec une fonction anonyme et 
        cette fonction anonyme doit retourner un booleen**/ 
       return piece.prix <= 35
   })
   console.log(piecesFiltrees)
 }) 


//je recupere le bouton pour filtrer par description et je l'eecoute
const boutonDescription = document.querySelector(".btn-description")

boutonDescription.addEventListener("click", () => {
    const piecesAdescription = pieces.filter(function (piece){
        //la fonction anonyme doit retourner un booleen
        return piece.description
    })

    console.log(piecesAdescription)
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
    console.log(piecesOrdonneesDec)
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
document.querySelector(".disponibles").appendChild(elementsDiqponibles)

