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
  filteredBooks,
  chosenCathegoryFilter = "all",
  chosenAuthorFilter = "all",
  chosenPriceFilter = "all",
  chosenSortOption1 = "Title",
  chosenSortOption2 = "Ascending",
  cathegories = [],
  shoppingCart = [],
  index,
  chosenFilter = "Category",
  authors = "",
  maxPrice = 0;

// start function
export async function start() {
  books = await getJSON("/json/books.json"); //do i need an await??? ja
  getCategories();
  getAutors();
  getPriceRange();
  addFilterCathegory();
  displayBooks();
}

// GET CATEGORIES
function getCategories() {
  let withDuplicates = books.map((book) => book.cathegory); // get ALL cathegorys
  cathegories = [...new Set(withDuplicates)]; // create a set out of it -->no duplicates
  cathegories.sort(); // --> defualt sort (strings--> ab): ["cooking", "gaming", "programming"];
}

// GET AUTORS
function getAutors() {
  let withDuplicates = books.map((book) => book.author); // get array of authors
  authors = [...new Set(withDuplicates)]; // create a set out of it -->no duplicates
  authors.sort(); // --> defualt sort (string -> abc)
}

// GET PRICE RANGE
function getPriceRange() {
  let prices = books.map((book) => Number(book.price)); // get array of all prices
  maxPrice = Math.max(...prices); // spread array = (price1 , price2, ... ,pricen)

  console.log(maxPrice);
}

// Event listener chosen filter
document.querySelector("#chosenFilter").addEventListener("change", (event) => {
  chosenFilter = event.target.value;
  addChosenFilter();
});

// EVENT LISTENER

// SORT Event Listener
document.querySelector("#sortingOptions1").addEventListener("change", (event) => {
  chosenSortOption1 = event.target.value; //klickEvent (object).target.value
  chosenSortOption2 = "Ascending";
  displayBooks();
});

// SORT Event Listener
document.querySelector("#sortingOptions2").addEventListener("change", (event) => {
  chosenSortOption2 = event.target.value; //klickEvent (object).target.value
  console.log(chosenSortOption2);
  displayBooks();
});

// ADD COOSEN FILTER
function addChosenFilter() {
  if (chosenFilter === "Category") addFilterCathegory();
  if (chosenFilter === "Author") addFilterAuthor();
  if (chosenFilter === "Price") addFilterPrice();
}

// ADD CATEGORY FILTER - DROP DOWN
function addFilterCathegory() {
  chosenCathegoryFilter = "all";
  console.log("Category filter");
  document.querySelector("#filter1").innerHTML =
    // indext.html--> <div class="col" id="filter1">filter1</div>
    /*html*/ `
        <label for="chosenFilter" class="form-label">Filter value:</label>
      <select class="form-select" id="cathegoryFilter">
        <option>all</option>
        ${cathegories.map((cathegory) => `<option>${cathegory}</option>`).join("")}
      </select>
  `;
  displayBooks();
  // add an event listener
  document.querySelector("#cathegoryFilter").addEventListener("change", (event) => {
    chosenCathegoryFilter = event.target.value;
    displayBooks();
  });
}

// ADD AUTHOR FILTER- DROP DOWN
function addFilterAuthor() {
  console.log("Author filter");
  chosenAuthorFilter = "all";
  document.querySelector("#filter1").innerHTML =
    // indext.html--> <div class="col" id="filter1">filter1</div>
    /*html*/ `
      <select class="form-select" id="authorFilter">
        <option>all</option>
        ${authors.map((author) => `<option>${author}</option>`).join("")}
      </select>
  `;
  displayBooks();
  // add an event listener
  document.querySelector("#authorFilter").addEventListener("change", (event) => {
    chosenAuthorFilter = event.target.value;
    displayBooks();
  });
}

// ADD PRICE FILTER - DROP DOWN
function addFilterPrice() {
  console.log("Price filter");
  chosenPriceFilter = "all";
  document.querySelector("#filter1").innerHTML =
    // <div class="col" id="filter2">filter2</div>
    /*html*/ `
      <select class="form-select" id="priceFilter">
      <option>all</option>
        <option>0 - ${Math.ceil(maxPrice / 5)}</option>
        <option>${Math.ceil(maxPrice / 5)}-${Math.ceil(maxPrice / 4)}</option>
        <option>${Math.ceil(maxPrice / 4)}-${Math.ceil(maxPrice / 3)}</option>
        <option>${Math.ceil(maxPrice / 3)}-${Math.ceil(maxPrice / 2)}</option>
        <option>${Math.ceil(maxPrice / 2)}-${Math.ceil(maxPrice / 1)}</option>
      </select>
  `;
  displayBooks();
  // add an event listener
  document.querySelector("#priceFilter").addEventListener("change", (event) => {
    chosenPriceFilter = event.target.value;
    displayBooks();
  });
}

// FILTER FUNCTIONS
function filterCatheogry() {
  filteredBooks = books.filter(({ cathegory }) => chosenCathegoryFilter === "all" || chosenCathegoryFilter === cathegory);
}

function filterAuthor() {
  filteredBooks = books.filter(({ author }) => chosenAuthorFilter === "all" || chosenAuthorFilter === author);
}

function filterPrice() {
  console.log(chosenPriceFilter.split("-")[0]);
  console.log(chosenPriceFilter.split("-")[1]);
  filteredBooks = books.filter(({ price }) => {
    return chosenPriceFilter === "all" || (chosenPriceFilter.split("-")[0] <= price && chosenPriceFilter.split("-")[1] >= price);
  });
}

// SORT FUNCTIONS
function sortByTitle() {
  if (chosenSortOption2 === "Ascending") {
    console.log("Sort by Title Ascending");
    filteredBooks.sort(({ title: atitle }, { title: btitle }) => (atitle > btitle ? 1 : -1));
    // points.sort((a, b)=> {return a - b});
  }
  if (chosenSortOption2 === "Descending") {
    console.log("Sort by Title Descending");
    filteredBooks.sort(({ title: atitle }, { title: btitle }) => (atitle > btitle ? -1 : 1));
  }
}

function sortByAuthor() {
  if (chosenSortOption2 === "Ascending") {
    console.log("Sort by Author Ascending");
    filteredBooks.sort(({ author: aauthor }, { author: bauthor }) => (aauthor > bauthor ? 1 : -1));
    // points.sort((a, b)=> {return a - b});
  }
  if (chosenSortOption2 === "Descending") {
    console.log("Sort by Author Descending");
    filteredBooks.sort(({ author: aauthor }, { author: bauthor }) => (aauthor > bauthor ? -1 : 1));
  }
}

function sortByPrice() {
  if (chosenSortOption2 === "Ascending") {
    console.log("Sort by Price Ascending");
    filteredBooks.sort(({ price: aprice }, { price: bprice }) => (aprice > bprice ? 1 : -1));
    // points.sort((a, b)=> {return a - b});
  }
  if (chosenSortOption2 === "Descending") {
    console.log("Sort by Price Descending");
    filteredBooks.sort(({ price: aprice }, { price: bprice }) => (aprice > bprice ? -1 : 1));
  }
}

// DISPLAY BOOKS //

function displayBooks() {
  // 1. apply cathegory filter

  if (chosenFilter === "Category") filterCatheogry();
  if (chosenFilter === "Author") filterAuthor();
  if (chosenFilter === "Price") filterPrice();

  // 2. apply sort
  if (chosenSortOption1 === "Title") {
    sortByTitle();
  }

  if (chosenSortOption1 === "Author") {
    sortByAuthor();
  }

  if (chosenSortOption1 === "Price") {
    sortByPrice();
  }

  // 4. create cards
  let htmlArray = filteredBooks.map(
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
  document.getElementById("booklist").innerHTML = htmlArray.join("");
}

// FUNCTIONS //
function openModalDetails({ id, title, author, description, cathegory, price }) {
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
  modalContainer.querySelector("#modalDetailsHeader").innerHTML = htmlModalHeader;
  modalContainer.querySelector("#modalDetailsBody").innerHTML = htmlModalBody;
  myModal.show();
}

function openModalShoppingCart(shoppingCart) {
  // Count the number of times each book appears in the shopping cart
  let bookCounts = {};
  shoppingCart.forEach((item) => {
    bookCounts[item.id] = (bookCounts[item.id] || 0) + 1;
  });
  console.log("bookCounts", bookCounts);
  // Create an array of unique books in the shopping cart, with their counts
  let htmlItemsArray = Object.keys(bookCounts).map((bookId) => {
    let book = shoppingCart.find((item) => item.id == bookId);
    console.log("book", book);
    let count = bookCounts[bookId];
    return /*html*/ `
      <tr>
        <td class="w-25">
          <img class="img-fluid img-thumbnail" src="/images/${book.id}.jpg" />
        </td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.price}</td>
        <td>${count}</td>
      </tr>
    `;
  });

  let sum = shoppingCart.map((item) => item.price);
  let total = sum.reduce((a, b) => a + b, 0);

  // manipulate model dom
  let modalContainer = document.getElementById("modalShoppingCart");
  let myModal = new bootstrap.Modal(modalContainer, { backdrop: "static" });
  let totalHtml = Math.round(total * 100) / 100;
  console.log(total);
  modalContainer.querySelector("#ShoppingCartBbody").innerHTML = htmlItemsArray;
  modalContainer.querySelector("#total").innerHTML = totalHtml;

  myModal.show();
}

function addToShoppingCart(index) {
  shoppingCart.push(filteredBooks[index]);
  "The following product was added to shopping Cart: " + filteredBooks[index].id;
  console.log("added book: ", filteredBooks[index]);
  console.log("shopping cart: ", shoppingCart);
  console.log();
}

// Event Open Shopping Cart
document.querySelector("#buyButton2").addEventListener("click", () => {
  addToShoppingCart(index);
});

// Event Buy in ModalDetails
document.querySelector("#buttonModalShoppingCart").addEventListener("click", () => {
  openModalShoppingCart(shoppingCart);
});

// Event Listener Cards
document.querySelector("#booklist").addEventListener("click", (event) => {
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
      addToShoppingCart(index);
    } else {
      // if you only clicked on the somewhere on the card (not the buy button)

      openModalDetails(filteredBooks[index]);
    }
  }
});

start();
