function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();

    const list = document.getElementById('cart-items-list');

    if(cart.length === 0) {
        list.innerHTML = '<li class="empty-msg">السلة فارغة حالياً</li>';
    } else {
        list.innerHTML = cart.map((item, index) => `
            <li>
                <span>${item.name}</span>
                <div>
                    <strong>${item.price} د.ل</strong>
                    <button onclick="removeFromCart(${index})"
                        style="background:none;border:none;color:#ff4d4d;margin-right:10px;cursor:pointer;">
                        ❌
                    </button>
                </div>
            </li>
        `).join('');
    }
}
