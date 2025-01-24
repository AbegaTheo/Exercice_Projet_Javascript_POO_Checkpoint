// Classe représentant un produit
class Produit {
  constructor(id, nom, prix) {
    this.id = id; // Identifiant unique du produit
    this.nom = nom; // Nom du produit
    this.prix = prix; // Prix unitaire du produit
  }
}

// Classe représentant un élément du panier
class ElementPanier {
  constructor(produit, quantite) {
    this.produit = produit; // Produit associé à cet élément
    this.quantite = quantite; // Quantité de ce produit dans le panier
  }

  // Calculer le prix total de cet élément (prix unitaire * quantité)
  obtenirPrixTotal() {
    return this.produit.prix * this.quantite;
  }
}

// Classe représentant le panier d'achat
class Panier {
  constructor() {
    this.elements = []; // Tableau pour stocker les éléments du panier
  }

  // Ajouter un produit au panier (ou augmenter sa quantité)
  ajouterElement(produit, quantite = 1) {
    const elementExistant = this.elements.find(element => element.produit.id === produit.id);
    if (elementExistant) {
      // Si le produit existe déjà, augmenter la quantité
      elementExistant.quantite += quantite;
    } else {
      // Sinon, ajouter un nouvel élément au panier
      this.elements.push(new ElementPanier(produit, quantite));
    }
  }

  // Supprimer un produit du panier par son ID
  supprimerElement(idProduit) {
    this.elements = this.elements.filter(element => element.produit.id !== idProduit);
  }

  // Calculer le prix total du panier
  obtenirPrixTotal() {
    return this.elements.reduce((total, element) => total + element.obtenirPrixTotal(), 0);
  }
}

// === Intégration avec le DOM ===

// Instancier le panier
const panier = new Panier();

// Récupérer les produits à partir de l'HTML
const cartesProduits = document.querySelectorAll(".card");

cartesProduits.forEach((carte, index) => {
  // Extraire les informations du produit depuis l'HTML
  const nom = carte.querySelector(".card-title").textContent; // Récupère le nom du produit
  const prix = parseInt(carte.querySelector(".prix-unitaire").textContent); // Récupère le prix unitaire
  const produit = new Produit(index + 1, nom, prix); // Créer une instance de produit avec un ID unique

  const elementQuantite = carte.querySelector(".quantité"); // Élément affichant la quantité

  // Bouton + : Ajouter une unité de ce produit
  carte.querySelector(".plus").addEventListener("click", () => {
    panier.ajouterElement(produit, 1); // Ajouter au panier
    elementQuantite.textContent = parseInt(elementQuantite.textContent) + 1; // Mettre à jour l'affichage de la quantité
    mettreAJourPrixTotal(); // Mettre à jour le prix total affiché
  });

  // Bouton - : Réduire la quantité de ce produit
  carte.querySelector(".minus").addEventListener("click", () => {
    if (parseInt(elementQuantite.textContent) > 0) {
      panier.ajouterElement(produit, -1); // Réduire la quantité dans le panier
      elementQuantite.textContent = parseInt(elementQuantite.textContent) - 1; // Mettre à jour l'affichage
      mettreAJourPrixTotal(); // Mettre à jour le prix total affiché
    }
  });

  // Bouton supprimer : Retirer complètement ce produit
  carte.querySelector(".remove").addEventListener("click", () => {
    panier.supprimerElement(produit.id); // Supprimer du panier
    carte.remove(); // Supprimer l'élément HTML correspondant au produit
    mettreAJourPrixTotal(); // Mettre à jour le prix total affiché
  });

  // Bouton like : Marquer ce produit comme favori
  carte.querySelector(".favorite").addEventListener("click", () => {
    carte.querySelector(".favorite").classList.toggle("active"); // Basculer la classe "active" pour indiquer un favori
  });
});

// Fonction pour mettre à jour le prix total dans le DOM
function mettreAJourPrixTotal() {
  const elementPrixTotal = document.querySelector("#prix-total"); // Élément affichant le prix total
  elementPrixTotal.textContent = `${panier.obtenirPrixTotal()} XOF`; // Mettre à jour avec le prix total calculé
}
