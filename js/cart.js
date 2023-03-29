// ---------------- REGEX DES INPUTS ---------------- //

// ---- Ciblage de tous les inputs ---- //
const allInputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);

// ---- Checking des valeurs rentrer dans l'input ---- //
allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "firstName":
        firstNameChecker(e.target.value);
        break;
      case "lastName":
        lastNameChecker(e.target.value);
        break;
      case "address":
        addressChecker(e.target.value);
        break;
      case "city":
        cityChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      default:
        console.log("err");
        break;
    }
  });
});

// ---- Déclaration et fonctionnement des REGEX ---- //

let nameCheckerRexp = /^[a-zA-Z éè]*$/;
let fromCheckerRexp = /^[a-zA-Z0-9 éè]*$/;
let emailCheckerRexp = /^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i;

const firstNameChecker = (value) => {
  const errorDisplay = document.getElementById("firstNameErrorMsg");
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay.textContent =
      "Veuillez entrer un prénom entre 2 et 20 lettres";
  } else if (!value.match(nameCheckerRexp)) {
    errorDisplay.textContent =
      "Veuillez ne pas inclure de chiffres ou caractères spéciaux ";
  } else {
    errorDisplay.textContent = "";
  }
};

const lastNameChecker = (value) => {
  const errorDisplay = document.getElementById("lastNameErrorMsg");
  if (value.length > 0 && (value.length < 2 || value.length > 20)) {
    errorDisplay.textContent =
      "Veuillez entrer un nom de famille entre 2 et 20 lettres";
  } else if (!value.match(nameCheckerRexp)) {
    errorDisplay.textContent =
      "Veuillez ne pas inclure de chiffres ou caractères spéciaux ";
  } else {
    errorDisplay.textContent = "";
  }
};

const addressChecker = (value) => {
  const errorDisplay = document.getElementById("addressErrorMsg");
  if (value.length > 0 && value.length < 3) {
    errorDisplay.textContent = "Veuillez saisir plus de cartères";
  } else if (!value.match(fromCheckerRexp)) {
    errorDisplay.textContent = "Veuillez ne pas inclure caractères spéciaux ";
  } else {
    errorDisplay.textContent = "";
  }
};

const cityChecker = (value) => {
  const errorDisplay = document.getElementById("cityErrorMsg");
  if (value.length > 0 && value.length < 3) {
    errorDisplay.textContent = "Veuillez saisir plus de cartères";
  } else if (!value.match(fromCheckerRexp)) {
    errorDisplay.textContent = "Veuillez ne pas inclure caractères spéciaux ";
  } else {
    errorDisplay.textContent = "";
  }
};

const emailChecker = (value) => {
  const errorDisplay = document.getElementById("emailErrorMsg");
  if (!value.match(emailCheckerRexp)) {
    errorDisplay.textContent = "Veuillez saisir une adresse mail correcte";
  } else {
    errorDisplay.textContent = "";
  }
};

// ---------------- RÉCUPÉRATION DU LOCAL STORAGE ---------------- //

// ---- On récupère le prix de l'article suivant son id dans la l'API ---- //
async function productId(prdId) {
  return fetch("https://back-end-kanap.onrender.com/api/products/")
    .then(function (res) {
      return res.json();
    })
    .then((response) => {
      for (let i = 0; i < response.length; i++) {
        if (response[i]._id == prdId) {
          return response[i].price;
        }
      }
    })
    .catch((error) => {
      console.error("Erreur serveur (fetch)", error);
      alert("Un problème est survenu au niveau du serveur");
      return;
    });
}

// ---- Converti la chaine de caractère objet JS ---- //
let cart = JSON.parse(localStorage.getItem("cartObject"));

// ---- Ciblage + création des sommes du total panier ----//
let articles = document.querySelector("#cart__items");
let totalPrice = document.querySelector("#totalPrice");
let totalQuantity = document.querySelector("#totalQuantity");
let totalArticlesPrice = 0;
let totalArticlesQuantity = 0;

// ---- Création de la boucle pour tout les articles présent  ---- //
async function cartDisplay() {
  for (let i = 0; i < cart.length; i++) {
    // ---- Prix par rapport à ID produit ---- //
    let price = await productId(cart[i].id);

    // ---- Implémentation de la quantité & l'obtention du prix total ---- //
    totalArticlesQuantity += parseInt(cart[i].quantity);
    totalArticlesPrice += parseInt(cart[i].quantity * price);

    // ---- Injection des différents produits dans le HTML / Prix / Quantité ---- //
    let article = `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                    <img src="${cart[i].img}" alt="${cart[i].altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${cart[i].name}</h2>
                      <p>${cart[i].color}</p>
                      <p>${price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input  data-id="${cart[i].id}" data-color="${cart[i].color}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p  data-id="${cart[i].id}" data-color="${cart[i].color}" class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>`;

    articles.innerHTML += article;

    totalPrice.innerHTML = totalArticlesPrice;
    totalQuantity.innerHTML = totalArticlesQuantity;

    deleteProduct();
    updateQuantity();
  }
}
cartDisplay();

// ---------------- SUPPRESSION DE L'ARTICLE ---------------- //
function deleteProduct() {
  let cartItem = JSON.parse(localStorage.getItem("cartObject"));

  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
      cartItem = cartItem.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );
      deleteConfirm = window.confirm(
        "Etes vous sûr de vouloir supprimer cet article ?"
      );
      if (deleteConfirm) {
        localStorage.setItem("cartObject", JSON.stringify(cartItem));
        alert("Article supprimé avec succès");
      } else {
        return;
      }

      const card = deleteButton.closest(".cart__item");
      card.remove();
      updateBasket();

      const deleteKanap = JSON.parse(localStorage.getItem("cartObject"));
      if (deleteKanap.length === 0) {
        localStorage.removeItem("cartObject");
        alert("Panier vide, retour à l'accueil.");
        window.location.href = "index.html";
      }
    });
  });
}

// ---------------- MISE À JOUR QUANTITÉ ---------------- //
function updateQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cartItems = localStorage.getItem("cartObject");
      let items = JSON.parse(cartItems);

      items = items.map((item) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });

      if (inputValue > 100 || inputValue < 1) {
        alert("La quantité doit etre comprise entre 1 et 100");
        return;
      }
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cartObject", itemsStr);
      updateBasket();
    });
  });
}

// ---------------- MISE À JOUR PANIER ---------------- //
async function updateBasket() {
  let cartItem = JSON.parse(localStorage.getItem("cartObject"));
  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cartItem.length; i++) {
    let price = await productId(cart[i].id);
    totalQuantity += parseInt(cartItem[i].quantity);
    totalPrice += parseInt(price * cartItem[i].quantity);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;
}

// ---------------- SI PANIER VIDE ---------------- //

// ---- Fonction de redirection vers l'accueil ---- //

function redirectionIndex() {
  document.location.href = "./index.html";
}

// ---- Condition si oui ou non on reste sur la page ---- //
function store() {
  let store = localStorage.length;
  if (store < 1) {
    alert("Merci de bien vouloir selectionner l'un de nos produits");
    redirectionIndex();
  } else {
    console.log("Client approuvé");
  }
}
store();

// ---------------- ENVOI DES DONNÉES ---------------- //

const orderButton = document.getElementById("order");
orderButton.addEventListener("click", (e) => {
  e.preventDefault();

  // ---- Contrôle JS ---- //
  let inputs = document.querySelectorAll(".cart__order__form inputs");
  for (const input of inputs) {
    if (input.value !== "") {
      alert("Veuillez saisir tout les champs");
    }
  }
  // ---- Vérif formulaire ---- //

  let form = document.querySelector(".cart__order__form");

  if (
    document.getElementById("firstName").value == "" ||
    document.getElementById("lastName").value == "" ||
    document.getElementById("address").value == "" ||
    document.getElementById("city").value == "" ||
    document.getElementById("email").value == ""
  ) {
    alert("Veuillez saisir tous les champs requis");
    return;
  }

  let validForm =
    nameCheckerRexp.test(form.firstName.value) &&
    nameCheckerRexp.test(form.lastName.value) &&
    fromCheckerRexp.test(form.address.value) &&
    fromCheckerRexp.test(form.city.value) &&
    emailCheckerRexp.test(form.email.value);

  // ---- Récupération des valeurs des inputs ---- //

  let currentLocal = localStorage.getItem("cartObject");

  const formulaireValues = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  if (!validForm) {
    alert("Veuillez remplir les champs manquants");
    return;
  } else if (currentLocal.length == 0) {
    alert("Votre Panier est vide");
    redirectionIndex();
  } else {
    alert("Vos informations ont bien été enregistrées");
  }

  // ---- ENVOI DES DONNÉES À API ---- //

  let orderLocalStorage = JSON.parse(localStorage.getItem("cartObject"));
  let idProduct = [];
  for (let i = 0; i < orderLocalStorage.length; i++) {
    idProduct.push(orderLocalStorage[i].id);
  }

  const submit = {
    products: idProduct,
    contact: formulaireValues,
  };

  fetch("https://back-end-kanap.onrender.com/api/products/order", {
    method: "POST",
    body: JSON.stringify(submit),
    headers: {
      accept: "Application/JSON",
      "Content-type": "Application/JSON",
    },
  })
    .then(async (response) => response.json())

    .then((data) => {
      window.location.href = `confirmation.html?id=${data.orderId}`;
    })
    .catch((error) => {
      console.error("Erreur serveur (fetch)", error);
      alert("Un problème est survenu au niveau du serveur");
      return;
    });
});
