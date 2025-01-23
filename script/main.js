// Classe représentant un produit
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// Classe représentant un élément du panier
class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// Classe représentant le panier
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(new ShoppingCartItem(product, quantity));
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }
}

// === Intégration avec le DOM ===

// Instancier le panier
const cart = new ShoppingCart();

// Récupérer les produits à partir de l'HTML
const productCards = document.querySelectorAll(".card");

productCards.forEach((card, index) => {
  const name = card.querySelector(".card-title").textContent;
  const price = parseInt(card.querySelector(".prix-unitaire").textContent);
  const product = new Product(index + 1, name, price);

  const quantityElement = card.querySelector(".quantité");

  // Bouton +
  card.querySelector(".plus").addEventListener("click", () => {
    cart.addItem(product, 1);
    quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
    updateTotalPrice();
  });

  // Bouton -
  card.querySelector(".minus").addEventListener("click", () => {
    if (parseInt(quantityElement.textContent) > 0) {
      cart.addItem(product, -1); // Réduit la quantité
      quantityElement.textContent = parseInt(quantityElement.textContent) - 1;
      updateTotalPrice();
    }
  });

  // Bouton supprimer
  card.querySelector(".remove").addEventListener("click", () => {
    cart.removeItem(product.id); // Supprime du panier
    card.remove(); // Supprime l'élément HTML du produit
    updateTotalPrice();
  });

  // Bouton like
  card.querySelector(".favorite").addEventListener("click", () => {
    card.querySelector(".favorite").classList.toggle("active");
  });
});

// Met à jour le prix total dans le DOM
function updateTotalPrice() {
  const totalPriceElement = document.querySelector("#prix-total");
  totalPriceElement.textContent = `${cart.getTotalPrice()} XOF`;
}