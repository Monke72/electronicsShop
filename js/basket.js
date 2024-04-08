"use strict"
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from './constants.js';
import { 
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];







// Рендер товаров в корзине
function renderProductsBasket(arr) {
    arr.forEach(card => {
        const { id, img, title, price, discount } = card;
        const priceDiscount = price - ((price * discount) / 100);

        const cardItem = 
        `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <div class="cart__title">${title}</div>
            <div class="cart__block-btns">
                <div class="cart__minus">-</div>
                <div class="cart__count">1</div>
                <div class="cart__plus">+</div>
            </div>
            <div class="cart__price">
                <span>${price}</span>₽
            </div>
            <div class="cart__price-discount">
                <span>${priceDiscount}</span>₽
            </div>
            <div class="cart__del-card">X</div>
        </div>
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);
    });
}