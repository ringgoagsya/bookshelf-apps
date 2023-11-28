document.addEventListener('DOMContentLoaded', function () {

    const inputBook = document.getElementById('inputBook');
    const searchBook = document.getElementById('searchBook');
    const editBook = document.getElementById('editBook');

    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahbuku();
    });

    searchBook.addEventListener('submit', function (event) {
        event.preventDefault();
        caribuku();
    });
    
    editBook.addEventListener('submit', function (event) {
        event.preventDefault();
        editbuku();
    });

    document.querySelector('.btn-cancel').addEventListener('click', function(event){
        event.preventDefault();
        document.querySelector('#modal-edit').style.display = 'none';
        document.body.classList.toggle('overflow');
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromBooks();
});