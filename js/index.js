"use strict";
//==========================================
import {
  showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  checkingRelevanceValueBasket,
} from "./utils.js";

import {
  COUNT_SHOW_CARDS_CLICK,
  ERROR_SERVER,
  NO_PRODUCTS_IN_THIS_CATEGORY,
} from "./constants.js";

const cards = document.querySelector(".cards");
const btnShowCards = document.querySelector(".show-cards");
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];

getProducts();

btnShowCards.addEventListener("click", sliceArrCards);
cards.addEventListener("click", handleCardCkick);

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
    if (
      productsData.length > COUNT_SHOW_CARDS_CLICK && //если длинна массива больше 5 карточек и у кнопки уже присутсвует класс none , удаляем класс none
      btnShowCards.classList.contains("none")
    ) {
      btnShowCards.classList.remove("none");
    }
    renderStartPage(productsData);
  } catch (err) {
    showErrorMessage(ERROR_SERVER);
    console.log(err);
  }
}

function renderStartPage(data) {
  if (!data || !data.length) {
    //Если массив пустой или данные не получены выдаем ошибку
    showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
    return;
  }
  const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK); //режим наш массив , оставляя 5 карточек
  createCards(arrCards);

  checkingRelevanceValueBasket(data);

  const bascet = getBasketLocalStorage();
  checkingActiveButtins(bascet);
}

function sliceArrCards() {
  if (shownCards >= productsData.length) return; //Если карточек в массиве который мы получаем из json больше чем отображено или стольок же , не выполнять дальше

  countClickBtnShowCards++; //добавляем больше карточек на 1 партию , теость на 5
  const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards; //Колчество картотчек умножаем на счеткик
  const arrCards = productsData.slice(shownCards, countShowCards); //режим массив от тех карточек которые уже были показаны до тех которые добавили
  createCards(arrCards);

  shownCards = cards.children.length; //количество карточек прировняли к количеству элементов внтри card

  if (shownCards >= productsData.length) {
    btnShowCards.classList.add("none"); //когда число карточек в массиве заканчивается удаляем кнопку показать еще
  }
}

function handleCardCkick(event) {
  const targetButton = event.target.closest(".card__add"); //отслеживаем клик по кнопке
  if (!targetButton) return; //Если клик не отслеживаем то выходим из фунцкии

  const card = targetButton.closest(".card"); //Ищем родителя с данным классом у еденичной карточки , а не у всех
  const id = card.dataset.productId; //Находим id карточки по дата-атрбуту
  const bascet = getBasketLocalStorage();

  if (bascet.includes(id)) return; //Проверям есть ли в корзине уже тавор с таким Id

  bascet.push(id); //Добавляем элемент в конец массива
  setBasketLocalStorage(bascet);
  checkingActiveButtins(bascet);
}

function checkingActiveButtins(bascet) {
  const buttons = document.querySelectorAll(".card__add");
  buttons.forEach((btn) => {
    const card = btn.closest(".card"); //Находим родителя кнопки с классом кард
    const id = card.dataset.productId;
    const isInBascet = bascet.includes(id); //Проверяем есть ли у bascet id и возвращает true или false

    btn.disabled = isInBascet;
    btn.classList.toggle("active", isInBascet);
    btn.textContent = isInBascet ? "В корзине " : "В корзину";
  });
}

// Рендер карточки
function createCards(data) {
  //с помощью data получаем массив
  data.forEach((card) => {
    const { id, img, title, price, discount } = card;
    const priceDiscount = price - (price * discount) / 100;
    const cardItem = `
                  <div class="card" data-product-id="${id}">
                      <div class="card__top">
                          <a href="/card.html?id=${id}" class="card__image">
                              <img
                                  src="./images/${img}"
                                  alt="${title}"
                              />
                          </a>
                          <div class="card__label">-${discount}%</div>
                      </div>
                      <div class="card__bottom">
                          <div class="card__prices">
                              <div class="card__price card__price--discount">${priceDiscount}</div>
                              <div class="card__price card__price--common">${price}</div>
                          </div>
                          <a href="/card.html?id=${id}" class="card__title">${title}</a>
                          <button class="card__add">В корзину</button>
                      </div>
                  </div>
              `;
    cards.insertAdjacentHTML("beforeend", cardItem);
  });
}
