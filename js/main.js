// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite
import "../scss/style.scss";
// import "../css/style.css"; Deleted

// import bootstrap JS part
import * as bootstrap from "bootstrap";

// import user modules
import { getJSON } from "./utils/getJSON";

// global variables
let books,
  filteredBooks2,
  chosenCathegoryFilter = "all",
  chosenPriceFilter = "all",
  chosenSortOption = "Title",
  cathegories = [],
  shoppingCart = [],
  index;

// start function
export async function start() {
  books = await getJSON("/json/books.json"); //do i need an await??? ja
  getcathegory();
  addFiltercathegory();
  addFilterPrice();
  addSortingOptions();
  sortByTitle(books);
  displayBooks();
}

// create an array of all cathegories you can find
function getcathegory() {
  let withDuplicates = books.map((book) => book.cathegory); // get ALL cathegorys
  cathegories = [...new Set(withDuplicates)]; // create a set out of it -->no duplicates
  cathegories.sort(); // --> defualt sort (strings): ["cooking", "gaming", "programming"];
}

// create category drop down
function addFiltercathegory() {
  document.getElementById("filter1").innerHTML =
    // indext.html--> <div class="col" id="filter1">filter1</div>
    /*html*/ `
    <label><span>Filter by cathegories:</span>
      <select class="form-select" id="cathegoryFilter">
        <option>all</option>
        ${cathegories
          .map((cathegory) => `<option>${cathegory}</option>`)
          .join("")}
      </select>
    </label>
  `;
  // add an event listener
  document
    .getElementById("cathegoryFilter")
    .addEventListener("change", (event) => {
      chosenCathegoryFilter = event.target.value;
      displayBooks();
    });
}

// create price drop down
function addFilterPrice() {
  document.getElementById("filter2").innerHTML =
    // <div class="col" id="filter2">filter2</div>
    /*html*/ `
    <label>
      <span>Filter by price:</span>
      <select class="form-select" id="priceFilter">
        <option>all</option>
        <option>0-20</option>
        <option>21-40</option>
        <option>41-60</option>
        <option>61-80</option>
        <option>81-100</option>
        <option>101-120</option>
        <option>121-140</option>
        <option>141-160</option>
        <option>161-180</option>
        <option>181-200</option>
      </select>
    </label>
  `;
  // EVENT LISTENER
  document.getElementById("priceFilter").addEventListener("change", (event) => {
    chosenPriceFilter = event.target.value;
    displayBooks();
  });
}

// SORT - DROP DOWN
function addSortingOptions() {
  // create and display html
  document.getElementById("sortingOptions").innerHTML = /*html*/ `
    <label><span>Sort by:</span>
      <select class="form-select" id="sortOption">
        <option>Title</option>
        <option>PriceAsc</option>
        <option>PriceDesc</option>
      </select>
    </label>
  `;

  // Event Listener
  document.getElementById("sortOption").addEventListener("change", (event) => {
    chosenSortOption = event.target.value; //klickEvent (object).target.value
    displayBooks();
  });
}

// sort functions
function sortByTitle(books) {
  books.sort(({ title: atitle }, { title: btitle }) =>
    atitle > btitle ? 1 : -1
  );
}

function sortByPriceAsc(books) {
  books.sort(({ price: aprice }, { price: bprice }) =>
    aprice > bprice ? 1 : -1
  );
  // points.sort((a, b)=> {return a - b});
}

function sortByPriceDesc(books) {
  books.sort(({ price: aprice }, { price: bprice }) =>
    bprice > aprice ? 1 : -1
  );
  // points.sort(function(a, b){return b-a});
}

// DISPLAY //

function displayBooks() {
  // 1. apply cathegory filter
  let filteredBooks1 = books.filter(
    ({ cathegory }) =>
      chosenCathegoryFilter === "all" || chosenCathegoryFilter === cathegory
  );

  // 2. apply price filter
  filteredBooks2 = filteredBooks1.filter(({ price }) => {
    console.log(chosenPriceFilter);
    console.log(price);
    return (
      chosenPriceFilter === "all" ||
      (chosenPriceFilter.split("-")[0] <= price &&
        chosenPriceFilter.split("-")[1] >= price)
    );
  });

  // 3. apply sort functions
  if (chosenSortOption === "Title") {
    sortByTitle(filteredBooks2);
  }
  if (chosenSortOption === "PriceAsc") {
    sortByPriceAsc(filteredBooks2);
  }
  if (chosenSortOption === "PriceDesc") {
    sortByPriceDesc(filteredBooks2);
  }
  // 4. create cards
  let htmlArray = filteredBooks2.map(
    ({ id, title, author, description, cathegory, price }) => /*html*/ `
    <div class="col mb-4">
      <div class="card h-100" id="book" >
        <h2 class="card-header d-flex align-items-center h-100" >${title}</h2>
        <img class="card-img-top" src="/images/${id}.jpg" />
        <div class="card-body h-100">
          <p><span class="card-subtitle align-items-left ">author: </span>${author}</p>
          <p><span class="card-subtitle">cathegory: </span>${cathegory}</p>
          <p><span class="card-subtitle">price: </span>${price}</p>
        </div>
        <div class="card-footer">
          <button
            type="button"
            id="buyButton1"
            class="btn btn-primary"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  `
  );
  console.log(htmlArray.join(""));
  document.getElementById("booklist").innerHTML = htmlArray.join("");
}

// FUNCTIONS //

function openModalShoppingCart({
  id,
  title,
  author,
  description,
  cathegory,
  price,
}) {
  // create modal header
  let htmlModalHeader = /*html*/ `
      <p><span class="card-subtitle">Title: </span>${title}</p>
      `; // create modal body
  let htmlModalBody = /*html*/ `
      <p><span class="card-subtitle">Author: </span>${author}</p>
      <p><span class="card-subtitle">Cathegory: </span>${cathegory}</p>
      <p><span class="card-subtitle">Description: </span>${description}</p>
      <p><span class="card-subtitle">Price: </span>${price}</p>
      `;
  // manipulate model dom
  let modalContainer = document.getElementById("modal1");
  let myModal = new bootstrap.Modal(modalContainer, {
    backdrop: "static",
  });
  modalContainer.querySelector("#modalDetailsHeader").innerHTML =
    htmlModalHeader;
  modalContainer.querySelector("#modalDetailsBody").innerHTML = htmlModalBody;
  myModal.show();
}

function openModalShoppingChart(shoppingCart) {
  //destructuring of filteredBooks2
  let htmlItemsArray = shoppingCart.map(
    ({ id, title, author, description, cathegory, price }) => /*html*/ `
      <tr>
        <td class="w-25">
          <img class="img-fluid img-thumbnail" src="/images/${id}.jpg" />
        </td>
        <td>${title}</td>
        <td>${author}</td>
        <td>${price}</td>
      </tr>
      `
  );

  let withDuplicates = books.map((book) => book.cathegory);
  let sum = shoppingCart.map((item) => item.price);
  let total = sum.reduce((a, b) => a + b, 0);

  // manipulate model dom
  let modalContainer = document.getElementById("modalShoppingCart");
  let myModal = new bootstrap.Modal(modalContainer, { backdrop: "static" });
  let totalHtml = total;
  console.log(total);
  modalContainer.querySelector("#ShoppingCartBbody").innerHTML = htmlItemsArray;
  modalContainer.querySelector("#total").innerHTML = totalHtml;

  myModal.show();
}

function addToShoppingChart(index) {
  shoppingCart.push(filteredBooks2[index]);
  "The following product was added to shopping chart: " +
    filteredBooks2[index].id;
  console.log("added book: ", filteredBooks2[index]);
  console.log("shopping cart: ", shoppingCart);
  console.log();
}

// Event Open Shopping Cart
document.querySelector("#buyButton2").addEventListener("click", () => {
  addToShoppingChart(index);
});

// Event Buy in ModalDetails
document
  .querySelector("#buttonModalShoppingCart")
  .addEventListener("click", () => {
    openModalShoppingChart(shoppingCart);
  });

// Event Listener Cards
document.querySelector("body").addEventListener("click", (event) => {
  let closestTarget = event.target.closest(".card"); //get closest card to click
  console.log(closestTarget);
  let allCards = [...document.querySelectorAll(".card")]; //destructuring --> Array (all cards array)
  let targetIndex = allCards.indexOf(closestTarget);
  if (targetIndex >= 0) {
    index = allCards.indexOf(closestTarget);
  } //
  console.log("click on: ", index);
  console.log("click on: ", event.target.id);

  if (targetIndex >= 0) {
    // If you clicked on a card
    if (event.target.id == "buyButton1") {
      // you clicked on a by button
      addToShoppingChart(index);
    } else {
      // if you only clicked on the somewhere on the card (not the buy button)

      openModalShoppingCart(filteredBooks2[index]);
    }
  }
});

start();
