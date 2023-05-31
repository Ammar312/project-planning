const form = document.querySelector(".form");
const textInput = document.querySelector("#textInput");
const submitBtn = document.querySelector("#submitBtn");
const groceryContainers = document.querySelectorAll(".groceryContainer");
const groceryList = document.querySelector(".groceryList");
const addContainerBtn = document.querySelector("#addContainerBtn");

let editFlag = false;
let editId = "";
let editElement;
// ******Functions******
const addContainer = () => {
  const container = document.querySelector(".container");

  const newContainer = document.createElement("div");
  newContainer.classList.add("mainContainer");

  const newHeading = document.createElement("div");
  newHeading.classList.add("mainHeading");
  newHeading.innerHTML = "<p>Todo</p>";
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

  // groceryContainers[groceryContainers.length - 1].after(newGroceryContainer);
  bindEventListeners(newGroceryContainer);
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
  console.log(event);
  const dat = event.target.id;
  console.log(dat);
  event.dataTransfer.setData("text", dat);
};

const drop = (event) => {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");
  console.log(data);
  event.target.appendChild(document.getElementById(data));
};

const allowDrop = (event) => {
  event.preventDefault();
};
// const addItem = (
//   e,
//   containerTextInput,
//   containerSubmitBtn,
//   containerGroceryList
// ) => {
//   e.preventDefault();
//   const textInputValue = textInput.value;
//   const id = new Date().getTime().toString();
//   const attrObject = {
//     draggable: "true",
//     ondragstart: "drag(event)",
//     id: `${id}`,
//   };
//   const setMultipleAttr = (element, obj) => {
//     Object.keys(obj).forEach((attribute) => {
//       element.setAttribute(attribute, obj[attribute]);
//     });
//   };

//   if (textInputValue !== "" && editFlag === false) {
//     const element = document.createElement("article");
//     setMultipleAttr(element, attrObject);
//     element.classList.add("groceryItems");
//     element.innerHTML = `<p class="title">${textInputValue}</p>
//     <div class="btn-container">
//       <!-- edit btn -->
//       <button type="button" class="editBtn" title="Edit ">
//       <i class="bi bi-pencil-fill"></i>
//       </button>
//       <!-- delete btn -->
//       <button type="button" class="deleteBtn" title="Delete ">
//       <i class="bi bi-trash deleteIcon"></i>
//       </button>
//     </div>`;
//     const editBtn = element.querySelector(".editBtn");
//     editBtn.addEventListener("click", editItem);
//     const deleteBtn = element.querySelector(".deleteBtn");
//     deleteBtn.addEventListener("click", deleteItem);
//     groceryList.appendChild(element);

//     setBackToDefault();
//   } else if (textInputValue !== "" && editFlag === true) {
//     editElement.innerHTML = textInputValue;
//     setBackToDefault();
//   }
// };

const addItem = (
  e,
  containerTextInput,
  containerSubmitBtn,
  containerGroceryList
) => {
  e.preventDefault();
  const textInputValue = containerTextInput.value; // Update variable name
  const id = new Date().getTime().toString();
  const attrObject = {
    draggable: "true",
    ondragstart: "drag(event)",
    id: `${id}`,
  };
  const setMultipleAttr = (element, obj) => {
    Object.keys(obj).forEach((attribute) => {
      element.setAttribute(attribute, obj[attribute]);
    });
  };

  if (textInputValue !== "" && editFlag === false) {
    const element = document.createElement("article");
    setMultipleAttr(element, attrObject);
    element.classList.add("groceryItems");
    element.innerHTML = `<p class="title">${textInputValue}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="editBtn" title="Edit ">
      <i class="bi bi-pencil-fill"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="deleteBtn" title="Delete ">
      <i class="bi bi-trash deleteIcon"></i>
      </button>
    </div>`;
    const editBtn = element.querySelector(".editBtn");
    editBtn.addEventListener("click", editItem);
    const deleteBtn = element.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", deleteItem);
    containerGroceryList.appendChild(element); // Update variable name

    setBackToDefault(containerTextInput, containerSubmitBtn); // Add arguments
  } else if (textInputValue !== "" && editFlag === true) {
    editElement.innerHTML = textInputValue;
    setBackToDefault(containerTextInput, containerSubmitBtn); // Add arguments
  }
};

const setBackToDefault = (textInput, submitBtn) => {
  textInput.value = "";
  editFlag = false;
  editId = "";
  submitBtn.innerHTML = `<i class="bi bi-plus"></i>`;
};

const editItem = (e) => {
  const ele1 = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  textInput.value = editElement.innerHTML;
  editFlag = true;
  editId = ele1.getAttribute("id");
  submitBtn.innerHTML = `<i class="bi bi-dash-square-dotted"></i>`;
  console.log(editId);
};
const deleteItem = (e) => {
  const ele2 = e.currentTarget.parentElement.parentElement;
  const ele3 = e.currentTarget.parentElement.parentElement.firstChild;
  ele3.classList.add("textDeco");
  console.log(ele3);
  const id = ele2.getAttribute("id");
  setTimeout(() => {
    // groceryList.removeChild(ele2);
    ele2.parentNode.removeChild(ele2);
  }, 800);
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("showGroceryContainer");
  }
  console.log(id);
  setBackToDefault();
};

/* -----Event Listeners-----*/
form.addEventListener("submit", addItem);
groceryList.addEventListener("drop", drop);
groceryList.addEventListener("dragover", allowDrop);
addContainerBtn.addEventListener("click", addContainer);
