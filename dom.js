const sudahbacaMark = "rakSudahbaca";
const belumbacaMark = "rakBelumbaca";
const itembukuID = "itemID";
const belumbacaCount_ID = "belumbaca_Count";
const sudahbacaCount_ID = "sudahbaca_Count";
let BELUMBACA_COUNT = 0;
let SUDAHBACA_COUNT = 0;

function tambahbuku() {
  const judul = document.getElementById("inputJudul").value;
  const penulis = document.getElementById("inputPenulis").value;
  const tahun = document.getElementById("inputTahun").value;
  const status = document.getElementById("inputSudahbaca").checked;

  if (judul == "" || penulis == "" || tahun == "") {
    alert("Form Tidak Boleh Kosong");
    return;
  }

  document.getElementById("inputJudul").value = "";
  document.getElementById("inputPenulis").value = "";
  document.getElementById("inputTahun").value = "";
  document.getElementById("inputSudahbaca").checked = false;

  const book = makeBook(judul, penulis, tahun, status);
  const bookObject = createBookObject(judul, penulis, tahun, status);

  book[itembukuID] = bookObject.id;
  books.push(bookObject);

  let listID;
  if (status) {
    listID = sudahbacaMark;
    SUDAHBACA_COUNT++;
  } else {
    listID = belumbacaMark;
    BELUMBACA_COUNT++;
  }

  const listBook = document.getElementById(listID);

  listBook.append(book);
  updateCount();
  updateDataToStorage();
  showStatusRak();
}

function makeBook(judul, penulis, tahun, status) {
  const judulbaru = document.createElement("h4");
  judulbaru.innerHTML =
    "Judul: <span class='judul' id='judul'>" + judul + "</span>";
  const penulisbaru = document.createElement("p");
  penulisbaru.innerHTML =
    "Penulis: <span class='penulis' id='penulis'>" + penulis + "</span>";

  const tahunbaru = document.createElement("p");
  tahunbaru.innerHTML =
    "Tahun: <span class='tahun' id='tahun'>" + tahun + "</span>";

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-wrapper");

  if (!status)
    btnContainer.append(
      createCheckButton(),
      createEditButton(),
      createTrashButton()
    );
  else
    btnContainer.append(
      createUndoButton(),
      createEditButton(),
      createTrashButton()
    );

  const container = document.createElement("div");
  container.classList.add("item");

  container.append(judulbaru, penulisbaru, tahunbaru, btnContainer);
  return container;
}

function createButton(iconButton, textButton, eventListener) {
  const button = document.createElement("button");
  button.classList.add("btn-action");

  const icon = document.createElement("i");
  icon.classList.add("fas", iconButton);

  button.innerHTML = icon.outerHTML + " " + textButton;

  button.addEventListener("click", function (event) {
    eventListener(event);
  });

  return button;
}

function createCheckButton() {
  return createButton("fa-check-circle", "Selesai baca", function (event) {
    addBookToCompleted(event.target.parentElement.parentElement);
  });
}

function createEditButton() {
  return createButton("fa-edit", "Edit buku", function (event) {
    showEditModal(event.target.parentElement.parentElement);
  });
}

function createTrashButton() {
  return createButton("fa-trash", "Hapus buku", function (event) {
    removeBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function createUndoButton() {
  return createButton("fa-sync-alt", "Baca ulang", function (event) {
    undoBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function addBookToCompleted(bookItem) {
  const judul = bookItem.querySelector(".judul").innerText;
  const penulis = bookItem.querySelector(".penulis").innerText;
  const tahun = bookItem.querySelector(".tahun").innerText;

  const newBook = makeBook(judul, penulis, tahun, true);

  const book = findBook(bookItem[itembukuID]);
  book.isComplete = true;
  newBook[itembukuID] = book.id;

  const listSudahBaca = document.getElementById(sudahbacaMark);
  listSudahBaca.append(newBook);
  bookItem.remove();

  SUDAHBACA_COUNT++;
  BELUMBACA_COUNT--;
  updateCount();
  updateDataToStorage();
  showStatusRak();
}

function showEditModal(bookItem) {
  const book = findBook(bookItem[itembukuID]);
  const modalEdit = document.getElementById("modal-edit");
  document.body.classList.toggle("overflow");

  document.getElementById("edit-id").value = bookItem[itembukuID];
  document.getElementById("edit-judul").value = book.title;
  document.getElementById("edit-penulis").value = book.author;
  document.getElementById("edit-tahun").value = book.year;

  modalEdit.style.display = "block";
}

function editbuku() {
  const modalEdit = document.getElementById("modal-edit");

  const idBook = document.getElementById("edit-id").value;
  const judul = document.getElementById("edit-judul").value;
  const penulis = document.getElementById("edit-penulis").value;
  const tahun = document.getElementById("edit-tahun").value;

  const bookPosition = findBookIndex(parseInt(idBook));

  books[bookPosition].title = judul;
  books[bookPosition].author = penulis;
  books[bookPosition].year = tahun;

  refreshDataFromBooks();
  modalEdit.style.display = "none";
  document.body.classList.toggle("overflow");

  updateDataToStorage();
}

function removeBookFromCompleted(bookItem) {
  let statusHapus = confirm("Apa kamu yakin ingin menghapus buku ini?");

  if (!statusHapus) return;

  const bookPosition = findBookIndex(bookItem[itembukuID]);
  const bookStatus = books[bookPosition].isComplete;

  if (bookStatus) {
    SUDAHBACA_COUNT--;
  } else {
    BELUMBACA_COUNT--;
  }

  books.splice(bookPosition, 1);
  bookItem.remove();

  updateCount();
  updateDataToStorage();
  showStatusRak();
}

function undoBookFromCompleted(bookItem) {
  const judul = bookItem.querySelector(".judul").innerText;
  const penulis = bookItem.querySelector(".penulis").innerText;
  const tahun = bookItem.querySelector(".tahun").innerText;

  const newBook = makeBook(judul, penulis, tahun, false);

  const book = findBook(bookItem[itembukuID]);
  book.isComplete = false;
  newBook[itembukuID] = book.id;

  const listBelumBaca = document.getElementById(belumbacaMark);
  listBelumBaca.append(newBook);
  bookItem.remove();
  SUDAHBACA_COUNT--;
  BELUMBACA_COUNT++;
  updateCount();
  updateDataToStorage();
  showStatusRak();
}

function updateCount() {
  document.getElementById(belumbacaCount_ID).innerText = BELUMBACA_COUNT;
  document.getElementById(sudahbacaCount_ID).innerText = SUDAHBACA_COUNT;
}

function showStatusRak() {
  const statusRakBelumBaca = document.querySelector(".rakBelumbaca");
  const statusRakSudahBaca = document.querySelector(".rakSudahbaca");

  if (BELUMBACA_COUNT == 0 && statusRakBelumBaca == null) {
    const statusBelumBaca = document.createElement("h4");
    statusBelumBaca.classList.add("rakBelumbaca", "text-center");
    statusBelumBaca.innerText = "Tidak ada buku yang belum dibaca";
    document.getElementById(belumbacaMark).append(statusBelumBaca);
  }

  if (BELUMBACA_COUNT > 0 && statusRakBelumBaca != null) {
    statusRakBelumBaca.remove();
  }

  if (SUDAHBACA_COUNT == 0 && statusRakSudahBaca == null) {
    const statusSudahBaca = document.createElement("h4");
    statusSudahBaca.classList.add("rakSudahbaca", "text-center");
    statusSudahBaca.innerText = "Tidak ada buku yang sudah dibaca";
    document.getElementById(sudahbacaMark).append(statusSudahBaca);
  }

  if (SUDAHBACA_COUNT > 0 && statusRakSudahBaca != null) {
    statusRakSudahBaca.remove();
  }
}

function refreshDataFromBooks() {
  const listBelumBaca = document.getElementById(belumbacaMark);
  const listSudahBaca = document.getElementById(sudahbacaMark);
  //   const listBelumBaca = document.querySelector(".rakBelumbaca");
  //   const listSudahBaca = document.querySelector(".rakSudahbaca");
  listBelumBaca.innerHTML = "";
  listSudahBaca.innerHTML = "";

  SUDAHBACA_COUNT = 0;
  BELUMBACA_COUNT = 0;

  for (book of books) {
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    newBook[itembukuID] = book.id;

    if (book.isComplete) {
      SUDAHBACA_COUNT++;
      listSudahBaca.append(newBook);
    } else {
      BELUMBACA_COUNT++;
      listBelumBaca.append(newBook);
    }
  }
  updateCount();
  showStatusRak();
}

function caribuku() {
  const keyword = document.getElementById("input-search").value.toLowerCase();
  const listBelumBaca = document.getElementById(belumbacaMark);
  let listSudahBaca = document.getElementById(sudahbacaMark);

  listBelumBaca.innerHTML = "";
  listSudahBaca.innerHTML = "";

  if (keyword == "") {
    refreshDataFromBooks();
    return;
  }

  SUDAHBACA_COUNT = 0;
  BELUMBACA_COUNT = 0;

  for (book of books) {
    [];
    if (book.title.toLowerCase().includes(keyword)) {
      const newBook = makeBook(
        book.title,
        book.author,
        book.year,
        book.isComplete
      );
      newBook[itembukuID] = book.id;

      if (book.isComplete) {
        SUDAHBACA_COUNT++;
        listSudahBaca.append(newBook);
      } else {
        BELUMBACA_COUNT++;
        listBelumBaca.append(newBook);
      }
    }
  }
  updateCount();
  showStatusRak();
}
