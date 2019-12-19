let ul = document.querySelector("ul");
//let form = document.getElementById("create-form");
let createField = document.getElementById("create-field");
function itemTemplate(value) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${value.text}</span>
    <div>
      <button data-id="${value._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${value._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`;
}
//initial page load render
let ourHTML = items
  .map(function(item) {
    return itemTemplate(item);
  })
  .join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);
//create feature
document
  .getElementById("create-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    axios
      .post("/create-item", { text: createField.value })
      .then(function(response) {
        document
          .getElementById("item-list")
          .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      })
      .catch(function() {
        console.log("please try again later");
      });
  });

//delete feature
ul.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-me")) {
    if (confirm("Do you want to delete?")) {
      axios
        .post("/delete-item", { id: event.target.getAttribute("data-id") })
        .then(function() {
          event.target.parentElement.parentElement.remove();
        })
        .catch(function() {
          console.log("please try again later");
        });
    }
  }
});
//update feature
ul.addEventListener("click", function(event) {
  if (event.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "Enter your desired new text",
      event.target.parentElement.parentElement.querySelector(".item-text")
        .innerHTML
    );
    //console.log(userInput);
    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: event.target.getAttribute("data-id")
        })
        .then(function() {
          event.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(function() {
          console.log("try again later");
        });
    }
  }
});
