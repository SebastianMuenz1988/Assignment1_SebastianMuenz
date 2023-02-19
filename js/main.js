import "../css/style.css";
import { getJSON } from "./utils/getJSON";

let books,
  chosenCathegoryFilter = "all",
  chosenPriceFilter = "all",
  chosenSortOption = "Title",
  cathegories = [];

async function start() {
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
  document.querySelector(".filter1").innerHTML =
    // <div class="filters"></div> - cathegories is global!
    /*html*/ `
    <label><span>Filter by cathegories:</span>
      <select class="cathegoryFilter">
        <option>all</option>
        ${cathegories
          .map((cathegory) => `<option>${cathegory}</option>`)
          .join("")}
      </select>
    </label>
  `;
  // add an event listener
  document
    .querySelector(".cathegoryFilter")
    .addEventListener("change", (event) => {
      // get the selected cathegory
      chosenCathegoryFilter = event.target.value;
      displayBooks();
    });
}

function addFilterPrice() {
  // create and display html
  document.querySelector(".filter2").innerHTML =
    // <div class="filters"></div> - cathegories is global!
    /*html*/ `
    <label>
      <span>Filter by price:</span>
      <select class="priceFilter">
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
  document.querySelector(".priceFilter").addEventListener("change", (event) => {
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
  document.querySelector(".sortingOptions").innerHTML = /*html*/ `
    <label><span>Sort by:</span>
      <select class="sortOption">
        <option>Title</option>
        <option>PriceAsc</option>
        <option>PriceDesc</option>
      </select>
    </label>
  `;

  // Event Listener
  document.querySelector(".sortOption").addEventListener("change", (event) => {
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
  let filteredBooks2 = filteredBooks1.filter(({ price }) => {
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
    <div class="book">
      <h3>${title}</h3>
      <p><span>author</span>${author}</p>
      <p><span>description</span>${description}</p>
      <p><span>cathegory</span>${cathegory}</p>
      <p><span>price</span>${price}</p>
      <p><span>id</span>${id}</p>
      <img src="/images/${id}.jpg" alt="${id}">
    </div>
  `
  );
  document.querySelector(".bookList").innerHTML = htmlArray.join("");
}

// Add event Listener
document.querySelector("body").addEventListener("click", (event) => {
  // event.target = the HTML-element the user clicked
  // .closest:
  //   does the HTML-element or any of its parents
  //   match a certain css selector
  let columnDiv = event.target.closest("div.book");

  if (columnDiv) {
    console.log("Click!");
    let target = event.target.innerText;
    let array = target.split("  ");
    console.log(array);
  }
});
start();
