import "../css/style.css";

// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite
import "../scss/style.scss";

// import bootstrap JS part
import * as bootstrap from "bootstrap";

import { getJSON } from "./utils/getJSON";

let books,
  filteredBooks2,
  chosenCathegoryFilter = "all",
  chosenPriceFilter = "all",
  chosenSortOption = "Title",
  cathegories = [];

export async function start() {
  books = await getJSON("/json/books.json"); //do i need an await???
  getcathegory();
  addFiltercathegory();
  addFilterPrice();
  addSortingOptions();
  sortByTitle(books);
  displayBooks();
}

function getcathegory() {
  // create an array of all cathegories that people have
  let withDuplicates = books.map((book) => book.cathegory); // books--> array of Objects
  // remove duplicates by creating a set
  // that we then spread into an array to cast it to an array
  cathegories = [...new Set(withDuplicates)]; // cathegories --> array with 3 strings ["gaming","programming","cooking",]
  // sort the cathegories
  cathegories.sort(); // --> defualt sort (strings): ["cooking", "gaming", "programming"];
}

function addFiltercathegory() {
  // create and display html
  document.getElementById("filter1").innerHTML =
    // <div class="filters"></div> - cathegories is global!
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
      // get the selected cathegory
      chosenCathegoryFilter = event.target.value;
      displayBooks();
    });
}

function addFilterPrice() {
  // create and display html
  document.getElementById("filter2").innerHTML =
    // <div class="filters"></div> - cathegories is global!
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
    // console.log(event.target.value);
    displayBooks();
  });
}

// SORT

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

// DISPLAY

function displayBooks() {
  // 1. Cathegory FILTER
  let filteredBooks1 = books.filter(
    ({ cathegory }) =>
      chosenCathegoryFilter === "all" || chosenCathegoryFilter === cathegory
  );

  // 1. Price FILTER
  filteredBooks2 = filteredBooks1.filter(({ price }) => {
    console.log(chosenPriceFilter);
    console.log(price);
    return (
      chosenPriceFilter === "all" ||
      (chosenPriceFilter.split("-")[0] <= price &&
        chosenPriceFilter.split("-")[1] >= price)
    );
  });

  // 3. SORT BY...
  if (chosenSortOption === "Title") {
    sortByTitle(filteredBooks2);
  }
  if (chosenSortOption === "PriceAsc") {
    sortByPriceAsc(filteredBooks2);
  }
  if (chosenSortOption === "PriceDesc") {
    sortByPriceDesc(filteredBooks2);
  }
  let htmlArray = filteredBooks2.map(
    ({ id, title, author, description, cathegory, price }) => /*html*/ `
<div class="col">
  <div class="card" id="book">
    <h2 class="card-header">${title}</h2>
    <img class="card-img-top" src="/images/${id}.jpg" />
    <div class="card-body">
      <p><span class="card-subtitle">author: </span>${author}</p>
      <p><span class="card-subtitle">cathegory: </span>${cathegory}</p>
      <p><span class="card-subtitle">price: </span>${price}</p>
    </div>
    <div class="card-footer">
      <button
        type="button"
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

// function myFunction(event) {
//   let closestTarget = event.target.closest(".card");
//   let allCards = [...document.querySelectorAll(".card")];
//   let index = allCards.indexOf(closestTarget);

document.querySelector("body").addEventListener("click", (event) => {
  let closestTarget = event.target.closest(".card");
  // you clicked on a column, but which one?
  let allCards = [...document.querySelectorAll(".card")];
  // find me among the columns divs
  let index = allCards.indexOf(closestTarget);
  console.log("click on: ", index);

  if (index >= 0) {
    // let theValue = document.getElementById("book").value;
    let modalContainer = document.getElementById("modal1");
    let myModal = new bootstrap.Modal(modalContainer, { backdrop: "static" });

    createModalHtml(filteredBooks2[index]);

    function createModalHtml({
      id,
      title,
      author,
      description,
      cathegory,
      price,
    }) {
      let htmlModalHeader = /*html*/ `
      <p><span class="card-subtitle">Title: </span>${title}</p>
    `;
      let htmlModalBody = /*html*/ `
      <p><span class="card-subtitle">Author: </span>${author}</p>
      <p><span class="card-subtitle">Cathegory: </span>${cathegory}</p>
      <p><span class="card-subtitle">Description: </span>${description}</p>
      <p><span class="card-subtitle">Price: </span>${price}</p>
    `;

      modalContainer.querySelector(".modal-header").innerHTML = htmlModalHeader;
      modalContainer.querySelector(".modal-body").innerHTML = htmlModalBody;
    }
    myModal.show();
  }
});
start();
