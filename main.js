// Do your work here...


const inputJudul = document.getElementById("bookFormTitle");
const inputPenulis = document.getElementById("bookFormAuthor");
const inputTahun = document.getElementById("bookFormYear");
const inputSelesai = document.getElementById("bookFormIsComplete");
const tombolSubmit = document.getElementById("bookFormSubmit");
const tombolCari = document.getElementById("searchSubmit");
const inputCari = document.getElementById("searchBookTitle");
const bukuBelumSelesai = document.getElementById("incompleteBookList");
const bukuSelesai = document.getElementById("completeBookList");
const STORAGE_KEY = "buku";
const RENDER_EVENT = "render-book";
// const dataBukuTersimpan = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const dataBuku = [];

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
    const buttonSelesai = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonSelesai.textContent = "Selesai dibaca";
    buttonSelesai.addEventListener("click", function () {
      updateBukuKeSelesai(buku.id);
    }); 


    const buttonHapus = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemDeleteButton");
    buttonHapus.textContent = "Hapus Buku";
    buttonHapus.addEventListener("click", function () {
      hapusBuku(buku.id);
    }); 


    const buttonEdit = document.createElement("button");
    tahun.setAttribute("data-testid", "bookItemEditButton");
    buttonEdit.textContent = "Edit Buku";
    buttonEdit.addEventListener("click", function () {
      // hapusBuku(buku.id);
      alert("Edit")
    }); 

  buttonContainer.append(buttonSelesai, buttonHapus, buttonEdit);

  cardContainer.append(judul, penulis, tahun, buttonContainer);

  return cardContainer;

  // return `
  // <div class="card" data-bookid=${buku.id} data-testid="bookItem">
  //   <h3>${buku.judul}</h3>
  //   <p>${buku.penulis}</p>
  //   <p>${buku.tahun}</p>
  //   <div>
  //     <button class="selesai">Selesai dibaca</button>
  //     <button class="hapus" onclick="hapusBuku(${buku.id})">Hapus buku</button>
  //     <button class="Edit">Edit buku</button>
  //   </div>
  // </div>`
}

tombolSubmit.addEventListener("click", tambahBuku);
tombolCari.addEventListener("click", cariBuku);

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
      // let bukuCreated = [];
      bukuSelesai.innerHTML ="";
      bukuBelumSelesai.innerHTML ="";
      
      for(const buku of dataBuku){
        if(buku.selesai){
          bukuSelesai.append(buatBukuCard(buku));
        }else{
          bukuBelumSelesai.append(buatBukuCard(buku));
        }
        // bukuCreated.push(buku);
      }
      // dataBuku.splice(0,dataBuku.length)
      // dataBuku.push(bukuCreated);
    }
}

// window.addEventListener("beforeunload", (event) => {
//   event.preventDefault();
//   event.returnValue = ""; // Menampilkan dialog konfirmasi di browser
// });
