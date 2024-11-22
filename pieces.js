/**
 * // Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

//creation des nouveaux elements
const article = pieces[0]
const imageElement = document.createElement("img")
imageElement.src = article.image
const nomElement = document.createElement("h2")
nomElement.innerText = article.nom
const prixElement = document.createElement("p")
prixElement.innerText = `Prix : ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})` //j'utilise l'expression ternaire pour catégoriser le prix de l'article cher, moins cher 
const categorieElement = document.createElement("p")
categorieElement.innerText = article.categorie ?? ("aucune catégorie") //operateur nullish ?? : expression à tester ?? valeur de substitution

const descriptionElement = document.createElement("p")
descriptionElement.innerText = article.description ?? ("Pas de description pour le moment") 
const disponibiliteElement = document.createElement("p")
disponibiliteElement.innerText = `${article.disponibilite ? "En stock" : "Rupture de stock"}`



//rattechement de ces elements a un parent pour les faire apparaitre
const sectionFiches = document.querySelector(".fiches")
sectionFiches.appendChild(imageElement)
sectionFiches.appendChild(nomElement)
sectionFiches.appendChild(prixElement)
sectionFiches.appendChild(categorieElement)

sectionFiches.appendChild(descriptionElement)
sectionFiches.appendChild(disponibiliteElement)

**/

const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

for (let i = 0; i < pieces.length; i++){
    //recuperation de l'element du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches")

    const article = pieces[i]
    //creation des elements

    //je cree d'abord une balise dediee a une piece 
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