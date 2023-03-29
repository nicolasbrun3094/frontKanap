// ---------------- FONCTION DE REDIRECTION VERS LES PAGES CIBLES ---------------- //

function redirectionIndex() {
  document.location.href = "./index.html";
}
function redirectionBasket() {
  document.location.href = "./cart.html";
}

const img = document.querySelector(".item__img");
const price = document.getElementById("price");
const desc = document.getElementById("description");
const color = document.getElementById("colors");
const button = document.getElementById("addToCart");

let sofaData = [];
let params = new URL(document.location).searchParams;
let id = params.get("productid");

// ---------------- IMPORTATION DE L'API ----------------//

const fetchSofa = async () => {
  await fetch(`https://back-end-kanap.onrender.com/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => (sofaData = data));
};

// ---------------- AFFICHAGE DU PRODUIT ---------------- //

const sofaDisplay = async () => {
  await fetchSofa();

  price.innerHTML = `<span>${sofaData.price}</span>`;
  img.innerHTML = `<img src=${sofaData.imageUrl} alt="photo de ${sofaData.name}"></img>`;
  desc.innerHTML = `
                    <p>${sofaData.description}</p>
                    `;

  let selectColor = `<option value="">--SVP, choissez une couleur --</option>`;
  sofaData.colors.forEach((c) => {
    selectColor += color.innerHTML += `<option value="${c}">${c}</option>`;
  });

  // ---- Verification qu'une couleur à bien était séléctioner ---- //
  function checkColor() {
    let color = document.querySelector("#colors").value;

    if (color === "" || color === null) {
      alert("Veuillez choisir une couleur");
      return false;
    }
    return true;
  }

  // ---- Verification que la quantité ne soit pas inférieur à 1 ---- //

  function checkQuantity() {
    let value = document.querySelector("#quantity").value;

    if (value < 1 || value > 100) {
      alert("Veuillez sélectionner un minimum de 1 article, au maximum 100 ");
      document.querySelector("#quantity").value = 1;
      return false;
    }
    return true;
  }

  // ---- Ajout de l'événement au click ---- //
  button.addEventListener("click", (e) => {
    if (checkColor() && checkQuantity()) {
      let modal = document.querySelector("#modal");
      let btn_open = document.querySelector(".btn_show");
      let btn_close = document.querySelector("#btn_close");
      let btn_basket = document.querySelector("#btn_close2");

      // ---- Ouverture / Fermeture de la "Pop-Up" de redirection ---- //
      modal.showModal(); // showModal permet d'appliquer du style à cette dernière

      setTimeout(function () {
        modal.close();
      }, 30000);

      btn_close.addEventListener("click", () => {
        modal.close();
        redirectionIndex();
      });

      btn_basket.addEventListener("click", () => {
        modal.close();
        redirectionBasket();
      });

      // ---------------- GESTION DES DONNÉES DU LOCAL STORAGE ---------------- //

      // Contient les propriétés assigné du produit
      const item = {
        id: sofaData._id,
        name: sofaData.name,
        img: sofaData.imageUrl,
        color: color.value,
        quantity: parseInt(quantity.value), // Permet de converting un "string" en nombre entier.
        altTxt: sofaData.altTxt,
      };

      // ---- Local Storage en cours (dynamique) ---- //
      let currentLocal = localStorage.getItem("cartObject") || [];

      // ---- Condition pour ajouter un article si inférieur à 1 donc 0 ---- //
      if (currentLocal.length < 1) {
        currentLocal.push(item);
        localStorage.setItem("cartObject", JSON.stringify(currentLocal));
      } else {
        currentLocal = JSON.parse(localStorage.getItem("cartObject")); // .parse analyse une chaine de caractère et la renvoi en chaîne / format JSON

        // ---- Condition comparant "id" & "color" afin de savoir si il ajoute en quantité ou crée une nouvelle valeur. ---- //
        for (let i = 0; i < currentLocal.length; i++) {
          if (
            currentLocal[i].id == item.id &&
            currentLocal[i].color == item.color
          ) {
            currentLocal[i].quantity += parseInt(item.quantity);
            localStorage.setItem("cartObject", JSON.stringify(currentLocal));
            return;
          }
        }
        currentLocal.push(item);
        localStorage.setItem("cartObject", JSON.stringify(currentLocal));
      }
    }
  });
};
sofaDisplay();
