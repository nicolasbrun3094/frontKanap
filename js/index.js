const section = document.getElementById("items");
let sofaData = [];

// ---------------- IMPORTATION DE L'API ---------------- //
const fetchSofa = async () => {
  await fetch("https://back-end-kanap.onrender.com/api/products/")
    .then((res) => res.json())
    .then((data) => (sofaData = data));
};

// ---------------- AFFICHAGE DES PRODUITS ---------------- //
const sofaDispaly = async () => {
  await fetchSofa();
  section.innerHTML += sofaData
    .map(
      (sofa) =>
        `
      <a href="./product.html?productid=${sofa._id}">
          <article>
            <img src=${sofa.imageUrl} alt="photo de ${sofa.name}">
            <h3>${sofa.name}</h3>
             <p>${sofa.description}</p>
              <p class="price">  
                ${sofa.price} Є
              </p>
          </article>
        </a>
  `
    )
    .join("");
};

sofaDispaly();
