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
  console.log(addContainerInputValue);

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
    setBackToDefault(textInput, submitBtn);
  }
};

const allowDrop = (event) => {
  event.preventDefault();
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
    element.innerHTML = `<p class="title">${textInputValue}</p>
      <div class="btn-container">
        <button type="button" class="editBtn" title="Edit">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button type="button" class="deleteBtn" title="Delete">
          <i class="bi bi-trash deleteIcon"></i>
        </button>
      </div>`;
    const editBtn = element.querySelector(".editBtn");
    editBtn.addEventListener("click", (e) =>
      editItem(e, containerTextInput, containerSubmitBtn)
    );

    // editBtn.addEventListener("click", editItem);
    const deleteBtn = element.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", deleteItem);
    containerGroceryList.appendChild(element);

    setBackToDefault(containerTextInput, containerSubmitBtn);
  } else if (textInputValue !== "" && editFlag) {
    const editElement = containerGroceryList.querySelector(".title");
    editElement.innerHTML = textInputValue;
    setBackToDefault(containerTextInput, containerSubmitBtn);
  }
};

const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const setBackToDefault = (textInput, submitBtn) => {
  textInput.value = "";
  editFlag = false;
  editElement = null;
  submitBtn.innerHTML = `<i class="bi bi-plus"></i>`;
};

// const editItem = (e) => {
//   const element = e.currentTarget.parentElement.parentElement;
//   editElement = element.querySelector(".title");
//   textInput.value = editElement.innerHTML;
//   editFlag = true;
//   submitBtn.innerHTML = `<i class="bi bi-dash-square-dotted"></i>`;
// };
const editItem = (e, containerTextInput, containerSubmitBtn) => {
  const editElement = e.currentTarget.parentElement.previousElementSibling;
  const textInput = containerTextInput;
  const submitBtn = containerSubmitBtn;

  textInput.value = editElement.innerHTML;
  editFlag = true;
  editElement.parentElement.setAttribute(
    "data-edit-id",
    editElement.parentElement.getAttribute("id")
  );
  submitBtn.innerHTML = '<i class="bi bi-dash-square-dotted"></i>';
};

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.getAttribute("id");
  element.classList.add("textDeco");

  setTimeout(() => {
    element.parentNode.removeChild(element);
  }, 800);

  //   if (groceryList.children.length === 0) {
  //     groceryList.parentNode.classList.remove("showGroceryContainer");
  //   }
  setBackToDefault(textInput, submitBtn);
};

// const images = ["image1.jpg", "image2.jpg", "image3.jpg"]; //
// let currentIndex = 0;

// function changeBackground() {
//   document.body.style.backgroundImage = `url(${images[currentIndex]})`;
//   currentIndex = (currentIndex + 1) % images.length;
// }

// setInterval(changeBackground, 5000);

form.addEventListener("submit", (e) =>
  addItem(e, textInput, submitBtn, groceryList)
);
groceryList.addEventListener("drop", drop);
groceryList.addEventListener("dragover", allowDrop);
addContainerForm.addEventListener("submit", addContainer);
