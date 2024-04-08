"use strict";
//==========================================
import { ERROR_SERVER, PRODUCT_INFORMATION_NOT_FOUND } from "./constants.js";
import { showErrorMessage, checkingRelevanceValueBasket } from "./utils.js";

const wrapper = document.querySelector(".wrapper");
let productsData = [];

getProducts();

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
    loadProductDetails(productsData);
  } catch (err) {
    showErrorMessage(ERROR_SERVER);
    console.log(err);
  }
}

function getParametrFromUrl(parametr) {
  const urlParams = new URLSearchParams(window.location.search); //Добавляем ссылку на карточку в ноом окне
  return urlParams.get(parametr);
}

function loadProductDetails(data) {
  if (!data || !data.length) {
    showErrorMessage(ERROR_SERVER);
    return;
  }
  checkingRelevanceValueBasket(data);

  const productId = Number(getParametrFromUrl("id")); //Создаем переменную чтобы добавлять к ссылку id , приводим к намбер потому что получаем значения в виде строки
  if (!productId) {
    showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND);
    return;
  }
  const findProduct = data.find((card) => card.id === productId); //Записываем в переменную значение если card.id равен productId
  if (!findProduct) {
    showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND);
    return;
  }
  renderInfoProduct(findProduct);
}

// Рендер информации о товаре
function renderInfoProduct(product) {
  const { img, title, price, discount, descr } = product;
  const priceDiscount = price - (price * discount) / 100;
  const productItem = `
        <div class="product">
            <h2 class="product__title">${title}</h2>
            <div class="product__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <p class="product__descr">${descr}</p>
            <div class="product__inner-price">
                <div class="product__price">
                    <b>Цена:</b>
                    ${price}₽
                </div>
                <div class="product__discount">
                    <b>Цена со скидкой:</b>
                    ${priceDiscount}₽
                </div>
            </div>
        </div>
        `;
  wrapper.insertAdjacentHTML("beforeend", productItem);
}
