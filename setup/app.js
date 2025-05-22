// ======== Select Items ========
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// Edit Option
let editElement;
let editFlag = false;
let editID = "";

// ======== Event Listeners ========
window.addEventListener("DOMContentLoaded", setupItems);
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);

// ======== Functions ========

// Add Item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    displayAlert("Запис додано у список", "success");

    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerText = value;
    displayAlert("Запис змінено", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Введіть назву продукту", "danger");
  }
}

// Display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}

// Clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(item => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("Список очищено", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// Delete Item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Запис видалено", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

// Edit Item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = element.querySelector(".title");
  grocery.value = editElement.innerText;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Редагувати";
}

// Set Back To Default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Додати";
}

// Local Storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(item => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(item => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Setup Items
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(item => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

// Create List Item
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  element.setAttribute("data-id", id);
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}
