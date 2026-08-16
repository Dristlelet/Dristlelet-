let cart = 0;
const count = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const products = document.getElementById("products");

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hide");
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
  }, 1800);
}

function renderCatalogue() {
  if (!products || !window.catalogue) return;

  products.innerHTML = window.catalogue.map((item, index) => `
    <article class="product">
      <div class="product-image-wrap">
        <img class="product-image" src="${item.image}" alt="${item.name}" loading="${index < 3 ? "eager" : "lazy"}">
      </div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <strong>${item.price}</strong>
      <button class="add" data-product="${item.name}">Add to bag</button>
    </article>
  `).join("");

  document.querySelectorAll(".add").forEach(button => {
    button.addEventListener("click", () => {
      cart++;
      count.textContent = cart;
      count.classList.remove("cart-pop");
      void count.offsetWidth;
      count.classList.add("cart-pop");
      showToast(`${button.dataset.product} added to bag.`);
    });
  });
}

document.getElementById("cartButton").addEventListener("click", () => {
  if (cart === 0) {
    showToast("Your bag is empty.");
  } else {
    showToast(`You have ${cart} item${cart === 1 ? "" : "s"} in your bag.`);
  }
});

renderCatalogue();
