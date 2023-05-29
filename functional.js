const sidebar = document.querySelector(".sidebar");
const sidebarItems = document.querySelector(".sidebar-items");
const sectionsWrapper = document.querySelector(".sections-wrapper");
const addNewSectionBtn = document.querySelector(".add-new-section");
const nameForm = document.querySelector(".name-form");
const sectionName = document.querySelector(".section-name");
let allSidebarItems = document.querySelectorAll(".sidebar-item");
let allSections = document.querySelectorAll("section");

let displayNoteFormBtns = document.querySelectorAll(
  ".display-note-form-button"
);

let addNewNoteForms = document.querySelectorAll(".add-new-note-form");
// Event listeners
sidebar.addEventListener("mouseover", handleSidebarMouseover);
sidebar.addEventListener("mouseleave", handleSidebarMouseleave);
addNewSectionBtn.addEventListener("click", handleAddNewSection);
nameForm.addEventListener("submit", handleFormSubmit);

// Initialize sections array
let sections = getStoredSections();

// Initialize the application
initialize();

// Initialize the application
function initialize() {
  updateHtml();
  attachDeleteListeners();
}

// Event handler for sidebar mouseover
function handleSidebarMouseover() {
  sidebarItems.classList.add("active");
}

// Event handler for sidebar mouseleave
function handleSidebarMouseleave() {
  sidebarItems.classList.remove("active");
}

// Event handler for "Add New Section" button click
function handleAddNewSection() {
  sectionName.classList.toggle("active");
  sectionName.focus();
}

// Event handler for form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const newSectionName = sectionName.value.trim();
  if (newSectionName !== "") {
    sections.push(newSectionName);
    setStoredSections(sections);
    nameForm.reset();
    sectionName.classList.remove("active");
    updateHtml();
    attachDeleteListeners();
    updateNotes()
  }
}

// Get stored sections from local storage
function getStoredSections() {
  const storedSections = localStorage.getItem("sections");
  return storedSections ? storedSections.split(",") : [];
}

// Set sections in local storage
function setStoredSections(sections) {
  if (sections.length === 0) {
    localStorage.removeItem("sections");
  } else {
    localStorage.setItem("sections", sections.join(","));
  }
}

// Update the HTML display of sections
function updateHtml() {
  let sidebarItemsHtml = "";
  let sectionsHtml = "";

  if (sections.length === 0) {
    sidebarItems.innerHTML = "";
    sectionsWrapper.innerHTML = "";
    return;
  }

  sections.forEach((section, i) => {
    const sectionIndex = i + 1;

    sidebarItemsHtml += `
      <div class="sidebar-item-wrapper">
        <i class="fa fa-pencil"></i>
        <h2 class="sidebar-item sidebar-item-${sectionIndex}">${section}</h2>
        <button class="delete-section">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    sectionsHtml += `<section class="section-${sectionIndex}" id=${sectionIndex}>
    <h2 class="section-title">${section}</h2>
    <button class="display-note-form-button">Add New Note</button>
    <form class="add-new-note-form">
      <textarea class="new-note-text" placeholder="Enter The Note"></textarea>
      <button class="add-new-note-button" type="submit">Add note</button>
    </form>
    <ul class="notes-list"></ul>
    </section>`;
  });

  sidebarItems.innerHTML = sidebarItemsHtml;
  sectionsWrapper.innerHTML = sectionsHtml;

  allSidebarItems = document.querySelectorAll(".sidebar-item");
  allSections = document.querySelectorAll("section");
  addSectionChangingFunctional();
  addListenersToDisplayNoteFormButtons();
}

// Attach event listeners to delete buttons
function attachDeleteListeners() {
  const deleteSectionBtns = document.querySelectorAll(".delete-section");
  deleteSectionBtns.forEach((button, i) => {
    button.addEventListener("click", () => {
      const sectionIndex = i + 1;
      button.parentElement.remove();
      sections.splice(i, 1);
      setStoredSections(sections);
      clearLocalStorageForSection(sectionIndex);
      updateHtml(); // Add this line
      attachDeleteListeners();
      updateNotes()
    });
  });
}

// Clear local storage for a section
function clearLocalStorageForSection(sectionIndex) {
  localStorage.removeItem(`section-${sectionIndex}`);
}
// Sections will change after clicking buttons
function removeActiveClass() {
  allSidebarItems.forEach((sidebarItem, i) => {
    sidebarItem.classList.remove("active");
    allSections[i].classList.remove("active");
  });
}
function addSectionChangingFunctional() {
  allSidebarItems.forEach((sidebarItem, i) => {
    sidebarItem.addEventListener("click", () => {
      removeActiveClass();
      sidebarItem.classList.add("active");
      allSections[i].classList.add("active");
    });
  });
}

function addListenersToDisplayNoteFormButtons() {
  let textFields = document.querySelectorAll(".new-note-text");
  displayNoteFormBtns = document.querySelectorAll(".display-note-form-button");
  addNewNoteForms = document.querySelectorAll(".add-new-note-form");
  displayNoteFormBtns.forEach((button, i) => {
    button.addEventListener("click", () => {
      addNewNoteForms[i].classList.toggle("active");
      textFields[i].focus();
    });
  });
  addNoteSavingFunctionality();
}

function addNoteSavingFunctionality() {
  addNewNoteForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let notes;
      let notesList = form.parentElement.querySelector(".notes-list");
      let textField = form.querySelector(".new-note-text");
      if (localStorage.getItem(`section-${form.parentElement.id}`) != null) {
        notes = localStorage
          .getItem(`section-${form.parentElement.id}`)
          .split(",");
      } else {
        notes = [];
      }
      notes.push(textField.value);
      saveNotesToLocalStorage(notes, form.parentElement.id);
      let noteListValue = "";
      if (notes.length > 0) {
        for (let i in notes) {
          noteListValue += `<li>${notes[i].replace(/\n/g, "<br>")}</li>`;
          notesList.innerHTML = noteListValue;
        }
      }
      form.classList.remove("active");
      form.reset();
    });
  });
}

function saveNotesToLocalStorage(notes, sectionIndex) {
  if (notes != "") {
    localStorage.setItem(`section-${sectionIndex}`, notes);
  }
}

function updateNotes() {
  addNewNoteForms.forEach((form) => {
    let notes;
    let notesList = form.parentElement.querySelector(".notes-list");
    let textField = form.querySelector(".new-note-text");
    if (localStorage.getItem(`section-${form.parentElement.id}`) != null) {
      notes = localStorage
        .getItem(`section-${form.parentElement.id}`)
        .split(",");
    } else {
      notes = [];
    }
    if (textField.value.trim() !== "") {
      // Exclude empty notes
      notes.push(textField.value);
    }
    saveNotesToLocalStorage(notes, form.parentElement.id);
    let noteListValue = "";
    if (notes.length > 0) {
      for (let i in notes) {
        noteListValue += `<li>${notes[i]}</li>`;
        notesList.innerHTML = noteListValue;
      }
    }
  });
}

window.addEventListener("load", () => {
  updateNotes()
});
