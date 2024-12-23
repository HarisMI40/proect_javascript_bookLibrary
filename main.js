// Do your work here...


const inputJudul = document.getElementById("bookFormTitle");
const inputPenulis = document.getElementById("bookFormAuthor");
const inputTahun = document.getElementById("bookFormYear");
const inputSelesai = document.getElementById("bookFormIsComplete");
const tombolSubmit = document.getElementById("bookFormSubmit");
const formTambahBuku = document.getElementById("bookForm");


const tombolCari = document.getElementById("searchSubmit");
const inputCari = document.getElementById("searchBookTitle");
const bukuBelumSelesai = document.getElementById("incompleteBookList");
const bukuSelesai = document.getElementById("completeBookList");
const STORAGE_KEY = "buku";
const RENDER_EVENT = "render-book";
const dataBuku = [];

//* MODAL BOX
const overlay = document.getElementById("overlay");
const inputEditJudul = document.getElementById("editBookFormTitle");
const inputEditPenulis = document.getElementById("editBookFormAuthor");
const inputEditTahun = document.getElementById("editBookFormYear");
const tombolEditSubmit = document.getElementById("editBookFormSubmit");
const cancelBookFormSubmit = document.getElementById("cancelBookFormSubmit");
const formEdit = document.getElementById("editBookForm");
let idBukuEdit = "";

document.addEventListener("DOMContentLoaded", () => {
  if(isStorageExist()){
    loadDataFromStorage();
  }
})

function loadDataFromStorage() {
  const dataBukuTersimpan = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if(dataBukuTersimpan !== null){
    for(const buku of dataBukuTersimpan){
      dataBuku.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  main();
});

function tambahBuku(e) {
  e.preventDefault();

  const judul = inputJudul.value;
  const penulis = inputPenulis.value;
  const tahun = inputTahun.value;
  const selesai = inputSelesai.checked;

  const buku = {
    id: Date.now(),
    judul,
    penulis,
    tahun,
    selesai,
  };

  dataBuku.push(buku);
  saveData(dataBuku);


  document.dispatchEvent(new Event(RENDER_EVENT));

  resetInputForm();
}


function resetInputForm(){
  inputJudul.value = "";
  inputPenulis.value = "";
  inputTahun.value = "";
  inputSelesai.checked = false;
}

function hapusBuku(id){
  const bukuIndex = dataBuku.findIndex((buku) => buku.id === id);

  dataBuku.splice(bukuIndex, 1);

  saveData(dataBuku);
  document.dispatchEvent(new Event(RENDER_EVENT))
}

function updateBukuKeSelesai(id){
  const bukuIndex = dataBuku.findIndex((buku) => buku.id === id);

  dataBuku[bukuIndex].selesai = true;

  saveData(dataBuku);
  document.dispatchEvent(new Event(RENDER_EVENT))
}

function saveData(buku){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buku));
}

function buatBukuCard (buku) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.setAttribute("data-bookid", buku.id);
  cardContainer.setAttribute("data-testid", "bookItem");

  const judul = document.createElement("h3");
  judul.setAttribute("data-testid", "bookItemTitle");
  judul.textContent = buku.judul;

  const penulis = document.createElement("p");
  penulis.setAttribute("data-testid", "bookItemAuthor");
  penulis.textContent = `Penulis: ${buku.penulis}`;

  const tahun = document.createElement("p");
  tahun.setAttribute("data-testid", "bookItemYear");
  tahun.textContent = `Tahun: ${buku.tahun}`;

  const buttonContainer = document.createElement("div");


  if(buku.selesai == false){
    const buttonSelesai = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonSelesai.textContent = "Selesai dibaca";
    buttonSelesai.style.background = "green";
    buttonSelesai.addEventListener("click", function () {
      updateBukuKeSelesai(buku.id);
    }); 

    buttonContainer.append(buttonSelesai);
}


    const buttonHapus = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemDeleteButton");
    buttonHapus.textContent = "Hapus Buku";
    buttonHapus.style.background = "red";
    buttonHapus.addEventListener("click", function () {
      hapusBuku(buku.id);
    }); 


    const buttonEdit = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemEditButton");
    buttonEdit.textContent = "Edit Buku";
    buttonEdit.style.background = "orange";
    buttonEdit.addEventListener("click", function () {
      showModal(buku);
    }); 

  buttonContainer.append(buttonHapus, buttonEdit);

  cardContainer.append(judul, penulis, tahun, buttonContainer);

  return cardContainer;
}

formTambahBuku.addEventListener("submit", tambahBuku);
tombolCari.addEventListener("click", cariBuku);

formEdit.addEventListener("submit", editBuku)
cancelBookFormSubmit.addEventListener("click", cancelModal);

function showModal(buku){
  overlay.style.display = "flex";
  inputEditJudul.value = buku.judul;
  inputEditPenulis.value = buku.penulis;
  inputEditTahun.value = buku.tahun;

  idBukuEdit = buku.id;
}

function cancelModal(){
  overlay.style.display = "none";
  inputEditJudul.value = "";
  inputEditPenulis.value = "";
  inputEditTahun.value = "";
}

function editBuku(e){
  e.preventDefault();

  const bukuIndex = dataBuku.findIndex((buku) => buku.id === idBukuEdit);

  dataBuku[bukuIndex].judul = inputEditJudul.value;
  dataBuku[bukuIndex].penulis = inputEditPenulis.value;
  dataBuku[bukuIndex].tahun = inputEditTahun.value;

  saveData(dataBuku);
  document.dispatchEvent(new Event(RENDER_EVENT));
  cancelModal();
}


function cariBuku(e){
  e.preventDefault();

  const dataBukuTersimpan = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const judulCari = inputCari.value;
  let bukuCari = "";

  if(judulCari !== ""){
    bukuCari = dataBukuTersimpan.filter((buku) => buku.judul.toLowerCase().includes(judulCari.toLowerCase()));
  }else{
    bukuCari = dataBukuTersimpan;
  }

  dataBuku.splice(0,dataBuku.length);
  
  for(const buku of bukuCari){
    dataBuku.push(buku);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if(typeof (Storage) === undefined){
    alert("browser kamu tidak mendukung local storage");
    return false;
  }

  return true;
}

function main(){
    if(dataBuku.length > 0){
      bukuSelesai.innerHTML ="";
      bukuBelumSelesai.innerHTML ="";
      
      for(const buku of dataBuku){
        if(buku.selesai){
          bukuSelesai.append(buatBukuCard(buku));
        }else{
          bukuBelumSelesai.append(buatBukuCard(buku));
        }
      }
    }
}

// window.addEventListener("beforeunload", (event) => {
//   event.preventDefault();
//   event.returnValue = ""; // Menampilkan dialog konfirmasi di browser
// });
