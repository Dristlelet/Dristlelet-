(() => {
  const productsEl=document.getElementById('products');
  const cartButton=document.getElementById('cartButton');
  const countEl=document.getElementById('cartCount');
  const toast=document.getElementById('toast');
  if(!productsEl||!cartButton||!countEl||!toast)return;
  let cart=Number.parseInt(localStorage.getItem('dristleletCart')||'0',10);
  if(!Number.isFinite(cart)||cart<0)cart=0;
  countEl.textContent=cart;
  let toastTimer;
  function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}
  function escapeHTML(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function renderCatalogue(){
    const items=Array.isArray(window.catalogue)?window.catalogue:[];
    productsEl.innerHTML=items.map((item,index)=>{
      const name=escapeHTML(item.name),price=escapeHTML(item.price),description=escapeHTML(item.description),image=item.image;
      return `<article class="product"><div class="product-image-wrap"><img class="product-image" src="${image}" alt="${name}" loading="${index<3?'eager':'lazy'}"><div class="image-fallback" aria-hidden="true"></div></div><h3>${name}</h3><p>${description}</p><strong>${price}</strong><button class="add" type="button" data-product="${name}">Add to bag</button></article>`;
    }).join('');
    productsEl.querySelectorAll('.add').forEach(button=>button.addEventListener('click',()=>{
      cart++;countEl.textContent=cart;localStorage.setItem('dristleletCart',String(cart));countEl.classList.remove('cart-pop');void countEl.offsetWidth;countEl.classList.add('cart-pop');showToast(`${button.dataset.product} added to bag.`);
    }));
  }
  cartButton.addEventListener('click',()=>cart===0?showToast('Your bag is empty.'):showToast(`You have ${cart} item${cart===1?'':'s'} in your bag.`));
  renderCatalogue();
})();
