const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function createBookObject(judul, penulis, tahun, status) {
  return {
    id: Number(+new Date()),
    title: String(judul),
    author: String(penulis),
    year: Number(tahun),
    isComplete: Boolean(status),
  };
}

function findBook(idBook) {
  for (book of books) {
    if (book.id === idBook) return book;
  }
  return null;
}

function findBookIndex(idBook) {
  let index = 0;
  for (book of books) {
    if (book.id === idBook) return index;
    index++;
  }
  return -1;
}
