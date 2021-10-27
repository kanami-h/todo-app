const form = document.querySelector(".todo-form");
const search = document.getElementById("search");
const aleart = document.querySelector(".aleart");
const todo = document.getElementById("todo");
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clear-btn");

// eventListeners
form.addEventListener("submit", (e) => {
  addItem(e);
});

clearBtn.addEventListener("click", () => {
  clearItems();
  displayAleart("item removed", "danger");
});

window.addEventListener("DOMContentLoaded", () => {
  setupItems();
});

search.addEventListener("input", (word) => {
  generateSeachedTodo(word);
});

// edit settings
let editElement;
let editFlag = false;
let editID = "";

// functions
const addItem = (e) => {
  e.preventDefault();
  let value = todo.value;
  const id = uuidv4();
  if (value && !editFlag) {
    container.classList.add("show-container");
    createListItem(id, value);
    saveTodos(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.textContent = value;
    displayAleart("updated successfully", "success");
    setBackToDefault();
  } else {
    displayAleart("please enter a value", "danger");
  }
};

const displayAleart = (text, action) => {
  aleart.textContent = text;
  aleart.classList.add(`${action}`);

  setTimeout(() => {
    aleart.textContent = "";
    aleart.classList.remove(`${action}`);
  }, 2000);
};

const setBackToDefault = () => {
  editFlag = false;
  editID = "";
  todo.value = "";
};

const deleteItem = (e) => {
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  item.remove();
  // if anything left in the list node,
  // remove show-continer class and clear button
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  setBackToDefault();
  removeTodos(id);
};

const editItem = (e) => {
  const item = e.currentTarget.parentElement.parentElement;
  editElement =
    e.currentTarget.parentElement.previousElementSibling.children[1];
  const id = item.dataset.id;
  editFlag = true;
  editID = id;
  todo.value = editElement.innerText;
};

const clearItems = () => {
  const todoItem = document.querySelectorAll(".todo-item");
  todoItem.forEach((item) => {
    item.remove();
  });
  container.classList.remove("show-container");
  setBackToDefault();
  localStorage.removeItem("list");
};

const searchTodo = (word) => {
  const searchWord = word.target.value;
  let todoItems = getSavedTodos();
  return todoItems.filter((item) => {
    const regex = new RegExp(searchWord, "gi");
    return item.value.match(regex);
  });
};

const generateSeachedTodo = (word) => {
  const searchedArray = searchTodo(word);
  const results = searchedArray
    .map((item) => {
      return `
    <article class="todo-item" data-id="${item.id}">
      <div class="title-wrapper">
        <input type="checkbox" name="checkbox">
        <label for="checkbox" class="title">${item.value}</label>
      </div>
      <div class="btn-container">
        <button class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn">
          <i class="fas fa-backspace"></i>
        </button>
      </div>
    </article>`;
    })
    .join(" ");
  list.innerHTML = results;
};

// local storage
const saveTodos = (id, value) => {
  const todos = { id, value };
  let items = getSavedTodos();
  items.push(todos);
  localStorage.setItem("list", JSON.stringify(items));
};

const editTodos = () => {};

const removeTodos = (id) => {
  let items = getSavedTodos();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
};

const getSavedTodos = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

// setup items
const setupItems = () => {
  let items = getSavedTodos();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

const createListItem = (id, value) => {
  const article = document.createElement("article");
  article.classList.add("todo-item");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  article.setAttributeNode(attr);
  list.appendChild(article);
  article.innerHTML = `
  <div class="title-wrapper">
    <input type="checkbox" name="checkbox">
    <label for="checkbox" class="title">${value}</label>
  </div>
  <div class="btn-container">
    <button class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button class="delete-btn">
      <i class="fas fa-backspace"></i>
    </button>
  </div>`;
  controlItems();
};

const controlItems = () => {
  const deleteBtn = document.querySelectorAll(".delete-btn");
  const editBtn = document.querySelectorAll(".edit-btn");

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteItem(e);
    });
  });
  editBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      editItem(e);
    });
  });
};

controlItems();
