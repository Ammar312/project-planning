const form = document.querySelector(".form");
const textInput = document.querySelector("#textInput");
const submitBtn = document.querySelector("#submitBtn");
const groceryList = document.querySelector(".groceryList");
const addContainerForm = document.querySelector(".addContainerForm");

let editFlag = false;
let editElement;
let draggedElement;
let draggedContainer;

const addContainer = (e) => {
  e.preventDefault();
  const container = document.querySelector(".container");
  const addContainerInput = document.querySelector("#addContainerInput");
  const addContainerInputValue = addContainerInput.value;

  const newContainer = document.createElement("div");
  newContainer.classList.add("mainContainer");

  const newHeading = document.createElement("div");
  newHeading.classList.add("mainHeading");
  newHeading.innerHTML = `<p>${addContainerInputValue}</p>`;
  const deleteContainer = document.createElement("button");
  deleteContainer.classList.add("delCont");
  deleteContainer.innerHTML = `<i class="bi bi-trash"></i>`;
  newHeading.appendChild(deleteContainer);
  newContainer.appendChild(newHeading);

  const newGroceryContainer = document.createElement("section");
  newGroceryContainer.classList.add("groceryContainer");

  const newGroceryList = document.createElement("div");
  newGroceryList.classList.add("groceryList");
  newGroceryContainer.appendChild(newGroceryList);

  const newInputContainer = document.createElement("section");
  newInputContainer.classList.add("inputContainer");

  const newForm = document.createElement("form");
  newForm.classList.add("form");

  const newInputText = document.createElement("input");
  newInputText.type = "text";
  newInputText.id = "textInput";
  newInputText.classList.add("textInput");
  newInputText.placeholder = "Add Card";
  newInputText.spellcheck = "false";
  newForm.appendChild(newInputText);

  const newSubmitBtn = document.createElement("button");
  newSubmitBtn.type = "text";
  newSubmitBtn.id = "submitBtn";
  newSubmitBtn.classList.add("submitBtn");
  newSubmitBtn.innerHTML = `<i class="bi bi-plus"></i>`;
  newForm.appendChild(newSubmitBtn);

  newInputContainer.appendChild(newForm);
  newGroceryContainer.appendChild(newInputContainer);
  newContainer.appendChild(newGroceryContainer);
  container.appendChild(newContainer);

  const deleteContainerBtn = newContainer.querySelector(".delCont");
  deleteContainerBtn.addEventListener("click", (e) =>
    deleteContainerFunc(e, newContainer)
  );

  bindEventListeners(newGroceryContainer);
  addContainerInput.value = "";
};
const deleteContainerFunc = (e, container) => {
  e.preventDefault();
  container.remove();
};

const bindEventListeners = (container) => {
  const containerForm = container.querySelector(".form");
  const containerTextInput = container.querySelector(".textInput");
  const containerSubmitBtn = container.querySelector(".submitBtn");
  const containerGroceryList = container.querySelector(".groceryList");

  containerForm.addEventListener("submit", (e) => {
    addItem(e, containerTextInput, containerSubmitBtn, containerGroceryList);
  });
  containerGroceryList.addEventListener("drop", drop);
  containerGroceryList.addEventListener("dragover", allowDrop);
};

const drag = (event) => {
  draggedElement = event.target;
  draggedContainer = event.target.closest(".groceryContainer");
  event.dataTransfer.setData("text", event.target.id);
};

const drop = (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const container = event.target.closest(".groceryContainer");
  const droppedElement = document.getElementById(data);

  if (container !== draggedContainer) {
    const textInput = draggedContainer.querySelector(".textInput");
    const submitBtn = draggedContainer.querySelector(".submitBtn");
    const titleElement = droppedElement.querySelector(".title");
    titleElement.textContent =
      draggedElement.querySelector(".title").textContent;
    container.querySelector(".groceryList").appendChild(droppedElement);
  }
};

const allowDrop = (event) => {
  event.preventDefault();
};
const touchStart = (event) => {
  // Store the touched element and its container
  draggedElement = event.target;
  draggedContainer = event.target.closest(".groceryContainer");

  // Add a CSS class to visually indicate the dragging
  draggedElement.classList.add("dragging");
};
const touchEnd = (event) => {
  // Remove the CSS class for dragging
  draggedElement.classList.remove("dragging");

  // Check if the drop target is valid and perform the drop
  const container = event.target.closest(".groceryContainer");
  if (container !== draggedContainer) {
    const textInput = draggedContainer.querySelector(".textInput");
    const submitBtn = draggedContainer.querySelector(".submitBtn");
    container.querySelector(".groceryList").appendChild(draggedElement);
    setBackToDefault(textInput, submitBtn);
  }
};

const addItem = (
  e,
  containerTextInput,
  containerSubmitBtn,
  containerGroceryList
) => {
  e.preventDefault();
  const textInputValue = containerTextInput.value;
  const id = new Date().getTime().toString();
  const attrObject = {
    draggable: "true",
    ondragstart: "drag(event)",
    id: `${id}`,
  };

  if (textInputValue !== "" && !editFlag) {
    const element = document.createElement("article");
    setAttributes(element, attrObject);
    element.classList.add("groceryItems");
    element.innerHTML = `<form><input type="text" class='title' readonly value='${textInputValue}'/></form>
      <div class="btn-container">
        <button type="button" class="editBtn" title="Edit">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button type="button" class="deleteBtn" title="Delete">
          <i class="bi bi-trash deleteIcon"></i>
        </button>
      </div>`;
    element.firstChild.addEventListener("submit", (e) => {
      e.preventDefault();
      //   element.firstChild.firstChild.value = element.firstChild.firstChild.value;
      const eleFirstChildValue = element.firstChild.firstChild.value;
      element.firstChild.firstChild.readOnly = true;
      element.firstChild.firstChild.classList.remove("title1");
      //   console.log(element.firstChild.firstChild.value);
      const key =
        e.target.parentElement.parentElement.parentElement
          .previousElementSibling.firstChild.innerText;

      const id = e.target.parentElement.id;
      console.log(id);
      editLocalStorage(id, eleFirstChildValue, key);
      setBackToDefault(textInput);
    });

    const editBtn = element.querySelector(".editBtn");
    editBtn.addEventListener("click", (e) => editItem(e, containerTextInput));

    const deleteBtn = element.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", deleteItem);
    containerGroceryList.appendChild(element);

    const key =
      e.target.parentElement.parentElement.previousElementSibling.firstChild
        .innerText;
    setBackToDefault(containerTextInput, containerSubmitBtn);
    addToLocalStorage(id, textInputValue, key);
  }
};

const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const setBackToDefault = (textInput) => {
  textInput.value = "";
  editFlag = false;
  editElement = null;
};

const editItem = (e, containerTextInput) => {
  const editElement = e.currentTarget.parentElement.previousElementSibling;
  const firstChild = editElement.firstChild;
  firstChild.classList.add("title1");
  firstChild.readOnly = false;
  const textInput = containerTextInput;
  editFlag = true;
  editElement.parentElement.setAttribute(
    "data-edit-id",
    editElement.parentElement.getAttribute("id")
  );
};

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.getAttribute("id");
  element.classList.add("textDeco");

  setTimeout(() => {
    element.parentNode.removeChild(element);
  }, 800);

  const key =
    e.target.parentElement.parentElement.parentElement.parentElement
      .parentElement.previousElementSibling.firstChild.innerText;

  setBackToDefault(textInput, submitBtn);
  removeFromLocalStorage(id, key);
};

// ******Local Storage******
const addToLocalStorage = (id, value, key) => {
  const grocery = { id, value };
  let items = getLocalStorage(key);
  items.push(grocery);
  localStorage.setItem(key, JSON.stringify(items));
};
const getLocalStorage = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

const removeFromLocalStorage = (id, key) => {
  let items = getLocalStorage(key);
  items = items.filter((item) => {
    return item.id !== id;
  });
  localStorage.setItem(key, JSON.stringify(items));
};

const editLocalStorage = (id, value, key) => {
  let items = getLocalStorage(key);
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem(key, JSON.stringify(items));
};

const createListItems = (containerGroceryList, id, value) => {
  const element = document.createElement("article");
  //   setAttributes(element, attrObject);
  setAttributes(element, {
    draggable: "true",
    ondragstart: "drag(event)",
    id: id,
  });
  element.classList.add("groceryItems");
  element.innerHTML = `<form><input type="text" class='title' readonly value='${value}'/></form>
        <div class="btn-container">
          <button type="button" class="editBtn" title="Edit">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" class="deleteBtn" title="Delete">
            <i class="bi bi-trash deleteIcon"></i>
          </button>
        </div>`;
  element.firstChild.addEventListener("submit", (e) => {
    e.preventDefault();
    const eleFirstChildValue = element.firstChild.firstChild.value;
    element.firstChild.firstChild.readOnly = true;
    element.firstChild.firstChild.classList.remove("title1");
    const key =
      e.target.parentElement.parentElement.parentElement.previousElementSibling
        .firstChild.innerText;

    const id = e.target.parentElement.id;
    console.log(id);
    editLocalStorage(id, eleFirstChildValue, key);
    setBackToDefault(textInput);
  });

  const editBtn = element.querySelector(".editBtn");
  editBtn.addEventListener("click", (e) => editItem(e, containerTextInput));

  const deleteBtn = element.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", deleteItem);
  containerGroceryList.appendChild(element);
};
const setUpItems = () => {
  let containerElements = document.querySelectorAll(".mainContainer");
  containerElements.forEach((container) => {
    const groceryList = container.querySelector(".groceryList");
    const containerHeading = container.querySelector(".mainHeading p");
    const containerKey = containerHeading.textContent.trim();
    console.log(containerKey);

    let items = getLocalStorage(containerKey);
    if (items.length > 0) {
      items.forEach((item) => {
        createListItems(groceryList, item.id, item.value);
      });
    }

    bindEventListeners(container);
  });
};

// ***Event listeners***
form.addEventListener("submit", (e) =>
  addItem(e, textInput, submitBtn, groceryList)
);
groceryList.addEventListener("drop", drop);
groceryList.addEventListener("dragover", allowDrop);
addContainerForm.addEventListener("submit", addContainer);
window.addEventListener("DOMContentLoaded", setUpItems);
