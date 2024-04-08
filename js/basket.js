"use strict";
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from "./constants.js";
import {
  showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  checkingRelevanceValueBasket,
} from "./utils.js";

const cart = document.querySelector(".cart");
let productsData = [];

getProducts();
cart.addEventListener("click", delProductBasket);

async function getProducts() {
  try {
    if (!productsData.length) {
      //если длинна массива равно 0 делаем запрос d базу данных ,
      //если ответ отрицаетльный выдаем ошибку ,если ошибки нет json массив представляем в массив js
      const res = await fetch("../data/products.json");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
    }
    loadProductBasket(productsData);
  } catch (err) {
    showErrorMessage(ERROR_SERVER);
    console.log(err);
  }
}

function loadProductBasket(data) {
  cart.textContent = ""; //Очищаем страницу после очистки корзины
  if (!data || !data.length) {
    showErrorMessage(ERROR_SERVER);
    return;
  }
  checkingRelevanceValueBasket(data);
  const basket = getBasketLocalStorage();

  if (!basket || !basket.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }
  const findProducts = data.filter((item) => basket.includes(String(item.id))); //Получаем список ид товаров из корзины
  if (!findProducts.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }
  renderProductsBasket(findProducts); //Добавляем фунцкию передавая id из корзины
}

function delProductBasket(event) {
  const targetButton = event.target.closest(".cart__del-card");
  if (!targetButton) return;

  const card = targetButton.closest(".cart__product");
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  const newBasket = basket.filter((item) => item !== id); //Получаем все элеменнты не осдержащие этот id
  setBasketLocalStorage(newBasket);
  getProducts();
}

// Рендер товаров в корзине
function renderProductsBasket(arr) {
  arr.forEach((card) => {
    const { id, img, title, price, discount } = card;
    const priceDiscount = price - (price * discount) / 100;

    const cardItem = `
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

    cart.insertAdjacentHTML("beforeend", cardItem);
  });
}
