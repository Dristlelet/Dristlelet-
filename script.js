(() => {
  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl || !cartButton || !countEl || !toast) return;

  const catalogue = [
    {
      name: "Pink × Purple Hoodie",
      price: "£55",
      image: "pink-purple-collection.png",
      description: "Black heavyweight streetwear hoodie with the Pink × Purple Dristlelet design."
    },
    {
      name: "Pink Collection Hoodie",
      price: "£55",
      image: "pink-collection.png",
      description: "Pink Dristlelet hoodie with matching front, back and sleeve graphics."
    },
    {
      name: "Drey King Hoodie",
      price: "£55",
      image: "drey-king.png",
      description: "Drey King collection hoodie with electric blue graphics."
    },
    {
      name: "Black Lightning Hoodie",
      price: "£55",
      image: "black-pink-purple.png",
      description: "Black Dristlelet hoodie with neon pink and purple lightning graphics."
    },
    {
      name: "Blue Voltage Hoodie",
      price: "£55",
      image: "blue-voltage.png",
      description: "Black Dristlelet hoodie with electric blue graphics."
    }
  ];

  let cart = Number(localStorage.getItem("dristleletCart") || 0);

  if (!Number.isFinite(cart) || cart < 0) {
    cart = 0;
  }

  countEl.textContent = cart;

  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hide");
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 1800);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function renderCatalogue() {
    productsEl.innerHTML = catalogue.map((item, index) => {
      const name = escapeHTML(item.name);
      const price = escapeHTML(item.price);
      const image = escapeHTML(item.image);
      const description = escapeHTML(item.description);

      return `
        <article class="product">
          <div class="product-image-wrap">
            <img
              class="product-image"
              src="${image}"
              alt="${name}"
              loading="lazy"
            >
            <div class="image-fallback">
              DRISTLELET
            </div>
          </div>

          <div class="product-info">
            <h3>${name}</h3>
            <p>${description}</p>
            <strong>${price}</strong>
            <button
              class="add"
              type="button"
              data-product="${index}"
            >
              ADD TO BAG
            </button>
          </div>
        </article>
      `;
    }).join("");

    productsEl.querySelectorAll(".product-image").forEach(img => {
      img.addEventListener("error", () => {
        img.classList.add("image-missing");

        const fallback = img.nextElementSibling;

        if (fallback) {
          fallback.classList.add("show");
        }
      });
    });

    productsEl.querySelectorAll(".add").forEach(button => {
      button.addEventListener("click", () => {
        const product = catalogue[Number(button.dataset.product)];

        cart++;
        countEl.textContent = cart;

        localStorage.setItem("dristleletCart", String(cart));

        button.classList.add("cart-pop");

        setTimeout(() => {
          button.classList.remove("cart-pop");
        }, 300);

        showToast(`${product.name} added to your bag.`);
      });
    });
  }

  cartButton.addEventListener("click", () => {
    if (cart === 0) {
      showToast("Your bag is empty.");
    } else {
      showToast(
        `You have ${cart} item${cart === 1 ? "" : "s"} in your bag.`
      );
    }
  });

  renderCatalogue();
})();
