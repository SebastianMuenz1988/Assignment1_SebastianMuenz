import "../css/style.css";
import { getJSON } from "./utils/getJSON";

let persons,
  chosenHobbyFilter = "all",
  chosenAgeFilter = "all",
  chosenSortOption = "Last name",
  hobbies = [];

async function start() {
  persons = await getJSON("/json/persons.json"); //do i need an await???
  getHobbies();
  addFilterHobby();
  addFilterAge();
  addSortingOptions();
  sortByLastName(persons);
  displayPersons();
}

// SORT

function sortByLastName(persons) {
  persons.sort(({ lastName: aLastName }, { lastName: bLastName }) =>
    aLastName > bLastName ? 1 : -1
  );
}

function sortByAgeAsc(persons) {
  persons.sort(({ age: aAge }, { age: bAge }) => (aAge > bAge ? 1 : -1));
  // points.sort((a, b)=> {return a - b});
}

function sortByAgeDesc(persons) {
  persons.sort(({ age: aAge }, { age: bAge }) => (bAge > aAge ? 1 : -1));
  // points.sort(function(a, b){return b-a});
}

// SORT - DROP DOWN

function addSortingOptions() {
  // create and display html
  document.querySelector(".sortingOptions").innerHTML = /*html*/ `
    <label><span>Sort by:</span>
      <select class="sortOption">
        <option>Last name</option>
        <option>AgeAsc</option>
        <option>AgeDesc</option>
      </select>
    </label>
  `;

  // Event Listener
  document.querySelector(".sortOption").addEventListener("change", (event) => {
    chosenSortOption = event.target.value; //klickEvent (object).target.value
    displayPersons();
  });
}

function getHobbies() {
  // create an array of all hobbies that people have
  let withDuplicates = persons.map((person) => person.hobby); // persons--> array of Objects
  // remove duplicates by creating a set
  // that we then spread into an array to cast it to an array
  hobbies = [...new Set(withDuplicates)]; // hobbies --> array with 3 strings ["gaming","programming","cooking",]
  // sort the hobbies
  hobbies.sort(); // --> defualt sort (strings): ["cooking", "gaming", "programming"];
}

// ADD FILTER

function addFilterHobby() {
  // create and display html
  document.querySelector(".filter1").innerHTML =
    // <div class="filters"></div> - hobbies is global!
    /*html*/ `
    <label><span>Filter by hobbies:</span>
      <select class="hobbyFilter">
        <option>all</option>
        ${hobbies.map((hobby) => `<option>${hobby}</option>`).join("")}
      </select>
    </label>
  `;
  // add an event listener
  document.querySelector(".hobbyFilter").addEventListener("change", (event) => {
    // get the selected hobby
    chosenHobbyFilter = event.target.value;
    displayPersons();
  });
}

function addFilterAge() {
  // create and display html
  document.querySelector(".filter2").innerHTML =
    // <div class="filters"></div> - hobbies is global!
    /*html*/ `
    <label>
      <span>Filter by age:</span>
      <select class="ageFilter">
        <option>all</option>
        <option>0-10</option>
        <option>11-20</option>
        <option>21-30</option>
        <option>31-40</option>
        <option>41-50</option>
        <option>51-60</option>
        <option>61-70</option>
        <option>71-80</option>
        <option>81-90</option>
        <option>91-100</option>
        <option>101-120</option>
        <option>121-130</option>
      </select>
    </label>
  `;
  // EVENT LISTENER
  document.querySelector(".ageFilter").addEventListener("change", (event) => {
    chosenAgeFilter = event.target.value;
    // console.log(event.target.value);
    displayPersons();
  });
}

// DISPLAY

function displayPersons() {
  // 1. HOBBY FILTER
  let filteredPersons1 = persons.filter(
    ({ hobby }) => chosenHobbyFilter === "all" || chosenHobbyFilter === hobby
  );

  // 1. AGE FILTER
  let filteredPersons2 = filteredPersons1.filter(({ age }) => {
    return (
      chosenAgeFilter === "all" ||
      (chosenAgeFilter.split("-")[0] <= age &&
        chosenAgeFilter.split("-")[1] >= age)
    );
  });

  // 3. SORT BY...
  if (chosenSortOption === "Last name") {
    sortByLastName(filteredPersons2);
  }
  if (chosenSortOption === "AgeAsc") {
    sortByAgeAsc(filteredPersons2);
  }
  if (chosenSortOption === "AgeDesc") {
    sortByAgeDesc(filteredPersons2);
  }
  let htmlArray = filteredPersons2.map(
    ({ id, firstName, lastName, email, phone, age, hobby }) => /*html*/ `
    <div class="person">
      <h3>${firstName} ${lastName}</h3>
      <p><span>id</span>${id}</p>
      <p><span>email</span>${email}</p>
      <p><span>phone</span>${phone}</p>
      <p><span>age</span>${age}</p>
      <p><span>hobby</span>${hobby}</p>
    </div>
  `
  );
  document.querySelector(".personList").innerHTML = htmlArray.join("");
}

start();
